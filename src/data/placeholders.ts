// Detección de datos pendientes del cliente. Política: ocultar > inventar (docs/GLOSARIO.md §6).
const PLACEHOLDER_RE = /\[[^\]]*\]/;

export const isPlaceholder = (value?: string | null): boolean =>
  typeof value === 'string' && PLACEHOLDER_RE.test(value);

export const isReal = (value?: string | null): boolean =>
  typeof value === 'string' && value.trim() !== '' && !isPlaceholder(value);

// El teléfono pendiente usa ceros de relleno ('+506 0000 0000'): es placeholder aunque no
// lleve corchetes, así que no es una fuente válida para texto visible ni JSON-LD (T-40).
export const isRealPhone = (phone?: string | null): boolean =>
  isReal(phone) && !/0{4}/.test(phone as string);
