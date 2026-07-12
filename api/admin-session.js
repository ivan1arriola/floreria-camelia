const {
    clearAdminSession,
    createAdminSession,
    readAdminSession,
    verifyPassword
} = require('./admin-auth');

module.exports = async function handler(req, res) {
    if (req.method !== 'GET' && req.method !== 'POST' && req.method !== 'DELETE') {
        res.setHeader('Allow', 'GET, POST, DELETE');
        return res.status(405).json({ error: 'Method not allowed' });
    }

    if (!process.env.ADMIN_PASSWORD) {
        return res.status(503).json({ error: 'Admin password is not configured' });
    }

    if (req.method === 'GET') {
        const session = readAdminSession(req);
        return res.status(200).json({
            authenticated: Boolean(session),
            expiresAt: session ? new Date(session.exp * 1000).toISOString() : null,
            remember: session ? Boolean(session.remember) : false
        });
    }

    if (req.method === 'DELETE') {
        clearAdminSession(res);
        return res.status(200).json({ authenticated: false });
    }

    try {
        const body = await getBody(req);

        if (!verifyPassword(body.password)) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const session = createAdminSession(res, Boolean(body.remember));
        return res.status(200).json({
            authenticated: true,
            expiresAt: session.expiresAt,
            remember: session.remember
        });
    } catch (error) {
        return res.status(400).json({ error: 'Invalid request body' });
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
