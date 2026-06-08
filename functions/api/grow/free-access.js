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
      return new Response(JSON.stringify({ error: 'Invalid code' }), { status: 400, headers });
    }
    const codeData = JSON.parse(raw);
    if (!codeData.active || codeData.type !== 'free') {
      return new Response(JSON.stringify({ error: 'Code not valid for free access' }), { status: 400, headers });
    }

    const token = generateToken();
    const userData = {
      email: 'free-access-' + token.substring(0, 8) + '@adhdreflect.com',
      pattern,
      token,
      purchasedAt: new Date().toISOString(),
      source: 'free-code:' + code,
      progress: {},
      reflections: {},
      midCourseCheckin: null,
    };

    await env.GROW_DATA.put('token:' + token, JSON.stringify(userData), {
      expirationTtl: 60 * 60 * 24 * 365 * 2,
    });

    const accessUrl = '/grow/access?token=' + token;
    return new Response(JSON.stringify({ success: true, accessUrl }), { headers });
  } catch(e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers });
  }
}