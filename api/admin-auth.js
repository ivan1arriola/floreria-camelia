const crypto = require('node:crypto');

const COOKIE_NAME = 'floreria_admin_session';
const SESSION_TTL_SECONDS = 8 * 60 * 60;
const REMEMBER_TTL_SECONDS = 30 * 24 * 60 * 60;

function requireAdminSession(req, res) {
    if (!process.env.ADMIN_PASSWORD) {
        res.status(503).json({ error: 'Admin password is not configured' });
        return null;
    }

    const session = readAdminSession(req);

    if (!session) {
        res.status(401).json({ error: 'Unauthorized' });
        return null;
    }

    return session;
}

function readAdminSession(req) {
    const cookies = parseCookies(req.headers.cookie || '');
    const token = cookies[COOKIE_NAME];

    if (!token) return null;

    try {
        const [payloadPart, signature] = token.split('.');
        const expectedSignature = sign(payloadPart);

        if (!signature || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
            return null;
        }

        const payload = JSON.parse(Buffer.from(payloadPart, 'base64url').toString('utf8'));
        const now = Math.floor(Date.now() / 1000);

        if (!payload.exp || payload.exp < now) return null;

        return payload;
    } catch (error) {
        return null;
    }
}

function createAdminSession(res, remember) {
    const now = Math.floor(Date.now() / 1000);
    const ttl = remember ? REMEMBER_TTL_SECONDS : SESSION_TTL_SECONDS;
    const payloadPart = Buffer.from(JSON.stringify({
        iat: now,
        exp: now + ttl,
        remember: Boolean(remember)
    })).toString('base64url');
    const token = `${payloadPart}.${sign(payloadPart)}`;
    const cookieParts = [
        `${COOKIE_NAME}=${token}`,
        'Path=/',
        'HttpOnly',
        'SameSite=Lax'
    ];

    if (remember) {
        cookieParts.push(`Max-Age=${ttl}`);
    }

    if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
        cookieParts.push('Secure');
    }

    res.setHeader('Set-Cookie', cookieParts.join('; '));

    return { expiresAt: new Date((now + ttl) * 1000).toISOString(), remember: Boolean(remember) };
}

function clearAdminSession(res) {
    const cookieParts = [
        `${COOKIE_NAME}=`,
        'Path=/',
        'HttpOnly',
        'SameSite=Lax',
        'Max-Age=0'
    ];

    if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
        cookieParts.push('Secure');
    }

    res.setHeader('Set-Cookie', cookieParts.join('; '));
}

function verifyPassword(password) {
    const adminPassword = process.env.ADMIN_PASSWORD || '';

    if (!adminPassword || !password) return false;

    const passwordBuffer = Buffer.from(String(password));
    const expectedBuffer = Buffer.from(adminPassword);

    if (passwordBuffer.length !== expectedBuffer.length) return false;

    return crypto.timingSafeEqual(passwordBuffer, expectedBuffer);
}

function sign(payloadPart) {
    const secret = process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || 'missing-admin-secret';
    return crypto.createHmac('sha256', secret).update(payloadPart).digest('base64url');
}

function parseCookies(cookieHeader) {
    return cookieHeader.split(';').reduce((cookies, cookie) => {
        const [name, ...valueParts] = cookie.trim().split('=');

        if (!name) return cookies;

        cookies[name] = decodeURIComponent(valueParts.join('='));
        return cookies;
    }, {});
}

module.exports = {
    clearAdminSession,
    createAdminSession,
    readAdminSession,
    requireAdminSession,
    verifyPassword
};
