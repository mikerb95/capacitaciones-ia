import { readFileSync } from 'node:fs';
import puppeteer from 'puppeteer';
const TMP = '/tmp/claude-1000/-home-mike-dev-work-github-com-capacitaciones-ia/4621cf7a-8c97-4ca4-8993-1efb9d50db97/scratchpad/';
const token = readFileSync(TMP + 'token.txt', 'utf8').trim();
const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
const p = await browser.newPage();
await p.setCookie({ name: 'academia-admin', value: token, domain: 'localhost', path: '/' });
const errs = [];
p.on('pageerror', (e) => errs.push('pageerror: ' + e.message));
p.on('console', (m) => m.type() === 'error' && errs.push('console: ' + m.text().slice(0, 140)));
for (const [name, url, w, h] of [
  ['accesos', '/admin/accesos', 1440, 1000],
  ['accesos-todas', '/admin/accesos?estado=todas', 1440, 1000],
  ['accesos-ficha', '/admin/accesos/3', 1440, 1000],
  ['accesos-movil', '/admin/accesos', 390, 844],
]) {
  await p.setViewport({ width: w, height: h });
  await p.goto('http://localhost:3000' + url, { waitUntil: 'networkidle0' });
  const m = await p.evaluate((vw) => ({
    scroll: document.documentElement.scrollWidth > vw + 2,
    cortados: [...document.querySelectorAll('header a, header button')]
      .filter((el) => el.getBoundingClientRect().right > vw + 1).length,
  }), w);
  console.log(name.padEnd(16), w + 'px · scroll horizontal:', m.scroll, '· controles cortados:', m.cortados);
  await p.screenshot({ path: TMP + 'r-' + name + '.png', fullPage: w > 400 });
}
console.log(errs.length ? 'ERRORES:\n' + errs.join('\n') : 'sin errores de consola');
await browser.close();
