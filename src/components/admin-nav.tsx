'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

/**
 * Navegación del panel. Vive en el layout de `(panel)`, así que las pantallas
 * ya no cargan cada una con sus propios enlaces en el encabezado.
 *
 * Solo lista rutas que existen: nada de secciones de adorno que lleven a un
 * 404. Lo que no tiene página propia (las preguntas, la vista en vivo) se
 * atiende desde donde vive, que es la ficha de la capacitación y las
 * presentaciones.
 */

type Item = { href: string; label: string; icon: keyof typeof PATHS; badge?: number };
type Group = { title: string; items: Item[] };

const PATHS = {
  inicio: <path d="M4 11.5 12 5l8 6.5V19a1 1 0 0 1-1 1h-4v-5H9v5H5a1 1 0 0 1-1-1z" />,
  capacitaciones: (
    <>
      <rect x="3" y="6" width="18" height="12" rx="2.5" />
      <path d="M8 10h5M8 14h3" />
    </>
  ),
  empresas: (
    <>
      <path d="M4 20V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v14" />
      <path d="M14 10h4a2 2 0 0 1 2 2v8" />
      <path d="M3 20h18M7.5 8h3M7.5 12h3M7.5 16h3" />
    </>
  ),
  modulos: (
    <>
      <path d="m12 3 8.5 4.5L12 12 3.5 7.5z" />
      <path d="m3.5 12 8.5 4.5 8.5-4.5M3.5 16.5 12 21l8.5-4.5" />
    </>
  ),
  presentaciones: (
    <>
      <rect x="3" y="4" width="18" height="11" rx="2" />
      <path d="M12 15v4M8.5 21l3.5-2 3.5 2" />
    </>
  ),
  materiales: (
    <>
      <path d="M5 4h9l5 5v11a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z" />
      <path d="M13.5 4v5.5H19" />
      <path d="M8 14h7M8 17.5h4.5" />
    </>
  ),
};

function Icon({ name, size = 17 }: { name: keyof typeof PATHS; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="flex-none"
    >
      {PATHS[name]}
    </svg>
  );
}

export type NavCounts = { openCodes: number; drafts: number };

function groups({ openCodes, drafts }: NavCounts): Group[] {
  return [
    {
      title: 'Operación',
      items: [
        { href: '/admin', label: 'Inicio', icon: 'inicio' },
        {
          href: '/admin/accesos',
          label: 'Capacitaciones',
          icon: 'capacitaciones',
          badge: openCodes || undefined,
        },
      ],
    },
    {
      title: 'Clientes',
      items: [{ href: '/admin/empresas', label: 'Empresas', icon: 'empresas' }],
    },
    {
      title: 'Contenido',
      items: [
        {
          href: '/admin/modulos',
          label: 'Módulos y portales',
          icon: 'modulos',
          badge: drafts || undefined,
        },
        { href: '/admin/presentaciones', label: 'Presentaciones', icon: 'presentaciones' },
      ],
    },
  ];
}

/** `/admin` solo se marca en su propia página; el resto, también en sus hijas. */
function useIsActive() {
  const pathname = usePathname();
  return (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);
}

const Badge = ({ value }: { value: number }) => (
  <span className="ml-auto rounded-full bg-surface-2 px-1.5 py-px font-mono text-[10.5px] font-medium text-faint">
    {value}
  </span>
);

export function AdminSidebar({ counts }: { counts: NavCounts }) {
  const isActive = useIsActive();

  return (
    <aside className="sticky top-0 hidden h-screen w-[238px] flex-none flex-col border-r border-line bg-surface lg:flex">
      <div className="flex items-center gap-2.5 px-[18px] pb-1 pt-[18px]">
        <BrandMark />
        <div className="min-w-0">
          <div className="font-display text-[14.5px] font-semibold leading-tight tracking-tight">
            Academia IA
          </div>
          <div className="text-[11.5px] text-faint">Administración</div>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 px-3 pb-[18px]">
        {groups(counts).map((group) => (
          <div key={group.title} className="contents">
            <div className="mb-1.5 mt-5 px-2.5 font-mono text-[10px] uppercase tracking-[0.1em] text-faint">
              {group.title}
            </div>
            {group.items.map((item) => {
              const on = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={on ? 'page' : undefined}
                  className={`flex items-center gap-2.5 rounded-[10px] px-2.5 py-[7px] text-[13.5px] transition-colors ${
                    on
                      ? 'bg-primary-soft font-semibold text-primary'
                      : 'font-medium text-muted hover:bg-surface-2 hover:text-text'
                  }`}
                >
                  <Icon name={item.icon} />
                  {item.label}
                  {item.badge !== undefined && <Badge value={item.badge} />}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
}

/**
 * Debajo de `lg` el sidebar no cabe, así que la misma navegación pasa a una
 * tira que se desplaza. Sin menú desplegable: un panel de trabajo se usa en
 * pantalla grande, y esto es para cuando se abre desde el teléfono.
 */
export function AdminNavStrip({ counts }: { counts: NavCounts }) {
  const isActive = useIsActive();
  const items = groups(counts).flatMap((g) => g.items);

  return (
    <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-line bg-surface px-4 py-2 lg:hidden">
      <BrandMark />
      <nav className="flex flex-1 gap-1.5 overflow-x-auto">
        {items.map((item) => {
          const on = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={on ? 'page' : undefined}
              className={`flex flex-none items-center gap-2 rounded-[10px] px-2.5 py-2 text-[13px] transition-colors ${
                on
                  ? 'bg-primary-soft font-semibold text-primary'
                  : 'font-medium text-muted hover:bg-surface-2 hover:text-text'
              }`}
            >
              <Icon name={item.icon} size={16} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

function BrandMark() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true" className="flex-none">
      <rect x="1" y="1" width="24" height="24" rx="7" fill="var(--primary)" />
      <circle cx="9" cy="9" r="2.4" fill="#ffffff" />
      <circle cx="17.5" cy="16.5" r="2.4" fill="var(--accent)" />
      <path d="M9 9 L17.5 16.5" stroke="#ffffff" strokeOpacity=".65" strokeWidth="1.4" />
    </svg>
  );
}
