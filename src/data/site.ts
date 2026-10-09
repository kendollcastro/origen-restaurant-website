// Datos del negocio (NAP). Una sola fuente para todo el sitio y el JSON-LD.
// Todo lo que está entre [corchetes] está pendiente de confirmar.
export const site = {
  name: 'Origen',
  fullName: 'Origen. Mar, tierra y fuego',
  tagline: 'Mar · Tierra · Fuego',
  description:
    'Restaurante de mariscos y parrilla en Jacó, Costa Rica. Mariscos frescos del Pacífico, cortes a la parrilla y coctelería, de 11 am a 10 pm.',
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
  phone: '+506 0000 0000', // TODO
  whatsapp: '50600000000', // TODO: solo dígitos, con código de país
  email: 'info@origenjaco.com', // TODO
  hours: {
    label: '11:00 am – 10:00 pm',
    days: 'Todos los días', // TODO: confirmar días
    opens: '11:00',
    closes: '22:00',
    schema: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], // TODO
  },
  capacity: 120,
  chef: 'Zugetcy Leitón',
  manager: 'Genesis Chinchilla',
  priceRange: '₡₡', // TODO
  social: {
    instagram: 'https://instagram.com/[usuario]', // TODO
    facebook: 'https://facebook.com/[pagina]', // TODO
    tripadvisor: 'https://www.tripadvisor.com/[ficha]', // TODO
  },
  mapsUrl: 'https://maps.google.com/?q=Origen+Jaco', // TODO: link de la ficha de Google
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
