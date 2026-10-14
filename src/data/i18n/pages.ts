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
    title: 'Origen · Seafood Restaurant in Jacó, Costa Rica',
    description:
      'Fresh Pacific seafood, grilled steaks and craft cocktails in Jacó, Costa Rica. Open 11 am–10 pm daily. Reserve via WhatsApp or visit us in town.',
    script: 'Welcome to',
    h1: 'Seafood and grill restaurant in Jacó',
    lead: 'Pacific coast cooking from the grill, fresh seafood and signature cocktails in the heart of Jacó. Open every day from 11:00 am to 10:00 pm.',
  },
  menu: {
    title: 'Menu · Origen Jacó — Seafood, Ceviches & Grill',
    description:
      "Origen's menu in Jacó: ceviches, Pacific seafood, grilled Rib Eye and New York cuts, kids' menu and desserts. Prices include 13% VAT.",
    script: 'From our',
    h1: 'Menu',
    lead: 'Fresh Pacific seafood, grilled cuts and Costa Rican cooking in Jacó. Prices include VAT. Open every day from 11:00 am to 10:00 pm.',
  },
  nosotros: {
    title: 'About · Origen Jacó — Chef, Team & Story',
    description:
      'Origen is a new seafood and grill restaurant in Jacó, opened in October 2026. Meet chef Zugetcy Leitón and our sea, land and fire cooking.',
    script: 'Our',
    h1: 'History',
    lead: 'A seafood and grill restaurant in Jacó with a team you already know. Open every day from 11:00 am to 10:00 pm.',
  },
  eventos: {
    title: 'Events & Groups in Jacó · Origen — Up to 120 Guests',
    description:
      'Celebrate in Jacó: tour groups, birthdays, corporate dinners and weddings. Space for up to 120 guests with a custom menu. Get a quote on WhatsApp.',
    script: 'Celebrate in Jacó',
    h1: 'Events and groups',
    lead: 'Seafood and grill in Jacó with capacity for up to 120 guests, a tailor-made menu and a team experienced with groups and tours. Open every day from 11:00 am to 10:00 pm.',
  },
  contacto: {
    title: 'Contact & Reservations · Origen Jacó — Hours & Map',
    description:
      'Reserve a table at Origen, Jacó via WhatsApp. Address, hours (11 am–10 pm), map and answers to frequently asked questions.',
    script: 'We are waiting',
    h1: 'Reservations and contact',
    lead: 'Seafood and grill in Jacó, Costa Rica. Open every day from 11:00 am to 10:00 pm. Book by WhatsApp or message us for events and groups.',
  },
};