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
    { threshold: 0.12 }
);
document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

// ===== Année du footer =====
document.getElementById('year').textContent = new Date().getFullYear();

// ===== Lightbox des visuels =====
const lightbox = document.getElementById('shot-lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
let lastShotTrigger = null;

const openLightbox = (btn) => {
    const thumb = btn.querySelector('img');
    lightboxImg.src = btn.dataset.shot;
    lightboxImg.alt = thumb ? thumb.alt : '';
    lightboxCaption.textContent = btn.dataset.shotCaption || '';
    lastShotTrigger = btn;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
};
const closeLightbox = () => {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastShotTrigger) lastShotTrigger.focus();
};

document.querySelectorAll('.cs-zoom').forEach((btn) =>
    btn.addEventListener('click', () => openLightbox(btn))
);
lightbox.querySelectorAll('[data-shot-close]').forEach((el) =>
    el.addEventListener('click', closeLightbox)
);
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
});
