'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { eq, inArray } from 'drizzle-orm';
import { db } from '@/db';
import {
  accessCodeModules,
  accessCodePlans,
  accessCodes,
  companies,
  modules,
  platformPlans,
} from '@/db/schema';
import { RESERVED_CODES } from '@/lib/master-access';

const str = (data: FormData, key: string) => ((data.get(key) as string | null) ?? '').trim();
const orNull = (value: string) => (value.length ? value : null);

export type AccessCodeState = {
  error?: string;
  field?: 'code' | 'label' | 'company' | 'scope';
};

export type AccessCodeAction = (
  prev: AccessCodeState,
  formData: FormData,
) => Promise<AccessCodeState>;

function randomCode() {
  return String(Math.floor(1000 + Math.random() * 9000));
}

/**
 * Datos de la capacitación. La empresa solo se guarda si está marcado que se
 * dicta bajo contrato: desmarcar la casilla desengancha el PIN de su panel.
 */
async function profileOf(formData: FormData): Promise<
  { label: string; contracted: boolean; companyId: number | null; notes: string | null } | AccessCodeState
> {
  const contracted = str(formData, 'contracted') === '1';
  const wanted = Number(str(formData, 'companyId'));

  let companyId: number | null = null;

  if (contracted) {
    if (!wanted) {
      return {
        error: 'Elige la empresa contratante, o desmarca que la dictas en su nombre.',
        field: 'company',
      };
    }
    // La empresa se resuelve contra la base: el formulario no decide qué existe.
    const found = await db.query.companies.findFirst({ where: eq(companies.id, wanted) });
    if (!found) return { error: 'No encuentro esa empresa.', field: 'company' };
    companyId = found.id;
  }

  return {
    label: str(formData, 'label') || 'Capacitación sin nombre',
    contracted,
    companyId,
    notes: orNull(str(formData, 'notes')),
  };
}

const isError = (value: object): value is AccessCodeState => 'error' in value;

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

/** Crea el PIN de una capacitación, con su empresa y su alcance. */
export async function createAccessCode(
  _prev: AccessCodeState,
  formData: FormData,
): Promise<AccessCodeState> {
  const profile = await profileOf(formData);
  if (isError(profile)) return profile;

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

  const profile = await profileOf(formData);
  if (isError(profile)) return profile;

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
