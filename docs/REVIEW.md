# REVIEW — Origen Jacó (FASE 3 · Revisión)

> **Fecha**: 2026-10-09 · **Estado del código**: sin correcciones (revisión de solo lectura).
> **Auditoría**: @qa-tester (Playwright + axe + links + placeholders), @seo-geo (Lighthouse + JSON-LD + on-page),
> @ux-designer, @copywriter, @frontend-dev, @devops — cada uno con su skill.
> **Entorno auditado**: `dist/` servido en `http://localhost:4321` (`astro preview`), build de las 5 páginas ES.
> **Herramientas**: `linkinator 8.1.0`, `@playwright/test 1.64.0` + `@axe-core/playwright 4.13.0` (specs en `/tmp`, fuera del repo),
> `lighthouse 13.5.0` (headless Chrome, preset `perf`), inspección de `dist/*.html`, `sitemap-index.xml`, `robots.txt`,
> validación JSON-LD con `node`, `astro check`, `curl -sI`, `git log/status`.
> **Confirmación**: en esta fase **no se modificó ningún archivo de `src/`, `public/`, `package.json` ni `docs/PLAN.md`**,
> y **no se ejecutó** `git push`, deploy ni cambios de DNS.

---

## 1. Estado global

| | |
|---|---|
| **Veredicto** | 🔴 **NO GO** — el sitio no puede publicarse |
| **Bloqueantes (P0)** | **9** consolidados (de 24 hallazgos P0 en bruto) |
| **Antes de go-live (P1)** | **17** consolidados |
| **Mejoras (P2)** | **7** consolidados |
| **Lo que SÍ está sano** | `astro check` 0 errores/0 avisos · build limpio (5 páginas, 88,9 KB, 0 JS externo) · 200 + 1 `h1` + **0 errores de consola** + **0 violaciones axe** en las 5 rutas · tabs/FAQ/`aria-current` funcionales con teclado · JSON-LD sintácticamente válido y 1:1 con el HTML · sitemap/robots/canonical correctos · **Lighthouse móvil: perf 99 / a11y 100 / BP 100 / SEO 100** |
| **Lo que lo bloquea** | Contenido placeholder (100 en HTML + 23 en JSON-LD), NAP/teléfono falsos, `og-image.jpg` y `menu-origen.pdf` en 404, skip link invisible, nav móvil sin colapsar, sin 404 propio, sin gate de placeholders ni CI, sin `vercel.json` |
| **Causa raíz** | ≈80 % depende de **insumos del cliente** (P-01…P-18); el resto es trabajo de las fases F1/F7 aún no ejecutado (T-04, T-05, T-09, T-10, T-11, T-45…) |

---

## 2. Lighthouse por página

### Móvil (preset `perf`, throttling simulado)

| Página | Performance | A11y | Best Practices | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|
| `/` | 99 *(1er run: 90, ver nota)* | 100 | 100 | 100 | 1,6 s *(1er run: 2,9 s)* | 0,006 | 0 ms |
| `/menu/` | 99 | 100 | 100 | 100 | 1,6 s | 0,003 | 0 ms |
| `/nosotros/` | 99 | 100 | 100 | 100 | 1,5 s | 0,001 | 0 ms |
| `/eventos/` | 100 | 100 | 100 | 100 | 1,5 s | 0,004 | 0 ms |
| `/contacto/` | 100 | 100 | 100 | 100 | 1,5 s | 0,021 | 0 ms |
| **Media** | **99** | **100** | **100** | **100** | **1,5 s** | **0,007** | **0 ms** |

> **Nota sobre `/` móvil**: el primer run dio Performance 90 con FCP/LCP 2,9 s (`elementRenderDelay` ≈ 2,85 s, TTFB 10 ms, sin recursos bloqueantes ni JS); un re-run inmediato dio 99 / 1,6 s. Se toma el re-run: es ruido de arranque en frío del headless, no un problema del HTML.

### Desktop (`--form-factor=desktop --screenEmulation.mobile=false`)

| Página | Performance | A11y | Best Practices | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|
| `/` | 88 *(re-run: 87)* | 100 | 100 | 100 | 1,6 s | 0,006 | 0 ms |
| `/menu/` | 89 | 100 | 100 | 100 | 1,5 s | 0,003 | 0 ms |
| `/nosotros/` | 89 | 100 | 100 | 100 | 1,5 s | 0,001 | 0 ms |
| `/eventos/` | 88 | 100 | 100 | 100 | 1,5 s | 0,004 | 0 ms |
| `/contacto/` | 88 | 100 | 100 | 100 | 1,5 s | 0,021 | 0 ms |
| **Media** | **88,2** | **100** | **100** | **100** | **1,5 s** | **0,007** | **0 ms** |

> El techo de 87–89 en desktop viene de la curva de FCP (1,5–1,6 s); LCP/CLS/TBT están dentro de presupuesto. El DoD §7.1-6 solo exige umbrales en móvil.

### Presupuesto CWV (PLAN §2.2-12)

| Métrica | Presupuesto | Medido (móvil, lab) | Cumple |
|---|---|---|---|
| LCP | < 2,5 s | 1,5–1,6 s en 5/5 | ✅ |
| CLS | < 0,1 | máx. 0,021 (`/contacto/`) | ✅ |
| INP | < 200 ms | TBT 0 ms; INP de lab 20–30 ms | ✅ *(campo: pendiente post-deploy)* |
| Lighthouse SEO | ≥ 95 | 100 en 5/5 | ✅ |

**Detalle**: FCP 1,5–1,6 s · TTI ≈ 2,9 s · peso total ≈ 129 KiB · TTFB 10 ms (servidor local, no representa CDN). Único audit binario fallando: `label-content-name-mismatch` (experimental): el `aria-label` del logo no contiene el texto visible "ORIGEN · MAR · TIERRA · FUEGO" → **R-24**.

---

## 3. Definition of Done verificado (PLAN §7.1)

| # | Ítem DoD | Estado | Evidencia / hallazgo |
|---|---|---|---|
| 1 | `check` + `build` en 0 errores, commits convencionales | ✅ **CUMPLIDO** | `astro check`: 0 errors / 0 warnings / 0 hints (17 archivos). `build`: 5 páginas en 519 ms. 4 commits convencionales en `main`, árbol limpio, sin `node_modules`/`dist` trackeados |
| 2 | 0 placeholders en `dist/` ni en JSON-LD; grep `0000\|TODO\|ph-label` limpio | ❌ **NO CUMPLIDO** | **100** placeholders en texto visible (32 `/`, 55 `/menu/`, 4 `/nosotros/`, 4 `/eventos/`, 5 `/contacto/`) · **23** dentro del JSON-LD · `0000` ×52 · `TODO` ×6 · `ph-label` ×30 → **R-01, R-02, R-04, R-10** |
| 3 | 1 `h1`/página; titles ≤60 y descriptions 120–155 únicos; `og:type=website`; sitemap/robots OK | ⚠️ **PARCIAL** | ✅ `h1` 5/5 · titles únicos 5/5 · descriptions únicas 5/5 · canonical auto-ref. 5/5 · sitemap 5 URLs con trailing slash · robots 200 con `Sitemap:`. ❌ 3 titles >60 (`/` 68, `/menu/` 62, `/contacto/` 77), 2 descriptions >155 (`/menu/` 163, `/nosotros/` 171), `og:type="restaurant"` inválido, alta en GSC pendiente → **R-05, R-19** |
| 4 | JSON-LD sin errores y 1:1 con el texto visible; hreflang recíproco | ⚠️ **PARCIAL** | ✅ `JSON.parse` OK 5/5 · `Restaurant` 5/5, `Menu` (18 platos) y `FAQPage` (8 preguntas) **1:1** con el HTML · URLs absolutas correctas · sin `AggregateRating` inventado. ❌ placeholders en el schema, `Restaurant.image` → 404, hreflang solo comentado (esperado hasta F5) → **R-02, R-03, R-13** |
| 5 | axe: 0 `critical`/`serious` y 0 `color-contrast`; teclado; skip link visible; contraste AA | ⚠️ **PARCIAL** | ✅ **0 violaciones** de cualquier impacto en las 5 rutas (421–763 nodos analizados/ruta). ❌ 63 nodos en `incomplete` de `color-contrast` (no determinables sobre gradiente) → **R-07**; skip link `.sr-only` **sin estado `:focus`** → **R-25**; anillo de foco a **2,41:1** sobre crema → **R-07**; nav móvil sin colapsar y targets <44 px → **R-27**; `aria-label` sobre `div` genérico en las 5 rutas → **R-08** |
| 6 | Lighthouse ≥90 perf mobile / ≥95 a11y / ≥95 SEO / ≥95 BP; LCP/CLS/INP | ✅ **CUMPLIDO (lab)** | Móvil 99/100/100/100 en 5/5; LCP 1,5–1,6 s; CLS ≤0,021; TBT 0 ms. Queda la validación **en campo** tras deploy (**R-61**) |
| 7 | 0 enlaces internos rotos (PDF e `og-image` → 200); 0 errores de consola; 404 propio | ❌ **NO CUMPLIDO** | ❌ `/menu-origen.pdf` **404**, `/og-image.jpg` **404**, 14 enlaces a `https://www.origenjaco.com/*` con status 0 (dominio no resuelve) → 15 rotos · ✅ **0 errores de consola** en las 5 rutas · ❌ no existe `src/pages/404.astro` → **R-03, R-47** |
| 8 | NAP idéntico en Header/Footer/`/contacto/`/JSON-LD/ficha de Google | ⚠️ **PARCIAL** | ✅ internamente consistente entre las 5 páginas y el schema. ❌ es un NAP placeholder (`[Dirección exacta]`, `+506 0000 0000`) y **la ficha de Google no existe** (P-06) → **R-02** |
| 9 | Deploy Vercel + preview, headers, apex→www 301, HTTPS, runbook DNS, `AGENTS.md` | ❌ **NO CUMPLIDO** | Sin remote, sin `.vercel/`, sin `vercel.json` (`curl -sI`: ausentes `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, HSTS, CSP), sin runbook, sin `AGENTS.md` → **R-57, R-61, R-62** · ✅ ninguna acción de push/deploy/DNS ejecutada |
| 10 | `docs/REVIEW.md` con estado global, Lighthouse por página, DoD verificado y R-xx | ✅ **CUMPLIDO** | Este documento |

**DoD global: ❌ NO CUMPLIDO** (ítems 2, 4, 5, 7, 8, 9 en rojo o parciales). **7/9 criterios globales de QA (PLAN §2.4-22) en rojo o parciales**: solo pasan "1 `h1` por página", "0 errores de consola" y "axe 0 violaciones" (con salvedad de contrastes no determinables).

---

## 4. Tareas R-xx (hallazgos P0/P1/P2 consolidados)

> 64 hallazgos en bruto → **33 tareas consolidadas** (los duplicados entre especialistas se agrupan en la columna "Origen").
> P0 = bloquea publicación · P1 = debe resolverse antes de go-live · P2 = mejora.

### P0 — bloquean la publicación (9)

| ID | Responsable | Tarea | Origen | Bloqueo |
|---|---|---|---|---|
| **R-01** | @frontend-dev + @copywriter | Saneado global de placeholders en HTML: aplicar la política T-13 (ocultar sección/precio/categoría hasta dato real) en `menu.ts` (`pending()` y `formatPrice`), `index.astro` (reseñas/aliados), `nosotros.astro`, `eventos.astro`, `faq.ts`. **CA**: gate en verde, 0 `\[[^\]]+\]` en `dist/` | R-01, R-15, R-26, R-35, R-45 | P-07, P-08, P-12, P-13, P-14, P-15 (parcialmente; la ocultación es inmediata) |
| **R-02** | @seo-geo + @copywriter | NAP real y JSON-LD sin placeholders: `streetAddress`, `telephone`, `sameAs` y las 2 FAQ con `[confirmar]` en las 5 páginas · **CA**: Rich Results sin errores y NAP 1:1 con la ficha de Google | R-02, R-13, R-14, R-36 | **P-02, P-03, P-05, P-06, P-10** |
| **R-03** | @frontend-dev + @seo-geo | Assets inexistentes: `public/og-image.jpg` (1200×630) y `public/menu-origen.pdf` → 200; añadir `og:image:width/height/alt`, `twitter:title/description/image`; unificar el dominio que hoy no resuelve en 14 enlaces · **CA**: 0 enlaces internos rotos | R-03, R-16, R-20, R-42, R-46, R-60 | **P-17, P-18, P-01** |
| **R-04** | @copywriter + @frontend-dev | Teléfono/WhatsApp ficticio (`+506 0000 0000`, `wa.me/50600000000`) en texto, CTAs y schema de las 5 páginas · **CA**: `^506\d{8}$` real y smoke de `wa.me` en QA | R-04, R-37 | **P-03** |
| **R-25** | @ux-designer | Skip link invisible: `.sr-only` sin estado `:focus` (`Base.astro:83`, `global.css:38`) → el foco salta a 1×1 px en las 5 páginas · **CA**: visible con Tab en las 5 URLs | R-25 | — (T-09) |
| **R-27** | @ux-designer | Nav móvil sin menú colapsado (sin `aria-expanded`, sin media query de nav) y áreas táctiles 39–43 px · **CA**: botón operable con teclado a ≤760 px, targets ≥44 px, sin scroll horizontal a 360 px | R-27 | — (T-10) |
| **R-47** | @frontend-dev | No existe `src/pages/404.astro` ni `dist/404.html` · **CA**: 404 propio con copy y status real en preview | R-47, R-58 | — (T-45) |
| **R-56** | @qa-tester + @devops | Sin gate de placeholders (`scripts/check-placeholders.mjs`) ni CI (`.github/workflows/`) → el criterio §2.4-20 es manual. *Ojo al implementarlo: hay un falso positivo `[...]` dentro de JS inline en `dist/index.html` que debe excluirse junto a `script`/`style`/JSON-LD* · **CA**: el gate falla hoy listando los placeholders y el CI corre `check → build → gate → playwright` | R-55, R-56 | — (T-04) |
| **R-57** | @devops | Sin `vercel.json` → ausentes `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, HSTS y CSP con `frame-src` de Google Maps; sin reglas de cache ni redirects apex→www · **CA**: headers visibles en la respuesta de preview | R-57 | P-19 · **⚠️ requiere aprobación (T-52)** |

### P1 — antes de go-live (17)

| ID | Responsable | Tarea | Origen | Bloqueo |
|---|---|---|---|---|
| **R-05** | @seo-geo + @copywriter | Titles >60 en `/`, `/menu/`, `/contacto/` y descriptions >155 en `/menu/`, `/nosotros/` → aplicar el mapa §1.1 (48/48/47/55/55 car.) | R-05, R-06, R-17, R-18, R-38, R-39 | P-20 (validar keywords) |
| **R-07** | @ux-designer | Contraste no verificado: 63 nodos en `incomplete` de axe (sobre gradiente) + anillo de foco `--accent` a **2,41:1** sobre `.light` + borde de inputs a **2,00:1** · **CA**: medición manual con contrast-checker, foco ≥3:1 en ambos fondos | R-07, R-28 | — (T-09) |
| **R-08** | @ux-designer | `<div class="lang" aria-label="Idioma">` con `aria-label` sobre elemento genérico sin rol (5 rutas) y "EN" como `<span>` no enfocable · **CA**: `role="group"`/`<nav>`, estado `aria-disabled` anunciable | R-08, R-33 | — (T-10/T-35) |
| **R-19** | @seo-geo + @frontend-dev | `og:type="restaurant"` inválido → `website`; `<html lang="es">` → `es-CR` con prop; comentarios de hreflang que **se sirven literalmente** en `dist/` (con `{canonical}` sin resolver) | R-19, R-52, R-24a-b | — (T-15/T-38) |
| **R-29** | @frontend-dev | Formularios sin JS: sin `action`, sin `<noscript>`, `window.open` sin fallback (popup bloqueado = "envío" fantasma), teléfono de `/eventos/` no es enlace · **CA**: enlace `wa.me` visible de respaldo + `aria-live` | R-29, R-48 | — (T-11) |
| **R-30** | @frontend-dev + @copywriter | `date.min` calculado en **UTC** (efecto: en CR ofrece mañana entre 18:00–23:59 y ayer entre 00:00–06:00); `max="21:30"` contradice el cierre publicado 22:00; `/eventos/` sin `min` de fecha; canal de contacto no obligatorio | R-30, R-49 | **P-04** |
| **R-31** | @frontend-dev | Tabs del menú sin JS: 3 de 4 paneles con `hidden` → solo "Entradas" visible sin JS · **CA**: todos los paneles visibles o migrar a `<details>` | R-31 | — (T-11) |
| **R-32** | @copywriter + @ux-designer | CTAs que no nombran acción+canal: "Confirmar reserva" (no confirma), "Enviar solicitud", 3 etiquetas distintas para la reserva y 4 para la cotización · **CA**: unificar a "Reservar por WhatsApp" / "Cotizar por WhatsApp" | R-32, R-40, R-41 | — (T-24) |
| **R-11** | @copywriter | Enlaces sociales placeholder (`instagram.com/[usuario]`, `facebook.com/[pagina]`, `tripadvisor.com/[ficha]`) en footer y galería → 404 externos | R-11 | **P-05** |
| **R-34** | @frontend-dev | `Photo.astro`: `loading="lazy"` fijo (incluye héroes = LCP), `alt=""` por defecto, sin `width`/`height` (CLS); cero `prefers-reduced-motion` en todo el build | R-34, R-50 | **P-16** (T-26) |
| **R-43** | @copywriter | Sin copy de 404 ni de error en formularios; variante inline sin campo "Nombre"; correo no viaja en el mensaje de WhatsApp pese a la promesa | R-43 | — (T-45/T-24) |
| **R-51** | @seo-geo + @frontend-dev | CSS de Google Fonts render-blocking en `<head>`; sin `content-visibility` en `/menu/` (8 secciones) · **CA**: fuentes auto-hospedadas o preload selectivo | R-51 | — (T-28) |
| **R-53** | @frontend-dev | NAP/capacidad/horario duplicados fuera de `site.ts` (`index.astro:54`, `contacto.astro:32,52`, `eventos.astro:15,40`) → riesgo de NAP inconsistente | R-53 | — (T-16/T-33) |
| **R-59** | @qa-tester | Sin harness E2E/Lighthouse CI (`playwright.config.ts`, `lighthouserc.json`, `tests/`) → los ítems 5, 6 y 7 del DoD no son verificables de forma automática | R-12, R-54, R-59 | — (T-05/T-47) |
| **R-61** | @devops + @seo-geo | Dominio declarado en 3 sitios con `// TODO` y sin `docs/RUNBOOK-DNS.md` → canonical/sitemap/OG inconsistentes el día del corte | R-61 | **P-01** (T-06/T-53) |
| **R-62** | @devops | Sin remote git, sin `.vercel/` linkado, sin cuenta de hosting ni **aprobador único de producción**; ToS free vs uso comercial sin verificar | R-62 | **P-19** (T-52) |
| **R-21** | @seo-geo | JSON-LD: `image` como string (§2.2-10 pide array), sin `twitter:image`, sin `potentialAction` | R-21 | P-17 |

### P2 — mejoras (7)

| ID | Responsable | Tarea | Origen |
|---|---|---|---|
| **R-10** | @frontend-dev | `TODO` ×6 en comentarios HTML y `ph-label` ×30 en `dist/` → el grep literal del DoD 7.1-2 falla incluso resuelto lo anterior | R-10, R-37 |
| **R-22** | @seo-geo | **Corrección del PLAN**: `maximumAttendeeCapacity` **sí es válido** en schema.org para `Place` (Restaurant la hereda); PLAN §2.2-10 está equivocado (Google no la documenta para Restaurant → no daña, no enriquece). Además `Restaurant.url` sin `/` final ≠ canonical | R-22 |
| **R-23** | @seo-geo | JSON-LD incompleto respecto a F6: faltan `BreadcrumbList`, `Person` (chef), `offers` (correcto omitir hoy) | R-23 |
| **R-24** | @seo-geo + @ux-designer | hreflang con enfoque `canonical.replace` que rompería con `/en/about|events|contact/` → mapeo explícito (§1.2); `aria-label` del logo ≠ texto visible (`label-content-name-mismatch`) | R-24 |
| **R-44** | @copywriter | Pass de glosario: "hasta 120" en 2 sitios, "Precios con IVA." ≠ "Precios con IVA incluido", "Chef Zugetcy Leitón" como titular, Hicaco Plaza en 3 tiempos, 2 formatos de horario | R-44 |
| **R-63** | @devops | Node local 23.7.0 (no LTS) frente al pin `.nvmrc` 22 → fijar `node-version: 22` en CI | R-63 |
| **R-64** | @devops | `.gitignore` no cubre `.env.local`/`.env.*`; sin script `gate` unificado en `package.json`; identidad genérica `opencode <opencode@localhost>` en los commits | R-64 |

---

## 5. Hallazgos por especialista (evidencia)

### 5.1 QA — Playwright + axe + links (@qa-tester)

**Link check** (`linkinator --recurse`, 22 enlaces): **15 rotos** — `/menu-origen.pdf` (404), `/og-image.jpg` (404) y 14 enlaces a `https://www.origenjaco.com/*` con status 0 (dominio no resuelve; origen: `canonical`, `og:url`/`og:image`, `robots.txt`, las 5 `<loc>` del sitemap). OK: las 5 rutas, `/favicon.svg`, CSS, `/sitemap-0.xml`, `/robots.txt`. `href="#"` → 0. Sin `404.html` en `dist/`.

**Playwright + axe** (13/13 tests en verde, Chromium + specs en `/tmp/qa-origen`):

| Ruta | Status | `<h1>` | axe critical/serious | Errores consola |
|---|---|---|---|---|
| `/` | 200 | 1 | 0 / 0 | 0 |
| `/menu/` | 200 | 1 | 0 / 0 | 0 |
| `/nosotros/` | 200 | 1 | 0 / 0 | 0 |
| `/eventos/` | 200 | 1 | 0 / 0 | 0 |
| `/contacto/` | 200 | 1 | 0 / 0 | 0 |

- **0 violaciones de cualquier impacto** en las 5 rutas (reglas `wcag2a/2aa/21a/21aa/best-practice`).
- **`incomplete` (impacto serious, requiere revisión manual)**: `color-contrast` 63 nodos (`bgGradient`: `.script`, `.hero-sub`, `.btn-ghost`, `.ph-label`) · `aria-prohibited-attr` 1 nodo en las 5 rutas (el `div.lang`) · `link-in-text-block` 1 en `/nosotros/` y `/eventos/`.
- **Interacciones**: tabs con click ✅ y flechas ←/→ con roving `tabindex` ✅ · `<details>` de FAQ con click y `Enter` ✅ · `aria-current="page"` exactamente 1 en las 5 rutas ✅.

**Placeholders en texto visible (100)**: `[₡ precio]` ×48 · `[Nombre del plato]` ×12 · `[Descripción por confirmar]` ×12 · `[Dirección exacta]` ×7 · `[Logo aliado]` ×6 · reseñas ×6 · `[confirmar]`/`[ ]` ×3 · bios de `/nosotros/` ×3 · FAQ ×2. Por URL: `/` 32 · `/menu/` 55 · `/nosotros/` 4 · `/eventos/` 4 · `/contacto/` 5. Además `TODO` ×6, `ph-label` ×30, `0000` ×52.

**JSON-LD superficial**: `JSON.parse` OK en las 5 páginas, pero con `+506 0000 0000`, `[Dirección exacta]`, `[usuario]`/`[pagina]`/`[ficha]` y 2 FAQ con corchetes.

**Criterios §2.4**: 1 `h1` ✅ · 0 errores consola ✅ · axe 0 violaciones ✅ (con salvedad) · placeholders ❌ · titles/descriptions ❌ · enlaces rotos ❌ · Lighthouse ⬜ (lo hizo @seo-geo) · gate ❌ (T-04 sin hacer) · NAP ❌.

### 5.2 SEO / JSON-LD / on-page (@seo-geo)

Ver §2 (Lighthouse) y las tablas siguientes.

**JSON-LD**: 1 bloque por página (array), `JSON.parse` OK 5/5, URLs absolutas correctas.

| Página | Entidades |
|---|---|
| `/` | `Restaurant` (+ `PostalAddress`, `GeoCoordinates`, `OpeningHoursSpecification`) |
| `/menu/` | `Restaurant` + `Menu` → 4 `MenuSection` → 18 `MenuItem` |
| `/nosotros/` | `Restaurant` |
| `/eventos/` | `Restaurant` |
| `/contacto/` | `Restaurant` + `FAQPage` → 8 `Question`/`Answer` |

- **Errores**: placeholders en `address.streetAddress`, `telephone` y `sameAs` (5/5), 2 respuestas de `FAQPage` con corchetes, y `Restaurant.image` → **404**.
- **Avisos**: `maximumAttendeeCapacity` **sí es válido** en schema.org para `Place` (corregir PLAN §2.2-10) · `Restaurant.url` sin `/` · faltan `BreadcrumbList`/`Person`/`potentialAction` (F6) · `AggregateRating` correctamente omitido.
- **Coherencia buena**: horario 11:00–22:00 = texto visible ✓ · `FAQPage` 8/8 1:1 con `/contacto/` ✓ · `Menu` 18/18 1:1 con `/menu/` ✓ · `offers` omitido = correcto mientras no haya precios ✓.

**SEO on-page**:

| URL | `<title>` (car.) | Meta description (car.) | `h1` | `og:type` | `og:image` | Canonical |
|---|---|---|---|---|---|---|
| `/` | 68 ✗ | 139 ✓ | 1 ✓ | `restaurant` ✗ | 404 ✗ | auto-ref. ✓ |
| `/menu/` | 62 ✗ | 163 ✗ | 1 ✓ | `restaurant` ✗ | 404 ✗ | auto-ref. ✓ |
| `/nosotros/` | 48 ✓ | 171 ✗ | 1 ✓ | `restaurant` ✗ | 404 ✗ | auto-ref. ✓ |
| `/eventos/` | 55 ✓ | 148 ✓ | 1 ✓ | `restaurant` ✗ | 404 ✗ | auto-ref. ✓ |
| `/contacto/` | 77 ✗ | 137 ✓ | 1 ✓ | `restaurant` ✗ | 404 ✗ | auto-ref. ✓ |

Además: `og:locale` `es_CR` ✓ · `twitter:card` presente pero sin `twitter:image` · `og:image:width/height/alt` ausentes · hreflang comentado (esperado hasta F5, pero con enfoque `canonical.replace` que rompería con slugs EN distintos) · `<html lang="es">` (debería ser `es-CR`) · sitemap 5/5 URLs con trailing slash ✓ · robots 200 sin bloqueos a bots IA ✓ · **0 `<img>` en `dist/`** → `alt` N/A hoy.

### 5.3 UX / Accesibilidad (@ux-designer)

**Decisiones del PLAN §2.3 verificadas**: tuteo ✅ · un CTA primario por sección y grupos >12 → `/eventos/` ✅ · contraste `--accent-ink` sobre crema **5,04:1** ✅ · **incumplidas**: política de placeholders (§2.3-17), fotos con `alt`/héroe eager, skip link, foco ≥3:1, `prefers-reduced-motion`, JS progresivo.

**Contraste calculado** (pares clave de `global.css`):

| Par | Ratio | AA |
|---|---|---|
| `--accent` `#D9844A` / `--bg` `#0F0E0C` | 6,75:1 | ✓ |
| `--accent-ink` `#9A4F1E` / `.light` `#F2EBDD` | **5,04:1** | ✓ |
| **`--accent` / `.light`** (anillo de foco en crema) | **2,41:1** | ✗ <3 |
| `--on-accent` `#140F0A` / `--accent` | 6,67:1 | ✓ |
| `--muted` `#A89F90` / `--bg` | 7,37:1 | ✓ |
| **`--border` `#4A443B` / `--bg`** (borde de inputs) | **2,00:1** | ✗ <3 |
| `/` del selector `.lang` / `--bg` | 3,41:1 | ✗ (es `aria-hidden`) |

**Otros**: sin menú colapsado móvil (la única media query es `max-width:640px` y solo cambia paddings); targets `.main-nav a` ≈41 px, `.lang a`/`.cat-nav a` ≈43 px, `.link-caps` ≈39 px; formularios sin `action`/`noscript` y sin fallback de popup; `max="21:30"` vs cierre 22:00; tabs sin JS ocultan 3 paneles; selector de idioma inaccesible.

### 5.4 Copy (@copywriter)

- **Voz**: ✅ tuteo uniforme (0 "usted"), ✅ sensorial con ingredientes, ✅ sin superlativos ni anglicismos, ✅ 1 `h1`/página. ❌ CTAs: 2 de 6 flujos no nombran canal; 3 etiquetas distintas para la reserva, 4 para la cotización.
- **Glosario**: ✅ "Origen", "Jacó" con tilde, tagline "Mar · Tierra · Fuego", "a la parrilla" ×10 (0 "grill"), "la chef Zugetcy Leitón". ⚠️ "hasta 120" en 3/5 · "Precios con IVA." en la meta de `/menu/` · titular "Chef Zugetcy Leitón" en `/nosotros/`.
- **FAQ**: ✅ 8/8 ≤40 palabras y autoconclusivas en redacción · ❌ 3 con placeholders → no citables ni válidas para `FAQPage`.
- **Datos**: ✅ horario/capacidad/teléfono consistentes entre páginas y schema (aunque placeholder) · ⚠️ 2 formatos de horario, `max="21:30"` vs 22:00, Hicaco en 3 tiempos, "octubre de 2026" no confirmado en §5.
- **Recuento de placeholders por URL**: `/` 32 · `/menu/` 55 · `/nosotros/` 4 · `/eventos/` 4 · `/contacto/` 5 = **100** (más 23 en JSON-LD, 16 `href`, 30 `ph-label`, 52 `0000`, 6 `TODO`).

### 5.5 Frontend / Código (@frontend-dev)

| Evidencia | Resultado |
|---|---|
| `npm run check` | 17 archivos · **0 errores / 0 avisos / 0 hints** ✅ |
| `dist/` | **88,9 KB / 10 archivos**: 5 HTML (78,4 KB) + 1 CSS (9,4 KB) + favicon/robots/sitemap · **0 JS externo** · 2 módulos inline de 495 B y 463 B (presupuesto 50 KB ✅) |
| Build vigente | `dist/` más reciente que `src/` ✅ |
| Git | `main`, 4 commits convencionales, árbol limpio ✅ |
| CI / gate | ❌ sin `.github/workflows/`, sin `scripts/`, sin `tests/` |

**Deuda concreta**: `menu.ts:55` (`formatPrice` devuelve `'[₡ precio]'` en vez de omitir) · `menu.astro:66` y `Base.astro:14,29` → 404 · sin `404.astro` · `index.astro:117` paneles `hidden` · formularios sin `action`/`noscript` · `ReserveForm.astro:37` `date.min` UTC · `Photo.astro:15` sin dimensiones y `lazy` fijo · `Base.astro:78` fuentes render-blocking · `Base.astro:67` `og:type` inválido, `:54` `lang` hardcodeado, `:62-64` comentarios de hreflang servidos, `:33` `maximumAttendeeCapacity` (ver R-22) · NAP literal fuera de `site.ts` en `index.astro:54`, `contacto.astro:32,52`, `eventos.astro:15,40`.

### 5.6 DevOps / Deploy (@devops)

- **Repo**: `main`, **sin remote** (no hay riesgo de push accidental) · 4 commits convencionales en español ✅ · árbol limpio · `.gitignore` cubre `node_modules/`, `dist/`, `.astro/`, `.env`, `.DS_Store`, `.vercel/` ✅ · sin secretos trackeados ✅ · ⚠️ autoría `opencode <opencode@localhost>`.
- **Toolchain**: scripts `dev/build/preview/check` ✅ · `engines ">=20 <24"` ✅ · devDeps `@astrojs/check`+`typescript` ✅ · `package-lock.json` trackeado ✅ · `.nvmrc` 22 ✅ (local 23.7.0) · Astro instalado 5.18.2 · README documenta el gate, cuyo paso 4 **no existe** (T-04).
- **CI**: ❌ sin workflows · ❌ sin `check-placeholders.mjs` · ❌ sin `playwright.config.ts` ni `lighthouserc.json`.
- **Deploy readiness**: ❌ sin `vercel.json`/`netlify.toml` (headers medidos ausentes con `curl -sI`) · ❌ sin 404 propio · ❌ `og-image.jpg` y `menu-origen.pdf` en 404 · ⚠️ dominio en 3 sitios con TODO · ❌ sin `RUNBOOK-DNS.md` · ❌ sin `.vercel/` ni remote · ❌ P-19 sin resolver.
- **Seguridad verificada**: sin `.env` trackeado · sin push/deploy/DNS ejecutados ✅ · sin `.env` ni credenciales en el historial ✅.
- **Checklist de producción**: 14 ítems, 12 ❌, 1 🟡 (Node), 1 ✅.

---

## 6. Bloqueos del cliente que impiden cerrar los P0

| Hallazgo | Insumo necesario (PLAN §5) |
|---|---|
| R-02, R-04 | **P-02** dirección exacta · **P-03** teléfono/WhatsApp/correo · **P-05** redes y links de Maps/Waze · **P-06** ficha de Google · **P-10** formas de pago y 10 % de servicio |
| R-01 (parcial), R-05 | **P-07** precios de todo el menú · **P-08** ~12 platos pendientes · **P-12** reseñas · **P-13** logos · **P-14/P-15** bio y cita de la chef y visión de dueños · **P-20** keywords |
| R-03 | **P-17** `og-image.jpg` · **P-18** `menu-origen.pdf` · **P-01** dominio |
| R-30 | **P-04** horario real y política de último pedido |
| R-34, R-01 | **P-16** fotos según `docs/SHOTLIST.md` (T-25, aún no creada) |
| R-57, R-62 | **P-19** cuenta de hosting, admin del repo y aprobador único de producción |

**R-25, R-27, R-47, R-56** no dependen del cliente: son trabajo de F1/F7 (T-09, T-10, T-45, T-04).

---

## 7. Próximos pasos recomendados

1. **Sin esperar al cliente** → ejecutar en F1: **R-25** (T-09), **R-27** (T-10), **R-47** (T-45), **R-56** (T-04), **R-01** parcial (ocultar secciones: T-13/T-17), **R-29/R-30/R-31** (T-11), **R-32** (T-24), **R-19** (T-15), **R-53** (T-16).
2. **Pedir de una vez al cliente** el bloque P-01…P-18 (§6) con el formato "un dato por línea" de PLAN §5.
3. Antes de cualquier publicación: gate de placeholders en verde + batería completa (T-46/T-47) + DoD ítems 2, 4, 5, 7, 8 en verde.
4. **Nada de push, deploy o DNS sin aprobación explícita** (PLAN §2.5).
