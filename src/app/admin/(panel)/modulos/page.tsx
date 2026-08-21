import Link from 'next/link';
import { AdminAction, AdminPage } from '@/components/admin-page';
import { Abbr, LevelBadge, PlatformMark, StatusBadge } from '@/components/ui';
import { moduleLogo, platformLogo } from '@/lib/brand-logos';
import { getComparison } from '@/db/queries';
import { moveModule } from '../actions';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Módulos y portales · Academia IA' };

function MoveButton({ id, direction }: { id: number; direction: 'up' | 'down' }) {
  return (
    <form action={moveModule}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="direction" value={direction} />
      <button
        type="submit"
        aria-label={direction === 'up' ? 'Subir' : 'Bajar'}
        className="grid size-7 place-items-center rounded-md border border-line text-faint transition-colors hover:border-primary hover:text-primary"
      >
        {direction === 'up' ? '↑' : '↓'}
      </button>
    </form>
  );
}

export default async function AdminPage() {
  const platforms = await getComparison();

  return (
    <div className="min-h-screen bg-bg">
      <SiteHeader
        title="Administrar contenido"
        subtitle="Edita los módulos sin tocar el seed. Los cambios se ven de una en la comparativa."
        back={{ href: '/', label: 'Volver a la comparativa' }}
      >
        <Link
          href="/admin/accesos"
          className="rounded-[10px] border border-line bg-surface px-3 py-2 text-[12.5px] font-medium text-muted transition-colors hover:border-primary hover:text-text"
        >
          Códigos de acceso
        </Link>
        <Link
          href="/admin/empresas"
          className="rounded-[10px] border border-line bg-surface px-3 py-2 text-[12.5px] font-medium text-muted transition-colors hover:border-primary hover:text-text"
        >
          Empresas
        </Link>
        <Link
          href="/admin/presentaciones"
          className="rounded-[10px] border border-line bg-surface px-3 py-2 text-[12.5px] font-medium text-muted transition-colors hover:border-primary hover:text-text"
        >
          Presentaciones
        </Link>
        <Link
          href="/admin/modules/new"
          className="rounded-[10px] bg-primary px-3 py-2 text-[12.5px] font-semibold text-white transition-opacity hover:opacity-90"
        >
          Nuevo módulo
        </Link>
        <AdminLogoutButton />
      </SiteHeader>

      <main className="mx-auto max-w-[1100px] px-4 py-8 sm:px-6">
        <div className="mb-6 rounded-card border border-line bg-surface-2 p-4 text-[13px] leading-relaxed text-muted">
          Para cambios grandes o para dejar el contenido versionado,
          sigue usando los archivos de <code className="font-mono text-[12.5px]">src/db/seed</code> y
          corriendo <code className="font-mono text-[12.5px]">npm run db:seed</code>: el seed hace
          upsert por plataforma y slug, así que no duplica nada.
        </div>

        <div className="flex flex-col gap-8">
          {platforms.map((platform) => (
            <section key={platform.id}>
              <div className="mb-3 flex items-center gap-3">
                <PlatformMark
                  initial={platform.initial}
                  color={platform.color}
                  size={30}
                  logo={platformLogo(platform.id)}
                />
                <h2 className="font-display text-[17px] font-semibold tracking-tight">
                  {platform.name}
                </h2>
                <StatusBadge status={platform.status} />
                <span className="text-[12.5px] text-faint">
                  {platform.modules.length} módulos
                </span>
              </div>

              <div className="overflow-hidden rounded-card border border-line bg-surface shadow-card">
                {platform.modules.map((m, i) => (
                  <div
                    key={m.id}
                    className="flex flex-wrap items-center gap-3 border-b border-line px-4 py-3 last:border-0"
                  >
                    <Abbr abbr={m.abbr} color={m.color} logo={moduleLogo(platform.id, m.slug)} />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-display text-[14.5px] font-semibold tracking-tight">
                          {m.name}
                        </span>
                        <LevelBadge level={m.level} />
                        {m.status === 'borrador' && <StatusBadge status="borrador" />}
                      </div>
                      <p className="truncate text-[12.5px] text-faint">{m.summary}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {i > 0 && <MoveButton id={m.id} direction="up" />}
                      {i < platform.modules.length - 1 && (
                        <MoveButton id={m.id} direction="down" />
                      )}
                      <Link
                        href={`/${platform.id}/${m.slug}`}
                        className="rounded-md border border-line px-2.5 py-1 text-[12.5px] text-muted transition-colors hover:border-primary hover:text-primary"
                      >
                        Ver
                      </Link>
                      <Link
                        href={`/admin/modules/${m.id}`}
                        className="rounded-md bg-surface-2 px-2.5 py-1 text-[12.5px] font-medium text-text transition-colors hover:bg-primary-soft hover:text-primary"
                      >
                        Editar
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
