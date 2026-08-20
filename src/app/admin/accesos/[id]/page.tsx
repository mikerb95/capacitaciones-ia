import { notFound } from 'next/navigation';
import { AccessCodeForm } from '@/components/access-code-form';
import { AdminLogoutButton } from '@/components/admin-logout-button';
import { SiteHeader } from '@/components/ui';
import { getAccessCode, getCompanyOptions } from '@/db/queries';
import { updateAccessCode } from '../actions';
import { getScopeOptions } from '../scope-options';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const code = await getAccessCode(Number(id));
  return { title: code ? `Código ${code.code} · Academia IA` : 'Código · Academia IA' };
}

export default async function EditarAccesoPage({ params }: Props) {
  const { id } = await params;
  const code = await getAccessCode(Number(id));
  if (!code) notFound();

  const [platforms, companies] = await Promise.all([getScopeOptions(), getCompanyOptions()]);

  return (
    <div className="min-h-screen bg-bg">
      <SiteHeader
        title={`Código ${code.code}`}
        subtitle={
          code.contractor
            ? `${code.company?.name ?? code.label} · vía ${code.contractor.name}`
            : (code.company?.name ?? code.label)
        }
        back={{ href: '/admin/accesos', label: 'Códigos de acceso' }}
      >
        <AdminLogoutButton />
      </SiteHeader>

      <main className="mx-auto max-w-[900px] px-4 py-8 sm:px-6">
        <AccessCodeForm
          action={updateAccessCode}
          platforms={platforms}
          companies={companies}
          mode="edit"
          id={code.id}
          defaults={{
            code: code.code,
            label: code.label,
            mode: !code.contracted ? 'propia' : code.contractorId ? 'tercerizada' : 'directa',
            companyId: code.companyId,
            contractorId: code.contractorId,
            notes: code.notes ?? '',
            moduleIds: code.scope.map((s) => s.moduleId),
            planKeys: Object.fromEntries(code.plans.map((p) => [p.platformId, p.plan.key])),
          }}
        />
      </main>
    </div>
  );
}
