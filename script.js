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

// Header scroll effect
function handleHeaderScroll() {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

window.addEventListener('scroll', handleHeaderScroll);

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

document.addEventListener('DOMContentLoaded', function() {
    // Elementos do menu mobile
    const menuButton = document.querySelector('.menu-mobile-button');
    const menuMobile = document.querySelector('.menu-mobile');
    
    // Toggle do menu ao clicar no botão
    menuButton.addEventListener('click', function() {
        menuButton.classList.toggle('active');
        menuMobile.classList.toggle('active');
    });

    // Adicionar efeito de hover no botão CTA
    const ctaButton = document.querySelector('.cta-button');
    
    ctaButton.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        this.style.setProperty('--mouse-x', x + 'px');
        this.style.setProperty('--mouse-y', y + 'px');
    });
});

// Botão Voltar ao Topo
const backToTopButton = document.querySelector('.back-to-top');

// Função para verificar a posição do scroll
function toggleBackToTopButton() {
    if (window.pageYOffset > 300) {
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