'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { and, eq } from 'drizzle-orm';
import { db } from '@/db';
import { companies } from '@/db/schema';
import { COMPANY_COOKIE, COMPANY_MAX_AGE, normalizePanelKey } from '@/lib/company-access';

export type CompanyLoginState = { error?: string };

export async function enterCompanyPanel(
  _prev: CompanyLoginState,
  formData: FormData,
): Promise<CompanyLoginState> {
  const key = normalizePanelKey(((formData.get('clave') as string | null) ?? '').trim());
  if (!key) return { error: 'Escribe la clave que te entregamos.' };

  const company = await db.query.companies.findFirst({
    where: and(eq(companies.panelKey, key), eq(companies.panelActive, true)),
  });

  // El mismo mensaje para clave errada y para panel apagado: desde fuera no
  // hace falta saber si la empresa existe.
  if (!company) return { error: 'Esa clave no abre ningún panel. Revísala o escríbenos.' };

  (await cookies()).set(COMPANY_COOKIE, company.panelKey, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: COMPANY_MAX_AGE,
  });

  redirect('/empresa/panel');
}

export async function leaveCompanyPanel() {
  (await cookies()).delete(COMPANY_COOKIE);
  redirect('/empresa');
}
