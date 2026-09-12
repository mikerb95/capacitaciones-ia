import type { PlatformSeed } from './types';

// Paleta de Atlassian: el azul de Jira manda en el portal y el morado de Rovo
// marca los módulos donde la IA hace el trabajo, no solo lo asiste.
const CO = {
  azul: '#0052CC',
  rovo: '#6E5DC6',
  verde: '#216E4E',
  ambar: '#A54800',
  magenta: '#943D73',
  teal: '#206A83',
};

export const jira: PlatformSeed = {
  id: 'jira',
  name: 'Jira',
  portalName: 'Portal Jira',
  initial: 'J',
  color: CO.azul,
  description:
    'Rovo dentro de Jira: preguntar por el proyecto, resumir hilos, escribir tickets, armar JQL, automatizar el triaje y delegar el procedimiento a un agente.',
  tagline: 'Capacitación interna',
  inputHint: 'Pregúntale a Rovo...',
  badge: 'Programa interno · 8 módulos · en el orden que quieras',
  heroTitle: 'Aprende a usar la IA de Jira en el trabajo del día a día',
  heroText:
    'Rovo trabaja sobre los tickets, los comentarios y las páginas que tu equipo ya escribió. Con los casos de siempre: el estado del sprint, el hilo de cuarenta comentarios, el ticket mal redactado y la cola de soporte.',
  specialTitle: 'Lo que solo se hace acá',
  specialIntro:
    'Tres cosas que diferencian a Jira de los otros portales de la academia, y que conviene practicar en la sesión.',
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
      key: 'contexto',
      kicker: 'Contexto',
      title: 'El ticket y la página, en la misma respuesta',
      description:
        'Rovo no lee un documento que le subiste: lee lo que el equipo lleva años escribiendo en Jira y en Confluence, con los permisos de quien pregunta.',
      example:
        '"¿Por qué se decidió posponer el módulo de facturación? Dame el ticket y la página donde quedó."',
    },
    {
      key: 'agentes',
      kicker: 'Rovo Agents',
      title: 'El procedimiento se ejecuta igual siempre',
      description:
        'Lo que hoy vive en la cabeza del líder (cómo se triagea, qué se pregunta, a quién se asigna) se escribe una vez como agente y corre solo, a toda hora.',
      example: '"Agente de triaje: clasifica este reporte, ponle prioridad y pide lo que falta."',
    },
    {
      key: 'automatizacion',
      kicker: 'Automation',
      title: 'La IA adentro de la regla, no al lado',
      description:
        'Las reglas de Jira ya movían tickets. Ahora una de sus acciones puede leer el texto, entenderlo y decidir, así que el triaje deja de ser una lista de "si contiene la palabra X".',
      example: '"Cuando entre un ticket: resume el problema, clasifícalo y avisa al equipo dueño."',
    },
  ],
  downloads: [
    {
      title: 'Guía de prompts',
      description: 'Los 40 prompts del programa, agrupados por módulo y listos para copiar.',
      meta: 'PDF · 9 páginas',
      href: '/api/materiales/jira/guia-de-prompts.pdf',
    },
    {
      title: 'Plantilla de agente de Rovo',
      description: 'Instrucciones, conocimiento, herramientas y límites para armar el agente del área.',
      meta: 'DOCX · 3 páginas',
      href: '/api/materiales/jira/plantilla-de-agente.docx',
    },
    {
      title: 'Checklist del ticket bien escrito',
      description: 'Qué revisar antes de crear el ticket y antes de darlo por cerrado.',
      meta: 'PDF · 1 página',
      href: '/api/materiales/jira/checklist-de-ticket.pdf',
    },
  ],
  practices: [
    {
      number: '01',
      title: 'Di el proyecto y el periodo',
      description:
        'Rovo ve toda la instancia. "En el proyecto SOP, en las últimas dos semanas" es lo que separa una respuesta útil de una enciclopedia.',
    },
    {
      number: '02',
      title: 'Pide el ticket, no el resumen',
      description:
        'Cuando el dato importa, exige la clave del issue o el enlace a la página. Un estado sin fuente no entra a un comité.',
    },
    {
      number: '03',
      title: 'Revisa antes de que quede escrito',
      description:
        'Lo que Rovo redacta en un ticket lo van a leer veinte personas y queda en el historial. Se lee antes de guardar, siempre.',
    },
    {
      number: '04',
      title: 'Lo que hiciste dos veces, automatízalo',
      description:
        'El prompt que funcionó dos semanas seguidas no se guarda en tus notas: se convierte en una regla o en un agente del equipo.',
    },
  ],
  faqs: [
    {
      question: '¿Rovo ve todos los tickets de la empresa?',
      answer:
        'Ve lo que tu usuario ya puede abrir. Responde con los permisos de quien pregunta, así que un proyecto restringido no aparece en tus respuestas aunque exista. Si a ti te falta acceso a algo, Rovo tampoco te lo va a mostrar.',
    },
    {
      question: '¿Lo que escribimos entrena el modelo?',
      answer:
        'En los planes de pago, el contenido de la instancia no se usa para entrenar los modelos de los proveedores. El detalle está en las condiciones de IA que firmó la empresa, y conviene tenerlo a mano cuando alguien lo pregunte en la sesión.',
    },
    {
      question: '¿Tenemos cupo de IA o es ilimitado?',
      answer:
        'Hay un cupo mensual de créditos de Rovo por plan, y se comparte entre toda la organización. Buscar y resumir cuesta poco; los agentes y el razonamiento largo cuestan más. En el bloque de planes está el detalle del plan contratado.',
    },
    {
      question: '¿En qué se diferencia de los otros portales?',
      answer:
        'En que el contexto no lo pones tú. En ChatGPT o Claude hay que pegarle la información; acá la IA vive encima del trabajo que el equipo ya registró, y por eso sirve para el estado, el traspaso y el triaje más que para redactar de cero.',
    },
  ],
  links: [
    { label: 'Documentación de Jira Cloud', href: 'https://support.atlassian.com/jira-software-cloud/' },
    { label: 'Qué es Rovo', href: 'https://support.atlassian.com/rovo/docs/what-is-rovo/' },
    { label: 'Agentes de Rovo', href: 'https://support.atlassian.com/rovo/docs/agents/' },
    { label: 'Referencia de JQL', href: 'https://support.atlassian.com/jira-software-cloud/docs/jql-fields/' },
  ],
  modules: [
    {
      slug: 'chat',
      name: 'Rovo Chat',
      shortName: 'Chat',
      abbr: 'RC',
      color: CO.azul,
      level: 'Básico',
      category: 'Conversación',
      meta: '5 prompts · 30 min',
      summary:
        'Preguntarle al proyecto en vez de perseguir el estado por el chat del equipo y por tres tableros distintos.',
      intro:
        'Rovo Chat responde con lo que ya está escrito en Jira y en Confluence: tickets, comentarios, decisiones y páginas. No hay que subirle nada ni pegarle contexto. La pregunta reemplaza a la ronda de "¿cómo vamos con esto?".',
      outcomes: [
        'Llegar al comité con el estado real del proyecto y los bloqueos, sin armarlo a mano.',
        'Encontrar la decisión que se tomó hace tres meses y el ticket donde quedó registrada.',
        'Preparar el traspaso de una persona a otra sin una reunión de dos horas.',
      ],
      prompts: [
        {
          tag: 'Estado',
          text: '¿En qué va [la épica de facturación]? Dime qué está bloqueado, quién lo tiene y desde cuándo, con la clave de cada ticket.',
        },
        {
          tag: 'Puesta al día',
          text: 'Ponme al día sobre [el proyecto SOP] en las últimas dos semanas: qué se cerró, qué se decidió y qué quedó pendiente.',
        },
        {
          tag: 'Fuente',
          text: '¿Dónde está documentado [el procedimiento de despliegue]? Dame el enlace a la página, no el resumen.',
        },
        {
          tag: 'Riesgo',
          text: 'De los tickets del sprint actual, ¿cuáles tienen riesgo de no cerrarse y por qué? Ordénalos por impacto.',
        },
        {
          tag: 'Traspaso',
          text: 'Arma el traspaso de [persona] a [persona]: tickets abiertos, en qué va cada uno y qué hay que saber antes de tocarlo.',
        },
      ],
      baIntro:
        'El caso de la sesión: el seguimiento de los lunes, donde cada líder llega a contar en qué va su frente.',
      before:
        'El domingo en la noche cada uno abre su tablero, revisa ticket por ticket y arma la diapositiva con el estado. La mitad de la reunión se va en poner a todos al día.',
      beforeTime: 'Dos horas del domingo y media reunión perdida',
      after:
        'Se le pregunta a Rovo el estado y los bloqueos, se contrasta contra el tablero y se entra con las tres cosas que de verdad hay que decidir.',
      afterTime: 'Diez minutos antes de entrar',
      steps: [
        {
          title: 'Acota el proyecto y el periodo',
          description:
            'Rovo ve toda la instancia. Sin "en el proyecto X, en las últimas dos semanas" la respuesta se vuelve un resumen de todo y de nada.',
        },
        {
          title: 'Pide la clave del ticket',
          description:
            'Que cada afirmación venga con su issue. Eso convierte la respuesta en algo que se puede abrir y verificar en dos clics.',
        },
        {
          title: 'Repregunta sobre la misma respuesta',
          description:
            'No arranques otra conversación: "de esos, ¿cuáles llevan más de una semana sin moverse?". Así se baja del panorama al detalle.',
        },
        {
          title: 'Copia lo que sirve al ticket',
          description:
            'Lo que quedó bien resumido va al comentario del épica o a la página del proyecto. En el chat se pierde; en Jira lo lee el resto.',
        },
      ],
      roles: [
        {
          role: 'Líder de proyecto',
          task: 'Estado para el comité',
          detail:
            'Arma el avance y los riesgos del frente antes del comité, con el ticket que sustenta cada punto.',
        },
        {
          role: 'Servicio al cliente',
          task: 'Respuesta al cliente que pregunta',
          detail:
            'Averigua en qué va el reporte que levantó el cliente hace tres semanas sin escribirle al equipo técnico.',
        },
        {
          role: 'Recursos humanos',
          task: 'Entrada de alguien nuevo',
          detail:
            'Le da a quien llega el contexto del proyecto y las decisiones ya tomadas, sin ocupar al equipo una semana.',
        },
      ],
      mistakes: [
        {
          bad: 'Preguntar "¿cómo va el proyecto?" sin decir cuál ni desde cuándo.',
          good: 'Nombrar el proyecto, el periodo y qué decisión vas a tomar con esa respuesta.',
        },
        {
          bad: 'Llevar al comité una cifra de avance que salió del chat y no se abrió.',
          good: 'Abrir los tickets que cita antes de ponerlos en la lámina.',
        },
        {
          bad: 'Usarlo para saber qué está haciendo una persona, minuto a minuto.',
          good: 'Preguntar por el trabajo, no por la gente. El tablero no es un reloj de control.',
        },
      ],
      mockTitle: 'Jira · Rovo Chat',
      mockPrompt: '¿En qué va la épica de facturación? Dime qué está bloqueado y desde cuándo.',
      mockReply:
        'De 14 tickets hay 9 cerrados y 2 bloqueados hace 6 días: SOP-212 espera el certificado del banco y SOP-219 depende de él. El resto está en curso y va dentro del sprint.',
      mockPanelTitle: 'Bloqueados',
      mockPanel:
        'SOP-212  Certificado del banco\n         6 días · C. Ramírez\n\nSOP-219  Conciliación\n         depende de SOP-212',
    },
    {
      slug: 'resumenes',
      name: 'Resúmenes de ticket',
      shortName: 'Resúmenes',
      abbr: 'RS',
      color: CO.verde,
      level: 'Básico',
      category: 'Lectura',
      meta: '5 prompts · 30 min',
      summary:
        'Un hilo de cuarenta comentarios convertido en qué se decidió, qué falta y quién sigue.',
      intro:
        'Es el botón que más se usa y el que menos se enseña. Sirve para entrar a un ticket viejo sin leerlo entero, pero también para sacar de ahí el correo al cliente o el punto para el comité, que es donde de verdad ahorra tiempo.',
      outcomes: [
        'Entrar a un ticket ajeno y saber en dos minutos qué pasó y qué falta.',
        'Sacar del hilo la decisión y el motivo, que es lo que se pierde cuando alguien se va.',
        'Convertir la discusión técnica en el párrafo que entiende el cliente o la gerencia.',
      ],
      prompts: [
        {
          tag: 'Resumen',
          text: 'Resume este ticket en cinco puntos: qué se reportó, qué se probó, qué se decidió, qué falta y quién lo tiene.',
        },
        {
          tag: 'Decisión',
          text: 'De todo este hilo, dime solo qué se decidió y por qué se descartaron las otras opciones.',
        },
        {
          tag: 'Traspaso',
          text: 'Escribe el comentario de traspaso para quien tome este ticket mañana: contexto, estado y el primer paso concreto.',
        },
        {
          tag: 'Cliente',
          text: 'Con lo que dice este ticket, redacta la respuesta al cliente en dos párrafos, sin tecnicismos y sin prometer fechas.',
        },
        {
          tag: 'Bloqueo',
          text: '¿Qué está frenando este ticket y de quién depende destrabarlo? Si el hilo no lo dice, dímelo en vez de suponerlo.',
        },
      ],
      baIntro:
        'El caso de la sesión: un reporte de un cliente grande que lleva seis semanas abierto y pasó por tres personas.',
      before:
        'Quien lo recibe se lee cuarenta comentarios para no repetir una prueba que ya se hizo. O no se los lee y la repite.',
      beforeTime: 'Cuarenta minutos de lectura, o un día repetido',
      after:
        'Pide el resumen con lo probado y lo decidido, confirma los dos puntos dudosos en el hilo y sigue desde donde iba.',
      afterTime: 'Cinco minutos y arranca',
      steps: [
        {
          title: 'Di para qué quieres el resumen',
          description:
            'No es lo mismo resumir para retomar el trabajo que para contestarle al cliente. El destino cambia qué se conserva y qué se bota.',
        },
        {
          title: 'Pide la decisión aparte',
          description:
            'Lo que más se pierde en un hilo largo no es el qué, es el por qué. Pedirlo explícito es lo que salva al que llegue en seis meses.',
        },
        {
          title: 'Verifica los dos datos que importan',
          description:
            'Fechas, cifras y compromisos se confirman en el comentario original. El resumen te dice dónde mirar, no te libra de mirar.',
        },
        {
          title: 'Deja el resumen en el ticket',
          description:
            'Pégalo como comentario o en la descripción. Así el siguiente no vuelve a gastar el crédito ni el tiempo en lo mismo.',
        },
      ],
      roles: [
        {
          role: 'Soporte',
          task: 'Turno que arranca',
          detail:
            'Entra al turno con los tickets calientes ya resumidos y sabe cuál atender primero.',
        },
        {
          role: 'Comercial',
          task: 'Reporte al cliente',
          detail:
            'Convierte el hilo técnico en el párrafo que el cliente entiende, sin pedirle traducción al equipo.',
        },
        {
          role: 'Calidad',
          task: 'Causa raíz',
          detail:
            'Saca de varios tickets qué se probó y qué se descartó para el informe de la incidencia.',
        },
      ],
      mistakes: [
        {
          bad: 'Mandarle el resumen al cliente tal como salió.',
          good: 'Leerlo, quitarle lo interno y ponerle el tono de la empresa antes de enviar.',
        },
        {
          bad: 'Resumir un ticket con datos personales y pegarlo en un canal abierto.',
          good: 'Tratar el resumen con el mismo cuidado que el ticket del que salió.',
        },
        {
          bad: 'Dar por cierto un compromiso de fecha que aparece en el resumen.',
          good: 'Abrir el comentario donde se prometió y confirmar quién lo dijo y cuándo.',
        },
      ],
      mockTitle: 'Jira · SOP-212',
      mockPrompt: 'Resume este ticket: qué se probó, qué se decidió y qué falta.',
      mockReply:
        'Se reportó cobro duplicado en 3 clientes. Se descartó error de pasarela (log del 12 de agosto) y se confirmó reintento del job nocturno. Se decidió parchear el job, no la pasarela. Falta el certificado del banco para probar en preproducción.',
      mockPanelTitle: 'Actividad',
      mockPanel: '41 comentarios\n3 responsables\nAbierto hace 6 semanas\n\nÚltimo movimiento: hace 6 días',
    },
    {
      slug: 'redaccion',
      name: 'Redacción de issues',
      shortName: 'Redacción',
      abbr: 'RD',
      color: CO.ambar,
      level: 'Básico',
      category: 'Escritura',
      meta: '5 prompts · 30 min',
      summary:
        'De "no funciona el botón" a un ticket con contexto, pasos para reproducir y criterios de aceptación.',
      intro:
        'El ticket mal escrito no se arregla con una plantilla: se arregla preguntando lo que falta. Rovo redacta la descripción, propone los criterios de aceptación y parte el trabajo en subtareas, sobre lo que tú sabes del caso.',
      outcomes: [
        'Escribir en dos minutos el ticket que antes daba pereza escribir bien.',
        'Dejar criterios de aceptación que se puedan verificar, no deseos.',
        'Partir una idea grande en subtareas del tamaño de un día de trabajo.',
      ],
      prompts: [
        {
          tag: 'Reporte',
          text: 'Con esto que te cuento, escribe el reporte de error: qué pasa, en qué pantalla, cómo reproducirlo y qué se esperaba. [Descríbelo en tus palabras].',
        },
        {
          tag: 'Historia',
          text: 'Convierte esta idea en una historia de usuario con criterios de aceptación verificables: [describe la necesidad].',
        },
        {
          tag: 'Subtareas',
          text: 'Parte este ticket en subtareas de máximo un día de trabajo, en el orden en que hay que hacerlas.',
        },
        {
          tag: 'Qué falta',
          text: 'Lee esta descripción y dime qué le falta para que alguien la pueda tomar sin preguntarme nada.',
        },
        {
          tag: 'Definición',
          text: 'Escribe la definición de listo para este tipo de ticket en nuestro equipo: qué hay que probar y quién aprueba.',
        },
      ],
      baIntro:
        'El caso de la sesión: el área comercial reporta un error desde el celular, en el pasillo, entre dos reuniones.',
      before:
        'Crea un ticket que dice "la app falla al cotizar". El equipo lo devuelve pidiendo detalles, pasan dos días y el reporte muere ahí.',
      beforeTime: 'Dos días de ida y vuelta, o el ticket se pierde',
      after:
        'Cuenta lo que pasó como se lo contaría a un compañero y el ticket sale con la pantalla, los pasos y el resultado esperado.',
      afterTime: 'Dos minutos y entra a la cola bien',
      steps: [
        {
          title: 'Cuenta el caso como se lo contarías a alguien',
          description:
            'No intentes escribir el ticket. Describe qué hacías, qué pasó y qué esperabas. Lo demás es formato, y de eso se encarga la IA.',
        },
        {
          title: 'Exige criterios verificables',
          description:
            '"Que funcione bien" no es un criterio. "Que el total incluya IVA y el PDF se genere en menos de 5 segundos" sí.',
        },
        {
          title: 'Pregunta qué falta antes de guardar',
          description:
            'Es el paso que la gente se salta: pedirle que revise la descripción y diga qué le falta para ser tomable.',
        },
        {
          title: 'Revísalo antes de crear',
          description:
            'Lo que quede escrito lo van a leer veinte personas y queda en el historial del proyecto. Se lee una vez antes de guardar.',
        },
      ],
      roles: [
        {
          role: 'Comercial',
          task: 'Reporte desde la calle',
          detail:
            'Levanta el error que vio en la visita con el detalle suficiente para que nadie se lo devuelva.',
        },
        {
          role: 'Producto',
          task: 'Historias del sprint',
          detail:
            'Baja la idea de la reunión a historias con criterios que el equipo puede estimar el mismo día.',
        },
        {
          role: 'Operaciones',
          task: 'Solicitud de cambio',
          detail:
            'Pide un ajuste de proceso describiendo el problema, no la solución que se le ocurrió.',
        },
      ],
      mistakes: [
        {
          bad: 'Dejar que invente los pasos para reproducir el error.',
          good: 'Dictar los pasos reales, aunque sea desordenado. El orden lo pone la IA; los hechos, tú.',
        },
        {
          bad: 'Aceptar criterios de aceptación que no se pueden probar.',
          good: 'Pedir que cada criterio diga cómo se verifica y quién lo verifica.',
        },
        {
          bad: 'Pegar datos del cliente en la descripción porque así salió.',
          good: 'Quitar nombres, cédulas y montos reales antes de guardar: el ticket lo ve todo el proyecto.',
        },
      ],
      mockTitle: 'Jira · Crear incidencia',
      mockPrompt: 'La app falla cuando cotizo con descuento desde el celular.',
      mockReply:
        'Lo dejé así: "Al aplicar descuento en la cotización desde Android, el total no recalcula". Pasos: abrir cotización, agregar ítem, aplicar 10%. Esperado: total con descuento. ¿En qué versión te pasó?',
      mockPanelTitle: 'Borrador',
      mockPanel:
        'Tipo      Error\nPrioridad Media\nPantalla  Cotización móvil\n\nCriterios de aceptación: 3\nSubtareas sugeridas: 2',
    },
    {
      slug: 'busqueda',
      name: 'Búsqueda y JQL',
      shortName: 'JQL',
      abbr: 'JQ',
      color: CO.teal,
      level: 'Intermedio',
      category: 'Búsqueda',
      meta: '5 prompts · 35 min',
      summary:
        'Pedir el filtro en español, quedarse con el JQL y dejarlo guardado como tablero para todo el equipo.',
      intro:
        'JQL es el lenguaje con el que Jira busca, y es la barrera que separa a quien ve su trabajo de quien ve el del área. Acá se pide la consulta hablando y se aprende a leer lo que devuelve, que es lo que permite corregirla cuando trae de más o de menos.',
      outcomes: [
        'Conseguir en un minuto la lista que antes se pedía por correo a quien sabe de Jira.',
        'Leer un JQL y entender por qué trae lo que trae, para poder ajustarlo.',
        'Dejar el filtro guardado y compartido, en vez de rehacerlo cada lunes.',
      ],
      prompts: [
        {
          tag: 'Consulta',
          text: 'Dame el JQL para: tickets de [proyecto] sin responsable, abiertos hace más de 10 días, ordenados por prioridad.',
        },
        {
          tag: 'Explicación',
          text: 'Explícame qué hace este JQL y qué casos se me pueden estar quedando por fuera: [pega la consulta].',
        },
        {
          tag: 'Ajuste',
          text: 'Sobre la consulta anterior: quita los de tipo [subtarea] y agrega solo los que tengan la etiqueta [cliente-clave].',
        },
        {
          tag: 'Comparación',
          text: 'Necesito comparar lo cerrado este sprint contra el anterior en [proyecto]. Dame las dos consultas y qué mirar en cada una.',
        },
        {
          tag: 'Tablero',
          text: 'Con estos filtros, ¿cómo armo un tablero para la reunión de los lunes? Dime qué columnas y qué gráficos poner.',
        },
      ],
      baIntro:
        'El caso de la sesión: la coordinadora necesita cada lunes la lista de lo que lleva más de diez días sin moverse.',
      before:
        'Le escribe al administrador de Jira, que arma la consulta cuando puede. Si está de vacaciones, la lista se hace a ojo.',
      beforeTime: 'Un favor pedido cada semana',
      after:
        'Pide la consulta en español, la revisa, la guarda como filtro compartido y el lunes solo la abre.',
      afterTime: 'Una vez, y queda para siempre',
      steps: [
        {
          title: 'Describe la lista, no la sintaxis',
          description:
            '"Lo que está abierto hace más de diez días y no tiene responsable" alcanza. Los nombres de los campos los pone Jira.',
        },
        {
          title: 'Córrela y cuenta los resultados',
          description:
            'Si trae cero o trae dos mil, la consulta está mal, no el equipo. Ese número es la primera señal de que algo sobra o falta.',
        },
        {
          title: 'Pide que te la explique',
          description:
            'Leer el JQL una vez con la explicación al lado es lo que hace que a la tercera ya no tengas que pedirlo.',
        },
        {
          title: 'Guárdala y compártela',
          description:
            'Un filtro guardado con permiso al equipo vale más que la consulta perfecta que solo tú tienes en el portapapeles.',
        },
      ],
      roles: [
        {
          role: 'Coordinación',
          task: 'Lista de estancados',
          detail:
            'Arma la lista de lo que no se mueve y la deja como filtro compartido para el seguimiento semanal.',
        },
        {
          role: 'Calidad',
          task: 'Errores por versión',
          detail:
            'Cruza los errores abiertos contra la versión donde aparecieron para decidir si se libera o no.',
        },
        {
          role: 'Gerencia',
          task: 'Tablero de la reunión',
          detail:
            'Monta el tablero con lo que se cierra por semana y deja de pedir el reporte armado a mano.',
        },
      ],
      mistakes: [
        {
          bad: 'Copiar el JQL y usarlo sin mirar cuántos resultados trajo.',
          good: 'Contar los resultados y abrir dos al azar para confirmar que son los que buscabas.',
        },
        {
          bad: 'Pedir la consulta con nombres de campo inventados de otra herramienta.',
          good: 'Describir el criterio en español y dejar que resuelva los campos de esta instancia.',
        },
        {
          bad: 'Guardar el filtro como privado y volverse el cuello de botella.',
          good: 'Compartirlo con el rol o el equipo que lo va a usar cada semana.',
        },
      ],
      mockTitle: 'Jira · Buscar',
      mockPrompt: 'Tickets de SOP sin responsable, abiertos hace más de 10 días.',
      mockReply:
        'project = SOP AND assignee IS EMPTY AND created <= -10d AND statusCategory != Done ORDER BY priority DESC. Son 23. Si no quieres subtareas, le agrego AND type != Sub-task.',
      mockPanelTitle: 'Resultados',
      mockPanel: '23 incidencias\n\nAlta      4\nMedia    11\nBaja      8\n\nGuardar como filtro',
    },
    {
      slug: 'automatizacion',
      name: 'Automation con IA',
      shortName: 'Automation',
      abbr: 'AU',
      color: CO.magenta,
      level: 'Intermedio',
      category: 'Automatización',
      meta: '5 prompts · 35 min',
      summary:
        'Reglas que leen el ticket, lo entienden y deciden, en vez de buscar palabras sueltas en el título.',
      intro:
        'Las reglas de Jira ya movían tickets y mandaban correos. La diferencia es que ahora una de sus acciones puede leer el texto y decidir, así que el triaje deja de depender de que el usuario escriba la palabra exacta. La regla se describe en español y Jira la arma.',
      outcomes: [
        'Clasificar y enrutar lo que entra sin que alguien lo lea primero.',
        'Quitar del día las tareas repetidas: etiquetar, avisar, pedir lo que falta.',
        'Escribir una regla nueva sin saber armar condiciones ni ramas.',
      ],
      prompts: [
        {
          tag: 'Regla',
          text: 'Arma una regla: cuando entre un ticket a [proyecto], que lo clasifique por tipo de problema, le ponga prioridad y avise al equipo dueño.',
        },
        {
          tag: 'Datos faltantes',
          text: 'Cuando un reporte llegue sin pasos para reproducir, que comente pidiendo lo que falta y lo deje en espera del reportante.',
        },
        {
          tag: 'Resumen diario',
          text: 'Todos los días a las 8, que mande al canal del equipo un resumen de lo que entró ayer y lo que sigue bloqueado.',
        },
        {
          tag: 'Revisión',
          text: 'Revisa esta regla y dime en qué casos se va a disparar de más o en cuáles no se va a disparar: [describe la regla].',
        },
        {
          tag: 'Cierre',
          text: 'Cuando un ticket lleve 15 días sin actividad, que escriba un comentario preguntando si sigue vigente y avise al responsable.',
        },
      ],
      baIntro:
        'El caso de la sesión: la cola de solicitudes de un área interna, donde todo entra como "Tarea" y sin prioridad.',
      before:
        'Alguien del equipo dedica la primera hora del día a leer lo que entró, clasificarlo y repartirlo. Cuando esa persona falta, la cola se atasca.',
      beforeTime: 'Una hora diaria de una persona',
      after:
        'La regla clasifica, prioriza y enruta al entrar. El equipo revisa lo dudoso, que es la quinta parte.',
      afterTime: 'Diez minutos de supervisión',
      steps: [
        {
          title: 'Empieza por lo que ya haces a mano',
          description:
            'La mejor primera regla es la tarea aburrida de cada mañana. Si nadie la hace hoy, automatizarla no le quita trabajo a nadie.',
        },
        {
          title: 'Escribe el disparador y el resultado',
          description:
            'Cuándo se activa y qué tiene que quedar hecho. Las condiciones intermedias las arma Jira, y se revisan después.',
        },
        {
          title: 'Pruébala en un proyecto de práctica',
          description:
            'Una regla mal puesta toca cien tickets en un minuto y el historial queda con el ruido para siempre. Se prueba aparte.',
        },
        {
          title: 'Revisa el registro la primera semana',
          description:
            'Automation deja el log de cada ejecución. Ahí se ve si se disparó de más y cuánto cupo de IA se está gastando.',
        },
      ],
      roles: [
        {
          role: 'Mesa de servicio',
          task: 'Triaje de la cola',
          detail:
            'Clasifica y enruta lo que entra apenas llega, sin esperar a que alguien abra la bandeja.',
        },
        {
          role: 'Operaciones',
          task: 'Solicitudes incompletas',
          detail:
            'Devuelve sola la solicitud a la que le falta el dato obligatorio, con el comentario ya escrito.',
        },
        {
          role: 'Coordinación',
          task: 'Reporte de la mañana',
          detail:
            'Manda el resumen del día anterior al canal del equipo, siempre a la misma hora.',
        },
      ],
      mistakes: [
        {
          bad: 'Estrenar la regla en el proyecto en producción.',
          good: 'Probarla en un proyecto de práctica y con un puñado de tickets.',
        },
        {
          bad: 'Dejar que la regla cierre tickets sola.',
          good: 'Que pregunte, avise o mueva. Cerrar es una decisión de una persona.',
        },
        {
          bad: 'Ponerle acción de IA a cada paso "por si acaso".',
          good: 'Usarla donde hay que entender texto. Lo demás son condiciones normales y no gastan cupo.',
        },
      ],
      mockTitle: 'Jira · Automation',
      mockPrompt: 'Cuando entre un ticket, clasifícalo, ponle prioridad y avisa al equipo dueño.',
      mockReply:
        'Regla lista: disparador "issue creada" en SOP, acción de IA que clasifica en Acceso, Falla o Solicitud, asigna prioridad por impacto y notifica al canal del equipo. ¿La dejo activa o en borrador?',
      mockPanelTitle: 'Regla',
      mockPanel:
        'Cuando  Se crea una incidencia\nSi      Proyecto = SOP\nEntonces\n  Clasificar con IA\n  Asignar prioridad\n  Notificar al equipo',
    },
    {
      slug: 'reportes',
      name: 'Reportes y estado del sprint',
      shortName: 'Reportes',
      abbr: 'RP',
      color: CO.rovo,
      level: 'Intermedio',
      category: 'Reportes',
      meta: '5 prompts · 35 min',
      summary:
        'El resumen ejecutivo del sprint y los riesgos, armados desde los tickets y no desde la memoria del líder.',
      intro:
        'Jira siempre tuvo los datos y siempre costó sacarlos en forma de historia. Acá se pide el estado del sprint, la explicación de por qué se atrasó y el resumen que entiende la gerencia, con el ticket que sustenta cada afirmación.',
      outcomes: [
        'Llevar al comité el avance real y no la sensación de avance.',
        'Explicar un atraso con los tickets que lo causaron, no con adjetivos.',
        'Preparar la retrospectiva con lo que pasó de verdad en el sprint.',
      ],
      prompts: [
        {
          tag: 'Estado',
          text: 'Resume el sprint actual de [proyecto]: qué se comprometió, qué va a entrar, qué se queda y por qué.',
        },
        {
          tag: 'Ejecutivo',
          text: 'Escribe el estado para gerencia en un párrafo y tres viñetas, sin nombres de tickets ni jerga técnica.',
        },
        {
          tag: 'Riesgos',
          text: 'De lo que queda abierto, ¿qué tiene riesgo de no cerrarse y qué habría que destrabar esta semana?',
        },
        {
          tag: 'Retrospectiva',
          text: 'Con lo que pasó en este sprint, dame tres temas para la retrospectiva, cada uno con el caso concreto que lo sustenta.',
        },
        {
          tag: 'Comparación',
          text: 'Compara este sprint con los dos anteriores en trabajo entregado y en tickets reabiertos. ¿Qué cambió?',
        },
      ],
      baIntro:
        'El caso de la sesión: el informe mensual al comité, que hoy se arma la tarde anterior copiando de tres tableros.',
      before:
        'El líder revisa los tableros, cuenta a mano lo cerrado y escribe el estado. Lo que no recuerda, no entra al informe.',
      beforeTime: 'Media tarde cada mes',
      after:
        'Pide el estado y los riesgos, verifica los tickets que cita, y dedica el tiempo a decidir qué hacer con lo que muestra.',
      afterTime: 'Media hora, y sobra para pensar',
      steps: [
        {
          title: 'Define el periodo y el alcance',
          description:
            'Sprint, mes o versión. Sin recorte, el informe mezcla trabajo de tres frentes y deja de ser comparable.',
        },
        {
          title: 'Pide el porqué, no solo el cuánto',
          description:
            'El número de tickets cerrados no explica nada. Lo que sirve al comité es qué se atascó y qué lo destraba.',
        },
        {
          title: 'Verifica antes de firmarlo',
          description:
            'Abre los tickets que sustentan los dos puntos más fuertes del informe. Va con tu nombre, no con el de la IA.',
        },
        {
          title: 'Guarda el formato que funcionó',
          description:
            'El prompt del informe que le gustó al comité se reutiliza cada mes, y a la tercera vez conviene volverlo agente.',
        },
      ],
      roles: [
        {
          role: 'Líder de equipo',
          task: 'Cierre de sprint',
          detail:
            'Arma el estado del sprint con lo comprometido, lo entregado y el motivo de lo que se queda.',
        },
        {
          role: 'Gerencia',
          task: 'Informe al comité',
          detail:
            'Recibe el avance en lenguaje de negocio, con los riesgos primero y sin claves de tickets.',
        },
        {
          role: 'Producto',
          task: 'Retrospectiva',
          detail:
            'Llega a la retro con tres temas sustentados en casos del sprint, no en impresiones.',
        },
      ],
      mistakes: [
        {
          bad: 'Presentar un porcentaje de avance sin haber abierto ningún ticket.',
          good: 'Verificar al menos los dos puntos que van a generar preguntas.',
        },
        {
          bad: 'Pedir "un informe del proyecto" sin decir periodo ni para quién es.',
          good: 'Decir el periodo, el público y qué decisión se espera del informe.',
        },
        {
          bad: 'Dejar que el informe explique un atraso con adjetivos vagos.',
          good: 'Exigir el ticket y la fecha donde se ve el bloqueo.',
        },
      ],
      mockTitle: 'Jira · Estado del sprint',
      mockPrompt: 'Resume el sprint: qué entra, qué se queda y por qué.',
      mockReply:
        'De 28 puntos comprometidos entran 21. Se quedan la conciliación bancaria (bloqueada 6 días por el certificado) y el reporte de cartera, que se partió tarde. Riesgo: si el certificado no llega el jueves, arrastra al próximo sprint.',
      mockPanelTitle: 'Sprint 24',
      mockPanel:
        'Comprometido  28 pts\nEntregado     21 pts\nSe arrastra    7 pts\n\nBloqueados     2\nReabiertos     1',
    },
