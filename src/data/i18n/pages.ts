// Contenido EN provisional de las páginas (chrome/títulos/h1/leads).
// TODO: traducción aprobada (P-22) — T-36 sustituye estas cadenas por el glosario EN
// aprobado por el cliente; T-37 ajusta el layout si el texto EN crece.
// El cuerpo de las páginas reutiliza los componentes/datos ES mientras T-36 no exista.
export interface EnPageStrings {
  title: string;
  description: string;
  script: string;
  h1: string;
  lead: string;
}

export const enPages: Record<'index' | 'menu' | 'nosotros' | 'eventos' | 'contacto', EnPageStrings> = {
  index: {
    // TODO: título SEO EN aprobado (P-22)
    title: 'Origen Jacó · Seafood and grill restaurant in Jacó, Costa Rica',
    description:
      'Origen: seafood and grill in Jacó, Costa Rica. Fresh Pacific seafood, grilled cuts and signature cocktails.',
    script: 'Welcome to',
    h1: 'Seafood and grill restaurant in Jacó',
    lead: 'Pacific coast cooking from the grill, fresh seafood and signature cocktails in the heart of Jacó.',
  },
  menu: {
    // TODO: título SEO EN aprobado (P-22)
    title: 'Menu · Origen Jacó — Seafood, ceviches and grilled cuts',
    description:
      'Origen menu in Jacó: Ceviche Diablo, Perlas del Pacífico, lobster cream, Lomito, New York and Rib Eye on the grill, kids menu and desserts. Prices with VAT.',
    script: 'From our',
    h1: 'Menu',
    lead: 'Fresh Pacific seafood, grilled cuts and Costa Rican cooking in Jacó. Prices include VAT.',
  },
  nosotros: {
    // TODO: título SEO EN aprobado (P-22)
    title: 'About · Origen Jacó — History, chef and team',
    description:
      'Origen opened in Jacó on the site of the former Hicaco Plaza, with the same team. Meet chef Zugetcy Leitón and our sea, land and fire cooking.',
    script: 'Our',
    h1: 'History',
    lead: 'A new restaurant in Jacó with a team you already know.',
  },
  eventos: {
    // TODO: título SEO EN aprobado (P-22)
    title: 'Events and groups in Jacó · Origen — up to 120 guests',
    description:
      'Celebrate at Origen, Jacó: tour groups, birthdays, company dinners and weddings. Capacity for up to 120 guests and a tailor-made menu.',
    script: 'Celebrate in Jacó',
    h1: 'Events and groups',
    lead: 'Capacity for up to 120 guests, a tailor-made menu and a team experienced with groups and tours.',
  },
  contacto: {
    // TODO: título SEO EN aprobado (P-22)
    title: 'Reservations and contact · Origen Jacó — Address, hours and FAQs',
    description:
      'Book at Origen, Jacó, on WhatsApp. Address, hours and directions.',
    script: 'We are waiting',
    h1: 'Reservations and contact',
    lead: 'Reserve by WhatsApp or message us for events and groups.',
  },
};