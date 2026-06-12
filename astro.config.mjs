import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://manuelmiller.com.ar',
  integrations: [mdx(), sitemap()],
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: { prefixDefaultLocale: false },
  },
  vite: {
    server: {
      watch: {
        // Fuerza polling para detectar cambios de contenido inmediatamente
        usePolling: true,
        interval: 300,
      },
    },
  },
});
