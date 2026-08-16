/**
 * Genera el material a medida de una empresa en `private/materiales/empresas/<slug>/`.
 *
 *   npm run materiales:empresa acme
 *   npm run materiales:empresa acme copilot                  solo una plataforma
 *   npm run materiales:empresa acme copilot guia-de-prompts
 *
 * Necesita tres cosas: el brief en `clientes/<slug>.json`, la empresa en la
 * base (de ahí salen el nombre y el logo) y el servidor levantado, porque los
 * PDF salen de las rutas imprimibles igual que los genéricos.
 *
 * Esto solo deja los archivos en local para revisarlos. Subirlos es otro paso.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import puppeteer, { type Browser } from 'puppeteer';
import { getCompany, getCompanyPlatforms } from '../src/db/queries';
import { loadBrief, placeholderMap } from '../src/lib/brief';
import { MATERIALES, fileName, type Material } from '../src/lib/materiales';
import { DOCX_BUILDERS, type DocClient } from './materiales-docx';

const BASE = process.env.MATERIALES_URL ?? 'http://localhost:3000';
const KEY = process.env.MATERIALES_BUILD_KEY;

/** Numeración, en el margen que reserva el @page del layout. */
const FOOTER = `
<div style="width:100%;font-family:system-ui,sans-serif;font-size:8px;color:#8189a3;
            padding:0 15mm;text-align:right;">
  <span class="pageNumber"></span> / <span class="totalPages"></span>
</div>`;

/** Altura del logo en el encabezado de los DOCX, en puntos. */
const LOGO_H = 13;

const [slug, platformArg, docArg] = process.argv.slice(2);

const kb = (bytes: number) =>
  bytes >= 1024 * 1024
    ? `${(bytes / 1024 / 1024).toFixed(1).replace('.', ',')} MB`
    : `${Math.round(bytes / 1024)} KB`;

const fecha = new Intl.DateTimeFormat('es', { day: '2-digit', month: 'long', year: 'numeric' });

function fail(message: string): never {
  console.error(message);
  process.exit(1);
}

if (!slug) fail('Falta el slug del cliente: npm run materiales:empresa <slug>');

const brief = await loadBrief(slug);
if (!brief) fail(`No encuentro clientes/${slug}.json. Copia clientes/EJEMPLO.json y llénalo.`);

const company = await getCompany(brief.companyId);
if (!company) fail(`El brief apunta a la empresa ${brief.companyId} y esa empresa no existe.`);

// El alcance de la empresa: la unión de lo que se le dictó en todos sus códigos.
const scope = await getCompanyPlatforms(company.id);
const inScope = (id: string) => scope === null || scope.includes(id);

const targets = Object.entries(MATERIALES)
  .filter(([id]) => inScope(id))
  .filter(([id]) => !platformArg || id === platformArg)
  .map(([id, docs]) => [id, docs.filter((d) => !docArg || d.slug === docArg)] as const)
  .filter(([, docs]) => docs.length > 0);

if (targets.length === 0) {
  fail(
    scope?.length === 0
      ? `${company.name} no tiene capacitaciones con alcance, así que no sé qué material generar.`
      : `No hay material que generar para ${platformArg ?? '(todo)'}${docArg ? ` / ${docArg}` : ''}.`,
  );
}

await assertServer();

console.log(`\n${company.name}`);
console.log(`  alcance: ${scope === null ? 'todas las plataformas' : scope.join(', ')}`);
console.log(
  `  vigencia: ${company.materialsUntil ? `hasta el ${fecha.format(company.materialsUntil)}` : 'sin fecha'}`,
);
if (!company.logo) console.log('  ! la empresa no tiene logo cargado: sale solo la marca de la herramienta');
if (!company.materialsUntil) {
  console.log('  ! sin fecha de vigencia nadie llegaría a descargarlo: ponla en el admin antes de subir');
}

const browser = await puppeteer.launch({ headless: true });
const OUT = path.join(process.cwd(), 'private', 'materiales', 'empresas', slug);

try {
  const client: DocClient = {
    name: company.name,
    logo: await rasterizeLogo(browser, company.logo),
    brief,
    holes: placeholderMap(brief),
  };

  for (const [platformId, docs] of targets) {
    await mkdir(path.join(OUT, platformId), { recursive: true });
    console.log(`\n${platformId}`);

    for (const doc of docs) {
      const out = path.join(OUT, platformId, fileName(doc));
      const bytes =
        doc.source === 'docx'
          ? await buildDocx(platformId, doc, out, client)
          : await buildPdf(browser, platformId, doc, out);

      console.log(`  ✓ ${fileName(doc)}  ${kb(bytes)}`);
    }
  }
} finally {
  await browser.close();
}

console.log(`\nListo. Revisa los archivos en private/materiales/empresas/${slug}/`);
console.log('Cuando estén bien, el siguiente paso es subirlos.');

async function assertServer() {
  try {
    await fetch(BASE, { signal: AbortSignal.timeout(4000) });
  } catch {
    fail(`No responde ${BASE}. Levanta el servidor con \`npm run dev\` y vuelve a correr.`);
  }
}

/**
 * El logo de la empresa, de `data:` URI a PNG con su proporción real, que es
 * lo único que sabe pintar Word. Se hace con el navegador porque el logo puede
 * venir en SVG y con degradados.
 */
async function rasterizeLogo(browser: Browser, logo: string | null) {
  if (!logo) return null;

  const page = await browser.newPage();
  try {
    await page.setContent(
      `<style>html,body{margin:0;background:transparent}img{display:block;height:${LOGO_H * 8}px;width:auto}</style><img id="l" src="${logo}">`,
    );
    const box = await page.evaluate(() => {
      const img = document.getElementById('l') as HTMLImageElement;
      return img.decode().then(() => ({ w: img.width, h: img.height }));
    });

    await page.setViewport({ width: Math.ceil(box.w), height: Math.ceil(box.h) });
    const png = Buffer.from(await page.screenshot({ omitBackground: true, type: 'png' }));

    return { data: png, width: Math.round((box.w / box.h) * LOGO_H), height: LOGO_H };
  } finally {
    await page.close();
  }
}

async function buildPdf(browser: Browser, platformId: string, doc: Material, out: string) {
  const page = await browser.newPage();
  try {
    if (KEY) await page.setExtraHTTPHeaders({ 'x-materiales-key': KEY });

    const url = `${BASE}/materiales/${platformId}/${doc.slug}?empresa=${slug}`;
    const res = await page.goto(url, { waitUntil: 'networkidle0', timeout: 60_000 });
    if (!res || !res.ok()) throw new Error(`${url} respondió ${res?.status() ?? 'nada'}`);

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

async function buildDocx(platformId: string, doc: Material, out: string, client: DocClient) {
  const build = DOCX_BUILDERS[`${platformId}/${doc.slug}`];
  if (!build) throw new Error(`Falta el generador de ${platformId}/${doc.slug} en materiales-docx.ts`);

  const buffer = await build(client);
  await writeFile(out, buffer);
  return buffer.byteLength;
}

