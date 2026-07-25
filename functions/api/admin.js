// Paginate a KV prefix fully. A single list() caps at ~1000 keys, so without a
// cursor the dashboard silently under-counts. Bounded at maxPages so a huge
// namespace cannot run away in one admin request.
async function listAllKeys(kv, prefix, maxPages = 50) {
  const keys = [];
  let cursor, pages = 0;
  do {
    const res = await kv.list({ prefix, cursor });
    keys.push(...res.keys);
    cursor = res.list_complete ? undefined : res.cursor;
    pages++;
  } while (cursor && pages < maxPages);
  return keys;
}

// Both of You price, so the shared Stripe account's other businesses do not
// pollute the numbers. Filtering to this is essential.
const PRICE_ID = 'price_1Tfz2LCVv6feGeb2rYx6q2WQ';
const CACHE_TTL = 5 * 60; // 5 minutes
const STRIPE_MAX_PAGES = 10;

// 5-minute KV cache so the dashboard does not hammer Stripe or Resend on every
// refresh. Best-effort: a cache miss or KV error just recomputes.
async function cached(env, key, fn) {
  try {
    if (env.SEARCH_LOGS) {
      const hit = await env.SEARCH_LOGS.get('admincache:' + key);
      if (hit) return JSON.parse(hit);
    }
  } catch (e) { /* recompute */ }
  const val = await fn();
  try {
    if (env.SEARCH_LOGS) await env.SEARCH_LOGS.put('admincache:' + key, JSON.stringify(val), { expirationTtl: CACHE_TTL });
  } catch (e) { /* best-effort */ }
  return val;
}

async function resendGet(env, path) {
  const res = await fetch('https://api.resend.com' + path, {
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}` },
  });
  if (!res.ok) throw new Error('resend ' + res.status);
  return res.json();
}

async function stripeGet(env, path) {
  const res = await fetch('https://api.stripe.com/v1/' + path, {
    headers: { Authorization: 'Bearer ' + env.STRIPE_SECRET_KEY },
  });
  if (!res.ok) throw new Error('stripe ' + res.status);
  return res.json();
}

// ── Email section: KV (reliable) + Resend (best-effort, cached) ──
async function buildEmailSection(env) {
  const out = { subscriberCount: 0, patternBreakdown: {}, dripFunnel: {0:0,1:0,2:0,3:0,4:0},
    unsubCount: 0, unsubRate: 0, lastDripRun: null,
    resendContactCount: null, recentSends: [], suppressionCount: null, syncDiverges: false };

  if (env.SEARCH_LOGS) {
    const emailKeys = await listAllKeys(env.SEARCH_LOGS, 'email:');
    for (const k of emailKeys) {
      const raw = await env.SEARCH_LOGS.get(k.name);
      if (!raw) continue;
      let s; try { s = JSON.parse(raw); } catch (e) { continue; }
      const p = s.pattern || 'unknown';
      out.patternBreakdown[p] = (out.patternBreakdown[p] || 0) + 1;
      const step = Math.min(4, Math.max(0, s.emailsSent || 0));
      out.dripFunnel[step] = (out.dripFunnel[step] || 0) + 1;
    }
    out.subscriberCount = emailKeys.length;
    out.unsubCount = (await listAllKeys(env.SEARCH_LOGS, 'unsub:')).length;
    const denom = out.subscriberCount + out.unsubCount;
    out.unsubRate = denom > 0 ? Math.round(out.unsubCount / denom * 1000) / 10 : 0;
    try { const r = await env.SEARCH_LOGS.get('stats:last-drip-run'); if (r) out.lastDripRun = JSON.parse(r); } catch (e) {}
  }

  const resend = await cached(env, 'resend-email', async () => {
    const r = { contactCount: null, recentSends: [], suppressionCount: null };
    if (!env.RESEND_API_KEY) return r;
    try {
      const emails = await resendGet(env, '/emails?limit=20');
      r.recentSends = (emails.data || []).map(e => ({
        to: Array.isArray(e.to) ? e.to.join(', ') : (e.to || ''),
        subject: e.subject || '',
        status: e.last_event || 'sent',
        created_at: e.created_at || null,
      }));
    } catch (e) { /* leave empty */ }
    try {
      const sup = await resendGet(env, '/suppressions');
      r.suppressionCount = (sup.data || []).length;
    } catch (e) {}
    try {
      const contacts = await resendGet(env, '/contacts');
      r.contactCount = (contacts.data || []).length;
    } catch (e) {}
    return r;
  });
  out.resendContactCount = resend.contactCount;
  out.recentSends = resend.recentSends;
  out.suppressionCount = resend.suppressionCount;
  // Sync is behind if Resend holds fewer contacts than KV has active
  // subscribers (contacts should persist beyond the 60-day KV window, so
  // Resend < KV means the KV -> Resend mirror is not keeping up).
  out.syncDiverges = out.resendContactCount != null && out.resendContactCount < out.subscriberCount;
  return out;
}

// ── Revenue section: Stripe, filtered to the Both of You price, cached ──
async function buildRevenueSection(env) {
  if (!env.STRIPE_SECRET_KEY) return { configured: false };
  return cached(env, 'revenue', async () => {
    const out = { configured: true, settlementCurrency: null,
      allTime: { count: 0, revenue: 0 }, last30: { count: 0, revenue: 0 },
      recent: [], byCountry: {}, refunds: { count: 0, amount: 0 }, discountImpact: 0 };
    const now = Math.floor(Date.now() / 1000);
    const cutoff = now - 30 * 24 * 60 * 60;
    const chargeIds = new Set();

    let startingAfter = null, pages = 0;
    do {
      let path = 'checkout/sessions?limit=100&expand[]=data.line_items&expand[]=data.payment_intent.latest_charge.balance_transaction';
      if (startingAfter) path += '&starting_after=' + startingAfter;
      let page;
      try { page = await stripeGet(env, path); } catch (e) { break; }
      const data = page.data || [];
      for (const s of data) {
        const items = (s.line_items && s.line_items.data) || [];
        if (!items.some(li => li.price && li.price.id === PRICE_ID)) continue;
        if (s.payment_status !== 'paid') continue;

        const pi = (s.payment_intent && typeof s.payment_intent === 'object') ? s.payment_intent : null;
        const charge = (pi && pi.latest_charge && typeof pi.latest_charge === 'object') ? pi.latest_charge : null;
        const bt = (charge && charge.balance_transaction && typeof charge.balance_transaction === 'object') ? charge.balance_transaction : null;
        const settleAmount = bt ? bt.amount : null;
        if (bt && bt.currency) out.settlementCurrency = bt.currency;
        const amount = settleAmount != null ? settleAmount : (s.amount_total || 0);

        out.allTime.count++; out.allTime.revenue += amount;
        if (s.created >= cutoff) { out.last30.count++; out.last30.revenue += amount; }
        const country = (s.customer_details && s.customer_details.address && s.customer_details.address.country) || 'unknown';
        out.byCountry[country] = (out.byCountry[country] || 0) + 1;
        out.discountImpact += (s.total_details && s.total_details.amount_discount) || 0;
        if (charge && charge.id) chargeIds.add(charge.id);
        if (out.recent.length < 20) {
          out.recent.push({
            date: s.created,
            localAmount: s.amount_total, localCurrency: s.currency,
            settleAmount, settleCurrency: bt ? bt.currency : null,
            email: (s.customer_details && s.customer_details.email) || null,
            country,
          });
        }
      }
      startingAfter = (page.has_more && data.length) ? data[data.length - 1].id : null;
      pages++;
    } while (startingAfter && pages < STRIPE_MAX_PAGES);

    // Refunds, restricted to charges from our sessions.
    try {
      let ra = null, rp = 0;
      do {
        let path = 'refunds?limit=100' + (ra ? '&starting_after=' + ra : '');
        const page = await stripeGet(env, path);
        const data = page.data || [];
        for (const rf of data) {
          if (chargeIds.has(rf.charge)) { out.refunds.count++; out.refunds.amount += rf.amount || 0; }
        }
        ra = (page.has_more && data.length) ? data[data.length - 1].id : null;
        rp++;
      } while (ra && rp < STRIPE_MAX_PAGES);
    } catch (e) { /* refunds best-effort */ }

    return out;
  });
}

export async function onRequestGet({ env, request }) {
  const url = new URL(request.url);
  const key = url.searchParams.get('key');
  const section = url.searchParams.get('section') || 'all';

  if (!env.ADMIN_KEY || key !== env.ADMIN_KEY) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401, headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const result = {};

    // ── Search analytics (from SEARCH_LOGS KV) ──
    if (section === 'all' || section === 'search') {
      if (env.SEARCH_LOGS) {
        const searchKeys = await listAllKeys(env.SEARCH_LOGS, 'search:');
        const logs = [];
        for (const k of searchKeys) {
          const value = await env.SEARCH_LOGS.get(k.name);
          if (value) { try { logs.push(JSON.parse(value)); } catch(e) {} }
        }
        logs.sort((a, b) => (b.timestamp || '').localeCompare(a.timestamp || ''));
        const total = logs.length;
        const matched = logs.filter(l => l.matched).length;
        const unmatched = logs.filter(l => !l.matched && !l.crisis).length;
        const crisis = logs.filter(l => l.crisis).length;
        const uniqueQueries = [...new Set(logs.map(l => l.query?.toLowerCase().trim()))].length;
        const cardCounts = {};
        logs.forEach(l => {
          if (l.topMatch) {
            cardCounts[l.topMatch] = cardCounts[l.topMatch] || { id: l.topMatch, title: l.topMatchTitle, count: 0 };
            cardCounts[l.topMatch].count++;
          }
        });
        // Daily search counts (last 30 days)
        const dailyCounts = {};
        logs.forEach(l => {
          if (l.timestamp) {
            const day = l.timestamp.substring(0, 10);
            dailyCounts[day] = (dailyCounts[day] || 0) + 1;
          }
        });
        result.search = {
          summary: { total, matched, unmatched, crisis, uniqueQueries },
          topCards: Object.values(cardCounts).sort((a, b) => b.count - a.count).slice(0, 20),
          unmatchedQueries: logs.filter(l => !l.matched && !l.crisis).map(l => ({ query: l.query, timestamp: l.timestamp })),
          recentSearches: logs.slice(0, 50),
          dailyCounts,
        };
      }
    }

    // ── Course analytics (from GROW_DATA KV) ──
    if (section === 'all' || section === 'course') {
      if (env.GROW_DATA) {
        const tokenKeys = await listAllKeys(env.GROW_DATA, 'token:');
        const users = [];
        for (const k of tokenKeys) {
          const value = await env.GROW_DATA.get(k.name);
          if (value) {
            try {
              const u = JSON.parse(value);
              users.push({
                pattern: u.pattern || 'unknown',
                purchasedAt: u.purchasedAt,
                completedCount: Object.keys(u.progress || {}).length,
                hasCheckin: !!u.midCourseCheckin,
                completedAll: Object.keys(u.progress || {}).length >= 20,
                // Anonymise — no email, no token
                source: u.source || 'direct',
              });
            } catch(e) {}
          }
        }
        users.sort((a, b) => (b.purchasedAt || '').localeCompare(a.purchasedAt || ''));

        const totalPurchasers = users.length;
        const completedCourse = users.filter(u => u.completedAll).length;
        const reachedHalfway = users.filter(u => u.completedCount >= 10).length;
        const startedOnly = users.filter(u => u.completedCount < 3).length;

        // Pattern distribution
        const patternCounts = {};
        users.forEach(u => {
          patternCounts[u.pattern] = (patternCounts[u.pattern] || 0) + 1;
        });

        // Source distribution
        const sourceCounts = {};
        users.forEach(u => {
          sourceCounts[u.source] = (sourceCounts[u.source] || 0) + 1;
        });

        // Module completion rates
        const moduleCounts = {};
        for (const k of tokenKeys) {
          const value = await env.GROW_DATA.get(k.name);
          if (value) {
            try {
              const u = JSON.parse(value);
              Object.keys(u.progress || {}).forEach(mid => {
                moduleCounts[mid] = (moduleCounts[mid] || 0) + 1;
              });
            } catch(e) {}
          }
        }

        // Daily purchase counts
        const purchaseDailyCounts = {};
        users.forEach(u => {
          if (u.purchasedAt) {
            const day = u.purchasedAt.substring(0, 10);
            purchaseDailyCounts[day] = (purchaseDailyCounts[day] || 0) + 1;
          }
        });

        // Average completion
        const avgCompletion = users.length > 0
          ? Math.round(users.reduce((sum, u) => sum + u.completedCount, 0) / users.length)
          : 0;

        result.course = {
          summary: { totalPurchasers, completedCourse, reachedHalfway, startedOnly, avgCompletion },
          patternDistribution: patternCounts,
          sourceDistribution: sourceCounts,
          moduleCompletionCounts: moduleCounts,
          purchaseDailyCounts,
          recentPurchasers: users.slice(0, 20),
        };
      }
    }

    // ── Discount codes (from GROW_DATA KV, prefix discount:) ──
    if (section === 'all' || section === 'discounts') {
      if (env.GROW_DATA) {
        const discountKeys = await listAllKeys(env.GROW_DATA, 'discount:');
        const codes = [];
        for (const k of discountKeys) {
          const value = await env.GROW_DATA.get(k.name);
          if (value) {
            try { codes.push(JSON.parse(value)); } catch(e) {}
          }
        }
        result.discounts = { codes };
      }
    }

    // ── Email (KV + Resend). Lazy: only on its own tab, never in 'all', so
    //    login stays fast and Resend is not called on every dashboard load. ──
    if (section === 'email') {
      result.email = await buildEmailSection(env);
    }

    // ── Revenue (Stripe). Lazy for the same reason, plus 5-minute KV cache. ──
    if (section === 'revenue') {
      result.revenue = await buildRevenueSection(env);
    }

    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (e) {
    console.error('admin error', e && e.message);
    return new Response(JSON.stringify({ error: 'Something went wrong.' }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function onRequestPost({ env, request }) {
  const url = new URL(request.url);
  const key = url.searchParams.get('key');
  if (!env.ADMIN_KEY || key !== env.ADMIN_KEY) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401, headers: { 'Content-Type': 'application/json' },
    });
  }

  const body = await request.json();
  const { action } = body;

  // ── Create discount code ──
  if (action === 'create_discount') {
    const { code, type, value, maxUses, expiresAt, notes } = body;
    if (!code || !type || value === undefined) {
      return new Response(JSON.stringify({ error: 'code, type, and value required' }), {
        status: 400, headers: { 'Content-Type': 'application/json' },
      });
    }
    const codeData = {
      code: code.toUpperCase().trim(),
      type, // 'percent' or 'free'
      value: type === 'free' ? 100 : Number(value),
      maxUses: maxUses || null,
      usedCount: 0,
      createdAt: new Date().toISOString(),
      expiresAt: expiresAt || null,
      notes: notes || '',
      active: true,
    };
    await env.GROW_DATA.put('discount:' + codeData.code, JSON.stringify(codeData));
    return new Response(JSON.stringify({ success: true, code: codeData }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // ── Delete discount code ──
  if (action === 'delete_discount') {
    const { code } = body;
    await env.GROW_DATA.delete('discount:' + code.toUpperCase().trim());
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // ── Toggle discount code active/inactive ──
  if (action === 'toggle_discount') {
    const { code } = body;
    const existing = await env.GROW_DATA.get('discount:' + code.toUpperCase().trim());
    if (!existing) {
      return new Response(JSON.stringify({ error: 'Code not found' }), {
        status: 404, headers: { 'Content-Type': 'application/json' },
      });
    }
    const data = JSON.parse(existing);
    data.active = !data.active;
    await env.GROW_DATA.put('discount:' + code.toUpperCase().trim(), JSON.stringify(data));
    return new Response(JSON.stringify({ success: true, active: data.active }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ error: 'Unknown action' }), {
    status: 400, headers: { 'Content-Type': 'application/json' },
  });
}