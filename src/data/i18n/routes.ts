// Mapeo de rutas equivalentes ES ↔ EN (T-35).
// Las rutas EN usan el mismo slug en español para no romper ningún enlace interno ES
// (p. ej. /nosotros/ ↔ /en/nosotros/). Si T-36/T-38 exige /en/about/, se aliasa aquí.
import type { Lang } from './ui';

export interface RoutePair {
  es: string;
  en: string;
}

export const ROUTES: RoutePair[] = [
  { es: '/', en: '/en/' },
  { es: '/menu/', en: '/en/menu/' },
  { es: '/nosotros/', en: '/en/nosotros/' },
  { es: '/eventos/', en: '/en/eventos/' },
  { es: '/contacto/', en: '/en/contacto/' },
];

const normalize = (pathname: string): string => pathname.replace(/\/?$/, '/');

// Ruta equivalente en el idioma destino. Si la ruta no está mapeada (p. ej. /404.html)
// cae al inicio del idioma destino para no generar URLs inexistentes.
export const equivalentPath = (pathname: string, target: Lang): string => {
  const path = normalize(pathname);
  const pair = ROUTES.find((route) => route.es === path || route.en === path);
  if (pair) return target === 'en' ? pair.en : pair.es;
  return target === 'en' ? '/en/' : '/';
};