import type { EstadoLeccion, Leccion, Nivel } from '@/lib/ruta';

/** Chip del nivel, teñido con su color. */
export function NivelChip({ nivel, corto = false }: { nivel: Nivel; corto?: boolean }) {
  const [numero, nombre] = nivel.titulo.split(' · ');
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-semibold"
      style={{
        background: `color-mix(in srgb, ${nivel.color} 13%, transparent)`,
        color: `color-mix(in srgb, ${nivel.color} 80%, var(--text))`,
      }}
    >
      <span className="size-1.5 rounded-full" style={{ background: nivel.color }} aria-hidden="true" />
      {corto ? nombre : `${numero} · ${nombre}`}
    </span>
  );
}

export const TIPO_ETIQUETA = {
  lectura: 'Lección',
  practica: 'Práctica',
  examen: 'Examen',
  proyecto: 'Proyecto final',
} as const;

export function tipoDe(leccion: Leccion) {
  return leccion.tipo === 'practica' && leccion.proyecto ? 'proyecto' : leccion.tipo;
}

/** Ícono del tipo de lección. Trazos simples, heredan el color del texto. */
export function TipoIcono({ leccion, size = 15 }: { leccion: Leccion; size?: number }) {
  const tipo = tipoDe(leccion);
  const p = {
    width: size,
    height: size,
    viewBox: '0 0 16 16',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.5,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  };

  if (tipo === 'lectura') {
    return (
      <svg {...p}>
        <path d="M2.5 3.5c1.8-.7 3.7-.6 5.5.6 1.8-1.2 3.7-1.3 5.5-.6v9c-1.8-.7-3.7-.6-5.5.6-1.8-1.2-3.7-1.3-5.5-.6z" />
        <path d="M8 4.1v9" />
      </svg>
    );
  }
  if (tipo === 'practica') {
    return (
      <svg {...p}>
        <path d="m10.5 2.5 3 3L6 13H3v-3z" />
        <path d="m9 4 3 3" />
      </svg>
    );
  }
  if (tipo === 'examen') {
    return (
      <svg {...p}>
        <rect x="3" y="2.5" width="10" height="11" rx="1.5" />
        <path d="m5.5 7 1.2 1.2L9 6M5.5 11h5" />
      </svg>
    );
  }
  return (
    <svg {...p}>
      <path d="M8 2.5 9.6 6l3.9.4-2.9 2.6.8 3.8L8 10.9l-3.4 1.9.8-3.8L2.5 6.4 6.4 6z" />
    </svg>
  );
}

/** Estado de la lección: círculo vacío, check lleno o intento fallido. */
export function EstadoIcono({ estado, color }: { estado: EstadoLeccion; color: string }) {
  if (estado === 'completada') {
    return (
      <span
        className="grid size-[18px] flex-none place-items-center rounded-full"
        style={{ background: color }}
      >
        <svg width="10" height="10" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M3.5 8.5 6.5 11.5 12.5 5" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="sr-only">Completada</span>
      </span>
    );
  }
  if (estado === 'reprobada') {
    return (
      <span className="grid size-[18px] flex-none place-items-center rounded-full border-[1.5px] border-[#c2410c] text-[#c2410c] dark:border-[#f4a06a] dark:text-[#f4a06a]">
        <svg width="8" height="8" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M8 3v6M8 12.5v.5" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
        </svg>
        <span className="sr-only">Pendiente de aprobar</span>
      </span>
    );
  }
  return (
    <span className="size-[18px] flex-none rounded-full border-[1.5px] border-line bg-surface">
      <span className="sr-only">Pendiente</span>
    </span>
  );
}

/** Anillo de avance con el porcentaje al centro. */
export function Anillo({
  porcentaje,
  color,
  size = 96,
  grosor = 8,
}: {
  porcentaje: number;
  color: string;
  size?: number;
  grosor?: number;
}) {
  const r = (size - grosor) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative flex-none" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--surface-2)" strokeWidth={grosor} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={grosor}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - porcentaje / 100)}
        />
      </svg>
      <span
        className="absolute inset-0 grid place-items-center font-display font-semibold tracking-tight"
        style={{ fontSize: size * 0.24 }}
        role="progressbar"
        aria-valuenow={porcentaje}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        {porcentaje}%
      </span>
    </div>
  );
}

/** Barra fina, para el avance de una unidad. */
export function Barra({ porcentaje, color }: { porcentaje: number; color: string }) {
  return (
    <span className="block h-1 w-full overflow-hidden rounded-full bg-surface-2" aria-hidden="true">
      <span
        className="block h-full rounded-full transition-[width]"
        style={{ width: `${porcentaje}%`, background: color }}
      />
    </span>
  );
}
