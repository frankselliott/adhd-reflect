// ADHD Reflect — admin-only clear of a single subscriber schedule.
// GET, ADMIN_KEY auth: /api/email-clear?key=ADMIN_KEY&e=<address>
// Deletes email:<addr> from SEARCH_LOGS so the repeat-signup guard no longer
// fires for that address and it can be retested. Does NOT touch unsub:<addr>,
// Grow access, tokens or purchase records.
import { normalizeEmail } from './_lib/email.js';

export async function onRequestGet({ request, env }) {
  const headers = { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' };
  const url = new URL(request.url);
  const key = url.searchParams.get('key');

  if (!env.ADMIN_KEY || key !== env.ADMIN_KEY) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers });
  }

  const addr = normalizeEmail(url.searchParams.get('e'));
  if (!addr) {
    return new Response(JSON.stringify({ error: 'Missing e' }), { status: 400, headers });
  }
  if (!env.SEARCH_LOGS) {
    return new Response(JSON.stringify({ error: 'SEARCH_LOGS not bound' }), { status: 500, headers });
  }

  const scheduleKey = 'email:' + addr;
  const existed = !!(await env.SEARCH_LOGS.get(scheduleKey));
  await env.SEARCH_LOGS.delete(scheduleKey);

  return new Response(JSON.stringify({ cleared: true, existed, key: scheduleKey }), { status: 200, headers });
}
