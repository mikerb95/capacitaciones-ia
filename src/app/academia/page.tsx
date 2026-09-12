import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import { getLandingSummary } from '@/db/queries';
import { platformLogo } from '@/lib/brand-logos';
import { Logo } from '@/lib/logos';
import { MODELS_REVISION } from '@/lib/revision';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Academia IA · Capacitación corporativa en herramientas de IA',
  description:
    'Capacitación en las herramientas de IA que tu empresa ya tiene licenciadas: Copilot, Claude, Gemini, ChatGPT y Jira, sobre el trabajo del día a día.',
};

/**
 * La landing es la única página oscura del sitio y no sigue el interruptor de
 * tema: es una pieza comercial, no parte del aula. En vez de escribir los
 * colores a mano en cada clase, redefine los tokens del portal en el contenedor
 * y así se siguen usando `text-muted`, `border-line` y compañía.
 */
const PALETA = {
  '--bg': '#07090F',
  '--surface': 'rgba(20, 24, 40, 0.55)',
  '--surface-2': '#0A0D17',
  '--border': '#2A3149',
  '--text': '#EBEEF8',
  '--muted': '#A2AAC4',
  '--faint': '#7F87A3',
  '--primary': '#7D97FF',
} as CSSProperties;

/** Los filetes que separan secciones van más apagados que los bordes de caja. */
const FILETE = '#1B2133';
const ACENTO = '#7D97FF';

const ETIQUETA = 'font-mono text-[11.5px] uppercase tracking-[0.12em]';

type Resumen = Awaited<ReturnType<typeof getLandingSummary>>[number];

export default async function AcademiaPage() {
  const plataformas = await getLandingSummary();

  const total = plataformas.reduce(
    (acc, p) => ({
      modulos: acc.modulos + p.modules,
      prompts: acc.prompts + p.prompts,
      casos: acc.casos + p.roles,
    }),
    { modulos: 0, prompts: 0, casos: 0 },
  );

  return (
    <div className="min-h-screen overflow-hidden bg-bg text-text" style={PALETA}>
      <div className="relative">
        {/* Rejilla fina que se desvanece hacia abajo, y el halo del titular. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.045]"
          style={{
            backgroundImage: `linear-gradient(${ACENTO} 1px, transparent 1px), linear-gradient(90deg, ${ACENTO} 1px, transparent 1px)`,
            backgroundSize: '72px 72px',
            maskImage: 'linear-gradient(#000 0%, #000 55%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(#000 0%, #000 55%, transparent 100%)',
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-[340px] left-1/2 h-[700px] w-[1100px] -translate-x-1/2 rounded-full opacity-[0.17] blur-[20px]"
          style={{ background: `radial-gradient(closest-side, ${ACENTO} 0%, transparent 100%)` }}
        />

        <header className="relative mx-auto flex h-[84px] w-full max-w-[1240px] items-center gap-4 px-5 sm:px-10">
          <span className="flex items-center gap-2.5">
            <Marca />
            <span className="font-display text-[15.5px] font-semibold tracking-tight">
              Academia IA
            </span>
          </span>
          <span className="flex-1" />
          <span className={`${ETIQUETA} text-faint`}>Capacitación corporativa</span>
        </header>

        <section className="relative mx-auto w-full max-w-[1240px] px-5 pt-12 pb-10 sm:px-10 sm:pt-[104px] sm:pb-[72px]">
          <p className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-line bg-[rgba(20,24,40,0.6)] py-[7px] pr-3.5 pl-[11px] sm:mb-[34px]">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: ACENTO, boxShadow: `0 0 10px ${ACENTO}` }}
            />
            <span className={`${ETIQUETA} text-muted`}>Cinco herramientas · un solo programa</span>
          </p>

          <h1 className="max-w-[16ch] font-display text-[38px] leading-[1.02] font-semibold tracking-[-0.03em] text-balance sm:text-[74px]">
            Tu equipo ya paga la IA. Enséñale a usarla.
          </h1>

          <p className="mt-5 max-w-[62ch] text-[16px] leading-relaxed text-muted sm:mt-[30px] sm:text-[18.5px]">
            Cinco portales de capacitación sobre las herramientas que tu empresa ya tiene
            licenciadas. {total.modulos} módulos armados con el trabajo de siempre:
            la propuesta, el contrato, el informe mensual, el ticket y la respuesta al cliente.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3.5 sm:mt-10">
            <a
              href="#cotizar"
              className="inline-flex h-[52px] items-center gap-2.5 rounded-xl px-6 text-[15.5px] font-semibold"
              style={{
                background: ACENTO,
                color: '#07090F',
                boxShadow: `0 10px 40px -12px ${ACENTO}`,
              }}
            >
              Cotizar una capacitación
              <Flecha />
            </a>
            <a
              href="#programa"
              className="inline-flex h-[52px] items-center rounded-xl border border-line bg-[rgba(20,24,40,0.5)] px-5.5 text-[15.5px] font-medium"
            >
              Ver el temario
            </a>
          </div>
        </section>

        <section className="relative mx-auto w-full max-w-[1240px] px-5 pb-14 sm:px-10 sm:pb-[110px]">
          <div
            className="grid grid-cols-2 border-t md:grid-cols-4"
            style={{ borderColor: FILETE }}
          >
            <Cifra valor={String(plataformas.length).padStart(2, '0')} etiqueta="Herramientas" />
            <Cifra valor={String(total.modulos)} etiqueta="Módulos" borde />
            <Cifra valor={String(total.prompts)} etiqueta="Prompts" borde />
            <Cifra valor={String(total.casos)} etiqueta="Casos por área" borde />
          </div>
          <p className="mt-5 font-mono text-[12px] text-[#565F7A]">
            Contenido revisado en {MODELS_REVISION} contra la documentación de cada fabricante.
          </p>
        </section>
      </div>

      <section
        id="programa"
        className="mx-auto w-full max-w-[1240px] scroll-mt-10 px-5 pb-7 sm:px-10 sm:pb-11"
      >
        <Rotulo>El programa</Rotulo>
        <h2 className="max-w-[20ch] font-display text-[28px] leading-[1.08] font-semibold tracking-[-0.03em] sm:text-[46px]">
          Ninguna gana en todo. Por eso son cinco.
        </h2>
        <p className="mt-5 max-w-[74ch] text-[15.5px] leading-relaxed text-muted sm:text-[17.5px]">
          Copilot manda donde el trabajo ya vive en Office. Claude, cuando hay que leer un contrato
          de ochenta páginas y citar el numeral. Gemini, si la empresa está en Workspace. ChatGPT,
          para armar asistentes por tarea. Jira, cuando el problema es la cola de tickets y no el
          documento. El temario se arma con las que tu empresa paga.
        </p>
      </section>

      <section className="mx-auto w-full max-w-[1240px] px-5 pb-14 sm:px-10 sm:pb-[104px]">
        {plataformas.map((p, i) => (
          <Banda key={p.id} p={p} indice={i + 1} ultima={i === plataformas.length - 1} />
        ))}
        <p className="mt-5 font-mono text-[12px] text-[#565F7A]">
          Los precios son de la licencia del fabricante, no de la capacitación. Se muestran para
          ubicar desde qué plan se puede dictar el temario completo.
        </p>
      </section>

      <section
        className="relative border-y bg-surface-2"
        style={{ borderColor: FILETE }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(90deg, ${ACENTO} 1px, transparent 1px)`,
            backgroundSize: '72px 100%',
          }}
        />
        <div className="relative mx-auto w-full max-w-[1240px] px-5 py-14 sm:px-10 sm:py-[92px]">
          <Rotulo>Cómo se dicta</Rotulo>
          <h2 className="mb-9 max-w-[22ch] font-display text-[28px] leading-[1.08] font-semibold tracking-[-0.03em] sm:mb-13 sm:text-[46px]">
            Leer prompts buenos no enseña a escribirlos.
          </h2>

          <div className="grid gap-5 md:grid-cols-3 md:gap-7">
            <Practica titulo="Se escribe a ciegas" icono={<IconoOjo />}>
              Primero sale un caso real del área y cada quien escribe su prompt sin ver la rúbrica.
              La revisión llega después, con los errores típicos de ese módulo. No se guarda nada:
              ni el intento, ni la nota, ni quién entrenó.
            </Practica>
            <Practica titulo="Se dicta lo que tu plan habilita" icono={<IconoFiltro />}>
              El portal se abre con el plan que la empresa tiene contratado y el temario se recorta
              solo. Lo que queda fuera no se esconde: sale con el plan mínimo que haría falta, que
              suele ser la conversación más útil de la sesión.
            </Practica>
            <Practica titulo="Cada uno se lleva su material" icono={<IconoDocumento />}>
              Guía de prompts, plantillas y checklist en PDF y Word, con el logo de tu empresa y los
              ejemplos de tu operación. Se descargan desde el portal y quedan para el que entre
              después.
            </Practica>
          </div>
        </div>
      </section>

      <section id="cotizar" className="relative scroll-mt-10">
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-[260px] left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full opacity-[0.15] blur-[14px]"
          style={{ background: `radial-gradient(closest-side, ${ACENTO} 0%, transparent 100%)` }}
        />
        <div className="relative mx-auto w-full max-w-[1240px] px-5 pt-16 pb-12 text-center sm:px-10 sm:pt-[110px] sm:pb-20">
          <h2 className="mx-auto max-w-[18ch] font-display text-[30px] leading-[1.06] font-semibold tracking-[-0.03em] sm:text-[52px]">
            ¿Con cuáles empezamos?
          </h2>
          <p className="mx-auto mt-5 max-w-[56ch] text-[15.5px] leading-relaxed text-muted sm:text-[17.5px]">
            Cuéntanos qué licencias tiene la empresa y cuánta gente entra. Armamos el temario con lo
            que ya paga y dejamos por escrito qué se gana subiendo de plan.
          </p>
          <div className="mt-7 flex justify-center sm:mt-9">
            <a
              href={`mailto:${CONTACTO.correo}`}
              className="inline-flex h-[52px] items-center gap-2.5 rounded-xl px-6 text-[15.5px] font-semibold"
              style={{
                background: ACENTO,
                color: '#07090F',
                boxShadow: `0 10px 40px -12px ${ACENTO}`,
              }}
            >
              Cotizar una capacitación
              <Flecha />
            </a>
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-4.5 font-mono text-[12.5px] text-faint">
            <span>{CONTACTO.correo}</span>
            <span className="text-line">·</span>
            <span>{CONTACTO.telefono}</span>
            <span className="text-line">·</span>
            <span>{CONTACTO.sitio}</span>
          </div>
        </div>
      </section>

      <footer
        className="mx-auto flex w-full max-w-[1240px] flex-wrap items-baseline gap-4 border-t px-5 pt-7 pb-10 sm:px-10"
        style={{ borderColor: FILETE }}
      >
        <span className="font-display text-[14px] font-semibold">Academia IA</span>
        <span className="font-mono text-[11.5px] text-[#565F7A]">
          Capacitación corporativa en herramientas de IA
        </span>
        <span className="flex-1" />
        <span className="max-w-[62ch] font-mono text-[11px] text-[#565F7A]">
          Microsoft, Anthropic, Google, OpenAI y Atlassian son marcas de sus respectivos dueños.
          Esta capacitación no está afiliada a ninguna de ellas.
        </span>
      </footer>
    </div>
  );
}

/**
 * Datos de contacto de la venta. Van en el código y no en la base porque no son
 * contenido de la capacitación, son de quien la dicta. RELLENAR antes de
 * publicar: se dejan a la vista a propósito, para que se note si se olvidan.
 */
const CONTACTO = {
  correo: 'TU-CORREO@ejemplo.com',
  telefono: '[TU TELÉFONO]',
  sitio: '[TU SITIO]',
};

/** El rótulo de sección: texto en versalitas y el filete que se va apagando. */
function Rotulo({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-5.5 flex items-center gap-3.5">
      <span className={ETIQUETA} style={{ color: ACENTO }}>
        {children}
      </span>
      <span
        className="h-px flex-1"
        style={{ background: `linear-gradient(90deg, ${FILETE}, transparent)` }}
      />
    </div>
  );
}

function Cifra({ valor, etiqueta, borde }: { valor: string; etiqueta: string; borde?: boolean }) {
  return (
    <div
      className={`px-0 pt-6 pr-6 md:pl-6 ${borde ? 'md:border-l' : ''}`}
      style={borde ? { borderColor: FILETE } : undefined}
    >
      <div className="font-mono text-[30px] font-medium sm:text-[42px]">{valor}</div>
      <div className={`mt-2 ${ETIQUETA} tracking-[0.1em] text-faint`}>{etiqueta}</div>
    </div>
  );
}

/**
 * Una capacitación. Cuatro bloques que en escritorio van en fila (identidad,
 * volumen, diferenciales y plan) y en pantallas chicas se apilan.
 */
function Banda({ p, indice, ultima }: { p: Resumen; indice: number; ultima: boolean }) {
  const logo = platformLogo(p.id);
  const claro = `color-mix(in srgb, ${p.color} 45%, #EBEEF8)`;

  const niveles = [
    { cuenta: p.levels.basico, opacidad: 1, nombre: 'básico' },
    { cuenta: p.levels.intermedio, opacidad: 0.62, nombre: 'intermedio' },
    { cuenta: p.levels.avanzado, opacidad: 0.34, nombre: 'avanzado' },
  ].filter((n) => n.cuenta > 0);

  return (
    <article
      className={`relative grid gap-5 border-t px-0 py-7 sm:gap-8 sm:px-7 md:grid-cols-2 lg:grid-cols-[minmax(280px,1.15fr)_208px_minmax(300px,1.25fr)_176px] lg:items-center ${ultima ? 'border-b' : ''}`}
      style={{ borderColor: FILETE }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 h-full w-[260px] opacity-[0.14]"
        style={{ background: `radial-gradient(ellipse at 8% 50%, ${p.color} 0%, transparent 70%)` }}
      />

      <div className="relative flex items-start gap-4">
        {logo ? (
          <Logo name={logo} size={38} className="mt-0.5 flex-none" />
        ) : (
          <span
            className="mt-0.5 grid h-[38px] w-[38px] flex-none place-items-center rounded-[10px] font-display text-[16px] font-semibold text-white"
            style={{ background: p.color }}
          >
            {p.initial}
          </span>
        )}
        <div>
          <div className="flex items-baseline gap-2.5">
            <span className="font-mono text-[11px] text-[#565F7A]">
              {String(indice).padStart(2, '0')}
            </span>
            <h3 className="font-display text-[21px] font-semibold tracking-tight">{p.name}</h3>
          </div>
          {p.description && (
            <p className="mt-2 text-[14.5px] leading-snug text-muted">{p.description}</p>
          )}
        </div>
      </div>

      <div className="relative">
        <div className="flex items-baseline gap-[7px]">
          <span className="font-mono text-[26px] font-medium">{p.modules}</span>
          <span className={`${ETIQUETA} tracking-[0.08em] text-faint`}>
            módulos · {p.prompts} prompts
          </span>
        </div>
        <div className="mt-3 flex h-1.5 gap-[3px] overflow-hidden rounded-full">
          {niveles.map((n) => (
            <span
              key={n.nombre}
              style={{ flexGrow: n.cuenta, background: p.color, opacity: n.opacidad }}
            />
          ))}
        </div>
        <div className="mt-2.5 font-mono text-[11px] text-[#565F7A]">
          {niveles.map((n) => `${n.cuenta} ${n.nombre}`).join(' · ')}
        </div>
      </div>

      <div className="relative flex flex-col gap-3">
        {p.specials.map((s) => (
          <div key={s.kicker}>
            <div className="font-mono text-[10.5px] tracking-[0.1em] uppercase" style={{ color: claro }}>
              {s.kicker}
            </div>
            <div className="mt-[3px] text-[14.5px] leading-snug">{s.title}</div>
          </div>
        ))}
      </div>

      <div className="relative flex flex-col items-start gap-3">
        {p.plan && (
          <div className="rounded-[10px] border border-line bg-surface px-3 py-2.5">
            <div className={`${ETIQUETA} text-[10px] tracking-[0.1em] text-faint`}>Desde</div>
            <div className="mt-[3px] text-[13px] font-medium">{p.plan.price}</div>
            <div className="mt-0.5 font-mono text-[10.5px] text-[#565F7A]">{p.plan.name}</div>
          </div>
        )}
        <a
          href="#cotizar"
          className={`${ETIQUETA} tracking-[0.08em] text-primary hover:underline`}
        >
          Pedir el temario →
        </a>
      </div>
    </article>
  );
}

function Practica({
  titulo,
  icono,
  children,
}: {
  titulo: string;
  icono: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-card border border-line bg-surface p-6.5">
      <span style={{ color: ACENTO }}>{icono}</span>
      <h3 className="mt-4.5 font-display text-[19px] font-semibold tracking-tight">{titulo}</h3>
      <p className="mt-2.5 text-[14.5px] leading-relaxed text-muted">{children}</p>
    </div>
  );
}

/* --- Iconos. Trazo de 1,4 sobre rejilla de 24, como los del portal. -------- */

function Marca() {
  return (
    <svg width="24" height="24" viewBox="0 0 26 26" aria-hidden="true">
      <rect x="1" y="1" width="24" height="24" rx="7" fill="#141828" stroke="#2A3149" />
      <circle cx="9" cy="9" r="2.2" fill="#7D97FF" />
      <circle cx="17.5" cy="16.5" r="2.2" fill="#2FD3A0" />
      <path d="M9 9 L17.5 16.5" stroke="#7D97FF" strokeOpacity=".45" strokeWidth="1.3" />
    </svg>
  );
}

function Flecha() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconoOjo() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6Z" stroke="currentColor" strokeWidth="1.4" />
      <path d="M4 4l16 16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function IconoFiltro() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 6h16M4 12h10M4 18h6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="18" cy="16" r="3.4" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function IconoDocumento() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path d="M14 3v5h5M9 13h6M9 17h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
