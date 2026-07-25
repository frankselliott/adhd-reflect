// ADHD Reflect — Subscribe endpoint
import { sendEmail, signUnsub, normalizeEmail, upsertContact } from './_lib/email.js';
import { PATTERN_NAMES, VALID_PATTERNS } from './_lib/patterns.js';
import { welcomeEmailHtml } from './_lib/emails.js';
import { welcome as welcomeCopy } from './_lib/emailCopy.js';

// Local part, @, domain, a dot, and a TLD of 2+. Not full RFC 5322. Kept in
// sync with the client check in src/components/Quiz.jsx; client validation is
// only decoration on a public, CORS-* endpoint, so this is the real gate.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const JUNK_DOMAINS = new Set(['localhost', 'example.com', 'test.com']);

function isValidEmail(email) {
  if (!email || email.length > 254) return false;
  if (!EMAIL_RE.test(email)) return false;
  const domain = email.slice(email.lastIndexOf('@') + 1);
  if (!domain.includes('.')) return false;
  if (JUNK_DOMAINS.has(domain)) return false;
  return true;
}

// Rate limiting. Counters in SEARCH_LOGS with a one-hour TTL: 5 signups per IP
// per hour, and the same address no more than 3 times per hour regardless of
// IP. This stops anyone mail-bombing an address from our verified domain or
// flooding the list.
const RL_TTL = 60 * 60;
const RL_IP_MAX = 5;
const RL_ADDR_MAX = 3;

async function bump(env, key) {
  const cur = parseInt((await env.SEARCH_LOGS.get(key)) || '0', 10) || 0;
  const next = cur + 1;
  await env.SEARCH_LOGS.put(key, String(next), { expirationTtl: RL_TTL });
  return next;
}

// True if this signup should be blocked. Fails open on any KV error, so a KV
// hiccup never blocks real signups.
async function isRateLimited(env, ip, norm) {
  if (!env.SEARCH_LOGS) return false;
  try {
    const ipCount = await bump(env, 'rl:subscribe:' + ip);
    const addrCount = await bump(env, 'rl:subscribe:addr:' + norm);
    return ipCount > RL_IP_MAX || addrCount > RL_ADDR_MAX;
  } catch (e) {
    console.error('rate limit check failed, allowing signup', e && e.message);
    return false;
  }
}

export async function onRequestPost({ request, env }) {
  const headers = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };
  try {
    const body = await request.json();
    const { email, pattern } = body;
    if (!email || !pattern) {
      return new Response(JSON.stringify({ error: 'Email and pattern required' }), { status: 400, headers });
    }
    // Allow-list the pattern. This is a public, CORS-* endpoint, so the pattern
    // must never be interpolated into the email untrusted: only these keys are
    // accepted, and only their fixed display name reaches the message.
    if (!VALID_PATTERNS.includes(pattern)) {
      return new Response(JSON.stringify({ error: 'Invalid pattern' }), { status: 400, headers });
    }
    const patternName = PATTERN_NAMES[pattern];
    const norm = normalizeEmail(email);

    // Validate the address before touching KV, Resend or the welcome send.
    if (!isValidEmail(norm)) {
      return new Response(JSON.stringify({ success: false, reason: 'invalid_email' }), { status: 400, headers });
    }

    // The drip schedule lives in KV. If that binding is missing we cannot
    // record the signup, so do not send a welcome and do not report success.
    if (!env.SEARCH_LOGS) {
      console.error('subscribe: SEARCH_LOGS binding missing');
      return new Response(JSON.stringify({ success: false, reason: 'storage_unavailable' }), { status: 503, headers });
    }

    // Rate limit before doing any work, so a blocked caller never triggers a
    // send or a contact write.
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    if (await isRateLimited(env, ip, norm)) {
      return new Response(JSON.stringify({ success: false, reason: 'rate_limited' }), { status: 429, headers });
    }

    // Honour unsubscribes. Someone who opted out re-subscribes only via the
    // resubscribe link, not by signing up again.
    if (env.SEARCH_LOGS && await env.SEARCH_LOGS.get('unsub:' + norm)) {
      return new Response(JSON.stringify({ success: false, welcomeSent: false, reason: 'unsubscribed' }), { status: 200, headers });
    }

    // Guard against repeat signups: if a schedule already exists, do not
    // overwrite it and do not resend the welcome. Distinguished by reason so a
    // no-send here is not mistaken for a successful send.
    const scheduleKey = 'email:' + norm;
    if (env.SEARCH_LOGS && await env.SEARCH_LOGS.get(scheduleKey)) {
      return new Response(JSON.stringify({ success: true, pattern, welcomeSent: false, reason: 'already_subscribed' }), { status: 200, headers });
    }

    // Record the drip schedule. send-scheduled.js reads this and sends the
    // pattern practices over the following weeks.
    if (env.SEARCH_LOGS) {
      await env.SEARCH_LOGS.put(scheduleKey, JSON.stringify({
        email: norm, pattern,
        signupDate: new Date().toISOString(),
        emailsSent: 0,
        nextEmailDate: new Date(Date.now() + 24*60*60*1000).toISOString(),
      }), { expirationTtl: 60*60*24*60 });
    }

    // Welcome email. Marketing send, so it carries a signed unsubscribe path.
    const token = await signUnsub(env, norm);
    const q = 'e=' + encodeURIComponent(norm) + '&t=' + token;
    const unsubUrl = 'https://adhdreflect.com/unsubscribe?' + q;
    const unsubApi = 'https://adhdreflect.com/api/unsubscribe?' + q;
    const result = await sendEmail(env, {
      to: norm,
      subject: welcomeCopy.subject,
      tags: [{ name: 'type', value: 'welcome' }],
      headers: {
        'List-Unsubscribe': '<' + unsubApi + '>',
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
      },
      html: welcomeEmailHtml({ patternName, unsubUrl }),
      text: welcomeCopy.text({ patternName, unsubUrl }),
    });

    // Report the real send outcome so a silent failure is visible. The signup
    // itself succeeded (schedule written); welcomeSent reflects the email only.
    // Reasons are machine-readable and non-sensitive. The API key and any
    // Resend error body are logged by sendEmail(), never returned to the client.
    const welcomeSent = result.ok;
    const reason = result.ok
      ? 'sent'
      : (!env.RESEND_API_KEY ? 'email_not_configured' : 'send_failed');

    // Mirror into Resend contacts (durable list). KV still drives the drip;
    // this is for retention, not routing, and must never fail the signup.
    const contact = await upsertContact(env, { email: norm, pattern, unsubscribed: false });

    return new Response(JSON.stringify({ success: true, pattern, welcomeSent, reason, contactSynced: contact.ok }), { status: 200, headers });
  } catch (e) {
    console.error('subscribe error', e && e.message);
    return new Response(JSON.stringify({ error: 'Something went wrong.' }), { status: 500, headers });
  }
}
export async function onRequestOptions() {
  return new Response(null, { headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }});
}
