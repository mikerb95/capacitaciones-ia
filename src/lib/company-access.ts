import { cache } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { and, eq } from 'drizzle-orm';
import { db } from '@/db';
import { companies } from '@/db/schema';

/**
 * Panel de la empresa. La cookie lleva la misma clave que se le entregó al
 * responsable: no hay usuarios ni contraseñas, y para cortar el acceso basta
 * con rotar la clave o apagar el panel desde el admin.
 */
export const COMPANY_COOKIE = 'academia-empresa';
export const COMPANY_MAX_AGE = 60 * 60 * 24 * 180; // medio año, la vida de un contrato

/** Sin 0/O ni 1/I: la clave se dicta por teléfono más de una vez. */
const ALPHABET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';

/** Clave del panel, en dos bloques de cinco: `K7M2P-9XQ4R`. */
export function generatePanelKey() {
  const bytes = crypto.getRandomValues(new Uint8Array(10));
  const chars = [...bytes].map((b) => ALPHABET[b % ALPHABET.length]);
  return `${chars.slice(0, 5).join('')}-${chars.slice(5).join('')}`;
}

/**
 * Forma canónica de lo que escriban: mayúsculas, sin espacios ni guiones de
 * más, y el guion en su sitio. Así da igual cómo la copien del correo.
 */
export function normalizePanelKey(value: string) {
  const clean = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
  return clean.length === 10 ? `${clean.slice(0, 5)}-${clean.slice(5)}` : clean;
}

/** Una clave libre, comprobada contra la base. */
export async function freePanelKey() {
  let key = generatePanelKey();
  while (await db.query.companies.findFirst({ where: eq(companies.panelKey, key) })) {
    key = generatePanelKey();
  }
  return key;
}

/**
 * Empresa de la sesión, verificada contra la base en cada render: si el panel
 * se apaga o la clave se rota, la cookie deja de valer al instante.
 */
export const getCompanySession = cache(async () => {
  const key = (await cookies()).get(COMPANY_COOKIE)?.value;
  if (!key) return null;

  const found = await db.query.companies.findFirst({
    where: and(eq(companies.panelKey, key), eq(companies.panelActive, true)),
    with: { contacts: { orderBy: (c, { asc }) => [asc(c.sortOrder), asc(c.id)] } },
  });

  return found ?? null;
});

export async function requireCompany() {
  const company = await getCompanySession();
  if (!company) redirect('/empresa');
  return company;
}

export type CompanySession = NonNullable<Awaited<ReturnType<typeof getCompanySession>>>;
