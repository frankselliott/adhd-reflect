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