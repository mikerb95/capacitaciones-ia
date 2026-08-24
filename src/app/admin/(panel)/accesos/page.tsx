import Link from 'next/link';
import { AdminAction, AdminPage } from '@/components/admin-page';
import { PlatformMark, ProgressBar } from '@/components/ui';
import { platformLogo } from '@/lib/brand-logos';
import {
  getAccessCodes,
  getComparison,
  getQuestionCounts,
  type AccessCodeRow,
} from '@/db/queries';
import { progressOf, scopeSetOf } from '@/lib/progress';
import { deleteAccessCode, toggleAccessCode } from './actions';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Capacitaciones · Academia IA' };

const ESTADOS = ['abiertas', 'cerradas', 'todas'] as const;
type Estado = (typeof ESTADOS)[number];

type Props = {
  searchParams: Promise<{ creado?: string; guardado?: string; estado?: string }>;
};

/** Qué plataformas toca el alcance, y cuántos módulos de cada una. */
type ModuleIndex = Map<number, string>;

function scopeByPlatform(code: AccessCodeRow, index: ModuleIndex, allIds: string[]) {
  if (code.scope.length === 0) {
    return allIds.map((id) => ({ platformId: id, count: 0 }));
  }

  const counts = new Map<string, number>();
  for (const { moduleId } of code.scope) {
    const platformId = index.get(moduleId);
    if (platformId) counts.set(platformId, (counts.get(platformId) ?? 0) + 1);
  }
  return [...counts.entries()].map(([platformId, count]) => ({ platformId, count }));
}

/** Celda del pie de la tarjeta: un rótulo chico y su valor. */
function Cell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="bg-surface px-5 py-2.5">
      <div className="mb-1 font-mono text-[11px] uppercase tracking-[0.07em] text-faint">
        {label}
      </div>
      {children}
    </div>
  );
}

function CodeCard({
  code,
  index,
  allPlatformIds,
  platformById,
  catalog,
  questions,
}: {
  code: AccessCodeRow;
  index: ModuleIndex;
  allPlatformIds: string[];
  platformById: Map<string, { initial: string; color: string; id: string; name: string }>;
  catalog: Set<number>;
  questions?: { total: number; open: number };
}) {
  const scopeIds = scopeSetOf(code.scope, catalog);
  const avance = progressOf(
    code.participants.flatMap((p) => p.views.map((v) => v.moduleId)),
    scopeIds,
  );
  const alcance = scopeByPlatform(code, index, allPlatformIds);

  return (
    <section
      className={`overflow-hidden rounded-card border border-line bg-surface shadow-card ${
        code.active ? '' : 'opacity-75'
      }`}
    >
      <div className="flex flex-wrap items-center gap-x-5 gap-y-3 px-5 py-4">
        <div className="min-w-[120px] flex-none">
          <div
            className={`break-all font-mono text-[18px] font-semibold tracking-[0.13em] ${
              code.active ? 'text-text' : 'text-faint line-through'
            }`}
          >
            {code.code}
          </div>
          <div className="mt-1 flex items-center gap-1.5">
            <span
              aria-hidden="true"
              className={`size-[7px] rounded-full ${code.active ? 'bg-accent' : 'bg-faint'}`}
            />
            <span className="text-[11.5px] text-muted">{code.active ? 'Abierta' : 'Cerrada'}</span>
          </div>
        </div>

        <div className="min-w-[220px] flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-display text-[15.5px] font-semibold tracking-tight">
              {code.company?.name ?? code.label}
            </h2>
            {code.contracted && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-2 py-0.5 text-[11px] font-semibold text-accent">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
                {code.contractor ? 'Tercerizada' : 'Bajo contrato'}
              </span>
            )}
          </div>
          {code.company && <p className="mt-0.5 text-[12.5px] text-muted">{code.label}</p>}
          <p className="mt-px truncate text-[12px] text-faint">
            {code.contractor ? `Contratada por ${code.contractor.name}` : null}
            {code.contractor && code.company?.industry ? ' · ' : null}
            {code.company?.industry}
          </p>
        </div>

        <div className="flex flex-none items-center gap-2">
          <form action={deleteAccessCode}>
            <input type="hidden" name="id" value={code.id} />
            <button
              type="submit"
              className="rounded-[10px] border border-line px-3 py-1.5 text-[12.5px] font-medium text-faint transition-colors hover:border-[#c2410c] hover:text-[#c2410c]"
            >
              Borrar
            </button>
          </form>
          <form action={toggleAccessCode}>
            <input type="hidden" name="id" value={code.id} />
            <button
              type="submit"
              className="rounded-[10px] border border-line px-3 py-1.5 text-[12.5px] font-medium text-muted transition-colors hover:border-primary hover:text-primary"
            >
              {code.active ? 'Cerrar' : 'Reabrir'}
            </button>
          </form>
          <Link
            href={`/admin/accesos/${code.id}`}
            className="rounded-[10px] bg-primary px-3 py-1.5 text-[12.5px] font-semibold text-white transition-opacity hover:opacity-90"
          >
            Abrir
          </Link>
        </div>
      </div>

      <div className="grid gap-px border-t border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
        <Cell label="Alcance">
          <div className="flex flex-wrap items-center gap-1.5">
            {alcance.map(({ platformId, count }) => {
              const p = platformById.get(platformId);
              return p ? (
                <span key={platformId} className="flex items-center gap-1">
                  <PlatformMark
                    initial={p.initial}
                    color={p.color}
                    size={22}
                    logo={platformLogo(p.id)}
                  />
                  {/* El desglose solo dice algo cuando hay más de una plataforma:
                      con una sola repetiría el total que va justo al lado. */}
                  {alcance.length > 1 && count > 0 && (
                    <span className="text-[11.5px] text-faint">{count}</span>
                  )}
                </span>
              ) : null;
            })}
            <span className="ml-1 text-[12.5px] text-muted">
              {code.scope.length === 0
                ? `todo el catálogo, ${scopeIds.size} módulos`
                : `${scopeIds.size} ${scopeIds.size === 1 ? 'módulo' : 'módulos'}`}
            </span>
          </div>
        </Cell>

        <Cell label="Plan contratado">
          {code.plans.length === 0 ? (
            <span className="text-[12.5px] text-faint">Sin plan declarado</span>
          ) : (
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[12.5px]">
              {code.plans.map((p) => (
                <span key={p.id}>
                  <span className="text-muted">
                    {platformById.get(p.platformId)?.name ?? p.platformId}
                  </span>{' '}
                  <span className="font-semibold">{p.plan.name}</span>
                </span>
              ))}
            </div>
          )}
        </Cell>

        <Cell label="Avance del grupo">
          <ProgressBar percent={avance.percent} width={96} />
        </Cell>

        <Cell label="Asistentes">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[12.5px]">
              {code.participants.length}{' '}
              {code.participants.length === 1 ? 'registrado' : 'registrados'}
            </span>
            {questions && questions.open > 0 ? (
              <span className="rounded-full bg-[#fdebe2] px-2 py-0.5 text-[11px] font-semibold text-[#c2410c] dark:bg-[#3a1e10] dark:text-[#f4a06a]">
                {questions.open} sin responder
              </span>
            ) : questions && questions.total > 0 ? (
              <span className="text-[12px] text-faint">
                {questions.total} {questions.total === 1 ? 'pregunta' : 'preguntas'}
              </span>
            ) : (
              <span className="text-[12px] text-faint">Sin preguntas</span>
            )}
          </div>
        </Cell>
      </div>
    </section>
  );
}

export default async function AccesosPage({ searchParams }: Props) {
  const { creado, guardado, estado: estadoRaw } = await searchParams;
  const estado: Estado = ESTADOS.includes(estadoRaw as Estado) ? (estadoRaw as Estado) : 'abiertas';

  const [codes, platforms] = await Promise.all([getAccessCodes(), getComparison()]);
  const questionCounts = await getQuestionCounts(codes.map((c) => c.id));

  const index: ModuleIndex = new Map(
    platforms.flatMap((p) => p.modules.map((m) => [m.id, p.id] as const)),
  );
  const catalog = new Set(index.keys());
  const platformById = new Map(platforms.map((p) => [p.id, p]));
  const allPlatformIds = platforms.map((p) => p.id);

  // El código de pruebas va aparte: no se cierra ni se borra, así que no tiene
  // sentido contarlo entre las abiertas ni ofrecerle las mismas acciones.
  const reservado = codes.find((c) => c.system);
  const reales = codes.filter((c) => !c.system);

  const abiertas = reales.filter((c) => c.active);
  const cerradas = reales.filter((c) => !c.active);
  const visibles = estado === 'abiertas' ? abiertas : estado === 'cerradas' ? cerradas : reales;

  const message = creado
    ? `Código ${creado} creado y activo.`
    : guardado
      ? `Código ${guardado} actualizado.`
      : null;

  const tabs: { estado: Estado; label: string; n: number }[] = [
    { estado: 'abiertas', label: 'Abiertas', n: abiertas.length },
    { estado: 'cerradas', label: 'Cerradas', n: cerradas.length },
    { estado: 'todas', label: 'Todas', n: reales.length },
  ];

  return (
    <AdminPage
      title="Capacitaciones"
      subtitle="La llave que entregas al inicio de cada capacitación, con quién la contrató, quién la recibe, su alcance y quienes entraron."
      max={1180}
      actions={
        <AdminAction href="/admin/accesos/nuevo" primary>
          Nueva capacitación
        </AdminAction>
      }
    >
      {message && (
        <p className="mb-5 rounded-[10px] bg-accent-soft px-4 py-2.5 text-[13px] text-accent">
          {message}
        </p>
      )}

      {reales.length === 0 ? (
        <p className="rounded-card border border-line bg-surface-2 p-5 text-[13.5px] leading-relaxed text-muted">
          Aún no hay códigos.{' '}
          <Link href="/admin/accesos/nuevo" className="font-medium text-primary">
            Crea el primero
          </Link>
          : es lo que dictas al inicio de la sesión para que la gente pueda entrar al material.
        </p>
      ) : (
        <>
          <div className="mb-5 flex w-fit gap-0.5 rounded-[11px] bg-surface-2 p-[3px]">
            {tabs.map((tab) => {
              const on = tab.estado === estado;
              return (
                <Link
                  key={tab.estado}
                  href={`/admin/accesos?estado=${tab.estado}`}
                  aria-current={on ? 'page' : undefined}
                  className={`rounded-[9px] px-3.5 py-1.5 text-[12.5px] transition-colors ${
                    on
                      ? 'bg-surface font-semibold text-text shadow-card'
                      : 'font-medium text-muted hover:text-text'
                  }`}
                >
                  {tab.label} <span className="font-mono text-[11.5px] text-faint">{tab.n}</span>
                </Link>
              );
            })}
          </div>

          {visibles.length === 0 ? (
            <p className="rounded-card border border-dashed border-line px-4 py-10 text-center text-[13.5px] text-faint">
              No hay capacitaciones {estado} ahora mismo.
            </p>
          ) : (
            <div className="flex flex-col gap-4">
              {visibles.map((code) => (
                <CodeCard
                  key={code.id}
                  code={code}
                  index={index}
                  allPlatformIds={allPlatformIds}
                  platformById={platformById}
                  catalog={catalog}
                  questions={questionCounts.get(code.id)}
                />
              ))}
            </div>
          )}

          {reservado && (
            <section className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 rounded-card border border-line bg-surface-2 px-5 py-4">
              <span className="min-w-[120px] flex-none font-mono text-[18px] font-semibold tracking-[0.13em]">
                {reservado.code}
              </span>
              <div className="min-w-[220px] flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="font-display text-[14.5px] font-semibold tracking-tight">
                    Código de pruebas
                  </h2>
                  <span className="rounded-full bg-primary-soft px-2 py-0.5 text-[11px] font-semibold text-primary">
                    Reservado
                  </span>
                </div>
                <p className="mt-0.5 text-[12px] text-faint">
                  Abre el catálogo completo. No se cierra, no se borra y no puede asignarse a una
                  capacitación real.
                </p>
              </div>
              <Link
                href={`/admin/accesos/${reservado.id}`}
                className="rounded-[10px] border border-line bg-surface px-3 py-1.5 text-[12.5px] font-medium text-muted transition-colors hover:border-primary hover:text-text"
              >
                Ver alcance
              </Link>
            </section>
          )}
        </>
      )}
    </AdminPage>
  );
}
