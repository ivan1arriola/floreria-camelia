const {
    getInstagramConfig,
    normalizeEmailList
} = require('./instagram-config-store');

const RESEND_API_URL = 'https://api.resend.com/emails';

module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const data = normalizeContactRequest(await getBody(req));
        const config = await getInstagramConfig();
        const recipients = splitEmailList(config.contactEmailRecipients);

        if (!recipients.length) {
            return res.status(503).json({
                error: 'Contact email recipients are not configured'
            });
        }

        if (!getResendApiKey()) {
            return res.status(503).json({
                error: 'Email service is not configured'
            });
        }

        await sendContactEmails(data, recipients);

        return res.status(200).json({ ok: true });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            error: error.message || 'Contact request failed'
        });
    }
};

async function sendContactEmails(data, recipients) {
    await Promise.all([
        sendEmail(buildInternalEmail(data, recipients)),
        sendEmail(buildConsultantCopyEmail(data, recipients))
    ]);
}

function buildInternalEmail(data, recipients) {
    return {
        from: getContactEmailFrom(),
        to: recipients,
        subject: `Nueva consulta web: ${formatServiceLabel(data.servicio)}`,
        html: buildInternalEmailHtml(data),
        text: buildInternalEmailText(data),
        reply_to: data.email
    };
}

function buildConsultantCopyEmail(data, recipients) {
    return {
        from: getContactEmailFrom(),
        to: [data.email],
        subject: 'Recibimos tu consulta en Florería Camelia',
        html: buildConsultantCopyHtml(data),
        text: buildConsultantCopyText(data),
        reply_to: recipients[0]
    };
}

async function sendEmail(payload) {
    const response = await fetch(RESEND_API_URL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${getResendApiKey()}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const details = await response.json().catch(() => ({}));
        const error = new Error(details.message || details.error || 'Email could not be sent');
        error.statusCode = 502;
        throw error;
    }
}

function getResendApiKey() {
    return process.env.RESEND_API_KEY || process.env.EMAIL_DUO_DEVS_RESEND_API_KEY || '';
}

function getContactEmailFrom() {
    if (process.env.CONTACT_EMAIL_FROM) return process.env.CONTACT_EMAIL_FROM;

    const emailDomain = String(process.env.EMAIL_DUO_DEVS_RESEND_EMAIL_DOMAIN || '').trim();

    if (emailDomain) {
        return `Florería Camelia <floreriacamelia_consulta@${emailDomain}>`;
    }

    return 'Florería Camelia <onboarding@resend.dev>';
}

function normalizeContactRequest(input) {
    const data = {
        nombre: String(input.nombre || '').trim(),
        apellido: String(input.apellido || '').trim(),
        email: normalizeEmailList(input.email || ''),
        pais: String(input.pais || '').trim(),
        servicio: String(input.servicio || '').trim(),
        mensaje: String(input.mensaje || '').trim()
    };

    if (!data.nombre || !data.apellido || !data.email || !data.pais || !data.servicio || !data.mensaje) {
        const error = new Error('Faltan datos obligatorios del formulario');
        error.statusCode = 400;
        throw error;
    }

    if (data.nombre.length > 80 || data.apellido.length > 80 || data.email.length > 160 || data.pais.length > 80 || data.servicio.length > 120 || data.mensaje.length > 2000) {
        const error = new Error('El formulario contiene campos demasiado largos');
        error.statusCode = 400;
        throw error;
    }

    return data;
}

function splitEmailList(value) {
    return normalizeEmailList(value)
        .split('\n')
        .map((email) => email.trim())
        .filter(Boolean);
}

async function getBody(req) {
    if (req.body && typeof req.body === 'object') {
        return req.body;
    }

    if (typeof req.body === 'string') {
        return JSON.parse(req.body || '{}');
    }

    const chunks = [];

    for await (const chunk of req) {
        chunks.push(chunk);
    }

    const rawBody = Buffer.concat(chunks).toString('utf8');
    return rawBody ? JSON.parse(rawBody) : {};
}

function buildInternalEmailHtml(data) {
    const rows = [
        ['Nombre', data.nombre],
        ['Apellido', data.apellido],
        ['Email', data.email],
        ['Pais', data.pais],
        ['Servicio', formatServiceLabel(data.servicio)],
        ['Mensaje', data.mensaje]
    ];

    return `
        <div style="font-family:Arial,sans-serif;line-height:1.5;color:#1f1f1f;max-width:640px">
            <h1 style="font-size:24px;color:#961432;margin:0 0 16px">Nueva consulta desde la web</h1>
            <p style="margin:0 0 20px">Se recibió una nueva consulta en Florería Camelia.</p>
            <table style="border-collapse:collapse;width:100%">
                ${rows.map(([label, value]) => `
                    <tr>
                        <th style="border-top:1px solid #e5e5e5;padding:12px;text-align:left;vertical-align:top;width:140px">${escapeHtml(label)}</th>
                        <td style="border-top:1px solid #e5e5e5;padding:12px;white-space:pre-wrap">${escapeHtml(value)}</td>
                    </tr>
                `).join('')}
            </table>
        </div>
    `;
}

function buildInternalEmailText(data) {
    return [
        'Nueva consulta desde la web de Florería Camelia',
        '',
        `Nombre: ${data.nombre}`,
        `Apellido: ${data.apellido}`,
        `Email: ${data.email}`,
        `Pais: ${data.pais}`,
        `Servicio: ${formatServiceLabel(data.servicio)}`,
        '',
        'Mensaje:',
        data.mensaje
    ].join('\n');
}

function buildConsultantCopyHtml(data) {
    const fullName = `${data.nombre} ${data.apellido}`.trim();

    return `
        <div style="font-family:Arial,sans-serif;line-height:1.5;color:#1f1f1f;max-width:640px">
            <h1 style="font-size:24px;color:#961432;margin:0 0 16px">Recibimos tu consulta</h1>
            <p style="margin:0 0 14px">Hola ${escapeHtml(fullName)}, gracias por escribirnos.</p>
            <p style="margin:0 0 20px">Te responderemos a la brevedad. Esta es una copia de la consulta enviada a Florería Camelia:</p>
            <table style="border-collapse:collapse;width:100%">
                <tr>
                    <th style="border-top:1px solid #e5e5e5;padding:12px;text-align:left;vertical-align:top;width:140px">Servicio</th>
                    <td style="border-top:1px solid #e5e5e5;padding:12px">${escapeHtml(formatServiceLabel(data.servicio))}</td>
                </tr>
                <tr>
                    <th style="border-top:1px solid #e5e5e5;padding:12px;text-align:left;vertical-align:top;width:140px">Pais</th>
                    <td style="border-top:1px solid #e5e5e5;padding:12px">${escapeHtml(data.pais)}</td>
                </tr>
                <tr>
                    <th style="border-top:1px solid #e5e5e5;padding:12px;text-align:left;vertical-align:top;width:140px">Mensaje</th>
                    <td style="border-top:1px solid #e5e5e5;padding:12px;white-space:pre-wrap">${escapeHtml(data.mensaje)}</td>
                </tr>
            </table>
        </div>
    `;
}

function buildConsultantCopyText(data) {
    const fullName = `${data.nombre} ${data.apellido}`.trim();

    return [
        `Hola ${fullName}, gracias por escribirnos.`,
        '',
        'Te responderemos a la brevedad. Esta es una copia de la consulta enviada a Florería Camelia:',
        '',
        `Servicio: ${formatServiceLabel(data.servicio)}`,
        `Pais: ${data.pais}`,
        '',
        'Mensaje:',
        data.mensaje
    ].join('\n');
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function formatServiceLabel(value) {
    const labels = {
        'consulta': 'Consulta solamente',
        'arreglos-florales': 'Arreglos Florales',
        'obras-funerarias': 'Obras Funerarias',
        'grabados-laser': 'Grabados Laser',
        'otros': 'Otros'
    };

    return labels[value] || value;
}
