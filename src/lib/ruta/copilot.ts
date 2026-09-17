import type { Curso } from './tipos';

// Un color por nivel, tomado de los módulos del portal de Copilot, para que
// el temario se lea de un vistazo como una escalera.
const C = {
  teal: '#0E7490',
  verde: '#137A4C',
  azul: '#0B63CE',
  indigo: '#4338CA',
  magenta: '#A32079',
};

/**
 * Ruta guiada de Microsoft 365 Copilot: de quien nunca abrió el panel a quien
 * diseña el sistema de IA de su equipo. Cada unidad profundiza un módulo del
 * portal y cierra con algo que se hace, no con algo que se lee.
 *
 * Copilot Chat es gratis con la cuenta corporativa; el resto necesita la
 * licencia de Microsoft 365 Copilot. Muchas empresas arrancan solo con el
 * chat, así que los exámenes de cierre mezclan preguntas de varios módulos
 * y se recortan pregunta por pregunta según el alcance: ver `cursoEnAlcance`
 * en `./index.ts`.
 *
 * Una advertencia para quien edite: el avance se guarda contra el `slug` de
 * cada lección. Renombrar uno borra el avance de esa lección para todos.
 */
export const copilotCurso: Curso = {
  platformId: 'copilot',
  titulo: 'Copilot en el trabajo, de cero a experto',
  subtitulo: 'Ruta guiada',
  descripcion:
    'Un recorrido por niveles: primero qué Copilot tienes y qué puede ver, después el chat, la bandeja y las reuniones, luego Word, Excel y PowerPoint, más adelante Researcher, Analyst y Cowork, y al final agentes y el sistema completo del equipo. Lecciones cortas, prácticas revisadas por IA y un examen por nivel.',
  color: C.azul,
  aprendizajes: [
    'Preguntar con las fuentes puestas y saber cuándo la respuesta usa datos de la empresa.',
    'Recuperar el contexto de una bandeja llena y de una reunión sin haber tomado notas.',
    'Pasar de notas a documento, de documento a mazo, y de datos a conclusiones dentro de las apps.',
    'Encargar una investigación a Researcher o una tarea larga a Cowork, y revisar lo que vuelve.',
    'Escribir las instrucciones de un agente con alcance acotado y probarlo antes de publicarlo.',
    'Presentar un plan de adopción de IA con métricas, dueños y presupuesto de créditos.',
  ],
  requisitos: [
    'Una cuenta corporativa de Microsoft 365. Copilot Chat funciona con eso, sin licencia adicional.',
    'Las unidades de Word, Excel, PowerPoint, Teams, Outlook, Cowork y Studio piden la licencia de Microsoft 365 Copilot. Sin ella, esas unidades no se muestran y el curso sigue por lo que sí tengas.',
    'Si ya usas Copilot a diario, haz el diagnóstico y salta a tu nivel.',
  ],
  niveles: [
    {
      key: 'cero',
      titulo: 'Nivel 0 · Fundamentos',
      promesa: 'Sabes qué Copilot tienes, qué puede ver y con qué herramienta resolver cada tarea.',
      color: C.teal,
    },
    {
      key: 'basico',
      titulo: 'Nivel 1 · Básico',
      promesa: 'Le preguntas con fuentes, controlas la bandeja y sales de cada reunión con compromisos.',
      color: C.verde,
    },
    {
      key: 'intermedio',
      titulo: 'Nivel 2 · Intermedio',
      promesa: 'Pasas de notas a documento, de documento a mazo y de datos a conclusiones dentro de las apps.',
      color: C.azul,
    },
    {
      key: 'avanzado',
      titulo: 'Nivel 3 · Avanzado',
      promesa: 'Encargas investigaciones y tareas de horas, y revisas lo que vuelve antes de usarlo.',
      color: C.indigo,
    },
    {
      key: 'experto',
      titulo: 'Nivel 4 · Experto',
      promesa: 'Diseñas un agente y gobiernas la IA del equipo con métricas, dueños y presupuesto.',
      color: C.magenta,
    },
  ],

  /* ============================================================ unidades */
  unidades: [
    /* ------------------------------------------------------------ nivel 0 */
    {
      slug: 'fundamentos',
      nivel: 'cero',
      titulo: 'Copilot sin misterio',
      descripcion:
        'Qué Copilot tienes, qué puede ver, con qué herramienta resolver cada tarea y cómo pedirle bien. Lo mínimo para que lo que viene después tenga dónde apoyarse.',
      lecciones: [
        {
          slug: 'que-es-copilot',
          tipo: 'lectura',
          titulo: 'Qué es Copilot y cómo piensa',
          minutos: 12,
          resumen: 'Copilot no es una cosa: son varias, con distinta licencia y distinto alcance.',
          objetivos: [
            'Distinguir Copilot Chat de Microsoft 365 Copilot.',
            'Reconocer en qué aplicaciones aparece cada uno.',
            'Saber qué licencia necesitas para cada tarea.',
          ],
          bloques: [
            {
              tipo: 'texto',
              texto:
                'Cuando alguien dice "Copilot" puede estar hablando de cosas distintas. Copilot Chat es el asistente que aparece con tu cuenta corporativa, sin licencia adicional: responde apoyado en la web, y si activas el interruptor de datos de trabajo, también en tus archivos, correos y chats. Microsoft 365 Copilot es la licencia completa: pone ese mismo asistente dentro de Word, Excel, PowerPoint, Teams y Outlook, más el modo agente, Cowork, Researcher y Analyst.',
            },
            {
              tipo: 'texto',
              texto:
                'La diferencia no es de marca, es de licencia y de para qué sirve cada uno. Este curso está organizado igual: primero lo que funciona con cualquier cuenta, después lo que pide la licencia completa.',
            },
            {
              tipo: 'conceptos',
              items: [
                {
                  termino: 'Copilot Chat',
                  definicion:
                    'El chat con tu cuenta corporativa. Sin licencia adicional. Responde con la web y, si lo activas, con los datos de trabajo a los que ya tienes acceso.',
                },
                {
                  termino: 'Microsoft 365 Copilot',
                  definicion:
                    'La licencia que pone Copilot dentro de Word, Excel, PowerPoint, Teams y Outlook, más el modo agente, Cowork, Researcher y Analyst.',
                },
                {
                  termino: 'Copilot Studio',
                  definicion:
                    'Donde se construyen agentes propios cuando hay que conectar sistemas o lógica más compleja que lo que resuelve un agente simple.',
                },
              ],
            },
            {
              tipo: 'nota',
              tono: 'clave',
              titulo: 'La idea que te llevas',
              texto:
                'Antes de pedir algo, pregúntate qué Copilot tienes puesto. Si tu empresa solo tiene Copilot Chat, este curso te deja funcionando igual en los niveles que no piden licencia adicional; el resto queda a la vista para cuando la empresa la sume.',
            },
          ],
          chequeo: [
            {
              id: 'q1',
              enunciado: '¿Qué necesitas para usar Copilot dentro de Word?',
              opciones: [
                {
                  texto: 'Solo tu cuenta corporativa, como en Copilot Chat.',
                  explicacion: 'Copilot Chat funciona así, pero dentro de las aplicaciones de Office es distinto.',
                },
                {
                  texto: 'La licencia de Microsoft 365 Copilot asignada a tu cuenta.',
                  correcta: true,
                  explicacion: 'Correcto. Copilot dentro de Word, Excel, PowerPoint, Teams y Outlook pide esa licencia.',
                },
                {
                  texto: 'Nada especial: viene activado en todas las cuentas de Microsoft 365.',
                  explicacion: 'No viene activado por defecto; es una licencia que la empresa asigna.',
                },
              ],
            },
          ],
        },
        {
          slug: 'work-iq-y-permisos',
          tipo: 'lectura',
          titulo: 'Work IQ y tus permisos',
          minutos: 14,
          resumen: 'El interruptor que decide si Copilot mira los datos de la empresa, y por qué nunca ve de más.',
          // Copilot Chat gratis no tiene acceso a los datos de trabajo (ver
          // modelo 'work-model' en el seed de planes): esta lección entera
          // enseña una función que ese plan no habilita.
          planExcluido: ['chat'],
          objetivos: [
            'Explicar qué activa el botón de Work IQ.',
            'Entender por qué Copilot nunca ve más de lo que tú ya puedes abrir.',
            'Saber qué pasa con lo que escribes en el chat.',
          ],
          bloques: [
            {
              tipo: 'texto',
              texto:
                'Antes había dos chats separados: uno apoyado en la web y otro sobre los datos de trabajo. Ahora es un solo chat, y un interruptor arriba a la izquierda, Work IQ, decide si puede usar los archivos, correos y chats de la organización. Viene activado por defecto.',
            },
            {
              tipo: 'chat',
              titulo: 'Con Work IQ apagado',
              pregunta: '¿Qué acordamos con el cliente Alimentos del Valle en la última reunión?',
              respuesta:
                'No tengo acceso a los datos de tu organización en este momento. Activa el acceso a datos de trabajo para que pueda revisar reuniones, correos y archivos relacionados.',
            },
            {
              tipo: 'chat',
              titulo: 'Con Work IQ activado',
              pregunta: '¿Qué acordamos con el cliente Alimentos del Valle en la última reunión?',
              respuesta:
                'En la reunión del 3 de septiembre acordaron mover la fecha de entrega al 20 y mantener el precio original. Fuente: resumen de Teams del 3/9, compartido por Marcela Ruiz.',
            },
            {
              tipo: 'nota',
              tono: 'clave',
              titulo: 'Solo ve lo que tú ves',
              texto:
                'Copilot respeta los permisos de tu cuenta: si no puedes abrir un archivo, Copilot tampoco. Con Work IQ activado no gana acceso nuevo, solo usa el que ya tienes.',
            },
            {
              tipo: 'texto',
              texto:
                'Y lo que escribes no se usa para entrenar modelos públicos: con la licencia de la empresa, los prompts y los archivos se quedan dentro del entorno de la organización. El detalle exacto vive en la política de uso de IA de la empresa, que conviene leer una vez.',
            },
          ],
          chequeo: [
            {
              id: 'q1',
              enunciado: 'Con Work IQ activado, ¿qué archivos puede usar Copilot para responder?',
              opciones: [
                {
                  texto: 'Todos los de la empresa, sin excepción.',
                  explicacion: 'Copilot respeta los permisos de tu cuenta; no gana acceso nuevo.',
                },
                {
                  texto: 'Solo los que tu cuenta ya puede abrir.',
                  correcta: true,
                  explicacion: 'Correcto. Si tú no puedes abrir un archivo, Copilot tampoco.',
                },
                {
                  texto: 'Los que decida un administrador cada vez que preguntas.',
                  explicacion: 'No hay una decisión manual por pregunta: el permiso es el de tu cuenta.',
                },
              ],
            },
          ],
        },
        {
          slug: 'chat-agente-o-cowork',
          tipo: 'lectura',
          titulo: 'Chat, modo agente o Cowork: la herramienta antes que el prompt',
          minutos: 12,
          resumen: 'Tres formas de pedir, según cuánto dura la tarea y cuántas aplicaciones cruza.',
          objetivos: [
            'Elegir entre chat, modo agente y Cowork según la tarea.',
            'Saber cuándo cambiar de modelo dentro del selector.',
          ],
          bloques: [
            {
              tipo: 'texto',
              texto:
                'El error más común no es escribir mal el prompt: es escogerle la herramienta equivocada. Una pregunta suelta va al chat. Un cambio dentro de un archivo abierto va al modo agente. Una tarea que dura horas y cruza varias aplicaciones va a Cowork.',
            },
            {
              tipo: 'lista',
              items: [
                'Chat: responde preguntas y redacta. Rápido, una conversación.',
                'Modo agente (en Word, Excel y PowerPoint): planea los pasos solo y los ejecuta dentro del archivo abierto. Tú revisas el trabajo terminado.',
                'Cowork: encadena varias aplicaciones y entrega el trabajo hecho, no un borrador. Se cobra aparte, por créditos.',
              ],
            },
            {
              tipo: 'nota',
              tono: 'dato',
              titulo: 'El modelo también se escoge',
              texto:
                'En Copilot Chat, Word, Excel, PowerPoint y Cowork hay un selector de modelo, con opciones de OpenAI y de Anthropic (Opus 5 y Sonnet 5, y en Cowork también Fable 5.1) según lo que habilite la empresa. En Cowork, además, se elige el nivel de esfuerzo de razonamiento: más alto es más completo, pero más lento y gasta más créditos. La regla práctica: el modelo rápido para redactar y resumir, el modelo de razonamiento para análisis largos y trabajo de varios pasos.',
            },
            {
              tipo: 'texto',
              texto:
                'No hace falta acertar siempre a la primera. Si empezaste en el chat y la tarea creció, no reescribas todo: ábrela en la aplicación correspondiente y sigue desde ahí.',
            },
          ],
          chequeo: [
            {
              id: 'q1',
              enunciado: 'Necesitas que se revisen 40 contratos de una carpeta y se arme una matriz de vencimientos. ¿Qué usas?',
              opciones: [
                {
                  texto: 'El chat, con una pregunta sobre los contratos.',
                  explicacion: 'El chat responde, pero no procesa 40 archivos y entrega un documento nuevo.',
                },
                {
                  texto: 'El modo agente en Word.',
                  explicacion: 'El modo agente trabaja dentro de un archivo abierto, no sobre una carpeta entera.',
                },
                {
                  texto: 'Cowork.',
                  correcta: true,
                  explicacion: 'Es una tarea larga que cruza varios archivos y entrega un resultado terminado: el caso de Cowork.',
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
          resumen: 'Para quién, para qué, extensión y fuente. Ahí está casi toda la diferencia.',
          objetivos: [
            'Escribir un prompt con destinatario, objetivo y formato.',
            'Corregir sobre lo que ya salió, en vez de empezar de nuevo.',
            'Confirmar todo dato antes de usar una respuesta.',
          ],
          bloques: [
            {
              tipo: 'comparar',
              antes: {
                titulo: 'El pedido vago',
                texto: 'Hazme un correo del retraso del pedido.',
              },
              despues: {
                titulo: 'El pedido completo',
                texto:
                  'Redacta un correo para Marcela Ruiz, jefa de compras de Alimentos del Valle, avisando que el pedido 4471 se atrasa dos semanas por un problema del proveedor de empaques. Tono formal pero cercano, máximo 150 palabras, que arranque con la fecha nueva y cierre proponiendo una llamada esta semana. No inventes compensaciones: eso no está aprobado.',
              },
            },
            {
              tipo: 'texto',
              texto:
                'El primero puede salir bien por suerte. El segundo sale bien porque dice para quién es, qué pasó, qué tono, qué extensión y qué no inventar. Cuatro cosas, no una fórmula rígida: úsalas como lista de chequeo antes de enviar el prompt.',
            },
            {
              tipo: 'nota',
              tono: 'ojo',
              titulo: 'Corrige, no arranques otra vez',
              texto:
                'Si la respuesta casi sirve, pide el ajuste puntual: "más corto", "menos técnico", "agrega la fecha de entrega". Es más rápido y más preciso que reescribir el prompt entero desde cero.',
            },
            {
              tipo: 'nota',
              tono: 'clave',
              titulo: 'Confirma todo dato',
              texto:
                'Precios, cantidades y fechas se revisan contra el sistema antes de mandar cualquier cosa con tu nombre. Copilot redacta bien; no es la fuente de verdad de un número.',
            },
          ],
          chequeo: [
            {
              id: 'q1',
              enunciado: 'Copilot te entrega un correo casi listo, pero muy largo. ¿Qué haces?',
              opciones: [
                {
                  texto: 'Escribes un prompt nuevo desde cero, más detallado.',
                  explicacion: 'Es más lento y puedes perder lo que ya estaba bien.',
                },
                {
                  texto: 'Le pides que lo acorte a la mitad, manteniendo el cierre.',
                  correcta: true,
                  explicacion: 'Corregir sobre lo que ya salió es más rápido y más preciso.',
                },
                {
                  texto: 'Lo envías así, total el contenido es correcto.',
                  explicacion: 'La extensión también es parte de lo que pediste; vale la pena ajustarla.',
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
            rol: 'Asistente comercial',
            tarea: 'Avisar a un cliente que su pedido se atrasa',
            situacion:
              'Tu jefe te dice: "hazme un correo del retraso, avísale al cliente". El pedido 4471 de Alimentos del Valle se atrasa dos semanas por un problema del proveedor de empaques. La contraparte es Marcela Ruiz, jefa de compras, cliente desde hace seis años. Ya pagaron el 50% y todavía no hay compensación aprobada.',
          },
          consigna: 'Escribe el prompt que le darías a Copilot para redactar ese correo.',
          placeholder: 'Redacta un correo para...',
          rubrica: [
            { id: 'destinatario', titulo: 'Destinatario', pregunta: '¿Nombra a quién va dirigido el correo y su rol?' },
            { id: 'objetivo', titulo: 'Objetivo', pregunta: '¿Dice qué pasó y qué se necesita comunicar?' },
            { id: 'contexto', titulo: 'Contexto', pregunta: '¿Incluye el dato relevante: cliente antiguo, ya pagó el 50%?' },
            { id: 'formato', titulo: 'Formato y extensión', pregunta: '¿Pide un tono y una extensión concretos?' },
            { id: 'limites', titulo: 'Límites', pregunta: '¿Dice explícitamente qué no inventar, como una compensación no aprobada?' },
          ],
          pistas: [
            'Piensa en lo que necesitarías saber tú si alguien más te pidiera escribir este correo.',
            'El dato de que aún no hay compensación aprobada evita un error caro.',
          ],
          solucion:
            'Redacta un correo para Marcela Ruiz, jefa de compras de Alimentos del Valle, avisando que el pedido 4471 se atrasa dos semanas por un problema del proveedor de empaques. Contexto: es cliente desde hace seis años, nunca les habíamos incumplido, y ya pagaron el 50%. Quiero: máximo 150 palabras, tono formal pero cercano, que arranque con la fecha nueva y no con la disculpa, y que cierre proponiendo una llamada esta semana. No inventes compensaciones ni descuentos: eso todavía no está aprobado.',
        },
        {
          slug: 'examen-fundamentos',
          tipo: 'examen',
          titulo: 'Examen del nivel 0',
          minutos: 10,
          resumen: 'Seis preguntas sobre licencias, permisos, herramientas y prompts. Se aprueba con 80%.',
          aprobacion: 80,
          preguntas: [
            {
              id: 'e1',
              enunciado: '¿Qué distingue a Copilot Chat de Microsoft 365 Copilot?',
              opciones: [
                {
                  texto: 'Copilot Chat necesita licencia adicional y el otro no.',
                  explicacion: 'Es al revés: Copilot Chat no necesita licencia adicional.',
                },
                {
                  texto: 'Copilot Chat funciona con la cuenta corporativa; Microsoft 365 Copilot es la licencia que lo pone dentro de las apps.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'Son el mismo producto con dos nombres distintos.',
                  explicacion: 'Tienen distinta licencia y distinto alcance.',
                },
              ],
            },
            {
              id: 'e2',
              enunciado: 'Activas Work IQ y le preguntas por un proyecto. ¿Qué archivos puede usar Copilot?',
              opciones: [
                {
                  texto: 'Todos los de la empresa.',
                  explicacion: 'No gana acceso nuevo con el interruptor.',
                },
                {
                  texto: 'Solo los que tu cuenta ya puede abrir.',
                  correcta: true,
                  explicacion: 'Respeta los permisos de tu cuenta, igual con Work IQ activado.',
                },
                {
                  texto: 'Ninguno: Work IQ solo cambia el diseño del chat.',
                  explicacion: 'Work IQ sí habilita el acceso a los datos de trabajo, dentro de tus permisos.',
                },
              ],
            },
            {
              id: 'e3',
              enunciado: 'Necesitas cambiar el orden de tres párrafos dentro de un documento que tienes abierto. ¿Qué usas?',
              opciones: [
                {
                  texto: 'El chat, pegando el texto.',
                  explicacion: 'Funciona, pero el modo agente trabaja directo sobre el archivo abierto.',
                },
                {
                  texto: 'El modo agente.',
                  correcta: true,
                  explicacion: 'Es un cambio dentro de un archivo abierto: el caso del modo agente.',
                },
                {
                  texto: 'Cowork.',
                  explicacion: 'Cowork es para tareas largas que cruzan varias aplicaciones.',
                },
              ],
            },
            {
              id: 'e4',
              enunciado: '¿Qué de esto falta en "hazme un correo del retraso"?',
              opciones: [
                {
                  texto: 'Nada, es suficiente.',
                  explicacion: 'Falta destinatario, contexto, formato y límites.',
                },
                {
                  texto: 'Destinatario, contexto, formato y qué no inventar.',
                  correcta: true,
                  explicacion: 'Correcto: esas cuatro cosas son las que cambian el resultado.',
                },
                {
                  texto: 'Solo el nombre del cliente.',
                  explicacion: 'Falta más que eso: tono, extensión y límites también importan.',
                },
              ],
            },
            {
              id: 'e5',
              enunciado: 'Copilot te da una respuesta casi buena, pero demasiado técnica. ¿Qué es más eficiente?',
              opciones: [
                {
                  texto: 'Pedir "menos técnico" sobre lo que ya salió.',
                  correcta: true,
                  explicacion: 'Corregir sobre lo que ya salió es más rápido y más preciso.',
                },
                {
                  texto: 'Escribir un prompt nuevo, mucho más largo.',
                  explicacion: 'Es más lento y puede perder lo que ya funcionaba.',
                },
                {
                  texto: 'Aceptarla igual.',
                  explicacion: 'El tono también es parte de lo que se pidió.',
                },
              ],
            },
            {
              id: 'e6',
              enunciado: 'Un reporte de Copilot trae una cifra de ventas. ¿Qué haces antes de compartirla?',
              opciones: [
                {
                  texto: 'La compartes: Copilot ya la calculó.',
                  explicacion: 'Los datos que van con tu nombre se confirman contra el sistema.',
                },
                {
                  texto: 'La confirmas contra el sistema antes de compartirla.',
                  correcta: true,
                  explicacion: 'Correcto: lo que sale con tu nombre lo revisas tú.',
                },
                {
                  texto: 'Le pides a Copilot que jure que es correcta.',
                  explicacion: 'Eso no cambia la necesidad de verificar contra la fuente real.',
                },
              ],
            },
          ],
        },
      ],
    },

    /* ------------------------------------------------------------ nivel 1 */
    {
      slug: 'copilot-chat',
      nivel: 'basico',
      modulo: 'chat',
      titulo: 'Copilot Chat',
      descripcion: 'Preguntar con las fuentes puestas, revisar las citas y usar un notebook para los temas que vuelven.',
      lecciones: [
        {
          slug: 'preguntar-con-fuentes',
          tipo: 'lectura',
          titulo: 'Preguntar con las fuentes puestas',
          minutos: 15,
          resumen: 'Apuntar a un archivo o a una persona cambia la respuesta más que cualquier ajuste de estilo.',
          objetivos: [
            'Apuntar una pregunta a una fuente concreta.',
            'Revisar las citas de una respuesta.',
            'Decidir cuándo una pregunta debe usar datos de trabajo.',
          ],
          bloques: [
            {
              tipo: 'texto',
              texto:
                'Una pregunta suelta en el chat responde con lo genérico que encuentre. Apuntarla a una fuente concreta (un archivo, una persona, un proyecto) es lo que la convierte en algo útil para el trabajo real.',
            },
            {
              tipo: 'chat',
              titulo: 'Sin fuente',
              pregunta: '¿Qué acordamos con el cliente?',
              respuesta:
                'No tengo suficiente contexto para identificar de qué cliente o reunión hablas. ¿Puedes darme el nombre del cliente o el proyecto?',
            },
            {
              tipo: 'chat',
              titulo: 'Con fuente',
              pregunta: 'Según los correos con Alimentos del Valle de las últimas dos semanas, ¿qué acordamos sobre el pedido 4471?',
              respuesta:
                'Acordaron mover la entrega al 20 de septiembre manteniendo el precio original. Fuente: correo de Marcela Ruiz del 8/9, asunto "Re: pedido 4471".',
            },
            {
              tipo: 'nota',
              tono: 'clave',
              titulo: 'Revisa la cita, no solo la respuesta',
              texto:
                'La respuesta con fuente trae de dónde salió. Ábrela cuando el resultado importa: la cita puede estar mal interpretada aunque el texto suene seguro.',
            },
          ],
          chequeo: [
            {
              id: 'q1',
              enunciado: '¿Por qué apuntar la pregunta a una fuente concreta mejora la respuesta?',
              opciones: [
                {
                  texto: 'Porque Copilot responde más rápido.',
                  explicacion: 'La velocidad no cambia; lo que cambia es la precisión.',
                },
                {
                  texto: 'Porque acota de dónde saca la información y de dónde puede citar.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'No cambia nada, solo el largo de la respuesta.',
                  explicacion: 'Sí cambia: sin fuente, la respuesta es genérica o pide más contexto.',
                },
              ],
            },
          ],
        },
        {
          slug: 'notebooks-y-modelos',
          tipo: 'lectura',
          titulo: 'Notebooks y cambio de modelo',
          minutos: 12,
          resumen: 'Un cuaderno para los temas que vuelven, y cuándo pasar al modelo de razonamiento.',
          objetivos: [
            'Armar un notebook para un tema recurrente.',
            'Escoger el modelo según el tipo de trabajo.',
          ],
          bloques: [
            {
              tipo: 'texto',
              texto:
                'Cuando un tema vuelve semana tras semana (un cliente, un proyecto, un área) conviene armar un notebook: un cuaderno con las fuentes fijas de ese tema, para no repetir "según los archivos de..." en cada pregunta.',
            },
            {
              tipo: 'prompt',
              etiqueta: 'Al crear un notebook',
              texto: 'Arma un notebook con los correos, actas y archivos del proyecto Facturación Electrónica de los últimos tres meses.',
            },
            {
              tipo: 'nota',
              tono: 'dato',
              titulo: 'Cuándo cambiar de modelo',
              texto:
                'Para redactar y resumir, el modelo rápido basta. Para un análisis largo o un trabajo de varios pasos, cambia al modelo de razonamiento desde el selector, aunque se demore más.',
            },
          ],
          chequeo: [
            {
              id: 'q1',
              enunciado: 'Cada semana preguntas por el mismo proyecto en distintos archivos. ¿Qué te conviene?',
              opciones: [
                {
                  texto: 'Repetir la fuente en cada pregunta.',
                  explicacion: 'Funciona, pero es repetitivo si el tema vuelve seguido.',
                },
                {
                  texto: 'Armar un notebook con las fuentes fijas de ese proyecto.',
                  correcta: true,
                  explicacion: 'Correcto: para los temas que vuelven, el notebook ahorra repetir el contexto.',
                },
                {
                  texto: 'Cambiar de modelo cada vez.',
                  explicacion: 'El modelo no resuelve el problema de repetir la fuente.',
                },
              ],
            },
          ],
        },
        {
          slug: 'practica-pregunta-con-fuente',
          tipo: 'practica',
          titulo: 'Práctica: la pregunta para el comité',
          minutos: 15,
          resumen: 'Escribe la pregunta a Copilot que te deja listo para el comité del lunes.',
          bloques: [
            {
              tipo: 'texto',
              texto:
                'Vas a escribir la pregunta que le harías a Copilot de verdad. No hay respuesta única: te revisamos contra una rúbrica de cinco puntos, y después ves cómo la escribimos nosotros.',
            },
          ],
          caso: {
            rol: 'Jefe de proyecto',
            tarea: 'Llegar al comité del lunes con el estado real de un cliente',
            situacion:
              'Lideras la relación con Alimentos del Valle. El lunes a las 9 hay comité directivo y te dan cinco minutos. Quieren saber qué se acordó en las últimas dos semanas, qué quedó pendiente y qué necesitas que ellos decidan. No tienes tiempo de releer 40 correos.',
          },
          consigna: 'Escribe la pregunta que le harías a Copilot Chat.',
          placeholder: 'Según los correos y reuniones con...',
          rubrica: [
            { id: 'fuente', titulo: 'La fuente', pregunta: '¿Acota la fuente al cliente o proyecto concreto?' },
            { id: 'periodo', titulo: 'El periodo', pregunta: '¿Acota el periodo de tiempo?' },
            { id: 'contenido', titulo: 'Lo que necesita saber', pregunta: '¿Pide acuerdos, pendientes y decisiones, no un resumen general?' },
            { id: 'citas', titulo: 'Las citas', pregunta: '¿Pide la fuente o fecha de cada punto?' },
            { id: 'formato', titulo: 'El formato', pregunta: '¿Dice cómo quiere la respuesta y para quién es?' },
          ],
          pistas: [
            'Piensa en los cinco minutos: ¿cuántos puntos caben?',
            'Un comité no decide sobre algo que no puede verificar.',
          ],
          solucion:
            'Según los correos y reuniones con Alimentos del Valle de las últimas dos semanas, ¿qué se acordó y qué quedó pendiente? Para cada punto dime la fecha y de qué correo o reunión sale. Al final, lista las decisiones que dependen del comité directivo. Entrégalo en máximo ocho viñetas, para leer en cinco minutos.',
        },
      ],
    },
    {
      slug: 'outlook',
      nivel: 'basico',
      modulo: 'outlook',
      titulo: 'Outlook',
      descripcion: 'Resumir antes de leer, preguntarle a la bandeja y responder con el tono de la empresa.',
      lecciones: [
        {
          slug: 'bandeja-bajo-control',
          tipo: 'lectura',
          titulo: 'La bandeja bajo control',
          minutos: 12,
          resumen: 'El correo es donde se va la mañana. Copilot ya no se limita al hilo abierto.',
          objetivos: [
            'Resumir un hilo largo antes de leerlo entero.',
            'Preguntarle a la bandeja completa, no solo a un correo.',
          ],
          bloques: [
            {
              tipo: 'texto',
              texto:
                'Copilot en Outlook ya no se limita al hilo abierto: razona sobre la bandeja y el calendario completos. Eso cambia dos hábitos: primero resumir, después decidir qué leer entero; y preguntar directamente en vez de buscar correo por correo.',
            },
            {
              tipo: 'correo',
              titulo: 'Hilo de 14 correos: "Re: Re: Re: pedido 4471"',
              de: 'Marcela Ruiz <mruiz@alimentosdelvalle.com>',
              para: 'Tú',
              asunto: 'Re: Re: Re: pedido 4471',
              cuerpo:
                'Hola, seguimos sin confirmación de la nueva fecha. Ya van tres semanas de idas y vueltas y necesitamos avisar a nuestro cliente final. ¿Pueden confirmar hoy?',
            },
            {
              tipo: 'prompt',
              etiqueta: 'Antes de abrir el hilo',
              texto: 'Resume este hilo: qué se pidió, qué se respondió y qué sigue sin resolver.',
            },
            {
              tipo: 'nota',
              tono: 'dato',
              titulo: 'Pregúntale a la bandeja, no al correo',
              texto:
                '"¿Qué se espera de mí hoy?" es una pregunta válida sobre toda la bandeja, no solo sobre el correo abierto. Copilot puede cruzar varios hilos y el calendario para responderla.',
            },
          ],
          chequeo: [
            {
              id: 'q1',
              enunciado: 'Llega un hilo de 14 correos sobre un mismo tema. ¿Qué te conviene hacer primero?',
              opciones: [
                {
                  texto: 'Leerlos todos en orden.',
                  explicacion: 'Es la opción más lenta cuando existe un resumen.',
                },
                {
                  texto: 'Pedirle a Copilot que resuma qué se pidió, qué se respondió y qué falta.',
                  correcta: true,
                  explicacion: 'Correcto: resumir antes de leer ahorra tiempo y no pierde la decisión pendiente.',
                },
                {
                  texto: 'Responder sin leer nada.',
                  explicacion: 'Arriesga contestar algo que ya se resolvió o contradecir un acuerdo previo.',
                },
              ],
            },
          ],
        },
        {
          slug: 'responder-bien',
          tipo: 'lectura',
          titulo: 'Responder bien, no solo rápido',
          minutos: 12,
          resumen: 'El tono de la empresa, corregir el pedazo que no sirve, y revisar antes de enviar.',
          objetivos: [
            'Reescribir solo la parte de una respuesta que no funciona.',
            'Revisar una respuesta generada antes de enviarla.',
          ],
          bloques: [
            {
              tipo: 'comparar',
              antes: {
                titulo: 'Respuesta genérica',
                texto: 'Gracias por su mensaje. Estamos trabajando en su solicitud y le responderemos pronto.',
              },
              despues: {
                titulo: 'Respuesta con el pedido de contexto',
                texto: 'Confirmamos la nueva fecha, 20 de septiembre, manteniendo el precio acordado. Le llamamos hoy a las 4pm para revisar el resto del pedido.',
              },
            },
            {
              tipo: 'texto',
              texto:
                'La primera versión no compromete nada y no responde la pregunta real (¿pueden confirmar hoy?). Si Copilot entrega algo así, no se trata de reescribir todo: se pide el ajuste puntual, por ejemplo "agrega la fecha confirmada y una hora de llamada".',
            },
            {
              tipo: 'nota',
              tono: 'ojo',
              titulo: 'Revisa antes de enviar',
              texto:
                'Un correo saliente lleva tu nombre. Confirma fechas y compromisos contra lo que de verdad se acordó antes de mandarlo, aunque la respuesta suene lista.',
            },
          ],
          chequeo: [
            {
              id: 'q1',
              enunciado: 'Copilot redacta una respuesta de correo que suena bien pero no confirma la fecha pedida. ¿Qué haces?',
              opciones: [
                {
                  texto: 'La envías: el tono está bien.',
                  explicacion: 'El tono no es lo único que importa: falta responder lo que se preguntó.',
                },
                {
                  texto: 'Pides que agregue la fecha confirmada, sobre la misma respuesta.',
                  correcta: true,
                  explicacion: 'Correcto: se corrige el pedazo que falta, no se reescribe todo.',
                },
                {
                  texto: 'Escribes el correo entero a mano.',
                  explicacion: 'Es más lento que pedir el ajuste puntual sobre lo que ya salió.',
                },
              ],
            },
          ],
        },
        {
          slug: 'practica-respuesta-dificil',
          tipo: 'practica',
          titulo: 'Práctica: la respuesta al cliente molesto',
          minutos: 15,
          resumen: 'Un hilo de 14 correos y un cliente que exige confirmación hoy.',
          bloques: [
            {
              tipo: 'texto',
              texto: 'Escribe el prompt para pedirle a Copilot la respuesta a este correo. Te revisamos contra una rúbrica de cinco puntos.',
            },
          ],
          caso: {
            rol: 'Encargado de cuenta',
            tarea: 'Responder a un cliente molesto sin prometer de más',
            situacion:
              'El hilo "Re: Re: Re: pedido 4471" lleva 14 correos. El cliente exige confirmación de la nueva fecha hoy. Internamente ya se acordó el 20 de septiembre manteniendo el precio, pero todavía no hay aprobación para ofrecer una compensación por la demora.',
          },
          consigna: 'Escribe el prompt para que Copilot redacte la respuesta.',
          placeholder: 'Resume este hilo y después redacta una respuesta que...',
          rubrica: [
            { id: 'resumen', titulo: 'El resumen', pregunta: '¿Pide resumir el hilo con la decisión pendiente antes de redactar?' },
            { id: 'tono', titulo: 'El tono', pregunta: '¿Pide un tono que reconozca la demora sin sonar evasivo?' },
            { id: 'limites', titulo: 'Límites', pregunta: '¿Dice explícitamente que no ofrezca compensación sin aprobar?' },
            { id: 'siguiente', titulo: 'El siguiente paso', pregunta: '¿Pide un compromiso concreto con fecha, como una llamada?' },
            { id: 'extension', titulo: 'Extensión', pregunta: '¿Pide una extensión razonable para un correo de respuesta?' },
          ],
          pistas: [
            'El cliente no pidió una disculpa larga, pidió una fecha.',
            'Prometer algo no aprobado es peor que no prometer nada.',
          ],
          solucion:
            'Resume el hilo "Re: Re: Re: pedido 4471": qué se pidió, qué se respondió y qué sigue sin resolver. Después redacta la respuesta al último correo confirmando la nueva fecha de entrega, 20 de septiembre, con el precio original. No ofrezcas ninguna compensación: todavía no está aprobada. Cierra proponiendo una llamada hoy a las 4pm para revisar el resto del pedido. Máximo 120 palabras, tono formal pero cercano.',
        },
      ],
    },
    {
      slug: 'teams',
      nivel: 'basico',
      modulo: 'teams',
      titulo: 'Teams',
      descripcion: 'El resumen de la reunión, compromisos con responsable y seguimiento sin estar tomando notas.',
      lecciones: [
        {
          slug: 'la-reunion-con-copilot',
          tipo: 'lectura',
          titulo: 'La reunión con Copilot activado',
          minutos: 14,
          resumen: 'Dejar de escribir y empezar a participar en la reunión.',
          objetivos: [
            'Activar el resumen al empezar una reunión.',
            'Saber cuándo usar el resumen sin guardar.',
            'Preguntar durante la reunión, no solo al final.',
          ],
          bloques: [
            {
              tipo: 'texto',
              texto:
                'Con la transcripción activada desde el inicio de la reunión, dejas de escribir notas y empiezas a participar de verdad. Copilot puede responder preguntas durante la reunión ("¿qué dijo Juan sobre el presupuesto hace diez minutos?") y armar el resumen al final.',
            },
            {
              tipo: 'nota',
              tono: 'ojo',
              titulo: 'Si el tema es sensible',
              texto:
                'Para conversaciones delicadas, hay una opción de resumen sin guardar la transcripción completa. Actívala antes de que arranque el tema, no después.',
            },
            {
              tipo: 'chat',
              titulo: 'Durante la reunión',
              pregunta: '¿Qué dijo Juan sobre el presupuesto hace diez minutos?',
              respuesta:
                'Juan dijo que el presupuesto del trimestre está comprometido en un 80% y que cualquier gasto nuevo necesita aprobación del comité.',
            },
          ],
          chequeo: [
            {
              id: 'q1',
              enunciado: '¿Cuándo conviene activar el resumen sin guardar la transcripción completa?',
              opciones: [
                {
                  texto: 'En todas las reuniones, siempre.',
                  explicacion: 'No es la regla general: depende de qué tan sensible sea el tema.',
                },
                {
                  texto: 'Antes de que empiece un tema sensible.',
                  correcta: true,
                  explicacion: 'Correcto, y conviene activarlo antes de que arranque ese tema, no después.',
                },
                {
                  texto: 'Nunca: siempre es mejor guardar todo.',
                  explicacion: 'Para temas delicados, guardar todo puede no ser lo que la conversación necesita.',
                },
              ],
            },
          ],
        },
        {
          slug: 'compromisos-y-seguimiento',
          tipo: 'lectura',
          titulo: 'Compromisos con responsable, seguimiento antes de colgar',
          minutos: 12,
          resumen: 'Un resumen no sirve si nadie sabe quién quedó con qué tarea.',
          objetivos: [
            'Pedir compromisos con responsable y fecha, no solo un resumen.',
            'Mandar el seguimiento antes de terminar la reunión.',
          ],
          bloques: [
            {
              tipo: 'chat',
              titulo: 'Al cerrar la reunión',
              pregunta: 'Dame los compromisos de esta reunión: quién, qué y para cuándo.',
              respuesta:
                '1) Juan: enviar el presupuesto revisado, viernes. 2) Marcela: confirmar la fecha con el cliente, mañana. 3) Tú: circular el resumen al equipo, hoy.',
            },
            {
              tipo: 'nota',
              tono: 'clave',
              titulo: 'Pide compromisos, no resúmenes',
              texto:
                'Un resumen general de "se habló de X" no mueve nada. Pedir la lista de compromisos con responsable y fecha es lo que convierte la reunión en trabajo que avanza.',
            },
            {
              tipo: 'texto',
              texto:
                'Y mándalo antes de colgar, mientras todos todavía están en la sala: es el momento en que cualquier malentendido sobre quién quedó con qué se corrige en segundos, no en otro hilo de correos.',
            },
          ],
          chequeo: [
            {
              id: 'q1',
              enunciado: '¿Qué diferencia a "resumen de la reunión" de "compromisos de la reunión"?',
              opciones: [
                {
                  texto: 'Nada, son lo mismo.',
                  explicacion: 'El resumen cuenta qué se habló; los compromisos dicen quién hace qué y para cuándo.',
                },
                {
                  texto: 'Los compromisos incluyen responsable y fecha; el resumen no necesariamente.',
                  correcta: true,
                  explicacion: 'Correcto: eso es lo que convierte la reunión en trabajo que avanza.',
                },
                {
                  texto: 'El resumen es más corto siempre.',
                  explicacion: 'La diferencia no es de extensión, es de qué información llevan.',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      slug: 'cierre-basico',
      nivel: 'basico',
      titulo: 'Cierre del nivel 1',
      descripcion: 'El examen del nivel básico, sobre chat, correo y reuniones.',
      lecciones: [
        {
          slug: 'examen-basico',
          tipo: 'examen',
          titulo: 'Examen del nivel 1',
          minutos: 12,
          resumen: 'Preguntas sobre el chat, el correo y las reuniones, según lo que incluya tu capacitación. Se aprueba con 80%.',
          aprobacion: 80,
          preguntas: [
            {
              id: 'e1',
              modulo: 'chat',
              enunciado: '¿Qué cambia al apuntar una pregunta a un archivo o proyecto concreto, en vez de dejarla suelta?',
              opciones: [
                {
                  texto: 'Nada, la respuesta es igual.',
                  explicacion: 'Sí cambia: acota de dónde saca la información y de dónde cita.',
                },
                {
                  texto: 'Acota la fuente y hace la respuesta más precisa.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'Solo cambia el idioma de la respuesta.',
                  explicacion: 'No es una cuestión de idioma, sino de precisión y de citas.',
                },
              ],
            },
            {
              id: 'e2',
              modulo: 'chat',
              enunciado: '¿Cuándo conviene armar un notebook en Copilot Chat?',
              opciones: [
                {
                  texto: 'Para preguntas que solo vas a hacer una vez.',
                  explicacion: 'Para eso basta con apuntar la fuente en el momento.',
                },
                {
                  texto: 'Para un tema que vuelve semana tras semana.',
                  correcta: true,
                  explicacion: 'Correcto: ahorra repetir la fuente en cada pregunta.',
                },
                {
                  texto: 'Solo cuando cambias de modelo.',
                  explicacion: 'El notebook y el modelo son cosas independientes.',
                },
              ],
            },
            {
              id: 'e3',
              modulo: 'chat',
              enunciado: 'Vas a pedir un análisis largo de varios archivos. ¿Qué modelo conviene?',
              opciones: [
                {
                  texto: 'El modelo rápido, siempre.',
                  explicacion: 'El modelo rápido es mejor para redactar y resumir, no para análisis largos.',
                },
                {
                  texto: 'El modelo de razonamiento.',
                  correcta: true,
                  explicacion: 'Correcto, aunque se demore más.',
                },
                {
                  texto: 'Da igual cuál elijas.',
                  explicacion: 'El tipo de trabajo sí orienta qué modelo conviene.',
                },
              ],
            },
            {
              id: 'e4',
              modulo: 'outlook',
              enunciado: 'Llega un hilo de correos largo sobre un tema urgente. ¿Qué haces primero?',
              opciones: [
                {
                  texto: 'Pides un resumen de qué se pidió, qué se respondió y qué falta.',
                  correcta: true,
                  explicacion: 'Correcto: resumir antes de leer todo ahorra tiempo.',
                },
                {
                  texto: 'Respondes de inmediato sin leer nada.',
                  explicacion: 'Arriesga contradecir algo ya acordado.',
                },
                {
                  texto: 'Reenvías el hilo a otra persona.',
                  explicacion: 'No resuelve tu necesidad de entender el estado del hilo.',
                },
              ],
            },
            {
              id: 'e5',
              modulo: 'outlook',
              enunciado: 'Copilot redacta una respuesta de correo que no confirma la fecha pedida por el cliente. ¿Qué es lo más eficiente?',
              opciones: [
                {
                  texto: 'Enviarla igual.',
                  explicacion: 'No responde lo que el cliente preguntó.',
                },
                {
                  texto: 'Pedir que agregue la fecha confirmada, sobre la misma respuesta.',
                  correcta: true,
                  explicacion: 'Correcto: se corrige el pedazo que falta.',
                },
                {
                  texto: 'Escribir el correo entero a mano.',
                  explicacion: 'Es más lento que corregir lo que ya salió.',
                },
              ],
            },
            {
              id: 'e6',
              modulo: 'outlook',
              enunciado: '¿Qué se revisa siempre antes de enviar un correo generado por Copilot?',
              opciones: [
                {
                  texto: 'La ortografía, nada más.',
                  explicacion: 'También hay que confirmar fechas y compromisos.',
                },
                {
                  texto: 'Que las fechas y compromisos correspondan a lo realmente acordado.',
                  correcta: true,
                  explicacion: 'Correcto: el correo sale con tu nombre.',
                },
                {
                  texto: 'Nada: si suena bien, se envía.',
                  explicacion: 'Sonar bien no garantiza que los datos sean correctos.',
                },
              ],
            },
            {
              id: 'e7',
              modulo: 'teams',
              enunciado: '¿Cuándo conviene activar el resumen sin guardar la transcripción completa?',
              opciones: [
                {
                  texto: 'Antes de que arranque un tema sensible.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'Después de haber hablado del tema sensible.',
                  explicacion: 'Para que sirva, se activa antes de que empiece ese tema.',
                },
                {
                  texto: 'Nunca hace falta.',
                  explicacion: 'Para temas delicados sí puede convenir.',
                },
              ],
            },
            {
              id: 'e8',
              modulo: 'teams',
              enunciado: 'Al cerrar una reunión, ¿qué es más útil pedirle a Copilot que un resumen general?',
              opciones: [
                {
                  texto: 'Los compromisos con responsable y fecha.',
                  correcta: true,
                  explicacion: 'Correcto: es lo que convierte la reunión en trabajo que avanza.',
                },
                {
                  texto: 'Una lista de quién habló más tiempo.',
                  explicacion: 'No aporta a que el trabajo avance.',
                },
                {
                  texto: 'Nada más, el resumen general basta.',
                  explicacion: 'El resumen general no dice quién queda con qué tarea.',
                },
              ],
            },
          ],
        },
      ],
    },

    /* ------------------------------------------------------------ nivel 2 */
    {
      slug: 'word',
      nivel: 'intermedio',
      modulo: 'word',
      titulo: 'Word',
      descripcion: 'Del borrador al documento, con el modo agente para los cambios de varios pasos.',
      lecciones: [
        {
          slug: 'del-borrador-al-documento',
          tipo: 'lectura',
          titulo: 'Del borrador al documento',
          minutos: 15,
          resumen: 'Word es el mejor lugar para empezar dentro de Office: uno ve el resultado de una.',
          objetivos: [
            'Abrir Copilot sobre un documento y pedir con destinatario y extensión.',
            'Corregir sobre lo que ya salió.',
          ],
          bloques: [
            {
              tipo: 'texto',
              texto:
                'Con Copilot abierto en Word, el resultado se ve de inmediato en el documento: puedes pedir un primer borrador desde notas sueltas, o transformar un documento que ya existe.',
            },
            {
              tipo: 'prompt',
              etiqueta: 'Primer borrador',
              texto: 'Con estas notas de la reunión, arma una propuesta comercial para el cliente Alimentos del Valle: alcance, cronograma y precio.',
            },
            {
              tipo: 'nota',
              tono: 'clave',
              titulo: 'Confirma precios y fechas',
              texto:
                'El documento sale con tu nombre. Los datos concretos, como precios y fechas, se revisan contra el sistema antes de enviarlo.',
            },
          ],
          chequeo: [
            {
              id: 'q1',
              enunciado: '¿Qué ventaja tiene pedirle a Copilot dentro de Word, en vez de en el chat y pegar el resultado?',
              opciones: [
                {
                  texto: 'Ninguna, es lo mismo.',
                  explicacion: 'Trabajar dentro del documento evita el paso de copiar y pegar, y sigue el formato.',
                },
                {
                  texto: 'El resultado se ve directamente en el documento, con su formato.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'Solo cambia el idioma disponible.',
                  explicacion: 'No es una cuestión de idioma.',
                },
              ],
            },
          ],
        },
        {
          slug: 'modo-agente-en-word',
          tipo: 'lectura',
          titulo: 'El modo agente en Word',
          minutos: 14,
          resumen: 'Cambios de varios pasos, revisados al final, no paso a paso.',
          objetivos: [
            'Usar el modo agente para cambios de varios pasos en un documento.',
            'Revisar el plan y el resultado antes de dar por bueno el trabajo.',
          ],
          bloques: [
            {
              tipo: 'texto',
              texto:
                'El modo agente planea los pasos solo y los ejecuta dentro del archivo: reordenar secciones, aplicar un formato en todo el documento, alinear el tono de principio a fin. Tú revisas el resultado terminado, no cada paso.',
            },
            {
              tipo: 'nota',
              tono: 'dato',
              titulo: 'El modelo por defecto',
              texto:
                'Desde agosto de 2026, el selector de modelos de Word suma las opciones de Anthropic a las de OpenAI. Sonnet 5 quedó por defecto para el trabajo que exige más razonamiento, como reordenar y alinear un documento completo.',
            },
            {
              tipo: 'nota',
              tono: 'ojo',
              titulo: 'Revisa el resultado completo',
              texto:
                'Que el modo agente termine no significa que terminó bien. Revisa el documento entero, no solo la parte que te importaba al pedirlo.',
            },
          ],
          chequeo: [
            {
              id: 'q1',
              enunciado: '¿Cuándo conviene usar el modo agente en Word, en vez de pedir un cambio en el chat?',
              opciones: [
                {
                  texto: 'Para un cambio de varios pasos dentro del documento abierto.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'Para cualquier pregunta, siempre.',
                  explicacion: 'El modo agente es para cambios en el archivo, no para preguntas sueltas.',
                },
                {
                  texto: 'Nunca, el chat siempre es mejor.',
                  explicacion: 'Para varios pasos dentro del archivo, el modo agente es la herramienta indicada.',
                },
              ],
            },
          ],
        },
        {
          slug: 'practica-propuesta',
          tipo: 'practica',
          titulo: 'Práctica: la propuesta desde las notas',
          minutos: 20,
          resumen: 'De notas sueltas de una reunión a una propuesta comercial completa.',
          bloques: [
            {
              tipo: 'texto',
              texto: 'Escribe el prompt para el primer borrador de la propuesta. Te revisamos contra una rúbrica de cinco puntos.',
            },
          ],
          caso: {
            rol: 'Asistente comercial',
            tarea: 'Armar una propuesta comercial desde notas de reunión',
            situacion:
              'Saliste de una reunión con notas sueltas: el cliente Alimentos del Valle pidió una ampliación del contrato de logística, con entrega en dos bodegas nuevas desde octubre, presupuesto estimado entre 8.000 y 10.000 dólares mensuales, y quieren la propuesta antes del viernes.',
          },
          consigna: 'Escribe el prompt para que Copilot arme el primer borrador en Word.',
          placeholder: 'Con estas notas de la reunión, arma una propuesta que...',
          rubrica: [
            { id: 'fuente', titulo: 'La fuente', pregunta: '¿Indica que debe partir de las notas de la reunión, no inventar el contenido?' },
            { id: 'audiencia', titulo: 'Audiencia', pregunta: '¿Dice para quién es la propuesta?' },
            { id: 'estructura', titulo: 'Estructura', pregunta: '¿Pide las secciones concretas: alcance, cronograma, precio?' },
            { id: 'confirmar', titulo: 'Datos a confirmar', pregunta: '¿Marca el rango de presupuesto como algo por confirmar, no como precio cerrado?' },
            { id: 'plazo', titulo: 'El plazo', pregunta: '¿Menciona el plazo del viernes?' },
          ],
          pistas: [
            'El rango de presupuesto no es un precio final: dilo así en el prompt.',
            'Una propuesta sin cronograma no sirve para decidir.',
          ],
          solucion:
            'Con estas notas de la reunión, arma el primer borrador de una propuesta comercial para Alimentos del Valle: ampliación del contrato de logística con entrega en dos bodegas nuevas desde octubre. Incluye alcance, cronograma de implementación y un rango de precio entre 8.000 y 10.000 dólares mensuales, marcado como estimado sujeto a confirmación. Tono formal, para el comité de compras del cliente. La necesito lista para revisar antes del viernes.',
        },
      ],
    },
    {
      slug: 'powerpoint',
      nivel: 'intermedio',
      modulo: 'ppt',
      titulo: 'PowerPoint',
      descripcion: 'Del documento al mazo, con la plantilla de la empresa y las notas del expositor.',
      lecciones: [
        {
          slug: 'del-documento-al-mazo',
          tipo: 'lectura',
          titulo: 'Del documento al mazo',
          minutos: 14,
          resumen: 'PowerPoint transforma, no inventa: dale contenido que ya existe y pídele estructura.',
          objetivos: [
            'Apuntar a la fuente correcta para armar una presentación.',
            'Decidir cuántas diapositivas pedir.',
          ],
          bloques: [
            {
              tipo: 'texto',
              texto:
                'Copilot en PowerPoint funciona mejor cuando parte de algo que ya existe: un documento, una carpeta, un mazo anterior o incluso una reunión de Teams. Dale la fuente correcta y pídele que estructure, no que invente contenido nuevo.',
            },
            {
              tipo: 'prompt',
              etiqueta: 'Desde un documento',
              texto: 'Convierte esta propuesta en una presentación de 8 diapositivas para el comité de compras del cliente.',
            },
            {
              tipo: 'nota',
              tono: 'dato',
              titulo: 'Di cuántas diapositivas quieres',
              texto:
                'Sin un número, el mazo puede salir más largo o más corto de lo que necesitas para el tiempo que tienes en la sala.',
            },
          ],
          chequeo: [
            {
              id: 'q1',
              enunciado: '¿Cuál es la mejor forma de pedir una presentación con Copilot?',
              opciones: [
                {
                  texto: 'Pedirle que invente el contenido desde cero.',
                  explicacion: 'PowerPoint transforma mejor cuando parte de contenido que ya existe.',
                },
                {
                  texto: 'Darle una fuente (documento, mazo anterior, reunión) y pedirle que estructure.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'No importa la fuente, el resultado es igual.',
                  explicacion: 'La fuente sí determina la calidad del resultado.',
                },
              ],
            },
          ],
        },
        {
          slug: 'marca-y-notas',
          tipo: 'lectura',
          titulo: 'La plantilla de la empresa y las notas del expositor',
          minutos: 12,
          resumen: 'Aplicar el kit de marca, arreglar el orden a mano y pedir las notas del expositor.',
          objetivos: [
            'Aplicar la plantilla de la empresa a un mazo generado.',
            'Pedir notas del expositor para cada diapositiva.',
          ],
          bloques: [
            {
              tipo: 'texto',
              texto:
                'Un mazo recién generado no siempre respeta el kit de marca de la empresa: pídeselo explícitamente, o aplícalo después con la plantilla guardada. El orden de las diapositivas, si no quedó como esperabas, se arregla a mano: es más rápido que reescribir el prompt.',
            },
            {
              tipo: 'prompt',
              etiqueta: 'Para presentar en vivo',
              texto: 'Agrega notas del expositor a cada diapositiva, con los puntos clave que no están escritos en la diapositiva.',
            },
          ],
          chequeo: [
            {
              id: 'q1',
              enunciado: 'El orden de las diapositivas no quedó como esperabas. ¿Qué es más rápido?',
              opciones: [
                {
                  texto: 'Reescribir el prompt entero.',
                  explicacion: 'Es más lento que un ajuste directo sobre el resultado.',
                },
                {
                  texto: 'Arreglar el orden a mano.',
                  correcta: true,
                  explicacion: 'Correcto: un ajuste puntual es más rápido que regenerar todo.',
                },
                {
                  texto: 'Empezar de nuevo desde el documento fuente.',
                  explicacion: 'No hace falta perder lo que ya está bien en el resto del mazo.',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      slug: 'excel',
      nivel: 'intermedio',
      modulo: 'excel',
      titulo: 'Excel',
      descripcion: 'Preguntarle a la hoja, pedir la fórmula y no solo el resultado, y usar el modo agente sin perder el control.',
      lecciones: [
        {
          slug: 'preguntarle-a-la-hoja',
          tipo: 'lectura',
          titulo: 'Preguntarle a la hoja',
          minutos: 16,
          resumen: 'Convertir el rango en tabla, preguntar antes de calcular, y revisar dos filas a mano.',
          objetivos: [
            'Convertir un rango en tabla antes de trabajar con Copilot.',
            'Explorar los datos con preguntas antes de pedir un cálculo.',
          ],
          bloques: [
            {
              tipo: 'texto',
              texto:
                'Copilot trabaja mejor sobre una tabla con encabezados que sobre un rango suelto. Antes de pedir cálculos, conviene preguntar y explorar: qué hay, qué se ve raro, qué falta.',
            },
            {
              tipo: 'hoja',
              titulo: 'Ventas por sucursal, agosto 2026',
              columnas: ['Sucursal', 'Producto', 'Unidades', 'Ingreso'],
              filas: [
                ['Centro', 'Línea A', '412', '18.540'],
                ['Norte', 'Línea A', '388', '17.460'],
                ['Sur', 'Línea A', '61', '2.745'],
                ['Centro', 'Línea B', '210', '9.450'],
              ],
              resaltar: [2],
            },
            {
              tipo: 'prompt',
              etiqueta: 'Antes de calcular',
              texto: '¿Qué sucursal se ve distinta al resto en la Línea A, y por qué podría ser?',
            },
            {
              tipo: 'nota',
              tono: 'ojo',
              titulo: 'Revisa dos filas a mano',
              texto:
                'Antes de confiar en un cálculo sobre toda la tabla, verifica dos o tres filas contra lo que ya sabes. Es la forma más rápida de detectar un error de interpretación.',
            },
          ],
          chequeo: [
            {
              id: 'q1',
              enunciado: 'Antes de pedirle a Copilot un cálculo sobre una hoja nueva, ¿qué conviene hacer?',
              opciones: [
                {
                  texto: 'Pedir el cálculo directamente.',
                  explicacion: 'Explorar primero ayuda a detectar datos raros antes de calcular sobre ellos.',
                },
                {
                  texto: 'Convertir el rango en tabla y preguntar qué hay, antes de calcular.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'Borrar las filas que se ven raras.',
                  explicacion: 'Borrar sin entender por qué es raro puede perder información real.',
                },
              ],
            },
          ],
        },
        {
          slug: 'formulas-y-modo-agente',
          tipo: 'lectura',
          titulo: 'La fórmula, no solo el resultado',
          minutos: 16,
          resumen: 'Pedir la fórmula, dejar las reglas del archivo escritas, y usar Python para el análisis pesado.',
          objetivos: [
            'Pedir la fórmula en vez de solo el número.',
            'Dejar las reglas de un archivo compartido escritas para todo el equipo.',
          ],
          bloques: [
            {
              tipo: 'hoja',
              titulo: 'Con la fórmula a la vista',
              columnas: ['Sucursal', 'Ingreso', 'Meta', '% cumplimiento'],
              filas: [
                ['Centro', '27.990', '25.000', '112%'],
                ['Norte', '17.460', '20.000', '87%'],
                ['Sur', '2.745', '15.000', '18%'],
              ],
              formula: { celda: 'D2', texto: '=B2/C2' },
              resaltar: [2],
            },
            {
              tipo: 'nota',
              tono: 'clave',
              titulo: 'Pide la fórmula, no solo el resultado',
              texto:
                'Un número sin fórmula no se puede auditar ni reutilizar en otra fila. Pedir la fórmula deja el archivo funcionando para quien lo abra después.',
            },
            {
              tipo: 'codigo',
              titulo: 'Para el análisis pesado',
              codigo: 'df.groupby("sucursal")["ingreso"].sum().sort_values(ascending=False)',
              explicacion: 'Cuando el cruce es grande o repetitivo, pedirlo con Python (el modo de análisis de datos) es más confiable que encadenar fórmulas.',
            },
            {
              tipo: 'nota',
              tono: 'dato',
              titulo: 'Deja las reglas del archivo escritas',
              texto:
                'Si varias personas van a trabajar el mismo archivo, pide un resumen de las reglas usadas (qué cuenta como "cumplimiento", qué excluye la meta) en una pestaña aparte. Evita que cada quien lo interprete distinto.',
            },
          ],
          chequeo: [
            {
              id: 'q1',
              enunciado: '¿Por qué pedir la fórmula en vez de solo el resultado?',
              opciones: [
                {
                  texto: 'Porque el resultado nunca es correcto.',
                  explicacion: 'El resultado puede ser correcto; el problema es que no se puede auditar sin la fórmula.',
                },
                {
                  texto: 'Porque la fórmula se puede auditar y reutilizar en otras filas.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'No hay diferencia práctica.',
                  explicacion: 'Sí la hay: un archivo con solo resultados no queda funcionando para el resto del equipo.',
                },
              ],
            },
          ],
        },
        {
          slug: 'practica-informe-ventas',
          tipo: 'practica',
          titulo: 'Práctica: el informe de ventas',
          minutos: 20,
          resumen: 'Una sucursal no cuadra con el resto. Arma el prompt para investigarla y reportar.',
          bloques: [
            {
              tipo: 'texto',
              texto: 'Escribe el prompt para explorar el archivo y armar el reporte. Te revisamos contra una rúbrica de cinco puntos.',
            },
          ],
          caso: {
            rol: 'Analista comercial',
            tarea: 'Explicar por qué una sucursal está muy por debajo de su meta',
            situacion:
              'Tienes una tabla de ventas por sucursal con columnas de sucursal, producto, unidades e ingreso. La sucursal Sur está muy por debajo de su meta (18% de cumplimiento) mientras Centro y Norte están cerca del 100%. El gerente regional quiere una explicación mañana en la mañana.',
          },
          consigna: 'Escribe el prompt para explorar el archivo y armar el reporte.',
          placeholder: 'Primero, compara Sur contra...',
          rubrica: [
            { id: 'tabla', titulo: 'La tabla', pregunta: '¿Menciona trabajar sobre la tabla con sus columnas nombradas?' },
            { id: 'exploracion', titulo: 'Exploración primero', pregunta: '¿Pide comparar o explorar antes de pedir una conclusión?' },
            { id: 'formula', titulo: 'La fórmula', pregunta: '¿Pide ver la fórmula o el cálculo usado, no solo el número?' },
            { id: 'verificacion', titulo: 'Verificación', pregunta: '¿Pide revisar manualmente algún dato antes de dar el hallazgo por bueno?' },
            { id: 'salida', titulo: 'La salida', pregunta: '¿Pide un formato apto para el gerente regional, por ejemplo unas viñetas?' },
          ],
          pistas: [
            'Compara Sur contra las otras sucursales, no la mires sola.',
            'Un hallazgo sin verificar es una hipótesis, no un reporte.',
          ],
          solucion:
            'Con la tabla de ventas por sucursal, producto, unidades e ingreso, compara el cumplimiento de meta de Sur contra Centro y Norte. Muéstrame la fórmula del cálculo de cumplimiento y qué producto o factor explica la diferencia. Antes de darlo por bueno, señálame dos filas de Sur para que yo las revise a mano. Entrégame el hallazgo en tres viñetas, listas para el gerente regional mañana.',
        },
      ],
    },
    {
      slug: 'cierre-intermedio',
      nivel: 'intermedio',
      titulo: 'Cierre del nivel 2',
      descripcion: 'El examen del nivel intermedio, sobre Word, PowerPoint y Excel.',
      lecciones: [
        {
          slug: 'examen-intermedio',
          tipo: 'examen',
          titulo: 'Examen del nivel 2',
          minutos: 15,
          resumen: 'Preguntas sobre Word, PowerPoint y Excel, según lo que incluya tu capacitación. Se aprueba con 80%.',
          aprobacion: 80,
          preguntas: [
            {
              id: 'e1',
              modulo: 'word',
              enunciado: '¿Qué ventaja tiene trabajar con Copilot dentro de Word, en vez de pegar el resultado del chat?',
              opciones: [
                {
                  texto: 'El resultado se ve directo en el documento, con su formato.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'No hay ninguna diferencia.',
                  explicacion: 'Sí la hay: evita el paso de copiar y pegar, y respeta el formato.',
                },
                {
                  texto: 'Solo cambia la velocidad de respuesta.',
                  explicacion: 'La diferencia principal es de flujo de trabajo, no de velocidad.',
                },
              ],
            },
            {
              id: 'e2',
              modulo: 'word',
              enunciado: '¿Para qué sirve el modo agente en Word?',
              opciones: [
                {
                  texto: 'Para responder preguntas generales.',
                  explicacion: 'Eso lo resuelve el chat.',
                },
                {
                  texto: 'Para cambios de varios pasos dentro del documento abierto.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'Para traducir el documento, únicamente.',
                  explicacion: 'El modo agente no se limita a traducir.',
                },
              ],
            },
            {
              id: 'e3',
              modulo: 'word',
              enunciado: 'El modo agente termina un cambio de varios pasos. ¿Qué haces?',
              opciones: [
                {
                  texto: 'Das por bueno el resultado sin revisar.',
                  explicacion: 'Que termine no significa que quedó bien.',
                },
                {
                  texto: 'Revisas el documento completo, no solo la parte que pediste.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'Le pides que empiece de nuevo, siempre.',
                  explicacion: 'No hace falta si el resultado, al revisarlo, está bien.',
                },
              ],
            },
            {
              id: 'e4',
              modulo: 'ppt',
              enunciado: '¿Cuál es la mejor forma de armar una presentación con Copilot?',
              opciones: [
                {
                  texto: 'Pedirle que invente el contenido desde cero.',
                  explicacion: 'PowerPoint transforma mejor cuando parte de contenido existente.',
                },
                {
                  texto: 'Darle una fuente (documento, mazo, reunión) y pedirle estructura.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'No especificar cuántas diapositivas.',
                  explicacion: 'Decir cuántas diapositivas evita un mazo demasiado largo o corto.',
                },
              ],
            },
            {
              id: 'e5',
              modulo: 'ppt',
              enunciado: 'El orden de las diapositivas no quedó como esperabas. ¿Qué es más rápido?',
              opciones: [
                {
                  texto: 'Arreglar el orden a mano.',
                  correcta: true,
                  explicacion: 'Correcto: más rápido que regenerar todo el mazo.',
                },
                {
                  texto: 'Reescribir el prompt entero.',
                  explicacion: 'Es más lento que el ajuste directo.',
                },
                {
                  texto: 'Empezar de cero desde el documento fuente.',
                  explicacion: 'No hace falta perder lo que ya está bien.',
                },
              ],
            },
            {
              id: 'e6',
              modulo: 'excel',
              enunciado: 'Antes de pedirle un cálculo a Copilot sobre una hoja nueva, ¿qué conviene hacer?',
              opciones: [
                {
                  texto: 'Convertir el rango en tabla y explorar antes de calcular.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'Pedir el cálculo directo, sin explorar.',
                  explicacion: 'Explorar primero ayuda a detectar datos raros.',
                },
                {
                  texto: 'Borrar las filas que se ven raras.',
                  explicacion: 'Puede perder información real sin entender la causa.',
                },
              ],
            },
            {
              id: 'e7',
              modulo: 'excel',
              enunciado: '¿Por qué pedir la fórmula y no solo el número?',
              opciones: [
                {
                  texto: 'Porque el número siempre está mal.',
                  explicacion: 'El número puede estar bien; el problema es que no se puede auditar sin la fórmula.',
                },
                {
                  texto: 'Porque la fórmula se puede auditar y reutilizar.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'No hay diferencia.',
                  explicacion: 'Sí la hay para que el archivo quede funcionando para el resto del equipo.',
                },
              ],
            },
            {
              id: 'e8',
              modulo: 'excel',
              enunciado: '¿Cuándo conviene pedir el análisis con Python en vez de encadenar fórmulas?',
              opciones: [
                {
                  texto: 'Cuando el cruce de datos es grande o repetitivo.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'Siempre, en cualquier hoja.',
                  explicacion: 'Para cálculos simples, una fórmula directa suele bastar.',
                },
                {
                  texto: 'Nunca, Excel no admite Python.',
                  explicacion: 'Sí lo admite, para el análisis pesado.',
                },
              ],
            },
            {
              id: 'e9',
              enunciado: 'Un hallazgo sobre una hoja de datos, antes de reportarlo, se debería...',
              opciones: [
                {
                  texto: 'Reportar directo, si suena razonable.',
                  explicacion: 'Sonar razonable no reemplaza la verificación.',
                },
                {
                  texto: 'Verificar con una o dos filas a mano.',
                  correcta: true,
                  explicacion: 'Correcto: es la forma más rápida de detectar un error de interpretación.',
                },
                {
                  texto: 'Ignorar si viene de una IA.',
                  explicacion: 'El origen no es lo que determina si verificar o no; siempre conviene verificar.',
                },
              ],
            },
          ],
        },
      ],
    },

    /* ------------------------------------------------------------ nivel 3 */
    {
      slug: 'researcher-analyst',
      nivel: 'avanzado',
      modulo: 'researcher-analyst',
      titulo: 'Researcher y Analyst',
      descripcion: 'Cuándo vale una investigación sustentada, y cómo revisar un análisis con el código a la vista.',
      lecciones: [
        {
          slug: 'pregunta-o-investigacion',
          tipo: 'lectura',
          titulo: '¿Pregunta o investigación?',
          minutos: 14,
          resumen: 'Researcher entrega un reporte con fuentes citadas, no una respuesta rápida.',
          objetivos: [
            'Distinguir cuándo conviene Researcher de una pregunta directa en el chat.',
            'Acotar las fuentes de una investigación.',
          ],
          bloques: [
            {
              tipo: 'texto',
              texto:
                'Researcher y Analyst están dentro de Copilot Chat, en la sección de agentes, y no reemplazan el chat normal: se usan cuando la pregunta necesita más tiempo de análisis. Si se resuelve con dos líneas, es el chat. Si necesita cruzar varias fuentes y sustentar la respuesta, es Researcher.',
            },
            {
              tipo: 'prompt',
              etiqueta: 'A Researcher',
              texto: 'Investiga cómo están usando IA generativa las empresas de nuestro sector y dame un reporte con fuentes.',
            },
            {
              tipo: 'nota',
              tono: 'clave',
              titulo: 'Dile de dónde sacar la información',
              texto:
                'Researcher puede acotarse a los archivos y correos de la empresa, a la web, o a ambos. Sin esa precisión, el reporte sale más genérico de lo que hace falta.',
            },
            {
              tipo: 'texto',
              texto:
                'Desde agosto de 2026, al agregar Researcher al prompt aparece un selector de modelo y de modo: el modo más profundo se demora más y se justifica cuando el reporte va a sustentar una decisión grande. Researcher además suele repreguntar para afinar el alcance; contestar bien esas preguntas ahorra un reporte que hay que pedir de nuevo.',
            },
          ],
          chequeo: [
            {
              id: 'q1',
              enunciado: '¿Cuándo conviene usar Researcher en vez del chat normal?',
              opciones: [
                {
                  texto: 'Para cualquier pregunta, siempre.',
                  explicacion: 'Para lo que se resuelve en dos líneas, el chat normal basta.',
                },
                {
                  texto: 'Cuando hace falta cruzar varias fuentes y sustentar la respuesta con citas.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'Solo cuando el tema es sobre la competencia.',
                  explicacion: 'No depende del tema, sino de si necesita investigación sustentada.',
                },
              ],
            },
          ],
        },
        {
          slug: 'analyst-con-codigo-a-la-vista',
          tipo: 'lectura',
          titulo: 'Analyst, con el código a la vista',
          minutos: 14,
          resumen: 'Un análisis de datos que se puede revisar, no solo creer.',
          objetivos: [
            'Usar Analyst para cruzar varios archivos.',
            'Revisar el código antes de dar por buena una conclusión.',
          ],
          bloques: [
            {
              tipo: 'texto',
              texto:
                'Analyst entrega un análisis de datos con el código que corrió a la vista. Es la diferencia entre confiar en un número y poder revisar cómo se llegó a él.',
            },
            {
              tipo: 'chat',
              titulo: 'Pidiendo el cruce',
              pregunta: 'Con estos tres archivos de ventas, dime qué producto está cayendo y desde cuándo.',
              respuesta:
                'La Línea B cayó 22% desde junio, sostenido en las tres sucursales. Corrí el análisis con el código de abajo; puedes revisarlo antes de usar la cifra.',
            },
            {
              tipo: 'codigo',
              titulo: 'Lo que corrió Analyst',
              codigo: 'ventas.groupby(["producto","mes"])["ingreso"].sum().pct_change()',
              explicacion: 'Revisar esta línea es lo que separa confiar en el análisis de solo creerlo.',
            },
          ],
          chequeo: [
            {
              id: 'q1',
              enunciado: '¿Qué distingue a Analyst de una pregunta normal en el chat?',
              opciones: [
                {
                  texto: 'Analyst no cruza archivos, solo responde preguntas simples.',
                  explicacion: 'Es al revés: Analyst está pensado para cruzar varios archivos.',
                },
                {
                  texto: 'Analyst muestra el código con el que llegó al resultado.',
                  correcta: true,
                  explicacion: 'Correcto: eso permite revisarlo antes de usarlo.',
                },
                {
                  texto: 'No hay diferencia real.',
                  explicacion: 'La diferencia está en el código visible y la capacidad de cruzar archivos.',
                },
              ],
            },
          ],
        },
        {
          slug: 'practica-encargo-researcher',
          tipo: 'practica',
          titulo: 'Práctica: el encargo a Researcher',
          minutos: 15,
          resumen: 'Una decisión de negocio que necesita contexto sustentado, no una opinión rápida.',
          bloques: [
            {
              tipo: 'texto',
              texto: 'Escribe el prompt para encargarle la investigación a Researcher. Te revisamos contra una rúbrica de cinco puntos.',
            },
          ],
          caso: {
            rol: 'Estrategia',
            tarea: 'Sustentar la entrada a un segmento nuevo antes del comité',
            situacion:
              'El área evalúa si entrar al segmento de clientes medianos, uno que hoy casi no atienden. El comité quiere saber, con fuentes, cómo se comporta ese segmento en el sector y qué está haciendo la competencia. Tienen una semana.',
          },
          consigna: 'Escribe el prompt para encargar la investigación a Researcher.',
          placeholder: 'Investiga...',
          rubrica: [
            { id: 'pregunta', titulo: 'La pregunta de decisión', pregunta: '¿Deja claro qué decisión va a sustentar la investigación?' },
            { id: 'fuentes', titulo: 'Fuentes', pregunta: '¿Acota si usa fuentes de la empresa, la web o ambas?' },
            { id: 'modo', titulo: 'El modo', pregunta: '¿Justifica o pide el modo más profundo, dado que sustenta una decisión grande?' },
            { id: 'formato', titulo: 'El formato del reporte', pregunta: '¿Pide un formato concreto para presentar al comité?' },
            { id: 'verificacion', titulo: 'Verificación', pregunta: '¿Menciona que va a revisar las citas antes de usarlas?' },
          ],
          pistas: [
            'Una investigación sin pregunta de decisión sale demasiado general.',
            'El comité decide con esto: vale la pena el modo más profundo.',
          ],
          solucion:
            'Investiga cómo se comporta el segmento de clientes medianos en nuestro sector y qué están haciendo nuestros competidores para atenderlo, para sustentar la decisión de si entramos a ese segmento. Usa fuentes de la web y, si encuentras algo relevante, nuestros archivos de mercado. Usa el modo de investigación más profundo: esto va a un comité. Entrégame un reporte de máximo dos páginas con fuentes citadas, listo para revisar antes de presentarlo.',
        },
      ],
    },
    {
      slug: 'cowork',
      nivel: 'avanzado',
      modulo: 'cowork',
      titulo: 'Cowork',
      descripcion: 'Tareas de horas que cruzan varias aplicaciones, escritas como un encargo real.',
      lecciones: [
        {
          slug: 'cuando-cowork',
          tipo: 'lectura',
          titulo: 'Cuándo vale la pena Cowork',
          minutos: 14,
          resumen: 'Cowork no responde preguntas: hace el trabajo, y se cobra por uso.',
          objetivos: [
            'Reconocer una tarea que de verdad amerita Cowork.',
            'Entender el modelo de créditos.',
          ],
          bloques: [
            {
              tipo: 'texto',
              texto:
                'Cowork toma tareas de varias horas que cruzan correos, archivos y reuniones, y devuelve el entregable terminado, no un borrador. Necesita la licencia de Microsoft 365 Copilot y además consume créditos que se facturan por uso, en paquetes de 25.000 o por pago a medida.',
            },
            {
              tipo: 'nota',
              tono: 'ojo',
              titulo: 'Escoge una tarea que de verdad sea larga',
              texto:
                'Mandarle a Cowork algo que el chat resuelve en un minuto es gastar créditos de más. Guárdalo para lo que de verdad implica varias horas y varias aplicaciones.',
            },
            {
              tipo: 'nota',
              tono: 'dato',
              titulo: 'Dónde se ve el consumo',
              texto:
                'El tablero de consumo de Viva Insights muestra el gasto de créditos de Cowork y de las APIs de Work IQ. Antes de lanzar una tarea larga, conviene revisar con tu jefe el presupuesto de créditos del área.',
            },
          ],
          chequeo: [
            {
              id: 'q1',
              enunciado: '¿Qué distingue a Cowork del modo agente de Word?',
              opciones: [
                {
                  texto: 'Cowork cruza varias aplicaciones y entrega el trabajo hecho; el modo agente trabaja dentro de un archivo abierto.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'Son lo mismo con nombres distintos.',
                  explicacion: 'Cowork es más amplio: cruza aplicaciones, no un solo archivo.',
                },
                {
                  texto: 'Cowork es gratis y el modo agente se cobra.',
                  explicacion: 'Es al revés: Cowork consume créditos que se facturan por uso.',
                },
              ],
            },
          ],
        },
        {
          slug: 'el-encargo-bien-escrito',
          tipo: 'lectura',
          titulo: 'El encargo bien escrito',
          minutos: 16,
          resumen: 'Escríbelo como se lo darías a alguien nuevo en el equipo.',
          objetivos: [
            'Escribir un encargo completo para Cowork.',
            'Revisar el plan antes de que corra, y verificar por muestra al final.',
          ],
          bloques: [
            {
              tipo: 'texto',
              texto:
                'Un buen encargo a Cowork se parece al que le darías a alguien que empieza hoy en el equipo: qué se necesita, con qué insumos, qué criterios usar para decidir, y qué no hacer. Cowork muestra el plan antes de correr: revísalo ahí, no después.',
            },
            {
              tipo: 'nota',
              tono: 'clave',
              titulo: 'Verifica por muestra',
              texto:
                'Al terminar, no revises todo el entregable de una: toma una muestra representativa y compárala contra lo que ya sabes. Es la forma práctica de confiar en un resultado grande sin releerlo entero.',
            },
          ],
          chequeo: [
            {
              id: 'q1',
              enunciado: '¿Cuándo conviene revisar el plan de Cowork?',
              opciones: [
                {
                  texto: 'Antes de que corra.',
                  correcta: true,
                  explicacion: 'Correcto: revisarlo ahí evita gastar créditos en un enfoque equivocado.',
                },
                {
                  texto: 'Solo al final, sobre el entregable.',
                  explicacion: 'Revisar el plan antes es lo que evita un mal enfoque de entrada.',
                },
                {
                  texto: 'Nunca hace falta revisarlo.',
                  explicacion: 'El plan es justamente el punto de control antes de que se ejecute.',
                },
              ],
            },
          ],
        },
        {
          slug: 'practica-encargo-cowork',
          tipo: 'practica',
          titulo: 'Práctica: la matriz de vencimientos',
          minutos: 20,
          resumen: 'Revisar 40 contratos y armar la matriz de vencimientos, escrito como un encargo real.',
          bloques: [
            {
              tipo: 'texto',
              texto: 'Escribe el encargo completo para Cowork. Te revisamos contra una rúbrica de seis puntos.',
            },
          ],
          caso: {
            rol: 'Área legal',
            tarea: 'Armar la matriz de vencimientos de todos los contratos vigentes',
            situacion:
              'Hay una carpeta con 40 contratos de proveedores en distintos formatos. Legal necesita una matriz con proveedor, fecha de vencimiento, monto y si tiene cláusula de renovación automática, para la revisión trimestral del jueves.',
          },
          consigna: 'Escribe el encargo completo para Cowork.',
          placeholder: 'Revisa los 40 contratos de esta carpeta y...',
          rubrica: [
            { id: 'resultado', titulo: 'Resultado esperado', pregunta: '¿Describe con claridad qué entregable espera (la matriz, con esas columnas)?' },
            { id: 'insumos', titulo: 'Insumos', pregunta: '¿Indica dónde están los contratos?' },
            { id: 'criterios', titulo: 'Criterios de decisión', pregunta: '¿Explica cómo identificar la cláusula de renovación automática?' },
            { id: 'no-hacer', titulo: 'Qué no hacer', pregunta: '¿Dice qué no debe hacer, por ejemplo no modificar los contratos originales?' },
            { id: 'revision', titulo: 'Puntos de revisión', pregunta: '¿Pide mostrar el plan antes de correr?' },
            { id: 'verificacion', titulo: 'Verificación', pregunta: '¿Pide una forma de verificar el resultado por muestra?' },
          ],
          pistas: [
            'Piensa en qué le dirías a alguien nuevo que nunca ha visto estos contratos.',
            'La cláusula de renovación automática es el dato que más se presta a error: sé específico.',
          ],
          solucion:
            'Revisa los 40 contratos de proveedores en la carpeta "Contratos vigentes" y arma una matriz con: proveedor, fecha de vencimiento, monto y si tiene cláusula de renovación automática (busca términos como "se renovará automáticamente" o "renovación tácita"). No modifiques los contratos originales, solo léelos. Muéstrame el plan antes de correr. Al terminar, marca tres contratos al azar para que yo los revise contra el original. La necesito lista para la revisión trimestral del jueves.',
        },
      ],
    },
    {
      slug: 'cierre-avanzado',
      nivel: 'avanzado',
      titulo: 'Cierre del nivel 3',
      descripcion: 'El examen del nivel avanzado, sobre Researcher, Analyst y Cowork.',
      lecciones: [
        {
          slug: 'examen-avanzado',
          tipo: 'examen',
          titulo: 'Examen del nivel 3',
          minutos: 12,
          resumen: 'Preguntas sobre Researcher, Analyst y Cowork, según lo que incluya tu capacitación. Se aprueba con 80%.',
          aprobacion: 80,
          preguntas: [
            {
              id: 'e1',
              modulo: 'researcher-analyst',
              enunciado: '¿Cuándo conviene Researcher en vez del chat normal?',
              opciones: [
                {
                  texto: 'Cuando la pregunta necesita cruzar fuentes y un reporte sustentado.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'Para cualquier pregunta.',
                  explicacion: 'Lo que se resuelve en dos líneas no necesita Researcher.',
                },
                {
                  texto: 'Solo si el tema es financiero.',
                  explicacion: 'No depende del tema, depende de si hace falta investigación sustentada.',
                },
              ],
            },
            {
              id: 'e2',
              modulo: 'researcher-analyst',
              enunciado: '¿Qué pasa si no le dices a Researcher de dónde sacar la información?',
              opciones: [
                {
                  texto: 'El reporte sale más genérico de lo que hace falta.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'Researcher se niega a investigar.',
                  explicacion: 'Sí investiga, pero con un alcance menos preciso.',
                },
                {
                  texto: 'No cambia nada.',
                  explicacion: 'Sí cambia: acotar las fuentes mejora el resultado.',
                },
              ],
            },
            {
              id: 'e3',
              modulo: 'researcher-analyst',
              enunciado: '¿Qué distingue a Analyst de un cálculo directo en el chat?',
              opciones: [
                {
                  texto: 'Analyst muestra el código con el que llegó al resultado.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'Analyst no trabaja con archivos.',
                  explicacion: 'Al contrario, Analyst está pensado para cruzar archivos.',
                },
                {
                  texto: 'No hay diferencia.',
                  explicacion: 'La diferencia está en el código visible.',
                },
              ],
            },
            {
              id: 'e4',
              modulo: 'researcher-analyst',
              enunciado: 'Antes de dar por buena una conclusión de Analyst, ¿qué conviene revisar?',
              opciones: [
                {
                  texto: 'El código que usó para llegar al resultado.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'Nada, si el número parece razonable.',
                  explicacion: 'Parecer razonable no es lo mismo que estar verificado.',
                },
                {
                  texto: 'Solo el formato del reporte.',
                  explicacion: 'El formato no dice nada sobre si el cálculo es correcto.',
                },
              ],
            },
            {
              id: 'e5',
              modulo: 'cowork',
              enunciado: '¿Qué distingue a Cowork del modo agente de una aplicación?',
              opciones: [
                {
                  texto: 'Cowork cruza varias aplicaciones y entrega el trabajo hecho.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'Son lo mismo.',
                  explicacion: 'Cowork es más amplio: cruza varias aplicaciones, no una sola.',
                },
                {
                  texto: 'Cowork es gratis.',
                  explicacion: 'Cowork consume créditos que se facturan por uso.',
                },
              ],
            },
            {
              id: 'e6',
              modulo: 'cowork',
              enunciado: '¿Cuándo conviene revisar el plan que arma Cowork?',
              opciones: [
                {
                  texto: 'Antes de que corra.',
                  correcta: true,
                  explicacion: 'Correcto: evita gastar créditos en un enfoque equivocado.',
                },
                {
                  texto: 'Nunca, Cowork siempre acierta.',
                  explicacion: 'El plan es justamente el punto de control antes de ejecutar.',
                },
                {
                  texto: 'Solo si la tarea es corta.',
                  explicacion: 'Aplica sobre todo en tareas largas, que es para lo que sirve Cowork.',
                },
              ],
            },
            {
              id: 'e7',
              modulo: 'cowork',
              enunciado: 'Cowork entrega un resultado grande. ¿Cómo se verifica en la práctica?',
              opciones: [
                {
                  texto: 'Releyendo el entregable completo siempre.',
                  explicacion: 'Es la forma más lenta; no siempre hace falta.',
                },
                {
                  texto: 'Tomando una muestra representativa y comparándola contra lo que ya se sabe.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'No se verifica, se confía directamente.',
                  explicacion: 'Todo resultado que lleva tu nombre se verifica de alguna forma.',
                },
              ],
            },
          ],
        },
      ],
    },

    /* ------------------------------------------------------------ nivel 4 */
    {
      slug: 'agentes',
      nivel: 'experto',
      modulo: 'studio',
      titulo: 'Agentes',
      descripcion: 'Agent Builder para lo simple, Copilot Studio para conectar sistemas, y cómo probar antes de publicar.',
      lecciones: [
        {
          slug: 'agent-builder-o-studio',
          tipo: 'lectura',
          titulo: 'Agent Builder o Copilot Studio',
          minutos: 15,
          resumen: 'Lo difícil no es armarlo: es definir el alcance y mantenerlo.',
          objetivos: [
            'Elegir entre un agente simple y uno construido en Copilot Studio.',
            'Empezar por un problema medible.',
          ],
          bloques: [
            {
              tipo: 'texto',
              texto:
                'Un agente sencillo se arma desde el mismo Copilot, con Agent Builder: sirve para preguntas frecuentes con fuentes fijas. Copilot Studio se usa cuando hay que conectar sistemas o lógica más compleja. En los dos casos, lo difícil no es armarlo: es definir el alcance y mantenerlo.',
            },
            {
              tipo: 'chat',
              titulo: 'Agent Builder',
              pregunta: 'Arma un agente que responda las preguntas frecuentes del equipo.',
              respuesta: 'Agente creado con 3 fuentes. Falta definir qué no debe responder.',
            },
            {
              tipo: 'nota',
              tono: 'clave',
              titulo: 'Empieza por un problema que se pueda medir',
              texto:
                'Antes de definir instrucciones, define qué vas a medir para saber si el agente sirvió: el tiempo que ahorra, las preguntas que ya no llegan a una persona. Sin eso, no hay forma de saber si vale la pena mantenerlo.',
            },
            {
              tipo: 'nota',
              tono: 'dato',
              titulo: 'Los créditos de agente',
              texto:
                'Correr agentes con más capacidad necesita paquetes de créditos, además de la licencia de Microsoft 365 Copilot. Antes de publicar uno de uso frecuente, revisa el presupuesto de créditos del área.',
            },
          ],
          chequeo: [
            {
              id: 'q1',
              enunciado: '¿Cuándo conviene Copilot Studio en vez de Agent Builder?',
              opciones: [
                {
                  texto: 'Cuando hay que conectar sistemas o lógica más compleja.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'Siempre, Studio es superior en todos los casos.',
                  explicacion: 'Para preguntas frecuentes con fuentes fijas, Agent Builder basta.',
                },
                {
                  texto: 'Nunca, Agent Builder cubre todos los casos.',
                  explicacion: 'Agent Builder no conecta sistemas ni maneja lógica compleja.',
                },
              ],
            },
          ],
        },
        {
          slug: 'anatomia-del-agente',
          tipo: 'lectura',
          titulo: 'Anatomía de un agente',
          minutos: 18,
          resumen: 'Instrucciones, conocimiento, qué no debe responder, y pruebas antes de publicar.',
          objetivos: [
            'Definir instrucciones, fuentes y límites de un agente.',
            'Probar un agente antes de publicarlo.',
          ],
          bloques: [
            {
              tipo: 'texto',
              texto:
                'Un agente se define por cuatro cosas: el propósito (para qué existe), el conocimiento (qué fuentes puede usar), el tono, y lo que no debe responder. Este último punto es el que más se olvida, y el que evita que el agente invente una respuesta cuando no sabe.',
            },
            {
              tipo: 'conceptos',
              items: [
                {
                  termino: 'Instrucciones',
                  definicion: 'El propósito del agente y cómo debe comportarse, en un lenguaje claro y corto.',
                },
                {
                  termino: 'Conocimiento',
                  definicion: 'Las fuentes que puede usar: archivos, páginas, un sitio específico. Cuanto más acotado, más confiable.',
                },
                {
                  termino: 'Límites',
                  definicion: 'Lo que nunca debe hacer y a dónde debe derivar cuando la pregunta se sale de su alcance.',
                },
              ],
            },
            {
              tipo: 'nota',
              tono: 'ojo',
              titulo: 'Prueba antes de publicar',
              texto:
                'Antes de soltarlo al equipo, hazle preguntas fuera de su alcance a propósito. Un agente bueno reconoce cuándo no sabe y deriva, en vez de inventar una respuesta segura.',
            },
          ],
          chequeo: [
            {
              id: 'q1',
              enunciado: '¿Por qué definir qué no debe responder un agente?',
              opciones: [
                {
                  texto: 'Para que responda más rápido.',
                  explicacion: 'No es una cuestión de velocidad.',
                },
                {
                  texto: 'Para evitar que invente una respuesta cuando no sabe.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'No hace falta definirlo, el agente lo detecta solo.',
                  explicacion: 'Sin límites explícitos, un agente puede inventar en vez de derivar.',
                },
              ],
            },
          ],
        },
        {
          slug: 'practica-agente',
          tipo: 'practica',
          titulo: 'Práctica: el agente de RR. HH.',
          minutos: 25,
          resumen: 'Las instrucciones de un agente de preguntas frecuentes sobre vacaciones y beneficios.',
          bloques: [
            {
              tipo: 'texto',
              texto: 'Escribe las instrucciones del agente: propósito, conocimiento, tono y límites. Te revisamos contra una rúbrica de cinco puntos.',
            },
          ],
          caso: {
            rol: 'RR. HH.',
            tarea: 'Armar un agente de preguntas frecuentes sobre vacaciones y beneficios',
            situacion:
              'El equipo de RR. HH. recibe entre 15 y 20 preguntas por semana sobre días de vacaciones, licencias y beneficios, casi siempre las mismas. Existe una política de vacaciones y un documento de beneficios, ambos en la intranet. Los casos de licencia médica o disputas salariales necesitan atención humana, no una respuesta automática.',
          },
          consigna: 'Escribe las instrucciones completas del agente.',
          placeholder: 'Propósito: ...\nConocimiento: ...\nTono: ...\nLímites: ...',
          rubrica: [
            { id: 'proposito', titulo: 'Propósito y alcance', pregunta: '¿Define con claridad para qué existe el agente y qué cubre?' },
            { id: 'fuentes', titulo: 'Fuentes', pregunta: '¿Acota el conocimiento a la política de vacaciones y el documento de beneficios?' },
            { id: 'tono', titulo: 'Tono', pregunta: '¿Define un tono apropiado para un tema de RR. HH.?' },
            { id: 'limites', titulo: 'Lo que no responde', pregunta: '¿Excluye licencia médica y disputas salariales, y dice a dónde derivarlas?' },
            { id: 'pruebas', titulo: 'Casos de prueba', pregunta: '¿Propone al menos dos preguntas para probar el agente antes de publicarlo?' },
          ],
          pistas: [
            'Un agente que dice "no sé, pregúntale a RR. HH." es mejor que uno que inventa una cifra de días.',
            'Piensa en la pregunta que un empleado nuevo haría, no la que haría alguien que ya conoce la política.',
          ],
          solucion:
            'Propósito: responder preguntas frecuentes sobre vacaciones y beneficios, para reducir las consultas repetidas a RR. HH. Conocimiento: exclusivamente la política de vacaciones y el documento de beneficios, ambos en la intranet; no usar la web ni otras fuentes. Tono: cercano y claro, sin jerga legal. Límites: nunca responder sobre licencia médica, disputas salariales o casos individuales; en esos casos, derivar al correo de RR. HH. con un mensaje que explique por qué. Casos de prueba antes de publicar: "¿cuántos días de vacaciones me corresponden con tres años en la empresa?" (debe responder con la política) y "me negaron un aumento, ¿qué hago?" (debe derivar, no responder).',
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
          minutos: 16,
          resumen: 'El número de prompts enviados no dice si algo mejoró.',
          objetivos: [
            'Distinguir una métrica de resultado de una métrica de uso.',
            'Usar el tablero de consumo para seguir la adopción.',
          ],
          bloques: [
            {
              tipo: 'texto',
              texto:
                'Cuántos prompts se enviaron o cuántas personas activaron Copilot son métricas de uso: dicen que algo se prendió, no que algo mejoró. Una métrica de resultado mide lo que cambió de verdad: el tiempo que toma un proceso, la tasa de error, cuántas veces se repite una tarea.',
            },
            {
              tipo: 'nota',
              tono: 'clave',
              titulo: 'Línea base y meta',
              texto:
                'Antes de medir el impacto hace falta saber de dónde se parte. Sin línea base, cualquier número posterior es solo un número, no una mejora demostrada.',
            },
            {
              tipo: 'texto',
              texto:
                'El tablero de consumo de Viva Insights muestra el gasto de créditos de Cowork y de las APIs de Work IQ, y lo ven los jefes con cinco personas o más a cargo, los analistas de Insights y los administradores. Es un buen punto de partida para cruzar consumo con resultado.',
            },
          ],
          chequeo: [
            {
              id: 'q1',
              enunciado: '¿Cuál de estas es una métrica de resultado, no de uso?',
              opciones: [
                {
                  texto: 'Número de prompts enviados en el mes.',
                  explicacion: 'Dice que la herramienta se usó, no que algo mejoró.',
                },
                {
                  texto: 'Tiempo promedio de resolución de un proceso, antes y después.',
                  correcta: true,
                  explicacion: 'Correcto: mide lo que cambió de verdad.',
                },
                {
                  texto: 'Cantidad de personas con licencia activada.',
                  explicacion: 'Es una métrica de adopción inicial, no de impacto.',
                },
              ],
            },
          ],
        },
        {
          slug: 'gobierno-y-creditos',
          tipo: 'lectura',
          titulo: 'Gobierno: dueños, revisión y créditos',
          minutos: 15,
          resumen: 'Quién es responsable, cada cuánto se revisa, y cómo se apaga si algo falla.',
          objetivos: [
            'Definir un dueño y una revisión periódica para un agente o flujo de trabajo.',
            'Saber cómo se apaga algo que falla.',
          ],
          bloques: [
            {
              tipo: 'texto',
              texto:
                'Un agente o una tarea automatizada con Cowork necesita, además de que funcione, quién responde por ella. Sin un dueño con nombre, un error de un sábado puede seguir corriendo hasta el lunes.',
            },
            {
              tipo: 'lista',
              items: [
                'Dueño: una persona, no un equipo, responsable de revisar y corregir.',
                'Revisión: periodicidad definida (semanal, quincenal) sobre lo que el agente respondió o el flujo automatizó.',
                'Presupuesto: cuántos créditos tiene asignados el área y quién lo autoriza.',
                'Apagado: el paso concreto para desactivarlo, conocido por más de una persona.',
              ],
            },
            {
              tipo: 'nota',
              tono: 'ojo',
              titulo: 'Sobre la política de datos',
              texto:
                'Todo agente hereda las reglas de la política de uso de IA de la empresa: qué información puede procesar y qué no sale del entorno corporativo. Revisarla es parte de definir el gobierno, no un trámite aparte.',
            },
          ],
          chequeo: [
            {
              id: 'q1',
              enunciado: 'Un agente falla un sábado. ¿Qué es lo primero que debe existir para resolverlo rápido?',
              opciones: [
                {
                  texto: 'Un dueño con nombre y un apagado conocido.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'Un modelo de respaldo más caro.',
                  explicacion: 'No evita que el error siga corriendo mientras nadie sabe cómo apagarlo.',
                },
                {
                  texto: 'Esperar a que alguien se dé cuenta el lunes.',
                  explicacion: 'Sin un dueño y un apagado, el error puede correr todo el fin de semana.',
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
          resumen: 'Preguntas sobre métricas, gobierno y, si tu capacitación los incluye, agentes. Se aprueba con 80%.',
          aprobacion: 80,
          preguntas: [
            {
              id: 'e1',
              modulo: 'studio',
              enunciado: '¿Cuándo conviene Copilot Studio en vez de Agent Builder?',
              opciones: [
                {
                  texto: 'Cuando hay que conectar sistemas o lógica más compleja.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'Para cualquier agente, sin excepción.',
                  explicacion: 'Para preguntas frecuentes con fuentes fijas, Agent Builder basta.',
                },
                {
                  texto: 'Nunca hace falta Studio.',
                  explicacion: 'Studio sí es necesario cuando hay sistemas que conectar.',
                },
              ],
            },
            {
              id: 'e2',
              modulo: 'studio',
              enunciado: '¿Por qué probar un agente con preguntas fuera de su alcance antes de publicarlo?',
              opciones: [
                {
                  texto: 'Para verificar que deriva en vez de inventar una respuesta.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'Para que responda más rápido.',
                  explicacion: 'No es una cuestión de velocidad.',
                },
                {
                  texto: 'No hace falta probarlo antes de publicar.',
                  explicacion: 'Probarlo antes es justo lo que evita un mal lanzamiento.',
                },
              ],
            },
            {
              id: 'e3',
              enunciado: '¿Qué demuestra mejor que un agente o un flujo automatizado funciona?',
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
              id: 'e4',
              enunciado: 'Sin línea base, ¿qué problema tiene medir el impacto después de implementar algo?',
              opciones: [
                {
                  texto: 'Ninguno, el número final ya dice todo.',
                  explicacion: 'Un número sin punto de comparación no demuestra una mejora.',
                },
                {
                  texto: 'No se puede demostrar que hubo una mejora real.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'Solo afecta el diseño del reporte, no la conclusión.',
                  explicacion: 'Sí afecta la conclusión: sin línea base no hay mejora demostrable.',
                },
              ],
            },
            {
              id: 'e5',
              enunciado: 'Si un agente falla un sábado, ¿qué es lo primero que debe existir?',
              opciones: [
                {
                  texto: 'Un dueño con nombre y un apagado conocido.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'Un canal de quejas para los usuarios.',
                  explicacion: 'Útil, pero alguien tiene que poder actuar rápido.',
                },
                {
                  texto: 'Nada, se revisa el lunes.',
                  explicacion: 'Esperar al lunes deja el error corriendo todo el fin de semana.',
                },
              ],
            },
            {
              id: 'e6',
              enunciado: '¿Qué hereda un agente publicado de la política de uso de IA de la empresa?',
              opciones: [
                {
                  texto: 'Nada, cada agente define sus propias reglas de datos.',
                  explicacion: 'El agente hereda las reglas de la política de la empresa.',
                },
                {
                  texto: 'Qué información puede procesar y qué no sale del entorno corporativo.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'Solo el idioma en que responde.',
                  explicacion: 'La política de datos va más allá del idioma.',
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
                'La herramienta de Copilot para cada paso (chat, una app, Researcher, Cowork o un agente) y por qué esa y no otra.',
                'El prompt o el encargo clave, el que más se repite o el que más tiempo ahorra.',
                'Cómo se verifica el resultado antes de usarlo.',
                'La métrica, con su línea base y la meta.',
                'El gobierno: dueño, revisión, presupuesto de créditos y cómo se apaga.',
              ],
            },
            {
              tipo: 'nota',
              tono: 'dato',
              titulo: 'Sobre la revisión',
              texto:
                'El agente es opcional: si tu proceso no necesita uno, dilo y explica por qué. El revisor mira las seis partes y que sean coherentes entre sí, no que uses los nombres exactos de cada botón.',
            },
          ],
          caso: {
            rol: 'Tú, en tu área',
            tarea: 'Diseñar el sistema de IA de un proceso del equipo',
            situacion:
              'Si no tienes un proceso propio, usa este: el área de finanzas hace el cierre contable mensual, que hoy toma cinco días hábiles. Gran parte del tiempo se va en conciliar gastos entre el ERP y los correos de aprobación, que llegan dispersos en distintos hilos, y en armar el reporte para el comité.',
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
              pregunta: '¿Asigna una herramienta de Copilot a cada paso y justifica por qué esa y no otra?',
            },
            {
              id: 'encargo',
              titulo: 'El encargo clave',
              pregunta: '¿Incluye un prompt o encargo concreto, no una descripción genérica?',
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
              pregunta: '¿Nombra un dueño, una revisión periódica, el presupuesto de créditos y cómo se apaga?',
            },
          ],
          pistas: [
            'Empieza por la métrica: si no sabes qué quieres mover, el resto no tiene norte.',
            'No todos los pasos necesitan la misma herramienta: mezclar chat, una app y quizás Cowork suele ser más realista que un solo agente que hace todo.',
          ],
          solucion:
            '1. PROCESO: el cierre contable mensual toma 5 días hábiles; 3 de esos días se van en conciliar gastos entre el ERP y correos de aprobación dispersos en varios hilos.\n\n2. HERRAMIENTA POR PASO: (a) Outlook con Copilot para resumir y extraer las aprobaciones de los hilos de correo dispersos. (b) Excel con modo agente para conciliar esos montos contra el ERP exportado y marcar las diferencias. (c) Word con Copilot para armar el borrador del reporte del comité a partir de la conciliación. Cowork no aplica: cada paso es corto y se revisa por separado, mejor que una sola tarea larga sin puntos de control.\n\n3. ENCARGO CLAVE: "Resume los hilos de aprobación de gastos de este mes: quién aprobó, qué monto y en qué fecha. Después, con esta exportación del ERP, márcame las diferencias mayores a 50 dólares entre lo aprobado por correo y lo registrado."\n\n4. VERIFICACIÓN: el analista revisa a mano las diferencias marcadas (normalmente menos de 10 filas) antes de dar la conciliación por cerrada; el borrador del reporte se revisa completo antes de enviarlo al comité, porque lleva cifras.\n\n5. MÉTRICA: días hábiles del cierre (línea base 5, meta 3 en dos trimestres) y número de diferencias no detectadas a tiempo (línea base sin medir, meta 0). Se revisa cada cierre mensual.\n\n6. GOBIERNO: dueña la jefa de contabilidad, Ana Torres. Revisión mensual, al cierre de cada mes, de las diferencias que quedaron sin resolver. Presupuesto: no usa créditos de Cowork, solo licencia base de Microsoft 365 Copilot. Apagado: si el modo agente de Excel da resultados inconsistentes dos meses seguidos, se vuelve a la conciliación manual mientras se revisa el prompt.',
        },
      ],
    },
  ],

  /* ========================================================= diagnóstico */
  diagnostico: [
    {
      id: 'd1',
      nivel: 'cero',
      enunciado: 'Tu empresa solo tiene Copilot Chat, sin licencia de Microsoft 365 Copilot. ¿Qué puedes usar?',
      opciones: [
        { texto: 'Nada, Copilot Chat no sirve sin la licencia completa.', explicacion: 'Copilot Chat funciona con la cuenta corporativa, sin licencia adicional.' },
        { texto: 'El chat, apoyado en la web y en tus datos de trabajo si lo activas.', correcta: true, explicacion: 'Correcto.' },
        { texto: 'Solo el modo agente de Word.', explicacion: 'El modo agente necesita la licencia de Microsoft 365 Copilot.' },
        { texto: 'No lo sé.', explicacion: 'Sin problema: el nivel 0 empieza justo aquí.' },
      ],
    },
    {
      id: 'd2',
      nivel: 'cero',
      enunciado: 'Necesitas cambiar el orden de tres secciones dentro de un documento que tienes abierto. ¿Qué usas?',
      opciones: [
        { texto: 'El chat, pegando el texto entero.', explicacion: 'Funciona, pero es más lento que trabajar dentro del archivo.' },
        { texto: 'El modo agente.', correcta: true, explicacion: 'Correcto.' },
        { texto: 'Cowork.', explicacion: 'Cowork es para tareas largas que cruzan varias aplicaciones, no un cambio dentro de un archivo.' },
        { texto: 'No lo sé.', explicacion: 'Lo vemos en el nivel 0.' },
      ],
    },
    {
      id: 'd3',
      nivel: 'basico',
      modulo: 'chat',
      enunciado: '¿Por qué apuntar una pregunta a un archivo o proyecto concreto mejora la respuesta?',
      opciones: [
        { texto: 'Porque Copilot responde más rápido.', explicacion: 'No es una cuestión de velocidad.' },
        { texto: 'Porque acota de dónde saca la información y de dónde cita.', correcta: true, explicacion: 'Correcto.' },
        { texto: 'No cambia nada.', explicacion: 'Sí cambia: sin fuente, la respuesta sale más genérica.' },
        { texto: 'No lo sé.', explicacion: 'Lo vemos en el nivel 1.' },
      ],
    },
    {
      id: 'd4',
      nivel: 'basico',
      modulo: 'outlook',
      enunciado: 'Llega un hilo de correos largo y urgente. ¿Qué haces primero?',
      opciones: [
        { texto: 'Lo lees entero, correo por correo.', explicacion: 'Es la opción más lenta cuando existe un resumen.' },
        { texto: 'Pides un resumen de qué se pidió, qué se respondió y qué falta.', correcta: true, explicacion: 'Correcto.' },
        { texto: 'Respondes sin leer nada.', explicacion: 'Arriesga contradecir algo ya acordado.' },
        { texto: 'No lo sé.', explicacion: 'Lo vemos en el nivel 1.' },
      ],
    },
    {
      id: 'd5',
      nivel: 'intermedio',
      modulo: 'excel',
      enunciado: 'Copilot te entrega un número calculado en una hoja de Excel. ¿Qué deberías pedir para poder confiar en él?',
      opciones: [
        { texto: 'Nada más, si el número parece razonable.', explicacion: 'Parecer razonable no es lo mismo que poder auditarlo.' },
        { texto: 'La fórmula con la que llegó a ese número.', correcta: true, explicacion: 'Correcto.' },
        { texto: 'Que lo repita tres veces.', explicacion: 'Repetirlo no aporta a poder auditarlo.' },
        { texto: 'No lo sé.', explicacion: 'Lo vemos en el nivel 2.' },
      ],
    },
    {
      id: 'd6',
      nivel: 'intermedio',
      modulo: 'word',
      enunciado: 'Pides un cambio de varios pasos en un documento con el modo agente de Word. ¿Qué haces cuando termina?',
      opciones: [
        { texto: 'Lo das por bueno directamente.', explicacion: 'Que termine no significa que quedó bien.' },
        { texto: 'Revisas el documento completo antes de usarlo.', correcta: true, explicacion: 'Correcto.' },
        { texto: 'Lo repites desde cero, siempre.', explicacion: 'No hace falta si al revisarlo está bien.' },
        { texto: 'No lo sé.', explicacion: 'Lo vemos en el nivel 2.' },
      ],
    },
    {
      id: 'd7',
      nivel: 'avanzado',
      modulo: 'researcher-analyst',
      enunciado: '¿Cuándo conviene usar Researcher en vez de una pregunta directa en el chat?',
      opciones: [
        { texto: 'Cuando hace falta cruzar varias fuentes y sustentar la respuesta con citas.', correcta: true, explicacion: 'Correcto.' },
        { texto: 'Para cualquier pregunta, siempre.', explicacion: 'Lo que se resuelve en dos líneas no necesita Researcher.' },
        { texto: 'Nunca, el chat siempre basta.', explicacion: 'Para una investigación sustentada, Researcher aporta algo distinto.' },
        { texto: 'No lo sé.', explicacion: 'Lo vemos en el nivel 3.' },
      ],
    },
    {
      id: 'd8',
      nivel: 'avanzado',
      modulo: 'cowork',
      enunciado: '¿En qué momento conviene revisar el plan que arma Cowork antes de una tarea larga?',
      opciones: [
        { texto: 'Antes de que corra.', correcta: true, explicacion: 'Correcto.' },
        { texto: 'Nunca hace falta.', explicacion: 'El plan es el punto de control antes de gastar créditos en un enfoque equivocado.' },
        { texto: 'Solo después de terminar.', explicacion: 'Revisarlo antes evita un mal enfoque de entrada.' },
        { texto: 'No lo sé.', explicacion: 'Lo vemos en el nivel 3.' },
      ],
    },
    {
      id: 'd9',
      nivel: 'experto',
      modulo: 'studio',
      enunciado: '¿Qué evita que un agente invente una respuesta cuando no sabe algo?',
      opciones: [
        { texto: 'Darle acceso a más fuentes.', explicacion: 'Más fuentes no reemplaza definir qué no debe responder.' },
        { texto: 'Definir explícitamente qué no debe responder y a dónde derivar.', correcta: true, explicacion: 'Correcto.' },
        { texto: 'Nada, los agentes siempre inventan un poco.', explicacion: 'Con límites bien definidos, un agente puede reconocer cuándo no sabe.' },
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
