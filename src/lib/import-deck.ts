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

  const slides = sections.length ? sections : fallbackSlides(root);

  return {
    title,
    styles,
    slides: slides.map((node) => ({
      title: headingOf(node),
      html: stripEventHandlers(node.outerHTML).trim(),
      notes: notesOf(node),
    })),
  };
}

/** Si no vino ninguna <section>, se trata el cuerpo entero como una sola lámina. */
function fallbackSlides(root: HTMLElement): HTMLElement[] {
  const body = root.querySelector('body') ?? root;
  return body.innerHTML.trim() ? [body] : [];
}

function headingOf(node: HTMLElement): string | null {
  const heading = node.querySelector('h1, h2, h3');
  const text = heading?.innerText?.replace(/\s+/g, ' ').trim();
  return text ? text.slice(0, 200) : null;
}

/** Notas del expositor: cualquier elemento marcado con data-notes o .notes. */
function notesOf(node: HTMLElement): string | null {
  const notes = node.querySelector('[data-notes], .notes');
  const text = notes?.innerText?.trim();
  return text ? text : null;
}

/** Quita los atributos on* por si el HTML se llegara a renderizar fuera del iframe. */
function stripEventHandlers(html: string): string {
  return html.replace(/\son[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '');
}

export function slugify(value: string): string {
  return (
    value
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60) || 'presentacion'
  );
}
