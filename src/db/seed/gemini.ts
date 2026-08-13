import type { PlatformSeed } from './types';

const CO = {
  a: '#3B5BDB',
  b: '#8A5CD1',
  c: '#1E8E7E',
  d: '#C2760C',
  e: '#B0396B',
  f: '#3D7BC4',
};

export const gemini: PlatformSeed = {
  id: 'gemini',
  name: 'Gemini',
  portalName: 'Portal Gemini',
  initial: 'G',
  color: CO.a,
  description:
    'Live con voz y cámara, Deep Research, Canvas, Gems, NotebookLM y Gemini dentro de Workspace.',
  tagline: 'Capacitación interna',
  inputHint: 'Escríbele a Gemini...',
  badge: 'Programa interno · 8 módulos · en el orden que quieras',
  heroTitle: 'Aprende a usar Gemini en el trabajo del día a día',
  heroText:
    'Voz y cámara, investigación con fuentes, cuadernos de documentos y Gemini dentro de Workspace, con los casos de siempre.',
  specialTitle: 'Lo que solo se hace acá',
  specialIntro:
    'Los tres diferenciales de Gemini frente a los otros portales de la academia.',
  helpTitle: '¿Dudas durante la práctica?',
  helpText: 'Escribe al canal #academia-ia. Contestamos en horario de oficina.',
  status: 'completo',
  stats: [
    { value: '8', label: 'módulos, uno por capacidad' },
    { value: '40', label: 'prompts listos para copiar' },
    { value: '24', label: 'casos de uso por área' },
    { value: '3', label: 'niveles: básico, intermedio y avanzado' },
  ],
  specials: [
    {
      kicker: 'Live',
      title: 'Voz y cámara en tiempo real',
      description:
        'Le apuntas la cámara a un tablero, a una máquina o a una estantería y preguntas en voz alta. Contesta mientras sigues con las manos ocupadas.',
      example:
        '"Estoy viendo el tablero eléctrico. ¿Qué significa esta luz roja y qué debo revisar primero?"',
    },
    {
      kicker: 'Workspace',
      title: 'Dentro de Gmail, Docs y Sheets',
      description:
        'No hay que copiar y pegar a un chat aparte: Gemini trabaja sobre los archivos de Drive con los permisos que ya tiene cada persona.',
      example: '"Con este documento de Drive, redacta el correo de seguimiento al cliente."',
    },
    {
      kicker: 'NotebookLM',
      title: 'Respuestas con la cita del documento',
      description:
        'Un cuaderno por tema con tus propias fuentes. Cada respuesta trae el fragmento exacto que la sustenta, para poder verificarla.',
      example: '"Según estos tres manuales, ¿cuál es el procedimiento de devolución?"',
    },
  ],
  downloads: [
    {
      title: 'Guía de prompts',
      description: 'Los 40 prompts del programa, agrupados por módulo.',
      meta: 'PDF · 10 páginas',
    },
    {
      title: 'Plantilla de Gem',
      description: 'Estructura de instrucciones para armar un Gem del área en 15 minutos.',
      meta: 'DOCX',
    },
    {
      title: 'Checklist de Workspace',
      description: 'Qué revisar antes de mandar lo que Gemini redactó en Gmail o Docs.',
      meta: 'PDF · 1 página',
    },
  ],
  practices: [
    {
      number: '01',
      title: 'Di para quién es antes de pedir',
      description: 'Para quién, para qué y de qué extensión. Ahí está casi toda la diferencia.',
    },
    {
      number: '02',
      title: 'Corrige, no arranques otra vez',
      description:
        'Es más rápido decir "más corto y sin tecnicismos" que volver a escribir el prompt desde cero.',
    },
    {
      number: '03',
      title: 'Exige la fuente',
      description:
        'En Deep Research y en NotebookLM, pide siempre el enlace o la cita. Sin fuente, el dato no se usa en una decisión.',
    },
    {
      number: '04',
      title: 'Guarda lo que te funcionó',
      description:
        'El prompt que salió bien se convierte en un Gem. Así el área entera trabaja con el mismo criterio.',
    },
  ],
  faqs: [
    {
      question: '¿Gemini ve los archivos de Drive?',
      answer:
        'Ve los que tu cuenta ya puede abrir, y solo cuando se lo pides desde Workspace o le compartes el archivo. Respeta los permisos existentes: si tú no tienes acceso a una carpeta, Gemini tampoco.',
    },
    {
      question: '¿Lo que escribimos entrena el modelo?',
      answer:
        'En las cuentas de Workspace del plan corporativo, el contenido del trabajo no se usa para entrenar los modelos. En cuentas personales gratuitas sí puede revisarse, así que el material de la empresa va siempre por la cuenta corporativa.',
    },
    {
      question: '¿Puedo confiar en las cifras que genera?',
      answer:
        'Las cifras se verifican siempre contra la fuente. Gemini es bueno redactando y organizando, pero un número que va a un comité o a un cliente se confirma en el documento original antes de mandarlo.',
    },
    {
      question: '¿En qué se diferencia de los otros portales?',
      answer:
        'Gemini es el más fuerte cuando el trabajo ya vive en Google: Gmail, Docs, Sheets y Meet. Además tiene voz y cámara en vivo y NotebookLM para consultar documentos propios con la cita exacta.',
    },
  ],
  links: [
    { label: 'Ayuda de Gemini', href: 'https://support.google.com/gemini' },
    { label: 'Gemini en Workspace', href: 'https://workspace.google.com' },
    { label: 'NotebookLM', href: 'https://notebooklm.google.com' },
  ],
  modules: [
    {
      slug: 'live',
      name: 'Gemini Live',
      shortName: 'Live',
      abbr: 'LV',
      color: CO.a,
      level: 'Básico',
      category: 'Conversación',
      meta: '5 prompts · 30 min',
      summary:
        'Conversación en voz y con cámara para trabajar con las manos ocupadas o mostrar lo que se tiene al frente.',
      intro:
        'Live es una conversación hablada, no un chat escrito. Se puede interrumpir, cambiar de tema y apuntar la cámara a lo que se está viendo. Sirve donde no hay teclado: en bodega, en obra, en ruta o antes de entrar a una reunión difícil.',
      outcomes: [
        'Consultar un procedimiento sin soltar lo que se tiene en las manos.',
        'Mostrarle a Gemini un equipo, un formato o una estantería y preguntar sobre lo que está viendo.',
        'Ensayar una conversación difícil antes de tenerla de verdad.',
      ],
      prompts: [
        {
          tag: 'En sitio',
          text: 'Te estoy mostrando [el tablero de control de la máquina]. Dime qué indica cada luz y qué reviso primero si está en rojo.',
        },
        {
          tag: 'Ensayo',
          text: 'Vas a ser [un cliente molesto porque el pedido llegó tarde]. Yo contesto y al final me dices qué mejoro en el tono y en los argumentos.',
        },
        {
          tag: 'Dictado',
          text: 'Voy saliendo de la visita. Te dicto lo que pasó y me devuelves el acta con compromisos, responsable y fecha.',
        },
        {
          tag: 'Traducción',
          text: 'Traduce en voz lo que voy diciendo al inglés, frase por frase, para hablar con el proveedor.',
        },
        {
          tag: 'Explicación',
          text: 'Explícame [cómo funciona el descuento por pronto pago] como si fuera la primera vez que lo escucho, en menos de un minuto.',
        },
      ],
      baIntro:
        'El caso de la sesión: el técnico de servicio llega a la planta del cliente y encuentra un equipo con una falla que no está en el manual que cargó.',
      before:
        'Llama al supervisor, que está en otra visita. Espera a que le devuelvan la llamada, o se va y agenda un segundo viaje.',
      beforeTime: 'Una visita perdida y un cliente esperando',
      after:
        'Apunta la cámara al equipo, describe el síntoma y va descartando causas en voz alta mientras tiene las manos en la máquina.',
      afterTime: 'Se resuelve en la misma visita',
      steps: [
        {
          title: 'Di dónde estás y qué estás viendo',
          description:
            'Live no adivina el contexto. "Estoy en la bodega frente al estante de repuestos" cambia por completo la respuesta que da.',
        },
        {
          title: 'Muestra en vez de describir',
          description:
            'Cuando hay cámara, apuntar es más rápido y más exacto que explicar con palabras un tablero o un formato.',
        },
        {
          title: 'Interrumpe cuando se desvíe',
          description:
            'Es una conversación: si empieza a dar un rodeo, se le corta y se le pide lo concreto. No hay que esperar a que termine.',
        },
        {
          title: 'Cierra pidiendo el resumen',
          description:
            'Antes de colgar, pide el resumen con los pasos y los compromisos. Eso es lo que queda por escrito para el reporte.',
        },
      ],
      roles: [
        {
          role: 'Operaciones',
          task: 'Consulta en planta',
          detail:
            'Revisa procedimientos y checklists sin quitarse los guantes ni buscar la carpeta del manual.',
        },
        {
          role: 'Comercial',
          task: 'Antes de la visita',
          detail:
            'Ensaya la objeción de precio camino al cliente y llega con las respuestas pensadas en voz alta.',
        },
        {
          role: 'Servicio al cliente',
          task: 'Acta en ruta',
          detail:
            'Dicta lo que pasó en la visita apenas sale y llega a la oficina con el reporte ya redactado.',
        },
      ],
      mistakes: [
        {
          bad: 'Usarlo en un sitio con mucho ruido y pelear con el micrófono.',
          good: 'Buscar un rincón silencioso o pasar a texto cuando el ruido no deja.',
        },
        {
          bad: 'Mostrar documentos con datos personales de clientes a la cámara.',
          good: 'Tapar o excluir los datos sensibles antes de apuntar la cámara.',
        },
        {
          bad: 'Dar por cerrada la conversación sin pedir el resumen escrito.',
          good: 'Terminar siempre con "resúmeme esto en cinco puntos con los compromisos".',
        },
      ],
      mockTitle: 'Gemini · Live',
      mockPrompt: 'Te muestro el tablero. ¿Qué reviso primero con esta luz en rojo?',
      mockReply:
        'Esa luz indica presión baja en el circuito. Revisa primero el nivel del depósito y después la válvula de alivio. ¿Ves alguna fuga en la base?',
      mockPanelTitle: 'Sesión en vivo',
      mockPanel:
        'Cámara activa\nMicrófono activo\n02:14 de conversación\n\nResumen pendiente al cerrar',
    },
    {
      slug: 'deep',
      name: 'Deep Research',
      shortName: 'Deep Research',
      abbr: 'DR',
      color: CO.b,
      level: 'Intermedio',
      category: 'Investigación',
      meta: '5 prompts · 35 min',
      summary:
        'Informes largos con fuentes citadas sobre mercado, competencia o regulación.',
      intro:
        'Deep Research no contesta de una: se toma varios minutos, revisa decenas de páginas y entrega un informe con el enlace de dónde salió cada dato. Lo importante del resultado no es el texto, son las fuentes.',
      outcomes: [
        'Llegar al comité con un panorama de competencia sustentado y verificable.',
        'Revisar qué exige una norma o un requisito sin depender de lo que alguien cree recordar.',
        'Convertir un tema nuevo en un informe de dos páginas que el equipo pueda leer.',
      ],
      prompts: [
        {
          tag: 'Competencia',
          text: 'Investiga qué están ofreciendo [tres competidores] en [servicio] en [país]: propuesta, precios públicos si existen y en qué se diferencian. Cita la fuente de cada dato.',
        },
        {
          tag: 'Normativa',
          text: '¿Qué exige la normativa vigente en [país] sobre [tema]? Dame la norma, el artículo y desde cuándo aplica.',
        },
        {
          tag: 'Mercado',
          text: 'Arma un panorama de [sector] en [país]: tamaño, actores principales, tendencias de los últimos dos años y riesgos. Máximo dos páginas.',
        },
        {
          tag: 'Proveedores',
          text: 'Compara proveedores de [categoría] con presencia en [ciudad]: cobertura, tiempos de entrega y condiciones publicadas. Tabla y fuentes.',
        },
        {
          tag: 'Verificación',
          text: 'De este informe, dime qué afirmaciones tienen fuente débil o desactualizada y cuáles hay que confirmar antes de presentarlas.',
        },
      ],
      baIntro:
        'El caso de la sesión: la dirección quiere saber si vale la pena entrar a una ciudad nueva y pide el análisis para el comité del viernes.',
      before:
        'Alguien del equipo dedica dos días a buscar en Google, arma un documento sin fuentes y nadie sabe qué tan viejo es cada dato.',
      beforeTime: 'Dos días de una persona y cifras que no se pueden defender',
      after:
        'Se pide el informe con fuentes, se revisa qué está flojo y se completa con lo que la empresa ya sabe del mercado.',
      afterTime: 'Una tarde, con cada cifra rastreable',
      steps: [
        {
          title: 'Delimita antes de pedir',
          description:
            'País, ciudad, segmento y periodo. Un encargo abierto devuelve un informe genérico que no sirve para decidir.',
        },
        {
          title: 'Pide el formato de salida',
          description:
            'Tabla comparativa, dos páginas, viñetas por hallazgo. Si no se dice, entrega un texto largo que nadie lee completo.',
        },
        {
          title: 'Revisa las fuentes, no el texto',
          description:
            'Abre tres o cuatro enlaces al azar. Si las fuentes son sólidas y recientes, el informe sirve; si son blogs viejos, se rehace.',
        },
        {
          title: 'Marca lo que hay que confirmar',
          description:
            'Precios y cifras regulatorias se confirman con el proveedor o con la norma antes de llevarlos a una decisión.',
        },
      ],
      roles: [
        {
          role: 'Dirección',
          task: 'Decisiones de expansión',
          detail:
            'Panorama de una ciudad o de un segmento nuevo antes de comprometer presupuesto.',
        },
        {
          role: 'Compras',
          task: 'Evaluación de proveedores',
          detail:
            'Comparativo sustentado de opciones del mercado antes de sentarse a negociar.',
        },
        {
          role: 'Jurídica',
          task: 'Cambios normativos',
          detail:
            'Revisión de qué cambió en la regulación del sector y desde cuándo aplica, con la norma citada.',
        },
      ],
      mistakes: [
        {
          bad: 'Pedir "investiga el mercado" sin país, sin segmento y sin periodo.',
          good: 'Acotar el encargo y decir para qué decisión es el informe.',
        },
        {
          bad: 'Copiar el informe al comité sin abrir ni una fuente.',
          good: 'Verificar las cifras que sostienen la recomendación.',
        },
        {
          bad: 'Tratarlo como si reemplazara el conocimiento del equipo comercial.',
          good: 'Usarlo como punto de partida y contrastar con lo que ya se sabe de los clientes.',
        },
      ],
      mockTitle: 'Gemini · Deep Research',
      mockPrompt: 'Investiga qué ofrecen los tres principales competidores en logística urbana.',
      mockReply:
        'Listo el informe: 18 fuentes revisadas, tres competidores con propuesta y precios públicos. Marqué dos cifras que conviene confirmar directamente.',
      mockPanelTitle: 'Informe',
      mockPanel:
        '1. Panorama del sector\n2. Competidor A: propuesta y precios\n3. Competidor B: cobertura\n4. Competidor C: modelo\n5. Riesgos y vacíos\n\n18 fuentes citadas',
    },
    {
      slug: 'canvas',
      name: 'Canvas',
      shortName: 'Canvas',
      abbr: 'CV',
      color: CO.c,
      level: 'Básico',
      category: 'Documentos',
      meta: '5 prompts · 30 min',
      summary:
        'Espacio de edición al lado del chat para escribir documentos largos y corregir por secciones.',
      intro:
        'En Canvas el documento vive al lado de la conversación y se va corrigiendo por partes, sin que cada cambio genere un mensaje nuevo. Es la diferencia entre un documento vivo y veinte respuestas sueltas que hay que juntar a mano.',
      outcomes: [
        'Escribir una propuesta o un instructivo completo sin perder el hilo entre mensajes.',
        'Corregir una sección específica sin que se dañe el resto del texto.',
        'Salir de la sesión con el documento listo para pegar en Docs.',
      ],
      prompts: [
        {
          tag: 'Borrador',
          text: 'Abre un canvas con la propuesta para [cliente]: contexto, alcance, entregables, tiempos y precio. Tono formal y sin relleno.',
        },
        {
          tag: 'Sección',
          text: 'Solo la sección de alcance: déjala más concreta, con entregables numerados y sin adjetivos.',
        },
        {
          tag: 'Tono',
          text: 'Todo el documento en un tono más directo, frases cortas, sin tecnicismos. No cambies las cifras.',
        },
        {
          tag: 'Extensión',
          text: 'Recorta el documento a una página conservando el precio, el alcance y el siguiente paso.',
        },
        {
          tag: 'Versión',
          text: 'Del mismo contenido, dame una versión de correo de máximo diez líneas para mandarlo hoy.',
        },
      ],
      baIntro:
        'El caso de la sesión: hay que mandar una propuesta hoy y el borrador va en la quinta ronda de correcciones.',
      before:
        'El texto se pide en el chat, se copia a Docs, se corrige allá, se vuelve a pegar en el chat para el siguiente ajuste y ya nadie sabe cuál es la versión buena.',
      beforeTime: 'Tres versiones circulando y una equivocada enviada',
      after:
        'El documento se arma en el canvas y se corrige por secciones. Solo hay una versión y al final se copia una sola vez.',
      afterTime: 'Una sesión y un solo documento',
      steps: [
        {
          title: 'Empieza por la estructura',
          description:
            'Pide primero los títulos de las secciones. Corregir un índice cuesta un minuto; corregir cinco páginas mal ordenadas cuesta una tarde.',
        },
        {
          title: 'Corrige señalando la sección',
          description:
            '"Solo la sección de precio" evita que reescriba de arriba a abajo y dañe párrafos que ya estaban bien.',
        },
        {
          title: 'Pega los datos reales temprano',
          description:
            'Cifras, nombres y fechas verdaderas desde el segundo borrador. Con datos de relleno se corrige un documento que no existe.',
        },
        {
          title: 'Cierra con la versión corta',
          description:
            'Casi siempre hace falta el correo que acompaña al documento. Pídelo en el mismo canvas para que hable el mismo idioma.',
        },
      ],
      roles: [
        {
          role: 'Comercial',
          task: 'Propuestas',
          detail: 'Del brief hablado a la propuesta enviada dentro de la misma jornada.',
        },
        {
          role: 'Talento humano',
          task: 'Instructivos y políticas',
          detail:
            'Redacta el procedimiento nuevo y lo ajusta con el área dueña sin pasar por diez correos.',
        },
        {
          role: 'Dirección',
          task: 'Comunicados internos',
          detail: 'Un mensaje que se corrige en vivo con el comité antes de publicarlo.',
        },
      ],
      mistakes: [
        {
          bad: 'Pedir diez cambios distintos en un solo mensaje.',
          good: 'Un cambio a la vez, revisando entre uno y otro.',
        },
        {
          bad: 'Dejar los corchetes de plantilla en el documento final.',
          good: 'Revisar el documento completo antes de copiarlo a Docs.',
        },
      ],
      mockTitle: 'Gemini · Canvas',
      mockPrompt: 'Solo la sección de alcance: más concreta y con entregables numerados.',
      mockReply:
        'Actualicé el alcance con cinco entregables numerados y quité los adjetivos. El resto del documento quedó igual.',
      mockPanelTitle: 'Propuesta comercial',
      mockPanel:
        '1. Contexto\n2. Alcance  (editado)\n3. Entregables\n4. Tiempos\n5. Precio y condiciones\n6. Siguiente paso',
    },
    {
      slug: 'gems',
      name: 'Gems',
      shortName: 'Gems',
      abbr: 'GM',
      color: CO.d,
      level: 'Intermedio',
      category: 'Asistentes',
      meta: '5 prompts · 35 min',
      summary:
        'Asistentes propios con instrucciones fijas para las tareas que se repiten en el área.',
      intro:
        'Un Gem es Gemini con instrucciones fijas y archivos de referencia. Se configura una vez y todo el equipo lo usa con el mismo tono y los mismos límites, en vez de que cada quien improvise su propio prompt.',
      outcomes: [
        'Convertir el prompt que le funciona a una persona en una herramienta del área.',
        'Estandarizar el tono y las reglas con las que se le responde al cliente.',
        'Bajar el tiempo de arranque de las tareas que se repiten cada semana.',
      ],
      prompts: [
        {
          tag: 'Instrucciones',
          text: 'Eres el asistente de [área] de [empresa]. Respondes en español neutro, en máximo [200] palabras, sin prometer plazos y sin inventar precios. Si falta información, la pides antes de responder.',
        },
        {
          tag: 'Formato',
          text: 'Entrega siempre en este formato: resumen en una línea, tres puntos de detalle y una acción concreta al final.',
        },
        {
          tag: 'Límites',
          text: 'Nunca des asesoría legal ni tributaria. Si preguntan por eso, responde que se debe consultar con [jurídica] y ofrece redactar el correo.',
        },
        {
          tag: 'Referencia',
          text: 'Usa el documento de [tarifas vigentes] como única fuente de precios. Si un precio no está ahí, di que no lo tienes.',
        },
        {
          tag: 'Prueba',
          text: 'Pon a prueba tus propias instrucciones con estos tres casos difíciles y muéstrame qué responderías en cada uno.',
        },
      ],
      baIntro:
        'El caso de la sesión: cinco personas de servicio al cliente responden la misma pregunta de cinco maneras distintas.',
      before:
        'Cada quien tiene su prompt guardado en un bloc de notas. El tono cambia según quién conteste y a veces se prometen cosas que la empresa no cumple.',
      beforeTime: 'Respuestas dispares y compromisos que no eran',
      after:
        'Un Gem del área con tono, límites y tarifas cargadas. Todos parten de la misma base y solo ajustan el caso puntual.',
      afterTime: 'Una configuración, revisada una vez al mes',
      steps: [
        {
          title: 'Empieza por un prompt que ya funciona',
          description:
            'No se inventa desde cero: se toma el prompt que alguien usa todos los días y se vuelve permanente.',
        },
        {
          title: 'Escribe los límites, no solo la tarea',
          description:
            'Qué nunca debe hacer es tan importante como qué debe hacer. Ahí es donde se evitan los problemas.',
        },
        {
          title: 'Carga pocos archivos y vigentes',
          description:
            'Tarifas actuales, política vigente, plantilla oficial. Un archivo viejo cargado en un Gem produce errores durante meses.',
        },
        {
          title: 'Pruébalo con los casos difíciles',
          description:
            'Antes de compartirlo, se prueba con las tres preguntas que más se atoran. Si esas salen bien, el resto también.',
        },
      ],
      roles: [
        {
          role: 'Servicio al cliente',
          task: 'Respuestas estándar',
          detail: 'Un Gem con el tono de la empresa y las condiciones vigentes cargadas.',
        },
        {
          role: 'Talento humano',
          task: 'Preguntas de personal',
          detail:
            'Responde dudas de vacaciones y beneficios con el reglamento vigente como única fuente.',
        },
        {
          role: 'Mercadeo',
          task: 'Piezas de campaña',
          detail: 'Un Gem que ya conoce la marca, el público y las palabras que no se usan.',
        },
      ],
      mistakes: [
        {
          bad: 'Hacer un Gem para cada tarea puntual y terminar con veinte sin mantener.',
          good: 'Uno por proceso que de verdad se repite, con dueño responsable.',
        },
        {
          bad: 'Instrucciones de dos líneas que no dicen nada del tono ni de los límites.',
          good: 'Rol, formato, tono, límites y fuente de datos, escritos explícitamente.',
        },
        {
          bad: 'Dejarlo con las tarifas del año pasado.',
          good: 'Revisar los archivos de referencia cada vez que cambie una condición.',
        },
      ],
      mockTitle: 'Gemini · Gem de Servicio',
      mockPrompt: '¿Cuánto cuesta el plan empresarial y en cuánto tiempo se instala?',
      mockReply:
        'El plan empresarial está en [tarifa vigente] con instalación en 5 días hábiles. No puedo confirmar fechas exactas: eso lo agenda el equipo de operaciones.',
      mockPanelTitle: 'Configuración del Gem',
      mockPanel:
        'Rol: asistente de servicio\nTono: formal y breve\nFuente: Tarifas_vigentes.xlsx\nLímites: sin asesoría legal\n            sin prometer fechas',
    },
    {
      slug: 'notebook',
      name: 'NotebookLM',
      shortName: 'NotebookLM',
      abbr: 'NB',
      color: CO.e,
      level: 'Intermedio',
      category: 'Documentos',
      meta: '5 prompts · 35 min',
      summary:
        'Un cuaderno con tus fuentes: preguntas sobre tus documentos con la cita exacta.',
      intro:
        'NotebookLM solo responde con lo que hay en las fuentes que tú cargaste, y muestra el fragmento del que sacó cada afirmación. Es la herramienta para manuales, actas, contratos y expedientes: lo que importa es poder verificar.',
      outcomes: [
        'Consultar cientos de páginas de manuales sin leerlas completas.',
        'Responder una pregunta del cliente citando el numeral exacto del contrato.',
        'Poner al día a alguien nuevo sobre un caso con años de historia.',
      ],
      prompts: [
        {
          tag: 'Consulta',
          text: '¿Qué dicen estas fuentes sobre [el procedimiento de devolución]? Cítame el documento y la página de cada afirmación.',
        },
        {
          tag: 'Contraste',
          text: 'Compara lo que dice el manual viejo con el nuevo sobre [este proceso] y dime qué cambió exactamente.',
        },
        {
          tag: 'Resumen',
          text: 'Resume estas actas en una línea de tiempo: qué se decidió, cuándo y quién quedó responsable.',
        },
        {
          tag: 'Vacíos',
          text: '¿Qué preguntas frecuentes de nuestros clientes NO quedan respondidas por estos documentos?',
        },
        {
          tag: 'Material',
          text: 'Con estas fuentes, arma una guía de inducción de dos páginas para alguien que entra al área mañana.',
        },
      ],
      baIntro:
        'El caso de la sesión: entra una persona nueva al área técnica y el conocimiento está repartido en once manuales y cuatro años de actas.',
      before:
        'Se le entrega la carpeta compartida y se le dice que lea. Pregunta lo mismo tres veces porque nadie encuentra dónde estaba escrito.',
      beforeTime: 'Un mes largo de inducción y preguntas repetidas',
      after:
        'Un cuaderno con los once manuales. Pregunta en lenguaje normal y recibe la respuesta con la página exacta para leer el detalle.',
      afterTime: 'Una semana, y las respuestas quedan verificadas',
      steps: [
        {
          title: 'Un cuaderno por tema, no uno para todo',
          description:
            'Manuales técnicos en uno, contratos de un cliente en otro. Un cuaderno con todo mezclado responde con la fuente equivocada.',
        },
        {
          title: 'Carga las versiones vigentes',
          description:
            'Si conviven la política vieja y la nueva, marca cuál es cuál en el nombre del archivo o la respuesta saldrá desactualizada.',
        },
        {
          title: 'Pregunta como le preguntarías a un colega',
          description:
            'No hace falta lenguaje técnico ni palabras clave. La pregunta normal funciona mejor que la búsqueda por término.',
        },
        {
          title: 'Abre siempre la cita',
          description:
            'La respuesta trae el fragmento de origen. Antes de usarla en algo formal, se abre y se lee en su contexto.',
        },
      ],
      roles: [
        {
          role: 'Técnica',
          task: 'Manuales de producto',
          detail:
            'Consulta de procedimientos y especificaciones sin buscar en once PDF distintos.',
        },
        {
          role: 'Jurídica',
          task: 'Contratos de clientes',
          detail: 'Responde qué dice el contrato sobre un punto, con el numeral citado.',
        },
        {
          role: 'Dirección',
          task: 'Actas y comités',
          detail:
            'Reconstruye qué se decidió sobre un tema y en qué reunión, sin abrir el histórico completo.',
        },
      ],
      mistakes: [
        {
          bad: 'Subir la carpeta compartida entera para "tenerlo todo".',
          good: 'Cargar los documentos vigentes del tema y sacar los reemplazados.',
        },
        {
          bad: 'Usar la respuesta sin abrir la cita porque suena razonable.',
          good: 'Verificar el fragmento antes de mandársela a un cliente.',
        },
        {
          bad: 'Cargar documentos con datos personales sin revisar quién tiene acceso al cuaderno.',
          good: 'Revisar los permisos del cuaderno antes de compartirlo con el área.',
        },
      ],
      mockTitle: 'Gemini · NotebookLM',
      mockPrompt: '¿Cuál es el procedimiento de devolución para producto averiado?',
      mockReply:
        'El manual de operaciones lo define en tres pasos: registro fotográfico, acta de recepción y nota crédito a 15 días. Cité la página 34.',
      mockPanelTitle: 'Fuentes del cuaderno',
      mockPanel:
        'Manual_operaciones_2026.pdf ✓\nPolitica_devoluciones.pdf ✓\nActas_comite_2025.docx ✓\n\nCita: pág. 34, Manual operaciones',
    },
    {
      slug: 'imagen',
      name: 'Imágenes con Imagen',
      shortName: 'Imagen',
      abbr: 'IM',
      color: CO.f,
      level: 'Básico',
      category: 'Contenido',
      meta: '5 prompts · 30 min',
      summary:
        'Generación y edición de imágenes para piezas internas y material de apoyo.',
      intro:
        'Sirve para lo que hoy se resuelve con una foto de banco genérica: fondos, íconos, ilustraciones de una circular, escenas de apoyo para una presentación. No reemplaza a diseño en las piezas de marca, pero sí destraba el material interno.',
      outcomes: [
        'Ilustrar una presentación o una circular sin buscar en bancos de fotos.',
        'Probar una idea visual antes de pedirle tiempo al área de diseño.',
        'Ajustar una imagen existente sin volver a generarla desde cero.',
      ],
      prompts: [
        {
          tag: 'Pieza interna',
          text: 'Una ilustración plana para la circular de [seguridad en bodega], estilo sobrio corporativo, paleta [azul y gris], sin texto en la imagen.',
        },
        {
          tag: 'Fondo',
          text: 'Fondo abstracto para lámina de presentación, muy sutil, tonos [de la marca], con espacio libre a la izquierda para el título.',
        },
        {
          tag: 'Escena',
          text: 'Una escena de [equipo de trabajo revisando un tablero en planta], realista, luz natural, formato horizontal.',
        },
        {
          tag: 'Ajuste',
          text: 'Sobre la imagen anterior: quítale [el objeto del fondo], deja más espacio arriba y bájale la saturación.',
        },
        {
          tag: 'Serie',
          text: 'Tres íconos del mismo estilo para [recepción, revisión y despacho], línea simple y un solo color.',
        },
      ],
      baIntro:
        'El caso de la sesión: mercadeo tiene que sacar la circular de seguridad de mañana y el área de diseño está copada con el lanzamiento.',
      before:
        'Se busca en un banco de fotos gratis, se encuentra una imagen genérica que no se parece a la operación y se manda igual.',
      beforeTime: 'Una pieza que nadie mira y no habla de la empresa',
      after:
        'Se describe la escena real de la bodega con la paleta de la marca y sale una ilustración propia en dos intentos.',
      afterTime: 'Quince minutos, sin turno en diseño',
      steps: [
        {
          title: 'Describe la escena, no el sentimiento',
          description:
            '"Dos personas revisando un tablero en planta, luz natural" funciona. "Algo que transmita confianza" no.',
        },
        {
          title: 'Da estilo, paleta y formato',
          description:
            'Ilustración plana o foto realista, colores de marca, horizontal o cuadrado. Sin eso sale un genérico con estética de banco de imágenes.',
        },
        {
          title: 'Evita el texto dentro de la imagen',
          description:
            'Los textos generados salen con errores. El título se pone después en la lámina o en la herramienta de diseño.',
        },
        {
          title: 'Ajusta en vez de regenerar',
          description:
            'Cuando ya está cerca, se pide el cambio puntual. Regenerar desde cero devuelve otra imagen distinta.',
        },
      ],
      roles: [
        {
          role: 'Mercadeo',
          task: 'Piezas internas',
          detail: 'Circulares, fondos de presentación y material de campaña interna.',
        },
        {
          role: 'Talento humano',
          task: 'Comunicaciones',
          detail: 'Ilustra el boletín y las carteleras sin recurrir a fotos de archivo genéricas.',
        },
        {
          role: 'Comercial',
          task: 'Presentaciones',
          detail: 'Imágenes de apoyo para la propuesta cuando no hay foto real del proyecto.',
        },
      ],
      mistakes: [
        {
          bad: 'Usar imágenes generadas como si fueran fotos reales de la operación.',
          good: 'Reservarlas para piezas de apoyo y usar foto real cuando se muestra la empresa.',
        },
        {
          bad: 'Pedir el logo de la empresa dentro de la imagen.',
          good: 'Generar la base y montar el logo oficial después, sin deformarlo.',
        },
      ],
      mockTitle: 'Gemini · Imagen',
      mockPrompt: 'Ilustración plana para la circular de seguridad en bodega, azul y gris.',
      mockReply:
        'Aquí van dos versiones, una con la escena completa y otra más cerrada. ¿Le dejo más espacio arriba para el título?',
      mockPanelTitle: 'Resultado',
      mockPanel:
        'Formato: horizontal 16:9\nEstilo: ilustración plana\nPaleta: azul / gris\nSin texto en la imagen\n\n2 variaciones generadas',
    },
    {
      slug: 'veo',
      name: 'Video con Veo',
      shortName: 'Veo',
      abbr: 'VE',
      color: CO.b,
      level: 'Avanzado',
      category: 'Contenido',
      meta: '5 prompts · 35 min',
      summary:
        'Video corto para capacitación interna, redes o demostración de producto.',
      intro:
        'Piezas de pocos segundos generadas a partir de un guion propio. Sirve para lo que hoy no alcanza el presupuesto de producción: un recordatorio de seguridad, un clip de apoyo en una capacitación, una idea para mostrarle al cliente antes de grabarla de verdad.',
      outcomes: [
        'Producir un clip de apoyo para la capacitación sin contratar producción.',
        'Mostrar una idea de campaña en movimiento antes de aprobar el presupuesto.',
        'Armar recordatorios cortos para las pantallas internas.',
      ],
      prompts: [
        {
          tag: 'Guion',
          text: 'Escribe el guion de un video de 15 segundos sobre [uso correcto del casco en bodega]: qué se ve, qué se escucha y el mensaje final.',
        },
        {
          tag: 'Clip',
          text: 'Video de 8 segundos: [plano cercano de manos organizando cajas en una bodega ordenada], luz natural, cámara fija, sin texto.',
        },
        {
          tag: 'Estilo',
          text: 'El mismo clip pero en tono más sobrio y corporativo, movimiento lento y paleta fría.',
        },
        {
          tag: 'Serie',
          text: 'Tres clips del mismo estilo para [recepción, almacenamiento y despacho], para montarlos seguidos.',
        },
        {
          tag: 'Revisión',
          text: 'Revisa este guion y dime qué parte no se va a entender sin narración y qué sobra para 15 segundos.',
        },
      ],
      baIntro:
        'El caso de la sesión: la capacitación de seguridad necesita un recordatorio visual y no hay presupuesto de producción este trimestre.',
      before:
        'Se usa un video de YouTube de otra empresa, con otra bodega, otro uniforme y otro idioma. La gente no se ve reflejada.',
      beforeTime: 'Material prestado que nadie siente propio',
      after:
        'Se escribe el guion de 15 segundos con la escena de la operación real y se generan tres clips para montar la pieza.',
      afterTime: 'Una tarde, con material propio',
      steps: [
        {
          title: 'Primero el guion, después el video',
          description:
            'Quince segundos son tres frases. Si el guion no cabe, el video tampoco. Pedir el guion antes ahorra generaciones perdidas.',
        },
        {
          title: 'Describe plano, movimiento y luz',
          description:
            'Plano cercano, cámara fija, luz natural. Los mismos términos que usaría un camarógrafo son los que mejor funcionan.',
        },
        {
          title: 'Genera corto y monta después',
          description:
            'Varios clips de pocos segundos dan más control que intentar una pieza larga de una sola generación.',
        },
        {
          title: 'Revisa manos, caras y textos',
          description:
            'Es donde más se notan los errores. Si el clip se va a proyectar, se revisa a pantalla completa antes.',
        },
      ],
      roles: [
        {
          role: 'Talento humano',
          task: 'Capacitación interna',
          detail: 'Clips de refuerzo para inducción y campañas de seguridad.',
        },
        {
          role: 'Mercadeo',
          task: 'Prueba de concepto',
          detail: 'Muestra cómo se vería la campaña antes de comprometer producción.',
        },
        {
          role: 'Comercial',
          task: 'Demostración de idea',
          detail: 'Un clip corto para explicarle al cliente una propuesta difícil de imaginar.',
        },
      ],
      mistakes: [
        {
          bad: 'Presentar un video generado como si fuera grabado en la operación real.',
          good: 'Aclarar que es material ilustrativo cuando pueda confundirse.',
        },
        {
          bad: 'Pedir un video de un minuto en una sola generación.',
          good: 'Varios clips cortos, montados después.',
        },
        {
          bad: 'Incluir personas reconocibles del equipo o del cliente.',
          good: 'Escenas genéricas, sin caras identificables.',
        },
      ],
      mockTitle: 'Gemini · Veo',
      mockPrompt: 'Video de 8 segundos: manos organizando cajas en bodega, luz natural.',
      mockReply:
        'Generé el clip de 8 segundos con cámara fija. Te dejo también una variación con plano más abierto para el cierre.',
      mockPanelTitle: 'Clip generado',
      mockPanel:
        'Duración: 8 s\nPlano: cercano, cámara fija\nLuz: natural\nSin audio\n\n2 variaciones listas',
    },
    {
      slug: 'workspace',
      name: 'Gemini en Workspace',
      shortName: 'Workspace',
      abbr: 'WS',
      color: CO.a,
      level: 'Intermedio',
      category: 'Productividad',
      meta: '5 prompts · 35 min',
      summary:
        'Gemini dentro de Gmail, Docs, Sheets, Slides y Meet, sobre los archivos que ya existen.',
      intro:
        'Es el asistente donde ya está el trabajo, con los permisos que cada quien tiene en Drive. No hay que copiar y pegar a un chat aparte: se le pide sobre el correo abierto, el documento abierto o la hoja abierta.',
      outcomes: [
        'Responder correos largos con el contexto del hilo, sin releerlo completo.',
        'Preguntarle a una hoja de cálculo en lenguaje normal en vez de armar la fórmula.',
        'Salir de la reunión de Meet con el resumen y los compromisos ya escritos.',
      ],
      prompts: [
        {
          tag: 'Gmail',
          text: 'Resume este hilo en cinco puntos y dime qué quedé de hacer yo y para cuándo.',
        },
        {
          tag: 'Gmail',
          text: 'Redacta la respuesta a este correo: aceptamos el alcance, pedimos mover la fecha a [día] y confirmamos el precio. Tono cordial y breve.',
        },
        {
          tag: 'Sheets',
          text: 'Con esta hoja: dime las cinco sucursales con mayor caída de ventas contra el mes pasado y en qué porcentaje.',
        },
        {
          tag: 'Docs',
          text: 'Sobre este documento de Drive: sácame el resumen ejecutivo de media página para el comité.',
        },
        {
          tag: 'Meet',
          text: 'Resume la reunión, saca los compromisos con responsable y fecha, y déjalo listo para pegarlo en el acta.',
        },
      ],
      baIntro:
        'El caso de la sesión: el coordinador vuelve de tres días de viaje con 180 correos y dos reuniones a las que no pudo entrar.',
      before:
        'Dedica la mañana entera a leer hilos, reconstruir qué se decidió y preguntarle a tres personas qué quedó pendiente.',
      beforeTime: 'Media jornada solo para ponerse al día',
      after:
        'Pide el resumen de cada hilo largo y de las dos reuniones grabadas, y sale con la lista de compromisos ordenada.',
      afterTime: 'Cuarenta minutos y ningún pendiente perdido',
      steps: [
        {
          title: 'Trabaja sobre el archivo, no sobre una copia',
          description:
            'Pídelo desde Gmail, Docs o Sheets directamente. Pegar el contenido en otro lado pierde el contexto y duplica versiones.',
        },
        {
          title: 'Pide el compromiso, no solo el resumen',
          description:
            'Lo que sirve de una reunión o de un hilo es quién quedó de hacer qué y para cuándo. Eso hay que pedirlo explícitamente.',
        },
        {
          title: 'Verifica los números de Sheets',
          description:
            'Cuando la respuesta va a una decisión, se confirma con una fórmula o un filtro. La lectura en lenguaje natural es para explorar.',
        },
        {
          title: 'Revisa antes de enviar',
          description:
            'Los correos redactados se leen completos antes de mandar: nombres, fechas y compromisos son responsabilidad de quien firma.',
        },
      ],
      roles: [
        {
          role: 'Dirección',
          task: 'Ponerse al día',
          detail: 'Resumen de hilos y de reuniones perdidas con los compromisos ya extraídos.',
        },
        {
          role: 'Financiera',
          task: 'Consulta de datos',
          detail:
            'Le pregunta a la hoja de ventas en lenguaje normal en vez de armar tablas dinámicas.',
        },
        {
          role: 'Servicio al cliente',
          task: 'Respuesta de correo',
          detail: 'Primeras versiones de respuesta con el tono de la empresa, listas para revisar.',
        },
      ],
      mistakes: [
        {
          bad: 'Mandar el correo redactado sin leerlo.',
          good: 'Revisar nombres, fechas y compromisos antes de enviar.',
        },
        {
          bad: 'Tomar una cifra de Sheets leída en lenguaje natural como definitiva.',
          good: 'Confirmar con fórmula cuando la cifra sustenta una decisión.',
        },
        {
          bad: 'Usar la cuenta personal para documentos de la empresa.',
          good: 'Trabajar siempre desde la cuenta corporativa de Workspace.',
        },
      ],
      mockTitle: 'Gemini · Gmail',
      mockPrompt: 'Resume este hilo y dime qué quedé de hacer yo.',
      mockReply:
        'El hilo tiene 14 correos sobre la renovación. Quedaste de enviar la propuesta ajustada el jueves y de confirmar la fecha de instalación.',
      mockPanelTitle: 'Compromisos',
      mockPanel:
        'Tú: propuesta ajustada, jueves\nTú: confirmar instalación\nCliente: firma del anexo\nOperaciones: agenda de visita',
    },
  ],
};
