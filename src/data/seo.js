// ADHD Reflect. Shared structured-data helpers.
//
// Base.astro emits the site-wide @graph (Organization + WebSite) on every page.
// These helpers let an individual page attach its own Article/Breadcrumb schema
// that REFERENCES those entities by @id, instead of restating an anonymous
// publisher on each of the ~280 pages. Search engines then read one publisher
// with many articles rather than hundreds of unrelated ones.

export const SITE = 'https://adhdreflect.com';
export const ORG_ID = `${SITE}/#organization`;
export const WEBSITE_ID = `${SITE}/#website`;

// The default social/preview image, used as the Article image when a page has
// no image of its own. Article schema without an image is markedly weaker in
// Google's rich-result handling.
export const DEFAULT_OG = `${SITE}/og-default.png`;

// BreadcrumbList for a page's ancestry. Pass the trail WITHOUT the site root;
// "Home" is prepended here so every breadcrumb on the site starts the same way.
// Google uses this to render the path in place of the raw URL in results, and
// to understand that /cards/<id> sits under /cards.
//
//   breadcrumbs([{ name: 'Guides', path: '/guides' }, { name: guide.title, path: `/guides/${id}` }])
export function breadcrumbs(trail) {
  const items = [{ name: 'Home', path: '/' }, ...trail];
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE}${item.path === '/' ? '' : item.path}`,
    })),
  };
}

// An Article that points back at the shared publisher entity. `path` is the
// page's own path, used for both @id and mainEntityOfPage so the article is a
// stable, addressable node rather than an anonymous blob.
export function article({ headline, description, path, image, about, datePublished, dateModified }) {
  const url = `${SITE}${path}`;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${url}#article`,
    headline,
    description,
    inLanguage: 'en',
    author: { '@id': ORG_ID },
    publisher: { '@id': ORG_ID },
    isPartOf: { '@id': WEBSITE_ID },
    mainEntityOfPage: url,
    image: image || DEFAULT_OG,
  };
  if (about && about.length) schema.about = about;
  // Dates are only emitted when the caller actually knows them. Inventing a
  // datePublished is worse than omitting it: a wrong date is a wrong claim to
  // both readers and search engines, and Google will happily surface it.
  if (datePublished) schema.datePublished = datePublished;
  if (dateModified || datePublished) schema.dateModified = dateModified || datePublished;
  return schema;
}

// A single question/answer pair, the shape answer engines quote from.
export function faq(question, answerText, path) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${SITE}${path}#faq`,
    inLanguage: 'en',
    mainEntity: [{
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answerText },
    }],
  };
}
