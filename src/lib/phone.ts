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

/** `+51987654321` se muestra como `+51 987 654 321`. */
export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 10) return phone;
  const country = digits.slice(0, digits.length - 9);
  const rest = digits.slice(-9);
  return `+${country} ${rest.slice(0, 3)} ${rest.slice(3, 6)} ${rest.slice(6)}`;
}

/** Enlace de chat directo, para el seguimiento posterior a la capacitación. */
export function whatsappHref(phone: string): string {
  return `https://wa.me/${phone.replace(/\D/g, '')}`;
}
