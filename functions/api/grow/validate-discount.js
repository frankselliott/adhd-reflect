export async function onRequestPost({ env, request }) {
  const headers = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };
  try {
    const { code } = await request.json();
    if (!code || !env.GROW_DATA) {
      return new Response(JSON.stringify({ valid: false, error: 'Invalid request' }), { status: 400, headers });
    }
    const raw = await env.GROW_DATA.get('discount:' + code.toUpperCase().trim());
    if (!raw) {
      return new Response(JSON.stringify({ valid: false, error: 'Code not found' }), { headers });
    }
    const data = JSON.parse(raw);
    if (!data.active) {
      return new Response(JSON.stringify({ valid: false, error: 'Code is no longer active' }), { headers });
    }
    if (data.expiresAt && new Date(data.expiresAt) < new Date()) {
      return new Response(JSON.stringify({ valid: false, error: 'Code has expired' }), { headers });
    }
    if (data.maxUses !== null && data.usedCount >= data.maxUses) {
      return new Response(JSON.stringify({ valid: false, error: 'Code has reached its usage limit' }), { headers });
    }
    return new Response(JSON.stringify({
      valid: true,
      type: data.type,
      value: data.value,
      description: data.type === 'free' ? 'Free access' : `${data.value}% off`,
    }), { headers });
  } catch(e) {
    return new Response(JSON.stringify({ valid: false, error: e.message }), { status: 500, headers });
  }
}

export async function onRequestOptions() {
  return new Response(null, { headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }});
}