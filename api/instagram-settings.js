const {
    getInstagramConfigStatus,
    saveInstagramConfig
} = require('./instagram-config-store');

module.exports = async function handler(req, res) {
    if (req.method !== 'GET' && req.method !== 'POST') {
        res.setHeader('Allow', 'GET, POST');
        return res.status(405).json({ error: 'Method not allowed' });
    }

    if (!isAuthorized(req)) {
        return res.status(process.env.ADMIN_PASSWORD ? 401 : 503).json({
            error: process.env.ADMIN_PASSWORD ? 'Unauthorized' : 'Admin password is not configured'
        });
    }

    try {
        if (req.method === 'GET') {
            return res.status(200).json(await getInstagramConfigStatus());
        }

        const savedStatus = await saveInstagramConfig(await getBody(req));
        return res.status(200).json(savedStatus);
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            error: error.message || 'Instagram settings request failed'
        });
    }
};

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

function isAuthorized(req) {
    const adminPassword = process.env.ADMIN_PASSWORD;
    const providedPassword = req.headers['x-admin-password'];

    return Boolean(adminPassword && providedPassword && providedPassword === adminPassword);
}
