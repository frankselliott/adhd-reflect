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

// Read many KV values with bounded concurrency instead of one at a time. A
// single admin request used to await up to ~2,500 gets in series before
// anything rendered; batching in chunks turns that into a few dozen parallel
// waits. Returns values in the same order as `names`.
async function getMany(kv, names, chunk = 50) {
  const out = [];
  for (let i = 0; i < names.length; i += chunk) {
    const slice = names.slice(i, i + chunk);
    const vals = await Promise.all(slice.map((n) => kv.get(n)));
    out.push(...vals);
  }
  return out;
}

// Read + parse every value under a KV prefix, batched.
async function readAll(kv, prefix) {
  const keys = await listAllKeys(kv, prefix);
  const vals = await getMany(kv, keys.map((k) => k.name));
  const out = [];
  for (const v of vals) {
    if (!v) continue;
    try { out.push(JSON.parse(v)); } catch (e) { /* skip malformed */ }
  }
  return out;
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

// Is a Resend send from our own domain? The account is shared with
// centrely.com.au and ccschecker.com.au, so this keeps their sends, and their
// customers' email addresses, out of this dashboard. Handles both the
// "Name <addr>" form and a bare address.
function fromOurDomain(from) {
  const m = String(from || '').match(/<([^>]+)>/);
  const addr = (m ? m[1] : String(from || '')).trim().toLowerCase();
  return addr.endsWith('@adhdreflect.com');
}

// Count contacts in our Resend segment, paginated. The shared account holds
// the other businesses' contacts too, so we scope to RESEND_SEGMENT_ID rather
// than reading the whole /contacts list, which is not segment-scoped. Contacts
// are subscriber addresses (gmail and the like), so a from-domain filter cannot
// apply to them; the segment is the correct scope.
async function countSegmentContacts(env) {
  if (!env.RESEND_SEGMENT_ID) return null;
  let count = 0, after = null, pages = 0;
  do {
    let path = `/segments/${env.RESEND_SEGMENT_ID}/contacts?limit=100`;
    if (after) path += '&after=' + encodeURIComponent(after);
    const page = await resendGet(env, path);
    const data = (page && page.data) || [];
    count += data.length;
    after = (page && page.has_more && data.length) ? data[data.length - 1].id : null;
    pages++;
  } while (after && pages < 20);
  return count;
}

// ── Email section: KV (reliable) + Resend (best-effort, cached) ──
async function buildEmailSection(env) {
  const out = { subscriberCount: 0, patternBreakdown: {}, dripFunnel: {0:0,1:0,2:0,3:0,4:0},
    unsubCount: 0, unsubRate: 0, lastDripRun: null,
    resendContactCount: null, recentSends: [], bouncedCount: 0, complainedCount: 0, syncDiverges: false };

  if (env.SEARCH_LOGS) {
    const emailKeys = await listAllKeys(env.SEARCH_LOGS, 'email:');
    const vals = await getMany(env.SEARCH_LOGS, emailKeys.map((k) => k.name));
    for (const raw of vals) {
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
    const r = { contactCount: null, recentSends: [], bouncedCount: 0, complainedCount: 0 };
    if (!env.RESEND_API_KEY) return r;
    // Recent sends. GET /emails is account-wide with no from-domain filter
    // server-side, so fetch a larger page and keep only our own sends before
    // display. This stops the other businesses' customer addresses ever
    // reaching this dashboard, and scopes the bounce/complaint counts to us.
    try {
      const emails = await resendGet(env, '/emails?limit=100');
      const ours = (emails.data || []).filter((e) => fromOurDomain(e.from));
      r.recentSends = ours.slice(0, 20).map((e) => ({
        to: Array.isArray(e.to) ? e.to.join(', ') : (e.to || ''),
        subject: e.subject || '',
        status: e.last_event || 'sent',
        created_at: e.created_at || null,
      }));
      // Resend's account-wide /suppressions list is keyed by recipient address
      // with no sender to filter on, so it cannot be scoped to adhdreflect. The
      // meaningful, scoped signal is delivery problems in our own sends.
      r.bouncedCount = ours.filter((e) => e.last_event === 'bounced').length;
      r.complainedCount = ours.filter((e) => e.last_event === 'complained').length;
    } catch (e) { /* leave empty */ }
    // Contacts scoped to our segment (see countSegmentContacts).
    try { r.contactCount = await countSegmentContacts(env); } catch (e) {}
    return r;
  });
  out.resendContactCount = resend.contactCount;
  out.recentSends = resend.recentSends;
  out.bouncedCount = resend.bouncedCount;
  out.complainedCount = resend.complainedCount;
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

// ── Search analytics helpers (SEARCH_LOGS 'search:' prefix) ──
function searchSummary(logs) {
  const total = logs.length;
  const matched = logs.filter((l) => l.matched).length;
  const unmatched = logs.filter((l) => !l.matched && !l.crisis).length;
  const crisis = logs.filter((l) => l.crisis).length;
  const uniqueQueries = [...new Set(logs.map((l) => (l.query || '').toLowerCase().trim()))].length;
  return { total, matched, unmatched, crisis, uniqueQueries };
}
function searchDetail(logs) {
  const sorted = [...logs].sort((a, b) => (b.timestamp || '').localeCompare(a.timestamp || ''));
  const cardCounts = {};
  sorted.forEach((l) => {
    if (l.topMatch) {
      cardCounts[l.topMatch] = cardCounts[l.topMatch] || { id: l.topMatch, title: l.topMatchTitle, count: 0 };
      cardCounts[l.topMatch].count++;
    }
  });
  const dailyCounts = {};
  sorted.forEach((l) => {
    if (l.timestamp) {
      const day = l.timestamp.substring(0, 10);
      dailyCounts[day] = (dailyCounts[day] || 0) + 1;
    }
  });
  return {
    summary: searchSummary(sorted),
    topCards: Object.values(cardCounts).sort((a, b) => b.count - a.count).slice(0, 20),
    unmatchedQueries: sorted.filter((l) => !l.matched && !l.crisis).map((l) => ({ query: l.query, timestamp: l.timestamp })),
    recentSearches: sorted.slice(0, 50),
    dailyCounts,
  };
}

// ── Course analytics helpers (GROW_DATA 'token:' prefix) ──
function courseSummary(users) {
  const totalPurchasers = users.length;
  const done = (u) => Object.keys(u.progress || {}).length;
  return {
    totalPurchasers,
    completedCourse: users.filter((u) => done(u) >= 20).length,
    reachedHalfway: users.filter((u) => done(u) >= 10).length,
    startedOnly: users.filter((u) => done(u) < 3).length,
    avgCompletion: totalPurchasers > 0 ? Math.round(users.reduce((s, u) => s + done(u), 0) / totalPurchasers) : 0,
  };
}
function courseDetail(users) {
  // Anonymised: pattern, date, count and source only. No email, no token.
  const view = users.map((u) => ({
    pattern: u.pattern || 'unknown',
    purchasedAt: u.purchasedAt,
    completedCount: Object.keys(u.progress || {}).length,
    source: u.source || 'direct',
  }));
  view.sort((a, b) => (b.purchasedAt || '').localeCompare(a.purchasedAt || ''));
  const patternDistribution = {}, sourceDistribution = {}, moduleCompletionCounts = {};
  view.forEach((u) => { patternDistribution[u.pattern] = (patternDistribution[u.pattern] || 0) + 1; });
  view.forEach((u) => { sourceDistribution[u.source] = (sourceDistribution[u.source] || 0) + 1; });
  users.forEach((u) => {
    Object.keys(u.progress || {}).forEach((mid) => { moduleCompletionCounts[mid] = (moduleCompletionCounts[mid] || 0) + 1; });
  });
  return {
    summary: courseSummary(users),
    patternDistribution,
    sourceDistribution,
    moduleCompletionCounts,
    recentPurchasers: view.slice(0, 20),
  };
}

// ── Page-view stats: pv:<YYYY-MM-DD>:<path> counters from _middleware.js ──
async function buildStatsSection(env) {
  const out = { daily: {}, topPages: [], totalCounted: 0 };
  if (!env.SEARCH_LOGS) return out;
  const keys = await listAllKeys(env.SEARCH_LOGS, 'pv:');
  const vals = await getMany(env.SEARCH_LOGS, keys.map((k) => k.name));
  const pageTotals = {};
  keys.forEach((k, i) => {
    const n = parseInt(vals[i] || '0', 10) || 0;
    // Key is pv:<10-char day>:<path>. The path can contain colons, so slice by
    // fixed offsets rather than splitting on ':'.
    const rest = k.name.slice(3);   // after 'pv:'
    const day = rest.slice(0, 10);
    const path = rest.slice(11);    // after 'YYYY-MM-DD:'
    if (!day || !path) return;
    out.daily[day] = (out.daily[day] || 0) + n;
    pageTotals[path] = (pageTotals[path] || 0) + n;
    out.totalCounted += n;
  });
  out.topPages = Object.entries(pageTotals).sort((a, b) => b[1] - a[1]).slice(0, 20).map(([path, count]) => ({ path, count }));
  return out;
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

    // Login (section=all) returns only the headline counts each tab's summary
    // needs, read in parallel and batched. Every tab loads its own detail on
    // first view, so login never waits on the full data set or on Resend/Stripe.
    if (section === 'all') {
      const [searchLogs, courseUsers] = await Promise.all([
        env.SEARCH_LOGS ? readAll(env.SEARCH_LOGS, 'search:') : Promise.resolve(null),
        env.GROW_DATA ? readAll(env.GROW_DATA, 'token:') : Promise.resolve(null),
      ]);
      if (searchLogs) result.search = { summary: searchSummary(searchLogs) };
      if (courseUsers) result.course = { summary: courseSummary(courseUsers) };
    }

    // ── Site detail (search analytics) ──
    if (section === 'search') {
      if (env.SEARCH_LOGS) result.search = searchDetail(await readAll(env.SEARCH_LOGS, 'search:'));
    }

    // ── Course detail ──
    if (section === 'course') {
      if (env.GROW_DATA) result.course = courseDetail(await readAll(env.GROW_DATA, 'token:'));
    }

    // ── Discount codes ──
    if (section === 'discounts') {
      if (env.GROW_DATA) result.discounts = { codes: await readAll(env.GROW_DATA, 'discount:') };
    }

    // ── Email (KV + Resend), lazy per tab so login stays fast. ──
    if (section === 'email') result.email = await buildEmailSection(env);

    // ── Revenue (Stripe), lazy per tab, 5-minute KV cache. ──
    if (section === 'revenue') result.revenue = await buildRevenueSection(env);

    // ── Page-view stats (first-party counters written by _middleware.js). ──
    if (section === 'stats') result.stats = await buildStatsSection(env);

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