// IndexNow submission. Tells participating search engines (Bing, Yandex,
// Seznam, Naver and others share one feed) which URLs to (re)crawl, instead of
// waiting for them to find changes on their own. Google does not use IndexNow,
// so this complements the sitemap rather than replacing it.
//
// Ownership is proved by a key file served at the site root:
//   https://adhdreflect.com/28394371fd554902b704dc94713b9f4c.txt
// which contains exactly the key below. That file lives in public/.
//
// This endpoint gathers the site's URLs from the sitemap and submits them.
// GET, gated by ADMIN_KEY the same way send-scheduled.js is, so it can be hit
// by hand or from a cron after a deploy:
//   /api/indexnow?key=ADMIN_KEY

const INDEXNOW_KEY = '28394371fd554902b704dc94713b9f4c';
const HOST = 'adhdreflect.com';
const SITE = 'https://adhdreflect.com';
const KEY_LOCATION = `${SITE}/${INDEXNOW_KEY}.txt`;
const ENDPOINT = 'https://api.indexnow.org/indexnow';
// IndexNow accepts up to 10,000 URLs per request. We are far below that, but
// chunk anyway so this keeps working as the site grows.
const BATCH = 10000;

function extractLocs(xml) {
  const out = [];
  const re = /<loc>\s*([^<\s]+)\s*<\/loc>/g;
  let m;
  while ((m = re.exec(xml)) !== null) {
    // Sitemaps XML-escape ampersands; unescape so the submitted URL is real.
    out.push(m[1].replace(/&amp;/g, '&'));
  }
  return out;
}

// Collect every page URL from the sitemap. The index points at one or more
// child sitemaps; follow them. Falls back to treating the fetched document as a
// urlset if it is not an index.
async function collectUrls() {
  const seen = new Set();
  const indexXml = await (await fetch(SITE + '/sitemap-index.xml')).text();
  const isIndex = /<sitemapindex/i.test(indexXml);
  const childSitemaps = isIndex ? extractLocs(indexXml) : [SITE + '/sitemap-index.xml'];
  for (const sm of childSitemaps) {
    try {
      const xml = await (await fetch(sm)).text();
      for (const u of extractLocs(xml)) {
        if (u.startsWith(SITE)) seen.add(u);
      }
    } catch (e) {
      console.warn('indexnow: could not read child sitemap', sm, e && e.message);
    }
  }
  return [...seen];
}

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  if (!env.ADMIN_KEY || url.searchParams.get('key') !== env.ADMIN_KEY) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const urls = await collectUrls();
    if (urls.length === 0) {
      return new Response(JSON.stringify({ error: 'No URLs found in sitemap.' }), {
        status: 502, headers: { 'Content-Type': 'application/json' },
      });
    }

    const batches = [];
    for (let i = 0; i < urls.length; i += BATCH) {
      const urlList = urls.slice(i, i + BATCH);
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify({ host: HOST, key: INDEXNOW_KEY, keyLocation: KEY_LOCATION, urlList }),
      });
      // IndexNow returns 200 or 202 on success; anything else is worth logging.
      if (res.status !== 200 && res.status !== 202) {
        console.error('indexnow: submission returned', res.status, await res.text().catch(() => ''));
      }
      batches.push({ count: urlList.length, status: res.status });
    }

    return new Response(JSON.stringify({ submitted: urls.length, batches, keyLocation: KEY_LOCATION }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('indexnow error', e && e.message);
    return new Response(JSON.stringify({ error: 'Something went wrong.' }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    });
  }
}
