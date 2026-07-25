// ADHD Reflect — Subscribe endpoint
import { sendEmail, signUnsub, normalizeEmail } from './_lib/email.js';

export async function onRequestPost({ request, env }) {
  const headers = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };
  try {
    const body = await request.json();
    const { email, pattern } = body;
    if (!email || !pattern) {
      return new Response(JSON.stringify({ error: 'Email and pattern required' }), { status: 400, headers });
    }

    // Honour unsubscribes. Someone who opted out re-subscribes only via the
    // resubscribe link, not by signing up again.
    if (env.SEARCH_LOGS && await env.SEARCH_LOGS.get('unsub:' + normalizeEmail(email))) {
      return new Response(JSON.stringify({ success: true, pattern }), { status: 200, headers });
    }

    // Record the drip schedule. send-scheduled.js reads this and sends the
    // pattern practices over the following weeks.
    if (env.SEARCH_LOGS) {
      const scheduleKey = 'email:' + email.toLowerCase().trim();
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
    await sendEmail(env, {
      to: email,
      subject: 'You\'re in. Your first practice lands tomorrow.',
      tags: [{ name: 'type', value: 'welcome' }],
      headers: {
        'List-Unsubscribe': '<' + unsubApi + '>',
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
      },
      html: `
        <div style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;color:#1F2A37">
          <p style="font-size:16px;line-height:1.6;margin:0 0 16px">Thanks for signing up.</p>
          <p style="font-size:16px;line-height:1.6;margin:0 0 16px">You came out as a <strong>${pattern}</strong>. Over the next few weeks I'll send you four short practices built for that pattern. The first one lands tomorrow. No apps, no streaks, just one small thing to try each time.</p>
          <p style="font-size:16px;line-height:1.6;margin:0 0 24px">In between, <a href="https://adhdreflect.com" style="color:#4A6FA5;text-decoration:none">adhdreflect.com</a> has a free search tool for the hard moment you're in right now. Describe what's happening and it matches you to a card.</p>
          <p style="font-size:14px;color:#56606E;line-height:1.6;margin:0">ADHD Reflect<br><a href="https://adhdreflect.com" style="color:#9B8BB4;text-decoration:none">adhdreflect.com</a></p>
          <p style="font-size:12px;color:#9B8BB4;line-height:1.6;margin:24px 0 0">Too many emails? <a href="${unsubUrl}" style="color:#9B8BB4">Unsubscribe any time</a>.</p>
        </div>
      `,
      text: `Thanks for signing up.

You came out as a ${pattern}. Over the next few weeks I'll send you four short practices built for that pattern. The first one lands tomorrow. No apps, no streaks, just one small thing to try each time.

In between, adhdreflect.com has a free search tool for the hard moment you're in right now. Describe what's happening and it matches you to a card.

ADHD Reflect
adhdreflect.com

Unsubscribe any time: ${unsubUrl}`,
    });

    return new Response(JSON.stringify({ success: true, pattern }), { status: 200, headers });
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
