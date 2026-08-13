/**
 * Regenera `src/lib/logos.tsx` a partir del set `thesvg-color` de Iconify.
 *
 * El set pesa demasiado para dejarlo como dependencia fija, así que se instala
 * solo cuando hay que tocar los logos:
 *
 *   npm i -D @iconify/json
 *   node scripts/gen-logos.mjs src/lib/logos.tsx
 *   npm rm @iconify/json
 */
import fs from 'node:fs';

const set = JSON.parse(
  fs.readFileSync(
    new URL('../node_modules/@iconify/json/json/thesvg-color.json', import.meta.url),
  ),
);

// clave local -> nombre del icono en el set thesvg-color.
// Solo entran iconos cuadrados: los wordmarks (google-workspace, por ejemplo)
// se deforman dentro del recuadro, así que esos módulos se quedan con letras.
const WANTED = {
  copilot: 'microsoft-365-copilot',
  'copilot-chat': 'microsoft-copilot',
  word: 'microsoft-word',
  excel: 'microsoft-excel',
  powerpoint: 'microsoft-powerpoint',
  teams: 'microsoft-teams',
  outlook: 'microsoft-outlook',
  claude: 'claude-ai',
  'claude-code': 'claude-code',
  chrome: 'google-chrome',
  chatgpt: 'openai-chatgpt',
  codex: 'codex-openai',
  sora: 'sora-openai',
  gemini: 'google-gemini',
  notebooklm: 'notebooklm',
};

const entries = [];
for (const [key, name] of Object.entries(WANTED)) {
  const icon = set.icons[name];
  if (!icon) throw new Error(`falta el icono ${name}`);
  const w = icon.width ?? set.width ?? 24;
  const h = icon.height ?? set.height ?? 24;
  const left = icon.left ?? set.left ?? 0;
  const top = icon.top ?? set.top ?? 0;

  const ratio = w / h;
  if (Math.abs(ratio - 1) > 0.15) {
    throw new Error(`${name} no es cuadrado (${w}x${h}): no entra en el recuadro`);
  }

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${left} ${top} ${w} ${h}">${icon.body}</svg>`;
  const src = `data:image/svg+xml,${encodeURIComponent(svg)}`;

  entries.push(`  '${key}': {\n    ratio: ${Number(ratio.toFixed(4))},\n    src: ${JSON.stringify(src)},\n  },`);
}

const out = `/**
 * ARCHIVO GENERADO. No editar a mano: se regenera con \`scripts/gen-logos.mjs\`,
 * que es donde se añade o se cambia un logo.
 *
 * Logos de marca sacados del set \`thesvg-color\` de Iconify y embebidos como
 * \`data:\` URI, para no depender de red ni de un paquete de iconos en runtime.
 *
 * Van dentro de un <img> y no en línea a propósito. Estos SVG pintan sus
 * colores con degradados referenciados por id (\`fill="url(#a)"\`), y los ids son
 * globales al documento: dos instancias del mismo logo en una página producen
 * ids repetidos, y el navegador resuelve contra el primero que encuentre. Si
 * ese primero cae en un subárbol \`display:none\` (el layout móvil de la
 * comparativa, sin ir más lejos) el degradado no se pinta y el logo sale en
 * blanco. Dentro de un <img> cada SVG es un documento aparte, así que sus ids
 * quedan aislados y el problema no existe.
 */

type LogoDef = { ratio: number; src: string };

const LOGOS: Record<string, LogoDef> = {
${entries.join('\n')}
};

export type LogoName = keyof typeof LOGOS;

export function hasLogo(name: string | undefined): boolean {
  return Boolean(name && name in LOGOS);
}

/**
 * Dibuja el logo suelto, sin recuadro. \`size\` es el lado mayor: los iconos no
 * son exactamente cuadrados y estirarlos se nota.
 *
 * Es decorativo (\`alt=""\`): el nombre de la marca siempre está en el texto que
 * acompaña al logo, así que anunciarlo otra vez solo estorba con lector de
 * pantalla.
 */
export function Logo({
  name,
  size = 20,
  className,
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const logo = LOGOS[name];
  if (!logo) return null;
  const width = logo.ratio >= 1 ? size : Math.round(size * logo.ratio);
  const height = logo.ratio >= 1 ? Math.round(size / logo.ratio) : size;
  return (
    // eslint-disable-next-line @next/next/no-img-element -- es un data: URI, no hay nada que optimizar
    <img
      src={logo.src}
      alt=""
      aria-hidden="true"
      width={width}
      height={height}
      className={className}
    />
  );
}
`;

fs.writeFileSync(process.argv[2], out);
console.log('escritos', entries.length, 'logos ->', process.argv[2]);
