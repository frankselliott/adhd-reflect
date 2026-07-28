import { sendEmail, normalizeEmail } from '../_lib/email.js';
import { purchaseEmailHtml } from '../_lib/emails.js';
import { purchase as purchaseCopy } from '../_lib/emailCopy.js';

function generateToken() {
  const arr = new Uint8Array(32);
  crypto.getRandomValues(arr);
  return Array.from(arr).map(b => b.toString(16).padStart(2,'0')).join('');
}

// Deliberately loose. We are not policing address validity, only avoiding
// writing obvious junk into the email: index and handing it to Resend.
function looksLikeEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
}

export async function onRequestPost({ request, env }) {
  const headers = { 'Content-Type': 'application/json' };
  try {
    const { code, pattern = '', email = '' } = await request.json();
    if (!code || !env.GROW_DATA) {
      return new Response(JSON.stringify({ error: 'Invalid request' }), { status: 400, headers });
    }

    // Email is optional. Without it there is no recovery path, which the form
    // says plainly. With it, this redemption behaves like a purchase: an
    // email: -> token mapping that /api/grow/recover can resolve later.
    const normalised = normalizeEmail(email);
    const hasEmail = normalised.length > 0;
    if (hasEmail && !looksLikeEmail(normalised)) {
      return new Response(JSON.stringify({ error: 'That email address doesn\'t look right. Check it, or leave it blank.' }), { status: 400, headers });
    }

    const codeKey = 'discount:' + code.toUpperCase().trim();
    const raw = await env.GROW_DATA.get(codeKey);
    if (!raw) {
      return new Response(JSON.stringify({ error: 'That code doesn\'t exist. Check the spelling and try again.' }), { status: 400, headers });
    }

    const codeData = JSON.parse(raw);

    if (!codeData.active) {
      return new Response(JSON.stringify({ error: 'That code is no longer active.' }), { status: 400, headers });
    }
    if (codeData.type !== 'free') {
      return new Response(JSON.stringify({ error: 'That code isn\'t a free access code.' }), { status: 400, headers });
    }
    if (codeData.expiresAt && new Date(codeData.expiresAt) < new Date()) {
      return new Response(JSON.stringify({ error: 'That code has expired.' }), { status: 400, headers });
    }
    if (codeData.maxUses !== null && codeData.usedCount >= codeData.maxUses) {
      return new Response(JSON.stringify({ error: 'That code has reached its usage limit.' }), { status: 400, headers });
    }

    // Already have access on this email? Hand back the existing token instead of
    // minting a second one. Two reasons: overwriting email: -> token would
    // orphan whatever they already had (including a paid purchase), and a code
    // should not be spent on access the person already holds.
    if (hasEmail) {
      const existingToken = await env.GROW_DATA.get('email:' + normalised);
      if (existingToken) {
        const existingUser = await env.GROW_DATA.get('token:' + existingToken);
        if (existingUser) {
          return new Response(JSON.stringify({
            success: true,
            accessUrl: 'https://adhdreflect.com/grow/access?token=' + existingToken,
            alreadyHadAccess: true,
          }), { headers });
        }
      }
    }

    // Calculate access expiry if time-limited
    const accessDays = codeData.accessDays || null;
    const accessExpiresAt = accessDays
      ? new Date(Date.now() + accessDays * 24 * 60 * 60 * 1000).toISOString()
      : null;

    // Set KV TTL based on access duration
    const kvTtl = accessDays
      ? accessDays * 24 * 60 * 60
      : 60 * 60 * 24 * 365 * 2;

    const token = generateToken();
    const userData = {
      // Real address when we have one, so recovery and support both work.
      // The synthetic fallback keeps the shape identical for anonymous
      // redemptions, and is never sent to.
      email: hasEmail ? normalised : 'free-access-' + token.substring(0, 8) + '@adhdreflect.com',
      emailCaptured: hasEmail,
      pattern,
      token,
      purchasedAt: new Date().toISOString(),
      source: 'free-code:' + code,
      accessExpiresAt,
      accessDays,
      progress: {},
      reflections: {},
      midCourseCheckin: null,
    };

    // Order matters. Grant access first, spend the code second. If the token
    // write fails the code is still unused, so the person can simply try again
    // rather than holding a burnt code and nothing to show for it.
    await env.GROW_DATA.put('token:' + token, JSON.stringify(userData), {
      expirationTtl: kvTtl,
    });

    // The recovery index. Same TTL as the token so a time-limited code does not
    // leave a mapping pointing at access that has already lapsed.
    if (hasEmail) {
      await env.GROW_DATA.put('email:' + normalised, token, { expirationTtl: kvTtl });
    }

    // KNOWN LIMITATION: this read-increment-write is not atomic (KV has no
    // atomic increment), so two simultaneous redemptions of a limited code can
    // both pass the maxUses check and both succeed, slightly overshooting the
    // limit. Accepted: the overshoot is bounded by concurrency and low stakes.
    // A hard cap would need Durable Objects. See also grow/checkout.js.
    codeData.usedCount = (codeData.usedCount || 0) + 1;
    await env.GROW_DATA.put(codeKey, JSON.stringify(codeData));

    const accessUrl = 'https://adhdreflect.com/grow/access?token=' + token;

    // Transactional only. Redeeming a code is not consent to marketing, so this
    // deliberately does not touch the contact list or the drip.
    let emailSent = false;
    if (hasEmail) {
      const result = await sendEmail(env, {
        to: normalised,
        subject: purchaseCopy.subject,
        tags: [{ name: 'type', value: 'free-access' }],
        // Keyed on the token, which is unique per redemption, so a double
        // submit cannot send two access emails.
        idempotencyKey: 'free-access-' + token.substring(0, 24),
        html: purchaseEmailHtml({ accessUrl }),
        text: purchaseCopy.text({ accessUrl }),
      });
      emailSent = !!result.ok;
      // Access has already been granted and is returned below, so a failed
      // send is logged and shrugged off rather than failing the redemption.
      if (!emailSent) console.error('free-access email failed for token', token.substring(0, 8), result.error);
    }

    return new Response(JSON.stringify({
      success: true,
      accessUrl,
      accessDays,
      accessExpiresAt,
      emailSent,
    }), { headers });

  } catch(e) {
    console.error('free-access error', e && e.message);
    return new Response(JSON.stringify({ error: 'Something went wrong.' }), { status: 500, headers });
  }
}
