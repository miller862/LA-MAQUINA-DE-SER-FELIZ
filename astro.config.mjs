import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
  integrations: [mdx()],
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: { prefixDefaultLocale: false },
  },
  vite: {
    server: {
      watch: {
        // Fuerza polling para que los cambios en contenido sean detectados inmediatamente
        usePolling: true,
        interval: 300,
      },
    },
  },
});
