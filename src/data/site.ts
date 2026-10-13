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
  geo: { lat: 9.6141, lng: -84.6284 }, // TODO: coordenadas exactas del local
  phone: '+506 7195 5800', // confirmado por el cliente (2026-10-13); mismo número que WhatsApp
  whatsapp: '50671955800', // confirmado por el cliente (2026-10-13): wa.me/50671955800
  email: 'info@origenjaco.com', // TODO
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
  priceRange: '₡₡', // TODO
  social: {
    instagram: 'https://instagram.com/[usuario]', // TODO
    facebook: 'https://facebook.com/[pagina]', // TODO
    tripadvisor: 'https://www.tripadvisor.com/[ficha]', // TODO
  },
  mapsUrl: 'https://maps.app.goo.gl/jojXbrhHB41TM3kMA', // confirmado 2026-10-13
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
