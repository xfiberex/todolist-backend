import nodemailer from "nodemailer";

// Utilidades comunes
const APP_NAME = process.env.APP_NAME || "RAJB - ToDoList";
// Normaliza FRONTEND_URL para asegurar esquema (http/https) y que sea absoluto
const ensureAbsolute = base => {
    if (!base) return null;
    const trimmed = String(base).trim();
    if (/^https?:\/\//i.test(trimmed)) return trimmed.replace(/\/+$/, "");
    const isLocal = /^(localhost|127\.0\.0\.1|0\.0\.0\.0)(:|$)/i.test(trimmed);
    const scheme = isLocal ? "http://" : "https://";
    return (scheme + trimmed).replace(/\/+$/, "");
};
const FRONTEND_URL = ensureAbsolute(
    process.env.FRONTEND_URL ||
        (process.env.NODE_ENV !== "production" ? "http://localhost:5173" : "")
);
const joinUrl = (base, path) => {
    const p = String(path || "").replace(/^\/+/, "");
    if (!base) return `/${p}`; // Fallback relativo (no ideal, pero evita romper)
    try {
        const url = new URL(p, base + "/");
        return url.toString().replace(/\/$/, "");
    } catch (_) {
        return `${base}/${p}`.replace(/\/+$/, "");
    }
};
const FROM_EMAIL = process.env.EMAIL_FROM || '"RAJB-ToDoList" <no-reply@todolist.com>';

const getTransport = () => {
    const port = Number(process.env.EMAIL_PORT) || 587;
    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port,
        secure: port === 465, // SSL si es puerto 465
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
};

// Construye un botón compatible (tabla) para mejor soporte en clientes como Outlook
const renderButton = (url, label) => `
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin:24px auto 0 auto;">
            <tr>
                <td bgcolor="#2563eb" style="border-radius:6px;">
                    <a href="${url}" target="_blank" rel="noopener" 
                         style="display:inline-block;padding:12px 20px;font-family:Segoe UI, Arial, sans-serif;font-size:16px;color:#ffffff;text-decoration:none;">
                        ${label}
                    </a>
                </td>
            </tr>
        </table>
`;

// Plantilla base de email con estilos en línea, preheader, y estructura de tablas de 600px
const buildTemplate = ({
    previewText = "",
    heading = "",
    greeting = "",
    bodyHtml = "",
    ctaUrl,
    ctaLabel,
    footerHtml = "",
}) => {
    const button = ctaUrl && ctaLabel ? renderButton(ctaUrl, ctaLabel) : "";
    const safePreview = (previewText || "").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return `
<!doctype html>
<html lang="es">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="x-apple-disable-message-reformatting" />
        <title>${APP_NAME}</title>
        <!-- Preheader oculto -->
        <style>
            /* Evita que clientes como Gmail recorten el borde del contenedor */
            img { border: 0; line-height: 100%; text-decoration: none; }
            table { border-collapse: collapse; }
        </style>
    </head>
    <body style="margin:0; padding:0; background-color:#f3f4f6;">
        <span style="display:none!important;visibility:hidden;opacity:0;color:transparent;height:0;width:0;overflow:hidden;">${safePreview}</span>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f3f4f6;">
            <tr>
                <td align="center" style="padding:24px 12px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;background:#ffffff;border-radius:10px;box-shadow:0 1px 2px rgba(0,0,0,0.04);">
                        <tr>
                            <td style="padding:24px 24px 0 24px;text-align:center;">
                                <div style="font-family:Segoe UI, Arial, sans-serif;font-size:20px;font-weight:700;color:#111827;">${APP_NAME}</div>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:8px 24px 0 24px;text-align:center;">
                                <h1 style="margin:0;font-family:Segoe UI, Arial, sans-serif;font-size:22px;line-height:1.3;color:#111827;">${heading}</h1>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:16px 24px 0 24px;">
                                <p style="margin:0;font-family:Segoe UI, Arial, sans-serif;font-size:16px;line-height:1.6;color:#374151;">${greeting}</p>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:12px 24px 0 24px;">
                                <div style="font-family:Segoe UI, Arial, sans-serif;font-size:16px;line-height:1.6;color:#374151;">${bodyHtml}</div>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:0 24px 8px 24px; text-align:center;">
                                ${button}
                            </td>
                        </tr>
                        ${
                            ctaUrl
                                ? `
                        <tr>
                            <td style="padding:4px 24px 0 24px;">
                                <p style="margin:0;font-family:Segoe UI, Arial, sans-serif;font-size:13px;line-height:1.5;color:#6b7280;">Si el botón no funciona, copia y pega este enlace en tu navegador:</p>
                                <p style="word-break:break-all;margin:6px 0 0 0;font-family:Segoe UI, Arial, sans-serif;font-size:13px;color:#2563eb;">
                                    <a href="${ctaUrl}" target="_blank" rel="noopener" style="color:#2563eb;">${ctaUrl}</a>
                                </p>
                            </td>
                        </tr>`
                                : ""
                        }
                        <tr>
                            <td style="padding:24px;">
                                <hr style="border:0;border-top:1px solid #e5e7eb;margin:0 0 12px 0;" />
                                <div style="font-family:Segoe UI, Arial, sans-serif;font-size:12px;line-height:1.6;color:#6b7280;">
                                    ${footerHtml}
                                </div>
                            </td>
                        </tr>
                    </table>
                    <div style="max-width:600px;margin:12px auto 0 auto;text-align:center;font-family:Segoe UI, Arial, sans-serif;font-size:12px;color:#9ca3af;">
                        © ${new Date().getFullYear()} ${APP_NAME}. Todos los derechos reservados.
                    </div>
                </td>
            </tr>
        </table>
    </body>
</html>
        `;
};

export const emailRegistro = async datos => {
    const { email, nombre, token } = datos;
    const transport = getTransport();

    const url = joinUrl(FRONTEND_URL, `/confirmar/${encodeURIComponent(token)}`);
    const subject = `${APP_NAME} - Confirma tu cuenta`;
    const previewText = `Confirma tu cuenta en ${APP_NAME}`;
    const html = buildTemplate({
        previewText,
        heading: "Confirma tu cuenta",
        greeting: `Hola <strong>${nombre}</strong>, gracias por registrarte en nuestro<strong> Gestor de Tareas</strong>.`,
        bodyHtml: `Solo falta un paso para empezar a usar tu cuenta. Haz clic en el siguiente botón para confirmar tu correo.`,
        ctaUrl: url,
        ctaLabel: "Confirmar cuenta",
        footerHtml: `Si no creaste esta cuenta, puedes ignorar este mensaje. Este es un correo automático, por favor no respondas.`,
    });

    const text = `Hola ${nombre},\n\nGracias por registrarte en ${APP_NAME}.\n\nPara confirmar tu cuenta, visita: ${url}\n\nSi no creaste esta cuenta, ignora este mensaje.`;

    try {
        const info = await transport.sendMail({
            from: FROM_EMAIL,
            to: email,
            subject,
            text,
            html,
        });
        console.log("Mensaje enviado: %s", info.messageId);
    } catch (err) {
        console.error("Error enviando correo de registro:", err?.message || err);
        throw err;
    }
};

export const emailOlvidePassword = async datos => {
    const { email, nombre, token } = datos;
    const transport = getTransport();

    const url = joinUrl(FRONTEND_URL, `/olvide-password/${encodeURIComponent(token)}`);
    const subject = `${APP_NAME} - Restablece tu contraseña`;
    const previewText = `Solicitud para restablecer tu contraseña`;
    const html = buildTemplate({
        previewText,
        heading: "Restablece tu contraseña",
        greeting: `Hola <strong>${nombre}</strong>, recibimos una solicitud para restablecer tu contraseña.`,
        bodyHtml: `Por tu seguridad, este enlace caduca en poco tiempo. Haz clic en el botón para crear una nueva contraseña.`,
        ctaUrl: url,
        ctaLabel: "Crear nueva contraseña",
        footerHtml: `Si no fuiste tú quien solicitó este cambio, puedes ignorar este mensaje. Este es un correo automático, por favor no respondas.`,
    });

    const text = `Hola ${nombre},\n\nRecibimos una solicitud para restablecer tu contraseña en ${APP_NAME}.\n\nPara continuar, visita: ${url}\n\nSi no solicitaste este cambio, ignora este mensaje.`;

    try {
        const info = await transport.sendMail({
            from: FROM_EMAIL,
            to: email,
            subject,
            text,
            html,
        });
        console.log("Mensaje enviado: %s", info.messageId);
    } catch (err) {
        console.error("Error enviando correo de restablecimiento:", err?.message || err);
        throw err;
    }
};
