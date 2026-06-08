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

    // Resend access email
    if (env.SENDER_API_KEY) {
      const accessUrl = 'https://adhdreflect.com/grow/access?token=' + token;
      await fetch('https://api.sender.net/v2/transactional/send', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + env.SENDER_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: normalised,
          subject: 'Your Both of You access link',
          html: `
            <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px">
              <p style="font-size:16px;color:#1F2A37;margin-bottom:24px">Here's your access link for Both of You.</p>
              <p style="margin-bottom:24px">
                <a href="${accessUrl}" style="background:#4A6FA5;color:white;padding:14px 28px;border-radius:100px;text-decoration:none;display:inline-block;font-size:16px">
                  Open Both of You
                </a>
              </p>
              <p style="font-size:13px;color:#666;margin-bottom:8px">This link works on any device. Bookmark it or save this email — it's how you get in.</p>
              <p style="font-size:13px;color:#666">No password needed. Just the link.</p>
              <p style="font-size:13px;color:#999;margin-top:24px">adhdreflect.com</p>
            </div>
          `,
          text: 'Your Both of You access link: ' + accessUrl + '\n\nBookmark this link — it works on any device. No password needed.',
        }),
      });
    }

    return new Response(JSON.stringify({ success: true }), { headers });

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