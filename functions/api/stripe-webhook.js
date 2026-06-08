async function verifyStripeSignature(body, signature, secret) {
  const parts = signature.split(',');
  const timestamp = parts.find(p => p.startsWith('t=')).split('=')[1];
  const sig = parts.find(p => p.startsWith('v1=')).split('=')[1];
  const payload = timestamp + '.' + body;
  const key = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const computed = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload));
  const computedHex = Array.from(new Uint8Array(computed)).map(b => b.toString(16).padStart(2,'0')).join('');
  return computedHex === sig;
}

function generateToken() {
  const arr = new Uint8Array(32);
  crypto.getRandomValues(arr);
  return Array.from(arr).map(b => b.toString(16).padStart(2,'0')).join('');
}

export async function onRequestPost({ request, env }) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');
    const webhookSecret = env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret || !signature) {
      return new Response('Webhook secret not configured', { status: 400 });
    }
    const valid = await verifyStripeSignature(body, signature, webhookSecret);
    if (!valid) {
      return new Response('Invalid signature', { status: 400 });
    }
    const event = JSON.parse(body);
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const email = session.customer_details?.email;
      const pattern = session.metadata?.pattern || '';
      const source = session.metadata?.source || 'direct';
      if (email && env.GROW_DATA) {
        const token = generateToken();
        const userData = {
          email,
          pattern,
          token,
          source,
          purchasedAt: new Date().toISOString(),
          progress: {},
          reflections: {},
          midCourseCheckin: null,
        };
        await env.GROW_DATA.put('token:' + token, JSON.stringify(userData), {
          expirationTtl: 60 * 60 * 24 * 365 * 2,
        });
        await env.GROW_DATA.put('email:' + email.toLowerCase().trim(), token, {
          expirationTtl: 60 * 60 * 24 * 365 * 2,
        });
        if (env.SENDER_API_KEY) {
          const accessUrl = 'https://adhdreflect.com/grow/access?token=' + token;
          await fetch('https://api.sender.net/v2/transactional/send', {
            method: 'POST',
            headers: {
              Authorization: 'Bearer ' + env.SENDER_API_KEY,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              to: email,
              subject: 'You\'re in — Both of You',
              html: `
                <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px">
                  <p style="font-size:22px;color:#1F2A37;font-weight:300;margin-bottom:8px">You're in.</p>
                  <p style="font-size:16px;color:#56606E;margin-bottom:28px">Both of You is ready when you are.</p>
                  <p style="margin-bottom:28px">
                    <a href="${accessUrl}" style="background:#4A6FA5;color:white;padding:16px 32px;border-radius:100px;text-decoration:none;display:inline-block;font-size:16px;font-weight:500">
                      Open Both of You
                    </a>
                  </p>
                  <p style="font-size:14px;color:#56606E;margin-bottom:8px"><strong>This link works on any device.</strong> Bookmark it, or come back to this email whenever you want to access the course.</p>
                  <p style="font-size:14px;color:#56606E;margin-bottom:24px">No password needed. No account to create. Just the link.</p>
                  <hr style="border:none;border-top:1px solid #eee;margin:24px 0" />
                  <p style="font-size:13px;color:#999;margin-bottom:4px">Lost the link later? You can recover it at:</p>
                  <p style="font-size:13px;color:#4A6FA5;margin-bottom:24px">adhdreflect.com/grow → "Recover access"</p>
                  <p style="font-size:13px;color:#999">adhdreflect.com</p>
                </div>
              `,
              text: 'You\'re in.\n\nYour Both of You access link: ' + accessUrl + '\n\nThis link works on any device. Bookmark it — it\'s how you get back in. No password needed.\n\nLost the link? Recover it at adhdreflect.com/grow\n\nadhdreflect.com',
            }),
          });
        }
      }
    }
    return new Response('OK', { status: 200 });
  } catch (e) {
    return new Response('Error: ' + e.message, { status: 500 });
  }
}