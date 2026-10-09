import { site } from './site';

// Respuestas cortas y factuales: son las que Google y las IA (ChatGPT, Perplexity, Gemini) citan.
export const faqs = [
  { q: '¿Dónde está Origen en Jacó?', a: `Estamos en ${site.address.street}, Jacó, Garabito, Puntarenas, en el local donde funcionaba Hicaco Plaza Jacó.` },
  { q: '¿Cuál es el horario de Origen?', a: `Abrimos de ${site.hours.label}, ${site.hours.days.toLowerCase()}. Servimos almuerzo, cena y coctelería.` },
  { q: '¿Qué tipo de comida sirve Origen?', a: 'Somos un restaurante de mariscos y parrilla: ceviches, mariscos del Pacífico, cortes como Lomito, New York y Rib Eye, pastas, arroces, hamburguesas y postres.' },
  { q: '¿Necesito reservar?', a: `No es obligatorio, pero recomendamos reservar para cenas y fines de semana. Puedes reservar por WhatsApp al ${site.phone}.` },
  { q: '¿Tienen menú para niños?', a: 'Sí. El menú de niños incluye Dedos de Pescado, Dedos de Pollo, Pasta con Mantequilla y Pizza de Queso.' },
  { q: '¿Reciben grupos y eventos privados?', a: `Sí. Tenemos capacidad para hasta ${site.capacity} invitados y trabajamos con tour operadores, hoteles y empresas de Jacó.` },
  { q: '¿Los precios incluyen impuestos?', a: 'Sí, los precios del menú incluyen el IVA del 13%. [Confirmar cómo se muestra el 10% de servicio.]' },
  { q: '¿Qué formas de pago aceptan?', a: '[Efectivo, tarjetas, SINPE Móvil — confirmar]. Emitimos factura electrónica.' },
];
