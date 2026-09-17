import type { Curso } from './tipos';

// Un color por nivel, tomado de los módulos del portal de Claude, para que
// el temario se lea de un vistazo como una escalera.
const C = {
  cobre: '#C15F3C',
  morado: '#8B6DB8',
  teal: '#2E7D8F',
  dorado: '#B08324',
  verde: '#4C7A5A',
  magenta: '#A34860',
};

/**
 * Ruta guiada de Claude: de quien nunca abrió el chat a quien diseña el
 * sistema de IA de su equipo. Cada unidad profundiza un módulo del portal
 * (Artifacts, Projects, Research, Skills, MCP, Claude Code...) y cierra con
 * algo que se hace, no con algo que se lee.
 *
 * Todos los módulos del portal de Claude ya vienen en el plan de la empresa
 * (a diferencia de Copilot, donde algunas unidades piden licencia aparte),
 * así que este curso no recorta unidades por plan. Lo que sí puede variar es
 * el alcance del código de acceso: ver `cursoEnAlcance` en `./index.ts`.
 *
 * Una advertencia para quien edite: el avance se guarda contra el `slug` de
 * cada lección. Renombrar uno borra el avance de esa lección para todos.
 */
export const claudeCurso: Curso = {
  platformId: 'claude',
  titulo: 'Claude en el trabajo, de cero a experto',
  subtitulo: 'Ruta guiada',
  descripcion:
    'Un recorrido por niveles: primero qué es Claude y cómo se le pide bien, después Artifacts y Projects, luego diseño, investigación, el navegador y el trabajo en equipo, más adelante Skills, MCP y Claude Code, y al final el sistema completo del equipo. Lecciones cortas, prácticas revisadas por IA y un examen por nivel.',
  color: C.cobre,
  aprendizajes: [
    'Pedir con destinatario, contexto y límites, y corregir sobre lo que ya salió en vez de empezar de nuevo.',
    'Convertir una idea suelta en un artifact que se usa, y un tema recurrente en un proyecto con instrucciones propias.',
    'Pasar de un documento denso a una pieza presentable, e investigar con fuentes que se pueden verificar.',
    'Usar Claude sobre la pestaña que ya tienes abierta y construir una biblioteca de prompts que le sirve a todo el equipo.',
    'Escribir una skill que ejecuta un procedimiento igual siempre, y conectar Claude a los sistemas de la empresa con permisos claros.',
    'Automatizar tareas de archivos desde la terminal y diseñar el sistema de IA completo de un proceso real.',
  ],
  requisitos: [
    'Una cuenta de Claude con la licencia empresarial de la empresa. Con ella, las conversaciones no se usan para entrenar modelos.',
    'Skills y MCP piden que alguien de TI habilite la conexión o publique la skill: ese acuerdo se hace una vez, no en cada sesión.',
    'Si ya usas Claude a diario, haz el diagnóstico y salta a tu nivel.',
  ],
  niveles: [
    {
      key: 'cero',
      titulo: 'Nivel 0 · Fundamentos',
      promesa: 'Sabes qué es Claude, qué pasa con tus datos y cómo escribir un prompt que funcione a la primera.',
      color: C.teal,
    },
    {
      key: 'basico',
      titulo: 'Nivel 1 · Básico',
      promesa: 'Conviertes una idea suelta en un artifact que se usa y armas un proyecto por cliente o por área.',
      color: C.cobre,
    },
    {
      key: 'intermedio',
      titulo: 'Nivel 2 · Intermedio',
      promesa: 'Presentas con jerarquía, investigas con fuentes, trabajas sobre la pestaña abierta y compartes lo que funciona.',
      color: C.dorado,
    },
    {
      key: 'avanzado',
      titulo: 'Nivel 3 · Avanzado',
      promesa: 'Escribes una skill que se repite igual siempre y conectas Claude a los sistemas con permisos claros.',
      color: C.verde,
    },
    {
      key: 'experto',
      titulo: 'Nivel 4 · Experto',
      promesa: 'Mides el impacto de verdad, gobiernas el uso del equipo y diseñas el sistema completo de un proceso real.',
      color: C.magenta,
    },
  ],

  /* ============================================================ unidades */
  unidades: [
    /* ------------------------------------------------------------ nivel 0 */
    {
      slug: 'fundamentos',
      nivel: 'cero',
      titulo: 'Claude sin misterio',
      descripcion:
        'Qué es Claude, qué pasa con lo que le compartes y cómo pedirle bien. Lo mínimo para que lo que viene después tenga dónde apoyarse.',
      lecciones: [
        {
          slug: 'que-es-claude',
          tipo: 'lectura',
          titulo: 'Qué es Claude y qué puedes usar',
          minutos: 12,
          resumen: 'Un mismo asistente con varias puertas de entrada, según la tarea.',
          objetivos: [
            'Reconocer las formas en que se usa Claude en la empresa: el chat, los proyectos, la terminal y las conexiones.',
            'Saber qué pasa con la información que compartes, con la licencia de la empresa.',
            'Ubicar en qué módulo de este curso se profundiza cada una.',
          ],
          bloques: [
            {
              tipo: 'texto',
              texto:
                'Cuando alguien dice "Claude" puede estar hablando de varias cosas con el mismo motor detrás. El chat en claude.ai sirve para preguntas y redacción sueltas. Un proyecto guarda los archivos y las instrucciones de un cliente o de un área. Claude Code vive en la terminal y automatiza archivos y datos. Y las skills y las conexiones (MCP) son la forma en que Claude aprende un procedimiento de la empresa o se conecta a un sistema como el CRM.',
            },
            {
              tipo: 'conceptos',
              items: [
                {
                  termino: 'Claude.ai (chat)',
                  definicion:
                    'La conversación de todos los días: redactar, resumir, pedir un artifact. Admite documentos completos, no fragmentos.',
                },
                {
                  termino: 'Projects',
                  definicion:
                    'Un espacio con archivos e instrucciones fijas de un tema que se repite en el tiempo: un cliente, un área, un producto.',
                },
                {
                  termino: 'Claude Code',
                  definicion:
                    'La terminal. Sirve sobre todo para tareas repetitivas de archivos y datos, no solo para programar.',
                },
                {
                  termino: 'Skills y MCP',
                  definicion:
                    'Skills enseña un procedimiento de la empresa una sola vez para que se repita igual. MCP conecta Claude a un sistema, con los permisos de quien pregunta.',
                },
              ],
            },
            {
              tipo: 'nota',
              tono: 'clave',
              titulo: 'Con la licencia empresarial, tus conversaciones no entrenan el modelo',
              texto:
                'Eso está en la política de datos que firmó la empresa. Lo que sí sigue siendo tuyo es la responsabilidad: precios, fechas y cantidades se confirman contra la fuente antes de salir con tu nombre.',
            },
            {
              tipo: 'nota',
              tono: 'dato',
              titulo: 'Contexto largo',
              texto:
                'Un contrato de 80 páginas entra entero en la conversación. Puedes preguntar por un numeral específico y pedir la cita textual, no un resumen aproximado.',
            },
          ],
          chequeo: [
            {
              id: 'q1',
              enunciado: 'Con la licencia empresarial de la empresa, ¿qué pasa con lo que se conversa con Claude?',
              opciones: [
                {
                  texto: 'Se usa para entrenar modelos públicos.',
                  explicacion: 'Con la licencia empresarial, las conversaciones no se usan para entrenar modelos.',
                },
                {
                  texto: 'No se usa para entrenar modelos; el detalle está en la política de datos de la empresa.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'Depende de si la conversación fue larga o corta.',
                  explicacion: 'No depende de la extensión, sino de la licencia contratada.',
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
          resumen: 'Para quién, para qué y de qué extensión. Ahí está casi toda la diferencia.',
          objetivos: [
            'Escribir un prompt con destinatario, objetivo y formato.',
            'Corregir sobre lo que ya salió, en vez de empezar de nuevo.',
            'Pedir la cita, no el resumen, cuando el dato importa.',
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
              tipo: 'lista',
              items: [
                'Di para quién es antes de pedir: para quién, para qué y de qué extensión.',
                'Corrige, no arranques otra vez: ajustar lo que ya salió es más rápido y más preciso.',
                'Pide la cita, no el resumen: cuando el dato importa, exige el numeral o el enlace de dónde salió.',
                'Guarda lo que te funcionó: el prompt bueno se guarda en la biblioteca del área, no en tus notas.',
              ],
            },
            {
              tipo: 'nota',
              tono: 'ojo',
              titulo: 'Corrige, no arranques otra vez',
              texto:
                'Si la respuesta casi sirve, pide el ajuste puntual: "más corto", "agrega el IVA", "cámbiale el tono". Es más rápido y más preciso que reescribir el prompt entero.',
            },
          ],
          chequeo: [
            {
              id: 'q1',
              enunciado: 'Claude te entrega un texto casi listo, pero muy largo. ¿Qué es más eficiente?',
              opciones: [
                {
                  texto: 'Escribir un prompt nuevo desde cero, más detallado.',
                  explicacion: 'Es más lento y puedes perder lo que ya estaba bien.',
                },
                {
                  texto: 'Pedirle que lo acorte a la mitad, manteniendo el cierre.',
                  correcta: true,
                  explicacion: 'Corregir sobre lo que ya salió es más rápido y más preciso.',
                },
                {
                  texto: 'Enviarlo así, total el contenido es correcto.',
                  explicacion: 'La extensión también es parte de lo que se pidió.',
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
            rol: 'Analista de servicio al cliente',
            tarea: 'Escribir el correo de seguimiento después de una llamada por una falla',
            situacion:
              'Tu jefa te dice: "mándale un correo de seguimiento al cliente". El cliente reportó una falla en el servicio hace tres días, ya se resolvió, y en la llamada de hoy quedó conforme pero pidió una constancia por escrito. Es un cliente desde hace cuatro años y nunca antes había tenido un reclamo.',
          },
          consigna: 'Escribe el prompt que le darías a Claude para redactar ese correo.',
          placeholder: 'Redacta un correo para...',
          rubrica: [
            { id: 'destinatario', titulo: 'Destinatario', pregunta: '¿Nombra a quién va dirigido el correo y su rol?' },
            { id: 'objetivo', titulo: 'Objetivo', pregunta: '¿Dice qué pasó y qué debe confirmar el correo?' },
            { id: 'contexto', titulo: 'Contexto', pregunta: '¿Incluye el dato relevante: cliente antiguo, sin reclamos previos, ya conforme?' },
            { id: 'formato', titulo: 'Formato y extensión', pregunta: '¿Pide un tono y una extensión concretos?' },
            { id: 'limites', titulo: 'Límites', pregunta: '¿Dice qué no inventar, como plazos o compensaciones no acordadas?' },
          ],
          pistas: [
            'Piensa en lo que necesitarías saber tú si alguien más te pidiera escribir este correo.',
            'El dato de que el cliente ya quedó conforme cambia el tono del correo.',
          ],
          solucion:
            'Redacta un correo para el cliente [nombre], confirmando por escrito la resolución de la falla reportada el [fecha], que ya quedó resuelta según la llamada de hoy. Contexto: es cliente hace cuatro años y este es su primer reclamo; en la llamada quedó conforme. Quiero: máximo 120 palabras, tono cercano y profesional, que confirme la solución aplicada y agradezca la paciencia. No prometas plazos ni compensaciones que no se hayan acordado en la llamada.',
        },
        {
          slug: 'examen-fundamentos',
          tipo: 'examen',
          titulo: 'Examen del nivel 0',
          minutos: 10,
          resumen: 'Seis preguntas sobre datos, contexto largo y prompts. Se aprueba con 80%.',
          aprobacion: 80,
          preguntas: [
            {
              id: 'e1',
              enunciado: '¿Qué pasa con las conversaciones en Claude con la licencia empresarial de la empresa?',
              opciones: [
                {
                  texto: 'Se usan para entrenar modelos públicos.',
                  explicacion: 'Con la licencia empresarial no se usan para entrenar modelos.',
                },
                {
                  texto: 'No se usan para entrenar modelos.',
                  correcta: true,
                  explicacion: 'Correcto, según la política de datos que firmó la empresa.',
                },
                {
                  texto: 'Solo se protegen si se marcan como confidenciales.',
                  explicacion: 'No depende de marcar nada: la protección viene de la licencia contratada.',
                },
              ],
            },
            {
              id: 'e2',
              enunciado: 'Necesitas la cita textual de un numeral de un contrato de 80 páginas. ¿Qué puedes pedirle a Claude?',
              opciones: [
                {
                  texto: 'Un resumen general del contrato, es lo único que se puede pedir.',
                  explicacion: 'El contexto largo permite pedir un numeral específico y la cita textual.',
                },
                {
                  texto: 'El numeral exacto y su cita textual, porque el documento entra completo en la conversación.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'Nada: los documentos largos hay que dividirlos antes de subirlos.',
                  explicacion: 'No hace falta dividirlo: entra completo.',
                },
              ],
            },
            {
              id: 'e3',
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
              id: 'e4',
              enunciado: 'Claude te da una respuesta casi buena, pero con un tono muy informal. ¿Qué es más eficiente?',
              opciones: [
                {
                  texto: 'Pedir que ajuste el tono sobre lo que ya salió.',
                  correcta: true,
                  explicacion: 'Corregir sobre lo que ya salió es más rápido y más preciso.',
                },
                {
                  texto: 'Escribir un prompt nuevo, mucho más largo.',
                  explicacion: 'Es más lento y puede perder lo que ya funcionaba.',
                },
                {
                  texto: 'Enviarla igual.',
                  explicacion: 'El tono también es parte de lo que se pidió.',
                },
              ],
            },
            {
              id: 'e5',
              enunciado: 'Un texto de Claude trae una cifra de ventas. ¿Qué haces antes de compartirla?',
              opciones: [
                {
                  texto: 'La compartes: Claude ya la calculó.',
                  explicacion: 'Los datos que van con tu nombre se confirman contra el sistema.',
                },
                {
                  texto: 'La confirmas contra el sistema antes de compartirla.',
                  correcta: true,
                  explicacion: 'Correcto: lo que sale con tu nombre lo revisas tú.',
                },
                {
                  texto: 'Le pides a Claude que confirme que es correcta.',
                  explicacion: 'Eso no reemplaza verificar contra la fuente real.',
                },
              ],
            },
            {
              id: 'e6',
              enunciado: 'Un prompt te funcionó muy bien para armar actas de reunión. ¿Qué conviene hacer con él?',
              opciones: [
                {
                  texto: 'Guardarlo en tus notas personales.',
                  explicacion: 'Se queda solo contigo y el equipo no se beneficia.',
                },
                {
                  texto: 'Guardarlo en la biblioteca del área para que el equipo lo reutilice.',
                  correcta: true,
                  explicacion: 'Correcto: lo que funciona se comparte, no se archiva en privado.',
                },
                {
                  texto: 'Olvidarlo, cada quien debe escribir el suyo.',
                  explicacion: 'Repetir el trabajo de encontrar un buen prompt es tiempo perdido.',
                },
              ],
            },
          ],
        },
      ],
    },

    /* ------------------------------------------------------------ nivel 1 */
    {
      slug: 'artifacts',
      nivel: 'basico',
      modulo: 'artifacts',
      titulo: 'Artifacts',
      descripcion: 'Pedir un resultado en grande, al lado de la conversación, y corregirlo hablando hasta que sirva.',
      lecciones: [
        {
          slug: 'que-es-un-artifact',
          tipo: 'lectura',
          titulo: 'Qué es un artifact',
          minutos: 12,
          resumen: 'El resultado en grande, al lado del chat: un documento, una tabla, una mini aplicación.',
          objetivos: [
            'Convertir una idea suelta en algo que se puede abrir, usar y mostrar en la misma sesión.',
            'Reconocer los tipos de artifact más comunes en el trabajo: calculadora, formato, gráfico, landing.',
          ],
          bloques: [
            {
              tipo: 'texto',
              texto:
                'Un artifact es el resultado en grande, al lado de la conversación: un documento, una tabla, una mini aplicación. Se corrige hablando, sin volver a empezar. La diferencia con pedirle a Claude un texto normal es que el artifact queda como una pieza aparte, lista para abrir, usar y compartir.',
            },
            {
              tipo: 'lista',
              items: [
                'Calculadora: cotizaciones, escenarios, comparaciones con fórmulas.',
                'Formato: actas, listas de verificación, plantillas que antes vivían en papel.',
                'Visual: un gráfico con los datos reales de la conversación.',
                'Landing: una pieza de una sola pantalla para un lanzamiento o un anuncio.',
              ],
            },
            {
              tipo: 'nota',
              tono: 'clave',
              titulo: 'Se comparte con el equipo, no reemplaza el sistema oficial',
              texto:
                'Un artifact es un prototipo que sirve para decidir y para trabajar rápido. Si se vuelve de uso frecuente, se mueve a un proyecto; no reemplaza el ERP ni el sistema oficial de la empresa.',
            },
          ],
          chequeo: [
            {
              id: 'q1',
              enunciado: '¿Qué es un artifact en Claude?',
              opciones: [
                {
                  texto: 'Un archivo que hay que descargar antes de poder verlo.',
                  explicacion: 'Se ve directamente al lado de la conversación, sin descargar nada primero.',
                },
                {
                  texto: 'El resultado en grande, al lado del chat, que se corrige hablando.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'Una función exclusiva para programadores.',
                  explicacion: 'Sirve para calculadoras, formatos, gráficos y piezas de una pantalla, no solo código.',
                },
              ],
            },
          ],
        },
        {
          slug: 'iterar-sobre-un-artifact',
          tipo: 'lectura',
          titulo: 'Iterar sobre un artifact',
          minutos: 14,
          resumen: 'Describe el resultado, pega datos reales y corrige por partes.',
          objetivos: [
            'Describir el resultado que quieres, no el código o el diseño.',
            'Corregir un artifact un cambio a la vez.',
            'Evitar los errores más comunes al pedir uno.',
          ],
          bloques: [
            {
              tipo: 'lista',
              ordenada: true,
              items: [
                'Describe el resultado, no el código: "una calculadora con estos campos y este total". Claude decide cómo hacerla; tú decides cómo se ve y qué muestra.',
                'Pega los datos reales: tarifas, categorías, nombres de producto. Con datos reales el artifact sirve desde la primera versión.',
                'Corrige por partes: un cambio a la vez, primero los campos, luego los cálculos, al final el diseño.',
                'Guárdalo y compártelo: si es de uso frecuente, muévelo a un proyecto para que el equipo lo encuentre.',
              ],
            },
            {
              tipo: 'comparar',
              antes: {
                titulo: 'Pedido vago',
                texto: 'Hazme una app para cotizar.',
              },
              despues: {
                titulo: 'Pedido con datos reales',
                texto: 'Hazme una calculadora de cotización de servicio con campos horas, tarifa y descuento, y que muestre el total con IVA.',
              },
            },
            {
              tipo: 'nota',
              tono: 'ojo',
              titulo: 'Diez cambios en un solo mensaje',
              texto:
                'Pedir diez ajustes de una sola vez hace difícil saber qué se dañó y qué no. Un cambio a la vez, revisando entre uno y otro.',
            },
          ],
          chequeo: [
            {
              id: 'q1',
              enunciado: 'Un artifact ya casi sirve, pero hay que ajustar los campos, el cálculo y el diseño. ¿Cómo conviene pedirlo?',
              opciones: [
                {
                  texto: 'Los tres cambios en un solo mensaje.',
                  explicacion: 'Dificulta saber cuál cambio dañó qué parte.',
                },
                {
                  texto: 'Un cambio a la vez, revisando entre uno y otro.',
                  correcta: true,
                  explicacion: 'Correcto: así se ve qué funcionó y qué no en cada paso.',
                },
                {
                  texto: 'Pedir un artifact nuevo desde cero por cada ajuste.',
                  explicacion: 'Es más lento que corregir el que ya existe.',
                },
              ],
            },
          ],
        },
        {
          slug: 'practica-calculadora',
          tipo: 'practica',
          titulo: 'Práctica: la calculadora de cotización',
          minutos: 20,
          resumen: 'El comercial necesita una calculadora de cotizaciones para la visita de mañana.',
          bloques: [
            {
              tipo: 'texto',
              texto:
                'Antes se pedía a sistemas un archivo de Excel con fórmulas, y entraba a una cola de trabajo de días. Ahora se describe la lógica en el chat y sale la calculadora funcionando en la misma sesión.',
            },
          ],
          caso: {
            rol: 'Comercial',
            tarea: 'Cotizar en la visita de mañana con el cliente',
            situacion:
              'Mañana visitas a un cliente y necesitas cotizar en vivo. El servicio se cobra por horas y tarifa, con descuentos que van del 0% al 15% según el volumen, y hay que mostrar el total con IVA del 19%.',
          },
          consigna: 'Escribe el prompt para pedirle a Claude la calculadora.',
          placeholder: 'Hazme una calculadora de...',
          rubrica: [
            { id: 'campos', titulo: 'Campos', pregunta: '¿Nombra los campos exactos: horas, tarifa y descuento?' },
            { id: 'regla', titulo: 'Regla de negocio', pregunta: '¿Incluye el rango de descuento permitido?' },
            { id: 'calculo', titulo: 'Cálculo', pregunta: '¿Pide el total con IVA y su porcentaje?' },
            { id: 'uso', titulo: 'Uso en vivo', pregunta: '¿Queda claro que se va a usar delante del cliente, para pedir algo simple de leer?' },
            { id: 'limite', titulo: 'Límite', pregunta: '¿Evita pedir que reemplace el sistema oficial de facturación?' },
          ],
          pistas: [
            'El comercial no va a explicar la fórmula: dale los números y las reglas exactas.',
            'Un descuento con tope evita que la calculadora permita algo que la empresa no autoriza.',
          ],
          solucion:
            'Hazme una calculadora de cotización de servicio con campos horas, tarifa por hora y descuento (de 0% a 15% según volumen). Que muestre el subtotal, el descuento aplicado y el total con IVA del 19%. Necesito que se lea fácil en pantalla, para usarla delante del cliente mañana. No hace falta que guarde ni facture nada: es solo para calcular en la visita.',
        },
      ],
    },
    {
      slug: 'projects',
      nivel: 'basico',
      modulo: 'projects',
      titulo: 'Projects',
      descripcion: 'Un espacio por cliente o por área con sus documentos y sus instrucciones, para no repetir el contexto cada vez.',
      lecciones: [
        {
          slug: 'que-es-un-proyecto',
          tipo: 'lectura',
          titulo: 'Qué es un proyecto',
          minutos: 12,
          resumen: 'Guarda los archivos y las reglas de trabajo de un tema que se repite en el tiempo.',
          objetivos: [
            'Dejar de pegar el mismo contexto en cada conversación.',
            'Reconocer cuándo un tema merece su propio proyecto.',
          ],
          bloques: [
            {
              tipo: 'texto',
              texto:
                'Un proyecto guarda los archivos y las reglas de trabajo de un tema. Todo lo que preguntes dentro del proyecto ya sabe con quién estás trabajando y cómo escribe la empresa. No es una carpeta más: es el lugar donde vive el contexto que hoy se repite en cada conversación nueva.',
            },
            {
              tipo: 'lista',
              items: [
                'Un cliente grande, con contrato, tarifas y acuerdos vigentes.',
                'Un área, con sus políticas internas y su tono de respuesta.',
                'Un producto o servicio, con su ficha técnica y sus preguntas frecuentes.',
              ],
            },
            {
              tipo: 'nota',
              tono: 'clave',
              titulo: 'La unidad correcta es el tema, no la conversación',
              texto:
                'No hagas un proyecto por conversación. Un proyecto sirve cuando el tema vuelve semana tras semana y varias personas necesitan responder lo mismo.',
            },
          ],
          chequeo: [
            {
              id: 'q1',
              enunciado: '¿Cuándo conviene crear un proyecto en vez de una conversación suelta?',
              opciones: [
                {
                  texto: 'Cuando el tema se repite en el tiempo y varias personas lo consultan.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'Cada vez que se abre una conversación nueva.',
                  explicacion: 'No toda conversación necesita un proyecto propio.',
                },
                {
                  texto: 'Solo cuando el archivo pesa más de 10 páginas.',
                  explicacion: 'El tamaño del archivo no es el criterio: es si el tema se repite.',
                },
              ],
            },
          ],
        },
        {
          slug: 'instrucciones-y-mantenimiento',
          tipo: 'lectura',
          titulo: 'Instrucciones y mantenimiento',
          minutos: 14,
          resumen: 'Pocos archivos y buenos, instrucciones claras, y mantenerlo vivo.',
          objetivos: [
            'Escribir instrucciones de proyecto con tono, idioma y límites.',
            'Mantener un proyecto con los archivos vigentes, no con el historial completo.',
          ],
          bloques: [
            {
              tipo: 'lista',
              ordenada: true,
              items: [
                'Un proyecto por cliente o por área: la unidad correcta es el tema que se repite en el tiempo.',
                'Sube pocos archivos y los buenos: contrato vigente, tarifas, políticas. Un proyecto lleno de versiones viejas responde con información vieja.',
                'Escribe las instrucciones: tono, idioma, qué nunca debe inventar y a quién le habla.',
                'Mantenlo vivo: cuando cambie una tarifa o una política, reemplaza el archivo.',
              ],
            },
            {
              tipo: 'prompt',
              etiqueta: 'Instrucciones de proyecto',
              texto: 'Eres el asistente del área de [área]. Responde en español, con cifras verificadas contra los archivos y sin inventar fechas.',
            },
            {
              tipo: 'nota',
              tono: 'ojo',
              titulo: 'Subir toda la carpeta compartida',
              texto:
                'Subir todo "por si acaso" satura el proyecto con versiones reemplazadas. Sube los documentos vigentes y borra los que ya no aplican.',
            },
          ],
          chequeo: [
            {
              id: 'q1',
              enunciado: '¿Qué pasa si un proyecto se deja sin instrucciones?',
              opciones: [
                {
                  texto: 'Nada, las instrucciones son opcionales y no cambian el resultado.',
                  explicacion: 'Sin instrucciones, el proyecto no sabe qué tono usar ni qué nunca inventar.',
                },
                {
                  texto: 'El proyecto pierde lo que lo hace sonar a la empresa: tono, idioma y límites.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'Deja de poder subir archivos.',
                  explicacion: 'Eso no depende de las instrucciones, sino de otra configuración.',
                },
              ],
            },
          ],
        },
        {
          slug: 'practica-instrucciones-proyecto',
          tipo: 'practica',
          titulo: 'Práctica: un proyecto para la cuenta clave',
          minutos: 18,
          resumen: 'La cuenta de un cliente grande la atienden tres personas distintas, cada una con su versión de los hechos.',
          bloques: [
            {
              tipo: 'texto',
              texto:
                'Vas a escribir las instrucciones del proyecto que resuelve este caso. Te revisamos contra una rúbrica de cinco puntos, y después ves cómo lo escribimos nosotros.',
            },
          ],
          caso: {
            rol: 'Encargado de cuenta',
            tarea: 'Unificar cómo el equipo responde a un cliente grande',
            situacion:
              'Tres personas de servicio al cliente atienden a Alimentos del Valle. Cada quien guarda su versión del contrato y del historial, y el que contesta primero decide qué es verdad. Vas a armar el proyecto con el contrato vigente, las tarifas y las actas de comité.',
          },
          consigna: 'Escribe las instrucciones del proyecto.',
          placeholder: 'Eres el asistente de la cuenta de...',
          rubrica: [
            { id: 'rol', titulo: 'Rol', pregunta: '¿Define para qué cliente o cuenta es el asistente?' },
            { id: 'tono', titulo: 'Tono e idioma', pregunta: '¿Especifica idioma y tono de respuesta?' },
            { id: 'fuente', titulo: 'Fuente', pregunta: '¿Pide que las respuestas se verifiquen contra los archivos del proyecto?' },
            { id: 'limite', titulo: 'Límite', pregunta: '¿Dice explícitamente qué nunca debe inventar, como fechas o compensaciones?' },
            { id: 'mantenimiento', titulo: 'Mantenimiento', pregunta: '¿Menciona qué hacer cuando un archivo cambie, como la tarifa vigente?' },
          ],
          pistas: [
            'Piensa en qué le preguntarían las tres personas del equipo, no solo tú.',
            'Una regla sobre "qué nunca inventar" evita el error más caro: prometer algo no acordado.',
          ],
          solucion:
            'Eres el asistente de la cuenta de Alimentos del Valle. Responde en español, con un tono formal y cercano, igual al que usa el equipo con este cliente. Verifica cifras, fechas y condiciones contra el contrato y las tarifas vigentes que están en este proyecto; si no está en los archivos, dilo en vez de inventarlo. Nunca prometas compensaciones ni plazos que no estén en el contrato o en un acta de comité. Cuando cambie la tarifa vigente o se firme un nuevo contrato, reemplaza el archivo correspondiente en este proyecto.',
        },
      ],
    },
    {
      slug: 'cierre-basico',
      nivel: 'basico',
      titulo: 'Cierre del nivel 1',
      descripcion: 'El examen del nivel básico, sobre Artifacts y Projects.',
      lecciones: [
        {
          slug: 'examen-basico',
          tipo: 'examen',
          titulo: 'Examen del nivel 1',
          minutos: 12,
          resumen: 'Preguntas sobre Artifacts y Projects. Se aprueba con 80%.',
          aprobacion: 80,
          preguntas: [
            {
              id: 'e1',
              modulo: 'artifacts',
              enunciado: '¿Qué es un artifact en Claude?',
              opciones: [
                {
                  texto: 'Un archivo que primero hay que descargar para verlo.',
                  explicacion: 'Se ve al lado de la conversación, sin descargar nada.',
                },
                {
                  texto: 'El resultado en grande, al lado del chat, que se corrige hablando.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'Una función exclusiva para desarrolladores.',
                  explicacion: 'Sirve para calculadoras, formatos y piezas visuales, no solo código.',
                },
              ],
            },
            {
              id: 'e2',
              modulo: 'artifacts',
              enunciado: 'Un artifact necesita tres ajustes: campos, cálculo y diseño. ¿Cómo conviene pedirlos?',
              opciones: [
                {
                  texto: 'Los tres en un solo mensaje.',
                  explicacion: 'Dificulta saber qué cambio dañó qué parte.',
                },
                {
                  texto: 'Un cambio a la vez.',
                  correcta: true,
                  explicacion: 'Correcto: así se ve qué funcionó en cada paso.',
                },
                {
                  texto: 'Pedir un artifact nuevo por cada ajuste.',
                  explicacion: 'Es más lento que corregir el que ya existe.',
                },
              ],
            },
            {
              id: 'e3',
              modulo: 'artifacts',
              enunciado: '¿Para qué sirve mover un artifact a un proyecto?',
              opciones: [
                {
                  texto: 'Para borrarlo sin perder el historial.',
                  explicacion: 'Mover a un proyecto no tiene que ver con borrar nada.',
                },
                {
                  texto: 'Para que el equipo lo encuentre cuando es de uso frecuente.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'Es obligatorio para todo artifact.',
                  explicacion: 'Solo conviene cuando se vuelve de uso frecuente.',
                },
              ],
            },
            {
              id: 'e4',
              modulo: 'projects',
              enunciado: '¿Cuándo conviene crear un proyecto en vez de usar una conversación suelta?',
              opciones: [
                {
                  texto: 'Cuando el tema se repite en el tiempo y varias personas lo consultan.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'En cada conversación nueva.',
                  explicacion: 'No toda conversación necesita su propio proyecto.',
                },
                {
                  texto: 'Solo si el cliente lo pide explícitamente.',
                  explicacion: 'El criterio es si el tema se repite, no si el cliente lo solicita.',
                },
              ],
            },
            {
              id: 'e5',
              modulo: 'projects',
              enunciado: '¿Qué pasa si un proyecto se llena de versiones viejas de un mismo archivo?',
              opciones: [
                {
                  texto: 'No pasa nada, Claude siempre usa la más reciente.',
                  explicacion: 'Un proyecto con versiones viejas puede responder con información desactualizada.',
                },
                {
                  texto: 'Puede responder con información vieja.',
                  correcta: true,
                  explicacion: 'Correcto: por eso se sube lo vigente y se retira lo reemplazado.',
                },
                {
                  texto: 'El proyecto deja de funcionar por completo.',
                  explicacion: 'No deja de funcionar, pero sí puede responder mal.',
                },
              ],
            },
            {
              id: 'e6',
              modulo: 'projects',
              enunciado: '¿Qué logra escribir las instrucciones de un proyecto?',
              opciones: [
                {
                  texto: 'Que suene a la empresa: tono, idioma y qué nunca inventar.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'Que se puedan subir más archivos de los permitidos.',
                  explicacion: 'Las instrucciones no cambian el límite de archivos.',
                },
                {
                  texto: 'Nada relevante: son opcionales.',
                  explicacion: 'Sin instrucciones, el proyecto pierde consistencia de tono y de límites.',
                },
              ],
            },
          ],
        },
      ],
    },

    /* ------------------------------------------------------------ nivel 2 */
    {
      slug: 'design',
      nivel: 'intermedio',
      modulo: 'design',
      titulo: 'Diseño y presentación',
      descripcion: 'Pasar de un texto denso a una pieza que se lee, con lo importante primero.',
      lecciones: [
        {
          slug: 'de-texto-a-pieza-presentable',
          tipo: 'lectura',
          titulo: 'De texto denso a pieza presentable',
          minutos: 14,
          resumen: 'No se trata de "ponerle bonito", sino de que lo importante quede primero.',
          objetivos: [
            'Convertir un documento denso en un one pager que sí se lee.',
            'Armar una presentación con una idea por lámina.',
          ],
          bloques: [
            {
              tipo: 'texto',
              texto:
                'No se trata de "ponerle bonito". Se trata de que la información quede en el orden en que la persona la va a leer y con lo importante primero. Un informe de 14 páginas y una reunión de 20 minutos no combinan: alguien tiene que decidir qué va primero.',
            },
            {
              tipo: 'lista',
              items: [
                'One pager: problema, propuesta, tres beneficios, precio y siguiente paso.',
                'Presentación: una idea por lámina, título afirmativo, el detalle en las notas del expositor.',
                'Versión corta: la misma idea, en cinco líneas para un mensaje.',
              ],
            },
            {
              tipo: 'nota',
              tono: 'clave',
              titulo: 'La reunión arranca por la decisión',
              texto:
                'Un one pager con el problema, la propuesta y el precio deja el informe completo como anexo, para quien lo pida. La reunión no se va en contexto.',
            },
          ],
          chequeo: [
            {
              id: 'q1',
              enunciado: '¿Qué cambia por completo qué queda dentro de una pieza y qué se va al anexo?',
              opciones: [
                {
                  texto: 'El tamaño de letra que se use.',
                  explicacion: 'El tamaño de letra no decide qué contenido entra o no.',
                },
                {
                  texto: 'Para quién es y en cuánto tiempo se va a leer.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'El color de la marca.',
                  explicacion: 'El color viene después de decidir la estructura.',
                },
              ],
            },
          ],
        },
        {
          slug: 'jerarquia-y-marca',
          tipo: 'lectura',
          titulo: 'Jerarquía y marca',
          minutos: 14,
          resumen: 'Primero el orden de las ideas, después la marca, al final la revisión de cifras.',
          objetivos: [
            'Reordenar una pieza para que lo importante se lea primero.',
            'Aplicar los colores y el tono de la empresa sin pedir turno en diseño.',
          ],
          bloques: [
            {
              tipo: 'lista',
              ordenada: true,
              items: [
                'Define para quién y en cuánto tiempo: cambia por completo qué queda dentro y qué se va al anexo.',
                'Pide la estructura antes del diseño: primero el orden de las ideas, cuando esté bien, el formato.',
                'Dale la marca: colores, tipografía y lo que no se usa. Sin eso sale un genérico.',
                'Revisa cifras y nombres: precios, fechas y nombres propios se confirman contra la fuente antes de mandar.',
              ],
            },
            {
              tipo: 'prompt',
              etiqueta: 'Marca',
              texto: 'Usa estos colores [#hex, #hex] y tipografía [nombre]. Nada de degradados ni de emojis.',
            },
            {
              tipo: 'nota',
              tono: 'ojo',
              titulo: 'Pedir "que se vea profesional" sin dar marca',
              texto:
                'Sin colores, tipografía y un ejemplo de pieza que funcionó, el resultado sale genérico. Entrega la referencia concreta, no el adjetivo.',
            },
          ],
          chequeo: [
            {
              id: 'q1',
              enunciado: '¿Qué se pide primero al armar una pieza de diseño?',
              opciones: [
                {
                  texto: 'Los colores de la marca.',
                  explicacion: 'La marca se aplica después de tener la estructura.',
                },
                {
                  texto: 'La estructura: el orden en que van las ideas.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'El nombre del archivo final.',
                  explicacion: 'Eso no aporta a la calidad del contenido.',
                },
              ],
            },
          ],
        },
        {
          slug: 'practica-one-pager',
          tipo: 'practica',
          titulo: 'Práctica: el one pager para el gerente financiero',
          minutos: 20,
          resumen: 'Un informe de 14 páginas y una reunión con el cliente de 20 minutos.',
          bloques: [
            {
              tipo: 'texto',
              texto: 'Escribe el prompt para convertir el informe en la pieza que la reunión necesita. Te revisamos contra una rúbrica de cinco puntos.',
            },
          ],
          caso: {
            rol: 'Comercial',
            tarea: 'Preparar la reunión de mañana con el cliente',
            situacion:
              'Tienes un informe de 14 páginas sobre una propuesta de servicio. La reunión con el cliente es de 20 minutos y el gerente financiero suele preguntar por el precio en los primeros tres minutos.',
          },
          consigna: 'Escribe el prompt para convertir el informe en un one pager.',
          placeholder: 'Convierte este documento en un one pager...',
          rubrica: [
            { id: 'destinatario', titulo: 'Destinatario', pregunta: '¿Dice para quién es la pieza (el gerente financiero)?' },
            { id: 'estructura', titulo: 'Estructura', pregunta: '¿Pide problema, propuesta, beneficios, precio y siguiente paso?' },
            { id: 'orden', titulo: 'Orden', pregunta: '¿Pide que el precio quede visible temprano, no al final?' },
            { id: 'anexo', titulo: 'Anexo', pregunta: '¿Deja el informe completo como anexo en vez de perderlo?' },
            { id: 'revision', titulo: 'Revisión', pregunta: '¿Menciona confirmar cifras antes de enviarlo?' },
          ],
          pistas: [
            'El gerente financiero pregunta por el precio temprano: no lo dejes para el final de la pieza.',
            'El informe no se descarta, se convierte en anexo.',
          ],
          solucion:
            'Convierte este documento en un one pager para el gerente financiero del cliente: problema, propuesta, tres beneficios con cifra, precio y siguiente paso, en ese orden, con el precio visible sin tener que buscarlo. Deja el informe completo como anexo, por si lo piden. Voy a confirmar las cifras de precio contra el sistema antes de enviarlo.',
        },
      ],
    },
    {
      slug: 'research',
      nivel: 'intermedio',
      modulo: 'research',
      titulo: 'Research',
      descripcion: 'Investigación con fuentes: Claude busca, contrasta y entrega el hallazgo con el enlace de dónde salió cada dato.',
      lecciones: [
        {
          slug: 'investigar-con-fuentes',
          tipo: 'lectura',
          titulo: 'Investigar con fuentes',
          minutos: 14,
          resumen: 'Sirve para lo que no está en tus archivos: competencia, normativa, proveedores, tendencias.',
          objetivos: [
            'Usar research para lo que no está en los archivos de la empresa.',
            'Entender por qué lo importante son las fuentes, no el texto.',
          ],
          bloques: [
            {
              tipo: 'texto',
              texto:
                'Sirve para lo que no está en tus archivos: competencia, normativa, proveedores, tendencias. Lo importante no es el texto, son las fuentes: un dato sin de dónde salió no sirve para decidir nada.',
            },
            {
              tipo: 'chat',
              titulo: 'Research',
              pregunta: 'Tarifas publicadas de tres competidores en Bogotá, con fuente.',
              respuesta: 'Encontré tarifas de dos; el tercero no publica precios. Te dejo la tabla y los enlaces.',
            },
            {
              tipo: 'nota',
              tono: 'clave',
              titulo: 'Llegar sabiendo de dónde salió el dato',
              texto:
                'Un panorama de competencia o de normativa vale más cuando cada cifra trae su enlace: eso es lo que un jefe puede verificar antes de decidir.',
            },
          ],
          chequeo: [
            {
              id: 'q1',
              enunciado: '¿Qué es lo más importante de un buen resultado de research?',
              opciones: [
                {
                  texto: 'Que el texto sea largo.',
                  explicacion: 'La extensión no es lo que hace confiable un research.',
                },
                {
                  texto: 'Que cada dato traiga su fuente.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'Que use palabras técnicas.',
                  explicacion: 'El vocabulario no reemplaza tener de dónde verificar el dato.',
                },
              ],
            },
          ],
        },
        {
          slug: 'delimitar-y-verificar',
          tipo: 'lectura',
          titulo: 'Delimitar la pregunta y verificar',
          minutos: 14,
          resumen: 'País, periodo y segmento acotan una pregunta infinita a una que se puede responder.',
          objetivos: [
            'Delimitar una pregunta de research por país, periodo y segmento.',
            'Pedir lo que no se pudo confirmar, no solo lo que sí.',
          ],
          bloques: [
            {
              tipo: 'lista',
              ordenada: true,
              items: [
                'Delimita la pregunta: país, periodo, segmento. "Precios de la competencia" es infinito; "tarifas publicadas 2026 en Bogotá" se puede responder.',
                'Exige fuente por dato: pide el enlace al lado de cada cifra.',
                'Pide lo que no encontró: un buen research dice qué quedó sin confirmar.',
                'Cierra con la decisión: media página de implicaciones, no veinte páginas de datos.',
              ],
            },
            {
              tipo: 'nota',
              tono: 'ojo',
              titulo: 'Copiar el resumen sin abrir ni una fuente',
              texto:
                'Cuando la cifra va a la decisión, ábrele al menos las fuentes de las que más importan. El resumen puede sonar seguro y estar mal interpretado.',
            },
          ],
          chequeo: [
            {
              id: 'q1',
              enunciado: '¿Por qué "precios de la competencia" es una mala pregunta para research?',
              opciones: [
                {
                  texto: 'Porque no tiene país, periodo ni segmento definidos.',
                  correcta: true,
                  explicacion: 'Correcto: sin acotar, es una pregunta infinita.',
                },
                {
                  texto: 'Porque menciona a la competencia.',
                  explicacion: 'El problema no es el tema, es la falta de límites.',
                },
                {
                  texto: 'No hay problema, es una buena pregunta.',
                  explicacion: 'Sin acotar, difícilmente se puede responder de forma útil.',
                },
              ],
            },
          ],
        },
        {
          slug: 'practica-panorama-competencia',
          tipo: 'practica',
          titulo: 'Práctica: el panorama para el comité',
          minutos: 20,
          resumen: 'El comité pide un panorama de precios de la competencia para el jueves.',
          bloques: [
            {
              tipo: 'texto',
              texto: 'Escribe el prompt de research para este caso. Te revisamos contra una rúbrica de cinco puntos.',
            },
          ],
          caso: {
            rol: 'Analista comercial',
            tarea: 'Preparar el panorama de precios para el comité del jueves',
            situacion:
              'El comité pide un panorama de precios de tres competidores directos, en el mercado de Bogotá, para decidir si se ajusta la tarifa del próximo trimestre.',
          },
          consigna: 'Escribe el prompt de research para Claude.',
          placeholder: 'Investiga...',
          rubrica: [
            { id: 'segmento', titulo: 'Segmento', pregunta: '¿Nombra los competidores o el segmento concreto?' },
            { id: 'geografia', titulo: 'Geografía y periodo', pregunta: '¿Acota ciudad y periodo (vigente, actual)?' },
            { id: 'fuente', titulo: 'Fuente por dato', pregunta: '¿Pide el enlace o la fuente de cada precio?' },
            { id: 'vacios', titulo: 'Lo que falta', pregunta: '¿Pide que se indique qué no se pudo confirmar?' },
            { id: 'cierre', titulo: 'Cierre', pregunta: '¿Pide un resumen final de implicaciones para el comité?' },
          ],
          pistas: [
            'El comité no va a leer veinte páginas: pide el cierre en media página.',
            'Un competidor sin precios públicos también es información.',
          ],
          solucion:
            'Investiga qué están ofreciendo estos tres competidores en Bogotá: [nombres], con precios públicos vigentes si existen, y la fuente de cada dato. Si alguno no publica precios, dilo explícitamente. Arma una tabla comparativa y cierra con media página de lo que esto cambia para nuestra decisión de tarifa del próximo trimestre.',
        },
      ],
    },
    {
      slug: 'chrome',
      nivel: 'intermedio',
      modulo: 'chrome',
      titulo: 'Claude en el navegador',
      descripcion: 'Usarlo sobre la pestaña que ya tienes abierta: el portal de compras, el correo web, el sistema interno.',
      lecciones: [
        {
          slug: 'claude-en-la-pestana',
          tipo: 'lectura',
          titulo: 'Claude sobre la pestaña activa',
          minutos: 12,
          resumen: 'Mucho del trabajo pasa en el navegador, no en un archivo.',
          objetivos: [
            'Resumir una página larga sin leerla completa.',
            'Comparar dos pestañas de proveedores en una tabla.',
          ],
          bloques: [
            {
              tipo: 'texto',
              texto:
                'Mucho del trabajo pasa en el navegador y no en un archivo. En esas pantallas Claude sirve para resumir, comparar y llenar formularios largos sin cambiar de ventana.',
            },
            {
              tipo: 'prompt',
              etiqueta: 'Resumen',
              texto: 'Resume esta página en 5 puntos y dime qué obligaciones nos quedarían si aceptamos.',
            },
            {
              tipo: 'nota',
              tono: 'ojo',
              titulo: 'Solo en sistemas autorizados',
              texto:
                'En pantallas con datos personales, confirma con TI qué sistemas están autorizados antes de usarlo ahí.',
            },
          ],
          chequeo: [
            {
              id: 'q1',
              enunciado: '¿Para qué sirve usar Claude sobre la pestaña abierta?',
              opciones: [
                {
                  texto: 'Solo para navegar más rápido.',
                  explicacion: 'No es sobre velocidad de navegación, sino sobre resumir, comparar y extraer.',
                },
                {
                  texto: 'Para resumir, comparar y llenar formularios sin cambiar de ventana.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'Para reemplazar el sistema donde vive la información.',
                  explicacion: 'No reemplaza el sistema: trabaja sobre lo que ya está en pantalla.',
                },
              ],
            },
          ],
        },
        {
          slug: 'extraccion-no-opinion',
          tipo: 'lectura',
          titulo: 'Extracción, no opinión',
          minutos: 12,
          resumen: 'Pedir requisitos y fechas antes que pedir una opinión sobre si conviene.',
          objetivos: [
            'Pedir extracción de datos antes que una recomendación.',
            'Verificar en la página lo que es crítico: fechas y montos.',
          ],
          bloques: [
            {
              tipo: 'lista',
              ordenada: true,
              items: [
                'Ten la pestaña correcta al frente: si el contenido está tras un login, ábrelo primero.',
                'Pide extracción, no opinión: "sácame requisitos y fechas" antes que "¿nos conviene?".',
                'Verifica lo crítico en la página: fechas de cierre y montos se leen en la fuente, siempre.',
                'Guarda el resumen donde vive el caso: pégalo en el proyecto del cliente.',
              ],
            },
            {
              tipo: 'nota',
              tono: 'clave',
              titulo: 'Confiar en el resumen para una fecha de cierre',
              texto:
                'Las fechas de cierre y los montos se verifican directamente en la página, nunca solo en el resumen.',
            },
          ],
          chequeo: [
            {
              id: 'q1',
              enunciado: '¿Qué se verifica siempre directamente en la página, no solo en el resumen de Claude?',
              opciones: [
                {
                  texto: 'El nombre de la empresa que publica la página.',
                  explicacion: 'Ese dato no suele ser crítico ni cambia con el tiempo.',
                },
                {
                  texto: 'Fechas de cierre y montos.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'El color del sitio.',
                  explicacion: 'El diseño de la página no es un dato que se deba verificar.',
                },
              ],
            },
          ],
        },
        {
          slug: 'practica-licitacion',
          tipo: 'practica',
          titulo: 'Práctica: los términos de la licitación',
          minutos: 18,
          resumen: 'Los términos de una licitación publicados en un portal, con 30 pantallas.',
          bloques: [
            {
              tipo: 'texto',
              texto: 'Escribe el prompt para resolver este caso desde la pestaña del portal. Te revisamos contra una rúbrica de cinco puntos.',
            },
          ],
          caso: {
            rol: 'Comercial',
            tarea: 'Decidir si la empresa se presenta a una licitación',
            situacion:
              'Los términos de una licitación están publicados en un portal, en 30 pantallas. El cierre es en cinco días y hay que decidir si la empresa cumple los requisitos antes de invertir tiempo en la propuesta.',
          },
          consigna: 'Escribe el prompt para usar sobre la pestaña del portal.',
          placeholder: 'Sácame de esta página...',
          rubrica: [
            { id: 'extraccion', titulo: 'Extracción', pregunta: '¿Pide requisitos y fechas en lista, no una opinión?' },
            { id: 'obligaciones', titulo: 'Obligaciones', pregunta: '¿Pide identificar las obligaciones que se asumirían?' },
            { id: 'fecha', titulo: 'Fecha crítica', pregunta: '¿Menciona verificar la fecha de cierre directamente en la página?' },
            { id: 'formato', titulo: 'Formato', pregunta: '¿Pide un formato corto, sin texto de relleno?' },
            { id: 'destino', titulo: 'Destino', pregunta: '¿Dice dónde va a guardar el resultado, como el proyecto del caso?' },
          ],
          pistas: [
            'No pidas todavía "¿nos conviene presentarnos?": primero necesitas los hechos.',
            'La fecha de cierre es el dato que más cuesta equivocar.',
          ],
          solucion:
            'Sácame de esta página los requisitos y las fechas clave en una lista, sin texto de relleno, y marca las obligaciones que asumiríamos si nos presentamos. Voy a confirmar la fecha de cierre directamente en la página antes de decidir. Guarda el resumen en el proyecto de esta licitación para que el equipo lo revise.',
        },
      ],
    },
    {
      slug: 'cowork',
      nivel: 'intermedio',
      modulo: 'cowork',
      titulo: 'Trabajo en equipo',
      descripcion: 'Cómo trabaja un área completa sobre lo mismo: prompts compartidos, proyectos por cuenta y criterios de revisión.',
      lecciones: [
        {
          slug: 'la-biblioteca-del-area',
          tipo: 'lectura',
          titulo: 'La biblioteca del área',
          minutos: 12,
          resumen: 'El salto de valor aparece cuando el equipo comparte, no cuando cada quien descubre por su cuenta.',
          objetivos: [
            'Tener una biblioteca de prompts del área, no una carpeta personal por persona.',
            'Repartir quién mantiene cada proyecto.',
          ],
          bloques: [
            {
              tipo: 'texto',
              texto:
                'El salto de valor no es individual. Aparece cuando el equipo comparte los proyectos, los prompts que sirven y una regla común de qué se revisa antes de mandar algo.',
            },
            {
              tipo: 'prompt',
              etiqueta: 'Extraer un prompt para la biblioteca',
              texto: 'De esta conversación, extrae el prompt que funcionó y déjalo listo para guardar, con los campos entre corchetes.',
            },
            {
              tipo: 'nota',
              tono: 'ojo',
              titulo: 'Guardar todos los prompts, funcionen o no',
              texto:
                'Solo los que ya dieron un buen resultado en un caso real entran a la biblioteca. Guardar de más la vuelve inútil para buscar.',
            },
          ],
          chequeo: [
            {
              id: 'q1',
              enunciado: '¿Qué prompts conviene guardar en la biblioteca del área?',
              opciones: [
                {
                  texto: 'Todos los que se escriban, sin filtrar.',
                  explicacion: 'Guardar de más hace que la biblioteca sea difícil de usar.',
                },
                {
                  texto: 'Solo los que ya dieron un buen resultado en un caso real.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'Solo los del jefe del área.',
                  explicacion: 'El aporte de todo el equipo es lo que hace útil la biblioteca.',
                },
              ],
            },
          ],
        },
        {
          slug: 'criterios-y-responsables',
          tipo: 'lectura',
          titulo: 'Criterios y responsables',
          minutos: 12,
          resumen: 'Un responsable por proyecto y una lista corta de qué se revisa siempre.',
          objetivos: [
            'Acordar qué se revisa siempre antes de enviar algo al cliente.',
            'Nombrar un responsable por proyecto.',
          ],
          bloques: [
            {
              tipo: 'lista',
              ordenada: true,
              items: [
                'Nombra un responsable por proyecto: alguien mantiene los archivos vigentes.',
                'Guarda solo los prompts que ya funcionaron, con una línea de cuándo usarlo.',
                'Acuerda la lista de verificación: cinco puntos máximo, como cifras, nombres, fechas, tono y datos sensibles.',
                'Revisen casos cada quincena: quince minutos de qué funcionó, qué no.',
              ],
            },
            {
              tipo: 'nota',
              tono: 'clave',
              titulo: 'Sin dueño, el proyecto envejece en tres semanas',
              texto:
                'Un proyecto sin responsable acumula versiones viejas rápido. Alguien tiene que tener la tarea explícita de mantenerlo.',
            },
          ],
          chequeo: [
            {
              id: 'q1',
              enunciado: '¿Qué pasa cuando un proyecto compartido no tiene un responsable asignado?',
              opciones: [
                {
                  texto: 'Se mantiene igual de actualizado que uno con dueño.',
                  explicacion: 'Sin dueño, tiende a acumular versiones viejas rápido.',
                },
                {
                  texto: 'Tiende a envejecer, porque nadie tiene la tarea explícita de mantenerlo.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'Se elimina automáticamente.',
                  explicacion: 'No se elimina solo; simplemente deja de estar al día.',
                },
              ],
            },
          ],
        },
        {
          slug: 'practica-guia-induccion',
          tipo: 'practica',
          titulo: 'Práctica: la guía de una página',
          minutos: 15,
          resumen: 'Alguien entra al equipo esta semana y nunca ha usado Claude.',
          bloques: [
            {
              tipo: 'texto',
              texto: 'Escribe el prompt para generar la guía de inducción. Te revisamos contra una rúbrica de cinco puntos.',
            },
          ],
          caso: {
            rol: 'Jefe de área',
            tarea: 'Preparar a una persona nueva para usar Claude desde el primer día',
            situacion:
              'Entra alguien nuevo al equipo esta semana. Nunca ha usado Claude, y el área ya tiene una biblioteca de prompts y un proyecto por cliente.',
          },
          consigna: 'Escribe el prompt para pedir la guía de inducción de una página.',
          placeholder: 'Escribe la guía de una página para...',
          rubrica: [
            { id: 'publico', titulo: 'Público', pregunta: '¿Dice que es para alguien que nunca ha usado la herramienta?' },
            { id: 'extension', titulo: 'Extensión', pregunta: '¿Pide una página, no un manual completo?' },
            { id: 'contenido', titulo: 'Contenido mínimo', pregunta: '¿Pide que incluya dónde está la biblioteca y los proyectos del área?' },
            { id: 'practico', titulo: 'Práctico', pregunta: '¿Pide un ejemplo de uso real, no solo teoría?' },
            { id: 'revision', titulo: 'Revisión', pregunta: '¿Menciona que alguien del equipo la revise antes de entregarla?' },
          ],
          pistas: [
            'Una guía de una página no explica toda la herramienta, solo lo que esta persona necesita el primer día.',
            'Un ejemplo real vale más que una lista de funciones.',
          ],
          solucion:
            'Escribe la guía de 1 página para alguien que entra al equipo esta semana y nunca ha usado Claude: dónde está la biblioteca de prompts del área, dónde están los proyectos de cada cliente, y un ejemplo real de un prompt que ya funcionó. Que sea concreta y corta, pensada para leerse en diez minutos. La voy a revisar con el equipo antes de entregarla.',
        },
      ],
    },
    {
      slug: 'cierre-intermedio',
      nivel: 'intermedio',
      titulo: 'Cierre del nivel 2',
      descripcion: 'El examen del nivel intermedio, sobre diseño, research, navegador y trabajo en equipo.',
      lecciones: [
        {
          slug: 'examen-intermedio',
          tipo: 'examen',
          titulo: 'Examen del nivel 2',
          minutos: 14,
          resumen: 'Preguntas sobre diseño, research, el navegador y el trabajo en equipo. Se aprueba con 80%.',
          aprobacion: 80,
          preguntas: [
            {
              id: 'e1',
              modulo: 'design',
              enunciado: '¿Qué se define primero al pedir una pieza de diseño?',
              opciones: [
                {
                  texto: 'Los colores de la marca.',
                  explicacion: 'La marca se aplica después de tener la estructura.',
                },
                {
                  texto: 'Para quién es y en cuánto tiempo se va a leer.',
                  correcta: true,
                  explicacion: 'Correcto: eso decide qué queda dentro y qué se va al anexo.',
                },
                {
                  texto: 'El número de páginas del documento original.',
                  explicacion: 'No es lo que define la estructura de la pieza nueva.',
                },
              ],
            },
            {
              id: 'e2',
              modulo: 'design',
              enunciado: '¿Qué falta al pedir "que se vea profesional" sin más contexto?',
              opciones: [
                {
                  texto: 'Colores, tipografía y una referencia de pieza que funcionó.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'Nada, es una instrucción suficiente.',
                  explicacion: 'Sin marca ni referencia, el resultado sale genérico.',
                },
                {
                  texto: 'Solo el nombre del cliente.',
                  explicacion: 'El nombre del cliente no resuelve la falta de marca ni de referencia.',
                },
              ],
            },
            {
              id: 'e3',
              modulo: 'research',
              enunciado: '¿Por qué "precios de la competencia" es una mala pregunta de research?',
              opciones: [
                {
                  texto: 'Porque no acota país, periodo ni segmento.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'Porque menciona a la competencia.',
                  explicacion: 'El problema es la falta de límites, no el tema.',
                },
                {
                  texto: 'No hay ningún problema con esa pregunta.',
                  explicacion: 'Sin acotar, es casi imposible de responder de forma útil.',
                },
              ],
            },
            {
              id: 'e4',
              modulo: 'research',
              enunciado: '¿Qué debe traer cada cifra de un buen resultado de research?',
              opciones: [
                {
                  texto: 'Su fuente o enlace.',
                  correcta: true,
                  explicacion: 'Correcto: sin eso, el informe no sirve para decidir.',
                },
                {
                  texto: 'Un emoji que la resalte.',
                  explicacion: 'El formato visual no reemplaza la fuente.',
                },
                {
                  texto: 'Nada adicional, basta con el número.',
                  explicacion: 'El número sin fuente no se puede verificar.',
                },
              ],
            },
            {
              id: 'e5',
              modulo: 'chrome',
              enunciado: '¿Qué se verifica siempre directamente en la página, no solo en el resumen?',
              opciones: [
                {
                  texto: 'Fechas de cierre y montos.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'El diseño visual del sitio.',
                  explicacion: 'No es un dato crítico para la decisión.',
                },
                {
                  texto: 'Nada, el resumen siempre es exacto.',
                  explicacion: 'Los datos críticos se verifican en la fuente, siempre.',
                },
              ],
            },
            {
              id: 'e6',
              modulo: 'chrome',
              enunciado: 'Ante una página larga de licitación, ¿qué se pide primero?',
              opciones: [
                {
                  texto: 'Una opinión sobre si conviene presentarse.',
                  explicacion: 'Antes de opinar hace falta la extracción de los hechos.',
                },
                {
                  texto: 'Extracción de requisitos y fechas en lista.',
                  correcta: true,
                  explicacion: 'Correcto: extracción antes que opinión.',
                },
                {
                  texto: 'Nada, se decide sin leer los términos.',
                  explicacion: 'Decidir sin los hechos es un riesgo alto.',
                },
              ],
            },
            {
              id: 'e7',
              modulo: 'cowork',
              enunciado: '¿Qué prompts entran a la biblioteca del área?',
              opciones: [
                {
                  texto: 'Todos, sin filtrar.',
                  explicacion: 'Guardar de más hace que la biblioteca sea difícil de usar.',
                },
                {
                  texto: 'Solo los que ya dieron un buen resultado en un caso real.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'Solo los más largos.',
                  explicacion: 'La extensión no es el criterio de calidad de un prompt.',
                },
              ],
            },
            {
              id: 'e8',
              modulo: 'cowork',
              enunciado: '¿Qué pasa cuando un proyecto compartido no tiene un responsable?',
              opciones: [
                {
                  texto: 'Se mantiene igual de actualizado.',
                  explicacion: 'Sin dueño, tiende a envejecer rápido.',
                },
                {
                  texto: 'Tiende a acumular versiones viejas.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'Se cierra automáticamente.',
                  explicacion: 'No se cierra solo, simplemente deja de estar al día.',
                },
              ],
            },
          ],
        },
      ],
    },

    /* ------------------------------------------------------------ nivel 3 */
    {
      slug: 'skills',
      nivel: 'avanzado',
      modulo: 'skills',
      titulo: 'Skills',
      descripcion: 'Enseñarle a Claude el procedimiento de la empresa una sola vez para que lo repita igual cada vez.',
      lecciones: [
        {
          slug: 'que-es-una-skill',
          tipo: 'lectura',
          titulo: 'Qué es una skill',
          minutos: 14,
          resumen: 'Lo que en otras herramientas queda en un prompt personal, acá se escribe una vez y lo usa todo el equipo.',
          objetivos: [
            'Entender qué resuelve una skill frente a un prompt personal.',
            'Reconocer cuándo una tarea repetitiva es candidata a skill.',
          ],
          bloques: [
            {
              tipo: 'texto',
              texto:
                'Una skill es un instructivo que Claude carga cuando aplica: cómo se arma una cotización, cómo se responde un reclamo, qué formato lleva el acta. Es la forma de que el resultado no dependa de quién escriba el prompt ese día.',
            },
            {
              tipo: 'prompt',
              etiqueta: 'Aplicar una skill',
              texto: 'Aplica la skill cotizacion-estandar a este caso.',
            },
            {
              tipo: 'nota',
              tono: 'clave',
              titulo: 'El procedimiento se ejecuta igual siempre',
              texto:
                'Lo que en otras herramientas queda en un prompt personal, acá se escribe una vez como skill y lo usa todo el equipo, con el mismo formato y los mismos mínimos.',
            },
          ],
          chequeo: [
            {
              id: 'q1',
              enunciado: '¿Qué problema resuelve una skill frente a un prompt escrito por cada persona?',
              opciones: [
                {
                  texto: 'Que el resultado no dependa de quién escribió el prompt.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'Que las respuestas sean más largas.',
                  explicacion: 'La extensión no es el objetivo de una skill.',
                },
                {
                  texto: 'Que solo una persona pueda usarla.',
                  explicacion: 'Es al revés: la puede usar todo el equipo.',
                },
              ],
            },
          ],
        },
        {
          slug: 'reglas-duras-y-pruebas',
          tipo: 'lectura',
          titulo: 'Reglas duras y pruebas',
          minutos: 16,
          resumen: 'La salida exacta, los "nunca", y probarla con casos reales antes de repartirla.',
          objetivos: [
            'Definir la salida exacta de una skill: formato, columnas, extensión.',
            'Escribir las reglas duras de una skill.',
            'Probar una skill con casos reales, incluido uno difícil.',
          ],
          bloques: [
            {
              tipo: 'lista',
              ordenada: true,
              items: [
                'Escoge una tarea repetitiva y clara: si el procedimiento no está escrito en ninguna parte, primero escríbelo.',
                'Define la salida exacta: formato, columnas, extensión. Es lo que hace comparable el resultado entre personas.',
                'Escribe las reglas duras: los "nunca", como no bajar del piso de precio o no prometer fechas.',
                'Pruébala con casos reales: tres casos, incluido uno difícil, antes de repartirla al equipo.',
              ],
            },
            {
              tipo: 'prompt',
              etiqueta: 'Reglas duras',
              texto: 'Nunca cotices por debajo de [piso]. Si el caso lo exige, escribe "requiere aprobación de dirección".',
            },
            {
              tipo: 'nota',
              tono: 'ojo',
              titulo: 'Repartirla al equipo sin probarla',
              texto:
                'Una skill sin pruebas puede fallar justo en el caso difícil que más importa. Pruébala con tres casos reales y corrige antes de publicarla.',
            },
          ],
          chequeo: [
            {
              id: 'q1',
              enunciado: '¿Por qué probar una skill con un caso difícil antes de repartirla?',
              opciones: [
                {
                  texto: 'Porque los casos difíciles son los que muestran dónde falla.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'No hace falta, los casos simples bastan.',
                  explicacion: 'Los casos simples no muestran los límites de la skill.',
                },
                {
                  texto: 'Solo para que se vea más completa.',
                  explicacion: 'El objetivo es encontrar fallas antes de publicarla, no aparentar completitud.',
                },
              ],
            },
          ],
        },
        {
          slug: 'practica-skill-cotizacion',
          tipo: 'practica',
          titulo: 'Práctica: la skill de cotización',
          minutos: 22,
          resumen: 'Cinco asesores, cinco formatos, y un jefe corrigiendo lo mismo todas las semanas.',
          bloques: [
            {
              tipo: 'texto',
              texto: 'Escribe la skill que resuelve este caso: cuándo se usa, pasos obligatorios, formato de salida y qué nunca debe hacer.',
            },
          ],
          caso: {
            rol: 'Jefe comercial',
            tarea: 'Estandarizar cómo el equipo cotiza',
            situacion:
              'Cinco asesores arman la cotización cada uno a su manera. El piso de precio es 95.000 por hora, y cualquier descuento mayor al 12% necesita aprobación de dirección.',
          },
          consigna: 'Escribe la skill completa: cuándo se usa, pasos, formato de salida y reglas duras.',
          placeholder: 'Cuándo se usa: ...\nPasos: ...\nFormato de salida: ...\nNunca: ...',
          rubrica: [
            { id: 'alcance', titulo: 'Cuándo se usa', pregunta: '¿Define con claridad para qué casos aplica la skill?' },
            { id: 'formato', titulo: 'Formato de salida', pregunta: '¿Fija un formato exacto, comparable entre asesores?' },
            { id: 'piso', titulo: 'Piso de precio', pregunta: '¿Incluye el piso de 95.000 por hora como regla dura?' },
            { id: 'aprobacion', titulo: 'Aprobación', pregunta: '¿Dice qué hacer cuando el descuento supera el 12%?' },
            { id: 'pruebas', titulo: 'Casos de prueba', pregunta: '¿Propone al menos un caso difícil para probarla antes de publicarla?' },
          ],
          pistas: [
            'Una skill que dice "requiere aprobación" es mejor que una que aplica un descuento no autorizado.',
            'El formato de salida es lo que hace que dos asesores entreguen algo comparable.',
          ],
          solucion:
            'Cuándo se usa: para cualquier cotización de servicio por horas. Pasos: pedir horas, tarifa y descuento solicitado; calcular subtotal, descuento y total con IVA. Formato de salida: tabla de seis columnas (concepto, horas, tarifa, descuento, subtotal, total). Nunca: cotizar por debajo de 95.000 por hora; si el descuento pedido supera el 12%, no aplicarlo y escribir "requiere aprobación de dirección" en vez de inventar una excepción. Casos de prueba: una cotización normal con 5% de descuento, y una con 20% de descuento para verificar que marca la alerta de aprobación.',
        },
      ],
    },
    {
      slug: 'mcp',
      nivel: 'avanzado',
      modulo: 'mcp',
      titulo: 'Conexiones (MCP)',
      descripcion: 'Conectar Claude a los sistemas donde ya está la información: el CRM, el repositorio, la mesa de ayuda.',
      lecciones: [
        {
          slug: 'que-es-mcp',
          tipo: 'lectura',
          titulo: 'Qué es MCP',
          minutos: 14,
          resumen: 'El estándar con el que Claude se conecta a una herramienta de la empresa, con los permisos de quien pregunta.',
          objetivos: [
            'Entender qué resuelve una conexión MCP frente a exportar reportes a mano.',
            'Saber que una conexión respeta los permisos de quien pregunta.',
          ],
          bloques: [
            {
              tipo: 'texto',
              texto:
                'MCP es el estándar con el que Claude se conecta a una herramienta de la empresa. En vez de copiar y pegar datos, consulta la fuente con los permisos de quien pregunta.',
            },
            {
              tipo: 'prompt',
              etiqueta: 'Consulta al CRM',
              texto: 'Del CRM: dame las oportunidades de [mes] por encima de [monto] que no tienen actividad hace 15 días.',
            },
            {
              tipo: 'nota',
              tono: 'clave',
              titulo: 'Con los permisos de quien pregunta',
              texto:
                'Una conexión MCP no le da a Claude un acceso nuevo: usa el mismo permiso que ya tiene la persona que hace la pregunta, con trazabilidad de la consulta.',
            },
          ],
          chequeo: [
            {
              id: 'q1',
              enunciado: '¿Qué permisos usa Claude al consultar un sistema conectado por MCP?',
              opciones: [
                {
                  texto: 'Los de un administrador, siempre.',
                  explicacion: 'No usa un permiso especial: usa el de quien pregunta.',
                },
                {
                  texto: 'Los de quien hace la pregunta.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'Ninguno, ve todo sin restricción.',
                  explicacion: 'La conexión respeta permisos, no los ignora.',
                },
              ],
            },
          ],
        },
        {
          slug: 'permisos-y-alcance',
          tipo: 'lectura',
          titulo: 'Permisos y alcance antes de conectar',
          minutos: 16,
          resumen: 'Una sola conexión bien hecha, solo lectura para arrancar, y documentar qué se conectó.',
          objetivos: [
            'Definir el alcance de una conexión antes de pedirla a TI.',
            'Empezar por permisos de solo lectura.',
          ],
          bloques: [
            {
              tipo: 'lista',
              ordenada: true,
              items: [
                'Empieza por una sola conexión: la que resuelva la pregunta más repetida del área.',
                'Define permisos antes de conectar: solo lectura para arrancar y con el alcance de quien pregunta. Esto se acuerda con TI.',
                'Prueba con preguntas conocidas: cuya respuesta ya sabes, para comprobar que la conexión trae lo correcto.',
                'Documenta qué se conectó: fuente, permisos y responsable.',
              ],
            },
            {
              tipo: 'prompt',
              etiqueta: 'Antes de conectar',
              texto: 'Antes de conectar: qué datos vería esta conexión, con qué permisos y qué NO debería poder tocar.',
            },
            {
              tipo: 'nota',
              tono: 'ojo',
              titulo: 'Dar permisos de escritura desde el primer día',
              texto:
                'Lectura primero; escritura solo cuando el flujo ya esté probado y se sepa que trae lo correcto.',
            },
          ],
          chequeo: [
            {
              id: 'q1',
              enunciado: '¿Qué permiso conviene dar a una conexión MCP nueva?',
              opciones: [
                {
                  texto: 'Lectura y escritura desde el primer día.',
                  explicacion: 'Conviene probar primero con solo lectura.',
                },
                {
                  texto: 'Solo lectura para arrancar.',
                  correcta: true,
                  explicacion: 'Correcto: escritura viene después, cuando el flujo esté probado.',
                },
                {
                  texto: 'Ninguno, hasta que la use toda la empresa.',
                  explicacion: 'Sin ningún permiso la conexión no se puede probar.',
                },
              ],
            },
          ],
        },
        {
          slug: 'practica-alcance-conexion',
          tipo: 'practica',
          titulo: 'Práctica: el alcance de la conexión al CRM',
          minutos: 20,
          resumen: 'El reporte semanal se arma exportando tres sistemas a un Excel.',
          bloques: [
            {
              tipo: 'texto',
              texto: 'Escribe la propuesta de alcance para la primera conexión de este caso. Te revisamos contra una rúbrica de cinco puntos.',
            },
          ],
          caso: {
            rol: 'Jefe de ventas',
            tarea: 'Proponer la primera conexión MCP del área',
            situacion:
              'Cada semana, alguien exporta el CRM, pega en un Excel y arma el reporte de oportunidades. Toma medio día de una persona y si hay un error se descubre en el comité.',
          },
          consigna: 'Define el alcance de la conexión que propones: qué datos, qué permisos y qué queda fuera.',
          placeholder: 'Datos: ...\nPermisos: ...\nFuera de alcance: ...',
          rubrica: [
            { id: 'pregunta', titulo: 'La pregunta que resuelve', pregunta: '¿Identifica la pregunta más repetida del área (estado del pipeline)?' },
            { id: 'datos', titulo: 'Datos', pregunta: '¿Especifica qué datos del CRM vería la conexión (oportunidades, cuentas)?' },
            { id: 'permisos', titulo: 'Permisos', pregunta: '¿Propone solo lectura para arrancar?' },
            { id: 'fuera', titulo: 'Fuera de alcance', pregunta: '¿Dice explícitamente qué NO debería poder tocar la conexión?' },
            { id: 'prueba', titulo: 'Prueba', pregunta: '¿Propone probar con una pregunta cuya respuesta ya se conoce?' },
          ],
          pistas: [
            'La pregunta más repetida del área es el mejor punto de partida, no "conectar todo".',
            'Documentar qué NO puede tocar la conexión es tan importante como decir qué sí.',
          ],
          solucion:
            'Datos: oportunidades y cuentas del CRM, para responder el estado del pipeline sin exportar a mano. Permisos: solo lectura, con el alcance de quien pregunta (cada vendedor ve solo sus cuentas, el jefe ve el área completa). Fuera de alcance: no debería poder modificar ni cerrar oportunidades, ni ver datos de otras áreas. Prueba: antes de usarla para el reporte del comité, la voy a probar con una pregunta cuya respuesta ya conozco, como el número de oportunidades abiertas este mes.',
        },
      ],
    },
    {
      slug: 'code',
      nivel: 'avanzado',
      modulo: 'code',
      titulo: 'Claude Code',
      descripcion: 'Automatizar tareas de archivos y datos desde la terminal: renombrar, consolidar, limpiar y generar reportes.',
      lecciones: [
        {
          slug: 'automatizar-sin-programar',
          tipo: 'lectura',
          titulo: 'Automatizar sin saber programar',
          minutos: 14,
          resumen: 'Aunque se llame Code, la mayoría de los usos en la empresa no son de desarrollo.',
          objetivos: [
            'Reconocer tareas de archivos y datos que se pueden automatizar sin programar.',
            'Describir una tarea en palabras, no en código.',
          ],
          bloques: [
            {
              tipo: 'texto',
              texto:
                'Aunque se llame Code, la mayoría de los usos en una empresa no son de desarrollo: son tareas repetitivas sobre archivos y datos que hoy alguien hace a mano, como consolidar decenas de archivos o limpiar una base de datos.',
            },
            {
              tipo: 'prompt',
              etiqueta: 'Consolidar',
              texto: 'Une todos los Excel de esta carpeta en un solo archivo, agrega una columna con el nombre del archivo de origen.',
            },
            {
              tipo: 'nota',
              tono: 'clave',
              titulo: 'Describe la tarea en palabras',
              texto:
                '"Une, agrega columna de origen, avísame de los distintos". No necesitas saber el lenguaje: describe qué quieres, no cómo hacerlo.',
            },
          ],
          chequeo: [
            {
              id: 'q1',
              enunciado: '¿Qué tipo de tareas resuelve Claude Code en la mayoría de los casos de empresa?',
              opciones: [
                {
                  texto: 'Solo desarrollo de software.',
                  explicacion: 'La mayoría de los usos en la empresa son de archivos y datos, no desarrollo.',
                },
                {
                  texto: 'Tareas repetitivas sobre archivos y datos.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'Ninguna, hace falta saber programar para usarlo.',
                  explicacion: 'No hace falta saber programar: se describe la tarea en palabras.',
                },
              ],
            },
          ],
        },
        {
          slug: 'trabajar-sobre-una-copia',
          tipo: 'lectura',
          titulo: 'Trabajar sobre una copia',
          minutos: 14,
          resumen: 'La primera regla de automatizar archivos es no tocar el original.',
          objetivos: [
            'Trabajar siempre sobre una copia de los archivos originales.',
            'Verificar el resultado contra un caso conocido antes de darlo por bueno.',
          ],
          bloques: [
            {
              tipo: 'lista',
              ordenada: true,
              items: [
                'Trabaja sobre una copia: siempre. La primera regla de automatizar archivos es no tocar el original.',
                'Describe la tarea en palabras: qué hacer, qué avisar, qué marcar como raro.',
                'Revisa el resultado contra un caso conocido: verifica una parte a mano; si cuadra, cuadran las demás.',
                'Guarda el proceso: lo repetible es lo que ahorra tiempo de verdad, no la primera corrida.',
              ],
            },
            {
              tipo: 'nota',
              tono: 'ojo',
              titulo: 'Correr el proceso sobre los archivos originales',
              texto:
                'Copia la carpeta primero y trabaja sobre la copia. Un error en un proceso automatizado es más difícil de deshacer que uno manual.',
            },
          ],
          chequeo: [
            {
              id: 'q1',
              enunciado: '¿Cuál es la primera regla al automatizar una tarea de archivos con Claude Code?',
              opciones: [
                {
                  texto: 'Trabajar siempre sobre una copia, no sobre el original.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'Hacerlo directamente sobre los archivos originales para ahorrar un paso.',
                  explicacion: 'Un error sobre el original es más difícil de deshacer.',
                },
                {
                  texto: 'Pedir siempre el resultado en PDF.',
                  explicacion: 'El formato de salida no es la regla de seguridad principal.',
                },
              ],
            },
          ],
        },
        {
          slug: 'practica-consolidar-excels',
          tipo: 'practica',
          titulo: 'Práctica: consolidar los Excel de sucursales',
          minutos: 20,
          resumen: '40 archivos de ventas por sucursal que hay que unir cada mes.',
          bloques: [
            {
              tipo: 'texto',
              texto: 'Escribe el prompt para pedirle a Claude Code que resuelva este caso. Te revisamos contra una rúbrica de cinco puntos.',
            },
          ],
          caso: {
            rol: 'Analista de contabilidad',
            tarea: 'Consolidar los archivos de ventas del mes',
            situacion:
              '40 sucursales mandan cada una su Excel de ventas del mes, con las mismas columnas pero a veces alguna sucursal cambia el orden o le falta una columna.',
          },
          consigna: 'Escribe el prompt para Claude Code.',
          placeholder: 'Une los archivos de...',
          rubrica: [
            { id: 'copia', titulo: 'Copia', pregunta: '¿Pide trabajar sobre una copia de la carpeta original?' },
            { id: 'origen', titulo: 'Columna de origen', pregunta: '¿Pide agregar una columna con el nombre del archivo de origen?' },
            { id: 'alerta', titulo: 'Alerta de distintos', pregunta: '¿Pide que avise cuáles archivos tienen columnas distintas?' },
            { id: 'verificacion', titulo: 'Verificación', pregunta: '¿Menciona revisar una sucursal a mano antes de dar el consolidado por bueno?' },
            { id: 'repetible', titulo: 'Repetible', pregunta: '¿Pide dejar el proceso guardado para el mes siguiente?' },
          ],
          pistas: [
            'El riesgo real no es unir los archivos, es no darse cuenta de cuál venía distinto.',
            'Guardar el proceso es lo que hace que el mes que viene tome minutos, no una mañana.',
          ],
          solucion:
            'Trabajando sobre una copia de la carpeta, une todos los Excel de ventas de las 40 sucursales en un solo archivo, agregando una columna con el nombre del archivo de origen. Si alguna sucursal tiene columnas distintas a las demás, sepáralas y avísame cuáles son en vez de forzarlas al mismo formato. Voy a revisar una sucursal a mano contra el archivo original antes de dar el consolidado por bueno. Deja el proceso guardado para poder repetirlo el mes que viene.',
        },
      ],
    },
    {
      slug: 'cierre-avanzado',
      nivel: 'avanzado',
      titulo: 'Cierre del nivel 3',
      descripcion: 'El examen del nivel avanzado, sobre Skills, MCP y Claude Code.',
      lecciones: [
        {
          slug: 'examen-avanzado',
          tipo: 'examen',
          titulo: 'Examen del nivel 3',
          minutos: 12,
          resumen: 'Preguntas sobre skills, conexiones y Claude Code. Se aprueba con 80%.',
          aprobacion: 80,
          preguntas: [
            {
              id: 'e1',
              modulo: 'skills',
              enunciado: '¿Qué problema resuelve una skill frente a un prompt personal?',
              opciones: [
                {
                  texto: 'Que el resultado no dependa de quién escribió el prompt.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'Que las respuestas salgan siempre más largas.',
                  explicacion: 'No es una cuestión de extensión.',
                },
                {
                  texto: 'Que solo la use la persona que la escribió.',
                  explicacion: 'Es al revés: la puede usar todo el equipo.',
                },
              ],
            },
            {
              id: 'e2',
              modulo: 'skills',
              enunciado: '¿Por qué probar una skill con un caso difícil antes de repartirla?',
              opciones: [
                {
                  texto: 'Porque los casos difíciles muestran dónde falla.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'No hace falta, basta con un caso simple.',
                  explicacion: 'Un caso simple no muestra los límites reales de la skill.',
                },
                {
                  texto: 'Para que se vea más larga.',
                  explicacion: 'El objetivo es encontrar fallas, no aparentar tamaño.',
                },
              ],
            },
            {
              id: 'e3',
              modulo: 'mcp',
              enunciado: '¿Qué permisos usa Claude al consultar un sistema conectado por MCP?',
              opciones: [
                {
                  texto: 'Los de quien hace la pregunta.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'Los de un administrador, siempre.',
                  explicacion: 'No hay un permiso especial: usa el de quien pregunta.',
                },
                {
                  texto: 'Ninguno, ve todo sin restricción.',
                  explicacion: 'La conexión respeta permisos, no los ignora.',
                },
              ],
            },
            {
              id: 'e4',
              modulo: 'mcp',
              enunciado: '¿Qué permiso conviene dar a una conexión MCP nueva?',
              opciones: [
                {
                  texto: 'Lectura y escritura desde el primer día.',
                  explicacion: 'Conviene probar primero con solo lectura.',
                },
                {
                  texto: 'Solo lectura para arrancar.',
                  correcta: true,
                  explicacion: 'Correcto: escritura viene después de probar el flujo.',
                },
                {
                  texto: 'Ninguno hasta que lo use toda la empresa.',
                  explicacion: 'Sin ningún permiso no se puede probar.',
                },
              ],
            },
            {
              id: 'e5',
              modulo: 'code',
              enunciado: '¿Cuál es la primera regla al automatizar una tarea de archivos?',
              opciones: [
                {
                  texto: 'Trabajar sobre una copia, no sobre el original.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'Hacerlo directamente sobre el original.',
                  explicacion: 'Un error sobre el original es más difícil de deshacer.',
                },
                {
                  texto: 'Pedir siempre el resultado en PDF.',
                  explicacion: 'El formato no es la regla de seguridad principal.',
                },
              ],
            },
            {
              id: 'e6',
              modulo: 'code',
              enunciado: '¿Qué hace que automatizar una tarea ahorre tiempo de verdad, mes tras mes?',
              opciones: [
                {
                  texto: 'Dejar el proceso guardado para repetirlo.',
                  correcta: true,
                  explicacion: 'Correcto: la primera corrida no es lo que ahorra tiempo, sí lo repetible.',
                },
                {
                  texto: 'Hacerlo rápido la primera vez.',
                  explicacion: 'La velocidad de la primera corrida no es lo que ahorra tiempo después.',
                },
                {
                  texto: 'Nada especial, cada mes se vuelve a describir la tarea.',
                  explicacion: 'Repetir la descripción cada mes pierde la ventaja de guardarlo.',
                },
              ],
            },
          ],
        },
      ],
    },

    /* ------------------------------------------------------------ nivel 4 */
    {
      slug: 'sistema-del-equipo',
      nivel: 'experto',
      titulo: 'El sistema de IA del equipo',
      descripcion: 'Medir el impacto, gobernar el uso, y el proyecto final: diseñar el sistema completo de un proceso real.',
      lecciones: [
        {
          slug: 'medir-antes-de-escalar',
          tipo: 'lectura',
          titulo: 'Medir la adopción, no el uso',
          minutos: 16,
          resumen: 'Cuántos prompts se enviaron no dice si algo mejoró.',
          objetivos: [
            'Distinguir una métrica de resultado de una métrica de uso.',
            'Establecer una línea base antes de medir el impacto.',
          ],
          bloques: [
            {
              tipo: 'texto',
              texto:
                'Cuántos prompts se enviaron o cuántas personas activaron Claude son métricas de uso: dicen que algo se prendió, no que algo mejoró. Una métrica de resultado mide lo que cambió de verdad: el tiempo que toma un proceso, la tasa de error, cuántas veces se repite una tarea.',
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
                'El administrador de la cuenta empresarial ve cuántas personas usan cada módulo y cuánto se consulta. Es un punto de partida útil, pero no reemplaza cruzar ese consumo con lo que de verdad cambió en el proceso.',
            },
          ],
          chequeo: [
            {
              id: 'q1',
              enunciado: '¿Cuál de estas es una métrica de resultado, no de uso?',
              opciones: [
                {
                  texto: 'Número de conversaciones abiertas en el mes.',
                  explicacion: 'Dice que la herramienta se usó, no que algo mejoró.',
                },
                {
                  texto: 'Tiempo promedio de un proceso, antes y después.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'Cuántas personas activaron su cuenta.',
                  explicacion: 'Activar la cuenta no dice nada sobre el resultado del trabajo.',
                },
              ],
            },
          ],
        },
        {
          slug: 'gobierno-y-si-algo-falla',
          tipo: 'lectura',
          titulo: 'Gobierno: dueño, revisión y apagado',
          minutos: 16,
          resumen: 'Antes de conectar, publicar o automatizar algo, define quién responde si falla.',
          objetivos: [
            'Nombrar un dueño y una forma de apagar cada skill o conexión.',
            'Documentar qué información hereda una skill o conexión de la política de la empresa.',
          ],
          bloques: [
            {
              tipo: 'texto',
              texto:
                'Una skill, una conexión MCP o un proceso automatizado con Claude Code heredan la política de datos de la empresa: qué información pueden procesar y qué no sale del entorno corporativo. Eso no lo define cada persona por su cuenta.',
            },
            {
              tipo: 'nota',
              tono: 'ojo',
              titulo: 'Si algo falla un fin de semana',
              texto:
                'Lo primero que debe existir es un dueño con nombre y un apagado conocido: quién responde y cómo se detiene, no esperar a que alguien se dé cuenta el lunes.',
            },
            {
              tipo: 'lista',
              items: [
                'Un dueño con nombre por cada skill o conexión publicada.',
                'Una revisión periódica de qué tan bien sigue funcionando.',
                'Un apagado conocido: cómo se detiene si algo empieza a fallar.',
              ],
            },
          ],
          chequeo: [
            {
              id: 'q1',
              enunciado: 'Si una skill o una conexión falla un fin de semana, ¿qué debe existir primero?',
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
          ],
        },
        {
          slug: 'examen-experto',
          tipo: 'examen',
          titulo: 'Examen del nivel 4',
          minutos: 10,
          resumen: 'Preguntas sobre métricas y gobierno del sistema de IA del equipo. Se aprueba con 80%.',
          aprobacion: 80,
          preguntas: [
            {
              id: 'e1',
              enunciado: '¿Qué demuestra mejor que un proceso con Claude está funcionando de verdad?',
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
              id: 'e2',
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
                  texto: 'Solo afecta el diseño del reporte.',
                  explicacion: 'Sí afecta la conclusión: sin línea base no hay mejora demostrable.',
                },
              ],
            },
            {
              id: 'e3',
              modulo: 'mcp',
              enunciado: '¿Qué hereda una skill o conexión publicada de la política de uso de IA de la empresa?',
              opciones: [
                {
                  texto: 'Nada, cada una define sus propias reglas de datos.',
                  explicacion: 'Hereda las reglas de la política de la empresa.',
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
            {
              id: 'e4',
              enunciado: 'Si una skill o conexión falla un fin de semana, ¿qué debe existir primero?',
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
            {
              id: 'e5',
              modulo: 'skills',
              enunciado: '¿Qué hace que el resultado de una skill sea igual, lo pida quien lo pida?',
              opciones: [
                {
                  texto: 'Que solo la use una persona.',
                  explicacion: 'Es al revés: la comparten todos y por eso el resultado es igual.',
                },
                {
                  texto: 'Una salida exacta y reglas duras escritas una sola vez.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'Que cada persona la ajuste a su gusto.',
                  explicacion: 'Ajustarla a gusto rompe justo lo que la hace consistente.',
                },
              ],
            },
            {
              id: 'e6',
              modulo: 'mcp',
              enunciado: '¿Cuál es el criterio para elegir la primera conexión MCP de un área?',
              opciones: [
                {
                  texto: 'Conectar todos los sistemas a la vez.',
                  explicacion: 'Una conexión bien hecha vale más que varias a medias.',
                },
                {
                  texto: 'La que resuelva la pregunta más repetida del área.',
                  correcta: true,
                  explicacion: 'Correcto.',
                },
                {
                  texto: 'La que pida menos permisos de TI, sin importar el caso de uso.',
                  explicacion: 'El criterio es el valor del caso de uso, no solo la facilidad del trámite.',
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
          resumen: 'Diseña el sistema completo de Claude para un proceso real: herramienta, encargo, verificación, métrica y gobierno.',
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
                'La herramienta de Claude para cada paso (chat, un artifact, un proyecto, research, skills, MCP o Claude Code) y por qué esa y no otra.',
                'El prompt o el encargo clave, el que más se repite o el que más tiempo ahorra.',
                'Cómo se verifica el resultado antes de usarlo.',
                'La métrica, con su línea base y la meta.',
                'El gobierno: dueño, revisión, y cómo se apaga si algo falla.',
              ],
            },
            {
              tipo: 'nota',
              tono: 'dato',
              titulo: 'Sobre la revisión',
              texto:
                'La skill o la conexión son opcionales: si tu proceso no las necesita, dilo y explica por qué. El revisor mira las seis partes y que sean coherentes entre sí, no que uses los nombres exactos de cada función.',
            },
          ],
          caso: {
            rol: 'Tú, en tu área',
            tarea: 'Diseñar el sistema de Claude de un proceso del equipo',
            situacion:
              'Si no tienes un proceso propio, usa este: el área de servicio al cliente arma el reporte semanal de reclamos cruzando el sistema de tickets con los correos de seguimiento, y hoy toma medio día de una persona.',
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
              pregunta: '¿Asigna una herramienta de Claude a cada paso y justifica por qué esa y no otra?',
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
              pregunta: '¿Nombra un dueño, una revisión periódica y cómo se apaga si algo falla?',
            },
          ],
          pistas: [
            'Empieza por la métrica: si no sabes qué quieres mover, el resto no tiene norte.',
            'No todos los pasos necesitan la misma herramienta: mezclar el chat, un proyecto y quizás una conexión suele ser más realista que una sola skill que hace todo.',
          ],
          solucion:
            '1. PROCESO: el reporte semanal de reclamos toma medio día de una persona; la mayor parte del tiempo se va en cruzar el sistema de tickets con los correos de seguimiento dispersos en varios hilos.\n\n2. HERRAMIENTA POR PASO: (a) una conexión MCP de solo lectura al sistema de tickets, para consultar el estado sin exportar a mano. (b) Claude en el navegador sobre la bandeja de correo, para resumir los hilos de seguimiento de la semana. (c) un proyecto de servicio al cliente con las instrucciones de tono y los criterios de qué reclamo es crítico, para armar el borrador del reporte. Una skill de "reporte semanal de reclamos" formaliza el procedimiento una vez que el flujo esté probado.\n\n3. ENCARGO CLAVE: "Del sistema de tickets, dame los reclamos abiertos hace más de 5 días. Cruza cada uno con el hilo de correo de seguimiento y dime en qué quedó la última respuesta al cliente."\n\n4. VERIFICACIÓN: el analista revisa a mano los reclamos marcados como críticos (normalmente menos de 10) antes de dar el reporte por cerrado; el borrador se revisa completo antes de enviarlo, porque lleva compromisos con clientes.\n\n5. MÉTRICA: horas que toma armar el reporte semanal (línea base medio día, meta una hora) y reclamos que se resuelven fuera del plazo acordado (línea base sin medir, meta reducirlo a la mitad en dos trimestres).\n\n6. GOBIERNO: dueña la jefa de servicio al cliente. Revisión mensual de si la conexión sigue trayendo los datos correctos. Apagado: si la conexión al sistema de tickets falla o trae datos inconsistentes dos semanas seguidas, se vuelve al reporte manual mientras se revisa con TI.',
        },
      ],
    },
  ],

  /* ========================================================= diagnóstico */
  diagnostico: [
    {
      id: 'd1',
      nivel: 'cero',
      enunciado: '¿Qué pasa con tus conversaciones en Claude, con la licencia empresarial de la empresa?',
      opciones: [
        { texto: 'Se usan para entrenar modelos públicos.', explicacion: 'Con la licencia empresarial no se usan para entrenar modelos.' },
        { texto: 'No se usan para entrenar modelos.', correcta: true, explicacion: 'Correcto.' },
        { texto: 'Depende de si la conversación es larga.', explicacion: 'No depende de la extensión, sino de la licencia contratada.' },
        { texto: 'No lo sé.', explicacion: 'Sin problema: el nivel 0 empieza justo aquí.' },
      ],
    },
    {
      id: 'd2',
      nivel: 'cero',
      enunciado: '¿Qué de esto falta en "hazme un correo del retraso"?',
      opciones: [
        { texto: 'Nada, es suficiente.', explicacion: 'Falta destinatario, contexto, formato y límites.' },
        { texto: 'Destinatario, contexto, formato y qué no inventar.', correcta: true, explicacion: 'Correcto.' },
        { texto: 'Solo el nombre del cliente.', explicacion: 'Falta más que eso: tono, extensión y límites también importan.' },
        { texto: 'No lo sé.', explicacion: 'Lo vemos en el nivel 0.' },
      ],
    },
    {
      id: 'd3',
      nivel: 'basico',
      modulo: 'artifacts',
      enunciado: 'Un artifact necesita tres ajustes: campos, cálculo y diseño. ¿Cómo conviene pedirlos?',
      opciones: [
        { texto: 'Los tres en un solo mensaje.', explicacion: 'Dificulta saber qué cambio dañó qué parte.' },
        { texto: 'Un cambio a la vez.', correcta: true, explicacion: 'Correcto.' },
        { texto: 'Un artifact nuevo por cada ajuste.', explicacion: 'Es más lento que corregir el que ya existe.' },
        { texto: 'No lo sé.', explicacion: 'Lo vemos en el nivel 1.' },
      ],
    },
    {
      id: 'd4',
      nivel: 'basico',
      modulo: 'projects',
      enunciado: '¿Cuándo conviene crear un proyecto en vez de usar una conversación suelta?',
      opciones: [
        { texto: 'Cuando el tema se repite en el tiempo y varias personas lo consultan.', correcta: true, explicacion: 'Correcto.' },
        { texto: 'En cada conversación nueva.', explicacion: 'No toda conversación necesita su propio proyecto.' },
        { texto: 'Solo si el cliente lo pide.', explicacion: 'El criterio es si el tema se repite, no si lo piden.' },
        { texto: 'No lo sé.', explicacion: 'Lo vemos en el nivel 1.' },
      ],
    },
    {
      id: 'd5',
      nivel: 'intermedio',
      modulo: 'research',
      enunciado: '¿Qué debe traer cada cifra de un buen resultado de research?',
      opciones: [
        { texto: 'Su fuente o enlace.', correcta: true, explicacion: 'Correcto.' },
        { texto: 'Un emoji que la resalte.', explicacion: 'El formato visual no reemplaza la fuente.' },
        { texto: 'Nada adicional.', explicacion: 'Sin fuente, el número no se puede verificar.' },
        { texto: 'No lo sé.', explicacion: 'Lo vemos en el nivel 2.' },
      ],
    },
    {
      id: 'd6',
      nivel: 'intermedio',
      modulo: 'chrome',
      enunciado: '¿Qué se verifica siempre directamente en la página, no solo en el resumen de Claude?',
      opciones: [
        { texto: 'El diseño del sitio.', explicacion: 'No es un dato crítico para la decisión.' },
        { texto: 'Fechas de cierre y montos.', correcta: true, explicacion: 'Correcto.' },
        { texto: 'Nada, el resumen siempre es exacto.', explicacion: 'Los datos críticos se verifican en la fuente.' },
        { texto: 'No lo sé.', explicacion: 'Lo vemos en el nivel 2.' },
      ],
    },
    {
      id: 'd7',
      nivel: 'avanzado',
      modulo: 'skills',
      enunciado: '¿Qué problema resuelve una skill frente a un prompt personal?',
      opciones: [
        { texto: 'Que el resultado no dependa de quién escribió el prompt.', correcta: true, explicacion: 'Correcto.' },
        { texto: 'Que las respuestas salgan más largas.', explicacion: 'No es una cuestión de extensión.' },
        { texto: 'Que solo la use quien la escribió.', explicacion: 'Es al revés: la usa todo el equipo.' },
        { texto: 'No lo sé.', explicacion: 'Lo vemos en el nivel 3.' },
      ],
    },
    {
      id: 'd8',
      nivel: 'avanzado',
      modulo: 'mcp',
      enunciado: '¿Qué permiso conviene dar a una conexión MCP nueva?',
      opciones: [
        { texto: 'Lectura y escritura desde el primer día.', explicacion: 'Conviene probar primero con solo lectura.' },
        { texto: 'Solo lectura para arrancar.', correcta: true, explicacion: 'Correcto.' },
        { texto: 'Ninguno hasta que la use toda la empresa.', explicacion: 'Sin ningún permiso no se puede probar.' },
        { texto: 'No lo sé.', explicacion: 'Lo vemos en el nivel 3.' },
      ],
    },
    {
      id: 'd9',
      nivel: 'experto',
      enunciado: '¿Qué demuestra mejor que un proceso con Claude está funcionando de verdad?',
      opciones: [
        { texto: 'El número de veces que se usó.', explicacion: 'Uso no es lo mismo que impacto.' },
        { texto: 'Una métrica de resultado contra su línea base.', correcta: true, explicacion: 'Correcto.' },
        { texto: 'Que nadie se ha quejado.', explicacion: 'La ausencia de quejas no es un dato de impacto.' },
        { texto: 'No lo sé.', explicacion: 'Lo vemos en el nivel 4.' },
      ],
    },
    {
      id: 'd10',
      nivel: 'experto',
      enunciado: 'Si una skill o conexión falla un fin de semana, ¿qué debe existir primero?',
      opciones: [
        { texto: 'Un dueño con nombre y un apagado conocido.', correcta: true, explicacion: 'Correcto.' },
        { texto: 'Un modelo de respaldo más caro.', explicacion: 'No evita que el error siga corriendo mientras nadie sabe cómo apagarlo.' },
        { texto: 'Esperar a que alguien se dé cuenta el lunes.', explicacion: 'El error puede correr todo el fin de semana.' },
        { texto: 'No lo sé.', explicacion: 'Lo vemos en el nivel 4.' },
      ],
    },
  ],
};
