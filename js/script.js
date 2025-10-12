// JavaScript para Florería Camelia
document.addEventListener('DOMContentLoaded', function() {
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
    
    // Función para generar imágenes dinámicamente
    function generarImagenes() {
        // Array de imágenes disponibles (del 9 al 1, ordenadas de mayor a menor)
        const imagenes = [
            { numero: 16, formato: 'jpeg' },
            { numero: 15, formato: 'jpeg' },
            { numero: 14, formato: 'jpg' },
            { numero: 13, formato: 'jpg' },
            { numero: 12, formato: 'jpg' },
            { numero: 11, formato: 'jpg' },
            { numero: 10, formato: 'jpg' },
            { numero: 9, formato: 'jpg' },
            { numero: 8, formato: 'jpg' },
            { numero: 7, formato: 'jpg' },
            { numero: 6, formato: 'jpg' },
            { numero: 5, formato: 'jpg' },
            { numero: 4, formato: 'jpg' },
            { numero: 3, formato: 'jpg' },
            { numero: 2, formato: 'jpg' },
            { numero: 1, formato: 'jpg' }
        ];

        // Contenedor de Instagram
        const instagramFeed = document.getElementById('instagramFeed');

        // Limpiar contenedor existente
        if (instagramFeed) instagramFeed.innerHTML = '';

        // Generar imágenes para Instagram (todas las imágenes)
        imagenes.forEach((imagen, index) => {
            const imgPath = `/img/${imagen.numero}.${imagen.formato}`;
            
            // Crear elemento para Instagram
            const instagramPost = document.createElement('div');
            instagramPost.className = 'instagram-post';
            instagramPost.innerHTML = `
                <img src="${imgPath}" 
                     alt="Trabajo ${imagen.numero} - Florería Camelia" 
                     loading="lazy"
                     onerror="this.src='/img/placeholder.jpg'">
            `;
            
            if (instagramFeed) {
                instagramFeed.appendChild(instagramPost);
            }
        });

        console.log('Imágenes generadas dinámicamente:', imagenes.length);
    }

    // Scroll animations
    const fadeElements = document.querySelectorAll('.card, .section-title, .instagram-post');
    
    const fadeInOnScroll = function() {
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
    
    // Efectos hover para elementos interactivos
    const interactiveElements = document.querySelectorAll('.card, .btn, .social-item, .contact-item, .instagram-post');
    interactiveElements.forEach(element => {
        element.style.cursor = 'pointer';
    });
    
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
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
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

    console.log('Florería Camelia - Página cargada correctamente con imágenes dinámicas');
});