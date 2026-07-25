import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// Private and gated routes: keep them out of the sitemap. Each of these pages
// also sets noindex via Base.astro, since a sitemap filter only stops
// discovery, not indexing. Public grow sales pages (/grow, /grow/welcome,
// /grow/redeem, /grow/free-access) are intentionally not listed here.
const EXCLUDE = [
  '/admin',
  '/app',
  '/dev/',
  '/grow/home',
  '/grow/module/',
  '/grow/summary',
  '/grow/checkin',
  '/grow/scripts',
];

function isExcluded(pathname) {
  return EXCLUDE.some((p) =>
    p.endsWith('/') ? pathname.startsWith(p) : (pathname === p || pathname.startsWith(p + '/'))
  );
}

// A single build timestamp so recrawls are prioritised after each deploy.
const lastmod = new Date().toISOString();

export default defineConfig({
  site: 'https://adhdreflect.com',
  output: 'static',
  integrations: [
    react(),
    sitemap({
      filter: (page) => !isExcluded(new URL(page).pathname),
      serialize(item) {
        item.lastmod = lastmod;
        return item;
      },
    }),
  ],
});
