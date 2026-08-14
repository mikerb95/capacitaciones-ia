import { notFound } from 'next/navigation';
import { AccessCodeForm } from '@/components/access-code-form';
import { AdminLogoutButton } from '@/components/admin-logout-button';
import { SiteHeader } from '@/components/ui';
import { getAccessCode } from '@/db/queries';
import { updateAccessCode } from '../actions';
import { getScopeOptions } from '../scope-options';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const code = await getAccessCode(Number(id));
  return { title: code ? `PIN ${code.code} · Academia IA` : 'PIN · Academia IA' };
}

export default async function EditarAccesoPage({ params }: Props) {
  const { id } = await params;
  const code = await getAccessCode(Number(id));
  if (!code) notFound();

  const platforms = await getScopeOptions();

  return (
    <div className="min-h-screen bg-bg">
      <SiteHeader
        title={`PIN ${code.code}`}
        subtitle={code.company ?? code.label}
        back={{ href: '/admin/accesos', label: 'Códigos de acceso' }}
      >
        <AdminLogoutButton />
      </SiteHeader>

      <main className="mx-auto max-w-[900px] px-4 py-8 sm:px-6">
        <AccessCodeForm
          action={updateAccessCode}
          platforms={platforms}
          mode="edit"
          id={code.id}
          defaults={{
            code: code.code,
            label: code.label,
            company: code.company ?? '',
            industry: code.industry ?? '',
            contactName: code.contactName ?? '',
            contactEmail: code.contactEmail ?? '',
            notes: code.notes ?? '',
            moduleIds: code.scope.map((s) => s.moduleId),
            planKeys: Object.fromEntries(code.plans.map((p) => [p.platformId, p.plan.key])),
          }}
        />
      </main>
    </div>
  );
}
