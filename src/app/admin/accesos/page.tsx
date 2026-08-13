import Link from 'next/link';
import { AdminLogoutButton } from '@/components/admin-logout-button';
import { SiteHeader } from '@/components/ui';
import { Flag } from '@/components/flag';
import { getAccessCodes, getComparison, type AccessCodeRow } from '@/db/queries';
import { countryOf, formatPhone, whatsappHref } from '@/lib/phone';
import { deleteAccessCode, toggleAccessCode } from './actions';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Códigos de acceso · Academia IA' };

type Props = { searchParams: Promise<{ creado?: string; guardado?: string }> };

const fecha = new Intl.DateTimeFormat('es', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

/** Cuántos módulos de cada plataforma quedaron dentro del alcance. */
type ScopeIndex = Map<number, { platform: string; color: string }>;

function scopeSummary(code: AccessCodeRow, index: ScopeIndex, totalModules: number) {
  if (code.scope.length === 0) {
    return { full: true as const, total: totalModules, byPlatform: [] };
  }

  const counts = new Map<string, { color: string; count: number }>();
  for (const { moduleId } of code.scope) {
    const info = index.get(moduleId);
    if (!info) continue;
    const entry = counts.get(info.platform) ?? { color: info.color, count: 0 };
    entry.count += 1;
    counts.set(info.platform, entry);
  }

  return {
    full: false as const,
    total: code.scope.length,
    byPlatform: [...counts.entries()].map(([platform, { color, count }]) => ({
      platform,
      color,
      count,
    })),
  };
}

function CodeCard({
  code,
  index,
  totalModules,
}: {
  code: AccessCodeRow;
  index: ScopeIndex;
  totalModules: number;
}) {
  const scope = scopeSummary(code, index, totalModules);

  return (
    <section className="overflow-hidden rounded-card border border-line bg-surface shadow-card">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-3 border-b border-line px-5 py-4">
        <span
          className={`font-mono text-[28px] font-semibold tracking-[0.2em] ${
            code.active ? 'text-text' : 'text-faint line-through'
          }`}
        >
          {code.code}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="truncate font-display text-[15.5px] font-semibold tracking-tight">
              {code.company ?? code.label}
            </h2>
            {code.system && (
              <span className="inline-flex items-center rounded-full bg-primary-soft px-2 py-0.5 text-[11px] font-semibold text-primary">
                Reservado
              </span>
            )}
          </div>
          <p className="truncate text-[12.5px] text-faint">
            {code.company ? `${code.label} · ` : ''}
            {code.active ? 'Activo' : 'Cerrado'} · {code.participants.length}{' '}
            {code.participants.length === 1 ? 'registrado' : 'registrados'}
          </p>
        </div>

        {code.system ? (
          <span className="max-w-[240px] text-right text-[12px] leading-relaxed text-faint">
            Código de pruebas. No se cierra ni se borra, y no puede asignarse a una capacitación.
          </span>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              href={`/admin/accesos/${code.id}`}
              className="rounded-[10px] bg-surface-2 px-3 py-1.5 text-[12.5px] font-medium text-text transition-colors hover:bg-primary-soft hover:text-primary"
            >
              Editar
            </Link>
            <form action={toggleAccessCode}>
              <input type="hidden" name="id" value={code.id} />
              <button
                type="submit"
                className="rounded-[10px] border border-line px-3 py-1.5 text-[12.5px] font-medium text-muted transition-colors hover:border-primary hover:text-primary"
              >
                {code.active ? 'Cerrar' : 'Reabrir'}
              </button>
            </form>
            <form action={deleteAccessCode}>
              <input type="hidden" name="id" value={code.id} />
              <button
                type="submit"
                className="rounded-[10px] border border-line px-3 py-1.5 text-[12.5px] font-medium text-faint transition-colors hover:border-[#c2410c] hover:text-[#c2410c]"
              >
                Borrar
              </button>
            </form>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-line bg-surface-2 px-5 py-3">
        <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-faint">
          Alcance
        </span>
        {scope.full ? (
          <span className="text-[12.5px] text-muted">
            Todo el catálogo · {scope.total} módulos
          </span>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            {scope.byPlatform.map((p) => (
              <span
                key={p.platform}
                className="inline-flex items-center gap-1.5 rounded-full bg-surface px-2.5 py-0.5 text-[12px] text-muted"
              >
                <span
                  aria-hidden="true"
                  className="size-2 rounded-full"
                  style={{ background: p.color }}
                />
                {p.platform}
                <span className="text-faint">{p.count}</span>
              </span>
            ))}
            <span className="text-[12px] text-faint">{scope.total} módulos en total</span>
          </div>
        )}

        {(code.industry || code.contactName || code.contactEmail) && (
          <span className="ml-auto truncate text-[12px] text-faint">
            {[code.industry, code.contactName, code.contactEmail].filter(Boolean).join(' · ')}
          </span>
        )}
      </div>

      {code.participants.length === 0 ? (
        <p className="px-5 py-4 text-[13px] text-faint">
          Todavía no entra nadie con este código.
        </p>
      ) : (
        <ul>
          {code.participants.map((p) => (
            <li
              key={p.id}
              className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-line px-5 py-3 last:border-0"
            >
              <span className="min-w-0 flex-1 truncate text-[14px] font-medium">{p.name}</span>
              <a
                href={whatsappHref(p.phone)}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 font-mono text-[12.5px] text-muted transition-colors hover:text-primary"
              >
                {countryOf(p.phone) && (
                  <Flag code={countryOf(p.phone)!} className="h-3 w-4 shrink-0 rounded-[2px] object-cover" />
                )}
                {formatPhone(p.phone)}
              </a>
              <span className="text-[12px] text-faint">{fecha.format(p.createdAt)}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default async function AccesosPage({ searchParams }: Props) {
  const { creado, guardado } = await searchParams;
  const [codes, platforms] = await Promise.all([getAccessCodes(), getComparison()]);

  const index: ScopeIndex = new Map();
  for (const platform of platforms) {
    for (const m of platform.modules) {
      index.set(m.id, { platform: platform.name, color: platform.color });
    }
  }
  const totalModules = index.size;

  const message = creado
    ? `PIN ${creado} creado y activo.`
    : guardado
      ? `PIN ${guardado} actualizado.`
      : null;

  return (
    <div className="min-h-screen bg-bg">
      <SiteHeader
        title="Códigos de acceso"
        subtitle="La llave que entregas al inicio de cada capacitación, con su empresa, su alcance y quienes entraron."
        back={{ href: '/admin', label: 'Administrar contenido' }}
      >
        <Link
          href="/admin/presentaciones"
          className="rounded-[10px] border border-line bg-surface px-3 py-2 text-[12.5px] font-medium text-muted transition-colors hover:border-primary hover:text-text"
        >
          Presentaciones
        </Link>
        <Link
          href="/admin/accesos/nuevo"
          className="rounded-[10px] bg-primary px-3 py-2 text-[12.5px] font-semibold text-white transition-opacity hover:opacity-90"
        >
          Nuevo PIN
        </Link>
        <AdminLogoutButton />
      </SiteHeader>

      <main className="mx-auto max-w-[900px] px-4 py-8 sm:px-6">
        {message && (
          <p className="mb-5 rounded-[10px] bg-accent-soft px-4 py-2.5 text-[13px] text-accent">
            {message}
          </p>
        )}

        {codes.length === 0 ? (
          <p className="rounded-card border border-line bg-surface-2 p-5 text-[13.5px] leading-relaxed text-muted">
            Aún no hay códigos.{' '}
            <Link href="/admin/accesos/nuevo" className="font-medium text-primary">
              Crea el primero
            </Link>
            : es lo que dictas al inicio de la sesión para que la gente pueda entrar al material.
          </p>
        ) : (
          <div className="flex flex-col gap-5">
            {codes.map((code) => (
              <CodeCard key={code.id} code={code} index={index} totalModules={totalModules} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
