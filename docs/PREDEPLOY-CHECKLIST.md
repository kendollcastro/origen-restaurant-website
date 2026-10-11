# PREDEPLOY-CHECKLIST — Checklist on-page pre-deploy (T-48 · F7 · @seo-geo)

> **Tarea:** **T-48** · F7 — Checklist on-page pre-deploy.
> **Fecha de creación:** 2026-10-11 · **Rol:** @seo-geo · **Est.:** 3 h.
> **CA de la tarea:** 0 errores críticos · Lighthouse SEO ≥ 95 móvil · checklist íntegramente marcado.
> **Naturaleza:** documento **vivo de pre-lanzamiento**. Nada queda «a ojo»: cada casilla `[x]` cita
> artefacto/archivo; cada `[ ]` cita el pendiente del cliente **P-xx** y/o la tarea **T-xx** que lo cierra.
> **Alcance:** 5 páginas ES (`/`, `/menu/`, `/nosotros/`, `/eventos/`, `/contacto/`) + señales que
> dependen del go-live. La versión EN (`/en/*`) está provisional con `noindex` y fuera del sitemap (P-22).

---

## Leyenda

- `[x]` **Verificado hoy** sobre código/`dist/`/corrida local → cita archivo o artefacto.
- `[ ]` **Pendiente** → depende del cliente (**P-xx**), de una tarea de construcción (**T-xx**) o del
  dominio publicado (**go-live**). No es un defecto de código hoy: el gate/diseño lo cubre o lo difiere.

**Documentos de referencia:** [QA-REPORT.md](./QA-REPORT.md) · [BASELINE.md](./BASELINE.md) ·
[GSC-CHECKLIST.md](./GSC-CHECKLIST.md) · [SHOTLIST.md](./SHOTLIST.md) · [PLAN.md](./PLAN.md) (§1 mapa, §5 P-xx, §7 DoD).
**Dominio final:** `https://www.origenjaco.com` (provisional; **P-01 → T-06/T-53**).

---

## 0. Puerta local (pre-deploy) — corrida 2026-10-11

- [x] `npm run check` → **0 errores / 0 warnings** (1 hint preexistente `scripts/check-placeholders.mjs:107`) · exit 0.
- [x] `npm run build` → **11 páginas** (5 ES + 5 `/en/*` + `404.html`) · exit 0.
- [x] `npm run gate` → **TOTAL: 0 bloqueantes** (0 texto visible + 0 JSON-LD) · exit 0 (`scripts/check-placeholders.mjs`).
- [x] `npx playwright test` → **244 passed** · chromium + Pixel 5 · exit 0 ([QA-REPORT.md](./QA-REPORT.md) §T46.2).
- [x] **Lighthouse CI SEO ≥ 95 móvil (T-47):** 5/5 URLs con **SEO = 100** en `lhci-reports/*.report.json` (3 runs/URL) · asserts de `lighthouserc.json` (SEO ≥ 0.95) en verde ([BASELINE.md](./BASELINE.md) §2).

---

## 1. SEO on-page (5 páginas ES)

Estado por página (evidencia `dist/*.html`, corrida 2026-10-11):

| Señal | `/` | `/menu/` | `/nosotros/` | `/eventos/` | `/contacto/` |
|---|---|---|---|---|---|
| `<title>` único | ✅ 68 | ✅ 62 | ✅ 48 | ✅ 55 | ✅ 77 |
| `<title>` ≤ 60 | ❌ 68 | ❌ 62 | ✅ | ✅ | ❌ 77 |
| description 120–160 | ✅ 135 | ❌ 163 | ❌ 171 | ✅ 148 | ✅ 137 |
| 1 `h1` | ✅ | ✅ | ✅ | ✅ | ✅ |
| canonical self-ref. | ✅ | ✅ | ✅ | ✅ | ✅ |
| viewport | ✅ | ✅ | ✅ | ✅ | ✅ |
| `og:locale` `es_CR` | ✅ | ✅ | ✅ | ✅ | ✅ |

- [x] **1 `h1` visible por página** en las 5 ES — `tests/e2e/onpage.spec.ts` + `smoke.spec.ts` ([QA-REPORT.md](./QA-REPORT.md) §T46.6-2).
- [x] **`<title>` único** en las 5 ES (68/62/48/55/77, sin colisiones) — `dist/*.html`.
- [x] **Canonical auto-referenciada, absoluta y correcta** en las 5 ES (`https://www.origenjaco.com{/|/menu/|/nosotros/|/eventos/|/contacto/}`) — `src/layouts/Base.astro:19,109` · `dist/*.html`.
- [x] **`viewport`** `width=device-width, initial-scale=1` en 5/5 — `src/layouts/Base.astro:105`.
- [x] **`og:locale` = `es_CR`** en 5/5 — `src/layouts/Base.astro:20,122`.
- [ ] **`<title>` ≤ 60 car.** en las 5: hoy `/`=68, `/menu/`=62, `/contacto/`=77 (3 exceden) — **T-14 / P-20** ([BASELINE.md](./BASELINE.md) H-04).
- [ ] **Meta description 120–160 car.** en las 5: hoy `/menu/`=163, `/nosotros/`=171 (2 exceden) — **T-14 / P-20** ([BASELINE.md](./BASELINE.md) H-05).
- [ ] **Dominio final fijado** en `astro.config.mjs`, `site.ts` y `robots.txt` (hoy coherentes pero provisionales) — **P-01 / T-06** ([GSC-CHECKLIST.md](./GSC-CHECKLIST.md) §1.10).
- [ ] **`<html lang>` alineado a `es-CR`** (hoy `lang="es"`) — **H-08** ([BASELINE.md](./BASELINE.md) §5).
- [ ] **Enlaces internos ≥ 3 relevantes/página sin rotos** (hoy solo el PDF pendiente, §5) — verificación viva **T-54**.

---

## 2. JSON-LD / rich results

- [x] **`Restaurant` en 11/11 páginas; `Menu` en `/menu/`; `FAQPage` en `/contacto/`; `BreadcrumbList` en 4 ES** — `JSON.parse` OK 11/11 bloques ([QA-REPORT.md](./QA-REPORT.md) §T46.5 / §G.4, **T-40/T-44**).
- [x] **JSON-LD 1:1 con el texto visible y sin corchetes** — gate 0 (`TOTAL: 0`) + `tests/e2e/seo.spec.ts` (T-40).
- [x] **`AggregateRating` ausente** (no hay reseñas reales) — `src/layouts/Base.astro:35-83` (R-06).
- [x] **`openingHoursSpecification` coherente 1:1** con «Todos los días · 11:00 am – 10:00 pm» — `src/layouts/Base.astro:66-71`.
- [ ] **`image` real** en `Restaurant` (hoy omitido por falta de `og-image.jpg`) — **P-17 / T-27** ([BASELINE.md](./BASELINE.md) H-06).
- [ ] **`telephone` real** en `Restaurant` (hoy omitido; `site.phone` placeholder `0000`) — **P-03 / T-18 / T-29**.
- [ ] **`sameAs` reales** (hoy omitido; `social.*` = `[usuario]`) — **P-05 / T-18 / T-29**.
- [ ] **`streetAddress` real** (hoy omitido; P-02) — **P-02 / T-18 / T-29**.
- [ ] **Rich Results Test sin errores sobre dominio público** (`Restaurant`, `Menu`, `FAQPage`) — **P-01 / T-54**.
- [ ] **Re-validación JSON-LD en el dominio publicado** (no solo local) — **P-01 / T-53 / T-54**.

---

## 3. Social / Open Graph

- [x] **`og:type="website"`** (valor válido) en 5/5 — `src/layouts/Base.astro:116` (antes `restaurant`, H-01).
- [x] **`og:title` / `og:description` / `og:url` / `og:site_name`** heredan title/description/canonical en 5/5 — `src/layouts/Base.astro:117-120`.
- [x] **`twitter:card = summary_large_image`** en 5/5 — `src/layouts/Base.astro:123`.
- [ ] **`og-image.jpg` real 1200×630 respondiendo 200** (hoy `og:image` → 404, `public/og-image.jpg` inexistente) — **P-17 / T-27** ([BASELINE.md](./BASELINE.md) H-06).
- [ ] **`og:image:width` / `og:image:height` / `og:image:alt`** — **T-27**.
- [ ] **`twitter:title` / `twitter:description` / `twitter:image`** (hoy ausentes) — **T-27**.
- [ ] **OG debugger (Facebook Sharing Debugger)** muestra preview sin recorte con la imagen real — **P-17 / T-27**.

---

## 4. hreflang e internacional (T-38)

- [ ] **Pares recíprocos `es`/`en`** en las 10 URLs (hoy **0** etiquetas `hreflang` emitidas; comentadas en `src/layouts/Base.astro:111-113`) — **T-38**.
- [ ] **`x-default`** → `/` (o `/en/` si se prioriza turista) — **PP-04 / T-38**.
- [ ] **`og:locale:alternate`** `en_US`/`es_CR` cruzados — **T-38**.
- [ ] **`alternates` en el sitemap** (`@astrojs/sitemap`) — **T-38 / `astro.config.mjs`**.
- [x] **`/en/` con `noindex, nofollow` hoy** (provisional pre-go-live, correcto) — `src/layouts/Base.astro:23,108` · 5/5 `dist/en/**/index.html`.
- [ ] **`/en/` indexable en go-live** (retirar `noindex` cuando la traducción esté aprobada) — **T-38 / P-22**.

---

## 5. Alt y medios

- [x] **Ningún dato crítico depende de imagen/JS/PDF**: platos, precios, horario, FAQ y NAP están en HTML estático — [QA-REPORT.md](./QA-REPORT.md) §G.3 (**T-42/T-44**).
- [x] **Shot list y guía de `alt` preparadas** (31 filas, héroe eager/prioritario) — [SHOTLIST.md](./SHOTLIST.md) (**T-25**).
- [ ] **Fotos reales integradas** (hoy 0 `<img>`; las fotos son `background-image` de `.ph`) — **P-16 / T-26**.
- [ ] **`alt` descriptivo en todas las fotos** (aplica una vez existan `<img>`) — **P-16 / T-26** ([SHOTLIST.md](./SHOTLIST.md) §3).
- [ ] **`/menu-origen.pdf` responde 200** y sincronizado con el HTML (hoy 404) — **P-18 / T-28** ([QA-REPORT.md](./QA-REPORT.md) §T46.4).

---

## 6. Performance / Core Web Vitals

- [x] **Lighthouse SEO = 100 móvil en 5/5** (CA «SEO ≥ 95») — `lhci-reports/*.report.json` (**T-47**).
- [x] **Lighthouse lab local en presupuesto**: perf media **99,6** móvil; LCP 1,5–1,6 s; CLS máx **0,044** — [BASELINE.md](./BASELINE.md) §2–3.
- [ ] **PSI/Lighthouse en el dominio real** con perf **≥ 90** móvil — **P-01 / T-49 / T-53**.
- [ ] **LCP < 2,5 s** medido en producción — **T-49**.
- [ ] **CLS < 0,1** medido en producción — **T-49**.
- [ ] **INP < 200 ms** (dato de campo) — **T-49**.
- [ ] **Fuentes auto-hospedadas** (hoy Google Fonts render-blocking, H-12) — **T-28 / T-49**.

---

## 7. GO-LIVE técnico

- [ ] **Dominio final confirmado** (`origenjaco.com`, quién controla el DNS) — **P-01 / T-06**.
- [ ] **301 apex → www** verificado con `dig`/curl — **T-53**.
- [ ] **HTTPS forzado y certificado válido** — **T-53**.
- [x] **Sitemap = 5 URLs canónicas** ES con trailing slash, sin `/en/` ni `/404` — `dist/sitemap-0.xml` ([GSC-CHECKLIST.md](./GSC-CHECKLIST.md) §1.1–1.4, **T-07**).
- [x] **`robots.txt`** `Allow: /` + `Sitemap:` absoluto, sin `Disallow` (no bloquea bots IA) — `public/robots.txt:1-4` (**T-07**).
- [ ] **`site`/`robots`/`sitemap` con el dominio final** (hoy coherentes pero provisionales) — **P-01 / T-06 / T-53**.
- [ ] **Retirar `noindex` de `/en/`** — **T-38 / P-22**.
- [ ] **Headers de seguridad + cache** (`vercel.json`) activos en producción — **T-52**.

---

## 8. Google Search Console

Pasos detallados y secuencia en [GSC-CHECKLIST.md](./GSC-CHECKLIST.md) §2–3 (todos **pendientes de dominio real**, P-01).

- [ ] **Cuenta de Google con acceso del cliente** para la propiedad.
- [ ] **Propiedad añadida** (`https://www.origenjaco.com/` o propiedad *Dominio* vía TXT).
- [ ] **Propiedad verificada** del cliente.
- [ ] **`robots.txt` y `sitemap-index.xml` responden 200** en el dominio publicado.
- [ ] **Sitemap enviado** en GSC.
- [ ] **Sitemap leído correctamente**: 5 URLs descubiertas, 0 con error.
- [ ] **Inspección de URL** en las 5: canonical seleccionada = propia URL, «Disponible para Google».
- [ ] **Indexación solicitada** en las 5 (empezando por `/`).
- [ ] **Datos estructurados** validados en GSC (`Restaurant`, `Menu`, `FAQPage` sin errores) — **T-54**.
- [ ] **Core Web Vitals** en campo tras tráfico real.
- [ ] **Monitorización** (cobertura, enlaces rotos, búsqueda de marca) revisada semanalmente.

---

## 9. QA final y smoke en producción

- [x] **Batería T-46 en verde en local**: `check`+`build`+gate+Playwright(244)+axe(0 violaciones)+JSON-LD — [QA-REPORT.md](./QA-REPORT.md) §T46.
- [ ] **Batería T-46 re-ejecutada en producción** — **T-54**.
- [ ] **Smoke de las 5 URLs en prod** (200 + 1 `h1` + 0 errores de consola) — **T-54**.
- [ ] **Smoke de assets en prod**: canonical, `og-image.jpg` (200), `menu-origen.pdf` (200), `sitemap-index.xml`, `robots.txt` — **T-54 / P-17 / P-18**.
- [ ] **Gate de placeholders sobre el sitio en vivo** (`0000`, `TODO`, `ph-label` = 0 en prod) — **T-54 / T-50**.
- [ ] **Alta final en Search Console + Rich Results** registrada como evidencia — **T-54**.

---

## Resumen

| Sección | Casillas | `[x]` hoy | `[ ]` pendientes |
|---|---|---|---|
| 0. Puerta local | 5 | 5 | 0 |
| 1. SEO on-page | 10 | 5 | 5 |
| 2. JSON-LD / rich | 10 | 4 | 6 |
| 3. Social / OG | 7 | 3 | 4 |
| 4. hreflang | 6 | 1 | 5 |
| 5. Alt y medios | 5 | 2 | 3 |
| 6. Performance | 7 | 2 | 5 |
| 7. GO-LIVE técnico | 8 | 2 | 6 |
| 8. Search Console | 11 | 0 | 11 |
| 9. QA final | 6 | 1 | 5 |
| **Total** | **75** | **25** | **50** |

**Veredicto pre-deploy:** **0 errores críticos de código**. Lo verificado hoy (gate verde, JSON-LD válido
local, SEO 100 móvil, canonical/`h1`/viewport/OG base correctos) sostiene el lanzamiento técnico; las **50
casillas `[ ]`** son insumos del cliente (**P-01…P-22**), go-live/DNS (**T-06/T-38/T-53**) y los QA finales
en producción (**T-49/T-54**). El sitio **no se publica a producción** hasta cerrar §7–§8 y re-ejecutar §9.
