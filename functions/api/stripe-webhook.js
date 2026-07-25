import { sendEmail } from './_lib/email.js';
import { purchaseEmailHtml } from './_lib/emails.js';

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
        {
          const accessUrl = 'https://adhdreflect.com/grow/access?token=' + token;
          await sendEmail(env, {
            to: email,
            subject: 'You\'re in. Both of You',
            tags: [{ name: 'type', value: 'purchase' }],
            // Stripe retries the same event on a 5xx; keying on the session ID
            // means a retry cannot send a second receipt.
            idempotencyKey: 'purchase-' + session.id,
            html: purchaseEmailHtml({ accessUrl }),
            text: `You're in.\n\nBoth of You is ready when you are.\n\nOpen it here:\n${accessUrl}\n\nThis link works on any device. Bookmark this email, it's how you get back in. No password needed.\n\nLost the link? Go to adhdreflect.com/grow and use "Recover access."\n\n---\n\nWhere to start: Module 1 is the beginning. If you've taken the pattern quiz, your first modules are waiting based on your result. Each module is 10-18 minutes on a phone.\n\nBetween modules: adhdreflect.com has a free search tool for hard moments, describe what's happening and it matches you to a card.\n\nNeed to talk to someone? online-therapy.com offers CBT-based therapy from $40/week. Use code THERAPY20 for 20% off your first month. (We earn a small commission if you sign up.)\n\n---\n\nADHD Reflect · adhdreflect.com\nThis is not medical advice.`,
          });
        }
      }
    }
    return new Response('OK', { status: 200 });
  } catch (e) {
    return new Response('Error: ' + e.message, { status: 500 });
  }
}