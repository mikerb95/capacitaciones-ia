import Link from 'next/link';
import { AVAILABILITY_LABEL, AVAILABILITY_TONE, SIN_PLAN, type PlanInfo } from '@/lib/plans';
import type { Availability } from '@/db/schema';

/** El enlace a la ruta con un plan puesto. `null` es "todos los planes". */
export const rutaConPlan = (platform: string, plan: string | null, hash = '') =>
  `/ruta/${platform}?plan=${plan ?? SIN_PLAN}${hash}`;

/** El enlace a una lección arrastrando el plan con el que se está mirando. */
export const leccionConPlan = (platform: string, slug: string, plan: string | null) =>
  `/ruta/${platform}/${slug}?plan=${plan ?? SIN_PLAN}`;

export function InsigniaPlan({ availability }: { availability: Availability }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${AVAILABILITY_TONE[availability]}`}
    >
      {AVAILABILITY_LABEL[availability]}
    </span>
  );
}

type Props = {
  platform: string;
  planes: PlanInfo[];
  /** El elegido, o `null` cuando se está viendo el curso entero. */
  plan: string | null;
  /** El que guarda el código de acceso de la empresa, si lo hay. */
  contratado: string | null;
  /** Lecciones que quedan dentro del plan elegido, sobre el total del curso. */
  recorte: { dentro: number; total: number };
};

/**
 * Selector de plan del temario.
 *
 * La pregunta que responde es "de todo esto, ¿qué puedo usar yo mañana?". Con
 * un plan elegido el temario se recorta a lo que esa licencia habilita: nadie
 * dedica una tarde a Copilot en Excel si su plan no lo incluye. No es un
 * candado, es un filtro: se cambia de plan aquí mismo y se vuelve a ver todo.
 *
 * Son enlaces y no botones a propósito: el recorte se resuelve en el servidor,
 * así el enlace se puede pegar en un correo y quien lo abra ve exactamente el
 * mismo temario.
 */
export function SelectorPlan({ platform, planes, plan, contratado, recorte }: Props) {
  if (planes.length === 0) return null;

  const elegido = planes.find((p) => p.key === plan) ?? null;
  const fuera = recorte.total - recorte.dentro;

  return (
    <div className="rounded-card border border-line bg-surface p-5 shadow-card">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h3 className="font-display text-[16px] font-semibold tracking-tight">Filtra por tu plan</h3>
        <p className="text-[13px] text-muted">
          Se muestra solo lo que tu licencia te deja usar de verdad.
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2.5">
        <Opcion
          href={rutaConPlan(platform, null, '#temario')}
          activa={plan === null}
          titulo="Todos los planes"
          detalle="El curso completo"
        />
        {planes.map((p) => (
          <Opcion
            key={p.key}
            href={rutaConPlan(platform, p.key, '#temario')}
            activa={p.key === plan}
            titulo={p.name}
            detalle={p.price}
            etiqueta={p.key === contratado ? 'Tu plan' : undefined}
          />
        ))}
      </div>

      {elegido ? (
        <div className="mt-4 border-t border-line pt-4">
          <p className="text-[13.5px] leading-relaxed text-muted">
            Con <strong className="font-semibold text-text">{elegido.name}</strong> te quedan{' '}
            <strong className="font-semibold text-text">
              {recorte.dentro} de {recorte.total} lecciones
            </strong>
            {fuera > 0
              ? `. Quedaron fuera ${fuera}, de funciones que este plan no habilita.`
              : '. Tu plan cubre el curso entero.'}
          </p>
          {elegido.note && <p className="mt-1.5 text-[13px] leading-relaxed text-faint">{elegido.note}</p>}
        </div>
      ) : (
        <p className="mt-4 border-t border-line pt-4 text-[13.5px] leading-relaxed text-muted">
          Estás viendo el curso completo. Elige un plan y el temario se recorta a lo que esa licencia
          incluye.
        </p>
      )}
    </div>
  );
}

function Opcion({
  href,
  activa,
  titulo,
  detalle,
  etiqueta,
}: {
  href: string;
  activa: boolean;
  titulo: string;
  detalle: string;
  etiqueta?: string;
}) {
  return (
    <Link
      href={href}
      aria-current={activa ? 'true' : undefined}
      className={`rounded-card border px-4 py-2.5 transition-colors ${
        activa ? 'border-transparent bg-[var(--tone-soft)]' : 'border-line bg-surface hover:bg-surface-2'
      }`}
    >
      <span className="flex items-center gap-1.5 text-[13.5px] font-semibold">
        {activa && (
          <span className="size-1.5 flex-none rounded-full bg-[var(--tone)]" aria-hidden="true" />
        )}
        {titulo}
      </span>
      <span className="mt-0.5 flex items-center gap-1.5 text-[12px] text-faint">
        {detalle}
        {etiqueta && (
          <span className="rounded-full bg-surface-2 px-1.5 py-px text-[10.5px] font-semibold text-muted">
            {etiqueta}
          </span>
        )}
      </span>
    </Link>
  );
}
