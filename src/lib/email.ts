/**
 * Correo transaccional con Resend, la misma cuenta y el mismo dominio
 * verificado del portfolio. Se llama a la API con `fetch`, sin SDK.
 *
 * Aquí solo se envían correos para iniciar sesión: el enlace de ingreso y el de
 * recuperar la contraseña. Nada de campañas ni anuncios; es la promesa que se
 * hace en el registro.
 *
 * Sin `RESEND_API_KEY` no se envía nada y el flujo sigue igual. En desarrollo
 * el enlace sale por consola, para probar sin buzón.
 */

export type MailResult = { ok: boolean; skipped?: boolean; error?: string };

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/**
 * Dirección pública del sitio, para armar los enlaces. Sale del entorno y no
 * del `Host` de la petición: un encabezado falso no puede mandar el enlace de
 * otra persona a un dominio ajeno.
 */
export function siteUrl() {
  const explicit = process.env.SITE_URL;
  if (explicit) return explicit.replace(/\/$/, '');
  if (process.env.VERCEL_ENV === 'production' && process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'http://localhost:3000';
}

async function sendMail(params: { to: string; subject: string; html: string; text: string }): Promise<MailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    if (process.env.NODE_ENV !== 'production') {
      console.info(`[correo sin enviar] ${params.to} · ${params.subject}\n${params.text}`);
    }
    return { ok: false, skipped: true };
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM ?? 'Academia IA <academia@codebymike.net>',
        to: [params.to],
        subject: params.subject,
        html: params.html,
        text: params.text,
      }),
    });
    if (!res.ok) {
      const error = `Resend ${res.status}: ${await res.text().catch(() => '')}`;
      console.error(error);
      return { ok: false, error };
    }
    return { ok: true };
  } catch (e) {
    const error = e instanceof Error ? e.message : 'error';
    console.error(`Resend: ${error}`);
    return { ok: false, error };
  }
}

/* ------------------------------------------------------------------ plantilla */

// Tablas y estilos en línea: Outlook todavía dibuja con el motor de Word. Fondo
// claro aunque el sitio tenga modo oscuro, porque un correo oscuro se rompe en
// la mitad de los clientes.
const PRIMARY = '#3b5bdb';

const PRIVACY =
  'Este correo es solo para iniciar sesión. No usamos tu dirección para campañas ni anuncios, y no la compartimos con terceros.';

type Button = { label: string; url: string };

function renderEmail({
  preheader,
  heading,
  blocks,
  button,
  footNote,
}: {
  preheader: string;
  heading: string;
  blocks: string[];
  button: Button;
  footNote: string;
}) {
  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(heading)}</title>
</head>
<body style="margin:0;padding:0;background:#f4f6fc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6fc;padding:32px 16px;">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:14px;border:1px solid #e1e5f2;">
<tr><td style="padding:24px 32px 0;">
<span style="display:inline-block;width:8px;height:8px;border-radius:4px;background:${PRIMARY};"></span>
<span style="color:#1a1f36;font-size:14px;font-weight:600;padding-left:6px;">Academia IA</span>
<span style="color:#8a90a8;font-size:12px;padding-left:6px;">Aula Virtual</span>
</td></tr>
<tr><td style="padding:22px 32px 32px;">
<h1 style="margin:0 0 16px;font-size:21px;line-height:1.3;color:#1a1f36;font-weight:600;">${escapeHtml(heading)}</h1>
${blocks.map((b) => `<p style="margin:0 0 14px;font-size:15px;line-height:1.6;color:#3f4560;">${b}</p>`).join('\n')}
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0 8px;"><tr><td style="border-radius:10px;background:${PRIMARY};">
<a href="${escapeHtml(button.url)}" style="display:inline-block;padding:12px 24px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:10px;">${escapeHtml(button.label)}</a>
</td></tr></table>
<p style="margin:14px 0 0;font-size:12px;line-height:1.5;color:#8a90a8;">Si el botón no funciona, copia este enlace:<br><span style="color:${PRIMARY};word-break:break-all;">${escapeHtml(button.url)}</span></p>
<p style="margin:22px 0 0;padding-top:18px;border-top:1px solid #eceef5;font-size:12px;line-height:1.5;color:#8a90a8;">${footNote}</p>
</td></tr>
</table>
<p style="max-width:520px;margin:18px auto 0;font-size:11px;line-height:1.5;color:#9a9fb4;text-align:center;">${PRIVACY}</p>
</td></tr>
</table>
</body>
</html>`;
}

/** Texto plano del mismo correo. Sin él, los filtros de spam desconfían. */
const renderText = (heading: string, lines: string[], button: Button) =>
  [heading, '', ...lines, '', `${button.label}: ${button.url}`, '', '-', PRIVACY].join('\n');

/* ------------------------------------------------------------------- correos */

/**
 * Enlace para entrar. Sirve para las dos cosas: confirmar el correo al crear la
 * cuenta y entrar sin contraseña.
 */
export function sendSignInEmail(params: {
  to: string;
  url: string;
  expiresMinutes: number;
  signup: boolean;
}) {
  const heading = params.signup ? 'Confirma tu correo' : 'Tu enlace para entrar';
  const lines = params.signup
    ? ['Recibimos una solicitud para crear tu cuenta en el Aula Virtual. Para terminar, confirma que este correo es tuyo.']
    : ['Usa este enlace para entrar al Aula Virtual sin contraseña.'];
  const button = { label: params.signup ? 'Confirmar y entrar' : 'Entrar al Aula Virtual', url: params.url };
  const note = `El enlace vence en ${params.expiresMinutes} minutos y sirve una sola vez. Si no lo pediste, ignora este correo: nadie puede entrar sin abrirlo.`;

  return sendMail({
    to: params.to,
    subject: params.signup ? 'Confirma tu correo · Aula Virtual' : 'Tu enlace para entrar · Aula Virtual',
    html: renderEmail({ preheader: lines[0], heading, blocks: lines, button, footNote: note }),
    text: renderText(heading, [...lines, note], button),
  });
}

export function sendResetEmail(params: { to: string; url: string; expiresMinutes: number }) {
  const heading = 'Elige una contraseña nueva';
  const lines = ['Recibimos una solicitud para cambiar la contraseña de tu cuenta del Aula Virtual.'];
  const button = { label: 'Elegir contraseña nueva', url: params.url };
  const note = `El enlace vence en ${params.expiresMinutes} minutos y sirve una sola vez. Si no fuiste tú, ignora este correo: tu contraseña actual sigue funcionando.`;

  return sendMail({
    to: params.to,
    subject: 'Cambia tu contraseña · Aula Virtual',
    html: renderEmail({ preheader: lines[0], heading, blocks: lines, button, footNote: note }),
    text: renderText(heading, [...lines, note], button),
  });
}
