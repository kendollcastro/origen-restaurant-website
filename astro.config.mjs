import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.origenjaco.com',
  integrations: [
    sitemap({
      // T-38 (go-live 2026-10-20): sitemap bilingüe con <xhtml:link> de hreflang.
      // `es` vive en la raíz y `en` bajo /en/, así el generador emite pares recíprocos.
      i18n: {
        defaultLocale: 'es',
        locales: { es: 'es-CR', en: 'en-US' },
      },
      // /qr/ es una interfaz interna (QR de Google Maps/TripAdvisor para imprimir), no enlazada
      // desde el sitio: se excluye del sitemap y emite noindex (su propio <head>).
      filter: (page) => !new URL(page).pathname.startsWith('/qr'),
    }),
  ],
});
