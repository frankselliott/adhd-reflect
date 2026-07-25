import { sendEmail } from '../_lib/email.js';
import { recoveryEmailHtml } from '../_lib/emails.js';

export async function onRequestPost({ request, env }) {
  const headers = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };

  try {
    const { email } = await request.json();

    if (!email || !env.GROW_DATA) {
      return new Response(JSON.stringify({ error: 'Email required.' }), { status: 400, headers });
    }

    const normalised = email.toLowerCase().trim();
    const token = await env.GROW_DATA.get('email:' + normalised);

    if (!token) {
      // Return success either way — don't reveal whether email exists
      return new Response(JSON.stringify({ success: true }), { headers });
    }

    // Verify token still valid
    const userData = await env.GROW_DATA.get('token:' + token);
    if (!userData) {
      return new Response(JSON.stringify({ success: true }), { headers });
    }

    // Re-send the access email
    {
      const accessUrl = 'https://adhdreflect.com/grow/access?token=' + token;
      await sendEmail(env, {
        to: normalised,
        subject: 'Your Both of You access link',
        tags: [{ name: 'type', value: 'recovery' }],
        html: recoveryEmailHtml({ accessUrl }),
        text: 'Your Both of You access link: ' + accessUrl + '\n\nBookmark this link — it works on any device. No password needed.',
      });
    }

    return new Response(JSON.stringify({ success: true }), { headers });

  } catch (e) {
    console.error('recover error', e && e.message);
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