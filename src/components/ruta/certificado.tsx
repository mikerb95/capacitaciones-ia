'use client';

import { useState } from 'react';

type Props = {
  nombreInicial: string;
  curso: string;
  capacitacion: string;
  fecha: string;
  folio: string;
  horas: string;
  niveles: { titulo: string; color: string }[];
  color: string;
};

/**
 * El certificado, listo para imprimir o guardar como PDF desde el navegador.
 * El nombre se puede escribir encima: al portal se entra sin nombre, y pedirlo
 * aquí para guardarlo sería pedir un dato solo para imprimirlo. No se guarda.
 */
export function Certificado({ nombreInicial, curso, capacitacion, fecha, folio, horas, niveles, color }: Props) {
  const [nombre, setNombre] = useState(nombreInicial);

  return (
    <div className="flex flex-col gap-4">
      <div className="no-print flex flex-wrap items-end gap-3 rounded-card border border-line bg-surface p-4 shadow-card">
        <label className="min-w-[220px] flex-1">
          <span className="mb-1 block text-[12.5px] font-medium text-muted">Nombre como aparece en el certificado</span>
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            maxLength={80}
            placeholder="Escribe tu nombre completo"
            className="w-full rounded-lg border border-line bg-bg px-3 py-2 text-[14px] outline-none focus:border-[var(--tone)]"
          />
        </label>
        <button
          type="button"
          onClick={() => window.print()}
          disabled={!nombre.trim()}
          className="rounded-lg bg-[var(--tone)] px-4 py-2.5 text-[13px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-35"
        >
          Imprimir o guardar PDF
        </button>
      </div>

      <article
        className="relative overflow-hidden rounded-card border border-line bg-white p-8 text-[#101426] shadow-lift sm:p-12 print:rounded-none print:border-0 print:shadow-none"
        style={{ colorScheme: 'light' }}
      >
        <div
          className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full opacity-[0.12]"
          style={{ background: color }}
          aria-hidden="true"
        />
        <div className="relative">
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-[#565f7a]">
            Certificado de finalización
          </p>
          <p className="mt-10 text-[14px] text-[#565f7a]">Se certifica que</p>
          <p className="mt-1 min-h-[1.2em] font-display text-[34px] font-semibold leading-tight tracking-tight sm:text-[42px]">
            {nombre.trim() || ' '}
          </p>
          <p className="mt-5 max-w-[56ch] text-[15px] leading-relaxed text-[#3a425c]">
            completó la ruta guiada <strong className="font-semibold text-[#101426]">{curso}</strong>, aprobó los
            exámenes de cada nivel con 80% o más y entregó el proyecto final, dentro de la capacitación{' '}
            <strong className="font-semibold text-[#101426]">{capacitacion}</strong>.
          </p>

          <ul className="mt-8 flex flex-wrap gap-2">
            {niveles.map((n) => (
              <li
                key={n.titulo}
                className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-semibold"
                style={{ background: `color-mix(in srgb, ${n.color} 12%, white)`, color: n.color }}
              >
                <span className="size-1.5 rounded-full" style={{ background: n.color }} aria-hidden="true" />
                {n.titulo}
              </li>
            ))}
          </ul>

          <dl className="mt-12 grid grid-cols-2 gap-6 border-t border-[#dce3f3] pt-6 text-[13px] sm:grid-cols-3">
            <div>
              <dt className="text-[#8189a3]">Fecha</dt>
              <dd className="mt-0.5 font-semibold">{fecha}</dd>
            </div>
            <div>
              <dt className="text-[#8189a3]">Dedicación</dt>
              <dd className="mt-0.5 font-semibold">{horas} de contenido</dd>
            </div>
            <div>
              <dt className="text-[#8189a3]">Folio</dt>
              <dd className="mt-0.5 font-mono font-semibold">{folio}</dd>
            </div>
          </dl>
        </div>
      </article>
    </div>
  );
}
