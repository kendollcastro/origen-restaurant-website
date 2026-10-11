import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// TODO: cambiar por el dominio real antes de publicar
// Las páginas /en/ se excluyen del sitemap mientras no haya traducción aprobada (P-22):
// son provisionales y emiten robots noindex (T-35). T-38 añadirá hreflang y las incluirá en go-live.
export default defineConfig({
  site: 'https://www.origenjaco.com',
  integrations: [
    sitemap({
      filter: (page) => !new URL(page).pathname.startsWith('/en'),
    }),
  ],
});
