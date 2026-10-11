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