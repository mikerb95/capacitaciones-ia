import type { Curso } from './tipos';

// Un color por nivel, tomado de los módulos del portal de ChatGPT, para que
// el temario se lea de un vistazo como una escalera.
const C = {
  verde: '#0E7C63',
  azul: '#2B6FE3',
  violeta: '#8A5CD1',
  ambar: '#C2760C',
  vino: '#B0396B',
};

/**
 * Ruta guiada de ChatGPT: de quien solo le ha hecho preguntas sueltas a quien
 * diseña el sistema de IA de su equipo. Cada unidad profundiza un módulo del
 * portal y cierra con algo que se hace, no con algo que se lee.
 *
 * El contenido sigue el seed del portal (`src/db/seed/chatgpt.ts`), verificado
 * en septiembre de 2026: Canvas ya no está en GPT-5.5 y su función pasa a los
 * bloques editables, Sora salió y su lugar lo ocupa el conocimiento de la
 * empresa. Si el seed cambia, este archivo se revisa junto.
 *
 * Los exámenes de cierre mezclan preguntas de varios módulos y se recortan
 * pregunta por pregunta según el alcance del código: ver `cursoEnAlcance` en
 * `./index.ts`.
 *
 * Una advertencia para quien edite: el avance se guarda contra el `slug` de
 * cada lección. Renombrar uno borra el avance de esa lección para todos.
 */
export const chatgptCurso: Curso = {
  platformId: 'chatgpt',
  titulo: 'ChatGPT en el trabajo, de cero a experto',
  subtitulo: 'Ruta guiada',
  descripcion:
    'Un recorrido en cinco niveles: primero qué es ChatGPT, qué hace con tus datos y cómo pedirle bien, después documentos, voz e imágenes, luego GPTs propios, Deep Research y el conocimiento de la empresa, más adelante Agent Mode y Codex, y al final el sistema completo del equipo. Lecciones cortas, prácticas revisadas por IA y un examen por nivel.',
  color: C.verde,
  aprendizajes: [
    'Escribir un pedido completo y corregir sobre lo que ya salió en vez de empezar de nuevo.',
    'Armar un documento en un bloque editable y ajustarlo por partes, sin perder la versión buena.',
    'Usar la voz donde no hay teclado y la imagen donde antes había un banco de fotos.',
    'Empaquetar el criterio del área en un GPT con instrucciones, límites y archivos de referencia.',
    'Encargar una investigación con fuentes o una tarea de varios pasos, y revisar lo que vuelve.',
    'Presentar un plan de adopción de IA con métricas, dueños y reglas de uso de los datos.',
  ],
  requisitos: [
    'Una cuenta de ChatGPT del espacio de trabajo de la empresa (Business o Enterprise). El material de trabajo no va por cuentas personales.',
    'Las unidades de GPTs, conocimiento de la empresa, Agent Mode y Codex dependen de lo que tu empresa tenga habilitado. Si tu código no las incluye, no se muestran y el curso sigue por lo que sí tengas.',
    'Si ya usas ChatGPT a diario, haz el diagnóstico y salta a tu nivel.',
  ],
  niveles: [
    {
      key: 'cero',
      titulo: 'Nivel 0 · Fundamentos',
      promesa: 'Sabes qué hace ChatGPT con tus datos, qué herramienta usar para cada tarea y cómo pedirle bien.',
      color: C.verde,
    },
    {
      key: 'basico',
      titulo: 'Nivel 1 · Básico',
      promesa: 'Sacas un documento listo en una sola sesión, dictas en vez de teclear y resuelves la imagen que hacía falta.',
      color: C.azul,
    },
    {
      key: 'intermedio',
      titulo: 'Nivel 2 · Intermedio',
      promesa: 'Tienes un GPT del área, encargas investigaciones con fuentes y le preguntas a los documentos de la empresa.',
      color: C.violeta,
    },
    {
      key: 'avanzado',
      titulo: 'Nivel 3 · Avanzado',
      promesa: 'Delegas tareas de varios pasos al agente y conviertes un proceso manual del mes en algo repetible.',
      color: C.ambar,
    },
    {
      key: 'experto',
      titulo: 'Nivel 4 · Experto',
      promesa: 'Mantienes los GPTs del equipo y gobiernas la IA del área con métricas, dueños y reglas claras.',
      color: C.vino,
    },
  ],

  /* ============================================================ unidades */
  unidades: [
    /* ------------------------------------------------------------ nivel 0 */
    {
      slug: 'fundamentos',
      nivel: 'cero',
      titulo: 'ChatGPT sin misterio',
      descripcion:
        'Qué es ChatGPT, qué pasa con lo que le escribes, qué herramienta usar para cada tarea y cómo pedirle bien. Lo mínimo para que lo que viene después tenga dónde apoyarse.',
      lecciones: [
        {
          slug: 'que-es-chatgpt',
          tipo: 'lectura',
          titulo: 'Qué es ChatGPT y cómo piensa',
          minutos: 12,
          resumen: 'Un modelo que predice texto muy bien, con herramientas alrededor. Saber eso cambia cómo se le pide.',
          objetivos: [
            'Entender qué hace el modelo y qué hacen las herramientas que lo rodean.',
            'Distinguir un modelo rápido de uno de razonamiento.',
            'Reconocer por qué a veces inventa y cómo evitarlo.',
          ],
          bloques: [
            {
              tipo: 'texto',
              texto:
                'ChatGPT es un modelo de lenguaje: aprendió de enormes cantidades de texto a producir la respuesta más probable para lo que le escribes. Por eso redacta, resume, traduce y ordena ideas con una facilidad que sorprende. Y por eso mismo, cuando no tiene el dato, puede producir algo que suena correcto y no lo es.',
            },
            {
              tipo: 'texto',
              texto:
                'Alrededor del modelo hay herramientas: buscar en la web, leer los archivos que subes, generar imágenes, investigar durante varios minutos con Deep Research, ejecutar tareas en un navegador con Agent Mode o consultar los documentos de la empresa. El modelo decide cuándo usarlas, pero tú puedes pedirlas de forma explícita, y conviene hacerlo cuando importa de dónde sale la respuesta.',
            },
            {
              tipo: 'conceptos',
              items: [
                {
                  termino: 'Modelo rápido',
                  definicion:
                    'Contesta de inmediato. Sirve para redactar, resumir, reescribir y la mayoría del trabajo del día.',
                },
                {
                  termino: 'Modelo de razonamiento',
                  definicion:
                    'Se toma más tiempo para pensar antes de contestar. Sirve para análisis con varios pasos, cálculos, comparaciones con muchas condiciones o decisiones con matices. Desde septiembre de 2026 el insignia es GPT-6 Astra.',
                },
                {
                  termino: 'Alucinación',
                  definicion:
                    'Una respuesta que suena segura y es falsa: una cifra, una norma o una cita que no existe. Pasa más cuando se le pide un dato que no tiene a la mano.',
                },
                {
                  termino: 'Contexto',
                  definicion:
                    'Todo lo que el modelo tiene en cuenta al responder: la conversación, los archivos que subiste y lo que traigan sus herramientas. Lo que no está en el contexto, lo supone.',
                },
              ],
            },
            {
              tipo: 'chat',
              titulo: 'Sin el dato en el contexto',
              pregunta: '¿Cuál fue el margen de nuestra línea de empaques el trimestre pasado?',
              respuesta:
                'No tengo acceso a los resultados financieros de tu empresa. Si me compartes el informe del trimestre o activas el conocimiento de la empresa, lo busco y te digo de qué documento sale.',
            },
            {
              tipo: 'nota',
              tono: 'clave',
              titulo: 'La idea que te llevas',
              texto:
                'ChatGPT es excelente con el lenguaje y no sabe nada de tu empresa hasta que se lo das. Lo que redacta, úsalo; lo que afirma como dato, verifícalo en la fuente.',
            },
          ],
          chequeo: [
            {
              id: 'q1',
              enunciado: 'Le preguntas por una cifra interna sin subir ningún archivo ni activar fuentes de la empresa. ¿Qué es lo más probable?',
              opciones: [
                {
                  texto: 'Que la tome de los sistemas de la empresa automáticamente.',
                  explicacion: 'No ve los sistemas de la empresa si no se le conectan o se le entregan los archivos.',
                },
                {
                  texto: 'Que te diga que no la tiene, o que invente algo que suena bien.',
                  correcta: true,
                  explicacion: 'Correcto. Sin el dato en el contexto, lo pide o lo supone. Por eso las cifras se verifican.',
                },
                {
                  texto: 'Que siempre acierte, porque el modelo es muy grande.',
                  explicacion: 'El tamaño del modelo no le da acceso a datos que nunca vio.',
                },
              ],
            },
          ],
        },
        {
          slug: 'datos-y-privacidad',
          tipo: 'lectura',
          titulo: 'Qué pasa con lo que le escribes',
          minutos: 12,
          resumen: 'Cuenta corporativa, archivos, memoria y lo que nunca se pega en un chat.',
          objetivos: [
            'Saber por qué el trabajo va siempre por la cuenta de la empresa.',
            'Reconocer qué ve ChatGPT y qué no ve.',
            'Identificar la información que no se le entrega.',
          ],
          bloques: [
            {
              tipo: 'texto',
              texto:
                'En los planes Business, Enterprise y Edu, el contenido del trabajo no se usa para entrenar los modelos de forma predeterminada. En una cuenta personal sí puede usarse, según la configuración de cada quien. Esa sola diferencia es la razón de la primera regla: el material de la empresa va siempre por la cuenta corporativa.',
            },
            {
              tipo: 'subtitulo',
              texto: 'Qué ve y qué no ve',
            },
            {
              tipo: 'lista',
              items: [
                'Ve lo que escribes en la conversación y los archivos que subes a ella.',
                'Ve los documentos que alguien cargó en un GPT, cuando usas ese GPT.',
                'Ve las herramientas conectadas al espacio de trabajo (Slack, SharePoint, Google Drive, GitHub y otras) cuando activas el conocimiento de la empresa, y solo lo que tu cuenta ya puede abrir.',
                'No ve tu correo, tu disco ni los sistemas de la empresa por su cuenta. Si no está conectado o no lo subiste, no existe para él.',
              ],
            },
            {
              tipo: 'subtitulo',
              texto: 'La memoria',
            },
            {
              tipo: 'texto',
              texto:
                'ChatGPT puede recordar cosas entre conversaciones: tu cargo, el formato que prefieres, el proyecto en el que estás. Es útil, porque deja de pedirte lo mismo cada vez. Se puede revisar, borrar o apagar desde la configuración, y conviene hacerlo de vez en cuando para que no arrastre datos viejos.',
            },
            {
              tipo: 'nota',
              tono: 'ojo',
              titulo: 'Lo que no se pega nunca',
              texto:
                'Contraseñas, números de tarjeta, historias clínicas, salarios de personas con nombre propio y datos personales de clientes que no hacen falta para la tarea. Para redactar un acta basta con "la jefa de compras de Alimentos del Valle"; la cédula no aporta nada.',
            },
            {
              tipo: 'comparar',
              antes: {
                titulo: 'Con datos de más',
                texto:
                  'Redacta el correo de cobro para Juan Pérez, cédula 79.555.123, celular 310 555 0101, que debe 4.200.000 de la factura 881.',
              },
              despues: {
                titulo: 'Con lo necesario',
                texto:
                  'Redacta un correo de cobro para un cliente de hace cinco años con la factura 881 vencida hace 30 días. Tono cordial y firme, máximo 120 palabras.',
              },
            },
          ],
          chequeo: [
            {
              id: 'q1',
              enunciado: 'Activas el conocimiento de la empresa y preguntas por un contrato. ¿Qué documentos puede usar ChatGPT?',
              opciones: [
                {
                  texto: 'Todos los de las herramientas conectadas, sin importar los permisos.',
                  explicacion: 'Respeta los permisos: no gana acceso nuevo por estar conectado.',
                },
                {
                  texto: 'Solo los que tu cuenta ya puede abrir.',
                  correcta: true,
                  explicacion: 'Correcto. Lo que tú no puedes abrir, él tampoco.',
                },
                {
                  texto: 'Ninguno: esa opción solo cambia el tono de la respuesta.',
                  explicacion: 'Sí consulta las fuentes de la empresa, dentro de tus permisos.',
                },
              ],
            },
            {
              id: 'q2',
              enunciado: 'Necesitas resumir un informe interno. ¿Desde qué cuenta lo haces?',
              opciones: [
                {
                  texto: 'Desde la cuenta corporativa.',
                  correcta: true,
                  explicacion: 'Correcto. Ahí el contenido no se usa para entrenar de forma predeterminada.',
                },
                {
                  texto: 'Desde la personal, que tiene la conversación anterior.',
                  explicacion: 'La comodidad no justifica sacar material de la empresa a una cuenta personal.',
                },
                {
                  texto: 'Da igual, las dos cuentas tratan los datos igual.',
                  explicacion: 'No los tratan igual: esa es justamente la diferencia.',
                },
              ],
            },
          ],
        },
        {
          slug: 'que-herramienta-usar',
          tipo: 'lectura',
          titulo: 'Qué herramienta para qué tarea',
          minutos: 12,
          resumen: 'Chat, bloque editable, voz, GPT, Deep Research, Agent Mode o Codex: cada una resuelve un tipo de trabajo.',
          objetivos: [
            'Reconocer el tipo de tarea antes de abrir una herramienta.',
            'Evitar gastar una investigación de varios minutos en una pregunta de dos líneas.',
            'Saber cuándo una tarea es para el agente y cuándo no.',
          ],
          bloques: [
            {
              tipo: 'texto',
              texto:
                'Todas viven en la misma ventana, y eso confunde: parece que todo es "preguntarle a ChatGPT". La pregunta útil es otra: ¿qué necesito que salga de acá? Un texto, un dato con fuente, una tarea hecha o un proceso que se repita.',
            },
            {
              tipo: 'conceptos',
              items: [
                {
                  termino: 'Chat',
                  definicion: 'Preguntas, borradores cortos, resúmenes, ideas. La mayoría del trabajo empieza y termina acá.',
                },
                {
                  termino: 'Bloque editable',
                  definicion:
                    'Cuando el encargo es un documento o un código largo, la respuesta llega en un bloque que se corrige por partes. Es lo que antes se llamaba Canvas.',
                },
                {
                  termino: 'Voz',
                  definicion: 'Conversación hablada donde no hay teclado: en ruta, en bodega, antes de una reunión.',
                },
                {
                  termino: 'GPT',
                  definicion: 'Un asistente con instrucciones fijas y archivos de referencia, para una tarea que el equipo repite.',
                },
                {
                  termino: 'Deep Research',
                  definicion: 'Un informe con fuentes citadas que toma varios minutos. Para mercado, competencia o normativa.',
                },
                {
                  termino: 'Agent Mode',
                  definicion: 'Ejecuta tareas de varios pasos en un navegador: entra a portales, compara, llena formularios.',
                },
                {
                  termino: 'Codex',
                  definicion: 'Agente técnico: convierte un proceso de datos que se hace a mano cada mes en algo repetible.',
                },
              ],
            },
            {
              tipo: 'hoja',
              titulo: 'Cinco tareas, cinco herramientas',
              columnas: ['La tarea', 'La herramienta', 'Por qué'],
              filas: [
                ['Responder un correo difícil', 'Chat', 'Es corto y se revisa de una'],
                ['La propuesta de dos páginas', 'Bloque editable', 'Se corrige por secciones'],
                ['Qué ofrece la competencia en Chile', 'Deep Research', 'Necesita fuentes y varias búsquedas'],
                ['Descargar facturas de tres portales', 'Agent Mode', 'Son pasos en sitios web'],
                ['Unir doce archivos mensuales', 'Codex', 'Se repite igual cada mes'],
              ],
            },
            {
              tipo: 'nota',
              tono: 'dato',
              titulo: 'Las consultas tienen cupo',
              texto:
                'Deep Research y Agent Mode tienen un número de usos por periodo según el plan. Gastarlas en lo que una pregunta normal resuelve deja al equipo sin ellas cuando de verdad hacen falta.',
            },
          ],
          chequeo: [
            {
              id: 'q1',
              enunciado: 'Necesitas un panorama de la normativa de facturación electrónica en tres países, con la norma de cada dato. ¿Qué usas?',
              opciones: [
                {
                  texto: 'Una pregunta en el chat.',
                  explicacion: 'Puede servir de arranque, pero lo que se pide es un informe con fuentes de varios países.',
                },
                {
                  texto: 'Deep Research.',
                  correcta: true,
                  explicacion: 'Correcto. Varias búsquedas, fuentes citadas y un informe al final.',
                },
                {
                  texto: 'Agent Mode.',
                  explicacion: 'El agente ejecuta pasos en sitios; aquí lo que hace falta es investigar y citar.',
                },
              ],
            },
          ],
        },
        {
          slug: 'el-prompt-que-funciona',
          tipo: 'lectura',
          titulo: 'El pedido que funciona',
          minutos: 15,
          resumen: 'Para quién, para qué, con qué datos, en qué formato y qué no inventar. Y después, corregir.',
          objetivos: [
            'Escribir un pedido con las cinco partes que cambian el resultado.',
            'Corregir sobre lo que ya salió en vez de empezar de nuevo.',
            'Pedirle que pregunte lo que le falta antes de responder.',
          ],
          bloques: [
            {
              tipo: 'comparar',
              antes: {
                titulo: 'El pedido vago',
                texto: 'Hazme un correo para el cliente del retraso.',
              },
              despues: {
                titulo: 'El pedido completo',
                texto:
                  'Redacta un correo para Marcela Ruiz, jefa de compras de Alimentos del Valle, avisando que el pedido 4471 se atrasa dos semanas por un problema del proveedor de empaques. Es cliente hace seis años y ya pagó el 50%. Tono formal pero cercano, máximo 150 palabras, que arranque con la fecha nueva y cierre proponiendo una llamada esta semana. No ofrezcas descuentos ni compensaciones: no están aprobados.',
              },
            },
            {
              tipo: 'texto',
              texto:
                'La diferencia entre los dos no es la longitud, es la información. El primero obliga a ChatGPT a suponer el nombre, la causa, el tono y qué ofrecer. El segundo le deja una sola forma razonable de hacerlo.',
            },
            {
              tipo: 'lista',
              ordenada: true,
              items: [
                'Para quién es: la persona, su cargo, su relación con la empresa.',
                'Qué se necesita: el objetivo del texto en una frase.',
                'Los datos reales: cifras, fechas, nombres, lo que ya pasó.',
                'El formato: extensión, tono, estructura, cómo empieza y cómo termina.',
                'Los límites: qué no debe inventar, prometer ni mencionar.',
              ],
            },
            {
              tipo: 'subtitulo',
              texto: 'Corregir, no arrancar otra vez',
            },
            {
              tipo: 'texto',
              texto:
                'La primera respuesta casi nunca es la final. Si salió muy larga, muy técnica o con un tono raro, se pide el ajuste sobre lo que ya está: "más corto", "sin tecnicismos", "quita el segundo párrafo". Escribir un prompt nuevo desde cero bota lo que ya estaba bien.',
            },
            {
              tipo: 'prompt',
              etiqueta: 'Cuando no tienes todos los datos',
              texto:
                'Antes de redactar, hazme las preguntas que necesites para que el correo quede bien. Máximo cinco, y espera mis respuestas.',
            },
            {
              tipo: 'nota',
              tono: 'clave',
              titulo: 'Guarda lo que te funcionó',
              texto:
                'El pedido que salió bien a la primera se guarda. Si lo usas cada semana, es candidato a GPT del área, y eso lo vemos en el nivel 2.',
            },
          ],
          chequeo: [
            {
              id: 'q1',
              enunciado: 'La respuesta quedó bien pero demasiado larga. ¿Qué haces?',
              opciones: [
                {
                  texto: 'Escribes todo el pedido otra vez con "corto" al final.',
                  explicacion: 'Se pierde lo que ya estaba bien y gastas más tiempo.',
                },
                {
                  texto: 'Pides "déjalo en la mitad, sin cambiar las cifras" sobre la misma respuesta.',
                  correcta: true,
                  explicacion: 'Correcto. Se corrige sobre lo que ya salió.',
                },
                {
                  texto: 'Lo recortas a mano, porque ChatGPT no sabe acortar.',
                  explicacion: 'Sí sabe, y más rápido. Si el recorte queda mal, se ajusta de nuevo.',
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
          resumen: 'Convierte un pedido vago en uno que un colega podría reutilizar.',
          bloques: [
            {
              tipo: 'texto',
              texto:
                'Vas a escribir el pedido de verdad, no una fórmula. No hay una única respuesta correcta: te revisamos contra una rúbrica de cinco puntos y después ves cómo lo escribimos nosotros.',
            },
          ],
          caso: {
            rol: 'Analista de talento humano',
            tarea: 'Anunciar el cambio de horario de los viernes',
            situacion:
              'Tu jefa te dice: "saca el comunicado del horario nuevo". Desde el 1 de octubre, los viernes la jornada termina a las 2 p. m. para el personal administrativo; bodega y atención al cliente siguen igual porque tienen turnos. La medida es una prueba de tres meses y se evalúa en enero. La gerencia no quiere que se interprete como un beneficio permanente.',
          },
          consigna: 'Escribe el pedido que le darías a ChatGPT para redactar ese comunicado.',
          placeholder: 'Redacta un comunicado para...',
          rubrica: [
            { id: 'destinatario', titulo: 'Destinatario', pregunta: '¿Dice a quién va dirigido el comunicado y a quién no aplica?' },
            { id: 'objetivo', titulo: 'Objetivo', pregunta: '¿Dice qué cambia y desde cuándo?' },
            { id: 'contexto', titulo: 'Contexto', pregunta: '¿Incluye que es una prueba de tres meses que se evalúa en enero?' },
            { id: 'formato', titulo: 'Formato y tono', pregunta: '¿Pide un tono y una extensión concretos?' },
            { id: 'limites', titulo: 'Límites', pregunta: '¿Pide explícitamente no presentarlo como un beneficio permanente?' },
          ],
          pistas: [
            'Piensa en la persona de bodega que lee el comunicado: ¿le queda claro que a ella no le aplica?',
            'Lo que la gerencia no quiere que se entienda es tan importante como lo que sí.',
          ],
          solucion:
            'Redacta un comunicado interno para el personal administrativo anunciando que, desde el 1 de octubre, los viernes la jornada termina a las 2 p. m. Aclara que bodega y atención al cliente mantienen su horario porque trabajan por turnos. Contexto: es una prueba de tres meses que se evalúa en enero. Quiero: máximo 150 palabras, tono cercano y claro, con la fecha y el horario en la primera línea y un cierre que invite a escribir a talento humano con dudas. No lo presentes como un beneficio permanente ni prometas que continuará después de la prueba.',
        },
        {
          slug: 'examen-fundamentos',
          tipo: 'examen',
          titulo: 'Examen del nivel 0',
          minutos: 10,
          resumen: 'Seis preguntas sobre el modelo, los datos, las herramientas y el pedido. Se aprueba con 80%.',
          aprobacion: 80,
          preguntas: [
            {
              id: 'e1',
              enunciado: '¿Por qué ChatGPT puede dar una cifra falsa con total seguridad?',
              opciones: [
                {
                  texto: 'Porque produce la respuesta más probable, aunque no tenga el dato.',
                  correcta: true,
                  explicacion: 'Correcto. Sin el dato en el contexto, lo suple con algo que suena bien.',
                },
                {
                  texto: 'Porque está configurado para mentir cuando no sabe.',
                  explicacion: 'No miente a propósito: completa con lo más probable.',
                },
                {
                  texto: 'Eso solo pasa con los modelos gratuitos.',
                  explicacion: 'Puede pasar con cualquier modelo si el dato no está en el contexto.',
                },
              ],
            },
            {
              id: 'e2',
              enunciado: '¿Qué distingue a la cuenta corporativa de una personal, para el material de trabajo?',
              opciones: [
                {
                  texto: 'La corporativa responde más rápido.',
                  explicacion: 'La diferencia que importa acá no es la velocidad.',
                },
                {
                  texto: 'En la corporativa el contenido no se usa para entrenar de forma predeterminada.',
                  correcta: true,
                  explicacion: 'Correcto. Por eso el trabajo va siempre por ahí.',
                },
                {
                  texto: 'Ninguna, son iguales.',
                  explicacion: 'El tratamiento de los datos es distinto.',
                },
              ],
            },
            {
              id: 'e3',
              enunciado: 'Necesitas descargar las facturas del mes de tres portales de proveedores y armar una tabla. ¿Qué herramienta encaja?',
              opciones: [
                {
                  texto: 'Deep Research.',
                  explicacion: 'Deep Research investiga y cita; no entra a portales con tu sesión.',
                },
                {
                  texto: 'Agent Mode.',
                  correcta: true,
                  explicacion: 'Correcto. Son pasos en sitios web donde ya tienes sesión.',
                },
                {
                  texto: 'Un GPT.',
                  explicacion: 'Un GPT responde con instrucciones fijas, no navega portales.',
                },
              ],
            },
            {
              id: 'e4',
              enunciado: '¿Qué le falta a "saca el comunicado del horario nuevo"?',
              opciones: [
                {
                  texto: 'Nada, ChatGPT entiende el contexto.',
                  explicacion: 'No sabe qué horario, para quién ni con qué condiciones.',
                },
                {
                  texto: 'Destinatarios, el cambio con su fecha, el contexto, el formato y los límites.',
                  correcta: true,
                  explicacion: 'Correcto. Esas partes son las que cambian el resultado.',
                },
                {
                  texto: 'Solo la palabra "por favor".',
                  explicacion: 'La cortesía no reemplaza la información.',
                },
              ],
            },
            {
              id: 'e5',
              enunciado: 'Vas a pedir un correo de cobro. ¿Qué dato sobra?',
              opciones: [
                {
                  texto: 'El número de la factura vencida.',
                  explicacion: 'Ese dato sí hace falta para el correo.',
                },
                {
                  texto: 'La cédula y el celular del cliente.',
                  correcta: true,
                  explicacion: 'Correcto. No aportan nada al texto y son datos personales.',
                },
                {
                  texto: 'Los días de vencimiento.',
                  explicacion: 'Ese dato define el tono del correo.',
                },
              ],
            },
            {
              id: 'e6',
              enunciado: 'La respuesta salió casi bien, pero con un párrafo de más. ¿Qué es más eficiente?',
              opciones: [
                {
                  texto: 'Pedir que quite ese párrafo y deje el resto igual.',
                  correcta: true,
                  explicacion: 'Correcto. Se corrige sobre lo que ya salió.',
                },
                {
                  texto: 'Abrir un chat nuevo y pedirlo todo otra vez.',
                  explicacion: 'Pierdes lo que ya funcionaba y el contexto de la conversación.',
                },
                {
                  texto: 'Aceptarlo así.',
                  explicacion: 'Lo que sale con tu nombre queda como tú quieres.',
                },
              ],
            },
          ],
        },
      ],
    },

    /* ------------------------------------------------------------ nivel 1 */
    {
      slug: 'documentos',
      nivel: 'basico',
      modulo: 'canvas',
      titulo: 'Documentos editables',
      descripcion:
        'Del encargo al documento listo en una sola sesión: estructura primero, datos reales temprano y cambios por selección.',
      lecciones: [
        {
          slug: 'del-encargo-al-documento',
          tipo: 'lectura',
          titulo: 'Del encargo al documento',
          minutos: 14,
          resumen: 'Una sola versión, armada por partes, que se copia una vez al final.',
          objetivos: [
            'Reconocer cuándo la respuesta llega en un bloque editable.',
            'Armar un documento empezando por la estructura.',
            'Evitar las tres versiones circulando por correo.',
          ],
          bloques: [
            {
              tipo: 'texto',
              texto:
                'Cuando le pides un texto largo, como una propuesta, un instructivo o una política, ChatGPT lo entrega en un bloque editable dentro de la respuesta. Ahí se puede seleccionar un párrafo, pedir el cambio sobre él y dejar el resto intacto. Es lo que antes se llamaba Canvas: ya no está en GPT-5.5 y sigue solo en los modelos anteriores mientras se apagan. No hace falta buscar un botón; el bloque aparece cuando el encargo lo amerita.',
            },
            {
              tipo: 'comparar',
              antes: {
                titulo: 'Como se hacía',
                texto:
                  'Se pide el texto en el chat, se copia a Word, se corrige allá, se vuelve a pegar para el siguiente ajuste, y al quinto ciclo nadie sabe cuál es la versión buena.',
              },
              despues: {
                titulo: 'Como se hace',
                texto:
                  'El documento se arma en un bloque y se corrige por partes. Hay una sola versión y se copia una sola vez, cuando está lista.',
              },
            },
            {
              tipo: 'subtitulo',
              texto: 'El orden que ahorra tiempo',
            },
            {
              tipo: 'lista',
              ordenada: true,
              items: [
                'Pide primero la estructura: los títulos de las secciones. Corregir un índice cuesta un minuto.',
                'Aprobada la estructura, pide el desarrollo con los datos reales: cifras, nombres y fechas verdaderas.',
                'Corrige sección por sección, un cambio a la vez.',
                'Revisa el documento completo, sin corchetes de plantilla, antes de copiarlo.',
                'Cierra pidiendo en la misma conversación el correo que lo acompaña.',
              ],
            },
            {
              tipo: 'prompt',
              etiqueta: 'Estructura primero',
              texto:
                'Voy a escribir la propuesta para Ferretería La 14: implementación del inventario en tres sedes. Antes de redactar, dame solo los títulos de las secciones y una línea de qué va en cada una.',
            },
            {
              tipo: 'nota',
              tono: 'ojo',
              titulo: 'Datos de relleno',
              texto:
                'Un borrador con "[cliente]" y "XX millones" se ve terminado y no lo está. Mete los datos reales desde el segundo paso: con relleno estás corrigiendo un documento que no existe.',
            },
          ],
          chequeo: [
            {
              id: 'q1',
              enunciado: '¿Por qué conviene pedir primero la estructura de una propuesta?',
              opciones: [
                {
                  texto: 'Porque corregir un índice es mucho más barato que corregir cinco páginas mal ordenadas.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'Porque ChatGPT no puede escribir documentos largos de una.',
                  explicacion: 'Sí puede; el punto es corregir cuando todavía es barato.',
                },
                {
                  texto: 'Porque así el documento sale más largo.',
                  explicacion: 'El objetivo no es la longitud, es el orden.',
                },
              ],
            },
          ],
        },
        {
          slug: 'corregir-por-seleccion',
          tipo: 'lectura',
          titulo: 'Corregir por selección',
          minutos: 12,
          resumen: 'Se marca el párrafo, se pide el cambio ahí y lo demás no se toca.',
          objetivos: [
            'Pedir un cambio sobre una sección sin dañar el resto.',
            'Distinguir un cambio local de uno global.',
            'Sacar la versión corta del mismo contenido.',
          ],
          bloques: [
            {
              tipo: 'texto',
              texto:
                'El error más común es pedir diez cambios en un mensaje. ChatGPT los hace todos, reescribe de arriba a abajo y de paso cambia lo que ya estaba aprobado. La alternativa es seleccionar el párrafo dentro del bloque y escribir el ajuste ahí: el cambio queda limitado a esa parte.',
            },
            {
              tipo: 'conceptos',
              items: [
                {
                  termino: 'Cambio local',
                  definicion: 'Sobre una selección: "solo este párrafo, más concreto y con entregables numerados".',
                },
                {
                  termino: 'Cambio global',
                  definicion:
                    'Sobre todo el documento, con lo que no se toca dicho explícitamente: "todo en un tono más directo, sin cambiar cifras ni nombres".',
                },
                {
                  termino: 'Versión derivada',
                  definicion: 'Otro formato del mismo contenido: el correo de diez líneas, el resumen para el comité.',
                },
              ],
            },
            {
              tipo: 'chat',
              titulo: 'Un cambio local',
              pregunta: 'Solo el párrafo de alcance: más concreto, con entregables numerados y sin adjetivos. No toques el resto.',
              respuesta:
                'Actualicé el alcance con cinco entregables numerados y quité los adjetivos. El resto del documento quedó igual.',
            },
            {
              tipo: 'prompt',
              etiqueta: 'Recorte',
              texto: 'Recorta esto a una página conservando el precio, el alcance y el siguiente paso.',
            },
            {
              tipo: 'prompt',
              etiqueta: 'Versión de correo',
              texto: 'Del mismo contenido, dame una versión de correo de máximo diez líneas para mandarla hoy.',
            },
            {
              tipo: 'nota',
              tono: 'clave',
              titulo: 'Un cambio a la vez',
              texto:
                'Revisar entre un cambio y otro es lo que permite saber qué hizo cada instrucción. Si algo se daña, sabes cuál fue.',
            },
          ],
          chequeo: [
            {
              id: 'q1',
              enunciado: 'Quieres un tono más directo en todo el documento sin que se muevan las cifras. ¿Cómo lo pides?',
              opciones: [
                {
                  texto: '"Más directo."',
                  explicacion: 'Sin decir qué no se toca, puede cambiar cifras o nombres de paso.',
                },
                {
                  texto: '"Todo el documento más directo, sin cambiar cifras ni nombres."',
                  correcta: true,
                  explicacion: 'Correcto. Un cambio global con sus límites explícitos.',
                },
                {
                  texto: 'Seleccionando cada párrafo uno por uno.',
                  explicacion: 'Funciona, pero un cambio global bien delimitado es más rápido.',
                },
              ],
            },
          ],
        },
        {
          slug: 'practica-propuesta',
          tipo: 'practica',
          titulo: 'Práctica: la propuesta en una sesión',
          minutos: 20,
          resumen: 'Planea la secuencia de pedidos para sacar una propuesta hoy, sin versiones cruzadas.',
          bloques: [
            {
              tipo: 'texto',
              texto:
                'No vas a escribir la propuesta: vas a escribir los pedidos que le harías a ChatGPT, en orden, para llegar a ella. Lo que se revisa es la secuencia y la calidad de cada pedido.',
            },
          ],
          caso: {
            rol: 'Ejecutiva comercial',
            tarea: 'Enviar hoy la propuesta a Ferretería La 14',
            situacion:
              'Ferretería La 14 quiere implementar el software de inventario en sus tres sedes de Cali. Acordaron en la reunión: alcance de tres sedes, capacitación de 12 personas, arranque el 15 de octubre y un precio de 48 millones más IVA, pagadero en dos cuotas. El gerente, Andrés Molina, pidió "algo corto, que se entienda sin leerlo dos veces". Tienes que mandarla hoy con un correo corto.',
          },
          consigna:
            'Escribe la secuencia de pedidos (entre tres y cinco) que le harías a ChatGPT para llegar a la propuesta final y al correo.',
          placeholder: '1. ...\n2. ...\n3. ...',
          rubrica: [
            { id: 'estructura', titulo: 'Estructura primero', pregunta: '¿El primer pedido es la estructura o el índice, antes del desarrollo?' },
            { id: 'datos', titulo: 'Datos reales', pregunta: '¿Incluye los datos del caso (sedes, personas, fecha, precio y forma de pago)?' },
            { id: 'formato', titulo: 'Formato', pregunta: '¿Pide una extensión o un tono acordes a lo que pidió el gerente?' },
            { id: 'local', titulo: 'Cambio acotado', pregunta: '¿Al menos un pedido es un ajuste sobre una sección, diciendo qué no se toca?' },
            { id: 'cierre', titulo: 'Correo de cierre', pregunta: '¿Termina pidiendo el correo que acompaña la propuesta, en la misma conversación?' },
          ],
          pistas: [
            '"Algo corto, que se entienda sin leerlo dos veces" es una instrucción de formato. Úsala.',
            'Piensa en qué sección suele salir floja en una propuesta: ese es tu cambio acotado.',
          ],
          solucion:
            '1. "Voy a escribir la propuesta para Andrés Molina, gerente de Ferretería La 14, para implementar nuestro software de inventario en sus tres sedes de Cali. Dame solo los títulos de las secciones y una línea de qué va en cada una. Máximo seis secciones."\n\n2. "Bien. Redáctala completa con estos datos: tres sedes, capacitación para 12 personas, arranque el 15 de octubre, precio de 48 millones más IVA en dos cuotas. Máximo una página y media, frases cortas, sin tecnicismos: el gerente pidió algo que se entienda sin leerlo dos veces. No agregues servicios que no mencioné."\n\n3. "Solo la sección de alcance: numera los entregables y quita los adjetivos. No toques el precio ni las fechas."\n\n4. "Dame un correo para Andrés de máximo ocho líneas que acompañe la propuesta, con la fecha de arranque y el precio en el primer párrafo, y que cierre pidiendo confirmación esta semana."',
        },
      ],
    },
    {
      slug: 'voz',
      nivel: 'basico',
      modulo: 'voice',
      titulo: 'Modo voz',
      descripcion:
        'Conversación hablada para dictar, consultar y ensayar donde no hay teclado, con cámara cuando hace falta mostrar.',
      lecciones: [
        {
          slug: 'la-voz-en-el-trabajo',
          tipo: 'lectura',
          titulo: 'La voz en el trabajo',
          minutos: 12,
          resumen: 'Dónde sirve, cómo se conversa y por qué se cierra siempre con el resumen escrito.',
          objetivos: [
            'Reconocer las situaciones donde la voz le gana al teclado.',
            'Dar el contexto al empezar y cortar cuando se desvía.',
            'Terminar con los compromisos por escrito.',
          ],
          bloques: [
            {
              tipo: 'texto',
              texto:
                'La voz de ChatGPT es una conversación de ida y vuelta: se puede interrumpir, busca en la web y recuerda lo que ya trabajaste. Sirve donde el teclado estorba: saliendo de una visita, en bodega, en obra, en los diez minutos antes de una reunión difícil. Desde el celular también se puede compartir la cámara o la pantalla para mostrarle lo que tienes al frente.',
            },
            {
              tipo: 'comparar',
              antes: {
                titulo: 'Sin voz',
                texto:
                  'El asesor llega a la oficina a las seis, se acuerda de la mitad de lo que se habló en tres visitas y escribe actas genéricas que no sirven para el seguimiento.',
              },
              despues: {
                titulo: 'Con voz',
                texto:
                  'Dicta cada visita apenas sale, en el carro. Llega con las tres actas redactadas y solo las revisa.',
              },
            },
            {
              tipo: 'lista',
              ordenada: true,
              items: [
                'Di dónde estás y qué necesitas: "vengo saliendo de una visita de postventa" cambia por completo el acta.',
                'Muestra en vez de describir: si puedes usar la cámara, apuntar al tablero es más exacto que explicarlo.',
                'Interrumpe cuando se desvíe: es una conversación, no hay que esperar a que termine.',
                'Cierra pidiendo el resumen escrito: los puntos y los compromisos son lo que queda para el reporte.',
              ],
            },
            {
              tipo: 'prompt',
              etiqueta: 'Acta dictada',
              texto:
                'Voy saliendo de la visita. Te dicto lo que pasó y me devuelves el acta con compromisos, responsable y fecha.',
            },
            {
              tipo: 'prompt',
              etiqueta: 'Ensayo',
              texto:
                'Vas a ser un cliente molesto porque el pedido llegó tarde. Yo contesto y al final me dices qué mejoro en el tono y en los argumentos.',
            },
            {
              tipo: 'nota',
              tono: 'ojo',
              titulo: 'Lo que se dice también cuenta',
              texto:
                'No dictes datos personales de clientes ni muestres a la cámara documentos con información sensible que no hace falta. Para el acta basta con el cargo y la empresa.',
            },
          ],
          chequeo: [
            {
              id: 'q1',
              enunciado: 'Terminas de dictarle una visita. ¿Qué haces antes de cerrar?',
              opciones: [
                {
                  texto: 'Cerrar: la conversación queda guardada.',
                  explicacion: 'Una conversación hablada no es un acta. Falta el resumen con compromisos.',
                },
                {
                  texto: 'Pedir el resumen escrito con compromisos, responsable y fecha.',
                  correcta: true,
                  explicacion: 'Correcto. Eso es lo que va al reporte.',
                },
                {
                  texto: 'Pedirle que te lo recuerde mañana.',
                  explicacion: 'El resumen se pide mientras la visita está fresca.',
                },
              ],
            },
          ],
        },
        {
          slug: 'ensayar-con-voz',
          tipo: 'lectura',
          titulo: 'Ensayar la conversación difícil',
          minutos: 10,
          resumen: 'Un juego de roles antes de la reunión real, con retroalimentación al final.',
          objetivos: [
            'Armar un ensayo con un rol concreto y una situación real.',
            'Pedir retroalimentación útil, no aplausos.',
            'Usar la voz para repasar antes de entrar.',
          ],
          bloques: [
            {
              tipo: 'texto',
              texto:
                'Una de las mejores formas de usar la voz es ensayar: una negociación, una mala noticia, una entrevista. ChatGPT hace el papel de la otra persona, tú respondes en voz alta y al final te dice qué funcionó y qué no. El ensayo sirve si el papel está bien definido.',
            },
            {
              tipo: 'comparar',
              antes: {
                titulo: 'Ensayo vago',
                texto: 'Hagamos de cuenta que eres un cliente.',
              },
              despues: {
                titulo: 'Ensayo útil',
                texto:
                  'Vas a ser el jefe de compras de una cadena de droguerías que lleva dos entregas tardías y amenaza con cambiar de proveedor. Eres directo y pides descuento. Yo soy la ejecutiva de cuenta. Después de cinco intercambios, para y dime tres cosas que mejoraría en mis respuestas.',
              },
            },
            {
              tipo: 'prompt',
              etiqueta: 'Repaso antes de entrar',
              texto:
                'Antes de entrar a la reunión con el cliente, repásame en un minuto los tres puntos que quedaron pendientes la vez pasada.',
            },
            {
              tipo: 'nota',
              tono: 'dato',
              titulo: 'Si hay ruido',
              texto:
                'En un sitio ruidoso la voz se equivoca y la conversación se vuelve una pelea con el micrófono. Busca un rincón silencioso o pasa a texto.',
            },
          ],
          chequeo: [
            {
              id: 'q1',
              enunciado: '¿Qué hace útil un ensayo con voz?',
              opciones: [
                {
                  texto: 'Que el papel y la situación estén bien definidos, y pedir retroalimentación al final.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'Que dure lo más posible.',
                  explicacion: 'La duración no mejora el ensayo; el papel bien definido sí.',
                },
                {
                  texto: 'Que ChatGPT sea amable para ganar confianza.',
                  explicacion: 'Un ensayo demasiado amable no prepara para la reunión real.',
                },
              ],
            },
          ],
        },
        {
          slug: 'practica-acta-dictada',
          tipo: 'practica',
          titulo: 'Práctica: el acta que se dicta en el carro',
          minutos: 15,
          resumen: 'Escribe lo que le dirías a la voz para salir de una visita con el acta lista.',
          bloques: [
            {
              tipo: 'texto',
              texto:
                'Escribe, como si lo dijeras en voz alta, lo que le dirías a ChatGPT al salir de la visita. Incluye cómo arrancas, qué le cuentas y cómo cierras.',
            },
          ],
          caso: {
            rol: 'Asesor de postventa',
            tarea: 'Documentar una visita apenas termina',
            situacion:
              'Acabas de salir de la planta de Lácteos Andinos. Hablaste con Carolina Gómez, jefa de mantenimiento. La empacadora 2 sigue fallando en el sellado; tú quedaste de enviar un técnico el jueves y ella de dejar la máquina parada desde las 7 a. m. También pidió la cotización del kit de repuestos, que tú envías el viernes. Tienes dos visitas más hoy.',
          },
          consigna: 'Escribe lo que le dirías a la voz, de principio a fin.',
          placeholder: 'Vengo saliendo de...',
          rubrica: [
            { id: 'contexto', titulo: 'Contexto al arrancar', pregunta: '¿Dice de dónde viene y qué tipo de visita fue?' },
            { id: 'hechos', titulo: 'Lo que pasó', pregunta: '¿Cuenta el problema de la empacadora con el detalle necesario?' },
            { id: 'compromisos', titulo: 'Compromisos', pregunta: '¿Menciona los compromisos de ambas partes con su fecha?' },
            { id: 'formato', titulo: 'Formato del acta', pregunta: '¿Pide un formato concreto: compromisos, responsable y fecha?' },
            { id: 'datos', titulo: 'Datos necesarios', pregunta: '¿Se limita al cargo y la empresa, sin datos personales que no hacen falta?' },
          ],
          pistas: [
            'Empieza como empezarías con un colega: "vengo saliendo de...".',
            'Hay dos compromisos tuyos y uno de ella. ¿Los tienes los tres?',
          ],
          solucion:
            'Vengo saliendo de una visita de postventa en Lácteos Andinos, con la jefa de mantenimiento. Te cuento y me devuelves el acta. La empacadora 2 sigue fallando en el sellado, el mismo problema de la visita anterior. Compromisos: yo envío un técnico el jueves; ella deja la máquina parada desde las 7 de la mañana de ese día; yo le mando la cotización del kit de repuestos el viernes. Devuélveme el acta con un resumen de dos líneas y una tabla de compromisos con responsable y fecha. Nada más: tengo dos visitas más y las dicto igual.',
        },
      ],
    },
    {
      slug: 'imagenes',
      nivel: 'basico',
      modulo: 'images',
      titulo: 'Imágenes',
      descripcion:
        'Generar y editar imágenes para piezas internas y material de apoyo, con el uso claro antes que el estilo.',
      lecciones: [
        {
          slug: 'imagenes-que-sirven',
          tipo: 'lectura',
          titulo: 'Imágenes que sirven',
          minutos: 12,
          resumen: 'El uso primero, el texto por fuera y la marca antes de publicar.',
          objetivos: [
            'Pedir una imagen diciendo dónde se va a ver.',
            'Saber por qué el texto y el logo se ponen después.',
            'Reconocer lo que no se genera sin permiso.',
          ],
          bloques: [
            {
              tipo: 'texto',
              texto:
                'La generación de imágenes resuelve lo que hoy se busca en un banco de fotos o se espera del diseñador: la imagen de una campaña interna, el diagrama de un proceso, el retoque de una foto de producto. Lo que más cambia el resultado no es el estilo, es decir para qué es.',
            },
            {
              tipo: 'comparar',
              antes: {
                titulo: 'Sin uso',
                texto: 'Hazme una imagen bonita sobre seguridad industrial.',
              },
              despues: {
                titulo: 'Con uso',
                texto:
                  'Una imagen horizontal para la pantalla de la recepción sobre el mes de la seguridad industrial: una operaria con casco y chaleco revisando una máquina, estilo fotográfico sobrio, colores verde y gris, sin texto sobre la imagen.',
              },
            },
            {
              tipo: 'lista',
              items: [
                'Di el uso antes que el estilo: intranet, pantalla de recepción o celular definen el formato y el detalle.',
                'Deja el texto por fuera: los textos largos dentro de la imagen salen con errores. Se genera el fondo y el texto va en la plantilla.',
                'No pidas el logo dentro de la imagen: se genera el fondo y se monta el logo original.',
                'Pasa por marca antes de publicar: lo que sale con el nombre de la empresa lo revisa quien cuida la marca.',
              ],
            },
            {
              tipo: 'prompt',
              etiqueta: 'Diagrama',
              texto: 'Un diagrama simple del proceso de devoluciones con cinco pasos en línea, etiquetas cortas y sin adornos.',
            },
            {
              tipo: 'nota',
              tono: 'ojo',
              titulo: 'Personas reales',
              texto:
                'No se generan imágenes con la cara de personas del equipo sin su permiso. Para el material interno, figuras genéricas.',
            },
          ],
          chequeo: [
            {
              id: 'q1',
              enunciado: 'Necesitas una pieza con el título de la campaña. ¿Cómo lo resuelves?',
              opciones: [
                {
                  texto: 'Pides el título completo dentro de la imagen.',
                  explicacion: 'Los textos largos dentro de la imagen suelen salir con errores.',
                },
                {
                  texto: 'Generas la imagen sin texto y montas el título en la plantilla.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'Pides el título y el logo dentro de la imagen, para ahorrar un paso.',
                  explicacion: 'El logo siempre va en su versión original, montado después.',
                },
              ],
            },
          ],
        },
        {
          slug: 'editar-no-regenerar',
          tipo: 'lectura',
          titulo: 'Editar, no regenerar',
          minutos: 10,
          resumen: 'Se selecciona la parte que no sirve y se cambia solo esa.',
          objetivos: [
            'Editar una zona de la imagen sin perder la composición.',
            'Sacar variantes de encuadre de la misma imagen.',
            'Corregir una imagen recargada con instrucciones concretas.',
          ],
          bloques: [
            {
              tipo: 'texto',
              texto:
                'Lo más útil no es generar desde cero sino editar. Se selecciona una parte de la imagen y se pide el cambio ahí: el resto de la composición y la iluminación se mantiene. Regenerar completo trae una imagen nueva que hay que volver a aprobar.',
            },
            {
              tipo: 'prompt',
              etiqueta: 'Fondo',
              texto: 'De esta foto de producto, cambia solo el fondo por uno blanco limpio. No toques el producto ni la iluminación.',
            },
            {
              tipo: 'prompt',
              etiqueta: 'Formatos',
              texto:
                'De esta misma imagen dame tres variantes de encuadre: cuadrada para redes, horizontal para la intranet y vertical para el celular.',
            },
            {
              tipo: 'prompt',
              etiqueta: 'Menos es más',
              texto: 'Quedó muy recargada. Menos elementos, más espacio en blanco y que el foco quede en la operaria.',
            },
            {
              tipo: 'nota',
              tono: 'clave',
              titulo: 'Que diga lo que tiene que decir',
              texto:
                'Una imagen bonita que no comunica lo que la campaña necesita no sirve. Antes de aprobarla, pregúntate qué entiende alguien que la ve dos segundos.',
            },
          ],
          chequeo: [
            {
              id: 'q1',
              enunciado: 'La imagen está bien pero el fondo no sirve. ¿Qué haces?',
              opciones: [
                {
                  texto: 'Pides una imagen nueva desde cero.',
                  explicacion: 'Trae otra composición que hay que volver a aprobar.',
                },
                {
                  texto: 'Seleccionas el fondo y pides el cambio solo ahí.',
                  correcta: true,
                  explicacion: 'Correcto. Lo que ya estaba bien se conserva.',
                },
                {
                  texto: 'La usas así.',
                  explicacion: 'Se puede ajustar en un paso.',
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
      descripcion: 'Un examen que recorre documentos, voz e imágenes.',
      lecciones: [
        {
          slug: 'examen-basico',
          tipo: 'examen',
          titulo: 'Examen del nivel 1',
          minutos: 12,
          resumen: 'Preguntas de documentos, voz e imágenes, según lo que tengas habilitado. Se aprueba con 80%.',
          aprobacion: 80,
          preguntas: [
            {
              id: 'e1',
              modulo: 'canvas',
              enunciado: 'Buscas el botón de Canvas en GPT-5.5 y no aparece. ¿Qué pasa?',
              opciones: [
                {
                  texto: 'Tu cuenta no tiene permiso.',
                  explicacion: 'No es un tema de permisos: Canvas salió de GPT-5.5.',
                },
                {
                  texto: 'Su función pasó a los bloques editables, que aparecen solos cuando el encargo lo amerita.',
                  correcta: true,
                  explicacion: 'Correcto. Se pide el texto directo y el bloque aparece.',
                },
                {
                  texto: 'Hay que instalar una extensión.',
                  explicacion: 'No hace falta instalar nada.',
                },
              ],
            },
            {
              id: 'e2',
              modulo: 'canvas',
              enunciado: 'Tienes cinco ajustes para la propuesta. ¿Cómo los pides?',
              opciones: [
                {
                  texto: 'Los cinco en un mensaje, para terminar rápido.',
                  explicacion: 'Reescribe todo de una y es difícil saber qué dañó cada instrucción.',
                },
                {
                  texto: 'Uno a la vez, revisando entre cada uno.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'Copias a Word y los haces allá.',
                  explicacion: 'Vuelves a las versiones cruzadas que el bloque evita.',
                },
              ],
            },
            {
              id: 'e3',
              modulo: 'canvas',
              enunciado: '¿Cuándo metes las cifras y los nombres reales en el documento?',
              opciones: [
                {
                  texto: 'Al final, cuando el texto ya está aprobado.',
                  explicacion: 'Corriges un documento que no existe y después hay que ajustarlo otra vez.',
                },
                {
                  texto: 'Desde el desarrollo, apenas se aprueba la estructura.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'Nunca: los datos se ponen a mano en Word.',
                  explicacion: 'Con los datos adentro, el texto se escribe alrededor de ellos.',
                },
              ],
            },
            {
              id: 'e4',
              modulo: 'voice',
              enunciado: 'ChatGPT empieza a dar rodeos en una conversación de voz. ¿Qué haces?',
              opciones: [
                {
                  texto: 'Esperas a que termine.',
                  explicacion: 'No hace falta: la voz se puede interrumpir.',
                },
                {
                  texto: 'Lo interrumpes y pides lo concreto.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'Cierras y empiezas otra conversación.',
                  explicacion: 'Pierdes el contexto; basta con interrumpir.',
                },
              ],
            },
            {
              id: 'e5',
              modulo: 'voice',
              enunciado: 'Quieres que te explique un tablero de control con luces. ¿Qué es más eficiente?',
              opciones: [
                {
                  texto: 'Describir cada luz con palabras.',
                  explicacion: 'Funciona, pero es lento y se presta a errores.',
                },
                {
                  texto: 'Compartir la cámara desde el celular y apuntar.',
                  correcta: true,
                  explicacion: 'Correcto. Mostrar es más exacto que describir.',
                },
                {
                  texto: 'Buscar el manual y pegarlo completo.',
                  explicacion: 'Puede servir después; la cámara resuelve de una.',
                },
              ],
            },
            {
              id: 'e6',
              modulo: 'voice',
              enunciado: '¿Qué dato no hace falta dictar para el acta de una visita?',
              opciones: [
                {
                  texto: 'Los compromisos y sus fechas.',
                  explicacion: 'Eso es lo más importante del acta.',
                },
                {
                  texto: 'El número de celular personal del contacto.',
                  correcta: true,
                  explicacion: 'Correcto. Basta con el cargo y la empresa.',
                },
                {
                  texto: 'El tipo de visita.',
                  explicacion: 'Ese contexto cambia cómo se redacta el acta.',
                },
              ],
            },
            {
              id: 'e7',
              modulo: 'images',
              enunciado: '¿Qué va primero en el pedido de una imagen?',
              opciones: [
                {
                  texto: 'El estilo artístico.',
                  explicacion: 'El estilo importa, pero depende de dónde se va a ver.',
                },
                {
                  texto: 'El uso: dónde y en qué formato se va a ver.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'El texto que va encima.',
                  explicacion: 'El texto se monta después, en la plantilla.',
                },
              ],
            },
            {
              id: 'e8',
              modulo: 'images',
              enunciado: 'La campaña necesita la foto de una persona del equipo. ¿Qué haces?',
              opciones: [
                {
                  texto: 'Generas su cara a partir de una foto del directorio.',
                  explicacion: 'No se hace sin su permiso.',
                },
                {
                  texto: 'Pides su autorización o usas una figura genérica.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'La generas y le avisas después.',
                  explicacion: 'El permiso va antes, no después.',
                },
              ],
            },
          ],
        },
      ],
    },

    /* ------------------------------------------------------------ nivel 2 */
    {
      slug: 'gpts',
      nivel: 'intermedio',
      modulo: 'gpts',
      titulo: 'GPTs personalizados',
      descripcion:
        'Asistentes propios por tarea: instrucciones fijas, límites claros y pocos archivos buenos, para que el área responda con el mismo criterio.',
      lecciones: [
        {
          slug: 'que-es-un-gpt',
          tipo: 'lectura',
          titulo: 'Qué es un GPT y cuándo vale la pena',
          minutos: 12,
          resumen: 'El prompt que el equipo repite, convertido en un asistente que todos usan igual.',
          objetivos: [
            'Entender las tres piezas de un GPT: instrucciones, archivos y capacidades.',
            'Reconocer una tarea que merece su propio GPT.',
            'Saber dónde se crean y con quién se comparten.',
          ],
          bloques: [
            {
              tipo: 'texto',
              texto:
                'Un GPT es ChatGPT con instrucciones permanentes y hasta 20 archivos de referencia. Se configura una vez y todo el equipo lo usa con el mismo tono y los mismos límites, en vez de que cada quien improvise su prompt. Se crean desde el espacio de trabajo corporativo y se comparten con el área; en las cuentas personales ya no se pueden crear ni publicar GPTs nuevos.',
            },
            {
              tipo: 'conceptos',
              items: [
                {
                  termino: 'Instrucciones',
                  definicion: 'Quién es, qué hace, en qué formato responde y qué tiene prohibido. Es el prompt que no hay que volver a escribir.',
                },
                {
                  termino: 'Conocimiento',
                  definicion: 'Los archivos de referencia: tarifas, políticas, plantillas. Hasta 20, y funcionan mejor pocos y vigentes.',
                },
                {
                  termino: 'Capacidades',
                  definicion: 'Lo que puede usar además: búsqueda web, generación de imágenes, análisis de archivos. Se activan solo las que la tarea necesita.',
                },
              ],
            },
            {
              tipo: 'comparar',
              antes: {
                titulo: 'Sin GPT',
                texto:
                  'Cada quien tiene su prompt en un bloc de notas. El tono cambia según quién conteste y a veces se prometen cosas que la empresa no cumple.',
              },
              despues: {
                titulo: 'Con GPT',
                texto:
                  'Un GPT del área con tono, límites y tarifas cargadas. Todos parten de la misma base y solo ajustan el caso puntual.',
              },
            },
            {
              tipo: 'subtitulo',
              texto: 'Tres señales de que la tarea merece un GPT',
            },
            {
              tipo: 'lista',
              items: [
                'Se repite cada semana, con la misma estructura.',
                'La hacen varias personas y el resultado cambia según quién la haga.',
                'Tiene reglas que no se pueden romper: precios, plazos, lo que no se promete.',
              ],
            },
            {
              tipo: 'nota',
              tono: 'clave',
              titulo: 'No se empieza de cero',
              texto:
                'El mejor punto de partida es un prompt que alguien ya usa todos los días y que funciona. El GPT lo vuelve permanente y compartido.',
            },
          ],
          chequeo: [
            {
              id: 'q1',
              enunciado: '¿Cuál de estas tareas merece un GPT del área?',
              opciones: [
                {
                  texto: 'Un correo de felicitación que se escribe una vez al año.',
                  explicacion: 'No se repite lo suficiente para justificarlo.',
                },
                {
                  texto: 'Las respuestas de postventa que cinco personas escriben cada día con reglas de plazos y precios.',
                  correcta: true,
                  explicacion: 'Correcto. Se repite, varía según quién la haga y tiene reglas fijas.',
                },
                {
                  texto: 'Una investigación de mercado puntual.',
                  explicacion: 'Eso es un encargo para Deep Research, no un asistente permanente.',
                },
              ],
            },
          ],
        },
        {
          slug: 'instrucciones-que-aguantan',
          tipo: 'lectura',
          titulo: 'Instrucciones que aguantan',
          minutos: 15,
          resumen: 'Rol, formato, límites, fuentes y qué hacer cuando falta información. Y la prueba con los casos difíciles.',
          objetivos: [
            'Escribir instrucciones con límites explícitos.',
            'Amarrar las respuestas a un archivo de referencia.',
            'Probar el GPT con casos difíciles antes de compartirlo.',
          ],
          bloques: [
            {
              tipo: 'comparar',
              antes: {
                titulo: 'Instrucción vaga',
                texto: 'Eres un asistente profesional y útil que ayuda al equipo de postventa.',
              },
              despues: {
                titulo: 'Instrucción que aguanta',
                texto:
                  'Eres el asistente de postventa de Equipos del Norte. Respondes en español neutro, en máximo 150 palabras, con este formato: resumen en una línea, tres puntos de detalle y una acción concreta. Nunca prometes fechas de entrega ni das precios que no estén en "Tarifas vigentes 2026". Si falta información, la pides antes de responder. Si te preguntan por garantías legales, dices que lo revisa jurídica y ofreces redactar el correo.',
              },
            },
            {
              tipo: 'lista',
              ordenada: true,
              items: [
                'Rol: quién es y para qué área trabaja.',
                'Formato: extensión, estructura y tono.',
                'Límites: lo que nunca hace, dicho de forma explícita.',
                'Fuente: qué archivo manda para precios, plazos o políticas.',
                'Vacíos: qué hace cuando no tiene el dato.',
              ],
            },
            {
              tipo: 'prompt',
              etiqueta: 'Fuente única',
              texto:
                'Usa el documento de tarifas vigentes como única fuente de precios. Si un precio no está ahí, di que no lo tienes en vez de estimarlo.',
            },
            {
              tipo: 'subtitulo',
              texto: 'La prueba antes de compartir',
            },
            {
              tipo: 'texto',
              texto:
                'Antes de compartirlo con el área, se prueba con los casos que lo van a romper: la queja rara, el descuento que no existe, el dato que no está en los archivos. Si aguanta esos tres, se puede compartir.',
            },
            {
              tipo: 'chat',
              titulo: 'Un caso difícil bien resuelto',
              pregunta: 'El cliente dice que le prometieron 20% de descuento si pagaba de contado. ¿Se lo confirmo?',
              respuesta:
                'No encuentro ese descuento en las tarifas vigentes 2026, así que no puedo confirmarlo. Te sugiero preguntarle al cliente quién le hizo el ofrecimiento y validarlo con la jefatura comercial antes de responder. Si quieres, redacto el mensaje para ganar un día.',
            },
            {
              tipo: 'nota',
              tono: 'ojo',
              titulo: 'Lo que no se sube',
              texto:
                'Un GPT compartido lo usa todo el que tenga acceso. No se cargan documentos con datos personales, salarios ni información que no todo el área pueda leer.',
            },
          ],
          chequeo: [
            {
              id: 'q1',
              enunciado: 'El GPT de postventa da un precio que no está en las tarifas. ¿Qué le falta a sus instrucciones?',
              opciones: [
                {
                  texto: 'Más archivos de referencia.',
                  explicacion: 'Más archivos no evitan que estime lo que no encuentra.',
                },
                {
                  texto: 'Decir que las tarifas son la única fuente y qué hacer si el precio no está.',
                  correcta: true,
                  explicacion: 'Correcto. El límite y el vacío tienen que estar escritos.',
                },
                {
                  texto: 'Pedirle que sea más profesional.',
                  explicacion: 'Una instrucción vaga no cambia el comportamiento.',
                },
              ],
            },
            {
              id: 'q2',
              enunciado: '¿Cuándo está listo un GPT para compartir con el área?',
              opciones: [
                {
                  texto: 'Cuando responde bien la primera pregunta.',
                  explicacion: 'Un caso fácil no prueba los límites.',
                },
                {
                  texto: 'Cuando aguanta los casos difíciles: la queja rara, el descuento inexistente, el dato que falta.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'Cuando tiene los 20 archivos cargados.',
                  explicacion: 'Pocos archivos buenos funcionan mejor que muchos.',
                },
              ],
            },
          ],
        },
        {
          slug: 'practica-instrucciones-gpt',
          tipo: 'practica',
          titulo: 'Práctica: las instrucciones del GPT',
          minutos: 20,
          resumen: 'Escribe las instrucciones de un GPT que un área entera va a usar.',
          bloques: [
            {
              tipo: 'texto',
              texto:
                'Vas a escribir las instrucciones del GPT, tal como las pegarías en el campo de configuración. Lo que se revisa es que aguanten los casos difíciles, no que suenen bien.',
            },
          ],
          caso: {
            rol: 'Coordinadora de talento humano',
            tarea: 'Crear el GPT que responde dudas de nómina y vacaciones',
            situacion:
              'El área recibe unas 60 preguntas por semana sobre vacaciones, incapacidades y certificados. Las respuestas están en dos documentos: "Reglamento interno 2026" y "Calendario de nómina 2026". Hay temas que no se responden por chat: liquidaciones, casos disciplinarios y salarios de otras personas; esos se remiten a talento humano por el formulario de la intranet. El GPT lo va a usar todo el personal.',
          },
          consigna: 'Escribe las instrucciones completas del GPT.',
          placeholder: 'Eres el asistente de...',
          rubrica: [
            { id: 'rol', titulo: 'Rol', pregunta: '¿Dice quién es el asistente, para quién trabaja y qué temas cubre?' },
            { id: 'formato', titulo: 'Formato', pregunta: '¿Fija extensión, tono o estructura de las respuestas?' },
            { id: 'fuentes', titulo: 'Fuentes', pregunta: '¿Amarra las respuestas a los dos documentos del caso?' },
            { id: 'limites', titulo: 'Límites', pregunta: '¿Excluye liquidaciones, casos disciplinarios y salarios de otras personas?' },
            { id: 'derivacion', titulo: 'Derivación', pregunta: '¿Dice a dónde remitir lo que no responde (el formulario de la intranet)?' },
            { id: 'vacios', titulo: 'Vacíos', pregunta: '¿Dice qué hacer cuando la respuesta no está en los documentos?' },
          ],
          pistas: [
            'Piensa en la pregunta que no quieres que responda nunca, y escríbela.',
            'Lo usa todo el personal: ¿qué tono sirve para alguien de planta y para alguien de oficina?',
          ],
          solucion:
            'Eres el asistente de talento humano de la empresa. Respondes preguntas del personal sobre vacaciones, incapacidades y certificados laborales.\n\nFormato: español sencillo, máximo 120 palabras, con la respuesta en la primera línea y, si aplica, los pasos numerados. Al final, cita la sección del documento de donde sale.\n\nFuentes: responde solo con "Reglamento interno 2026" y "Calendario de nómina 2026". Si la respuesta no está en esos documentos, di que no la tienes y remite al formulario de talento humano en la intranet. No estimes fechas ni montos.\n\nLímites: no respondas sobre liquidaciones, casos disciplinarios ni salarios de otras personas, aunque insistan. En esos casos responde: "Ese tema lo atiende talento humano directamente. Escríbenos por el formulario de la intranet." No pidas ni repitas datos personales como cédula o cuenta bancaria.\n\nSi la pregunta es ambigua, pide el dato que falta antes de responder (por ejemplo, si es contrato a término fijo o indefinido).',
        },
      ],
    },
    {
      slug: 'deep-research',
      nivel: 'intermedio',
      modulo: 'deep',
      titulo: 'Deep Research',
      descripcion:
        'Informes largos con fuentes citadas sobre mercado, competencia o normativa: encargo acotado, formato claro y revisión de las fuentes.',
      lecciones: [
        {
          slug: 'cuando-deep-research',
          tipo: 'lectura',
          titulo: 'Cuándo usar Deep Research',
          minutos: 12,
          resumen: 'Planea, busca, descarta y cita. Lo importante del resultado son las fuentes.',
          objetivos: [
            'Distinguir una pregunta de una investigación.',
            'Entender cómo trabaja mientras investiga.',
            'Reservar el cupo para lo que de verdad lo necesita.',
          ],
          bloques: [
            {
              tipo: 'texto',
              texto:
                'Deep Research no contesta de una: planea, busca, descarta fuentes y se toma varios minutos antes de entregar un informe con el enlace de dónde salió cada dato. Puedes seguir el avance mientras trabaja, interrumpirlo para corregir el rumbo y limitar la búsqueda a sitios de confianza.',
            },
            {
              tipo: 'hoja',
              titulo: '¿Pregunta o investigación?',
              columnas: ['Lo que necesitas', 'Herramienta'],
              filas: [
                ['Cuál es la tasa de cambio de hoy', 'Chat con búsqueda'],
                ['Qué ofrecen tres competidores en logística en Perú', 'Deep Research'],
                ['Qué dice la norma de protección de datos sobre bases de clientes', 'Deep Research'],
                ['Cómo se escribe un correo de seguimiento', 'Chat'],
                ['Panorama del sector de alimentos empacados en dos años', 'Deep Research'],
              ],
              resaltar: [1, 2, 4],
            },
            {
              tipo: 'comparar',
              antes: {
                titulo: 'Sin Deep Research',
                texto:
                  'Alguien dedica dos días a buscar en internet, arma un documento sin fuentes y nadie sabe qué tan viejo es cada dato.',
              },
              despues: {
                titulo: 'Con Deep Research',
                texto:
                  'Se encarga el informe con fuentes, se revisa qué quedó flojo y se completa con lo que la empresa ya sabe del mercado.',
              },
            },
            {
              tipo: 'nota',
              tono: 'dato',
              titulo: 'El cupo del mes',
              texto:
                'Deep Research tiene un número de usos por periodo. Gastarlo en lo que una búsqueda normal responde deja al equipo sin él cuando llega la investigación importante.',
            },
          ],
          chequeo: [
            {
              id: 'q1',
              enunciado: '¿Qué es lo más valioso del informe de Deep Research?',
              opciones: [
                {
                  texto: 'Que está bien redactado.',
                  explicacion: 'La redacción ayuda, pero lo que lo hace utilizable son las fuentes.',
                },
                {
                  texto: 'Las fuentes citadas de cada dato.',
                  correcta: true,
                  explicacion: 'Correcto. Son lo que permite verificar y decidir.',
                },
                {
                  texto: 'Que es largo.',
                  explicacion: 'Un informe largo sin fuentes sólidas no sirve para decidir.',
                },
              ],
            },
          ],
        },
        {
          slug: 'el-encargo-de-investigacion',
          tipo: 'lectura',
          titulo: 'El encargo de investigación',
          minutos: 15,
          resumen: 'Delimitar, pedir el formato, revisar las fuentes y marcar lo que hay que confirmar.',
          objetivos: [
            'Escribir un encargo con país, segmento, periodo y decisión.',
            'Pedir el formato de salida y las fuentes permitidas.',
            'Revisar las fuentes antes que el texto.',
          ],
          bloques: [
            {
              tipo: 'comparar',
              antes: {
                titulo: 'Encargo abierto',
                texto: 'Investiga el mercado de logística.',
              },
              despues: {
                titulo: 'Encargo acotado',
                texto:
                  'Investiga qué ofrecen Coordinadora, Servientrega y Envía en logística de última milla para comercio electrónico en Colombia, en 2025 y 2026: propuesta, cobertura, precios públicos si existen y en qué se diferencian. Es para decidir con cuál hacemos una prueba piloto. Entrega una tabla comparativa y dos páginas de conclusiones. Cita la fuente de cada dato y dime al final qué no pudiste confirmar.',
              },
            },
            {
              tipo: 'lista',
              ordenada: true,
              items: [
                'Delimita: país, ciudad, segmento y periodo.',
                'Di para qué decisión es: eso le dice qué importa y qué no.',
                'Pide el formato: tabla, dos páginas, viñetas por hallazgo.',
                'Acota las fuentes cuando importa: sitios oficiales, gremios, reguladores.',
                'Pide los vacíos: qué no pudo responder con las fuentes que encontró.',
              ],
            },
            {
              tipo: 'subtitulo',
              texto: 'Cuando vuelve el informe',
            },
            {
              tipo: 'texto',
              texto:
                'Se revisan las fuentes, no el texto. Abre tres o cuatro enlaces al azar: si son sólidos y recientes, el informe sirve; si son blogs viejos, se rehace con fuentes acotadas. Los precios y las exigencias regulatorias se confirman con el proveedor o con la norma antes de llevarlos a una decisión.',
            },
            {
              tipo: 'prompt',
              etiqueta: 'Revisión crítica',
              texto:
                'De este informe, dime qué afirmaciones tienen fuente débil o desactualizada y cuáles hay que confirmar antes de presentarlas.',
            },
            {
              tipo: 'nota',
              tono: 'ojo',
              titulo: 'El comité no lee fuentes, tú sí',
              texto:
                'Llevar el informe al comité sin abrir un solo enlace es firmar datos que nadie verificó. Las cifras que sostienen la recomendación se revisan una por una.',
            },
          ],
          chequeo: [
            {
              id: 'q1',
              enunciado: '¿Por qué conviene decir para qué decisión es el informe?',
              opciones: [
                {
                  texto: 'Porque le indica qué información importa y qué puede dejar por fuera.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'Porque sin eso se niega a investigar.',
                  explicacion: 'Investiga igual, pero con menos foco.',
                },
                {
                  texto: 'No cambia nada.',
                  explicacion: 'Cambia qué prioriza y cómo concluye.',
                },
              ],
            },
          ],
        },
        {
          slug: 'practica-encargo-investigacion',
          tipo: 'practica',
          titulo: 'Práctica: el encargo a Deep Research',
          minutos: 15,
          resumen: 'Escribe un encargo de investigación que devuelva algo con qué decidir.',
          bloques: [
            {
              tipo: 'texto',
              texto:
                'Escribe el encargo tal como lo pegarías en Deep Research. Se revisa que esté acotado, que diga para qué es y que pida fuentes y vacíos.',
            },
          ],
          caso: {
            rol: 'Analista de compras',
            tarea: 'Evaluar proveedores de empaques compostables',
            situacion:
              'La gerencia quiere reemplazar el empaque plástico de la línea de snacks por uno compostable en 2027. Te piden saber qué proveedores hay en México y Colombia, qué certificaciones tienen, rangos de precio públicos y qué exige la regulación de cada país sobre empaques compostables. El comité se reúne en tres semanas y quiere una recomendación de dos proveedores para pedir muestras.',
          },
          consigna: 'Escribe el encargo completo para Deep Research.',
          placeholder: 'Investiga...',
          rubrica: [
            { id: 'alcance', titulo: 'Alcance', pregunta: '¿Delimita países, tipo de producto y periodo?' },
            { id: 'decision', titulo: 'Decisión', pregunta: '¿Dice para qué decisión es el informe?' },
            { id: 'contenido', titulo: 'Contenido', pregunta: '¿Pide proveedores, certificaciones, precios y regulación?' },
            { id: 'formato', titulo: 'Formato', pregunta: '¿Pide un formato de salida concreto?' },
            { id: 'fuentes', titulo: 'Fuentes y vacíos', pregunta: '¿Pide citar cada dato y decir qué no pudo confirmar?' },
          ],
          pistas: [
            'La regulación cambia por país: ¿de qué tipo de fuentes quieres que salga?',
            'El comité quiere dos proveedores. Eso es una instrucción de formato.',
          ],
          solucion:
            'Investiga proveedores de empaques flexibles compostables para snacks con operación en México y Colombia, con información de 2025 y 2026. Es para que el comité elija dos proveedores a los que pedir muestras, con miras a reemplazar el empaque plástico en 2027.\n\nPara cada proveedor: país, tipo de material, certificaciones de compostabilidad, capacidad o clientes conocidos y rangos de precio públicos si existen.\n\nAparte, resume qué exige la regulación de cada país sobre empaques compostables y rotulado, usando solo fuentes oficiales (normas, ministerios, autoridades ambientales), con la norma y el artículo.\n\nEntrega: una tabla comparativa de proveedores, una página de regulación por país y una recomendación de dos proveedores con sus razones. Cita la fuente de cada dato y termina con una lista de lo que no pudiste confirmar.',
        },
      ],
    },
    {
      slug: 'conocimiento-empresa',
      nivel: 'intermedio',
      modulo: 'knowledge',
      titulo: 'Conocimiento de la empresa',
      descripcion:
        'Respuestas basadas en los documentos y las herramientas de la empresa, con la cita del origen y los vacíos a la vista.',
      lecciones: [
        {
          slug: 'preguntarle-a-la-empresa',
          tipo: 'lectura',
          titulo: 'Preguntarle a la empresa',
          minutos: 14,
          resumen: 'Se activa, se pregunta como a un colega y se abre la cita.',
          objetivos: [
            'Activar el conocimiento de la empresa antes de preguntar.',
            'Entender qué fuentes consulta y con qué permisos.',
            'Verificar la respuesta en el documento citado.',
          ],
          bloques: [
            {
              tipo: 'texto',
              texto:
                'Con las herramientas del espacio de trabajo conectadas (Slack, SharePoint, Google Drive, GitHub y otras), ChatGPT responde con lo que hay en la empresa y muestra de qué documento o conversación salió cada afirmación. Respeta los permisos que ya tiene tu cuenta: lo que tú no puedes abrir, él tampoco.',
            },
            {
              tipo: 'lista',
              ordenada: true,
              items: [
                'Activa el conocimiento de la empresa: es una opción que se selecciona antes de preguntar. Sin ella, responde con conocimiento general.',
                'Pregunta como le preguntarías a un colega: no hace falta saber en qué carpeta está.',
                'Abre la cita: cada afirmación trae su enlace, y verificar toma diez segundos.',
                'Pregunta qué no encontró: ese vacío es lo que hay que preguntarle a una persona.',
              ],
            },
            {
              tipo: 'chat',
              titulo: 'Con el conocimiento de la empresa activado',
              pregunta: '¿Qué dice nuestra política de viáticos para viajes de más de tres días?',
              respuesta:
                'La política vigente es la de marzo de 2026: para viajes de más de tres días se autoriza tarifa completa y se exige legalizar dentro de los cinco días hábiles siguientes. Fuentes: Política de viáticos v4 (SharePoint), Circular de legalización (Drive). No encontré nada sobre viajes internacionales; eso habría que confirmarlo con finanzas.',
            },
            {
              tipo: 'nota',
              tono: 'ojo',
              titulo: 'No todo está conectado',
              texto:
                'Que la empresa use una herramienta no significa que esté conectada. Si una respuesta parece incompleta, confirma qué fuentes están activas y qué permisos tiene tu cuenta.',
            },
          ],
          chequeo: [
            {
              id: 'q1',
              enunciado: 'Preguntas por la política de viáticos y la respuesta es genérica, sin citas. ¿Qué pasó probablemente?',
              opciones: [
                {
                  texto: 'La empresa no tiene política de viáticos.',
                  explicacion: 'Puede ser, pero lo primero es revisar si activaste las fuentes de la empresa.',
                },
                {
                  texto: 'No activaste el conocimiento de la empresa antes de preguntar.',
                  correcta: true,
                  explicacion: 'Correcto. Sin activarlo responde con conocimiento general.',
                },
                {
                  texto: 'ChatGPT no puede leer políticas.',
                  explicacion: 'Sí puede, si están en una fuente conectada y tienes permiso.',
                },
              ],
            },
          ],
        },
        {
          slug: 'citas-y-vacios',
          tipo: 'lectura',
          titulo: 'Citas, versiones y vacíos',
          minutos: 12,
          resumen: 'La respuesta vale lo que vale su documento: vigente, correcto y leído.',
          objetivos: [
            'Revisar la versión y la fecha del documento citado.',
            'Pedir el contraste entre documentos.',
            'Saber qué no se le pregunta.',
          ],
          bloques: [
            {
              tipo: 'texto',
              texto:
                'Una carpeta de empresa tiene la política de 2022, la de 2024 y el borrador de 2026. ChatGPT puede citar cualquiera. Por eso, antes de comprometer a la empresa con una respuesta, se abre el documento y se revisa la versión y la fecha.',
            },
            {
              tipo: 'prompt',
              etiqueta: 'Estado de un proyecto',
              texto:
                'Resume en qué va el proyecto de migración del ERP: últimos acuerdos, pendientes y quién quedó responsable. Cita de dónde sale cada punto.',
            },
            {
              tipo: 'prompt',
              etiqueta: 'Contraste',
              texto: 'Compara el contrato de Distribuidora Oriente con la plantilla estándar y dime en qué cláusulas se aparta.',
            },
            {
              tipo: 'prompt',
              etiqueta: 'Vacíos',
              texto:
                'De todo esto, dime qué no encontraste en nuestras fuentes y que por lo tanto habría que preguntarle a alguien.',
            },
            {
              tipo: 'nota',
              tono: 'ojo',
              titulo: 'Para qué no se usa',
              texto:
                'No se usa para buscar información de personas, de desempeño o de salarios, aunque técnicamente la cuenta tenga acceso a algo. Se limita a documentos de trabajo y decisiones del negocio.',
            },
          ],
          chequeo: [
            {
              id: 'q1',
              enunciado: 'La respuesta cita una política. ¿Qué revisas antes de mandarla en un correo?',
              opciones: [
                {
                  texto: 'Nada, si trae la cita ya está verificada.',
                  explicacion: 'La cita te dice dónde mirar, no que sea la versión vigente.',
                },
                {
                  texto: 'Que el documento citado sea la versión vigente y con qué fecha.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'Que la respuesta esté bien redactada.',
                  explicacion: 'La redacción no dice si el documento está vigente.',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      slug: 'cierre-intermedio',
      nivel: 'intermedio',
      titulo: 'Cierre del nivel 2',
      descripcion: 'Un examen que recorre GPTs, Deep Research y el conocimiento de la empresa.',
      lecciones: [
        {
          slug: 'examen-intermedio',
          tipo: 'examen',
          titulo: 'Examen del nivel 2',
          minutos: 15,
          resumen: 'Preguntas de GPTs, Deep Research y conocimiento de la empresa, según lo que tengas habilitado. Se aprueba con 80%.',
          aprobacion: 80,
          preguntas: [
            {
              id: 'e1',
              modulo: 'gpts',
              enunciado: '¿Cuál es el mejor punto de partida para crear un GPT del área?',
              opciones: [
                {
                  texto: 'Un prompt que alguien ya usa todos los días y funciona.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'Una instrucción general del tipo "sé útil y profesional".',
                  explicacion: 'Las instrucciones vagas no fijan comportamiento.',
                },
                {
                  texto: 'Cargar los 20 archivos del área y ver qué pasa.',
                  explicacion: 'Pocos archivos buenos funcionan mejor que muchos sin curar.',
                },
              ],
            },
            {
              id: 'e2',
              modulo: 'gpts',
              enunciado: '¿Qué documento no se sube a un GPT compartido con el área?',
              opciones: [
                {
                  texto: 'Las tarifas vigentes.',
                  explicacion: 'Es material que el área usa y puede leer.',
                },
                {
                  texto: 'El archivo de salarios del equipo.',
                  correcta: true,
                  explicacion: 'Correcto. Todo el que use el GPT podría llegar a esa información.',
                },
                {
                  texto: 'La plantilla de respuesta a clientes.',
                  explicacion: 'Es justo el tipo de material que conviene cargar.',
                },
              ],
            },
            {
              id: 'e3',
              modulo: 'gpts',
              enunciado: 'Tu cuenta personal no te deja crear un GPT nuevo. ¿Dónde lo creas?',
              opciones: [
                {
                  texto: 'En el espacio de trabajo corporativo.',
                  correcta: true,
                  explicacion: 'Correcto. Ahí se crean y se comparten con el área.',
                },
                {
                  texto: 'En otra cuenta personal.',
                  explicacion: 'Las cuentas personales ya no crean GPTs nuevos, y el material de la empresa no va ahí.',
                },
                {
                  texto: 'No se puede crear en ningún lado.',
                  explicacion: 'Sí se puede, desde el espacio de trabajo.',
                },
              ],
            },
            {
              id: 'e4',
              modulo: 'deep',
              enunciado: '¿Qué encargo está mejor escrito para Deep Research?',
              opciones: [
                {
                  texto: '"Investiga el mercado de empaques."',
                  explicacion: 'Sin país, segmento, periodo ni decisión, devuelve algo genérico.',
                },
                {
                  texto: '"Proveedores de empaques compostables en México, 2025 y 2026, para elegir dos y pedir muestras, en tabla y con fuentes."',
                  correcta: true,
                  explicacion: 'Correcto. Acotado, con decisión, formato y fuentes.',
                },
                {
                  texto: '"Dime todo lo que sepas de empaques."',
                  explicacion: 'Un encargo abierto gasta la consulta sin servir para decidir.',
                },
              ],
            },
            {
              id: 'e5',
              modulo: 'deep',
              enunciado: 'Llega el informe. ¿Qué revisas primero?',
              opciones: [
                {
                  texto: 'La redacción de las conclusiones.',
                  explicacion: 'La redacción viene después de saber si las fuentes aguantan.',
                },
                {
                  texto: 'Algunas fuentes al azar: si son sólidas y recientes.',
                  correcta: true,
                  explicacion: 'Correcto. Se revisan las fuentes, no el texto.',
                },
                {
                  texto: 'Que sea largo.',
                  explicacion: 'La longitud no dice nada de la calidad.',
                },
              ],
            },
            {
              id: 'e6',
              modulo: 'deep',
              enunciado: '¿Cuándo no conviene usar Deep Research?',
              opciones: [
                {
                  texto: 'Para una pregunta que una búsqueda normal responde en segundos.',
                  correcta: true,
                  explicacion: 'Correcto. Gasta el cupo sin necesidad.',
                },
                {
                  texto: 'Para un panorama de normativa en tres países.',
                  explicacion: 'Ese es justamente su caso.',
                },
                {
                  texto: 'Para comparar competidores con fuentes.',
                  explicacion: 'También es su caso.',
                },
              ],
            },
            {
              id: 'e7',
              modulo: 'knowledge',
              enunciado: '¿Qué puede consultar ChatGPT con el conocimiento de la empresa activado?',
              opciones: [
                {
                  texto: 'Todo lo que hay en las herramientas conectadas.',
                  explicacion: 'Respeta tus permisos: no ve más que tú.',
                },
                {
                  texto: 'Lo que tu cuenta ya puede abrir en las herramientas conectadas.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'Solo los archivos que subas al chat.',
                  explicacion: 'Con la opción activada consulta también las herramientas conectadas.',
                },
              ],
            },
            {
              id: 'e8',
              modulo: 'knowledge',
              enunciado: '¿Por qué conviene preguntar qué no encontró?',
              opciones: [
                {
                  texto: 'Porque ese vacío es lo que hay que preguntarle a una persona.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'Para que busque en internet lo que falta.',
                  explicacion: 'La idea es saber qué no está en las fuentes de la empresa, no suplirlo con la web.',
                },
                {
                  texto: 'No sirve de nada.',
                  explicacion: 'Saber qué falta es tan útil como la respuesta.',
                },
              ],
            },
          ],
        },
      ],
    },

    /* ------------------------------------------------------------ nivel 3 */
    {
      slug: 'agent-mode',
      nivel: 'avanzado',
      modulo: 'agent',
      titulo: 'Agent Mode',
      descripcion:
        'El asistente ejecuta tareas de varios pasos en el navegador. Tareas aburridas y verificables, supervisión la primera vez y el paso final siempre en tus manos.',
      lecciones: [
        {
          slug: 'que-hace-el-agente',
          tipo: 'lectura',
          titulo: 'Qué hace el agente y qué no',
          minutos: 14,
          resumen: 'Navega, llena, compara y arma el entregable. Se detiene donde hay consecuencias.',
          objetivos: [
            'Entender cómo trabaja el agente en el navegador.',
            'Reconocer lo que no puede hacer por diseño.',
            'Elegir una tarea que valga la pena delegar.',
          ],
          bloques: [
            {
              tipo: 'texto',
              texto:
                'En Agent Mode ChatGPT no responde: hace. Abre un navegador, entra a los sitios donde ya tienes sesión, llena formularios, compara opciones y arma el entregable. Mientras trabaja puedes ver lo que está haciendo, y se detiene a preguntar antes de cualquier paso que tenga consecuencias.',
            },
            {
              tipo: 'conceptos',
              items: [
                {
                  termino: 'Lo que hace',
                  definicion:
                    'Navegar portales, descargar archivos, copiar datos a una tabla, comparar precios y tiempos, llenar formularios hasta antes de enviarlos.',
                },
                {
                  termino: 'Lo que no hace por diseño',
                  definicion:
                    'No instala extensiones, no toca los archivos de tu computador y no usa tus contraseñas guardadas.',
                },
                {
                  termino: 'Punto de confirmación',
                  definicion: 'Enviar, comprar, pagar o confirmar: ahí se detiene y la decisión es tuya.',
                },
              ],
            },
            {
              tipo: 'subtitulo',
              texto: 'La tarea ideal',
            },
            {
              tipo: 'texto',
              texto:
                'Aburrida, de varios pasos y verificable de un vistazo. Si no puedes comprobar lo que hizo, no es tarea para el agente. Si la tarea toca datos sensibles de clientes, tampoco.',
            },
            {
              tipo: 'hoja',
              titulo: '¿Para el agente o no?',
              columnas: ['Tarea', '¿Agente?', 'Por qué'],
              filas: [
                ['Descargar las facturas del mes de tres portales', 'Sí', 'Repetitiva y fácil de verificar'],
                ['Comparar precio y entrega en tres tiendas', 'Sí', 'Pasos claros, resultado en tabla'],
                ['Pagar la factura del proveedor', 'Hasta antes de pagar', 'El pago lo apruebas tú'],
                ['Revisar historias clínicas de clientes', 'No', 'Datos sensibles'],
                ['Decidir qué proveedor contratar', 'No', 'Es una decisión, no una tarea'],
              ],
              resaltar: [3, 4],
            },
            {
              tipo: 'nota',
              tono: 'clave',
              titulo: 'La regla del agente',
              texto: 'Delegas la recolección, no la decisión. Lo que tenga consecuencias lo apruebas tú, siempre.',
            },
          ],
          chequeo: [
            {
              id: 'q1',
              enunciado: '¿Qué no hace Agent Mode por diseño?',
              opciones: [
                {
                  texto: 'Llenar un formulario en un sitio web.',
                  explicacion: 'Eso sí lo hace, y se detiene antes de enviarlo.',
                },
                {
                  texto: 'Usar tus contraseñas guardadas o tocar los archivos de tu computador.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'Comparar precios en varias tiendas.',
                  explicacion: 'Esa es una de sus tareas típicas.',
                },
              ],
            },
          ],
        },
        {
          slug: 'supervisar-y-aprobar',
          tipo: 'lectura',
          titulo: 'Supervisar y aprobar',
          minutos: 14,
          resumen: 'Destino y formato claros, la primera corrida mirando y el paso final revisado.',
          objetivos: [
            'Escribir un encargo con sitios, datos y formato.',
            'Supervisar la primera corrida y ajustar el encargo.',
            'Verificar el resultado por muestreo.',
          ],
          bloques: [
            {
              tipo: 'comparar',
              antes: {
                titulo: 'Encargo abierto',
                texto: 'Revisa cómo van los pedidos.',
              },
              despues: {
                titulo: 'Encargo claro',
                texto:
                  'Entra al portal del transportador y revisa el estado de los pedidos 5512, 5518, 5520, 5531 y 5540. Devuélveme una tabla con número, estado, fecha prometida, fecha estimada y días de retraso. No cambies nada en el portal. Al final dime qué pasos ejecutaste y qué no pudiste revisar.',
              },
            },
            {
              tipo: 'lista',
              ordenada: true,
              items: [
                'Dale el destino: qué sitios y qué datos. Sin eso navega de más.',
                'Dale el formato: la tabla con sus columnas.',
                'Dile qué no hacer: no cambiar, no enviar, no comprar.',
                'Quédate mirando la primera vez: ahí se ve dónde se traba y qué hay que precisar.',
                'Pídele el recuento: qué hizo, de dónde tomó cada dato y qué quedó sin hacer.',
              ],
            },
            {
              tipo: 'tablero',
              titulo: 'Lo que devuelve el agente',
              columnas: [
                { nombre: 'Al día', tarjetas: [{ clave: '5512', texto: 'Entregado' }, { clave: '5520', texto: 'En ruta, llega mañana' }] },
                { nombre: 'Con retraso', tarjetas: [{ clave: '5518', texto: '3 días' }, { clave: '5531', texto: '5 días' }] },
                { nombre: 'Sin revisar', tarjetas: [{ clave: '5540', texto: 'El portal pidió verificación' }] },
              ],
            },
            {
              tipo: 'prompt',
              etiqueta: 'Formulario con freno',
              texto:
                'Con los datos de esta tabla, llena el formulario de solicitud de devolución en el portal del proveedor. Detente antes de enviarlo y muéstrame el resumen.',
            },
            {
              tipo: 'nota',
              tono: 'ojo',
              titulo: 'La tabla también se revisa',
              texto:
                'Antes de usar el resultado, abre dos o tres registros críticos en el portal original. Un dato mal copiado en una tabla ordenada se ve igual de confiable que uno bueno.',
            },
          ],
          chequeo: [
            {
              id: 'q1',
              enunciado: 'El agente llenó el formulario y se detuvo antes de enviarlo. ¿Qué haces?',
              opciones: [
                {
                  texto: 'Apruebas sin mirar: ya hizo lo difícil.',
                  explicacion: 'Se detuvo justamente para que revises.',
                },
                {
                  texto: 'Revisas el resumen y decides tú si se envía.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'Le pides que lo envíe y te avise.',
                  explicacion: 'El paso con consecuencias es tu decisión.',
                },
              ],
            },
          ],
        },
        {
          slug: 'practica-encargo-agente',
          tipo: 'practica',
          titulo: 'Práctica: el encargo al agente',
          minutos: 20,
          resumen: 'Escribe un encargo que el agente pueda ejecutar sin inventar y que tú puedas verificar.',
          bloques: [
            {
              tipo: 'texto',
              texto:
                'Escribe el encargo tal como se lo darías a Agent Mode. Se revisa que tenga destino, formato, límites y recuento, y que el paso con consecuencias quede en tus manos.',
            },
          ],
          caso: {
            rol: 'Auxiliar de compras',
            tarea: 'Cotizar sillas de oficina para la sede nueva',
            situacion:
              'Necesitas 25 sillas ergonómicas con apoyo lumbar para la sede de Medellín, con presupuesto máximo de 700.000 pesos por unidad y entrega antes del 30 de octubre. La empresa compra en tres tiendas con cuenta corporativa: Ofimuebles, Sillas y Más y Mobiliario Andino. La orden la aprueba la jefa administrativa. Hoy solo quieres el comparativo.',
          },
          consigna: 'Escribe el encargo completo para Agent Mode.',
          placeholder: 'Entra a...',
          rubrica: [
            { id: 'destino', titulo: 'Destino', pregunta: '¿Nombra los tres sitios donde debe buscar?' },
            { id: 'criterios', titulo: 'Criterios', pregunta: '¿Incluye cantidad, características, presupuesto y fecha de entrega?' },
            { id: 'formato', titulo: 'Formato', pregunta: '¿Pide una tabla con columnas concretas y el enlace de cada opción?' },
            { id: 'limites', titulo: 'Límites', pregunta: '¿Dice explícitamente que no compre ni agregue al carrito para pagar?' },
            { id: 'recuento', titulo: 'Recuento', pregunta: '¿Pide que al final diga qué hizo y qué no pudo revisar?' },
          ],
          pistas: [
            'Hoy solo quieres el comparativo: ¿dónde quedó escrito que no compre?',
            'Una opción de 750.000 pesos, ¿la quieres ver o no? Dilo.',
          ],
          solucion:
            'Entra a Ofimuebles, Sillas y Más y Mobiliario Andino, donde tenemos cuenta corporativa, y busca sillas de oficina ergonómicas con apoyo lumbar.\n\nCriterios: necesitamos 25 unidades, máximo 700.000 pesos por unidad y entrega en Medellín antes del 30 de octubre. Trae hasta dos opciones por tienda que cumplan todo; si ninguna cumple en una tienda, dilo.\n\nDevuélveme una tabla con: tienda, referencia, precio unitario, precio por 25 unidades, fecha estimada de entrega, garantía y enlace al producto.\n\nNo agregues nada al carrito ni hagas ninguna compra: la orden la aprueba la jefa administrativa. Al terminar, dime qué pasos ejecutaste, de qué página sacaste cada dato y qué no pudiste confirmar.',
        },
      ],
    },
    {
      slug: 'codex',
      nivel: 'avanzado',
      modulo: 'codex',
      titulo: 'Codex',
      descripcion:
        'El agente técnico de ChatGPT, visto desde un área no técnica: convertir el proceso manual del mes en algo repetible que se entiende y se valida.',
      lecciones: [
        {
          slug: 'codex-sin-ser-programador',
          tipo: 'lectura',
          titulo: 'Codex sin ser programador',
          minutos: 14,
          resumen: 'Se describe el resultado y las reglas; la forma de programarlo es problema suyo.',
          objetivos: [
            'Reconocer un proceso que vale la pena automatizar.',
            'Describir entradas, salida y reglas sin hablar de técnica.',
            'Pedir la explicación en lenguaje sencillo.',
          ],
          bloques: [
            {
              tipo: 'texto',
              texto:
                'Codex es el agente de programación de ChatGPT. Trabaja en el editor, en la terminal o en entornos en la nube, y puede llevar varias tareas en paralelo mientras tú revisas. En un área no técnica su valor está en convertir el proceso manual de cada mes en algo repetible: consolidar archivos, limpiar datos y generar el mismo reporte sin volver a armarlo a mano.',
            },
            {
              tipo: 'comparar',
              antes: {
                titulo: 'Cada mes',
                texto:
                  'Un día entero de consolidación manual, con el riesgo de que un copiado corrido dañe una columna y nadie lo note hasta el comité.',
              },
              despues: {
                titulo: 'Una sola vez',
                texto:
                  'El proceso queda escrito. Cada mes se corre con los archivos nuevos y el tiempo se va en revisar, no en pegar.',
              },
            },
            {
              tipo: 'subtitulo',
              texto: 'Qué proceso sirve',
            },
            {
              tipo: 'lista',
              items: [
                'Se hace idéntico cada mes: mismos archivos, mismas columnas, mismas reglas.',
                'Las reglas se pueden escribir a mano en un párrafo. Si nadie las entiende del todo, primero se aclaran.',
                'El resultado se puede comparar contra un mes que ya conoces.',
              ],
            },
            {
              tipo: 'prompt',
              etiqueta: 'Consolidación',
              texto:
                'Tengo doce archivos de Excel con el mismo formato, uno por mes. Arma un proceso que los una en una sola tabla y marque las filas con datos faltantes.',
            },
            {
              tipo: 'prompt',
              etiqueta: 'Explicación',
              texto:
                'Explícame en lenguaje sencillo qué hace este proceso, qué supone de los datos de entrada y en qué casos se rompería.',
            },
            {
              tipo: 'nota',
              tono: 'clave',
              titulo: 'Si no lo puedes explicar, no lo puedes defender',
              texto:
                'El día que el reporte muestre un número raro, alguien te va a preguntar de dónde salió. Pide la explicación en español antes de usarlo, no después.',
            },
          ],
          chequeo: [
            {
              id: 'q1',
              enunciado: '¿Qué proceso es mejor candidato para Codex?',
              opciones: [
                {
                  texto: 'Un análisis que cambia de forma cada mes según lo que pida la gerencia.',
                  explicacion: 'Lo que cambia cada vez no se automatiza bien.',
                },
                {
                  texto: 'La consolidación mensual de archivos con el mismo formato y las mismas reglas.',
                  correcta: true,
                  explicacion: 'Correcto. Se repite igual y se puede validar.',
                },
                {
                  texto: 'Un proceso que nadie del área entiende del todo.',
                  explicacion: 'Primero se escriben las reglas; automatizar lo que nadie entiende multiplica el problema.',
                },
              ],
            },
          ],
        },
        {
          slug: 'validar-el-proceso',
          tipo: 'lectura',
          titulo: 'Validar antes de confiar',
          minutos: 14,
          resumen: 'Copia de los datos, un mes conocido como prueba y los casos que lo rompen.',
          objetivos: [
            'Probar sobre una copia, nunca sobre la base real.',
            'Usar un periodo conocido como validación.',
            'Anticipar los archivos que llegan mal.',
          ],
          bloques: [
            {
              tipo: 'texto',
              texto:
                'La mejor validación es un periodo cuyo resultado ya conoces. Si el proceso aplicado a agosto da lo mismo que el cierre de agosto que se hizo a mano, sirve. Si no da, la diferencia te dice qué regla quedó mal.',
            },
            {
              tipo: 'hoja',
              titulo: 'Agosto: proceso contra cierre manual',
              columnas: ['Área', 'Cierre manual', 'Proceso', 'Diferencia'],
              filas: [
                ['Comercial', '182.400.000', '182.400.000', '0'],
                ['Operaciones', '96.150.000', '96.150.000', '0'],
                ['Postventa', '31.720.000', '29.870.000', '1.850.000'],
                ['Administración', '44.300.000', '44.300.000', '0'],
              ],
              resaltar: [2],
            },
            {
              tipo: 'texto',
              texto:
                'La fila de postventa no cuadra. La pregunta útil no es "¿está mal?", sino "¿qué regla explica 1.850.000?". Casi siempre es un caso que el proceso no contempla: una devolución, una nota crédito, un archivo con una columna de más.',
            },
            {
              tipo: 'prompt',
              etiqueta: 'Casos que rompen',
              texto:
                'Revisa este proceso y dime qué pasa si un archivo llega vacío, con columnas de más o con fechas en otro formato.',
            },
            {
              tipo: 'nota',
              tono: 'ojo',
              titulo: 'Nunca sobre producción',
              texto:
                'La primera prueba va sobre una copia de los datos. Darle acceso a la base real antes de que el resultado cuadre con un periodo conocido es arriesgar el dato de todos.',
            },
          ],
          chequeo: [
            {
              id: 'q1',
              enunciado: 'El proceso nuevo da una diferencia en una sola área contra el cierre manual de agosto. ¿Qué haces?',
              opciones: [
                {
                  texto: 'Lo usas igual: tres de cuatro áreas cuadran.',
                  explicacion: 'Una diferencia sin explicar aparece también en los meses siguientes.',
                },
                {
                  texto: 'Buscas qué caso o regla explica la diferencia antes de usarlo.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'Descartas el proceso y vuelves a lo manual para siempre.',
                  explicacion: 'Una diferencia se corrige; no invalida todo el proceso.',
                },
              ],
            },
          ],
        },
        {
          slug: 'practica-proceso-mensual',
          tipo: 'practica',
          titulo: 'Práctica: el proceso del mes',
          minutos: 20,
          resumen: 'Describe un proceso para Codex con entradas, salida, reglas y validación.',
          bloques: [
            {
              tipo: 'texto',
              texto:
                'Escribe el encargo para Codex. No hace falta ningún término técnico: se revisa que las entradas, la salida y las reglas queden claras, y que haya una forma de validar.',
            },
          ],
          caso: {
            rol: 'Analista de cartera',
            tarea: 'Automatizar el reporte semanal de cartera vencida',
            situacion:
              'Cada lunes descargas del ERP un archivo de cartera por cada una de las cuatro regionales. Los unes a mano, quitas las facturas con saldo cero, clasificas lo vencido en 1 a 30, 31 a 60, 61 a 90 y más de 90 días, y armas una tabla por regional con el total de cada rango. A veces una regional manda las fechas en otro formato. El reporte del lunes pasado está revisado y cuadra.',
          },
          consigna: 'Escribe el encargo completo para Codex.',
          placeholder: 'Cada semana tengo...',
          rubrica: [
            { id: 'entradas', titulo: 'Entradas', pregunta: '¿Describe los archivos que entran y de dónde vienen?' },
            { id: 'reglas', titulo: 'Reglas', pregunta: '¿Escribe las reglas: quitar saldo cero y los cuatro rangos de vencimiento?' },
            { id: 'salida', titulo: 'Salida', pregunta: '¿Dice qué tabla debe salir y con qué columnas?' },
            { id: 'excepciones', titulo: 'Casos raros', pregunta: '¿Menciona el formato de fechas distinto u otros casos que puedan romperlo?' },
            { id: 'validacion', titulo: 'Validación', pregunta: '¿Propone probarlo con el reporte del lunes pasado, que ya cuadra?' },
            { id: 'explicacion', titulo: 'Explicación', pregunta: '¿Pide que le expliquen el proceso en lenguaje sencillo?' },
          ],
          pistas: [
            'Tienes un reporte que ya cuadra: esa es tu prueba.',
            'El problema de las fechas no es raro, es de todas las semanas. Anticípalo.',
          ],
          solucion:
            'Cada lunes tengo cuatro archivos de cartera descargados del ERP, uno por regional (Norte, Centro, Occidente y Sur), con las mismas columnas: cliente, factura, fecha de vencimiento y saldo.\n\nQuiero un proceso que:\n1. Una los cuatro archivos en una sola tabla, conservando de qué regional viene cada fila.\n2. Quite las facturas con saldo cero.\n3. Calcule los días de vencimiento contra la fecha de hoy y clasifique cada factura en 1 a 30, 31 a 60, 61 a 90 o más de 90 días. Las que no han vencido quedan aparte.\n4. Entregue una tabla con una fila por regional y una columna por rango, con el total de saldo, más una fila de total general.\n\nCasos a tener en cuenta: a veces una regional manda las fechas en otro formato (día/mes contra mes/día). Si una fecha no se puede leer con seguridad, no la adivines: marca esa fila para revisión manual. Si un archivo llega vacío o con columnas distintas, detente y avísame.\n\nValidación: pruébalo primero con los archivos del lunes pasado, cuyo reporte ya está revisado, y muéstrame las diferencias si las hay. Trabaja sobre copias de los archivos.\n\nAl final explícame en lenguaje sencillo qué hace el proceso y en qué casos podría fallar.',
        },
      ],
    },
    {
      slug: 'cierre-avanzado',
      nivel: 'avanzado',
      titulo: 'Cierre del nivel 3',
      descripcion: 'Un examen que recorre Agent Mode y Codex.',
      lecciones: [
        {
          slug: 'examen-avanzado',
          tipo: 'examen',
          titulo: 'Examen del nivel 3',
          minutos: 12,
          resumen: 'Preguntas de Agent Mode y Codex, según lo que tengas habilitado. Se aprueba con 80%.',
          aprobacion: 80,
          preguntas: [
            {
              id: 'e1',
              modulo: 'agent',
              enunciado: '¿Qué tarea encaja mejor con Agent Mode?',
              opciones: [
                {
                  texto: 'Decidir qué proveedor contratar.',
                  explicacion: 'Esa es una decisión, no una tarea para delegar.',
                },
                {
                  texto: 'Revisar el estado de cinco pedidos en el portal del transportador y armar una tabla.',
                  correcta: true,
                  explicacion: 'Correcto. Aburrida, de varios pasos y verificable.',
                },
                {
                  texto: 'Revisar datos médicos de clientes.',
                  explicacion: 'Con datos sensibles no se usa el agente.',
                },
              ],
            },
            {
              id: 'e2',
              modulo: 'agent',
              enunciado: '¿Qué conviene hacer la primera vez que el agente corre una tarea nueva?',
              opciones: [
                {
                  texto: 'Dejarlo solo y revisar al final.',
                  explicacion: 'La primera corrida es donde se ve qué hay que precisar.',
                },
                {
                  texto: 'Quedarse mirando la corrida completa.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'Correrla tres veces seguidas para comparar.',
                  explicacion: 'Primero se supervisa y se ajusta el encargo.',
                },
              ],
            },
            {
              id: 'e3',
              modulo: 'agent',
              enunciado: 'El agente te devuelve una tabla ordenada de 40 facturas. ¿Qué haces antes de usarla?',
              opciones: [
                {
                  texto: 'Nada, se ve bien.',
                  explicacion: 'Un dato mal copiado se ve igual de ordenado que uno bueno.',
                },
                {
                  texto: 'Verificas por muestreo los registros críticos en el portal original.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'Le pides al agente que confirme que no se equivocó.',
                  explicacion: 'La verificación la haces tú, contra la fuente.',
                },
              ],
            },
            {
              id: 'e4',
              modulo: 'agent',
              enunciado: '¿Qué pasa cuando el agente llega al paso de pagar?',
              opciones: [
                {
                  texto: 'Paga, si tiene la tarjeta guardada.',
                  explicacion: 'No usa tus datos guardados y se detiene antes de pasos con consecuencias.',
                },
                {
                  texto: 'Se detiene y la decisión es tuya.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'Cancela la tarea.',
                  explicacion: 'No la cancela: espera tu confirmación.',
                },
              ],
            },
            {
              id: 'e5',
              modulo: 'codex',
              enunciado: '¿Cómo se le describe un proceso a Codex desde un área no técnica?',
              opciones: [
                {
                  texto: 'Con el lenguaje de programación que debe usar.',
                  explicacion: 'La técnica es problema suyo.',
                },
                {
                  texto: 'Con las entradas, la salida y las reglas.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'Con un "automatiza el reporte" y nada más.',
                  explicacion: 'Sin reglas, adivina.',
                },
              ],
            },
            {
              id: 'e6',
              modulo: 'codex',
              enunciado: '¿Cuál es la mejor forma de validar un proceso nuevo?',
              opciones: [
                {
                  texto: 'Correrlo con un periodo cuyo resultado ya conoces.',
                  correcta: true,
                  explicacion: 'Correcto. Si da lo mismo, sirve.',
                },
                {
                  texto: 'Correrlo directo sobre el mes actual y publicar.',
                  explicacion: 'Sin un punto de comparación no sabes si está bien.',
                },
                {
                  texto: 'Revisar que el código se vea ordenado.',
                  explicacion: 'Que se vea ordenado no dice si el número es correcto.',
                },
              ],
            },
            {
              id: 'e7',
              modulo: 'codex',
              enunciado: '¿Sobre qué datos se hace la primera prueba?',
              opciones: [
                {
                  texto: 'Sobre la base de producción, para que sea realista.',
                  explicacion: 'Se arriesga el dato de todos.',
                },
                {
                  texto: 'Sobre una copia de los datos.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'Sobre datos inventados.',
                  explicacion: 'Con datos inventados no hay contra qué comparar.',
                },
              ],
            },
          ],
        },
      ],
    },

    /* ------------------------------------------------------------ nivel 4 */
    {
      slug: 'gpts-del-equipo',
      nivel: 'experto',
      modulo: 'gpts',
      titulo: 'Los GPTs del equipo',
      descripcion:
        'Un GPT compartido es un producto con usuarios: tiene dueño, versiones, revisión y fecha de retiro.',
      lecciones: [
        {
          slug: 'mantener-un-gpt',
          tipo: 'lectura',
          titulo: 'Mantener un GPT vivo',
          minutos: 14,
          resumen: 'Dueño, archivos vigentes, casos de prueba y una revisión mensual.',
          objetivos: [
            'Asignar un dueño a cada GPT compartido.',
            'Mantener los archivos de referencia al día.',
            'Guardar un set de casos de prueba para cada cambio.',
          ],
          bloques: [
            {
              tipo: 'texto',
              texto:
                'El GPT que funciona bien en marzo responde mal en septiembre si nadie cambió las tarifas que tiene cargadas. Un GPT compartido no es un archivo que se crea y se olvida: lo usa gente que confía en él, y esa confianza se pierde con la primera respuesta desactualizada.',
            },
            {
              tipo: 'conceptos',
              items: [
                {
                  termino: 'Dueño',
                  definicion: 'Una persona con nombre, no "el área". Responde por el contenido y aprueba los cambios.',
                },
                {
                  termino: 'Casos de prueba',
                  definicion:
                    'Cinco a diez preguntas con la respuesta esperada, incluidas las difíciles. Se corren cada vez que cambian las instrucciones o los archivos.',
                },
                {
                  termino: 'Revisión mensual',
                  definicion: 'Archivos vigentes, quejas recibidas, preguntas que no supo responder.',
                },
                {
                  termino: 'Retiro',
                  definicion: 'Cuándo se apaga: si nadie lo usa en dos meses o si el proceso que atendía cambió.',
                },
              ],
            },
            {
              tipo: 'hoja',
              titulo: 'Inventario de GPTs del área',
              columnas: ['GPT', 'Dueño', 'Archivos al día', 'Última revisión', 'Usuarios activos'],
              filas: [
                ['Postventa', 'Laura Méndez', 'Sí', '2 sep', '14'],
                ['Cotizador', 'Jorge Salas', 'No: tarifas de enero', '12 mar', '9'],
                ['Inducción', 'Sin dueño', 'Sí', '20 may', '1'],
              ],
              resaltar: [1, 2],
            },
            {
              tipo: 'texto',
              texto:
                'La tabla dice lo que hay que hacer: el cotizador necesita las tarifas nuevas ya, porque nueve personas lo usan con precios de enero. El de inducción no tiene dueño y casi nadie lo usa: se le asigna uno o se retira.',
            },
            {
              tipo: 'nota',
              tono: 'clave',
              titulo: 'Cambiar sin romper',
              texto:
                'Antes de publicar un cambio en las instrucciones, se corren los casos de prueba. Un ajuste que arregla una respuesta puede dañar otras tres.',
            },
          ],
          chequeo: [
            {
              id: 'q1',
              enunciado: 'Un GPT compartido sigue con las tarifas de enero y nueve personas lo usan. ¿Qué es lo más urgente?',
              opciones: [
                {
                  texto: 'Actualizar los archivos y correr los casos de prueba.',
                  correcta: true,
                  explicacion: 'Correcto. Está respondiendo con precios viejos a quienes confían en él.',
                },
                {
                  texto: 'Nada, mientras nadie se queje.',
                  explicacion: 'La queja llega cuando el precio equivocado ya salió a un cliente.',
                },
                {
                  texto: 'Crear un GPT nuevo al lado.',
                  explicacion: 'Tener dos versiones del mismo asistente confunde al equipo.',
                },
              ],
            },
          ],
        },
        {
          slug: 'practica-casos-de-prueba',
          tipo: 'practica',
          titulo: 'Práctica: los casos de prueba del GPT',
          minutos: 20,
          resumen: 'Escribe el set de casos que debe aguantar un GPT antes de cada cambio.',
          bloques: [
            {
              tipo: 'texto',
              texto:
                'Vas a escribir los casos de prueba de un GPT que ya existe: la pregunta y lo que debería responder. Se revisa que cubran lo normal, lo difícil y lo prohibido.',
            },
          ],
          caso: {
            rol: 'Dueña del GPT de postventa',
            tarea: 'Armar los casos de prueba antes de cambiar las instrucciones',
            situacion:
              'El GPT de postventa responde reclamos de clientes. Sus reglas: máximo 150 palabras, nunca promete fechas de entrega, solo usa precios del archivo "Tarifas vigentes 2026", y si preguntan por garantías legales remite a jurídica. La semana pasada un asesor reportó que el GPT ofreció "revisar un descuento" que no existe. Vas a ajustar las instrucciones y necesitas saber que no rompes nada.',
          },
          consigna: 'Escribe entre cinco y ocho casos de prueba, cada uno con la pregunta y la respuesta esperada.',
          placeholder: 'Caso 1. Pregunta: ...\nEsperado: ...',
          rubrica: [
            { id: 'normales', titulo: 'Casos normales', pregunta: '¿Incluye al menos un reclamo común que debe resolver bien?' },
            { id: 'fechas', titulo: 'Fechas', pregunta: '¿Incluye un caso que presiona para que prometa una fecha?' },
            { id: 'precios', titulo: 'Precios', pregunta: '¿Incluye un precio o descuento que no está en las tarifas?' },
            { id: 'juridica', titulo: 'Remisión', pregunta: '¿Incluye una pregunta de garantía legal que debe remitir a jurídica?' },
            { id: 'esperado', titulo: 'Respuesta esperada', pregunta: '¿Cada caso dice qué debería responder o hacer el GPT, no solo la pregunta?' },
          ],
          pistas: [
            'El error reportado es tu primer caso difícil.',
            'Un cliente insistente es un caso distinto a uno que pregunta una vez.',
          ],
          solucion:
            'Caso 1. Pregunta: "Mi pedido llegó con una caja rota, ¿qué hago?" Esperado: pasos del reclamo en menos de 150 palabras, sin prometer fecha de reposición.\n\nCaso 2. Pregunta: "¿Para cuándo me llega el reemplazo? Necesito una fecha exacta." Esperado: no da fecha; explica que logística la confirma y ofrece hacer el seguimiento.\n\nCaso 3. Pregunta: "El asesor me dijo que me darían 15% de descuento por el retraso." Esperado: dice que ese descuento no está en las tarifas vigentes, no ofrece "revisarlo", y propone validarlo con la jefatura comercial.\n\nCaso 4. Pregunta: "¿Cuánto cuesta el repuesto del motor?" (sí está en tarifas) Esperado: da el precio exacto del archivo.\n\nCaso 5. Pregunta: "¿Cuánto cuesta la instalación a domicilio?" (no está en tarifas) Esperado: dice que no tiene ese precio y no lo estima.\n\nCaso 6. Pregunta: "¿La garantía legal me cubre si la máquina se daña por un corto?" Esperado: remite a jurídica y ofrece redactar el correo.\n\nCaso 7. Pregunta: el mismo reclamo del caso 2, insistiendo tres veces. Esperado: mantiene el límite sin volverse grosero.',
        },
      ],
    },
    {
      slug: 'sistema-del-equipo',
      nivel: 'experto',
      titulo: 'El sistema del equipo',
      descripcion: 'Medir el impacto, gobernar el uso y el proyecto final: diseñar el sistema completo de un proceso real.',
      lecciones: [
        {
          slug: 'medir-la-adopcion',
          tipo: 'lectura',
          titulo: 'Medir lo que cambia',
          minutos: 14,
          resumen: 'Uso no es impacto. Línea base, meta y una métrica de resultado.',
          objetivos: [
            'Distinguir una métrica de uso de una de resultado.',
            'Tomar la línea base antes de empezar.',
            'Elegir una métrica que el área ya mida.',
          ],
          bloques: [
            {
              tipo: 'texto',
              texto:
                'Decir "el equipo usa ChatGPT 300 veces por semana" no dice si algo mejoró. Puede que esas 300 consultas hayan ahorrado un día de trabajo o que sean 300 preguntas sueltas que no cambiaron nada. Lo que demuestra que un flujo funciona es una métrica de resultado comparada contra cómo estaba antes.',
            },
            {
              tipo: 'comparar',
              antes: {
                titulo: 'Métrica de uso',
                texto: 'Número de conversaciones por semana, personas con cuenta activa, GPTs creados.',
              },
              despues: {
                titulo: 'Métrica de resultado',
                texto:
                  'Horas del cierre mensual, días para enviar una propuesta, reclamos resueltos en el primer contacto, errores detectados antes del comité.',
              },
            },
            {
              tipo: 'lista',
              ordenada: true,
              items: [
                'Elige una métrica que el área ya entienda y que se mueva en semanas, no en años.',
                'Toma la línea base antes de cambiar nada: sin ella no hay contra qué comparar.',
                'Pon una meta con fecha.',
                'Mide también la calidad: más rápido y con más errores no es mejor.',
              ],
            },
            {
              tipo: 'hoja',
              titulo: 'Propuestas comerciales, antes y después',
              columnas: ['Indicador', 'Línea base (jul)', 'Meta (oct)', 'Actual (sep)'],
              filas: [
                ['Días del brief a la propuesta enviada', '4', '1', '1,5'],
                ['Propuestas con errores de precio', '3 de 20', '0', '1 de 22'],
                ['Conversaciones con ChatGPT', 'sin medir', 'no aplica', '410'],
              ],
              resaltar: [2],
            },
            {
              tipo: 'nota',
              tono: 'dato',
              titulo: 'La fila que no sirve',
              texto:
                'Las 410 conversaciones son un dato de uso: ayudan a saber si la gente adoptó la herramienta, pero no dicen nada del resultado. Las dos filas de arriba son las que se llevan al comité.',
            },
          ],
          chequeo: [
            {
              id: 'q1',
              enunciado: '¿Cuál es una métrica de resultado?',
              opciones: [
                {
                  texto: 'Personas con cuenta activa.',
                  explicacion: 'Es de uso.',
                },
                {
                  texto: 'Días del brief a la propuesta enviada, contra la línea base.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'GPTs creados en el trimestre.',
                  explicacion: 'Es de uso: crear GPTs no garantiza que algo mejore.',
                },
              ],
            },
          ],
        },
        {
          slug: 'gobierno-y-datos',
          tipo: 'lectura',
          titulo: 'Gobierno: dueños, datos y cupos',
          minutos: 15,
          resumen: 'Las reglas que permiten que el equipo use la IA sin sustos.',
          objetivos: [
            'Definir qué datos entran y cuáles no.',
            'Repartir los cupos de las herramientas que los tienen.',
            'Saber cuándo y cómo se apaga un flujo.',
          ],
          bloques: [
            {
              tipo: 'texto',
              texto:
                'Un área que usa bien la IA no es la que más la usa, es la que tiene reglas claras que todo el mundo conoce. Las reglas caben en una página y responden cinco preguntas.',
            },
            {
              tipo: 'lista',
              ordenada: true,
              items: [
                'Qué cuenta: siempre la del espacio de trabajo, nunca una personal para material de la empresa.',
                'Qué datos: lo que nunca entra (contraseñas, salarios con nombre, datos de salud, datos personales innecesarios) y lo que se anonimiza.',
                'Qué se verifica: cifras, normas, precios y todo lo que sale a un cliente o a un comité.',
                'Quién es dueño: de cada GPT, de cada flujo con agente y de las fuentes conectadas.',
                'Cómo se apaga: la condición que hace volver al proceso manual mientras se revisa.',
              ],
            },
            {
              tipo: 'subtitulo',
              texto: 'Los cupos',
            },
            {
              tipo: 'texto',
              texto:
                'Deep Research y Agent Mode tienen usos limitados por periodo. Si el área tiene una investigación de mercado trimestral y una conciliación semanal con el agente, esos usos se reservan primero. Lo demás queda para lo que surja.',
            },
            {
              tipo: 'correo',
              titulo: 'Las reglas, en el correo que las anuncia',
              de: 'Dirección comercial',
              para: 'Equipo comercial',
              asunto: 'Cómo usamos ChatGPT en el área desde octubre',
              cuerpo:
                'Equipo:\n\nDesde el 1 de octubre estas son las reglas:\n\n1. Todo el trabajo va por la cuenta de la empresa.\n2. Nada de datos personales de clientes que no hagan falta para la tarea.\n3. Precios y fechas se confirman en el sistema antes de enviarlos.\n4. El GPT Cotizador es de Jorge Salas; los cambios se le piden a él.\n5. Deep Research se reserva para el informe trimestral de competencia.\n\nSi un flujo empieza a dar errores, se vuelve al proceso manual y se avisa en #academia-ia.\n\nGracias.',
              adjuntos: ['Reglas de uso de IA - comercial.pdf'],
            },
            {
              tipo: 'nota',
              tono: 'ojo',
              titulo: 'La salida de emergencia',
              texto:
                'Todo flujo con IA necesita una condición de apagado escrita: "si el cotizador da dos precios equivocados en un mes, se cotiza a mano hasta revisarlo". Sin ella, el flujo malo sigue corriendo porque nadie sabe si está autorizado para pararlo.',
            },
          ],
          chequeo: [
            {
              id: 'q1',
              enunciado: '¿Para qué sirve escribir la condición de apagado de un flujo?',
              opciones: [
                {
                  texto: 'Para que cualquiera sepa cuándo volver al proceso manual sin esperar autorización.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'Para cumplir un requisito de papel.',
                  explicacion: 'Tiene un efecto práctico: evita que un flujo malo siga corriendo.',
                },
                {
                  texto: 'No sirve: los flujos con IA no fallan.',
                  explicacion: 'Fallan, y por eso se escribe la condición.',
                },
              ],
            },
          ],
        },
        {
          slug: 'examen-experto',
          tipo: 'examen',
          titulo: 'Examen del nivel 4',
          minutos: 12,
          resumen: 'Preguntas sobre GPTs compartidos, métricas y gobierno. Se aprueba con 80%.',
          aprobacion: 80,
          preguntas: [
            {
              id: 'e1',
              modulo: 'gpts',
              enunciado: '¿Quién debe ser el dueño de un GPT compartido?',
              opciones: [
                {
                  texto: 'El área en general.',
                  explicacion: 'Si es de todos, no es de nadie.',
                },
                {
                  texto: 'Una persona con nombre que responde por el contenido y aprueba los cambios.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'Quien lo use más.',
                  explicacion: 'Usarlo mucho no implica saber mantenerlo.',
                },
              ],
            },
            {
              id: 'e2',
              modulo: 'gpts',
              enunciado: 'Vas a cambiar las instrucciones de un GPT que usa todo el equipo. ¿Qué haces antes de publicar?',
              opciones: [
                {
                  texto: 'Corres los casos de prueba.',
                  correcta: true,
                  explicacion: 'Correcto. Un ajuste puede arreglar una respuesta y dañar otras.',
                },
                {
                  texto: 'Lo publicas y esperas reportes.',
                  explicacion: 'Los reportes llegan cuando el error ya salió.',
                },
                {
                  texto: 'Borras el GPT anterior y creas uno nuevo.',
                  explicacion: 'No hace falta, y se pierde lo que funcionaba.',
                },
              ],
            },
            {
              id: 'e3',
              enunciado: '¿Qué demuestra mejor que un flujo con ChatGPT funciona?',
              opciones: [
                {
                  texto: 'El número de conversaciones.',
                  explicacion: 'Es uso, no impacto.',
                },
                {
                  texto: 'Una métrica de resultado contra su línea base.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'Que el equipo diga que le gusta.',
                  explicacion: 'La opinión ayuda, pero no es un dato de impacto.',
                },
              ],
            },
            {
              id: 'e4',
              enunciado: '¿Cuándo se toma la línea base?',
              opciones: [
                {
                  texto: 'Antes de cambiar el proceso.',
                  correcta: true,
                  explicacion: 'Correcto. Después ya no hay contra qué comparar.',
                },
                {
                  texto: 'Tres meses después de implementar.',
                  explicacion: 'Para entonces el proceso ya cambió.',
                },
                {
                  texto: 'No hace falta si la meta es clara.',
                  explicacion: 'Sin línea base no se sabe si la meta se acercó.',
                },
              ],
            },
            {
              id: 'e5',
              enunciado: 'El área tiene pocos usos de Deep Research al mes. ¿Cómo los administras?',
              opciones: [
                {
                  texto: 'El que llegue primero los usa.',
                  explicacion: 'La investigación importante se queda sin cupo.',
                },
                {
                  texto: 'Se reservan primero para las investigaciones recurrentes e importantes.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'No se usan, por si acaso.',
                  explicacion: 'Un cupo sin usar tampoco genera valor.',
                },
              ],
            },
            {
              id: 'e6',
              enunciado: '¿Qué va en las reglas de uso de un área?',
              opciones: [
                {
                  texto: 'Solo la lista de herramientas permitidas.',
                  explicacion: 'Faltan los datos, la verificación, los dueños y el apagado.',
                },
                {
                  texto: 'Cuenta, datos que no entran, qué se verifica, dueños y cómo se apaga.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'El idioma en que se le escribe.',
                  explicacion: 'Eso no es lo que protege al área.',
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
                'La herramienta de ChatGPT para cada paso (chat, bloque editable, GPT, Deep Research, conocimiento de la empresa, Agent Mode o Codex) y por qué esa y no otra.',
                'El prompt, las instrucciones o el encargo clave: el que más se repite o el que más tiempo ahorra.',
                'Cómo se verifica el resultado antes de usarlo.',
                'La métrica, con su línea base y la meta.',
                'El gobierno: dueño, revisión, datos que no entran, uso de cupos y cómo se apaga.',
              ],
            },
            {
              tipo: 'nota',
              tono: 'dato',
              titulo: 'Sobre la revisión',
              texto:
                'No hace falta usar todas las herramientas: si tu proceso no necesita el agente ni Codex, dilo y explica por qué. El revisor mira las seis partes y que sean coherentes entre sí, no que uses los nombres exactos de cada botón.',
            },
          ],
          caso: {
            rol: 'Tú, en tu área',
            tarea: 'Diseñar el sistema de IA de un proceso del equipo',
            situacion:
              'Si no tienes un proceso propio, usa este: el área de servicio al cliente responde unas 400 solicitudes al mes sobre garantías y devoluciones. Cada asesor redacta a su manera, consulta la política en una carpeta compartida que tiene tres versiones, y revisa el estado de la guía en el portal del transportador copiando el número a mano. El tiempo promedio de respuesta es de 26 horas y el 12% de las respuestas se corrigen después por información equivocada.',
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
              pregunta: '¿Asigna una herramienta de ChatGPT a cada paso y justifica por qué esa y no otra?',
            },
            {
              id: 'encargo',
              titulo: 'El encargo clave',
              pregunta: '¿Incluye un prompt, unas instrucciones o un encargo concreto, no una descripción genérica?',
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
              pregunta: '¿Nombra un dueño, una revisión periódica, los datos que no entran y cómo se apaga?',
            },
          ],
          pistas: [
            'Empieza por la métrica: si no sabes qué quieres mover, el resto no tiene norte.',
            'No todos los pasos necesitan la misma herramienta: un GPT para redactar y el agente para consultar guías suele ser más realista que una sola herramienta que hace todo.',
          ],
          solucion:
            '1. PROCESO: servicio al cliente responde unas 400 solicitudes de garantía y devolución al mes. El tiempo promedio de respuesta es de 26 horas y el 12% de las respuestas se corrigen después, casi siempre porque el asesor consultó una versión vieja de la política.\n\n2. HERRAMIENTA POR PASO: (a) Conocimiento de la empresa para dejar una sola política vigente identificada; las dos versiones viejas se archivan. (b) Un GPT "Garantías y devoluciones" con la política vigente como único archivo, que redacta la respuesta con el formato del área. Un GPT y no el chat suelto, porque la tarea la hacen ocho asesores y hoy cada uno responde distinto. (c) Agent Mode para consultar en bloque, una vez al día, el estado de las guías pendientes en el portal del transportador y devolver una tabla. No se usa Codex: no hay un proceso de datos que consolidar. No se usa Deep Research: no hay nada que investigar afuera.\n\n3. ENCARGO CLAVE (instrucciones del GPT): "Eres el asistente de garantías y devoluciones. Respondes en máximo 130 palabras: primero qué procede, después los pasos numerados, al final el plazo que da la política. Usa solo el documento Política de garantías 2026. Si el caso no está en la política, dilo y sugiere escalar a la coordinación. Nunca apruebes una devolución: eso lo decide el asesor. No pidas ni repitas datos personales."\n\n4. VERIFICACIÓN: el asesor lee cada respuesta antes de enviarla y confirma que el plazo coincida con la política. La tabla del agente se revisa por muestreo: dos guías al día en el portal original. Cada mes se corren ocho casos de prueba del GPT.\n\n5. MÉTRICA: tiempo promedio de respuesta (línea base 26 horas, meta 8 horas en tres meses) y porcentaje de respuestas corregidas (línea base 12%, meta menos de 3%). Se revisa cada mes con el reporte del sistema de tickets.\n\n6. GOBIERNO: dueña del GPT y de la política cargada, la coordinadora de servicio, Paula Rincón. Revisión mensual de casos de prueba, archivos y quejas. No entran datos personales de clientes al GPT: el asesor describe el caso sin nombre ni documento. El agente usa uno de los cupos del área al día, reservado para esta tarea. Apagado: si el porcentaje de respuestas corregidas pasa del 12% dos semanas seguidas, se vuelve a la redacción manual mientras se revisan las instrucciones.',
        },
      ],
    },
  ],

  /* ========================================================= diagnóstico */
  diagnostico: [
    {
      id: 'd1',
      nivel: 'cero',
      enunciado: 'Le preguntas a ChatGPT por las ventas de tu empresa del mes pasado sin darle ningún archivo. ¿Qué esperas?',
      opciones: [
        { texto: 'La cifra exacta, porque ve los sistemas de la empresa.', explicacion: 'No ve los sistemas de la empresa si no se le conectan.' },
        { texto: 'Que diga que no la tiene, o que invente una cifra que suena bien.', correcta: true, explicacion: 'Correcto.' },
        { texto: 'Un error del sistema.', explicacion: 'Responde igual, con lo que tiene o suponiendo.' },
        { texto: 'No lo sé.', explicacion: 'Lo vemos en el nivel 0.' },
      ],
    },
    {
      id: 'd2',
      nivel: 'cero',
      enunciado: 'Tienes que resumir un informe interno. ¿Desde qué cuenta?',
      opciones: [
        { texto: 'La personal, si es más cómoda.', explicacion: 'El material de la empresa no va por cuentas personales.' },
        { texto: 'La del espacio de trabajo de la empresa.', correcta: true, explicacion: 'Correcto.' },
        { texto: 'Cualquiera, tratan los datos igual.', explicacion: 'No los tratan igual.' },
        { texto: 'No lo sé.', explicacion: 'Lo vemos en el nivel 0.' },
      ],
    },
    {
      id: 'd3',
      nivel: 'basico',
      modulo: 'canvas',
      enunciado: 'El documento está casi listo y solo un párrafo está flojo. ¿Qué haces?',
      opciones: [
        { texto: 'Pides el documento completo otra vez.', explicacion: 'Se pierde lo que ya estaba bien.' },
        { texto: 'Seleccionas ese párrafo y pides el cambio ahí.', correcta: true, explicacion: 'Correcto.' },
        { texto: 'Lo copias a Word y lo corriges allá.', explicacion: 'Funciona, pero vuelve a abrir el ciclo de versiones.' },
        { texto: 'No lo sé.', explicacion: 'Lo vemos en el nivel 1.' },
      ],
    },
    {
      id: 'd4',
      nivel: 'basico',
      modulo: 'voice',
      enunciado: 'Terminas de dictarle una visita a la voz de ChatGPT. ¿Qué haces antes de cerrar?',
      opciones: [
        { texto: 'Cerrar, ya quedó grabado.', explicacion: 'Una conversación no es un acta.' },
        { texto: 'Pedir el resumen escrito con compromisos y fechas.', correcta: true, explicacion: 'Correcto.' },
        { texto: 'Pedirle que te lo lea otra vez.', explicacion: 'Lo útil es tenerlo por escrito.' },
        { texto: 'No lo sé.', explicacion: 'Lo vemos en el nivel 1.' },
      ],
    },
    {
      id: 'd5',
      nivel: 'intermedio',
      modulo: 'gpts',
      enunciado: 'Un GPT del área dio un precio que no está en las tarifas. ¿Qué falta en sus instrucciones?',
      opciones: [
        { texto: 'Más archivos cargados.', explicacion: 'Más archivos no evitan que estime.' },
        { texto: 'Que las tarifas son la única fuente y qué hacer si el precio no está.', correcta: true, explicacion: 'Correcto.' },
        { texto: 'Un tono más formal.', explicacion: 'El tono no cambia de dónde saca los precios.' },
        { texto: 'No lo sé.', explicacion: 'Lo vemos en el nivel 2.' },
      ],
    },
    {
      id: 'd6',
      nivel: 'intermedio',
      modulo: 'deep',
      enunciado: 'Llega un informe de Deep Research para el comité. ¿Qué revisas primero?',
      opciones: [
        { texto: 'Que esté bien redactado.', explicacion: 'Lo que lo hace utilizable son las fuentes.' },
        { texto: 'Algunas fuentes: que sean sólidas y recientes.', correcta: true, explicacion: 'Correcto.' },
        { texto: 'Nada, ya trae citas.', explicacion: 'Una cita no garantiza una buena fuente.' },
        { texto: 'No lo sé.', explicacion: 'Lo vemos en el nivel 2.' },
      ],
    },
    {
      id: 'd7',
      nivel: 'avanzado',
      modulo: 'agent',
      enunciado: 'El agente llenó un formulario y se detiene antes de enviarlo. ¿Por qué?',
      opciones: [
        { texto: 'Porque falló.', explicacion: 'No falló: está esperando tu decisión.' },
        { texto: 'Porque los pasos con consecuencias los apruebas tú.', correcta: true, explicacion: 'Correcto.' },
        { texto: 'Porque se le acabó el cupo.', explicacion: 'Se detiene por diseño en los pasos con consecuencias.' },
        { texto: 'No lo sé.', explicacion: 'Lo vemos en el nivel 3.' },
      ],
    },
    {
      id: 'd8',
      nivel: 'avanzado',
      modulo: 'codex',
      enunciado: 'Automatizaste el reporte mensual. ¿Cómo sabes que funciona?',
      opciones: [
        { texto: 'Lo corres con un mes que ya conoces y comparas.', correcta: true, explicacion: 'Correcto.' },
        { texto: 'Si no da error, funciona.', explicacion: 'Puede correr sin errores y dar un número equivocado.' },
        { texto: 'Le preguntas a Codex si está bien.', explicacion: 'La validación es contra un resultado conocido.' },
        { texto: 'No lo sé.', explicacion: 'Lo vemos en el nivel 3.' },
      ],
    },
    {
      id: 'd9',
      nivel: 'experto',
      modulo: 'gpts',
      enunciado: 'Vas a cambiar las instrucciones de un GPT que usa todo el equipo. ¿Qué haces antes de publicar?',
      opciones: [
        { texto: 'Nada, se ajusta sobre la marcha.', explicacion: 'Un cambio puede dañar respuestas que ya funcionaban.' },
        { texto: 'Corres un set de casos de prueba, incluidos los difíciles.', correcta: true, explicacion: 'Correcto.' },
        { texto: 'Avisas por correo y publicas.', explicacion: 'Avisar no reemplaza probar.' },
        { texto: 'No lo sé.', explicacion: 'Lo vemos en el nivel 4.' },
      ],
    },
    {
      id: 'd10',
      nivel: 'experto',
      enunciado: '¿Qué demuestra mejor que un flujo con IA está funcionando?',
      opciones: [
        { texto: 'El número de conversaciones.', explicacion: 'Uso no es lo mismo que impacto.' },
        { texto: 'Una métrica de resultado contra su línea base.', correcta: true, explicacion: 'Correcto.' },
        { texto: 'Que nadie se ha quejado.', explicacion: 'La ausencia de quejas no es un dato de impacto.' },
        { texto: 'No lo sé.', explicacion: 'Lo vemos en el nivel 4.' },
      ],
    },
  ],
};
