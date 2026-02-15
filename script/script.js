// ==========================
// AUTOR:(NETO FRAZAO)
// ==========================

// ==========================
// CONFIGURAÇÕES GERAIS
// ==========================

// Número de WhatsApp (apenas dígitos, com DDI e DDD)
const WHATSAPP_NUMBER = '5511999999999';

// ==========================
// UTILITÁRIOS
// ==========================

/**
 * Rolagem suave para um alvo
 */
function smoothScrollTo(targetId) {
    const target = document.querySelector(targetId);
    if (!target) return;

    target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

/**
 * Validação simples de e-mail
 */
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

/**
 * Máscara de telefone brasileiro
 */
function applyPhoneMask(value) {
    let digits = value.replace(/\D/g, '').slice(0, 11);

    if (digits.length <= 10) {
        // Formato (00) 0000-0000
        digits = digits.replace(/^(\d{2})(\d)/g, '($1) $2');
        digits = digits.replace(/(\d{4})(\d)/, '$1-$2');
    } else {
        // Formato (00) 00000-0000
        digits = digits.replace(/^(\d{2})(\d)/g, '($1) $2');
        digits = digits.replace(/(\d{5})(\d)/, '$1-$2');
    }

    return digits;
}

// ==========================
// MENU RESPONSIVO
// ==========================

document.addEventListener('DOMContentLoaded', function () {
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function () {
            menuToggle.classList.toggle('open');
            mainNav.classList.toggle('open');
        });

        // Fechar o menu ao clicar em um link
        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('open');
                mainNav.classList.remove('open');
            });
        });
    }
});

// ==========================
// SCROLL SUAVE PARA LINKS
// ==========================

document.addEventListener('click', function (event) {
    const link = event.target.closest('a.scroll-link, a.nav-link');
    if (!link) return;

    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
        event.preventDefault();
        smoothScrollTo(href);
    }
});

// ==========================
// REALCE DINÂMICO DO MENU
// ==========================

document.addEventListener('DOMContentLoaded', function () {
    const sections = document.querySelectorAll('main section[id]');
    const navLinks = document.querySelectorAll('.main-nav a.nav-link');

    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const id = entry.target.getAttribute('id');
            navLinks.forEach(link => {
                link.classList.toggle(
                    'active',
                    link.getAttribute('href') === `#${id}`
                );
            });
        });
    }, {
        threshold: 0.4
    });

    sections.forEach(section => observer.observe(section));
});

// ==========================
// ANIMAÇÕES AO ROLAR
// ==========================

document.addEventListener('DOMContentLoaded', function () {
    const animatedElements = document.querySelectorAll('[data-animate]');

    if (!('IntersectionObserver' in window)) {
        // Fallback: exibe todos
        animatedElements.forEach(el => el.classList.add('animated'));
        return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('animated');
            obs.unobserve(entry.target);
        });
    }, {
        threshold: 0.2
    });

    animatedElements.forEach(el => observer.observe(el));
});

// ==========================
// CONTADORES ANIMADOS
// ==========================

document.addEventListener('DOMContentLoaded', function () {
    const counters = document.querySelectorAll('.counter');
    const resultsSection = document.querySelector('#resultados');
    let countersStarted = false;

    function animateCounters() {
        counters.forEach(counter => {
            const target = Number(counter.dataset.target) || 0;
            const duration = 1600;
            const startTime = performance.now();

            function update(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const value = Math.floor(progress * target);
                counter.textContent = value.toString();

                if (progress < 1) {
                    requestAnimationFrame(update);
                } else {
                    counter.textContent = target.toString();
                }
            }

            requestAnimationFrame(update);
        });
    }

    if (!resultsSection || counters.length === 0) return;

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !countersStarted) {
                    countersStarted = true;
                    animateCounters();
                    obs.unobserve(resultsSection);
                }
            });
        }, {
            threshold: 0.4
        });

        observer.observe(resultsSection);
    } else {
        // Fallback: inicia automaticamente
        animateCounters();
    }
});

// ==========================
// FAQ INTERATIVO
// ==========================

document.addEventListener('DOMContentLoaded', function () {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        questionBtn.addEventListener('click', () => {
            // Fecha outros
            faqItems.forEach(other => {
                if (other !== item) {
                    other.classList.remove('open');
                }
            });

            // Alterna atual
            item.classList.toggle('open');
        });
    });
});

// ==========================
// FORMULÁRIO DE AGENDAMENTO
// ==========================

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('agendamentoForm');
    const phoneInput = document.getElementById('telefone');
    const messageBox = document.getElementById('formMessage');
    const yearSpan = document.getElementById('year');
    const planSelectors = document.querySelectorAll('.plan-select');
    const planSelectField = document.getElementById('planoInteresse');
    const serviceButtons = document.querySelectorAll('.service-more');

    // Atualiza ano no rodapé
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear().toString();
    }

    // Máscara de telefone
    if (phoneInput) {
        phoneInput.addEventListener('input', function () {
            this.value = applyPhoneMask(this.value);
        });
    }

    // Preencher plano de interesse ao clicar em botões dos planos
    planSelectors.forEach(btn => {
        btn.addEventListener('click', () => {
            const plan = btn.dataset.plan || '';
            if (planSelectField) {
                planSelectField.value = plan;
            }
            // Rolagem para o formulário
            smoothScrollTo('#agendamento');
        });
    });

    // Preencher objetivo ao clicar em "Saiba mais" dos serviços
    const objectiveSelect = document.getElementById('objetivo');
    serviceButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const serviceName = btn.dataset.service;
            if (objectiveSelect) {
                // Seleciona a opção que corresponda ao serviço, se existir
                Array.from(objectiveSelect.options).forEach(opt => {
                    if (opt.value === serviceName) {
                        objectiveSelect.value = opt.value;
                    }
                });
            }
            smoothScrollTo('#agendamento');
        });
    });

    if (!form) return;

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        // Limpar mensagens de erro anteriores
        const errorMessages = form.querySelectorAll('.error-message');
        errorMessages.forEach(msg => {
            msg.textContent = '';
        });

        messageBox.className = 'form-message';
        messageBox.style.display = 'none';
        messageBox.textContent = '';

        // Coleta de campos
        const nome = form.nome.value.trim();
        const telefone = form.telefone.value.trim();
        const email = form.email.value.trim();
        const objetivo = form.objetivo.value.trim();
        const disponibilidade = form.disponibilidade.value.trim();
        const planoInteresse = form.planoInteresse.value.trim();

        let isValid = true;

        // Validações simples
        if (!nome) {
            const msg = form.querySelector('#nome + .error-message');
            if (msg) msg.textContent = 'Informe seu nome completo.';
            isValid = false;
        }

        if (!telefone || telefone.replace(/\D/g, '').length < 10) {
            const msg = form.querySelector('#telefone + .error-message');
            if (msg) msg.textContent = 'Informe um telefone/WhatsApp válido.';
            isValid = false;
        }

        if (!email || !isValidEmail(email)) {
            const msg = form.querySelector('#email + .error-message');
            if (msg) msg.textContent = 'Informe um e-mail válido.';
            isValid = false;
        }

        if (!objetivo) {
            const msg = form.querySelector('#objetivo + .error-message');
            if (msg) msg.textContent = 'Selecione seu objetivo principal.';
            isValid = false;
        }

        if (!disponibilidade) {
            const msg = form.querySelector('#disponibilidade + .error-message');
            if (msg) msg.textContent = 'Informe sua disponibilidade de horário.';
            isValid = false;
        }

        if (!isValid) {
            messageBox.style.display = 'block';
            messageBox.classList.add('error');
            messageBox.textContent = 'Revise os campos obrigatórios antes de enviar.';
            return;
        }

        // Simulação de envio (sem backend)
        messageBox.style.display = 'block';
        messageBox.classList.add('success');

        // Monta mensagem para WhatsApp
        const waMessage =
            `Olá Rafael, meu nome é ${nome}.%0A` +
            `Telefone/WhatsApp: ${telefone}.%0A` +
            `E-mail: ${email}.%0A` +
            `Objetivo principal: ${objetivo}.%0A` +
            `Disponibilidade de horário: ${disponibilidade}.%0A` +
            (planoInteresse ? `Plano de interesse: ${planoInteresse}.%0A` : '') +
            `%0AGostaria de agendar uma avaliação física.`;

        const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${waMessage}`;

        messageBox.innerHTML =
            'Sua solicitação foi registrada com sucesso. ' +
            'Para finalizar o contato, clique no botão abaixo e continue pelo WhatsApp:<br><br>' +
            `<a href="${waUrl}" target="_blank" rel="noopener" class="btn btn-outline">Continuar no WhatsApp</a>`;

        // Opcional: limpar campos (exceto plano de interesse)
        form.nome.value = '';
        form.telefone.value = '';
        form.email.value = '';
        form.objetivo.value = '';
        form.disponibilidade.value = '';
    });
});