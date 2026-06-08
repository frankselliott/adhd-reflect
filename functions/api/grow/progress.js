export async function onRequestPost({ request, env }) {
  const headers = { 'Content-Type': 'application/json' };
  try {
    const cookie = request.headers.get('cookie') || '';
    const tokenMatch = cookie.match(/grow_token=([a-f0-9]{64})/);
    const token = tokenMatch ? tokenMatch[1] : null;
    if (!token || !env.GROW_DATA) {
      return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401, headers });
    }
    const raw = await env.GROW_DATA.get('token:' + token);
    if (!raw) {
      return new Response(JSON.stringify({ error: 'Token invalid' }), { status: 401, headers });
    }
    const userData = JSON.parse(raw);
    const body = await request.json();
    const { moduleId, reflection, midCourseCheckin, experimentData, ifthenData } = body;

    if (moduleId) {
      userData.progress[moduleId] = { completedAt: new Date().toISOString() };
      if (reflection) userData.reflections[moduleId] = reflection;
      // Save experiment and if-then data per module
      if (experimentData) {
        if (!userData.experiments) userData.experiments = {};
        userData.experiments[moduleId] = experimentData;
      }
      if (ifthenData) {
        if (!userData.ifthens) userData.ifthens = {};
        userData.ifthens[moduleId] = ifthenData;
      }
    }
    if (midCourseCheckin) userData.midCourseCheckin = midCourseCheckin;

    await env.GROW_DATA.put('token:' + token, JSON.stringify(userData), {
      expirationTtl: 60 * 60 * 24 * 365 * 2,
    });

    return new Response(JSON.stringify({
      success: true,
      completedCount: Object.keys(userData.progress).length,
      progress: userData.progress,
    }), { status: 200, headers });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers });
  }
}

export async function onRequestGet({ request, env }) {
  const headers = { 'Content-Type': 'application/json' };
  try {
    const cookie = request.headers.get('cookie') || '';
    const tokenMatch = cookie.match(/grow_token=([a-f0-9]{64})/);
    const token = tokenMatch ? tokenMatch[1] : null;
    if (!token || !env.GROW_DATA) {
      return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401, headers });
    }
    const raw = await env.GROW_DATA.get('token:' + token);
    if (!raw) {
      return new Response(JSON.stringify({ error: 'Token invalid' }), { status: 401, headers });
    }
    const userData = JSON.parse(raw);
    return new Response(JSON.stringify({
      pattern: userData.pattern,
      progress: userData.progress || {},
      reflections: userData.reflections || {},
      experiments: userData.experiments || {},
      ifthens: userData.ifthens || {},
      midCourseCheckin: userData.midCourseCheckin,
      completedCount: Object.keys(userData.progress || {}).length,
    }), { status: 200, headers });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers });
  }
}