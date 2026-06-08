export async function onRequestPost({ request, env }) {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  try {
    const body = await request.json().catch(() => ({}));
    const { pattern = '' } = body;

    const stripeKey = env.STRIPE_SECRET_KEY;
    const priceId = env.STRIPE_PRICE_ID;

    if (!stripeKey || !priceId) {
      return new Response(JSON.stringify({ error: 'Payment not configured' }), { status: 500, headers });
    }

    const params = new URLSearchParams({
      'payment_method_types[]': 'card',
      'line_items[0][price]': priceId,
      'line_items[0][quantity]': '1',
      mode: 'payment',
      success_url: 'https://adhdreflect.com/grow/welcome?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://adhdreflect.com/grow',
      'metadata[pattern]': pattern,
      'allow_promotion_codes': 'true',
    });

    const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + stripeKey,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const session = await res.json();

    if (!session.url) {
      return new Response(JSON.stringify({ error: 'Could not create checkout session', detail: session }), { status: 500, headers });
    }

    return new Response(JSON.stringify({ url: session.url }), { status: 200, headers });

  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}