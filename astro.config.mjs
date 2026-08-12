import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://amoris.in',
  output: 'static',
  integrations: [
    sitemap({
      // Intel Echo pages are static passthrough in public/, so Astro doesn't
      // see them as routes — list them explicitly or they never get indexed.
      customPages: [
        'https://amoris.in/intel-echo/',
        'https://amoris.in/intel-echo-gtm/',
      ],
    }),
  ],
});
