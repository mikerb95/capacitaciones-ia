import { findCountry, flagOf, COUNTRIES } from './countries';

/**
 * Junta el país elegido con el número nacional y devuelve un E.164, que es lo
 * que espera WhatsApp. Null si el largo no corresponde a ese país.
 */
export function composePhone(countryCode: string, raw: string): string | null {
  const country = findCountry(countryCode);
  if (!country) return null;

  const digits = raw.replace(/\D/g, '');
  if (!country.lengths.includes(digits.length)) return null;

  return `+${country.dial}${digits}`;
}

/** Cuántos dígitos pedir, para el mensaje de error y el maxLength del campo. */
export function expectedDigits(countryCode: string): string {
  const country = findCountry(countryCode);
  if (!country) return '';
  const [min, max] = [Math.min(...country.lengths), Math.max(...country.lengths)];
  return min === max ? `${min}` : `${min} o ${max}`;
}

/**
 * Para mostrar: bandera del país e indicativo separado del número nacional.
 * Se resuelve por el indicativo más largo que calce, así +1 no se come a +593.
 */
export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');

  const matches = [...COUNTRIES]
    .sort((a, b) => b.dial.length - a.dial.length)
    .filter((c) => digits.startsWith(c.dial) && c.lengths.includes(digits.length - c.dial.length));

  const [match] = matches;
  if (!match) return `+${digits}`;

  // Varios países comparten indicativo (+1): sin bandera antes que una errada.
  const flag = matches.length > 1 ? '' : `${flagOf(match.code)} `;

  return `${flag}+${match.dial} ${digits.slice(match.dial.length)}`;
}

/** Enlace de chat directo, para el seguimiento posterior a la capacitación. */
export function whatsappHref(phone: string): string {
  return `https://wa.me/${phone.replace(/\D/g, '')}`;
}
