import { site } from './site';

// T-41 · Contenido citable por IA. 10 preguntas locales con respuestas autoconclusivas de ≤40
// palabras (límite verificado por tests). Cada respuesta se entiende sin contexto, usa solo datos
// confirmados (sin corchetes) y coincide 1:1 con el FAQPage JSON-LD y el texto visible.
// Bilingüe: `q`/`a` (ES) y `qEn`/`aEn` (EN, T-36). Pendientes (dirección exacta, formas de pago,
// porcentaje de servicio) quedan fuera hasta que el cliente los confirme (política §6).
export const faqs = [
  {
    q: '¿Dónde está Origen en Jacó?',
    a: `Origen está en Jacó, Garabito, Puntarenas, Costa Rica, a pocos minutos de la playa.`,
    qEn: 'Where is Origen in Jacó?',
    aEn: `Origen is in Jacó, Garabito, Puntarenas, Costa Rica, minutes from the beach.`,
  },
  {
    q: '¿Cuál es el horario de Origen?',
    a: `Abrimos todos los días, de 11:00 am a 10:00 pm. Servimos almuerzo, cena y cócteles sin interrupción.`,
    qEn: "What are Origen's opening hours?",
    aEn: `We are open every day from 11:00 am to 10:00 pm, serving lunch, dinner and cocktails all day.`,
  },
  {
    q: '¿Qué tipo de comida sirve Origen?',
    a: 'Somos un restaurante de mariscos y parrilla en Jacó: ceviches, mariscos del Pacífico, cortes como Lomito, New York y Rib Eye, pastas, arroces, hamburguesas y postres.',
    qEn: 'What kind of food does Origen serve?',
    aEn: 'We are a seafood and grill restaurant in Jacó: ceviches, Pacific seafood, cuts such as Tenderloin, New York Strip and Rib Eye, pastas, rice dishes, burgers and desserts.',
  },
  {
    q: '¿Origen es un restaurante nuevo?',
    a: 'Sí. Origen es un restaurante de mariscos y parrilla independiente y de autor, abierto en Jacó en octubre de 2026. Es un proyecto nuevo, sin relación con otros locales.',
    qEn: 'Is Origen a new restaurant?',
    aEn: 'Yes. Origen is an independent, chef-driven seafood and grill restaurant that opened in Jacó in October 2026. It is a new project, with no ties to other venues.',
  },
  {
    q: '¿Necesito reservar?',
    a: `No es obligatorio, pero recomendamos reservar para cenas y fines de semana. Puedes reservar por WhatsApp al ${site.phone}.`,
    qEn: 'Do I need a reservation?',
    aEn: `It is not required, but we recommend booking for dinners and weekends. You can book on WhatsApp at ${site.phone}.`,
  },
  {
    q: '¿Cómo reservo una mesa en Origen?',
    a: `Reserva por WhatsApp al ${site.phone}. Indícanos día, hora y número de personas y te confirmamos. Para grupos grandes o eventos, escríbenos y te cotizamos.`,
    qEn: 'How do I book a table at Origen?',
    aEn: `Book on WhatsApp at ${site.phone}. Tell us the day, time and number of guests and we will confirm. For large groups or events, message us for a quote.`,
  },
  {
    q: '¿Tienen menú para niños?',
    a: 'Sí. El menú de niños incluye dedos de pescado, dedos de pollo, pasta y pizza de jamón y hongos.',
    qEn: 'Do you have a kids menu?',
    aEn: 'Yes. The kids menu includes fish fingers, chicken fingers, pasta and ham & mushroom pizza.',
  },
  {
    q: '¿Reciben grupos y eventos privados?',
    a: `Sí. Tenemos capacidad para hasta ${site.capacity} invitados y trabajamos con tour operadores, hoteles y empresas de Jacó.`,
    qEn: 'Do you host groups and private events?',
    aEn: `Yes. We can seat up to ${site.capacity} guests and work with tour operators, hotels and companies in Jacó.`,
  },
  {
    q: '¿Los precios incluyen impuestos?',
    a: 'Sí, los precios del menú incluyen el IVA del 13%. No cobramos cargos ocultos.',
    qEn: 'Are prices inclusive of tax?',
    aEn: 'Yes, menu prices include the 13% Costa Rican VAT. There are no hidden charges.',
  },
  {
    q: '¿Tienen barra de cócteles?',
    a: 'Sí. La barra de Origen sirve coctelería de autor y mocktails sin alcohol para acompañar el almuerzo y la cena.',
    qEn: 'Do you have a cocktail bar?',
    aEn: 'Yes. The Origen bar serves signature cocktails and alcohol-free mocktails to go with lunch and dinner.',
  },
];
