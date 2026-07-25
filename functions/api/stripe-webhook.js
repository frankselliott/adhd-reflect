import { sendEmail } from './_lib/email.js';
import { purchaseEmailHtml } from './_lib/emails.js';
import { purchase as purchaseCopy } from './_lib/emailCopy.js';

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
          // Second delivery path: the success page resolves this on screen so a
          // buyer is never left with nothing if the email fails. Short 24h TTL,
          // because the session ID sits in browser history and support emails
          // and whoever holds it holds the access token.
          await env.GROW_DATA.put('session:' + session.id, accessUrl, { expirationTtl: 60 * 60 * 24 });
          const emailResult = await sendEmail(env, {
            to: email,
            subject: purchaseCopy.subject,
            tags: [{ name: 'type', value: 'purchase' }],
            // Stripe retries the same event on a 5xx; keying on the session ID
            // means a retry cannot send a second receipt.
            idempotencyKey: 'purchase-' + session.id,
            html: purchaseEmailHtml({ accessUrl }),
            text: purchaseCopy.text({ accessUrl }),
          });
          // Email must not fail silently. Return non-2xx so Stripe retries.
          // The idempotency key above is the Stripe session ID, so a retry
          // cannot double-send the receipt. sendEmail() has already logged the
          // Resend error body; log the session for correlation.
          if (!emailResult.ok) {
            console.error('purchase email failed for session', session.id, emailResult.error);
            return new Response('Purchase email delivery failed', { status: 500 });
          }
        }
      }
    }
    return new Response('OK', { status: 200 });
  } catch (e) {
    console.error('stripe-webhook error', e && e.message);
    return new Response('Internal error', { status: 500 });
  }
}