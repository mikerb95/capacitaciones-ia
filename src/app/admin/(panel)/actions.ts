'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { eq, sql } from 'drizzle-orm';
import { db } from '@/db';
import {
  modules,
  moduleOutcomes,
  modulePrompts,
  moduleSteps,
  moduleRoles,
  moduleMistakes,
} from '@/db/schema';
import type { Level } from '@/db/schema';

const LEVELS: Level[] = ['Básico', 'Intermedio', 'Avanzado'];

const str = (data: FormData, key: string) => (data.get(key) as string | null)?.trim() ?? '';
const orNull = (value: string) => (value.length ? value : null);

/** Cada línea es un ítem; los campos van separados por "|". */
function lines(data: FormData, key: string): string[][] {
  return str(data, key)
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.split('|').map((part) => part.trim()));
}

function levelOf(value: string): Level {
  return LEVELS.includes(value as Level) ? (value as Level) : 'Básico';
}

async function replaceChildren(moduleId: number, data: FormData) {
  await db.delete(moduleOutcomes).where(eq(moduleOutcomes.moduleId, moduleId));
  await db.delete(modulePrompts).where(eq(modulePrompts.moduleId, moduleId));
  await db.delete(moduleSteps).where(eq(moduleSteps.moduleId, moduleId));
  await db.delete(moduleRoles).where(eq(moduleRoles.moduleId, moduleId));
  await db.delete(moduleMistakes).where(eq(moduleMistakes.moduleId, moduleId));

  const outcomes = lines(data, 'outcomes');
  if (outcomes.length) {
    await db.insert(moduleOutcomes).values(
      outcomes.map((parts, i) => ({ moduleId, text: parts.join(' | '), sortOrder: i })),
    );
  }

  const prompts = lines(data, 'prompts').filter((p) => p.length >= 2);
  if (prompts.length) {
    await db.insert(modulePrompts).values(
      prompts.map(([tag, ...rest], i) => ({
        moduleId,
        tag,
        text: rest.join(' | '),
        sortOrder: i,
      })),
    );
  }

  const steps = lines(data, 'steps').filter((s) => s.length >= 2);
  if (steps.length) {
    await db.insert(moduleSteps).values(
      steps.map(([title, ...rest], i) => ({
        moduleId,
        title,
        description: rest.join(' | '),
        sortOrder: i,
      })),
    );
  }

  const roles = lines(data, 'roles').filter((r) => r.length >= 3);
  if (roles.length) {
    await db.insert(moduleRoles).values(
      roles.map(([role, task, ...rest], i) => ({
        moduleId,
        role,
        task,
        detail: rest.join(' | '),
        sortOrder: i,
      })),
    );
  }

  const mistakes = lines(data, 'mistakes').filter((m) => m.length >= 2);
  if (mistakes.length) {
    await db.insert(moduleMistakes).values(
      mistakes.map(([bad, ...rest], i) => ({
        moduleId,
        bad,
        good: rest.join(' | '),
        sortOrder: i,
      })),
    );
  }
}

export async function saveModule(formData: FormData) {
  const idRaw = str(formData, 'id');
  const id = idRaw ? Number(idRaw) : null;
  const platformId = str(formData, 'platformId');
  const slug = str(formData, 'slug');

  if (!platformId || !slug || !str(formData, 'name')) {
    throw new Error('Plataforma, slug y nombre son obligatorios.');
  }

  const values = {
    platformId,
    slug,
    name: str(formData, 'name'),
    shortName: str(formData, 'shortName') || str(formData, 'name'),
    abbr: (str(formData, 'abbr') || slug.slice(0, 2)).toUpperCase(),
    color: str(formData, 'color') || '#3B5BDB',
    level: levelOf(str(formData, 'level')),
    category: orNull(str(formData, 'category')),
    summary: str(formData, 'summary'),
    intro: orNull(str(formData, 'intro')),
    meta: orNull(str(formData, 'meta')),
    baIntro: orNull(str(formData, 'baIntro')),
    before: orNull(str(formData, 'before')),
    beforeTime: orNull(str(formData, 'beforeTime')),
    after: orNull(str(formData, 'after')),
    afterTime: orNull(str(formData, 'afterTime')),
    mockTitle: orNull(str(formData, 'mockTitle')),
    mockPrompt: orNull(str(formData, 'mockPrompt')),
    mockReply: orNull(str(formData, 'mockReply')),
    mockPanelTitle: orNull(str(formData, 'mockPanelTitle')),
    mockPanel: orNull(str(formData, 'mockPanel')),
    status: (str(formData, 'status') === 'borrador' ? 'borrador' : 'publicado') as
      | 'publicado'
      | 'borrador',
    updatedAt: new Date(),
  };

  let moduleId: number;

  if (id) {
    await db.update(modules).set(values).where(eq(modules.id, id));
    moduleId = id;
  } else {
    // Los módulos nuevos van al final de su plataforma.
    const [{ next }] = await db
      .select({ next: sql<number>`coalesce(max(${modules.sortOrder}), -1) + 1` })
      .from(modules)
      .where(eq(modules.platformId, platformId));

    const [created] = await db
      .insert(modules)
      .values({ ...values, sortOrder: next })
      .returning({ id: modules.id });
    moduleId = created.id;
  }

  await replaceChildren(moduleId, formData);

  revalidatePath('/');
  revalidatePath('/admin');
  revalidatePath('/admin/modulos');
  revalidatePath(`/${platformId}`);
  revalidatePath(`/${platformId}/${slug}`);
  redirect('/admin/modulos');
}

export async function deleteModule(formData: FormData) {
  const id = Number(str(formData, 'id'));
  const platformId = str(formData, 'platformId');
  if (!id) return;

  await db.delete(modules).where(eq(modules.id, id));

  revalidatePath('/');
  revalidatePath('/admin');
  revalidatePath('/admin/modulos');
  if (platformId) revalidatePath(`/${platformId}`);
  redirect('/admin/modulos');
}

export async function moveModule(formData: FormData) {
  const id = Number(str(formData, 'id'));
  const direction = str(formData, 'direction') === 'up' ? -1 : 1;
  if (!id) return;

  const current = await db.query.modules.findFirst({ where: eq(modules.id, id) });
  if (!current) return;

  const siblings = await db.query.modules.findMany({
    where: eq(modules.platformId, current.platformId),
    orderBy: (m, { asc }) => [asc(m.sortOrder)],
    columns: { id: true, sortOrder: true },
  });

  const index = siblings.findIndex((m) => m.id === id);
  const target = siblings[index + direction];
  if (!target) return;

  await db.update(modules).set({ sortOrder: target.sortOrder }).where(eq(modules.id, current.id));
  await db.update(modules).set({ sortOrder: current.sortOrder }).where(eq(modules.id, target.id));

  revalidatePath('/');
  revalidatePath('/admin');
  revalidatePath('/admin/modulos');
  revalidatePath(`/${current.platformId}`);
}
