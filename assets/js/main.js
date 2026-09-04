// ===== Navigation : fond au scroll =====
const nav = document.getElementById('nav');
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ===== Menu burger (mobile) =====
const toggle = document.getElementById('nav-toggle');
const links = document.getElementById('nav-links');

toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open);
});

// Ferme le menu quand on clique sur un lien
links.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => {
        links.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
    })
);

// ===== Apparition au scroll =====
const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.15 }
);
document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

// ===== Modale d'aperçu du CV =====
const modal = document.getElementById('cv-modal');
const frame = modal.querySelector('iframe');

const openModal = () => {
    // Charge le PDF seulement à la première ouverture
    if (!frame.src) frame.src = frame.dataset.src;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
};
const closeModal = () => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
};

document.querySelectorAll('[data-cv-preview]').forEach((btn) =>
    btn.addEventListener('click', openModal)
);
modal.querySelectorAll('[data-close]').forEach((el) =>
    el.addEventListener('click', closeModal)
);
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
});

// ===== Année du footer =====
document.getElementById('year').textContent = new Date().getFullYear();
