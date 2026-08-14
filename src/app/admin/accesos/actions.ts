'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { eq, inArray } from 'drizzle-orm';
import { db } from '@/db';
import { accessCodeModules, accessCodePlans, accessCodes, modules, platformPlans } from '@/db/schema';
import { RESERVED_CODES } from '@/lib/master-access';

const str = (data: FormData, key: string) => ((data.get(key) as string | null) ?? '').trim();
const orNull = (value: string) => (value.length ? value : null);

export type AccessCodeState = {
  error?: string;
  field?: 'code' | 'label' | 'contactEmail' | 'scope';
};

export type AccessCodeAction = (
  prev: AccessCodeState,
  formData: FormData,
) => Promise<AccessCodeState>;

function randomCode() {
  return String(Math.floor(1000 + Math.random() * 9000));
}

/** Perfil de la empresa: todo opcional menos el nombre de la capacitación. */
function profileOf(formData: FormData) {
  return {
    label: str(formData, 'label') || 'Capacitación sin nombre',
    company: orNull(str(formData, 'company')),
    industry: orNull(str(formData, 'industry')),
    contactName: orNull(str(formData, 'contactName')),
    contactEmail: orNull(str(formData, 'contactEmail')),
    notes: orNull(str(formData, 'notes')),
  };
}

/**
 * Alcance elegido en el formulario. `null` es "todo el catálogo": se guarda
 * como ausencia de filas, no como la lista completa, así un módulo nuevo entra
 * solo en los códigos que no tienen recorte.
 */
async function scopeOf(formData: FormData): Promise<number[] | null> {
  if (str(formData, 'alcance') !== 'seleccion') return null;

  const ids = formData
    .getAll('modulos')
    .map((value) => Number(value))
    .filter((id) => Number.isInteger(id) && id > 0);

  if (ids.length === 0) return [];

  // Solo ids que existan de verdad: el formulario no decide qué es válido.
  const found = await db
    .select({ id: modules.id })
    .from(modules)
    .where(inArray(modules.id, ids));

  return found.map((m) => m.id);
}

async function replaceScope(accessCodeId: number, moduleIds: number[] | null) {
  await db.delete(accessCodeModules).where(eq(accessCodeModules.accessCodeId, accessCodeId));
  if (!moduleIds?.length) return;

  await db
    .insert(accessCodeModules)
    .values(moduleIds.map((moduleId) => ({ accessCodeId, moduleId })));
}

/**
 * Plan contratado por plataforma. Llega como `plan_<plataforma>` con la clave
 * del plan; se resuelve contra la base para no guardar lo que diga el
 * formulario, y una plataforma sin elección simplemente no deja fila.
 */
async function plansOf(formData: FormData) {
  const wanted = new Map<string, string>();

  for (const [name, value] of formData.entries()) {
    if (!name.startsWith('plan_') || typeof value !== 'string' || !value) continue;
    wanted.set(name.slice('plan_'.length), value);
  }

  if (wanted.size === 0) return [];

  const rows = await db
    .select({
      id: platformPlans.id,
      platformId: platformPlans.platformId,
      key: platformPlans.key,
    })
    .from(platformPlans)
    .where(inArray(platformPlans.platformId, [...wanted.keys()]));

  return rows
    .filter((row) => wanted.get(row.platformId) === row.key)
    .map((row) => ({ platformId: row.platformId, planId: row.id }));
}

async function replacePlans(
  accessCodeId: number,
  plans: { platformId: string; planId: number }[],
) {
  await db.delete(accessCodePlans).where(eq(accessCodePlans.accessCodeId, accessCodeId));
  if (!plans.length) return;

  await db.insert(accessCodePlans).values(plans.map((p) => ({ accessCodeId, ...p })));
}

const emailLooksWrong = (value: string | null) => Boolean(value) && !/^\S+@\S+\.\S+$/.test(value!);

/** Crea el PIN de una capacitación, con su perfil de empresa y su alcance. */
export async function createAccessCode(
  _prev: AccessCodeState,
  formData: FormData,
): Promise<AccessCodeState> {
  const profile = profileOf(formData);
  const wanted = str(formData, 'code').replace(/\D/g, '');

  if (wanted && wanted.length !== 4) {
    return { error: 'El PIN son exactamente 4 dígitos.', field: 'code' };
  }
  if (wanted && RESERVED_CODES.includes(wanted)) {
    return {
      error: 'Ese PIN está reservado para pruebas y no se puede asignar a una capacitación.',
      field: 'code',
    };
  }
  if (emailLooksWrong(profile.contactEmail)) {
    return { error: 'Revisa el correo del contacto.', field: 'contactEmail' };
  }

  const scope = await scopeOf(formData);
  if (scope !== null && scope.length === 0) {
    return {
      error: 'Elige al menos un módulo, o cambia el alcance a todo el catálogo.',
      field: 'scope',
    };
  }

  let code = wanted || randomCode();

  if (wanted) {
    const taken = await db.query.accessCodes.findFirst({ where: eq(accessCodes.code, code) });
    if (taken) {
      return { error: 'Ese PIN ya existe. Elige otro o deja el campo vacío.', field: 'code' };
    }
  } else {
    // El sorteo también esquiva los reservados.
    while (
      RESERVED_CODES.includes(code) ||
      (await db.query.accessCodes.findFirst({ where: eq(accessCodes.code, code) }))
    ) {
      code = randomCode();
    }
  }

  const [created] = await db
    .insert(accessCodes)
    .values({ ...profile, code, updatedAt: new Date() })
    .returning({ id: accessCodes.id });

  await replaceScope(created.id, scope);
  await replacePlans(created.id, await plansOf(formData));

  revalidatePath('/admin/accesos');
  redirect(`/admin/accesos?creado=${code}`);
}

/** Edita el perfil y el alcance de un PIN ya creado. El número no se toca. */
export async function updateAccessCode(
  _prev: AccessCodeState,
  formData: FormData,
): Promise<AccessCodeState> {
  const id = Number(str(formData, 'id'));
  if (!id) return { error: 'No encuentro ese PIN.' };

  const current = await db.query.accessCodes.findFirst({ where: eq(accessCodes.id, id) });
  if (!current) return { error: 'No encuentro ese PIN.' };

  const profile = profileOf(formData);
  if (emailLooksWrong(profile.contactEmail)) {
    return { error: 'Revisa el correo del contacto.', field: 'contactEmail' };
  }

  const scope = await scopeOf(formData);
  if (scope !== null && scope.length === 0) {
    return {
      error: 'Elige al menos un módulo, o cambia el alcance a todo el catálogo.',
      field: 'scope',
    };
  }

  await db
    .update(accessCodes)
    .set({ ...profile, updatedAt: new Date() })
    .where(eq(accessCodes.id, id));

  await replaceScope(id, scope);
  await replacePlans(id, await plansOf(formData));

  revalidatePath('/admin/accesos');
  revalidatePath(`/admin/accesos/${id}`);
  redirect(`/admin/accesos?guardado=${current.code}`);
}

/** Cerrar un código deja fuera a quien ya había entrado con él. */
export async function toggleAccessCode(formData: FormData) {
  const id = Number(str(formData, 'id'));
  if (!id) return;

  const current = await db.query.accessCodes.findFirst({ where: eq(accessCodes.id, id) });
  if (!current || current.system) return;

  await db
    .update(accessCodes)
    .set({ active: !current.active, updatedAt: new Date() })
    .where(eq(accessCodes.id, id));

  revalidatePath('/admin/accesos');
}

/** Borra el código y, con él, sus registros de asistentes. */
export async function deleteAccessCode(formData: FormData) {
  const id = Number(str(formData, 'id'));
  if (!id) return;

  const current = await db.query.accessCodes.findFirst({ where: eq(accessCodes.id, id) });
  if (!current || current.system) return;

  await db.delete(accessCodes).where(eq(accessCodes.id, id));

  revalidatePath('/admin/accesos');
  redirect('/admin/accesos');
}
