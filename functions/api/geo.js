export async function onRequestGet({ request }) {
  const country = request.headers.get('cf-ipcountry') || 'US';
  return new Response(JSON.stringify({ country }), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  });
}
