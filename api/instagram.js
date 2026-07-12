const DEFAULT_GRAPH_VERSION = 'v25.0';
const DEFAULT_GRAPH_BASE_URL = 'https://graph.instagram.com';
const { getInstagramConfig } = require('./instagram-config-store');
const DEFAULT_FIELDS = [
    'id',
    'caption',
    'media_type',
    'media_url',
    'permalink',
    'thumbnail_url',
    'timestamp',
    'username'
].join(',');

module.exports = async function handler(req, res) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', 'GET');
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const config = await getInstagramConfig();
    const accessToken = config.accessToken;

    if (!accessToken) {
        return res.status(503).json({
            error: 'Instagram feed is not configured'
        });
    }

    const userId = config.userId || 'me';
    const graphVersion = config.graphVersion || DEFAULT_GRAPH_VERSION;
    const graphBaseUrl = config.graphBaseUrl || DEFAULT_GRAPH_BASE_URL;
    const limit = clampLimit(config.mediaLimit || '6');

    const endpoint = new URL(`${graphBaseUrl.replace(/\/$/, '')}/${graphVersion}/${userId}/media`);
    endpoint.searchParams.set('fields', DEFAULT_FIELDS);
    endpoint.searchParams.set('limit', String(limit));
    endpoint.searchParams.set('access_token', accessToken);

    try {
        const instagramResponse = await fetch(endpoint.toString(), {
            headers: {
                'Accept': 'application/json'
            }
        });
        const payload = await instagramResponse.json();

        if (!instagramResponse.ok) {
            const status = instagramResponse.status >= 500 ? 502 : instagramResponse.status;
            return res.status(status).json({
                error: 'Instagram API request failed',
                details: payload.error ? payload.error.message : 'Unknown Instagram API error'
            });
        }

        const posts = Array.isArray(payload.data) ? payload.data.map(normalizePost) : [];

        res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=1800, stale-while-revalidate=3600');
        return res.status(200).json({ posts });
    } catch (error) {
        return res.status(502).json({
            error: 'Instagram API request failed'
        });
    }
};

function normalizePost(post) {
    return {
        id: post.id,
        caption: post.caption || '',
        media_type: post.media_type || '',
        media_url: post.media_url || '',
        permalink: post.permalink || '',
        thumbnail_url: post.thumbnail_url || '',
        timestamp: post.timestamp || '',
        username: post.username || ''
    };
}

function clampLimit(value) {
    const parsedValue = Number.parseInt(value, 10);

    if (Number.isNaN(parsedValue)) return 6;
    return Math.min(Math.max(parsedValue, 1), 12);
}
