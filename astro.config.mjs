// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Produktions-URL: in Vercel als Umgebungsvariable SITE_URL setzen (z. B. https://meinepresse.de)
const site = process.env.SITE_URL || 'https://meinepresse.vercel.app';

export default defineConfig({
  site,
  trailingSlash: 'never',
  build: { format: 'file', inlineStylesheets: 'auto' },
  prefetch: { prefetchAll: true, defaultStrategy: 'viewport' },
  integrations: [
    sitemap({
      filter: (page) => !/\/(impressum|datenschutz)$/.test(page),
    }),
  ],
  vite: {
    build: { chunkSizeWarningLimit: 1200 },
    // model-viewer wird nur dynamisch importiert → im Dev-Server vorab bündeln
    optimizeDeps: { include: ['@google/model-viewer'] },
  },
});
