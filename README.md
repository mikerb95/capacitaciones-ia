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
| `/preguntas` | Buzón del asistente: deja su duda, con nombre o en anónimo, y ve las del grupo |
| `/entrenador` | Entrenador de prompts: los módulos que tienen casos con qué practicar |
| `/entrenador/[plataforma]/[modulo]` | El ejercicio: se escribe el prompt a ciegas y después llega la revisión |

El portal se cierra en `src/proxy.ts`. Cada sección entra por su lado: `/admin` con el login de
`ADMIN_USER` y `ADMIN_PASS` (cookie firmada, formulario en `/admin/login`), `/empresa` con la
clave de la empresa, `/vivo` y `/presentar` con el PIN de la sesión en vivo, y el resto del sitio
con el código de `/ingresar`.

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

## Planes de facturación

Cada portal arranca con un selector de plan: Free, Go, Plus, Pro, Business y Enterprise en
ChatGPT; Free, Pro, Max, Team y Enterprise en Claude; gratis, AI Plus, AI Pro, AI Ultra y
Workspace en Gemini; Copilot Chat, Copilot Business, Microsoft 365 Copilot y créditos de agente
en Copilot. Al elegir uno, el listado de módulos se recorta a lo que ese plan habilita, la tabla
de modelos muestra a cuál se llega y lo que queda fuera se despliega aparte, con el plan mínimo
que haría falta.

El plan viaja en la URL (`/claude?plan=pro`), así que la ficha de cada módulo se abre con el
mismo recorte y el enlace se puede mandar al cliente ya filtrado.

Al crear el código se elige el **plan contratado** por la empresa en cada plataforma (paso 3 del
formulario, tabla `access_code_plans`). Con eso el portal abre ya filtrado por lo que esa empresa
paga, sin que nadie tenga que acordarse. Es una preselección, no un recorte: el selector sigue
ahí, que es lo que sirve para mostrar en la sesión qué se gana subiendo de plan. Si además hay un
`?plan=` en la URL, ese manda, así el enlace que se comparte se ve igual para todos.

En el paso de alcance, los módulos que el plan contratado no cubre salen tachados con el plan
mínimo que necesitarían, y si quedó alguno marcado sale un aviso con un botón para quitarlos.

Todo eso vive en **`src/db/seed/plans.ts`**, separado del contenido editorial porque se revisa
con otra frecuencia: los precios y los límites cambian cada pocos meses, los módulos no. Cada
plataforma declara ahí sus `plans` (con `tier`, que es lo que ordena el "desde tal plan"), sus
`models` y, por slug de módulo, en qué planes entra:

```ts
modules: {
  deep: [
    { plan: 'free', availability: 'no' },
    { plan: 'plus', availability: 'incluido', note: 'Cupo mensual de informes.' },
  ],
}
```

`availability` es `incluido`, `limitado` (se puede, pero hay que avisar el recorte en la sesión)
o `no`. Un módulo sin filas se considera disponible en todos los planes, así que el contenido
que todavía no se revisó no desaparece del portal.

El `note` de cada plataforma lleva la fecha de revisión y la fuente, y se muestra al pie del
bloque de planes. Al correr `npm run db:seed`, el seeder avisa si `plans.ts` apunta a un módulo
que ya no existe o a un plan mal escrito.

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
2. Los asistentes entran a `/vivo`, escriben el PIN y su nombre, y quedan registrados. Es el
   único lugar donde se pide el nombre, porque es una lista de asistencia: al material se entra
   solo con el código. Queda guardado en la sesión, así que no se vuelve a preguntar. El PIN va
   en una cookie, no en la URL, así que el nombre no viaja en el enlace y solo ve las láminas
   quien pasó por ahí.
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
    ├── schema.ts                   29 tablas normalizadas
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
- **Facturación:** `platform_plans` (los planes, con `tier`) y `platform_models`, unidas por
  `platform_model_plans`; `module_plans` dice en qué plan entra cada módulo. Las tres puente
  guardan `availability` y una nota con el límite concreto.
- **Presentaciones:** `decks` con `deck_slides`, más `live_sessions` y `attendees` para el modo
  en vivo.
- **Empresas y accesos:** `companies` (con `kind`, `panel_key` y los datos del contrato) y
  `access_codes`, unidas por dos columnas distintas. Ver abajo.
- **Preguntas:** `questions` cuelga del código de acceso, no de la persona: lo que sirve para la
  siguiente sesión es la duda del grupo. Ver abajo.

## Trabajo directo y trabajo tercerizado

Una capacitación puede llegar de tres maneras, y el paso 2 del formulario del código es donde se
elige cuál:

| Cómo llegó | `contracted` | `company_id` | `contractor_id` |
| --- | --- | --- | --- |
| Es mía | `false` | vacío | vacío |
| Me contrató la empresa | `true` | la empresa | vacío |
| Me contrató una capacitadora | `true` | la empresa destinataria | la capacitadora |

Las dos columnas de `access_codes` responden preguntas distintas y por eso no son una sola.
`company_id` es **de quién es la gente que asiste**: manda en el material a medida, en el logo
que sale impreso y en el plan contratado. `contractor_id` es **quién puso el contrato**, que solo
existe cuando hay un intermediario de por medio.

En el panel de `/empresa` la capacitación aparece para las dos: la capacitadora la necesita para
reportarle a su cliente lo que se dictó, y la destinataria para ver el avance de su gente. Cada
una la ve etiquetada desde su lado (`para X` o `contratada por Y`).

`companies.kind` (`cliente`, `capacitadora` o `ambas`) es lo que recorta los dos selectores del
formulario: en el de la capacitadora solo salen las intermediarias, y en el de quien recibe solo
las que capacitan a su propia gente. Todo lo cargado antes de esta división quedó como `cliente`
con `contractor_id` vacío, que es exactamente lo que era: trabajo contratado directo.

## Preguntas de la capacitación

El asistente deja su duda en `/preguntas`. El nombre es opcional, y el check de anónimo lo tapa
del todo: marcada así, la fila no guarda ni `name` ni `participant_id`, así que nadie puede
deshacerlo después, ni desde el admin ni desde la base.

La pregunta cuelga del código de acceso, no del participante, y por eso sobrevive a la sesión:
queda como registro de la capacitación de esa empresa y como material para preparar la siguiente.
Se responde desde `/admin/accesos/[id]`, y la respuesta la ven quien preguntó (en `/preguntas`) y
la empresa en su panel. Vaciar el campo de la respuesta devuelve la pregunta a pendiente.

## Entrenador de prompts

Leer prompts buenos no enseña a escribirlos. En `/entrenador` se hace al revés que en la ficha:
primero sale un caso real (uno por cada fila de `module_roles`, que es lo único del contenido
escrito desde el lado de quien tiene el problema), el asistente escribe su prompt **a ciegas**, y
solo al enviarlo aparecen la revisión, los prompts modelo y los errores típicos del módulo.

Ese orden es la única regla del ejercicio. Ver la rúbrica antes de escribir lo convierte en un
dictado. Por eso el textarea se bloquea al enviar: no hay segunda oportunidad, como en la vida
real. Un módulo sin casos por área no tiene entrenador y no aparece en la lista.

**Nada se guarda.** Ni el intento, ni la calificación, ni que alguien entrenó. Se pierde al cerrar
la página. Es lo mismo que se decidió con las preguntas anónimas y por la misma razón: es lo que
hace que la gente se atreva a pegar el prompt malo de verdad.

### Quién califica

La calificación tiene que ser gratis y no se puede caer, así que hay una fila de evaluadores en
`src/lib/evaluador.ts` y se pregunta en orden hasta que uno responda:

1. **Gemini** (capa gratuita: 10 peticiones por minuto, 250.000 tokens).
2. **Groq** (capa gratuita: 30 peticiones por minuto, 6.000 tokens).
3. **La autocalificación**, que no es un proveedor: el portal arma un bloque con la rúbrica del
   módulo y el intento, y el asistente lo pega en la herramienta que acaba de aprender a usar.

Los topes de las capas gratuitas son **por llave, no por persona**: todas las empresas comparten
la misma. Por eso importa el tercer escalón, que es el que hace que el entrenador funcione con
las dos llaves agotadas, vencidas o sin configurar. Y no es un premio de consolación: obliga a
usar la herramienta, que era el punto de la capacitación.

Cada proveedor se salta solo si no tiene su llave, así que el portal arranca sin ninguna y va
ganando escalones a medida que se agregan. Cualquier falla (sin cupo, llave vencida, modelo
jubilado, proveedor caído) es lo mismo desde el código: se pasa al siguiente.

La rúbrica son seis criterios fijos (`CRITERIOS` en `src/lib/entrenador.ts`), iguales para todas
las plataformas porque lo que distingue un prompt bueno de uno malo no cambia entre herramientas.
Lo que sí cambia por módulo son los errores típicos que van en las instrucciones del evaluador:
eso es lo que hace que la crítica hable el idioma de esta capacitación y no el de un corrector
genérico de internet.

## Estado del contenido

| Plataforma | Módulos | Prompts | Estado |
| --- | --- | --- | --- |
| <img src="public/logos/copilot.png" width="16" height="16" alt=""> Microsoft 365 Copilot | 9 | 51 | Completo |
| <img src="public/logos/claude.png" width="16" height="16" alt=""> Claude | 9 | 41 | Completo |
| <img src="public/logos/gemini.png" width="16" height="16" alt=""> Gemini | 8 | 40 | Completo |
| <img src="public/logos/chatgpt.png" width="16" height="16" alt=""> ChatGPT | 8 | 40 | Completo |

Copilot y Claude vienen del contenido que ya existía en los mockups. Gemini y ChatGPT se
redactaron completos en el mismo formato.

El contenido de ChatGPT se verificó contra la documentación de OpenAI en agosto de 2026, y por
eso dos módulos se apartan del esquema original: Canvas salió de GPT-5.5 y el módulo pasó a ser
sobre los bloques de escritura y de código dentro del chat, y el módulo de Sora se reemplazó por
uno de conocimiento de la empresa, porque Sora se descontinuó en abril de 2026.

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
| `npm run db:seed:master` | Deja listo el código maestro de pruebas y su participante |
| `npm run db:seed:demo` | Deja listo el código de demo pública y su participante |
| `npm run logos` | Exporta los logos de marca a `public/logos/` como SVG y PNG |
| `npm run materiales` | Genera el material descargable genérico (necesita el servidor levantado) |
| `npm run materiales:empresa <slug>` | Lo mismo, pero a medida de un cliente de `clientes/<slug>.json` |
| `npm run materiales:subir <slug>` | Sube ese material a Vercel Blob |
