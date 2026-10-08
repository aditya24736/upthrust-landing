import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Canonical origin comes from the environment so the same code works on staging and production.
const site = process.env.PUBLIC_SITE_URL || 'https://upthrust-landing.netlify.app';

export default defineConfig({
  site,
  output: 'static',
  integrations: [sitemap({ filter: (page) => !page.includes('/thanks') })],
  build: { inlineStylesheets: 'always' },
  image: { layout: 'constrained' },
});
