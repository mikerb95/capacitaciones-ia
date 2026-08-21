import { readFileSync } from 'node:fs';
import puppeteer from 'puppeteer';
const TMP = '/tmp/claude-1000/-home-mike-dev-work-github-com-capacitaciones-ia/4621cf7a-8c97-4ca4-8993-1efb9d50db97/scratchpad/';
const token = readFileSync(TMP + 'token.txt', 'utf8').trim();
const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
const p = await browser.newPage();
await p.setCookie({ name: 'academia-admin', value: token, domain: 'localhost', path: '/' });
for (const [w, h, url, name] of [[390, 844, '/admin', 'movil'], [390, 844, '/admin/accesos', 'movil-accesos'], [1440, 1000, '/admin/modulos', 'modulos']]) {
  await p.setViewport({ width: w, height: h });
  await p.goto('http://localhost:3000' + url, { waitUntil: 'networkidle0' });
  const m = await p.evaluate((vw) => {
    // ¿Queda algún control del encabezado fuera del borde derecho?
    const header = document.querySelector('header');
    const fuera = [...header.querySelectorAll('a,button')]
      .filter((el) => el.getBoundingClientRect().right > vw + 1)
      .map((el) => el.textContent.trim().slice(0, 20) || 'sin texto');
    return { fuera, scroll: document.documentElement.scrollWidth > vw + 2 };
  }, w);
  console.log(name.padEnd(14), w + 'px · controles cortados:', m.fuera.length ? m.fuera.join(', ') : 'ninguno', '· scroll horizontal:', m.scroll);
  await p.screenshot({ path: TMP + 'app-' + name + '.png' });
}
await browser.close();
