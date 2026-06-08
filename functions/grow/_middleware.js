export async function onRequest({ request, env, next }) {
  const url = new URL(request.url);
  const path = url.pathname;

  // Public grow pages — no auth needed
  const publicPaths = ['/grow', '/grow/', '/grow/access', '/grow/welcome'];
  if (publicPaths.includes(path)) {
    return next();
  }

  // Everything else under /grow/* needs a valid token
  const cookie = request.headers.get('cookie') || '';
  const tokenMatch = cookie.match(/grow_token=([a-f0-9]{64})/);
  const token = tokenMatch ? tokenMatch[1] : null;

  if (!token || !env.GROW_DATA) {
    return Response.redirect('https://adhdreflect.com/grow?auth=required', 302);
  }

  const data = await env.GROW_DATA.get('token:' + token);
  if (!data) {
    return Response.redirect('https://adhdreflect.com/grow?auth=invalid', 302);
  }

  return next();
}