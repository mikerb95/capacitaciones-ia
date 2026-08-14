import { redirect } from 'next/navigation';
import { CompanyLoginForm } from '@/components/company-login-form';
import { ThemeToggle } from '@/components/theme-toggle';
import { getCompanySession } from '@/lib/company-access';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Panel de tu empresa · Academia IA' };

export default async function EmpresaLoginPage() {
  if (await getCompanySession()) redirect('/empresa/panel');

  return (
    <div className="grid min-h-screen grid-rows-[auto_1fr] bg-bg">
      <div className="flex justify-end p-4">
        <ThemeToggle />
      </div>

      <main className="grid place-items-start justify-center px-4 pb-16">
        <div className="w-full max-w-[400px]">
          <div className="mb-7 text-center">
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-faint">
              Panel de seguimiento
            </p>
            <h1 className="mt-2 font-display text-[27px] font-semibold tracking-tight">
              Tu equipo en la capacitación
            </h1>
            <p className="mt-2 text-[14.5px] leading-relaxed text-muted">
              Quién de tu gente se registró y hasta dónde ha recorrido el material de cada
              capacitación que contrataste.
            </p>
          </div>

          <div className="rounded-card border border-line bg-surface p-6 shadow-card">
            <CompanyLoginForm />
          </div>

          <p className="mt-6 text-center text-[12px] leading-relaxed text-faint">
            La clave se la entregamos al responsable del contrato. Si no la tienes a mano,
            pídenosla y te la reenviamos.
          </p>
        </div>
      </main>
    </div>
  );
}
