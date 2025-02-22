// Animação suave do scroll para os links do menu
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerHeight = document.querySelector('header').offsetHeight;
            const elementPosition = target.offsetTop;
            window.scrollTo({
                top: elementPosition - headerHeight,
                behavior: 'smooth'
            });
        }
    });
});

// Adicionar efeito de transparência na navbar ao rolar
function handleScroll() {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

window.addEventListener('scroll', handleScroll);

// Menu Mobile
const menuButton = document.querySelector('.menu-mobile-button');
const menuMobile = document.querySelector('.menu-mobile');
const header = document.querySelector('header');

menuButton.addEventListener('click', () => {
    menuMobile.classList.toggle('active');
    menuButton.classList.toggle('active');
});

// Header scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Smooth scroll para links internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerHeight = document.querySelector('header').offsetHeight;
            const elementPosition = target.offsetTop;
            window.scrollTo({
                top: elementPosition - headerHeight,
                behavior: 'smooth'
            });
        }
        
        // Fecha o menu mobile se estiver aberto
        if (menuMobile.classList.contains('active')) {
            menuMobile.classList.remove('active');
            menuButton.classList.remove('active');
        }
    });
});

// Animação do contador de clientes
function animateCounter(element, end, duration) {
    let start = 0;
    const increment = end / (duration / 16);
    
    function updateCount() {
        start += increment;
        if (start < end) {
            element.textContent = `+${Math.floor(start)} clientes satisfeitos`;
            requestAnimationFrame(updateCount);
        } else {
            element.textContent = `+${end} clientes satisfeitos`;
        }
    }
    
    updateCount();
}

// Observer para iniciar animações quando elementos ficarem visíveis
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            if (entry.target.classList.contains('clients')) {
                const counter = entry.target.querySelector('span');
                animateCounter(counter, 60, 2000);
            }
            entry.target.classList.add('animate');
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1
});

// Observar elementos que precisam de animação
document.querySelectorAll('.clients, .hero-content, .hero-image').forEach(el => {
    observer.observe(el);
});

// FAQ Accordion
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
        const faqItem = question.parentElement;
        const isActive = faqItem.classList.contains('active');
        
        // Fecha todos os itens
        document.querySelectorAll('.faq-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Abre o item clicado se não estava ativo
        if (!isActive) {
            faqItem.classList.add('active');
        }
    });
});

// Formulário de Contato
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitButton = contactForm.querySelector('.btn-submit');
        const messageDiv = contactForm.querySelector('.form-message');
        
        submitButton.disabled = true;
        submitButton.textContent = 'Enviando...';
        
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        const API_URL = 'https://seu-backend.onrender.com';
        
        try {
            const response = await fetch(`${API_URL}/api/contact/send`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao enviar mensagem');
            }
            
            const result = await response.json();
            
            // Mostrar mensagem de sucesso
            messageDiv.textContent = 'Mensagem enviada com sucesso!';
            messageDiv.className = 'form-message success show';
            contactForm.reset();
            
            // Limpar mensagem após 5 segundos
            setTimeout(() => {
                messageDiv.className = 'form-message';
            }, 5000);
            
        } catch (error) {
            console.error('Erro:', error);
            
            // Mostrar mensagem de erro
            messageDiv.textContent = error.message || 'Erro ao enviar mensagem. Tente novamente mais tarde.';
            messageDiv.className = 'form-message error show';
            
            // Limpar mensagem após 5 segundos
            setTimeout(() => {
                messageDiv.className = 'form-message';
            }, 5000);
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Enviar Mensagem';
        }
    });
}

// Animações ao Scroll
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        
        if (elementTop < window.innerHeight && elementBottom > 0) {
            element.classList.add('animate');
        }
    });
};

window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll);

// Adiciona classe para animação em elementos
document.querySelectorAll('.portfolio-item, .service-card, .pricing-card, .pillar').forEach(el => {
    el.classList.add('animate-on-scroll');
});

// Configuração do ScrollReveal
const sr = ScrollReveal({
    origin: 'bottom',
    distance: '60px',
    duration: 1000,
    delay: 200,
    reset: false
});

// Hero Section
sr.reveal('.hero-content', {
    origin: 'left',
    delay: 100
});
sr.reveal('.hero-image', {
    origin: 'right',
    delay: 300
});

// Metodologia
sr.reveal('.methodology h2', { delay: 100 });
sr.reveal('.methodology h3', { delay: 200 });
sr.reveal('.pillar', {
    delay: 200,
    interval: 100
});

// Portfolio
sr.reveal('.portfolio h2', { delay: 100 });
sr.reveal('.portfolio h3', { delay: 200 });
sr.reveal('.portfolio-item', {
    delay: 200,
    interval: 100
});

// Serviços
sr.reveal('.services h2', { delay: 100 });
sr.reveal('.services h3', { delay: 200 });
sr.reveal('.service-card', {
    delay: 200,
    interval: 100
});

// FAQ
sr.reveal('.faq h2', { delay: 100 });
sr.reveal('.faq h3', { delay: 200 });
sr.reveal('.faq-item', {
    delay: 200,
    interval: 100
});

// Contato
sr.reveal('.contact h2', { delay: 100 });
sr.reveal('.contact h3', { delay: 200 });
sr.reveal('.contact-info', {
    origin: 'left',
    delay: 300
});
sr.reveal('.contact-form', {
    origin: 'right',
    delay: 400
});

// Footer
sr.reveal('.footer-logo', { delay: 100 });
sr.reveal('.footer-links', {
    delay: 200,
    interval: 100
});
sr.reveal('.footer-bottom', { delay: 300 });

// Remover toda a classe do carrossel
class TestimonialsCarousel {
    // ... remover toda a classe
}

// Remover a inicialização do carrossel
document.addEventListener('DOMContentLoaded', () => {
    new TestimonialsCarousel();
});

// Remover as animações do ScrollReveal relacionadas aos depoimentos
sr.reveal('.testimonials h2', { delay: 100 });
sr.reveal('.testimonials h3', { delay: 200 });
sr.reveal('.testimonial-card', {
    delay: 200,
    interval: 100
});

// Botão Voltar ao Topo
const backToTopButton = document.getElementById('backToTop');

// Função para verificar a posição do scroll
function toggleBackToTopButton() {
    const scrollPosition = window.pageYOffset;
    const pageHeight = document.documentElement.scrollHeight;
    const viewportHeight = window.innerHeight;
    const halfwayPoint = (pageHeight - viewportHeight) / 2;

    if (scrollPosition > halfwayPoint) {
        backToTopButton.classList.add('show');
    } else {
        backToTopButton.classList.remove('show');
    }
}

// Função para rolar suavemente ao topo
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Event listeners
window.addEventListener('scroll', toggleBackToTopButton);
backToTopButton.addEventListener('click', scrollToTop);

// Adicionar lazy loading para imagens
document.querySelectorAll('img').forEach(img => {
    img.loading = 'lazy';
    img.decoding = 'async';
});

// Otimizar animações
const animationOptions = {
    threshold: 0.1,
    rootMargin: '50px'
}; 