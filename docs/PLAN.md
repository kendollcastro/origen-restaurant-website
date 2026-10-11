# PLAN — Origen Jacó (FASE 1 · Planificación)

> Generado el 2026-10-09 por el coordinador a partir del código fuente y de las auditorías de
> **@ux-designer**, **@frontend-dev**, **@seo-geo**, **@copywriter**, **@qa-tester** y **@devops**
> (cada especialista cargó su skill: `frontend-design`/`web-design-guidelines`, `vercel-react-best-practices`,
> `seo`, `frontend-design`, `e2e-testing`, `deploy-to-vercel`).
>
> ⚠️ **`AGENTS.md` no existe en el repo** → ver pendiente de proyecto **PP-01**.
> Este documento es la fuente de verdad de la FASE 2 (implementación) y de la FASE 3 (revisión).

---

## 0. Estado de partida (verificado, sin tocar código)

| Área | Estado |
|---|---|
| Stack | Astro 5.7 + `@astrojs/sitemap` 3.3, HTML/CSS estático, **sin framework JS** |
| Páginas ES | `/`, `/menu/`, `/nosotros/`, `/eventos/`, `/contacto/` |
| Idioma | Solo ES; EN deshabilitado (`Header.astro:21-22`), hreflang comentado (`Base.astro:62-64`) |
| Git | **No es repo** (sin `.git`, sin remote, sin CI) |
| Verificación | `package.json` sin script `check`; sin `@astrojs/check`/`typescript`; sin `node_modules` |
| Datos | `src/data/site.ts` con TODOs (dirección, teléfono `+506 0000 0000`, coordenadas, redes, horario); `menu.ts` con 12 platos `pending()` y **todos** los precios sin asignar (renderiza `[₡ precio]`); `faq.ts` con 2 respuestas con `[confirmar]` |
| Medios | Sin fotos (`<Photo>` placeholder), sin `public/og-image.jpg`, sin `public/menu-origen.pdf` |
| SEO ya hecho | JSON-LD `Restaurant` (todas), `Menu` (`/menu/`), `FAQPage` (`/contacto/`), canonical, OG, sitemap, robots, 1 `h1` por página, titles/descriptions únicos |
| Entorno | Node 23.7.0 local (no LTS), npm 11.13.0; CLI `vercel` instalado y autenticado (no usar sin aprobación) |

---

## 1. Mapa del sitio

### 1.1 Versión ES (F1–F4, F6–F7)

| URL | Keyword principal | `<title>` (≤60) | Meta description (≤155) |
|---|---|---|---|
| `/` | restaurante mariscos y parrilla Jacó | `Origen Jacó · Restaurante de mariscos y parrilla` (48) | Mariscos frescos del Pacífico, cortes a la parrilla y cócteles de autor en Jacó, Costa Rica. Abierto de 11 am a 10 pm. Reserva por WhatsApp. (140) |
| `/menu/` | menú mariscos parrilla Jacó / ceviche Jacó | `Menú · Origen Jacó — Mariscos, cortes y ceviches` (48) | Menú de Origen en Jacó: ceviches, mariscos del Pacífico, cortes a la parrilla, menú de niños y postres. Precios con IVA incluido. (127) |
| `/nosotros/` | restaurante Origen Jacó, chef Zugetcy Leitón | `Nosotros · Origen Jacó — Historia, chef y equipo` (47) | Origen abrió en el local del antiguo Hicaco Plaza de Jacó, con el mismo equipo. Conoce a la chef Zugetcy Leitón y la cocina de mar, tierra y fuego. (146) |
| `/eventos/` | eventos grupos Jacó, salón para 120 invitados | `Eventos y grupos en Jacó · Origen — hasta 120 invitados` (55) | Celebra en Origen, Jacó: grupos de tour, cumpleaños, cenas de empresa y bodas. Capacidad para 120 invitados y menú a la medida. Cotiza por WhatsApp. (147) |
| `/contacto/` | reservas contacto Origen Jacó, horario y dirección | `Reservas y contacto · Origen Jacó — horario y ubicación` (55) | Reserva en Origen, Jacó, por WhatsApp. Dirección, horario (11:00 am – 10:00 pm), cómo llegar y respuestas a las preguntas más frecuentes. (135) |

> Los `<title>` actuales de `/` (69 car.) y `/contacto/` (77 car.) y la description de `/menu/` (~161 car.) exceden los límites → corregir en F2.

### 1.2 Versión EN (F5) — slugs en inglés para keyword en inglés

| URL | Par ES | Keyword principal | `<title>` (≤60) | Meta description (≤155) |
|---|---|---|---|---|
| `/en/` | `/` | seafood restaurant Jacó | `Origen · Seafood Restaurant in Jacó, Costa Rica` (47) | Fresh Pacific seafood, grilled steaks and craft cocktails in Jacó, Costa Rica. Open 11 am–10 pm daily. Reserve via WhatsApp or visit us in town. (143) |
| `/en/menu/` | `/menu/` | seafood menu Jacó / ceviche Jacó | `Menu · Origen Jacó — Seafood, Ceviches & Grill` (46) | Origen's menu in Jacó: ceviches, Pacific seafood, grilled Rib Eye and New York cuts, kids' menu and desserts. Prices include 13% VAT. (133) |
| `/en/about/` | `/nosotros/` | about seafood & grill Jacó, chef | `About · Origen Jacó — Chef, Team & Story` (40) | Origen opened in the former Hicaco Plaza space in Jacó with the same team. Meet chef Zugetcy Leitón and our mar, tierra y fuego kitchen. (139) |
| `/en/events/` | `/eventos/` | private events venue Jacó, tour groups | `Events & Groups in Jacó · Origen — Up to 120 Guests` (51) | Celebrate in Jacó: tour groups, birthdays, corporate dinners and weddings. Space for up to 120 guests with a custom menu. Get a quote on WhatsApp. (154) |
| `/en/contact/` | `/contacto/` | contact & reservations restaurant Jacó | `Contact & Reservations · Origen Jacó — Hours & Map` (50) | Reserve a table at Origen, Jacó via WhatsApp. Address, hours (11 am–10 pm), map and answers to frequently asked questions. (122) |

**Señales internacionales:** `hreflang` con **mapeo explícito de rutas** (no `canonical.replace`, que rompería con `/en/about/`): pares `es`/`en` + `x-default` → `/` (mercado base ES-CR; alternativa a confirmar: `x-default` → `/en/` si se prioriza turista angloparlante). `<html lang="es-CR">` / `lang="en"`; `og:locale` `es_CR`/`en_US` + `og:locale:alternate`; `alternates` en `@astrojs/sitemap`; `/en/` con `noindex` hasta que el contenido esté completo.

---

## 2. Decisiones técnicas

### 2.1 Arquitectura y código — @frontend-dev
1. **Fuente única de datos**: `src/data/site.ts` (NAP, horario, redes, capacidad). Nunca repetir dirección/teléfono/horario literal en `.astro` (deuda: `index.astro:46`, `contacto.astro:32,52`, `eventos.astro:40`).
2. **Menú**: `src/data/menu.ts`, `price: number` en colones con IVA (`₡` + `toLocaleString('es-CR')`). Precio pendiente = `null` → **no se renderiza** (nunca inventar, nunca mostrar `[₡ precio]`).
3. **FAQ única**: `faq.ts` alimenta HTML de `/contacto/` **y** JSON-LD `FAQPage` → cero divergencia.
4. **Componentes con `interface Props`**, sin framework JS. Solo 3 scripts inline (tabs, reserva WhatsApp, evento) → **progresivos**: la página funciona sin JS.
5. **TypeScript estricto** (`astro/tsconfigs/strict`), objetivo `npm run check` en 0 errores; sin `any`, sin non-null assertions sobre `Array.find` (`index.astro:9`).
6. **CSS puro** en un solo `global.css` con variables en `:root`; estilos inline solo puntuales.
7. **i18n**: páginas espejo en `src/pages/en/`, textos de UI en `src/data/i18n/`, prop `lang` en `Base.astro` (hoy hardcodeado `Base.astro:54`). Sin dependencias nuevas ni router.

### 2.2 SEO / GEO — @seo-geo
8. **Canonical** auto-referenciada (`Base.astro:15`); exige que `astro.config.mjs:site`, `site.ts:url`, `robots.txt` y el host servido coincidan (hoy: 3 copias del dominio por confirmar) + 301 único `http`→`https` y `apex`→`www`.
9. **`og:type`** debe ser `website` (hoy `restaurant`, valor no válido, `Base.astro:67`).
10. **JSON-LD**: mantener `Restaurant` + `Menu` + `FAQPage`; añadir `BreadcrumbList`, `Person` (chef), `image` array, `offers` solo con precio real, `sameAs` reales, `potentialAction`. **`AggregateRating` solo con reseñas de terceros reales y visibles en la página** (nunca auto-reseñas ni cifras inventadas). Revisar `maximumAttendeeCapacity` (`Base.astro:33`), que no es propiedad válida de `Restaurant`.
11. **robots.txt**: `Allow: /` + `Sitemap:`; **no bloquear** crawlers de IA (`OAI-SearchBot`, `PerplexityBot`, `Claude-SearchBot`). `llms.txt` opcional y solo si lo pide el cliente.
12. **Presupuesto móvil**: LCP < 2,5 s · CLS < 0,1 · INP < 200 ms · Lighthouse SEO ≥ 95.
13. **Sitemap**: solo URLs canónicas con trailing slash, sin anclas ni queries; alta en Search Console en F7.

### 2.3 UX y copy — @ux-designer + @copywriter
14. **Voz**: anfitrión cálido en **tuteo**, sensorial e ingenuo-concreto (ingredientes, no adjetivos), orgullo local sin superlativos, sobriedad elegante, CTAs que nombran la acción y el canal ("Reservar por WhatsApp", no "Enviar").
15. **Glosario de marca**: `Origen` (prosa) / `Origen. Mar, tierra y fuego` (footer/legal) · `Jacó` con tilde en copy (sin tilde en URLs) · tagline `Mar · Tierra · Fuego` con puntos medios · "a la parrilla" (nunca grill/BBQ) · "la chef Zugetcy Leitón" · "hasta 120 invitados" · "Precios con IVA incluido".
16. **Un CTA primario por sección**; cobre = acción, ghost = navegación; grupos >12 → `/eventos/`.
17. **Placeholders**: mientras falte un dato real **se oculta la sección entera** (mejor vacío que un `[Insertar reseña]`); nunca se publica texto provisional entre corchetes.
18. **Fotos**: placeholders `.ph` funcionan como *shot list* embarcada; toda foto real lleva `alt` descriptivo en español; héroe con `loading="eager"` + `fetchpriority="high"`.
19. **Accesibilidad visual**: contraste AA (hoy `.script` `#D9844A` sobre crema `#F2EBDD` ≈ 2,4:1 → usar `--accent-ink`), skip link visible al foco, foco ≥3:1, `prefers-reduced-motion`.

### 2.4 QA — @qa-tester
20. **Gate tras cada tarea (obligatorio, <5 min)**: `npm ci && npm run check && npm run build && node scripts/check-placeholders.mjs`. Si falla, la tarea vuelve a quien la hizo.
21. **Batería completa (F7 y tras cambios mayores)**: Playwright (`smoke`, `a11y`, `forms`, `seo`, `i18n`, `media`) sobre `npm run preview`, axe-core 0 violaciones `critical`/`serious`, link check (`linkinator`), validación JSON-LD, Lighthouse CI.
22. **Criterios globales medibles**: 0 placeholders `\[[^\]]+\]` en `dist/` **y** en JSON-LD · 1 `h1` por página · titles únicos ≤60 y descriptions 120–160 · 0 enlaces internos rotos (PDF e `og-image` deben dar 200) · axe 0 `critical`/`serious` y 0 `color-contrast` · Lighthouse perf ≥90 mobile / a11y ≥95 / SEO ≥95 · 0 errores de consola · `whatsapp` válido `^506\d{8}$` · NAP idéntico en Header/Footer/Contacto/JSON-LD/ficha de Google.
23. **Harness**: `playwright.config.ts` con `webServer: npm run preview`, `baseURL: http://localhost:4321`, projects `chromium` + `mobile-chrome` (Pixel 5), `reporter: html + junit`, `trace: on-first-retry`, `screenshot: only-on-failure`. Fijar Node **22 LTS** (`.nvmrc` + `engines`) para evitar "pasa en mi máquina" (local es Node 23).

### 2.5 DevOps y protocolo de seguridad — @devops
24. **Repo git** en F1, rama `main`, **commits convencionales** (`feat:`/`fix:`/`docs:`/`chore:`/`perf:`/`build:`/`ci:`) en español, 1 commit = 1 cambio lógico.
25. **Hosting propuesto: Vercel** (detecta Astro, preview por rama, CDN, HTTPS, `vercel.json` para headers/redirects; CLI ya autenticado). Alternativa Netlify. ⚠️ Verificar ToS free vs uso **comercial** antes de provisionar.
26. **Build**: `npm ci && npm run build` → `dist/` estático; `engines.node: ">=20 <24"`.
27. **Headers** (`vercel.json`): `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`, CSP con `frame-src https://www.google.com` (mapa), HSTS.
28. **Cache**: inmutable 1 año en `/_astro/*`, corto para HTML, cache moderada para `og-image.jpg` y `menu-origen.pdf`.
29. **404** propio (`src/pages/404.astro`) y preview por rama; producción **solo con aprobación explícita**.

**⚠️ Protocolo de aprobación (no se ejecuta sin luz verde del usuario):**

| Acción | Aprobación |
|---|---|
| `git commit` local (cambio acordado) | No |
| `git push` a remote | **Sí** |
| `vercel deploy` (preview) | **Sí** (primera vez por proyecto/rama) |
| Deploy a **producción** | **Sí, siempre** |
| Proyecto en Vercel/Netlify / `vercel link` | **Sí** |
| **DNS** (registrar, CNAME, A, apex→www) | **Sí, siempre** + doble revisión |
| Compra de dominio o plan de pago | **Sí, solo el cliente** |
| Rotar credenciales / borrar proyecto | **Sí** |

---

## 3. Fases F1–F7

Convención: `- [ ] **T-xx** · **F#** · **@rol** — tarea · **archivos:** … · **CA:** criterio de aceptación · **est:** estimación · **bloqueo:** P-xx`
Tras cada tarea: gate (§2.4) + `git commit` convencional + marcar la casilla en este archivo.

### F1 — Fundamentos técnicos (≈23,5 h)

- [x] **T-01** · **F1** · **@devops** — Inicializar repo git local sin remote, revisar `.gitignore` (añadir `.vercel/`) y commit convencional inicial · **archivos:** `.gitignore`, todo el árbol · **CA:** `.git` existe; 1 commit `chore: …`; `git status` limpio; sin `node_modules/` ni `dist/` trackeados · **est:** 0,5 h
- [x] **T-02** · **F1** · **@frontend-dev** — Habilitar verificación y toolchain: `@astrojs/check` + `typescript` (devDeps), script `"check": "astro check"`, `engines`/`.nvmrc` con Node 22 LTS, `npm install` y documentar el gate en README · **archivos:** `package.json`, `package-lock.json`, `.nvmrc`, `README.md` · **CA:** `npm run check` y `npm run build` existen y terminan en 0; flujo escrito en README · **est:** 1 h *(fusiona T-15/T-67/T-84)*
- [x] **T-03** · **F1** · **@frontend-dev** — Cero errores de `astro check` y tipado estricto: `interface Props` en todos los componentes, eliminar la aserción `!` de `index.astro:9` con lookup tipado, revisar casts en scripts · **archivos:** `src/pages/index.astro`, `src/pages/eventos.astro`, `src/components/*.astro`, `src/layouts/Base.astro` · **CA:** `npm run check` en 0 errores, 0 `any`, sin non-null sobre `Array.find` · **est:** 1,5 h
- [x] **T-04** · **F1** · **@qa-tester** — Gate de placeholders: `scripts/check-placeholders.mjs` (texto visible de `dist/**/*.html` excluyendo `script`/`style`/JSON-LD + chequeo aparte de placeholders dentro del JSON-LD) y workflow CI `check → build → gate → playwright` · **archivos:** `scripts/check-placeholders.mjs`, `.github/workflows/ci.yml`, `.gitignore` · **CA:** el gate **falla hoy** listando los placeholders exactos y pasa al llegar a 0; CI corre en push/PR · **est:** 2 h
- [x] **T-05** · **F1** · **@qa-tester** — Harness Playwright + axe: `playwright.config.ts` (webServer `npm run preview`, `:4321`, chromium + Pixel 5, html/junit, trace on-first-retry) y specs `smoke.spec.ts` (200 en 5 rutas, 1 `h1`, 0 errores de consola) + `a11y.spec.ts` (`@axe-core/playwright`) · **archivos:** `playwright.config.ts`, `tests/e2e/smoke.spec.ts`, `tests/e2e/a11y.spec.ts`, `.gitignore` · **CA:** `npx playwright test` en verde sobre `dist/`, reporte en `playwright-report/` · **est:** 3 h
- [ ] **T-06** · **F1** · **@seo-geo** — Fijar dominio definitivo y unificar la URL canónica (hoy en 3 sitios), definiendo 301 del host alternativo + `http`→`https` · **archivos:** `astro.config.mjs`, `public/robots.txt`, `src/data/site.ts` · **CA:** `site`, `site.url` y `Sitemap:` apuntan al mismo host con https; sin TODO de dominio · **est:** 1,5 h · **bloqueo:** P-01
- [x] **T-07** · **F1** · **@seo-geo** — Validar sitemap y robots tras build: cobertura de las 5 URLs con trailing slash, sin anclas ni queries · **archivos:** `astro.config.mjs`, `public/robots.txt`, `dist/sitemap-index.xml` · **CA:** sitemap solo con URLs canónicas indexables; robots accesible; checklist de alta en GSC preparado · **est:** 1,5 h
- [x] **T-08** · **F1** · **@seo-geo** — Baseline antes de editar: Lighthouse CLI (perf/SEO/móvil) sobre build, validación JSON-LD actual y checklist canonical/OG/viewport/h1 · **archivos:** informe en `docs/BASELINE.md` · **CA:** scores registrados por URL; JSON-LD sin errores de sintaxis; hallazgos con `archivo:línea` · **est:** 2,5 h
- [x] **T-09** · **F1** · **@ux-designer** — Accesibilidad visual base: skip link visible al recibir foco (hoy `.sr-only` sin `:focus`, `global.css:38`), anillo de foco con contraste ≥3:1 sobre `.light` y `prefers-reduced-motion` para `scroll-behavior: smooth` (`global.css:27`) · **archivos:** `src/styles/global.css`, `src/layouts/Base.astro` · **CA:** skip link visible con Tab en las 5 páginas; foco perceptible sobre crema y oscuro; scroll suave desactivado con reduced-motion · **est:** 2 h
- [x] **T-10** · **F1** · **@ux-designer** — Navegación mobile: menú colapsado accesible (`aria-expanded`) y enlaces con área táctil ≥44px · **archivos:** `src/components/Header.astro`, `src/styles/global.css` · **CA:** a ≤760px el nav se oculta tras un botón operable con teclado y lector; enlaces ≥44px; sin scroll horizontal a 360px en las 5 páginas · **est:** 3 h
- [x] **T-11** · **F1** · **@frontend-dev** — JS progresivo y robustez: fallback sin JS en los tabs de `/` (paneles visibles o `<details>`), `action`/`<noscript>` en los formularios WhatsApp, y `date.min` calculado en hora local (hoy UTC en `ReserveForm.astro:37` ofrece un día anterior en CR) · **archivos:** `src/pages/index.astro`, `src/components/ReserveForm.astro`, `src/pages/eventos.astro` · **CA:** con JS deshabilitado se ven todas las secciones del menú y existe un link `wa.me` visible; `min` = hoy en Costa Rica · **est:** 2 h
- [x] **T-12** · **F1** · **@copywriter** — Cerrar el glosario de marca en `site.ts` (`name`/`fullName`/`tagline`/`description` ≤160 con "mariscos y parrilla en Jacó"; horario solo si está confirmado) y publicarlo en `docs/GLOSARIO.md` · **archivos:** `src/data/site.ts`, `docs/GLOSARIO.md` · **CA:** ningún string de marca suelto fuera de `site.ts`; descripción sin datos inventados · **est:** 1 h
- [x] **T-13** · **F1** · **@copywriter + @ux-designer** — Política de placeholders: decidir y codificar el comportamiento de cada hueco (ocultar sección / ocultar precio / ocultar CTA) para reseñas, aliados, mapa, precios y `pending()` · **archivos:** `src/pages/index.astro`, `src/data/menu.ts`, `src/components/DishList.astro`, `src/components/Photo.astro` · **CA:** decisión escrita en `docs/GLOSARIO.md` y aplicable sin tocar datos reales; ningún `ph-label` ni `[₡ precio]` llegaría a prod · **est:** 2 h *(fusiona T-07/T-52)*

### F2 — Contenido y SEO on-page ES (≈23 h)

- [ ] **T-14** · **F2** · **@seo-geo** — Aplicar el mapa ES: títulos ≤60 y descriptions ≤155 únicos por página, conservando 1 `h1` con keyword · **archivos:** `src/pages/*.astro`, `src/layouts/Base.astro` · **CA:** los 5 títulos/descripciones coinciden con §1.1 y no se truncan; `og:title`/`og:description` heredan los mismos valores · **est:** 3 h
- [x] **T-15** · **F2** · **@seo-geo + @frontend-dev** — Revisión on-page: jerarquía de encabezados (sin saltos), breadcrumbs coherentes (`PageHero.astro:8` vs `contacto.astro:23`), anchors funcionales, ≥3 enlaces internos relevantes por página y `og:type="website"` · **archivos:** `src/pages/*.astro`, `src/components/{Header,Footer,PageHero}.astro`, `src/layouts/Base.astro` · **CA:** checklist en verde en las 5 URLs con `npm run preview`; sin `h3` antes de `h2`; sin anchors muertos ni `href="#"` · **est:** 2 h *(fusiona T-05/T-20/T-35/T-85)*
- [x] **T-16** · **F2** · **@frontend-dev** — Eliminar duplicación de NAP/capacidad: sustituir literales por `site.*` en direcciones, horario, "12 personas" y link de ubicación · **archivos:** `src/pages/index.astro`, `src/pages/contacto.astro`, `src/pages/eventos.astro` · **CA:** grep sin direcciones/teléfonos/horarios/límites fuera de `src/data/site.ts`; HTML renderizado sin cambios salvo en consistencia · **est:** 1,5 h
- [x] **T-17** · **F2** · **@frontend-dev + @ux-designer** — Sanear placeholders del HTML y del JSON-LD (FAQ, reseñas, logos, párrafos de `/nosotros/` y `/eventos/`) ocultando la sección completa hasta el dato real · **archivos:** `src/data/faq.ts`, `src/pages/index.astro`, `src/pages/nosotros.astro`, `src/pages/eventos.astro` · **CA:** gate de placeholders en verde (0 `\[[^\]]+\]` en `dist/` **y** en `FAQPage`); las 5 páginas conservan title/description/h1 únicos · **est:** 2 h *(fusiona T-19/T-04/T-36)*
- [ ] **T-18** · **F2** · **@copywriter** — Volcar el NAP real en `site.ts` (dirección, coordenadas, teléfono `+506`, WhatsApp solo dígitos, correo, horario, redes, Maps/Waze, `priceRange`) · **archivos:** `src/data/site.ts` (líneas 9–39) · **CA:** 0 TODO/corchetes en `site.ts`; `label`, `days` y `schema` de horario coherentes entre sí · **est:** 1,5 h · **bloqueo:** P-01–P-05, P-11
- [ ] **T-19** · **F2** · **@copywriter** — Precios del menú en colones con IVA y ocultar `[₡ precio]`: alimentar `price` de los platos confirmados y plegar `pending()` hasta recibir nombres · **archivos:** `src/data/menu.ts`, `src/components/DishList.astro` · **CA:** ningún precio inventado; plato sin precio no muestra placeholder ni entra a `offers` del JSON-LD; formato `₡` es-CR · **est:** 2 h · **bloqueo:** P-07
- [ ] **T-20** · **F2** · **@copywriter** — Completar categorías pendientes (mariscos, pastas y arroces, hamburguesas, coctelería: ~12 platos) con nombre + descripción ≤140 car. en voz de marca · **archivos:** `src/data/menu.ts:32-34,51` · **CA:** 0 platos `pending()`; cada descripción usa ≥1 ingrediente concreto; kicker coherente · **est:** 2,5 h · **bloqueo:** P-08
- [ ] **T-21** · **F2** · **@copywriter** — FAQ: sin corchetes, formas de pago y política del 10% de servicio con el dato real, respuestas citables ≤40 palabras · **archivos:** `src/data/faq.ts` · **CA:** 0 placeholders; respuestas válidas para `FAQPage`; teléfono/dirección derivados de `site.ts` · **est:** 1,5 h · **bloqueo:** P-10
- [ ] **T-22** · **F2** · **@copywriter** — `/nosotros/`: bio de la chef (3–4 frases), cita literal ≤25 palabras, anécdota/visión de dueños y matiz "mismo equipo, propuesta renovada" · **archivos:** `src/pages/nosotros.astro:16-31` · **CA:** 0 corchetes; cita textual; H1/H2 intactos; párrafo con Hicaco factual · **est:** 2,5 h · **bloqueo:** P-14, P-15
- [ ] **T-23** · **F2** · **@copywriter** — `/eventos/`: los 4 tipos con beneficios concretos, menús de grupo y decoración/pastel resueltos, CTAs unificados ("Cotizar mi evento" → "Cotizar por WhatsApp") · **archivos:** `src/pages/eventos.astro:7-21,41,55,69` · **CA:** sin `[confirmar]` ni stats `[ ]`; botón y H2 dicen lo mismo; copy operable por tour operators · **est:** 1,5 h · **bloqueo:** P-09
- [x] **T-24** · **F2** · **@ux-designer** — CTAs y labels coherentes: un CTA primario por sección, labels que describen el resultado real (evitar "Confirmar reserva" que no confirma), nombre en ambas variantes del formulario y canal de contacto obligatorio en la cotización de eventos · **archivos:** `src/components/{Header,ReserveForm}.astro`, `src/pages/{index,eventos,menu}.astro` · **CA:** ningún botón promete algo que no hace; la cotización no se envía sin WhatsApp o correo; revisión completa en las 5 páginas · **est:** 3 h

### F3 — Medios: fotos, og-image, PDF (≈8 h)

- [x] **T-25** · **F3** · **@copywriter + @ux-designer** — Shot list y guía de `alt`: lista por `archivo:línea` de todas las fotos actuales (hero, salón día/noche, parrilla, barra, fachada, chef, equipo, mesa de evento, 4–6 platos, cóctel) con prioridad y `alt` propuesto según glosario · **archivos:** `docs/SHOTLIST.md`, `src/pages/*.astro` · **CA:** cada `Photo` tiene fila con toma, ratio y `alt`; el héroe queda marcado eager/prioritario · **est:** 1,5 h
- [ ] **T-26** · **F3** · **@frontend-dev** — Integrar fotos reales: migrar `Photo.astro` a `<Image />` de `astro:assets` con `width`/`height`, `srcset`/`sizes`, AVIF/WebP, `loading="eager"` + `fetchpriority="high"` solo en heroes y `lazy` en el resto; mover a `src/assets/` · **archivos:** `src/components/{Photo,PageHero}.astro`, `src/styles/global.css`, `src/assets/` · **CA:** 0 CLS (dimensiones reservadas), 0 imágenes sin `alt`, `check` y `build` en 0 errores, LCP móvil < 2,5 s · **est:** 3 h · **bloqueo:** P-16 *(fusiona T-21/T-37/T-88)*
- [ ] **T-27** · **F3** · **@frontend-dev + @seo-geo** — `public/og-image.jpg` (1200×630) y metadatos sociales: `og:image:width/height/alt`, `twitter:title/description/image` · **archivos:** `public/og-image.jpg`, `src/layouts/Base.astro` · **CA:** Facebook Sharing Debugger muestra preview sin recorte; URLs absolutas; JSON-LD `image` resuelve 200 · **est:** 2 h · **bloqueo:** P-17 *(fusiona T-22/T-38/T-87)*
- [ ] **T-28** · **F3** · **@frontend-dev + @seo-geo** — `public/menu-origen.pdf` accesible y sincronizado con el HTML, y quitar el render-blocking de Google Fonts (auto-hostear woff2 con `display=swap` + preload selectivo) · **archivos:** `public/menu-origen.pdf`, `src/pages/menu.astro`, `src/layouts/Base.astro` · **CA:** PDF responde 200 con texto seleccionable y precios iguales al HTML; el menú sigue indexable como texto; sin avisos de preload unused · **est:** 1,5 h · **bloqueo:** P-18 *(fusiona T-22/T-39/T-50a)*

### F4 — Local y confianza: mapa, reseñas, aliados, NAP (≈12,5 h)

- [ ] **T-29** · **F4** · **@seo-geo** — Consolidar NAP confirmado en `site.ts` y validarlo contra la ficha de Google · **archivos:** `src/data/site.ts` · **CA:** 0 TODO; `address`, `geo`, `telephone` y `openingHoursSpecification` coinciden exactamente con el texto visible y con la ficha · **est:** 2 h · **bloqueo:** P-02–P-06
- [ ] **T-30** · **F4** · **@seo-geo** — Google Business Profile: creación/verificación, categoría principal, horarios, fotos, menú, atributos y enlace al sitio con dominio canónico · **archivos:** GBP (externo) + checklist en `docs/` · **CA:** ficha verificada y publicada; NAP idéntico a `site.ts`; enlace sitio↔ficha bidireccional · **est:** 3 h · **bloqueo:** P-06 *(acción externa)*
- [ ] **T-31** · **F4** · **@ux-designer + @frontend-dev** — Mapa real: iframe de Google Maps con el pin de Origen en `/` y `/contacto/`, con `title`, `loading="lazy"`, tamaño estable y bloque de ubicación con NAP + CTA "Cómo llegar" (Maps y Waze) · **archivos:** `src/pages/index.astro`, `src/pages/contacto.astro`, `src/styles/global.css` · **CA:** pin correcto en ambas páginas; dirección literalmente idéntica en header, footer, contacto y JSON-LD; sin CLS ni regresión de LCP · **est:** 2 h · **bloqueo:** P-05 *(fusiona T-08/T-23/T-89)*
- [ ] **T-32** · **F4** · **@copywriter + @ux-designer** — Reseñas y aliados reales: 2–4 citas literales con autor, estrellas, plataforma y permiso; ≥3–6 logos con `alt`; franja oculta si faltan insumos · **archivos:** `src/pages/index.astro:154-182`, `src/styles/global.css` · **CA:** 0 `[estrellas]`/`[Logo aliado]` en prod; sin ningún rating inventado; la sección no se rompe con 0 reseñas · **est:** 2 h · **bloqueo:** P-12, P-13 *(fusiona T-09/T-42/T-62/T-90)*
- [ ] **T-33** · **F4** · **@frontend-dev** — NAP y enlaces de contacto consistentes: `tel:`, `wa.me` (`^506\d{8}$`) y `mailto:` usando siempre `site.*` en Header, Footer y `/contacto/` · **archivos:** `src/components/Footer.astro`, `src/pages/contacto.astro`, `src/data/site.ts` · **CA:** grep sin números fuera de `site.ts`; NAP idéntico en las 3 ubicaciones y en JSON-LD · **est:** 1,5 h
- [x] **T-34** · **F4** · **@qa-tester** — Verificación cruzada NAP: comparar `site.ts` vs ficha de Google vs las 5 páginas + JSON-LD, y smoke de `wa.me`/Maps/Waze · **archivos:** `tests/e2e/seo.spec.ts`, `docs/QA-REPORT.md` · **CA:** igualdad literal de cadenas; 0 links rotos locales; `wa.me` válido · **est:** 2 h

### F5 — Versión inglesa `/en/` + hreflang (≈18,5 h)

- [ ] **T-35** · **F5** · **@frontend-dev** — Arquitectura i18n: prop `lang` en `Base.astro`, estructura `src/pages/en/` (5 páginas), textos de UI en `src/data/i18n/`, switcher EN como enlace real y enfocable · **archivos:** `src/layouts/Base.astro`, `src/components/Header.astro`, `src/pages/en/*.astro`, `src/data/i18n/` · **CA:** `/en/` renderiza con `lang="en"`; el switcher navega EN↔ES; el sitio ES no cambia en absoluto · **est:** 4 h
- [ ] **T-36** · **F5** · **@copywriter** — Glosario ES→EN y traducción: nombres propios sin traducir, CTAs y mensajes de WhatsApp en ambos idiomas, títulos SEO EN localizados (no calcos) · **archivos:** `docs/GLOSARIO.md`, `src/pages/en/*.astro`, `src/data/*` · **CA:** 5 páginas EN con tono premium-cercano equivalente y 0 texto ES mezclado; glosario aprobado · **est:** 6 h · **bloqueo:** P-22 *(fusiona T-63/T-64)*
- [ ] **T-37** · **F5** · **@ux-designer** — UI en inglés: estado accesible del switcher, expansión de botones/leads (EN crece ~20%), legibilidad de `.caps`/`.script` en EN · **archivos:** `src/components/Header.astro`, `src/styles/global.css`, `src/pages/en/*.astro` · **CA:** sin desbordes a 360px; mismo árbol de encabezados que ES; CTA por sección equivalente · **est:** 4 h
- [ ] **T-38** · **F5** · **@seo-geo** — hreflang y señales internacionales: mapeo explícito `es`/`en`/`x-default` (incluido `/nosotros/`↔`/en/about/`), `og:locale`/`og:locale:alternate`, `alternates` en el sitemap y `noindex` en `/en/` hasta go-live · **archivos:** `src/layouts/Base.astro`, `astro.config.mjs` · **CA:** las 10 URLs emiten pares recíprocos correctos (validador en verde); canónicas sin bucles; `/en/` no indexable hasta go-live · **est:** 2,5 h *(fusiona T-26/T-44)*
- [ ] **T-39** · **F5** · **@qa-tester** — QA i18n: spec `i18n.spec.ts` (1 `h1`, titles/descriptions EN del mapa §1.2, selector EN↔ES, axe en `/en/`) y crawl bidireccional ES↔EN · **archivos:** `tests/e2e/i18n.spec.ts` · **CA:** 0 404; ninguna canonical cruzada ES→EN ni viceversa; sitemap con ambos idiomas; axe en verde en `/en/` · **est:** 2 h

### F6 — GEO / IA: JSON-LD y contenido citable (≈12,5 h)

- [ ] **T-40** · **F6** · **@seo-geo + @frontend-dev** — Endurecer y validar JSON-LD: corregir `maximumAttendeeCapacity` (`Base.astro:33`), modelo de horario multiday si aplica, añadir `BreadcrumbList`, `Person` (chef), `image` array, `offers` solo con precio real, `sameAs` reales y `potentialAction` · **archivos:** `src/layouts/Base.astro`, `src/pages/menu.astro`, `src/pages/contacto.astro`, `src/data/site.ts` · **CA:** Rich Results Test sin errores para `Restaurant`, `Menu`, `FAQPage`; JSON-LD = texto visible 1:1; ningún dato inventado · **est:** 4 h *(fusiona T-27/T-46/T-78/T-92)*
- [ ] **T-41** · **F6** · **@copywriter + @seo-geo** — Contenido citable por IA: respuestas de FAQ ≤40 palabras autoconclusivas, bloques factuales (qué es, dónde, horario, capacidad, precios con IVA, formas de pago) y checklist de 10 preguntas locales respondidas con datos verificables · **archivos:** `src/data/faq.ts`, `src/pages/contacto.astro`, `src/pages/nosotros.astro`, `src/pages/index.astro` · **CA:** cada página responde "¿qué es Origen y cuándo abre?" en los 2 primeros párrafos; JSON-LD coincide al 100% con el texto visible; 0 placeholders · **est:** 3 h *(fusiona T-47/T-65/T-79)*
- [x] **T-42** · **F6** · **@frontend-dev + @ux-designer** — Contenido extraíble como texto: FAQ y menú copiables en texto plano, datos críticos nunca solo en imágenes/PDF, `alt` descriptivos en todas las fotos · **archivos:** `src/pages/contacto.astro`, `src/pages/menu.astro`, `src/components/Photo.astro` · **CA:** grep sobre `dist/` encuentra platos, precios y horario en texto; FAQ visible además del JSON-LD · **est:** 2 h
- [ ] **T-43** · **F6** · **@seo-geo** — Visibilidad en buscadores IA: confirmar en `robots.txt` que no se bloquean `OAI-SearchBot`, `PerplexityBot`, `Claude-SearchBot`; evaluar `llms.txt` opcional; registrar prueba manual de la entidad · **archivos:** `public/robots.txt`, `public/llms.txt` (opcional) · **CA:** robots permite los bots IA documentados; si existe, `llms.txt` válido, no duplica el sitemap y sirve 200; prueba registrada sin prometer posiciones · **est:** 2,5 h · **bloqueo:** P-20 (opcional)
- [x] **T-44** · **F6** · **@devops + @qa-tester** — Revisión GEO sobre el build: comprobar en `dist/` que el contenido clave es HTML estático (no JS-imagen-PDF) y re-ejecutar el gate + validación JSON-LD · **archivos:** `dist/**/*.html`, `docs/QA-REPORT.md` · **CA:** evidencia de grep por platos/precios/horario; JSON.parse sin error en los 3 tipos · **est:** 1 h

### F7 — QA, performance y deploy/DNS (≈24,5 h)

- [x] **T-45** · **F7** · **@frontend-dev** — Página `404.astro` con copy propio, `prefers-reduced-motion` completo en transiciones (`.btn`, `.pm`) y presupuesto de assets (JS < 50 KB, imágenes < 300 KB c/u) · **archivos:** `src/pages/404.astro`, `src/styles/global.css` · **CA:** 404 sirve con status real en preview; 0 errores de consola; reduced-motion respetado · **est:** 2 h
- [x] **T-46** · **F7** · **@qa-tester** — Batería completa: `check` + `build` + gate de placeholders + Playwright (smoke, a11y, forms, seo, i18n, media) en chromium y mobile + link check + validación JSON-LD · **archivos:** `tests/e2e/*.spec.ts`, `scripts/check-placeholders.mjs`, `docs/QA-REPORT.md` · **CA:** los 10 criterios globales (§2.4) en verde, con evidencia (reporte HTML, capturas) · **est:** 4 h
- [x] **T-47** · **F7** · **@qa-tester** — Lighthouse CI: `lighthouserc.json` con asserts (perf ≥90 mobile / ≥95 desktop, a11y ≥95, SEO ≥95, BP ≥95) en las 5 URLs y comparación contra el baseline de T-08 · **archivos:** `lighthouserc.json`, `.github/workflows/ci.yml` · **CA:** `lhci autorun` en verde en desktop y mobile, sin regresión vs baseline · **est:** 2 h
- [x] **T-48** · **F7** · **@seo-geo** — Checklist on-page pre-deploy: titles, metas, h1, canonical, JSON-LD, OG debugger, hreflang, alt, enlaces internos, viewport + alta en Search Console · **archivos:** checklist en `docs/` · **CA:** 0 errores críticos; Lighthouse SEO ≥ 95 en móvil; checklist íntegramente marcado · **est:** 3 h
- [ ] **T-49** · **F7** · **@seo-geo + @devops** — Performance/CWV final: fuentes auto-hospedadas verificadas, presupuesto LCP/CLS/INP medido en PageSpeed (producción) · **archivos:** `src/layouts/Base.astro`, `src/styles/global.css` · **CA:** PSI dentro de umbrales (LCP < 2,5 s, CLS < 0,1, INP < 200 ms) sin regresiones · **est:** 2,5 h · **bloqueo:** requiere preview en dominio real
- [x] **T-50** · **F7** · **@copywriter** — QA de copy: tuteo, glosario, CTAs que nombran la acción, títulos con datos reales, alt de todas las fotos · **archivos:** `src/pages/*.astro`, `src/components/*.astro`, `src/data/*.ts` · **CA:** checklist firmada; grep de `\[`, `TODO`, `0000`, `ph-label` sin resultados en contenido renderizado · **est:** 2 h
- [ ] **T-51** · **F7** · **@ux-designer** — QA UX multi-dispositivo: teclado, contraste, 360/768/1440px, LCP < 2,5 s simulando 4G y prueba real de ambos formularios hacia WhatsApp (con fallback si el popup está bloqueado) · **archivos:** `src/styles/global.css`, `src/components/ReserveForm.astro`, `src/pages/*.astro` · **CA:** 0 bloqueos con teclado; sin scroll horizontal; ambos formularios entregan el mensaje · **est:** 4 h
- [ ] **T-52** · **F7** · **@devops** — Provisionar proyecto en Vercel con `vercel.json` (headers de seguridad + cache), `.vercel/` en `.gitignore`, remote del repo y **solo deploy de preview** · **archivos:** `vercel.json`, `.gitignore`, remote · **CA:** preview URL accesible para el equipo; cabeceras visibles; nada en producción sin aprobación registrada · **est:** 2 h · **bloqueo:** P-19 · **⚠️ requiere aprobación**
- [ ] **T-53** · **F7** · **@devops** — Go-live DNS: apex→www con 301, HTTPS forzado, `site`/`robots`/`sitemap` con dominio real, runbook documentado · **archivos:** `vercel.json`, `astro.config.mjs`, `public/robots.txt`, `docs/RUNBOOK-DNS.md` · **CA:** `https://www.origenjaco.com` responde 200 con certificado válido; sin `www` redirige 301; runbook para futuros cambios · **est:** 1,5 h · **bloqueo:** P-01 · **⚠️ requiere aprobación explícita (DNS)**
- [ ] **T-54** · **F7** · **@qa-tester** — Smoke de producción: 5 rutas 200, canonical/og-image/PDF, sitemap y robots accesibles, gate de placeholders en vivo, alta final en Search Console + Rich Results · **archivos:** `docs/QA-REPORT.md` · **CA:** todo en verde sobre el dominio real; registro de la evidencia · **est:** 1,5 h · **bloqueo:** T-53

### Resumen de esfuerzo

| Fase | Enfoque | Tareas | Horas |
|---|---|---|---|
| F1 | Fundamentos técnicos | T-01…T-13 | 23,5 h |
| F2 | Contenido y SEO on-page ES | T-14…T-24 | 23 h |
| F3 | Medios | T-25…T-28 | 8 h |
| F4 | Local y confianza | T-29…T-34 | 12,5 h |
| F5 | Versión inglesa + hreflang | T-35…T-39 | 18,5 h |
| F6 | GEO / IA | T-40…T-44 | 12,5 h |
| F7 | QA, performance y deploy/DNS | T-45…T-54 | 24,5 h |
| **Total** | **54 tareas** | | **≈122,5 h** |

> F2, F3 y F4 tienen bloqueos de cliente: hasta que lleguen los insumos, el avance real se concentra en F1, F5–F7 (salvo copy EN) y en el QA.

---

## 4. Tareas fusionadas (dedupe entre especialistas)

Para evitar trabajo duplicado, se consolidaron los solapamientos detectados entre auditorías:

| Tareas originales | Resultado |
|---|---|
| FE T-15 · QA T-67 · DO T-84 | → **T-02** (toolchain + `check` + engines) |
| UX T-04 · FE T-19 · SEO T-36 · QA T-70 (parcial) | → **T-17** (sanear placeholders del HTML/JSON-LD) |
| UX T-05 · FE T-20 · SEO T-35 · DO T-85 | → **T-15** (revisión on-page) |
| UX T-06 · SEO T-37 · FE T-21 · DO T-88 | → **T-25** (shot list/alt) + **T-26** (astro:assets) |
| UX T-07 · COPY T-52 | → **T-13** (política de placeholders) |
| UX T-08 · FE T-23 · QA T-74 · DO T-89 | → **T-31** (iframe de mapa) |
| UX T-09 · SEO T-42 · COPY T-62 · QA T-75 · DO T-90 | → **T-32** (reseñas y aliados) |
| FE T-20 (NAP en 3 páginas) · COPY T-61 · QA T-74 | → **T-16** + **T-33** |
| UX T-10/T-11 · FE T-25 · SEO T-43 · COPY T-64 · QA T-76 · DO T-91 | → **T-35** + **T-36** + **T-37** |
| FE T-26 · SEO T-44/T-45 · QA T-77 | → **T-38** + **T-39** |
| FE T-27 · SEO T-46 · QA T-78 · DO T-92 | → **T-40** |
| SEO T-47 · COPY T-65 · QA T-79 · FE T-28 · UX T-12/T-13 · DO T-93 | → **T-41** + **T-42** + **T-44** |
| SEO T-38 · FE T-22 · DO T-87 | → **T-27** (og-image) |
| FE T-22/T-39 · SEO T-39/T-50a · DO T-88 | → **T-28** (PDF + fuentes) |
| FE T-29 · QA T-80 · DO T-94 (parcial) | → **T-45** + **T-46** |
| SEO T-49 · COPY T-66 | → **T-48** + **T-50** |
| SEO T-50 · DO T-96 · QA T-82 · FE T-30 | → **T-49** + **T-53** + **T-54** |

---

## 5. Pendientes del cliente

Formato de respuesta sugerido: **texto plano, un dato por línea** (se vuelca directo a `site.ts` / `menu.ts`).

| ID | Pendiente | Bloquea |
|---|---|---|
| P-01 | Dominio `origenjaco.com`: ¿comprado? ¿registrar? ¿quién tiene acceso al panel DNS? | T-06, T-53 |
| P-02 | Dirección exacta (calle + número/lote + referencia turística), una sola string oficial | T-18, T-29 |
| P-03 | Teléfono `+506` y WhatsApp (¿mismo número? ¿quién atiende?) + correo operativo | T-18, T-33 |
| P-04 | Días y horario reales (¿igual los 7 días? ¿horario distinto de barra? ¿festivos?) y política de último pedido (¿21:30 o 22:00?) | T-18, T-21 |
| P-05 | URLs exactas de Instagram, Facebook, TripAdvisor y links de la ficha de Google Maps y Waze | T-18, T-31 |
| P-06 | Google Business Profile: crear/verificar, categoría, permisos, URL de la ficha | T-29, T-30 |
| P-07 | Precio en colones con IVA de **todos** los platos (~24 escritos + los nuevos) | T-19 |
| P-08 | ~12 platos pendientes: mariscos (4), pastas y arroces (3), hamburguesas (2), coctelería (3) → nombre + descripción | T-20 |
| P-09 | Menús de grupos (precio/persona, mínimo, opciones) y decoración/pastel (¿sí/no, quién coordina?) | T-23 |
| P-10 | Formas de pago (efectivo colones/dólares, tarjetas, SINPE) y frase exacta del 10% de servicio + factura electrónica | T-21 |
| P-11 | `priceRange` real (`₡`/`₡₡`/`₡₡₡` por persona promedio) | T-18 |
| P-12 | 2–4 reseñas literales (texto, nombre publicable, estrellas, plataforma) + permiso de uso por escrito | T-32 |
| P-13 | Logos de ≥3–6 aliados (PNG fondo transparente) + nombre oficial + URL | T-32 |
| P-14 | Bio de la chef (3–4 frases), su plato favorito y una cita literal ≤25 palabras | T-22 |
| P-15 | 3–5 frases de los dueños: visión de Origen y qué heredaron de Hicaco | T-22 |
| P-16 | Fotos (o sesión en el local) con permiso de uso de chef y equipo, según `docs/SHOTLIST.md` | T-26 |
| P-17 | `og-image.jpg` 1200×630 (o aprobación para generarla con diseño) | T-27 |
| P-18 | `menu-origen.pdf` definitivo (hoy el botón de `/menu/` da 404) | T-28 |
| P-19 | Cuenta Vercel/Netlify (¿a nombre de quién?), admin del repo, **aprobador único de producción** | T-52 |
| P-20 | Palabras clave objetivo reales que validen el mapa §1 | T-14 |
| P-21 | Capacidad "120" confirmada + ¿salón privado/zona separada? | T-14 |
| P-22 | Alcance de la versión EN: ¿1:1 con el ES o reducida? | T-36 |

**Pendientes del proyecto (no del cliente):**

| ID | Pendiente |
|---|---|
| PP-01 | **`AGENTS.md` no existe** → crear con roles, skills, gate de verificación y convención de commits, o confirmar que no aplica |
| PP-02 | Instalar dependencias (`npm install`) — hoy no hay `node_modules` |
| PP-03 | Fijar Node 22 LTS (`.nvmrc` + `engines`); local es Node 23 no LTS |
| PP-04 | Definir si `x-default` apunta a `/` (ES) o a `/en/` (mercado turista) |

---

## 6. Riesgos

| ID | Riesgo | Impacto | Mitigación |
|---|---|---|---|
| R-01 | Publicar con placeholders (`[corchetes]`, `+506 0000 0000`, `[₡ precio]`, reseñas ficticias) | **Alto** — confianza, SEO local y datos falsos indexados | Gate automático T-04 que **bloquea** hasta 0 placeholders; política T-13 (ocultar > inventar); checklist de salida de fase |
| R-02 | NAP inconsistente entre sitio, ficha de Google y JSON-LD | **Alto** — SEO local, Knowledge Panel y rich results dañados | Fuente única `site.ts` (T-16/T-29), verificación cruzada T-34, igualdad literal de cadenas |
| R-03 | Sin repo git ni `astro check` hoy | **Alto** — sin historial ni detección de regresiones | T-01 + T-02 en F1; gate obligatorio tras cada tarea |
| R-04 | Dominio no confirmado o cambio tardío de host | **Alto** — canonicals, sitemap y OG rotos | Fijar dominio en F1 (T-06), no en F7; si cambia, actualizar los 3 puntos en una sola tarea |
| R-05 | CTAs de WhatsApp con número ficticio | **Alto** — reservas perdidas sin aviso | Bloquear T-18/T-33 hasta NAP real; probar `wa.me` en QA |
| R-06 | Reseñas o frases de la chef inventadas | **Alto** — reputación y guías de reseñas de Google | Solo texto literal autorizado (T-32); `AggregateRating` solo con reseñas de terceros reales |
| R-07 | Header sin menú colapsado en móvil | **Medio-alto** — tráfico mayoritario móvil, CTA de reserva poco visible | T-10 en F1, antes de campañas |
| R-08 | Imágenes sin dimensiones / héroe con `lazy` | **Medio-alto** — CLS y LCP malos | T-26 con `width/height` + eager en hero; presupuesto CLS < 0,1 |
| R-09 | Contraste insuficiente (`.script` ≈ 2,4:1 sobre crema) | **Medio-alto** — axe falla, excluye baja visión | T-09 + axe desde F1; corrección con `--accent-ink` |
| R-10 | `window.open` bloqueado → "envío" que no llega | **Medio** — formulario que parece enviado | T-11 (fallback con enlace visible) + T-51 |
| R-11 | `/en/` a medias o hreflang mal emparejado | **Medio** — duplicidad y canibalización ES/EN | `noindex` en `/en/` hasta go-live; mapeo explícito de rutas (T-38); QA T-39 |
| R-12 | Plan free del hosting restrinja uso comercial | **Medio** — suspensión o migración forzada | Verificar ToS antes de T-52; si hace falta, plan de pago decidido con el cliente |
| R-13 | Node 23 local vs 20/22 en CI/hosting | **Medio** — "pasa en mi máquina" | `.nvmrc` + `engines` (T-02/PP-03) |
| R-14 | Error humano en DNS (apex/www, TTL) | **Medio** — downtime en el cutover | Runbook T-53, doble aprobación, `dig` antes/después |

---

## 7. Definition of Done

### 7.1 Global (Definition of Done del proyecto)

El proyecto está **terminado** cuando, sobre `https://www.origenjaco.com`:

1. **Código**: `npm ci && npm run check && npm run build` en **0 errores/0 avisos de tipos**; commits convencionales con historial limpio en `main`.
2. **Datos**: 0 placeholders `\[[^\]]+\]` y 0 `TODO` en el texto visible de `dist/` **ni dentro del JSON-LD**; `grep -r "0000\|TODO\|ph-label" dist/` sin resultados.
3. **SEO on-page**: 1 `h1` por página; titles ≤60 y descriptions 120–155 únicos en las 5 (+5 EN); canonical absoluta correcta; `og:type="website"`; sitemap y robots accesibles y dados de alta en Search Console.
4. **Datos estructurados**: `Restaurant`, `Menu` y `FAQPage` sin errores en Rich Results Test y 1:1 con el texto visible; `hreflang` `es`/`en`/`x-default` recíproco en las 10 URLs.
5. **Accesibilidad**: axe-core **0 violaciones `critical`/`serious`** y 0 `color-contrast`; navegación completa por teclado; skip link visible; contraste AA.
6. **Performance**: Lighthouse ≥90 performance (mobile) / ≥95 a11y / ≥95 SEO / ≥95 best practices en las 5 URLs; LCP < 2,5 s, CLS < 0,1, INP < 200 ms en PageSpeed.
7. **Funcional**: 0 enlaces internos rotos (incluye `og-image.jpg` y `menu-origen.pdf` → 200); 0 errores de consola; ambos formularios entregan el mensaje de WhatsApp; 404 propio.
8. **Local**: NAP idéntico en Header/Footer/`/contacto/`/JSON-LD/ficha de Google; mapa con el pin real; reseñas y logos reales con permiso.
9. **Operación**: deploy en Vercel con preview por rama, headers de seguridad, apex→www 301, HTTPS válido; runbook DNS documentado; `AGENTS.md` (PP-01) resuelto.
10. **QA documentado**: `docs/REVIEW.md` con estado global, Lighthouse por página y DoD verificado (FASE 3).

### 7.2 Criterio de aceptación de cada tarea (requisito FASE 2)

- [ ] Gate `check + build + check-placeholders` en verde.
- [ ] Commit convencional (`tipo: descripción en español`) y casilla marcada `[x]` en este PLAN.md.
- [ ] Criterio de aceptación (CA) de la tarea verificado manualmente o con test.
- [ ] Ninguna acción de push/deploy/DNS ejecutada sin aprobación previa del usuario.

### 7.3 Cierre de fase

Una fase se cierra cuando **todas** sus casillas están `[x]`, el gate global pasa y no hay hallazgos P0/P1 abiertos de esa fase. Las fases con bloqueos de cliente se declaran **"completada al 100 % de lo no bloqueado"** y se reabren al recibir el insumo.

---

## 8. Registro de estado (FASE 2)

| Fase | Estado | Commits | Notas |
|---|---|---|---|
| F1 | 🟡 12/13 (T-01…T-05, T-07…T-13) | `chore:` 307e795 · `build:` 13932ba · `refactor:` fbd28ab · `docs:` 9c024fa, d60a22b, 233979a, d1fc6f5, b63926a, e1dc4a4, 2c74707, 2d34878, 6bdaa18 · `ci:` fc557e8, 5204338 · `test:` 3ad4285 · `fix(a11y):` 5cf11c2 · `feat(nav):` 3477013 · `fix:` 05842a1 · `feat:` b31cc9b | **T-06 bloqueada por P-01** (único pendiente de F1); gate **VERDE (0)** desde T-17; baseline **99,6/100/100/100**; **160 tests** |
| F2 | 🟡 4/11 (T-15…T-17, T-24) | `fix(seo):` c5014eb · `refactor:` 65dc9a0 · `fix:` cd5db8a · `fix(ux):` af9a81c | **T-14, T-18…T-23 bloqueadas por datos del cliente** (P-01…P-15, P-20); gate VERDE (0); 160 tests |
| F3 | 🟡 1/4 (T-25) | `feat:` bd19946 | `docs/SHOTLIST.md` (31 filas, héroe eager/prioritario); T-26/T-27/T-28 bloqueadas por P-16…P-18 |
| F4 | 🟡 2/6 (T-33, T-34) | `refactor:` 36a96e0 · `test:` 711aa33 | T-29…T-32 bloqueadas (P-01…P-06, P-12, P-13); `docs/QA-REPORT.md` + `seo.spec.ts` (206 tests); PDF 404 = P-18 |
| F5 | 🟡 1/5 (T-35) | `feat:` b085221 | T-36 bloqueada por P-22; `/en/` provisional con `noindex` y fuera del sitemap; **244 tests** |
| F6 | 🟡 3/5 (T-40, T-42, T-44) | `feat(seo):` 80a11e9 · `fix:` 8379db0 · `docs:` 9cc329c | JSON-LD validado local (11/11); contenido extraíble verificado; revisión GEO en `QA-REPORT.md`; Rich Results/dominio pendientes (P-01) |
| F7 | 🟡 4/10 (T-45…T-48) | `feat:` 888a662 · `docs:` 13c3acd, ca840ba · `ci:` 1cd25f9 | Batería QA (10 criterios) + **Lighthouse CI** verde + `PREDEPLOY-CHECKLIST.md` (75 casillas: 25 ✅, 50 ⏳ P-xx/T-xx) | ⚠️ T-52/T-53 requieren aprobación explícita |

> **Recordatorio operativo**: antes de `git push`, cualquier deploy o cambio de DNS → **avisar al usuario y esperar confirmación**.
