// Admin API — Read search logs
// Protected by ADMIN_KEY environment variable

export async function onRequestGet({ env, request }) {
  // Auth check
  const url = new URL(request.url);
  const key = url.searchParams.get('key');
  if (!env.ADMIN_KEY || key !== env.ADMIN_KEY) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!env.SEARCH_LOGS) {
    return new Response(JSON.stringify({ error: 'SEARCH_LOGS KV not bound' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // List all search logs
    const listResult = await env.SEARCH_LOGS.list({ prefix: 'search:', limit: 1000 });
    const logs = [];

    // Fetch each log entry
    for (const key of listResult.keys) {
      const value = await env.SEARCH_LOGS.get(key.name);
      if (value) {
        try {
          logs.push(JSON.parse(value));
        } catch (e) {
          logs.push({ raw: value });
        }
      }
    }

    // Sort by timestamp descending
    logs.sort((a, b) => (b.timestamp || '').localeCompare(a.timestamp || ''));

    // Analytics summary
    const total = logs.length;
    const matched = logs.filter(l => l.matched).length;
    const unmatched = logs.filter(l => !l.matched && !l.crisis).length;
    const crisisDetected = logs.filter(l => l.crisis).length;

    // Top matched cards
    const cardCounts = {};
    logs.forEach(l => {
      if (l.topMatch) {
        cardCounts[l.topMatch] = cardCounts[l.topMatch] || { id: l.topMatch, title: l.topMatchTitle, count: 0 };
        cardCounts[l.topMatch].count++;
      }
    });
    const topCards = Object.values(cardCounts).sort((a, b) => b.count - a.count).slice(0, 20);

    // Unmatched queries
    const unmatchedQueries = logs
      .filter(l => !l.matched && !l.crisis)
      .map(l => ({ query: l.query, timestamp: l.timestamp }));

    // Unique queries
    const uniqueQueries = [...new Set(logs.map(l => l.query?.toLowerCase().trim()))].length;

    return new Response(JSON.stringify({
      summary: { total, matched, unmatched, crisisDetected, uniqueQueries },
      topCards,
      unmatchedQueries,
      recentSearches: logs.slice(0, 50),
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

