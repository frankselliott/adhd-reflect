// ADHD Reflect — Subscribe endpoint
import { sendEmail, signUnsub, normalizeEmail } from './_lib/email.js';
import { PATTERN_NAMES, VALID_PATTERNS } from './_lib/patterns.js';

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
        email, pattern,
        signupDate: new Date().toISOString(),
        emailsSent: 0,
        nextEmailDate: new Date(Date.now() + 24*60*60*1000).toISOString(),
      }), { expirationTtl: 60*60*24*60 });
    }

    // Welcome email. Marketing send, so it carries a signed unsubscribe path.
    const token = await signUnsub(env, email);
    const q = 'e=' + encodeURIComponent(email) + '&t=' + token;
    const unsubUrl = 'https://adhdreflect.com/unsubscribe?' + q;
    const unsubApi = 'https://adhdreflect.com/api/unsubscribe?' + q;
    const result = await sendEmail(env, {
      to: email,
      subject: 'You\'re in. First one lands tomorrow.',
      tags: [{ name: 'type', value: 'welcome' }],
      headers: {
        'List-Unsubscribe': '<' + unsubApi + '>',
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
      },
      html: `
        <div style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;color:#1F2A37">
          <p style="font-size:16px;line-height:1.6;margin:0 0 16px">Your pattern: <strong>${patternName}</strong>.</p>
          <p style="font-size:16px;line-height:1.6;margin:0 0 16px">Tomorrow you'll get the first of four short emails on what that actually looks like in a real house on a bad night. Then one a week for three more weeks. No apps, no streaks, no homework.</p>
          <p style="font-size:16px;line-height:1.6;margin:0 0 16px">That's the whole thing. Four emails.</p>
          <p style="font-size:16px;line-height:1.6;margin:0 0 16px">In between, <a href="https://adhdreflect.com" style="color:#4A6FA5;text-decoration:none">adhdreflect.com</a> has a free tool for the moment you're in right now. Describe what's happening and it matches you to a card written for it.</p>
          <p style="font-size:16px;line-height:1.6;margin:0 0 24px">Worth saying once: most parenting advice assumes you're the calm one in the room. That falls apart when you've both got ADHD and you're both gone at the same time. That's the gap this is for.</p>
          <p style="font-size:14px;color:#56606E;line-height:1.6;margin:0">ADHD Reflect<br><a href="https://adhdreflect.com" style="color:#9B8BB4;text-decoration:none">adhdreflect.com</a></p>
          <p style="font-size:12px;color:#9B8BB4;line-height:1.6;margin:24px 0 0">Too many emails? <a href="${unsubUrl}" style="color:#9B8BB4">Unsubscribe any time</a>.</p>
        </div>
      `,
      text: `Your pattern: ${patternName}.

Tomorrow you'll get the first of four short emails on what that actually looks like in a real house on a bad night. Then one a week for three more weeks. No apps, no streaks, no homework.

That's the whole thing. Four emails.

In between, adhdreflect.com has a free tool for the moment you're in right now. Describe what's happening and it matches you to a card written for it.

Worth saying once: most parenting advice assumes you're the calm one in the room. That falls apart when you've both got ADHD and you're both gone at the same time. That's the gap this is for.

ADHD Reflect
adhdreflect.com

Unsubscribe any time: ${unsubUrl}`,
    });

    // Report the real send outcome so a silent failure is visible. The signup
    // itself succeeded (schedule written); welcomeSent reflects the email only.
    // Reasons are machine-readable and non-sensitive. The API key and any
    // Resend error body are logged by sendEmail(), never returned to the client.
    const welcomeSent = result.ok;
    const reason = result.ok
      ? 'sent'
      : (!env.RESEND_API_KEY ? 'email_not_configured' : 'send_failed');

    return new Response(JSON.stringify({ success: true, pattern, welcomeSent, reason }), { status: 200, headers });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers });
  }
}
export async function onRequestOptions() {
  return new Response(null, { headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }});
}
