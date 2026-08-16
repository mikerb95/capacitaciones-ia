/**
 * Las plantillas en DOCX. A diferencia de la guía y del checklist, estas no se
 * derivan de la base: son documentos para editar, así que el contenido se
 * escribe aquí. Cada generador devuelve un Buffer listo para escribir a disco.
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import {
  AlignmentType,
  BorderStyle,
  Document,
  type FileChild,
  HeadingLevel,
  ImageRun,
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
const SOFT = 'F2F5FD';

/** El color de cada plataforma, el mismo que usa su portal. */
const BRAND = {
  chatgpt: '10A37F',
  claude: 'C15F3C',
  gemini: '3B5BDB',
  copilot: '0B63CE',
};

const NONE = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const HAIRLINE = { style: BorderStyle.SINGLE, size: 4, color: 'DCE3F3' };

/**
 * Espacio en blanco para llenar a mano. Va con guiones bajos y no con espacios
 * subrayados: ni Word ni LibreOffice dibujan el subrayado sobre espacios al
 * final de una línea, y la plantilla saldría sin dónde escribir.
 */
const blank = (len = 40) => new TextRun({ text: '_'.repeat(len), color: 'C3CBE0' });

const kicker = (text: string, brand: string) =>
  new Paragraph({
    spacing: { before: 360, after: 100 },
    children: [
      new TextRun({
        text: text.toUpperCase(),
        bold: true,
        size: 16,
        color: brand,
        characterSpacing: 30,
      }),
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

/**
 * El bloque monoespaciado que se copia tal cual a la herramienta. Es un solo
 * párrafo con saltos explícitos: Word no interpreta el \n dentro de un run.
 */
const pasteBlock = (lines: string[]) =>
  new Paragraph({
    spacing: { before: 120 },
    border: { top: HAIRLINE, bottom: HAIRLINE, left: HAIRLINE, right: HAIRLINE },
    shading: { type: ShadingType.CLEAR, fill: SOFT, color: 'auto' },
    children: lines.map(
      (line, i) =>
        new TextRun({
          text: line,
          font: 'Consolas',
          size: 18,
          color: INK,
          break: i === 0 ? 0 : 1,
        }),
    ),
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

type DocSpec = {
  /** Nombre de la plataforma como aparece en el encabezado y en el pie. */
  platform: string;
  /** Id de la plataforma: de ahí sale el PNG del logo en `public/logos/`. */
  id: string;
  title: string;
  description: string;
  /** Los párrafos de entrada, antes del primer bloque. */
  lead: string[];
  children: FileChild[];
};

/**
 * El logo de la marca para el encabezado. Word no entiende un `data:` URI ni
 * un SVG, así que va el PNG que deja `npm run logos`. Si falta el archivo, el
 * documento sale sin logo en vez de fallar: es un adorno del encabezado y no
 * vale la pena perder la plantilla entera por él.
 */
function brandLogo(id: string) {
  const file = path.join(process.cwd(), 'public', 'logos', `${id}.png`);

  let data: Buffer;
  try {
    data = readFileSync(file);
  } catch {
    console.warn(`  ! sin logo para ${id}: falta ${file}. Corre \`npm run logos\`.`);
    return [];
  }

  return [
    new ImageRun({
      type: 'png',
      data,
      transformation: { width: 13, height: 13 },
    }),
    // Word pega la imagen al texto que sigue: el espacio es la separación.
    new TextRun({ text: '  ' }),
  ];
}

/**
 * El armazón que comparten todas las plantillas: estilos, márgenes, el
 * encabezado con el nombre de la plataforma, el título, la entrada y el pie.
 * Lo propio de cada documento entra por `children`.
 */
function buildDoc(spec: DocSpec): Promise<Buffer> {
  const doc = new Document({
    creator: 'Academia IA',
    title: spec.title,
    description: spec.description,
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
              ...brandLogo(spec.id),
              new TextRun({
                text: `${spec.platform} · MATERIAL DE LA CAPACITACIÓN`.toUpperCase(),
                bold: true,
                size: 16,
                color: FAINT,
                characterSpacing: 30,
              }),
            ],
          }),
          new Paragraph({ heading: HeadingLevel.HEADING_1, text: spec.title }),
          ...spec.lead.map((text, i) =>
            body(text, {
              color: MUTED,
              after: i === spec.lead.length - 1 ? 260 : 120,
            }),
          ),
          ...spec.children,
          new Paragraph({
            spacing: { before: 520 },
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({
                text: `${spec.platform} · Material de la capacitación. Uso interno.`,
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

/** Plantilla de GPT de ChatGPT. */
export function plantillaDeGpt(): Promise<Buffer> {
  const brand = BRAND.chatgpt;

  return buildDoc({
    platform: 'ChatGPT',
    title: 'Plantilla de GPT',
    description: 'Estructura de instrucciones, límites y archivos para armar el GPT del área.',
    lead: [
      'Un GPT es ChatGPT con instrucciones permanentes y hasta 20 archivos de referencia. Se configura una vez y todo el equipo lo usa con el mismo tono y los mismos límites, en vez de que cada quien improvise su prompt.',
      'Esta plantilla es para llenarla. Al final queda un bloque listo para pegar en el campo de instrucciones.',
    ],
    children: [
      kicker('Cómo se usa', brand),
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

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        text: '3. Qué nunca hace',
      }),
      hint(
        'Aquí es donde se evitan los problemas con clientes. Asesoría legal o tributaria, precios que no están en la tabla, plazos que la empresa no puede cumplir.',
      ),
      fill('Nunca ', 48),
      fill('Si te preguntan por eso, responde que ', 24),
      fill('y ofrece ', 45),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        text: '4. Formato de la respuesta',
      }),
      hint(
        'Ejemplo: resumen en una línea, tres puntos de detalle y una acción concreta al final. Máximo 200 palabras, en español neutro.',
      ),
      fill('Estructura: ', 44),
      fill('Extensión máxima: ', 38),
      fill('Tono: ', 48),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        text: '5. Archivos de referencia',
      }),
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

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        text: '6. Casos de prueba',
      }),
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

      new Paragraph({
        pageBreakBefore: true,
        spacing: { after: 40 },
        children: [],
      }),
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        text: 'Instrucciones listas para pegar',
      }),
      hint(
        'Copia este bloque en el campo de instrucciones del GPT, ya con tus respuestas de las secciones 1 a 4.',
      ),
      pasteBlock(PEGAR),
    ],
  });
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

/** Plantilla de proyecto de Claude. */
export function plantillaDeProyecto(): Promise<Buffer> {
  const brand = BRAND.claude;

  return buildDoc({
    platform: 'Claude',
    title: 'Plantilla de proyecto',
    description: 'Instrucciones base y lista de archivos para armar el proyecto de un cliente.',
    lead: [
      'Un proyecto es un espacio con sus propios documentos y sus propias instrucciones. Sirve para dejar de explicar el mismo contexto en cada conversación: quién es el cliente, cómo se le habla y qué no se le promete.',
      'Llena esta plantilla una vez por cliente o por área. Al final queda un bloque listo para pegar en las instrucciones del proyecto.',
    ],
    children: [
      kicker('Cómo se usa', brand),
      bullet('Un proyecto por cliente o por área. Si mezclas dos, las respuestas se contaminan.'),
      bullet('Llena los espacios subrayados. Lo que no aplique, bórralo.'),
      bullet(
        'Sube primero los tres documentos que de verdad se consultan, no los quince que existen.',
      ),

      new Paragraph({ heading: HeadingLevel.HEADING_2, text: '1. De quién es el proyecto' }),
      hint('El nombre que va a buscar el equipo cuando lo necesite. Sé literal.'),
      fill('Cliente o área: ', 36),
      fill('Responsable dentro de la empresa: ', 28),
      fill('Quiénes lo usan: ', 38),

      new Paragraph({ heading: HeadingLevel.HEADING_2, text: '2. Contexto permanente' }),
      hint(
        'Lo que habría que contarle a alguien que entra hoy al equipo: a qué se dedica el cliente, desde cuándo se trabaja con él, qué está en curso.',
      ),
      fill('', 60),
      fill('', 60),
      fill('', 60),

      new Paragraph({ heading: HeadingLevel.HEADING_2, text: '3. Qué se resuelve acá' }),
      hint('Las tareas que se repiten. Tres o cuatro, no una lista de todo lo posible.'),
      fill('1. ', 52),
      fill('2. ', 52),
      fill('3. ', 52),

      new Paragraph({ heading: HeadingLevel.HEADING_2, text: '4. Cómo se responde' }),
      hint('Ejemplo: en español neutro, sin tecnicismos, con el numeral del contrato citado.'),
      fill('Tono: ', 48),
      fill('Estructura: ', 44),
      fill('Cuando el dato viene de un documento: ', 22),

      new Paragraph({ heading: HeadingLevel.HEADING_2, text: '5. Qué nunca hace' }),
      hint(
        'Lo que evita los problemas: precios que no están en la tabla, plazos que la empresa no puede cumplir, interpretación legal del contrato.',
      ),
      fill('Nunca ', 48),
      fill('Si preguntan por eso, responde que ', 26),

      new Paragraph({ heading: HeadingLevel.HEADING_2, text: '6. Documentos del proyecto' }),
      hint(
        'Con tres documentos vigentes responde mejor que con quince donde la mitad está vencida. Nada con datos personales ni con salarios: el proyecto es compartido.',
      ),
      table(
        ['Documento', 'Para qué se consulta', 'Dueño', 'Vigente hasta'],
        [
          ['', '', '', ''],
          ['', '', '', ''],
          ['', '', '', ''],
          ['', '', '', ''],
        ],
        [30, 34, 20, 16],
      ),

      new Paragraph({ heading: HeadingLevel.HEADING_2, text: '7. Revisión' }),
      hint(
        'Un proyecto sin dueño queda con el contrato del año pasado y se sigue consultando igual.',
      ),
      fill('Responsable del contenido: ', 34),
      fill('Cada cuánto se revisa: ', 38),
      fill('Próxima revisión: ', 40),

      new Paragraph({ pageBreakBefore: true, spacing: { after: 40 }, children: [] }),
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        text: 'Instrucciones listas para pegar',
      }),
      hint(
        'Copia este bloque en las instrucciones del proyecto, ya con tus respuestas de las secciones 1 a 5.',
      ),
      pasteBlock(PEGAR_PROYECTO),
    ],
  });
}

const PEGAR_PROYECTO: string[] = [
  'Este proyecto es de [cliente / área]. Trabajas con [responsable] y con [equipo].',
  '',
  'Contexto: [a qué se dedica, desde cuándo, qué está en curso].',
  '',
  'Acá se resuelven tres cosas: [1], [2] y [3].',
  '',
  'Respondes en [tono], con esta estructura: [estructura].',
  'Cuando el dato venga de un documento del proyecto, cita el archivo y el',
  'numeral o la página. Si el dato no está en los documentos, dilo en vez de',
  'estimarlo.',
  '',
  'Nunca [límite]. Si preguntan por eso, responde que se debe consultar con',
  '[responsable] y ofrece [alternativa].',
  '',
  'Si falta información para responder bien, pídela antes de responder.',
];

/** Formato de skill de Claude. */
export function formatoDeSkill(): Promise<Buffer> {
  const brand = BRAND.claude;

  return buildDoc({
    platform: 'Claude',
    title: 'Formato de skill',
    description: 'Estructura para escribir un procedimiento de la empresa como skill.',
    lead: [
      'Una skill es un procedimiento de la empresa escrito una sola vez. Lo que hoy vive en la cabeza de quien lleva más tiempo, o en el prompt personal de alguien, queda escrito y se ejecuta igual cada vez que se invoca.',
      'Sirve para lo que se repite con un orden fijo: armar una cotización, revisar un contrato, preparar el informe del mes. Si la tarea cambia cada vez, no es una skill.',
    ],
    children: [
      kicker('Antes de escribirla', brand),
      bullet('Hazla tú primero, a mano, y anota los pasos mientras los das.'),
      bullet('Una skill por procedimiento. Si te salen dos caminos distintos, son dos skills.'),
      bullet(
        'Escribe el paso a paso como se lo dirías a alguien que entra hoy: sin sobreentendidos.',
      ),

      new Paragraph({ heading: HeadingLevel.HEADING_2, text: '1. Nombre' }),
      hint(
        'En minúsculas y con guiones, como se va a invocar: cotizacion-estandar, revision-de-contrato.',
      ),
      fill('Nombre: ', 42),
      fill('En una línea, qué hace: ', 34),

      new Paragraph({ heading: HeadingLevel.HEADING_2, text: '2. Cuándo se usa' }),
      hint('La situación concreta que la dispara, y en cuál no se usa aunque se parezca.'),
      fill('Se usa cuando ', 42),
      fill('No se usa para ', 42),

      new Paragraph({ heading: HeadingLevel.HEADING_2, text: '3. Qué necesita para arrancar' }),
      hint('Los datos o archivos sin los cuales el procedimiento no puede empezar.'),
      fill('1. ', 52),
      fill('2. ', 52),
      fill('3. ', 52),

      new Paragraph({ heading: HeadingLevel.HEADING_2, text: '4. El procedimiento' }),
      hint(
        'Un paso por fila, en orden. Si un paso tiene una regla, escríbela en la columna de la derecha.',
      ),
      table(
        ['Paso', 'Qué se hace', 'Regla o límite'],
        [
          ['1', '', ''],
          ['2', '', ''],
          ['3', '', ''],
          ['4', '', ''],
          ['5', '', ''],
        ],
        [10, 52, 38],
      ),

      new Paragraph({ heading: HeadingLevel.HEADING_2, text: '5. Qué entrega' }),
      hint('El formato exacto del resultado. Si es un documento, di sus secciones y su extensión.'),
      fill('Formato: ', 44),
      fill('Secciones: ', 42),
      fill('Extensión: ', 42),

      new Paragraph({ heading: HeadingLevel.HEADING_2, text: '6. Dónde para' }),
      hint(
        'El punto en el que tiene que devolver el control a una persona: aprobar un descuento, firmar, mandarle algo al cliente.',
      ),
      fill('Se detiene y pregunta cuando ', 32),
      fill('Nunca ', 48),

      new Paragraph({ heading: HeadingLevel.HEADING_2, text: '7. Prueba y dueño' }),
      hint('Si con este caso da el resultado de siempre, ya se puede compartir con el área.'),
      table(
        ['Caso de prueba', 'Qué debería entregar'],
        [
          ['', ''],
          ['', ''],
        ],
        [40, 60],
      ),
      new Paragraph({ spacing: { after: 120 }, children: [] }),
      fill('Responsable: ', 42),
      fill('Próxima revisión: ', 40),

      new Paragraph({ pageBreakBefore: true, spacing: { after: 40 }, children: [] }),
      new Paragraph({ heading: HeadingLevel.HEADING_2, text: 'La skill lista para pegar' }),
      hint('Copia este bloque con tus respuestas. Es el texto que lee Claude cuando la invocas.'),
      pasteBlock(PEGAR_SKILL),
    ],
  });
}

const PEGAR_SKILL: string[] = [
  'nombre: [nombre-de-la-skill]',
  'descripcion: [qué hace, en una línea]',
  '',
  'Se usa cuando [situación]. No se usa para [excepción].',
  '',
  'Necesita antes de empezar: [dato 1], [dato 2], [archivo].',
  'Si algo de eso falta, pídelo en vez de suponerlo.',
  '',
  'Procedimiento:',
  '1. [paso]',
  '2. [paso]',
  '3. [paso]',
  '4. [paso]',
  '',
  'Entrega [formato], con las secciones [secciones], en máximo [extensión].',
  '',
  'Detente y pregunta cuando [punto de control].',
  'Nunca [límite].',
];

/** Plantilla de Gem de Gemini. */
export function plantillaDeGem(): Promise<Buffer> {
  const brand = BRAND.gemini;

  return buildDoc({
    platform: 'Gemini',
    title: 'Plantilla de Gem',
    description: 'Estructura de instrucciones y archivos para armar el Gem del área.',
    lead: [
      'Un Gem es Gemini con instrucciones fijas y con los archivos de Drive que le indiques. Se arma una vez y el área entera trabaja con el mismo criterio, en vez de que cada quien reescriba su prompt cada mañana.',
      'Esta plantilla es para llenarla. Al final queda un bloque listo para pegar en el campo de instrucciones del Gem.',
    ],
    children: [
      kicker('Cómo se usa', brand),
      bullet('Parte de un prompt que ya te funciona. No lo inventes desde cero.'),
      bullet('Llena los espacios subrayados. Lo que no aplique, bórralo.'),
      bullet('Antes de compartirlo con el área, córrelo con los tres casos de la sección 6.'),

      new Paragraph({ heading: HeadingLevel.HEADING_2, text: '1. Identidad' }),
      hint('¿Quién es este asistente y para quién trabaja? Si es para una sola tarea, dilo aquí.'),
      fill('Eres el asistente de ', 30),
      fill('de la empresa ', 34),

      new Paragraph({ heading: HeadingLevel.HEADING_2, text: '2. Qué hace' }),
      hint('Las tres cosas que resuelve. Tres. Si te salen ocho, son dos Gems distintos.'),
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
        'Piensa en dónde se va a usar. Si el Gem redacta correos, el formato es un correo: asunto, dos párrafos y una pregunta al final.',
      ),
      fill('Estructura: ', 44),
      fill('Extensión máxima: ', 38),
      fill('Tono: ', 48),

      new Paragraph({ heading: HeadingLevel.HEADING_2, text: '5. Archivos de Drive' }),
      hint(
        'El Gem lee lo que le indiques de Drive, con los permisos de quien pregunta. Revisa que el archivo esté compartido con el área antes de anotarlo aquí, y que no tenga datos personales ni salarios.',
      ),
      table(
        ['Archivo en Drive', 'Qué contiene', 'Dueño', 'Última revisión'],
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
          ['La pregunta rara, la que no está en el manual', ''],
          ['El descuento que no existe', ''],
          ['El dato que no está en los archivos', ''],
        ],
        [40, 60],
      ),

      new Paragraph({ heading: HeadingLevel.HEADING_2, text: '7. Revisión' }),
      hint('Un Gem sin dueño queda con los archivos del año pasado y se sigue usando igual.'),
      fill('Responsable del contenido: ', 34),
      fill('Cada cuánto se revisa: ', 38),
      fill('Próxima revisión: ', 40),

      new Paragraph({ pageBreakBefore: true, spacing: { after: 40 }, children: [] }),
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        text: 'Instrucciones listas para pegar',
      }),
      hint(
        'Copia este bloque en el campo de instrucciones del Gem, ya con tus respuestas de las secciones 1 a 4.',
      ),
      pasteBlock(PEGAR_GEM),
    ],
  });
}

const PEGAR_GEM: string[] = [
  'Eres el asistente de [área] de [empresa].',
  '',
  'Resuelves tres cosas: [1], [2] y [3].',
  '',
  'Respondes en [tono], en máximo [200] palabras, con esta estructura:',
  '[estructura].',
  '',
  'Nunca [límite]. Si te preguntan por eso, responde que se debe consultar',
  'con [responsable] y ofrece [alternativa].',
  '',
  'Usa [archivo de Drive] como única fuente de [precios / plazos / política].',
  'Si el dato no está ahí, di que no lo tienes en vez de estimarlo, y dime',
  'en cuál archivo buscaste.',
  '',
  'Si falta información para responder bien, pídela antes de responder.',
];

/** Formato para tu caso, de Copilot. */
export function formatoParaTuCaso(): Promise<Buffer> {
  const brand = BRAND.copilot;

  return buildDoc({
    platform: 'Microsoft 365 Copilot',
    title: 'Formato para tu caso',
    description: 'Para escribir el caso de tu área y pasarlo a las demás.',
    lead: [
      'Lo que queda de una capacitación no son los prompts: son los casos que alguien probó en su trabajo real y contó cómo le fue. Esta hoja es para escribir uno.',
      'Llénala con una tarea que ya hiciste con Copilot, no con una que te gustaría hacer. Una página es suficiente.',
    ],
    children: [
      kicker('Cómo se usa', brand),
      bullet('Escoge una tarea que se repita en tu área, no la más impresionante.'),
      bullet('Anota el prompt tal como lo escribiste, con sus errores incluidos.'),
      bullet('Cuando esté lista, mándala al canal del área para que otra persona la repita.'),

      new Paragraph({ heading: HeadingLevel.HEADING_2, text: '1. El caso' }),
      hint('En una línea: qué tarea es y cada cuánto se hace.'),
      fill('Área: ', 48),
      fill('Tarea: ', 47),
      fill('Cada cuánto se hace: ', 38),

      new Paragraph({ heading: HeadingLevel.HEADING_2, text: '2. Antes y después' }),
      hint('El tiempo real, el de reloj. Si no lo mediste, ponle una estimación honesta.'),
      table(
        ['', 'Cómo se hacía', 'Cuánto tomaba'],
        [
          ['Antes', '', ''],
          ['Ahora', '', ''],
        ],
        [14, 62, 24],
      ),

      new Paragraph({ heading: HeadingLevel.HEADING_2, text: '3. Dónde se resolvió' }),
      hint(
        'Marca una: chat, modo agente dentro del archivo, Cowork o un agente propio. Y en cuál aplicación.',
      ),
      fill('Herramienta: ', 42),
      fill('Aplicación: ', 43),
      fill('Fuentes que usó (archivo, carpeta, reunión): ', 20),

      new Paragraph({ heading: HeadingLevel.HEADING_2, text: '4. El prompt que funcionó' }),
      hint(
        'Tal cual lo escribiste. Si tuviste que corregirlo dos veces, escribe también la corrección.',
      ),
      fill('', 60),
      fill('', 60),
      fill('', 60),
      fill('', 60),

      new Paragraph({ heading: HeadingLevel.HEADING_2, text: '5. Qué hay que revisar siempre' }),
      hint(
        'Lo que en tu caso Copilot suele equivocar: una cifra, un nombre, el tono con el cliente.',
      ),
      fill('1. ', 52),
      fill('2. ', 52),
      fill('3. ', 52),

      new Paragraph({ heading: HeadingLevel.HEADING_2, text: '6. Qué no funcionó' }),
      hint(
        'Esto es lo que más le sirve al resto: el intento que salió mal ahorra media hora a quien venga.',
      ),
      fill('', 60),
      fill('', 60),

      new Paragraph({ heading: HeadingLevel.HEADING_2, text: '7. Para quién más sirve' }),
      hint('Otra área que hace algo parecido y podría reutilizarlo tal cual.'),
      fill('Área: ', 48),
      fill('Qué tendría que cambiarle: ', 34),
      new Paragraph({ spacing: { after: 200 }, children: [] }),
      fill('Escrito por: ', 42),
      fill('Fecha: ', 47),
    ],
  });
}

/** Catálogo de generadores, por `plataforma/slug`. */
export const DOCX_BUILDERS: Record<string, () => Promise<Buffer>> = {
  'chatgpt/plantilla-de-gpt': plantillaDeGpt,
  'claude/plantilla-de-proyecto': plantillaDeProyecto,
  'claude/formato-de-skill': formatoDeSkill,
  'gemini/plantilla-de-gem': plantillaDeGem,
  'copilot/formato-para-tu-caso': formatoParaTuCaso,
};
