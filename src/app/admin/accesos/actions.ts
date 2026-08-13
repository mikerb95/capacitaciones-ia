'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { accessCodes } from '@/db/schema';
import { RESERVED_CODES } from '@/lib/master-access';

const str = (data: FormData, key: string) => ((data.get(key) as string | null) ?? '').trim();

function randomCode() {
  return String(Math.floor(1000 + Math.random() * 9000));
}

/** Crea un código de capacitación. Si no se escribe uno, se sortea libre. */
export async function createAccessCode(formData: FormData) {
  const label = str(formData, 'label') || 'Capacitación sin nombre';
  const wanted = str(formData, 'code').replace(/\D/g, '');

  if (wanted && wanted.length !== 4) redirect('/admin/accesos?error=formato');
  if (wanted && RESERVED_CODES.includes(wanted)) redirect('/admin/accesos?error=reservado');

  let code = wanted || randomCode();

  if (wanted) {
    const taken = await db.query.accessCodes.findFirst({ where: eq(accessCodes.code, code) });
    if (taken) redirect('/admin/accesos?error=repetido');
  } else {
    // El sorteo también esquiva los reservados.
    while (
      RESERVED_CODES.includes(code) ||
      (await db.query.accessCodes.findFirst({ where: eq(accessCodes.code, code) }))
    ) {
      code = randomCode();
    }
  }

  await db.insert(accessCodes).values({ code, label, updatedAt: new Date() });

  revalidatePath('/admin/accesos');
  redirect(`/admin/accesos?creado=${code}`);
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

  await db.delete(accessCodes).where(eq(accessCodes.id, id));

  revalidatePath('/admin/accesos');
  redirect('/admin/accesos');
}
