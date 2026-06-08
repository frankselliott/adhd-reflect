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
  const response = Response.redirect('https://adhdreflect.com' + redirectTo, 302);

  // Set token cookie for 2 years
  const headers = new Headers(response.headers);
  headers.set('Set-Cookie',
    'grow_token=' + token + '; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=' + (60*60*24*365*2)
  );

  return new Response(null, {
    status: 302,
    headers,
  });
}