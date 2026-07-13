document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('adminLoginForm');
    const settingsForm = document.getElementById('instagramSettingsForm');
    const statusButton = document.getElementById('checkInstagramSettings');
    const logoutButton = document.getElementById('logoutAdminSession');
    const message = document.getElementById('adminMessage');
    const sessionStatus = document.getElementById('adminSessionStatus');

    if (!loginForm || !settingsForm || !statusButton || !logoutButton || !message) return;

    initializeAdminSession(loginForm, settingsForm, message, sessionStatus);

    loginForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const submitButton = loginForm.querySelector('button[type="submit"]');
        const password = loginForm.adminPassword.value.trim();
        const remember = loginForm.rememberAdminSession.checked;

        if (!password) {
            showAdminMessage(message, 'Ingresá la contraseña de administración.', 'warning');
            return;
        }

        await runAdminRequest(message, submitButton, async function() {
            const session = await requestAdminSession('POST', { password, remember });
            loginForm.adminPassword.value = '';
            setAuthenticatedState(loginForm, settingsForm, message, sessionStatus, session);
            await loadInstagramStatus(message, statusButton, settingsForm);
        });
    });

    logoutButton.addEventListener('click', async function() {
        await runAdminRequest(message, logoutButton, async function() {
            await requestAdminSession('DELETE');
            setLoggedOutState(loginForm, settingsForm, message);
            showAdminMessage(message, 'Sesión cerrada.', 'success');
        });
    });

    statusButton.addEventListener('click', async function() {
        await loadInstagramStatus(message, statusButton, settingsForm);
    });

    settingsForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const submitButton = settingsForm.querySelector('button[type="submit"]');
        const accessToken = settingsForm.accessToken.value.trim();

        await runAdminRequest(message, submitButton, async function() {
            const status = await requestInstagramSettings('POST', {
                accessToken,
                userId: settingsForm.userId.value,
                graphVersion: settingsForm.graphVersion.value,
                graphBaseUrl: settingsForm.graphBaseUrl.value,
                mediaLimit: settingsForm.mediaLimit.value,
                featuredMediaIds: settingsForm.featuredMediaIds.value,
                highlightStories: settingsForm.highlightStories.value,
                contactEmailRecipients: settingsForm.contactEmailRecipients.value
            });

            settingsForm.accessToken.value = '';
            showAdminMessage(message, `Configuración guardada. ${formatStatus(status)}`, 'success');
        });
    });
});

async function initializeAdminSession(loginForm, settingsForm, message, sessionStatus) {
    try {
        const session = await requestAdminSession('GET');

        if (session.authenticated) {
            setAuthenticatedState(loginForm, settingsForm, message, sessionStatus, session);
            return;
        }

        setLoggedOutState(loginForm, settingsForm, message);
    } catch (error) {
        setLoggedOutState(loginForm, settingsForm, message);
        showAdminMessage(message, getFriendlyError(error.message), 'danger');
    }
}

async function loadInstagramStatus(message, button, form) {
    await runAdminRequest(message, button, async function() {
        const status = await requestInstagramSettings('GET');
        showAdminMessage(message, formatStatus(status), status.hasToken ? 'success' : 'warning');
        fillFormFromStatus(form, status);
    });
}

async function requestAdminSession(method, body) {
    return requestJson('/api/admin-session', {
        method,
        body: body ? JSON.stringify(body) : undefined
    });
}

async function requestInstagramSettings(method, body) {
    return requestJson('/api/instagram-settings', {
        method,
        body: body ? JSON.stringify(body) : undefined
    });
}

async function requestJson(url, options) {
    const response = await fetch(url, {
        method: options.method,
        credentials: 'same-origin',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: options.body
    });
    const contentType = response.headers.get('content-type') || '';

    if (!contentType.includes('application/json')) {
        throw new Error('Serverless API is not running');
    }

    const payload = await response.json().catch(function() {
        return {};
    });

    if (!response.ok) {
        throw new Error(payload.error || 'No se pudo completar la acción.');
    }

    return payload;
}

async function runAdminRequest(message, button, action) {
    const spinner = button.querySelector('.spinner-border');
    const originalDisabled = button.disabled;

    button.disabled = true;
    if (spinner) spinner.classList.remove('d-none');

    try {
        await action();
    } catch (error) {
        showAdminMessage(message, getFriendlyError(error.message), 'danger');
    } finally {
        button.disabled = originalDisabled;
        if (spinner) spinner.classList.add('d-none');
    }
}

function setAuthenticatedState(loginForm, settingsForm, message, sessionStatus, session) {
    loginForm.classList.add('d-none');
    settingsForm.classList.remove('d-none');
    message.classList.add('d-none');

    if (sessionStatus && session.expiresAt) {
        const expiresAt = new Date(session.expiresAt);
        sessionStatus.textContent = session.remember
            ? `Sesión recordada hasta ${formatDateTime(expiresAt)}`
            : `Sesión activa hasta ${formatDateTime(expiresAt)}`;
    }
}

function setLoggedOutState(loginForm, settingsForm, message) {
    settingsForm.classList.add('d-none');
    loginForm.classList.remove('d-none');
    message.classList.add('d-none');
}

function fillFormFromStatus(form, status) {
    if (status.userId) form.userId.value = status.userId;
    if (status.graphVersion) form.graphVersion.value = status.graphVersion;
    if (status.graphBaseUrl) form.graphBaseUrl.value = status.graphBaseUrl;
    if (status.mediaLimit) form.mediaLimit.value = status.mediaLimit;
    form.featuredMediaIds.value = status.featuredMediaIds || '';
    form.highlightStories.value = formatHighlightStories(status.highlightStories);
    form.contactEmailRecipients.value = status.contactEmailRecipients || '';
}

function formatStatus(status) {
    const sourceLabel = {
        app: 'guardado desde la app',
        environment: 'variables de entorno',
        none: 'sin configurar'
    }[status.source] || status.source;

    const highlightsCount = Array.isArray(status.highlightStories) ? status.highlightStories.length : 0;
    const contactEmailsCount = String(status.contactEmailRecipients || '')
        .split('\n')
        .filter(Boolean)
        .length;

    return `Token: ${status.hasToken ? 'configurado' : 'pendiente'}. Origen: ${sourceLabel}. Publicaciones: ${status.mediaLimit || 12}. Historias destacadas: ${highlightsCount}. Correos de consulta: ${contactEmailsCount}.`;
}

function formatHighlightStories(highlights) {
    if (!Array.isArray(highlights)) return '';

    return highlights
        .map((story) => {
            return [
                story.title || '',
                story.imageUrl || '',
                story.permalink || ''
            ].join(' | ').trim();
        })
        .filter(Boolean)
        .join('\n');
}

function formatDateTime(date) {
    return new Intl.DateTimeFormat('es-UY', {
        dateStyle: 'short',
        timeStyle: 'short'
    }).format(date);
}

function getFriendlyError(message) {
    if (message === 'Blob storage is not configured') {
        return 'Falta configurar Vercel Blob. Agregá Blob Storage al proyecto en Vercel para guardar el token desde esta pantalla.';
    }

    if (message === 'Serverless API is not running') {
        return 'La API serverless no está corriendo en este servidor local. Probá esta pantalla con vercel dev o desde Vercel desplegado.';
    }

    if (message === 'Admin password is not configured') {
        return 'Falta configurar ADMIN_PASSWORD en las variables de entorno de Vercel.';
    }

    if (message === 'Contact email recipients are not configured') {
        return 'Falta configurar los correos que reciben consultas.';
    }

    if (message === 'Email service is not configured') {
        return 'Falta configurar RESEND_API_KEY en las variables de entorno de Vercel.';
    }

    if (message === 'Unauthorized') {
        return 'La sesión no está activa o la contraseña no es correcta.';
    }

    return message;
}

function showAdminMessage(element, text, type) {
    element.className = `admin-message admin-message-${type}`;
    element.textContent = text;
}
