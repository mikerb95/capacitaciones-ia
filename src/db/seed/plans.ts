import { MODELS_REVISION } from '@/lib/revision';
import type { PlansSeed } from './types';

/**
 * Planes de facturación, modelos y qué módulo entra en qué plan.
 *
 * Está separado del contenido editorial a propósito: los precios y los límites
 * cambian cada pocos meses, así que esto se revisa solo y se fecha. Cada
 * plataforma lleva su `note` con la fecha de revisión y la fuente, que es lo
 * que se muestra al pie del bloque de planes en el portal.
 *
 * Convención de `availability`:
 *   incluido  el caso de uso se puede dictar tal cual con ese plan
 *   limitado  se puede, pero con un recorte que hay que avisar en la sesión
 *   no        no se puede: si el cliente está en ese plan, sáltate el módulo
 *
 * `tier` ordena de menor a mayor dentro de la plataforma y es lo que permite
 * decir "desde el plan X". Los planes de empresa siguen la misma escala.
 */

const REVISION = `Revisado en ${MODELS_REVISION}`;

/* ------------------------------------------------------------------ ChatGPT */

export const chatgptPlans: PlansSeed = {
  note: `${REVISION} con la página de precios de OpenAI (openai.com/chatgpt/pricing) y el centro de ayuda. Precios de lista en dólares, sin impuestos. Los límites por plan se ajustan seguido: confirma antes de dictar.`,
  plans: [
    {
      key: 'free',
      name: 'Free',
      price: 'USD 0',
      audience: 'Personal',
      tier: 0,
      summary: 'Cuenta gratuita, sin tarjeta.',
      note: 'Modelo rápido por defecto, tope de archivos e imágenes, publicidad en algunos países.',
    },
    {
      key: 'go',
      name: 'Go',
      price: 'USD 8 / mes',
      audience: 'Personal',
      tier: 1,
      summary: 'Más volumen de uso, sin las funciones avanzadas.',
      note: 'Cerca de 10 veces los límites de Free en mensajes, archivos e imágenes.',
    },
    {
      key: 'plus',
      name: 'Plus',
      price: 'USD 20 / mes',
      audience: 'Personal',
      tier: 2,
      summary: 'El primer plan con la familia completa de modelos y funciones.',
      note: 'Deep Research, Agent Mode, Sora y Codex con cupos mensuales.',
    },
    {
      key: 'pro',
      name: 'Pro',
      price: 'Desde USD 100 / mes',
      audience: 'Personal',
      tier: 3,
      summary: 'Uso alto y el modelo de razonamiento extendido.',
      note: 'De 5 a 20 veces los límites de Plus y la ventana de contexto más grande.',
    },
    {
      key: 'business',
      name: 'Business',
      price: 'USD 20 a 25 / usuario / mes',
      audience: 'Empresa',
      tier: 4,
      summary: 'Espacio de trabajo compartido, mínimo dos puestos.',
      note: 'SSO, consola de administración y sin entrenamiento con los datos de la empresa.',
    },
    {
      key: 'enterprise',
      name: 'Enterprise',
      price: 'A convenir',
      audience: 'Empresa',
      tier: 5,
      summary: 'Contrato a medida para organizaciones grandes.',
      note: 'Residencia de datos, SCIM, registros de cumplimiento y soporte con SLA.',
    },
  ],
  models: [
    {
      key: 'instant',
      name: 'GPT-5.6 Luna (respuesta instantánea)',
      description: 'El modelo por defecto para el día a día: rápido y suficiente para redactar y resumir.',
      plans: [
        { plan: 'free', availability: 'limitado', note: 'Contexto más corto que en los planes pagos.' },
        { plan: 'go' },
        { plan: 'plus' },
        { plan: 'pro' },
        { plan: 'business' },
        { plan: 'enterprise' },
      ],
    },
    {
      key: 'thinking',
      name: 'GPT-5.6 Sol (razonamiento)',
      description: 'Piensa antes de responder. Es el que conviene para análisis, cálculo y decisiones.',
      plans: [
        { plan: 'free', availability: 'no' },
        { plan: 'go', availability: 'no' },
        { plan: 'plus' },
        { plan: 'pro' },
        { plan: 'business' },
        { plan: 'enterprise' },
      ],
    },
    {
      key: 'thinking-pro',
      name: 'GPT-5.6 Sol Pro (razonamiento extendido)',
      description: 'La variante más lenta y más cuidadosa, exclusiva del plan Pro.',
      plans: [
        { plan: 'free', availability: 'no' },
        { plan: 'go', availability: 'no' },
        { plan: 'plus', availability: 'no' },
        { plan: 'pro' },
        { plan: 'business', availability: 'limitado', note: 'Según lo que habilite el administrador.' },
        { plan: 'enterprise', availability: 'limitado', note: 'Según lo que habilite el administrador.' },
      ],
    },
    {
      key: 'terra',
      name: 'GPT-5.6 Terra (contexto largo)',
      description: 'Para documentos extensos y conversaciones que no se quieren cortar.',
      plans: [
        { plan: 'free', availability: 'no' },
        { plan: 'go', availability: 'no' },
        { plan: 'plus' },
        { plan: 'pro' },
        { plan: 'business' },
        { plan: 'enterprise' },
      ],
    },
  ],
  modules: {
    canvas: [
      { plan: 'free', availability: 'limitado', note: 'Se abre, pero con menos margen de edición larga.' },
      { plan: 'go', availability: 'limitado' },
      { plan: 'plus' },
      { plan: 'pro' },
      { plan: 'business' },
      { plan: 'enterprise' },
    ],
    voice: [
      { plan: 'free', availability: 'limitado', note: 'Modo voz con tope diario.' },
      { plan: 'go', availability: 'incluido', note: 'Voz con video.' },
      { plan: 'plus' },
      { plan: 'pro' },
      { plan: 'business' },
      { plan: 'enterprise' },
    ],
    gpts: [
      { plan: 'free', availability: 'limitado', note: 'Se pueden usar GPTs de otros, no crear los propios.' },
      { plan: 'go', availability: 'incluido', note: 'Ya permite crear y compartir GPTs.' },
      { plan: 'plus' },
      { plan: 'pro' },
      { plan: 'business', availability: 'incluido', note: 'Además se comparten dentro del espacio de trabajo.' },
      { plan: 'enterprise' },
    ],
    deep: [
      { plan: 'free', availability: 'no' },
      { plan: 'go', availability: 'no' },
      { plan: 'plus', availability: 'incluido', note: 'Cupo mensual de informes, del orden de diez.' },
      { plan: 'pro', availability: 'incluido', note: 'Cupo muy alto, del orden de cientos al mes.' },
      { plan: 'business' },
      { plan: 'enterprise' },
    ],
    agent: [
      { plan: 'free', availability: 'no' },
      { plan: 'go', availability: 'no' },
      { plan: 'plus' },
      { plan: 'pro' },
      { plan: 'business', availability: 'limitado', note: 'El administrador decide si se habilita.' },
      { plan: 'enterprise', availability: 'limitado', note: 'El administrador decide si se habilita.' },
    ],
    codex: [
      { plan: 'free', availability: 'no' },
      { plan: 'go', availability: 'no' },
      { plan: 'plus', availability: 'limitado', note: 'Cupo de tareas por semana.' },
      { plan: 'pro' },
      { plan: 'business' },
      { plan: 'enterprise' },
    ],
    images: [
      { plan: 'free', availability: 'limitado', note: 'Pocas imágenes por día.' },
      { plan: 'go', availability: 'limitado', note: 'Alrededor de diez veces el cupo de Free.' },
      { plan: 'plus' },
      { plan: 'pro' },
      { plan: 'business' },
      { plan: 'enterprise' },
    ],
    knowledge: [
      { plan: 'free', availability: 'no' },
      { plan: 'go', availability: 'no' },
      {
        plan: 'plus',
        availability: 'limitado',
        note: 'Conectores de cuentas personales (Drive, GitHub), no el índice de la empresa.',
      },
      {
        plan: 'pro',
        availability: 'limitado',
        note: 'Conectores de cuentas personales, no el índice de la empresa.',
      },
      {
        plan: 'business',
        availability: 'incluido',
        note: 'Es el escenario del módulo: respeta los permisos que ya tiene cada cuenta.',
      },
      { plan: 'enterprise' },
    ],
  },
};

/* ------------------------------------------------------------------- Claude */

export const claudePlans: PlansSeed = {
  note: `${REVISION} con la página de precios de Anthropic (claude.com/pricing). Precios de lista en dólares, sin impuestos. Los límites de uso se miden por ventanas de cinco horas, no por mensajes al día.`,
  plans: [
    {
      key: 'free',
      name: 'Free',
      price: 'USD 0',
      audience: 'Personal',
      tier: 0,
      summary: 'Cuenta gratuita para probar.',
      note: 'Uso diario acotado y prioridad menor en horas pico.',
    },
    {
      key: 'pro',
      name: 'Pro',
      price: 'USD 17 a 20 / mes',
      audience: 'Personal',
      tier: 1,
      summary: 'El plan de trabajo individual. USD 17 con pago anual.',
      note: 'Habilita Research, Skills, la extensión de Chrome y la integración con Microsoft 365.',
    },
    {
      key: 'max5',
      name: 'Max 5x',
      price: 'Desde USD 100 / mes',
      audience: 'Personal',
      tier: 2,
      summary: 'Cinco veces el uso de Pro por ventana.',
      note: 'Acceso anticipado a funciones nuevas.',
    },
    {
      key: 'max20',
      name: 'Max 20x',
      price: 'Desde USD 200 / mes',
      audience: 'Personal',
      tier: 3,
      summary: 'Veinte veces el uso de Pro por ventana.',
      note: 'Pensado para quien vive dentro de Claude Code o Cowork.',
    },
    {
      key: 'team',
      name: 'Team',
      price: 'Desde USD 20 / puesto / mes',
      audience: 'Empresa',
      tier: 4,
      summary: 'Todo lo de Pro más administración central.',
      note: 'Puestos premium a USD 100 para quien necesita el uso de Max.',
    },
    {
      key: 'enterprise',
      name: 'Enterprise',
      price: 'A convenir',
      audience: 'Empresa',
      tier: 5,
      summary: 'Contrato corporativo con controles de cumplimiento.',
      note: 'SSO, SCIM, retención de datos a medida, acuerdos HIPAA y roles.',
    },
  ],
  models: [
    {
      key: 'sonnet',
      name: 'Claude Sonnet 5',
      description: 'El modelo por defecto: equilibrio entre calidad y velocidad para el trabajo diario.',
      plans: [
        { plan: 'free' },
        { plan: 'pro' },
        { plan: 'max5' },
        { plan: 'max20' },
        { plan: 'team' },
        { plan: 'enterprise' },
      ],
    },
    {
      key: 'haiku',
      name: 'Claude Haiku 4.5',
      description: 'El más rápido y barato, para tareas cortas y repetitivas.',
      plans: [
        { plan: 'free' },
        { plan: 'pro' },
        { plan: 'max5' },
        { plan: 'max20' },
        { plan: 'team' },
        { plan: 'enterprise' },
      ],
    },
    {
      key: 'opus',
      name: 'Claude Opus 5',
      description: 'El más capaz para análisis largos, código y razonamiento sostenido.',
      plans: [
        { plan: 'free', availability: 'limitado', note: 'Acceso muy acotado, se agota en pocas consultas.' },
        { plan: 'pro' },
        { plan: 'max5' },
        { plan: 'max20' },
        { plan: 'team' },
        { plan: 'enterprise' },
      ],
    },
    {
      key: 'fable',
      name: 'Claude Fable 5',
      description: 'Orientado a escritura y trabajo creativo de formato largo.',
      plans: [
        { plan: 'free', availability: 'limitado', note: 'Acceso acotado.' },
        { plan: 'pro' },
        { plan: 'max5' },
        { plan: 'max20' },
        { plan: 'team' },
        { plan: 'enterprise' },
      ],
    },
  ],
  modules: {
    artifacts: [
      { plan: 'free' },
      { plan: 'pro' },
      { plan: 'max5' },
      { plan: 'max20' },
      { plan: 'team' },
      { plan: 'enterprise' },
    ],
    projects: [
      { plan: 'free', availability: 'limitado', note: 'Menos espacio de conocimiento por proyecto.' },
      { plan: 'pro' },
      { plan: 'max5' },
      { plan: 'max20' },
      { plan: 'team', availability: 'incluido', note: 'Los proyectos se comparten con el equipo.' },
      { plan: 'enterprise' },
    ],
    design: [
      { plan: 'free', availability: 'limitado' },
      { plan: 'pro' },
      { plan: 'max5' },
      { plan: 'max20' },
      { plan: 'team' },
      { plan: 'enterprise' },
    ],
    research: [
      { plan: 'free', availability: 'no' },
      { plan: 'pro' },
      { plan: 'max5' },
      { plan: 'max20' },
      { plan: 'team', availability: 'incluido', note: 'Suma la búsqueda sobre las fuentes de la empresa.' },
      { plan: 'enterprise' },
    ],
    skills: [
      { plan: 'free', availability: 'no' },
      { plan: 'pro' },
      { plan: 'max5' },
      { plan: 'max20' },
      { plan: 'team' },
      { plan: 'enterprise' },
    ],
    mcp: [
      { plan: 'free', availability: 'limitado', note: 'Conectores básicos, sin los de escritorio.' },
      { plan: 'pro' },
      { plan: 'max5' },
      { plan: 'max20' },
      { plan: 'team' },
      { plan: 'enterprise' },
    ],
    code: [
      { plan: 'free', availability: 'limitado', note: 'Se agota muy rápido: no alcanza para una práctica completa.' },
      { plan: 'pro', availability: 'incluido', note: 'Alcanza para sesiones cortas.' },
      { plan: 'max5' },
      { plan: 'max20' },
      { plan: 'team', availability: 'limitado', note: 'Requiere puesto premium para uso sostenido.' },
      { plan: 'enterprise' },
    ],
    cowork: [
      { plan: 'free', availability: 'limitado' },
      { plan: 'pro' },
      { plan: 'max5' },
      { plan: 'max20' },
      { plan: 'team' },
      { plan: 'enterprise' },
    ],
    chrome: [
      { plan: 'free', availability: 'no' },
      { plan: 'pro' },
      { plan: 'max5' },
      { plan: 'max20' },
      { plan: 'team' },
      { plan: 'enterprise' },
    ],
  },
};

/* ------------------------------------------------------------------- Gemini */

export const geminiPlans: PlansSeed = {
  note: `${REVISION} con los planes de Google AI (one.google.com/about/google-ai-plans) y la lista de precios de Workspace. Precios de lista en dólares, sin impuestos. En Workspace, Gemini viene incluido desde Business Standard.`,
  plans: [
    {
      key: 'free',
      name: 'Gratis',
      price: 'USD 0',
      audience: 'Personal',
      tier: 0,
      summary: 'Cuenta de Google sin suscripción.',
      note: 'Acceso al modelo rápido y cupos bajos en investigación e imágenes.',
    },
    {
      key: 'plus',
      name: 'Google AI Plus',
      price: 'USD 4,99 / mes',
      audience: 'Personal',
      tier: 1,
      summary: 'El escalón de entrada, con 400 GB de almacenamiento.',
      note: 'Deep Research, generación de imágenes y Gemini dentro de Gmail y Docs.',
    },
    {
      key: 'pro',
      name: 'Google AI Pro',
      price: 'USD 19,99 / mes',
      audience: 'Personal',
      tier: 2,
      summary: 'El plan completo para uso profesional, con 5 TB.',
      note: 'Deep Think, Deep Search, 1.000 créditos de Flow al mes y crédito de Google Cloud.',
    },
    {
      key: 'ultra',
      name: 'Google AI Ultra',
      price: 'Desde USD 99,99 / mes',
      audience: 'Personal',
      tier: 3,
      summary: 'Todo el catálogo con los límites más altos.',
      note: 'Modo agente, 25.000 créditos de Flow y 20 TB o más de almacenamiento.',
    },
    {
      key: 'workspace',
      name: 'Workspace Business y Enterprise',
      price: 'Desde USD 18 / usuario / mes',
      audience: 'Empresa',
      tier: 4,
      summary: 'Gemini incluido desde Business Standard, sin complemento aparte.',
      note: 'Los datos quedan bajo el dominio de la empresa. El complemento de acceso ampliado sube los límites.',
    },
  ],
  models: [
    {
      key: 'flash',
      name: 'Gemini Omni Flash',
      description: 'El modelo rápido, el que responde por defecto en el chat.',
      plans: [
        { plan: 'free', availability: 'limitado', note: 'Cupo diario.' },
        { plan: 'plus', availability: 'limitado', note: 'Acceso acotado.' },
        { plan: 'pro' },
        { plan: 'ultra' },
        { plan: 'workspace' },
      ],
    },
    {
      key: 'pro-model',
      name: 'Gemini 3.1 Pro',
      description: 'El modelo grande, con ventana de un millón de tokens.',
      plans: [
        { plan: 'free', availability: 'limitado', note: 'Pocas consultas al día.' },
        { plan: 'plus', availability: 'incluido', note: 'Más acceso que en la cuenta gratuita.' },
        { plan: 'pro' },
        { plan: 'ultra', availability: 'incluido', note: 'El acceso más alto.' },
        { plan: 'workspace' },
      ],
    },
    {
      key: 'deep-think',
      name: 'Deep Think',
      description: 'Modo de razonamiento profundo para problemas difíciles.',
      plans: [
        { plan: 'free', availability: 'no' },
        { plan: 'plus', availability: 'no' },
        { plan: 'pro' },
        { plan: 'ultra' },
        { plan: 'workspace', availability: 'limitado', note: 'Depende de la edición y del complemento.' },
      ],
    },
    {
      key: 'nano-banana',
      name: 'Nano Banana (Imagen)',
      description: 'El generador y editor de imágenes, el que usa el módulo de imágenes.',
      plans: [
        { plan: 'free', availability: 'limitado', note: 'Pocas imágenes por día.' },
        { plan: 'plus' },
        { plan: 'pro' },
        { plan: 'ultra' },
        { plan: 'workspace' },
      ],
    },
    {
      key: 'veo-model',
      name: 'Veo (video)',
      description: 'El generador de video que usa Flow.',
      plans: [
        { plan: 'free', availability: 'no' },
        { plan: 'plus', availability: 'limitado', note: 'Créditos de Flow muy acotados.' },
        { plan: 'pro', availability: 'incluido', note: '1.000 créditos al mes.' },
        { plan: 'ultra', availability: 'incluido', note: '25.000 créditos al mes.' },
        { plan: 'workspace', availability: 'no', note: 'No viene con Workspace: se contrata aparte.' },
      ],
    },
  ],
  modules: {
    live: [
      { plan: 'free', availability: 'limitado', note: 'Sesiones cortas.' },
      { plan: 'plus' },
      { plan: 'pro' },
      { plan: 'ultra' },
      { plan: 'workspace' },
    ],
    deep: [
      { plan: 'free', availability: 'limitado', note: 'Pocos informes al mes.' },
      { plan: 'plus' },
      { plan: 'pro', availability: 'incluido', note: 'Suma Deep Search.' },
      { plan: 'ultra' },
      { plan: 'workspace' },
    ],
    canvas: [
      { plan: 'free', availability: 'limitado' },
      { plan: 'plus' },
      { plan: 'pro' },
      { plan: 'ultra' },
      { plan: 'workspace' },
    ],
    gems: [
      { plan: 'free' },
      { plan: 'plus' },
      { plan: 'pro' },
      { plan: 'ultra' },
      { plan: 'workspace', availability: 'incluido', note: 'Se pueden compartir con el dominio.' },
    ],
    notebook: [
      { plan: 'free', availability: 'limitado', note: 'Tope de cuadernos y de fuentes por cuaderno.' },
      { plan: 'plus', availability: 'incluido', note: 'Cuaderno ampliado.' },
      { plan: 'pro' },
      { plan: 'ultra' },
      { plan: 'workspace' },
    ],
    imagen: [
      { plan: 'free', availability: 'limitado', note: 'Pocas imágenes por día.' },
      { plan: 'plus' },
      { plan: 'pro' },
      { plan: 'ultra' },
      { plan: 'workspace', availability: 'limitado', note: 'Según lo que habilite el administrador.' },
    ],
    veo: [
      { plan: 'free', availability: 'no' },
      { plan: 'plus', availability: 'limitado', note: 'Créditos de Flow muy acotados.' },
      { plan: 'pro', availability: 'incluido', note: '1.000 créditos al mes.' },
      { plan: 'ultra', availability: 'incluido', note: '25.000 créditos al mes.' },
      { plan: 'workspace', availability: 'no', note: 'Se contrata aparte de Workspace.' },
    ],
    workspace: [
      { plan: 'free', availability: 'no' },
      { plan: 'plus', availability: 'incluido', note: 'Gemini en Gmail, Docs y el resto de las apps.' },
      { plan: 'pro' },
      { plan: 'ultra' },
      { plan: 'workspace', availability: 'incluido', note: 'Es el escenario para el que está pensado el módulo.' },
    ],
  },
};

/* ------------------------------------------------------------------ Copilot */

export const copilotPlans: PlansSeed = {
  note: `${REVISION} con la página de precios de Microsoft 365 Copilot y la documentación de Copilot Studio. Precios de lista en dólares, sin impuestos, y sin contar la suscripción base de Microsoft 365, que va aparte.`,
  plans: [
    {
      key: 'chat',
      name: 'Copilot Chat',
      price: 'USD 0',
      audience: 'Empresa',
      tier: 0,
      summary: 'Incluido con la cuenta de Microsoft 365, sin licencia adicional.',
      note: 'Chat apoyado en la web. No ve los archivos, correos ni chats de la empresa.',
    },
    {
      key: 'business',
      name: 'Microsoft 365 Copilot Business',
      price: 'USD 18 a 21 / usuario / mes',
      audience: 'Empresa',
      tier: 1,
      summary: 'Para organizaciones de menos de 300 usuarios.',
      note: 'Copilot dentro de las apps y sobre los datos de trabajo.',
    },
    {
      key: 'copilot',
      name: 'Microsoft 365 Copilot',
      price: 'USD 30 / usuario / mes',
      audience: 'Empresa',
      tier: 2,
      summary: 'La licencia completa, sin tope de usuarios.',
      note: 'Se suma al costo del plan base de Microsoft 365.',
    },
    {
      key: 'studio',
      name: 'Copilot con créditos de agente',
      price: 'Desde USD 200 / paquete / mes',
      audience: 'Empresa',
      tier: 3,
      summary: 'La licencia anterior más capacidad para correr agentes.',
      note: 'Paquetes de 25.000 créditos, o pago por uso a USD 0,01 por crédito.',
    },
  ],
  models: [
    {
      key: 'chat-model',
      name: 'Modelo base de Copilot Chat',
      description: 'El modelo de OpenAI que responde en el chat web y en Copilot Chat.',
      plans: [
        { plan: 'chat', availability: 'limitado', note: 'Sin acceso a los datos de la empresa.' },
        { plan: 'business' },
        { plan: 'copilot' },
        { plan: 'studio' },
      ],
    },
    {
      key: 'work-model',
      name: 'Modelo con anclaje en datos de trabajo',
      description: 'El mismo modelo, pero con acceso al índice de archivos, correos y chats de la organización.',
      plans: [
        { plan: 'chat', availability: 'no' },
        { plan: 'business' },
        { plan: 'copilot' },
        { plan: 'studio' },
      ],
    },
    {
      key: 'reasoning',
      name: 'Modelos de razonamiento (Researcher y Analyst)',
      description: 'Los que usan los agentes de investigación y de análisis de datos.',
      plans: [
        { plan: 'chat', availability: 'no' },
        { plan: 'business', availability: 'incluido', note: '25 consultas al mes entre los dos agentes.' },
        { plan: 'copilot', availability: 'incluido', note: '25 consultas al mes entre los dos agentes.' },
        { plan: 'studio', availability: 'incluido', note: 'Más consultas comprando créditos.' },
      ],
    },
    {
      key: 'studio-models',
      name: 'Modelos de Copilot Studio',
      description: 'El catálogo de modelos que se puede elegir al construir un agente propio.',
      plans: [
        { plan: 'chat', availability: 'no' },
        { plan: 'business', availability: 'limitado', note: 'Requiere capacidad de créditos contratada.' },
        { plan: 'copilot', availability: 'limitado', note: 'Requiere capacidad de créditos contratada.' },
        { plan: 'studio' },
      ],
    },
  ],
  modules: {
    chat: [
      { plan: 'chat', availability: 'limitado', note: 'Solo con información de la web, sin datos de la empresa.' },
      { plan: 'business' },
      { plan: 'copilot' },
      { plan: 'studio' },
    ],
    word: [
      { plan: 'chat', availability: 'no' },
      { plan: 'business' },
      { plan: 'copilot' },
      { plan: 'studio' },
    ],
    excel: [
      { plan: 'chat', availability: 'no' },
      { plan: 'business' },
      { plan: 'copilot' },
      { plan: 'studio' },
    ],
    ppt: [
      { plan: 'chat', availability: 'no' },
      { plan: 'business' },
      { plan: 'copilot' },
      { plan: 'studio' },
    ],
    teams: [
      { plan: 'chat', availability: 'no' },
      { plan: 'business' },
      { plan: 'copilot' },
      { plan: 'studio' },
    ],
    outlook: [
      { plan: 'chat', availability: 'no' },
      { plan: 'business' },
      { plan: 'copilot' },
      { plan: 'studio' },
    ],
    cowork: [
      { plan: 'chat', availability: 'no' },
      { plan: 'business', availability: 'limitado', note: 'La licencia habilita el acceso, el uso se paga con créditos.' },
      { plan: 'copilot', availability: 'limitado', note: 'La licencia habilita el acceso, el uso se paga con créditos.' },
      { plan: 'studio' },
    ],
    studio: [
      { plan: 'chat', availability: 'no' },
      { plan: 'business', availability: 'limitado', note: 'Se pueden armar agentes, correrlos consume créditos.' },
      { plan: 'copilot', availability: 'limitado', note: 'Se pueden armar agentes, correrlos consume créditos.' },
      { plan: 'studio' },
    ],
    'researcher-analyst': [
      { plan: 'chat', availability: 'no' },
      { plan: 'business', availability: 'incluido', note: '25 consultas al mes entre los dos agentes.' },
      { plan: 'copilot', availability: 'incluido', note: '25 consultas al mes entre los dos agentes.' },
      { plan: 'studio' },
    ],
  },
};

export const PLANS: Record<string, PlansSeed> = {
  chatgpt: chatgptPlans,
  claude: claudePlans,
  gemini: geminiPlans,
  copilot: copilotPlans,
};
