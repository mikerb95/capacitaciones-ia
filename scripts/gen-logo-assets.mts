/**
 * Escribe los logos de las plataformas a `public/logos/` como SVG y como PNG.
 *
 *   npm run logos
 *
 * En la aplicación los logos viven embebidos como `data:` URI dentro de
 * `src/lib/logos.tsx`, que es lo que le conviene al navegador. Pero hay dos
 * consumidores que no pueden leer un `data:` URI de un módulo de TypeScript:
 *
 * - Word, en las plantillas DOCX, que necesita un PNG de verdad.
 * - El README en GitHub, que tampoco renderiza imágenes en `data:` URI.
 *
 * Así que esto no es una fuente nueva de logos: es la misma, exportada a
 * archivos. Si se cambia un logo, se regenera `logos.tsx` con `gen-logos.mjs`
 * y después esto.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import puppeteer from 'puppeteer';
import { PLATFORM_LOGOS } from '../src/lib/brand-logos';
import { LOGOS } from '../src/lib/logos';

/** Lado mayor del PNG. Se pide grande para que aguante el zoom en Word. */
const PNG_SIZE = 128;

const OUT = path.join(process.cwd(), 'public', 'logos');

await mkdir(OUT, { recursive: true });

// El PNG se saca con el navegador y no con una librería de rasterizado porque
// estos SVG pintan con degradados: un rasterizador a medias los deja planos.
const browser = await puppeteer.launch({ headless: true });

try {
  for (const [platformId, logoName] of Object.entries(PLATFORM_LOGOS)) {
    const logo = LOGOS[logoName];
    if (!logo) throw new Error(`El logo ${logoName} no está en logos.tsx`);

    const svg = decodeURIComponent(logo.src.replace('data:image/svg+xml,', ''));
    await writeFile(path.join(OUT, `${platformId}.svg`), svg);

    const width = logo.ratio >= 1 ? PNG_SIZE : Math.round(PNG_SIZE * logo.ratio);
    const height = logo.ratio >= 1 ? Math.round(PNG_SIZE / logo.ratio) : PNG_SIZE;

    const page = await browser.newPage();
    try {
      await page.setViewport({ width, height, deviceScaleFactor: 1 });
      // El fondo va transparente: el logo se usa sobre el tinte de la marca en
      // los PDF y sobre el blanco de Word.
      await page.setContent(
        `<style>html,body{margin:0;background:transparent}svg{display:block}</style>${svg.replace(
          '<svg ',
          `<svg width="${width}" height="${height}" `,
        )}`,
      );
      const png = await page.screenshot({ omitBackground: true, type: 'png' });
      await writeFile(path.join(OUT, `${platformId}.png`), png);
      console.log(`  ✓ ${platformId}  ${width}×${height}`);
    } finally {
      await page.close();
    }
  }
} finally {
  await browser.close();
}

console.log('\nListo. Logos en public/logos/');
