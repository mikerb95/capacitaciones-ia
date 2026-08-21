import { AdminNavStrip, AdminSidebar } from '@/components/admin-nav';
import { getAdminNavCounts } from '@/db/queries';

export const dynamic = 'force-dynamic';

/**
 * Armazón del panel: sidebar fijo a la izquierda y la pantalla a la derecha.
 *
 * Vive en un grupo de rutas y no en `/admin` a secas para que el login quede
 * fuera: quien no ha entrado no tiene por qué ver la navegación de lo que
 * todavía no puede abrir. El grupo no aparece en la URL.
 */
export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const counts = await getAdminNavCounts();

  return (
    <div className="flex min-h-screen bg-bg">
      <AdminSidebar counts={counts} />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminNavStrip counts={counts} />
        {children}
      </div>
    </div>
  );
}
