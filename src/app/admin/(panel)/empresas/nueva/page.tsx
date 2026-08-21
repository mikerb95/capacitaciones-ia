import { AdminLogoutButton } from '@/components/admin-logout-button';
import { CompanyForm } from '@/components/company-form';
import { SiteHeader } from '@/components/ui';
import { createCompany } from '../actions';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Nueva empresa · Academia IA' };

export default function NuevaEmpresaPage() {
  return (
    <div className="min-h-screen bg-bg">
      <SiteHeader
        title="Nueva empresa"
        subtitle="El contrato bajo el que dictas para ellos y quién responde de su lado. La clave de su panel se genera sola."
        back={{ href: '/admin/empresas', label: 'Empresas' }}
      >
        <AdminLogoutButton />
      </SiteHeader>

      <main className="mx-auto max-w-[900px] px-4 py-8 sm:px-6">
        <CompanyForm action={createCompany} mode="create" />
      </main>
    </div>
  );
}
