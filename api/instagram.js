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
    'username',
    'children{id,media_type,media_url,thumbnail_url,timestamp}'
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
    const limit = clampLimit(config.mediaLimit || '12');
    const fetchLimit = Math.min(Math.max(limit * 3, limit), 75);

    const endpoint = new URL(`${graphBaseUrl.replace(/\/$/, '')}/${graphVersion}/${userId}/media`);
    endpoint.searchParams.set('fields', DEFAULT_FIELDS);
    endpoint.searchParams.set('limit', String(fetchLimit));
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

        const posts = prioritizePosts(
            Array.isArray(payload.data) ? payload.data.flatMap(normalizePost).filter(hasDisplayableMedia) : [],
            config.featuredMediaIds
        ).slice(0, limit);
        const highlights = normalizeHighlights(config.highlightStories);

        res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=1800, stale-while-revalidate=3600');
        return res.status(200).json({ posts, highlights });
    } catch (error) {
        return res.status(502).json({
            error: 'Instagram API request failed'
        });
    }
};

function normalizePost(post) {
    if (post.media_type === 'CAROUSEL_ALBUM' && post.children && Array.isArray(post.children.data)) {
        return post.children.data.map((child, index) => normalizeMediaItem(post, child, index));
    }

    return [normalizeMediaItem(post, null, null)];
}

function normalizeMediaItem(post, child, carouselIndex) {
    const source = child || post;
    const mediaUrl = source.media_url || '';
    const thumbnailUrl = source.thumbnail_url || post.thumbnail_url || '';

    return {
        id: child && child.id ? `${post.id}:${child.id}` : post.id,
        instagram_id: source.id || post.id,
        parent_id: child ? post.id : '',
        caption: post.caption || '',
        media_type: source.media_type || post.media_type || '',
        media_url: mediaUrl,
        display_url: thumbnailUrl || mediaUrl,
        permalink: post.permalink || '',
        thumbnail_url: thumbnailUrl,
        timestamp: source.timestamp || post.timestamp || '',
        username: post.username || '',
        is_carousel_child: Boolean(child),
        carousel_index: Number.isInteger(carouselIndex) ? carouselIndex : null
    };
}

function clampLimit(value) {
    const parsedValue = Number.parseInt(value, 10);

    if (Number.isNaN(parsedValue)) return 12;
    return Math.min(Math.max(parsedValue, 12), 24);
}

function hasDisplayableMedia(post) {
    return Boolean(post && post.display_url);
}

function prioritizePosts(posts, featuredMediaIds) {
    const priorityList = parsePriorityList(featuredMediaIds);

    if (!priorityList.length) return posts;

    return posts
        .map((post, index) => ({
            post,
            index,
            priorityIndex: getPriorityIndex(post, priorityList)
        }))
        .sort((a, b) => {
            if (a.priorityIndex !== b.priorityIndex) return a.priorityIndex - b.priorityIndex;
            return a.index - b.index;
        })
        .map((item) => item.post);
}

function parsePriorityList(value) {
    if (Array.isArray(value)) {
        return value.map(normalizePriorityValue).filter(Boolean);
    }

    return String(value || '')
        .split(/[\n,]+/)
        .map(normalizePriorityValue)
        .filter(Boolean);
}

function normalizePriorityValue(value) {
    return String(value || '').trim().replace(/\/$/, '').toLowerCase();
}

function getPriorityIndex(post, priorityList) {
    const candidates = [
        post.id,
        post.instagram_id,
        post.parent_id,
        post.permalink
    ].map(normalizePriorityValue).filter(Boolean);

    const matchIndex = priorityList.findIndex((priority) => {
        return candidates.some((candidate) => {
            return candidate === priority || candidate.includes(priority) || priority.includes(candidate);
        });
    });

    return matchIndex === -1 ? Number.MAX_SAFE_INTEGER : matchIndex;
}

function normalizeHighlights(value) {
    if (!Array.isArray(value)) return [];

    return value
        .map((story) => {
            if (!story || typeof story !== 'object') return null;

            const title = String(story.title || '').trim();
            const imageUrl = String(story.imageUrl || '').trim();
            const permalink = String(story.permalink || '').trim();

            if (!title || !imageUrl) return null;

            return {
                title,
                imageUrl,
                permalink
            };
        })
        .filter(Boolean)
        .slice(0, 12);
}
