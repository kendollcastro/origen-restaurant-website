# QA-REPORT · Verificación cruzada NAP y smoke `wa.me`/Maps/Waze

> **Tarea:** T-34 · F4 · @qa-tester
> **Fecha:** 2026-10-10
> **Spec:** `tests/e2e/seo.spec.ts`
> **Fuente de verdad:** `src/data/site.ts` (única fuente del NAP)
> **Alcance:** igualdad literal de cadenas, enlaces de contacto, JSON-LD, crawl de 0 rotos, smoke `wa.me`/Maps/Waze. La comparación con la **ficha de Google queda PENDIENTE (P-06)** porque la ficha aún no existe; no se inventa dato alguno.

---

## 1. Cómo se ejecuta

```bash
npm run build && npm run preview   # lo levanta playwright.config.ts automáticamente
npx playwright test tests/e2e/seo.spec.ts
# Batería completa:
npm run check && npm run build && npm run gate && npx playwright test
```

Sin datos reales del cliente, el spec valida **coherencia literal contra `site.ts`** y respeta la
política «ocultar > inventar» (GLOSARIO): los campos placeholder se omiten en el HTML/JSON-LD y el
test comprueba que así sea, en vez de inventar valores.

## 2. Resumen de resultados (2026-10-10)

| Paso | Resultado |
|---|---|
| `npm run check` | **0 errores / 0 warnings** · exit 0 |
| `npm run build` | **6 páginas** (`/`, `/menu/`, `/nosotros/`, `/eventos/`, `/contacto/`, `/404.html`) · exit 0 |
| `npm run gate` (placeholders) | **0 bloqueantes** (0 texto visible + 0 JSON-LD) · exit 0 · avisos TODO × 6, ph-label × 1, 0000 × 70 (todos dato pendiente) |
| `npx playwright test` | **206 passed** (160 previos + **46 nuevos** de `seo.spec.ts`) · chromium + Pixel 5 |

## 3. Verificación cruzada NAP

| Campo | `site.ts` | Footer (6 rutas) | `/contacto/` | JSON-LD `Restaurant` | Ficha Google |
|---|---|---|---|---|---|
| `fullName` `Origen. Mar, tierra y fuego` | ✅ fuente | ✅ `© …` | ✅ bloque Dirección | ✅ `name` | ⏳ pendiente P-06 |
| `address.locality` `Jacó` | ✅ | ✅ | ✅ | ✅ `addressLocality` | ⏳ pendiente P-06 |
| `address.county` `Garabito` | ✅ | ✅ | ✅ | — (no existe en PostalAddress) | ⏳ pendiente P-06 |
| `address.region` `Puntarenas` | ✅ | ✅ | ✅ | ✅ `addressRegion` | ⏳ pendiente P-06 |
| `address.countryName` `Costa Rica` | ✅ | ✅ | ✅ | ✅ `addressCountry` = `CR` | ⏳ pendiente P-06 |
| `address.street` `[Dirección exacta]` | ⏳ P-02 | oculto (política) | oculto | `streetAddress` omitido · verificado | ⏳ P-06 |
| `phone` `+506 0000 0000` | ⏳ P-03 | ✅ `tel:+50600000000` (texto idéntico) | ✅ idéntico | `telephone` omitido (placeholder `0000`) · verificado | ⏳ P-06 |
| `whatsapp` `50600000000` | ⏳ P-03 · válido `^506\d{8}$` | ✅ `wa.me/50600000000` | ✅ | — (no es propiedad `Restaurant`) | ⏳ P-06 |
| `email` `info@origenjaco.com` | ✅ (T-33) | ✅ `mailto:` | ✅ `mailto:` | ✅ `email` | ⏳ P-06 |
| `hours` 11:00 am – 10:00 pm | ✅ | ✅ | ✅ | ✅ `openingHoursSpecification` / `schema` | ⏳ P-04/P-06 |
| `mapsUrl` / `wazeUrl` | ✅ (TODO P-05) | — | ✅ enlace `_blank` + `noopener` | — | ⏳ P-05/P-06 |
| `social.*` (`[usuario]`) | ⏳ P-05 | oculto (`isReal`), `sameAs` sin corchetes | — | `sameAs` omitido · verificado | ⏳ P-05/P-06 |
| `capacity` 120 | ✅ | — | — | ✅ `maximumAttendeeCapacity` | ⏳ P-06 |

> **Igualdad literal verificada por test:** las cadenas de Footer y `/contacto/` se comparan
> carácter a carácter con `site.ts` (importado en el spec) y el JSON-LD con los mismos valores.
> **PENDIENTE explícito:** la columna *Ficha Google* no se puede ejecutar (P-06, ficha aún no
> existe) y cuando exista debe compararse **literalmente** contra `site.ts` (T-29/T-30).

## 4. Enlaces de contacto (`tel:` / `wa.me` / `mailto:`)

| Comprobación | Estado | Evidencia |
|---|---|---|
| `tel:` sin espacios `^tel:\+\d+$` | ✅ | `tel:+50600000000` en Footer y `/contacto/` = `telHref(site.phone)` |
| `wa.me` formato `^506\d{8}$`, sin `+`/espacios | ✅ | `50600000000`; CTA de reserva y Footer → `wa.me/50600000000` |
| Formularios `wa.me` **con `text=`** | ✅ | `form.reserve-form` (reserva) y `#event-form` (eventos) contienen `?text=` + `data-wa=site.whatsapp` |
| `mailto:info@origenjaco.com` | ✅ | Footer y `/contacto/` con texto `site.email` |

## 5. Crawl de enlaces locales (6 rutas: `/`, `/menu/`, `/nosotros/`, `/eventos/`, `/contacto/`, `/404.html`)

- **Href con corchetes:** 0 en toda ruta (los `social.*` placeholder no llegan al DOM).
- **`page.request.get` → status ≠ 200:** 1
  - `/menu-origen.pdf` → **404**, origen: `/menu/` — **pendiente P-18 → T-28** (el cliente debe
    entregar el PDF). El spec lo mantiene en `KNOWN_PENDING_LOCAL_LINKS` con nota y **falla si
    aparece cualquier otro 4xx** o si el PDF deja de ser pendiente (allowlist obsoleta).
  - Salvo ese, **todo responde 200** (incluye `/404/` self-link de la 404 y las 5 páginas).
- `/404.html` se sirve (200) y una ruta inexistente responde **404** real.

## 6. Hallazgos y pendiente tras T-18 (NAP real) y P-06

**Coherente con `site.ts` hoy** (todo lo no-placeholder): nombre, localidad/Garabito/Puntarenas/Costa
Rica, email, horario, capacidad, Maps/Waze, y omisión correcta de `streetAddress`, `telephone` y
`sameAs` cuando el origen es placeholder.

**Quedará por re-verificar cuando lleguen los datos reales:**
1. **T-18 (P-01…P-05):** al volcar el NAP real en `site.ts` el spec **cambia flake a verde automáticamente**
   sin tocar código: impone `streetAddress`, `telephone` y `sameAs` literales en Footer/`/contacto/`/JSON-LD.
2. **P-18:** retirar `/menu-origen.pdf` de `KNOWN_PENDING_LOCAL_LINKS` cuando el PDF responda 200.
3. **P-06 (T-29/T-30):** crear/verificar la ficha y ejecutar la comparación **literal** con `site.ts`
   (columna *Ficha Google* de §3) — acción externa al repo, hoy **pendiente y no simulada**.

---

# GEO / contenido estático

> **Tarea:** T-44 · F6 · @devops + @qa-tester
> **última revisión GEO:** **2026-10-11**
> **Alcance:** auditoría de evidencia sobre el build real (`dist/**/*.html`): HTML estático (no
> JS-imagen-PDF), grep de contenido clave y re-validación JSON-LD. **No se editó ninguna página.**

## G.1 Comprobación de CA (estado)

| # | CA | Estado | Dependencia / nota |
|---|---|---|---|
| 1 | Platos presentes en HTML estático (grep por nombre) | ✅ | 0 insumos |
| 2 | Horario `11:00 am – 10:00 pm` en HTML | ✅ | P-04 (cerrado) |
| 3 | **Sin precios inventados** (grep `₡` con dígitos = 0) | ✅ | ⏳ **precios reales P-07** (aún pendiente; política «ocultar > inventar») |
| 4 | FAQ visible e indexable en HTML | ✅ | 0 insumos |
| 5 | NAP (teléfono/dirección) en HTML | ✅ | ⏳ teléfono placeholder **P-03**; dirección calle **P-02** |
| 6 | Datos críticos **no** viven en JS/imagen/PDF | ✅ | PDF sigue 404 → **P-18** (no aporta contenido al DOM) |
| 7 | JSON-LD `JSON.parse` sin error en los 3 tipos | ✅ | 11/11 bloques OK · dominio `origenjaco.com` **P-01** en `@id`/`url` |
| 8 | `/en/` no duplica `Menu`/`FAQPage` | ✅ | 0 insumos |
| 9 | Gate verde | ✅ | 0 bloqueantes |

## G.2 Evidencia grep (archivo:línea)

**a) Platos por nombre** (texto estático en el DOM, no sólo en JSON-LD):

| Plato | Evidencia |
|---|---|
| `Ceviche Diablo` | `dist/menu/index.html:1` (h3 `.dish-name` + JSON-LD) · `dist/index.html:3` |
| `Perlas del Pacífico` | `dist/menu/index.html:1` · `dist/index.html:3` |
| `Rib Eye` | `dist/menu/index.html:1` · `dist/index.html:3` |

**b) Precios y horario**

- **Precios inventados:** `grep -oE '₡ ?[0-9][0-9.,]*' dist` → **0 coincidencias** ✅ (política
  «ocultar > inventar»). Las **22** apariciones de `₡` corresponden únicamente a `"priceRange":"₡₡"`
  (símbolo genérico, **×2 por página · 11/11**), **ningún** precio numérico.
- **Horario** `11:00 am – 10:00 pm` en las 11 páginas. Muestra: `dist/index.html:3` y `:9`,
  `dist/menu/index.html:1`, `dist/contacto/index.html:1`, `dist/nosotros/index.html:1`,
  `dist/eventos/index.html:1`.

**c) FAQ** (visible en `/contacto/`, no sólo JSON-LD): `dist/contacto/index.html:1`
`<h3>¿Cuál es el horario de Origen?</h3>` y `¿Qué tipo de comida sirve Origen?`,
`¿Necesito reservar?`, `¿Tienen menú para niños?`, `¿Reciben grupos y eventos privados?`
(5 `Question` en `FAQPage`).

**d) NAP**: `dist/contacto/index.html:1` → `tel:+50600000000` y
`Origen. Mar, tierra y fuego · Jacó, Garabito, Puntarenas, Costa Rica`
(placeholder de teléfono **P-03**, coherente con §3).

## G.3 Contenido estático vs JS (por página)

- **`<script src=` (externos): 0 en 11/11 páginas** ✅ (`grep -c '<script src=' dist/**/*.html`).
- **`<img>`: 0 en 11/11** — las fotos son `background-image` CSS (`.ph`); **ningún** dato de
  plato/precio/horario depende de imagen o PDF.

| Página | `<script>` total | ld+json | nav-toggle (`module`) | form fecha CR (`module`) | tabs (`module` + inline) | clase `js` inline |
|---|---|---|---|---|---|---|
| `dist/index.html` | 6 | 1 | 1 | 1 | 1 module + 1 inline | 1 |
| `dist/contacto/index.html` | 4 | 1 | 1 | 1 | — | 1 |
| `dist/en/contacto/index.html` | 4 | 1 | 1 | 1 | — | 1 |
| `dist/eventos/index.html` | 4 | 1 | 1 | 1 | — | 1 |
| `dist/en/eventos/index.html` | 3 | 1 | 1 | — | — | 1 |
| `dist/menu/index.html` | 3 | 1 | 1 | — | — | 1 |
| `dist/nosotros/index.html` | 3 | 1 | 1 | — | — | 1 |
| `dist/en/index.html` | 3 | 1 | 1 | — | — | 1 |
| `dist/en/menu/index.html` | 3 | 1 | 1 | — | — | 1 |
| `dist/en/nosotros/index.html` | 3 | 1 | 1 | — | — | 1 |
| `dist/404.html` | 3 | 1 | 1 | — | — | 1 |

Qué hace cada `<script>`: (1) **`ld+json`** = datos structured-data (no ejecutable); (2) **`<script>`**
inicial de 44 b `document.documentElement.classList.add('js')` = mejora progresiva; (3) **`module` nav**
= abrir/cerrar menú móvil; (4) **`module` form** = fecha por defecto en `America/Costa_Rica`
(ReserveForm/eventos); (5) **tabs** (home) = rol `tab`/`tabpanel`. **Ninguno transporta** el contenido
de platos, precios, horario, FAQ ni NAP: todo eso ya está en el HTML servido.

## G.4 Validación JSON-LD por `@type` (re-ejecutada sobre `dist/`)

`JSON.parse` **OK: 11/11** bloques `<script type="application/ld+json">`, **0 errores**.

| `@type` | Nº páginas | Dónde |
|---|---|---|
| `Restaurant` | 11 | 1 por página (ES + EN + 404) |
| `Menu` | 1 | `dist/menu/index.html` (sólo ES) |
| `FAQPage` | 1 | `dist/contacto/index.html` (sólo ES) |
| `BreadcrumbList` | 4 | `menu`, `nosotros`, `eventos`, `contacto` (sólo ES) |

`/en/*` declara **únicamente** `Restaurant` → **no duplica** `Menu`/`FAQPage` ✅.

## G.5 Gate (transcripción)

```
Resumen de bloqueantes (\[[^\]]+\]): TOTAL: 0 (0 texto visible + 0 JSON-LD)
Avisos: TODO × 0 · ph-label × 1 · 0000 × 116
✓ gate OK — 0 placeholders bloqueantes.   (exit 0)
```

## G.6 Puerta de verificación (T-44)

| Paso | Resultado |
|---|---|
| `npm run check` | **0 errores / 0 warnings** (1 hint preexistente en `check-placeholders.mjs`) · exit 0 |
| `npm run build` | **11 páginas** · exit 0 |
| `npm run gate` | **0 bloqueantes** · exit 0 |
| `npx playwright test` | **244 passed** · exit 0 |

## G.7 Hallazgos / contraejemplos al CA

- **Sin contraejemplos al CA.** Contenido clave 100 % HTML estático; 0 scripts externos; JSON-LD válido.
- **Pendientes que NO rompen el CA (por diseño):** P-07 (precios reales → hoy ocultos correctamente),
  P-18 (PDF 404 → enlaza desde `/menu/` pero el contenido no depende de él), P-01 (dominio en
  `@id`/`url`/canonical), P-02/P-03 (calle/teléfono placeholder). Al llegar los datos, la tarea que los
  cargue re-valida sin cambios en estas páginas.

---

# Batería T-46 (F7) — Batería completa

> **Tarea:** T-46 · F7 · @qa-tester
> **Fecha de ejecución:** **2026-10-10** (reloj del entorno: `Sat Oct 10 2026`)
> **Alcance:** `check` + `build` + gate + Playwright (chromium + Pixel 5) sobre `npm run preview`
> (`:4321`) + axe (5 ES) + link check (crawl del spec) + validación JSON-LD (dist) + console errors.
> **Entorno:** Node 23.7.0 (`.nvmrc` fija 22 LTS para CI; local no-LTS, ver §2.4.23).
> **Sin cambios en `src/**`, `data/**`, `scripts/**`, `.github/**`, `astro.config.mjs`, `docs/PLAN.md`.**

## T46.1 check · build · gate (transcripción)

| Paso | Comando | Resultado | Exit |
|---|---|---|---|
| Typecheck | `npm run check` | **0 errors · 0 warnings · 1 hint** (preexistente `check-placeholders.mjs:107` `'err'` sin usar) · 36 archivos | `0` |
| Build | `npm run build` | **11 page(s) built** (`/`, `/menu/`, `/nosotros/`, `/eventos/`, `/contacto/`, `/404.html` + 5 `/en/*`) · `sitemap-index.xml` | `0` |
| Gate | `npm run gate` | **TOTAL: 0 bloqueantes** (0 texto visible + 0 JSON-LD) · avisos: TODO × 0 · ph-label × 1 · 0000 × 116 | `0` |

```
Resumen de bloqueantes (\[[^\]]+\]):  TOTAL: 0 (0 texto visible + 0 JSON-LD)
Avisos: TODO × 0 · ph-label × 1 · 0000 × 116
✓ gate OK — 0 placeholders bloqueantes.   (exit 0)
```

## T46.2 Playwright (CI-set completo)

`npx playwright test` → **244 passed (36.4s)** · exit 0 · projects `chromium` + `Pixel 5` · webServer
`npm run build && npm run preview` (`:4321`, `reuseExistingServer`).

| Spec | Cubre | Estado |
|---|---|---|
| `smoke.spec.ts` | 200 + un `h1` visible + 0 errores de consola (×5 ES) + 404 | ✅ |
| `a11y.spec.ts` | axe sin `serious`/`critical` (×6) + skip-link enfocable/`outline` | ✅ |
| `nav-mobile.spec.ts` | sin scroll horizontal a 360px + nav colapsado + fallback sin JS | ✅ |
| `nojs.spec.ts` | tabs, forms `wa.me`, `date.min` en `America/Costa_Rica` | ✅ |
| `onpage.spec.ts` | jerarquía de headings, 1 `h1`, anclas, breadcrumbs, `og:type` | ✅ |
| `seo.spec.ts` | NAP literal, `tel:`/`wa.me`/`mailto:`, JSON-LD, crawl de enlaces | ✅ |
| `i18n.spec.ts` | `/en/*` `lang="en"`, `noindex`, switcher ES↔EN | ✅ |

**Evidencia local (no commiteada, en `.gitignore`/sin trackear):**
- Reporte HTML: `playwright-report/index.html`
- JUnit: `test-results/junit.xml`
- Capturas: `evidencia/home-desktop.png` (Desktop Chrome), `evidencia/home-pixel5.png` (Pixel 5)

## T46.3 axe (5 páginas ES sobre `:4321`)

Método: `@axe-core/playwright` (reglas por defecto) en `/`, `/menu/`, `/nosotros/`, `/eventos/`,
`/contacto/`.

| Métrica | Resultado |
|---|---|
| Violaciones `critical` | **0** |
| Violaciones `serious` | **0** |
| Violaciones `color-contrast` | **0** |
| Violaciones totales (todos los impactos) | **0** |
| `color-contrast` en `incomplete` (no computable automáticamente) | sí — texto sobre `background-image` (`.ph`) |

**Nota de contraste (R-09, verificada a mano):** axe marca `color-contrast` como **`incomplete`**, no
como violación, en el texto que se apoya en secciones `.ph` (fondo `background-color: var(--ph)`
`#221F1B` + `background-image: repeating-linear-gradient(...)` de baja opacidad ≈3,5 %, lo que impide
el cálculo automático). Cálculo manual del sospechoso `.script` (`color: var(--accent)` `#D9844A`,
44 px/500) sobre `#221F1B`: luminancia relativa `L=0,318` vs `L=0,014` → **contraste ≈ 5,7:1**, que
**supera AA (4,5:1)** incluso para texto normal. **No se detecta el fallo 2,4:1 de R-09 en el build
actual**; hero/h1 usan `--cream` `#F2EBDD` sobre el mismo fondo oscuro (contraste muy superior). → **sin
pendiente de contraste**; el punto queda cubierto por T-47 (Lighthouse a11y) sólo como confirmación.

## T46.4 Link check (crawl del spec, sin dependencias nuevas)

Se usa el crawl interno de `seo.spec.ts:285` (`page.request.get` sobre todos los `<a href>` locales de
las 6 rutas ES) como **link check**. No se instaló `linkinator`.

| Path | Status | Origen | Estado |
|---|---|---|---|
| `/menu-origen.pdf` | **404** | `/menu/` | ⏳ esperado **P-18 → T-28** (allowlist `KNOWN_PENDING_LOCAL_LINKS`) |
| `og-image.jpg` | **404** | meta `og:image` (11 páginas) | ⏳ esperado **P-17** (no es un `<a>`, no entra en el crawl) |
| resto de enlaces locales | **200** | 6 rutas | ✅ 0 rotos |

Log de la corrida: `[crawl T-34] status ≠ 200: [{ "path": "/menu-origen.pdf", "status": 404, "origins": ["/menu/"] }]`.

## T46.5 Validación JSON-LD (T-40, sobre `dist/`)

`JSON.parse` **11/11 bloques OK · 0 errores**.

| `@type` | Nº | Dónde |
|---|---|---|
| `Restaurant` | 11 | 1/página (5 ES + 5 EN + `404.html`) |
| `BreadcrumbList` | 4 | `/menu/`, `/nosotros/`, `/eventos/`, `/contacto/` (sólo ES) |
| `FAQPage` | 1 | `/contacto/` (sólo ES) |
| `Menu` | 1 | `/menu/` (sólo ES) |

`/en/*` declara sólo `Restaurant` → no duplica `Menu`/`FAQPage` ✅. Sin corchetes de placeholder en
ninguna cadena (verificado por `seo.spec.ts` y por el gate).

## T46.6 Criterios globales §2.4.22 (estado real)

| # | Criterio | Estado | Evidencia / bloqueo |
|---|---|---|---|
| 1 | 0 placeholders `\[[^\]]+\]` en `dist/` **y** JSON-LD | ✅ | gate `TOTAL: 0` (§T46.1) |
| 2 | 1 `h1` por página | ✅ | `onpage.spec.ts` + conteo `h1n=1` en 5 ES |
| 3 | titles únicos **≤60** y descriptions **120–160** | ⏳ **T-14 / P-20** | títulos: `/`=68, `/menu/`=62, `/nosotros/`=48 ✅, `/eventos/`=55 ✅, `/contacto/`=77 ❌; descriptions: `/`=135 ✅, `/menu/`=163 ❌, `/nosotros/`=171 ❌, `/eventos/`=148 ✅, `/contacto/`=137 ✅ |
| 4 | 0 enlaces internos rotos (PDF e `og-image` → 200) | ⏳ **P-18 / P-17** | sólo `/menu-origen.pdf` 404 (P-18) y `og-image.jpg` 404 (P-17); resto 200 (§T46.4) |
| 5 | axe 0 `critical`/`serious` y 0 `color-contrast` | ✅ | 0 violaciones (§T46.3); `incomplete` sobre `.ph` con cálculo manual 5,7:1 |
| 6 | Lighthouse perf ≥90 mobile / a11y ≥95 / SEO ≥95 | ⏳ **T-47** | LHCI **no instalado**; no se ejecuta (acordado no instalar) |
| 7 | 0 errores de consola | ✅ | `page.on('console'/'pageerror')` = [] en 5 ES; `smoke.spec.ts` (×5 ES · 2 projects) |
| 8 | `whatsapp` válido `^506\d{8}$` | ✅ | `seo.spec.ts:130` (`50600000000`) |
| 9 | NAP idéntico Header/Footer/Contacto/JSON-LD | ✅ | **T-33/T-34** (§3 NAP) |
| 10 | NAP idéntico en la **ficha de Google** | ⏳ **P-06** | ficha aún no existe; comparación externa no simulada (§3) |

**Veredicto T-46:** batería técnica en **verde** (check/build/gate/Playwright/axe/JSON-LD/console).
El CA «10 criterios globales en verde» queda **NO cerrado** por dependencias externas y de fase:
**T-14/P-20** (titles/descriptions), **P-17/P-18** (`og-image`/PDF 404), **T-47** (Lighthouse) y
**P-06** (ficha Google). Ninguna es un defecto de código descubierto por esta batería.

## T46.7 Hallazgos

- **0 defectos nuevos** en `tests/e2e/*.spec.ts` → no fue necesaria ninguna edición de specs.
- **0 violaciones axe** incluidas `color-contrast`; el único punto es `incomplete` por fondos con
  `background-image` (`.ph`), cubierto a mano (§T46.3).
- **Servidores residuales:** `lsof -ti:4321` **vacío** antes y después de la corrida; el `webServer:` de
  Playwright arrancó y detuvo su `astro preview` correctamente (no hubo `reuseExistingServer` sobre un
  proceso previo). Nota: si en el futuro aparece un `astro preview` huérfano en `:4321`, Playwright lo
  **reutiliza** y podría dar falsos verdes/rojos; este run partió de puerto libre.
- **Temporales eliminados:** los scripts de auditoría usados (`t46-*.mjs`) se borraron; sólo queda
  `evidencia/` (capturas, sin trackear) y `playwright-report/`/`test-results/` (en `.gitignore`).