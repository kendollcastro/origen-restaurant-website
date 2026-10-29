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

// Tríptico conceptual mar · tierra · fuego (home). Imágenes de Unsplash, licencia
// libre: https://unsplash.com/license. Fuentes (CDN de Unsplash):
// - mar.jpg: photo-1494791368093-85217fbbf8de (mar en tempestad)
// - tierra.jpg: photo-1492496913980-501348b61469 (manos con tierra fértil)
// - fuego.jpg: photo-1475738972911-5b44ce984c42 (fogata y chispas)
const elemento = (file: string): ImageMetadata => {
  const entry = Object.entries(modules).find(([path]) => path.endsWith(`/elementos/${file}`));
  if (!entry) throw new Error(`No se encontró src/assets/images/elementos/${file}`);
  return entry[1];
};

export const elementos = {
  mar: elemento('mar.jpg'),
  tierra: elemento('tierra.jpg'),
  fuego: elemento('fuego.jpg'),
};
