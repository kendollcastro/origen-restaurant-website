// Contenido EN de las páginas (títulos SEO, script, h1 y leads). Traducción aprobada (P-22) — T-36.
// Los cuerpos de página viven en src/pages/en/*.astro y reutilizan componentes/datos bilingües.
export interface EnPageStrings {
  title: string;
  description: string;
  script: string;
  h1: string;
  lead: string;
}

export const enPages: Record<'index' | 'menu' | 'nosotros' | 'eventos' | 'contacto', EnPageStrings> = {
  index: {
    title: 'Origen Jacó · Seafood and grill restaurant in Jacó, Costa Rica',
    description:
      'Origen: seafood and grill in Jacó, Costa Rica. Fresh Pacific seafood, grilled cuts and signature cocktails.',
    script: 'Welcome to',
    h1: 'Seafood and grill restaurant in Jacó',
    lead: 'Pacific coast cooking from the grill, fresh seafood and signature cocktails in the heart of Jacó. Open every day from 11:00 am to 10:00 pm.',
  },
  menu: {
    title: 'Menu · Origen Jacó — Seafood, ceviches and grilled cuts',
    description:
      'Origen menu in Jacó: Ceviche Diablo, Perlas del Pacífico, lobster cream, Lomito, New York and Rib Eye on the grill, kids menu and desserts. Prices with VAT.',
    script: 'From our',
    h1: 'Menu',
    lead: 'Fresh Pacific seafood, grilled cuts and Costa Rican cooking in Jacó. Prices include VAT. Open every day from 11:00 am to 10:00 pm.',
  },
  nosotros: {
    title: 'About · Origen Jacó — History, chef and team',
    description:
      'Origen opened in Jacó on the site of the former Hicaco Plaza, with the same team. Meet chef Zugetcy Leitón and our sea, land and fire cooking.',
    script: 'Our',
    h1: 'History',
    lead: 'A seafood and grill restaurant in Jacó with a team you already know. Open every day from 11:00 am to 10:00 pm.',
  },
  eventos: {
    title: 'Events and groups in Jacó · Origen — up to 120 guests',
    description:
      'Celebrate at Origen, Jacó: tour groups, birthdays, company dinners and weddings. Capacity for up to 120 guests and a tailor-made menu.',
    script: 'Celebrate in Jacó',
    h1: 'Events and groups',
    lead: 'Seafood and grill in Jacó with capacity for up to 120 guests, a tailor-made menu and a team experienced with groups and tours. Open every day from 11:00 am to 10:00 pm.',
  },
  contacto: {
    title: 'Reservations and contact · Origen Jacó — Address, hours and FAQs',
    description:
      'Book at Origen, Jacó, on WhatsApp. Address, hours and directions.',
    script: 'We are waiting',
    h1: 'Reservations and contact',
    lead: 'Seafood and grill in Jacó, Costa Rica. Open every day from 11:00 am to 10:00 pm. Book by WhatsApp or message us for events and groups.',
  },
};