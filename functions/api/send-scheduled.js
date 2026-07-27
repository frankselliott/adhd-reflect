// ADHD Reflect. Send scheduled practice emails
// Hit daily via cron: /api/send-scheduled?key=ADMIN_KEY

import { sendBatch, sendEmail, signUnsub, normalizeEmail } from './_lib/email.js';
import { dripEmailHtml } from './_lib/emails.js';
import { DRIP, unsubscribeLine } from './_lib/emailCopy.js';
import { submitToIndexNow } from './indexnow.js';

// Simple sanity check. One invalid address must not stall the whole drip,
// because Resend's batch endpoint is atomic (all-or-nothing per call).
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// All drip copy now lives in emailCopy.js. Same shape as before:
// EMAILS[pattern][emailsSent] gives { subject, text }.
const EMAILS = DRIP;


export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const cronKey = url.searchParams.get('key');
  if (!env.ADMIN_KEY || cronKey !== env.ADMIN_KEY) {
    return new Response('Unauthorized', { status: 401 });
  }
  if (!env.RESEND_API_KEY || !env.SEARCH_LOGS) {
    return new Response('Not configured', { status: 500 });
  }

  const now = new Date();
  let sent = 0, skipped = 0, errors = 0, total = 0;

  // Collect everyone due this run, then send them via Resend's batch endpoint.
  // Paginate with the cursor (same pattern as backfill-contacts.js) so the run
  // does not silently stop at the first page. Cap at 20 pages so a runaway
  // cannot blow the Workers time limit.
  const due = [];
  const MAX_PAGES = 20;
  let cursor, pages = 0, capped = false;
  do {
  const list = await env.SEARCH_LOGS.list({ prefix: 'email:', cursor });
  pages++;
  total += list.keys.length;
  for (const key of list.keys) {
    const raw = await env.SEARCH_LOGS.get(key.name);
    if (!raw) continue;
    const schedule = JSON.parse(raw);
    if (new Date(schedule.nextEmailDate) > now) { skipped++; continue; }
    if (schedule.emailsSent >= 4) { skipped++; continue; }
    // Skip malformed addresses so a bad KV row cannot poison the batch.
    if (!EMAIL_RE.test(String(schedule.email || '').trim())) {
      console.warn('send-scheduled: skipping invalid address', key.name);
      skipped++;
      continue;
    }
    // Honour unsubscribes. KV is the source of truth.
    if (await env.SEARCH_LOGS.get('unsub:' + normalizeEmail(schedule.email))) { skipped++; continue; }
    const patternEmails = EMAILS[schedule.pattern];
    if (!patternEmails || !patternEmails[schedule.emailsSent]) { skipped++; continue; }
    const emailToSend = patternEmails[schedule.emailsSent];

    // Marketing send: needs a signed unsubscribe path in the header and body.
    const token = await signUnsub(env, schedule.email);
    const q = 'e=' + encodeURIComponent(schedule.email) + '&t=' + token;
    const unsubPage = 'https://adhdreflect.com/unsubscribe?' + q;
    const unsubApi = 'https://adhdreflect.com/api/unsubscribe?' + q;

    due.push({
      keyName: key.name,
      schedule,
      message: {
        to: schedule.email,
        subject: emailToSend.subject,
        text: emailToSend.text + '\n\n' + unsubscribeLine(unsubPage),
        html: dripEmailHtml({ text: emailToSend.text, subject: emailToSend.subject, unsubUrl: unsubPage }),
        tags: [{ name: 'type', value: 'drip' }],
        // Per-recipient, per-drip-step key so a cron retry cannot double-send.
        idempotencyKey: 'drip-' + schedule.email + '-' + schedule.emailsSent,
        headers: {
          'List-Unsubscribe': '<' + unsubApi + '>',
          'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
        },
      },
    });
  }
  cursor = list.list_complete ? undefined : list.cursor;
  if (cursor && pages >= MAX_PAGES) { capped = true; break; }
  } while (cursor);
  if (capped) console.warn('send-scheduled: hit ' + MAX_PAGES + '-page ceiling; more subscribers remain unprocessed this run');

  // Advance one recipient in KV after a successful send. Anchor the next date
  // to the PREVIOUS scheduled date plus 7 days, not to now, so a late cron run
  // does not push the whole schedule forward permanently. If the cron has
  // missed several days the new date may still be in the past, which just makes
  // this person due again next run: one email per person per run (the loop
  // sends a single step each time), and the schedule re-converges over the
  // following days rather than firing a burst.
  const advance = async (d) => {
    const prev = new Date(d.schedule.nextEmailDate).getTime();
    d.schedule.emailsSent += 1;
    d.schedule.nextEmailDate = new Date(prev + 7*24*60*60*1000).toISOString();
    d.schedule.lastSent = now.toISOString();
    await env.SEARCH_LOGS.put(d.keyName, JSON.stringify(d.schedule), { expirationTtl: 60*60*24*60 });
    sent++;
  };

  // Send in groups of 100 (Resend's batch limit). Because batch is atomic, a
  // failed group is retried as individual sends so the valid recipients still
  // get through. Each message keeps its per-recipient idempotency key, so the
  // fallback cannot double-send what the batch may have already delivered.
  const GROUP = 100;
  for (let i = 0; i < due.length; i += GROUP) {
    const group = due.slice(i, i + GROUP);
    const result = await sendBatch(env, group.map((d) => d.message));
    const ok = result.chunks.length > 0 && result.chunks.every((c) => c.ok);
    if (ok) {
      for (const d of group) await advance(d);
    } else {
      for (const d of group) {
        const r = await sendEmail(env, d.message);
        if (r.ok) await advance(d);
        else errors++;
      }
    }
  }

  // Record the run so the admin dashboard can show when the drip last fired,
  // instead of that only being visible in this response body.
  const runStats = { sent, skipped, errors, total, capped, timestamp: new Date().toISOString() };
  try { await env.SEARCH_LOGS.put('stats:last-drip-run', JSON.stringify(runStats)); } catch (e) { /* best-effort */ }

  // Reuse this daily cron to refresh IndexNow (Bing, Yandex and the other
  // engines that share the feed), so newly deployed or changed pages get
  // picked up without a separate schedule. Strictly best-effort: a failure
  // here must never affect the drip, so it is caught and only logged. It is
  // kept out of the KV drip stats and reported in the response only.
  let indexnow = null;
  try {
    indexnow = await submitToIndexNow();
  } catch (e) {
    console.error('indexnow submission from cron failed', e && e.message);
    indexnow = { error: e && e.message };
  }

  return new Response(JSON.stringify({ ...runStats, indexnow }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
