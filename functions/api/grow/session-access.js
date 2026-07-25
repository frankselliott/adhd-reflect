// Resolve the access link for a completed Stripe checkout session.
// The webhook writes session:<id> -> accessUrl with a 24h TTL. Unknown,
// expired, and not-yet-written session IDs ALL return { pending: true } with a
// 200, never a 404, so this endpoint never reveals whether a given session
// exists. The success page polls it and falls back to email + recovery.
export async function onRequestGet({ request, env }) {
  const headers = { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' };
  try {
    const sessionId = new URL(request.url).searchParams.get('session_id') || '';
    if (!sessionId || !env.GROW_DATA) {
      return new Response(JSON.stringify({ pending: true }), { status: 200, headers });
    }
    const accessUrl = await env.GROW_DATA.get('session:' + sessionId);
    if (!accessUrl) {
      return new Response(JSON.stringify({ pending: true }), { status: 200, headers });
    }
    return new Response(JSON.stringify({ accessUrl }), { status: 200, headers });
  } catch (e) {
    console.error('session-access error', e && e.message);
    return new Response(JSON.stringify({ pending: true }), { status: 200, headers });
  }
}
