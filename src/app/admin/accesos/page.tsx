import Link from 'next/link';
import { SiteHeader } from '@/components/ui';
import { Flag } from '@/components/flag';
import { getAccessCodes, type AccessCodeRow } from '@/db/queries';
import { countryOf, formatPhone, whatsappHref } from '@/lib/phone';
import { createAccessCode, deleteAccessCode, toggleAccessCode } from './actions';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Códigos de acceso · Academia IA' };

type Props = { searchParams: Promise<{ creado?: string; error?: string }> };

const fecha = new Intl.DateTimeFormat('es', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

function CodeCard({ code }: { code: AccessCodeRow }) {
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
              {code.label}
            </h2>
            {code.system && (
              <span className="inline-flex items-center rounded-full bg-primary-soft px-2 py-0.5 text-[11px] font-semibold text-primary">
                Reservado
              </span>
            )}
          </div>
          <p className="text-[12.5px] text-faint">
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
                className="font-mono text-[12.5px] text-muted transition-colors hover:text-primary"
              >
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
  const { creado, error } = await searchParams;
  const codes = await getAccessCodes();

  const message =
    error === 'repetido'
      ? 'Ese código ya existe. Elige otro o deja el campo vacío para que se sortee.'
      : error === 'formato'
        ? 'El código son exactamente 4 dígitos.'
        : error === 'reservado'
          ? 'Ese código está reservado para pruebas y no se puede asignar a una capacitación.'
          : creado
            ? `Código ${creado} creado y activo.`
            : null;

  return (
    <div className="min-h-screen bg-bg">
      <SiteHeader
        title="Códigos de acceso"
        subtitle="La llave que entregas al inicio de cada capacitación, con la lista de quienes entraron."
        back={{ href: '/admin', label: 'Administrar contenido' }}
      >
        <Link
          href="/admin/presentaciones"
          className="rounded-[10px] border border-line bg-surface px-3 py-2 text-[12.5px] font-medium text-muted transition-colors hover:border-primary hover:text-text"
        >
          Presentaciones
        </Link>
      </SiteHeader>

      <main className="mx-auto max-w-[900px] px-4 py-8 sm:px-6">
        {message && (
          <p
            className={`mb-5 rounded-[10px] px-4 py-2.5 text-[13px] ${
              error
                ? 'bg-[#fdebe2] text-[#c2410c] dark:bg-[#3a1e10] dark:text-[#f4a06a]'
                : 'bg-accent-soft text-accent'
            }`}
          >
            {message}
          </p>
        )}

        <form
          action={createAccessCode}
          className="mb-8 flex flex-wrap items-end gap-3 rounded-card border border-line bg-surface p-5 shadow-card"
        >
          <label className="flex min-w-[220px] flex-1 flex-col gap-1.5">
            <span className="text-[12.5px] font-medium text-muted">Nombre de la capacitación</span>
            <input
              name="label"
              required
              placeholder="Equipo comercial · agosto"
              className="w-full rounded-[10px] border border-line bg-surface px-3 py-2 text-[14px] outline-none focus:border-primary"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-[12.5px] font-medium text-muted">
              Código <span className="font-normal text-faint">opcional</span>
            </span>
            <input
              name="code"
              inputMode="numeric"
              maxLength={4}
              placeholder="0000"
              className="w-[110px] rounded-[10px] border border-line bg-surface px-3 py-2 text-center font-mono text-[18px] tracking-[0.25em] outline-none focus:border-primary"
            />
          </label>

          <button
            type="submit"
            className="rounded-[10px] bg-primary px-4 py-2.5 text-[13.5px] font-semibold text-white transition-opacity hover:opacity-90"
          >
            Crear código
          </button>
        </form>

        {codes.length === 0 ? (
          <p className="rounded-card border border-line bg-surface-2 p-5 text-[13.5px] leading-relaxed text-muted">
            Aún no hay códigos. Crea uno arriba: es lo que dictas al inicio de la sesión para que la
            gente pueda entrar al material.
          </p>
        ) : (
          <div className="flex flex-col gap-5">
            {codes.map((code) => (
              <CodeCard key={code.id} code={code} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
