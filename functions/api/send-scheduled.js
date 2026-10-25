// ADHD Reflect. Send scheduled practice emails
// Hit daily via cron: /api/send-scheduled?key=ADMIN_KEY
//
// Add ?dry=1 (or ?dryRun=1) to run the full selection logic and return the
// same summary WITHOUT sending anything or advancing any schedule, plus a
// per-contact list: each subscriber's eligible step by signup date, the last
// step they had, the step a live run would send, and the action (send, skip
// with reason, or defer). Use it to see exactly what a live run would do.
//
// Every run returns a machine-readable JSON summary (scanned / due / sent /
// failed and a per-reason skip breakdown) and records it to KV, so a run that
// sends nothing is never mistaken for success. Auth failures return an explicit
// non-2xx body so they show up as failures in the cron-job.org execution log
// instead of looking like a healthy run.

import { adminKeyConfigured, adminKeyMatches, keyMismatchInfo } from './_lib/auth.js';
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
  const dryParam = url.searchParams.get('dryRun') || url.searchParams.get('dry') || '';
  const dryRun = ['1', 'true', 'yes'].includes(dryParam.toLowerCase());

  // Auth. Split the two failure modes so the cron log says which one it is:
  //  - the server has no ADMIN_KEY at all (the secret is missing from THIS
  //    deployment scope — the classic "set in Preview, absent in Production"
  //    trap, and the most likely reason a drip silently never fires); vs
  //  - the caller sent a wrong or missing key.
  // Either way the body is explicit and the status is non-2xx, so cron-job.org
  // records a failure rather than a green run.
  if (!adminKeyConfigured(env)) {
    return json({
      ok: false,
      error: 'not_configured',
      missing: 'ADMIN_KEY',
      detail: 'ADMIN_KEY is not set on this deployment. Cloudflare Pages secrets are per-environment: set it in the Production scope and redeploy.',
    }, 500);
  }
  if (!adminKeyMatches(env, cronKey)) {
    return json({
      ok: false,
      error: 'unauthorized',
      reason: cronKey ? 'invalid_key' : 'missing_key',
      detail: 'Provide the cron key as ?key=… . This request did not match ADMIN_KEY, so no drip was sent.',
      ...keyMismatchInfo(env, cronKey),
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
    malformed: 0,     // KV value is not JSON (a bad row must not kill the run)
    perRunCap: 0,     // eligible, but deferred to the next run by the cap
  };
  let scanned = 0;

  // One entry per row scanned, for the dry run's per-contact report. Built on
  // every run (it is cheap) but only returned on a dry run, so the cron log at
  // cron-job.org never fills up with subscriber addresses.
  const contacts = [];

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
    let schedule;
    try { schedule = JSON.parse(raw); } catch (e) {
      // One unparseable row used to throw out of the whole run with no summary
      // recorded, so the drip looked dead for everyone. Skip it and say so.
      console.warn('send-scheduled: skipping malformed row', key.name);
      skipped.malformed++;
      contacts.push({ key: key.name, action: 'skip', reason: 'malformed' });
      continue;
    }
    const email = String(schedule.email || '').trim();
    const entry = {
      email,
      pattern: schedule.pattern || null,
      signupDate: schedule.signupDate || null,
      // Entitled to by now from the signup date alone (see eligibleStepBySignup).
      eligibleStep: eligibleStepBySignup(schedule.signupDate, now),
      lastSentStep: schedule.emailsSent > 0 ? schedule.emailsSent - 1 : null,
      // The step a live run sends: always the next one they have not had.
      nextStep: schedule.emailsSent >= 4 ? null : (schedule.emailsSent || 0),
      nextEmailDate: schedule.nextEmailDate || null,
      lastSent: schedule.lastSent || null,
    };
    const skip = (reason) => { skipped[reason]++; contacts.push({ ...entry, action: 'skip', reason }); };
    // Completed before not-due: someone who has had all four emails is finished
    // for good, whatever their next date says. Checking the date first filed
    // every finished subscriber under notDue, which made "completed" read as 0
    // forever and hid how much of the list had reached the end of the sequence.
    // Both branches skip, so this only changes which counter is credited.
    if (schedule.emailsSent >= 4) { skip('completed'); continue; }
    if (new Date(schedule.nextEmailDate) > now) { skip('notDue'); continue; }
    // Skip malformed addresses so a bad KV row cannot poison the batch.
    if (!EMAIL_RE.test(email)) {
      console.warn('send-scheduled: skipping invalid address', key.name);
      skip('invalidEmail');
      continue;
    }
    // Honour unsubscribes. KV is the source of truth: /api/unsubscribe writes
    // the unsub: row and mirrors the flag to the Resend contact, so checking
    // KV here covers both.
    if (await env.SEARCH_LOGS.get('unsub:' + normalizeEmail(email))) { skip('unsubscribed'); continue; }
    const patternEmails = EMAILS[schedule.pattern];
    if (!patternEmails || !patternEmails[schedule.emailsSent]) { skip('noCopy'); continue; }
    const emailToSend = patternEmails[schedule.emailsSent];
    contacts.push({ ...entry, action: 'send', subject: emailToSend.subject });

    // Marketing send: needs a signed unsubscribe path in the header and body.
    const token = await signUnsub(env, schedule.email);
    const q = 'e=' + encodeURIComponent(schedule.email) + '&t=' + token;
    const unsubPage = 'https://adhdreflect.com/unsubscribe?' + q;
    const unsubApi = 'https://adhdreflect.com/api/unsubscribe?' + q;

    due.push({
      keyName: key.name,
      schedule,
      entry: contacts[contacts.length - 1],
      message: {
        to: schedule.email,
        subject: emailToSend.subject,
        text: emailToSend.text + '\n\n' + unsubscribeLine(unsubPage),
        html: dripEmailHtml({ text: emailToSend.text, subject: emailToSend.subject, unsubUrl: unsubPage }),
        tags: [{ name: 'type', value: 'drip' }],
        // Per-recipient, per-drip-step key (drip:<email>:<step>) so a cron
        // retry or a single-send fallback cannot double-send one step.
        idempotencyKey: 'drip:' + email + ':' + schedule.emailsSent,
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
    for (const d of due.slice(maxPerRun)) { d.entry.action = 'defer'; d.entry.reason = 'perRunCap'; }
    console.warn('send-scheduled: capping at ' + maxPerRun + ' sends this run; ' + skipped.perRunCap + ' deferred');
  }

  let sent = 0, failed = 0, outcomeUnknown = 0;

  // Advance one recipient in KV after a successful send. Normally the next date
  // is the PREVIOUS scheduled date plus 7 days, not now-plus-7, so a cron run
  // that lands a few hours late does not walk the whole schedule forward.
  //
  // That anchoring breaks down when a schedule is badly behind. If the drip has
  // been dead for weeks, prev + 7d is STILL in the past, so this person is due
  // again on the very next run, and the run after that: someone promised "one a
  // week for four weeks" receives the remaining three on consecutive days. That
  // reads as a malfunction, and it is the opposite of what the welcome email
  // says.
  //
  // So: keep the drift-free anchor while it is still in the future, and re-base
  // to a week from now once it has fallen into the past. A late subscriber gets
  // this email today and the next in seven days, which is the cadence they were
  // actually promised.
  const WEEK = 7*24*60*60*1000;
  const advance = async (d) => {
    const prev = new Date(d.schedule.nextEmailDate).getTime();
    const drift = prev + WEEK;
    const next = drift > now.getTime() ? drift : now.getTime() + WEEK;
    d.schedule.emailsSent += 1;
    d.schedule.nextEmailDate = new Date(next).toISOString();
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
    // Send in groups of 100 (Resend's batch limit). Resend's batch call is
    // atomic, so when it answers with an error status nothing in the group went
    // out and the group is retried as individual sends, each under its own
    // drip:<email>:<step> key, so the valid recipients still get through.
    //
    // A batch call that threw (network error, timeout) is different: Resend may
    // well have accepted it, and its idempotency key is request-scoped, so a
    // single-send fallback under the per-recipient keys would NOT be deduped
    // against it. Never resend in that case. The group stays due in KV and is
    // picked up by the next run; its batch key is the same for the same set of
    // messages, so inside Resend's idempotency window a batch that did land is
    // not repeated. One missed day beats a day of double emails.
    const GROUP = 100;
    for (let i = 0; i < toSend.length; i += GROUP) {
      const group = toSend.slice(i, i + GROUP);
      const result = await sendBatch(env, group.map((d) => d.message));
      const ok = result.chunks.length > 0 && result.chunks.every((c) => c.ok);
      if (ok) {
        for (const d of group) await advance(d);
      } else if (result.chunks.some((c) => c.thrown)) {
        console.error('send-scheduled: batch outcome unknown, not resending ' + group.length + ' this run');
        outcomeUnknown += group.length;
        failed += group.length;
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
    failed,           // not sent this run: rejected by Resend, or outcome unknown
    outcomeUnknown,   // batch calls that threw; left due for the next run, not resent
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
      indexnow = await submitToIndexNow(env);
    } catch (e) {
      console.error('indexnow submission from cron failed', e && e.message);
      indexnow = { error: e && e.message };
    }
  }

  // The per-contact list is dry-run only: it carries subscriber addresses and
  // the cron log at cron-job.org keeps every response body.
  return json(dryRun ? { ...summary, contacts, indexnow } : { ...summary, indexnow });
}

// The step a subscriber is entitled to by now from their signup date alone:
// step 0 on day 1 (what the welcome email promises), then one more each week
// (days 8, 15, 22), capped at the last step. -1 before day 1, null if the date
// is unreadable. This is reported in the dry run beside the step a run would
// actually send, so a backlog shows as the gap between the two. It does not
// gate sending: nextEmailDate does, and after an outage advance() re-anchors
// that a week out so catch-up stays one email a week, which is the cadence
// the welcome email promised, rather than the missed steps on consecutive days.
const DAY_MS = 24*60*60*1000;
function eligibleStepBySignup(signupDate, now) {
  const t = new Date(signupDate).getTime();
  if (!Number.isFinite(t)) return null;
  const days = Math.floor((now.getTime() - t) / DAY_MS);
  if (days < 1) return -1;
  return Math.min(3, Math.floor((days - 1) / 7));
}
