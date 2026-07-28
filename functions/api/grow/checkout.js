export async function onRequestPost({ request, env }) {
  const headers = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };
  try {
    const body = await request.json().catch(() => ({}));
    const { pattern = '', discountCode = '', source = '' } = body;
    const stripeKey = env.STRIPE_SECRET_KEY;
    const priceId = env.STRIPE_PRICE_ID;
    if (!stripeKey || !priceId) {
      return new Response(JSON.stringify({ error: 'Payment not configured' }), { status: 500, headers });
    }

    // Handle free code — skip Stripe entirely
    if (discountCode && env.GROW_DATA) {
      const codeKey = 'discount:' + discountCode.toUpperCase().trim();
      const raw = await env.GROW_DATA.get(codeKey);
      if (raw) {
        const codeData = JSON.parse(raw);
        if (codeData.active && codeData.type === 'free') {
          // Check limits
          const expired = codeData.expiresAt && new Date(codeData.expiresAt) < new Date();
          const maxed = codeData.maxUses !== null && codeData.usedCount >= codeData.maxUses;
          if (!expired && !maxed) {
            // Validate only. Do NOT increment here.
            // This used to spend the code, and then /api/grow/free-access spent
            // it a second time on the very next request, which meant any code
            // with maxUses: 1 was already exhausted by the time the user
            // arrived and they were told it had hit its limit. free-access.js
            // is now the only place usedCount moves.
            return new Response(JSON.stringify({
              url: 'https://adhdreflect.com/grow/free-access?code=' + encodeURIComponent(discountCode.toUpperCase().trim()) + '&pattern=' + encodeURIComponent(pattern),
            }), { status: 200, headers });
          }
        }
      }
    }

    // Build Stripe session params
    const params = new URLSearchParams({
      'payment_method_types[]': 'card',
      'line_items[0][price]': priceId,
      'line_items[0][quantity]': '1',
      mode: 'payment',
      success_url: 'https://adhdreflect.com/grow/welcome?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://adhdreflect.com/grow',
      'metadata[pattern]': pattern,
      'metadata[source]': source,
      'allow_promotion_codes': 'true',
    });

    // Add Stripe coupon if discount code provided and not free
    if (discountCode && env.GROW_DATA) {
      const codeKey = 'discount:' + discountCode.toUpperCase().trim();
      const raw = await env.GROW_DATA.get(codeKey);
      if (raw) {
        const codeData = JSON.parse(raw);
        if (codeData.active && codeData.type === 'percent' && codeData.stripeCouponId) {
          params.set('discounts[0][coupon]', codeData.stripeCouponId);
        }
      }
    }

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
      console.error('checkout: stripe session error', JSON.stringify(session));
      return new Response(JSON.stringify({ error: 'Could not create checkout session.' }), { status: 500, headers });
    }
    return new Response(JSON.stringify({ url: session.url }), { status: 200, headers });
  } catch (e) {
    console.error('checkout error', e && e.message);
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