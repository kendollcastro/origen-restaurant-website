# Origen Jacó — sitio web

Sitio de **Origen. Mar, tierra y fuego** (restaurante de mariscos y parrilla en Jacó, Costa Rica), hecho con [Astro](https://astro.build). Genera HTML estático, rápido y optimizado para SEO y GEO (búsqueda por IA).

## Arrancar

```bash
npm install
npm run dev       # http://localhost:4321
npm run check     # astro check (tipos + sintaxis Astro)
npm run build     # genera /dist
npm run preview   # sirve /dist en local
```

**Node 22 LTS** (ver `.nvmrc`; con `nvm use` toma esa versión). `package.json` fija `engines.node: ">=20 <24"` — no usar Node 23 (no LTS) para evitar "pasa en mi máquina".

## Gate de verificación (obligatorio tras cada tarea)

```bash
npm ci && npm run check && npm run build && npm run gate
```

1. `npm ci` — instala exactamente lo del lockfile.
2. `npm run check` — `astro check`: errores de tipos y de sintaxis en 0.
3. `npm run build` — build estático en `dist/`.
4. `npm run gate` — gate de placeholders (`\[[^\]]+\]` en texto visible de `dist/` y en JSON-LD; no cuenta JS inline ni CSS). **Nota:** hoy el gate **falla a propósito** mientras queden placeholders (T-17); debe quedar en 0 antes de go-live (DoD §7.1-2, junto con `TODO`, `ph-label` y `0000`).

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
