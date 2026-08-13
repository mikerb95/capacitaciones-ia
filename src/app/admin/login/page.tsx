import Link from 'next/link';
import { AdminLoginForm } from '@/components/admin-login-form';
import { ThemeToggle } from '@/components/theme-toggle';
import { adminAuthConfigured } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Entrar al panel · Academia IA' };

type Props = { searchParams: Promise<{ destino?: string }> };

export default async function AdminLoginPage({ searchParams }: Props) {
  const { destino } = await searchParams;
  const destination =
    destino?.startsWith('/admin') && !destino.startsWith('/admin/login') ? destino : '/admin';

  return (
    <div className="grid min-h-screen grid-rows-[auto_1fr] bg-bg">
      <div className="flex justify-end p-4">
        <ThemeToggle />
      </div>

      <main className="grid place-items-start justify-center px-4 pb-16">
        <div className="w-full max-w-[380px]">
          <div className="mb-7 text-center">
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-faint">
              Panel interno
            </p>
            <h1 className="mt-2 font-display text-[27px] font-semibold tracking-tight">
              Academia IA
            </h1>
            <p className="mt-2 text-[14.5px] leading-relaxed text-muted">
              Esta zona es para el equipo: contenido, códigos de acceso y presentaciones.
            </p>
          </div>

          <div className="rounded-card border border-line bg-surface p-6 shadow-card">
            <AdminLoginForm destination={destination} />
          </div>

          {!adminAuthConfigured() && (
            <p className="mt-4 rounded-[10px] border border-line bg-surface-2 px-4 py-3 text-[12.5px] leading-relaxed text-muted">
              Falta configurar <code className="font-mono">ADMIN_USER</code> y{' '}
              <code className="font-mono">ADMIN_PASS</code>. Sin esas variables el panel queda
              cerrado para todo el mundo.
            </p>
          )}

          <p className="mt-6 text-center text-[12px] text-faint">
            ¿Vienes a una capacitación?{' '}
            <Link href="/ingresar" className="transition-colors hover:text-primary">
              Entra con tu código
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
