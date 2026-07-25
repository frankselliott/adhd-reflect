// Per-pattern Open Graph for shared quiz results.
// The site is static, so a query param cannot vary the baked-in OG tags. This
// Pages Function runs at the edge for /quiz: it serves the exact same static
// page (via next()) and, ONLY when ?p=<valid pattern> is present, swaps the
// og:image / twitter:image / og:image:alt so a shared link previews with the
// pattern card. The quiz itself is never altered by ?p= — only meta tags are.
// Any miss or error returns the page unchanged.
const NAMES = {
  reactor: 'The Overloaded Reactor',
  juggler: 'The Chaos Juggler',
  looper: 'The Argument Looper',
  spiraller: 'The Shame Spiraller',
  escaper: 'The Shutdown Escaper',
};

export async function onRequestGet(context) {
  const res = await context.next();
  try {
    const p = new URL(context.request.url).searchParams.get('p');
    if (!p || !Object.prototype.hasOwnProperty.call(NAMES, p)) return res;

    const ct = res.headers.get('content-type') || '';
    if (!ct.includes('text/html')) return res;

    const image = `https://adhdreflect.com/og-pattern-${p}.png`;
    const alt = `I'm ${NAMES[p]}`;

    return new HTMLRewriter()
      .on('meta[property="og:image"]', { element(el) { el.setAttribute('content', image); } })
      .on('meta[name="twitter:image"]', { element(el) { el.setAttribute('content', image); } })
      .on('meta[property="og:image:alt"]', { element(el) { el.setAttribute('content', alt); } })
      .transform(res);
  } catch (e) {
    return res;
  }
}
