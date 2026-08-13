import { parse, type HTMLElement } from 'node-html-parser';

export type ParsedSlide = { title: string | null; html: string; notes: string | null };

export type ParsedDeck = {
  title: string | null;
  styles: string;
  slides: ParsedSlide[];
};

/**
 * Toma el HTML exportado desde Claude Design y lo parte en láminas.
 *
 * Convención: cada lámina es una <section> de primer nivel. Los <style> del
 * documento se guardan aparte porque los comparten todas las láminas.
 * Los <script> se descartan: las láminas se pintan en un iframe sin permisos
 * de ejecución, así que un script importado nunca correría de todos modos.
 */
export function parseDeck(source: string): ParsedDeck {
  const root = parse(source, {
    lowerCaseTagName: false,
    comment: false,
    blockTextElements: { script: false, noscript: false, style: true, pre: true },
  });

  root.querySelectorAll('script').forEach((node) => node.remove());

  const styles = root
    .querySelectorAll('style')
    .map((node) => node.innerHTML)
    .join('\n\n')
    .trim();

  root.querySelectorAll('style').forEach((node) => node.remove());

  const title =
    root.querySelector('title')?.innerText?.trim() ||
    root.querySelector('h1')?.innerText?.trim() ||
    null;

  // Las <section> anidadas dentro de otra <section> no cuentan como lámina.
  const sections = root
    .querySelectorAll('section')
    .filter((node) => !node.closest('section section'));

  return {
    title,
    styles,
    slides: sections.map((node) => {
      // Las notas se extraen y se sacan del HTML: son solo para el expositor.
      const notes = takeNotes(node);
      stripEventHandlers(node);
      return { title: headingOf(node), html: node.outerHTML.trim(), notes };
    }),
  };
}

function headingOf(node: HTMLElement): string | null {
  const heading = node.querySelector('h1, h2, h3');
  const text = heading?.innerText?.replace(/\s+/g, ' ').trim();
  return text ? text.slice(0, 200) : null;
}

/**
 * Saca las notas del expositor de la lámina y devuelve su texto.
 * El elemento se elimina para que la nota no acabe proyectada en la sala.
 */
function takeNotes(node: HTMLElement): string | null {
  const holders = node.querySelectorAll('[data-notes], .notes');
  if (holders.length === 0) return null;

  const text = holders
    .map((holder) => holder.innerText.trim())
    .filter(Boolean)
    .join('\n\n');

  holders.forEach((holder) => holder.remove());
  return text || null;
}

/**
 * Quita los atributos on* recorriendo el DOM, no el texto serializado:
 * una expresión regular sobre el HTML se come el contenido de las láminas
 * (por ejemplo "online = 30 min" desaparecería).
 */
function stripEventHandlers(node: HTMLElement): void {
  const nodes = [node, ...node.querySelectorAll('*')];
  for (const element of nodes) {
    for (const name of Object.keys(element.attributes)) {
      if (/^on/i.test(name)) element.removeAttribute(name);
    }
  }
}

export function slugify(value: string): string {
  return (
    value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60) || 'presentacion'
  );
}
