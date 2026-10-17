// Menú de Origen. price: número en colones con IVA incluido (null = pendiente).
// Texto bilingüe: `name`/`desc` (ES) y `nameEn`/`descEn` (EN, T-36). Los nombres propios
// de plato se mantienen cuando son marca; el resto se traduce para el lector en inglés.
// Fuente de precios: menú oficial impreso (docs/PRECIOS-MENU.md).
export type Dish = {
  name: string;
  desc?: string;
  price?: number | null;
  nameEn?: string;
  descEn?: string;
  /** Subencabezado dentro de una categoría (p. ej. tipos de cóctel). */
  group?: string;
  groupEn?: string;
};
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

const catalog: Category[] = [
  {
    id: 'entradas', kicker: 'Para empezar', title: 'Entradas',
    kickerEn: 'To start', titleEn: 'Starters',
    dishes: [
      { name: 'Ceviche Diablo', desc: 'Pescado blanco, piña a la parrilla, maíz rostizado, cebolla, ají y chips dulces.', price: 7200, descEn: 'White fish, grilled pineapple, roasted corn, onion, chili and sweet plantain chips.' },
      { name: 'Perlas del Pacífico', desc: 'Camarón, pescado, pulpo y mejillones en salsa coctel, con patacones.', price: 12995, nameEn: 'Pacific Pearls', descEn: 'Shrimp, fish, octopus and mussels in cocktail sauce, with patacones.' },
      { name: 'Dúo de Carpaccio del Mar', desc: 'Corvina y salmón marinados, alioli de alcaparras, melba casera y rúgula.', price: 8495, nameEn: 'Sea Carpaccio Duo', descEn: 'Marinated sea bass and salmon, caper aioli, homemade melba toast and arugula.' },
      { name: 'Crema de Langosta', desc: 'Servida en bowl de pan, con hierbas y carne de langosta.', price: 9600, nameEn: 'Lobster Bisque', descEn: 'Served in a bread bowl, with herbs and lobster meat.' },
      { name: 'Camarones Piedra', desc: 'Camarones crujientes con salsa agridulce picante.', price: 5950, nameEn: 'Sizzling Shrimp', descEn: 'Crispy shrimp with a spicy sweet-and-sour sauce.' },
      { name: 'Calamares Crocantes', desc: 'Anillos de calamar fritos con salsa de tomate especiada.', price: 5950, nameEn: 'Crispy Calamari', descEn: 'Fried calamari rings with spiced tomato sauce.' },
      { name: 'Ajo y Hojas', desc: 'Lechugas mixtas, tomate cherry, pepino, aderezo de mostaza y camarones al ajillo.', price: 6000, nameEn: 'Garlic & Greens', descEn: 'Mixed lettuces, cherry tomato, cucumber, mustard dressing and garlic shrimp.' },
      { name: 'Caprese di Bufala', desc: 'Tomate, pesto casero, mozzarella de búfala, reducción de balsámico y rúgula.', price: 6995, descEn: 'Tomato, homemade pesto, buffalo mozzarella, balsamic reduction and arugula.' },
    ],
  },
  {
    id: 'parrilla', kicker: 'Fuego', title: 'A la parrilla',
    kickerEn: 'Fire', titleEn: 'From the grill',
    note: 'Cada corte incluye una guarnición a elegir. Opciones: arroz blanco, papas fritas, vegetales grillados o ensalada.',
    noteEn: 'Each cut comes with a side of your choice. Options: white rice, french fries, grilled vegetables or salad.',
    dishes: [
      { name: 'Lomito con salsa de queso', price: 17995, nameEn: 'Tenderloin with cheese sauce' },
      { name: 'New York con hongos salteados', price: 25000, nameEn: 'New York Strip with sautéed mushrooms' },
      { name: 'Rib Eye con chimichurri ahumado', price: 33600, nameEn: 'Rib Eye with smoked chimichurri' },
      { name: 'Langosta entera con mantequilla cajún', price: 38995, nameEn: 'Whole Lobster with Cajun butter' },
      { name: 'Pulpo a la Parrilla', price: 15995, nameEn: 'Grilled Octopus' },
    ],
  },
  {
    id: 'acompanantes', kicker: 'Junto al fuego', title: 'Acompañamientos de parrilla',
    kickerEn: 'Alongside', titleEn: 'Grill sides',
    dishes: [
      { name: 'Espárragos con queso', price: 7500, nameEn: 'Asparagus with cheese' },
      { name: 'Arroz verde cremoso con espinaca', price: 2895, nameEn: 'Creamy spinach green rice' },
      { name: 'Puré gratinado', price: 3995, nameEn: 'Au gratin mashed potatoes' },
      { name: 'Ensalada verde', price: 2995, nameEn: 'Green salad' },
      { name: 'Brócoli en mantequilla', price: 3500, nameEn: 'Broccoli in butter' },
      { name: 'Vegetales Mixtos', price: 3500, nameEn: 'Mixed vegetables' },
    ],
  },
  {
    id: 'mariscos', kicker: 'Mar', title: 'Mariscos',
    kickerEn: 'Sea', titleEn: 'Seafood',
    dishes: [
      { name: 'Corvina del Pescador', desc: 'Corvina entera sin espinas al horno, con arroz jazmín y vegetal grillado.', price: 13900, nameEn: "Fisherman's Sea Bass", descEn: 'Whole boneless sea bass baked, with jasmine rice and grilled vegetables.' },
      { name: 'Reina del Mar', desc: 'Filete de corvina con camarones en salsa de coco y piña, con puré y vegetal salteado.', price: 11500, nameEn: 'Queen of the Sea', descEn: 'Sea bass fillet with shrimp in coconut-pineapple sauce, with mashed potatoes and sautéed vegetables.' },
      { name: 'Nórdico Passion', desc: 'Salmón noruego a la parrilla en salsa de maracuyá, con vegetales a la parrilla y puré.', price: 10450, nameEn: 'Nordic Passion', descEn: 'Grilled Norwegian salmon in passion fruit sauce, with grilled vegetables and mashed potatoes.' },
      { name: 'Trilogía Marina', desc: 'Corvina, camarones grandes y langosta en mantequilla de limón, con arroz jazmín y vegetales.', price: 26500, nameEn: 'Marine Trilogy', descEn: 'Sea bass, large shrimp and lobster in lemon butter, with jasmine rice and vegetables.' },
      { name: 'Camarón en Mantequilla Ahumada', desc: 'Camarones grandes con cabeza al vapor en mantequilla y ajo, con patacones y arroz.', price: 11495, nameEn: 'Shrimp in Smoked Butter', descEn: 'Large head-on shrimp steamed in butter and garlic, with patacones and rice.' },
      { name: 'El Desmadre de Jacó (para compartir)', desc: 'Camarones, calamar, pulpo, almejas, mejillón, navaja y jaiba en mantequilla y ajo levemente picante, con arroz y patacones.', price: 54000, nameEn: 'The Jacó Mess (to share)', descEn: 'Shrimp, calamari, octopus, clams, mussels, razor clams and crab in lightly spicy butter and garlic, with rice and patacones.' },
      { name: 'Pargo Entero Frito', desc: 'Con patacones y ensalada.', price: 16995, nameEn: 'Whole Fried Snapper', descEn: 'With patacones and salad.' },
    ],
  },
  {
    id: 'pastas', kicker: 'De la casa', title: 'Pastas y arroces',
    kickerEn: 'House', titleEn: 'Pastas and rice',
    dishes: [
      { name: 'Pasta de Mariscos al Vongole', desc: 'Mariscos en mantequilla con chile, perejil, limón y parmesano sobre fettuccine.', price: 12000, nameEn: 'Seafood Vongole Pasta', descEn: 'Seafood in butter with chili, parsley, lemon and parmesan over fettuccine.' },
      { name: "Pollo Croccante all'Aurora", desc: 'Pollo empanizado sobre pasta en salsa aurora (tomate y bechamel).', price: 9995, nameEn: "Crispy Chicken all'Aurora", descEn: 'Breaded chicken over pasta in aurora sauce (tomato and béchamel).' },
      { name: 'Azul Terciopelo (Velvet Blue)', desc: 'Lomito salteado con cebolla, ajo y albahaca sobre fettuccine en salsa de queso azul.', price: 16995, nameEn: 'Velvet Blue', descEn: 'Sautéed tenderloin with onion, garlic and basil over fettuccine in blue cheese sauce.' },
      { name: 'Coco y Tinta', desc: 'Arroz negro con tinta de calamar y camarones salteados con chile, cebolla, ajo y culantro, con ensalada verde.', price: 9250, nameEn: 'Coconut & Ink', descEn: 'Black squid-ink rice with shrimp sautéed with chili, onion, garlic and cilantro, with green salad.' },
      { name: 'Ébano de Mar', desc: 'Mariscos en mantequilla y ajo sobre arroz jugoso, con ensalada de la casa.', price: 12000, nameEn: 'Ebony Sea', descEn: 'Seafood in butter and garlic over juicy rice, with house salad.' },
    ],
  },
  {
    id: 'hamburguesas', kicker: 'Para compartir', title: 'Hamburguesas',
    kickerEn: 'To share', titleEn: 'Burgers',
    dishes: [
      { name: 'Smash 3Q', desc: 'Pan brioche casero, cebollitas dulces, tocino crocante, salsa de tres quesos, lechuga y tomate.', price: 14450, descEn: 'Homemade brioche bun, sweet onions, crispy bacon, three-cheese sauce, lettuce and tomato.' },
      { name: 'Costa de la Langosta', desc: 'Torta de carne de langosta con aguacate, cebolla encurtida, salsa dulce picante y pan brioche.', price: 15000, nameEn: 'Lobster Coast', descEn: 'Lobster meat patty with avocado, pickled onion, sweet spicy sauce and brioche bun.' },
      { name: 'Pollo Caprese', desc: 'Pechuga empanizada a la parrilla, albahaca, tomate grillado, mozzarella y pesto.', price: 10250, nameEn: 'Caprese Chicken', descEn: 'Breaded grilled chicken breast, basil, grilled tomato, mozzarella and pesto.' },
    ],
  },
  {
    id: 'almuerzos', kicker: 'Mediodía', title: 'Almuerzos',
    kickerEn: 'Midday', titleEn: 'Lunches',
    dishes: [
      { name: 'Tacos de Lomito', desc: 'Tres tacos de lomo con rúgula, tomate, cebolla, marañón y salsa de queso azul.', price: 13400, nameEn: 'Tenderloin Tacos', descEn: 'Three tenderloin tacos with arugula, tomato, onion, cashew and blue cheese sauce.' },
      { name: 'Tacos de Pollo', desc: 'Tres tacos de pollo especiado con mozzarella, lechuga, aguacate y aderezo de ajo negro.', price: 5995, nameEn: 'Chicken Tacos', descEn: 'Three spiced chicken tacos with mozzarella, lettuce, avocado and black garlic dressing.' },
      { name: 'Tacos de Camarón', desc: 'Tres tacos de camarón crujiente con coleslaw y sweet chili de la casa.', price: 7995, nameEn: 'Shrimp Tacos', descEn: 'Three crispy shrimp tacos with coleslaw and house sweet chili.' },
      { name: 'Pollo con Hueso (para 2)', desc: 'Pollo entero marinado en ajo, limón y especias, con arroz, elote y ensalada.', price: 17995, nameEn: 'Bone-in Chicken (for 2)', descEn: 'Whole chicken marinated in garlic, lemon and spices, with rice, corn and salad.' },
      { name: 'Ceviche', desc: 'Pescado blanco en limón con cebolla morada, chile dulce y culantro, con aguacate y patacones.', price: 7100, descEn: 'White fish in lemon with red onion, sweet chili and cilantro, with avocado and patacones.' },
      { name: 'Arroz con Camarón', desc: 'Arroz con achiote y camarones al ajo con chile dulce y culantro, con ensalada.', price: 7995, nameEn: 'Rice with Shrimp', descEn: 'Achiote rice with garlic shrimp, sweet chili and cilantro, with salad.' },
      { name: 'Bowl Típico con pollo', desc: 'Arroz, frijoles, plátano maduro, picadillo de chayote y ensalada.', price: 7500, nameEn: 'Typical Bowl with chicken', descEn: 'Rice, beans, sweet plantain, chayote picadillo and salad.' },
      { name: 'Bowl Típico con lomito', price: 9000, nameEn: 'Typical Bowl with tenderloin' },
      { name: 'Bowl Típico con pescado', price: 6995, nameEn: 'Typical Bowl with fish' },
      { name: 'Patacones con pico de gallo y guacamole', price: 4500, nameEn: 'Patacones with pico de gallo and guacamole' },
      { name: 'Patacones con pollo', price: 7000, nameEn: 'Patacones with chicken' },
      { name: 'Patacones con camarón', price: 9000, nameEn: 'Patacones with shrimp' },
      { name: 'Patacones con lomito', price: 9000, nameEn: 'Patacones with tenderloin' },
    ],
  },
  {
    id: 'ninos', kicker: 'Los pequeños', title: 'Menú de niños',
    kickerEn: 'For the little ones', titleEn: 'Kids menu',
    dishes: [
      { name: 'Dedos de Pescado', price: 6495, nameEn: 'Fish Fingers' },
      { name: 'Dedos de Pollo', price: 6000, nameEn: 'Chicken Fingers' },
      { name: 'Pasta', desc: 'Espagueti con salsa blanca, tomate o mantequilla.', price: 3700, descEn: 'Spaghetti with white sauce, tomato or butter.' },
      { name: 'Pizza de Jamón y Hongos', price: 4500, nameEn: 'Ham & Mushroom Pizza' },
    ],
  },
  {
    id: 'postres', kicker: 'Dulce final', title: 'Postres',
    kickerEn: 'Sweet finish', titleEn: 'Desserts',
    dishes: [
      { name: 'Olas de Vainilla', desc: 'Churros de vainilla.', price: 4495, nameEn: 'Vanilla Waves', descEn: 'Vanilla churros.' },
      { name: 'Crepas', desc: 'Con Nutella.', price: 4700, nameEn: 'Crêpes', descEn: 'With Nutella.' },
      { name: 'Helado Frito', price: 5500, nameEn: 'Fried Ice Cream' },
      { name: 'Mousse de Maracuyá y Chocolate Blanco', price: 6000, nameEn: 'Passion Fruit & White Chocolate Mousse' },
    ],
  },
  {
    id: 'cocteles', kicker: 'Barra', title: 'Coctelería y mocktails',
    kickerEn: 'Bar', titleEn: 'Cocktails and mocktails',
    note: 'También tenemos mocktails: pregunta por nuestras bebidas sin licor.',
    noteEn: 'We also have mocktails: ask about our non-alcoholic drinks.',
    dishes: [
      { name: 'Jacó Spicy Sunset', group: 'Cócteles Origen', groupEn: 'Origen Cocktails', price: 5200 },
      { name: 'Blue Sea', group: 'Cócteles Origen', groupEn: 'Origen Cocktails', price: 5200 },
      { name: 'Coco Blanco', group: 'Cócteles Origen', groupEn: 'Origen Cocktails', price: 5200, nameEn: 'White Coconut' },
      { name: 'Origen Dragón', group: 'Cócteles Origen', groupEn: 'Origen Cocktails', price: 5200, nameEn: 'Origen Dragon' },
      { name: 'Paloma Roja', group: 'Cócteles Origen', groupEn: 'Origen Cocktails', price: 5200, nameEn: 'Red Paloma' },
      { name: 'Passion Fruit Tico', group: 'Cócteles Origen', groupEn: 'Origen Cocktails', price: 5200 },
      { name: 'Cantaritos', group: 'Cócteles Especiales', groupEn: 'Special Cocktails', price: 6600 },
      { name: 'Moscow Mule', group: 'Cócteles Especiales', groupEn: 'Special Cocktails', price: 6600 },
      { name: 'Aperol Spritz', group: 'Cócteles Especiales', groupEn: 'Special Cocktails', price: 6600 },
      { name: 'Mai Tai', group: 'Cócteles Especiales', groupEn: 'Special Cocktails', price: 6600 },
      { name: 'Sex on the Beach', group: 'Cócteles Especiales', groupEn: 'Special Cocktails', price: 6600 },
      { name: 'Painkiller', group: 'Cócteles Especiales', groupEn: 'Special Cocktails', price: 6600 },
      { name: 'Margarita tradicional', group: 'Cócteles Especiales', groupEn: 'Special Cocktails', price: 6600, nameEn: 'Margarita' },
      { name: 'Old Fashioned', group: 'Cócteles Especiales', groupEn: 'Special Cocktails', price: 6600 },
      { name: 'Sangría Tinta Mike', group: 'Cócteles Especiales', groupEn: 'Special Cocktails', price: 4500 },
      { name: 'Sangría de maracuyá', group: 'Cócteles Especiales', groupEn: 'Special Cocktails', price: 4500, nameEn: 'Passion Fruit Sangria' },
      { name: 'Piña colada', group: 'Cócteles Tradicionales', groupEn: 'Classic Cocktails', price: 4600, nameEn: 'Piña Colada' },
      { name: 'Daiquirí', group: 'Cócteles Tradicionales', groupEn: 'Classic Cocktails', price: 4600 },
      { name: 'Mojito clásico', group: 'Cócteles Tradicionales', groupEn: 'Classic Cocktails', price: 4600, nameEn: 'Classic Mojito' },
      { name: 'Gin tonic', group: 'Cócteles Tradicionales', groupEn: 'Classic Cocktails', price: 4600, nameEn: 'Gin & Tonic' },
      { name: 'Guaro sour', group: 'Cócteles Tradicionales', groupEn: 'Classic Cocktails', price: 4600 },
      { name: 'Caipiriña', group: 'Cócteles Tradicionales', groupEn: 'Classic Cocktails', price: 4600, nameEn: 'Caipirinha' },
      { name: 'Bloody Mary', group: 'Cócteles Tradicionales', groupEn: 'Classic Cocktails', price: 4600 },
    ],
  },
];

// Se publica el catálogo con contenido real; `pending` queda para futuras categorías.
export const menu: Category[] = catalog.filter((c) => !c.pending);

export const formatPrice = (p?: number | null) =>
  p ? `₡${p.toLocaleString('es-CR')}` : '';
