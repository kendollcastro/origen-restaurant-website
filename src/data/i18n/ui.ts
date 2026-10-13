// Diccionario de textos de UI por idioma.
// · ES = cadenas actuales extraídas de Base.astro / Header.astro / Footer.astro (literales previos).
// · EN = traducción aprobada (P-22) — T-36/T-37.
// El copy de las páginas NO vive aquí (eso es T-36): solo el chrome del layout/header/footer.
export type Lang = 'es' | 'en';

export interface NavItem {
  href: string;
  label: string;
}

export interface FooterLabels {
  visit: string;
  hours: string;
  contact: string;
}

export interface UiStrings {
  skipLink: string;
  nav: NavItem[];
  navAria: string;
  footerNavAria: string;
  menuToggleOpen: string;
  menuToggleClose: string;
  logoAria: (name: string) => string;
  language: string;
  switchToEs: string;
  switchToEn: string;
  reserve: string;
  footer: FooterLabels;
}

export const ui: Record<Lang, UiStrings> = {
  es: {
    skipLink: 'Saltar al contenido',
    nav: [
      { href: '/', label: 'Inicio' },
      { href: '/menu/', label: 'Menú' },
      { href: '/nosotros/', label: 'Nosotros' },
      { href: '/eventos/', label: 'Eventos' },
      { href: '/contacto/', label: 'Contacto' },
    ],
    navAria: 'Principal',
    footerNavAria: 'Pie de página',
    menuToggleOpen: 'Abrir menú',
    menuToggleClose: 'Cerrar menú',
    logoAria: (name) => `${name} — inicio`,
    language: 'Idioma',
    // El aria-label incluye el texto visible (ES/EN) para no disparar label-content-name-mismatch.
    switchToEs: 'Cambiar idioma a español (ES)',
    switchToEn: 'Cambiar idioma a inglés (EN)',
    reserve: 'Reservar mesa',
    footer: { visit: 'Visítanos', hours: 'Horario', contact: 'Contacto' },
  },
  en: {
    skipLink: 'Skip to content',
    nav: [
      { href: '/en/', label: 'Home' },
      { href: '/en/menu/', label: 'Menu' },
      { href: '/en/nosotros/', label: 'About' },
      { href: '/en/eventos/', label: 'Events' },
      { href: '/en/contacto/', label: 'Contact' },
    ],
    navAria: 'Main',
    footerNavAria: 'Footer',
    menuToggleOpen: 'Open menu',
    menuToggleClose: 'Close menu',
    logoAria: (name) => `${name} — home`,
    language: 'Language',
    switchToEs: 'Switch to Spanish (ES)',
    switchToEn: 'Switch to English (EN)',
    reserve: 'Book a table',
    footer: { visit: 'Visit us', hours: 'Hours', contact: 'Contact' },
  },
};

export const getUi = (lang: Lang): UiStrings => ui[lang];
