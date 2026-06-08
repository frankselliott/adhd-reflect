function generateToken() {
  const arr = new Uint8Array(32);
  crypto.getRandomValues(arr);
  return Array.from(arr).map(b => b.toString(16).padStart(2,'0')).join('');
}

export async function onRequestPost({ request, env }) {
  const headers = { 'Content-Type': 'application/json' };
  try {
    const { code, pattern = '' } = await request.json();
    if (!code || !env.GROW_DATA) {
      return new Response(JSON.stringify({ error: 'Invalid request' }), { status: 400, headers });
    }

    const codeKey = 'discount:' + code.toUpperCase().trim();
    const raw = await env.GROW_DATA.get(codeKey);
    if (!raw) {
      return new Response(JSON.stringify({ error: 'That code doesn\'t exist. Check the spelling and try again.' }), { status: 400, headers });
    }

    const codeData = JSON.parse(raw);

    if (!codeData.active) {
      return new Response(JSON.stringify({ error: 'That code is no longer active.' }), { status: 400, headers });
    }
    if (codeData.type !== 'free') {
      return new Response(JSON.stringify({ error: 'That code isn\'t a free access code.' }), { status: 400, headers });
    }
    if (codeData.expiresAt && new Date(codeData.expiresAt) < new Date()) {
      return new Response(JSON.stringify({ error: 'That code has expired.' }), { status: 400, headers });
    }
    if (codeData.maxUses !== null && codeData.usedCount >= codeData.maxUses) {
      return new Response(JSON.stringify({ error: 'That code has reached its usage limit.' }), { status: 400, headers });
    }

    // Increment usage
    codeData.usedCount = (codeData.usedCount || 0) + 1;
    await env.GROW_DATA.put(codeKey, JSON.stringify(codeData));

    // Calculate access expiry if time-limited
    const accessDays = codeData.accessDays || null;
    const accessExpiresAt = accessDays
      ? new Date(Date.now() + accessDays * 24 * 60 * 60 * 1000).toISOString()
      : null;

    // Set KV TTL based on access duration
    const kvTtl = accessDays
      ? accessDays * 24 * 60 * 60
      : 60 * 60 * 24 * 365 * 2;

    const token = generateToken();
    const userData = {
      email: 'free-access-' + token.substring(0, 8) + '@adhdreflect.com',
      pattern,
      token,
      purchasedAt: new Date().toISOString(),
      source: 'free-code:' + code,
      accessExpiresAt,
      accessDays,
      progress: {},
      reflections: {},
      midCourseCheckin: null,
    };

    await env.GROW_DATA.put('token:' + token, JSON.stringify(userData), {
      expirationTtl: kvTtl,
    });

    const accessUrl = 'https://adhdreflect.com/grow/access?token=' + token;
    return new Response(JSON.stringify({
      success: true,
      accessUrl,
      accessDays,
      accessExpiresAt,
    }), { headers });

  } catch(e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers });
  }
}