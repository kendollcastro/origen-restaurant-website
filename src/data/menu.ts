// Menú de Origen. price: número en colones con IVA incluido (null = pendiente).
// Texto bilingüe: `name`/`desc` (ES) y `nameEn`/`descEn` (EN, T-36). Los nombres propios
// de plato se mantienen cuando son marca; el resto se traduce para el lector en inglés.
export type Dish = { name: string; desc?: string; price?: number | null; nameEn?: string; descEn?: string };
export type Category = {
  id: string;
  kicker: string;
  title: string;
  note?: string;
  dishes: Dish[];
  pending?: boolean;
  kickerEn?: string;
  titleEn?: string;
  noteEn?: string;
};

// Un plato solo es publicable si tiene nombre real (sin corchetes ni vacío).
export const hasDish = (d: Dish): boolean => d.name.trim() !== '' && !d.name.startsWith('[');

// Categorías sin datos confirmados: se marcan `pending` y no se publican (política §6).
const pending = (n: number): Dish[] =>
  Array.from({ length: n }, () => ({ name: '', desc: '' }));

const catalog: Category[] = [
  {
    id: 'entradas', kicker: 'Para empezar', title: 'Entradas',
    kickerEn: 'To start', titleEn: 'Starters',
    dishes: [
      { name: 'Ceviche Diablo', desc: 'Pescado blanco, piña a la parrilla, maíz rostizado, cebolla, ají y chips dulces.', descEn: 'White fish, grilled pineapple, roasted corn, onion, chili and sweet plantain chips.' },
      { name: 'Perlas del Pacífico', desc: 'Camarón, pescado, pulpo y mejillones en salsa coctel, con patacones.', nameEn: 'Pacific Pearls', descEn: 'Shrimp, fish, octopus and mussels in cocktail sauce, with patacones.' },
      { name: 'Dúo de Carpaccio del Mar', desc: 'Corvina y salmón marinados, alioli de alcaparras, melba casera y rúgula.', nameEn: 'Sea Carpaccio Duo', descEn: 'Marinated sea bass and salmon, caper aioli, homemade melba toast and arugula.' },
      { name: 'Crema de Langosta', desc: 'Servida en bowl de pan, con hierbas y carne de langosta.', nameEn: 'Lobster Bisque', descEn: 'Served in a bread bowl, with herbs and lobster meat.' },
      { name: 'Camarones Piedra', desc: 'Camarones crujientes con salsa agridulce picante.', nameEn: 'Sizzling Shrimp', descEn: 'Crispy shrimp with a spicy sweet-and-sour sauce.' },
      { name: 'Calamares Crocantes', desc: 'Anillos de calamar fritos con salsa de tomate especiada.', nameEn: 'Crispy Calamari', descEn: 'Fried calamari rings with spiced tomato sauce.' },
      { name: 'Pescado Seco de la Abuela', desc: 'Pescado curado, tostones dulces y salsa cítrica.', nameEn: "Grandma's Cured Fish", descEn: 'Cured fish, sweet tostones and citrus sauce.' },
      { name: 'Ajo y Hojas', desc: 'Lechugas mixtas, tomate cherry, pepino, aderezo de mostaza y camarones al ajillo.', nameEn: 'Garlic & Greens', descEn: 'Mixed lettuces, cherry tomato, cucumber, mustard dressing and garlic shrimp.' },
      { name: 'Caprese di Bufala', desc: 'Tomate, pesto casero, mozzarella de búfala, reducción de balsámico y rúgula.', descEn: 'Tomato, homemade pesto, buffalo mozzarella, balsamic reduction and arugula.' },
    ],
  },
  {
    id: 'parrilla', kicker: 'Fuego', title: 'A la parrilla',
    kickerEn: 'Fire', titleEn: 'From the grill',
    note: 'Cada corte incluye una guarnición a elegir.',
    noteEn: 'Each cut comes with a side of your choice.',
    dishes: [
      { name: 'Lomito', desc: 'A la parrilla, con salsa de queso.', nameEn: 'Tenderloin', descEn: 'Grilled, with cheese sauce.' },
      { name: 'New York', desc: 'A la parrilla, con hongos salteados.', nameEn: 'New York Strip', descEn: 'Grilled, with sautéed mushrooms.' },
      { name: 'Rib Eye', desc: 'A la parrilla, con chimichurri ahumado.', descEn: 'Grilled, with smoked chimichurri.' },
    ],
  },
  { id: 'mariscos', kicker: 'Mar', title: 'Mariscos', kickerEn: 'Sea', titleEn: 'Seafood', pending: true, dishes: pending(4) },
  { id: 'pastas', kicker: 'De la casa', title: 'Pastas y arroces', kickerEn: 'House', titleEn: 'Pastas and rice', pending: true, dishes: pending(3) },
  { id: 'hamburguesas', kicker: 'Para compartir', title: 'Hamburguesas', kickerEn: 'To share', titleEn: 'Burgers', pending: true, dishes: pending(2) },
  {
    id: 'ninos', kicker: 'Los pequeños', title: 'Menú de niños',
    kickerEn: 'For the little ones', titleEn: 'Kids menu',
    dishes: [
      { name: 'Dedos de Pescado', nameEn: 'Fish Fingers' },
      { name: 'Dedos de Pollo', nameEn: 'Chicken Fingers' },
      { name: 'Pasta con Mantequilla', nameEn: 'Butter Pasta' },
      { name: 'Pizza de Queso', nameEn: 'Cheese Pizza' },
    ],
  },
  {
    id: 'postres', kicker: 'Dulce final', title: 'Postres',
    kickerEn: 'Sweet finish', titleEn: 'Desserts',
    dishes: [
      { name: 'Olas de Vainilla', desc: 'Churros de vainilla.', nameEn: 'Vanilla Waves', descEn: 'Vanilla churros.' },
      { name: 'Crepas', desc: 'Con Nutella.', nameEn: 'Crêpes', descEn: 'With Nutella.' },
    ],
  },
  { id: 'cocteles', kicker: 'Barra', title: 'Coctelería y mocktails', kickerEn: 'Bar', titleEn: 'Cocktails and mocktails', pending: true, dishes: pending(3) },
];

// Solo se publican las categorías con contenido real; las `pending` esperan a T-20.
export const menu: Category[] = catalog.filter((c) => !c.pending);

export const formatPrice = (p?: number | null) =>
  p ? `₡${p.toLocaleString('es-CR')}` : '';
