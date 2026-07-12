const CONFIG_PATH = 'private/instagram-feed-config.json';

function getEnvConfig() {
    return {
        accessToken: process.env.INSTAGRAM_ACCESS_TOKEN || '',
        userId: process.env.INSTAGRAM_USER_ID || 'me',
        graphVersion: process.env.INSTAGRAM_GRAPH_VERSION || 'v25.0',
        graphBaseUrl: process.env.INSTAGRAM_API_BASE_URL || 'https://graph.instagram.com',
        mediaLimit: process.env.INSTAGRAM_MEDIA_LIMIT || '6'
    };
}

async function getInstagramConfig() {
    const envConfig = getEnvConfig();
    const savedConfig = await readSavedConfig();

    return {
        ...envConfig,
        ...savedConfig,
        accessToken: savedConfig.accessToken || envConfig.accessToken
    };
}

async function getInstagramConfigStatus() {
    const envConfig = getEnvConfig();
    const savedConfig = await readSavedConfig();
    const activeConfig = await getInstagramConfig();

    return {
        hasToken: Boolean(activeConfig.accessToken),
        source: savedConfig.accessToken ? 'app' : (envConfig.accessToken ? 'environment' : 'none'),
        userId: activeConfig.userId,
        graphVersion: activeConfig.graphVersion,
        graphBaseUrl: activeConfig.graphBaseUrl,
        mediaLimit: activeConfig.mediaLimit,
        updatedAt: savedConfig.updatedAt || null
    };
}

async function saveInstagramConfig(input) {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
        const error = new Error('Blob storage is not configured');
        error.statusCode = 503;
        throw error;
    }

    const config = normalizeConfig(input);

    if (!config.accessToken) {
        const error = new Error('Instagram access token is required');
        error.statusCode = 400;
        throw error;
    }

    const { put } = await import('@vercel/blob');
    const savedConfig = {
        ...config,
        updatedAt: new Date().toISOString()
    };

    await put(CONFIG_PATH, JSON.stringify(savedConfig), {
        access: 'private',
        allowOverwrite: true,
        contentType: 'application/json'
    });

    return {
        hasToken: true,
        source: 'app',
        userId: savedConfig.userId,
        graphVersion: savedConfig.graphVersion,
        graphBaseUrl: savedConfig.graphBaseUrl,
        mediaLimit: savedConfig.mediaLimit,
        updatedAt: savedConfig.updatedAt
    };
}

async function readSavedConfig() {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
        return {};
    }

    try {
        const { get } = await import('@vercel/blob');
        const blob = await get(CONFIG_PATH, {
            access: 'private',
            useCache: false
        });

        if (!blob || blob.statusCode !== 200 || !blob.stream) return {};

        const response = new Response(blob.stream);
        return normalizeConfig(await response.json());
    } catch (error) {
        return {};
    }
}

function normalizeConfig(input) {
    const envConfig = getEnvConfig();
    const mediaLimit = clampLimit(input.mediaLimit || envConfig.mediaLimit);
    const graphBaseUrl = normalizeBaseUrl(input.graphBaseUrl || envConfig.graphBaseUrl);

    return {
        accessToken: String(input.accessToken || '').trim(),
        userId: String(input.userId || envConfig.userId || 'me').trim() || 'me',
        graphVersion: String(input.graphVersion || envConfig.graphVersion || 'v25.0').trim() || 'v25.0',
        graphBaseUrl,
        mediaLimit: String(mediaLimit)
    };
}

function normalizeBaseUrl(value) {
    const baseUrl = String(value || 'https://graph.instagram.com').trim().replace(/\/$/, '');

    if (baseUrl !== 'https://graph.instagram.com' && baseUrl !== 'https://graph.facebook.com') {
        return 'https://graph.instagram.com';
    }

    return baseUrl;
}

function clampLimit(value) {
    const parsedValue = Number.parseInt(value, 10);

    if (Number.isNaN(parsedValue)) return 6;
    return Math.min(Math.max(parsedValue, 1), 12);
}

module.exports = {
    getInstagramConfig,
    getInstagramConfigStatus,
    saveInstagramConfig
};
