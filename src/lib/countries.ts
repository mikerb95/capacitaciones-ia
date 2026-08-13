export type Country = {
  /** ISO 3166-1 alfa-2, que además genera la bandera. */
  code: string;
  name: string;
  /** Indicativo, sin el `+`. */
  dial: string;
  /** Largos válidos del número nacional, sin indicativo. */
  lengths: number[];
};

/**
 * La bandera sale del código ISO: cada letra se mapea a su indicador regional.
 * En Windows no hay glifos de bandera y se ve el par de letras, que igual
 * identifica al país.
 */
export function flagOf(code: string): string {
  return String.fromCodePoint(...[...code.toUpperCase()].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65));
}

/** Países de la región más los que aparecen seguido en las capacitaciones. */
export const COUNTRIES: Country[] = [
  { code: 'AR', name: 'Argentina', dial: '54', lengths: [10] },
  { code: 'BO', name: 'Bolivia', dial: '591', lengths: [8] },
  { code: 'BR', name: 'Brasil', dial: '55', lengths: [10, 11] },
  { code: 'CA', name: 'Canadá', dial: '1', lengths: [10] },
  { code: 'CL', name: 'Chile', dial: '56', lengths: [9] },
  { code: 'CO', name: 'Colombia', dial: '57', lengths: [10] },
  { code: 'CR', name: 'Costa Rica', dial: '506', lengths: [8] },
  { code: 'CU', name: 'Cuba', dial: '53', lengths: [8] },
  { code: 'EC', name: 'Ecuador', dial: '593', lengths: [9] },
  { code: 'SV', name: 'El Salvador', dial: '503', lengths: [8] },
  { code: 'ES', name: 'España', dial: '34', lengths: [9] },
  { code: 'US', name: 'Estados Unidos', dial: '1', lengths: [10] },
  { code: 'GT', name: 'Guatemala', dial: '502', lengths: [8] },
  { code: 'HN', name: 'Honduras', dial: '504', lengths: [8] },
  { code: 'MX', name: 'México', dial: '52', lengths: [10] },
  { code: 'NI', name: 'Nicaragua', dial: '505', lengths: [8] },
  { code: 'PA', name: 'Panamá', dial: '507', lengths: [8] },
  { code: 'PY', name: 'Paraguay', dial: '595', lengths: [9] },
  { code: 'PE', name: 'Perú', dial: '51', lengths: [9] },
  { code: 'PR', name: 'Puerto Rico', dial: '1', lengths: [10] },
  { code: 'DO', name: 'República Dominicana', dial: '1', lengths: [10] },
  { code: 'UY', name: 'Uruguay', dial: '598', lengths: [8, 9] },
  { code: 'VE', name: 'Venezuela', dial: '58', lengths: [10] },
];

export const DEFAULT_COUNTRY = 'CO';

export function findCountry(code: string): Country | undefined {
  return COUNTRIES.find((c) => c.code === code);
}
