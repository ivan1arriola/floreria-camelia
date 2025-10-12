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
    
    // Check on load and scroll
    window.addEventListener('load', fadeInOnScroll);
    window.addEventListener('scroll', fadeInOnScroll);
    
    // Carrusel enhancements
    const carousel = document.querySelector('#galleryCarousel');
    if (carousel) {
        carousel.addEventListener('slide.bs.carousel', function() {
            const activeItems = this.querySelectorAll('.carousel-item');
            activeItems.forEach(item => {
                item.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            });
        });
    }
    
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
            flor.style.transform = `translateY(${yPos}px)`;
        });
    });
    
    console.log('Florería Camelia - Página cargada con diseño mejorado');
});