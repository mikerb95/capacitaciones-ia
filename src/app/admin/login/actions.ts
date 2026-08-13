'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  ADMIN_COOKIE,
  ADMIN_MAX_AGE,
  adminAuthConfigured,
  checkAdminCredentials,
  createAdminToken,
} from '@/lib/admin-auth';

export type LoginState = { error?: string; values?: { user: string } };

const str = (data: FormData, key: string) => ((data.get(key) as string | null) ?? '').trim();

/** Solo rutas internas del panel: `?destino=` no puede sacarte del sitio. */
function safeDestination(raw: string) {
  return raw.startsWith('/admin') && !raw.startsWith('/admin/login') ? raw : '/admin';
}

export async function adminLogin(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const user = str(formData, 'usuario');
  const pass = str(formData, 'clave');

  if (!adminAuthConfigured()) {
    return { error: 'El panel no tiene credenciales configuradas (ADMIN_USER y ADMIN_PASS).' };
  }

  if (!checkAdminCredentials(user, pass)) {
    return { error: 'Usuario o contraseña incorrectos.', values: { user } };
  }

  (await cookies()).set(ADMIN_COOKIE, await createAdminToken(user), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: ADMIN_MAX_AGE,
  });

  redirect(safeDestination(str(formData, 'destino')));
}

export async function adminLogout() {
  (await cookies()).delete(ADMIN_COOKIE);
  redirect('/admin/login');
}
