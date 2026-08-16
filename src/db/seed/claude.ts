import type { PlatformSeed } from './types';

export const claude: PlatformSeed = {
  "id": "claude",
  "name": "Claude",
  "portalName": "Portal Claude",
  "initial": "C",
  "color": "#C15F3C",
  "description": "Artifacts, proyectos por cliente, research con fuentes, skills y conexiones a los sistemas.",
  "tagline": "Capacitación interna",
  "inputHint": "Escríbele a Claude…",
  "badge": "Programa interno · 9 módulos · en el orden que quieras",
  "heroTitle": "Aprende a usar Claude en el trabajo del día a día",
  "heroText": "Artifacts, proyectos por cliente, investigación con fuentes y automatización. Con los casos de siempre: propuestas, contratos, reportes y respuestas al cliente.",
  "specialTitle": "Lo que solo se hace acá",
  "specialIntro": "Tres cosas que diferencian a Claude de los otros portales de la academia, y que conviene practicar en la sesión.",
  "helpTitle": "¿Dudas durante la práctica?",
  "helpText": "Escribe al canal #academia-ia. Contestamos en horario de oficina.",
  "status": "completo",
  "stats": [
    {
      "value": "9",
      "label": "módulos, uno por capacidad"
    },
    {
      "value": "41",
      "label": "prompts listos para copiar"
    },
    {
      "value": "27",
      "label": "casos de uso por área"
    },
    {
      "value": "3",
      "label": "niveles: básico, intermedio y avanzado"
    }
  ],
  "specials": [
    {
      "kicker": "Contexto largo",
      "title": "Documentos completos, no fragmentos",
      "description": "Un contrato de 80 páginas entra entero en la conversación. Puedes preguntar por un numeral específico y pedir la cita textual.",
      "example": "\"Del contrato adjunto: ¿qué numeral habla de renovación automática? Cítalo.\""
    },
    {
      "kicker": "Skills",
      "title": "El procedimiento se ejecuta igual siempre",
      "description": "Lo que en otras herramientas queda en un prompt personal, acá se escribe una vez como skill y lo usa todo el equipo.",
      "example": "\"Aplica la skill cotizacion-estandar a este caso.\""
    },
    {
      "kicker": "MCP",
      "title": "Se conecta a los sistemas de la empresa",
      "description": "CRM, repositorio de archivos o mesa de ayuda, con los permisos de quien pregunta y trazabilidad de la consulta.",
      "example": "\"Del CRM: cuentas que renuevan este trimestre con tickets abiertos.\""
    }
  ],
  "downloads": [
    {
      "title": "Guía de prompts",
      "description": "Los 41 prompts del programa, agrupados por módulo.",
      "meta": "PDF · 10 páginas",
      "href": "/api/materiales/claude/guia-de-prompts.pdf"
    },
    {
      "title": "Plantilla de proyecto",
      "description": "Instrucciones base y lista de archivos por cliente.",
      "meta": "DOCX · 3 páginas",
      "href": "/api/materiales/claude/plantilla-de-proyecto.docx"
    },
    {
      "title": "Formato de skill",
      "description": "Estructura para escribir un procedimiento de la empresa.",
      "meta": "DOCX · 3 páginas",
      "href": "/api/materiales/claude/formato-de-skill.docx"
    }
  ],
  "practices": [
    {
      "number": "01",
      "title": "Di para quién es antes de pedir",
      "description": "Para quién, para qué y de qué extensión. Ahí está casi toda la diferencia."
    },
    {
      "number": "02",
      "title": "Corrige, no arranques otra vez",
      "description": "Ajustar lo que ya salió es más rápido y más preciso que escribir otro prompt desde cero."
    },
    {
      "number": "03",
      "title": "Pide la cita, no el resumen",
      "description": "Cuando el dato importa, exige el numeral o el enlace de dónde salió."
    },
    {
      "number": "04",
      "title": "Guarda lo que te funcionó",
      "description": "El prompt bueno se guarda en la biblioteca del área, no en tus notas."
    }
  ],
  "faqs": [
    {
      "question": "¿Claude ve los archivos de la empresa?",
      "answer": "Solo lo que subas a la conversación o al proyecto, y lo que expongan las conexiones autorizadas por TI, con los permisos de quien pregunta."
    },
    {
      "question": "¿Lo que escribimos entrena el modelo?",
      "answer": "Con la licencia empresarial, las conversaciones no se usan para entrenar modelos. El detalle está en la política de datos que firmó la empresa."
    },
    {
      "question": "¿Puedo confiar en las cifras que genera?",
      "answer": "No sin revisarlas. Precios, fechas y cantidades se confirman contra la fuente. Lo que sale con tu nombre lo respondes tú."
    },
    {
      "question": "¿En qué se diferencia de los otros portales?",
      "answer": "En contexto largo, en las skills y en las conexiones MCP. Para redactar rápido cualquiera sirve; para trabajar sobre documentos largos y procedimientos, este."
    }
  ],
  "links": [
    {
      "label": "Documentación de Claude",
      "href": "https://docs.anthropic.com"
    },
    {
      "label": "Guía de Projects",
      "href": "https://support.anthropic.com"
    },
    {
      "label": "Agent Skills",
      "href": "https://docs.anthropic.com"
    },
    {
      "label": "Protocolo MCP",
      "href": "https://modelcontextprotocol.io"
    }
  ],
  "modules": [
    {
      "slug": "artifacts",
      "name": "Artifacts",
      "shortName": "Artifacts",
      "abbr": "AR",
      "color": "#C15F3C",
      "level": "Básico",
      "summary": "Pedirle a Claude una calculadora, un formato o una landing y verla funcionando al lado del chat, lista para ajustar.",
      "intro": "Un artifact es el resultado en grande, al lado de la conversación: un documento, una tabla, una mini aplicación. Se corrige hablando, sin volver a empezar.",
      "meta": "5 prompts · 30 min",
      "outcomes": [
        "Convertir una idea suelta en algo que se puede abrir, usar y mostrar en la misma sesión.",
        "Iterar sobre lo que ya salió: \"más corto\", \"agrega el IVA\", \"cámbiale los colores\".",
        "Compartir el resultado con el equipo sin pasar por diseño ni por desarrollo."
      ],
      "prompts": [
        {
          "tag": "Calculadora",
          "text": "Hazme una calculadora de [cotización de servicio] con campos [horas, tarifa, descuento] y que muestre el total con IVA."
        },
        {
          "tag": "Formato",
          "text": "Arma un formato de [acta de reunión] en tabla, con responsable y fecha por compromiso, listo para copiar a Word."
        },
        {
          "tag": "Ajuste",
          "text": "Sobre el artifact anterior: quítale [la columna de notas], agrega [el total por área] y déjalo en una sola página."
        },
        {
          "tag": "Visual",
          "text": "Con estos datos, hazme un gráfico de barras comparando [ventas por sucursal] con los valores visibles."
        },
        {
          "tag": "Landing",
          "text": "Una página de una sola pantalla para [el lanzamiento de nuestro servicio], con propuesta de valor, tres beneficios y un botón de contacto."
        }
      ],
      "baIntro": "El caso de la sesión: el comercial necesita una calculadora de cotizaciones para la visita de mañana.",
      "before": "Se pide a sistemas un archivo de Excel con fórmulas. Entra a la cola de trabajo y sale cuando salga.",
      "beforeTime": "Días de espera y un archivo que nadie más entiende",
      "after": "Se describe la lógica en el chat, sale la calculadora funcionando y se ajusta en vivo con el comercial al lado.",
      "afterTime": "Una sesión de trabajo, con la persona que la va a usar",
      "steps": [
        {
          "title": "Describe el resultado, no el código",
          "description": "\"Una calculadora con estos campos y este total\". Claude decide cómo hacerla; tú decides cómo se ve y qué muestra."
        },
        {
          "title": "Pega los datos reales",
          "description": "Tarifas, categorías, nombres de producto. Con datos reales el artifact sirve desde la primera versión."
        },
        {
          "title": "Corrige por partes",
          "description": "Un cambio a la vez: primero los campos, luego los cálculos, al final el diseño. Así ves qué se dañó y qué no."
        },
        {
          "title": "Guárdalo y compártelo",
          "description": "El artifact queda en la conversación. Si es de uso frecuente, muévelo a un proyecto para que el equipo lo encuentre."
        }
      ],
      "roles": [
        {
          "role": "Comercial",
          "task": "Cotizaciones en la visita",
          "detail": "Calcula precios y escenarios delante del cliente, sin depender del archivo maestro."
        },
        {
          "role": "Operaciones",
          "task": "Formatos de control",
          "detail": "Convierte una planilla en papel en un formato digital que ya valida los datos."
        },
        {
          "role": "Mercadeo",
          "task": "Piezas de una pantalla",
          "detail": "Arma la landing del lanzamiento y la muestra antes de pedirle tiempo a diseño."
        }
      ],
      "mistakes": [
        {
          "bad": "Pedir \"una app\" sin decir qué debe calcular ni qué campos lleva.",
          "good": "Dictar campos, reglas y ejemplo de resultado esperado."
        },
        {
          "bad": "Pedir diez cambios en un solo mensaje.",
          "good": "Un cambio a la vez, revisando entre uno y otro."
        },
        {
          "bad": "Usar el artifact como sistema oficial de la empresa.",
          "good": "Tratarlo como prototipo: sirve para decidir, no para reemplazar el ERP."
        }
      ],
      "mockTitle": "Claude · Artifact",
      "mockPrompt": "Hazme una calculadora de cotización con horas, tarifa y descuento.",
      "mockReply": "Listo. Agregué el cálculo de IVA y un resumen por ítem. ¿Le pongo la moneda en pesos?",
      "mockPanelTitle": "Artifact",
      "mockPanel": "Cotización de servicio\n─────────────\nHoras       40\nTarifa      $120.000\nDescuento   10%\n─────────────\nTotal + IVA $5.140.800"
    },
    {
      "slug": "projects",
      "name": "Projects",
      "shortName": "Projects",
      "abbr": "PR",
      "color": "#8B6DB8",
      "level": "Básico",
      "summary": "Un espacio por cliente o por área con sus documentos y sus instrucciones, para no volver a explicar el contexto cada vez.",
      "intro": "Un proyecto guarda los archivos y las reglas de trabajo de un tema. Todo lo que preguntes dentro del proyecto ya sabe con quién estás trabajando y cómo escribe la empresa.",
      "meta": "5 prompts · 30 min",
      "outcomes": [
        "Dejar de pegar el mismo contexto en cada conversación.",
        "Tener un lugar por cliente con contratos, tarifas y acuerdos vigentes.",
        "Que otra persona del equipo retome el tema sin pedirte los antecedentes."
      ],
      "prompts": [
        {
          "tag": "Instrucciones",
          "text": "Instrucciones del proyecto: eres el asistente del área de [área]. Responde en español, con cifras verificadas contra los archivos y sin inventar fechas."
        },
        {
          "tag": "Contexto",
          "text": "Con los documentos del proyecto, resume en una página quién es este cliente, qué contrató y qué vence pronto."
        },
        {
          "tag": "Consulta",
          "text": "¿Qué dice el contrato de este cliente sobre [penalidades por retraso]? Cita el numeral."
        },
        {
          "tag": "Redacción",
          "text": "Escribe el correo de renovación usando el tono y las condiciones que están en los documentos del proyecto."
        },
        {
          "tag": "Revisión",
          "text": "Compara la propuesta nueva con la del año pasado y dime qué cambió en alcance y en precio."
        }
      ],
      "baIntro": "El caso de la sesión: la cuenta de un cliente grande la atienden tres personas distintas.",
      "before": "Cada quien guarda su versión del contrato y del historial. El que contesta primero decide qué es verdad.",
      "beforeTime": "Respuestas distintas para el mismo cliente",
      "after": "Un proyecto con contrato, tarifas y actas. Todos consultan lo mismo y responden igual.",
      "afterTime": "Una fuente sola, revisada una vez al mes",
      "steps": [
        {
          "title": "Un proyecto por cliente o por área",
          "description": "No hagas un proyecto por conversación. La unidad correcta es el tema que se repite en el tiempo."
        },
        {
          "title": "Sube pocos archivos y los buenos",
          "description": "Contrato vigente, tarifas, políticas. Un proyecto lleno de versiones viejas responde con información vieja."
        },
        {
          "title": "Escribe las instrucciones",
          "description": "Tono, idioma, qué nunca debe inventar y a quién le habla. Esto es lo que hace que el proyecto suene a la empresa."
        },
        {
          "title": "Mantenlo vivo",
          "description": "Cuando cambie una tarifa o una política, reemplaza el archivo. Es la única tarea de mantenimiento real."
        }
      ],
      "roles": [
        {
          "role": "Servicio al cliente",
          "task": "Cuentas clave",
          "detail": "Todo el histórico del cliente en un espacio: quién contestó qué y bajo qué condición."
        },
        {
          "role": "Talento humano",
          "task": "Políticas internas",
          "detail": "Reglamento, vacaciones y beneficios en un proyecto que responde con la versión vigente."
        },
        {
          "role": "Dirección",
          "task": "Junta y comités",
          "detail": "Actas y presupuestos juntos, para preguntar por lo que se decidió sin abrir diez archivos."
        }
      ],
      "mistakes": [
        {
          "bad": "Subir toda la carpeta compartida al proyecto.",
          "good": "Subir los documentos vigentes y borrar los reemplazados."
        },
        {
          "bad": "Dejar el proyecto sin instrucciones.",
          "good": "Escribir tres o cuatro reglas de tono y de verificación."
        }
      ],
      "mockTitle": "Claude · Proyecto Cliente Norte",
      "mockPrompt": "¿Qué dice el contrato sobre penalidades por retraso?",
      "mockReply": "El numeral 8.3 fija 0,5% del valor mensual por día, con tope del 5%. Te dejo el texto citado.",
      "mockPanelTitle": "Archivos del proyecto",
      "mockPanel": "Contrato_2026.pdf\nTarifas_vigentes.xlsx\nActa_comite_julio.docx\nInstrucciones del proyecto ✓"
    },
    {
      "slug": "design",
      "name": "Diseño y presentación",
      "shortName": "Design",
      "abbr": "DS",
      "color": "#2E7D8F",
      "level": "Intermedio",
      "summary": "Pasar de un texto plano a una pieza presentable: propuesta, one pager, tablero o presentación con jerarquía real.",
      "intro": "No se trata de \"ponerle bonito\". Se trata de que la información quede en el orden en que la persona la va a leer y con lo importante primero.",
      "meta": "5 prompts · 35 min",
      "outcomes": [
        "Convertir un documento denso en un one pager que sí se lee.",
        "Armar una presentación con una idea por lámina y el detalle en las notas.",
        "Aplicar los colores y el tono de la empresa sin pedir turno en diseño."
      ],
      "prompts": [
        {
          "tag": "One pager",
          "text": "Convierte este documento en un one pager: problema, propuesta, tres beneficios, precio y siguiente paso."
        },
        {
          "tag": "Presentación",
          "text": "Arma 8 láminas con este informe. Una idea por lámina, título afirmativo y el detalle en las notas del expositor."
        },
        {
          "tag": "Marca",
          "text": "Usa estos colores [#hex, #hex] y tipografía [nombre]. Nada de degradados ni de emojis."
        },
        {
          "tag": "Jerarquía",
          "text": "Reordena esta pieza para que lo primero que se lea sea [el ahorro para el cliente]."
        },
        {
          "tag": "Versión corta",
          "text": "Del mismo contenido, dame una versión de WhatsApp de máximo 5 líneas."
        }
      ],
      "baIntro": "El caso de la sesión: hay un informe de 14 páginas y la reunión con el cliente es de 20 minutos.",
      "before": "Se lleva el informe completo y se lee por encima. El cliente pregunta por el precio en el minuto tres.",
      "beforeTime": "La reunión se va en contexto y no en decisión",
      "after": "Un one pager con el problema, la propuesta y el precio, y el informe como anexo si lo piden.",
      "afterTime": "La reunión arranca por la decisión",
      "steps": [
        {
          "title": "Define para quién y en cuánto tiempo",
          "description": "\"Para el gerente financiero, en dos minutos\" cambia por completo qué queda dentro y qué se va al anexo."
        },
        {
          "title": "Pide la estructura antes del diseño",
          "description": "Primero el orden de las ideas; cuando esté bien, el formato."
        },
        {
          "title": "Dale la marca",
          "description": "Colores, tipografía y lo que no se usa. Sin eso sale un genérico."
        },
        {
          "title": "Revisa cifras y nombres",
          "description": "Precios, fechas y nombres propios se confirman contra la fuente antes de mandar."
        }
      ],
      "roles": [
        {
          "role": "Comercial",
          "task": "Propuestas al cliente",
          "detail": "Del documento largo al one pager que se manda por correo el mismo día."
        },
        {
          "role": "Dirección",
          "task": "Comité y junta",
          "detail": "Convierte el informe mensual en ocho láminas con una decisión pedida por lámina."
        },
        {
          "role": "Mercadeo",
          "task": "Piezas internas",
          "detail": "Circulares y anuncios con la misma línea gráfica de la empresa."
        }
      ],
      "mistakes": [
        {
          "bad": "Pedir \"que se vea profesional\" sin dar marca ni referencia.",
          "good": "Entregar colores, tipografía y un ejemplo de pieza que sí funcionó."
        },
        {
          "bad": "Meter todo el texto en la lámina.",
          "good": "Una idea por lámina; el resto en las notas."
        }
      ],
      "mockTitle": "Claude · One pager",
      "mockPrompt": "Convierte este informe en un one pager para el gerente financiero.",
      "mockReply": "Listo: problema, propuesta, tres beneficios y precio. Dejé el detalle técnico como anexo.",
      "mockPanelTitle": "Estructura propuesta",
      "mockPanel": "1. El problema en una frase\n2. Qué proponemos\n3. Tres beneficios con cifra\n4. Precio y condiciones\n5. Siguiente paso"
    },
    {
      "slug": "research",
      "name": "Research",
      "shortName": "Research",
      "abbr": "RE",
      "color": "#B08324",
      "level": "Intermedio",
      "summary": "Investigación con fuentes: Claude busca, contrasta y entrega el hallazgo con el enlace de dónde salió cada dato.",
      "intro": "Sirve para lo que no está en tus archivos: competencia, normativa, proveedores, tendencias. Lo importante no es el texto, son las fuentes.",
      "meta": "5 prompts · 35 min",
      "outcomes": [
        "Llegar a una reunión sabiendo qué está haciendo la competencia y de dónde salió el dato.",
        "Revisar normativa o requisitos sin depender de lo que alguien \"cree que dice\".",
        "Entregar un informe corto con enlaces que el jefe puede verificar."
      ],
      "prompts": [
        {
          "tag": "Competencia",
          "text": "Investiga qué están ofreciendo [tres competidores] en [servicio], con precios públicos si existen y la fuente de cada dato."
        },
        {
          "tag": "Normativa",
          "text": "¿Qué exige la norma vigente en [país] sobre [tema]? Cítame la norma y el artículo."
        },
        {
          "tag": "Proveedores",
          "text": "Arma una tabla comparativa de proveedores de [categoría] con precio, cobertura y tiempo de entrega."
        },
        {
          "tag": "Verificación",
          "text": "Este dato lo tengo de una presentación interna: [dato]. Búscalo y dime si sigue vigente."
        },
        {
          "tag": "Resumen",
          "text": "De todo lo anterior, dame media página con lo que cambia nuestra decisión y qué quedó sin resolver."
        }
      ],
      "baIntro": "El caso de la sesión: el comité pide un panorama de precios de la competencia para el jueves.",
      "before": "Dos días abriendo pestañas y copiando a un Excel, sin saber de cuándo es cada dato.",
      "beforeTime": "Dos días y una fuente sin fecha",
      "after": "Un informe con tabla, fuentes fechadas y una nota clara de lo que no se pudo confirmar.",
      "afterTime": "Una tarde, con enlaces verificables",
      "steps": [
        {
          "title": "Delimita la pregunta",
          "description": "País, periodo, segmento. \"Precios de la competencia\" es infinito; \"tarifas publicadas 2026 en Bogotá\" se puede responder."
        },
        {
          "title": "Exige fuente por dato",
          "description": "Pide el enlace al lado de cada cifra. Sin eso, el informe no sirve para decidir."
        },
        {
          "title": "Pide lo que no encontró",
          "description": "Un buen research dice qué quedó sin confirmar. Eso también es información."
        },
        {
          "title": "Cierra con la decisión",
          "description": "Media página de implicaciones. El comité no lee 20 páginas."
        }
      ],
      "roles": [
        {
          "role": "Comercial",
          "task": "Preparación de licitaciones",
          "detail": "Requisitos, plazos y competidores probables antes de decidir si se presenta."
        },
        {
          "role": "Compras",
          "task": "Selección de proveedores",
          "detail": "Tabla comparativa con fuente, para sustentar la elección ante auditoría."
        },
        {
          "role": "Dirección",
          "task": "Entrada a un mercado",
          "detail": "Panorama de precios y de actores antes de comprometer presupuesto."
        }
      ],
      "mistakes": [
        {
          "bad": "Copiar el resumen sin abrir ni una fuente.",
          "good": "Abrir al menos las fuentes de las cifras que van a la decisión."
        },
        {
          "bad": "Preguntar por \"el mercado\" sin país ni periodo.",
          "good": "Acotar geografía, periodo y segmento desde el primer mensaje."
        }
      ],
      "mockTitle": "Claude · Research",
      "mockPrompt": "Tarifas publicadas de tres competidores en Bogotá, con fuente.",
      "mockReply": "Encontré tarifas de dos; el tercero no publica precios. Te dejo la tabla y los enlaces.",
      "mockPanelTitle": "Fuentes",
      "mockPanel": "1. Sitio oficial · actualizado jul 2026\n2. Tarifario PDF · may 2026\n3. Sin dato público\nNota: precios sin IVA"
    },
    {
      "slug": "skills",
      "name": "Skills",
      "shortName": "Skills",
      "abbr": "SK",
      "color": "#4C7A5A",
      "level": "Avanzado",
      "summary": "Enseñarle a Claude el procedimiento de la empresa una sola vez para que lo repita igual cada vez que se necesite.",
      "intro": "Una skill es un instructivo que Claude carga cuando aplica: cómo se arma una cotización, cómo se responde un reclamo, qué formato lleva el acta. Es la forma de que no dependa de quién escriba el prompt.",
      "meta": "5 prompts · 40 min",
      "outcomes": [
        "Estandarizar una tarea repetitiva sin depender de la memoria de cada persona.",
        "Convertir el manual de procedimiento en algo que se ejecuta, no que se archiva.",
        "Que el resultado salga igual lo pida quien lo pida."
      ],
      "prompts": [
        {
          "tag": "Redactar skill",
          "text": "Convierte este procedimiento en una skill: cuándo se usa, pasos obligatorios, formato de salida y qué nunca debe hacer."
        },
        {
          "tag": "Formato",
          "text": "La salida siempre es una tabla con [columnas]. Si falta un dato, déjalo en blanco y márcalo, no lo inventes."
        },
        {
          "tag": "Prueba",
          "text": "Aplica la skill a este caso real y muéstrame en qué paso dudaste."
        },
        {
          "tag": "Reglas duras",
          "text": "Nunca cotices por debajo de [piso]. Si el caso lo exige, escribe \"requiere aprobación de dirección\"."
        },
        {
          "tag": "Mejora",
          "text": "Con estos tres casos donde falló, ajusta la skill y dime qué cambiaste."
        }
      ],
      "baIntro": "El caso de la sesión: cada asesor arma la cotización a su manera y la revisión se vuelve el cuello de botella.",
      "before": "Cinco asesores, cinco formatos y un jefe corrigiendo lo mismo todas las semanas.",
      "beforeTime": "La calidad depende de quién lo hizo",
      "after": "Una skill con el procedimiento oficial: mismo formato, mismos mínimos, misma alerta cuando algo requiere aprobación.",
      "afterTime": "La revisión se vuelve excepción",
      "steps": [
        {
          "title": "Escoge una tarea repetitiva y clara",
          "description": "Si el procedimiento no está escrito en ninguna parte, primero escríbelo. La skill no inventa el proceso."
        },
        {
          "title": "Define la salida exacta",
          "description": "Formato, columnas, extensión. Es lo que hace que el resultado sea comparable entre personas."
        },
        {
          "title": "Escribe las reglas duras",
          "description": "Los \"nunca\": no bajar del piso de precio, no prometer fechas, no citar sin fuente."
        },
        {
          "title": "Pruébala con casos reales",
          "description": "Tres casos, incluido uno difícil. Ajusta y vuelve a probar antes de repartirla al equipo."
        }
      ],
      "roles": [
        {
          "role": "Comercial",
          "task": "Cotización estándar",
          "detail": "Misma estructura y mismos mínimos para todo el equipo de ventas."
        },
        {
          "role": "Servicio al cliente",
          "task": "Respuesta a reclamos",
          "detail": "Tono de la empresa, plazos correctos y escalamiento cuando aplica."
        },
        {
          "role": "Talento humano",
          "task": "Certificaciones",
          "detail": "El mismo texto y los mismos campos para cada tipo de certificado."
        }
      ],
      "mistakes": [
        {
          "bad": "Escribir la skill como un texto de intenciones.",
          "good": "Escribirla como pasos y formato de salida verificable."
        },
        {
          "bad": "Repartirla al equipo sin probarla.",
          "good": "Probar con tres casos reales y corregir antes de publicarla."
        }
      ],
      "mockTitle": "Claude · Skill: cotización",
      "mockPrompt": "Cotiza el caso del cliente Norte con la skill oficial.",
      "mockReply": "Aplicada. El descuento pedido está por debajo del piso: marqué \"requiere aprobación de dirección\".",
      "mockPanelTitle": "Skill activa",
      "mockPanel": "cotizacion-estandar\n· Formato: tabla 6 columnas\n· Piso de precio: $95.000/h\n· Vigencia: 15 días\n· Alerta si descuento > 12%"
    },
    {
      "slug": "mcp",
      "name": "Conexiones (MCP)",
      "shortName": "MCP",
      "abbr": "MC",
      "color": "#A34860",
      "level": "Avanzado",
      "summary": "Conectar Claude a los sistemas donde ya está la información: el CRM, el repositorio de archivos, la mesa de ayuda.",
      "intro": "MCP es el estándar con el que Claude se conecta a una herramienta de la empresa. En vez de copiar y pegar datos, consulta la fuente con los permisos de quien pregunta.",
      "meta": "4 prompts · 35 min",
      "outcomes": [
        "Dejar de exportar reportes a mano para poder preguntarle algo a los datos.",
        "Consultar el estado real de un caso o de una cuenta desde el chat.",
        "Entender qué se conecta, con qué permisos y quién lo aprueba."
      ],
      "prompts": [
        {
          "tag": "Consulta",
          "text": "Del CRM: dame las oportunidades de [mes] por encima de [monto] que no tienen actividad hace 15 días."
        },
        {
          "tag": "Cruce",
          "text": "Cruza los tickets abiertos con los clientes que renuevan este trimestre y dime cuáles tienen riesgo."
        },
        {
          "tag": "Reporte",
          "text": "Arma el reporte semanal del área con los datos de la conexión y márcame lo que se salió de rango."
        },
        {
          "tag": "Alcance",
          "text": "Antes de conectar: qué datos vería esta conexión, con qué permisos y qué NO debería poder tocar."
        }
      ],
      "baIntro": "El caso de la sesión: el reporte semanal se arma exportando tres sistemas a un Excel.",
      "before": "Alguien exporta, pega, cuadra fórmulas y manda el archivo. Si hay error, se descubre en el comité.",
      "beforeTime": "Medio día de una persona, todas las semanas",
      "after": "Se pregunta contra la fuente conectada y el reporte sale con los datos de hoy.",
      "afterTime": "Minutos, y con trazabilidad de la consulta",
      "steps": [
        {
          "title": "Empieza por una sola conexión",
          "description": "La que resuelva la pregunta más repetida del área. Una bien hecha vale más que cinco a medias."
        },
        {
          "title": "Define permisos antes de conectar",
          "description": "Solo lectura para arrancar y con el alcance de la persona que pregunta. Esto se acuerda con TI."
        },
        {
          "title": "Prueba con preguntas conocidas",
          "description": "Preguntas cuya respuesta ya sabes, para comprobar que la conexión trae lo correcto."
        },
        {
          "title": "Documenta qué se conectó",
          "description": "Fuente, permisos y responsable. Sin eso, nadie sabe qué está viendo el asistente."
        }
      ],
      "roles": [
        {
          "role": "Comercial",
          "task": "Pipeline al día",
          "detail": "Estado real de las oportunidades sin exportar el CRM."
        },
        {
          "role": "Servicio al cliente",
          "task": "Estado de casos",
          "detail": "Consulta el ticket y su historial sin cambiar de sistema."
        },
        {
          "role": "TI",
          "task": "Gobierno de datos",
          "detail": "Define qué se expone, con qué permisos y cómo se audita."
        }
      ],
      "mistakes": [
        {
          "bad": "Conectar todo \"para ver qué pasa\".",
          "good": "Una conexión, un caso de uso y permisos de solo lectura al inicio."
        },
        {
          "bad": "Dar permisos de escritura desde el primer día.",
          "good": "Lectura primero; escritura cuando el flujo esté probado."
        }
      ],
      "mockTitle": "Claude · Conexión CRM",
      "mockPrompt": "Oportunidades de agosto sobre $50M sin actividad hace 15 días.",
      "mockReply": "Son 7. Tres son del mismo asesor. Te las ordeno por monto y última nota.",
      "mockPanelTitle": "Conexión activa",
      "mockPanel": "CRM · solo lectura\nAlcance: oportunidades, cuentas\nUsuario: permisos del solicitante\nÚltima consulta: hoy 09:12"
    },
    {
      "slug": "code",
      "name": "Claude Code",
      "shortName": "Code",
      "abbr": "CO",
      "color": "#C15F3C",
      "level": "Avanzado",
      "summary": "Automatizar tareas de archivos y datos desde la terminal: renombrar, consolidar, limpiar y generar reportes.",
      "intro": "Aunque se llame Code, la mayoría de los usos en una empresa no son de desarrollo: son tareas repetitivas sobre archivos y datos que hoy alguien hace a mano.",
      "meta": "4 prompts · 35 min",
      "outcomes": [
        "Consolidar decenas de archivos en uno solo con una instrucción.",
        "Limpiar bases de datos con reglas explicables y repetibles.",
        "Dejar el proceso guardado para volver a correrlo el mes siguiente."
      ],
      "prompts": [
        {
          "tag": "Consolidar",
          "text": "Une todos los Excel de esta carpeta en un solo archivo, agrega una columna con el nombre del archivo de origen."
        },
        {
          "tag": "Limpiar",
          "text": "Normaliza la columna de NIT: sin puntos ni guiones, y márcame los que queden con formato raro."
        },
        {
          "tag": "Reporte",
          "text": "Con el consolidado, genera un resumen por sucursal y por mes en una hoja aparte."
        },
        {
          "tag": "Repetible",
          "text": "Deja el proceso guardado como script y explícame en dos líneas cómo volverlo a correr."
        }
      ],
      "baIntro": "El caso de la sesión: 40 archivos de ventas por sucursal que hay que unir cada mes.",
      "before": "Copiar y pegar 40 veces, con el riesgo de saltarse uno o de pegar dos veces el mismo.",
      "beforeTime": "Una mañana y errores difíciles de detectar",
      "after": "Un proceso que une, marca el origen y avisa si un archivo tiene columnas distintas.",
      "afterTime": "Minutos, y el mismo proceso el mes que viene",
      "steps": [
        {
          "title": "Trabaja sobre una copia",
          "description": "Siempre. La primera regla de automatizar archivos es no tocar el original."
        },
        {
          "title": "Describe la tarea en palabras",
          "description": "\"Une, agrega columna de origen, avísame de los distintos\". No necesitas saber el lenguaje."
        },
        {
          "title": "Revisa el resultado contra un caso conocido",
          "description": "Verifica una sucursal a mano. Si cuadra, cuadran las demás."
        },
        {
          "title": "Guarda el proceso",
          "description": "Lo repetible es lo que ahorra tiempo de verdad, no la primera corrida."
        }
      ],
      "roles": [
        {
          "role": "Contabilidad",
          "task": "Cierre mensual",
          "detail": "Consolidación de archivos de sucursales con control de duplicados."
        },
        {
          "role": "Operaciones",
          "task": "Bases de datos",
          "detail": "Limpieza de listados de clientes y proveedores con reglas escritas."
        },
        {
          "role": "Analítica",
          "task": "Reportes recurrentes",
          "detail": "El mismo informe cada mes sin rehacer el trabajo manual."
        }
      ],
      "mistakes": [
        {
          "bad": "Correr el proceso sobre los archivos originales.",
          "good": "Copiar la carpeta y trabajar sobre la copia."
        },
        {
          "bad": "Aceptar el consolidado sin revisar ni un caso.",
          "good": "Verificar una sucursal a mano antes de dar por bueno el resultado."
        }
      ],
      "mockTitle": "Claude Code · terminal",
      "mockPrompt": "Une los 40 Excel de esta carpeta y marca el archivo de origen.",
      "mockReply": "Listo: 38 unidos. Dos tienen una columna distinta, te los dejo aparte.",
      "mockPanelTitle": "Resultado",
      "mockPanel": "consolidado_ventas.xlsx\n38 archivos · 12.480 filas\nRevisar: sucursal_07, sucursal_23\nColumna origen: agregada"
    },
    {
      "slug": "cowork",
      "name": "Trabajo en equipo",
      "shortName": "Cowork",
      "abbr": "CW",
      "color": "#8B6DB8",
      "level": "Intermedio",
      "summary": "Cómo trabaja un área completa sobre lo mismo: prompts compartidos, proyectos por cuenta y criterios de revisión.",
      "intro": "El salto de valor no es individual. Aparece cuando el equipo comparte los proyectos, los prompts que sirven y una regla común de qué se revisa antes de mandar.",
      "meta": "4 prompts · 30 min",
      "outcomes": [
        "Tener una biblioteca de prompts del área, no una carpeta personal por persona.",
        "Acordar qué se revisa siempre antes de que algo salga con el nombre de la empresa.",
        "Repartir quién mantiene cada proyecto y con qué frecuencia."
      ],
      "prompts": [
        {
          "tag": "Biblioteca",
          "text": "De esta conversación, extrae el prompt que funcionó y déjalo listo para guardar, con los campos entre corchetes."
        },
        {
          "tag": "Criterios",
          "text": "Arma la lista de verificación del área: qué se revisa siempre antes de enviar algo al cliente."
        },
        {
          "tag": "Inducción",
          "text": "Escribe la guía de 1 página para alguien que entra al equipo esta semana y nunca ha usado la herramienta."
        },
        {
          "tag": "Balance",
          "text": "Con estos casos de la semana, dime dónde nos está ahorrando tiempo de verdad y dónde no."
        }
      ],
      "baIntro": "El caso de la sesión: cada persona del área descubrió su propia manera de usarlo.",
      "before": "Prompts en notas personales, resultados dispares y nadie sabe qué funcionó en el equipo de al lado.",
      "beforeTime": "Aprendizaje que no se acumula",
      "after": "Biblioteca del área, proyectos por cuenta con dueño y una lista corta de qué se revisa siempre.",
      "afterTime": "Lo que aprende uno le sirve a todos",
      "steps": [
        {
          "title": "Nombra un responsable por proyecto",
          "description": "Alguien mantiene los archivos vigentes. Sin dueño, el proyecto envejece en tres semanas."
        },
        {
          "title": "Guarda solo los prompts que ya funcionaron",
          "description": "Con campos entre corchetes y una línea de cuándo usarlo."
        },
        {
          "title": "Acuerda la lista de verificación",
          "description": "Cinco puntos máximo: cifras, nombres, fechas, tono y datos sensibles."
        },
        {
          "title": "Revisen casos cada quincena",
          "description": "Quince minutos: qué funcionó, qué no, qué se guarda en la biblioteca."
        }
      ],
      "roles": [
        {
          "role": "Jefe de área",
          "task": "Adopción del equipo",
          "detail": "Define proyectos, dueños y criterios de revisión."
        },
        {
          "role": "Equipo",
          "task": "Uso diario",
          "detail": "Aporta a la biblioteca lo que le funcionó, en vez de guardarlo en sus notas."
        },
        {
          "role": "Talento humano",
          "task": "Inducción",
          "detail": "La guía de una página para quien entra nuevo al área."
        }
      ],
      "mistakes": [
        {
          "bad": "Dejar la adopción a la buena voluntad de cada quien.",
          "good": "Un responsable por proyecto y una revisión quincenal corta."
        },
        {
          "bad": "Guardar todos los prompts, funcionen o no.",
          "good": "Solo los que ya dieron un buen resultado en un caso real."
        }
      ],
      "mockTitle": "Claude · Biblioteca del área",
      "mockPrompt": "Extrae el prompt que funcionó y déjalo listo para guardar.",
      "mockReply": "Guardado como \"respuesta a reclamo · tono formal\", con tres campos entre corchetes.",
      "mockPanelTitle": "Biblioteca",
      "mockPanel": "· Cotización estándar (12 usos)\n· Respuesta a reclamo (9)\n· Acta de comité (7)\n· Resumen de contrato (4)"
    },
    {
      "slug": "chrome",
      "name": "Claude en el navegador",
      "shortName": "Chrome",
      "abbr": "CH",
      "color": "#2E7D8F",
      "level": "Intermedio",
      "summary": "Usarlo sobre la pestaña que ya tienes abierta: el portal de compras, el correo web, el proveedor, el sistema interno.",
      "intro": "Mucho del trabajo pasa en el navegador y no en un archivo. En esas pantallas el asistente sirve para resumir, comparar y llenar formularios largos sin cambiar de ventana.",
      "meta": "4 prompts · 25 min",
      "outcomes": [
        "Resumir una página larga de términos o de licitación sin leerla completa.",
        "Comparar dos pestañas de proveedores en una tabla.",
        "Preparar el texto de un formulario o de una respuesta sin salir de la pantalla."
      ],
      "prompts": [
        {
          "tag": "Resumen",
          "text": "Resume esta página en 5 puntos y dime qué obligaciones nos quedarían si aceptamos."
        },
        {
          "tag": "Comparación",
          "text": "Compara lo que dice esta pestaña con la anterior: precio, plazo y garantía en una tabla."
        },
        {
          "tag": "Extracción",
          "text": "Sácame de esta página los datos de contacto y los requisitos en lista, sin texto de relleno."
        },
        {
          "tag": "Redacción",
          "text": "Con lo que dice esta pantalla, redacta la respuesta al proveedor pidiendo aclaración sobre [punto]."
        }
      ],
      "baIntro": "El caso de la sesión: los términos de una licitación publicados en un portal, con 30 pantallas.",
      "before": "Se leen a las carreras el día del cierre y se descubre tarde un requisito que no se cumple.",
      "beforeTime": "Riesgo de quedar fuera por un detalle",
      "after": "Resumen de requisitos y fechas, con las obligaciones marcadas antes de decidir si se presenta.",
      "afterTime": "La decisión se toma con tiempo",
      "steps": [
        {
          "title": "Ten la pestaña correcta al frente",
          "description": "Trabaja sobre lo que está en pantalla; si el contenido está tras un login, ábrelo primero."
        },
        {
          "title": "Pide extracción, no opinión",
          "description": "\"Sácame requisitos y fechas\" antes que \"¿nos conviene?\"."
        },
        {
          "title": "Verifica lo crítico en la página",
          "description": "Fechas de cierre y montos se leen en la fuente, siempre."
        },
        {
          "title": "Guarda el resumen donde vive el caso",
          "description": "Pégalo en el proyecto del cliente para que quede con el resto del expediente."
        }
      ],
      "roles": [
        {
          "role": "Compras",
          "task": "Portales de proveedores",
          "detail": "Compara condiciones de dos proveedores sin copiar a mano."
        },
        {
          "role": "Comercial",
          "task": "Licitaciones",
          "detail": "Requisitos y fechas de los términos publicados, en una lista."
        },
        {
          "role": "Servicio al cliente",
          "task": "Sistemas web internos",
          "detail": "Redacta respuestas desde la misma pantalla del caso."
        }
      ],
      "mistakes": [
        {
          "bad": "Confiar en el resumen para una fecha de cierre.",
          "good": "Verificar fechas y montos directamente en la página."
        },
        {
          "bad": "Usarlo en pantallas con datos personales sin revisar la política.",
          "good": "Confirmar con TI qué sistemas están autorizados."
        }
      ],
      "mockTitle": "Claude · pestaña activa",
      "mockPrompt": "Resume estos términos y marca las obligaciones.",
      "mockReply": "5 puntos y 3 obligaciones. Ojo: exige póliza de cumplimiento del 20%.",
      "mockPanelTitle": "Extraído de la página",
      "mockPanel": "Cierre: 29/08/2026 5:00 p.m.\nPóliza: 20% del valor\nExperiencia: 3 contratos similares\nAnexos: 4"
    }
  ]
};
