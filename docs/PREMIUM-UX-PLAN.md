# Plan de "pulido premium" — features, UI/UX y animaciones

> Research + plan para elevar la **percepción de calidad** del sitio de Origen sin tocar la marca
> (ya definida: fondo carbón `#0F0E0C`, crema, cobre `#D9844A`, Cormorant Garamond + Jost) ni el
> rendimiento/accesibilidad ya conseguidos. **Pendiente de autorización del cliente** para pasar a ejecución.
>
> Estado base hoy: `astro@7` como **MPA clásico**, reveal por `IntersectionObserver`, entra del hero por
> keyframes, galería `scroll-snap` + lightbox, FAQ `<details>`, menú móvil = toggle de `display` **instantáneo**
> (sin animación). 614 tests Playwright en verde · gate de placeholders en 0 · `prefers-reduced-motion` y
> fallback sin JS ya implementados.

---

## 1. Principios (lo que hace que algo se sienta "premium")

Extraídos de la research (skill `ui-ux-pro-max`, dominio `ux`/`gsap`/`astro` + heurística propia):

1. **Motion con propósito**, nunca decorativo: cada animación expresa causa→efecto (abrir, entrar, confirmar, navegar).
2. **Duraciones**: 150–300 ms micro-interacciones · 400–600 ms transiciones de vista. "Las animaciones rápidas se sienten baratas" — *evitar* >500 ms en UI, pero **no** instantáneo.
3. **Easing fuerte, nunca lineal**: usar los tokens existentes `--ease-out` / `--ease-in-out`; `ease-out` al entrar, `ease-in` al salir.
4. **Salida más rápida que entrada** (~60–70 %): el "atrás" se siente ágil.
5. **Solo `transform` y `opacity`** (compositor, sin reflow). Nunca animar `width`/`height`/`top`/`left`.
6. **Stagger 30–50 ms** por hijo, máx ~8 hijos; cada vez más lento = sensación de pesadez.
7. **Continuidad espacial**: los elementos persisten y se mueven (shared element), no "parpadean".
8. **1–2 animaciones focales por vista** máx.; el resto es sutil.
9. **Interrumpible**: el tap del usuario cancela/adelanta la animación; nunca bloquear input.
10. **Transversal obligatorio**: `prefers-reduced-motion`, fallback sin JS y contraste AA en **cada** nueva animación.
11. **Cero librerías pesadas**: preferimos APIs nativas (`View Transitions` del navegador, CSS `@keyframes`/`transition`, `IntersectionObserver`, `scroll-driven animations` con fallback). Sin GSAP/Lottie.
12. **Presupuesto**: no comprometer Lighthouse (hoy perf 94 móvil), ni subir el JS de forma apreciable.

---

## 2. Paquetes de trabajo

Cada ítem lleva **prioridad** (P0 = máximo impacto percibido / bajo riesgo → se hace primero), estimación y riesgo.

### PX-A · Navegación y transiciones (el mayor salto percibido)

| ID | Propuesta | Detalle | Prio | Est. | Riesgo |
|----|-----------|---------|------|------|--------|
| **PX-01** | **Page transitions nativas** (Astro `ClientRouter` / View Transitions API) | Navegación MPA con fundido/slide entre páginas, **sin recargar**. `transition:persist` en Header/Footer (no se re-montan), `transition:name` para logo y hero (continuidad). Sin soporte / `reduced-motion` → navegación normal. | **P0** | 3 h | Medio |
| **PX-02** | **Menú móvil premium** | Hoy es un `display` instantáneo. Pasar a: panel con `opacity`+`translate`/`clip` y **stagger de links** (no animar `height`), **backdrop con blur**, **scroll-lock** del body, **hamburguesa→X** (morph de trazos SVG), foco al primer link al abrir y **devolución al botón** al cerrar, cierre con `Esc`/tocar fuera (ya existe), interrumpible. | **P0** | 4 h | Medio |
| **PX-03** | **Header reactivo al scroll** | Al bajar: header se **compacta** (menos padding) + fondo translúcido `backdrop-filter: blur` + hairline inferior; al subir reaparece. Sin CLS; sin JS queda estático y legible. | **P0** | 2 h | Bajo |
| **PX-04** | **Barra de progreso de lectura** | Hairline cobre en la parte superior que refleja el scroll (solo `transform: scaleX`). Muy sutil. | P1 | 1 h | Bajo |
| **PX-05** | **Subrayado animado de nav** | Indicador que se desliza entre items activos/hover (evita el "salto" de color). | P2 | 1,5 h | Bajo |

### PX-B · Microinteracciones y feedback ("se siente vivo")

| ID | Propuesta | Detalle | Prio | Est. | Riesgo |
|----|-----------|---------|------|------|--------|
| **PX-06** | **Botones** | `:active` scale(0.97), hover con sombra cobre sutil, transición a los tokens de easing; estados hover/active/focus/disabled claramente distintos pero on-brand. | **P0** | 1,5 h | Bajo |
| **PX-07** | **Tarjetas con hover-lift** | `translateY(-4px)` + sombra/elevación sutil en `.element`, `.review`, tarjetas de tipo de evento, aliados; `cursor:pointer` en lo clicable. En touch: solo feedback `:active`. | **P0** | 1,5 h | Bajo |
| **PX-08** | **Subrayado de enlaces de texto** | Underline que crece desde el origen en hover/focus. | P2 | 1 h | Bajo |
| **PX-09** | **Lightbox de galería** | Entrada `scale`+fade **desde el trigger**, crossfade entre imágenes (hoy salta), feedback en flechas; cierre más rápido que apertura. | P1 | 2 h | Bajo |
| **PX-10** | **Foco visible de marca** | Ring cobre con offset + micro-transición; consistente en dark y light (ya hay base). | P1 | 0,5 h | Bajo |

### PX-C · Scroll y storytelling (suavidad percibida)

| ID | Propuesta | Detalle | Prio | Est. | Riesgo |
|----|-----------|---------|------|------|--------|
| **PX-11** | **Reveal por sección con stagger** | Variante `data-stagger` sobre el reveal actual: hijos con 30–50 ms de separación; grids (mar/tierra/fuego, tipos de evento, postres). Se dispara una vez. | **P0** | 1,5 h | Bajo |
| **PX-12** | **Parallax sutil en el hero** | La imagen de fondo se desplaza ~10–20 % con el scroll (solo `transform`, `scrub` suave). Desactivado con `reduced-motion`. | P1 | 2 h | Medio |
| **PX-13** | **Reveal enmascarado del wordmark/scripts** | Aparición con `clip-path`/`mask` en `.hero-title` y `.script` (elegante, sin partir carácter-por-carácter para no pedir licencias ni inflar el DOM). | P2 | 1,5 h | Medio |
| **PX-14** | **Pin/scrub de 1 sección** (opcional) | Máx. 1 sección con "sticky storytelling". Alto riesgo en móvil; solo si se quiere y tras medir. | P3 | 3 h | Alto |

### PX-D · Media y carga (quitar los "pops" feos)

| ID | Propuesta | Detalle | Prio | Est. | Riesgo |
|----|-----------|---------|------|------|--------|
| **PX-15** | **Fade-in de imágenes + LQIP** | Fondo/cuadro de color + `opacity` 0→1 al `load` (evita el "flash" de la foto entrando). Compatible con `<Picture>` de `astro:assets`. | **P0** | 2 h | Bajo |
| **PX-16** | **Skeleton del mapa** | Sombra/patrón + shimmer tras el iframe de Google mientras carga (hoy es un hueco). | P1 | 1 h | Bajo |
| **PX-17** | **Crossfade del autoplay de la galería** | Suavizar la transición entre slides del autoplay (hoy salta por `scroll-snap`). Respetando pausa/hover/`reduced-motion`. | P1 | 2 h | Medio |

### PX-E · Craft y detalles finos

| ID | Propuesta | Detalle | Prio | Est. | Riesgo |
|----|-----------|---------|------|------|--------|
| **PX-18** | **Numerales tabulares** | `font-variant-numeric: tabular-nums` en precios del menú y datos (evita que los ₡ "bailen"). | **P0** | 0,5 h | Bajo |
| **PX-19** | **Transición entre categorías del menú** | Al cambiar de pestaña, el panel hace fade/slide corto en vez de swap seco. | P1 | 1,5 h | Bajo |
| **PX-20** | **Detalles de superficie** | `::selection` cobre, scrollbar afinada, gradientes hairline, grano (noise) muy leve para riqueza. | P2 | 1,5 h | Bajo |
| **PX-21** | **Cursor personalizado** (solo desktop, sobre zonas de imagen) | Puntero "ver/zoom" propio. **Riesgo de gimmick**; propuesto como experimental. | P3 | 2 h | Alto |

### PX-F · Transversal (obligatorio, va con cada paquete)

- `prefers-reduced-motion` en **cada** animación nueva (instantánea).
- Fallback sin JS (patrón `html.js`): nada queda oculto ni inaccesible sin JS.
- Gestión de foco en menú móvil y lightbox; `aria-*` correctos.
- Contraste AA en estados hover/active/focus nuevos (dark y light).
- **Tests**: 1 spec E2E por feature + mantener los **614** en verde.
- **Performance**: medir Lighthouse móvil antes/después (no bajar de ~90 perf); vigilar el coste de `ClientRouter`.
- **Sin librerías pesadas**: todo con CSS/APIs nativas + micro-JS del propio `Base.astro`.

---

## 3. Orden de ejecución sugerido (tandas autorizables)

| Tanda | Contenido | Resultado percibido | Est. |
|-------|-----------|---------------------|------|
| **Tanda 1 — "primera impresión"** | PX-01, PX-02, PX-03, PX-06, PX-07, PX-18 | Navegación fluida, menú móvil suave, header vivo, botones/tarjetas táctiles, menú fino | ~13 h |
| **Tanda 2 — "scroll y media"** | PX-11, PX-15, PX-16, PX-19 | Secciones que entran con ritmo, imágenes sin pops, mapa y menú suaves | ~7 h |
| **Tanda 3 — "encanto"** | PX-09, PX-04, PX-12, PX-13, PX-10, PX-17 | Lightbox, progreso, parallax, wordmark, foco, galería | ~12 h |
| **Tanda 4 — "experimental"** (opcional) | PX-05, PX-14, PX-20, PX-08, PX-21 | Detalles finos / gimmicks, a decidir | ~9 h |

**Riesgo técnico principal:** PX-01 (View Transitions) obliga a mover el reveal y demás init al evento `astro:page-load`, y a `transition:persist` el Header/Footer. Es también el de mayor impacto; por eso va primero y con tests propios.

---

## 4. Lo que NO haremos (para no romper lo bueno)

- **No** cambiar la identidad visual (paleta, tipografías) — los "design systems" genéricos sugerían otra paleta/fuentes; se descartan.
- **No** meter GSAP/Lottie/partículas ni animaciones continuas decorativas.
- **No** animar propiedades de layout (`width`/`height`/`top`).
- **No** ocultar contenido clave solo con JS (SEO/crawlers y sin-JS deben ver todo).
- **No** más de 1–2 animaciones focales por vista.

---

## 5. Criterios de aceptación globales de este plan

1. Percepción: navegación y menú móvil **suaves y consistentes** (una sola "voz" de motion: tokens globales).
2. `prefers-reduced-motion` y sin-JS: **todo visible y estático**.
3. Accesibilidad: 0 regresiones axe; foco gestionado en overlays; contraste AA.
4. Performance: Lighthouse móvil home **≥ 90 perf**, CLS ≤ 0.02, sin subir el JS de forma apreciable.
5. Calidad: **≥ 614** tests Playwright en verde + 1 spec nuevo por feature; gate de placeholders en 0.
