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

---

# QA de copy (T-50 · F7)

> **Tarea:** T-50 · F7 · @copywriter + @qc
> **Fecha:** **2026-10-11**
> **Fuente de voz:** `docs/GLOSARIO.md` (voz/CTA/términos canónicos).
> **Alcance:** copy visible de las 5 páginas ES + `404.astro` y el chrome
> (`Header`, `Footer`, `ReserveForm`, `DishList`, `PageHero`) + `src/data/{site,menu,faq}.ts`.
> Greps de control sobre `dist/` **ES**. `/en/` (provisional, P-22) y `dist/404.html` heredado quedan **fuera**.
> **Sin cambios en `src/data/**`, `docs/PLAN.md`, `.github/**`, `scripts/**`, `astro.config.mjs`.**
> **Ediciones de copy aplicadas:** **ninguna** — todas las desviaciones (§T50.2) son ⚠️ y están acopladas
> a tareas ya planificadas (T-14/P-20, T-26, dato de cliente); aplicar un fix suelto chocaría con ellas.

## T50.1 Checklist firmada (CA «QA de copy»)

| # | Ítem del CA | Estado | Evidencia |
|---|---|---|---|
| 1 | Tuteo consistente (ES, sin usted/«estimado»/«le esperamos») | ✅ | 0 coincidencias de no-tuteo en 6 páginas ES + chrome |
| 2 | Glosario de términos (Origen, Mar · Tierra · Fuego, mariscos y parrilla, a la parrilla, Jacó, Costa Rica…) | ✅ | §T50.2 · 0 usos prohibidos (grill/BBQ/parrillada/crudo) |
| 3 | CTAs que nombran la acción y el canal (GLOSARIO §3) | ✅ | §T50.3 · 0 «Enviar»/«Click aquí»/«Más información»/«Confirmar reserva» |
| 4 | Títulos con datos reales (sin `[placeholder]`) | ✅ | 6/6 `<title>` ES con datos reales; longitudes → T-14/P-20 |
| 5 | `alt` en toda foto; vacío solo si decorativa justificada | ✅ | §T50.4 · **17 `<img>` en `dist/` ES, 0 sin `alt`** (T-26); decorativas Mar/Tierra/Fuego no emiten `<img>` (sin `src`) |
| 6 | Grep CA: `\[`, `TODO`, `0000`, `ph-label` sin resultados **en contenido renderizado** | ⏳ P-03/T-31 | §T50.5 (solo teléfono y mapa por dato pendiente) |
| 7 | Checklist firmada | ✅ | este documento, §T50.1–§T50.7 |

## T50.2 Desviaciones de voz/glosario (archivo:línea)

**Ninguna desviación bloqueante de tuteo, tono ni término.** El copy ES es consistente con GLOSARIO §1–§3.
Hallazgos ⚠️ (no corregidos por acoplamiento, con fix propuesto):

| # | Ubicación | Desviación | Fix propuesto | Aplicado |
|---|---|---|---|---|
| D1 | `src/pages/menu.astro:33` | Meta description cierra «Precios con **IVA**.» ≠ fórmula única «Precios con **IVA incluido**» (GLOSARIO §3, línea 69) | «IVA» → «IVA incluido» | ❌ diferido a **T-14/P-20** (alarga la description 163→172, ya en reescritura) |
| D2 | `src/pages/nosotros.astro:15,23` | «Origen abrió en … **octubre de 2026**»: fecha de apertura **no confirmada** (GLOSARIO §5, línea 126) | Confirmar fecha con cliente; mientras, redacción sin fecha | ❌ requiere dato del cliente (T-22/P-xx) |
| D3 | `src/pages/index.astro:81,145,146` | En T-50 no había `src` (no emitía `<img>`) | `alt` real por toma (SHOTLIST) o `alt=""` si decorativa; en T-26 se conectó `src` con `alt` de **categoría** (scrim) | ✅ aplicado en **T-26**; alt específico de plato pendiente de confirmar cada archivo (P-16) |
| D4 | `src/pages/index.astro:102` | Tarjetas Mar/Tierra/Fuego: GLOSARIO §7 las marca **decorativas** (`alt=""`, el texto visible ya nombra el plato); hoy heredan `label` | `alt=""` explícito | ✅ resuelto por **diseño** en T-26: **sin `src`** → no emiten `<img>`; `label` nunca se renderiza (decorativas, texto visible bien) |

**Hallazgo de higiene de docs (no editable por T-50):** el bloque «Inconsistencias de CTA detectadas»
de `GLOSARIO §5` (líneas 145-149) ya está **resuelto en el código** y quedó obsoleto:
`index.astro:181` ya dice «Cotizar mi evento», `index.astro:182` «Cotizar por WhatsApp` y
`ReserveForm.astro:37` «Reservar por WhatsApp» (ya no «Confirmar reserva»).

## T50.3 Auditoría de CTAs (`btn-primary` / `btn-ghost` / `btn-dark` / `link-caps`)

Todos los controles usan el **verbo de la acción** del glosario §3. Prohibidos («Enviar» a secas,
«Click aquí», «Más información», «Confirmar reserva») → **0** en ES (solo aparecen «grill»/*
en `/en/`, provisional P-22).

| Ubicación | Texto | Canónico §3 | Estado |
|---|---|---|---|
| `Header.astro:46` (`ui.reserve`) | Reservar mesa | Reservar mesa | ✅ |
| `menu.astro:66` · `nosotros.astro:82` | Reservar mesa | Reservar mesa | ✅ |
| `index.astro:36` · `ReserveForm.astro:37` | Reservar por WhatsApp | Reservar por WhatsApp | ✅ |
| `index.astro:35` · `nosotros.astro:81` · `404.astro:17` | Ver el menú | Ver el menú | ✅ |
| `index.astro:140` | Ver menú completo | variante admitida | ✅ |
| `index.astro:181` · `eventos.astro:23` | Cotizar mi evento | Cotizar mi evento | ✅ |
| `index.astro:182` | Cotizar por WhatsApp | Cotizar por WhatsApp | ✅ |
| `eventos.astro:73` | Solicitar cotización por WhatsApp | Solicitar cotización por WhatsApp | ✅ |
| `menu.astro:67` | Descargar menú PDF | Descargar menú PDF | ✅ |
| `index.astro:64` | Cómo llegar | Cómo llegar | ✅ |
| `contacto.astro:40-41` | Google Maps / Waze | Maps/Waze | ✅ |
| `index.astro:159` | Síguenos en Instagram | acción + canal | ✅ |
| `404.astro:16` | Volver al inicio | acción | ✅ |

## T50.4 Estado de `alt`

- **`<img>` en `dist/` ES: 17** (`dist/index.html` 15 · `menu/index.html` 1 · `nosotros/index.html` 1),
  **0 sin `alt`** (`grep -ro '<img[^>]*>' dist` | `grep -vc 'alt='` → **0**). Las tarjetas Mar/Tierra/Fuego
  siguen **sin `src`** (decorativas, texto visible): no emiten `<img>`, su `label` nunca se renderiza (D4).
- `Photo.astro:18` garantiza `alt = alt ?? label` (T-42) **y**, con `src` real desde T-26, se conecta el asset de
  `astro:assets` con `<Picture>` (avif/webp, widths, `priority` en héroe) + **scrim** cuando hay overlay.
- **`alt` concretos y correctos** (8–12 palabras, voz de marca §7): los de andamiaje de T-50
  (`index.astro:27,56,79,147,170..,175`, `nosotros.astro:27,32,56`, `eventos.astro:31`) se reemplazaron en T-26
  por descripciones **honestas de categoría** (p. ej. `alt="Platos de mar y tierra servidos en Origen, Jacó."`),
  porque el proveedor entregó archivos genéricos (`comida-N.jpg`, `bebida-N.jpg`, `ambiente-N.jpg`) sin leyenda:
  el `alt` **específico de plato** queda pendiente de que el chef identifique cada archivo (P-16).
- `index.astro:212` (`<img>` de aliados) usa `alt={p.name}`, pero solo se emite si `partners.length > 0` (hoy 0, P-13).

## T50.5 Greps del CA (contenido renderizado, `dist/` ES)

| Grep | Criterio | Resultado (6 rutas ES) | Estado | Dependencia |
|---|---|---|---|---|
| `\[[^\]]+\]` | 0 placeholders (texto visible + JSON-LD) | **0** (gate `TOTAL: 0`) | ✅ | — |
| `TODO` | 0 en contenido renderizado | **0** (solo comentarios HTML de código: hreflang y P-09) | ✅ | — |
| `0000` | solo el teléfono placeholder | 70 (solo `site.phone`) — index 18 · contacto 20 · eventos 14 · menu 6 · nosotros 6 · 404 6 | ⏳ **P-03** | P-03 → T-18 |
| `ph-label` | solo el bloque del mapa | **1** (`dist/contacto/index.html` §`#mapa`) | ⏳ **T-31** | P-05 → T-31 |

> Nota metodológica: un `grep '['` **crudo** sí devuelve coincidencias, pero **todas** son sintaxis de
> código/JSON-LD (`[role="tab"]`, `[type="date"]`, arrays `["Mariscos",…]`), **no** placeholders de copy.
> El CA «0 `\[`» se interpreta como **0 tokens `[….]` de placeholder**, que es lo que mide el gate.

## T50.6 Puerta de verificación (T-50)

| Paso | Comando | Resultado | Exit |
|---|---|---|---|
| Typecheck | `npm run check` | **0 errors · 0 warnings · 1 hint** (preexistente `check-placeholders.mjs:107`) · 36 archivos | `0` |
| Build | `npm run build` | **11 page(s) built** | `0` |
| Gate | `npm run gate` | **TOTAL: 0 bloqueantes**; avisos TODO × 0 · ph-label × 1 · 0000 × 116 | `0` |
| E2E | `npx playwright test` | **244 passed (50.8s)** · chromium + Pixel 5 | `0` |

> **Re-ejecución T-26 (fotos):** `npx playwright test` → **336 passed (56.5s)** con las 32 fotos reales
> conectadas (`<Picture>`). Nota: el `webServer` de Playwright ahora usa `astro preview -- --ignore-lock`;
> en astro ≥7 el `preview` auto-daemoniza cuando detecta un agente en el shell y el proceso del `webServer`
> salía al punto («Process from config.webServer exited early»). `--ignore-lock` fuerza primer plano.
> Para cortar huérfanos: `npx astro preview stop`.

## T50.7 Hallazgos

- **0 defectos de copy** que bloqueen: tuteo, tono y CTAs son consistentes con GLOSARIO §2–§3.
- **4 desviaciones ⚠️** (§T50.2 D1–D4), todas diferidas a tareas ya planificadas; **ninguna editable
  sin colisionar** con T-14/P-20 (longitud de descriptions) ni T-26 (alt/loading).
- El **CA de greps** queda **✅ para `\[` y `TODO`** y **⏳ P-03 (`0000`) / T-31 (`ph-label`)**: ambos son
  datos pendientes del cliente, no defectos de copy (coincide con la tabulación de T-46 §T46.6).
- **Docs-higiene:** el bloque «Inconsistencias de CTA» de `GLOSARIO §5` está obsoleto (ya corregido en
  código por T-23/T-24); anotarlo para la próxima revisión del glosario (fuera del alcance editable de T-50).

---

# QA UX multi-dispositivo (T-51 · F7)

> **Tarea:** T-51 · F7 · @ux-designer
> **Fecha de ejecución:** **2026-10-11**
> **Spec nuevo:** `tests/e2e/ux.spec.ts` (46 tests · 92 runs × chromium + Pixel 5)
> **Alcance:** teclado, contraste (axe + medición de colores reales), responsive 360/768/1440 (6 rutas),
> LCP lab 4G (referencia; las fotos reales llegan en T-26), 0 errores de consola y entrega de ambos
> formularios a WhatsApp (interceptando `window.open`, sin enviar a un humano; `site.whatsapp` sigue
> placeholder `50600000000`, P-03).
> **Entorno:** Node 23.7.0 · `npm run preview` en `:4321` · Playwright `chromium` + `Pixel 5».
> **Ediciones de código:** 1 fix mínimo en `ReserveForm.astro:61` (gramática del mensaje); `global.css` **sin cambios**
> (0 violaciones de contraste reales, justificado en §T51.2).
> **Re-ejecución T-26 con fotos reales:** ver §T51.4 — home mantiene **LCP ≤ 2,5 s** con la foto del héroe; el
> contraste del `.ph` lo resuelve el **scrim** añadido en `Photo.astro` (T-26) para overlays sobre foto.

## T51.1 (a) Teclado — 0 trampas de foco

Método: recorrido con `Tab` en las 6 rutas ES a 360 px (y `/` a 1440 px) con un walker que detecta
estancamiento (un mismo elemento reteniendo el foco >6 saltos sin avanzar ni envolver al `BODY`).

| Ruta | Skip-link 1º | EN en el orden de Tab | Trampas | Menú móvil teclado | Forms alcanzables |
|---|---|---|---|---|---|
| `/` | ✅ | ✅ `@/en/` | 0 | ✅ | ✅ (bar form) |
| `/menu/` | ✅ | ✅ | 0 | ✅ | n/a |
| `/nosotros/` | ✅ | ✅ | 0 | ✅ | n/a |
| `/eventos/` | ✅ | ✅ | 0 | ✅ | ✅ (cotización) |
| `/contacto/` | ✅ | ✅ | 0 | ✅ | ✅ (card form) |
| `/404.html` | ✅ | ✅ | 0 | ✅ | n/a |
| `/` (1440px desktop) | ✅ | ✅ | 0 | n/a | ✅ |

- **Menú móvil (360 px):** `Enter` en `nav-toggle` abre (`aria-expanded="true"`, nav visible); **`Shift+Tab`
  entra directo a los enlaces del nav** (el nav está antes del toggler en el DOM; con `Tab` hacia adelante
  se alcanzan tras los controles de `.header-actions` y el wrap del documento — en ningún caso queda el foco
  atrapado); `Escape` cierra y **devuelve el foco al toggler** (§T-10, re-verificado).
- **Foco visible (anillo ≥3:1):** `:focus-visible` con outline de 2 px → `--accent` sobre fondos oscuros
  **6,75:1** (bg) / **6,49:1** (surface), y `--accent-ink` sobre crema **5,04:1** (§T51.2). Verificado por
  test en un enlace del nav (oscuro) y un enlace de la sección `.light`.
- **Resultado CA:** 0 bloqueos con teclado en las 6 rutas. Sin corrección necesaria.

## T51.2 (b) Contraste — axe 0 violaciones; medición de colores reales; sin fix de CSS

**axe (`@axe-core/playwright`, reglas por defecto) en las 5 ES → `color-contrast`: 0 violaciones en todas.**

| Ruta | color-contrast (violaciones) | serious/critical | incomplete (no computable, `.ph`) |
|---|---|---|---|
| `/` | **0** | 0 | `.hero`, `.element` ×3, banner evento (texto sobre `background-image`) |
| `/menu/` | **0** | 0 | `.breadcrumb`, `.script-lg`, `h1`, `.lead` (hero `.ph`) |
| `/nosotros/` | **0** | 0 | idem hero `.ph` |
| `/eventos/` | **0** | 0 | idem hero `.ph` |
| `/contacto/` | **0** | 0 | solo `.ph-label` (bloque mapa) |
| `/404.html` | **0** | 0 | — |

**Medición real (luminancia relativa, WCAG 2.1) de los pares en producción:**

| Par | Ratio | AA (4,5 texto / 3 grande) |
|---|---|---|
| `.script` `--accent` `#D9844A` sobre `.ph` `#221F1B` (hero/tarjetas) | **5,74:1** (5,28 con el overlay 3,5 %) | ✅ (coincide con el 5,7:1 de T-46) |
| `h1`/`.btn-ghost` `--cream` sobre `.ph` | 13,83:1 | ✅ |
| `.ph-label` `--muted` sobre `.ph` | 6,27:1 (5,77 overlay) | ✅ |
| `.btn-primary` (`--on-accent` sobre `--accent`) | 6,67:1 (hover 10,97:1) | ✅ |
| `.light .script` `--accent-ink` `#9A4F1E` sobre crema `#F2EBDD` | **5,04:1** | ✅ |
| `.light .lead` `--ink-soft` sobre crema | 9,80:1 | ✅ |
| Anillo de foco dark `--accent` sobre `--bg`/`--surface` | 6,75:1 / 6,49:1 | ✅ (≥3:1) |
| Anillo de foco light `--accent-ink` sobre crema | 5,04:1 | ✅ (≥3:1) |
| Footer `--soft` sobre `--footer` | 13,00:1 | ✅ |
| `.label`/`.field label` `--muted` sobre `--bg` | 7,37:1 | ✅ |
| `.dim` sobre `--bg` | 5,43:1 | ✅ |
| `.dish-price` `--accent` sobre `--bg` (menú / tabs) | 6,75:1 | ✅ |

**Par latente (NO ocurre hoy):** `.dish-price` (`--accent`) sobre **crema** daría 2,41:1, pero hoy **no se
renderiza ningún `.dish-price` sobre sección `.light`** (sin precios reales, P-07; en el menú y en los tabs
de `/` el fondo es `--bg`, donde es 6,75:1). No es una violación real → **no se tocó `global.css`** (regla
«mínimo cambio y solo violación real»). Al llegar precios (T-19) mantendrá fondo oscuro; anotado como
guard-rail si algún día se usa `.dish-price` en `.light`.

## T51.3 (c) Responsive 360/768/1440 — 0 desbordes

6 rutas × 3 viewports (Playwright `setViewportSize`): `scrollWidth ≤ clientWidth`, CTAs `.btn` visibles y
dentro del viewport, formularios sin salirse, sin elementos con `right > clientWidth`. **Todo en verde.**

| Ruta | 360×740 | 768×1024 | 1440×900 |
|---|---|---|---|
| `/` | ✅ (scrollW 360/360) | ✅ | ✅ |
| `/menu/` | ✅ | ✅ | ✅ |
| `/nosotros/` | ✅ | ✅ | ✅ |
| `/eventos/` | ✅ | ✅ | ✅ |
| `/contacto/` | ✅ | ✅ | ✅ |
| `/404.html` | ✅ | ✅ | ✅ |

- Tarjetas **mar/tierra/fuego** (`.element`): 3/3 visibles y sin desborde en los 3 anchos (altura 420 px a ≤640 px, 560 px en ≥641 px).
- Menú móvil usable a 360 (re-verificado §T51.1); header con `Reservar mesa` + toggler + switcher dentro de 360 px.
- Grid de platos y footer: sin `right > clientWidth` en 768 ni 1440.
- **Resultado CA:** sin scroll horizontal en las 6 rutas; CTAs y forms visibles.

## T51.4 (d) LCP lab 4G + consola

**LCP del build actual (home, 390×844), 4G simulado** (CDP: latencia 150 ms · 1,6 Mbps · CPU 4×),
medido con `PerformanceObserver` (los entries LCP no se exponen vía `getEntriesByType`):

| Modelo | LCP | FCP | Elemento LCP |
|---|---|---|---|
| sin throttle | 316 ms | 316 ms | `P.lead` del héroe (texto) |
| **4G simulado (lab)** | **532 ms** | 532 ms | `P.lead` del héroe |

Página completa = 1 CSS de Astro (~3 KB) + CSS de fuentes Google (1 KB); sin imágenes (`.ph` con
`background-image`, P-16). **Referencia lab ≪ 2,5 s; el CA final se valida con fotos reales en T-26 y en
producción con T-49.** El spec `ux.spec.ts` deja la medición anotada como referencia y fallaría si pasara
de 2,5 s.

**Re-ejecución con fotos reales (T-26, home):**

| Modelo | LCP | FCP | Elemento LCP |
|---|---|---|---|
| 4G simulado (lab) con `<Picture>` (`platos[5]` hero) | **1,7–2,5 s** | ~1,7 s | `<img>` del héroe (avif, eager) |

Home es la ruta más pesada (héroe + aside + insignia + destacado + 8 galería). Menú/nosotros/eventos/contacto
bajan a **LCP ~1,5 s** (D3/D4/D5 re-medidas en Lighthouse T-47: perf móvil 99–100, a11y/bp/seo 100).

**Consola:** `page.on('console'/'pageerror')` = `[]` en las 6 rutas (0 errores; refuerza `smoke`/`nav-mobile`).

## T51.5 (e) Formularios → WhatsApp (interceptando `window.open`)

Spec `ux.spec.ts` → `describe('formularios → WhatsApp')`. Se intercepta `window.open`, se valida que la URL
es `https://wa.me/50600000000?text=…` (sin abrir nada real; el número es placeholder P-03) y que el texto
codificado contiene los datos.

| Formulario | ¿Abre? | Mensaje verificado |
|---|---|---|
| `/` bar form (4 pers · 01-12-2026 · 19:00 · Ana Piera) | ✅ `_blank` + `noopener`, 1 sola llamada | «…4 personas el 2026-12-01 a las 19:00…» |
| `/contacto/` card form (6 pers · 02-12 · 20:00 · Luis Mora) | ✅ idem | «…6 personas el 2026-12-02 a las 20:00…» |
| `/eventos/` cotización **con** WhatsApp (+506 8888 7777 · 60 invitados · Boda/ensayo · Salón completo) | ✅ idem | tipo · invitados · fecha · **WhatsApp** · detalles (sin correo) |
| `/eventos/` cotización **sin** WhatsApp ni correo | ❌ **no abre** | `alert` «Ingresa al menos un canal de contacto: WhatsApp o correo.» (T-24) y `__opened = []` |

**Fix único de código (gramática del mensaje emitido):** `ReserveForm.astro:61` — el mensaje decía
«Hola Origen, Soy Ana Piera. **quisiera** reservar…» (minúscula tras punto). Cambio mínimo `. ` → `, `:
«…Soy Ana Piera, quisiera reservar…». Sin cambio funcional; no afecta `nojs.spec` ni `seo.spec`.

## T51.6 Puerta de verificación (transcripción)

| Paso | Comando | Resultado | Exit |
|---|---|---|---|
| Typecheck | `npm run check` | **0 errors · 0 warnings · 1 hint** (preexistente `check-placeholders.mjs:107`) · 42 archivos | `0` |
| Build | `npm run build` | **11 page(s) built** + `sitemap-index.xml` | `0` |
| Gate | `npm run gate` | **TOTAL: 0 bloqueantes** · avisos TODO × 0 · ph-label × 1 · 0000 × 116 | `0` |
| E2E | `npx playwright test` | **336 passed (57.3 s)** = 244 previos + **92** de `ux.spec.ts` · chromium + Pixel 5 | `0` |

**Higiene de procesos:** `lsof -ti:4321` **vacío** al terminar; el `webServer` de Playwright arrancó y detuvo
su propio `astro preview` (no hubo reuso de un huérfano; los scripts de auditoría temporales se eliminaron).
En la re-ejecución T-26 el `webServer` cambió a `astro preview -- --ignore-lock` (astro 7 daemoniza el preview
cuando detecta agente en el shell y eso mataba el proceso del `webServer`); los daemon huérfanos se cierran con
`npx astro preview stop`.

## T51.7 Hallazgos y qué queda para T-26 / T-49 / prod

- **0 defectos bloqueantes.** CA cumplido: 0 trampas de teclado, sin scroll horizontal en 360/768/1440 y
  ambos formularios entregan el mensaje de WhatsApp (con fallback `window.open` funcionando y el bloqueo de
  eventos sin canal verificado).
- **1 fix mínimo aplicado** (gramática del mensaje, §T51.5). **CSS intacto.**
- **Evidencia en `evidencia/` (gitignored):** `t51-home-360.png`, `t51-home-768.png`, `t51-home-1440.png`,
  `t51-menu-abierto-360.png`, `t51-contacto-1440.png`, `t51-eventos-360.png` (+ `home-desktop.png`,
  `home-pixel5.png` previos). Reporte HTML en `playwright-report/`, JUnit en `test-results/junit.xml`.
- **T-26 aplicado:** 32 fotos conectadas con `<Picture>` + scrim; **336/336** Playwright verdes; Lighthouse
  (T-47 re-run local) móvil: home **perf 94 / LCP ≤ 2,5 s**, menu/nosotros/eventos/contacto **perf 99–100**;
  a11y/bp/seo **100**. Quedan **0 `<img>` sin `alt`** en `dist/` ES.
- **Para T-49 (prod):** re-medir LCP/CWV en PageSpeed sobre el dominio real y confirmar < 2,5 s; el par
  `.dish-price` sobre crema debería seguir sin producirse (o definirse con `--accent-ink`); re-ejecutar esta
  batería tras cada cambio de contenido que toque el chrome (Header/Footer/forms).
- **Pendiente P-16:** confirmar con el chef qué plato es cada archivo `comida-N.jpg` para publicar `alt` y
  texto específicos (hoy alt = categoría); faltan shoots de `hero/`, `equipo/`, `eventos/`, `aliados/`.
- **Nota:** los `incomplete` de axe (§T51.2) son texto sobre `.ph` (`background-image`) y se resuelven en
  T-26 al pasar a `<Image>` con `width/height` (el cálculo manual ya da AA/AAA en todos los pares actuales).
