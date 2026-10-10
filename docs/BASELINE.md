# BASELINE — Origen Jacó (T-08 · F1)

> **Fecha de medición**: 2026-10-10 · **Estado del código**: sin correcciones previas a esta medición (baseline antes de editar).
> **Propósito**: registro reproducible de Lighthouse móvil, estado del JSON-LD y checklist on-page **antes** de las fases F2–F7.
> **Único entregable de escritura de esta tarea**: este archivo.

---

## 1. Entorno y comandos reproducibles

| Elemento | Valor |
|---|---|
| Fecha/hora medición | 2026-10-10, ~07:46–07:49 hora local (fetchTime Lighthouse: 2026-10-10T13:46–13:49Z) |
| Node | v23.7.0 (npm 11.13.0) — local no LTS; `.nvmrc` fija 22 |
| Astro | 5.18.2 (`astro --version` del build) |
| Lighthouse CLI | **12.8.2** (`npx --yes lighthouse@12 --version`; no instalado en `package.json`) |
| Chrome | Chromium de Playwright (`CHROME_PATH=…/ms-playwright/chromium-1248/chrome-mac-arm64/Google Chrome for Testing.app/…`), `--headless=new` |
| Servidor | `npm run build` → `dist/` (6 páginas); `npm run preview` → `http://localhost:4321` |
| Throttling | por defecto Lighthouse móvil: `simulate`, Slow-4G + CPU 4× (`--form-factor=mobile --screenEmulation.mobile=true`) |

Comandos exactos:

```bash
export CHROME_PATH="$(node -e "console.log(require('playwright').chromium.executablePath())")"
npm run check          # 0 errores (1 hint en scripts/check-placeholders.mjs, no bloquea)
npm run build          # 6 páginas
npm run preview &      # http://localhost:4321
npx --yes lighthouse@12 "http://localhost:4321/<ruta>" \
  --only-categories=performance,accessibility,best-practices,seo \
  --form-factor=mobile --screenEmulation.mobile=true \
  --output=json --output-path=/tmp/lh-baseline/<nombre>.json \
  --chrome-flags="--headless=new" --quiet
```

> Decisión documentada: se usan las 4 categorías completas (no `--preset=perf`) para tener a11y/BP/SEO en la misma pasada. JSON-LD y checklist on-page se validaron leyendo `dist/*.html` con `node` (`JSON.parse` + regex de metas) y contrastando contra el código fuente.

---

## 2. Scores Lighthouse por URL (móvil, lab)

| URL | Performance | A11y | Best Practices | SEO | Nota |
|---|---|---|---|---|---|
| `/` | **89** *(1er run)* / **99** *(re-run)* | 100 | 100 | 100 | Ruido de arranque en frío en el 1er run (ver §2.1); se toma el re-run como valor de referencia |
| `/menu/` | 100 | 100 | 100 | 100 | |
| `/nosotros/` | 99 | 100 | 100 | 100 | |
| `/eventos/` | 100 | 100 | 100 | 100 | |
| `/contacto/` | 100 | 100 | 100 | 100 | |
| **Media (5 indexables, re-run de `/`)** | **99,6** | **100** | **100** | **100** | |
| `/404.html` *(extra, no indexable)* | 99 | 100 | 100 | 100 | Servida como página estática en el preview |

### 2.1 Nota sobre el 1er run de `/`

El primer run de `/` dio Performance 89 con FCP=LCP=3,0 s (TTFB 20 ms, CLS 0,007, TBT 0 ms, sin recursos bloqueantes distintos de Google Fonts). El re-run inmediato dio 99 / FCP=LCP 1,6 s. Patrón idéntico al documentado en `docs/REVIEW.md` §2 (arranque en frío del headless); se registran ambos números, sin fabricar datos.

### 2.2 Único audit binario fallando (todas las URLs)

`label-content-name-mismatch` (experimental, categoría a11y): el `aria-label` del logo (`"Origen — inicio"`, `src/components/Header.astro:8`) no contiene el texto visible `"ORIGEN · MAR · TIERRA · FUEGO"`. No penaliza la categoría (100) pero es el mismo hallazgo R-24 de REVIEW.

---

## 3. Métricas clave (móvil, lab, simulado)

| URL | FCP | LCP | CLS | TBT | SI | TTFB |
|---|---|---|---|---|---|---|
| `/` (re-run) | 1,6 s | 1,6 s | 0,007 | 0 ms | 1,6 s | 0 ms |
| `/` (1er run, frío) | 3,0 s | 3,0 s | 0,007 | 0 ms | 3,0 s | 20 ms |
| `/menu/` | 1,5 s | 1,5 s | 0,004 | 0 ms | 1,5 s | 10 ms |
| `/nosotros/` | 1,6 s | 1,6 s | 0,001 | 0 ms | 1,6 s | 10 ms |
| `/eventos/` | 1,5 s | 1,5 s | 0,004 | 0 ms | 1,5 s | 10 ms |
| `/contacto/` | 1,5 s | 1,5 s | 0,021 | 0 ms | 1,5 s | 10 ms |
| `/404.html` | 1,5 s | 1,5 s | 0,044 | 0 ms | 1,5 s | 10 ms |

**Presupuesto CWV (PLAN §2.2-12)**: LCP < 2,5 s ✅ (1,5–1,6 s en 5/5 tras el re-run) · CLS < 0,1 ✅ (máx. 0,044 en `/404.html`; 0,021 en `/contacto/`) · TBT 0 ms ✅ (INP de campo pendiente post-deploy) · Lighthouse SEO ≥ 95 ✅ (100 en 5/5). TTFB local (0–20 ms) no representa producción/CDN.

---

## 4. JSON-LD actual (validación sobre `dist/`)

**Sintaxis**: 1 bloque `<script type="application/ld+json">` por página (array). `JSON.parse` **OK en 6/6** — sin errores de sintaxis.

| Página | Archivo salida | `@type` presentes | Placeholders / problemas en el dato |
|---|---|---|---|
| `/` | `dist/index.html` | `Restaurant`, `PostalAddress`, `GeoCoordinates`, `OpeningHoursSpecification` | `telephone: "+506 0000 0000"` · `address.streetAddress: "[Dirección exacta]"` · `sameAs` con `[usuario]`/`[pagina]`/`[ficha]` · `image` → 404 |
| `/menu/` | `dist/menu/index.html` | + `Menu`, `MenuSection` (4), `MenuItem` (18) | Mismos placeholders del `Restaurant`. **0 de 18 `MenuItem` tienen `offers`** (correcto: `menu.astro:24-25` solo emite `offers` con `price` real) |
| `/nosotros/` | `dist/nosotros/index.html` | `Restaurant` (+ subtipos) | Mismos placeholders |
| `/eventos/` | `dist/eventos/index.html` | `Restaurant` (+ subtipos) | Mismos placeholders |
| `/contacto/` | `dist/contacto/index.html` | + `FAQPage`, `Question` (8), `Answer` | Mismos placeholders + **3 respuestas FAQ con corchetes** (índices 0, 6, 7 → `src/data/faq.ts:5,11,12`) |
| `/404.html` | `dist/404.html` | `Restaurant` (+ subtipos) | Mismos placeholders (schema heredado de `Base.astro`) |

**Origen en código fuente** (los placeholders del `Restaurant` son transversales a las 6 páginas):

| Campo | Valor placeholder | Fuente |
|---|---|---|
| `telephone` | `+506 0000 0000` | `src/data/site.ts:19` → `src/layouts/Base.astro:27` |
| `address.streetAddress` | `[Dirección exacta]` | `src/data/site.ts:11` → `Base.astro:37` |
| `sameAs[0..2]` | `[usuario]`, `[pagina]`, `[ficha]` | `src/data/site.ts:34-36` → `Base.astro:49` |
| `image` | `https://www.origenjaco.com/og-image.jpg` → **HTTP 404** (`public/` no lo contiene) | `Base.astro:14,29,72` |
| `url` | `https://www.origenjaco.com` **sin `/` final** ≠ canonical auto-referenciada con `/` | `src/data/site.ts:9` → `Base.astro:26` |
| FAQ answers | `[Dirección exacta]`, `[Confirmar cómo se muestra el 10% de servicio.]`, `[Efectivo, tarjetas, SINPE Móvil — confirmar]` | `src/data/faq.ts:5,11,12` → `contacto.astro:8-15` |

**Observaciones de esquema (sin inventar, contrastadas con schema.org)**:

- `maximumAttendeeCapacity` (`Base.astro:33`) **sí es propiedad válida** de `Place` y `Restaurant` la hereda en schema.org — coincide con la corrección R-22 de `docs/REVIEW.md`; el PLAN §2.2-10 está equivocado al marcarla como inválida. No daña, pero Google no la documenta para rich results de Restaurant.
- `AggregateRating` **no está presente** — correcto (no hay reseñas reales).
- `Restaurant` no tiene `potentialAction` (`ReserveAction`/`FindAction`) ni `BreadcrumbList` / `Person` (chef) — huecos previstos para F6/T-40, no errores.
- `openingHoursSpecification` 11:00–22:00 los 7 días coherente con el texto visible ✓.

---

## 5. Checklist on-page por URL

Leyenda: ✅ correcto · ⚠️ observación / mejora · ❌ incumple

| Señal | `/` | `/menu/` | `/nosotros/` | `/eventos/` | `/contacto/` | `/404.html` |
|---|---|---|---|---|---|---|
| `<title>` único | ✅ 68 car. | ✅ 62 car. | ✅ 48 car. | ✅ 55 car. | ✅ 77 car. | ✅ 34 car. |
| `<title>` ≤ 60 | ❌ 68 | ❌ 62 | ✅ | ✅ | ❌ 77 | ✅ |
| Meta description | ✅ 139 | ❌ 163 | ❌ 171 | ✅ 148 | ✅ 137 | ✅ 146 |
| 1 `h1` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Canonical self-ref. | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ apunta a `/404/` (ruta no servible) |
| `og:title` / `og:description` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `og:image` | ❌ 404 | ❌ 404 | ❌ 404 | ❌ 404 | ❌ 404 | ❌ 404 |
| `og:type` | ❌ `restaurant` (inválido) | ❌ | ❌ | ❌ | ❌ | ❌ |
| `og:url` | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ `/404/` |
| `viewport` | ✅ `width=device-width, initial-scale=1` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `<html lang>` | ⚠️ `es` (PLAN pide `es-CR`) | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ |
| `meta robots` | ⚠️ ausente (default index,follow — aceptable) | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ ausente en 404 (no crítico) |
| `twitter:card` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `twitter:image` | ❌ ausente | ❌ | ❌ | ❌ | ❌ | ❌ |
| `og:image:width/height/alt` | ❌ ausentes | ❌ | ❌ | ❌ | ❌ | ❌ |

**Resumen ❌/⚠️**: 3 titles > 60 (`/`, `/menu/`, `/contacto/`) · 2 descriptions > 155 (`/menu/` 163, `/nosotros/` 171) · `og:type="restaurant"` inválido en 6/6 · `og:image` → 404 en 6/6 · sin `twitter:image` ni dimensiones de OG · `lang="es"` en vez de `es-CR` · canonical de `/404.html` rara. **1 `h1` por página ✅ 6/6; canonical auto-ref. ✅ 5/5 indexables; viewport ✅ 6/6.**

**Activos enlazados**: `/og-image.jpg` → **404** · `/menu-origen.pdf` → **404** (`src/pages/menu.astro:66`) · `/favicon.svg` → 200 · sitemap 5 URLs con trailing slash ✓ · robots 200 con `Sitemap:` ✓.

---

## 6. Comparativa con `docs/REVIEW.md` (auditoría previa, 2026-10-09)

| Aspecto | REVIEW.md (2026-10-09, Lighthouse **13.5.0**) | Baseline hoy (2026-10-10, Lighthouse **12.8.2**) | Difiere |
|---|---|---|---|
| Scores móvil (media) | 99 / 100 / 100 / 100 | 99,6 / 100 / 100 / 100 (re-run de `/`) | No material — misma banda; versión de LH distinta (12 vs 13) |
| `/` móvil | 99 (1er run 90, LCP 2,9 s) | 99 (1er run 89, LCP 3,0 s) | Mismo ruido de frío, magnitud equivalente |
| Métricas LCP/CLS/TBT | 1,5–1,6 s / ≤0,021 / 0 ms | 1,5–1,6 s / ≤0,044 (404) / 0 ms | 404 hoy mide CLS 0,044 (REVIEW no medía `/404.html`) |
| `label-content-name-mismatch` | Presente (R-24) | Presente en 6/6 | Sin cambio |
| JSON-LD parse | OK 5/5 | OK 6/6 (incluye 404) | Sin cambio (404 nuevo desde REVIEW) |
| Placeholders JSON-LD | 23 (REVIEW §3-2) | Mismos campos (teléfono, dirección, sameAs, 3 FAQ); no re-contados uno a uno hoy | Sin cambio sustantivo |
| Titles > 60 | 3 (`/` 68, `/menu/` 62, `/contacto/` 77) | Idénticos 68/62/77 | Sin cambio |
| Descriptions > 155 | 2 (`/menu/` 163, `/nosotros/` 171) | Idénticas 163/171 | Sin cambio |
| `og:type` | `restaurant` inválido | `restaurant` inválido | Sin cambio |
| `og:image` / PDF | 404 | 404 | Sin cambio |
| 404 propio | ❌ no existía (R-47) | ✅ existe (T-45 hecho: `src/pages/404.astro`, `dist/404.html`, 1 h1, title propio) | **Cambia a mejor** |
| `maximumAttendeeCapacity` | REVIEW R-22 corrige que sí es válida | Confirmado hoy válido en schema.org para Place | Coincide REVIEW vs PLAN |
| Sitemap/robots | 5 URLs, robots OK | 5 URLs, robots OK | Sin cambio |

**Conclusión de la comparativa**: el baseline fresco **confirma** los hallazgos de REVIEW.md (scores de laboratorio en la misma banda, mismos problemas on-page y de JSON-LD). Las únicas diferencias reales: (1) ahora existe `/404.html` con su medición (T-45), (2) versión de Lighthouse 12.8.2 (pedido de T-08) frente a 13.5.0 de REVIEW, (3) el 1er run frío de `/` hoy da 89 (REVIEW: 90) — ruido equivalente.

---

## 7. Hallazgos priorizados (con `archivo:línea`)

| # | Prioridad | Hallazgo | Evidencia |
|---|---|---|---|
| H-01 | **P0** | `og:type="restaurant"` no es un valor Open Graph válido (debe ser `website`) en las 6 páginas | `src/layouts/Base.astro:67` |
| H-02 | **P0** | NAP placeholder en JSON-LD transversal: `telephone "+506 0000 0000"`, `streetAddress "[Dirección exacta]"`, `sameAs` con `[usuario]`/`[pagina]`/`[ficha]` | `src/data/site.ts:11,19,34-36` → `Base.astro:27,37,49` |
| H-03 | **P0** | 3 respuestas de `FAQPage` con corchetes en `/contacto/` (no citables, invalidan el rich result) | `src/data/faq.ts:5,11,12` → `src/pages/contacto.astro:8-15` |
| H-04 | **P1** | Titles > 60 caracteres: `/` (68), `/menu/` (62), `/contacto/` (77) | `src/pages/index.astro:21`, `src/pages/menu.astro:26`, `src/pages/contacto.astro:18` |
| H-05 | **P1** | Descriptions > 155: `/menu/` (163), `/nosotros/` (171) | `src/pages/menu.astro:28`, `src/pages/nosotros.astro:10` |
| H-06 | **P1** | `og:image`/`Restaurant.image` → `https://www.origenjaco.com/og-image.jpg` responde **404** (no existe `public/og-image.jpg`); también faltan `og:image:width/height/alt` y `twitter:image` | `src/layouts/Base.astro:14,29,72-74` |
| H-07 | **P1** | `/menu-origen.pdf` enlazado en `/menu/` responde **404** | `src/pages/menu.astro:66` |
| H-08 | **P1** | `<html lang="es">` hardcodeado; PLAN §1.2 pide `es-CR` | `src/layouts/Base.astro:54` |
| H-09 | **P1** | `Restaurant.url` y `@id` usan `site.url` sin `/` final, ≠ canonical auto-referenciada con `/` (señal inconsistente de URL canónica) | `src/data/site.ts:9` → `Base.astro:22,26` |
| H-10 | **P1** | Dominio `https://www.origenjaco.com` con `// TODO: dominio real` en 3 puntos (canonical, OG, sitemap, robots) — coherence rota el día del corte si cambia | `src/data/site.ts:9` (usado en `Base.astro:15-16`, `astro.config.mjs`, `public/robots.txt`) |
| H-11 | **P2** | Comentarios de hreflang con sintaxis Astro sin resolver (`href={canonical}`) que se **sirven literalmente** en `dist/` | `src/layouts/Base.astro:62-64` → `dist/index.html` |
| H-12 | **P2** | Google Fonts CSS render-blocking en `<head>` (LCP de lab en la banda 1,5–1,6 s lo nota poco, pero en 3G real sí) | `src/layouts/Base.astro:76-78` |
| H-13 | **P2** | `aria-label` del logo no contiene el texto visible → `label-content-name-mismatch` en 6/6 (único audit binario fallando) | `src/components/Header.astro:8-9` |
| H-14 | **P2** | `/404.html` emite canonical/`og:url` a `https://www.origenjaco.com/404/`, ruta que no existe en el sitio (debería ser `noindex` o sin canonical) | `src/layouts/Base.astro:15,60,71` sobre `src/pages/404.astro` |
| H-15 | **P2** | `meta robots` ausente en todas las páginas (default `index,follow` aceptable, pero sin `max-image-preview` ni control de snippet) | `src/layouts/Base.astro` (no emitido) |
| H-16 | Info | `maximumAttendeeCapacity` **sí es válida** en schema.org para `Place`/`Restaurant` — el PLAN §2.2-10 está equivocado (coincide con R-22 de REVIEW) | `src/layouts/Base.astro:33` |
| H-17 | Info | `Menu` con 18 `MenuItem` y **0 `offers`** — correcto mientras no haya precios reales; no inventar | `src/pages/menu.astro:20-26` |

---

## 8. Verificación del entorno de medición

| Comando | Resultado |
|---|---|
| `npm run check` | ✅ 0 errores / 0 warnings / 1 hint (no bloqueante, en `scripts/check-placeholders.mjs:107`) |
| `npm run build` | ✅ 6 páginas (`/`, `/menu/`, `/nosotros/`, `/eventos/`, `/contacto/`, `/404.html`) |
| `npm run gate` | ❌ a propósito (128 placeholders heredados) — **no tocado** en esta tarea |
| Procesos al cerrar | `astro preview` y Chrome de Lighthouse terminados; `lsof -ti:4321` vacío |

> **Registros crudos**: JSON de Lighthouse en `/tmp/lh-baseline/{index,index-rerun,menu,nosotros,eventos,contacto,404}.json` (temporales de este run; no forman parte del repo).
