# Glosario de marca — Origen, Jacó

> Fuente única: `src/data/site.ts`. Este documento fija la voz, los términos y los CTAs del sitio.
> T-12 (F1). Cualquier string de marca nuevo empieza aquí y en `site.ts`, nunca suelto en un `.astro`.

---

## 1. Identidad

| Campo | Valor exacto | Uso |
|---|---|---|
| `name` | `Origen` | Nombre corto en prosa, saludos, mensajes de WhatsApp |
| `fullName` | `Origen. Mar, tierra y fuego` | Pie legal (`Footer.astro`), dirección de contacto, `name` del JSON-LD |
| `tagline` | `Mar · Tierra · Fuego` | Bajo el logotipo en header y pie (puntos medios `·`, no comas) |
| `description` | `Restaurante Origen: mariscos y parrilla en Jacó, Costa Rica. Mariscos frescos del Pacífico, cortes a la parrilla y coctelería de autor.` | Meta description por defecto (`Base.astro:14`) y `description` del JSON-LD — **135 caracteres** |

La descripción cumple ≤160 e incluye de forma natural **"mariscos y parrilla en Jacó"**. No menciona horario, precios ni años: esos datos no están confirmados (P-04, P-07). Si el cliente confirma el horario, se podrá enriquecer en una tarea nueva (T-14/T-18), no antes.

### Mayúsculas

- **"Origen"** con mayúscula inicial y el resto minúsculas en todo el copy (prosa, títulos, FAQ, mensajes).
- **"ORIGEN"** solo dentro del logotipo: `Header.astro:10`, `Footer.astro:9` y el héroe decorativo `index.astro:24` (`aria-hidden`).
- **"Origen Jacó"** (sin tilde en "Jaco" solo dentro de URLs y queries de Maps/Waze) se permite como compuesto de marca en `<title>` y `alternateName` del JSON-LD; en copy corrido se escribe "Origen, en Jacó" o "Origen en Jacó".
- **"Jacó"** con tilde siempre en copy visible (`site.ts` ya lo fija en `address.locality`).

### Cómo se nombra la cocina

- **"mariscos y parrilla"** — la formulación corta y el keyword principal (héroe, FAQ, 404).
- **"mar, tierra y fuego"** — la cocina descrita; en prosa minúsculas ("nuestra cocina de mar, tierra y fuego"), como tagline con mayúsculas y puntos medios.
- **"mariscos del Pacífico"** — el mar siempre con su origen geográfico; nunca "del mar" solo cuando se hable del producto.
- **"a la parrilla"** — nunca "grill", "BBQ", "parrillada" (la categoría del menú se titula "A la parrilla").
- **"cocina costarricense"** / "Cocina del Pacífico costarricense" — para el matiz local, sin "tico/a" ni slang.

---

## 2. Voz y tono

Anfitrión cálido en tuteo: sensorial e ingenuo-concreto (ingredientes, no adjetivos), orgullo local sin superlativos, sobriedad elegante.

1. **Tuteo siempre.** El sitio habla de tú a tú.
   - Sí: "Te esperamos en Jacó." · No: "Le esperamos. / Estimado cliente."
2. **Concreto antes que adjetivo.** Nombra el ingrediente, el corte, el origen.
   - Sí: "Rib Eye con chimichurri ahumado, mariscos frescos del Pacífico." · No: "Exquisitos cortes de la más alta calidad gourmet."
3. **Orgullo local sin superlativos.** Ni "el mejor", ni "el número 1", ni premios inventados.
   - Sí: "Mariscos del Pacífico, comprados a proveedores locales." · No: "El mejor restaurante de Costa Rica."
4. **Primera persona del plural.** La casa habla de sí misma en "nosotros".
   - Sí: "Abrimos donde estuvo Hicaco Plaza, con el mismo equipo." · No: "Origen ofrece una experiencia única."
5. **CTAs que nombran la acción y el canal.** El botón dice lo que pasa al tocarlo.
   - Sí: "Reservar por WhatsApp", "Ver el menú." · No: "Enviar", "Click aquí", "Confirmar reserva" (el formulario no confirma; T-24 lo corrige).
6. **Sin jerga ni anglicismos.** Español directo, frases cortas.
   - Sí: "a la parrilla", "cócteles de autor". · No: "grill", "BBQ", "fine dining", "foodie".

---

## 3. Términos del glosario

| Término | Regla | Ejemplo de uso |
|---|---|---|
| Origen | Nombre propio; mayúscula inicial nunca todo mayúsculas (salvo logotipo) | "Origen" |
| Mar · Tierra · Fuego | Tagline oficial, con puntos medios | `{site.tagline}` en header/pie |
| mar, tierra y fuego | Forma en prosa de la cocina | "nuestra cocina de mar, tierra y fuego" |
| mariscos y parrilla | Keyword y formulación corta | "mariscos y parrilla en Jacó" |
| mariscos del Pacífico | Producto con origen | "Mariscos frescos del Pacífico" |
| a la parrilla | Categoría y cocción; nunca grill/BBQ | "cortes a la parrilla" |
| Jacó | Con tilde en copy; sin tilde en URLs | "Jacó, Costa Rica" |
| Costa Rica | En prosa siempre "Costa Rica"; **"CR" solo en datos estructurados** (`address.country`) | "Jacó, Costa Rica" |
| la chef Zugetcy Leitón | Tratamiento de la chef; rol visible "Chef ejecutiva" | "la chef Zugetcy Leitón" |
| hasta 120 invitados | Capacidad (pendiente P-21 de confirmar) | "Espacio para hasta 120 invitados" |
| Precios con IVA incluido | Fórmula única para precios; nunca "IVA incluido" solo ni "+ impuestos" | "Precios con IVA incluido" |
| Colones / ₡ | Moneda `₡` + `toLocaleString('es-CR')` (`menu.ts:formatPrice`); sin decimales; dólares solo si el cliente lo confirma | "₡8 500" |

### Categorías del menú (kickers oficiales, `menu.ts`)

Entradas "Para empezar" · A la parrilla "Fuego" · Mariscos "Mar" · Pastas y arroces "De la casa" · Hamburguesas "Para compartir" · Menú de niños "Los pequeños" · Postres "Dulce final" · Coctelería y mocktails "Barra".

### CTAs canónicos (coherentes con los botones reales del sitio)

| Acción | Texto canónico | Dónde vive hoy |
|---|---|---|
| Reserva (navegación) | **Reservar mesa** | `Header.astro:28`, `menu.astro:65`, `nosotros.astro:73` → `/contacto/#reservar` |
| Reserva (acción directa) | **Reservar por WhatsApp** | `index.astro:30`, `ReserveForm.astro` (ambas variantes) |
| Menú | **Ver el menú** (variante larga admitida: "Ver menú completo") | `index.astro:29,131`, `nosotros.astro:72`, `404.astro:17` |
| Eventos (ancla) | **Cotizar mi evento** | `eventos.astro:21`, `index.astro` (sección CTA) |
| Eventos (WhatsApp) | **Cotizar por WhatsApp** | `eventos.astro:70`, `index.astro` (CTA acción) |
| PDF | **Descargar menú PDF** | `menu.astro:66` (hoy da 404, P-18) |
| Mapa | **Cómo llegar** | `index.astro:55`; links "Google Maps" y "Waze" en `contacto.astro:34-35` |
| Formulario eventos | **Solicitar cotización por WhatsApp** | `eventos.astro:70` (abre WhatsApp; no confirma asistencia) |

Prohibidos: "Enviar" a secas, "Click aquí", "Confirmar reserva" (no confirma nada, T-24), "Más información" (vago).

Mensajes de WhatsApp (saludo fijo): **"Hola Origen, …"** — idénticos en `ReserveForm.astro`, `eventos.astro` e `index.astro` (candidatos a centralizarse en `site.ts` en T-16).

---

## 4. Pendiente del cliente

Mientras no llegue el dato, se conserva el placeholder/`TODO` de `site.ts` y **no se publica texto provisional entre corchetes** (política de placeholders: T-13; ocultar > inventar).

| ID | Campo en `site.ts` | Estado actual | Texto definitivo al llegar el dato |
|---|---|---|---|
| P-01 | `url` | `https://www.origenjaco.com` con `TODO` | Dominio real confirmado; unifica canonical, sitemap y robots (T-06) |
| P-02 | `address.street` | `[Dirección exacta]` | Una sola string oficial (calle + número + referencia); se replica en header, pie, contacto y JSON-LD |
| P-03 | `phone`, `whatsapp`, `email` | `+506 0000 0000`, `50600000000`, `info@origenjaco.com` | Números y correo operativos; `whatsapp` solo dígitos `^506\d{8}$` |
| P-04 | `hours` | `11:00 am – 10:00 pm` con `TODO` en `days` y `schema` | Días y horario reales (¿los 7 días? ¿festivos? ¿último pedido?). **Hasta entonces la meta description no menciona horario**; copy de páginas que sí lo mencionan (`eventos.astro:41`, `menu.astro:62`) queda bloqueado hasta T-16/T-18 |
| P-05 | `social`, `mapsUrl`, `wazeUrl` | URLs con `[usuario]`/`[pagina]`/`[ficha]` | Perfiles reales de Instagram, Facebook, TripAdvisor, Maps y Waze |
| P-11 | `priceRange` | `₡₡` con `TODO` | Rango real por persona promedio |
| P-21 | `capacity` | `120` | Confirmación de la capacidad y si hay salón privado |

También pendiente (no en `site.ts`): P-07 precios del menú (hasta entonces no se renderiza precio), P-12/P-13 reseñas y logos de aliados (secciones ocultas), P-16 fotos, P-18 PDF del menú.

---

## 5. Inventario de strings de marca fuera de `site.ts`

Auditoría grep en `src/**`. No se refactoriza aquí (T-16/T-23/T-24 harán la migración); es el mapa para esas tareas.

### Quedan (copy editorial legítimo de página)

| Ubicación | String | Nota |
|---|---|---|
| `index.astro:19` | `Origen Jacó · Restaurante de mariscos y parrilla en Jacó, Costa Rica` | `<title>`; compuesto "Origen Jacó" permitido en títulos |
| `index.astro:26` | `Restaurante de mariscos y parrilla en Jacó` | H1 del héroe; keyword principal |
| `index.astro:27,65,146,193` | Copy de secciones (lead, historia, galería, aliados) | Editorial de página |
| `index.astro:24` | `ORIGEN` | Logotipo decorativo `aria-hidden` |
| `menu.astro:32-33,38` | Title/description/lead del menú | Copy editorial; T-14 ajustará longitudes |
| `nosotros.astro:8-9,11,16-18,30` | Title, description, historia, chef | Copy editorial; la fecha "octubre de 2026" debe confirmarse con el cliente antes de F3 (riesgo de dato no verificado, ver informe T-12) |
| `eventos.astro:16-17,20` | Title, description, lead | Copy editorial; hereda `${site.capacity}` correctamente |
| `contacto.astro:18` | `Reservas y contacto · Origen Jacó — …` | `<title>` |
| `404.astro:5-6,14` | Title, description y copy 404 | Editorial propio |
| `faq.ts:5-7` | Preguntas con "Origen" | Copy editorial; las respuestas usan `site.*` |
| `menu.ts:1` | Comentario `// Menú de Origen…` | Comentario de código, no se publica |

### Deben migrar a `site.ts` en T-16 (literales duplicados de datos)

| Ubicación | Literal | Migraría a |
|---|---|---|
| `Base.astro:24` | `alternateName: 'Origen Jacó'` | Nuevo campo de marca en `site.ts` |
| `index.astro:54` | `Jacó, Garabito, Puntarenas` | `site.address.*` |
| `contacto.astro:32` | `Jacó, Garabito, Puntarenas, Costa Rica` | `site.address.*` |
| `eventos.astro:41` | `['11–10', 'abierto de 11 am a 10 pm']` | `site.hours.*` (bloqueado por P-04) |
| `ReserveForm.astro:28` | `min="11:00" max="21:30"` | Derivado de `site.hours` (bloqueado por P-04) |
| `ReserveForm.astro:6,56` · `eventos.astro:7,96` · `index.astro:30,165` | Mensajes `Hola Origen, …` | Constantes junto a `waLink` en `site.ts` |
| `astro.config.mjs:5` | `site: 'https://www.origenjaco.com'` | Dominio real (T-06, bloqueado por P-01; hoy 3 copias del dominio) |

### Inconsistencias de CTA detectadas (resuélvelas T-23/T-24, fuera de alcance de T-12)

- `index.astro:164` dice **"Cotizar evento"** vs. `eventos.astro:21` **"Cotizar mi evento"**.
- `index.astro:165` dice **"Hablar por WhatsApp"**; el canónico del plan es **"Cotizar por WhatsApp"**.
- `ReserveForm.astro:31` (variante bar) dice **"Confirmar reserva"** aunque solo abre WhatsApp.

---

## 6. Política de placeholders

Regla madre: **ocultar > inventar**. Ningún texto entre corchetes (`[₡ precio]`, `[Logo aliado]`, `[Dirección exacta]`…), ninguna etiqueta `ph-label` y ningún `TODO`/`0000` debe llegar a producción. Si el dato no está confirmado, el hueco se **oculta**, no se rellena. La implementa el gate `npm run gate` (`scripts/check-placeholders.mjs`) y, en código, `src/data/placeholders.ts` (`isPlaceholder`/`isReal`) y `src/data/menu.ts` (`hasDish`, categorías `pending`).

| Tipo de hueco | Comportamiento | Por qué | Quién lo desbloquea |
|---|---|---|---|
| **Reseñas** (Google/TripAdvisor) | Ocultar la sección entera mientras no haya cita real con texto, autor, estrellas y permiso | No se pueden inventar citas ni ratings (R-01); 0 reseñas no debe dejar la franja a medias | Cliente **P-12** → T-32 |
| **Aliados / logos** | Ocultar la franja entera mientras no haya ≥3 logos con `alt` y permiso | `[Logo aliado]` es andamiaje, no un logo; la rejilla vacía se lee como página sin terminar | Cliente **P-13** → T-32 |
| **Mapa / ubicación** | No renderizar el embed; conservar el bloque con la parte real (Jacó, Garabito, Puntarenas) y el CTA "Cómo llegar". Ocultar solo la línea de dirección si `site.address.street` sigue en corchetes | Un iframe sin pin real no aporta; la localidad ya es utilizable y evita una caja vacía | Cliente **P-05** → T-31 (iframe) · **P-02** → T-18/T-31 |
| **Precios `[₡ precio]`** | Ocultar el precio y los puntos guía; el plato se muestra con nombre y descripción | El precio no está confirmado (P-07); inventarlo es R-01 y rompe la confianza | Cliente **P-07** → T-18/T-19 |
| **Platos `pending()`** | Marcar la categoría como `pending` y no publicarla (ni su lista); al llegar nombre real vuelve a aparecer | "[Nombre del plato]" no es copy y una lista vacía no debe renderizarse | Cliente **P-08** → T-20 |
| **Fotos sin `src`** (`Photo`) | Reservar el bloque (textura) para no romper el layout, pero **sin** texto `ph-label` visible | "Foto · …" es andamiaje interno; nunca es copy público | Cliente **P-16** → T-27/T-28 |
| **NAP / FAQ** (`[...]`, `TODO`, `0000` en `site.ts`) | No publicar: se oculta el fragmento o la sección hasta el dato real | Datos ficticios indexados dañan SEO local y confianza (R-01/R-02) | Cliente **P-01–P-05** → T-18 (datos) · **T-17** (limpieza en HTML/JSON-LD) |

### Cómo reutilizarla (para T-17)

Al sanear FAQ, `/nosotros/`, `/eventos/` y el JSON-LD, usa el mismo criterio: envolver cada bloque en una condición de dato real (`isReal(...)`) y, si falta, **no emitir el bloque**, en lugar de imprimir el corchete. Los arrays `reviews`/`partners` y `mapsEmbedUrl` de `index.astro` quedan vacíos a propósito: T-31/T-32 solo los llenan y la sección se muestra sola.

---

## 7. Guía de `alt` para fotos

> Referencia de campo: `docs/SHOTLIST.md` (T-25) lista cada `<Photo>` del sitio con su `alt` propuesto, ratio, prioridad y `loading`. Reglas mínimas:

- **Describir lo que se ve, concreto** — ingrediente, corte, escena; en voz de marca (§2: tuteo, concreción, orgullo local sin superlativos). Nada de "Imagen de…" ni keyword-stuffing.
- **8–12 palabras** (~60–120 caracteres). Si el texto visible del mismo componente ya dice el plato, la imagen es decorativa (`alt=""`), p. ej. tarjetas Mar/Tierra/Fuego (`index.astro:102`).
- **Personas**: nombre y rol ("la chef Zugetcy Leitón"), como en esta sección 3.
- **No inventar**: plato, ingrediente o composición sin confirmar se documentan como pendiente en la shot list y **no** se publican en el `alt` (regla madre §6: ocultar > inventar).
- **SEO/GEO**: el `alt` alimenta la indexación de imágenes (SEO on-page) y, en GEO, da a las respuestas de IA objetos reales y citables (platos del menú real, "parrilla", "mariscos del Pacífico"); el relleno de keywords no mejora el ranking.
- **Héroe**: solo la portada (`index.astro:27`) es `loading="eager"` + `fetchpriority="high"`; el resto `lazy` (ver SHOTLIST §1; `Photo.astro:16` hoy fija `lazy` para todas y T-26 añadirá el flag).
