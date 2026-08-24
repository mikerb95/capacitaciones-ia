import Link from 'next/link';
import { AdminAction, AdminPage } from '@/components/admin-page';
import { PlatformMark, ProgressBar } from '@/components/ui';
import { platformLogo } from '@/lib/brand-logos';
import {
  getAccessCodes,
  getCompanies,
  getComparison,
  getModuleCounts,
  getQuestionCounts,
  getRecentQuestions,
  type AccessCodeRow,
  type CompanyRow,
} from '@/db/queries';
import { progressOf, scopeSetOf } from '@/lib/progress';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Panel · Academia IA' };

const DIA = new Intl.DateTimeFormat('es', { day: '2-digit', month: 'short', year: 'numeric' });

/**
 * El reloj se lee una sola vez por petición y desde fuera del render: leerlo
 * durante el render es impuro, y además así toda la pantalla habla del mismo
 * instante y no de tres microsegundos distintos.
 */
async function leerReloj() {
  return new Date();
}

/** Cuánto hace, en la unidad más grande que todavía dice algo. */
function hace(date: Date, ahora: Date) {
  const min = Math.round((ahora.getTime() - date.getTime()) / 60000);
  if (min < 1) return 'recién';
  if (min < 60) return `hace ${min} min`;
  const h = Math.round(min / 60);
  if (h < 24) return `hace ${h} h`;
  const d = Math.round(h / 24);
  if (d < 30) return `hace ${d} ${d === 1 ? 'día' : 'días'}`;
  return DIA.format(date);
}

const CUANDO = new Intl.DateTimeFormat('es', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  hour: '2-digit',
  minute: '2-digit',
});

/**
 * Cuándo se dicta, dicho como lo diría una persona: hoy y mañana por su
 * nombre, el resto con la fecha entera. Compara días del calendario, no horas,
 * que es lo que hace que una sesión de las 09:00 de mañana siga siendo mañana
 * a las 23:00 de hoy.
 */
function cuando(sessionAt: Date, ahora: Date) {
  const dia = (d: Date) => Math.floor((d.getTime() - d.getTimezoneOffset() * 60000) / 86400000);
  const faltan = dia(sessionAt) - dia(ahora);
  const hora = sessionAt.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' });

  if (faltan === 0) return `Hoy a las ${hora}`;
  if (faltan === 1) return `Mañana a las ${hora}`;
  return CUANDO.format(sessionAt);
}

const dias = (n: number) => `${n} ${n === 1 ? 'día' : 'días'}`;
const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

/* ------------------------------------------------------------------ datos */

type ModuleIndex = Map<number, { platformId: string }>;

/** Las plataformas que toca el alcance de una capacitación, sin repetir. */
function platformsOf(code: AccessCodeRow, index: ModuleIndex, all: string[]) {
  if (code.scope.length === 0) return all;
  const ids = new Set<string>();
  for (const { moduleId } of code.scope) {
    const info = index.get(moduleId);
    if (info) ids.add(info.platformId);
  }
  return [...ids];
}

function progressOfCode(code: AccessCodeRow, catalog: Set<number>) {
  const scope = scopeSetOf(code.scope, catalog);
  return progressOf(
    code.participants.flatMap((p) => p.views.map((v) => v.moduleId)),
    scope,
  );
}

/** Cuándo se vio movimiento por última vez en esta capacitación. */
function lastActivity(code: AccessCodeRow) {
  return code.participants.reduce((max, p) => Math.max(max, p.lastSeenAt.getTime()), 0);
}

/** Capacitaciones dictadas a nombre de la empresa, propias e intermediadas. */
function sessionsUsed(company: CompanyRow) {
  return (
    company.accessCodes.filter((c) => c.contracted).length +
    company.brokeredCodes.filter((c) => c.contracted).length
  );
}

type Pending = {
  key: string;
  tone: string;
  title: string;
  detail: string;
  href: string;
  action: string;
};

/* --------------------------------------------------------------- pantalla */

export default async function AdminHomePage() {
  const [codes, platforms, companies, moduleCounts, recientes, ahora] = await Promise.all([
    getAccessCodes(),
    getComparison(),
    getCompanies(),
    getModuleCounts(),
    getRecentQuestions(6),
    leerReloj(),
  ]);

  const questionCounts = await getQuestionCounts(codes.map((c) => c.id));

  const index: ModuleIndex = new Map(
    platforms.flatMap((p) => p.modules.map((m) => [m.id, { platformId: p.id }] as const)),
  );
  const catalog = new Set(index.keys());
  const platformById = new Map(platforms.map((p) => [p.id, p]));
  const allPlatformIds = platforms.map((p) => p.id);

  const abiertas = codes.filter((c) => c.active && !c.system);

  // Manda la que viene: la fecha más cercana que todavía no pasó. Las de
  // autoservicio no tienen fecha, así que si no hay ninguna agendada se cae a
  // la que tuvo movimiento más reciente, y si nadie ha entrado, a la más nueva.
  const agendadas = abiertas
    .filter((c) => c.sessionAt && c.sessionAt.getTime() >= ahora.getTime())
    .sort((a, b) => a.sessionAt!.getTime() - b.sessionAt!.getTime());

  const destacada =
    agendadas[0] ??
    [...abiertas].sort(
      (a, b) => lastActivity(b) - lastActivity(a) || b.createdAt.getTime() - a.createdAt.getTime(),
    )[0];

  const preguntasAbiertas = [...questionCounts.values()].reduce((n, q) => n + q.open, 0);
  const capacitadoras = companies.filter((c) => c.kind !== 'cliente').length;

  /* -------------------------------------------------------- pendientes */

  const pendientes: Pending[] = [];

  if (preguntasAbiertas > 0) {
    const conPreguntas = abiertas.filter((c) => (questionCounts.get(c.id)?.open ?? 0) > 0);
    pendientes.push({
      key: 'preguntas',
      tone: 'bg-[#c2410c] dark:bg-[#f4a06a]',
      title: `${plural(preguntasAbiertas, 'pregunta sin responder', 'preguntas sin responder')}`,
      detail:
        conPreguntas.map((c) => c.company?.name ?? c.label).join(', ') ||
        'En capacitaciones ya cerradas',
      href: conPreguntas.length === 1 ? `/admin/accesos/${conPreguntas[0].id}` : '/admin/accesos',
      action: 'Responder',
    });
  }

  for (const company of companies) {
    if (!company.materialsUntil) continue;
    const restan = Math.ceil((company.materialsUntil.getTime() - ahora.getTime()) / 86400000);
    if (restan > 30) continue;
    pendientes.push({
      key: `material-${company.id}`,
      tone: 'bg-[#c2410c] dark:bg-[#f4a06a]',
      title:
        restan < 0
          ? `El material a medida de ${company.name} está vencido`
          : `El material a medida de ${company.name} vence en ${dias(restan)}`,
      detail: `Vigente hasta el ${DIA.format(company.materialsUntil)}. Vencido, el portal sirve el genérico.`,
      href: `/admin/empresas/${company.id}`,
      action: 'Abrir',
    });
  }

  for (const company of companies) {
    if (!company.contractSessions) continue;
    const restan = company.contractSessions - sessionsUsed(company);
    if (restan > 1) continue;
    pendientes.push({
      key: `contrato-${company.id}`,
      tone: 'bg-primary',
      title:
        restan <= 0
          ? `${company.name} agotó las capacitaciones de su contrato`
          : `A ${company.name} le queda 1 de ${company.contractSessions} capacitaciones`,
      detail: [company.contractRef, company.contractEnd && `hasta el ${DIA.format(company.contractEnd)}`]
        .filter(Boolean)
        .join(' · ') || 'Sin referencia de contrato',
      href: `/admin/empresas/${company.id}`,
      action: 'Ver contrato',
    });
  }

  if (moduleCounts.draft > 0) {
    pendientes.push({
      key: 'borradores',
      tone: 'bg-faint',
      title: `${plural(moduleCounts.draft, 'módulo sigue', 'módulos siguen')} en borrador`,
      detail: 'No se ven en el portal ni entran en ningún alcance.',
      href: '/admin/modulos',
      action: 'Editar',
    });
  }

  /* --------------------------------------------------------- actividad */

  const actividad = [
    ...codes.flatMap((c) =>
      c.participants.map((p) => ({
        at: p.createdAt,
        text: `${p.name ?? 'Alguien'} entró con ${c.code}`,
        sub: c.company?.name ?? c.label,
      })),
    ),
    ...recientes.map((q) => ({
      at: q.createdAt,
      text: q.status === 'abierta' ? 'Nueva pregunta sin responder' : 'Se respondió una pregunta',
      sub: `${q.accessCode.company?.name ?? q.accessCode.label} · ${
        q.anonymous ? 'anónima' : (q.name ?? 'sin firmar')
      }`,
    })),
  ]
    .sort((a, b) => b.at.getTime() - a.at.getTime())
    .slice(0, 6);

  /* ------------------------------------------------------------ cifras */

  const cifras = [
    {
      n: abiertas.length,
      label: plural(abiertas.length, 'capacitación abierta', 'capacitaciones abiertas'),
      sub: `${abiertas.filter((c) => c.contracted).length} bajo contrato`,
    },
    {
      n: companies.length,
      label: plural(companies.length, 'empresa', 'empresas'),
      sub: capacitadoras > 0 ? `${capacitadoras} capacitadoras` : 'todas clientes',
    },
    {
      n: preguntasAbiertas,
      label: plural(preguntasAbiertas, 'pregunta sin responder', 'preguntas sin responder'),
      sub: `de ${plural(codes.length, 'capacitación', 'capacitaciones')}`,
    },
    {
      n: moduleCounts.published,
      label: plural(moduleCounts.published, 'módulo publicado', 'módulos publicados'),
      sub: moduleCounts.draft > 0 ? `${moduleCounts.draft} en borrador` : 'ninguno en borrador',
    },
  ];

  return (
    <AdminPage
      title="Panel"
      subtitle={DIA.format(ahora)}
      max={1180}
      actions={
        <>
          <AdminAction href="/admin/empresas/nueva">Nueva empresa</AdminAction>
          <AdminAction href="/admin/accesos/nuevo" primary>
            Nueva capacitación
          </AdminAction>
        </>
      }
    >
      <div className="flex flex-col gap-6">
        {/* -------------------------------------------------- destacada */}
        {destacada ? (
          <section className="flex flex-wrap items-center gap-x-7 gap-y-5 rounded-card border border-line bg-[color-mix(in_srgb,var(--primary)_5%,var(--surface))] px-6 py-5 shadow-card">
            <div className="min-w-[240px] flex-1">
              <div className="mb-2 flex items-center gap-2">
                <span aria-hidden="true" className="size-[7px] rounded-full bg-accent" />
                <span className="text-[12px] font-semibold text-muted">
                  {destacada.participants.length > 0
                    ? `Con movimiento ${hace(new Date(lastActivity(destacada)), ahora)}`
                    : 'Abierta, todavía sin nadie dentro'}
                </span>
              </div>
              <h2 className="font-display text-[24px] font-semibold leading-tight tracking-tight">
                {destacada.company?.name ?? destacada.label}
              </h2>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-[13px] text-muted">
                {platformsOf(destacada, index, allPlatformIds).map((id) => {
                  const p = platformById.get(id);
                  return p ? (
                    <PlatformMark
                      key={id}
                      initial={p.initial}
                      color={p.color}
                      size={20}
                      logo={platformLogo(p.id)}
                    />
                  ) : null;
                })}
                <span>
                  {destacada.company ? `${destacada.label} · ` : ''}
                  {plural(
                    scopeSetOf(destacada.scope, catalog).size,
                    'módulo en alcance',
                    'módulos en alcance',
                  )}
                </span>
                {destacada.contracted && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-2 py-0.5 text-[11px] font-semibold text-accent">
                    {destacada.contractor ? 'Tercerizada' : 'Bajo contrato'}
                  </span>
                )}
              </div>
            </div>

            <div className="flex-none text-center">
              <div className="mb-1 font-mono text-[11px] uppercase tracking-[0.07em] text-faint">
                Código
              </div>
              <div className="font-mono text-[25px] font-semibold tracking-[0.13em]">
                {destacada.code}
              </div>
              <div className="mt-1.5 text-[12px] text-faint">
                {plural(destacada.participants.length, 'registrado', 'registrados')}
              </div>
            </div>

            <div className="flex flex-none flex-col gap-2">
              <Link
                href={`/admin/accesos/${destacada.id}`}
                className="rounded-[10px] bg-primary px-3.5 py-2 text-center text-[12.5px] font-semibold text-white transition-opacity hover:opacity-90"
              >
                Abrir la capacitación
              </Link>
              <Link
                href="/admin/presentaciones"
                className="rounded-[10px] border border-line bg-surface px-3.5 py-2 text-center text-[12.5px] font-medium text-muted transition-colors hover:border-primary hover:text-text"
              >
                Presentaciones
              </Link>
            </div>
          </section>
        ) : (
          <section className="rounded-card border border-line bg-surface-2 p-5 text-[13.5px] leading-relaxed text-muted">
            No hay ninguna capacitación abierta.{' '}
            <Link href="/admin/accesos/nuevo" className="font-medium text-primary">
              Crea un código
            </Link>{' '}
            y quien entre con él verá el portal con el alcance que le des.
          </section>
        )}

        {/* ----------------------------------------------------- cifras */}
        <section className="grid grid-cols-2 gap-px overflow-hidden rounded-card border border-line bg-line lg:grid-cols-4">
          {cifras.map((c) => (
            <div key={c.label} className="bg-surface px-5 py-4">
              <div className="font-display text-[27px] font-semibold leading-none tracking-tight">
                {c.n}
              </div>
              <div className="mt-1.5 text-[13px]">{c.label}</div>
              <div className="mt-0.5 text-[11.5px] text-faint">{c.sub}</div>
            </div>
          ))}
        </section>

        {/* ------------------------------------- pendientes y actividad */}
        <section className="grid items-start gap-5 lg:grid-cols-[1.12fr_1fr]">
          <div className="overflow-hidden rounded-card border border-line bg-surface shadow-card">
            <div className="flex items-center gap-3 border-b border-line px-[18px] py-3.5">
              <h2 className="font-display text-[14px] font-semibold tracking-tight">
                Requiere tu atención
              </h2>
              {pendientes.length > 0 && (
                <span className="rounded-full bg-[#fdebe2] px-2 py-0.5 text-[11px] font-semibold text-[#c2410c] dark:bg-[#3a1e10] dark:text-[#f4a06a]">
                  {pendientes.length}
                </span>
              )}
            </div>

            {pendientes.length === 0 ? (
              <p className="px-[18px] py-6 text-[13px] leading-relaxed text-faint">
                Nada pendiente: no hay preguntas sin responder, ningún material a medida por vencer
                ni módulos en borrador.
              </p>
            ) : (
              pendientes.map((p) => (
                <div
                  key={p.key}
                  className="flex items-center gap-3 border-b border-line px-[18px] py-3 last:border-0"
                >
                  <span aria-hidden="true" className={`size-[7px] flex-none rounded-full ${p.tone}`} />
                  <div className="min-w-0 flex-1">
                    <div className="text-[13.5px] font-medium leading-snug">{p.title}</div>
                    <div className="mt-0.5 truncate text-[12px] text-faint">{p.detail}</div>
                  </div>
                  <Link
                    href={p.href}
                    className="flex-none rounded-[10px] bg-surface-2 px-3 py-1.5 text-[12.5px] font-medium text-text transition-colors hover:bg-primary-soft hover:text-primary"
                  >
                    {p.action}
                  </Link>
                </div>
              ))
            )}
          </div>

          <div className="overflow-hidden rounded-card border border-line bg-surface shadow-card">
            <div className="border-b border-line px-[18px] py-3.5">
              <h2 className="font-display text-[14px] font-semibold tracking-tight">
                Actividad reciente
              </h2>
            </div>
            {actividad.length === 0 ? (
              <p className="px-[18px] py-6 text-[13px] leading-relaxed text-faint">
                Todavía no hay movimiento. Aquí van a aparecer los ingresos con código y las
                preguntas, en cuanto empiece la primera capacitación.
              </p>
            ) : (
              <div className="px-[18px] py-2.5">
                {actividad.map((a, i) => (
                  <div key={`${a.at.getTime()}-${i}`} className="flex gap-3.5 py-2">
                    <span className="w-[62px] flex-none pt-px font-mono text-[11.5px] text-faint">
                      {hace(a.at, ahora)}
                    </span>
                    <div className="min-w-0">
                      <div className="text-[13px] leading-snug">{a.text}</div>
                      <div className="mt-px truncate text-[11.5px] text-faint">{a.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ------------------------------------------ capacitaciones abiertas */}
        {abiertas.length > 0 && (
          <section className="overflow-hidden rounded-card border border-line bg-surface shadow-card">
            <div className="flex items-center gap-3 border-b border-line px-[18px] py-3.5">
              <h2 className="font-display text-[14px] font-semibold tracking-tight">
                Capacitaciones abiertas
              </h2>
              <div className="flex-1" />
              <Link href="/admin/accesos" className="text-[12.5px] font-medium text-primary">
                Ver todas
              </Link>
            </div>

            {abiertas.map((code) => {
              const { percent } = progressOfCode(code, catalog);
              const preguntas = questionCounts.get(code.id);

              return (
                <div
                  key={code.id}
                  className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-line px-[18px] py-3 last:border-0"
                >
                  <span className="w-[124px] flex-none font-mono text-[13.5px] font-semibold tracking-[0.11em]">
                    {code.code}
                  </span>

                  <div className="min-w-[180px] flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[13.5px] font-semibold">
                        {code.company?.name ?? code.label}
                      </span>
                      {code.contracted && (
                        <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[11px] font-semibold text-accent">
                          Contrato
                        </span>
                      )}
                    </div>
                    {code.company && (
                      <div className="mt-px truncate text-[11.5px] text-faint">{code.label}</div>
                    )}
                  </div>

                  <div className="flex flex-none items-center gap-1.5">
                    {platformsOf(code, index, allPlatformIds).map((id) => {
                      const p = platformById.get(id);
                      return p ? (
                        <PlatformMark
                          key={id}
                          initial={p.initial}
                          color={p.color}
                          size={22}
                          logo={platformLogo(p.id)}
                        />
                      ) : null;
                    })}
                  </div>

                  <ProgressBar percent={percent} width={88} />

                  <span className="w-[86px] flex-none font-mono text-[12.5px] text-muted">
                    {code.participants.length}
                  </span>

                  <span className="w-[104px] flex-none">
                    {preguntas && preguntas.open > 0 ? (
                      <span className="rounded-full bg-[#fdebe2] px-2 py-0.5 text-[11px] font-semibold text-[#c2410c] dark:bg-[#3a1e10] dark:text-[#f4a06a]">
                        {preguntas.open} sin responder
                      </span>
                    ) : (
                      <span className="text-[12px] text-faint">Ninguna</span>
                    )}
                  </span>

                  <Link
                    href={`/admin/accesos/${code.id}`}
                    className="flex-none rounded-[10px] bg-surface-2 px-3 py-1.5 text-[12.5px] font-medium text-text transition-colors hover:bg-primary-soft hover:text-primary"
                  >
                    Abrir
                  </Link>
                </div>
              );
            })}
          </section>
        )}
      </div>
    </AdminPage>
  );
}
