import type { Curso } from './tipos';

// Un color por nivel, tomado de los módulos del portal de Gemini, para que
// el temario se lea de un vistazo como una escalera.
const C = {
  verde: '#1E8E7E',
  celeste: '#3D7BC4',
  azul: '#3B5BDB',
  violeta: '#8A5CD1',
  magenta: '#B0396B',
};

/**
 * Ruta guiada de Gemini: de quien nunca abrió la app a quien diseña el
 * sistema de IA de su equipo. Cada unidad profundiza un módulo del portal y
 * cierra con algo que se hace, no con algo que se lee.
 *
 * No todas las empresas contratan lo mismo: algunas usan solo la app de
 * Gemini, otras suman Workspace o NotebookLM. Por eso los exámenes de cierre
 * marcan cada pregunta con su módulo y se recortan pregunta por pregunta según
 * el alcance: ver `cursoEnAlcance` en `./index.ts`.
 *
 * Una advertencia para quien edite: el avance se guarda contra el `slug` de
 * cada lección. Renombrar uno borra el avance de esa lección para todos.
 */
export const geminiCurso: Curso = {
  platformId: 'gemini',
  titulo: 'Gemini en el trabajo, de cero a experto',
  subtitulo: 'Ruta guiada',
  descripcion:
    'Un recorrido en cinco niveles: primero qué Gemini tienes y qué puede ver, después la voz, Canvas y las imágenes, luego Gmail, Docs, Sheets, Meet y NotebookLM, más adelante Deep Research y video con Veo, y al final Gems y el sistema completo del equipo. Lecciones cortas, prácticas revisadas por IA y un examen por nivel.',
  color: C.azul,
  aprendizajes: [
    'Pedirle bien a Gemini: para quién, para qué, con qué datos y qué no inventar.',
    'Resolver en voz alta con Live cuando no hay teclado, y salir con el acta escrita.',
    'Escribir documentos largos en Canvas corrigiendo por secciones, sin versiones sueltas.',
    'Trabajar sobre el correo, el documento y la hoja que ya existen, sin copiar y pegar.',
    'Consultar manuales y actas en NotebookLM con la cita exacta, y encargar investigaciones a Deep Research.',
    'Convertir el prompt que funciona en un Gem del área, con límites, pruebas y un dueño.',
  ],
  requisitos: [
    'Una cuenta corporativa de Google. Todo el material de la empresa va por esa cuenta, nunca por una personal.',
    'Las unidades de Workspace y NotebookLM dependen de lo que la empresa tenga habilitado. Si tu capacitación no las incluye, no se muestran y el curso sigue por lo que sí tengas.',
    'Para Live conviene tener la app de Gemini en el celular.',
    'Si ya usas Gemini a diario, haz el diagnóstico y salta a tu nivel.',
  ],
  niveles: [
    {
      key: 'cero',
      titulo: 'Nivel 0 · Fundamentos',
      promesa: 'Sabes qué Gemini tienes, qué puede ver y con qué herramienta resolver cada tarea.',
      color: C.verde,
    },
    {
      key: 'basico',
      titulo: 'Nivel 1 · Básico',
      promesa: 'Resuelves en voz alta, escribes en Canvas sin perder versiones e ilustras lo interno.',
      color: C.celeste,
    },
    {
      key: 'intermedio',
      titulo: 'Nivel 2 · Intermedio',
      promesa: 'Trabajas sobre Gmail, Docs, Sheets y Meet, y consultas tus documentos con la cita a la vista.',
      color: C.azul,
    },
    {
      key: 'avanzado',
      titulo: 'Nivel 3 · Avanzado',
      promesa: 'Encargas investigaciones con fuentes y produces video corto, y revisas todo antes de usarlo.',
      color: C.violeta,
    },
    {
      key: 'experto',
      titulo: 'Nivel 4 · Experto',
      promesa: 'Diseñas un Gem para el área y gobiernas la IA del equipo con métricas y dueños.',
      color: C.magenta,
    },
  ],

  /* ============================================================ unidades */
  unidades: [
    /* ------------------------------------------------------------ nivel 0 */
    {
      slug: 'fundamentos',
      nivel: 'cero',
      titulo: 'Gemini sin misterio',
      descripcion:
        'Qué Gemini tienes, qué puede ver, con qué herramienta resolver cada tarea y cómo pedirle bien. Lo mínimo para que lo que viene después tenga dónde apoyarse.',
      lecciones: [
        {
          slug: 'que-es-gemini',
          tipo: 'lectura',
          titulo: 'Qué es Gemini y dónde aparece',
          minutos: 12,
          resumen: 'Gemini no es un solo lugar: es una app, un asistente dentro de Workspace y un cuaderno de fuentes.',
          objetivos: [
            'Distinguir la app de Gemini, Gemini en Workspace y NotebookLM.',
            'Reconocer qué herramienta vive dentro de cada uno.',
            'Saber por qué la cuenta con la que entras cambia lo que puedes hacer.',
          ],
          bloques: [
            {
              tipo: 'texto',
              texto:
                'Cuando alguien dice "Gemini" puede estar hablando de tres lugares distintos. La app de Gemini es el chat, en el navegador o en el celular: ahí están Canvas, Deep Research, Live, las imágenes, el video y los Gems. Gemini en Workspace es el mismo asistente metido en Gmail, Docs, Sheets, Slides y Meet, que trabaja sobre el archivo que tienes abierto. NotebookLM es una herramienta aparte: un cuaderno donde cargas tus propias fuentes y solo responde con lo que hay en ellas.',
            },
            {
              tipo: 'conceptos',
              items: [
                {
                  termino: 'App de Gemini',
                  definicion:
                    'El chat. Desde ahí se abren Canvas, Deep Research, Live, las imágenes, el video con Veo y los Gems.',
                },
                {
                  termino: 'Gemini en Workspace',
                  definicion:
                    'El panel lateral de Gmail, Docs, Sheets, Slides y Meet. Trabaja sobre el correo, el documento o la hoja abierta, con tus permisos de Drive.',
                },
                {
                  termino: 'NotebookLM',
                  definicion:
                    'Un cuaderno por tema con las fuentes que tú cargas. Cada respuesta trae el fragmento del que salió.',
                },
              ],
            },
            {
              tipo: 'nota',
              tono: 'ojo',
              titulo: 'La cuenta importa',
              texto:
                'Con la cuenta personal de Gmail también hay Gemini, pero no con las mismas reglas de datos. Lo que es de la empresa se trabaja siempre con la cuenta corporativa. Si no ves el ícono de Gemini en Gmail o en Docs, lo más probable es que estés en la cuenta equivocada o que tu empresa no lo tenga habilitado.',
            },
            {
              tipo: 'nota',
              tono: 'clave',
              titulo: 'La idea que te llevas',
              texto:
                'Antes de pedir algo, pregúntate dónde vive el trabajo. Si ya está en un correo o un documento, pídeselo a Gemini ahí mismo. Si es una conversación nueva, la app. Si son tus manuales y necesitas la cita, NotebookLM.',
            },
          ],
          chequeo: [
            {
              id: 'q1',
              enunciado: 'Quieres que Gemini te resuma un hilo largo que tienes abierto en Gmail. ¿Dónde se lo pides?',
              opciones: [
                {
                  texto: 'En la app de Gemini, pegando todos los correos.',
                  explicacion: 'Funciona, pero es copiar y pegar lo que Gemini ya puede leer desde Gmail.',
                },
                {
                  texto: 'En el panel de Gemini dentro de Gmail, con el hilo abierto.',
                  correcta: true,
                  explicacion: 'Correcto. Gemini en Workspace trabaja sobre el correo que tienes abierto.',
                },
                {
                  texto: 'En NotebookLM, cargando el hilo como fuente.',
                  explicacion: 'NotebookLM es para un conjunto de documentos que se consultan varias veces, no para un hilo del día.',
                },
              ],
            },
          ],
        },
        {
          slug: 'datos-y-permisos',
          tipo: 'lectura',
          titulo: 'Qué ve Gemini y qué pasa con lo que escribes',
          minutos: 12,
          resumen: 'Gemini nunca ve más de lo que tú ya puedes abrir, y el material de la empresa no entrena modelos.',
          objetivos: [
            'Explicar por qué Gemini respeta los permisos de Drive.',
            'Saber cuándo el contenido se usa o no para entrenar.',
            'Reconocer qué información no se pega nunca en el chat.',
          ],
          bloques: [
            {
              tipo: 'texto',
              texto:
                'Gemini en Workspace usa los mismos permisos que tu cuenta. Si no puedes abrir una carpeta de Drive, Gemini tampoco. Y no revisa tus archivos por su cuenta: los usa cuando se lo pides desde Workspace, cuando lo mencionas en el chat o cuando lo cargas como fuente.',
            },
            {
              tipo: 'chat',
              titulo: 'Un archivo al que no tienes acceso',
              pregunta: 'Resume el presupuesto 2027 que está en la carpeta de Gerencia.',
              respuesta:
                'No encuentro ese archivo entre los documentos a los que tienes acceso. Si alguien te lo comparte, puedo resumirlo.',
            },
            {
              tipo: 'nota',
              tono: 'clave',
              titulo: 'Solo ve lo que tú ves',
              texto:
                'Gemini no gana acceso nuevo. Si una respuesta trae un dato que no deberías ver, el problema está en cómo está compartido el archivo, no en Gemini, y hay que avisarle al dueño de la carpeta.',
            },
            {
              tipo: 'texto',
              texto:
                'En las cuentas de Workspace del plan corporativo, lo que escribes y los archivos que usas no se emplean para entrenar los modelos. En las cuentas personales gratuitas las conversaciones sí pueden revisarse para mejorar el producto. Esa es la razón de fondo para no trabajar nada de la empresa desde la cuenta personal.',
            },
            {
              tipo: 'lista',
              items: [
                'Contraseñas, llaves de acceso y números de tarjeta: nunca, en ninguna cuenta.',
                'Datos personales de clientes o empleados: solo si la política de la empresa lo permite y con la cuenta corporativa.',
                'Información de terceros bajo acuerdo de confidencialidad: revisa el acuerdo antes.',
              ],
            },
          ],
          chequeo: [
            {
              id: 'q1',
              enunciado: 'Le pides a Gemini un archivo de una carpeta que no tienes compartida. ¿Qué pasa?',
              opciones: [
                {
                  texto: 'Lo lee igual, porque Gemini tiene acceso a todo Drive.',
                  explicacion: 'Gemini usa los permisos de tu cuenta, no unos propios.',
                },
                {
                  texto: 'No lo encuentra: solo ve lo que tu cuenta ya puede abrir.',
                  correcta: true,
                  explicacion: 'Correcto. Sin acceso tuyo, no hay acceso de Gemini.',
                },
                {
                  texto: 'Lo pide al dueño en tu nombre.',
                  explicacion: 'Gemini no solicita accesos por ti.',
                },
              ],
            },
          ],
        },
        {
          slug: 'que-herramienta-uso',
          tipo: 'lectura',
          titulo: 'Qué herramienta para cada tarea',
          minutos: 12,
          resumen: 'Chat, Canvas, Live, Deep Research, NotebookLM o un Gem: cada uno resuelve una cosa distinta.',
          objetivos: [
            'Elegir la herramienta según la tarea y no por costumbre.',
            'Reconocer las señales de que el chat se quedó corto.',
          ],
          bloques: [
            {
              tipo: 'texto',
              texto:
                'La mayoría de la gente usa solo el chat, y para muchas cosas basta. Pero hay señales claras de que otra herramienta lo haría mejor: el texto va por la quinta versión, la pregunta necesita fuentes de verdad, tienes las manos ocupadas, o escribes el mismo prompt cada lunes.',
            },
            {
              tipo: 'conceptos',
              items: [
                { termino: 'Chat', definicion: 'Preguntas cortas, ideas, borradores de pocas líneas.' },
                { termino: 'Canvas', definicion: 'Un documento largo que se corrige por partes sin perder el hilo.' },
                { termino: 'Live', definicion: 'Conversación en voz, con cámara, cuando no hay teclado a mano.' },
                { termino: 'Deep Research', definicion: 'Un informe de varios minutos, con el enlace de cada dato.' },
                { termino: 'NotebookLM', definicion: 'Preguntas sobre tus propios documentos, con la cita exacta.' },
                { termino: 'Gem', definicion: 'Un asistente con instrucciones fijas para una tarea que se repite.' },
              ],
            },
            {
              tipo: 'comparar',
              antes: {
                titulo: 'Por costumbre',
                texto:
                  'Pedir en el chat el informe de competencia para el comité y recibir un texto fluido, sin un solo enlace, con cifras que nadie puede defender.',
              },
              despues: {
                titulo: 'Con la herramienta correcta',
                texto:
                  'Encargarlo a Deep Research, revisar el plan antes de que arranque y llegar al comité con cada dato enlazado a su fuente.',
              },
            },
            {
              tipo: 'nota',
              tono: 'dato',
              titulo: 'No hay que acertar a la primera',
              texto:
                'Si el chat se queda corto, no se pierde nada: lo que ya escribiste sirve como punto de partida para Canvas o para el encargo de Deep Research.',
            },
            {
              tipo: 'nota',
              tono: 'dato',
              titulo: 'El selector de modelo',
              texto:
                'Arriba del chat se elige el modelo. Los nombres cambian cada pocos meses, así que la regla práctica es la que no cambia: el modelo rápido para redactar, resumir y responder del día a día; el modelo que razona más, para cuando la tarea tiene varios pasos o hay que analizar algo con cuidado. Si una respuesta se queda corta, cambiar de modelo es lo segundo que se prueba, después de mejorar el pedido.',
            },
          ],
          chequeo: [
            {
              id: 'q1',
              enunciado: 'Escribes cada lunes el mismo prompt para el informe semanal del área. ¿Qué te conviene?',
              opciones: [
                {
                  texto: 'Seguir pegándolo desde un bloc de notas.',
                  explicacion: 'Funciona, pero cada quien termina con su propia versión.',
                },
                {
                  texto: 'Convertirlo en un Gem.',
                  correcta: true,
                  explicacion: 'Correcto. Un Gem guarda las instrucciones y el equipo entero usa las mismas.',
                },
                {
                  texto: 'Usar Deep Research cada lunes.',
                  explicacion: 'Deep Research investiga fuera; el informe semanal parte de datos que ya tienes.',
                },
              ],
            },
          ],
        },
        {
          slug: 'el-prompt-que-funciona',
          tipo: 'lectura',
          titulo: 'El prompt que funciona',
          minutos: 15,
          resumen: 'Para quién, para qué, con qué datos, en qué formato y qué no inventar.',
          objetivos: [
            'Escribir un pedido con las cinco partes que lo hacen reutilizable.',
            'Corregir sobre la respuesta en vez de empezar de cero.',
          ],
          bloques: [
            {
              tipo: 'texto',
              texto:
                'Casi toda la diferencia entre una respuesta genérica y una útil está en decir para quién es antes de pedir. Gemini no sabe que el cliente lleva seis años con la empresa ni que la compensación todavía no está aprobada: si no se lo dices, lo rellena con algo que suena bien.',
            },
            {
              tipo: 'lista',
              ordenada: true,
              items: [
                'Para quién: el destinatario y su rol.',
                'Para qué: qué pasó y qué tiene que lograr el texto.',
                'Contexto: los datos que solo tú sabes.',
                'Formato: tono, extensión y estructura.',
                'Límites: lo que no debe inventar ni prometer.',
              ],
            },
            {
              tipo: 'comparar',
              antes: {
                titulo: 'Pedido vago',
                texto: 'Hazme un correo para el proveedor diciendo que pagamos tarde.',
              },
              despues: {
                titulo: 'Pedido completo',
                texto:
                  'Correo para Andrés Gómez, jefe de cartera de Empaques del Norte. El pago de la factura 8812 sale el viernes 26 y no el 19 como estaba pactado, por un cambio en el ciclo de tesorería. Tono cordial y directo, máximo 120 palabras, empieza por la fecha nueva. No ofrezcas intereses ni descuentos: no están aprobados.',
              },
            },
            {
              tipo: 'nota',
              tono: 'clave',
              titulo: 'Corrige, no arranques otra vez',
              texto:
                'Si la respuesta está cerca, pide el ajuste: "más corto y sin tecnicismos", "quita la disculpa del primer párrafo". Es más rápido que reescribir el prompt, y Gemini conserva lo que ya estaba bien.',
            },
            {
              tipo: 'prompt',
              etiqueta: 'Ajuste',
              texto: 'Déjalo en la mitad de palabras, conserva la fecha y el número de factura, y cambia el cierre por una pregunta concreta.',
            },
          ],
          chequeo: [
            {
              id: 'q1',
              enunciado: 'La respuesta de Gemini está casi bien, pero es muy larga. ¿Qué haces?',
              opciones: [
                {
                  texto: 'Escribes el prompt completo otra vez, agregando "corto".',
                  explicacion: 'Funciona, pero pierdes lo que ya estaba bien y tardas más.',
                },
                {
                  texto: 'Pides el ajuste sobre esa respuesta: "la mitad de largo, mismo contenido".',
                  correcta: true,
                  explicacion: 'Correcto. Corregir sobre lo que hay es más rápido y más preciso.',
                },
                {
                  texto: 'Lo recortas a mano, Gemini no sabe resumir.',
                  explicacion: 'Recortar es justo algo que hace bien si se lo pides.',
                },
              ],
            },
          ],
        },
        {
          slug: 'practica-primer-prompt',
          tipo: 'practica',
          titulo: 'Práctica: el pedido completo',
          minutos: 15,
          resumen: 'Convierte un pedido vago en un prompt que un colega podría reutilizar.',
          bloques: [
            {
              tipo: 'texto',
              texto:
                'Vas a escribir el prompt de verdad, no una fórmula. No hay una única respuesta correcta: te revisamos contra una rúbrica de cinco puntos, y después ves cómo lo escribimos nosotros.',
            },
          ],
          caso: {
            rol: 'Coordinación de servicio al cliente',
            tarea: 'Responder a un cliente que reclama una instalación incompleta',
            situacion:
              'Tu jefa te dice: "contéstale a Ferretería La 14, que están bravos". Luis Moreno, administrador de la ferretería, escribió que el técnico dejó la instalación del sistema de alarma a medias el martes. El técnico se fue porque faltaba un sensor que llega el jueves. El cliente paga mantenimiento mensual desde hace tres años. Todavía no está aprobado ningún descuento por el retraso.',
          },
          consigna: 'Escribe el prompt que le darías a Gemini para redactar esa respuesta.',
          placeholder: 'Redacta una respuesta para...',
          rubrica: [
            { id: 'destinatario', titulo: 'Destinatario', pregunta: '¿Nombra a quién va dirigida la respuesta y su rol?' },
            { id: 'objetivo', titulo: 'Objetivo', pregunta: '¿Dice qué pasó y qué debe comunicar la respuesta?' },
            { id: 'contexto', titulo: 'Contexto', pregunta: '¿Incluye el dato relevante: el sensor llega el jueves, cliente de tres años?' },
            { id: 'formato', titulo: 'Formato y extensión', pregunta: '¿Pide un tono y una extensión concretos?' },
            { id: 'limites', titulo: 'Límites', pregunta: '¿Dice explícitamente qué no prometer, como un descuento no aprobado?' },
          ],
          pistas: [
            'Piensa en lo que necesitarías saber tú si otra persona te pidiera escribir esta respuesta.',
            'Un cliente molesto quiere saber primero cuándo se resuelve, no leer una disculpa larga.',
          ],
          solucion:
            'Redacta la respuesta para Luis Moreno, administrador de Ferretería La 14, que reclama porque el técnico dejó a medias la instalación de la alarma el martes. Lo que pasó: faltaba un sensor, que llega el jueves; el técnico vuelve el viernes en la mañana a terminar. Contexto: es cliente de mantenimiento mensual desde hace tres años. Quiero: máximo 130 palabras, tono respetuoso y directo, que arranque con la fecha en que queda terminada, reconozca que debimos avisarle antes de irnos y cierre con un número de contacto. No ofrezcas descuentos ni compensaciones: no están aprobados.',
        },
        {
          slug: 'examen-fundamentos',
          tipo: 'examen',
          titulo: 'Examen del nivel 0',
          minutos: 10,
          resumen: 'Seis preguntas sobre dónde vive Gemini, permisos, herramientas y prompts. Se aprueba con 80%.',
          aprobacion: 80,
          preguntas: [
            {
              id: 'e1',
              enunciado: '¿Qué diferencia a NotebookLM de la app de Gemini?',
              opciones: [
                {
                  texto: 'NotebookLM responde solo con las fuentes que cargaste y muestra de dónde sale cada afirmación.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'NotebookLM es la versión de Gemini para el celular.',
                  explicacion: 'La app de Gemini es la que está en el celular; NotebookLM es un cuaderno de fuentes.',
                },
                {
                  texto: 'Son lo mismo con otro nombre.',
                  explicacion: 'NotebookLM se limita a tus fuentes; la app responde con todo lo que sabe y con la web.',
                },
              ],
            },
            {
              id: 'e2',
              enunciado: 'Con Gemini en Docs, ¿qué archivos de Drive puede usar?',
              opciones: [
                {
                  texto: 'Todos los de la empresa.',
                  explicacion: 'Gemini no tiene permisos propios.',
                },
                {
                  texto: 'Los que tu cuenta ya puede abrir.',
                  correcta: true,
                  explicacion: 'Correcto. Respeta los permisos existentes.',
                },
                {
                  texto: 'Solo los que tú creaste.',
                  explicacion: 'También los que te compartieron: el límite son tus permisos, no la autoría.',
                },
              ],
            },
            {
              id: 'e3',
              enunciado: '¿Por qué el material de la empresa no se trabaja desde una cuenta personal de Gmail?',
              opciones: [
                {
                  texto: 'Porque la cuenta personal es más lenta.',
                  explicacion: 'No es una cuestión de velocidad.',
                },
                {
                  texto: 'Porque en las cuentas personales gratuitas las conversaciones pueden revisarse para mejorar el producto.',
                  correcta: true,
                  explicacion: 'Correcto. En el plan corporativo el contenido no se usa para entrenar.',
                },
                {
                  texto: 'No hay diferencia, se puede usar cualquiera.',
                  explicacion: 'Las reglas de datos cambian según la cuenta.',
                },
              ],
            },
            {
              id: 'e4',
              enunciado: 'Necesitas un informe de la competencia con el enlace de cada dato. ¿Qué usas?',
              opciones: [
                {
                  texto: 'Una pregunta en el chat.',
                  explicacion: 'El chat responde rápido, pero no revisa decenas de páginas ni enlaza cada dato.',
                },
                {
                  texto: 'Deep Research.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'Canvas.',
                  explicacion: 'Canvas sirve para escribir y corregir un documento, no para investigar.',
                },
              ],
            },
            {
              id: 'e5',
              enunciado: '¿Cuál de estas partes de un prompt es la que más evita que Gemini prometa algo indebido?',
              opciones: [
                {
                  texto: 'El formato.',
                  explicacion: 'El formato define la forma, no lo que se puede decir.',
                },
                {
                  texto: 'Los límites: lo que no debe inventar ni prometer.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'El saludo.',
                  explicacion: 'El saludo no cambia el contenido.',
                },
              ],
            },
            {
              id: 'e6',
              enunciado: 'La respuesta está bien pero el tono es muy técnico. ¿Qué es lo más eficiente?',
              opciones: [
                {
                  texto: 'Empezar una conversación nueva.',
                  explicacion: 'Pierdes el contexto y lo que ya estaba bien.',
                },
                {
                  texto: 'Pedir el ajuste: "mismo contenido, sin tecnicismos".',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'Reescribirlo a mano.',
                  explicacion: 'Es justo el tipo de ajuste que Gemini resuelve en segundos.',
                },
              ],
            },
          ],
        },
      ],
    },

    /* ------------------------------------------------------------ nivel 1 */
    {
      slug: 'live',
      nivel: 'basico',
      modulo: 'live',
      titulo: 'Gemini Live',
      descripcion:
        'Conversación en voz y con cámara para consultar en sitio, ensayar una conversación difícil o dictar lo que pasó al salir de una visita.',
      lecciones: [
        {
          slug: 'hablar-con-live',
          tipo: 'lectura',
          titulo: 'Hablar en vez de escribir',
          minutos: 12,
          resumen: 'Live es una conversación: se interrumpe, se muestra y se cierra pidiendo el resumen.',
          objetivos: [
            'Abrir Live y usar la cámara para mostrar lo que tienes al frente.',
            'Interrumpir y redirigir la conversación.',
            'Cerrar la conversación con algo escrito.',
          ],
          bloques: [
            {
              tipo: 'texto',
              texto:
                'Live no es dictarle al chat. Es una conversación hablada: Gemini contesta en voz, puedes cortarlo a mitad de frase y cambiar de tema, y si activas la cámara puede ver lo que le muestras. Sirve donde no hay teclado: en bodega, en obra, en ruta o antes de entrar a una reunión difícil.',
            },
            {
              tipo: 'lista',
              ordenada: true,
              items: [
                'Di dónde estás y qué estás viendo: "estoy frente al tablero de la línea 2".',
                'Muestra en vez de describir: apunta la cámara a la etiqueta, la luz o el formato.',
                'Interrumpe cuando se desvíe: "espera, eso ya lo revisé, sigue con lo otro".',
                'Cierra pidiendo el resumen: la conversación queda escrita en el historial.',
              ],
            },
            {
              tipo: 'chat',
              titulo: 'En sitio, con la cámara',
              pregunta: 'Estoy viendo el tablero de la bomba. Hay una luz ámbar encendida al lado de la que dice "térmico". ¿Qué reviso primero?',
              respuesta:
                'Esa luz suele indicar que el relé térmico se disparó por sobrecarga. Antes de rearmarlo, revisa que el motor no esté caliente al tacto y que el eje gire libre. Si vuelve a dispararse en pocos minutos, no lo rearmes otra vez: puede haber una falla en el motor y conviene escalarlo.',
            },
            {
              tipo: 'nota',
              tono: 'ojo',
              titulo: 'Lo que Live no reemplaza',
              texto:
                'Live ayuda a orientarse, pero no reemplaza el manual del fabricante ni el procedimiento de seguridad. Si una instrucción implica abrir un tablero energizado o saltarse un bloqueo, se para y se escala.',
            },
            {
              tipo: 'nota',
              tono: 'dato',
              titulo: 'Ensayar antes de la conversación real',
              texto:
                'Live también sirve para practicar: le pides que haga de cliente molesto, contestas en voz alta y al final le pides que te diga qué mejorar en el tono y en los argumentos.',
            },
          ],
          chequeo: [
            {
              id: 'q1',
              enunciado: 'Estás en una visita y Gemini empieza a explicarte algo que ya revisaste. ¿Qué haces?',
              opciones: [
                {
                  texto: 'Esperas a que termine para no perder la conversación.',
                  explicacion: 'En Live no hace falta esperar: se puede interrumpir.',
                },
                {
                  texto: 'Lo interrumpes y le dices qué ya revisaste y qué necesitas.',
                  correcta: true,
                  explicacion: 'Correcto. Interrumpir es parte de cómo se usa Live.',
                },
                {
                  texto: 'Cierras Live y lo escribes en el chat.',
                  explicacion: 'Pierdes la ventaja de tener las manos libres.',
                },
              ],
            },
          ],
        },
        {
          slug: 'practica-acta-dictada',
          tipo: 'practica',
          titulo: 'Práctica: el acta dictada',
          minutos: 15,
          resumen: 'Lo que le dirías a Live al salir de una visita para que te devuelva el acta lista.',
          bloques: [
            {
              tipo: 'texto',
              texto:
                'Vas a escribir lo que le dictarías a Live al salir de la visita: el pedido y los datos. Te revisamos contra una rúbrica de cinco puntos.',
            },
          ],
          caso: {
            rol: 'Asesor comercial en ruta',
            tarea: 'Dejar el acta de la visita antes de llegar al siguiente cliente',
            situacion:
              'Sales de Distribuidora San Mateo. Hablaste con Rosa Díaz, jefa de compras. Acordaron: enviarle la cotización de 40 cajas de guantes de nitrilo antes del miércoles, revisar con logística si se puede entregar los sábados, y ella confirma el presupuesto con su gerente el lunes. Pidió que no le escriban por WhatsApp, solo por correo. Vas manejando y el siguiente cliente está a 20 minutos.',
          },
          consigna: 'Escribe lo que le dirías a Live para que te devuelva el acta.',
          placeholder: 'Voy saliendo de la visita a...',
          rubrica: [
            { id: 'contexto', titulo: 'Contexto', pregunta: '¿Dice con quién fue la reunión, su cargo y la empresa?' },
            { id: 'acuerdos', titulo: 'Acuerdos', pregunta: '¿Incluye los tres compromisos de la visita?' },
            { id: 'responsables', titulo: 'Responsable y fecha', pregunta: '¿Pide que cada compromiso quede con responsable y fecha?' },
            { id: 'formato', titulo: 'Formato', pregunta: '¿Pide un formato concreto para el acta?' },
            { id: 'detalle', titulo: 'Lo que no se olvida', pregunta: '¿Incluye la preferencia de contacto de la clienta?' },
          ],
          pistas: [
            'Un compromiso sin fecha es un deseo: pídele que marque los que no la tengan.',
            'Los detalles pequeños, como el canal de contacto, son los que más se olvidan a los dos días.',
          ],
          solucion:
            'Voy saliendo de la visita a Distribuidora San Mateo. Hablé con Rosa Díaz, jefa de compras. Te dicto y me devuelves el acta en tres partes: resumen de dos líneas, compromisos en tabla con qué, quién y para cuándo, y notas. Compromisos: yo le envío la cotización de 40 cajas de guantes de nitrilo antes del miércoles; yo reviso con logística si se puede entregar los sábados, sin fecha acordada, márcalo para que le ponga una; Rosa confirma el presupuesto con su gerente el lunes. Nota importante: no quiere que le escribamos por WhatsApp, solo por correo. Si algo de lo que te dije no tiene responsable o fecha, pregúntamelo antes de cerrar.',
        },
      ],
    },
    {
      slug: 'canvas',
      nivel: 'basico',
      modulo: 'canvas',
      titulo: 'Canvas',
      descripcion: 'El documento al lado de la conversación: se escribe por estructura y se corrige por secciones.',
      lecciones: [
        {
          slug: 'el-documento-al-lado',
          tipo: 'lectura',
          titulo: 'El documento al lado del chat',
          minutos: 14,
          resumen: 'Un documento vivo en vez de veinte respuestas sueltas que hay que juntar a mano.',
          objetivos: [
            'Abrir un canvas y trabajar un documento por secciones.',
            'Corregir una parte sin dañar el resto.',
            'Sacar el documento a Docs cuando está listo.',
          ],
          bloques: [
            {
              tipo: 'texto',
              texto:
                'En el chat, cada ajuste genera una respuesta nueva y el texto bueno queda repartido entre mensajes. En Canvas el documento vive a un lado y la conversación al otro: pides un cambio y se aplica sobre el mismo documento. Puedes seleccionar un párrafo y pedir el ajuste solo sobre esa parte, o editar a mano como en cualquier editor.',
            },
            {
              tipo: 'lista',
              ordenada: true,
              items: [
                'Empieza por la estructura: pide primero los títulos de las secciones y apruébalos.',
                'Pega los datos reales temprano: cifras, nombres y fechas, antes de pulir la redacción.',
                'Corrige señalando la sección: "solo el alcance", "solo el párrafo del precio".',
                'Cierra con la versión corta: el correo de diez líneas sale del mismo documento.',
              ],
            },
            {
              tipo: 'comparar',
              antes: {
                titulo: 'En el chat',
                texto:
                  'Se pide el texto, se copia a Docs, se corrige allá, se pega de nuevo en el chat para el siguiente ajuste, y al final circulan tres versiones.',
              },
              despues: {
                titulo: 'En Canvas',
                texto:
                  'Un solo documento que se ajusta por secciones y se exporta a Docs cuando está listo. La versión buena es la única que hay.',
              },
            },
            {
              tipo: 'prompt',
              etiqueta: 'Sección',
              texto: 'Solo la sección de alcance: déjala con entregables numerados y sin adjetivos. No toques el resto.',
            },
            {
              tipo: 'nota',
              tono: 'ojo',
              titulo: 'Las cifras se revisan al final',
              texto:
                'Cuando se pide "más corto" o "otro tono", a veces se cuela un cambio en un número o una fecha. Antes de exportar, revisa que las cifras sigan siendo las que pegaste.',
            },
          ],
          chequeo: [
            {
              id: 'q1',
              enunciado: 'El documento en Canvas está bien salvo el párrafo del precio. ¿Qué haces?',
              opciones: [
                {
                  texto: 'Pides el documento completo otra vez con el precio corregido.',
                  explicacion: 'Arriesgas que cambien partes que ya estaban bien.',
                },
                {
                  texto: 'Seleccionas ese párrafo y pides el ajuste solo ahí.',
                  correcta: true,
                  explicacion: 'Correcto. Corregir por secciones es la razón de usar Canvas.',
                },
                {
                  texto: 'Lo copias a Docs y lo arreglas allá.',
                  explicacion: 'Funciona, pero vuelves a tener dos versiones.',
                },
              ],
            },
          ],
        },
        {
          slug: 'practica-instructivo',
          tipo: 'practica',
          titulo: 'Práctica: el instructivo en Canvas',
          minutos: 15,
          resumen: 'El primer pedido de un canvas que tiene que terminar en un instructivo usable.',
          bloques: [
            {
              tipo: 'texto',
              texto:
                'Escribe el pedido con el que abrirías el canvas y el primer ajuste que harías. Te revisamos contra una rúbrica de cinco puntos.',
            },
          ],
          caso: {
            rol: 'Coordinación de bodega',
            tarea: 'Escribir el instructivo de recepción de mercancía',
            situacion:
              'Cada turno recibe la mercancía distinto y hay faltantes que nadie detecta hasta el cierre. El proceso real es: revisar la orden de compra, contar las cajas contra la remisión, abrir al azar una de cada diez, registrar en el sistema y firmar la remisión. Si hay diferencia, no se firma y se llama al coordinador. El instructivo lo van a leer auxiliares nuevos, en el celular.',
          },
          consigna: 'Escribe el pedido para abrir el canvas y el primer ajuste por sección que harías.',
          placeholder: 'Abre un canvas con...',
          rubrica: [
            { id: 'estructura', titulo: 'Estructura primero', pregunta: '¿Pide o propone la estructura del instructivo antes del texto final?' },
            { id: 'datos', titulo: 'Datos reales', pregunta: '¿Incluye los pasos reales del proceso, no una descripción genérica?' },
            { id: 'lector', titulo: 'Lector', pregunta: '¿Dice quién lo va a leer y en qué dispositivo?' },
            { id: 'excepcion', titulo: 'La excepción', pregunta: '¿Incluye qué hacer cuando hay diferencia en la remisión?' },
            { id: 'seccion', titulo: 'Ajuste por sección', pregunta: '¿El ajuste señala una sección concreta en vez de pedir todo de nuevo?' },
          ],
          pistas: [
            'El paso que más importa es el que dice qué hacer cuando algo no cuadra.',
            'Leer en el celular pide frases cortas y pasos numerados.',
          ],
          solucion:
            'Pedido: Abre un canvas con el instructivo de recepción de mercancía para auxiliares de bodega nuevos, que lo van a leer en el celular. Primero muéstrame solo la estructura: objetivo, pasos, qué hacer si hay diferencia y a quién llamar. Los pasos reales son: 1) revisar la orden de compra, 2) contar las cajas contra la remisión, 3) abrir al azar una de cada diez cajas, 4) registrar en el sistema, 5) firmar la remisión. Si hay cualquier diferencia, no se firma y se llama al coordinador de turno. Frases cortas, pasos numerados, sin jerga. No agregues pasos que no te di.\n\nPrimer ajuste: Solo la sección "Qué hacer si hay diferencia": ponla en un recuadro al principio del instructivo, en tres líneas, y agrega que se anota la diferencia en la remisión antes de llamar.',
        },
      ],
    },
    {
      slug: 'imagen',
      nivel: 'basico',
      modulo: 'imagen',
      titulo: 'Imágenes',
      descripcion: 'Ilustraciones, fondos e íconos para el material interno, describiendo la escena y ajustando en vez de regenerar.',
      lecciones: [
        {
          slug: 'describir-la-escena',
          tipo: 'lectura',
          titulo: 'Describir la escena, no el sentimiento',
          minutos: 12,
          resumen: 'Qué se ve, en qué estilo, con qué paleta y en qué formato. Y cuándo no usar una imagen generada.',
          objetivos: [
            'Escribir un pedido de imagen con escena, estilo, paleta y formato.',
            'Ajustar una imagen sin volver a generarla.',
            'Saber qué piezas no se resuelven con una imagen generada.',
          ],
          bloques: [
            {
              tipo: 'comparar',
              antes: {
                titulo: 'El sentimiento',
                texto: 'Una imagen que transmita seguridad y trabajo en equipo.',
              },
              despues: {
                titulo: 'La escena',
                texto:
                  'Dos operarios con casco y chaleco revisando juntos una lista en una bodega ordenada, ilustración plana, paleta azul y gris, formato horizontal, espacio libre a la derecha para un título, sin texto dentro de la imagen.',
              },
            },
            {
              tipo: 'lista',
              items: [
                'Escena: quién aparece, qué hace y dónde.',
                'Estilo: ilustración plana, foto realista, línea simple.',
                'Paleta y formato: los colores de la marca, horizontal o vertical, dónde va el espacio libre.',
                'El texto dentro de la imagen: los modelos actuales ya escriben letreros legibles, pero para una pieza que se publica conviene pedir la imagen sin texto y ponerlo en Slides o en Docs, donde se corrige sin regenerar nada.',
              ],
            },
            {
              tipo: 'nota',
              tono: 'clave',
              titulo: 'Ajusta en vez de regenerar',
              texto:
                'Si la imagen está cerca, pide el cambio sobre ella: "quita la caja del fondo", "más espacio arriba", "menos saturada". Regenerar desde cero cambia todo, incluido lo que ya estaba bien.',
            },
            {
              tipo: 'nota',
              tono: 'ojo',
              titulo: 'Cuándo no',
              texto:
                'Las piezas de marca, las que van a clientes y cualquier imagen que parezca una foto real de la operación pasan por el área de diseño o comunicaciones. Una imagen generada nunca se presenta como una foto de algo que pasó. Toda imagen creada con Gemini lleva una marca de agua invisible y metadatos que la identifican como generada, aunque el sello visible en la esquina se pueda desactivar en los ajustes. Que sea rastreable no reemplaza decirlo.',
            },
          ],
          chequeo: [
            {
              id: 'q1',
              enunciado: 'La imagen de la circular necesita un título y todavía hay que cambiarle la redacción dos veces. ¿Qué es lo más práctico?',
              opciones: [
                {
                  texto: 'Regenerar la imagen con el texto nuevo cada vez.',
                  explicacion: 'Cada regeneración cambia también la escena que ya estaba bien.',
                },
                {
                  texto: 'Pedirla sin texto y poner el letrero después en Slides o Docs.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'Dejar el título fuera de la circular.',
                  explicacion: 'La pieza necesita el mensaje; lo que se evita es tenerlo quemado dentro de la imagen.',
                },
              ],
            },
          ],
        },
        {
          slug: 'practica-circular',
          tipo: 'practica',
          titulo: 'Práctica: la imagen de la circular',
          minutos: 12,
          resumen: 'El pedido de imagen para una circular interna, y el ajuste que harías después.',
          bloques: [
            {
              tipo: 'texto',
              texto: 'Escribe el pedido de la imagen y un ajuste sobre ella. Te revisamos contra una rúbrica de cinco puntos.',
            },
          ],
          caso: {
            rol: 'Comunicaciones internas',
            tarea: 'Ilustrar la circular sobre pausas activas',
            situacion:
              'Mañana sale la circular que recuerda las pausas activas de las 10 a. m. en el centro de contacto. La marca usa azul oscuro y verde claro. La imagen va arriba de la circular, en formato horizontal, y el título se pone encima en la parte izquierda. Diseño está copado con el lanzamiento del trimestre.',
          },
          consigna: 'Escribe el pedido de la imagen y el ajuste que harías si la primera versión sale muy cargada.',
          placeholder: 'Una ilustración de...',
          rubrica: [
            { id: 'escena', titulo: 'Escena', pregunta: '¿Describe quién aparece, qué hace y dónde?' },
            { id: 'estilo', titulo: 'Estilo y paleta', pregunta: '¿Define estilo y usa los colores de la marca?' },
            { id: 'formato', titulo: 'Formato', pregunta: '¿Pide formato horizontal y espacio libre a la izquierda para el título?' },
            { id: 'texto', titulo: 'Sin texto', pregunta: '¿Pide que la imagen no tenga texto dentro?' },
            { id: 'ajuste', titulo: 'Ajuste', pregunta: '¿El ajuste corrige sobre la imagen en vez de pedir una nueva desde cero?' },
          ],
          pistas: [
            '"Pausas activas" es un sentimiento; la escena es alguien estirándose junto a su puesto.',
            'El espacio libre para el título se pide desde el principio, no se arregla después.',
          ],
          solucion:
            'Pedido: Una ilustración plana de tres personas de un centro de contacto, con diademas, de pie junto a sus escritorios haciendo un estiramiento de brazos. Estilo corporativo sobrio, paleta azul oscuro y verde claro con fondo claro, formato horizontal, con el lado izquierdo despejado para poner un título encima. Sin texto, sin logos y sin letreros dentro de la imagen.\n\nAjuste: Sobre esta misma imagen, quita los objetos de los escritorios, deja solo dos personas y amplía el espacio vacío de la izquierda. Mantén los colores.',
        },
      ],
    },
    {
      slug: 'cierre-basico',
      nivel: 'basico',
      titulo: 'Cierre del nivel 1',
      descripcion: 'Un examen que mezcla Live, Canvas e imágenes. Si tu capacitación no incluye alguno, sus preguntas no aparecen.',
      lecciones: [
        {
          slug: 'examen-basico',
          tipo: 'examen',
          titulo: 'Examen del nivel 1',
          minutos: 10,
          resumen: 'Preguntas sobre Live, Canvas e imágenes. Se aprueba con 80%.',
          aprobacion: 80,
          preguntas: [
            {
              id: 'e1',
              modulo: 'live',
              enunciado: '¿En qué situación Live aporta algo que el chat escrito no?',
              opciones: [
                {
                  texto: 'Cuando tienes las manos ocupadas y necesitas mostrar lo que estás viendo.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'Cuando necesitas un informe largo con fuentes.',
                  explicacion: 'Eso es Deep Research.',
                },
                {
                  texto: 'Cuando quieres editar un documento por secciones.',
                  explicacion: 'Eso es Canvas.',
                },
              ],
            },
            {
              id: 'e2',
              modulo: 'live',
              enunciado: 'Live te sugiere rearmar un equipo que se disparó dos veces seguidas. ¿Qué haces?',
              opciones: [
                {
                  texto: 'Lo rearmas: Gemini lo indicó.',
                  explicacion: 'Live orienta, pero no reemplaza el procedimiento de seguridad.',
                },
                {
                  texto: 'Paras y escalas según el procedimiento.',
                  correcta: true,
                  explicacion: 'Correcto. Una falla repetida se escala.',
                },
                {
                  texto: 'Le preguntas otra vez hasta que diga otra cosa.',
                  explicacion: 'Cambiar la respuesta no cambia el riesgo.',
                },
              ],
            },
            {
              id: 'e3',
              modulo: 'live',
              enunciado: '¿Cómo conviene cerrar una conversación de Live al salir de una visita?',
              opciones: [
                {
                  texto: 'Colgando: todo queda en tu memoria.',
                  explicacion: 'A los dos días ya no queda.',
                },
                {
                  texto: 'Pidiendo el resumen con compromisos, responsable y fecha.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'Grabando un audio aparte.',
                  explicacion: 'Un audio largo no es un acta.',
                },
              ],
            },
            {
              id: 'e4',
              modulo: 'canvas',
              enunciado: '¿Cuál es el primer paso recomendado al abrir un canvas para un documento largo?',
              opciones: [
                {
                  texto: 'Pedir el texto final completo.',
                  explicacion: 'Sin estructura aprobada, se corrige mucho más después.',
                },
                {
                  texto: 'Pedir y aprobar la estructura de secciones.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'Elegir la tipografía.',
                  explicacion: 'La forma va al final, cuando el contenido está.',
                },
              ],
            },
            {
              id: 'e5',
              modulo: 'canvas',
              enunciado: 'Pediste "más corto" en Canvas. ¿Qué revisas antes de exportar?',
              opciones: [
                {
                  texto: 'Que las cifras y fechas sigan siendo las que pegaste.',
                  correcta: true,
                  explicacion: 'Correcto. En los ajustes de tono o extensión a veces se cuela un cambio.',
                },
                {
                  texto: 'Nada: si es más corto, cumplió.',
                  explicacion: 'Más corto no garantiza que los datos sigan bien.',
                },
                {
                  texto: 'Solo la ortografía.',
                  explicacion: 'La ortografía importa menos que un precio equivocado.',
                },
              ],
            },
            {
              id: 'e6',
              modulo: 'imagen',
              enunciado: '¿Qué pedido de imagen va a dar un resultado más útil?',
              opciones: [
                {
                  texto: 'Una imagen que transmita compromiso.',
                  explicacion: 'Es un sentimiento: Gemini tiene que adivinar la escena.',
                },
                {
                  texto: 'Dos técnicos revisando un tablero en planta, ilustración plana, paleta azul, horizontal y sin texto.',
                  correcta: true,
                  explicacion: 'Correcto. Escena, estilo, paleta y formato.',
                },
                {
                  texto: 'La mejor imagen posible para la circular.',
                  explicacion: 'No dice nada de lo que se tiene que ver.',
                },
              ],
            },
            {
              id: 'e7',
              modulo: 'imagen',
              enunciado: '¿Qué piezas no se resuelven con una imagen generada?',
              opciones: [
                {
                  texto: 'Un fondo para una lámina interna.',
                  explicacion: 'Ese es justo un buen uso.',
                },
                {
                  texto: 'Las piezas de marca y las que parecen una foto real de la operación.',
                  correcta: true,
                  explicacion: 'Correcto. Esas pasan por diseño o comunicaciones.',
                },
                {
                  texto: 'Los íconos de una presentación interna.',
                  explicacion: 'Los íconos internos son un buen uso.',
                },
              ],
            },
          ],
        },
      ],
    },

    /* ------------------------------------------------------------ nivel 2 */
    {
      slug: 'workspace',
      nivel: 'intermedio',
      modulo: 'workspace',
      titulo: 'Gemini en Workspace',
      descripcion: 'Gmail, Docs, Sheets y Meet: el asistente donde ya está el trabajo, sin copiar y pegar.',
      lecciones: [
        {
          slug: 'gmail-y-meet',
          tipo: 'lectura',
          titulo: 'La bandeja y las reuniones',
          minutos: 15,
          resumen: 'Resumir el hilo, sacar lo que quedaste de hacer y salir de Meet con los compromisos escritos.',
          objetivos: [
            'Resumir un hilo largo en Gmail y extraer tus pendientes.',
            'Redactar una respuesta con el contexto del hilo.',
            'Usar las notas de Meet y revisarlas antes de mandarlas.',
          ],
          bloques: [
            {
              tipo: 'texto',
              texto:
                'En Gmail, Gemini aparece en el panel lateral y sobre el correo abierto. Lo más útil no es "resúmelo": es pedir lo que quedaste de hacer tú y para cuándo. Un resumen se lee y se olvida; una lista de pendientes se cumple.',
            },
            {
              tipo: 'correo',
              titulo: 'El hilo',
              de: 'Camila Rojas, Transportes Andinos',
              para: 'Tú',
              asunto: 'RE: RE: RE: Ajuste de tarifas ruta Cali, octubre',
              cuerpo:
                'Retomando lo del jueves: aceptamos mantener la tarifa de septiembre si nos confirman el volumen mínimo de 30 viajes. Necesitamos esa confirmación y la póliza actualizada antes del 3 de octubre, o aplicamos la tarifa nueva desde el 5. Quedo atenta.',
              adjuntos: ['Tarifas_octubre.pdf'],
            },
            {
              tipo: 'chat',
              titulo: 'En el panel de Gmail',
              pregunta: 'Resume este hilo en cinco puntos y dime qué quedé de hacer yo y para cuándo.',
              respuesta:
                'Pendientes tuyos: 1) confirmar a Transportes Andinos el volumen mínimo de 30 viajes y 2) enviar la póliza actualizada, ambos antes del 3 de octubre. Si no llegan, la tarifa nueva aplica desde el 5 de octubre.',
            },
            {
              tipo: 'texto',
              texto:
                'En Meet, la función de tomar notas deja un documento en Drive con el resumen, los compromisos y la transcripción, y lo comparte con quien organizó la reunión. Si no pudiste entrar, ese documento es lo primero que abres. La misma función existe para reuniones presenciales desde el celular, y el administrador de la empresa decide si viene activada.',
            },
            {
              tipo: 'nota',
              tono: 'dato',
              titulo: 'Antes de enviar, una tarjeta de confirmación',
              texto:
                'Cuando le pides algo que sale hacia afuera, como enviar un correo o crear una reunión, Gemini muestra primero una tarjeta con lo que va a hacer para que lo revises, edites y confirmes. Esa tarjeta es el momento de leer, no un paso que se salta.',
            },
            {
              tipo: 'nota',
              tono: 'ojo',
              titulo: 'Revisa antes de enviar',
              texto:
                'Un borrador de Gmail o unas notas de Meet pueden atribuir un compromiso a la persona equivocada o cambiar una fecha. Todo lo que sale hacia un cliente o hacia el acta oficial se lee completo antes de enviarlo.',
            },
          ],
          chequeo: [
            {
              id: 'q1',
              enunciado: 'Vuelves de vacaciones con un hilo de 30 correos. ¿Qué pedido te sirve más?',
              opciones: [
                {
                  texto: '"Resúmelo".',
                  explicacion: 'Sirve, pero no te dice qué te toca a ti.',
                },
                {
                  texto: '"Resúmelo y dime qué quedé de hacer yo y para cuándo".',
                  correcta: true,
                  explicacion: 'Correcto. Lo accionable es lo que te toca.',
                },
                {
                  texto: '"Respóndelo todo".',
                  explicacion: 'Responder sin saber qué se acordó es arriesgado.',
                },
              ],
            },
          ],
        },
        {
          slug: 'docs-y-sheets',
          tipo: 'lectura',
          titulo: 'Docs y Sheets sin copiar y pegar',
          minutos: 15,
          resumen: 'Resumir el documento abierto, preguntarle a la hoja en lenguaje normal y verificar los números.',
          objetivos: [
            'Pedir sobre el archivo de Drive en vez de una copia pegada.',
            'Hacerle preguntas a una hoja de cálculo.',
            'Verificar un número antes de llevarlo a un comité.',
          ],
          bloques: [
            {
              tipo: 'texto',
              texto:
                'En Docs, Gemini trabaja sobre el documento abierto y puede usar otros archivos de Drive si los mencionas. Trabajar sobre el archivo y no sobre una copia importa: si alguien actualiza el documento, la siguiente pregunta ya usa la versión nueva.',
            },
            {
              tipo: 'hoja',
              titulo: 'Ventas por sucursal',
              columnas: ['Sucursal', 'Agosto', 'Septiembre', 'Variación'],
              filas: [
                ['Norte', '48.200.000', '51.300.000', '6,4%'],
                ['Centro', '62.900.000', '55.100.000', '-12,4%'],
                ['Sur', '39.400.000', '38.800.000', '-1,5%'],
                ['Occidente', '27.600.000', '21.900.000', '-20,7%'],
              ],
              formula: { celda: 'D3', texto: '=(C3-B3)/B3' },
              resaltar: [1, 3],
            },
            {
              tipo: 'chat',
              titulo: 'En el panel de Sheets',
              pregunta: '¿Qué sucursales cayeron más de 10% contra agosto y cuánto?',
              respuesta: 'Dos sucursales: Occidente cayó 20,7% y Centro 12,4%. Las demás están por encima de -2%.',
            },
            {
              tipo: 'nota',
              tono: 'dato',
              titulo: 'Más allá de Drive',
              texto:
                'El panel lateral funciona igual en Gmail, Drive, Docs, Sheets, Slides y Chat, y puede armar una presentación completa tomando el contenido de un documento y el formato de un mazo anterior. Además, la empresa puede conectar herramientas de terceros, como el CRM o el gestor de tareas, para consultarlas sin cambiar de pestaña. Qué conectores están activos lo decide el administrador.',
            },
            {
              tipo: 'nota',
              tono: 'clave',
              titulo: 'Verifica los números de Sheets',
              texto:
                'Antes de llevar una cifra a un comité, pídele la fórmula o el rango que usó y compruébala en la hoja. Si la respuesta no coincide con lo que ves en las celdas, manda la hoja.',
            },
          ],
          chequeo: [
            {
              id: 'q1',
              enunciado: 'Gemini te da una variación en Sheets que va a una presentación. ¿Qué haces antes?',
              opciones: [
                {
                  texto: 'La copias tal cual.',
                  explicacion: 'Un número que va a un comité se verifica.',
                },
                {
                  texto: 'Le pides la fórmula o el rango y lo compruebas en la hoja.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'Le preguntas dos veces para ver si da lo mismo.',
                  explicacion: 'Que se repita no demuestra que esté bien calculado.',
                },
              ],
            },
          ],
        },
        {
          slug: 'practica-ponerse-al-dia',
          tipo: 'practica',
          titulo: 'Práctica: ponerse al día',
          minutos: 15,
          resumen: 'Los pedidos para recuperar tres días de correos y dos reuniones en una mañana.',
          bloques: [
            {
              tipo: 'texto',
              texto:
                'Escribe los pedidos que harías en Gmail y con las notas de Meet, en el orden en que los harías. Te revisamos contra una rúbrica de cinco puntos.',
            },
          ],
          caso: {
            rol: 'Coordinación de proyectos',
            tarea: 'Ponerse al día después de tres días de viaje',
            situacion:
              'Vuelves de tres días de viaje con 180 correos sin leer y dos reuniones del proyecto Bodega Funza a las que no pudiste entrar. Ambas tuvieron notas de Meet activadas. El comité del proyecto es mañana a las 8 a. m. y tienes que llevar el estado y tus pendientes. Tu jefe, Carlos Pineda, te escribió dos veces.',
          },
          consigna: 'Escribe los pedidos a Gemini, en orden, para ponerte al día antes del comité.',
          placeholder: '1. En Gmail: ...',
          rubrica: [
            { id: 'priorizar', titulo: 'Priorizar', pregunta: '¿Empieza por separar lo urgente o lo del proyecto en vez de resumir todo?' },
            { id: 'pendientes', titulo: 'Pendientes propios', pregunta: '¿Pide explícitamente lo que le toca a la persona y para cuándo?' },
            { id: 'reuniones', titulo: 'Reuniones', pregunta: '¿Usa las notas de Meet para sacar decisiones y compromisos?' },
            { id: 'jefe', titulo: 'El jefe', pregunta: '¿Atiende los correos de Carlos Pineda de forma específica?' },
            { id: 'verificacion', titulo: 'Verificación', pregunta: '¿Incluye revisar el resultado antes de llevarlo al comité o responder?' },
          ],
          pistas: [
            'No todo lo de 180 correos importa hoy: el comité de mañana define el orden.',
            'Las notas de Meet se leen, pero los compromisos se confirman con quien estuvo.',
          ],
          solucion:
            '1. En Gmail: "De los correos de los últimos tres días, muéstrame solo los del proyecto Bodega Funza y los de Carlos Pineda, del más reciente al más antiguo." 2. Sobre los dos correos de Carlos: "Resume qué me pide y para cuándo, y redacta una respuesta corta confirmando que lo tengo para el comité." La leo y ajusto antes de enviarla. 3. Con las notas de Meet de las dos reuniones: "Dame las decisiones tomadas y los compromisos con responsable y fecha. Marca cuáles son míos." 4. En los hilos del proyecto: "¿Qué quedó pendiente de mi parte y para cuándo?" 5. Armo una lista única de pendientes para el comité y confirmo con quien asistió a las reuniones los dos compromisos que me asignaron, antes de presentarlos. El resto de la bandeja lo reviso después del comité.',
        },
      ],
    },
    {
      slug: 'notebooklm',
      nivel: 'intermedio',
      modulo: 'notebook',
      titulo: 'NotebookLM',
      descripcion: 'Un cuaderno por tema con tus propias fuentes, y respuestas que traen la cita del documento.',
      lecciones: [
        {
          slug: 'un-cuaderno-por-tema',
          tipo: 'lectura',
          titulo: 'Un cuaderno por tema',
          minutos: 14,
          resumen: 'Qué fuentes cargar, cuáles no, y por qué la cita es lo más importante de la respuesta.',
          objetivos: [
            'Armar un cuaderno con fuentes vigentes y de un solo tema.',
            'Preguntar como a un colega y abrir la cita.',
            'Reconocer cuándo las fuentes no cubren la pregunta.',
          ],
          bloques: [
            {
              tipo: 'texto',
              texto:
                'NotebookLM solo responde con lo que hay en las fuentes que cargaste: documentos de Drive, PDF, páginas web, textos pegados. Cada afirmación trae un número que, al abrirlo, muestra el fragmento exacto del que salió. Es la herramienta para manuales, actas, contratos y expedientes, donde lo que importa es poder verificar.',
            },
            {
              tipo: 'lista',
              items: [
                'Un cuaderno por tema: "garantías y devoluciones", no "todo lo del área".',
                'Solo versiones vigentes: si cargas el manual viejo y el nuevo sin decirlo, la respuesta puede mezclarlos.',
                'Pregunta como a un colega: "¿qué hago si el cliente devuelve sin factura?".',
                'Abre siempre la cita antes de usar la respuesta con un cliente.',
              ],
            },
            {
              tipo: 'chat',
              titulo: 'Con la cita',
              pregunta: '¿Cuántos días tiene el cliente para devolver un producto con defecto de fábrica?',
              respuesta:
                'Treinta días calendario desde la entrega, siempre que presente la factura [1]. Si el defecto aparece después, aplica la garantía del fabricante [2].\n[1] Política de devoluciones 2026, numeral 4.2\n[2] Manual de garantías, página 7',
            },
            {
              tipo: 'nota',
              tono: 'clave',
              titulo: 'Cuando no está en las fuentes',
              texto:
                'Si NotebookLM dice que las fuentes no mencionan algo, eso también es información: es un vacío de la documentación. Pedirle la lista de preguntas frecuentes que los documentos no responden es una forma rápida de saber qué falta escribir.',
            },
            {
              tipo: 'nota',
              tono: 'dato',
              titulo: 'Más allá de preguntar',
              texto:
                'Desde el mismo cuaderno se generan otras salidas con las mismas fuentes: resúmenes en audio y en video para escuchar o mostrar, mapas de ideas, líneas de tiempo, tablas de datos, un mazo de diapositivas y material de estudio como cuestionarios y fichas. El texto se exporta a Docs y las tablas a Sheets.',
            },
          ],
          chequeo: [
            {
              id: 'q1',
              enunciado: 'Un cuaderno tiene el manual de 2023 y el de 2026. ¿Qué riesgo hay?',
              opciones: [
                {
                  texto: 'Ninguno, NotebookLM siempre usa el más nuevo.',
                  explicacion: 'No sabe cuál está vigente si no se lo dices.',
                },
                {
                  texto: 'Que la respuesta mezcle reglas de las dos versiones.',
                  correcta: true,
                  explicacion: 'Correcto. Carga solo lo vigente o dile explícitamente cuál manda.',
                },
                {
                  texto: 'Que el cuaderno no funcione.',
                  explicacion: 'Funciona, el problema es la respuesta.',
                },
              ],
            },
          ],
        },
        {
          slug: 'practica-cuaderno-induccion',
          tipo: 'practica',
          titulo: 'Práctica: el cuaderno de inducción',
          minutos: 15,
          resumen: 'Qué fuentes cargar y qué preguntarle al cuaderno para poner al día a alguien nuevo.',
          bloques: [
            {
              tipo: 'texto',
              texto:
                'Escribe cómo armarías el cuaderno y las tres primeras preguntas que le harías. Te revisamos contra una rúbrica de cinco puntos.',
            },
          ],
          caso: {
            rol: 'Jefatura técnica',
            tarea: 'Preparar la inducción de una técnica nueva',
            situacion:
              'Mañana entra Paula Vargas al área técnica. El conocimiento está en once manuales de equipos (tres están desactualizados), cuatro años de actas de comité técnico y una hoja con las fallas más frecuentes. La última inducción tomó un mes y la persona preguntaba lo mismo varias veces porque nadie encontraba dónde estaba escrito.',
          },
          consigna: 'Describe qué fuentes cargas, cuáles no, y escribe las tres primeras preguntas al cuaderno.',
          placeholder: 'Fuentes: ...\nPreguntas: ...',
          rubrica: [
            { id: 'vigentes', titulo: 'Fuentes vigentes', pregunta: '¿Excluye o marca los tres manuales desactualizados?' },
            { id: 'tema', titulo: 'Un tema', pregunta: '¿El cuaderno está acotado a la inducción técnica y no a todo el área?' },
            { id: 'material', titulo: 'Material de inducción', pregunta: '¿Pide un producto concreto, como una guía o una línea de tiempo?' },
            { id: 'citas', titulo: 'Citas', pregunta: '¿Pide que las respuestas traigan la fuente o dice que las va a verificar?' },
            { id: 'vacios', titulo: 'Vacíos', pregunta: '¿Pregunta qué no está cubierto por los documentos?' },
          ],
          pistas: [
            'Cuatro años de actas son mucho: una línea de tiempo de decisiones las vuelve útiles.',
            'Lo que los documentos no responden es lo que Paula le va a preguntar a alguien.',
          ],
          solucion:
            'Fuentes: los ocho manuales vigentes, las actas del comité técnico y la hoja de fallas frecuentes. Los tres manuales desactualizados no se cargan, para que las respuestas no mezclen procedimientos viejos. Un solo cuaderno, "Inducción área técnica".\n\nPreguntas: 1) "Con estas fuentes, arma una guía de inducción de dos páginas para una técnica que entra mañana: equipos, fallas más comunes y a quién escalar. Cita la fuente de cada punto." 2) "Resume las actas del comité en una línea de tiempo de decisiones que siguen vigentes, con fecha y responsable." 3) "¿Qué preguntas típicas de una persona nueva NO quedan respondidas por estos documentos?" Con la tercera armo la lista de temas que le explico yo en persona.',
        },
      ],
    },
    {
      slug: 'cierre-intermedio',
      nivel: 'intermedio',
      titulo: 'Cierre del nivel 2',
      descripcion: 'Un examen que mezcla Workspace y NotebookLM. Si tu capacitación no incluye alguno, sus preguntas no aparecen.',
      lecciones: [
        {
          slug: 'examen-intermedio',
          tipo: 'examen',
          titulo: 'Examen del nivel 2',
          minutos: 12,
          resumen: 'Preguntas sobre Gmail, Docs, Sheets, Meet y NotebookLM. Se aprueba con 80%.',
          aprobacion: 80,
          preguntas: [
            {
              id: 'e1',
              modulo: 'workspace',
              enunciado: '¿Por qué conviene pedirle a Gemini sobre el archivo de Drive y no sobre una copia pegada?',
              opciones: [
                {
                  texto: 'Porque usa la versión actual del archivo, con los permisos de siempre.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'Porque la copia pegada no se puede leer.',
                  explicacion: 'Se puede leer, pero queda desactualizada en cuanto alguien edita el original.',
                },
                {
                  texto: 'No hay diferencia.',
                  explicacion: 'Sí la hay: la copia no se actualiza.',
                },
              ],
            },
            {
              id: 'e2',
              modulo: 'workspace',
              enunciado: 'Gemini redactó en Gmail la respuesta a un cliente. ¿Qué haces antes de enviarla?',
              opciones: [
                {
                  texto: 'Enviarla: tiene el contexto del hilo.',
                  explicacion: 'Puede cambiar una fecha o prometer algo que no se acordó.',
                },
                {
                  texto: 'Leerla completa y confirmar fechas, cifras y compromisos.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'Pedirle que la revise ella misma.',
                  explicacion: 'La revisión final es tuya.',
                },
              ],
            },
            {
              id: 'e3',
              modulo: 'workspace',
              enunciado: 'No pudiste entrar a una reunión que tuvo notas de Meet. ¿Qué es lo primero?',
              opciones: [
                {
                  texto: 'Pedirle a alguien que te cuente.',
                  explicacion: 'Sirve para confirmar, pero el documento de notas ya tiene el resumen.',
                },
                {
                  texto: 'Abrir el documento de notas y buscar decisiones y compromisos.',
                  correcta: true,
                  explicacion: 'Correcto. Después confirmas lo que te asignaron.',
                },
                {
                  texto: 'Esperar a la siguiente reunión.',
                  explicacion: 'Llegas sin saber lo que te toca.',
                },
              ],
            },
            {
              id: 'e4',
              modulo: 'workspace',
              enunciado: 'Gemini dice que la sucursal Centro cayó 12,4%. ¿Cómo lo verificas?',
              opciones: [
                {
                  texto: 'Pidiendo la fórmula o el rango y comprobándolo en la hoja.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'Preguntando lo mismo en otro chat.',
                  explicacion: 'Otra respuesta no es una verificación.',
                },
                {
                  texto: 'No hace falta: Sheets calcula bien.',
                  explicacion: 'Sheets sí, pero la respuesta de Gemini puede tomar un rango equivocado.',
                },
              ],
            },
            {
              id: 'e5',
              modulo: 'notebook',
              enunciado: '¿Qué hace distinta una respuesta de NotebookLM?',
              opciones: [
                {
                  texto: 'Trae la cita del fragmento exacto del que salió.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'Busca en la web para completar.',
                  explicacion: 'Responde solo con las fuentes del cuaderno.',
                },
                {
                  texto: 'Es más larga.',
                  explicacion: 'La extensión no es lo que la distingue.',
                },
              ],
            },
            {
              id: 'e6',
              modulo: 'notebook',
              enunciado: 'NotebookLM responde que las fuentes no mencionan un procedimiento. ¿Qué significa?',
              opciones: [
                {
                  texto: 'Que falló y hay que preguntar de otra forma hasta que responda.',
                  explicacion: 'Forzar una respuesta no llena el vacío.',
                },
                {
                  texto: 'Que es un vacío de la documentación, y hay que escribirlo o buscar quién lo sabe.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'Que el procedimiento no existe en la empresa.',
                  explicacion: 'Puede existir, solo que no está en esas fuentes.',
                },
              ],
            },
            {
              id: 'e7',
              modulo: 'notebook',
              enunciado: '¿Cuál es la mejor forma de organizar los cuadernos de un área?',
              opciones: [
                {
                  texto: 'Uno solo con todos los documentos.',
                  explicacion: 'Mezcla temas y vuelve las respuestas menos precisas.',
                },
                {
                  texto: 'Uno por tema, con las versiones vigentes.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'Uno por documento.',
                  explicacion: 'Pierdes la ventaja de cruzar varias fuentes del mismo tema.',
                },
              ],
            },
          ],
        },
      ],
    },

    /* ------------------------------------------------------------ nivel 3 */
    {
      slug: 'deep-research',
      nivel: 'avanzado',
      modulo: 'deep',
      titulo: 'Deep Research',
      descripcion: 'Informes de varios minutos con el enlace de cada dato: delimitar el encargo, revisar el plan y verificar las fuentes.',
      lecciones: [
        {
          slug: 'pregunta-o-investigacion',
          tipo: 'lectura',
          titulo: '¿Pregunta o investigación?',
          minutos: 14,
          resumen: 'Cuándo vale la pena esperar varios minutos, y cómo se delimita el encargo.',
          objetivos: [
            'Reconocer cuándo una pregunta necesita Deep Research.',
            'Delimitar el encargo: tema, país, periodo y formato.',
            'Revisar el plan antes de que arranque.',
          ],
          bloques: [
            {
              tipo: 'texto',
              texto:
                'Deep Research no contesta de una. Primero propone un plan de investigación, que puedes ajustar; después se toma varios minutos, revisa decenas de páginas y entrega un informe con el enlace de dónde salió cada dato. Vale la pena cuando la respuesta tiene que sustentarse ante alguien: un comité, un cliente, una decisión de inversión.',
            },
            {
              tipo: 'comparar',
              antes: {
                titulo: 'Encargo abierto',
                texto: 'Investiga el mercado de mensajería.',
              },
              despues: {
                titulo: 'Encargo delimitado',
                texto:
                  'Investiga el mercado de mensajería de última milla en Barranquilla y Cartagena, 2024 a 2026: actores principales, precios públicos por envío urbano, tiempos de entrega que prometen y quejas recurrentes. Informe de máximo dos páginas con una tabla comparativa. Cita la fuente de cada dato y marca los que tengan más de un año.',
              },
            },
            {
              tipo: 'nota',
              tono: 'clave',
              titulo: 'El plan es el punto de control',
              texto:
                'Antes de arrancar, lee el plan. Si va a investigar el país entero cuando solo te importan dos ciudades, o se le olvidó un competidor, se corrige ahí. Corregir después cuesta otra investigación completa.',
            },
            {
              tipo: 'nota',
              tono: 'dato',
              titulo: 'Cuándo no, y qué hacer después',
              texto:
                'Lo que se resuelve en dos líneas, lo que depende de datos internos que no están en la web, o lo que ya está en tus manuales (eso es NotebookLM) no necesita Deep Research. Cuando el informe sí llega, no tiene que quedarse en informe: desde ahí se abre Canvas para convertirlo en el resumen de una página, en la presentación del comité o en material de capacitación.',
            },
          ],
          chequeo: [
            {
              id: 'q1',
              enunciado: 'Deep Research te muestra el plan y falta un competidor clave. ¿Qué haces?',
              opciones: [
                {
                  texto: 'Lo dejas correr y lo agregas después a mano.',
                  explicacion: 'Terminas con un informe incompleto y trabajo manual extra.',
                },
                {
                  texto: 'Editas el plan para incluirlo antes de arrancar.',
                  correcta: true,
                  explicacion: 'Correcto. El plan es el momento de corregir.',
                },
                {
                  texto: 'Cancelas y usas el chat.',
                  explicacion: 'El chat no te da la investigación con fuentes que necesitas.',
                },
              ],
            },
          ],
        },
        {
          slug: 'revisar-las-fuentes',
          tipo: 'lectura',
          titulo: 'Revisar las fuentes, no el texto',
          minutos: 14,
          resumen: 'Un informe que se lee bien no es un informe correcto. Lo que se revisa son los enlaces.',
          objetivos: [
            'Revisar un informe empezando por las fuentes.',
            'Marcar los datos débiles o viejos antes de presentar.',
          ],
          bloques: [
            {
              tipo: 'texto',
              texto:
                'Los informes de Deep Research están bien escritos, y eso es parte del riesgo: un texto fluido da una confianza que el dato no siempre merece. Lo importante del resultado no es el texto, son las fuentes.',
            },
            {
              tipo: 'lista',
              ordenada: true,
              items: [
                'Abre las fuentes de las cifras que van a decidir algo. Comprueba que el número está ahí.',
                'Mira la fecha de cada fuente. Un precio de hace dos años no es un precio.',
                'Desconfía de las fuentes que se citan a sí mismas: blogs sin autor, notas de prensa de la propia empresa.',
                'Marca lo que hay que confirmar por otra vía antes de presentarlo.',
              ],
            },
            {
              tipo: 'prompt',
              etiqueta: 'Verificación',
              texto:
                'De este informe, dime qué afirmaciones tienen fuente débil, de más de un año o de la misma empresa que se analiza, y cuáles hay que confirmar antes de presentarlas en el comité.',
            },
            {
              tipo: 'nota',
              tono: 'ojo',
              titulo: 'Sin fuente, no se usa',
              texto:
                'Un dato sin enlace o con un enlace que no dice lo que el informe afirma no se usa en una decisión. Se quita, o se presenta como "por confirmar".',
            },
          ],
          chequeo: [
            {
              id: 'q1',
              enunciado: 'El informe dice que un competidor cobra 8.500 por envío. ¿Qué revisas primero?',
              opciones: [
                {
                  texto: 'Que el párrafo esté bien redactado.',
                  explicacion: 'La redacción no dice si el dato es cierto.',
                },
                {
                  texto: 'Que la fuente enlazada diga ese precio y sea reciente.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'Nada, si está en el informe es porque lo verificó.',
                  explicacion: 'Deep Research encuentra fuentes; la verificación es tuya.',
                },
              ],
            },
          ],
        },
        {
          slug: 'practica-encargo-deep',
          tipo: 'practica',
          titulo: 'Práctica: el encargo de investigación',
          minutos: 15,
          resumen: 'Un encargo a Deep Research que llega al comité con fuentes que se pueden defender.',
          bloques: [
            {
              tipo: 'texto',
              texto: 'Escribe el encargo completo y cómo revisarías el resultado. Te revisamos contra una rúbrica de cinco puntos.',
            },
          ],
          caso: {
            rol: 'Planeación comercial',
            tarea: 'Preparar el análisis de entrada a una ciudad nueva',
            situacion:
              'La dirección quiere saber si vale la pena abrir una sede de servicio técnico de aires acondicionados en Montería, y lo pide para el comité del viernes. Interesa quiénes compiten hoy, qué precios públicos manejan por mantenimiento, cómo es la demanda por el clima y si hay alguna exigencia de habilitación para operar. El informe no puede pasar de dos páginas.',
          },
          consigna: 'Escribe el encargo para Deep Research y cómo revisarías el informe antes del comité.',
          placeholder: 'Investiga...',
          rubrica: [
            { id: 'alcance', titulo: 'Alcance', pregunta: '¿Delimita ciudad, servicio y periodo?' },
            { id: 'preguntas', titulo: 'Qué investigar', pregunta: '¿Incluye competencia, precios, demanda y requisitos para operar?' },
            { id: 'formato', titulo: 'Formato', pregunta: '¿Pide un formato concreto de máximo dos páginas?' },
            { id: 'fuentes', titulo: 'Fuentes', pregunta: '¿Exige la fuente de cada dato y marcar los datos viejos?' },
            { id: 'revision', titulo: 'Revisión', pregunta: '¿Dice cómo revisará el plan o las fuentes antes de presentar?' },
          ],
          pistas: [
            'La pregunta de fondo del comité es "sí o no": pide que el informe termine con eso.',
            'Los requisitos de habilitación cambian: pide la norma y desde cuándo aplica.',
          ],
          solucion:
            'Encargo: Investiga el mercado de mantenimiento de aires acondicionados residenciales y comerciales en Montería, con datos de 2024 a 2026. Quiero: 1) empresas que prestan el servicio hoy, con cobertura y canales; 2) precios públicos de mantenimiento preventivo, si existen; 3) indicadores de demanda asociados al clima y al crecimiento de vivienda; 4) requisitos o habilitaciones exigidos para operar, con la norma y desde cuándo aplica. Máximo dos páginas: una tabla de competidores, un párrafo por punto y una conclusión de tres líneas con los argumentos a favor y en contra de entrar. Cita la fuente de cada dato y marca los que tengan más de un año.\n\nRevisión: leo el plan antes de arrancar y confirmo que se limita a Montería. Al recibir el informe abro las fuentes de los precios y de la norma, descarto lo que no esté en el enlace o sea viejo, y le pido que marque las afirmaciones débiles. Lo que no se pueda confirmar va al comité como "por confirmar".',
        },
      ],
    },
    {
      slug: 'veo',
      nivel: 'avanzado',
      modulo: 'veo',
      titulo: 'Video con Veo',
      descripcion: 'Clips cortos para capacitación y pantallas internas: primero el guion, después el video.',
      lecciones: [
        {
          slug: 'del-guion-al-clip',
          tipo: 'lectura',
          titulo: 'Del guion al clip',
          minutos: 14,
          resumen: 'Un video bueno empieza por un guion de pocos segundos y una descripción de plano, movimiento y luz.',
          objetivos: [
            'Escribir el guion antes de generar.',
            'Describir un clip con plano, movimiento, luz y sonido.',
            'Revisar un video antes de publicarlo.',
          ],
          bloques: [
            {
              tipo: 'texto',
              texto:
                'Veo genera clips cortos a partir de una descripción, con sonido incluido. Cada clip dura pocos segundos, del orden de cuatro a ocho, así que una pieza más larga se arma encadenando clips: o se extiende la escena desde el final del anterior, o se generan varios del mismo estilo y se montan. Sirve para lo que hoy no alcanza el presupuesto de producción: un recordatorio de seguridad, un clip de apoyo en una capacitación, una idea de campaña para mostrarla antes de grabarla de verdad.',
            },
            {
              tipo: 'lista',
              ordenada: true,
              items: [
                'Primero el guion: qué se ve, qué se escucha y cuál es el mensaje final, en 15 segundos o menos.',
                'Describe el plano: cercano, medio o general.',
                'Describe el movimiento: cámara fija, paneo lento, acercamiento.',
                'Describe la luz y el sonido: luz natural, ambiente de bodega, sin música.',
                'Genera varios clips cortos del mismo estilo y móntalos en un editor.',
              ],
            },
            {
              tipo: 'prompt',
              etiqueta: 'Clip',
              texto:
                'Video de 8 segundos: plano cercano de unas manos con guantes asegurando una correa sobre cajas en un estibador, bodega ordenada, luz natural, cámara fija, sonido ambiente suave, sin texto.',
            },
            {
              tipo: 'nota',
              tono: 'ojo',
              titulo: 'Revisa manos, caras y textos',
              texto:
                'Los errores típicos están en los dedos, en las caras de fondo y en cualquier letrero. Mira el clip completo, cuadro a cuadro si hace falta, antes de publicarlo. Y un clip generado nunca se presenta como grabación real de la operación.',
            },
            {
              tipo: 'nota',
              tono: 'dato',
              titulo: 'Marcado como generado',
              texto:
                'Los videos que produce Veo llevan una marca de agua invisible y metadatos que los identifican como generados con IA, aunque el sello visible se pueda desactivar en los ajustes. Eso no reemplaza avisarlo: si el clip va a público externo, se dice. Desde el mismo Gemini puedes preguntarle por una imagen o un video si lo generó un modelo de Google.',
            },
          ],
          chequeo: [
            {
              id: 'q1',
              enunciado: 'Necesitas un video de 30 segundos para la capacitación. ¿Cómo lo abordas?',
              opciones: [
                {
                  texto: 'Pides un solo video de 30 segundos con todo.',
                  explicacion: 'Veo trabaja en clips cortos; una pieza larga se arma montando varios.',
                },
                {
                  texto: 'Escribes el guion, generas clips cortos del mismo estilo y los montas.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'Pides "un video de seguridad" y ves qué sale.',
                  explicacion: 'Sin guion ni descripción de plano, el resultado es impredecible.',
                },
              ],
            },
          ],
        },
        {
          slug: 'practica-guion-veo',
          tipo: 'practica',
          titulo: 'Práctica: el recordatorio en video',
          minutos: 15,
          resumen: 'El guion y los pedidos de clip para un recordatorio de seguridad de 15 segundos.',
          bloques: [
            {
              tipo: 'texto',
              texto: 'Escribe el guion y la descripción de los clips. Te revisamos contra una rúbrica de cinco puntos.',
            },
          ],
          caso: {
            rol: 'Seguridad y salud en el trabajo',
            tarea: 'Hacer un recordatorio en video para las pantallas de la planta',
            situacion:
              'Hubo dos incidentes este mes por levantar cajas pesadas sin doblar las rodillas. Quieres un video de 15 segundos para las pantallas del comedor, que se ven sin sonido. No hay presupuesto de producción este trimestre. El mensaje es: "Dobla las rodillas, no la espalda".',
          },
          consigna: 'Escribe el guion y los pedidos de clip para Veo, y qué revisarías antes de publicarlo.',
          placeholder: 'Guion: ...\nClip 1: ...',
          rubrica: [
            { id: 'guion', titulo: 'Guion', pregunta: '¿Hay un guion de 15 segundos con qué se ve y el mensaje final?' },
            { id: 'sinsonido', titulo: 'Sin sonido', pregunta: '¿Tiene en cuenta que se ve sin sonido?' },
            { id: 'clips', titulo: 'Clips descritos', pregunta: '¿Describe plano, movimiento y luz en al menos un clip?' },
            { id: 'texto', titulo: 'Texto aparte', pregunta: '¿Deja el mensaje escrito para el montaje en vez de pedirlo dentro del video?' },
            { id: 'revision', titulo: 'Revisión', pregunta: '¿Dice qué revisará antes de publicar?' },
          ],
          pistas: [
            'Sin sonido, el mensaje tiene que ir escrito, y los letreros generados salen mal.',
            'Dos clips cortos (lo que no se hace y lo que sí) cuentan la historia mejor que uno largo.',
          ],
          solucion:
            'Guion (15 s, sin sonido): 0 a 6 s, una persona se inclina con la espalda doblada para levantar una caja y se lleva la mano a la cintura. 6 a 12 s, la misma escena bien hecha: rodillas dobladas, espalda recta, la caja pegada al cuerpo. 12 a 15 s, cierre con el mensaje "Dobla las rodillas, no la espalda" puesto en el montaje.\n\nClip 1: Video de 6 segundos, plano medio de un operario con chaleco en una bodega ordenada inclinándose con la espalda curva para levantar una caja, se lleva la mano a la parte baja de la espalda. Luz natural, cámara fija, sin texto.\nClip 2: Video de 6 segundos, mismo escenario y estilo, el operario dobla las rodillas, mantiene la espalda recta y levanta la caja pegada al cuerpo. Cámara fija, sin texto.\n\nEl mensaje y el logo se agregan en el editor. Antes de publicar reviso manos, postura y fondo cuadro a cuadro, y le pido visto bueno al área de comunicaciones.',
        },
      ],
    },
    {
      slug: 'cierre-avanzado',
      nivel: 'avanzado',
      titulo: 'Cierre del nivel 3',
      descripcion: 'Un examen que mezcla Deep Research y Veo. Si tu capacitación no incluye alguno, sus preguntas no aparecen.',
      lecciones: [
        {
          slug: 'examen-avanzado',
          tipo: 'examen',
          titulo: 'Examen del nivel 3',
          minutos: 10,
          resumen: 'Preguntas sobre Deep Research y video con Veo. Se aprueba con 80%.',
          aprobacion: 80,
          preguntas: [
            {
              id: 'e1',
              modulo: 'deep',
              enunciado: '¿Cuándo conviene Deep Research en vez de una pregunta en el chat?',
              opciones: [
                {
                  texto: 'Cuando la respuesta tiene que sustentarse con fuentes ante alguien.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'Siempre, da mejores respuestas.',
                  explicacion: 'Para lo que se resuelve en dos líneas, es esperar de más.',
                },
                {
                  texto: 'Cuando la información está en tus manuales.',
                  explicacion: 'Para tus documentos, NotebookLM.',
                },
              ],
            },
            {
              id: 'e2',
              modulo: 'deep',
              enunciado: '¿En qué momento se corrige el alcance de una investigación?',
              opciones: [
                {
                  texto: 'En el plan, antes de que arranque.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'Cuando entrega el informe.',
                  explicacion: 'Corregir ahí cuesta otra investigación completa.',
                },
                {
                  texto: 'No se puede corregir.',
                  explicacion: 'El plan se puede editar.',
                },
              ],
            },
            {
              id: 'e3',
              modulo: 'deep',
              enunciado: 'Una cifra del informe tiene un enlace que no menciona ese número. ¿Qué haces?',
              opciones: [
                {
                  texto: 'La usas, el informe es confiable en general.',
                  explicacion: 'Cada dato que decide algo se sustenta por sí mismo.',
                },
                {
                  texto: 'La quitas o la presentas como "por confirmar".',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'La redondeas para que no se note.',
                  explicacion: 'Sigue sin sustento.',
                },
              ],
            },
            {
              id: 'e4',
              modulo: 'deep',
              enunciado: '¿Qué es lo más importante de un informe de Deep Research?',
              opciones: [
                {
                  texto: 'Que esté bien redactado.',
                  explicacion: 'Un texto fluido puede tener datos débiles.',
                },
                {
                  texto: 'Las fuentes de cada dato.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'Que sea largo.',
                  explicacion: 'La extensión no lo hace más confiable.',
                },
              ],
            },
            {
              id: 'e5',
              modulo: 'veo',
              enunciado: '¿Qué va primero al hacer un video con Veo?',
              opciones: [
                {
                  texto: 'El guion.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'Generar muchos clips y elegir.',
                  explicacion: 'Sin guion, los clips no cuentan una historia.',
                },
                {
                  texto: 'La música.',
                  explicacion: 'La música no define qué se ve.',
                },
              ],
            },
            {
              id: 'e6',
              modulo: 'veo',
              enunciado: 'El video va a pantallas sin sonido y necesita un mensaje escrito. ¿Cómo lo pones?',
              opciones: [
                {
                  texto: 'Pidiéndole a Veo que lo escriba dentro del video.',
                  explicacion: 'El texto generado dentro de la imagen suele salir con errores.',
                },
                {
                  texto: 'Agregándolo en el montaje.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'No se pone, la imagen basta.',
                  explicacion: 'Sin sonido, el mensaje escrito es el que queda.',
                },
              ],
            },
            {
              id: 'e7',
              modulo: 'veo',
              enunciado: '¿Dónde están los errores típicos de un clip generado?',
              opciones: [
                {
                  texto: 'En las manos, las caras y los textos.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'En el color del cielo.',
                  explicacion: 'No es donde suelen estar los problemas.',
                },
                {
                  texto: 'No tiene errores típicos.',
                  explicacion: 'Sí los tiene, y por eso se revisa antes de publicar.',
                },
              ],
            },
          ],
        },
      ],
    },

    /* ------------------------------------------------------------ nivel 4 */
    {
      slug: 'gems',
      nivel: 'experto',
      modulo: 'gems',
      titulo: 'Gems',
      descripcion: 'Asistentes propios con instrucciones fijas: cómo se escriben, cómo se prueban y cómo se mantienen.',
      lecciones: [
        {
          slug: 'anatomia-del-gem',
          tipo: 'lectura',
          titulo: 'Anatomía de un Gem',
          minutos: 16,
          resumen: 'Propósito, formato, límites y archivos de referencia. Lo que más se olvida son los límites.',
          objetivos: [
            'Escribir las instrucciones de un Gem en cuatro partes.',
            'Elegir los archivos de referencia.',
            'Partir de un prompt que ya funciona.',
          ],
          bloques: [
            {
              tipo: 'texto',
              texto:
                'Un Gem es Gemini con instrucciones fijas y, si quieres, con archivos de referencia. Se configura una vez y quien lo use trabaja con el mismo tono y los mismos límites, en vez de que cada quien improvise su prompt. El mejor punto de partida no es una hoja en blanco: es el prompt que a alguien del área ya le funciona.',
            },
            {
              tipo: 'conceptos',
              items: [
                {
                  termino: 'Propósito',
                  definicion: 'Qué tarea resuelve, para quién y con qué tono. En pocas líneas.',
                },
                {
                  termino: 'Formato',
                  definicion: 'Cómo entrega siempre: extensión, estructura y cierre.',
                },
                {
                  termino: 'Límites',
                  definicion: 'Lo que nunca hace, lo que no promete y a dónde deriva cuando la pregunta se sale de su alcance.',
                },
                {
                  termino: 'Archivos de referencia',
                  definicion: 'Pocos y vigentes: la tarifa actual, la política actual. Si un dato no está ahí, lo dice.',
                },
              ],
            },
            {
              tipo: 'prompt',
              etiqueta: 'Instrucciones',
              texto:
                'Eres el asistente de servicio al cliente de Distribuciones Aurora. Redactas respuestas en español neutro, en máximo 150 palabras. Entregas siempre: una línea con la respuesta, el detalle en tres puntos y una acción concreta al final. Usas el documento "Tarifas vigentes" como única fuente de precios; si un precio no está ahí, dices que no lo tienes. Nunca prometes plazos de entrega ni das asesoría legal o tributaria: en esos casos, ofreces redactar el correo para el área que corresponde. Si falta información para responder, la pides antes.',
            },
            {
              tipo: 'nota',
              tono: 'clave',
              titulo: 'Escribe los límites, no solo la tarea',
              texto:
                'Un Gem sin límites inventa con seguridad. Decir qué no hace y a dónde deriva es lo que evita que prometa un descuento o un plazo que nadie aprobó.',
            },
          ],
          chequeo: [
            {
              id: 'q1',
              enunciado: '¿Qué pasa con un Gem de ventas que no tiene límites escritos?',
              opciones: [
                {
                  texto: 'Responde más rápido.',
                  explicacion: 'No es una cuestión de velocidad.',
                },
                {
                  texto: 'Puede prometer precios o plazos que nadie aprobó.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'Nada, Gemini sabe qué no decir.',
                  explicacion: 'No conoce las reglas de tu empresa si no se las das.',
                },
              ],
            },
          ],
        },
        {
          slug: 'probar-y-mantener',
          tipo: 'lectura',
          titulo: 'Probar y mantener un Gem',
          minutos: 14,
          resumen: 'Los casos difíciles antes de compartirlo, y un dueño que actualiza los archivos.',
          objetivos: [
            'Armar un set de casos de prueba.',
            'Definir quién mantiene el Gem y cuándo se revisa.',
          ],
          bloques: [
            {
              tipo: 'texto',
              texto:
                'Un Gem se prueba con los casos que lo pueden hacer fallar, no con el caso fácil. Antes de compartirlo con el área, pásale las preguntas que están fuera de su alcance, las que piden algo que no está en los archivos y las que intentan sacarle una promesa.',
            },
            {
              tipo: 'lista',
              items: [
                'Un caso normal: debe responder bien y en el formato.',
                'Un precio que no está en la tarifa: debe decir que no lo tiene.',
                'Una pregunta legal: debe derivar.',
                'Un cliente que presiona por una fecha: no debe prometerla.',
              ],
            },
            {
              tipo: 'prompt',
              etiqueta: 'Prueba',
              texto: 'Pon a prueba tus propias instrucciones con estos cuatro casos y muéstrame qué responderías en cada uno. Señala dónde tus instrucciones no son claras.',
            },
            {
              tipo: 'nota',
              tono: 'ojo',
              titulo: 'Los archivos envejecen',
              texto:
                'Un Gem con la tarifa del año pasado responde con precios viejos sin avisar. Todo Gem compartido necesita un dueño que reemplace los archivos cuando cambian y que vuelva a correr los casos de prueba.',
            },
            {
              tipo: 'nota',
              tono: 'dato',
              titulo: 'Compartirlo',
              texto:
                'Un Gem se puede compartir con otras personas de la organización, igual que un archivo de Drive. Quien lo recibe lo usa con las mismas instrucciones; los cambios los hace quien tiene permiso de edición.',
            },
          ],
          chequeo: [
            {
              id: 'q1',
              enunciado: '¿Con qué casos se prueba un Gem antes de compartirlo?',
              opciones: [
                {
                  texto: 'Con el caso más común, para ver que funciona.',
                  explicacion: 'El caso fácil casi siempre sale bien; no dice nada de los riesgos.',
                },
                {
                  texto: 'Con los que lo pueden hacer fallar: fuera de alcance, datos que no tiene y presión por promesas.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'No hace falta probarlo si las instrucciones están bien escritas.',
                  explicacion: 'Las pruebas son las que muestran si están bien escritas.',
                },
              ],
            },
          ],
        },
        {
          slug: 'practica-gem',
          tipo: 'practica',
          titulo: 'Práctica: el Gem del área',
          minutos: 25,
          resumen: 'Las instrucciones completas de un Gem de respuestas a proveedores, con sus casos de prueba.',
          bloques: [
            {
              tipo: 'texto',
              texto: 'Escribe las instrucciones del Gem y los casos con los que lo probarías. Te revisamos contra una rúbrica de cinco puntos.',
            },
          ],
          caso: {
            rol: 'Compras',
            tarea: 'Armar un Gem para responder consultas de proveedores',
            situacion:
              'Compras recibe cada semana unas 25 consultas de proveedores: estado de pagos, requisitos para inscribirse y fechas de radicación de facturas. Cuatro personas responden y cada una lo hace distinto. Existe un documento con el calendario de pagos y otro con los requisitos de inscripción. Las disputas por facturas rechazadas y cualquier negociación de precios las atiende la jefa de compras, Diana Ortiz.',
          },
          consigna: 'Escribe las instrucciones completas del Gem y al menos tres casos de prueba.',
          placeholder: 'Propósito: ...\nFormato: ...\nLímites: ...\nArchivos: ...\nPruebas: ...',
          rubrica: [
            { id: 'proposito', titulo: 'Propósito y tono', pregunta: '¿Define qué resuelve el Gem, para quién y con qué tono?' },
            { id: 'formato', titulo: 'Formato', pregunta: '¿Define una estructura y una extensión para las respuestas?' },
            { id: 'fuentes', titulo: 'Archivos', pregunta: '¿Acota los datos al calendario de pagos y al documento de requisitos?' },
            { id: 'limites', titulo: 'Límites', pregunta: '¿Excluye disputas y negociaciones de precio y dice a quién derivarlas?' },
            { id: 'pruebas', titulo: 'Casos de prueba', pregunta: '¿Propone al menos tres casos, incluido uno que el Gem debe derivar?' },
          ],
          pistas: [
            'Un Gem que dice "eso lo ve Diana Ortiz, te ayudo con el correo" es mejor que uno que negocia.',
            'Si un proveedor pregunta por una fecha que no está en el calendario, ¿qué debe pasar?',
          ],
          solucion:
            'Propósito: redactar respuestas a consultas de proveedores sobre estado de pagos, requisitos de inscripción y fechas de radicación de facturas, para que Compras responda igual sin importar quién conteste. Tono cordial y formal, español neutro.\nFormato: máximo 120 palabras; primera línea con la respuesta directa, luego el detalle en viñetas y al final el siguiente paso para el proveedor.\nArchivos: solo el calendario de pagos y el documento de requisitos de inscripción. Si una fecha o un requisito no aparece ahí, dilo y ofrece confirmar con el área; no lo deduzcas.\nLímites: nunca respondas sobre facturas rechazadas ni negocies precios o condiciones; en esos casos, redacta un mensaje amable que indique que lo atiende Diana Ortiz, jefa de compras. No confirmes pagos puntuales de una factura: el Gem no ve el sistema contable.\nPruebas: 1) "¿Cuándo pagan las facturas radicadas el 12?" debe responder con el calendario. 2) "¿Qué documentos necesito para inscribirme?" debe listar los requisitos. 3) "Me rechazaron la factura 5521, ¿por qué?" debe derivar a Diana Ortiz. 4) "¿Pueden subirnos el precio 5% desde noviembre?" debe derivar sin negociar.',
        },
      ],
    },
    {
      slug: 'sistema-del-equipo',
      nivel: 'experto',
      titulo: 'El sistema de IA del equipo',
      descripcion: 'Medir el impacto, gobernar el uso, y el proyecto final: diseñar el sistema completo de un proceso real.',
      lecciones: [
        {
          slug: 'medir-la-adopcion',
          tipo: 'lectura',
          titulo: 'Medir la adopción, no el uso',
          minutos: 14,
          resumen: 'Cuántas personas abrieron Gemini no dice si algo mejoró.',
          objetivos: [
            'Distinguir una métrica de resultado de una métrica de uso.',
            'Fijar línea base y meta antes de empezar.',
          ],
          bloques: [
            {
              tipo: 'texto',
              texto:
                'Cuántas personas usan Gemini o cuántas conversaciones abrieron son métricas de uso: dicen que algo se prendió, no que algo mejoró. Una métrica de resultado mide lo que cambió de verdad: el tiempo que toma un proceso, la tasa de error, cuántas consultas repetidas ya no llegan a una persona.',
            },
            {
              tipo: 'comparar',
              antes: {
                titulo: 'Métrica de uso',
                texto: 'El Gem de Compras se usó 310 veces en el mes.',
              },
              despues: {
                titulo: 'Métrica de resultado',
                texto:
                  'El tiempo promedio para responder a un proveedor bajó de 2 días a 4 horas, y las respuestas corregidas por la jefa pasaron de 9 a 2 por semana.',
              },
            },
            {
              tipo: 'nota',
              tono: 'clave',
              titulo: 'Línea base y meta',
              texto:
                'Antes de medir el impacto hace falta saber de dónde se parte. Sin línea base, cualquier número posterior es solo un número, no una mejora demostrada. Mídela antes de encender la herramienta, aunque sea a mano con una muestra de dos semanas.',
            },
            {
              tipo: 'nota',
              tono: 'dato',
              titulo: 'Los reportes de uso',
              texto:
                'Los administradores de Workspace tienen reportes de uso de Gemini en la consola. Sirven para saber dónde no está llegando la herramienta, y se cruzan con la métrica de resultado del proceso, no la reemplazan.',
            },
          ],
          chequeo: [
            {
              id: 'q1',
              enunciado: '¿Cuál de estas es una métrica de resultado?',
              opciones: [
                {
                  texto: 'Número de conversaciones abiertas en el mes.',
                  explicacion: 'Dice que se usó, no que algo mejoró.',
                },
                {
                  texto: 'Tiempo promedio de respuesta a un proveedor, antes y después.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'Personas con Gemini habilitado.',
                  explicacion: 'Es adopción inicial, no impacto.',
                },
              ],
            },
          ],
        },
        {
          slug: 'gobierno-y-datos',
          tipo: 'lectura',
          titulo: 'Gobierno: dueños, revisión y datos',
          minutos: 14,
          resumen: 'Quién responde por cada Gem y cada cuaderno, cada cuánto se revisa y qué datos no entran.',
          objetivos: [
            'Definir dueño y revisión para un Gem o un cuaderno compartido.',
            'Aplicar la política de datos de la empresa al uso de Gemini.',
          ],
          bloques: [
            {
              tipo: 'texto',
              texto:
                'Un Gem compartido o un cuaderno de NotebookLM que usa medio equipo es una herramienta del área, no un experimento personal. Necesita, además de que funcione, alguien que responda por ella.',
            },
            {
              tipo: 'lista',
              items: [
                'Dueño: una persona con nombre, no "el equipo".',
                'Revisión: cada cuánto se revisan las respuestas y se actualizan los archivos.',
                'Datos: qué información puede entrar y cuál no, según la política de la empresa.',
                'Retiro: cómo se deja de compartir si empieza a responder mal, y quién avisa al equipo.',
              ],
            },
            {
              tipo: 'nota',
              tono: 'ojo',
              titulo: 'La política de datos manda',
              texto:
                'Todo Gem y todo cuaderno heredan las reglas de la política de uso de IA de la empresa: qué información se puede cargar, qué no sale del entorno corporativo y qué se trabaja siempre con la cuenta de la empresa. Revisarla es parte del gobierno, no un trámite aparte.',
            },
          ],
          chequeo: [
            {
              id: 'q1',
              enunciado: 'El Gem del área empieza a responder con precios viejos. ¿Qué debió existir para corregirlo rápido?',
              opciones: [
                {
                  texto: 'Un dueño que actualiza los archivos y sabe cómo retirarlo mientras tanto.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'Un Gem nuevo para cada mes.',
                  explicacion: 'Multiplica el problema en vez de resolverlo.',
                },
                {
                  texto: 'Nada, cada persona debe revisar los precios por su cuenta.',
                  explicacion: 'Eso anula el propósito de tener un Gem compartido.',
                },
              ],
            },
          ],
        },
        {
          slug: 'examen-experto',
          tipo: 'examen',
          titulo: 'Examen del nivel 4',
          minutos: 10,
          resumen: 'Seis preguntas sobre Gems, métricas y gobierno. Se aprueba con 80%.',
          aprobacion: 80,
          preguntas: [
            {
              id: 'e1',
              modulo: 'gems',
              enunciado: '¿Cuál es el mejor punto de partida para las instrucciones de un Gem?',
              opciones: [
                {
                  texto: 'Un prompt que a alguien del área ya le funciona.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'Una plantilla genérica de internet.',
                  explicacion: 'No conoce las reglas ni el tono del área.',
                },
                {
                  texto: 'Pedirle a Gemini que invente las instrucciones sin contexto.',
                  explicacion: 'Sin contexto, las instrucciones salen genéricas.',
                },
              ],
            },
            {
              id: 'e2',
              modulo: 'gems',
              enunciado: 'El Gem no encuentra un precio en su archivo de tarifas. ¿Qué debe hacer?',
              opciones: [
                {
                  texto: 'Estimarlo con base en precios parecidos.',
                  explicacion: 'Eso es inventar un precio.',
                },
                {
                  texto: 'Decir que no lo tiene.',
                  correcta: true,
                  explicacion: 'Correcto, y así se lo tienen que decir sus instrucciones.',
                },
                {
                  texto: 'Buscarlo en la web.',
                  explicacion: 'La tarifa de la empresa no está en la web.',
                },
              ],
            },
            {
              id: 'e3',
              modulo: 'gems',
              enunciado: '¿Por qué un Gem compartido necesita un dueño?',
              opciones: [
                {
                  texto: 'Para que alguien actualice sus archivos y vuelva a probarlo cuando cambian.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'Porque Gemini lo exige para compartirlo.',
                  explicacion: 'No es un requisito técnico, es de gobierno.',
                },
                {
                  texto: 'No lo necesita.',
                  explicacion: 'Sin dueño, sus archivos envejecen sin que nadie lo note.',
                },
              ],
            },
            {
              id: 'e4',
              enunciado: '¿Qué demuestra mejor que una herramienta de IA mejoró un proceso?',
              opciones: [
                {
                  texto: 'El número de veces que se usó.',
                  explicacion: 'Uso no es lo mismo que impacto.',
                },
                {
                  texto: 'Una métrica de resultado contra su línea base.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'Que nadie se ha quejado.',
                  explicacion: 'La ausencia de quejas no es un dato de impacto.',
                },
              ],
            },
            {
              id: 'e5',
              enunciado: '¿Cuándo se mide la línea base?',
              opciones: [
                {
                  texto: 'Antes de encender la herramienta.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'Seis meses después, para comparar.',
                  explicacion: 'Para entonces ya no se puede reconstruir cómo era antes.',
                },
                {
                  texto: 'No hace falta si la mejora es evidente.',
                  explicacion: 'Sin línea base, "evidente" no se puede demostrar.',
                },
              ],
            },
            {
              id: 'e6',
              enunciado: '¿Qué heredan los Gems y los cuadernos de la política de uso de IA de la empresa?',
              opciones: [
                {
                  texto: 'Qué información se puede cargar y qué no sale del entorno corporativo.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'Nada, cada uno define sus propias reglas.',
                  explicacion: 'La política de la empresa aplica a todos.',
                },
                {
                  texto: 'Solo el idioma de las respuestas.',
                  explicacion: 'La política de datos va mucho más allá.',
                },
              ],
            },
          ],
        },
        {
          slug: 'proyecto-final',
          tipo: 'practica',
          proyecto: true,
          titulo: 'Proyecto final: el sistema de tu equipo',
          minutos: 45,
          resumen: 'Diseña el sistema completo de IA para un proceso real: herramienta, encargo, verificación, métrica y gobierno.',
          bloques: [
            {
              tipo: 'texto',
              texto:
                'Este es el cierre del curso. Elige un proceso real de tu área (o usa el caso de abajo) y entrega el diseño completo. Es largo a propósito: es el documento que llevarías a tu líder para ponerlo en marcha.',
            },
            {
              tipo: 'lista',
              ordenada: true,
              items: [
                'El proceso de hoy y su dolor, con un dato.',
                'La herramienta de Gemini para cada paso (chat, Canvas, Live, Workspace, NotebookLM, Deep Research o un Gem) y por qué esa y no otra.',
                'El prompt o las instrucciones clave, lo que más se repite o lo que más tiempo ahorra.',
                'Cómo se verifica el resultado antes de usarlo.',
                'La métrica, con su línea base y la meta.',
                'El gobierno: dueño, revisión, datos permitidos y cómo se retira.',
              ],
            },
            {
              tipo: 'nota',
              tono: 'dato',
              titulo: 'Sobre la revisión',
              texto:
                'El Gem es opcional: si tu proceso no necesita uno, dilo y explica por qué. El revisor mira las seis partes y que sean coherentes entre sí, no que uses los nombres exactos de cada botón.',
            },
          ],
          caso: {
            rol: 'Tú, en tu área',
            tarea: 'Diseñar el sistema de IA de un proceso del equipo',
            situacion:
              'Si no tienes un proceso propio, usa este: el área de servicio técnico responde cada mes unas 400 consultas de clientes sobre garantías. Hoy cada respuesta toma en promedio 35 minutos, porque el técnico busca en once manuales y en la hoja de garantías vendidas, y el 15% de las respuestas se corrigen después porque citaban una condición vieja. Los casos con posible reembolso los decide la jefa de servicio.',
          },
          consigna: 'Entrega el diseño con las seis partes.',
          placeholder: '1. El proceso de hoy\n...',
          rubrica: [
            {
              id: 'dolor',
              titulo: 'Proceso y dolor',
              pregunta: '¿Describe el proceso actual con al menos un dato concreto del problema?',
            },
            {
              id: 'herramienta',
              titulo: 'Herramienta por paso',
              pregunta: '¿Asigna una herramienta de Gemini a cada paso y justifica por qué esa y no otra?',
            },
            {
              id: 'encargo',
              titulo: 'El prompt clave',
              pregunta: '¿Incluye un prompt o unas instrucciones concretas, no una descripción genérica?',
            },
            {
              id: 'verificacion',
              titulo: 'Verificación',
              pregunta: '¿Explica cómo se revisa el resultado antes de usarlo?',
            },
            {
              id: 'metrica',
              titulo: 'Métrica',
              pregunta: '¿Propone una métrica de resultado con línea base y meta, y no una métrica de uso?',
            },
            {
              id: 'gobierno',
              titulo: 'Gobierno',
              pregunta: '¿Nombra un dueño, una revisión periódica, los datos permitidos y cómo se retira?',
            },
          ],
          pistas: [
            'Empieza por la métrica: si no sabes qué quieres mover, el resto no tiene norte.',
            'No todos los pasos necesitan la misma herramienta: un cuaderno para consultar y un Gem para redactar suele ser más realista que una sola herramienta que hace todo.',
          ],
          solucion:
            '1. PROCESO: el servicio técnico responde unas 400 consultas de garantía al mes; cada una toma 35 minutos en promedio y el 15% se corrige después por citar condiciones viejas.\n\n2. HERRAMIENTA POR PASO: (a) NotebookLM con los manuales vigentes y la política de garantías, para encontrar la condición exacta con su cita; los manuales viejos no se cargan. (b) Un Gem de respuestas de garantía para redactar la respuesta al cliente con el mismo tono y formato. (c) Gmail con Gemini para resumir el hilo del cliente cuando la consulta viene de varios correos. Deep Research no aplica: la respuesta está en documentos propios, no en la web.\n\n3. PROMPT CLAVE (instrucciones del Gem): "Redactas respuestas a clientes sobre garantías. Máximo 120 palabras: primero si aplica o no la garantía, luego la condición con su numeral y al final el siguiente paso. Solo usas la condición que te pegue el técnico desde el cuaderno, con su cita; si no hay cita, no respondes y pides que la busquen. Nunca prometes reembolsos: si el caso lo menciona, redactas el mensaje de que lo revisa la jefa de servicio."\n\n4. VERIFICACIÓN: el técnico abre la cita del cuaderno antes de pegar la condición en el Gem y lee la respuesta completa antes de enviarla. Los casos con reembolso pasan siempre por la jefa de servicio.\n\n5. MÉTRICA: tiempo promedio por respuesta (línea base 35 minutos, meta 15 en un trimestre) y porcentaje de respuestas corregidas (línea base 15%, meta menos de 3%). Se miden con una muestra de 50 respuestas al mes.\n\n6. GOBIERNO: dueña la coordinadora técnica, Natalia Suárez. Revisión mensual de la muestra y actualización del cuaderno cada vez que cambia un manual. Datos: no se cargan datos personales de clientes al cuaderno; solo manuales y políticas. Retiro: si el porcentaje de corregidas supera el 5% dos meses seguidos, se deja de compartir el Gem y se vuelve a la respuesta manual mientras se ajustan las instrucciones.',
        },
      ],
    },
  ],

  /* ========================================================= diagnóstico */
  diagnostico: [
    {
      id: 'd1',
      nivel: 'cero',
      enunciado: 'Tienes un hilo largo abierto en Gmail y quieres el resumen. ¿Dónde se lo pides a Gemini?',
      opciones: [
        { texto: 'En la app de Gemini, pegando los correos.', explicacion: 'Funciona, pero Gemini puede leerlo directo desde Gmail.' },
        { texto: 'En el panel de Gemini dentro de Gmail.', correcta: true, explicacion: 'Correcto.' },
        { texto: 'En NotebookLM.', explicacion: 'NotebookLM es para un conjunto de documentos que se consultan varias veces.' },
        { texto: 'No lo sé.', explicacion: 'Sin problema: el nivel 0 empieza justo aquí.' },
      ],
    },
    {
      id: 'd2',
      nivel: 'cero',
      enunciado: '¿Qué archivos de Drive puede usar Gemini cuando trabajas con la cuenta corporativa?',
      opciones: [
        { texto: 'Todos los de la empresa.', explicacion: 'Gemini no tiene permisos propios.' },
        { texto: 'Los que tu cuenta ya puede abrir.', correcta: true, explicacion: 'Correcto.' },
        { texto: 'Ninguno.', explicacion: 'Sí puede usar los que tú puedes abrir, cuando se lo pides.' },
        { texto: 'No lo sé.', explicacion: 'Lo vemos en el nivel 0.' },
      ],
    },
    {
      id: 'd3',
      nivel: 'basico',
      modulo: 'live',
      enunciado: 'Estás en bodega con las manos ocupadas y necesitas consultar qué significa una alarma del equipo. ¿Qué usas?',
      opciones: [
        { texto: 'El chat escrito.', explicacion: 'Con las manos ocupadas, escribir es lo más lento.' },
        { texto: 'Gemini Live, mostrando el equipo con la cámara.', correcta: true, explicacion: 'Correcto.' },
        { texto: 'Deep Research.', explicacion: 'Deep Research tarda minutos y es para investigaciones con fuentes.' },
        { texto: 'No lo sé.', explicacion: 'Lo vemos en el nivel 1.' },
      ],
    },
    {
      id: 'd4',
      nivel: 'basico',
      modulo: 'canvas',
      enunciado: 'Una propuesta va por la quinta ronda de correcciones en el chat. ¿Qué te conviene?',
      opciones: [
        { texto: 'Seguir en el chat y juntar las partes al final.', explicacion: 'Así circulan varias versiones y se pierde la buena.' },
        { texto: 'Pasarla a Canvas y corregir por secciones.', correcta: true, explicacion: 'Correcto.' },
        { texto: 'Empezar una conversación nueva.', explicacion: 'Pierdes todo lo que ya estaba bien.' },
        { texto: 'No lo sé.', explicacion: 'Lo vemos en el nivel 1.' },
      ],
    },
    {
      id: 'd5',
      nivel: 'intermedio',
      modulo: 'workspace',
      enunciado: 'Gemini en Sheets te da una cifra que va a un comité. ¿Qué haces?',
      opciones: [
        { texto: 'La usas si parece razonable.', explicacion: 'Parecer razonable no es haberla verificado.' },
        { texto: 'Pides la fórmula o el rango y lo compruebas en la hoja.', correcta: true, explicacion: 'Correcto.' },
        { texto: 'Preguntas dos veces a ver si coincide.', explicacion: 'Que coincida no demuestra que esté bien calculada.' },
        { texto: 'No lo sé.', explicacion: 'Lo vemos en el nivel 2.' },
      ],
    },
    {
      id: 'd6',
      nivel: 'intermedio',
      modulo: 'notebook',
      enunciado: 'Necesitas responder a un cliente citando el numeral exacto del manual de garantías. ¿Qué usas?',
      opciones: [
        { texto: 'El chat, preguntándole qué dice el manual.', explicacion: 'Sin el manual como fuente, puede responder algo que suena bien pero no está ahí.' },
        { texto: 'NotebookLM con el manual vigente cargado.', correcta: true, explicacion: 'Correcto.' },
        { texto: 'Deep Research.', explicacion: 'El manual es un documento propio, no está en la web.' },
        { texto: 'No lo sé.', explicacion: 'Lo vemos en el nivel 2.' },
      ],
    },
    {
      id: 'd7',
      nivel: 'avanzado',
      modulo: 'deep',
      enunciado: 'Deep Research te muestra el plan de investigación antes de arrancar. ¿Para qué sirve?',
      opciones: [
        { texto: 'Para corregir el alcance antes de gastar la investigación.', correcta: true, explicacion: 'Correcto.' },
        { texto: 'Es solo informativo, no se puede cambiar.', explicacion: 'El plan se puede editar.' },
        { texto: 'Para elegir el diseño del informe.', explicacion: 'El plan define qué se investiga, no cómo se ve.' },
        { texto: 'No lo sé.', explicacion: 'Lo vemos en el nivel 3.' },
      ],
    },
    {
      id: 'd8',
      nivel: 'avanzado',
      modulo: 'veo',
      enunciado: 'Necesitas un video de 30 segundos con Veo. ¿Cómo lo abordas?',
      opciones: [
        { texto: 'Pides uno solo con todo el contenido.', explicacion: 'Veo trabaja en clips cortos.' },
        { texto: 'Escribes el guion, generas clips cortos y los montas.', correcta: true, explicacion: 'Correcto.' },
        { texto: 'Pides "un buen video" y eliges el mejor de varios.', explicacion: 'Sin guion, los clips no cuentan una historia.' },
        { texto: 'No lo sé.', explicacion: 'Lo vemos en el nivel 3.' },
      ],
    },
    {
      id: 'd9',
      nivel: 'experto',
      modulo: 'gems',
      enunciado: '¿Qué evita que un Gem prometa algo que la empresa no aprobó?',
      opciones: [
        { texto: 'Darle más archivos.', explicacion: 'Más archivos no reemplazan los límites.' },
        { texto: 'Escribir en sus instrucciones qué no hace y a dónde deriva.', correcta: true, explicacion: 'Correcto.' },
        { texto: 'Nada, siempre inventa un poco.', explicacion: 'Con límites claros, reconoce cuándo derivar.' },
        { texto: 'No lo sé.', explicacion: 'Lo vemos en el nivel 4.' },
      ],
    },
    {
      id: 'd10',
      nivel: 'experto',
      enunciado: '¿Qué demuestra mejor que un flujo con IA está funcionando de verdad?',
      opciones: [
        { texto: 'El número de veces que se usó.', explicacion: 'Uso no es lo mismo que impacto.' },
        { texto: 'Una métrica de resultado contra su línea base.', correcta: true, explicacion: 'Correcto.' },
        { texto: 'Que nadie se ha quejado.', explicacion: 'La ausencia de quejas no es un dato de impacto.' },
        { texto: 'No lo sé.', explicacion: 'Lo vemos en el nivel 4.' },
      ],
    },
  ],
};
