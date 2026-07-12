// Integración del feed de Instagram para Florería Camelia.
document.addEventListener('DOMContentLoaded', function() {
    initializeInstagramFeed();
});

async function initializeInstagramFeed() {
    const feedContainer = document.getElementById('instagramFeed');
    const statusElement = document.getElementById('instagramStatus');

    if (!feedContainer || !statusElement) return;

    try {
        const response = await fetch('/api/instagram', {
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Instagram feed unavailable');
        }

        const contentType = response.headers.get('content-type') || '';

        if (!contentType.includes('application/json')) {
            throw new Error('Instagram feed returned a non-json response');
        }

        const payload = await response.json();
        const posts = Array.isArray(payload.posts) ? payload.posts : [];

        if (!posts.length) {
            showInstagramStatus(statusElement, 'instagram_sin_publicaciones', 'No hay publicaciones recientes para mostrar.', 'empty');
            return;
        }

        feedContainer.innerHTML = posts.map(createInstagramPostCard).join('');
        statusElement.classList.add('d-none');
    } catch (error) {
        showInstagramStatus(
            statusElement,
            'instagram_no_disponible',
            'El feed de Instagram no está disponible por ahora. Puedes ver nuestras publicaciones desde el perfil.',
            'warning'
        );
    }
}

function createInstagramPostCard(post) {
    const mediaUrl = post.thumbnail_url || post.media_url || '/img/placeholder.jpg';
    const caption = truncateText(post.caption || 'Trabajo de Florería Camelia', 120);
    const date = post.timestamp ? formatInstagramDate(post.timestamp) : '';
    const isVideo = post.media_type === 'VIDEO';
    const permalink = post.permalink || 'https://www.instagram.com/floreriacameliauy/';

    return `
        <article class="instagram-post">
            <a href="${escapeAttribute(permalink)}" target="_blank" rel="noopener noreferrer" aria-label="Abrir publicación de Instagram">
                <div class="instagram-post-media">
                    <img src="${escapeAttribute(mediaUrl)}" alt="${escapeAttribute(caption)}" loading="lazy">
                    ${isVideo ? '<span class="instagram-media-badge"><i class="bi bi-play-fill" aria-hidden="true"></i></span>' : ''}
                </div>
                <div class="instagram-post-body">
                    <p>${escapeHtml(caption)}</p>
                    ${date ? `<time datetime="${escapeAttribute(post.timestamp)}">${escapeHtml(date)}</time>` : ''}
                </div>
            </a>
        </article>
    `;
}

function showInstagramStatus(element, translationKey, fallbackText, type) {
    const translatedText = getInstagramTranslation(translationKey, fallbackText);
    element.className = `instagram-status instagram-status-${type}`;
    element.innerHTML = `<i class="bi bi-info-circle me-2" aria-hidden="true"></i><span>${escapeHtml(translatedText)}</span>`;
}

function getInstagramTranslation(key, fallbackText) {
    if (window.translationManager && typeof window.translationManager.translate === 'function') {
        return window.translationManager.translate(key);
    }

    return fallbackText;
}

function formatInstagramDate(timestamp) {
    const date = new Date(timestamp);
    const lang = document.documentElement.lang || 'es';

    if (Number.isNaN(date.getTime())) {
        return '';
    }

    return new Intl.DateTimeFormat(lang, {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    }).format(date);
}

function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return `${text.slice(0, maxLength).trim()}...`;
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function escapeAttribute(value) {
    return escapeHtml(value).replace(/`/g, '&#096;');
}
