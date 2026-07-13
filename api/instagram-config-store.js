const CONFIG_PATH = 'private/instagram-feed-config.json';

function getEnvConfig() {
    return {
        accessToken: process.env.INSTAGRAM_ACCESS_TOKEN || '',
        userId: process.env.INSTAGRAM_USER_ID || 'me',
        graphVersion: process.env.INSTAGRAM_GRAPH_VERSION || 'v25.0',
        graphBaseUrl: process.env.INSTAGRAM_API_BASE_URL || 'https://graph.instagram.com',
        mediaLimit: process.env.INSTAGRAM_MEDIA_LIMIT || '12',
        featuredMediaIds: process.env.INSTAGRAM_FEATURED_MEDIA_IDS || '',
        highlightStories: parseHighlightStories(process.env.INSTAGRAM_HIGHLIGHT_STORIES || ''),
        contactEmailRecipients: normalizeEmailList(process.env.CONTACT_EMAIL_RECIPIENTS || '')
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
        featuredMediaIds: activeConfig.featuredMediaIds,
        highlightStories: activeConfig.highlightStories,
        contactEmailRecipients: activeConfig.contactEmailRecipients,
        updatedAt: savedConfig.updatedAt || null
    };
}

async function saveInstagramConfig(input) {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
        const error = new Error('Blob storage is not configured');
        error.statusCode = 503;
        throw error;
    }

    const activeConfig = await getInstagramConfig();
    const accessToken = String(input.accessToken || '').trim() || activeConfig.accessToken;
    const config = normalizeConfig({
        ...activeConfig,
        ...input,
        accessToken
    });

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
        featuredMediaIds: savedConfig.featuredMediaIds,
        highlightStories: savedConfig.highlightStories,
        contactEmailRecipients: savedConfig.contactEmailRecipients,
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
    const featuredMediaIds = normalizeFeaturedMediaIds(input.featuredMediaIds || envConfig.featuredMediaIds);
    const highlightStories = parseHighlightStories(
        input.highlightStories && input.highlightStories.length ? input.highlightStories : envConfig.highlightStories
    );
    const contactEmailRecipients = normalizeEmailList(
        input.contactEmailRecipients || envConfig.contactEmailRecipients
    );

    return {
        accessToken: String(input.accessToken || '').trim(),
        userId: String(input.userId || envConfig.userId || 'me').trim() || 'me',
        graphVersion: String(input.graphVersion || envConfig.graphVersion || 'v25.0').trim() || 'v25.0',
        graphBaseUrl,
        mediaLimit: String(mediaLimit),
        featuredMediaIds,
        highlightStories,
        contactEmailRecipients
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

    if (Number.isNaN(parsedValue)) return 12;
    return Math.min(Math.max(parsedValue, 12), 24);
}

function normalizeFeaturedMediaIds(value) {
    if (Array.isArray(value)) {
        return value
            .map((item) => String(item || '').trim())
            .filter(Boolean)
            .join('\n');
    }

    return String(value || '')
        .split(/[\n,]+/)
        .map((item) => item.trim())
        .filter(Boolean)
        .join('\n');
}

function normalizeEmailList(value) {
    const values = Array.isArray(value)
        ? value
        : String(value || '').split(/[\n,;]+/);

    return values
        .map((email) => String(email || '').trim().toLowerCase())
        .filter(Boolean)
        .filter((email, index, list) => list.indexOf(email) === index)
        .filter(isValidEmail)
        .slice(0, 20)
        .join('\n');
}

function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function parseHighlightStories(value) {
    if (Array.isArray(value)) {
        return value.map(normalizeHighlightStory).filter(Boolean).slice(0, 12);
    }

    const rawValue = String(value || '').trim();

    if (!rawValue) return [];

    if (rawValue.startsWith('[')) {
        try {
            const parsedValue = JSON.parse(rawValue);
            if (Array.isArray(parsedValue)) {
                return parsedValue.map(normalizeHighlightStory).filter(Boolean).slice(0, 12);
            }
        } catch (error) {
            return [];
        }
    }

    return rawValue
        .split('\n')
        .map((line) => {
            const [title, imageUrl, permalink] = line.split('|').map((part) => String(part || '').trim());
            return normalizeHighlightStory({ title, imageUrl, permalink });
        })
        .filter(Boolean)
        .slice(0, 12);
}

function normalizeHighlightStory(story) {
    if (!story || typeof story !== 'object') return null;

    const title = String(story.title || '').trim();
    const imageUrl = String(story.imageUrl || story.image_url || '').trim();
    const permalink = String(story.permalink || story.url || '').trim();

    if (!title || !imageUrl) return null;

    return {
        title,
        imageUrl,
        permalink
    };
}

module.exports = {
    getInstagramConfig,
    getInstagramConfigStatus,
    saveInstagramConfig,
    normalizeEmailList
};
