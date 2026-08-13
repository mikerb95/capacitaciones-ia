# Academia IA

Portal de capacitaciones corporativas sobre IA. Compara los módulos de Microsoft Copilot,
Claude, Gemini y ChatGPT, con un portal por herramienta y la ficha completa de cada módulo.

Stack: Next.js (App Router) + TypeScript + Tailwind CSS v4, Turso (libSQL) con Drizzle ORM,
pensado para desplegar en Vercel.

## Arranque

```bash
npm install
cp .env.example .env.local     # por defecto usa un archivo SQLite local
npm run db:push                # crea las tablas
npm run db:seed                # carga el contenido
npm run dev
```

Con eso queda en http://localhost:3000 sin necesidad de credenciales de Turso.

## Conectar Turso

```bash
turso db create capacitaciones-ia
turso db show capacitaciones-ia --url      # va en TURSO_DATABASE_URL
turso db tokens create capacitaciones-ia   # va en TURSO_AUTH_TOKEN
```

Con esas dos variables en `.env.local`, `npm run db:push` y `npm run db:seed` apuntan a Turso.
La configuración de Drizzle detecta sola si la URL es un archivo local o una base remota.

En Vercel hay que registrar `TURSO_DATABASE_URL` y `TURSO_AUTH_TOKEN` como variables de entorno
del proyecto, y correr el seed una vez contra la base de producción.

## Rutas

| Ruta | Qué es |
| --- | --- |
| `/` | Comparativa: una columna por herramienta, tabs en móvil, filtro por nivel |
| `/[plataforma]` | Portal de una IA: hero, módulos, diferenciales, prácticas, FAQs |
| `/[plataforma]/[modulo]` | Ficha del módulo: prompts, antes y después, paso a paso, casos por área |
| `/admin` | Listado editable de todos los módulos, con reordenamiento |
| `/admin/modules/[id]` | Formulario del módulo (`new` para crear uno) |
| `/admin/presentaciones` | Importar presentaciones y lanzarlas |
| `/presentar/[slug]` | Vista de expositor, con control de la sesión en vivo |
| `/vivo` | Vista de audiencia: se entra con el PIN |

El admin no tiene autenticación. Si el sitio se publica, conviene protegerlo con Vercel
Authentication o con un middleware antes de compartir la URL.

## Actualizar contenido

Hay dos caminos y conviven sin pisarse:

1. **Desde el seed** (recomendado para cambios grandes y para dejar el contenido versionado):
   se edita el archivo de la plataforma en `src/db/seed/` y se corre `npm run db:seed`.
   El seed hace upsert por `platformId + slug`, así que se puede correr las veces que haga falta
   sin duplicar nada. Ojo: reemplaza las listas del módulo, así que sobrescribe lo que se haya
   editado desde el admin.

2. **Desde `/admin`** (para ajustes puntuales en vivo, antes o durante una sesión): los cambios
   se aplican de una. Si algo se quiere conservar, hay que llevarlo también al seed.

En el formulario, las listas se escriben con un ítem por línea y los campos separados por `|`:

```
Consulta | ¿Qué dicen estas fuentes sobre [tema]? Cítame el documento.
Contraste | Compara el manual viejo con el nuevo y dime qué cambió.
```

## Presentaciones

Las láminas se diseñan aparte (en Claude Design, por ejemplo) y se importan como HTML desde
`/admin/presentaciones`, pegando el contenido o subiendo el archivo. El diseño se conserva
íntegro: los `<style>` del documento se guardan como estilos del mazo.

La única convención es que **cada lámina va dentro de una `<section>` de primer nivel**:

```html
<style> /* tu diseño */ </style>

<section>
  <span class="kicker">Bienvenida</span>
  <h2>Copilot en el trabajo del día a día</h2>
  <div class="notes">Presentarse. Cinco minutos.</div>
</section>

<section>
  <h2>Dónde se nos va el tiempo hoy</h2>
</section>
```

El importador toma el título de cada lámina del primer encabezado, y lo que esté marcado con
`.notes` o `data-notes` queda como nota del expositor (visible solo para ti, con la tecla N).

Cada lámina se pinta dentro de un iframe sin permisos de ejecución, dibujada siempre a 1280x720
y escalada al contenedor. Así se ve idéntica en el proyector, en el portátil y en el celular, y
un script que venga en el HTML importado nunca corre.

### Sesión en vivo

1. Abres `/presentar/[slug]` y le das a **Transmitir en vivo**. Sale un PIN de cuatro dígitos.
2. Los asistentes entran a `/vivo`, escriben el PIN y su nombre, y quedan registrados.
3. Cada vez que avanzas, sus pantallas siguen la tuya (revisan el estado cada dos segundos).
4. Quien quiera adelantarse puede navegar por su cuenta y volver a seguirte con un botón.

Solo hay una sesión viva por presentación: al abrir una nueva se cierra la anterior.

Atajos del expositor: flechas o barra espaciadora para avanzar, `F` pantalla completa, `N` notas.

## Estructura

```
src/
├── app/
│   ├── page.tsx                    comparativa
│   ├── [platform]/page.tsx         portal de una IA
│   ├── [platform]/[slug]/page.tsx  ficha del módulo
│   ├── admin/                      módulos, presentaciones y server actions
│   ├── presentar/[slug]/           vista de expositor
│   └── vivo/                       vista de audiencia
├── components/                     UI compartida
└── db/
    ├── schema.ts                   17 tablas normalizadas
    ├── queries.ts                  consultas de lectura
    ├── index.ts                    cliente libSQL
    └── seed/                       contenido por plataforma
mockups/                            los .dc.html originales, como referencia
```

## Modelo de datos

Normalizado, sin JSON. `platforms` y `modules` son las tablas principales; el resto son listas
hijas con `sort_order` y borrado en cascada.

- **Plataforma:** `platforms` con `platform_stats`, `platform_specials`, `platform_downloads`,
  `platform_practices`, `platform_faqs`, `platform_links`.
- **Módulo:** `modules` (incluye el bloque antes/después y el ejemplo de conversación, que son
  1:1) con `module_outcomes`, `module_prompts`, `module_steps`, `module_roles`, `module_mistakes`.
- **Presentaciones:** `decks` con `deck_slides`, más `live_sessions` y `attendees` para el modo
  en vivo.

## Estado del contenido

| Plataforma | Módulos | Prompts | Estado |
| --- | --- | --- | --- |
| Microsoft Copilot | 6 | 31 | Completo |
| Claude | 9 | 41 | Completo |
| Gemini | 8 | 40 | Completo |
| ChatGPT | 8 | 8 | En redacción |

Copilot y Claude vienen del contenido que ya existía en los mockups. Gemini se redactó completo
en el mismo formato. ChatGPT conserva la estructura y los títulos definitivos, con el detalle
pendiente.

## Comandos

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run db:generate` | Genera migraciones a partir del esquema |
| `npm run db:migrate` | Aplica las migraciones |
| `npm run db:push` | Sincroniza el esquema directo (desarrollo) |
| `npm run db:studio` | Explorador visual de la base |
| `npm run db:seed` | Carga o actualiza el contenido |
