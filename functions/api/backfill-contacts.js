// ADHD Reflect — one-off contact backfill.
// GET, ADMIN_KEY auth: /api/backfill-contacts?key=ADMIN_KEY
// Mirrors every KV subscriber (email:<addr>) into Resend contacts so the list
// survives the 60-day KV TTL. Fully idempotent; safe to run repeatedly.
import { upsertContact, normalizeEmail } from './_lib/email.js';

export async function onRequestGet({ request, env }) {
  const jsonHeaders = { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' };
  const url = new URL(request.url);
  const key = url.searchParams.get('key');

  if (!env.ADMIN_KEY || key !== env.ADMIN_KEY) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: jsonHeaders });
  }
  if (!env.RESEND_API_KEY || !env.SEARCH_LOGS) {
    return new Response(JSON.stringify({ error: 'Not configured' }), { status: 500, headers: jsonHeaders });
  }

  let processed = 0, created = 0, updated = 0, failed = 0, skipped = 0;
  let cursor = undefined;

  // Paginate with the cursor until the list is complete. (send-scheduled.js
  // uses a bare limit:500 with no cursor; that is a known cap bug, not copied.)
  do {
    const list = await env.SEARCH_LOGS.list({ prefix: 'email:', cursor });
    for (const k of list.keys) {
      const raw = await env.SEARCH_LOGS.get(k.name);
      if (!raw) { skipped++; continue; }

      let schedule;
      try { schedule = JSON.parse(raw); } catch (_) { skipped++; continue; }
      const email = schedule && schedule.email;
      if (!email) { skipped++; continue; }

      const norm = normalizeEmail(email);
      // Opt-outs are written through as unsubscribed:true, not skipped, so the
      // opt-out survives into Resend.
      const unsubscribed = !!(await env.SEARCH_LOGS.get('unsub:' + norm));

      const res = await upsertContact(env, { email, pattern: schedule.pattern, unsubscribed });
      processed++;
      if (!res.ok) failed++;
      else if (res.created) created++;
      else updated++;
    }
    cursor = list.list_complete ? undefined : list.cursor;
  } while (cursor);

  return new Response(JSON.stringify({ processed, created, updated, failed, skipped }), { status: 200, headers: jsonHeaders });
}
