// ADHD Reflect — Subscribe endpoint
export async function onRequestPost({ request, env }) {
  const headers = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };
  try {
    const body = await request.json();
    const { email, pattern } = body;
    if (!email || !pattern) {
      return new Response(JSON.stringify({ error: 'Email and pattern required' }), { status: 400, headers });
    }
    const apiKey = env.SENDER_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Email service not configured' }), { status: 500, headers });
    }
    const senderHeaders = { 'Authorization': 'Bearer ' + apiKey, 'Content-Type': 'application/json', 'Accept': 'application/json' };
    const groupsRes = await fetch('https://api.sender.net/v2/groups', { headers: senderHeaders });
    const groupsData = await groupsRes.json();
    const groups = groupsData.data || [];
    const patternGroup = groups.find(g => g.title.toLowerCase() === pattern.toLowerCase());
    if (!patternGroup) {
      return new Response(JSON.stringify({ error: 'Pattern group not found: ' + pattern }), { status: 404, headers });
    }
    await fetch('https://api.sender.net/v2/subscribers', {
      method: 'POST', headers: senderHeaders,
      body: JSON.stringify({ email, groups: [patternGroup.id] }),
    });
    if (env.SEARCH_LOGS) {
      const scheduleKey = 'email:' + email.toLowerCase().trim();
      await env.SEARCH_LOGS.put(scheduleKey, JSON.stringify({
        email, pattern,
        signupDate: new Date().toISOString(),
        emailsSent: 0,
        nextEmailDate: new Date(Date.now() + 24*60*60*1000).toISOString(),
      }), { expirationTtl: 60*60*24*60 });
    }
    return new Response(JSON.stringify({ success: true, pattern }), { status: 200, headers });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers });
  }
}
export async function onRequestOptions() {
  return new Response(null, { headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }});
}
