import type { PlatformSeed } from './types';

// Contenido verificado contra la documentacion de OpenAI en agosto de 2026.
// Dos cambios de producto respecto del esquema original:
//   - Canvas salio de GPT-5.5: su funcion pasa a los bloques de escritura y de codigo.
//   - Sora se descontinuo (app y web el 26 de abril de 2026), y su modulo se reemplaza
//     por Company knowledge, que es lo que de verdad se usa en un entorno corporativo.

const CO = {
  a: '#0E7C63',
  b: '#2B6FE3',
  c: '#8A5CD1',
  d: '#C2760C',
  e: '#B0396B',
  f: '#3E7A8C',
};

export const chatgpt: PlatformSeed = {
  id: 'chatgpt',
  name: 'ChatGPT',
  portalName: 'Portal ChatGPT',
  initial: 'O',
  color: CO.a,
  description:
    'Bloques de escritura, voz, GPTs propios, Deep Research, Agent Mode, Codex, imágenes y conocimiento de la empresa.',
  tagline: 'Capacitación interna',
  inputHint: 'Escríbele a ChatGPT...',
  badge: 'Programa interno · 8 módulos · en el orden que quieras',
  heroTitle: 'Aprende a usar ChatGPT en el trabajo del día a día',
  heroText:
    'Documentos editables, voz, asistentes propios, investigación con fuentes y agentes que ejecutan tareas, con los casos de siempre.',
  specialTitle: 'Lo que solo se hace acá',
  specialIntro:
    'Los tres diferenciales de ChatGPT frente a los otros portales de la academia.',
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
      kicker: 'GPTs',
      title: 'Asistentes propios por tarea',
      description:
        'Un GPT es ChatGPT con instrucciones fijas y hasta 20 archivos de referencia. Se configura una vez y el área entera responde con el mismo criterio. En nuestro plan corporativo se crean y se comparten desde el espacio de trabajo.',
      example:
        '"Eres el asistente de postventa. Respondes en máximo 150 palabras y nunca prometes fechas de entrega."',
    },
    {
      kicker: 'Agent Mode',
      title: 'Ejecuta, no solo responde',
      description:
        'El agente navega, llena formularios y compara opciones en sitios donde ya tienes sesión abierta. Se detiene a pedirte confirmación antes de cualquier paso que tenga consecuencias.',
      example:
        '"Entra al portal del proveedor, descarga las cotizaciones del mes y ármame el comparativo."',
    },
    {
      kicker: 'Voz',
      title: 'Conversación sin teclado',
      description:
        'Una conversación hablada con interrupciones, que además busca en la web y recuerda lo que ya trabajaste. En el celular puedes compartir cámara o pantalla para mostrarle lo que tienes al frente.',
      example: '"Voy manejando hacia el cliente. Repásame los tres puntos del acta anterior."',
    },
  ],
  // Los archivos los genera `npm run materiales`. El `href` apunta a la
  // descarga protegida, no a public: el portal está detrás del código y el
  // material también.
  downloads: [
    {
      title: 'Guía de prompts',
      description: 'Los 40 prompts del programa, agrupados por módulo y listos para copiar.',
      meta: 'PDF · 10 páginas',
      href: '/api/materiales/chatgpt/guia-de-prompts.pdf',
    },
    {
      title: 'Plantilla de GPT',
      description:
        'Estructura de instrucciones, límites y archivos para armar el GPT del área en 20 minutos.',
      meta: 'DOCX · 3 páginas',
      href: '/api/materiales/chatgpt/plantilla-de-gpt.docx',
    },
    {
      title: 'Checklist de revisión',
      description: 'Qué verificar antes de mandar lo que ChatGPT redactó, calculó o investigó.',
      meta: 'PDF · 1 página',
      href: '/api/materiales/chatgpt/checklist-de-revision.pdf',
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
        'Selecciona el párrafo flojo y pide el cambio ahí. Reescribir el prompt completo bota lo que ya estaba bien.',
    },
    {
      number: '03',
      title: 'Exige la fuente',
      description:
        'En Deep Research y en company knowledge, cada dato viene con su enlace o su documento. Sin fuente, el dato no entra a una decisión.',
    },
    {
      number: '04',
      title: 'Guarda lo que te funcionó',
      description:
        'El prompt que salió bien se convierte en un GPT del área. Así deja de vivir en el bloc de notas de una sola persona.',
    },
  ],
  faqs: [
    {
      question: '¿ChatGPT ve los archivos de la empresa?',
      answer:
        'Solo los que tú le des y solo cuando se lo pidas: un archivo que subes al chat, los documentos de un GPT o las herramientas conectadas al espacio de trabajo (Slack, SharePoint, Google Drive, GitHub y otras). En company knowledge respeta los permisos que ya tiene tu cuenta: si tú no puedes abrir una carpeta, ChatGPT tampoco.',
    },
    {
      question: '¿Lo que escribimos entrena el modelo?',
      answer:
        'En los planes Business, Enterprise y Edu, el contenido del trabajo no se usa para entrenar los modelos de forma predeterminada. En cuentas personales sí puede usarse según la configuración de cada quien, así que el material de la empresa va siempre por la cuenta corporativa.',
    },
    {
      question: '¿Puedo confiar en las cifras que genera?',
      answer:
        'Las cifras se verifican siempre contra la fuente. ChatGPT es muy bueno redactando, ordenando y comparando, pero un número que va a un comité o a un cliente se confirma en el documento original antes de mandarlo. En Deep Research y en company knowledge cada afirmación trae su cita: ábrela.',
    },
    {
      question: '¿En qué se diferencia de los otros portales?',
      answer:
        'ChatGPT es el más fuerte cuando hay que ejecutar y no solo redactar: Agent Mode hace tareas de varios pasos en el navegador y Codex automatiza trabajo técnico. Además los GPTs permiten empaquetar el criterio del área en un asistente que usa todo el equipo.',
    },
  ],
  links: [
    { label: 'Ayuda de ChatGPT', href: 'https://help.openai.com' },
    {
      label: 'GPTs personalizados',
      href: 'https://help.openai.com/en/articles/8554397-creating-and-editing-gpts',
    },
    { label: 'ChatGPT para empresas', href: 'https://openai.com/business' },
  ],
  modules: [
    {
      slug: 'canvas',
      name: 'Documentos editables',
      shortName: 'Documentos',
      abbr: 'CV',
      color: CO.a,
      level: 'Básico',
      category: 'Documentos',
      meta: '5 prompts · 30 min',
      summary:
        'Bloques de escritura y de código dentro del chat: se corrige por selección, no reescribiendo el prompt.',
      intro:
        'Cuando le pides un texto largo o un bloque de código, ChatGPT lo entrega en un bloque editable dentro de la respuesta: se selecciona un párrafo, se pide el cambio ahí y el resto no se toca. Esta es la evolución de lo que antes se llamaba Canvas, que ya no está disponible en GPT-5.5 y sigue solo en los modelos anteriores mientras se apagan.',
      outcomes: [
        'Escribir una propuesta o un instructivo completo sin perder el hilo entre mensajes.',
        'Corregir una sección específica sin que se dañe el resto del texto.',
        'Salir de la sesión con el documento listo para pegar donde va.',
      ],
      prompts: [
        {
          tag: 'Borrador',
          text: 'Redacta la propuesta para [cliente]: contexto, alcance, entregables, tiempos y precio. Tono formal, sin relleno y en máximo dos páginas.',
        },
        {
          tag: 'Sección',
          text: 'Solo el párrafo que seleccioné: déjalo más concreto, con entregables numerados y sin adjetivos. No toques el resto.',
        },
        {
          tag: 'Tono',
          text: 'Todo el documento en un tono más directo, frases cortas y sin tecnicismos. No cambies las cifras ni los nombres.',
        },
        {
          tag: 'Extensión',
          text: 'Recorta esto a una página conservando el precio, el alcance y el siguiente paso.',
        },
        {
          tag: 'Versión',
          text: 'Del mismo contenido, dame una versión de correo de máximo diez líneas para mandarlo hoy.',
        },
      ],
      baIntro:
        'El caso de la sesión: hay que mandar una propuesta hoy y el borrador va en la quinta ronda de correcciones.',
      before:
        'El texto se pide en el chat, se copia a Word, se corrige allá, se vuelve a pegar para el siguiente ajuste y ya nadie sabe cuál es la versión buena.',
      beforeTime: 'Tres versiones circulando y una equivocada enviada',
      after:
        'El documento se arma en un bloque y se corrige por partes. Hay una sola versión y se copia una sola vez, al final.',
      afterTime: 'Una sesión y un solo documento',
      steps: [
        {
          title: 'Empieza por la estructura',
          description:
            'Pide primero los títulos de las secciones. Corregir un índice cuesta un minuto; corregir cinco páginas mal ordenadas cuesta una tarde.',
        },
        {
          title: 'Selecciona antes de pedir el cambio',
          description:
            'Resaltar el párrafo y escribir el ajuste ahí evita que reescriba de arriba a abajo y dañe lo que ya estaba bien.',
        },
        {
          title: 'Pega los datos reales temprano',
          description:
            'Cifras, nombres y fechas verdaderas desde el segundo borrador. Con datos de relleno se corrige un documento que no existe.',
        },
        {
          title: 'Cierra con la versión corta',
          description:
            'Casi siempre hace falta el correo que acompaña al documento. Pídelo en la misma conversación para que hable el mismo idioma.',
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
          bad: 'Buscar el botón de Canvas en el modelo actual y perder la sesión en eso.',
          good: 'Pedir el texto directo: el bloque editable aparece solo cuando el encargo lo amerita.',
        },
        {
          bad: 'Dejar los corchetes de plantilla en el documento final.',
          good: 'Revisar el documento completo antes de copiarlo y enviarlo.',
        },
      ],
      mockTitle: 'ChatGPT · Documento',
      mockPrompt: 'Solo el párrafo de alcance: más concreto y con entregables numerados.',
      mockReply:
        'Actualicé el alcance con cinco entregables numerados y quité los adjetivos. El resto del documento quedó igual.',
      mockPanelTitle: 'Propuesta comercial',
      mockPanel:
        '1. Contexto\n2. Alcance  (editado)\n3. Entregables\n4. Tiempos\n5. Precio y condiciones\n6. Siguiente paso',
    },
    {
      slug: 'voice',
      name: 'Modo voz',
      shortName: 'Voice',
      abbr: 'VZ',
      color: CO.b,
      level: 'Básico',
      category: 'Conversación',
      meta: '5 prompts · 30 min',
      summary:
        'Conversación hablada para consultar, dictar y ensayar sin teclado, con cámara cuando hace falta mostrar.',
      intro:
        'La voz de ChatGPT es una conversación de ida y vuelta que se puede interrumpir, que busca en la web y que recuerda lo que ya trabajaste. Sirve donde no hay teclado: en ruta, en bodega, en obra o en los diez minutos antes de una reunión difícil. Desde el celular puedes compartir la cámara o la pantalla para mostrarle lo que tienes al frente.',
      outcomes: [
        'Consultar un procedimiento sin soltar lo que se tiene en las manos.',
        'Dictar el acta de una visita apenas termina, en vez de reconstruirla al día siguiente.',
        'Ensayar una conversación difícil antes de tenerla de verdad.',
      ],
      prompts: [
        {
          tag: 'Dictado',
          text: 'Voy saliendo de la visita. Te dicto lo que pasó y me devuelves el acta con compromisos, responsable y fecha.',
        },
        {
          tag: 'Ensayo',
          text: 'Vas a ser [un cliente molesto porque el pedido llegó tarde]. Yo contesto y al final me dices qué mejoro en el tono y en los argumentos.',
        },
        {
          tag: 'En sitio',
          text: 'Te estoy mostrando [el tablero de la máquina]. Dime qué indica cada luz y qué reviso primero si está en rojo.',
        },
        {
          tag: 'Repaso',
          text: 'Antes de entrar a la reunión con [cliente], repásame en un minuto los tres puntos que quedaron pendientes la vez pasada.',
        },
        {
          tag: 'Traducción',
          text: 'Traduce al inglés lo que voy diciendo, frase por frase, para hablar con el proveedor.',
        },
      ],
      baIntro:
        'El caso de la sesión: el asesor sale de tres visitas seguidas y las actas quedan para el final del día.',
      before:
        'Llega a la oficina a las seis, se acuerda de la mitad de lo que se habló y escribe tres actas genéricas que no sirven para el seguimiento.',
      beforeTime: 'Una hora extra y compromisos que se pierden',
      after:
        'Dicta cada visita apenas sale, en el carro. Llega con las tres actas redactadas y solo las revisa.',
      afterTime: 'Cinco minutos por visita, sin quedarse tarde',
      steps: [
        {
          title: 'Di dónde estás y qué necesitas',
          description:
            'La voz no adivina el contexto. "Vengo saliendo de una visita de postventa" cambia por completo el acta que te devuelve.',
        },
        {
          title: 'Muestra en vez de describir',
          description:
            'Cuando puedas usar la cámara, apuntar es más rápido y más exacto que explicar con palabras un tablero o un formato.',
        },
        {
          title: 'Interrumpe cuando se desvíe',
          description:
            'Es una conversación: si empieza a dar rodeos, se le corta y se le pide lo concreto. No hay que esperar a que termine.',
        },
        {
          title: 'Cierra pidiendo el resumen escrito',
          description:
            'Antes de colgar, pide los puntos y los compromisos por escrito. Eso es lo que queda para el reporte.',
        },
      ],
      roles: [
        {
          role: 'Comercial',
          task: 'Actas en ruta',
          detail: 'Dicta lo que pasó en la visita apenas sale y llega con el reporte ya redactado.',
        },
        {
          role: 'Operaciones',
          task: 'Consulta en planta',
          detail:
            'Revisa procedimientos y checklists sin quitarse los guantes ni buscar la carpeta del manual.',
        },
        {
          role: 'Talento humano',
          task: 'Ensayo de conversaciones',
          detail:
            'Practica una reunión de desempeño difícil y recibe retroalimentación sobre el tono antes de tenerla.',
        },
      ],
      mistakes: [
        {
          bad: 'Usarlo en un sitio ruidoso y terminar peleando con el micrófono.',
          good: 'Buscar un rincón silencioso o pasar a texto cuando el ruido no deja.',
        },
        {
          bad: 'Dictar datos personales de clientes o mostrarlos a la cámara sin necesidad.',
          good: 'Omitir o tapar los datos sensibles: para el acta basta con el cargo y la empresa.',
        },
        {
          bad: 'Colgar sin pedir el resumen y quedarse solo con la conversación.',
          good: 'Terminar siempre con "resúmeme esto en cinco puntos con los compromisos".',
        },
      ],
      mockTitle: 'ChatGPT · Voz',
      mockPrompt: 'Te dicto la visita: quedaron de mandar el pedido el jueves y falta la firma del anexo.',
      mockReply:
        'Listo el acta con dos compromisos: envío del pedido el jueves a cargo del proveedor, y firma del anexo pendiente de tu lado. ¿Le pongo fecha límite a la firma?',
      mockPanelTitle: 'Conversación',
      mockPanel:
        'Micrófono activo\n03:41 de conversación\n\nActa generada\n2 compromisos\n1 pendiente sin fecha',
    },
    {
      slug: 'gpts',
      name: 'GPTs personalizados',
      shortName: 'GPTs',
      abbr: 'GP',
      color: CO.c,
      level: 'Intermedio',
      category: 'Asistentes',
      meta: '5 prompts · 35 min',
      summary:
        'Asistentes propios por tarea, con instrucciones fijas y archivos de la empresa como referencia.',
      intro:
        'Un GPT es ChatGPT con instrucciones permanentes y hasta 20 archivos de referencia. Se configura una vez y todo el equipo lo usa con el mismo tono y los mismos límites, en vez de que cada quien improvise su prompt. Se crean desde el espacio de trabajo corporativo: en las cuentas personales ya no se pueden crear ni publicar GPTs nuevos.',
      outcomes: [
        'Convertir el prompt que le funciona a una persona en una herramienta del área.',
        'Estandarizar el tono y las reglas con las que se le responde al cliente.',
        'Compartir el asistente con el equipo sin que cada quien tenga que configurarlo.',
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
          text: 'Nunca des asesoría legal ni tributaria. Si te preguntan por eso, responde que se debe consultar con [jurídica] y ofrece redactar el correo.',
        },
        {
          tag: 'Referencia',
          text: 'Usa el documento de [tarifas vigentes] como única fuente de precios. Si un precio no está ahí, di que no lo tienes en vez de estimarlo.',
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
        'Un GPT del área con tono, límites y tarifas cargadas, compartido con el equipo. Todos parten de la misma base y solo ajustan el caso puntual.',
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
            'Qué nunca debe hacer es tan importante como qué debe hacer. Ahí es donde se evitan los problemas con clientes.',
        },
        {
          title: 'Sube pocos archivos y buenos',
          description:
            'Caben hasta 20 documentos, pero con tres actualizados responde mejor que con quince donde la mitad está vencida.',
        },
        {
          title: 'Pruébalo con los casos difíciles antes de compartirlo',
          description:
            'La queja rara, el descuento que no existe, el dato que no está. Si aguanta esos tres, ya se puede compartir con el área.',
        },
      ],
      roles: [
        {
          role: 'Servicio al cliente',
          task: 'Respuestas estándar',
          detail:
            'Un asistente con el tono de la empresa y las tarifas cargadas, igual para todo el turno.',
        },
        {
          role: 'Compras',
          task: 'Evaluación de proveedores',
          detail:
            'Un GPT con la política de compras que revisa cada cotización contra los mismos criterios.',
        },
        {
          role: 'Talento humano',
          task: 'Consultas de personal',
          detail:
            'El reglamento y las políticas cargadas, para responder dudas frecuentes sin buscar en la carpeta.',
        },
      ],
      mistakes: [
        {
          bad: 'Cargar documentos con datos personales o con salarios en un GPT compartido.',
          good: 'Subir solo material que cualquiera del área pueda leer.',
        },
        {
          bad: 'Escribir instrucciones vagas del tipo "sé profesional y útil".',
          good: 'Definir extensión, tono, formato y lo que tiene prohibido decir.',
        },
        {
          bad: 'Dejarlo con archivos del año pasado y seguirlo usando igual.',
          good: 'Poner una revisión mensual con el dueño del contenido.',
        },
      ],
      mockTitle: 'ChatGPT · GPT de postventa',
      mockPrompt: '¿Cuánto cuesta el mantenimiento preventivo del equipo grande?',
      mockReply:
        'Según la tabla de tarifas vigente, el preventivo del equipo grande está en [valor] e incluye dos visitas al año. No tengo el precio con el descuento por contrato anual: eso lo confirma comercial.',
      mockPanelTitle: 'Configuración',
      mockPanel:
        'Instrucciones: tono, extensión y límites\nArchivos: tarifas, garantías, catálogo\nCompartido con: equipo de postventa\n\nSin asesoría legal ni tributaria',
    },
    {
      slug: 'deep',
      name: 'Deep Research',
      shortName: 'Deep Research',
      abbr: 'DR',
      color: CO.d,
      level: 'Intermedio',
      category: 'Investigación',
      meta: '5 prompts · 35 min',
      summary:
        'Informes largos con fuentes citadas sobre mercado, competencia o normativa.',
      intro:
        'Deep Research no contesta de una: planea, busca, descarta fuentes y se toma varios minutos antes de entregar un informe con el enlace de dónde salió cada dato. Puedes seguir el avance mientras trabaja, interrumpirlo para corregir el rumbo y limitar la búsqueda a sitios de confianza. Lo importante del resultado no es el texto, son las fuentes.',
      outcomes: [
        'Llegar al comité con un panorama de competencia sustentado y verificable.',
        'Revisar qué exige una norma sin depender de lo que alguien cree recordar.',
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
          tag: 'Fuentes',
          text: 'Limita la búsqueda a [sitios oficiales y gremios del sector] y dime al final qué no pudiste responder con esas fuentes.',
        },
        {
          tag: 'Verificación',
          text: 'De este informe, dime qué afirmaciones tienen fuente débil o desactualizada y cuáles hay que confirmar antes de presentarlas.',
        },
      ],
      baIntro:
        'El caso de la sesión: la dirección quiere saber si vale la pena entrar a una ciudad nueva y pide el análisis para el comité del viernes.',
      before:
        'Alguien dedica dos días a buscar en internet, arma un documento sin fuentes y nadie sabe qué tan viejo es cada dato.',
      beforeTime: 'Dos días de una persona y cifras que no se pueden defender',
      after:
        'Se encarga el informe con fuentes, se revisa qué quedó flojo y se completa con lo que la empresa ya sabe del mercado.',
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
            'Precios y exigencias regulatorias se confirman con el proveedor o con la norma antes de llevarlos a una decisión.',
        },
      ],
      roles: [
        {
          role: 'Dirección',
          task: 'Decisiones de expansión',
          detail: 'Panorama de una ciudad o de un segmento nuevo antes de comprometer presupuesto.',
        },
        {
          role: 'Compras',
          task: 'Estudio de mercado',
          detail: 'Comparativo sustentado de opciones antes de sentarse a negociar.',
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
          bad: 'Gastar las consultas del mes en preguntas que una búsqueda normal responde.',
          good: 'Reservarlo para lo que de verdad necesita fuentes y varias horas de trabajo.',
        },
        {
          bad: 'Llevar el informe al comité sin abrir ni una fuente.',
          good: 'Verificar las cifras que sostienen la recomendación.',
        },
      ],
      mockTitle: 'ChatGPT · Deep Research',
      mockPrompt: 'Investiga qué ofrecen los tres principales competidores en logística urbana.',
      mockReply:
        'Listo el informe: 18 fuentes revisadas, tres competidores con propuesta y precios públicos. Marqué dos cifras que conviene confirmar directamente con el proveedor.',
      mockPanelTitle: 'Informe',
      mockPanel:
        '1. Panorama del sector\n2. Competidor A: propuesta y precios\n3. Competidor B: cobertura\n4. Competidor C: modelo\n5. Riesgos y vacíos\n\n18 fuentes citadas',
    },
    {
      slug: 'agent',
      name: 'Agent Mode',
      shortName: 'Agent Mode',
      abbr: 'AG',
      color: CO.e,
      level: 'Avanzado',
      category: 'Automatización',
      meta: '5 prompts · 40 min',
      summary:
        'El asistente ejecuta tareas de varios pasos en el navegador y entrega el resultado.',
      intro:
        'En Agent Mode ChatGPT no responde: hace. Abre un navegador, entra a los sitios donde ya tienes sesión, llena formularios, compara opciones y arma el entregable. Se detiene a preguntar cuando algo tiene consecuencias, y hay cosas que no puede hacer por diseño: no instala extensiones, no toca los archivos de tu computador y no usa tus contraseñas guardadas.',
      outcomes: [
        'Encargar una tarea repetitiva de portal web y recibirla hecha.',
        'Reconocer cuándo conviene el agente y cuándo sale más barato hacerlo a mano.',
        'Supervisar la ejecución y confirmar solo los pasos que lo ameritan.',
      ],
      prompts: [
        {
          tag: 'Recolección',
          text: 'Entra al portal de [proveedor], descarga las facturas emitidas este mes y ármame una tabla con número, fecha, valor y estado.',
        },
        {
          tag: 'Comparación',
          text: 'Busca en [tres sitios] el precio y el tiempo de entrega de [producto] y devuélveme una tabla comparativa con el enlace de cada uno.',
        },
        {
          tag: 'Formularios',
          text: 'Con los datos de esta tabla, llena el formulario de [trámite] en [sitio]. Detente antes de enviarlo y muéstrame el resumen.',
        },
        {
          tag: 'Seguimiento',
          text: 'Revisa el estado de estos [cinco pedidos] en el portal del transportador y dime cuáles van retrasados y por cuántos días.',
        },
        {
          tag: 'Verificación',
          text: 'Antes de terminar, dime qué pasos ejecutaste, qué datos tomaste de dónde y qué quedó sin hacer.',
        },
      ],
      baIntro:
        'El caso de la sesión: cada lunes alguien entra a cuatro portales distintos a bajar el estado de los pedidos y armar el consolidado.',
      before:
        'Dos horas de copiar y pegar entre portales y una hoja de cálculo, con errores de transcripción que aparecen después.',
      beforeTime: 'Dos horas cada lunes',
      after:
        'Se le encarga la recolección al agente, se supervisa mientras trabaja y se revisa la tabla final contra los portales críticos.',
      afterTime: 'Veinte minutos, casi todos de revisión',
      steps: [
        {
          title: 'Escoge tareas aburridas y verificables',
          description:
            'Sirve donde el resultado se puede comprobar de un vistazo. Si no puedes verificar lo que hizo, no es tarea para el agente.',
        },
        {
          title: 'Dale el destino y el formato',
          description:
            'Qué sitios, qué datos y en qué forma los quieres. Sin eso navega de más y trae cosas que no pediste.',
        },
        {
          title: 'Quédate mirando la primera vez',
          description:
            'La primera corrida se supervisa completa. Ahí se ve dónde se traba y qué instrucción hay que precisar.',
        },
        {
          title: 'Revisa antes de aprobar el paso final',
          description:
            'Enviar, comprar o confirmar es tu decisión, no la suya. El agente se detiene ahí justamente para que la tomes tú.',
        },
      ],
      roles: [
        {
          role: 'Administración',
          task: 'Trámites en portales',
          detail: 'Descarga de soportes y diligenciamiento de formularios repetitivos.',
        },
        {
          role: 'Compras',
          task: 'Cotizaciones',
          detail: 'Barrido de precios públicos en varios sitios y comparativo con enlaces.',
        },
        {
          role: 'Logística',
          task: 'Seguimiento de envíos',
          detail: 'Consulta del estado de los pedidos en los portales de los transportadores.',
        },
      ],
      mistakes: [
        {
          bad: 'Dejarlo comprar, pagar o enviar sin revisar el paso final.',
          good: 'Aprobar tú lo que tenga consecuencias, siempre.',
        },
        {
          bad: 'Encargarle una tarea en un sitio con datos sensibles de clientes.',
          good: 'Limitarlo a portales de trabajo y a información que ya manejas tú.',
        },
        {
          bad: 'Confiar en la tabla final sin abrir ni un dato en el portal original.',
          good: 'Verificar por muestreo los registros críticos antes de usarla.',
        },
      ],
      mockTitle: 'ChatGPT · Agent Mode',
      mockPrompt: 'Baja el estado de estos cinco pedidos y dime cuáles van retrasados.',
      mockReply:
        'Revisé los cinco en el portal del transportador. Dos van retrasados: uno por tres días y otro por siete. Antes de descargar los soportes necesito que confirmes el acceso.',
      mockPanelTitle: 'Ejecución',
      mockPanel:
        'Paso 1  Abrir portal        listo\nPaso 2  Consultar 5 guías   listo\nPaso 3  Armar tabla         listo\nPaso 4  Descargar soportes  espera confirmación',
    },
    {
      slug: 'codex',
      name: 'Codex',
      shortName: 'Codex',
      abbr: 'CX',
      color: CO.f,
      level: 'Avanzado',
      category: 'Automatización',
      meta: '5 prompts · 40 min',
      summary:
        'Agente de trabajo técnico: automatiza procesos de datos y desarrollo desde el editor, la terminal o la nube.',
      intro:
        'Codex es el agente de programación de ChatGPT. Trabaja en el editor, en la terminal o en entornos en la nube, y puede llevar varias tareas en paralelo mientras tú revisas. En un área no técnica su valor está en convertir el proceso manual de cada mes en algo repetible: consolidar archivos, limpiar datos y generar el mismo reporte sin volver a armarlo a mano.',
      outcomes: [
        'Identificar qué proceso manual del área vale la pena automatizar.',
        'Encargar el script que consolida y limpia los archivos de cada mes.',
        'Entender qué revisar antes de confiar en un resultado automatizado.',
      ],
      prompts: [
        {
          tag: 'Consolidación',
          text: 'Tengo [doce] archivos de Excel con el mismo formato, uno por mes. Arma un script que los una en una sola tabla y marque las filas con datos faltantes.',
        },
        {
          tag: 'Limpieza',
          text: 'En esta base los nombres de cliente están escritos de varias formas. Detecta los duplicados probables y deja una lista para revisión manual.',
        },
        {
          tag: 'Reporte',
          text: 'Genera el reporte mensual de [indicador] a partir de este archivo: totales por área, variación contra el mes anterior y un gráfico.',
        },
        {
          tag: 'Explicación',
          text: 'Explícame en lenguaje sencillo qué hace este script, qué supone de los datos de entrada y en qué casos se rompería.',
        },
        {
          tag: 'Revisión',
          text: 'Revisa este proceso y dime qué pasa si un archivo llega vacío, con columnas de más o con fechas en otro formato.',
        },
      ],
      baIntro:
        'El caso de la sesión: el cierre mensual arranca con alguien pegando doce archivos en una hoja y arreglando formatos a mano.',
      before:
        'Un día entero de consolidación manual, con el riesgo de que un copiado corrido dañe una columna y nadie lo note hasta el comité.',
      beforeTime: 'Un día al mes y errores difíciles de rastrear',
      after:
        'El proceso queda escrito una vez. Cada mes se corre con los archivos nuevos y el tiempo se va en revisar, no en pegar.',
      afterTime: 'Media hora al mes',
      steps: [
        {
          title: 'Escoge un proceso que se repita igual',
          description:
            'Lo que cambia cada mes no se automatiza bien. Lo que se hace idéntico doce veces al año, sí.',
        },
        {
          title: 'Describe el resultado, no la técnica',
          description:
            'Qué archivos entran, qué tiene que salir y qué reglas aplican. La forma de programarlo es problema suyo.',
        },
        {
          title: 'Pide que te lo explique en español',
          description:
            'Si no puedes explicarle a tu jefe qué hace el proceso, no lo puedes defender cuando entregue un número raro.',
        },
        {
          title: 'Corre el mes anterior como prueba',
          description:
            'La mejor validación es un periodo cuyo resultado ya conoces. Si da lo mismo, el proceso sirve.',
        },
      ],
      roles: [
        {
          role: 'Finanzas',
          task: 'Cierre mensual',
          detail: 'Consolidación de archivos y armado del reporte con el mismo formato cada mes.',
        },
        {
          role: 'Datos',
          task: 'Limpieza de bases',
          detail: 'Detección de duplicados y de registros incompletos antes de cargarlos al sistema.',
        },
        {
          role: 'Tecnología',
          task: 'Tareas de desarrollo',
          detail: 'Cambios acotados y revisión de código con el agente trabajando en paralelo.',
        },
      ],
      mistakes: [
        {
          bad: 'Automatizar un proceso que nadie entiende del todo.',
          good: 'Escribir primero las reglas a mano y después pedir que las programe.',
        },
        {
          bad: 'Darle acceso a la base de producción en la primera prueba.',
          good: 'Trabajar sobre una copia hasta que el resultado cuadre con un periodo conocido.',
        },
        {
          bad: 'Confiar en el número final sin revisar ni una fila.',
          good: 'Contrastar contra el cierre anterior antes de publicar el reporte.',
        },
      ],
      mockTitle: 'ChatGPT · Codex',
      mockPrompt: 'Une los doce archivos del año y marca las filas con datos faltantes.',
      mockReply:
        'Listo: 14.320 filas consolidadas. Encontré 87 filas con centro de costo vacío y 12 con fecha en otro formato. Las dejé marcadas en una hoja aparte para revisión.',
      mockPanelTitle: 'Ejecución',
      mockPanel:
        '12 archivos leídos\n14.320 filas unidas\n87 filas sin centro de costo\n12 fechas en formato distinto\n\nSalida: consolidado.xlsx',
    },
    {
      slug: 'images',
      name: 'Imágenes',
      shortName: 'Images',
      abbr: 'IG',
      color: CO.b,
      level: 'Básico',
      category: 'Contenido',
      meta: '5 prompts · 30 min',
      summary:
        'Generación y edición de imágenes para piezas internas y material de apoyo.',
      intro:
        'Sirve para lo que hoy se resuelve con un banco de fotos o esperando al diseñador: la imagen de una campaña interna, el diagrama de un proceso, el retoque de una foto de producto. Lo más útil no es generar desde cero, sino editar: se selecciona una parte de la imagen y se pide el cambio, y el resto de la composición y la iluminación se mantienen.',
      outcomes: [
        'Producir la pieza de una comunicación interna sin esperar turno con diseño.',
        'Editar una imagen existente cambiando solo lo que hace falta.',
        'Saber qué no se debe generar y cuándo hay que pasar por marca o por jurídica.',
      ],
      prompts: [
        {
          tag: 'Pieza interna',
          text: 'Una imagen horizontal para el anuncio interno de [tema]: estilo sobrio, colores [de la marca], sin texto sobre la imagen.',
        },
        {
          tag: 'Edición',
          text: 'De esta foto de producto, cambia solo el fondo por uno blanco limpio. No toques el producto ni la iluminación.',
        },
        {
          tag: 'Diagrama',
          text: 'Un diagrama simple del proceso de [nombre] con [cinco] pasos en línea, etiquetas cortas y sin adornos.',
        },
        {
          tag: 'Variantes',
          text: 'De esta misma imagen dame tres variantes de encuadre: cuadrada para redes, horizontal para la intranet y vertical para el celular.',
        },
        {
          tag: 'Corrección',
          text: 'Quedó muy recargada. Menos elementos, más espacio en blanco y que el foco quede en [elemento].',
        },
      ],
      baIntro:
        'El caso de la sesión: comunicación interna necesita la pieza de la campaña de seguridad para el lunes y diseño está copado con el catálogo.',
      before:
        'Se busca en bancos de fotos, se escoge una imagen genérica que no dice nada y se le pega el texto encima en una plantilla.',
      beforeTime: 'Una pieza que nadie mira',
      after:
        'Se genera la imagen con el estilo de la marca, se ajusta en dos rondas y se sacan las tres variantes de encuadre.',
      afterTime: 'Media hora, sin ocupar a diseño',
      steps: [
        {
          title: 'Di el uso antes que el estilo',
          description:
            'Para intranet, para pantalla de recepción o para el celular. El formato y el nivel de detalle dependen de dónde se va a ver.',
        },
        {
          title: 'Edita en vez de volver a generar',
          description:
            'Selecciona la parte que no te gusta y pide el cambio ahí. Regenerar completo trae una imagen nueva que hay que volver a aprobar.',
        },
        {
          title: 'Deja el texto por fuera',
          description:
            'Los textos largos dentro de la imagen salen con errores. Se genera el fondo y el texto se pone después en la plantilla.',
        },
        {
          title: 'Pasa por marca antes de publicar',
          description:
            'Todo lo que sale con el logo de la empresa se revisa con quien cuida la marca, así lo haya generado la herramienta.',
        },
      ],
      roles: [
        {
          role: 'Comunicación interna',
          task: 'Piezas de campaña',
          detail: 'Imágenes de apoyo para intranet y carteleras sin depender del banco de fotos.',
        },
        {
          role: 'Comercial',
          task: 'Material de propuesta',
          detail: 'Fotos de producto con fondo limpio y diagramas para explicar el servicio.',
        },
        {
          role: 'Talento humano',
          task: 'Material de formación',
          detail: 'Ilustraciones y esquemas para las guías de inducción.',
        },
      ],
      mistakes: [
        {
          bad: 'Generar imágenes con la cara de personas reales del equipo sin permiso.',
          good: 'Pedir autorización o usar figuras genéricas para el material interno.',
        },
        {
          bad: 'Pedir el logo de la empresa dentro de la imagen generada.',
          good: 'Generar el fondo y montar el logo original en la plantilla de marca.',
        },
        {
          bad: 'Aceptar la primera imagen porque salió bonita.',
          good: 'Revisar que diga lo que la comunicación necesita decir.',
        },
      ],
      mockTitle: 'ChatGPT · Imágenes',
      mockPrompt: 'De esta foto, cambia solo el fondo por blanco limpio.',
      mockReply:
        'Listo. Cambié únicamente el fondo y mantuve el producto, las sombras y la iluminación original. ¿Te saco también la versión cuadrada?',
      mockPanelTitle: 'Edición',
      mockPanel:
        'Selección: fondo\nCambio: blanco limpio\nSin tocar: producto, sombras, luz\n\n3 variantes disponibles',
    },
    {
      slug: 'knowledge',
      name: 'Conocimiento de la empresa',
      shortName: 'Company knowledge',
      abbr: 'CK',
      color: CO.c,
      level: 'Intermedio',
      category: 'Documentos',
      meta: '5 prompts · 35 min',
      summary:
        'Respuestas basadas en los documentos y las herramientas de la empresa, con la cita del origen.',
      intro:
        'Con las herramientas del espacio de trabajo conectadas (Slack, SharePoint, Google Drive, GitHub y otras), ChatGPT responde con lo que hay en la empresa y muestra de qué documento o conversación salió cada afirmación. Respeta los permisos que ya tiene tu cuenta: lo que tú no puedes abrir, él tampoco. Es lo que convierte al asistente en alguien que conoce la operación y no solo el idioma.',
      outcomes: [
        'Encontrar en un minuto la política, el contrato o la decisión que está enterrada en una carpeta.',
        'Responder con la cita del documento en vez de con lo que alguien cree recordar.',
        'Reconstruir el estado de un proyecto a partir de lo que ya está escrito.',
      ],
      prompts: [
        {
          tag: 'Política',
          text: '¿Qué dice nuestra política sobre [viáticos] y cuál es el documento vigente? Cítame el archivo y la fecha.',
        },
        {
          tag: 'Estado',
          text: 'Resume en qué va el proyecto [nombre]: últimos acuerdos, pendientes y quién quedó responsable. Cita de dónde sale cada punto.',
        },
        {
          tag: 'Contraste',
          text: 'Compara el contrato de [cliente] con la plantilla estándar y dime en qué cláusulas se aparta.',
        },
        {
          tag: 'Antecedente',
          text: '¿Ya habíamos trabajado algo parecido a [tema]? Muéstrame los documentos anteriores y qué se concluyó.',
        },
        {
          tag: 'Vacíos',
          text: 'De todo esto, dime qué no encontraste en nuestras fuentes y que por lo tanto habría que preguntarle a alguien.',
        },
      ],
      baIntro:
        'El caso de la sesión: llega una persona nueva al área y necesita saber cómo se maneja un caso que ya se resolvió tres veces antes.',
      before:
        'Pregunta en el chat del equipo, interrumpe a dos personas, recibe respuestas parciales y termina haciéndolo distinto a como se hace.',
      beforeTime: 'Dos días y el criterio del área diluido',
      after:
        'Pregunta directamente sobre las fuentes de la empresa, recibe la respuesta con el documento citado y verifica el que importa.',
      afterTime: 'Diez minutos, con el respaldo a la vista',
      steps: [
        {
          title: 'Activa el conocimiento de la empresa',
          description:
            'Es una opción que se selecciona antes de preguntar. Sin activarla responde con conocimiento general, no con el de la empresa.',
        },
        {
          title: 'Pregunta como le preguntarías a un colega',
          description:
            'No hace falta saber en qué carpeta está. Se pregunta por el tema y él busca en las herramientas conectadas.',
        },
        {
          title: 'Abre la cita, no solo la respuesta',
          description:
            'Cada afirmación trae su enlace. Verificar el documento toma diez segundos y es lo que hace utilizable la respuesta.',
        },
        {
          title: 'Pregunta qué no encontró',
          description:
            'Saber qué vacío quedó es tan útil como la respuesta: eso es lo que hay que preguntarle a una persona.',
        },
      ],
      roles: [
        {
          role: 'Talento humano',
          task: 'Inducción',
          detail:
            'La persona nueva resuelve sus dudas contra los documentos reales sin interrumpir al equipo.',
        },
        {
          role: 'Jurídica',
          task: 'Revisión de contratos',
          detail: 'Contraste de un contrato contra la plantilla estándar y los antecedentes del cliente.',
        },
        {
          role: 'Dirección',
          task: 'Estado de proyectos',
          detail: 'Resumen de acuerdos y pendientes armado desde lo que ya está escrito.',
        },
      ],
      mistakes: [
        {
          bad: 'Suponer que ve todos los archivos de la empresa desde el primer día.',
          good: 'Confirmar qué herramientas están conectadas y qué permisos tiene tu cuenta.',
        },
        {
          bad: 'Citar una política en un correo sin abrir el documento que trajo.',
          good: 'Verificar la versión y la fecha antes de comprometer a la empresa.',
        },
        {
          bad: 'Usarlo para buscar información de personas o de desempeño.',
          good: 'Limitarlo a documentos de trabajo y decisiones del negocio.',
        },
      ],
      mockTitle: 'ChatGPT · Conocimiento de la empresa',
      mockPrompt: '¿Qué dice nuestra política de viáticos para viajes de más de tres días?',
      mockReply:
        'La política vigente es la de marzo de 2026: para viajes de más de tres días se autoriza tarifa completa y se exige legalizar dentro de los cinco días hábiles siguientes. No encontré nada sobre viajes internacionales, eso habría que confirmarlo.',
      mockPanelTitle: 'Fuentes',
      mockPanel:
        'Política de viáticos v4  (SharePoint)\nCircular de legalización   (Drive)\nHilo de finanzas           (Slack)\n\n1 vacío: viajes internacionales',
    },
  ],
};
