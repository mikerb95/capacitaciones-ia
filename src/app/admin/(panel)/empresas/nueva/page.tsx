import { AdminPage } from '@/components/admin-page';
import { CompanyForm } from '@/components/company-form';
import { createCompany } from '../actions';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Nueva empresa · Academia IA' };

export default function NuevaEmpresaPage() {
  return (
    <AdminPage
      title="Nueva empresa"
      subtitle="El contrato bajo el que dictas para ellos y quién responde de su lado. La clave de su panel se genera sola."
      back={{ href: '/admin/empresas', label: 'Empresas' }}
      max={900}
    >
      <CompanyForm action={createCompany} mode="create" />
    </AdminPage>
  );
}
