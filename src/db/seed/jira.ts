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
