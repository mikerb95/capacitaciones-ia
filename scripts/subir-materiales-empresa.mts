/**
 * Sube a Vercel Blob el material a medida que dejó `materiales:empresa` en
 * `private/materiales/empresas/<slug>/`.
 *
 *   npm run materiales:subir acme
 *   npm run materiales:subir acme copilot                  solo una plataforma
 *   npm run materiales:subir acme copilot guia-de-prompts
 *
 * A partir de aquí la ruta de descarga sirve estos archivos, y no los
 * genéricos, a quien entre con un código de esa empresa mientras la vigencia
 * siga abierta. Se puede volver a correr cuantas veces haga falta: cada
 * documento reemplaza al anterior en su sitio.
 */
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { getCompany } from '../src/db/queries';
import { loadBrief } from '../src/lib/brief';
import { MATERIALES, fileName, type Material } from '../src/lib/materiales';
import { materialBlobPath, putCustomMaterial } from '../src/lib/materiales-blob';

const MIME: Record<string, string> = {
  pdf: 'application/pdf',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
};

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

if (!slug) fail('Falta el slug del cliente: npm run materiales:subir <slug>');

if (!process.env.BLOB_READ_WRITE_TOKEN) {
  fail('Falta BLOB_READ_WRITE_TOKEN. Trae las variables con `vercel env pull .env.local`.');
}

const brief = await loadBrief(slug);
if (!brief) fail(`No encuentro clientes/${slug}.json. Copia clientes/EJEMPLO.json y llénalo.`);

const company = await getCompany(brief.companyId);
if (!company) fail(`El brief apunta a la empresa ${brief.companyId} y esa empresa no existe.`);

const DIR = path.join(process.cwd(), 'private', 'materiales', 'empresas', slug);

const targets = Object.entries(MATERIALES)
  .filter(([id]) => !platformArg || id === platformArg)
  .map(([id, docs]) => [id, docs.filter((d) => !docArg || d.slug === docArg)] as const)
  .filter(([, docs]) => docs.length > 0);

console.log(`\n${company.name}  (empresa ${company.id})`);
if (!company.materialsUntil) {
  console.log('  ! sin fecha de vigencia el portal seguirá sirviendo el genérico: ponla en el admin');
} else if (company.materialsUntil < new Date()) {
  console.log(
    `  ! la vigencia venció el ${fecha.format(company.materialsUntil)}: el portal servirá el genérico`,
  );
} else {
  console.log(`  vigencia: hasta el ${fecha.format(company.materialsUntil)}`);
}

let subidos = 0;

for (const [platformId, docs] of targets) {
  const found: [Material, Buffer][] = [];

  for (const doc of docs) {
    // Lo que no esté generado simplemente no se sube: el material a medida se
    // hace de a poco y el portal cae al genérico en lo que falta.
    const bytes = await readFile(path.join(DIR, platformId, fileName(doc))).catch(() => null);
    if (bytes) found.push([doc, bytes]);
  }

  if (found.length === 0) continue;

  console.log(`\n${platformId}`);

  for (const [doc, bytes] of found) {
    const file = fileName(doc);
    await putCustomMaterial(company.id, platformId, file, bytes, MIME[doc.kind]);
    console.log(`  ✓ ${file}  ${kb(bytes.length)}  →  ${materialBlobPath(company.id, platformId, file)}`);
    subidos += 1;
  }
}

if (subidos === 0) {
  fail(
    `\nNo hay nada generado en private/materiales/empresas/${slug}/${platformArg ? `${platformArg}/` : ''}. Corre antes \`npm run materiales:empresa ${slug}\`.`,
  );
}

console.log(`\nListo: ${subidos} ${subidos === 1 ? 'documento subido' : 'documentos subidos'}.`);
