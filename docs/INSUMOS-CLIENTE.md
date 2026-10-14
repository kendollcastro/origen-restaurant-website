# Insumos pendientes del cliente (P-01…P-22)

Para poder cerrar el sitio es necesario recibir estos insumos. Agrupados en dos bloques: **críticos para el lanzamiento** y **secundarios** (se pueden entregar después de publicar, salvo que afecten a lo visible). Marcados según el estado de hoy.

## A. Críticos para el lanzamiento

| ID | Insumo | Dónde se usa | Estado |
|----|--------|--------------|--------|
| P-01 | **Dominio definitivo** (`origenjaco.com`) + credenciales del registrador | go-live (T-53), mails, canonical | ⏳ |
| P-02 | Nombre oficial del restaurante y del local (fachada) | NAP global (T-18) | ⏳ (hoy "Origen.") |
| P-03 | ~~**Teléfono real**~~ ✅ `+506 7195 5800` (2026-10-13) | NAP global, JSON-LD, botones | ✅ |
| P-04 | ~~**WhatsApp real**~~ ✅ `50671955800` (2026-10-13) + etiqueta oficial *(falta confirmar etiqueta)* | Botón reservar/cotizar, footer | ✅ |
| P-05 | URLs exactas: Instagram, Facebook, TripAdvisor, **ficha Google Maps** ✅ (`maps.app.goo.gl/jojXbrhHB41TM3kMA`) y Waze | Redes sociales y enlaces (T-31) | 🟡 (falta IG/FB/TA/Waze) |
| P-06 | Google Business Profile: crear/verificar, categoría, **URL de la ficha** | Ficha de Google (T-29/T-30) | ⏳ |
| P-11 | `priceRange` real: personas normales 1 plato + bebida ≈ ₡1 500–3 500 / 3 500–6 000 / 6 000+ | JSON-LD `priceRange` (T-18) | ⏳ |
| P-16 | **Fotos** (o autorización de sesión en el local) con permiso de uso de chef y equipo, según `docs/SHOTLIST.md` (31 tomas) — **parcial**: recibidas **32** (`platos/` 11 · `bebidas/` 13 · `ambiente/` 8) e integradas en T-26; faltan **hero/**, **equipo/**, **eventos/**, **aliados/**, el **permiso por escrito** y la **leyenda por archivo** (qué plato es cada `comida-N.jpg`, para `alt`/copy específicos) | Galería y hero (T-26) ⏳ alt específico | ⏳ |
| P-17 | `og-image.jpg` 1200×630 (o aprobar generarla con diseño) — **provisional lista para revisar** en `public/og-image.jpg` (foto `ambiente-1` + wordmark) | Tarjetas al compartir (T-27) | ⏳ aprobar diseño |
| P-18 | `menu-origen.pdf` definitivo | Botón de descarga en `/menu/` (hoy 404) (T-28) | ⏳ |
| P-21 | Capacidad ("120" por confirmar) + ¿salón privado/zona separada? | `maximumAttendeeCapacity`, reservas (T-14) | ⏳ |

## B. Secundarios (posibles tras lanzar, pero pedidos ya)

| ID | Insumo | Dónde se usa | Estado |
|----|--------|--------------|--------|
| P-07 | Precio en colones con IVA de **todos** los platos (≈24 escritos + nuevos) | Menú (T-19) | ⏳ |
| P-08 | ≈12 platos pendientes: mariscos (4), pastas y arroces (3), hamburguesas (2), coctelería (3): nombre + descripción + precios (P-07) | Menú (T-20) | ⏳ |
| P-09 | Menús de grupos (precio/persona, mínimo, opciones) y decoración/pastel (¿sí/no, quién coordina?) | `menu-grupos.html` (T-23) | ⏳ |
| P-10 | Formas de pago + frase exacta del 10% de servicio + factura electrónica | Footer (T-21) | ⏳ |
| P-12 | 2–4 reseñas literales (texto, nombre publicable, estrellas, plataforma) + **permiso escrito** | Caja de reseñas (T-32) | ⏳ |
| P-13 | Logos de ≥3–6 aliados (PNG, fondo transparente) + nombre oficial + URL | Aliados (T-32) | ⏳ |
| P-14 | Bio de la chef (3–4 frases), su plato favorito, cita literal ≤25 palabras | Sección equipo (T-22) | ⏳ |
| P-15 | 3–5 frases de los dueños: visión de Origen y origen del proyecto | Sección nosotros (T-22) | ⏳ |
| P-20 | Palabras clave objetivo reales que validen el mapa SEO §1 | Títulos/descripciones (T-14) | ⏳ |
| P-22 | Alcance de la versión EN: ¿1:1 con la ES o reducida? (hoy: 1:1 con 5 páginas) | Páginas `/en/` (T-36) | ⏳ |
| P-19 | **Aprobador único de producción** (¿quién autoriza el go-live?) | T-53 | ⏳ |

## Notas

- Hoy los valores de ejemplo restantes (correo, redes, dirección, coordenadas) siguen **ocultos** en la web hasta recibir los reales; teléfono, WhatsApp y horario ya son reales (2026-10-13).
- El sitio ya está desplegado en **preview** (acceso por login a la cuenta Vercel `kendollcastro`). Nada en producción.
- La apertura "octubre de 2026" no está confirmada (afecta a fecha del esquema `openingHoursSpecification`).
- Recibir P-01…P-06 desbloquea T-06/T-14/T-18…T-21/T-23 y el go-live; el resto se puede cerrar en tandas.

## C. Mensaje listo para enviar (WhatsApp / correo)

> Respuestas en **texto plano, un dato por línea**. Mientras llegan, la web mantiene marcadores de posición ocultos y **nada en producción** (solo preview con login).

Hola 👋 — voy cerrando la web de Origen y para publicarla necesito unos datos. Si me los mandas en bloques así se hace muy rápido:

**1. Identidad y contacto**
- Nombre oficial del restaurante y cómo se ve en la fachada.
- Teléfono de reservas (con +506).
- WhatsApp de reservas.
- Correo de contacto (si lo hay).

**2. Dominio y acceso**
- El dominio definitivo (`origenjaco.com`): ¿ya está comprado? ¿quién tiene acceso al panel? (Sin esto no se puede lanzar.)
- ¿Quién es la persona que autoriza la publicación final? (El "sí" final antes de ir en vivo; yo solo la creo.)

**3. Redes y ficha de Google (enlaces exactos)**
- Instagram, Facebook, TripAdvisor (si aplica), página de Google Maps y de Waze.

**4. Menú y precios**
- Precio en colones (con IVA) de cada plato del menú actual.
- La lista de platos que faltan: mariscos (4), pastas y arroces (3), hamburguesas (2), coctelería (3) — nombre y qué lleva cada una.
- Rango de precio "de una persona normal" (1 plato + 1 bebida): ¿₡1 500–3 500, ₡3 500–6 000, o más?
- ¿El PDF del menú definitivo? (El botón de descarga hoy apunta a un archivo que falta.)

**5. Fotografías**
- Las 32 que mandaste ya están puestas 👌. Me falta:
  - que me digas **qué plato es cada `comida-N.jpg`** (o aprobar los textos de pie de foto genéricos por categoría),
  - fotos para: la imagen principal (portada), el equipo/chef, eventos y aliados,
  - **permiso por escrito** para usar las fotos (un "sí, pueden usarse en la web" por WhatsApp sirve).

**6. Restaurante**
- Horario: ✅ confirmado (todos los días, 11:00 am – 10:00 pm). Si la barra o la cocina abren/cierran distinto, avísame.
- Capacidad: ¿confirmas que son 120 personas? ¿hay salón privado o zona separada?
- Formas de pago y la frase exacta del 10% de servicio (¿factura electrónica sí/no?).
- Menús para grupos (precio por persona, mínimo, opciones) y si ofrecen decoración/pastel para eventos.

**7. Confianza y textos**
- 2–4 reseñas literales (texto, nombre publicable, estrellas y plataforma) con permiso de uso.
- Logos (PNG, fondo transparente) de 3–6 aliados + nombre y web de cada uno.
- Unas frases tuyas: qué es Origen para ustedes y cómo nació el proyecto (3–5 frases). Y de la chef: quién es, su plato favorito y una frase corta.

Con **1–4 y 6** puedo cerrar el sitio y publicarlo; el resto (5, 7) se puede ir sumando después y seguir mejorando la página. Gracias 🙌