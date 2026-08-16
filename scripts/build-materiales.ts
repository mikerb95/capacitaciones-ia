/**
 * Genera el material descargable a `private/materiales/<plataforma>/`.
 *
 * Los PDF salen de las rutas imprimibles (`/materiales/...`), así que necesita
 * un servidor levantado: en local basta con `npm run dev` en otra terminal.
 * Los DOCX se arman en memoria y no dependen del servidor.
 *
 *   npm run materiales
 *   npm run materiales -- chatgpt              solo una plataforma
 *   npm run materiales -- chatgpt guia-de-prompts
 *
 * Variables: MATERIALES_URL (por defecto http://localhost:3000) y
 * MATERIALES_BUILD_KEY, que solo hace falta contra un servidor de producción.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import puppeteer from 'puppeteer';
import { MATERIALES, fileName, type Material } from '../src/lib/materiales';
import { DOCX_BUILDERS } from './materiales-docx';

const BASE = process.env.MATERIALES_URL ?? 'http://localhost:3000';
const KEY = process.env.MATERIALES_BUILD_KEY;
const OUT = path.join(process.cwd(), 'private', 'materiales');

const [platformArg, docArg] = process.argv.slice(2);

const kb = (bytes: number) =>
  bytes >= 1024 * 1024
    ? `${(bytes / 1024 / 1024).toFixed(1).replace('.', ',')} MB`
    : `${Math.round(bytes / 1024)} KB`;

async function main() {
  const targets = Object.entries(MATERIALES)
    .filter(([id]) => !platformArg || id === platformArg)
    .map(([id, docs]) => [id, docs.filter((d) => !docArg || d.slug === docArg)] as const)
    .filter(([, docs]) => docs.length > 0);

  if (targets.length === 0) {
    console.error(`No hay material declarado para ${platformArg ?? '(todo)'}${docArg ? ` / ${docArg}` : ''}.`);
    process.exit(1);
  }

  const needsBrowser = targets.some(([, docs]) => docs.some((d) => d.source === 'print'));
  if (needsBrowser) await assertServer();

  const browser = needsBrowser ? await puppeteer.launch({ headless: true }) : null;

  try {
    for (const [platformId, docs] of targets) {
      await mkdir(path.join(OUT, platformId), { recursive: true });
      console.log(`\n${platformId}`);

      for (const doc of docs) {
        const out = path.join(OUT, platformId, fileName(doc));
        const bytes =
          doc.source === 'docx'
            ? await buildDocx(platformId, doc, out)
            : await buildPdf(browser!, platformId, doc, out);

        console.log(`  ✓ ${fileName(doc)}  ${kb(bytes)}`);
      }
    }
  } finally {
    await browser?.close();
  }

  console.log(`\nListo. Archivos en private/materiales/`);
  console.log('Si cambió el peso o el número de páginas, ajusta el `meta` del seed.');
}

/** Falla temprano y con un mensaje útil si nadie está sirviendo las rutas. */
async function assertServer() {
  try {
    await fetch(BASE, { signal: AbortSignal.timeout(4000) });
  } catch {
    console.error(`No responde ${BASE}. Levanta el servidor con \`npm run dev\` y vuelve a correr.`);
    process.exit(1);
  }
}

async function buildPdf(
  browser: import('puppeteer').Browser,
  platformId: string,
  doc: Material,
  out: string,
) {
  const page = await browser.newPage();
  try {
    if (KEY) await page.setExtraHTTPHeaders({ 'x-materiales-key': KEY });

    const url = `${BASE}/materiales/${platformId}/${doc.slug}`;
    const res = await page.goto(url, { waitUntil: 'networkidle0', timeout: 60_000 });
    if (!res || !res.ok()) throw new Error(`${url} respondió ${res?.status() ?? 'nada'}`);

    // Las webfonts se piden aparte del documento y el PDF se toma cuando ya
    // están: sin esto los títulos salen con la tipografía de reserva.
    await page.evaluateHandle('document.fonts.ready');

    const pdf = await page.pdf({
      preferCSSPageSize: true,
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: '<div></div>',
      footerTemplate: FOOTER,
    });

    await writeFile(out, pdf);
    return pdf.byteLength;
  } finally {
    await page.close();
  }
}

async function buildDocx(platformId: string, doc: Material, out: string) {
  const build = DOCX_BUILDERS[`${platformId}/${doc.slug}`];
  if (!build) throw new Error(`Falta el generador de ${platformId}/${doc.slug} en materiales-docx.ts`);

  const buffer = await build();
  await writeFile(out, buffer);
  return buffer.byteLength;
}

/** Numeración. Va en el margen inferior que reserva el @page del layout. */
const FOOTER = `
<div style="width:100%;font-family:system-ui,sans-serif;font-size:8px;color:#8189a3;
            padding:0 15mm;text-align:right;">
  <span class="pageNumber"></span> / <span class="totalPages"></span>
</div>`;

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
