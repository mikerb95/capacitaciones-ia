/**
 * Normaliza un teléfono a `+dígitos`, que es el formato que espera WhatsApp.
 * El formulario muestra un `+` fijo, así que lo que llega debe traer el código
 * de país por delante. Devuelve null si no parece un número usable.
 */
export function normalizePhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, '');
  if (digits.length < 10 || digits.length > 15) return null;
  return `+${digits}`;
}

/**
 * Se muestra en E.164, sin agrupar: cada país parte el número distinto y sin
 * una librería de planes de numeración cualquier agrupación sale mal.
 */
export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  return `+${digits}`;
}

/** Enlace de chat directo, para el seguimiento posterior a la capacitación. */
export function whatsappHref(phone: string): string {
  return `https://wa.me/${phone.replace(/\D/g, '')}`;
}
