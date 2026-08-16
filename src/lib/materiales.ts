/**
 * El material que se lleva el asistente. Cada documento se declara aquí una vez
 * y de esa declaración salen tres cosas: la ruta imprimible, el archivo que
 * genera `scripts/build-materiales.ts` y el enlace de descarga del portal.
 *
 * De dónde sale el contenido de cada uno:
 *
 * - `guia-de-prompts` se arma leyendo la base. No hay una sola línea escrita a
 *   mano: si cambias un prompt en el seed y regeneras, el PDF queda al día.
 * - Los checklists, la tarjeta de atajos, la política y la tabla de decisión son
 *   editoriales y viven en este archivo. Una lista de una página no se puede
 *   derivar de los `mistakes` del seed sin quedar ilegible, así que se curaron a
 *   mano a partir de las prácticas y los errores de cada plataforma.
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
  claude: [
    { slug: 'guia-de-prompts', title: 'Guía de prompts', kind: 'pdf', source: 'print' },
    { slug: 'plantilla-de-proyecto', title: 'Plantilla de proyecto', kind: 'docx', source: 'docx' },
    { slug: 'formato-de-skill', title: 'Formato de skill', kind: 'docx', source: 'docx' },
  ],
  gemini: [
    { slug: 'guia-de-prompts', title: 'Guía de prompts', kind: 'pdf', source: 'print' },
    { slug: 'plantilla-de-gem', title: 'Plantilla de Gem', kind: 'docx', source: 'docx' },
    {
      slug: 'checklist-de-workspace',
      title: 'Checklist de Workspace',
      kind: 'pdf',
      source: 'print',
    },
  ],
  copilot: [
    { slug: 'guia-de-prompts', title: 'Guía de prompts', kind: 'pdf', source: 'print' },
    { slug: 'tarjeta-de-atajos', title: 'Tarjeta de atajos', kind: 'pdf', source: 'print' },
    { slug: 'politica-de-uso-de-ia', title: 'Política de uso de IA', kind: 'pdf', source: 'print' },
    {
      slug: 'cuando-usar-chat-agente-o-cowork',
      title: 'Cuándo usar chat, modo agente o Cowork',
      kind: 'pdf',
      source: 'print',
    },
    { slug: 'formato-para-tu-caso', title: 'Formato para tu caso', kind: 'docx', source: 'docx' },
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
 * Los checklists, por plataforma. Cuatro bloques de cuatro, que es lo que cabe
 * en una hoja sin que haya que entrecerrar los ojos. El título del documento no
 * está aquí: sale del catálogo, porque en Gemini el checklist es de Workspace.
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
  gemini: {
    intro:
      'Gemini escribe dentro de Gmail, Docs, Sheets y Slides, sobre archivos que ya son de la empresa. Eso ahorra tiempo y también hace más fácil mandar algo sin revisarlo. Cuatro paradas de treinta segundos.',
    blocks: [
      {
        title: 'Antes de pedir',
        items: [
          'Dije para quién es, para qué sirve y de qué extensión lo quiero.',
          'Apunté al archivo concreto con @, en vez de esperar que adivine cuál era.',
          'Pedí el formato de salida: correo, tabla, resumen de una página.',
          'Si el encargo tiene un límite, lo escribí: no prometer plazos, no dar precios.',
        ],
      },
      {
        title: 'Antes de creerle un dato',
        items: [
          'En Deep Research abrí los enlaces del informe. Que estén citados no es que estén leídos.',
          'En NotebookLM confirmé que la cita apunta al pasaje que dice el resumen.',
          'Las fórmulas y los totales de Sheets los revisé contra la hoja, no contra el resumen.',
          'Si no encontró el dato, lo dice. Un número estimado no entra a una decisión.',
        ],
      },
      {
        title: 'Antes de compartir',
        items: [
          'Revisé quién tiene acceso al documento: Gemini responde con lo que la persona ya puede ver.',
          'No subí datos personales, salarios ni información de un tercero.',
          'Trabajé desde la cuenta corporativa, no desde una personal.',
          'Si es un Gem del área, lo probé con los tres casos difíciles antes de compartirlo.',
        ],
      },
      {
        title: 'Antes de mandarlo',
        items: [
          'Leí el correo completo, con los nombres y las fechas, no solo el primer párrafo.',
          'El tono es el de la empresa, no el que trae el modelo por defecto.',
          'Corregí sobre el texto que ya estaba, sin arrancar de cero.',
          'Si quedó bueno, lo guardé como Gem o lo dejé donde el área lo vuelva a encontrar.',
        ],
      },
    ],
  },
};

// --- Tarjeta de atajos (Copilot) -------------------------------------------

export type ShortcutApp = { app: string; where: string; asks: string[] };

/**
 * La tarjeta que se imprime y se deja al lado del computador. No son atajos de
 * teclado: es dónde vive Copilot en cada aplicación y qué se le pide ahí, que
 * es lo que de verdad se olvida entre una sesión y la siguiente.
 */
export const ATAJOS: Record<
  string,
  { intro: string; apps: ShortcutApp[]; formula: { title: string; items: string[] } }
> = {
  copilot: {
    intro:
      'Dónde está Copilot en cada aplicación y qué conviene pedirle ahí. Imprímela y déjala a la vista: lo que cuesta recordar no es el prompt, es en cuál ventana se pide qué.',
    apps: [
      {
        app: 'Chat y Notebooks',
        where: 'copilot.microsoft.com o el ícono en la barra de Microsoft 365.',
        asks: [
          'Preguntarle a un archivo, una carpeta o una reunión, con la fuente puesta.',
          'Armar un notebook con las fuentes de un tema y consultarlo después.',
        ],
      },
      {
        app: 'Word',
        where: 'Ícono de Copilot al margen del párrafo, o pestaña Inicio.',
        asks: [
          'Borrador de propuesta a partir de las notas de la reunión.',
          'Reescribir el párrafo seleccionado: más corto, otro tono, sin tecnicismos.',
        ],
      },
      {
        app: 'Excel',
        where: 'Pestaña Inicio, con los datos en una tabla con encabezados.',
        asks: [
          'Explicar el informe, marcar lo raro, proponer la fórmula y decir el método.',
          'Trabajar en una copia cuando se le suelta el modo agente.',
        ],
      },
      {
        app: 'PowerPoint',
        where: 'Pestaña Inicio, con la plantilla de la empresa ya aplicada.',
        asks: [
          'Convertir un documento, una carpeta o una reunión en mazo.',
          'Una idea por diapositiva y el detalle en las notas del ponente.',
        ],
      },
      {
        app: 'Teams',
        where: 'Durante o después de la reunión, con la transcripción activada.',
        asks: [
          'Resumen con acuerdos, responsable y fecha, el mismo día.',
          'Qué me perdí y qué quedó pendiente de mi lado.',
        ],
      },
      {
        app: 'Outlook',
        where: 'Encima del hilo abierto y en Redactar con Copilot.',
        asks: [
          'Resumir el hilo largo y decir qué se está esperando de mí.',
          'Responder con el tono de la empresa y revisar antes de enviar.',
        ],
      },
    ],
    formula: {
      title: 'La estructura de un buen prompt',
      items: [
        'Para quién es y para qué sirve.',
        'De dónde sale la información: el archivo, la carpeta, la reunión.',
        'Qué formato quieres y de qué extensión.',
        'Qué no debe hacer: no prometer plazos, no dar precios, no inventar cifras.',
      ],
    },
  },
};

// --- Política de uso de IA (Copilot) ---------------------------------------

export type PolicySection = { title: string; body?: string; items?: string[] };

/**
 * Base de política, no política aprobada. Se entrega en la capacitación para
 * que cada empresa la ajuste con su área legal: el documento sirve para que la
 * conversación arranque de algo escrito y no de cero.
 *
 * Las secciones van agrupadas por hoja y no en una sola lista: una hoja es una
 * hoja, igual que en la guía de prompts. Además de que el corte queda donde
 * conviene, evita que el navegador tenga que partir la hoja solo, que es cuando
 * repinta el fondo de los bloques teñidos en la página siguiente.
 */
export const POLITICA: Record<string, { intro: string; note: string; pages: PolicySection[][] }> = {
  copilot: {
    intro:
      'Qué información se puede procesar con Copilot y qué datos no salen del entorno de la empresa. Está escrita en el lenguaje del trabajo diario, no en el de un contrato.',
    note: 'Este documento es una base para adaptar. Antes de publicarlo, revísalo con el área legal y con quien administra el tenant, y reemplaza lo que esté entre corchetes.',
    pages: [
      [
        {
          title: '1. A quién le aplica',
          body: 'A toda persona con licencia de Microsoft 365 Copilot y a quien use Copilot Chat con la cuenta corporativa, incluidos contratistas y practicantes.',
        },
        {
          title: '2. Qué sí se puede procesar',
          items: [
            'Documentos, correos y reuniones que ya viven en el entorno de la empresa: OneDrive, SharePoint, Teams y Outlook.',
            'Información a la que la persona ya tiene acceso por su rol. Copilot no amplía permisos: responde con lo que cada quien ya puede abrir.',
            'Material público de la empresa: catálogos, comunicados, contenido del sitio web.',
          ],
        },
        {
          title: '3. Qué no entra a un prompt',
          items: [
            'Datos personales de clientes, empleados o candidatos: cédulas, direcciones, historia médica, información de contacto que no sea corporativa.',
            'Salarios, evaluaciones de desempeño y procesos disciplinarios.',
            'Credenciales, llaves de acceso y claves de sistemas.',
            'Información de un tercero cubierta por un acuerdo de confidencialidad.',
          ],
        },
        {
          title: '4. Herramientas aprobadas',
          body: 'Copilot con la cuenta corporativa. Las herramientas de IA personales o gratuitas no se usan con información de la empresa, aunque den mejor resultado. Cualquier herramienta nueva se solicita a [responsable de TI] antes de usarla.',
        },
        {
          title: '5. Revisión humana',
          items: [
            'Lo que sale de Copilot es un borrador. Quien lo firma responde por el contenido.',
            'Toda cifra, nombre propio, fecha y precio se confirma contra el sistema donde vive el dato.',
            'Nada que vaya a un cliente, a un comité o a una autoridad se envía sin que una persona lo lea completo.',
          ],
        },
      ],
      [
        {
          title: '6. Reuniones y grabaciones',
          body: 'La grabación y la transcripción se avisan a los participantes al inicio. Las reuniones de personal, legales o disciplinarias no se graban solo para poder resumirlas: se usa el resumen sin retención o se toman notas.',
        },
        {
          title: '7. Agentes y contenido compartido',
          items: [
            'Un agente publicado para el área tiene un dueño con nombre y una fecha de próxima revisión.',
            'Los archivos de referencia de un agente se revisan cada [tres meses]: un agente con documentos vencidos sigue respondiendo con seguridad.',
            'Antes de publicar, se prueba con los casos difíciles del área.',
          ],
        },
        {
          title: '8. Si algo sale mal',
          body: 'Si se envió información que no debía salir, o si una respuesta con un error llegó a un cliente, se avisa el mismo día a [responsable] por [canal]. Reportar temprano no tiene consecuencias disciplinarias; ocultarlo sí.',
        },
      ],
    ],
  },
};

// --- Tabla de decisión (Copilot) -------------------------------------------

export type DecisionTool = { name: string; when: string; note: string };
export type DecisionRow = { situation: string; tool: string; why: string };

/**
 * La pregunta que más se repite en la sesión de Copilot: en cuál de las tres
 * ventanas se resuelve esto. Una hoja para decidir sin volver a preguntar.
 */
export const DECISION: Record<
  string,
  { intro: string; tools: DecisionTool[]; rows: DecisionRow[]; closing: string }
> = {
  copilot: {
    intro:
      'Tres formas de trabajar, de la más liviana a la más pesada. La regla: mientras más largo el encargo y más archivos toque, más abajo en esta hoja.',
    tools: [
      {
        name: 'Chat',
        when: 'Preguntas y borradores cortos.',
        note: 'Tú tienes el control de cada paso. Entrega texto, no archivos modificados.',
      },
      {
        name: 'Modo agente',
        when: 'Cambios dentro de un archivo abierto.',
        note: 'Trabaja sobre el documento y reporta qué cambió. Se revisa antes de aceptar.',
      },
      {
        name: 'Cowork',
        when: 'Tareas de horas que cruzan varias fuentes.',
        note: 'Entrega el trabajo terminado. Se cobra aparte con créditos, así que se usa cuando el encargo lo justifica.',
      },
    ],
    rows: [
      {
        situation: 'Resumir un hilo de correo y saber qué se espera de mí',
        tool: 'Chat',
        why: 'Una fuente, respuesta inmediata.',
      },
      {
        situation: 'Reescribir un párrafo de la propuesta con otro tono',
        tool: 'Modo agente',
        why: 'El cambio va dentro del documento y se ve en contexto.',
      },
      {
        situation: 'Pasar un informe de 30 páginas a presentación con la plantilla',
        tool: 'Modo agente',
        why: 'El contenido ya existe: se transforma dentro de PowerPoint.',
      },
      {
        situation: 'Encontrar la diferencia del cierre de caja en la hoja del mes',
        tool: 'Modo agente',
        why: 'Trabaja sobre una copia del archivo y reporta los pasos.',
      },
      {
        situation: 'Revisar 40 contratos de una carpeta y armar la matriz de vencimientos',
        tool: 'Cowork',
        why: 'Muchos archivos y varias horas de trabajo repetido.',
      },
      {
        situation: 'Consolidar el reporte mensual desde correos, actas y planillas',
        tool: 'Cowork',
        why: 'Cruza fuentes distintas y termina en un entregable.',
      },
      {
        situation: 'Investigar un mercado con fuentes citadas',
        tool: 'Chat (Researcher)',
        why: 'El agente de investigación vive dentro del chat.',
      },
      {
        situation: 'Responder siempre igual las preguntas de política del área',
        tool: 'Agente propio',
        why: 'Se repite todos los días: se escribe una vez y lo usa todo el equipo.',
      },
    ],
    closing:
      'Si dudas entre dos, empieza por la más liviana: bajar un escalón cuesta menos que gastar créditos de más.',
  },
};
