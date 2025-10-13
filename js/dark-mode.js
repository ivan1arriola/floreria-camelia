// Sistema de Modo Oscuro para Florería Camelia
class DarkModeManager {
    constructor() {
        this.themeToggle = document.getElementById('themeToggle');
        this.htmlElement = document.documentElement;
        this.init();
    }

    init() {
        // Cargar preferencia guardada o detectar preferencia del sistema
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
            this.enableDarkMode();
        } else {
            this.disableDarkMode();
        }

        this.setupEventListeners();
    }

    setupEventListeners() {
        // Toggle del switch
        if (this.themeToggle) {
            this.themeToggle.addEventListener('change', () => {
                if (this.themeToggle.checked) {
                    this.enableDarkMode();
                } else {
                    this.disableDarkMode();
                }
            });
        }

        // Escuchar cambios en la preferencia del sistema
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                if (e.matches) {
                    this.enableDarkMode();
                } else {
                    this.disableDarkMode();
                }
            }
        });
    }

    enableDarkMode() {
        this.htmlElement.setAttribute('data-theme', 'dark');
        if (this.themeToggle) this.themeToggle.checked = true;
        localStorage.setItem('theme', 'dark');
        this.dispatchThemeChangeEvent('dark');
    }

    disableDarkMode() {
        this.htmlElement.removeAttribute('data-theme');
        if (this.themeToggle) this.themeToggle.checked = false;
        localStorage.setItem('theme', 'light');
        this.dispatchThemeChangeEvent('light');
    }

    dispatchThemeChangeEvent(theme) {
        const event = new CustomEvent('themeChange', { detail: { theme } });
        document.dispatchEvent(event);
    }

    // Método para obtener el tema actual
    getCurrentTheme() {
        return this.htmlElement.getAttribute('data-theme') || 'light';
    }

    // Método para cambiar manualmente el tema
    toggleTheme() {
        if (this.getCurrentTheme() === 'light') {
            this.enableDarkMode();
        } else {
            this.disableDarkMode();
        }
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.darkModeManager = new DarkModeManager();
});

// Función global para cambiar tema desde cualquier lugar
function toggleDarkMode() {
    if (window.darkModeManager) {
        window.darkModeManager.toggleTheme();
    }
}

// Exportar para módulos (si se usa ES6)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DarkModeManager, toggleDarkMode };
}