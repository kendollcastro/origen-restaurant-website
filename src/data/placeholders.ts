// Detección de datos pendientes del cliente. Política: ocultar > inventar (docs/GLOSARIO.md §6).
const PLACEHOLDER_RE = /\[[^\]]*\]/;

export const isPlaceholder = (value?: string | null): boolean =>
  typeof value === 'string' && PLACEHOLDER_RE.test(value);

export const isReal = (value?: string | null): boolean =>
  typeof value === 'string' && value.trim() !== '' && !isPlaceholder(value);
