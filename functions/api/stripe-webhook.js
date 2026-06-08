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
              subject: 'Your access to Both of You',
              html: '<p style="font-family:sans-serif">You\'re in.</p><p style="font-family:sans-serif"><a href="' + accessUrl + '" style="background:#4A6FA5;color:white;padding:14px 28px;border-radius:100px;text-decoration:none;display:inline-block">Open Both of You</a></p><p style="font-family:sans-serif;color:#666;font-size:13px">Bookmark this link — it\'s how you get back in. No password needed.</p><p style="font-family:sans-serif;color:#666;font-size:13px">adhdreflect.com</p>',
              text: 'Your access link: ' + accessUrl,
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