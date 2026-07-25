// ADHD Reflect email helper. Resend transactional + batch sending.
// Cloudflare Workers runtime: fetch only, no SDK, no Node imports.
//
// Every send goes through Resend (https://resend.com). Sending domain
// adhdreflect.com is verified in Resend. The API key lives in RESEND_API_KEY.

const RESEND_SEND_URL = 'https://api.resend.com/emails';
const RESEND_BATCH_URL = 'https://api.resend.com/emails/batch';

const DEFAULT_FROM = 'ADHD Reflect <hello@adhdreflect.com>';
const DEFAULT_REPLY_TO = 'hello@adhdreflect.com';

const BATCH_MAX = 100; // Resend batch limit per call.

const RESEND_SUPPRESSIONS_URL = 'https://api.resend.com/suppressions';

// Normalise an address so signing, verifying and KV keys always agree.
export function normalizeEmail(email) {
  return String(email || '').toLowerCase().trim();
}

// Signed unsubscribe token: first 16 hex chars of
// HMAC-SHA256(normalised email, UNSUB_SECRET). Workers-safe (crypto.subtle),
// no node imports. Used everywhere an unsubscribe link or List-Unsubscribe
// header is built, so anyone cannot unsubscribe anyone.
export async function signUnsub(env, email) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(env.UNSUB_SECRET || ''),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const mac = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(normalizeEmail(email)));
  const hex = Array.from(new Uint8Array(mac)).map((b) => b.toString(16).padStart(2, '0')).join('');
  return hex.slice(0, 16);
}

// Constant-time-ish check of a supplied token against the expected signature.
export async function verifyUnsub(env, email, token) {
  if (!token) return false;
  const expected = await signUnsub(env, email);
  if (token.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= token.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return diff === 0;
}

// Resend suppression list is a backstop only: KV is the source of truth.
// Both calls are best-effort and never throw.
export async function addSuppression(env, email) {
  if (!env.RESEND_API_KEY) return { ok: false };
  try {
    const res = await fetch(RESEND_SUPPRESSIONS_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: normalizeEmail(email) }),
    });
    if (!res.ok) {
      let data = null;
      try { data = await res.json(); } catch (_) { /* non-JSON body */ }
      console.error('Resend suppression add failed', res.status, JSON.stringify(data));
      return { ok: false };
    }
    return { ok: true };
  } catch (e) {
    console.error('Resend suppression add threw', e && e.message);
    return { ok: false };
  }
}

export async function removeSuppression(env, email) {
  if (!env.RESEND_API_KEY) return { ok: false };
  try {
    const res = await fetch(`${RESEND_SUPPRESSIONS_URL}/${encodeURIComponent(normalizeEmail(email))}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}` },
    });
    if (!res.ok) {
      let data = null;
      try { data = await res.json(); } catch (_) { /* non-JSON body */ }
      console.error('Resend suppression remove failed', res.status, JSON.stringify(data));
      return { ok: false };
    }
    return { ok: true };
  } catch (e) {
    console.error('Resend suppression remove threw', e && e.message);
    return { ok: false };
  }
}

// Small deterministic non-crypto hash (djb2). Used to derive a stable
// per-chunk Idempotency-Key from the caller's per-recipient keys, so a
// retried batch call dedupes at Resend. No node:crypto needed.
function djb2(str) {
  let h = 5381;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) + h + str.charCodeAt(i)) >>> 0;
  }
  return h.toString(16);
}

// Minimal HTML to plain-text fallback for callers that only supply html.
// We never send html alone: every send carries a text part too.
function htmlToText(html) {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<\/(p|div|h[1-6]|tr|li)>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&#39;|&rsquo;|&apos;/gi, "'")
    .replace(/&quot;/gi, '"')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]+\n/g, '\n')
    .trim();
}

// Shape a single Resend email payload from caller options.
function buildPayload({ to, subject, html, text, tags, headers, from, replyTo }) {
  const payload = {
    from: from || DEFAULT_FROM,
    to: Array.isArray(to) ? to : [to],
    subject,
    reply_to: replyTo || DEFAULT_REPLY_TO,
  };
  if (html) payload.html = html;
  // Always include a text part. Generate it from html if the caller only
  // gave html. A text-only caller (e.g. the drip) sends text alone, which
  // Resend accepts; we simply never send html with no text.
  payload.text = text || (html ? htmlToText(html) : '');
  if (tags) payload.tags = tags;
  if (headers) payload.headers = headers;
  return payload;
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// POST to Resend with one retry on 429 or 5xx. 4xx is not retried.
async function postWithRetry(url, apiKey, body, extraHeaders) {
  const send = () => fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      ...(extraHeaders || {}),
    },
    body: JSON.stringify(body),
  });

  let res = await send();
  if (res.status === 429 || res.status >= 500) {
    await sleep(500);
    res = await send();
  }
  return res;
}

// Send a single email. Never throws. Returns { ok, id, error }.
// opts: { to, subject, html, text, tags, idempotencyKey, headers, from, replyTo }
export async function sendEmail(env, opts) {
  if (!env.RESEND_API_KEY) {
    console.error('sendEmail: RESEND_API_KEY not configured');
    return { ok: false, id: null, error: 'RESEND_API_KEY not configured' };
  }

  const payload = buildPayload(opts);
  const extraHeaders = opts.idempotencyKey
    ? { 'Idempotency-Key': opts.idempotencyKey }
    : undefined;

  try {
    const res = await postWithRetry(RESEND_SEND_URL, env.RESEND_API_KEY, payload, extraHeaders);
    let data = null;
    try { data = await res.json(); } catch (_) { /* non-JSON body */ }

    if (!res.ok) {
      console.error('Resend send failed', res.status, JSON.stringify(data));
      return { ok: false, id: null, error: (data && data.message) || `HTTP ${res.status}` };
    }
    return { ok: true, id: data && data.id, error: null };
  } catch (e) {
    console.error('Resend send threw', e && e.message);
    return { ok: false, id: null, error: (e && e.message) || 'send failed' };
  }
}

// Send many emails via Resend's batch endpoint, chunked to BATCH_MAX.
// Fails soft per chunk: a bad chunk does not stop the others.
//
// messages: array of the same option objects sendEmail() takes. If a message
// carries an idempotencyKey, all keys in a chunk are folded into a single
// deterministic Idempotency-Key for that batch request (Resend's key is
// request-scoped, not per-message), so a retried chunk cannot double-send.
//
// Returns { sent, failed, chunks: [{ ok, count, error }] }.
export async function sendBatch(env, messages) {
  if (!env.RESEND_API_KEY) {
    console.error('sendBatch: RESEND_API_KEY not configured');
    return { sent: 0, failed: messages.length, chunks: [] };
  }
  if (!messages || messages.length === 0) {
    return { sent: 0, failed: 0, chunks: [] };
  }

  const chunks = [];
  for (let i = 0; i < messages.length; i += BATCH_MAX) {
    chunks.push(messages.slice(i, i + BATCH_MAX));
  }

  let sent = 0;
  let failed = 0;
  const results = [];

  for (const chunk of chunks) {
    const body = chunk.map((m) => buildPayload(m));

    const keys = chunk.map((m) => m.idempotencyKey).filter(Boolean);
    const extraHeaders = keys.length
      ? { 'Idempotency-Key': 'batch-' + djb2(keys.slice().sort().join('|')) }
      : undefined;

    try {
      const res = await postWithRetry(RESEND_BATCH_URL, env.RESEND_API_KEY, body, extraHeaders);
      if (res.ok) {
        sent += chunk.length;
        results.push({ ok: true, count: chunk.length, error: null });
      } else {
        let data = null;
        try { data = await res.json(); } catch (_) { /* non-JSON body */ }
        console.error('Resend batch failed', res.status, JSON.stringify(data));
        failed += chunk.length;
        results.push({ ok: false, count: chunk.length, error: (data && data.message) || `HTTP ${res.status}` });
      }
    } catch (e) {
      console.error('Resend batch threw', e && e.message);
      failed += chunk.length;
      results.push({ ok: false, count: chunk.length, error: (e && e.message) || 'batch failed' });
    }
  }

  return { sent, failed, chunks: results };
}
