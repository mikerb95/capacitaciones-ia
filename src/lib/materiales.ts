/**
 * El material que se lleva el asistente. Cada documento se declara aquí una vez
 * y de esa declaración salen tres cosas: la ruta imprimible, el archivo que
 * genera `scripts/build-materiales.ts` y el enlace de descarga del portal.
 *
 * De dónde sale el contenido de cada uno:
 *
 * - `guia-de-prompts` se arma leyendo la base. No hay una sola línea escrita a
 *   mano: si cambias un prompt en el seed y regeneras, el PDF queda al día.
 * - `checklist-de-revision` es editorial y vive en este archivo. Una lista de
 *   una página no se puede derivar de los 24 `mistakes` del seed sin quedar
 *   ilegible, así que se curó a mano a partir de las prácticas y los errores.
 * - Las plantillas DOCX viven en el script que las genera, porque son
 *   documentos para editar y no para leer.
 */

export type MaterialKind = 'pdf' | 'docx';

export type Material = {
  /** Identifica el documento en la ruta y en el nombre del archivo. */
  slug: string;
  title: string;
  kind: MaterialKind;
  /** Cómo se produce: una ruta imprimible o el generador de DOCX del script. */
  source: 'print' | 'docx';
};

export const MATERIALES: Record<string, Material[]> = {
  chatgpt: [
    { slug: 'guia-de-prompts', title: 'Guía de prompts', kind: 'pdf', source: 'print' },
    { slug: 'plantilla-de-gpt', title: 'Plantilla de GPT', kind: 'docx', source: 'docx' },
    { slug: 'checklist-de-revision', title: 'Checklist de revisión', kind: 'pdf', source: 'print' },
  ],
};

export const fileName = (m: Material) => `${m.slug}.${m.kind}`;

export function findMaterial(platformId: string, slug: string) {
  return MATERIALES[platformId]?.find((m) => m.slug === slug);
}

/**
 * Resuelve un nombre de archivo (`guia-de-prompts.pdf`) al material declarado.
 * Se usa en la descarga, así que rechaza cualquier cosa que no esté en el
 * catálogo en vez de tocar el disco con lo que venga en la URL.
 */
export function materialByFile(platformId: string, file: string) {
  return MATERIALES[platformId]?.find((m) => fileName(m) === file);
}

/** El `href` que se guarda en `platform_downloads` y que pinta el portal. */
export const materialHref = (platformId: string, m: Material) =>
  `/api/materiales/${platformId}/${fileName(m)}`;

// --- Contenido editorial ---------------------------------------------------

export type ChecklistBlock = { title: string; items: string[] };

/**
 * Checklist de revisión de ChatGPT. Cuatro bloques de cuatro, que es lo que
 * cabe en una hoja sin que haya que entrecerrar los ojos.
 */
export const CHECKLIST: Record<string, { intro: string; blocks: ChecklistBlock[] }> = {
  chatgpt: {
    intro:
      'Cuatro momentos en los que vale la pena parar treinta segundos. No es un trámite: es lo que separa un borrador útil de algo que toca rehacer.',
    blocks: [
      {
        title: 'Antes de pedir',
        items: [
          'Dije para quién es, para qué sirve y de qué extensión lo quiero.',
          'Di el contexto que necesitaría una persona nueva: área, cliente, restricción.',
          'Pedí el formato de salida, no solo el tema.',
          'Si el encargo tiene un límite, lo escribí: no prometer plazos, no dar precios.',
        ],
      },
      {
        title: 'Antes de creerle un dato',
        items: [
          'Toda cifra que va a un comité o a un cliente la abrí en el documento original.',
          'En Deep Research y en company knowledge abrí las citas. No basta con que estén.',
          'Verifiqué nombres propios, cargos y fechas contra la fuente.',
          'Si no encontró el dato, lo dice. Un número estimado no entra a una decisión.',
        ],
      },
      {
        title: 'Antes de compartir',
        items: [
          'No subí datos personales, salarios ni información de un tercero.',
          'Trabajé desde la cuenta corporativa, no desde una personal.',
          'Si es un GPT del área, lo probé con los tres casos difíciles antes de publicarlo.',
          'Los archivos de referencia están vigentes. Ninguno quedó del año pasado.',
        ],
      },
      {
        title: 'Antes de mandarlo',
        items: [
          'Lo leí completo, no solo el primer párrafo.',
          'El tono es el de la empresa, no el que trae el modelo por defecto.',
          'Corregí sobre el texto que ya estaba, sin arrancar de cero.',
          'Si quedó bueno, lo guardé donde el área lo vuelva a encontrar.',
        ],
      },
    ],
  },
};
