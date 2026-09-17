import puppeteer, { type Page } from 'puppeteer';
import { getCurso, leccionesDe } from './src/lib/ruta';

const B = 'http://localhost:3107';
const OUT = process.env.OUT!;
const ID = process.env.CURSO!;
const curso = getCurso(ID)!;
const L = leccionesDe(curso);
const problemas: string[] = [];
const log = (...a: unknown[]) => console.log(...a);

const shot = (page: Page, n: string, full = true) => page.screenshot({ path: `${OUT}/${ID}-${n}.png`, fullPage: full });
async function go(page: Page, path: string) {
  const r = await page.goto(B + path, { waitUntil: 'networkidle0' });
  if (!r || r.status() >= 400) problemas.push(`${path} -> ${r?.status()}`);
  return r?.status();
}
async function clickText(page: Page, selector: string, text: string) {
  const ok = await page.evaluate((selector, text) => {
    const el = [...document.querySelectorAll<HTMLElement>(selector)].find((e) => e.textContent?.trim().includes(text) && !(e as HTMLButtonElement).disabled);
    if (!el) return false;
    el.scrollIntoView({ block: 'center' }); el.click(); return true;
  }, selector, text);
  if (!ok) throw new Error(`no encontré ${selector} con "${text}"`);
}
const esperar = (page: Page, t: string, timeout = 20000) =>
  page.waitForFunction((t) => (document.body.textContent ?? '').includes(t), { timeout }, t);

async function examen(page: Page, slug: string, bien: boolean) {
  const l = L.find((x) => x.leccion.slug === slug)!.leccion as any;
  await go(page, `/ruta/${ID}/${slug}`);
  await page.evaluate(() => {
    const b = [...document.querySelectorAll('button')].find((b) => /Empezar el examen|Intentar de nuevo|Repasar el examen/.test(b.textContent ?? ''));
    b?.click();
  });
  await esperar(page, 'contestadas');
  for (const p of l.preguntas) {
    const op = bien ? p.opciones.find((o: any) => o.correcta) : p.opciones.find((o: any) => !o.correcta);
    const ok = await page.evaluate((enun, texto) => {
      const f = [...document.querySelectorAll('fieldset')].find((f) => f.textContent?.includes(enun));
      const lab = [...(f?.querySelectorAll('label') ?? [])].find((l) => l.textContent?.trim() === texto);
      lab?.querySelector('input')?.click();
      return Boolean(lab);
    }, p.enunciado, op.texto);
    if (!ok) throw new Error(`${slug}: sin opción para ${p.id}`);
  }
  await clickText(page, 'button', 'Enviar examen');
  await page.waitForFunction(() => !document.body.textContent?.includes('Enviar examen'), { timeout: 20000 });
  await new Promise((r) => setTimeout(r, 400));
  const txt = await page.evaluate(() => document.body.textContent ?? '');
  if (!bien && txt.includes('La correcta:')) problemas.push(`${slug}: reprobado revela la correcta`);
  if (bien && !/100%|Aprobado|aprobaste/i.test(txt)) problemas.push(`${slug}: todo correcto no aprueba`);
  return txt;
}
async function practica(page: Page, slug: string) {
  const l = L.find((x) => x.leccion.slug === slug)!.leccion as any;
  await go(page, `/ruta/${ID}/${slug}`);
  await page.type('#entrega', l.solucion.slice(0, 1500), { delay: 0 });
  await clickText(page, 'button', l.proyecto ? 'Entregar el proyecto' : 'Enviar a revisión');
  await esperar(page, 'Guardar mi autoevaluación', 40000);
  for (const c of l.rubrica) await clickText(page, 'button', c.titulo);
  await clickText(page, 'button', 'Guardar mi autoevaluación');
  await page.waitForFunction(() => !document.body.textContent?.includes('Guardando…'), { timeout: 20000 });
  await new Promise((r) => setTimeout(r, 600));
}

(async () => {
  const browser = await puppeteer.launch({ headless: true, executablePath: process.env.CHROME, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  page.on('console', (m) => m.type() === 'error' && problemas.push(`consola: ${m.text().slice(0, 140)}`));
  page.on('pageerror', (e) => problemas.push(`pageerror: ${String(e).slice(0, 140)}`));
  page.on('response', (r) => r.status() >= 500 && problemas.push(`${r.status()} ${r.url()}`));
  await page.setViewport({ width: 1280, height: 900 });
  await browser.setCookie({ name: 'academia-acceso', value: process.env.TOKEN!, domain: 'localhost', path: '/' });

  await go(page, `/${ID}`); await shot(page, '01-portal', false);
  await go(page, `/ruta/${ID}`); await shot(page, '02-portada');

  await go(page, `/ruta/${ID}/diagnostico`);
  for (const [i, p] of curso.diagnostico.entries()) {
    await esperar(page, p.enunciado);
    await clickText(page, 'button[role=radio]', p.opciones.find((o) => o.correcta)!.texto);
    await clickText(page, 'button', i === curso.diagnostico.length - 1 ? 'Ver mi nivel' : 'Siguiente');
  }
  await esperar(page, 'Tu punto de partida');
  await shot(page, '03-diagnostico');

  const lectura = L.find((l) => l.leccion.tipo === 'lectura')!.leccion as any;
  await go(page, `/ruta/${ID}/${lectura.slug}`);
  await clickText(page, 'button[role=radio]', lectura.chequeo[0].opciones.find((o: any) => o.correcta).texto);
  await clickText(page, 'button', 'Marcar como completada');
  await new Promise((r) => setTimeout(r, 1200));
  await shot(page, '04-lectura');

  const examenes = L.filter((l) => l.leccion.tipo === 'examen').map((l) => l.leccion.slug);
  await examen(page, examenes[0], false); await shot(page, '05-examen-reprobado');
  for (const s of examenes) await examen(page, s, true);
  await shot(page, '06-examen-aprobado');

  const proyecto = L.find((l) => (l.leccion as any).proyecto)!.leccion.slug;
  await practica(page, proyecto);
  await go(page, `/ruta/${ID}/certificado`);
  await shot(page, '07-certificado');
  const cert = await page.evaluate(() => document.body.textContent ?? '');
  if (!cert.includes('Se certifica que')) problemas.push('certificado no disponible con todo aprobado');

  await page.setViewport({ width: 400, height: 860 });
  await go(page, `/ruta/${ID}`);
  const desborda = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  if (desborda) problemas.push('la portada desborda a 400px');
  await shot(page, '08-movil');
  const lecturaMovil = L.filter((l) => l.leccion.tipo === 'lectura')[2]?.leccion.slug ?? lectura.slug;
  await go(page, `/ruta/${ID}/${lecturaMovil}`);
  if (await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)) problemas.push(`${lecturaMovil} desborda a 400px`);
  await page.evaluate(() => localStorage.setItem('academia-theme', 'dark'));
  await page.reload({ waitUntil: 'networkidle0' });
  await shot(page, '09-movil-oscuro');

  await browser.close();
  log(`${ID}: ${problemas.length ? 'PROBLEMAS\n- ' + problemas.join('\n- ') : 'sin problemas'}`);
  if (problemas.length) process.exitCode = 1;
})().catch((e) => { console.error(`${ID} FALLÓ:`, e.message, problemas); process.exit(1); });
