// ADHD Reflect. Send scheduled practice emails
// Hit daily via cron: /api/send-scheduled?key=ADMIN_KEY
//
// Add ?dry=1 to run the full selection logic and return the same summary
// WITHOUT sending anything or advancing any schedule. Use it to verify the
// drip is picking up the right people before a live run.
//
// Every run returns a machine-readable JSON summary (scanned / due / sent /
// failed and a per-reason skip breakdown) and records it to KV, so a run that
// sends nothing is never mistaken for success. Auth failures return an explicit
// non-2xx body so they show up as failures in the cron-job.org execution log
// instead of looking like a healthy run.

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

// Cap on how many drip emails a single run will actually send. This protects
// the "don't blast the backlog" invariant: the per-person throttle already
// limits each subscriber to one step per run, and this caps the run as a whole
// so a large due list cannot exceed the sending domain's warm-up allowance
// (~150/day on a new domain, see EMAIL.md) in one burst. Anyone over the cap is
// deferred and picked up on the next run. Overridable via DRIP_MAX_PER_RUN.
const DEFAULT_MAX_PER_RUN = 150;

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const cronKey = url.searchParams.get('key');
  const dryRun = ['1', 'true', 'yes'].includes((url.searchParams.get('dry') || '').toLowerCase());

  // Auth. Split the two failure modes so the cron log says which one it is:
  //  - the server has no ADMIN_KEY at all (the secret is missing from THIS
  //    deployment scope — the classic "set in Preview, absent in Production"
  //    trap, and the most likely reason a drip silently never fires); vs
  //  - the caller sent a wrong or missing key.
  // Either way the body is explicit and the status is non-2xx, so cron-job.org
  // records a failure rather than a green run.
  if (!env.ADMIN_KEY) {
    return json({
      ok: false,
      error: 'not_configured',
      missing: 'ADMIN_KEY',
      detail: 'ADMIN_KEY is not set on this deployment. Cloudflare Pages secrets are per-environment: set it in the Production scope and redeploy.',
    }, 500);
  }
  if (!cronKey || cronKey !== env.ADMIN_KEY) {
    return json({
      ok: false,
      error: 'unauthorized',
      reason: cronKey ? 'invalid_key' : 'missing_key',
      detail: 'Provide the cron key as ?key=… . This request did not match ADMIN_KEY, so no drip was sent.',
    }, 401);
  }

  if (!env.RESEND_API_KEY || !env.SEARCH_LOGS) {
    return json({
      ok: false,
      error: 'not_configured',
      missing: !env.RESEND_API_KEY ? 'RESEND_API_KEY' : 'SEARCH_LOGS',
      detail: 'A required binding is missing on this deployment, so no drip was sent.',
    }, 500);
  }

  const maxPerRun = Math.max(1, parseInt(env.DRIP_MAX_PER_RUN, 10) || DEFAULT_MAX_PER_RUN);
  const now = new Date();

  // Per-reason skip counters, so a run that sends nothing explains why.
  const skipped = {
    notDue: 0,        // nextEmailDate is still in the future
    completed: 0,     // already had all four steps
    invalidEmail: 0,  // malformed address in the KV row
    unsubscribed: 0,  // opted out (unsub: key present)
    noCopy: 0,        // no drip copy for this pattern/step
    perRunCap: 0,     // eligible, but deferred to the next run by the cap
  };
  let scanned = 0;

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
  scanned += list.keys.length;
  for (const key of list.keys) {
    const raw = await env.SEARCH_LOGS.get(key.name);
    if (!raw) continue;
    const schedule = JSON.parse(raw);
    if (new Date(schedule.nextEmailDate) > now) { skipped.notDue++; continue; }
    if (schedule.emailsSent >= 4) { skipped.completed++; continue; }
    // Skip malformed addresses so a bad KV row cannot poison the batch.
    if (!EMAIL_RE.test(String(schedule.email || '').trim())) {
      console.warn('send-scheduled: skipping invalid address', key.name);
      skipped.invalidEmail++;
      continue;
    }
    // Honour unsubscribes. KV is the source of truth.
    if (await env.SEARCH_LOGS.get('unsub:' + normalizeEmail(schedule.email))) { skipped.unsubscribed++; continue; }
    const patternEmails = EMAILS[schedule.pattern];
    if (!patternEmails || !patternEmails[schedule.emailsSent]) { skipped.noCopy++; continue; }
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

  // Everyone in `due` is eligible. Honour the per-run cap so the backlog drains
  // gently rather than in one burst: send the first `maxPerRun`, defer the rest
  // to the next run (they stay due, so nothing is lost).
  const dueCount = due.length;
  let toSend = due;
  if (due.length > maxPerRun) {
    skipped.perRunCap = due.length - maxPerRun;
    toSend = due.slice(0, maxPerRun);
    console.warn('send-scheduled: capping at ' + maxPerRun + ' sends this run; ' + skipped.perRunCap + ' deferred');
  }

  let sent = 0, failed = 0;

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

  if (dryRun) {
    // Dry run: report exactly what a live run would send, touch nothing. The
    // people who WOULD receive mail are counted as sent so the summary reflects
    // the real run, but no email is posted and no schedule is advanced.
    sent = toSend.length;
  } else {
    // Send in groups of 100 (Resend's batch limit). Because batch is atomic, a
    // failed group is retried as individual sends so the valid recipients still
    // get through. Each message keeps its per-recipient idempotency key, so the
    // fallback cannot double-send what the batch may have already delivered.
    const GROUP = 100;
    for (let i = 0; i < toSend.length; i += GROUP) {
      const group = toSend.slice(i, i + GROUP);
      const result = await sendBatch(env, group.map((d) => d.message));
      const ok = result.chunks.length > 0 && result.chunks.every((c) => c.ok);
      if (ok) {
        for (const d of group) await advance(d);
      } else {
        for (const d of group) {
          const r = await sendEmail(env, d.message);
          if (r.ok) await advance(d);
          else failed++;
        }
      }
    }
  }

  const skippedTotal = Object.values(skipped).reduce((a, b) => a + b, 0);

  // Backward-compatible top-level fields (sent/skipped/errors/capped/timestamp)
  // for the admin dashboard, plus the detailed breakdown for diagnosis.
  const summary = {
    ok: true,
    dryRun,
    scanned,          // total email: rows read this run
    due: dueCount,    // eligible to send (before the per-run cap)
    sent,             // actually sent (or would-send, in a dry run)
    failed,           // individual sends that Resend rejected
    skipped: skippedTotal,
    skippedBreakdown: skipped,
    errors: failed,   // legacy alias the dashboard reads
    total: scanned,   // legacy alias
    pagesListed: pages,
    maxPerRun,
    capped,           // hit the pagination page ceiling (more rows unprocessed)
    timestamp: now.toISOString(),
  };

  // Record the run so the admin dashboard can show when the drip last fired.
  // Dry runs never overwrite the last real run's record.
  if (!dryRun) {
    try { await env.SEARCH_LOGS.put('stats:last-drip-run', JSON.stringify(summary)); } catch (e) { /* best-effort */ }
  }

  // Reuse this daily cron to refresh IndexNow (Bing, Yandex and the other
  // engines that share the feed), so newly deployed or changed pages get
  // picked up without a separate schedule. Strictly best-effort: a failure
  // here must never affect the drip, so it is caught and only logged. Skipped
  // on a dry run, which is meant to be side-effect free.
  let indexnow = null;
  if (!dryRun) {
    try {
      indexnow = await submitToIndexNow();
    } catch (e) {
      console.error('indexnow submission from cron failed', e && e.message);
      indexnow = { error: e && e.message };
    }
  }

  return json({ ...summary, indexnow });
}
