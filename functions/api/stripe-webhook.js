import { sendEmail } from './_lib/email.js';

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
            html: `
                <div style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;max-width:540px;margin:0 auto;padding:40px 24px;background:#F7F5F0">

                  <!-- Logo mark -->
                  <div style="margin-bottom:32px">
                    <svg width="28" height="36" viewBox="0 0 32 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16 2C16 2,28 10,28 20C28 27.7,22.6,33,16,33C9.4,33,4,27.7,4,20C4,10,16,2,16,2Z" fill="#4A6FA5"/>
                      <path d="M16 40C16 40,28 32,28 22C28 14.3,22.6,9,16,9C9.4,9,4,14.3,4,22C4,32,16,40,16,40Z" fill="#A8C3A0" opacity="0.8"/>
                    </svg>
                  </div>

                  <!-- Heading -->
                  <h1 style="font-size:28px;font-weight:300;color:#1F2A37;margin:0 0 8px;line-height:1.2">You're in.</h1>
                  <p style="font-size:16px;color:#56606E;margin:0 0 32px;line-height:1.6">Both of You is ready when you are. No rush. No schedule.</p>

                  <!-- Access button -->
                  <div style="margin-bottom:32px">
                    <a href="${accessUrl}" style="display:inline-block;background:#4A6FA5;color:white;padding:16px 36px;border-radius:100px;text-decoration:none;font-size:16px;font-weight:500;letter-spacing:0.01em">
                      Open Both of You →
                    </a>
                  </div>

                  <!-- Access link instructions -->
                  <div style="background:white;border-radius:12px;padding:20px 24px;margin-bottom:24px;border:1px solid rgba(31,42,55,0.08)">
                    <p style="font-size:13px;font-weight:600;color:#1F2A37;margin:0 0 6px;text-transform:uppercase;letter-spacing:0.08em">Your access link</p>
                    <p style="font-size:14px;color:#56606E;line-height:1.6;margin:0 0 8px">This email is your key. <strong style="color:#1F2A37">Bookmark it</strong>, it's how you get back in on any device. No password. No account.</p>
                    <p style="font-size:13px;color:#9B8BB4;margin:0">Lost it later? Go to <a href="https://adhdreflect.com/grow" style="color:#9B8BB4">adhdreflect.com/grow</a> and use "Recover access."</p>
                  </div>

                  <!-- What to do first -->
                  <div style="margin-bottom:32px">
                    <p style="font-size:14px;font-weight:600;color:#1F2A37;margin:0 0 12px">Where to start</p>
                    <p style="font-size:14px;color:#56606E;line-height:1.6;margin:0 0 10px">The course begins in Module 1, but if you've already taken the pattern quiz, your first modules are waiting for you based on your result.</p>
                    <p style="font-size:14px;color:#56606E;line-height:1.6;margin:0">Each module takes 10–18 minutes. You don't need to sit down. You don't need to be in a good headspace. You just need a few minutes and a phone.</p>
                  </div>

                  <!-- Divider -->
                  <div style="border-top:1px solid rgba(31,42,55,0.08);margin:0 0 24px"></div>

                  <!-- Site mention -->
                  <div style="margin-bottom:20px">
                    <p style="font-size:14px;color:#56606E;line-height:1.6;margin:0 0 6px">Between modules, <a href="https://adhdreflect.com" style="color:#4A6FA5;text-decoration:none">adhdreflect.com</a> has a search tool for the hard moment you're in right now, describe what's happening and it matches you to a card. Free, no login.</p>
                  </div>

                  <!-- Therapy mention -->
                  <div style="margin-bottom:32px">
                    <p style="font-size:14px;color:#56606E;line-height:1.6;margin:0">If you're at the point where you want to talk to someone, <a href="https://go.online-therapy.com/aff_c?offer_id=2&aff_id=6176" style="color:#4A6FA5;text-decoration:none">online-therapy.com</a> offers CBT-based therapy from $40/week with a 20% first-month discount using code <strong style="color:#1F2A37">THERAPY20</strong>. We use this link because we think it's genuinely useful, we also earn a small commission if you sign up.</p>
                  </div>

                  <!-- Footer -->
                  <div style="border-top:1px solid rgba(31,42,55,0.08);padding-top:20px">
                    <p style="font-size:12px;color:#9B8BB4;margin:0 0 4px">ADHD Reflect · <a href="https://adhdreflect.com" style="color:#9B8BB4;text-decoration:none">adhdreflect.com</a></p>
                    <p style="font-size:12px;color:#9B8BB4;margin:0">This is not medical advice. Both of You is structured practical content, not a clinical intervention.</p>
                  </div>

                </div>
              `,
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