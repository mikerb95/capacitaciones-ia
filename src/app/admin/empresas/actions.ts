'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import {
  accessCodes,
  COMPANY_KINDS,
  companies,
  companyContacts,
  type CompanyKind,
} from '@/db/schema';
import { freePanelKey } from '@/lib/company-access';

const str = (data: FormData, key: string) => ((data.get(key) as string | null) ?? '').trim();
const orNull = (value: string) => (value.length ? value : null);

/** Fecha de un `<input type="date">`: mediodía local, para que no se corra un día. */
function dateOrNull(value: string) {
  if (!value) return null;
  const parsed = new Date(`${value}T12:00:00`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function intOrNull(value: string) {
  const n = Number(value);
  return value && Number.isInteger(n) && n > 0 ? n : null;
}

export type CompanyState = {
  error?: string;
  field?: 'name' | 'contacts' | 'contract' | 'logo' | 'materials';
};

/** Lo que cabe en un logo. Un logo de marca no llega ni de lejos a esto. */
const LOGO_MAX = 512 * 1024;

const LOGO_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'];

/**
 * El logo del cliente, listo para guardar como `data:` URI.
 *
 * Tres caminos: la casilla de quitar lo borra, un archivo nuevo lo reemplaza,
 * y un formulario enviado sin tocar el campo deja el que ya estaba. Ese último
 * caso es el normal al editar cualquier otro dato de la empresa, así que no
 * puede perder el logo.
 */
async function logoOf(
  formData: FormData,
  current: string | null,
): Promise<{ ok: true; value: string | null } | { ok: false; state: CompanyState }> {
  if (formData.get('logoRemove')) return { ok: true, value: null };

  const file = formData.get('logo');
  if (!(file instanceof File) || file.size === 0) return { ok: true, value: current };

  if (!LOGO_TYPES.includes(file.type)) {
    return {
      ok: false,
      state: { error: 'El logo debe ser PNG, JPG, WEBP o SVG.', field: 'logo' },
    };
  }

  if (file.size > LOGO_MAX) {
    return {
      ok: false,
      state: { error: 'El logo pesa más de 512 KB. Manda una versión más liviana.', field: 'logo' },
    };
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  return { ok: true, value: `data:${file.type};base64,${bytes.toString('base64')}` };
}

export type CompanyAction = (prev: CompanyState, formData: FormData) => Promise<CompanyState>;

const emailLooksWrong = (value: string | null) => Boolean(value) && !/^\S+@\S+\.\S+$/.test(value!);

/** El tipo llega de unos botones nuestros, pero se comprueba igual. */
function kindOf(formData: FormData): CompanyKind {
  const value = str(formData, 'kind');
  return (COMPANY_KINDS as readonly string[]).includes(value)
    ? (value as CompanyKind)
    : 'cliente';
}

function profileOf(formData: FormData) {
  return {
    name: str(formData, 'name'),
    industry: orNull(str(formData, 'industry')),
    kind: kindOf(formData),
    contractRef: orNull(str(formData, 'contractRef')),
    contractStart: dateOrNull(str(formData, 'contractStart')),
    contractEnd: dateOrNull(str(formData, 'contractEnd')),
    contractSessions: intOrNull(str(formData, 'contractSessions')),
    contractNotes: orNull(str(formData, 'contractNotes')),
    materialsUntil: dateOrNull(str(formData, 'materialsUntil')),
    notes: orNull(str(formData, 'notes')),
  };
}

/**
 * Responsables de la empresa. Llegan como columnas paralelas del formulario y
 * se emparejan por posición; las filas sin nombre se descartan, que es lo que
 * deja el repetidor cuando se agrega una fila y no se llena.
 */
function contactsOf(formData: FormData) {
  const names = formData.getAll('contactName').map(String);
  const roles = formData.getAll('contactRole').map(String);
  const emails = formData.getAll('contactEmail').map(String);
  const phones = formData.getAll('contactPhone').map(String);

  return names
    .map((name, i) => ({
      name: name.trim(),
      role: orNull((roles[i] ?? '').trim()),
      email: orNull((emails[i] ?? '').trim()),
      phone: orNull((phones[i] ?? '').trim()),
      sortOrder: i,
    }))
    .filter((c) => c.name.length > 0);
}

async function replaceContacts(companyId: number, contacts: ReturnType<typeof contactsOf>) {
  await db.delete(companyContacts).where(eq(companyContacts.companyId, companyId));
  if (!contacts.length) return;

  await db.insert(companyContacts).values(contacts.map((c) => ({ companyId, ...c })));
}

function validate(profile: ReturnType<typeof profileOf>, contacts: ReturnType<typeof contactsOf>) {
  if (!profile.name) return { error: 'La empresa necesita un nombre.', field: 'name' as const };

  const bad = contacts.find((c) => emailLooksWrong(c.email));
  if (bad) return { error: `Revisa el correo de ${bad.name}.`, field: 'contacts' as const };

  if (profile.contractStart && profile.contractEnd && profile.contractEnd < profile.contractStart) {
    return { error: 'El contrato termina antes de empezar.', field: 'contract' as const };
  }

  // Una fecha ya pasada deja el material a medida invisible desde el primer
  // día, que casi siempre es un dedazo en el año y no una decisión.
  if (profile.materialsUntil && profile.materialsUntil < new Date()) {
    return {
      error: 'La fecha del material a medida ya pasó: nadie llegaría a descargarlo.',
      field: 'materials' as const,
    };
  }

  return null;
}

export async function createCompany(
  _prev: CompanyState,
  formData: FormData,
): Promise<CompanyState> {
  const profile = profileOf(formData);
  const contacts = contactsOf(formData);

  const invalid = validate(profile, contacts);
  if (invalid) return invalid;

  const logo = await logoOf(formData, null);
  if (!logo.ok) return logo.state;

  const [created] = await db
    .insert(companies)
    .values({
      ...profile,
      logo: logo.value,
      panelKey: await freePanelKey(),
      updatedAt: new Date(),
    })
    .returning({ id: companies.id });

  await replaceContacts(created.id, contacts);

  revalidatePath('/admin/empresas');
  redirect(`/admin/empresas/${created.id}?creada=1`);
}

export async function updateCompany(
  _prev: CompanyState,
  formData: FormData,
): Promise<CompanyState> {
  const id = Number(str(formData, 'id'));
  if (!id) return { error: 'No encuentro esa empresa.' };

  const profile = profileOf(formData);
  const contacts = contactsOf(formData);

  const invalid = validate(profile, contacts);
  if (invalid) return invalid;

  const [existing] = await db
    .select({ logo: companies.logo })
    .from(companies)
    .where(eq(companies.id, id));

  const logo = await logoOf(formData, existing?.logo ?? null);
  if (!logo.ok) return logo.state;

  await db
    .update(companies)
    .set({ ...profile, logo: logo.value, updatedAt: new Date() })
    .where(eq(companies.id, id));

  await replaceContacts(id, contacts);

  revalidatePath('/admin/empresas');
  revalidatePath(`/admin/empresas/${id}`);
  redirect(`/admin/empresas/${id}?guardada=1`);
}

/**
 * Borrar la empresa no borra sus capacitaciones: los códigos quedan sueltos,
 * con su gente intacta, solo que ya no cuelgan de ningún contrato.
 */
export async function deleteCompany(formData: FormData) {
  const id = Number(str(formData, 'id'));
  if (!id) return;

  await db.delete(companies).where(eq(companies.id, id));

  revalidatePath('/admin/empresas');
  revalidatePath('/admin/accesos');
  redirect('/admin/empresas');
}

/**
 * Saca una capacitación de la ficha de la empresa sin borrarla: el código, sus
 * asistentes y sus preguntas quedan donde estaban, solo dejan de colgar de
 * este contrato y la capacitación desaparece del panel de la empresa.
 *
 * Hay dos formas de colgar, y cada una se desengancha distinto. Si la empresa
 * era la capacitadora, se suelta solo esa punta: la capacitación sigue siendo
 * de su destinataria, ahora como trabajo directo. Si era la destinataria, no
 * queda nadie que reciba, y una capacitación sin destinataria no puede seguir
 * marcada como dictada bajo contrato: vuelve a ser una capacitación propia,
 * que es lo mismo que quedaría si se hubiera creado sin empresa.
 */
export async function detachCompanyCode(formData: FormData) {
  const companyId = Number(str(formData, 'companyId'));
  const codeId = Number(str(formData, 'codeId'));
  if (!companyId || !codeId) return;

  const code = await db.query.accessCodes.findFirst({ where: eq(accessCodes.id, codeId) });
  if (!code) return;

  const wasContractor = code.contractorId === companyId;
  const wasCompany = code.companyId === companyId;
  // El formulario dice de qué ficha viene, pero la relación se comprueba aquí.
  if (!wasContractor && !wasCompany) return;

  const changes = wasCompany
    ? { companyId: null, contractorId: null, contracted: false }
    : { contractorId: null };

  await db
    .update(accessCodes)
    .set({ ...changes, updatedAt: new Date() })
    .where(eq(accessCodes.id, codeId));

  revalidatePath('/admin/empresas');
  revalidatePath(`/admin/empresas/${companyId}`);
  if (wasCompany && code.contractorId) revalidatePath(`/admin/empresas/${code.contractorId}`);
  if (wasContractor && code.companyId) revalidatePath(`/admin/empresas/${code.companyId}`);
  revalidatePath('/admin/accesos');
  revalidatePath(`/admin/accesos/${codeId}`);
}

/** Rotar la clave cierra de inmediato las sesiones abiertas del panel. */
export async function rotatePanelKey(formData: FormData) {
  const id = Number(str(formData, 'id'));
  if (!id) return;

  await db
    .update(companies)
    .set({ panelKey: await freePanelKey(), updatedAt: new Date() })
    .where(eq(companies.id, id));

  revalidatePath(`/admin/empresas/${id}`);
}

export async function toggleCompanyPanel(formData: FormData) {
  const id = Number(str(formData, 'id'));
  if (!id) return;

  const current = await db.query.companies.findFirst({ where: eq(companies.id, id) });
  if (!current) return;

  await db
    .update(companies)
    .set({ panelActive: !current.panelActive, updatedAt: new Date() })
    .where(eq(companies.id, id));

  revalidatePath('/admin/empresas');
  revalidatePath(`/admin/empresas/${id}`);
}
