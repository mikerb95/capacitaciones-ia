import type { PlatformSeed } from './types';

// Contenido en redaccion: la estructura y los titulos son definitivos,
// el detalle de cada modulo se completa despues de revisar Gemini.

export const chatgpt: PlatformSeed = {
  "id": "chatgpt",
  "name": "ChatGPT",
  "portalName": "Portal ChatGPT",
  "initial": "O",
  "color": "#0E7C63",
  "description": "Canvas, voz, GPTs propios, Deep Research, Agent Mode, Codex, imágenes y video.",
  "tagline": "Capacitación interna",
  "inputHint": "Escríbele a ChatGPT...",
  "badge": "Programa interno · 8 módulos · en el orden que quieras",
  "heroTitle": "Aprende a usar ChatGPT en el trabajo del día a día",
  "heroText": "Canvas, voz, GPTs propios, investigación con fuentes y agentes que ejecutan tareas, con los casos de siempre.",
  "specialTitle": "Lo que solo se hace acá",
  "specialIntro": "Los tres diferenciales de ChatGPT frente a los otros portales de la academia. Contenido por afinar.",
  "helpTitle": "¿Dudas durante la práctica?",
  "helpText": "Escribe al canal #academia-ia. Contestamos en horario de oficina.",
  "status": "en-redaccion",
  "stats": [
    {
      "value": "8",
      "label": "módulos, uno por capacidad"
    },
    {
      "value": "-",
      "label": "prompts (por definir)"
    },
    {
      "value": "-",
      "label": "casos de uso por área"
    },
    {
      "value": "3",
      "label": "niveles: básico, intermedio y avanzado"
    }
  ],
  "specials": [
    {
      "kicker": "GPTs",
      "title": "Asistentes propios por tarea",
      "description": "Instrucciones y archivos de la empresa, compartidos con el área.",
      "example": "Pendiente de redactar."
    },
    {
      "kicker": "Agent Mode",
      "title": "Ejecuta, no solo responde",
      "description": "Tareas de varios pasos en el navegador con resultado verificable.",
      "example": "Pendiente de redactar."
    },
    {
      "kicker": "Voz",
      "title": "Conversación sin teclado",
      "description": "Consultar y dictar en ruta o en sitio.",
      "example": "Pendiente de redactar."
    }
  ],
  "downloads": [
    {
      "title": "Guía de prompts",
      "description": "Pendiente de armar.",
      "meta": "PDF"
    },
    {
      "title": "Plantilla de GPT",
      "description": "Pendiente de armar.",
      "meta": "DOCX"
    },
    {
      "title": "Checklist de revisión",
      "description": "Pendiente de armar.",
      "meta": "PDF"
    }
  ],
  "practices": [
    {
      "number": "01",
      "title": "Di para quién es antes de pedir",
      "description": "Pendiente de redactar."
    },
    {
      "number": "02",
      "title": "Corrige, no arranques otra vez",
      "description": "Pendiente de redactar."
    },
    {
      "number": "03",
      "title": "Exige la fuente",
      "description": "Pendiente de redactar."
    },
    {
      "number": "04",
      "title": "Guarda lo que te funcionó",
      "description": "Pendiente de redactar."
    }
  ],
  "faqs": [
    {
      "question": "¿ChatGPT ve los archivos de la empresa?",
      "answer": "Pendiente de redactar."
    },
    {
      "question": "¿Lo que escribimos entrena el modelo?",
      "answer": "Pendiente de redactar."
    },
    {
      "question": "¿Puedo confiar en las cifras que genera?",
      "answer": "Pendiente de redactar."
    },
    {
      "question": "¿En qué se diferencia de los otros portales?",
      "answer": "Pendiente de redactar."
    }
  ],
  "links": [
    {
      "label": "Ayuda de ChatGPT",
      "href": "https://help.openai.com"
    },
    {
      "label": "GPTs personalizados",
      "href": "https://help.openai.com"
    },
    {
      "label": "ChatGPT para empresas",
      "href": "https://openai.com/business"
    }
  ],
  "modules": [
    {
      "slug": "canvas",
      "name": "Canvas",
      "shortName": "Canvas",
      "abbr": "CV",
      "color": "#0E7C63",
      "level": "Básico",
      "summary": "Editor al lado del chat para documentos y código: se corrige por selección, no por mensajes.",
      "intro": "Un documento vivo con control de versiones dentro de la conversación.",
      "meta": "por definir",
      "outcomes": [
        "Objetivo 1 del módulo",
        "Objetivo 2 del módulo",
        "Objetivo 3 del módulo"
      ],
      "prompts": [
        {
          "tag": "Por definir",
          "text": "Prompt pendiente de redactar."
        }
      ],
      "baIntro": "Caso de la sesión: pendiente.",
      "before": "Situación actual: pendiente.",
      "beforeTime": "-",
      "after": "Con la herramienta: pendiente.",
      "afterTime": "-",
      "steps": [
        {
          "title": "Paso 1",
          "description": "Pendiente."
        },
        {
          "title": "Paso 2",
          "description": "Pendiente."
        },
        {
          "title": "Paso 3",
          "description": "Pendiente."
        },
        {
          "title": "Paso 4",
          "description": "Pendiente."
        }
      ],
      "roles": [
        {
          "role": "Área",
          "task": "Caso de uso",
          "detail": "Pendiente."
        }
      ],
      "mistakes": [
        {
          "bad": "Error frecuente pendiente.",
          "good": "Práctica correcta pendiente."
        }
      ],
      "mockTitle": "Canvas",
      "mockPrompt": "Prompt de ejemplo pendiente.",
      "mockReply": "Respuesta de ejemplo pendiente.",
      "mockPanelTitle": "Panel",
      "mockPanel": "Pendiente",
      "status": "borrador"
    },
    {
      "slug": "voice",
      "name": "Modo voz",
      "shortName": "Voice",
      "abbr": "VZ",
      "color": "#2B6FE3",
      "level": "Básico",
      "summary": "Conversación hablada para consultar, dictar y ensayar sin teclado.",
      "intro": "Útil en ruta, en sitio y para practicar una llamada antes de hacerla.",
      "meta": "por definir",
      "outcomes": [
        "Objetivo 1 del módulo",
        "Objetivo 2 del módulo",
        "Objetivo 3 del módulo"
      ],
      "prompts": [
        {
          "tag": "Por definir",
          "text": "Prompt pendiente de redactar."
        }
      ],
      "baIntro": "Caso de la sesión: pendiente.",
      "before": "Situación actual: pendiente.",
      "beforeTime": "-",
      "after": "Con la herramienta: pendiente.",
      "afterTime": "-",
      "steps": [
        {
          "title": "Paso 1",
          "description": "Pendiente."
        },
        {
          "title": "Paso 2",
          "description": "Pendiente."
        },
        {
          "title": "Paso 3",
          "description": "Pendiente."
        },
        {
          "title": "Paso 4",
          "description": "Pendiente."
        }
      ],
      "roles": [
        {
          "role": "Área",
          "task": "Caso de uso",
          "detail": "Pendiente."
        }
      ],
      "mistakes": [
        {
          "bad": "Error frecuente pendiente.",
          "good": "Práctica correcta pendiente."
        }
      ],
      "mockTitle": "Modo voz",
      "mockPrompt": "Prompt de ejemplo pendiente.",
      "mockReply": "Respuesta de ejemplo pendiente.",
      "mockPanelTitle": "Panel",
      "mockPanel": "Pendiente",
      "status": "borrador"
    },
    {
      "slug": "gpts",
      "name": "GPTs personalizados",
      "shortName": "GPTs",
      "abbr": "GP",
      "color": "#8A5CD1",
      "level": "Intermedio",
      "summary": "Asistentes propios por tarea, con instrucciones y archivos de la empresa.",
      "intro": "Se configuran una vez y los usa todo el equipo con el mismo criterio.",
      "meta": "por definir",
      "outcomes": [
        "Objetivo 1 del módulo",
        "Objetivo 2 del módulo",
        "Objetivo 3 del módulo"
      ],
      "prompts": [
        {
          "tag": "Por definir",
          "text": "Prompt pendiente de redactar."
        }
      ],
      "baIntro": "Caso de la sesión: pendiente.",
      "before": "Situación actual: pendiente.",
      "beforeTime": "-",
      "after": "Con la herramienta: pendiente.",
      "afterTime": "-",
      "steps": [
        {
          "title": "Paso 1",
          "description": "Pendiente."
        },
        {
          "title": "Paso 2",
          "description": "Pendiente."
        },
        {
          "title": "Paso 3",
          "description": "Pendiente."
        },
        {
          "title": "Paso 4",
          "description": "Pendiente."
        }
      ],
      "roles": [
        {
          "role": "Área",
          "task": "Caso de uso",
          "detail": "Pendiente."
        }
      ],
      "mistakes": [
        {
          "bad": "Error frecuente pendiente.",
          "good": "Práctica correcta pendiente."
        }
      ],
      "mockTitle": "GPTs personalizados",
      "mockPrompt": "Prompt de ejemplo pendiente.",
      "mockReply": "Respuesta de ejemplo pendiente.",
      "mockPanelTitle": "Panel",
      "mockPanel": "Pendiente",
      "status": "borrador"
    },
    {
      "slug": "deep",
      "name": "Deep Research",
      "shortName": "Deep Research",
      "abbr": "DR",
      "color": "#C2760C",
      "level": "Intermedio",
      "summary": "Informes largos con fuentes sobre mercado, competencia o normativa.",
      "intro": "Investigación autónoma con citas, para sustentar decisiones de comité.",
      "meta": "por definir",
      "outcomes": [
        "Objetivo 1 del módulo",
        "Objetivo 2 del módulo",
        "Objetivo 3 del módulo"
      ],
      "prompts": [
        {
          "tag": "Por definir",
          "text": "Prompt pendiente de redactar."
        }
      ],
      "baIntro": "Caso de la sesión: pendiente.",
      "before": "Situación actual: pendiente.",
      "beforeTime": "-",
      "after": "Con la herramienta: pendiente.",
      "afterTime": "-",
      "steps": [
        {
          "title": "Paso 1",
          "description": "Pendiente."
        },
        {
          "title": "Paso 2",
          "description": "Pendiente."
        },
        {
          "title": "Paso 3",
          "description": "Pendiente."
        },
        {
          "title": "Paso 4",
          "description": "Pendiente."
        }
      ],
      "roles": [
        {
          "role": "Área",
          "task": "Caso de uso",
          "detail": "Pendiente."
        }
      ],
      "mistakes": [
        {
          "bad": "Error frecuente pendiente.",
          "good": "Práctica correcta pendiente."
        }
      ],
      "mockTitle": "Deep Research",
      "mockPrompt": "Prompt de ejemplo pendiente.",
      "mockReply": "Respuesta de ejemplo pendiente.",
      "mockPanelTitle": "Panel",
      "mockPanel": "Pendiente",
      "status": "borrador"
    },
    {
      "slug": "agent",
      "name": "Agent Mode",
      "shortName": "Agent Mode",
      "abbr": "AG",
      "color": "#B0396B",
      "level": "Avanzado",
      "summary": "El asistente ejecuta tareas de varios pasos en el navegador y entrega el resultado.",
      "intro": "Formularios, comparaciones y trámites web que hoy se hacen a mano.",
      "meta": "por definir",
      "outcomes": [
        "Objetivo 1 del módulo",
        "Objetivo 2 del módulo",
        "Objetivo 3 del módulo"
      ],
      "prompts": [
        {
          "tag": "Por definir",
          "text": "Prompt pendiente de redactar."
        }
      ],
      "baIntro": "Caso de la sesión: pendiente.",
      "before": "Situación actual: pendiente.",
      "beforeTime": "-",
      "after": "Con la herramienta: pendiente.",
      "afterTime": "-",
      "steps": [
        {
          "title": "Paso 1",
          "description": "Pendiente."
        },
        {
          "title": "Paso 2",
          "description": "Pendiente."
        },
        {
          "title": "Paso 3",
          "description": "Pendiente."
        },
        {
          "title": "Paso 4",
          "description": "Pendiente."
        }
      ],
      "roles": [
        {
          "role": "Área",
          "task": "Caso de uso",
          "detail": "Pendiente."
        }
      ],
      "mistakes": [
        {
          "bad": "Error frecuente pendiente.",
          "good": "Práctica correcta pendiente."
        }
      ],
      "mockTitle": "Agent Mode",
      "mockPrompt": "Prompt de ejemplo pendiente.",
      "mockReply": "Respuesta de ejemplo pendiente.",
      "mockPanelTitle": "Panel",
      "mockPanel": "Pendiente",
      "status": "borrador"
    },
    {
      "slug": "codex",
      "name": "Codex",
      "shortName": "Codex",
      "abbr": "CX",
      "color": "#3E7A8C",
      "level": "Avanzado",
      "summary": "Automatización de tareas de archivos, datos y desarrollo desde el entorno de trabajo.",
      "intro": "Consolidar, limpiar y generar reportes repetibles sin hacerlo a mano cada mes.",
      "meta": "por definir",
      "outcomes": [
        "Objetivo 1 del módulo",
        "Objetivo 2 del módulo",
        "Objetivo 3 del módulo"
      ],
      "prompts": [
        {
          "tag": "Por definir",
          "text": "Prompt pendiente de redactar."
        }
      ],
      "baIntro": "Caso de la sesión: pendiente.",
      "before": "Situación actual: pendiente.",
      "beforeTime": "-",
      "after": "Con la herramienta: pendiente.",
      "afterTime": "-",
      "steps": [
        {
          "title": "Paso 1",
          "description": "Pendiente."
        },
        {
          "title": "Paso 2",
          "description": "Pendiente."
        },
        {
          "title": "Paso 3",
          "description": "Pendiente."
        },
        {
          "title": "Paso 4",
          "description": "Pendiente."
        }
      ],
      "roles": [
        {
          "role": "Área",
          "task": "Caso de uso",
          "detail": "Pendiente."
        }
      ],
      "mistakes": [
        {
          "bad": "Error frecuente pendiente.",
          "good": "Práctica correcta pendiente."
        }
      ],
      "mockTitle": "Codex",
      "mockPrompt": "Prompt de ejemplo pendiente.",
      "mockReply": "Respuesta de ejemplo pendiente.",
      "mockPanelTitle": "Panel",
      "mockPanel": "Pendiente",
      "status": "borrador"
    },
    {
      "slug": "images",
      "name": "Imágenes",
      "shortName": "Images",
      "abbr": "IG",
      "color": "#2B6FE3",
      "level": "Básico",
      "summary": "Generación y edición de imágenes para piezas internas y material de apoyo.",
      "intro": "Fondos, íconos y mockups sin depender de un banco de fotos.",
      "meta": "por definir",
      "outcomes": [
        "Objetivo 1 del módulo",
        "Objetivo 2 del módulo",
        "Objetivo 3 del módulo"
      ],
      "prompts": [
        {
          "tag": "Por definir",
          "text": "Prompt pendiente de redactar."
        }
      ],
      "baIntro": "Caso de la sesión: pendiente.",
      "before": "Situación actual: pendiente.",
      "beforeTime": "-",
      "after": "Con la herramienta: pendiente.",
      "afterTime": "-",
      "steps": [
        {
          "title": "Paso 1",
          "description": "Pendiente."
        },
        {
          "title": "Paso 2",
          "description": "Pendiente."
        },
        {
          "title": "Paso 3",
          "description": "Pendiente."
        },
        {
          "title": "Paso 4",
          "description": "Pendiente."
        }
      ],
      "roles": [
        {
          "role": "Área",
          "task": "Caso de uso",
          "detail": "Pendiente."
        }
      ],
      "mistakes": [
        {
          "bad": "Error frecuente pendiente.",
          "good": "Práctica correcta pendiente."
        }
      ],
      "mockTitle": "Imágenes",
      "mockPrompt": "Prompt de ejemplo pendiente.",
      "mockReply": "Respuesta de ejemplo pendiente.",
      "mockPanelTitle": "Panel",
      "mockPanel": "Pendiente",
      "status": "borrador"
    },
    {
      "slug": "sora",
      "name": "Video con Sora",
      "shortName": "Sora",
      "abbr": "SR",
      "color": "#8A5CD1",
      "level": "Avanzado",
      "summary": "Video corto para capacitación, redes o demostración de una idea.",
      "intro": "Piezas de pocos segundos a partir de un guion propio.",
      "meta": "por definir",
      "outcomes": [
        "Objetivo 1 del módulo",
        "Objetivo 2 del módulo",
        "Objetivo 3 del módulo"
      ],
      "prompts": [
        {
          "tag": "Por definir",
          "text": "Prompt pendiente de redactar."
        }
      ],
      "baIntro": "Caso de la sesión: pendiente.",
      "before": "Situación actual: pendiente.",
      "beforeTime": "-",
      "after": "Con la herramienta: pendiente.",
      "afterTime": "-",
      "steps": [
        {
          "title": "Paso 1",
          "description": "Pendiente."
        },
        {
          "title": "Paso 2",
          "description": "Pendiente."
        },
        {
          "title": "Paso 3",
          "description": "Pendiente."
        },
        {
          "title": "Paso 4",
          "description": "Pendiente."
        }
      ],
      "roles": [
        {
          "role": "Área",
          "task": "Caso de uso",
          "detail": "Pendiente."
        }
      ],
      "mistakes": [
        {
          "bad": "Error frecuente pendiente.",
          "good": "Práctica correcta pendiente."
        }
      ],
      "mockTitle": "Video con Sora",
      "mockPrompt": "Prompt de ejemplo pendiente.",
      "mockReply": "Respuesta de ejemplo pendiente.",
      "mockPanelTitle": "Panel",
      "mockPanel": "Pendiente",
      "status": "borrador"
    }
  ]
};
