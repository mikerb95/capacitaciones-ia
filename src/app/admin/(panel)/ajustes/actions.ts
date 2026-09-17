'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { ADMIN_COOKIE, verifyAdminToken } from '@/lib/admin-auth';
import { CERTIFICADOS, guardarAjuste } from '@/lib/ajustes';

export async function setCertificados(formData: FormData) {
  const jar = await cookies();
  if (!(await verifyAdminToken(jar.get(ADMIN_COOKIE)?.value))) return;

  await guardarAjuste(CERTIFICADOS, formData.get('enabled') === 'si' ? 'si' : 'no');

  revalidatePath('/admin/ajustes');
  revalidatePath('/ruta', 'layout');
  revalidatePath('/[platform]', 'page');
}
