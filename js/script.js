// JavaScript para Florería Camelia
document.addEventListener('DOMContentLoaded', function() {
    // Variables globales para gestión de imágenes
    const sitePhotoFiles = [
        'camelia-01.jpg',
        'camelia-02.jpg',
        'camelia-03.jpg',
        'camelia-04.jpg',
        'camelia-05.jpg',
        'camelia-06.jpg',
        'camelia-07.jpg',
        'camelia-08.jpg',
        'camelia-09.jpg',
        'camelia-10.jpg',
        'camelia-11.jpg',
        'camelia-12.jpg',
        'camelia-13.jpg',
        'camelia-14.jpg',
        'camelia-15.jpg',
        'camelia-16.jpg',
        'camelia-17.jpg',
        'camelia-18.jpg',
        'camelia-19.jpg',
        'camelia-20.jpg',
        'camelia-21.jpg',
        'camelia-22.jpg',
        'camelia-23.jpg',
        'camelia-24.jpg',
        'camelia-25.jpg'
    ];
    const heroPhotoFiles = [
        'camelia-06.jpg',
        ...sitePhotoFiles.filter((file) => file !== 'camelia-06.jpg')
    ];
    let imagenesList = [];
    let currentImageIndex = 0;
    let touchStartX = 0;
    let touchStartY = 0;
    let lastTap = 0;
    let touchStartTime = 0;
    let isSwiping = false;

    // Smooth scrolling para enlaces de navegación
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
                
                // Cerrar menú móvil después de hacer clic
                const navbarToggler = document.querySelector('.navbar-toggler');
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarToggler && !navbarToggler.classList.contains('collapsed')) {
                    navbarToggler.click();
                }
            }
        });
    });
    
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    const imagenesLocales = sitePhotoFiles.slice(0, 12).map((file, index) => ({
        src: `/img/${file}`,
        alt: `Trabajo ${index + 1} - Florería Camelia`
    }));

    initializeHeroBackgrounds();
    initializeHeroAudio();

    function generarImagenes() {
        renderGalleryImages(imagenesLocales);
        console.log('Imágenes locales cargadas como respaldo:', imagenesLocales.length);
    }

    function initializeHeroBackgrounds() {
        const hero = document.querySelector('.hero-section');

        if (!hero || !heroPhotoFiles.length) return;

        const imageUrls = heroPhotoFiles.map((file) => `/img/${file}`);
        const layers = [document.createElement('div'), document.createElement('div')];
        let activeLayerIndex = 0;
        let imageIndex = 0;

        layers.forEach((layer) => {
            layer.className = 'hero-bg-slide';
            layer.setAttribute('aria-hidden', 'true');
            hero.prepend(layer);
        });

        layers[0].style.backgroundImage = `url('${imageUrls[0]}')`;
        layers[0].classList.add('is-active');

        imageUrls.slice(1, 5).forEach((url) => {
            const image = new Image();
            image.src = url;
        });

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        window.setInterval(function() {
            imageIndex = (imageIndex + 1) % imageUrls.length;

            const nextLayerIndex = activeLayerIndex === 0 ? 1 : 0;
            layers[nextLayerIndex].style.backgroundImage = `url('${imageUrls[imageIndex]}')`;
            layers[nextLayerIndex].classList.add('is-active');
            layers[activeLayerIndex].classList.remove('is-active');
            activeLayerIndex = nextLayerIndex;
        }, 6500);
    }

    function initializeHeroAudio() {
        const audio = document.getElementById('heroAudio');
        const toggle = document.getElementById('heroMusicToggle');

        if (!audio || !toggle) return;

        audio.volume = 0.35;

        const setPlayingState = function(isPlaying) {
            toggle.classList.toggle('is-playing', isPlaying);
            toggle.setAttribute('aria-label', isPlaying ? 'Pausar música ambiental' : 'Reproducir música ambiental');
            toggle.title = isPlaying ? 'Pausar música' : 'Música ambiental';
        };

        const tryPlayAudio = async function() {
            try {
                await audio.play();
                setPlayingState(true);
                return true;
            } catch (error) {
                setPlayingState(false);
                return false;
            }
        };

        const playOnFirstInteraction = async function() {
            const didPlay = await tryPlayAudio();
            if (didPlay) {
                window.removeEventListener('pointerdown', playOnFirstInteraction);
                window.removeEventListener('keydown', playOnFirstInteraction);
            }
        };

        tryPlayAudio().then(function(didPlay) {
            if (!didPlay) {
                window.addEventListener('pointerdown', playOnFirstInteraction);
                window.addEventListener('keydown', playOnFirstInteraction);
            }
        });

        toggle.addEventListener('click', async function(event) {
            event.stopPropagation();

            if (audio.paused) {
                await tryPlayAudio();
                return;
            }

            audio.pause();
            setPlayingState(false);
        });

        audio.addEventListener('pause', function() {
            setPlayingState(false);
        });

        audio.addEventListener('play', function() {
            setPlayingState(true);
        });
    }

    function renderGalleryImages(imagenes) {
        const galleryImages = Array.isArray(imagenes) ? imagenes.filter(Boolean).slice(0, 24) : [];
        const galeriaGrid = document.getElementById('galeriaGrid');

        if (galeriaGrid) galeriaGrid.innerHTML = '';

        imagenesList = galleryImages;

        galleryImages.forEach((imagen, index) => {
            const imgPath = getGalleryImageSrc(imagen);
            const alt = getGalleryImageAlt(imagen, index);
            const galeriaItem = document.createElement('div');
            galeriaItem.className = imagen.media_type === 'VIDEO' ? 'galeria-item galeria-item-video' : 'galeria-item';
            galeriaItem.setAttribute('tabindex', '0');
            galeriaItem.setAttribute('role', 'button');
            galeriaItem.setAttribute('aria-label', alt);
            galeriaItem.setAttribute('data-index', index);
            galeriaItem.innerHTML = `
                <img src="${escapeAttribute(imgPath)}" 
                     alt="${escapeAttribute(alt)}" 
                     loading="lazy"
                     onerror="this.src='/img/placeholder.jpg'">
                ${imagen.media_type === 'VIDEO' ? '<span class="galeria-media-badge"><i class="bi bi-play-fill" aria-hidden="true"></i></span>' : ''}
            `;
            
            galeriaItem.addEventListener('click', function() {
                abrirImagenFullscreen(index);
            });
            
            galeriaItem.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    abrirImagenFullscreen(index);
                }
            });

            // Agregar eventos táctiles para doble tap
            setupDoubleTap(galeriaItem, index);
            
            if (galeriaGrid) {
                galeriaGrid.appendChild(galeriaItem);
            }
        });
    }

    window.setGalleryImages = function(imagenes) {
        if (!Array.isArray(imagenes) || !imagenes.length) return;
        renderGalleryImages(imagenes);
        fadeInOnScroll();
    };

    function getGalleryImageSrc(imagen) {
        if (imagen.src) return imagen.src;
        if (imagen.display_url) return imagen.display_url;
        if (imagen.thumbnail_url) return imagen.thumbnail_url;
        if (imagen.media_url) return imagen.media_url;
        return '/img/placeholder.jpg';
    }

    function getGalleryImageAlt(imagen, index) {
        if (imagen.alt) return imagen.alt;
        if (imagen.caption) return truncateText(imagen.caption, 110);
        return `Trabajo ${index + 1} - Florería Camelia`;
    }

    function truncateText(text, maxLength) {
        const value = String(text || '').trim();
        if (value.length <= maxLength) return value;
        return `${value.slice(0, maxLength).trim()}...`;
    }

    function escapeAttribute(value) {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // Configurar doble tap para elementos de imagen
    function setupDoubleTap(element, index) {
        let tapCount = 0;
        let tapTimer;

        element.addEventListener('touchstart', function(e) {
            // Guardar posición inicial del toque
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            touchStartTime = Date.now();

            // Detectar doble tap
            tapCount++;
            
            if (tapCount === 1) {
                tapTimer = setTimeout(function() {
                    tapCount = 0;
                }, 300); // Tiempo máximo entre taps para considerarlo doble tap
            } else if (tapCount === 2) {
                clearTimeout(tapTimer);
                tapCount = 0;
                
                // Prevenir el comportamiento por defecto (zoom)
                e.preventDefault();
                
                // Abrir imagen en pantalla completa
                abrirImagenFullscreen(index);
            }
        }, { passive: false });

        // Prevenir zoom en doble tap
        element.addEventListener('touchend', function(e) {
            // No hacemos nada aquí, solo prevenimos el zoom
        }, { passive: false });
    }

    // Función para abrir imagen en pantalla completa
    function abrirImagenFullscreen(index) {
        if (index < 0 || index >= imagenesList.length) return;
        
        currentImageIndex = index;
        const imagen = imagenesList[currentImageIndex];
        const src = getGalleryImageSrc(imagen);
        const alt = getGalleryImageAlt(imagen, currentImageIndex);
        
        const fullscreenImage = document.getElementById('fullscreenImage');
        const modalFullscreen = new bootstrap.Modal(document.getElementById('modalFullscreen'));
        
        if (fullscreenImage) {
            fullscreenImage.src = src;
            fullscreenImage.alt = alt;
            
            // Configurar eventos de deslizamiento para la imagen en modal
            setupSwipeGestures(fullscreenImage);
            
            modalFullscreen.show();
        }
    }

    // Configurar gestos de deslizamiento para cambiar imágenes
    function setupSwipeGestures(element) {
        let startX = 0;
        let startY = 0;
        let distX = 0;
        let distY = 0;
        const threshold = 50; // Distancia mínima para considerar un swipe
        const restraint = 100; // Máxima distancia permitida en dirección perpendicular
        const allowedTime = 500; // Tiempo máximo para considerar un swipe

        let startTime = 0;
        let isSwiping = false;

        element.addEventListener('touchstart', function(e) {
            const touch = e.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
            startTime = Date.now();
            isSwiping = true;
            e.preventDefault();
        }, { passive: false });

        element.addEventListener('touchmove', function(e) {
            if (!isSwiping) return;
            
            const touch = e.touches[0];
            distX = touch.clientX - startX;
            distY = touch.clientY - startY;
            
            // Si el movimiento es principalmente horizontal, prevenir scroll vertical
            if (Math.abs(distX) > Math.abs(distY)) {
                e.preventDefault();
            }
        }, { passive: false });

        element.addEventListener('touchend', function(e) {
            if (!isSwiping) return;
            
            const elapsedTime = Date.now() - startTime;
            isSwiping = false;
            
            // Verificar si es un swipe válido
            if (elapsedTime <= allowedTime) {
                // Verificar si cumple con la distancia mínima
                if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) {
                    // Es un swipe horizontal válido
                    if (distX > 0) {
                        // Swipe hacia la derecha - imagen anterior
                        cambiarImagen(-1);
                    } else {
                        // Swipe hacia la izquierda - imagen siguiente
                        cambiarImagen(1);
                    }
                }
            }
        });
    }

    // Función para cambiar de imagen en el modal
    function cambiarImagen(direction) {
        currentImageIndex += direction;
        
        // Navegación circular
        if (currentImageIndex >= imagenesList.length) {
            currentImageIndex = 0;
        } else if (currentImageIndex < 0) {
            currentImageIndex = imagenesList.length - 1;
        }
        
        const imagen = imagenesList[currentImageIndex];
        const src = getGalleryImageSrc(imagen);
        const alt = getGalleryImageAlt(imagen, currentImageIndex);
        
        const fullscreenImage = document.getElementById('fullscreenImage');
        if (fullscreenImage) {
            // Añadir animación de transición
            fullscreenImage.style.opacity = '0';
            
            setTimeout(() => {
                fullscreenImage.src = src;
                fullscreenImage.alt = alt;
                fullscreenImage.style.opacity = '1';
            }, 200);
        }
    }

    // Configurar navegación con teclado en el modal
    document.addEventListener('keydown', function(e) {
        const modal = document.getElementById('modalFullscreen');
        if (modal && modal.classList.contains('show')) {
            switch(e.key) {
                case 'ArrowLeft':
                    cambiarImagen(-1);
                    break;
                case 'ArrowRight':
                    cambiarImagen(1);
                    break;
                case 'Escape':
                    const modalInstance = bootstrap.Modal.getInstance(modal);
                    if (modalInstance) {
                        modalInstance.hide();
                    }
                    break;
            }
        }
    });

    // Scroll animations
    const fadeInOnScroll = function() {
        const fadeElements = document.querySelectorAll('.card, .section-title, .galeria-item');

        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('visible');
            }
        });
    };

    // Actualizar automáticamente el año en el footer
    const yearElement = document.querySelector('footer p:first-of-type');
    if (yearElement) {
        const currentYear = new Date().getFullYear();
        yearElement.textContent = yearElement.textContent.replace('2025', currentYear);
    }
    
    // Efecto de parallax para las flores
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const flores = document.querySelectorAll('.flor-decorativa');
        
        flores.forEach((flor, index) => {
            const speed = 0.5 + (index * 0.1);
            const yPos = -(scrolled * speed);
            flor.style.transform = `translateY(${yPos}px) rotate(${flor.style.transform ? flor.style.transform.split('rotate(')[1] : '0deg'})`;
        });
    });

    // Animación mejorada para las redes sociales
    const socialItems = document.querySelectorAll('.social-item');
    socialItems.forEach(item => {
        // Para dispositivos con mouse
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.05)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        // Para dispositivos táctiles
        item.addEventListener('touchstart', function() {
            this.style.transform = 'translateY(-4px) scale(1.02)';
        });
        
        item.addEventListener('touchend', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Mejoras para elementos interactivos en dispositivos táctiles
    const interactiveElements = document.querySelectorAll('.card, .btn, .social-item, .contact-item, .galeria-item');
    interactiveElements.forEach(element => {
        element.style.cursor = 'pointer';
        
        // Prevenir el zoom en doble toque en iOS
        element.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.98)';
        });
        
        element.addEventListener('touchend', function() {
            this.style.transform = 'scale(1)';
        });
    });

    // Inicializar la generación de imágenes
    generarImagenes();

    // Check on load and scroll para animaciones
    window.addEventListener('load', function() {
        fadeInOnScroll();
        // Forzar un re-render para asegurar que las imágenes dinámicas se animen
        setTimeout(fadeInOnScroll, 100);
    });
    window.addEventListener('scroll', fadeInOnScroll);

    // Mejoras de accesibilidad para el modal
    const modalFullscreen = document.getElementById('modalFullscreen');
    if (modalFullscreen) {
        modalFullscreen.addEventListener('shown.bs.modal', function() {
            const closeButton = this.querySelector('.btn-close');
            if (closeButton) {
                closeButton.focus();
            }
        });

        // Añadir botones de navegación al modal para mejor accesibilidad
        const modalBody = this.querySelector('.modal-body');
        if (modalBody) {
            const prevButton = document.createElement('button');
            prevButton.className = 'btn btn-nav btn-nav-prev';
            prevButton.innerHTML = '‹';
            prevButton.setAttribute('aria-label', 'Imagen anterior');
            prevButton.addEventListener('click', () => cambiarImagen(-1));

            const nextButton = document.createElement('button');
            nextButton.className = 'btn btn-nav btn-nav-next';
            nextButton.innerHTML = '›';
            nextButton.setAttribute('aria-label', 'Imagen siguiente');
            nextButton.addEventListener('click', () => cambiarImagen(1));

            modalBody.appendChild(prevButton);
            modalBody.appendChild(nextButton);
        }
    }

    // ===== FORMULARIO DE CONSULTA CON WEBHOOK =====
    initializeForm();

    console.log('Florería Camelia - Página cargada correctamente con imágenes dinámicas y mejoras de accesibilidad');
});

// Prevenir comportamientos no deseados en dispositivos táctiles
document.addEventListener('touchstart', function(e) {
    if (e.touches.length > 1) {
        e.preventDefault();
    }
}, { passive: false });

let lastTouchEnd = 0;
document.addEventListener('touchend', function(e) {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        e.preventDefault();
    }
    lastTouchEnd = now;
}, false);

// ===== SISTEMA DE FORMULARIO =====

// Configuración del webhook
const WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbwTjExuCQVnePWMrmyKmc1rXivzygv7i5Weaf79aVVd6BuDNls2vRbKDAW6qnYVSn5PhA/exec';

// Función principal de inicialización del formulario
function initializeForm() {
    const formConsulta = document.getElementById('formConsulta');
    const mensajeExito = document.getElementById('mensajeExito');
    const mensajeError = document.getElementById('mensajeError');
    if (!formConsulta) return;

    // Validación de Bootstrap
    formConsulta.addEventListener('submit', function(e) {
        e.preventDefault();
        e.stopPropagation();

        // Ocultar mensajes previos
        if (mensajeExito) mensajeExito.classList.add('d-none');
        if (mensajeError) mensajeError.classList.add('d-none');

        // Validar formulario
        if (!formConsulta.checkValidity()) {
            formConsulta.classList.add('was-validated');
            return;
        }

        // Mostrar spinner y deshabilitar botón
        const submitBtn = formConsulta.querySelector('button[type="submit"]');
        const spinner = submitBtn.querySelector('.spinner-border');
        submitBtn.disabled = true;
        spinner.classList.remove('d-none');

        // Recopilar datos del formulario
        const formData = new FormData(formConsulta);
        const data = {
            timestamp: new Date().toISOString(),
            nombre: formData.get('nombre'),
            telefono: formData.get('telefono'),
            email: formData.get('email'),
            servicio: formData.get('servicio'),
            mensaje: formData.get('mensaje'),
            source: 'Florería Camelia Website',
            idioma: 'es-UY'
        };

        // Enviar datos al webhook de Google
        enviarConsulta(data)
            .then(response => {
                // Mostrar mensaje de éxito
                if (mensajeExito) {
                    mensajeExito.classList.remove('d-none');
                    // Scroll suave al mensaje de éxito
                    mensajeExito.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'center' 
                    });
                }
                formConsulta.reset();
                formConsulta.classList.remove('was-validated');
            })
            .catch(error => {
                console.error('Error al enviar consulta:', error);
                if (mensajeError) {
                    mensajeError.classList.remove('d-none');
                    // Scroll suave al mensaje de error
                    mensajeError.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'center' 
                    });
                }
            })
            .finally(() => {
                // Restaurar botón
                submitBtn.disabled = false;
                spinner.classList.add('d-none');
            });
    });

    // Resetear validación al cambiar campos
    const inputs = formConsulta.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.checkValidity()) {
                this.classList.remove('is-invalid');
                this.classList.add('is-valid');
            } else {
                this.classList.remove('is-valid');
                this.classList.add('is-invalid');
            }
        });
    });

    // Validación personalizada para teléfono
    const telefonoInput = document.getElementById('telefono');
    if (telefonoInput) {
        telefonoInput.addEventListener('input', function(e) {
            // Permitir solo números, espacios, +, - y ()
            this.value = this.value.replace(/[^\d\s+\-()]/g, '');
            
            // Validar formato básico de teléfono
            const telefonoRegex = /^[\d\s+\-()]{8,20}$/;
            if (this.value && !telefonoRegex.test(this.value)) {
                this.setCustomValidity(getValidationMessage('telefono_invalido'));
            } else {
                this.setCustomValidity('');
            }
        });
    }

    // Validación para email
    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.addEventListener('input', function(e) {
            if (this.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(this.value)) {
                    this.setCustomValidity(getValidationMessage('email_invalido'));
                } else {
                    this.setCustomValidity('');
                }
            } else {
                this.setCustomValidity('');
            }
        });
    }

}

// Función para enviar consulta al webhook
async function enviarConsulta(data) {
    try {
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
            mode: 'no-cors'
        });
        return Promise.resolve();
    } catch (error) {
        console.error('Error en enviarConsulta:', error);
        return Promise.reject(error);
    }
}

// Función para obtener mensajes de validación
function getValidationMessage(key) {
    const defaultMessages = {
        'telefono_invalido': 'Por favor ingresa un número de teléfono válido',
        'email_invalido': 'Por favor ingresa un email válido'
    };
    
    return defaultMessages[key] || key;
}
