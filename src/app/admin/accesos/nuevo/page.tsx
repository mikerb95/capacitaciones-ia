import { AccessCodeForm } from '@/components/access-code-form';
import { AdminLogoutButton } from '@/components/admin-logout-button';
import { SiteHeader } from '@/components/ui';
import { createAccessCode } from '../actions';
import { getScopeOptions } from '../scope-options';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Nuevo PIN · Academia IA' };

export default async function NuevoAccesoPage() {
  const platforms = await getScopeOptions();

  return (
    <div className="min-h-screen bg-bg">
      <SiteHeader
        title="Nuevo PIN"
        subtitle="El código, el perfil de la empresa, el plan que tiene contratado y el alcance de la capacitación."
        back={{ href: '/admin/accesos', label: 'Códigos de acceso' }}
      >
        <AdminLogoutButton />
      </SiteHeader>

      <main className="mx-auto max-w-[900px] px-4 py-8 sm:px-6">
        <AccessCodeForm action={createAccessCode} platforms={platforms} mode="create" />
      </main>
    </div>
  );
}
