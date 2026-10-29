// Textos de la interfaz de reseñas (/qr/ y /en/qr/). Traducción aprobada (P-22).
export type QrLang = 'es' | 'en';

export interface QrCard {
  key: string;
  label: string;     // nombre de la marca (se muestra junto al logo)
  title: string;     // título de la tarjeta
  display: string;   // texto del enlace visible (nombre de la app/plataforma)
  note: string;      // copia de la tarjeta
}

export interface QrStrings {
  lang: QrLang;
  htmlTitle: string;
  kicker: string;
  title: string;
  sub: string;
  pending: string;   // cuando hay enlaces pendientes del cliente
  footBrand: string; // "Origen · Mar, tierra y fuego" / "Origen · Sea, land and fire"
  footPlace: string; // "Jacó, Costa Rica"
  cards: QrCard[];
}

export const qrStrings: Record<QrLang, QrStrings> = {
  es: {
    lang: 'es',
    htmlTitle: 'Reseñas · Google y TripAdvisor · Origen Jacó',
    kicker: 'Gracias por visitarnos',
    title: 'Déjanos tu reseña',
    sub: 'Escanea el código con la cámara de tu teléfono',
    pending: 'Pendiente de enlace del cliente:',
    footBrand: 'Origen · Mar, tierra y fuego',
    footPlace: 'Jacó, Costa Rica',
    cards: [
      {
        key: 'google',
        label: 'Google',
        title: 'Reseña en Google',
        display: 'Google Maps',
        note: 'Cuéntanos cómo fue tu experiencia en Origen.',
      },
      {
        key: 'tripadvisor',
        label: 'TripAdvisor',
        title: 'Reseña en TripAdvisor',
        display: 'TripAdvisor',
        note: 'Comparte tu visita con otros viajeros.',
      },
    ],
  },
  en: {
    lang: 'en',
    htmlTitle: 'Reviews · Google and TripAdvisor · Origen Jacó',
    kicker: 'Thanks for visiting us',
    title: 'Leave us a review',
    sub: 'Scan the code with your phone camera',
    pending: 'Pending client link:',
    footBrand: 'Origen · Sea, land and fire',
    footPlace: 'Jacó, Costa Rica',
    cards: [
      {
        key: 'google',
        label: 'Google',
        title: 'Review on Google',
        display: 'Google Maps',
        note: 'Tell us about your experience at Origen.',
      },
      {
        key: 'tripadvisor',
        label: 'TripAdvisor',
        title: 'Review on TripAdvisor',
        display: 'TripAdvisor',
        note: 'Share your visit with other travelers.',
      },
    ],
  },
};
