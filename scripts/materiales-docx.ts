/**
 * Las plantillas en DOCX. A diferencia de la guía y del checklist, estas no se
 * derivan de la base: son documentos para editar, así que el contenido se
 * escribe aquí. Cada generador devuelve un Buffer listo para escribir a disco.
 */
import {
  AlignmentType,
  BorderStyle,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from 'docx';

const INK = '101426';
const MUTED = '565F7A';
const FAINT = '8189A3';
const BRAND = '10A37F'; // el verde de ChatGPT
const SOFT = 'F2F5FD';

const NONE = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const HAIRLINE = { style: BorderStyle.SINGLE, size: 4, color: 'DCE3F3' };

/**
 * Espacio en blanco para llenar a mano. Va con guiones bajos y no con espacios
 * subrayados: ni Word ni LibreOffice dibujan el subrayado sobre espacios al
 * final de una línea, y la plantilla saldría sin dónde escribir.
 */
const blank = (len = 40) => new TextRun({ text: '_'.repeat(len), color: 'C3CBE0' });

const kicker = (text: string) =>
  new Paragraph({
    spacing: { before: 360, after: 100 },
    children: [
      new TextRun({ text: text.toUpperCase(), bold: true, size: 16, color: BRAND, characterSpacing: 30 }),
    ],
  });

const body = (text: string, opts: { color?: string; size?: number; after?: number } = {}) =>
  new Paragraph({
    spacing: { after: opts.after ?? 120, line: 300 },
    children: [new TextRun({ text, size: opts.size ?? 20, color: opts.color ?? INK })],
  });

const hint = (text: string) =>
  new Paragraph({
    spacing: { after: 200, line: 280 },
    children: [new TextRun({ text, size: 17, color: MUTED, italics: true })],
  });

const fill = (label: string, len = 46) =>
  new Paragraph({
    spacing: { after: 160, line: 300 },
    children: [new TextRun({ text: label, size: 20, color: INK }), blank(len)],
  });

const bullet = (text: string) =>
  new Paragraph({
    bullet: { level: 0 },
    spacing: { after: 80, line: 280 },
    children: [new TextRun({ text, size: 19, color: MUTED })],
  });

function cell(text: string, opts: { head?: boolean; width?: number } = {}) {
  return new TableCell({
    width: opts.width ? { size: opts.width, type: WidthType.PERCENTAGE } : undefined,
    margins: { top: 90, bottom: 90, left: 120, right: 120 },
    shading: opts.head ? { type: ShadingType.CLEAR, fill: SOFT, color: 'auto' } : undefined,
    children: [
      new Paragraph({
        children: [
          new TextRun({
            text,
            size: opts.head ? 16 : 19,
            bold: opts.head,
            color: opts.head ? FAINT : INK,
          }),
        ],
      }),
    ],
  });
}

function table(head: string[], rows: string[][], widths: number[]) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: HAIRLINE,
      bottom: HAIRLINE,
      left: NONE,
      right: NONE,
      insideHorizontal: HAIRLINE,
      insideVertical: NONE,
    },
    rows: [
      new TableRow({
        children: head.map((h, i) => cell(h, { head: true, width: widths[i] })),
      }),
      ...rows.map(
        (r) => new TableRow({ children: r.map((c, i) => cell(c, { width: widths[i] })) }),
      ),
    ],
  });
}

/** Plantilla de GPT de ChatGPT. */
export function plantillaDeGpt(): Promise<Buffer> {
  const doc = new Document({
    creator: 'Academia IA',
    title: 'Plantilla de GPT',
    description: 'Estructura de instrucciones, límites y archivos para armar el GPT del área.',
    styles: {
      default: {
        document: { run: { font: 'Calibri', size: 20, color: INK } },
      },
      paragraphStyles: [
        {
          id: 'Heading1',
          name: 'Heading 1',
          basedOn: 'Normal',
          run: { size: 40, bold: true, color: INK },
          paragraph: { spacing: { after: 160 } },
        },
        {
          id: 'Heading2',
          name: 'Heading 2',
          basedOn: 'Normal',
          run: { size: 24, bold: true, color: INK },
          paragraph: { spacing: { before: 320, after: 120 } },
        },
      ],
    },
    sections: [
      {
        properties: {
          page: { margin: { top: 1000, bottom: 1000, left: 1000, right: 1000 } },
        },
        children: [
          new Paragraph({
            spacing: { after: 40 },
            children: [
              new TextRun({
                text: 'CHATGPT · MATERIAL DE LA CAPACITACIÓN',
                bold: true,
                size: 16,
                color: FAINT,
                characterSpacing: 30,
              }),
            ],
          }),
          new Paragraph({ heading: HeadingLevel.HEADING_1, text: 'Plantilla de GPT' }),
          body(
            'Un GPT es ChatGPT con instrucciones permanentes y hasta 20 archivos de referencia. Se configura una vez y todo el equipo lo usa con el mismo tono y los mismos límites, en vez de que cada quien improvise su prompt.',
            { color: MUTED },
          ),
          body(
            'Esta plantilla es para llenarla. Al final queda un bloque listo para pegar en el campo de instrucciones.',
            { color: MUTED, after: 260 },
          ),

          kicker('Cómo se usa'),
          bullet('Parte de un prompt que ya te funciona. No lo inventes desde cero.'),
          bullet('Llena los espacios subrayados. Lo que no aplique, bórralo.'),
          bullet('Antes de compartirlo con el área, córrelo con los tres casos de la sección 6.'),

          new Paragraph({ heading: HeadingLevel.HEADING_2, text: '1. Identidad' }),
          hint('¿Quién es este asistente y para quién trabaja? Si es para una sola tarea, dilo aquí.'),
          fill('Eres el asistente de ', 30),
          fill('de la empresa ', 34),

          new Paragraph({ heading: HeadingLevel.HEADING_2, text: '2. Qué hace' }),
          hint('Las tres cosas que resuelve. Tres. Si te salen ocho, son dos GPT distintos.'),
          fill('1. ', 52),
          fill('2. ', 52),
          fill('3. ', 52),

          new Paragraph({ heading: HeadingLevel.HEADING_2, text: '3. Qué nunca hace' }),
          hint(
            'Aquí es donde se evitan los problemas con clientes. Asesoría legal o tributaria, precios que no están en la tabla, plazos que la empresa no puede cumplir.',
          ),
          fill('Nunca ', 48),
          fill('Si te preguntan por eso, responde que ', 24),
          fill('y ofrece ', 45),

          new Paragraph({ heading: HeadingLevel.HEADING_2, text: '4. Formato de la respuesta' }),
          hint(
            'Ejemplo: resumen en una línea, tres puntos de detalle y una acción concreta al final. Máximo 200 palabras, en español neutro.',
          ),
          fill('Estructura: ', 44),
          fill('Extensión máxima: ', 38),
          fill('Tono: ', 48),

          new Paragraph({ heading: HeadingLevel.HEADING_2, text: '5. Archivos de referencia' }),
          hint(
            'Caben hasta 20, pero con tres actualizados responde mejor que con quince donde la mitad está vencida. Nada con datos personales ni con salarios: el GPT es compartido.',
          ),
          table(
            ['Archivo', 'Qué contiene', 'Dueño', 'Última revisión'],
            [
              ['', '', '', ''],
              ['', '', '', ''],
              ['', '', '', ''],
              ['', '', '', ''],
            ],
            [30, 34, 20, 16],
          ),

          new Paragraph({ heading: HeadingLevel.HEADING_2, text: '6. Casos de prueba' }),
          hint('Si aguanta estos tres, ya se puede compartir con el área.'),
          table(
            ['Caso difícil', 'Qué debería responder'],
            [
              ['La queja rara, la que no está en el manual', ''],
              ['El descuento que no existe', ''],
              ['El dato que no está en los archivos', ''],
            ],
            [40, 60],
          ),

          new Paragraph({ heading: HeadingLevel.HEADING_2, text: '7. Revisión' }),
          hint('Un GPT sin dueño queda con los archivos del año pasado y se sigue usando igual.'),
          fill('Responsable del contenido: ', 34),
          fill('Cada cuánto se revisa: ', 38),
          fill('Próxima revisión: ', 40),

          new Paragraph({ pageBreakBefore: true, spacing: { after: 40 }, children: [] }),
          new Paragraph({ heading: HeadingLevel.HEADING_2, text: 'Instrucciones listas para pegar' }),
          hint(
            'Copia este bloque en el campo de instrucciones del GPT, ya con tus respuestas de las secciones 1 a 4.',
          ),
          new Paragraph({
            spacing: { before: 120 },
            border: { top: HAIRLINE, bottom: HAIRLINE, left: HAIRLINE, right: HAIRLINE },
            shading: { type: ShadingType.CLEAR, fill: SOFT, color: 'auto' },
            children: PEGAR.map(
              (line, i) =>
                new TextRun({
                  text: line,
                  font: 'Consolas',
                  size: 18,
                  color: INK,
                  // Word no interpreta \n dentro de un run: el salto es explícito.
                  break: i === 0 ? 0 : 1,
                }),
            ),
          }),

          new Paragraph({
            spacing: { before: 520 },
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({
                text: 'ChatGPT · Material de la capacitación. Uso interno.',
                size: 15,
                color: FAINT,
              }),
            ],
          }),
        ],
      },
    ],
  });

  return Packer.toBuffer(doc) as unknown as Promise<Buffer>;
}

/**
 * El bloque final. Va con saltos de línea reales para que se pueda copiar tal
 * cual desde Word al campo de instrucciones.
 */
const PEGAR: string[] = [
  'Eres el asistente de [área] de [empresa].',
  '',
  'Resuelves tres cosas: [1], [2] y [3].',
  '',
  'Respondes en [tono], en máximo [200] palabras, con esta estructura:',
  'resumen en una línea, tres puntos de detalle y una acción concreta al final.',
  '',
  'Nunca [límite]. Si te preguntan por eso, responde que se debe consultar',
  'con [responsable] y ofrece [alternativa].',
  '',
  'Usa [documento] como única fuente de [precios / plazos / política].',
  'Si el dato no está ahí, di que no lo tienes en vez de estimarlo.',
  '',
  'Si falta información para responder bien, pídela antes de responder.',
];

/** Catálogo de generadores, por `plataforma/slug`. */
export const DOCX_BUILDERS: Record<string, () => Promise<Buffer>> = {
  'chatgpt/plantilla-de-gpt': plantillaDeGpt,
};
