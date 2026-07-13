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

        if (!process.env.RESEND_API_KEY) {
            return res.status(503).json({
                error: 'Email service is not configured'
            });
        }

        await sendContactEmail(data, recipients);

        return res.status(200).json({ ok: true });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            error: error.message || 'Contact request failed'
        });
    }
};

async function sendContactEmail(data, recipients) {
    const payload = {
        from: process.env.CONTACT_EMAIL_FROM || 'Florería Camelia <onboarding@resend.dev>',
        to: recipients,
        subject: `Nueva consulta web: ${formatServiceLabel(data.servicio)}`,
        html: buildEmailHtml(data),
        text: buildEmailText(data)
    };

    if (data.email) {
        payload.reply_to = data.email;
    }

    const response = await fetch(RESEND_API_URL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
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

function normalizeContactRequest(input) {
    const data = {
        nombre: String(input.nombre || '').trim(),
        telefono: String(input.telefono || '').trim(),
        email: normalizeEmailList(input.email || ''),
        servicio: String(input.servicio || '').trim(),
        mensaje: String(input.mensaje || '').trim()
    };

    if (!data.nombre || !data.telefono || !data.servicio || !data.mensaje) {
        const error = new Error('Faltan datos obligatorios del formulario');
        error.statusCode = 400;
        throw error;
    }

    if (data.nombre.length > 120 || data.telefono.length > 40 || data.servicio.length > 120 || data.mensaje.length > 2000) {
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

function buildEmailHtml(data) {
    const rows = [
        ['Nombre', data.nombre],
        ['Telefono', data.telefono],
        ['Email', data.email || 'No indicado'],
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

function buildEmailText(data) {
    return [
        'Nueva consulta desde la web de Florería Camelia',
        '',
        `Nombre: ${data.nombre}`,
        `Telefono: ${data.telefono}`,
        `Email: ${data.email || 'No indicado'}`,
        `Servicio: ${formatServiceLabel(data.servicio)}`,
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
        'arreglos-florales': 'Arreglos Florales',
        'obras-funerarias': 'Obras Funerarias',
        'grabados-laser': 'Grabados Laser',
        'otros': 'Otros'
    };

    return labels[value] || value;
}
