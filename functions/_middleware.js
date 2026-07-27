// First-party page-view counting. This is the only analytics on the site and
// is deliberately minimal: it stores aggregate counts per path per day in
// SEARCH_LOGS under pv:<YYYY-MM-DD>:<path> with a 90 day TTL, and nothing else.
//
// No IP addresses, no user agents, no cookies, no identifiers of any kind are
// stored. It cannot tell one visitor from another, so the numbers are page
// counts, not unique visitors. This is what the privacy and cookies pages say,
// and it must stay true.
//
// Counting runs in context.waitUntil so it never delays the response.

// Short, deliberately incomplete list. Enough to drop the obvious automated
// traffic without pretending to be a bot-detection system.
const BOT_UA = /(bot|crawl|spider|slurp|bingpreview|facebookexternalhit|embedly|curl|wget|python-requests|headless|lighthouse|pingdom|uptime|monitor|ahrefs|semrush)/i;

// Count only real HTML page views: GET requests, not the API, not the admin
// dashboard, and not static assets (anything whose last path segment has a file
// extension, e.g. .js, .css, .png, .xml, .txt, favicon and the like).
function isCountablePage(pathname, method, ua) {
  if (method !== 'GET') return false;
  if (pathname.startsWith('/api/')) return false;
  if (pathname === '/admin' || pathname.startsWith('/admin/')) return false;
  const last = pathname.split('/').pop() || '';
  if (last.includes('.')) return false;
  if (ua && BOT_UA.test(ua)) return false;
  return true;
}

// Increment the per-day, per-path counter. KV has no atomic increment, so this
// is read-modify-write: under heavy concurrency a couple of hits can be lost,
// which is fine for a page counter. Best-effort throughout: a KV error must
// never surface to the visitor.
async function bump(env, pathname) {
  try {
    const day = new Date().toISOString().slice(0, 10);
    const key = 'pv:' + day + ':' + pathname;
    const current = parseInt((await env.SEARCH_LOGS.get(key)) || '0', 10) || 0;
    await env.SEARCH_LOGS.put(key, String(current + 1), { expirationTtl: 90 * 24 * 60 * 60 });
  } catch (e) {
    console.error('pv count failed', e && e.message);
  }
}

export async function onRequest(context) {
  const { request, env, next } = context;
  const response = await next();
  try {
    if (env && env.SEARCH_LOGS) {
      const url = new URL(request.url);
      const ua = request.headers.get('user-agent') || '';
      if (isCountablePage(url.pathname, request.method, ua)) {
        // Fire and forget: never block the response on counting.
        context.waitUntil(bump(env, url.pathname));
      }
    }
  } catch (e) {
    // Counting is best-effort and must never affect what the visitor gets.
  }
  return response;
}
