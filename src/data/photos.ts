import type { ImageMetadata } from 'astro';

// Fotos del cliente servidas vía astro:assets (WebP/AVIF + srcset).
// Los maestros viven en `src/assets/images/<categoría>/`. Al llegar nuevas fotos,
// se suben aquí y se asignan a un slot (ver `docs/SHOTLIST.md`).
const modules = import.meta.glob<ImageMetadata>('../assets/images/**/*.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default',
});

const collect = (folder: string): ImageMetadata[] =>
  Object.entries(modules)
    .filter(([path]) => path.includes(`/images/${folder}/`))
    .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
    .map(([, img]) => img);

// Orden natural por nombre (comida-1, comida-2, … comida-11).
export const platos = collect('platos');
export const bebidas = collect('bebidas');
export const ambiente = collect('ambiente');
export const equipo = collect('equipo');
export const eventos = collect('eventos');
export const hero = collect('hero');
