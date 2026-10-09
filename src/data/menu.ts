// Menú de Origen. price: número en colones con IVA incluido (null = pendiente).
export type Dish = { name: string; desc?: string; price?: number | null };
export type Category = { id: string; kicker: string; title: string; note?: string; dishes: Dish[] };

const pending = (n: number): Dish[] =>
  Array.from({ length: n }, () => ({ name: '[Nombre del plato]', desc: '[Descripción por confirmar]' }));

export const menu: Category[] = [
  {
    id: 'entradas', kicker: 'Para empezar', title: 'Entradas',
    dishes: [
      { name: 'Ceviche Diablo', desc: 'Pescado blanco, piña a la parrilla, maíz rostizado, cebolla, ají y chips dulces.' },
      { name: 'Perlas del Pacífico', desc: 'Camarón, pescado, pulpo y mejillones en salsa coctel, con patacones.' },
      { name: 'Dúo de Carpaccio del Mar', desc: 'Corvina y salmón marinados, alioli de alcaparras, melba casera y rúgula.' },
      { name: 'Crema de Langosta', desc: 'Servida en bowl de pan, con hierbas y carne de langosta.' },
      { name: 'Camarones Piedra', desc: 'Camarones crujientes con salsa agridulce picante.' },
      { name: 'Calamares Crocantes', desc: 'Anillos de calamar fritos con salsa de tomate especiada.' },
      { name: 'Pescado Seco de la Abuela', desc: 'Pescado curado, tostones dulces y salsa cítrica.' },
      { name: 'Ajo y Hojas', desc: 'Lechugas mixtas, tomate cherry, pepino, aderezo de mostaza y camarones al ajillo.' },
      { name: 'Caprese di Bufala', desc: 'Tomate, pesto casero, mozzarella de búfala, reducción de balsámico y rúgula.' },
    ],
  },
  {
    id: 'parrilla', kicker: 'Fuego', title: 'A la parrilla',
    note: 'Cada corte incluye una guarnición a elegir.',
    dishes: [
      { name: 'Lomito', desc: 'A la parrilla, con salsa de queso.' },
      { name: 'New York', desc: 'A la parrilla, con hongos salteados.' },
      { name: 'Rib Eye', desc: 'A la parrilla, con chimichurri ahumado.' },
    ],
  },
  { id: 'mariscos', kicker: 'Mar', title: 'Mariscos', dishes: pending(4) },
  { id: 'pastas', kicker: 'De la casa', title: 'Pastas y arroces', dishes: pending(3) },
  { id: 'hamburguesas', kicker: 'Para compartir', title: 'Hamburguesas', dishes: pending(2) },
  {
    id: 'ninos', kicker: 'Los pequeños', title: 'Menú de niños',
    dishes: [
      { name: 'Dedos de Pescado' },
      { name: 'Dedos de Pollo' },
      { name: 'Pasta con Mantequilla' },
      { name: 'Pizza de Queso' },
    ],
  },
  {
    id: 'postres', kicker: 'Dulce final', title: 'Postres',
    dishes: [
      { name: 'Olas de Vainilla', desc: 'Churros de vainilla.' },
      { name: 'Crepas', desc: 'Con Nutella.' },
    ],
  },
  { id: 'cocteles', kicker: 'Barra', title: 'Coctelería y mocktails', dishes: pending(3) },
];

export const formatPrice = (p?: number | null) =>
  p ? `₡${p.toLocaleString('es-CR')}` : '[₡ precio]';
