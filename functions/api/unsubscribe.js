// ADHD Reflect — unsubscribe endpoint.
// KV is the source of truth (unsub:<email>); the Resend suppression list is a
// backstop. Unsubscribing never touches Grow access, tokens or purchase
// records, so transactional email (purchase, recovery, free access) keeps
// working.
import {
  verifyUnsub,
  addSuppression,
  removeSuppression,
  normalizeEmail,
  upsertContact,
} from './_lib/email.js';

// Keep the opt-out on file for years, well beyond the drip schedule TTL.
const UNSUB_TTL = 60 * 60 * 24 * 365 * 5;

async function doUnsubscribe(env, email) {
  const key = 'unsub:' + email;
  const existing = env.SEARCH_LOGS ? await env.SEARCH_LOGS.get(key) : null;
  if (existing) return 'already';
  if (env.SEARCH_LOGS) {
    await env.SEARCH_LOGS.put(
      key,
      JSON.stringify({ email, unsubscribedAt: new Date().toISOString() }),
      { expirationTtl: UNSUB_TTL },
    );
  }
  await addSuppression(env, email); // best-effort backstop
  // Flag the Resend contact so Broadcasts respect the opt-out later. KV stays
  // the source of truth for the drip; no pattern is passed, so it is untouched.
  await upsertContact(env, { email, unsubscribed: true });
  return 'done';
}

async function doResubscribe(env, email) {
  if (env.SEARCH_LOGS) await env.SEARCH_LOGS.delete('unsub:' + email);
  await removeSuppression(env, email); // best-effort backstop
  await upsertContact(env, { email, unsubscribed: false });
  return 'resubscribed';
}

// POST: mailbox-provider one-click (List-Unsubscribe-Post). Verify, unsubscribe,
// return 200 with an empty body. Providers will not follow a redirect or read
// HTML, so we send neither.
export async function onRequestPost({ request, env }) {
  const url = new URL(request.url);
  const email = normalizeEmail(url.searchParams.get('e'));
  const token = url.searchParams.get('t');
  if (!email || !(await verifyUnsub(env, email, token))) {
    return new Response(null, { status: 400 });
  }
  await doUnsubscribe(env, email);
  return new Response(null, { status: 200 });
}

// GET: called by the unsubscribe page via fetch. Returns a JSON status.
// action=resubscribe reverses it. Invalid or missing token: 400, with no hint
// about whether the address exists.
export async function onRequestGet({ request, env }) {
  const headers = { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' };
  const url = new URL(request.url);
  const email = normalizeEmail(url.searchParams.get('e'));
  const token = url.searchParams.get('t');
  const action = url.searchParams.get('action') === 'resubscribe' ? 'resubscribe' : 'unsubscribe';

  if (!email || !(await verifyUnsub(env, email, token))) {
    return new Response(JSON.stringify({ status: 'invalid' }), { status: 400, headers });
  }

  const status = action === 'resubscribe'
    ? await doResubscribe(env, email)
    : await doUnsubscribe(env, email);

  return new Response(JSON.stringify({ status }), { status: 200, headers });
}
