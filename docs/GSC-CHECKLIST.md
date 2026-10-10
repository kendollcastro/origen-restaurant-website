# GSC-CHECKLIST — Alta en Google Search Console (T-07 · F1)

> **Fecha**: 2026-10-09 · **Tarea**: T-07 (validar sitemap/robots tras build) · **Bloqueo**: P-01 → **T-06** (dominio definitivo).
> **Host provisional**: `https://www.origenjaco.com` — mismo valor en `astro.config.mjs:6`, `src/data/site.ts:9` y `public/robots.txt:4` (los 3 con `TODO` de dominio; **no se cambia aquí**).
> **Estados**: `verificado` = comprobado hoy sobre build local (`dist/`) · `pendiente de dominio real` = requiere dominio publicado y cuenta GSC (no se inventan datos del cliente: sin correos, sin IDs de propiedad).
> **Fuente de verdad**: `npm run build` del 2026-10-09 → 6 páginas (5 ES + `/404.html`).

---

## 1. Precondiciones técnicas (validadas hoy sobre `dist/`)

| # | Comprobación | Evidencia | Estado |
|---|---|---|---|
| 1.1 | Sitemap índice → 1 chunk con **5 URLs** canónicas | `dist/sitemap-index.xml` → `dist/sitemap-0.xml` (5 `<loc>`) | `verificado` |
| 1.2 | Las 5 con **trailing slash** | `grep -c '/</loc>$'` = 5 · sin excepciones | `verificado` |
| 1.3 | Host **https único**, sin `#anclas` ni `?queries` ni duplicados (`/menu` vs `/menu/`) | 1 host · 0 `#` · 0 `?` en `<loc>` · 0 duplicados | `verificado` |
| 1.4 | `/404.html` **ausente** del sitemap | excluida por `@astrojs/sitemap` 3.7.4 (`STATUS_CODE_PAGES`, `node_modules/@astrojs/sitemap/dist/index.js:14,62`) — no hizo falta `filter`/`exclude` | `verificado` |
| 1.5 | `robots.txt` accesible en `/robots.txt` | `dist/robots.txt` (copia byte a byte de `public/robots.txt`) | `verificado` |
| 1.6 | `Allow: /` y **sin `Disallow`** → no bloquea ninguna página indexable ni bots de IA (`PLAN` §2.2-11) | `public/robots.txt:1-2` | `verificado` |
| 1.7 | `Sitemap:` absoluto, mismo host que `site` | `public/robots.txt:4` = `https://www.origenjaco.com/sitemap-index.xml` = host de `astro.config.mjs:6` | `verificado` |
| 1.8 | **Sin `noindex`** en las 5 páginas | `grep -i 'noindex\|robots' dist/**/*.html` → 0 coincidencias | `verificado` |
| 1.9 | Canónicas 5/5 = URLs del sitemap | `dist/index.html`, `dist/{menu,nosotros,eventos,contacto}/index.html` (fuente: `Base.astro:15,60`) | `verificado` |
| 1.10 | `site.ts:url` = host de `astro.config.mjs:site` (sin desajuste de hosts) | ambos `https://www.origenjaco.com` | `verificado` |

---

## 2. Alta en Search Console (pasos concretos)

| # | Paso | Cómo | Estado |
|---|---|---|---|
| 2.1 | Cuenta de Google con acceso del cliente para la propiedad | Pedirla al cliente; no se crea ni registra una propia | `pendiente de dominio real` |
| 2.2 | **Añadir propiedad** por prefijo de URL: `https://www.origenjaco.com/` | GSC → *Añadir propiedad* → *Prefijo de URL* (alternativa complementaria: propiedad *Dominio* vía TXT en el registrador, cubre www + apex) | `pendiente de dominio real` |
| 2.3 | **Verificar propiedad** | Método a acordar: TXT DNS en el registrador, o meta tag en `Base.astro`, o archivo HTML en `public/` | `pendiente de dominio real` |
| 2.4 | Comprobar en vivo `https://www.origenjaco.com/robots.txt` y `https://www.origenjaco.com/sitemap-index.xml` → 200 | `curl -sI` sobre el dominio publicado (hoy: solo local, el dominio no resuelve) | `pendiente de dominio real` |
| 2.5 | **Enviar sitemap**: `https://www.origenjaco.com/sitemap-index.xml` | GSC → *Indexación* → *Sitemaps* → pegar la URL → *Enviar* | `pendiente de dominio real` |
| 2.6 | Confirmar estado del sitemap: «Se ha leído correctamente», **5 URL descubiertas**, 0 con error | GSC → *Sitemaps* → detalle de `sitemap-index.xml` | `pendiente de dominio real` |
| 2.7 | **Inspección de URL** en las 5: canonical seleccionada = la propia URL, resultado «Disponible para Google» | GSC → barra superior → *Inspección de URL* → repetir por `/`, `/menu/`, `/nosotros/`, `/eventos/`, `/contacto/` | `pendiente de dominio real` |
| 2.8 | **Solicitar indexación** de las 5 (empezando por `/`) | Desde el resultado de la inspección → *Solicitar indexación* | `pendiente de dominio real` |
| 2.9 | Revisar *Páginas* (cobertura): sin «Página alternativa con canonical adecuado» inesperada y **sin `/404.html` indexada** | GSC → *Indexación* → *Páginas* | `pendiente de dominio real` |
| 2.10 | *Revisión de datos estructurados*: `Restaurant`, `Menu`, `FAQPage` sin errores | GSC → *Mejoras* (tras haber indexado contenido con JSON-LD completo) | `pendiente de dominio real` |
| 2.11 | *Core Web Vitals* en campo tras tráfico real | GSC → *Core Web Vitals* | `pendiente de dominio real` |
| 2.12 | Monitorización: cobertura, enlaces rotos, búsqueda de la marca | Revisión semanal en GSC | `pendiente de dominio real` |

---

## 3. Secuencia recomendada (para no pedir indexación de placeholders)

1. **T-06** — dominio definitivo y unificación de las 3 copias (bloqueo P-01) · *estado: pendiente de dominio real*.
2. **T-53** — go-live DNS + 301 apex→www + `site`/`robots`/`sitemap` con el dominio real · *pendiente de dominio real*.
3. **T-54** — smoke en producción (5 rutas 200, sitemap/robots accesibles) · *pendiente de dominio real*.
4. **Gate en 0** (`npm run gate` → hoy falla con **128 placeholders**; DoD §7.1-2) y contenido real (precios, NAP, reseñas) antes de solicitar indexación.
5. Pasos 2.1 → 2.8 de esta lista.
6. Pasos 2.9 → 2.12 en monitorización.

---

## 4. Reglas

- **No enviar el sitemap ni pedir indexación** hasta que el sitio esté publicado con dominio real **y** el gate esté en 0: se indexaría contenido placeholder.
- Al cambiar de dominio en T-06/T-53, actualizar en una sola tarea los 3 puntos: `astro.config.mjs:6`, `src/data/site.ts:9`, `public/robots.txt:4` (riesgo R-04).
- Tras el cambio, reenviar el sitemap en GSC y usar *Solicitar indexación* sobre la nueva propiedad; mantener la propiedad antigua con 301 para no perder historial.
- No registrar en este documento credenciales, correos ni IDs de propiedad del cliente.
