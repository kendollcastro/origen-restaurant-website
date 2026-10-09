import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// TODO: cambiar por el dominio real antes de publicar
export default defineConfig({
  site: 'https://www.origenjaco.com',
  integrations: [sitemap()],
});
