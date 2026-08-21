import { AccessCodeForm } from '@/components/access-code-form';
import { AdminPage } from '@/components/admin-page';
import { getCompanyOptions } from '@/db/queries';
import { createAccessCode } from '../actions';
import { getScopeOptions } from '../scope-options';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Nuevo código · Academia IA' };

export default async function NuevoAccesoPage() {
  const [platforms, companies] = await Promise.all([getScopeOptions(), getCompanyOptions()]);

  return (
    <AdminPage
      title="Nueva capacitación"
      subtitle="El código, para quién se dicta, el plan que tiene contratado y el alcance de la capacitación."
      back={{ href: '/admin/accesos', label: 'Capacitaciones' }}
      max={900}
    >
      <AccessCodeForm
        action={createAccessCode}
        platforms={platforms}
        companies={companies}
        mode="create"
      />
    </AdminPage>
  );
}
