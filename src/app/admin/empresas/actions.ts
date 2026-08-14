'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { companies, companyContacts } from '@/db/schema';
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
  field?: 'name' | 'contacts' | 'contract';
};

export type CompanyAction = (prev: CompanyState, formData: FormData) => Promise<CompanyState>;

const emailLooksWrong = (value: string | null) => Boolean(value) && !/^\S+@\S+\.\S+$/.test(value!);

function profileOf(formData: FormData) {
  return {
    name: str(formData, 'name'),
    industry: orNull(str(formData, 'industry')),
    contractRef: orNull(str(formData, 'contractRef')),
    contractStart: dateOrNull(str(formData, 'contractStart')),
    contractEnd: dateOrNull(str(formData, 'contractEnd')),
    contractSessions: intOrNull(str(formData, 'contractSessions')),
    contractNotes: orNull(str(formData, 'contractNotes')),
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

  const [created] = await db
    .insert(companies)
    .values({ ...profile, panelKey: await freePanelKey(), updatedAt: new Date() })
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

  await db
    .update(companies)
    .set({ ...profile, updatedAt: new Date() })
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
