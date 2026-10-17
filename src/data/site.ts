// Datos del negocio (NAP). Una sola fuente para todo el sitio y el JSON-LD.
// Todo lo que está entre [corchetes] está pendiente de confirmar.
export const site = {
  name: 'Origen',
  fullName: 'Origen. Mar, tierra y fuego',
  tagline: 'Mar · Tierra · Fuego',
  description:
    'Restaurante Origen: mariscos y parrilla en Jacó, Costa Rica. Mariscos frescos del Pacífico, cortes a la parrilla y coctelería de autor.',
  descriptionEn:
    'Origen Restaurant: seafood and grill in Jacó, Costa Rica. Fresh Pacific seafood, grilled cuts and signature cocktails.', // T-36
  url: 'https://www.origenjaco.com', // TODO: dominio real
  address: {
    street: '[Dirección exacta]', // TODO
    locality: 'Jacó',
    region: 'Puntarenas',
    county: 'Garabito',
    country: 'CR',
    countryName: 'Costa Rica',
  },
  geo: { lat: 9.62103, lng: -84.638029 }, // coordenadas reales (P-05, 2026-10-16) desde el embed de la ficha "Origen Restaurante Jaco"
  phone: '+506 7195 5800', // confirmado por el cliente (2026-10-13); mismo número que WhatsApp
  whatsapp: '50671955800', // confirmado por el cliente (2026-10-13): wa.me/50671955800
  email: 'origenjaco@gmail.com', // confirmado por el cliente (2026-10-13)
  hours: {
    label: '11:00 am – 10:00 pm',
    days: 'Todos los días', // confirmado por el cliente (2026-10-13): los 7 días
    daysEn: 'Every day', // T-36: equivalente EN de `days`
    opens: '11:00',
    closes: '22:00',
    schema: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], // confirmado 2026-10-13
  },
  capacity: 120,
  reservationMax: 12, // TODO: confirmar máximo de personas para reserva directa (grupos mayores → /eventos/)
  chef: 'Zugetcy Leitón',
  manager: 'Genesis Chinchilla',
  priceRange: '₡₡₡', // confirmado por el cliente (2026-10-13): plato fuerte + bebida ≈ ₡12 000–20 000
  social: {
    instagram: 'https://instagram.com/[usuario]', // TODO
    facebook: 'https://facebook.com/[pagina]', // TODO
    tripadvisor: 'https://www.tripadvisor.com/[ficha]', // TODO
  },
  mapsUrl: 'https://maps.app.goo.gl/iL9J4qoP8pwXs8dx6', // confirmado 2026-10-16 (ficha "Origen Restaurante Jaco")
  // Embed de la ficha de Google Maps (P-05). La variante EN sustituye `!1ses!`→`!1sen!` (idioma del mapa).
  mapEmbed:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3933.7005682721165!2d-84.63802872409428!3d9.621029779439182!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8fa1c77faa3e73cf%3A0xec929faa711c937!2sOrigen%20Restaurante%20Jaco!5e0!3m2!1ses!2scr!4v1792205371723!5m2!1ses!2scr',
  // Enlace para dejar reseña (interfaz /qr). Confirmado 2026-10-13; TripAdvisor pendiente.
  reviewUrl: {
    google: 'https://maps.app.goo.gl/M4M5QesgA6nmF4oM6', // confirmado 2026-10-13
    tripadvisor: 'https://www.tripadvisor.com/[reseña]', // TODO: enlace de reseña del cliente
  },
  wazeUrl: 'https://waze.com/ul?q=Origen%20Jaco', // TODO
};

export const nav = [
  { href: '/', label: 'Inicio' },
  { href: '/menu/', label: 'Menú' },
  { href: '/nosotros/', label: 'Nosotros' },
  { href: '/eventos/', label: 'Eventos' },
  { href: '/contacto/', label: 'Contacto' },
];

export const waLink = (text: string) =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;

export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, '')}`;
