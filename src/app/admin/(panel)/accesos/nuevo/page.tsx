import { AccessCodeForm } from '@/components/access-code-form';
import { AdminLogoutButton } from '@/components/admin-logout-button';
import { SiteHeader } from '@/components/ui';
import { getCompanyOptions } from '@/db/queries';
import { createAccessCode } from '../actions';
import { getScopeOptions } from '../scope-options';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Nuevo código · Academia IA' };

export default async function NuevoAccesoPage() {
  const [platforms, companies] = await Promise.all([getScopeOptions(), getCompanyOptions()]);

  return (
    <div className="min-h-screen bg-bg">
      <SiteHeader
        title="Nuevo código"
        subtitle="El código, para quién se dicta, el plan que tiene contratado y el alcance de la capacitación."
        back={{ href: '/admin/accesos', label: 'Códigos de acceso' }}
      >
        <AdminLogoutButton />
      </SiteHeader>

      <main className="mx-auto max-w-[900px] px-4 py-8 sm:px-6">
        <AccessCodeForm
          action={createAccessCode}
          platforms={platforms}
          companies={companies}
          mode="create"
        />
      </main>
    </div>
  );
}
