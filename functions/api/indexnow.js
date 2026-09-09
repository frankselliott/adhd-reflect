// IndexNow submission. Tells participating search engines (Bing, Yandex,
// Seznam, Naver and others share one feed) which URLs to (re)crawl, instead of
// waiting for them to find changes on their own. Google does not use IndexNow,
// so this complements the sitemap rather than replacing it.
//
// Ownership is proved by a key file served at the site root:
//   https://adhdreflect.com/28394371fd554902b704dc94713b9f4c.txt
// which contains exactly the key below. That file lives in public/.
//
// This endpoint gathers the site's URLs from the sitemap and submits the ones
// IndexNow has not been told about yet.
// GET, gated by ADMIN_KEY the same way send-scheduled.js is, so it can be hit
// by hand or from a cron after a deploy:
//   /api/indexnow?key=ADMIN_KEY          submit only URLs not yet submitted
//   /api/indexnow?key=ADMIN_KEY&full=1   force a full resubmission
//
// WHY ONLY NEW URLS. IndexNow exists to announce URLs that have CHANGED. This
// used to post the entire sitemap on every daily cron run, so ~250 unchanged
// URLs were re-announced every day; the endpoint answered 429 (rate limited)
// and, because nothing retried or recorded anything, the submission was simply
// lost. Re-announcing an unchanged catalogue daily is also the behaviour most
// likely to get a key or host deprioritised by the participating engines. We
// now remember what has been submitted (KV) and send only the difference,
// which is normally nothing and occasionally a handful of new pages.

import { adminKeyMatches } from './_lib/auth.js';

// Where the submitted-URL set lives. Same namespace the drip uses.
const STATE_KEY = 'indexnow:submitted';

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

// Read the set of URLs already announced to IndexNow. Missing or unreadable
// state is treated as "nothing submitted yet", which triggers the seed path
// below rather than a blast.
async function readSubmitted(env) {
  if (!env || !env.SEARCH_LOGS) return null;
  try {
    const raw = await env.SEARCH_LOGS.get(STATE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed.urls) ? new Set(parsed.urls) : null;
  } catch (e) {
    console.warn('indexnow: could not read submitted state', e && e.message);
    return null;
  }
}

async function writeSubmitted(env, urlSet) {
  if (!env || !env.SEARCH_LOGS) return;
  try {
    await env.SEARCH_LOGS.put(STATE_KEY, JSON.stringify({
      urls: [...urlSet],
      updatedAt: new Date().toISOString(),
    }));
  } catch (e) {
    console.warn('indexnow: could not persist submitted state', e && e.message);
  }
}

async function postBatch(urlList) {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: HOST, key: INDEXNOW_KEY, keyLocation: KEY_LOCATION, urlList }),
  });
  // IndexNow returns 200 or 202 on success; anything else is worth logging.
  if (res.status !== 200 && res.status !== 202) {
    console.error('indexnow: submission returned', res.status, await res.text().catch(() => ''));
  }
  return res.status;
}

// Collect the site's URLs from the sitemap and announce the ones IndexNow has
// not seen. Returns a summary. Throws on a hard failure (no sitemap URLs); the
// caller decides whether that matters. Reused by the daily drip cron in
// send-scheduled.js so submission happens automatically on the same schedule.
//
// `full: true` forces every URL to be resubmitted — for seeding a new key or
// recovering after a host change. It is never the automatic behaviour.
export async function submitToIndexNow(env, { full = false } = {}) {
  const urls = await collectUrls();
  if (urls.length === 0) throw new Error('No URLs found in sitemap.');

  const known = await readSubmitted(env);

  // First run with no state: record what exists and submit nothing. These URLs
  // have already been announced many times over by the old full-resubmit
  // behaviour, so firing another ~250 of them would repeat the mistake we are
  // fixing. From here on, only genuinely new pages go out.
  if (!full && known === null) {
    await writeSubmitted(env, new Set(urls));
    return {
      seeded: urls.length,
      submitted: 0,
      batches: [],
      note: 'Recorded existing URLs without submitting; new pages will be announced from now on.',
      keyLocation: KEY_LOCATION,
    };
  }

  const toSubmit = full ? urls : urls.filter((u) => !known.has(u));

  // The common case: nothing changed, so make no request at all. This is what
  // keeps us under the rate limit instead of colliding with it daily.
  if (toSubmit.length === 0) {
    return { submitted: 0, batches: [], note: 'No new URLs to announce.', keyLocation: KEY_LOCATION };
  }

  const batches = [];
  let allOk = true;
  for (let i = 0; i < toSubmit.length; i += BATCH) {
    const urlList = toSubmit.slice(i, i + BATCH);
    const status = await postBatch(urlList);
    if (status !== 200 && status !== 202) allOk = false;
    batches.push({ count: urlList.length, status });
  }

  // Only record URLs we actually got accepted. A rejected batch (429 and
  // friends) stays unknown, so the next run retries it instead of dropping it
  // the way the old code did.
  if (allOk) {
    const next = full ? new Set(urls) : new Set([...(known || []), ...toSubmit]);
    await writeSubmitted(env, next);
  }

  return { submitted: toSubmit.length, accepted: allOk, batches, keyLocation: KEY_LOCATION };
}

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  if (!adminKeyMatches(env, url.searchParams.get('key'))) {
    return new Response('Unauthorized', { status: 401 });
  }

  const full = ['1', 'true', 'yes'].includes((url.searchParams.get('full') || '').toLowerCase());

  try {
    const result = await submitToIndexNow(env, { full });
    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('indexnow error', e && e.message);
    const noUrls = /No URLs/.test(e && e.message);
    return new Response(JSON.stringify({ error: noUrls ? e.message : 'Something went wrong.' }), {
      status: noUrls ? 502 : 500, headers: { 'Content-Type': 'application/json' },
    });
  }
}
