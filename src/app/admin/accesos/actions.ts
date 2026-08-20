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
  questions,
} from '@/db/schema';
import { codeProblem, normalizeCode, randomCode } from '@/lib/access-code';
import { RESERVED_CODES } from '@/lib/master-access';

const str = (data: FormData, key: string) => ((data.get(key) as string | null) ?? '').trim();
const orNull = (value: string) => (value.length ? value : null);

export type AccessCodeState = {
  error?: string;
  field?: 'code' | 'label' | 'company' | 'contractor' | 'scope';
};

export type AccessCodeAction = (
  prev: AccessCodeState,
  formData: FormData,
) => Promise<AccessCodeState>;

type Profile = {
  label: string;
  contracted: boolean;
  companyId: number | null;
  contractorId: number | null;
  notes: string | null;
};

/**
 * Datos de la capacitación, según cómo llegó el trabajo.
 *
 * `propia` no engancha ninguna empresa. `directa` guarda a la destinataria, que
 * fue la que contrató. `tercerizada` guarda además a la capacitadora que puso
 * el contrato: son dos empresas distintas y las dos verán la capacitación en su
 * panel, cada una por su lado.
 */
async function profileOf(formData: FormData): Promise<Profile | AccessCodeState> {
  const mode = str(formData, 'modo');
  const contracted = mode === 'directa' || mode === 'tercerizada';

  const base = {
    label: str(formData, 'label') || 'Capacitación sin nombre',
    notes: orNull(str(formData, 'notes')),
  };

  if (!contracted) return { ...base, contracted: false, companyId: null, contractorId: null };

  const company = await findCompany(formData, 'companyId');
  if (!company) {
    return {
      error: 'Elige la empresa que recibe la capacitación, o marca que la capacitación es tuya.',
      field: 'company',
    };
  }

  if (mode === 'directa') {
    return { ...base, contracted, companyId: company.id, contractorId: null };
  }

  const contractor = await findCompany(formData, 'contractorId');
  if (!contractor) {
    return {
      error: 'Elige la capacitadora que te contrató, o marca que contrataron directo.',
      field: 'contractor',
    };
  }

  // Una empresa que se contrata a sí misma es trabajo directo con un rodeo, y
  // dejarlo pasar duplicaría la capacitación en su propio panel.
  if (contractor.id === company.id) {
    return {
      error: `${contractor.name} no puede ser a la vez la capacitadora y la destinataria. Si te contrató para su propia gente, es trabajo directo.`,
      field: 'contractor',
    };
  }

  if (contractor.kind === 'cliente') {
    return {
      error: `${contractor.name} está marcada como cliente. Cámbiale el tipo a capacitadora en su ficha para poder contratar a nombre de otros.`,
      field: 'contractor',
    };
  }

  return { ...base, contracted, companyId: company.id, contractorId: contractor.id };
}

/** La empresa se resuelve contra la base: el formulario no decide qué existe. */
async function findCompany(formData: FormData, key: string) {
  const wanted = Number(str(formData, key));
  if (!wanted) return null;

  const found = await db.query.companies.findFirst({ where: eq(companies.id, wanted) });
  return found ?? null;
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

/** Crea el código de una capacitación, con su empresa y su alcance. */
export async function createAccessCode(
  _prev: AccessCodeState,
  formData: FormData,
): Promise<AccessCodeState> {
  const profile = await profileOf(formData);
  if (isError(profile)) return profile;

  const wanted = normalizeCode(str(formData, 'code'));

  if (wanted) {
    const problem = codeProblem(wanted);
    if (problem) return { error: problem, field: 'code' };
  }
  if (wanted && RESERVED_CODES.includes(wanted)) {
    return {
      error: 'Ese código está reservado para pruebas y no se puede asignar a una capacitación.',
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
      return { error: 'Ese código ya existe. Elige otro o deja el campo vacío.', field: 'code' };
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

/** Edita el perfil y el alcance de un código ya creado. El código no se toca. */
export async function updateAccessCode(
  _prev: AccessCodeState,
  formData: FormData,
): Promise<AccessCodeState> {
  const id = Number(str(formData, 'id'));
  if (!id) return { error: 'No encuentro ese código.' };

  const current = await db.query.accessCodes.findFirst({ where: eq(accessCodes.id, id) });
  if (!current) return { error: 'No encuentro ese código.' };

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

/* ---------------------------------------------------------------- preguntas */

/**
 * Responde una pregunta del buzón. La respuesta la ve quien preguntó, en el
 * portal, y la empresa en su panel: es la misma fila para los tres.
 *
 * Vaciar el campo la devuelve a pendiente, que es la forma de deshacer una
 * respuesta escrita a medias sin tener que borrar la pregunta.
 */
export async function answerQuestion(formData: FormData) {
  const id = Number(str(formData, 'id'));
  if (!id) return;

  const question = await db.query.questions.findFirst({ where: eq(questions.id, id) });
  if (!question) return;

  const answer = orNull(str(formData, 'respuesta'));

  await db
    .update(questions)
    .set({
      answer,
      status: answer ? 'respondida' : 'abierta',
      answeredAt: answer ? new Date() : null,
      updatedAt: new Date(),
    })
    .where(eq(questions.id, id));

  revalidatePath(`/admin/accesos/${question.accessCodeId}`);
  revalidatePath('/preguntas');
}

/** Borra una pregunta. Es para lo que llegó repetido o fuera de lugar. */
export async function deleteQuestion(formData: FormData) {
  const id = Number(str(formData, 'id'));
  if (!id) return;

  const question = await db.query.questions.findFirst({ where: eq(questions.id, id) });
  if (!question) return;

  await db.delete(questions).where(eq(questions.id, id));

  revalidatePath(`/admin/accesos/${question.accessCodeId}`);
  revalidatePath('/preguntas');
}
