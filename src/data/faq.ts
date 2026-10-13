import { site } from './site';

// Respuestas cortas y factuales: son las que Google y las IA (ChatGPT, Perplexity, Gemini) citan.
// Bilingüe: `q`/`a` (ES) y `qEn`/`aEn` (EN, T-36). Las respuestas con datos pendientes ([corchetes])
// se excluyen igual en ambos idiomas (política §6).
export const faqs = [
  {
    q: '¿Dónde está Origen en Jacó?',
    a: `Estamos en ${site.address.street}, Jacó, Garabito, Puntarenas, en el local donde funcionaba Hicaco Plaza Jacó.`,
    qEn: 'Where is Origen in Jacó?',
    aEn: `We are at ${site.address.street}, Jacó, Garabito, Puntarenas — in the space where Hicaco Plaza Jacó used to be.`,
  },
  {
    q: '¿Cuál es el horario de Origen?',
    a: `Abrimos de ${site.hours.label}, ${site.hours.days.toLowerCase()}. Servimos almuerzo, cena y coctelería.`,
    qEn: "What are Origen's opening hours?",
    aEn: `We are open ${site.hours.label}, ${site.hours.daysEn.toLowerCase()}. We serve lunch, dinner and cocktails.`,
  },
  {
    q: '¿Qué tipo de comida sirve Origen?',
    a: 'Somos un restaurante de mariscos y parrilla: ceviches, mariscos del Pacífico, cortes como Lomito, New York y Rib Eye, pastas, arroces, hamburguesas y postres.',
    qEn: 'What kind of food does Origen serve?',
    aEn: 'We are a seafood and grill restaurant: ceviches, Pacific seafood, cuts such as Tenderloin, New York Strip and Rib Eye, pastas, rice dishes, burgers and desserts.',
  },
  {
    q: '¿Necesito reservar?',
    a: `No es obligatorio, pero recomendamos reservar para cenas y fines de semana. Puedes reservar por WhatsApp al ${site.phone}.`,
    qEn: 'Do I need a reservation?',
    aEn: `It is not required, but we recommend booking for dinners and weekends. You can book on WhatsApp at ${site.phone}.`,
  },
  {
    q: '¿Tienen menú para niños?',
    a: 'Sí. El menú de niños incluye Dedos de Pescado, Dedos de Pollo, Pasta con Mantequilla y Pizza de Queso.',
    qEn: 'Do you have a kids menu?',
    aEn: 'Yes. The kids menu includes Fish Fingers, Chicken Fingers, Butter Pasta and Cheese Pizza.',
  },
  {
    q: '¿Reciben grupos y eventos privados?',
    a: `Sí. Tenemos capacidad para hasta ${site.capacity} invitados y trabajamos con tour operadores, hoteles y empresas de Jacó.`,
    qEn: 'Do you host groups and private events?',
    aEn: `Yes. We can seat up to ${site.capacity} guests and work with tour operators, hotels and companies in Jacó.`,
  },
  {
    q: '¿Los precios incluyen impuestos?',
    a: 'Sí, los precios del menú incluyen el IVA del 13%. [Confirmar cómo se muestra el 10% de servicio.]',
    qEn: 'Are prices inclusive of tax?',
    aEn: 'Yes, menu prices include 13% VAT. [Confirm how the 10% service charge is shown.]',
  },
  {
    q: '¿Qué formas de pago aceptan?',
    a: '[Efectivo, tarjetas, SINPE Móvil — confirmar]. Emitimos factura electrónica.',
    qEn: 'What payment methods do you accept?',
    aEn: '[Cash, cards, SINPE Móvil — confirm]. We issue electronic invoices.',
  },
];
