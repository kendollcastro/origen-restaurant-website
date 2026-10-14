# Shot list y guía de `alt` — Origen, Jacó (T-25 · F3)

> Hoja de rodaje + brief de `alt`. Las fotos reales **aún no existen** (P-16): este documento fija qué fotos necesita el sitio, dónde se sirven y qué `alt` usar cuando lleguen (T-27/T-28 las conectarán a `src`).
> Reglas del cliente para cada archivo: **≤ 2000 px**, **< 300 KB**, **JPG o WebP**, nombre en **minúsculas-con-guiones**.
> Subcarpetas destino: `public/images/{hero, platos, ambiente, equipo, eventos, bebidas, aliados}/` (ya creadas con `.gitkeep`).

---

## 1. Carga y prioridad

| Foto | `loading` | `fetchpriority` | Prioridad | Nota |
|---|---|---|---|---|
| **Héroe principal** (`index.astro:27`) | `eager` | `high` | **P1** | Única foto con prioridad de LCP; la única servida sin `lazy` |
| **Héroe de subpágina** (`PageHero` en `/menu/`, `/nosotros/`, `/eventos/`) | `lazy` | — | P1 | Van bajo el `Header`; seguir `lazy` mientras pesen <300 KB. Reevaluar `fetchpriority="high"` por LCP en T-26 |
| Resto de secciones (P2) y detalles (P3) | `lazy` | — | P2/P3 | — |

> **Nota de implementación trampolín**: `src/components/Photo.astro:16` fija `loading="lazy"` para todas las imágenes. En T-26 (astro:assets) se añadirá un flag para que el héroe emita `loading="eager"` + `fetchpriority="high"` y se validará el LCP del delivery real.

---

## 2. Shot list

Leyenda: **Tipo** — hero / ambiente / plato / equipo / evento / detalle / social. **Estado** — `pendiente` (sin foto ni `src` hoy) / `servida` (foto subida y conectada vía T-27/T-28).
**Ratio**: el render actual usa `object-fit: cover` (`global.css:93`), así que la toma debe entregarse en el ratio indicado para que el recorte sea el esperado.

| ID | `archivo:línea` | Toma | Tipo | Prioridad | Orientación / ratio | Tamaño recomendado | Destino (`public/images/…`) | `alt` propuesto | Estado |
|---|---|---|---|---|---|---|---|---|---|
| S-01 | `index.astro:27` | Héroe: parrilla encendida con mesa frente al mar | hero | **P1** | Apaisada · **16:9** (o 21:9) | 1920×1080 | `hero/parrilla-frente-al-mar.jpg` | Parrilla encendida frente a mesas preparadas para la cena, con el mar de Jacó al fondo. | pendiente |
| S-02 | `index.astro:56` | Salón de día con la barra al fondo | ambiente | P2 | Apaisada · 16:9 | 1440×810 | `ambiente/salon-de-dia.jpg` | El salón de Origen a la luz del día, con la barra al fondo. | pendiente |
| S-03 | `index.astro:79` | Retrato de la chef Zugetcy Leitón (sección historia) | equipo | P2 | Vertical · 4:5 | 1080×1350 | `equipo/retrato-chef-zugecyt-leiton.jpg` | La chef Zugetcy Leitón al frente de la cocina de Origen. | pendiente |
| S-04 | `index.astro:81` | Plato insignia del origen (candidato: Ceviche Diablo) | plato | P2 | Apaisada · 3:2 | 1200×800 | `platos/plato-insignia.jpg` | Ceviche Diablo con piña a la parrilla y maíz rostizado. · *decisión de plato pendiente* | pendiente |
| S-05 | `index.astro:102` (elemento Mar) | Plato **Ceviche Diablo** | plato | P2 | Vertical · 4:5 | 1080×1350 | `platos/ceviche-diablo.jpg` | Ceviche Diablo: pescado blanco, piña a la parrilla y maíz rostizado. | pendiente |
| S-06 | `index.astro:102` (elemento Tierra) | Plato **Caprese di Bufala** | plato | P2 | Vertical · 4:5 | 1080×1350 | `platos/caprese-di-bufala.jpg` | Caprese di Bufala: tomate, pesto casero, mozzarella de búfala y rúgula. | pendiente |
| S-07 | `index.astro:102` (elemento Fuego) | Plato **Rib Eye a la parrilla** | plato | P2 | Vertical · 4:5 | 1080×1350 | `platos/rib-eye-a-la-parrilla.jpg` | Rib Eye a la parrilla con chimichurri ahumado. | pendiente |
| S-08 | `index.astro:145` | Plato destacado de la sección menú (candidato: Crema de Langosta) | plato | P2 | Apaisada · 3:2 | 1200×800 | `platos/crema-de-langosta.jpg` | Crema de langosta servida en su bowl de pan. · *decisión de plato pendiente* | pendiente |
| S-09 | `index.astro:146` | Detalle de la parrilla: brasa y corte | detalle | P3 | Apaisada · 3:2 | 1000×667 | `ambiente/detalle-brasa.jpg` | Corte de carne sobre la brasa de la parrilla. | pendiente |
| S-10 | `index.astro:147` | Cóctel de autor | bebida | P2 | Vertical · 4:5 (o 3:2) | 900×1125 | `bebidas/coctel-de-autor.jpg` | Cóctel de autor servido en la barra de Origen. | pendiente |
| S-11 | `index.astro:162` (galería 1) | Salón de noche | ambiente | P2 | Apaisada · 3:2 | 1200×800 | `ambiente/salon-de-noche.jpg` | El salón de Origen encendido de noche, listo para la cena. | pendiente |
| S-12 | `index.astro:162` (galería 2) | Parrilla y fuego | ambiente | P2 | Apaisada · 3:2 | 1200×800 | `ambiente/parrilla-y-fuego.jpg` | Cortes de carne sobre la brasa en la parrilla de Origen. | pendiente |
| S-13 | `index.astro:162` (galería 3) | Plato **Perlas del Pacífico** | plato | P2 | Apaisada · 3:2 | 1200×800 | `platos/perlas-del-pacifico.jpg` | Perlas del Pacífico: camarón, pescado, pulpo y mejillones en salsa coctel. | pendiente |
| S-14 | `index.astro:162` (galería 4) | Barra y coctelería | bebida | P2 | Apaisada · 3:2 | 1200×800 | `bebidas/barra-cocteles.jpg` | La barra de coctelería de Origen con cócteles de autor. | pendiente |
| S-15 | `index.astro:162` (galería 5) | Equipo de salón | equipo | P2 | Apaisada · 3:2 | 1200×800 | `equipo/equipo-de-salon.jpg` | El equipo de salón de Origen. | pendiente |
| S-16 | `index.astro:167` | Banda evento: mesa larga montada | evento | P2 | Apaisada · 16:9 | 1600×900 | `eventos/mesa-larga-montada.jpg` | Mesa larga montada para una celebración en Origen. | pendiente |
| S-17 | `nosotros.astro:27` | Fachada y salón de Origen en Jacó | ambiente | P2 | Vertical · 4:5 | 1080×1350 | `ambiente/fachada.jpg` | La fachada de Origen y el salón que abre a la calle de Jacó. | pendiente |
| S-18 | `nosotros.astro:32` | Retrato grande de la chef Zugetcy Leitón | equipo | P2 | Vertical · 4:5 | 1080×1350 | `equipo/chef-zugecyt-leiton.jpg` · *puede compartir máster con S-03* | La chef Zugetcy Leitón, jefa de cocina de Origen. | pendiente |
| S-19 | `nosotros.astro:56` (equipo 1) | Equipo: chef ejecutiva (Zugetcy Leitón) | equipo | P3 | Apaisada · 3:2 | 1000×667 | `equipo/chef-ejecutiva.jpg` | La chef Zugetcy Leitón, chef ejecutiva de Origen. | pendiente |
| S-20 | `nosotros.astro:56` (equipo 2) | Equipo: gerente general (Genesis Chinchilla) | equipo | P3 | Apaisada · 3:2 | 1000×667 | `equipo/manager-genesis-chinchilla.jpg` | Retrato de Genesis Chinchilla, gerente general de Origen. | pendiente |
| S-21 | `nosotros.astro:56` (equipo 3) | Equipo de cocina y salón (grupo) | equipo | P3 | Apaisada · 3:2 | 1200×800 | `equipo/cocina-y-salon.jpg` | El equipo de cocina y de salón de Origen. | pendiente |
| S-22 | `eventos.astro:31` (tipo 1) | Cena de grupo de tour | evento | P2 | Apaisada · 3:2 | 1200×800 | `eventos/grupo-de-tour.jpg` | Mesa puesta para un grupo de tour en Origen. | pendiente |
| S-23 | `eventos.astro:31` (tipo 2) | Cumpleaños y aniversarios | evento | P2 | Apaisada · 3:2 | 1200×800 | `eventos/cumpleanos.jpg` | Celebración de cumpleaños en el salón de Origen. | pendiente |
| S-24 | `eventos.astro:31` (tipo 3) | Cena corporativa | evento | P2 | Apaisada · 3:2 | 1200×800 | `eventos/cena-empresa.jpg` | Cena de equipo servida en el salón de Origen. | pendiente |
| S-25 | `eventos.astro:31` (tipo 4) | Cena de ensayo de boda | evento | P2 | Apaisada · 3:2 | 1200×800 | `eventos/boda-ensayo.jpg` | Cena de ensayo de boda, a pasos de la playa de Jacó. | pendiente |
| S-26 | `menu.astro:36-39` → `PageHero.astro:6` | Héroe de menú: mesa con platos variados | hero | P1 | Apaisada · 16:9 | 1600×900 | `platos/mesa-con-platos.jpg` | Mesa con platos de mar y tierra recién servidos en Origen, Jacó. | pendiente |
| S-27 | `nosotros.astro:17` → `PageHero.astro:6` | Héroe de nosotros: equipo en la cocina | hero | P1 | Apaisada · 16:9 | 1600×900 | `equipo/equipo-en-la-cocina.jpg` | El equipo de cocina de Origen trabajando frente a la parrilla. | pendiente |
| S-28 | `eventos.astro:21-22` → `PageHero.astro:6` | Héroe de eventos: mesa larga montada | hero | P1 | Apaisada · 16:9 | 1600×900 | `eventos/mesa-larga-montada-hero.jpg` · *puede compartir máster con S-16* | Mesa larga montada para una cena de celebración en Origen. | pendiente |
| S-29 | `Base.astro:15,77` (`og:image`) · no es un `<Photo>` | Imagen para redes y compartir | social | P1 | Apaisada · **1.91:1** | 1200×630 | `../og-image.jpg` (raíz de `public/`) | n/a (metadato `og:image`; hoy 404, H-06) | pendiente |
| S-30 | *candidata* (aún sin slot: opción para S-08 o galería) | Plato **Crema de Langosta** | plato | P3 | Apaisada · 3:2 | 1200×800 | `platos/crema-de-langosta.jpg` | Crema de langosta servida en su bowl de pan, con hierbas. | pendiente |
| S-31 | *candidata* (aún sin slot: opción para galería) | Postre **Olas de Vainilla** | plato | P3 | Apaisada · 3:2 | 1000×667 | `platos/olas-de-vainilla.jpg` | Olas de Vainilla: churros de vainilla de Origen. | pendiente |

**Platos confirmados servidos hoy (del menú real `src/data/menu.ts`)**: Ceviche Diablo (S-05), Caprese di Bufala (S-06), Rib Eye (S-07), Perlas del Pacífico (S-13) = **4 en slot** + candidatas Crema de Langosta (S-08/S-30) y Olas de Vainilla (S-31) = **6 en total**.
**Cóctel**: S-10 (1 cóctel de autor; el nombre del cóctel no se fija hasta que llegue la coctelería, P-08 → T-20 — el `alt` lo describe sin inventar nombre).

---

## 3. Guía de `alt` (alineada con `docs/GLOSARIO.md`)

### Qué sí

- **Describir lo que se ve, concreto**: el ingrediente, el corte, la escena. Voz de marca (§2: tuteo, concreción, orgullo local sin superlativos).
  - ✅ "Perlas del Pacífico: camarón, pescado, pulpo y mejillones en salsa coctel."
  - ✅ "La chef Zugetcy Leitón al frente de la cocina de Origen."
- **8–12 palabras** (~60–120 caracteres), con el dato útil primero. Si el texto visible del mismo card ya dice el plato, la imagen es decorativa (`alt=""`): es el caso de las tarjetas Mar/Tierra/Fuego (`index.astro:102`), cuyo overlay muestra nombre + descripción.
- **Personas**: nombre y rol, como en el copy del glosario ("la chef Zugetcy Leitón"). La única persona con nombre público confirmado es la chef (y el manager `site.manager`); el resto del equipo se describe por rol.
- **En heros e imágenes de sección**: describir la escena concreta del rodaje pensado (parrilla, mar, mesa montada), no resumir el texto del título.

### Qué no

- ❌ "Imagen de…", "Foto de…", "Restaurante en Jacó con comida gourmet" (keyword-stuffing y adjetivos vacíos).
- ❌ Inventar platos, ingredientes, composición o datos no confirmados (regla madre §6: **ocultar > inventar**). Si la foto o el plato no está confirmado, se documenta en esta shot list y el `alt` queda pendiente.
- ❌ Superlativos ("el mejor", "exquisito"), anglicismos ("grill", "BBQ"), texto entre corchetes.
- ❌ Repetir el mismo `alt` en galerías con varias tomas del mismo plato: se varía la toma descrita.

### Relación con SEO/GEO

- **SEO**: el `alt` es un factor on-page menor pero de calidad: describe el objeto real para la indexación de imágenes y Google Lens/Shopping. No sube el ranking por relleno de keywords; el texto debe servir a quien no puede ver la imagen.
- **GEO**: respuestas de IA y fichas generativas citan contenido verificable de la página; un `alt` concreto y sin inventar (nombres de platos reales del menú, "parrilla", "mariscos del Pacífico") hace la imagen citable sin introducir datos falsos que contradigan el resto del sitio.

---

## 4. Cobertura (`Photo` ↔ fila)

**CA: cada `<Photo>` del sitio tiene su fila con toma, ratio y `alt`; el héroe queda marcado eager/prioritario (§1).**

| Página | `<Photo>` (slots) | Fila(s) |
|---|---|---|
| `src/pages/index.astro` | 16 | S-01…S-16 |
| `src/pages/nosotros.astro` | 5 | S-17…S-21 |
| `src/pages/eventos.astro` | 4 | S-22…S-25 |
| `src/components/PageHero.astro` (vía `/menu/`, `/nosotros/`, `/eventos/`) | 3 | S-26, S-27, S-28 |
| **Total slots `<Photo>`** | **28** | **28 filas** (S-01–S-28) |
| Sin `<Photo>` (adicionales) | `og:image` (Base.astro) + 2 platos candidatos | S-29, S-30, S-31 |

Filas sin `<Photo>` asociado: **S-29** (metadato social, no renderiza `<img>`) y **S-30/S-31** (candidatas de fondo de armario para slots aún por decidir — no se codifican hasta que se asigne su slot).

**Fuera de la shot list a propósito**: `404.astro` y `contacto.astro` no usan `<Photo>` (el bloque de mapa de `contacto.astro:64` es un placeholder `ph-label` de iframe, no una foto; T-31 lo sustituirá por el embed de Maps).