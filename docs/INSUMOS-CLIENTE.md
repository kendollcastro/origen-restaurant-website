# Insumos pendientes del cliente (P-01…P-22)

Para poder cerrar el sitio es necesario recibir estos insumos. Agrupados en dos bloques: **críticos para el lanzamiento** y **secundarios** (se pueden entregar después de publicar, salvo que afecten a lo visible). Marcados según el estado de hoy.

## A. Críticos para el lanzamiento

| ID | Insumo | Dónde se usa | Estado |
|----|--------|--------------|--------|
| P-01 | **Dominio definitivo** (`origenjaco.com`) + credenciales del registrador | go-live (T-53), mails, canonical | ⏳ |
| P-02 | Nombre oficial del restaurante y del local (fachada) | NAP global (T-18) | ⏳ (hoy "Origen.") |
| P-03 | **Teléfono real** (hoy `+506 0000 0000`) | NAP global, JSON-LD, botones | ⏳ |
| P-04 | **WhatsApp real** (hoy `506 0000 0000`) + etiqueta oficial | Botón reservar/cotizar, footer | ⏳ |
| P-05 | URLs exactas: Instagram, Facebook, TripAdvisor, ficha Google Maps y Waze | Redes sociales y enlaces (T-31) | ⏳ |
| P-06 | Google Business Profile: crear/verificar, categoría, **URL de la ficha** | Ficha de Google (T-29/T-30) | ⏳ |
| P-11 | `priceRange` real: personas normales 1 plato + bebida ≈ ₡1 500–3 500 / 3 500–6 000 / 6 000+ | JSON-LD `priceRange` (T-18) | ⏳ |
| P-16 | **Fotos** (o autorización de sesión en el local) con permiso de uso de chef y equipo, según `docs/SHOTLIST.md` (31 tomas) — **parcial**: recibidas **32** (`platos/` 11 · `bebidas/` 13 · `ambiente/` 8) e integradas en T-26; faltan **hero/**, **equipo/**, **eventos/**, **aliados/**, el **permiso por escrito** y la **leyenda por archivo** (qué plato es cada `comida-N.jpg`, para `alt`/copy específicos) | Galería y hero (T-26) ⏳ alt específico | ⏳ |
| P-17 | `og-image.jpg` 1200×630 (o aprobar generarla con diseño) | Tarjetas al compartir (T-27) | ⏳ |
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
| P-15 | 3–5 frases de los dueños: visión de Origen y qué heredaron de Hicaco | Sección nosotros (T-22) | ⏳ |
| P-20 | Palabras clave objetivo reales que validen el mapa SEO §1 | Títulos/descripciones (T-14) | ⏳ |
| P-22 | Alcance de la versión EN: ¿1:1 con la ES o reducida? (hoy: 1:1 con 5 páginas) | Páginas `/en/` (T-36) | ⏳ |
| P-19 | **Aprobador único de producción** (¿quién autoriza el go-live?) | T-53 | ⏳ |

## Notas

- Hoy los valores de ejemplo (`+506 0000 0000`, WhatsApp, redes sociales) están **ocultos** en la web hasta recibir los reales (commit T-17/T-33).
- El sitio ya está desplegado en **preview** (acceso por login a la cuenta Vercel `kendollcastro`). Nada en producción.
- La apertura "octubre de 2026" no está confirmada (afecta a fecha del esquema `openingHoursSpecification`).
- Recibir P-01…P-06 desbloquea T-06/T-14/T-18…T-21/T-23 y el go-live; el resto se puede cerrar en tandas.