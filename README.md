# Origen Jacó — sitio web

Sitio de **Origen. Mar, tierra y fuego** (restaurante de mariscos y parrilla en Jacó, Costa Rica), hecho con [Astro](https://astro.build). Genera HTML estático, rápido y optimizado para SEO y GEO (búsqueda por IA).

## Arrancar

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # genera /dist
npm run preview   # sirve /dist en local
```

Requiere Node 18.17+ (recomendado Node 20 o 22).

## Estructura

```
src/
  data/
    site.ts      ← dirección, teléfono, WhatsApp, horario, redes (una sola fuente para todo el sitio)
    menu.ts      ← platos y precios (precio en colones con IVA; null = pendiente)
    faq.ts       ← preguntas frecuentes (también salen como JSON-LD FAQPage)
  layouts/Base.astro   ← <head>: título, descripción, canonical, Open Graph, JSON-LD Restaurant
  components/          ← Header, Footer, Photo (placeholder de foto), PageHero, ReserveForm, DishList
  pages/
    index.astro      → /
    menu.astro       → /menu/      (JSON-LD Menu)
    nosotros.astro   → /nosotros/
    eventos.astro    → /eventos/
    contacto.astro   → /contacto/  (JSON-LD FAQPage)
  styles/global.css  ← colores, tipografía y componentes (variables en :root)
public/  robots.txt, favicon.svg
```

## Pendientes antes de publicar

1. **`src/data/site.ts`**: todo lo marcado `TODO`: dominio, dirección exacta, coordenadas, teléfono/WhatsApp, correo, días de apertura, redes, links de Google Maps y Waze.
2. **`astro.config.mjs`** y **`public/robots.txt`**: dominio real.
3. **Precios** en `src/data/menu.ts` y platos pendientes (mariscos, pastas y arroces, hamburguesas, coctelería).
4. **Fotos**: guardar en `public/images/` y pasar `src` + `alt` al componente `<Photo>`; ej. `<Photo label="..." src="/images/ceviche.jpg" alt="Ceviche Diablo con piña a la parrilla" />`. Para optimizarlas, mover a `src/assets` y usar `<Image />` de `astro:assets`.
5. **`public/og-image.jpg`** (1200×630) para cuando se comparte el link.
6. **`public/menu-origen.pdf`**: el menú en PDF que se descarga desde /menu/.
7. **Reseñas reales** y **logos de aliados** en `index.astro`.
8. **Mapa**: iframe de Google Maps en `index.astro` y `contacto.astro`.
9. FAQ: formas de pago y cómo se muestra el 10% de servicio.

## SEO / GEO incluido

- Un `<h1>` con palabra clave por página, títulos y descripciones únicos.
- JSON-LD `Restaurant` en todas las páginas (dirección, horario, capacidad, cocina, `hasMenu`), `Menu` en /menu/ y `FAQPage` en /contacto/.
- Canonical, Open Graph, `sitemap-index.xml` automático (`@astrojs/sitemap`) y robots.txt.
- Menú completo como texto rastreable (no imagen ni PDF únicamente).
- Formularios de reserva y eventos que abren WhatsApp con el mensaje armado.

## Siguiente

- Versión en inglés en `src/pages/en/` + activar `hreflang` en `Base.astro` y el enlace EN en `Header.astro`.
- Blog/guías (`src/pages/blog/`) para búsquedas locales: "dónde comer mariscos en Jacó", etc.
- Deploy: Vercel o Netlify (detectan Astro solos).
