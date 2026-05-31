import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://adhdreflect.com',
  integrations: [react(), sitemap()],
  site: 'https://adhdreflect.com',
  output: 'static',
});
