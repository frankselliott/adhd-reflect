export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const token = url.searchParams.get('token');

  if (!token || !env.GROW_DATA) {
    return Response.redirect('https://adhdreflect.com/grow', 302);
  }

  const data = await env.GROW_DATA.get('token:' + token);
  if (!data) {
    return Response.redirect('https://adhdreflect.com/grow?invalid=1', 302);
  }

  const redirectTo = url.searchParams.get('next') || '/grow/home';

  // Return an HTML page that:
  // 1. Sets the cookie (via Set-Cookie header)
  // 2. Saves token to localStorage (survives cookie clearing — Safari ITP etc.)
  // 3. Redirects to the destination
  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Setting up access...</title></head>
<body>
<script>
  try { localStorage.setItem('grow_token', '${token}'); } catch(e) {}
  window.location.replace('${redirectTo}');
</script>
<noscript>
  <meta http-equiv="refresh" content="0;url=${redirectTo}">
</noscript>
</body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html;charset=UTF-8',
      'Set-Cookie': `grow_token=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${60*60*24*365*2}`,
      'Cache-Control': 'no-store',
    },
  });
}
