// Sistema de traducción para Florería Camelia
class TranslationManager {
    constructor() {
        this.currentLang = 'es';
        this.translations = {
            es: {
                // Navegación
                "language": "ES",
                "inicio": "Inicio",
                "servicios": "Servicios",
                "nosotros": "Nosotros",
                "galeria": "Galería",
                "consulta": "Consulta",
                "contacto": "Contacto",
                "floreria": "Florería",
                
                // Hero Section
                "hero_title": "Florería Camelia",
                "hero_description": "Más de 30 años acompañando en los momentos más importantes de la vida con flores de calidad y servicios funerarios completos.",
                "contactanos": "Contáctanos",
                "nuestros_servicios": "Nuestros Servicios",
                
                // Servicios
                "servicio1_titulo": "Arreglos Florales",
                "servicio1_descripcion": "Creaciones únicas para expresar sentimientos y acompañar en momentos especiales. Diseños personalizados para cada ocasión.",
                "servicio2_titulo": "Obras Funerarias",
                "servicio2_descripcion": "Servicio completo y personalizado para honrar a sus seres queridos con respeto, dignidad y profesionalismo.",
                "servicio3_titulo": "Grabados Láser",
                "servicio3_descripcion": "Grabados en mármol y acrílico, placas de acrílico sublimadas de alta calidad para recordatorios y homenajes.",
                
                // Nosotros
                "nuestra_historia": "Nuestra Historia",
                "historia_texto1": "Desde hace más de 30 años, Florería Camelia se ha consolidado como un referente en el sector floral y funerario de la comunidad. Ubicados estratégicamente frente al Cementerio del Norte, hemos acompañado a miles de familias en sus momentos más significativos.",
                "historia_texto2": "Nuestra trayectoria nos ha permitido entender las necesidades de nuestros clientes, ofreciendo siempre calidad, respeto y calidez humana en cada uno de nuestros servicios.",
                "experiencia_titulo": "Más de 30 años de experiencia",
                "experiencia_descripcion": "Acompañando a la comunidad con profesionalismo y sensibilidad",
                "porque_elegirnos": "¿Por qué elegirnos?",
                "ventaja1_titulo": "Atención personalizada",
                "ventaja1_descripcion": "Nos adaptamos a sus necesidades específicas con soluciones a medida",
                "ventaja2_titulo": "Calidad garantizada",
                "ventaja2_descripcion": "Materiales de primera calidad en todos nuestros productos y servicios",
                "ventaja3_titulo": "Experiencia y tradición",
                "ventaja3_descripcion": "Más de tres décadas de servicio continuo a la comunidad",
                "ventaja4_titulo": "Servicio integral",
                "ventaja4_descripcion": "Desde arreglos florales hasta obras funerarias completas",
                
                // Galería
                "galeria_descripcion": "Descubre nuestras últimas creaciones y mantente conectado con nosotros",
                "seguir_instagram": "Seguir en Instagram",
                
                // Formulario de Consulta
                "consulta_rapida": "Consulta Rápida",
                "consulta_descripcion": "¿Tienes alguna pregunta? Escríbenos y te responderemos a la brevedad",
                "nombre_completo": "Nombre completo *",
                "nombre_placeholder": "Ingresa tu nombre completo",
                "nombre_error": "Por favor ingresa tu nombre completo.",
                "telefono": "Teléfono *",
                "telefono_placeholder": "Ingresa tu teléfono",
                "telefono_error": "Por favor ingresa tu teléfono.",
                "email": "Email",
                "email_placeholder": "Ingresa tu email",
                "servicio_interes": "Servicio de interés *",
                "selecciona_servicio": "Selecciona un servicio",
                "servicio_opcion1": "Arreglos Florales",
                "servicio_opcion2": "Obras Funerarias",
                "servicio_opcion3": "Grabados Láser",
                "servicio_opcion4": "Otros",
                "servicio_error": "Por favor selecciona un servicio.",
                "mensaje": "Mensaje *",
                "mensaje_placeholder": "Cuéntanos en qué podemos ayudarte...",
                "mensaje_error": "Por favor escribe tu mensaje.",
                "enviar_consulta": "Enviar Consulta",
                "mensaje_exito": "¡Gracias por tu consulta! Te contactaremos a la brevedad.",
                "mensaje_error": "Ha ocurrido un error al enviar el formulario. Por favor, intenta nuevamente.",
                
                // Contacto
                "informacion_contacto": "Información de Contacto",
                "obras_funerarias": "Obras Funerarias",
                "horario_atencion": "Horario de Atención",
                "todos_los_dias": "Todos los días",
                "ubicacion": "Ubicación",
                "direccion": "Avenida Burgues 4298, frente al Cementerio del Norte",
                "siguenos_redes": "Síguenos en Redes",
                "encuentranos": "Encuéntranos",
                
                // Footer
                "derechos_reservados": "Todos los derechos reservados",
                "experiencia_footer": "Más de 30 años de experiencia",
                
                // General
                "cerrar": "Cerrar"
            },
            en: {
                // Navigation
                "language": "EN",
                "inicio": "Home",
                "servicios": "Services",
                "nosotros": "About Us",
                "galeria": "Gallery",
                "consulta": "Consultation",
                "contacto": "Contact",
                "floreria": "Florist",
                
                // Hero Section
                "hero_title": "Camelia Florist",
                "hero_description": "Over 30 years accompanying in the most important moments of life with quality flowers and complete funeral services.",
                "contactanos": "Contact Us",
                "nuestros_servicios": "Our Services",
                
                // Services
                "servicio1_titulo": "Floral Arrangements",
                "servicio1_descripcion": "Unique creations to express feelings and accompany in special moments. Custom designs for every occasion.",
                "servicio2_titulo": "Funeral Services",
                "servicio2_descripcion": "Complete and personalized service to honor your loved ones with respect, dignity and professionalism.",
                "servicio3_titulo": "Laser Engravings",
                "servicio3_descripcion": "Engravings on marble and acrylic, high-quality sublimated acrylic plates for memorials and tributes.",
                
                // About Us
                "nuestra_historia": "Our History",
                "historia_texto1": "For over 30 years, Florería Camelia has established itself as a reference in the floral and funeral sector of the community. Strategically located in front of the Northern Cemetery, we have accompanied thousands of families in their most significant moments.",
                "historia_texto2": "Our trajectory has allowed us to understand our customers' needs, always offering quality, respect and human warmth in each of our services.",
                "experiencia_titulo": "Over 30 years of experience",
                "experiencia_descripcion": "Accompanying the community with professionalism and sensitivity",
                "porque_elegirnos": "Why Choose Us?",
                "ventaja1_titulo": "Personalized attention",
                "ventaja1_descripcion": "We adapt to your specific needs with customized solutions",
                "ventaja2_titulo": "Guaranteed quality",
                "ventaja2_descripcion": "Top quality materials in all our products and services",
                "ventaja3_titulo": "Experience and tradition",
                "ventaja3_descripcion": "Over three decades of continuous service to the community",
                "ventaja4_titulo": "Comprehensive service",
                "ventaja4_descripcion": "From floral arrangements to complete funeral works",
                
                // Gallery
                "galeria_descripcion": "Discover our latest creations and stay connected with us",
                "seguir_instagram": "Follow on Instagram",
                
                // Consultation Form
                "consulta_rapida": "Quick Consultation",
                "consulta_descripcion": "Do you have any questions? Write to us and we will respond promptly",
                "nombre_completo": "Full Name *",
                "nombre_placeholder": "Enter your full name",
                "nombre_error": "Please enter your full name.",
                "telefono": "Phone *",
                "telefono_placeholder": "Enter your phone number",
                "telefono_error": "Please enter your phone number.",
                "email": "Email",
                "email_placeholder": "Enter your email",
                "servicio_interes": "Service of Interest *",
                "selecciona_servicio": "Select a service",
                "servicio_opcion1": "Floral Arrangements",
                "servicio_opcion2": "Funeral Services",
                "servicio_opcion3": "Laser Engravings",
                "servicio_opcion4": "Others",
                "servicio_error": "Please select a service.",
                "mensaje": "Message *",
                "mensaje_placeholder": "Tell us how we can help you...",
                "mensaje_error": "Please write your message.",
                "enviar_consulta": "Send Consultation",
                "mensaje_exito": "Thank you for your inquiry! We will contact you shortly.",
                "mensaje_error": "An error occurred while sending the form. Please try again.",
                
                // Contact
                "informacion_contacto": "Contact Information",
                "obras_funerarias": "Funeral Services",
                "horario_atencion": "Business Hours",
                "todos_los_dias": "Every day",
                "ubicacion": "Location",
                "direccion": "Avenida Burgues 4298, in front of the Northern Cemetery",
                "siguenos_redes": "Follow us on Social Media",
                "encuentranos": "Find Us",
                
                // Footer
                "derechos_reservados": "All rights reserved",
                "experiencia_footer": "Over 30 years of experience",
                
                // General
                "cerrar": "Close"
            }
        };
        
        this.init();
    }

    init() {
        // Cargar idioma guardado o detectar del navegador
        const savedLang = localStorage.getItem('preferred-language');
        const browserLang = navigator.language.split('-')[0];
        
        if (savedLang) {
            this.currentLang = savedLang;
        } else if (browserLang === 'en') {
            this.currentLang = 'en';
        }
        
        this.applyTranslations();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Selector de idioma
        document.querySelectorAll('.language-option').forEach(option => {
            option.addEventListener('click', (e) => {
                e.preventDefault();
                const lang = e.target.getAttribute('data-lang');
                this.changeLanguage(lang);
            });
        });
    }

    changeLanguage(lang) {
        if (this.translations[lang]) {
            // Agregar clase para animación
            document.body.classList.add('language-changing');
            
            setTimeout(() => {
                this.currentLang = lang;
                localStorage.setItem('preferred-language', lang);
                this.applyTranslations();
                
                // Remover clase de animación
                setTimeout(() => {
                    document.body.classList.remove('language-changing');
                }, 300);
            }, 150);
        }
    }

    applyTranslations() {
        // Actualizar textos
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (this.translations[this.currentLang][key]) {
                element.textContent = this.translations[this.currentLang][key];
            }
        });

        // Actualizar placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            if (this.translations[this.currentLang][key]) {
                element.setAttribute('placeholder', this.translations[this.currentLang][key]);
            }
        });

        // Actualizar atributo lang del HTML
        document.documentElement.lang = this.currentLang;

        // Actualizar texto del botón de idioma
        const languageButton = document.querySelector('.language-selector .btn [data-i18n="language"]');
        if (languageButton && this.translations[this.currentLang]['language']) {
            languageButton.textContent = this.translations[this.currentLang]['language'];
        }

        // Actualizar bandera del selector
        const languageFlag = document.querySelector('.language-selector .language-flag');
        if (languageFlag) {
            languageFlag.textContent = this.currentLang === 'es' ? '🇪🇸' : '🇺🇸';
        }

        console.log(`Idioma cambiado a: ${this.currentLang}`);
    }

    // Método para obtener traducción dinámicamente (útil para JavaScript)
    translate(key) {
        return this.translations[this.currentLang][key] || key;
    }
}

// Inicializar el sistema de traducción cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.translationManager = new TranslationManager();
});

// Función global para cambiar idioma desde cualquier lugar
function changeLanguage(lang) {
    if (window.translationManager) {
        window.translationManager.changeLanguage(lang);
    }
}