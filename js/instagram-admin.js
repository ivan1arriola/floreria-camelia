document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('instagramSettingsForm');
    const statusButton = document.getElementById('checkInstagramSettings');
    const message = document.getElementById('adminMessage');

    if (!form || !statusButton || !message) return;

    statusButton.addEventListener('click', async function() {
        const adminPassword = form.adminPassword.value.trim();

        if (!adminPassword) {
            showAdminMessage(message, 'Ingresá la contraseña de administración para consultar el estado.', 'warning');
            return;
        }

        await runAdminRequest(message, statusButton, async function() {
            const status = await requestInstagramSettings('GET', adminPassword);
            showAdminMessage(message, formatStatus(status), status.hasToken ? 'success' : 'warning');
            fillFormFromStatus(form, status);
        });
    });

    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        const submitButton = form.querySelector('button[type="submit"]');
        const adminPassword = form.adminPassword.value.trim();
        const accessToken = form.accessToken.value.trim();

        if (!adminPassword || !accessToken) {
            showAdminMessage(message, 'Completá la contraseña y el access token antes de guardar.', 'warning');
            return;
        }

        await runAdminRequest(message, submitButton, async function() {
            const status = await requestInstagramSettings('POST', adminPassword, {
                accessToken,
                userId: form.userId.value,
                graphVersion: form.graphVersion.value,
                graphBaseUrl: form.graphBaseUrl.value,
                mediaLimit: form.mediaLimit.value
            });

            form.accessToken.value = '';
            showAdminMessage(message, `Configuración guardada. ${formatStatus(status)}`, 'success');
        });
    });
});

async function requestInstagramSettings(method, adminPassword, body) {
    const response = await fetch('/api/instagram-settings', {
        method,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-Admin-Password': adminPassword
        },
        body: body ? JSON.stringify(body) : undefined
    });
    const contentType = response.headers.get('content-type') || '';

    if (!contentType.includes('application/json')) {
        throw new Error('Serverless API is not running');
    }

    const payload = await response.json().catch(function() {
        return {};
    });

    if (!response.ok) {
        throw new Error(payload.error || 'No se pudo guardar la configuración.');
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

function fillFormFromStatus(form, status) {
    if (status.userId) form.userId.value = status.userId;
    if (status.graphVersion) form.graphVersion.value = status.graphVersion;
    if (status.graphBaseUrl) form.graphBaseUrl.value = status.graphBaseUrl;
    if (status.mediaLimit) form.mediaLimit.value = status.mediaLimit;
}

function formatStatus(status) {
    const sourceLabel = {
        app: 'guardado desde la app',
        environment: 'variables de entorno',
        none: 'sin configurar'
    }[status.source] || status.source;

    return `Token: ${status.hasToken ? 'configurado' : 'pendiente'}. Origen: ${sourceLabel}. Publicaciones: ${status.mediaLimit || 6}.`;
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

    if (message === 'Unauthorized') {
        return 'La contraseña de administración no es correcta.';
    }

    return message;
}

function showAdminMessage(element, text, type) {
    element.className = `admin-message admin-message-${type}`;
    element.textContent = text;
}
