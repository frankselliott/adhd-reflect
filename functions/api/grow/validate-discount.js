// Rate limit, same KV counter pattern as subscribe.js, keyed on the client IP.
// Fails open on any KV error so a hiccup never blocks a legitimate check.
const RL_TTL = 60 * 60;
const RL_MAX = 20; // per IP per hour

async function isRateLimited(env, ip) {
  if (!env.SEARCH_LOGS) return false;
  try {
    const key = 'rl:discount:' + ip;
    const cur = parseInt((await env.SEARCH_LOGS.get(key)) || '0', 10) || 0;
    await env.SEARCH_LOGS.put(key, String(cur + 1), { expirationTtl: RL_TTL });
    return cur + 1 > RL_MAX;
  } catch (e) {
    console.error('validate-discount rate limit failed, allowing', e && e.message);
    return false;
  }
}

// Every rejection returns this identical shape, so the endpoint reveals only
// valid/invalid, never why (not-found vs expired vs maxed), and cannot be used
// to enumerate which codes exist.
const INVALID = { valid: false, type: null, value: null, description: null };

export async function onRequestPost({ env, request }) {
  const headers = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };
  try {
    const { code } = await request.json();
    if (!code || !env.GROW_DATA) {
      return new Response(JSON.stringify(INVALID), { status: 400, headers });
    }

    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    if (await isRateLimited(env, ip)) {
      return new Response(JSON.stringify({ ...INVALID, reason: 'rate_limited' }), { status: 429, headers });
    }

    // Exactly one KV read on every path (valid and invalid), so the two take
    // comparable time and do not leak validity through a timing side channel.
    const raw = await env.GROW_DATA.get('discount:' + code.toUpperCase().trim());
    if (!raw) return new Response(JSON.stringify(INVALID), { headers });

    let data;
    try { data = JSON.parse(raw); } catch (e) { return new Response(JSON.stringify(INVALID), { headers }); }

    const expired = data.expiresAt && new Date(data.expiresAt) < new Date();
    const maxed = data.maxUses !== null && data.usedCount >= data.maxUses;
    if (!data.active || expired || maxed) {
      return new Response(JSON.stringify(INVALID), { headers });
    }

    return new Response(JSON.stringify({
      valid: true,
      type: data.type,
      value: data.value,
      description: data.type === 'free' ? 'Free access' : `${data.value}% off`,
    }), { headers });
  } catch (e) {
    console.error('validate-discount error', e && e.message);
    return new Response(JSON.stringify(INVALID), { status: 500, headers });
  }
}

export async function onRequestOptions() {
  return new Response(null, { headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }});
}
