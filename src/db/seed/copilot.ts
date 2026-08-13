import type { PlatformSeed } from './types';

export const copilot: PlatformSeed = {
  "id": "copilot",
  "name": "Microsoft Copilot",
  "portalName": "Portal Copilot",
  "initial": "M",
  "color": "#0B63CE",
  "description": "Word, Excel, PowerPoint, Teams y Outlook, con los casos del día a día de la empresa.",
  "tagline": "Capacitación interna",
  "inputHint": "Escríbele a Copilot...",
  "badge": "Programa interno · 6 módulos · en el orden que quieras",
  "heroTitle": "Aprende a usar Copilot en el trabajo del día a día",
  "heroText": "Word, Excel, PowerPoint, Teams y Outlook, con los casos que ya existen en la empresa y prompts listos para copiar.",
  "specialTitle": "Lo que solo se hace acá",
  "specialIntro": "Los diferenciales de Copilot frente a los otros portales de la academia.",
  "helpTitle": "¿Dudas durante la práctica?",
  "helpText": "Escribe al canal #academia-ia. Contestamos en horario de oficina.",
  "status": "completo",
  "stats": [
    {
      "value": "6",
      "label": "módulos, uno por aplicación"
    },
    {
      "value": "31",
      "label": "prompts listos para copiar"
    },
    {
      "value": "18",
      "label": "casos de uso por área"
    },
    {
      "value": "3",
      "label": "niveles: básico, intermedio y avanzado"
    }
  ],
  "specials": [
    {
      "kicker": "Dentro de Office",
      "title": "En los archivos que ya existen",
      "description": "Copilot trabaja sobre el documento abierto, no sobre una copia pegada en un chat.",
      "example": "\"Resume este documento en cinco puntos y deja el detalle al final.\""
    },
    {
      "kicker": "Permisos",
      "title": "Solo ve lo que tú ves",
      "description": "Respeta los permisos de tu cuenta: si no puedes abrir un archivo, Copilot tampoco.",
      "example": "\"¿Qué acordamos con este cliente en la última reunión?\""
    },
    {
      "kicker": "Teams y Outlook",
      "title": "La reunión y el correo, resueltos",
      "description": "Resumen de reunión con compromisos y respuesta de correo con el tono de la empresa.",
      "example": "\"Resume la reunión y sácame los compromisos con responsable.\""
    }
  ],
  "downloads": [
    {
      "title": "Guía rápida de prompts",
      "description": "Una página con cómo se arma un buen prompt y ejemplos por aplicación.",
      "meta": "PDF · 1,2 MB"
    },
    {
      "title": "Tarjeta de atajos",
      "description": "Para imprimir y dejarla pegada al lado del computador.",
      "meta": "PDF · 480 KB"
    },
    {
      "title": "Política de uso de IA",
      "description": "Qué información se puede procesar y qué datos no salen del entorno de la empresa.",
      "meta": "PDF · 760 KB"
    },
    {
      "title": "Formato para tu caso",
      "description": "Para escribir el caso de tu área y pasarlo a las demás.",
      "meta": "DOCX · 90 KB"
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
      "title": "Confirma todo dato",
      "description": "Precios, nombres y fechas se revisan contra el sistema. El documento sale con tu nombre."
    },
    {
      "number": "04",
      "title": "Guarda lo que te funcionó",
      "description": "Anota tus mejores prompts y pásalos al equipo: eso es lo que queda de la capacitación."
    }
  ],
  "faqs": [
    {
      "question": "¿Copilot puede ver todos los archivos de la empresa?",
      "answer": "Solo los archivos y correos a los que tu cuenta ya tiene acceso. No abre nada de más: si tú no puedes abrir un documento, Copilot tampoco."
    },
    {
      "question": "¿Lo que escribo se usa para entrenar modelos públicos?",
      "answer": "No. Con la licencia de la empresa, los prompts y los archivos se quedan en el entorno de la organización. El detalle está en la política de uso de IA."
    },
    {
      "question": "¿Puedo confiar en las cifras que genera?",
      "answer": "No sin revisarlas. Precios, cantidades y fechas se confirman contra el sistema. La regla de la capacitación es simple: lo que sale con tu nombre lo revisas tú."
    },
    {
      "question": "¿Qué hago si la respuesta no sirve?",
      "answer": "No empieces de cero. Agrega para quién es, qué extensión y qué formato, o pide una corrección concreta: \"más corto\", \"menos técnico\", \"agrega la política de cancelación\"."
    },
    {
      "question": "¿Necesito licencia especial?",
      "answer": "Sí, la licencia va asignada a tu cuenta corporativa. Si no ves el panel en tus aplicaciones, pídela en el canal de soporte."
    }
  ],
  "links": [
    {
      "label": "Microsoft Copilot: documentación oficial",
      "href": "https://learn.microsoft.com/copilot/"
    },
    {
      "label": "Copilot en Microsoft 365: guía de adopción",
      "href": "https://adoption.microsoft.com/copilot/"
    },
    {
      "label": "Copilot Studio: documentación",
      "href": "https://learn.microsoft.com/microsoft-copilot-studio/"
    },
    {
      "label": "Novedades de Microsoft 365",
      "href": "https://www.microsoft.com/microsoft-365/blog/"
    }
  ],
  "modules": [
    {
      "slug": "word",
      "name": "Copilot en Word",
      "shortName": "Word",
      "abbr": "W",
      "color": "#2B6FE3",
      "level": "Básico",
      "summary": "Armar una propuesta para un cliente, reescribir un comunicado interno y resumir contratos largos sin salir del archivo.",
      "intro": "Word es el mejor lugar para empezar: uno ve el resultado de una y todo se puede editar. Aquí pasas de las notas de la reunión a un documento que ya se puede mostrar.",
      "meta": "6 prompts · 35 min",
      "outcomes": [
        "Pasar de las notas de la reunión a una propuesta armada, con alcance, tiempos y precio.",
        "Reescribir un comunicado para el equipo en lenguaje claro, sin frases de manual.",
        "Resumir un contrato largo y sacar lo que la empresa se compromete a cumplir."
      ],
      "prompts": [
        {
          "tag": "Propuestas",
          "text": "Arma una propuesta para [cliente] con [alcance, tiempos, precio], en tono cercano y máximo 400 palabras."
        },
        {
          "tag": "Resumen",
          "text": "Resume este contrato y lista lo que nos comprometemos a cumplir, con fechas."
        },
        {
          "tag": "Edición",
          "text": "Reescribe este comunicado para el equipo operativo: frases cortas, sin palabras de manual."
        },
        {
          "tag": "Estructura",
          "text": "Convierte estas notas de la reunión en un acta con acuerdos, responsable y fecha."
        },
        {
          "tag": "Variantes",
          "text": "Escribe 3 versiones del correo de presentación: una formal, una cercana y una breve."
        },
        {
          "tag": "Revisión",
          "text": "Revisa esta propuesta y márcame los precios y fechas que quedaron sin confirmar."
        }
      ],
      "baIntro": "El caso de la sesión: armar la propuesta de un cliente con las notas de la reunión.",
      "before": "Buscar la propuesta del último cliente, copiar la estructura, cambiar precios y fechas a mano y pasarla dos veces por revisión.",
      "beforeTime": "Plantilla vieja · 3 rondas de revisión",
      "after": "Pegar las notas, pedir la propuesta con alcance y precio, ajustar el tono en un segundo prompt y confirmar cifras contra la lista de precios.",
      "afterTime": "Un borrador · 1 ronda de revisión",
      "steps": [
        {
          "title": "Abre Copilot en el documento",
          "description": "En la pestaña Inicio está el botón de Copilot. Se abre un panel al lado que lee el documento que tienes abierto."
        },
        {
          "title": "Di para quién es antes de pedir",
          "description": "\"Para un cliente corporativo, máximo 400 palabras\" cambia por completo lo que sale."
        },
        {
          "title": "Corrige sobre lo que ya salió",
          "description": "Si no te gusta, no empieces de cero: pide \"más corto\", \"menos técnico\" o \"agrega la política de cancelación\"."
        },
        {
          "title": "Confirma precios y fechas",
          "description": "Copilot puede inventarse un número. Todo precio, fecha y cantidad se confirma contra la fuente antes de enviar."
        }
      ],
      "roles": [
        {
          "role": "Comercial",
          "task": "Propuestas y cotizaciones",
          "detail": "Arma la propuesta desde las notas de la reunión y adapta la misma base al lenguaje de cada cliente."
        },
        {
          "role": "Servicio al cliente",
          "task": "Respuestas escritas",
          "detail": "Contesta un reclamo con el tono de la empresa, sin que suene a copiar y pegar."
        },
        {
          "role": "Talento humano",
          "task": "Circulares internas",
          "detail": "Convierte el reglamento en una circular de una página que sí lea todo el equipo."
        }
      ],
      "mistakes": [
        {
          "bad": "Pedir \"escribe una propuesta\" y mandar lo primero que salga.",
          "good": "Decir cliente, alcance, fechas y extensión; después corregir sobre el resultado."
        },
        {
          "bad": "Enviar el documento sin leerlo completo.",
          "good": "Revisar precios, nombres y fechas: el documento lo firma la empresa, no Copilot."
        },
        {
          "bad": "Pegar datos personales de un cliente en el prompt.",
          "good": "Trabajar con los documentos que ya están en el entorno de la empresa y seguir la política de datos."
        }
      ],
      "mockTitle": "Propuesta_Cliente_Q3.docx",
      "mockPrompt": "Con estas notas, arma una propuesta para el cliente con alcance, tiempos y precio.",
      "mockReply": "Listo. Armé la propuesta con alcance, tiempos y precio. ¿Le ajusto el tono para el cliente?"
    },
    {
      "slug": "excel",
      "name": "Copilot en Excel",
      "shortName": "Excel",
      "abbr": "E",
      "color": "#137A4C",
      "level": "Intermedio",
      "summary": "Leer el informe de ventas, armar fórmulas, encontrar los datos raros y elegir el gráfico que sirve.",
      "intro": "Excel es donde más ayuda y donde más hay que revisar. Aquí aprendes a preguntarle a tu hoja y a leer con criterio lo que responde.",
      "meta": "6 prompts · 45 min",
      "outcomes": [
        "Entender en dos frases un informe que te mandó otra área.",
        "Crear la columna de margen o de promedio y entender la fórmula que quedó.",
        "Encontrar los datos raros del mes y elegir el gráfico correcto para mostrarlos."
      ],
      "prompts": [
        {
          "tag": "Exploración",
          "text": "Explícame qué muestra este informe y dime las 3 cosas más importantes."
        },
        {
          "tag": "Fórmulas",
          "text": "Crea una columna con el margen por producto y explícame la fórmula que usaste."
        },
        {
          "tag": "Calidad",
          "text": "Encuentra los datos raros en la columna de ventas y dime en qué filas están."
        },
        {
          "tag": "Visualización",
          "text": "Dime qué gráfico sirve para comparar ventas por mes y por línea, y por qué."
        },
        {
          "tag": "Limpieza",
          "text": "Separa esta columna en nombre, ciudad y número de documento, y quita los espacios de más."
        },
        {
          "tag": "Proyección",
          "text": "Con los últimos 12 meses, proyecta las ventas del próximo trimestre y dime de qué supuestos partiste."
        }
      ],
      "baIntro": "El caso de la sesión: entender el informe de ventas y gastos que llega cada lunes.",
      "before": "Recorrer la hoja fila por fila, armar tablas dinámicas de prueba, escribir fórmulas a mano y comparar con el mes pasado en otra ventana.",
      "beforeTime": "Cuentas difíciles de repetir el mes siguiente",
      "after": "Convertir el rango en tabla, pedir el resumen, generar la columna de margen y revisar dos filas a mano.",
      "afterTime": "Fórmulas que quedan a la vista",
      "steps": [
        {
          "title": "Convierte el rango en tabla",
          "description": "Selecciona los datos y usa Insertar › Tabla. Copilot necesita encabezados claros y una sola tabla por hoja."
        },
        {
          "title": "Primero pregunta, después calcula",
          "description": "\"¿Qué muestra esta hoja?\" te da el mapa antes de ponerte a pedir números."
        },
        {
          "title": "Pide la fórmula, no solo el resultado",
          "description": "Cuando agregue una columna, pídele la fórmula: así se puede revisar y volver a usar el mes siguiente."
        },
        {
          "title": "Revisa dos filas a mano",
          "description": "Toma dos filas al azar y verifica la cuenta. Si cuadran, la columna es confiable."
        }
      ],
      "roles": [
        {
          "role": "Administración",
          "task": "Cierre del mes",
          "detail": "Cuadra el reporte de caja y encuentra la diferencia sin revisar comprobante por comprobante."
        },
        {
          "role": "Operaciones",
          "task": "Carga del equipo",
          "detail": "Reparte el trabajo del día según la demanda y ve quién quedó sobrecargado."
        },
        {
          "role": "Comercial",
          "task": "Seguimiento de metas",
          "detail": "Compara la venta contra la meta por vendedor y ubica los casos que se salieron."
        }
      ],
      "mistakes": [
        {
          "bad": "Trabajar sobre un rango sin encabezados o con celdas combinadas.",
          "good": "Usar una tabla con encabezados únicos y sin filas vacías en el medio."
        },
        {
          "bad": "Aceptar una proyección sin saber de dónde salió.",
          "good": "Pedir siempre el método y el periodo que usó para proyectar."
        },
        {
          "bad": "Escribir el resultado encima de los datos originales.",
          "good": "Trabajar en una copia o en columnas nuevas para poder comparar."
        }
      ],
      "mockTitle": "Ventas_2026_Q2.xlsx",
      "mockPrompt": "Dime las 3 cosas más importantes de este informe de ventas.",
      "mockReply": "Junio cierra 12% arriba de mayo; tres clientes concentran el 41% de la venta."
    },
    {
      "slug": "ppt",
      "name": "Copilot en PowerPoint",
      "shortName": "PowerPoint",
      "abbr": "P",
      "color": "#C2410C",
      "level": "Intermedio",
      "summary": "Pasar un informe a presentación, ordenar el mensaje y recortar un mazo largo para gerencia.",
      "intro": "PowerPoint sirve para transformar, no para inventar: dale contenido que ya existe y pídele estructura.",
      "meta": "5 prompts · 30 min",
      "outcomes": [
        "Pasar el informe del mes a un mazo con notas para quien expone.",
        "Recortar una presentación larga a la versión de 3 diapositivas para gerencia.",
        "Reordenar las diapositivas para que lo importante quede de primero."
      ],
      "prompts": [
        {
          "tag": "Creación",
          "text": "Con este documento, arma una presentación de 8 diapositivas con notas del expositor."
        },
        {
          "tag": "Síntesis",
          "text": "Resume esta presentación en 3 diapositivas para el comité de gerencia."
        },
        {
          "tag": "Narrativa",
          "text": "Reorganiza esta diapositiva para que el mensaje quede arriba y las cifras queden como soporte."
        },
        {
          "tag": "Contenido",
          "text": "Convierte este párrafo en 4 viñetas de máximo 10 palabras cada una."
        },
        {
          "tag": "Cierre",
          "text": "Escribe la diapositiva de compromisos con responsable y fecha para cada acuerdo."
        }
      ],
      "baIntro": "El caso de la sesión: llevar el informe del mes al comité de gerencia.",
      "before": "Copiar y pegar párrafos del informe, buscar una plantilla, acomodar cada diapositiva y escribir las notas de afán, cinco minutos antes.",
      "beforeTime": "Notas improvisadas",
      "after": "Generar el mazo desde el informe, arreglar el orden del mensaje y pulir a mano las dos diapositivas que se presentan.",
      "afterTime": "Notas del expositor incluidas",
      "steps": [
        {
          "title": "Parte de un documento bueno",
          "description": "El mazo sale como esté el informe. Si el informe está claro, la presentación también."
        },
        {
          "title": "Di cuántas diapositivas quieres",
          "description": "Pedir \"8 diapositivas\" evita mazos de 25 láminas que después hay que recortar."
        },
        {
          "title": "Arregla el orden a mano",
          "description": "Copilot ordena por secciones, no por argumento. Revisa que la conclusión no quede escondida al final."
        },
        {
          "title": "Pide las notas del expositor",
          "description": "Es lo que más sirve y lo que casi nadie pide."
        }
      ],
      "roles": [
        {
          "role": "Comercial",
          "task": "Presentaciones para clientes",
          "detail": "Adapta el mismo mazo al sector y al tamaño de cada cliente."
        },
        {
          "role": "Talento humano",
          "task": "Inducción de gente nueva",
          "detail": "Convierte los manuales internos en una sesión con notas para quien la dicta."
        },
        {
          "role": "Gerencia",
          "task": "Comité mensual",
          "detail": "Resume el informe de cierre en la versión corta, sin dejar por fuera las cifras que siempre preguntan."
        }
      ],
      "mistakes": [
        {
          "bad": "Pedir una presentación sobre un tema, sin documento de dónde sacarla.",
          "good": "Partir siempre de un archivo con el contenido ya revisado."
        },
        {
          "bad": "Dejar el diseño automático tal cual en presentaciones para clientes.",
          "good": "Aplicar la plantilla de la empresa y revisar jerarquía y contraste."
        },
        {
          "bad": "Meter todo el texto generado en cada diapositiva.",
          "good": "Una idea por diapositiva; el detalle va en las notas."
        }
      ],
      "mockTitle": "Comite_Resultados_Q2.pptx",
      "mockPrompt": "Con este informe, arma una presentación de 8 diapositivas para el comité.",
      "mockReply": "Armé 8 diapositivas con notas del expositor. Revisa el orden de la 4 y la 5."
    },
    {
      "slug": "teams",
      "name": "Copilot en Teams",
      "shortName": "Teams",
      "abbr": "T",
      "color": "#6D5BD0",
      "level": "Básico",
      "summary": "Resumen de la reunión, compromisos con responsable y seguimiento sin estar tomando notas.",
      "intro": "Con la transcripción activada dejas de escribir y empiezas a participar en la reunión. Es el módulo que se siente de una.",
      "meta": "5 prompts · 25 min",
      "outcomes": [
        "Salir del comité con los acuerdos escritos y con responsable asignado.",
        "Ponerte al día de una reunión a la que no alcanzaste a entrar.",
        "Mandar el mensaje de seguimiento al equipo en un solo paso."
      ],
      "prompts": [
        {
          "tag": "Resumen",
          "text": "Resume la reunión y lista los compromisos con responsable y fecha."
        },
        {
          "tag": "Puesta al día",
          "text": "¿Qué se decidió mientras no estuve y qué queda pendiente para mi área?"
        },
        {
          "tag": "Seguimiento",
          "text": "Escribe un mensaje para el equipo con los 3 acuerdos principales de la reunión."
        },
        {
          "tag": "Contexto",
          "text": "Resume los mensajes sin leer de este canal de los últimos 3 días."
        },
        {
          "tag": "Decisiones",
          "text": "Dime en qué temas no se decidió nada y qué falta para cerrarlos."
        }
      ],
      "baIntro": "El caso de la sesión: el comité de los lunes.",
      "before": "Alguien toma notas mientras intenta participar, el acta sale al otro día y los acuerdos quedan a medias.",
      "beforeTime": "Acta al día siguiente",
      "after": "Se activa la transcripción, al cerrar se piden los compromisos y el seguimiento sale en la misma reunión.",
      "afterTime": "Acuerdos escritos el mismo día",
      "steps": [
        {
          "title": "Activa la transcripción al empezar",
          "description": "Sin transcripción no hay resumen. Avísales a los que están en la reunión: es parte del acuerdo interno."
        },
        {
          "title": "Pregunta durante la reunión",
          "description": "Puedes pedir \"¿qué me perdí?\" en cualquier momento, sin interrumpir a nadie."
        },
        {
          "title": "Pide compromisos, no resúmenes",
          "description": "Un resumen es texto; una lista con responsable y fecha es la que se puede cobrar el lunes siguiente."
        },
        {
          "title": "Manda el seguimiento antes de colgar",
          "description": "El mensaje que sale en caliente es el que la gente sí cumple."
        }
      ],
      "roles": [
        {
          "role": "Comercial",
          "task": "Llamadas con el cliente",
          "detail": "Deja por escrito lo que se acordó con el cliente sin depender de la memoria de nadie."
        },
        {
          "role": "Operaciones",
          "task": "Reunión de arranque del día",
          "detail": "Reparte los pendientes y queda claro quién responde por cada frente."
        },
        {
          "role": "Proyectos",
          "task": "Comité de avance",
          "detail": "Recupera qué se aprobó, quién lo pidió y para cuándo quedó."
        }
      ],
      "mistakes": [
        {
          "bad": "Grabar sin avisarles a los participantes.",
          "good": "Avisar siempre y seguir la política interna de grabación y datos."
        },
        {
          "bad": "Confiar en el resumen para temas de personal o legales.",
          "good": "Confirmar los acuerdos delicados con el responsable antes de mandar el acta."
        },
        {
          "bad": "Pedir el resumen días después, cuando ya nadie se acuerda del contexto.",
          "good": "Generarlo al cerrar la reunión y compartirlo el mismo día."
        }
      ],
      "mockTitle": "Comité de operaciones · Teams",
      "mockPrompt": "Resume la reunión y lista los compromisos con responsable y fecha.",
      "mockReply": "3 acuerdos y 2 pendientes. El de compras vence el viernes."
    },
    {
      "slug": "outlook",
      "name": "Copilot en Outlook",
      "shortName": "Outlook",
      "abbr": "O",
      "color": "#0E7490",
      "level": "Básico",
      "summary": "Resumir hilos largos, saber qué se responde primero y contestar con el tono de la empresa.",
      "intro": "El correo es donde se va la mañana. Este módulo es para recuperar el contexto rápido y responder bien, no solo rápido.",
      "meta": "5 prompts · 25 min",
      "outcomes": [
        "Entender un hilo de 20 correos de una negociación sin leerlo completo.",
        "Contestarle a un cliente con el tono correcto sin escribir desde cero.",
        "Saber cuál correo va primero: el que tiene a alguien esperando."
      ],
      "prompts": [
        {
          "tag": "Resumen",
          "text": "Resume este hilo y dime exactamente qué se espera de mí."
        },
        {
          "tag": "Redacción",
          "text": "Escribe una respuesta amable diciendo que no podemos cumplir esa fecha y propón dos alternativas."
        },
        {
          "tag": "Prioridad",
          "text": "Ordena los correos sin responder de esta semana según qué tan urgente es para el cliente."
        },
        {
          "tag": "Tono",
          "text": "Reescribe este borrador más firme pero respetuoso, en máximo 5 líneas."
        },
        {
          "tag": "Seguimiento",
          "text": "Escribe un recordatorio amable de la cotización que mandé hace 8 días."
        }
      ],
      "baIntro": "El caso de la sesión: volver de vacaciones con la bandeja llena de cotizaciones y reclamos.",
      "before": "Abrir hilo por hilo desde el más reciente, perder el hilo de lo que ya se había acordado y responder por orden de llegada.",
      "beforeTime": "Se responde por orden de llegada",
      "after": "Pedir el orden de la semana, resumir los hilos largos y responder primero lo que tiene a alguien esperando.",
      "afterTime": "Se responde por lo que está frenado",
      "steps": [
        {
          "title": "Resume antes de leer",
          "description": "En un hilo largo, el resumen te dice si toca leerlo completo o solo responder una línea."
        },
        {
          "title": "Pregunta qué se espera de ti",
          "description": "Es la pregunta más útil del módulo: separa lo informativo de lo que hay que hacer."
        },
        {
          "title": "Escribe diciendo el tono",
          "description": "\"Amable pero firme, máximo 5 líneas\" da mejores correos que \"responde esto\"."
        },
        {
          "title": "Revisa antes de enviar",
          "description": "El correo sale con tu nombre. Revisa el saludo, el nombre del cliente y las fechas que estás prometiendo."
        }
      ],
      "roles": [
        {
          "role": "Comercial",
          "task": "Cotizaciones",
          "detail": "Recupera en qué quedó la negociación de un hilo largo antes de llamar al cliente."
        },
        {
          "role": "Servicio al cliente",
          "task": "Reclamos",
          "detail": "Responde una queja con el tono de la empresa y sin que suene a plantilla."
        },
        {
          "role": "Compras",
          "task": "Proveedores",
          "detail": "Identifica qué pedidos están sin confirmar y quién los tiene frenados."
        }
      ],
      "mistakes": [
        {
          "bad": "Mandar la respuesta generada sin leerla.",
          "good": "Revisar nombres, fechas y lo que se está prometiendo antes de enviar."
        },
        {
          "bad": "Usar el mismo tono para un cliente y para el grupo interno.",
          "good": "Decir en el prompt para quién es el correo y con qué tono."
        },
        {
          "bad": "Resumir hilos con datos de clientes por fuera de la política interna.",
          "good": "Revisar la política de datos antes de procesar información de un cliente."
        }
      ],
      "mockTitle": "Bandeja de entrada · Outlook",
      "mockPrompt": "Resume este hilo y dime qué se espera de mí.",
      "mockReply": "18 mensajes. Te piden confirmar el alcance antes del jueves."
    },
    {
      "slug": "studio",
      "name": "Copilot Studio",
      "shortName": "Copilot Studio",
      "abbr": "CS",
      "color": "#A32079",
      "level": "Avanzado",
      "summary": "Armar un agente que responda con las políticas y los documentos de tu área.",
      "intro": "Módulo opcional para quien ya maneja lo anterior. Aquí se arma un agente con fuentes de la empresa, límites claros y alguien encargado de mantenerlo.",
      "meta": "4 prompts · 50 min",
      "outcomes": [
        "Definir para qué sirve el agente y qué no responde, antes de armarlo.",
        "Conectar las políticas vigentes de la empresa y mantenerlas al día.",
        "Saber si de verdad bajaron las preguntas repetidas que llegan al área."
      ],
      "prompts": [
        {
          "tag": "Diseño",
          "text": "Arma un agente que responda las preguntas frecuentes del equipo con estas políticas."
        },
        {
          "tag": "Alcance",
          "text": "Define el tono y los límites del agente: qué responde y qué pasa a una persona."
        },
        {
          "tag": "Pruebas",
          "text": "Escribe 10 preguntas que le haría al agente alguien que entró esta semana."
        },
        {
          "tag": "Mejora",
          "text": "Revisa las preguntas que quedaron sin respuesta esta semana y dime qué documento falta."
        }
      ],
      "baIntro": "El caso de la sesión: las mismas preguntas de vacaciones y certificados que le llegan a talento humano cada mes.",
      "before": "Una persona del área responde una por una las preguntas de vacaciones, certificados y permisos.",
      "beforeTime": "Las mismas preguntas todos los meses",
      "after": "El agente responde con las políticas vigentes y pasa a una persona solo lo que se sale del alcance.",
      "afterTime": "Una revisión mensual de las fuentes",
      "steps": [
        {
          "title": "Empieza por un problema que se pueda medir",
          "description": "Define qué pregunta repetida vas a bajar. Un agente sin eso no se sostiene."
        },
        {
          "title": "Pocas fuentes y vigentes",
          "description": "Tres documentos al día sirven más que veinte desactualizados."
        },
        {
          "title": "Escribe qué NO debe responder",
          "description": "Salarios, sanciones y casos legales pasan a una persona. Déjalo escrito."
        },
        {
          "title": "Ponle un responsable",
          "description": "Alguien tiene que revisar cada mes las preguntas sin respuesta y actualizar los documentos."
        }
      ],
      "roles": [
        {
          "role": "Talento humano",
          "task": "Agente de políticas",
          "detail": "Responde vacaciones, certificados y permisos con el reglamento vigente."
        },
        {
          "role": "Operaciones",
          "task": "Agente de procesos",
          "detail": "Le explica a la gente nueva cómo se hace cada trámite interno."
        },
        {
          "role": "Compras",
          "task": "Agente de proveedores",
          "detail": "Dice qué proveedor tiene cada insumo y qué documento pide cada compra."
        }
      ],
      "mistakes": [
        {
          "bad": "Armar el agente antes de definir qué responde.",
          "good": "Escribir primero qué responde, qué pasa a una persona y quién lo mantiene."
        },
        {
          "bad": "Conectar carpetas completas con documentos viejos.",
          "good": "Escoger pocas fuentes vigentes y revisarlas cada mes."
        },
        {
          "bad": "Soltarlo a toda la empresa sin probarlo.",
          "good": "Probarlo con un grupo pequeño y corregir con preguntas reales."
        }
      ],
      "mockTitle": "Agente · Talento humano",
      "mockPrompt": "Arma un agente que responda las preguntas frecuentes del equipo.",
      "mockReply": "Agente creado con 3 fuentes. Falta definir qué no debe responder."
    }
  ]
};
