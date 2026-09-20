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

// ===== Lightbox des captures de projet =====
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

document.querySelectorAll('.shot').forEach((btn) =>
    btn.addEventListener('click', () => openLightbox(btn))
);

// ===== Carrousel des captures =====
// Les flèches sont ajoutées ici plutôt que dans le HTML : sans script,
// la bande reste défilable au doigt et au trackpad, et les vignettes
// restent atteignables au clavier puisque ce sont des boutons.
const arrow = (sens, libelle, trace) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'shots-nav shots-nav--' + sens;
    b.setAttribute('aria-label', libelle);
    b.innerHTML =
        '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' +
        trace +
        '"/></svg>';
    return b;
};

document.querySelectorAll('.project-shots').forEach((bande) => {
    const cadre = document.createElement('div');
    cadre.className = 'shots-carousel';
    bande.parentNode.insertBefore(cadre, bande);
    cadre.appendChild(bande);

    const prec = arrow('prev', 'Captures précédentes', 'M15 18l-6-6 6-6');
    const suiv = arrow('next', 'Captures suivantes', 'M9 18l6-6-6-6');
    cadre.append(prec, suiv);

    const pas = () => bande.clientWidth * 0.8;
    prec.addEventListener('click', () =>
        bande.scrollBy({ left: -pas(), behavior: 'smooth' })
    );
    suiv.addEventListener('click', () =>
        bande.scrollBy({ left: pas(), behavior: 'smooth' })
    );

    const rafraichir = () => {
        const max = bande.scrollWidth - bande.clientWidth;
        const rien = max < 4;
        prec.hidden = rien;
        suiv.hidden = rien;
        prec.disabled = bande.scrollLeft < 4;
        suiv.disabled = bande.scrollLeft > max - 4;
    };

    bande.addEventListener('scroll', rafraichir, { passive: true });
    window.addEventListener('resize', rafraichir);
    // Les images sont en chargement différé : la largeur totale change
    // après coup, il faut recalculer à ce moment-là.
    if ('ResizeObserver' in window) new ResizeObserver(rafraichir).observe(bande);
    bande.querySelectorAll('img').forEach((img) => {
        if (!img.complete) img.addEventListener('load', rafraichir, { once: true });
    });
    rafraichir();
});
lightbox.querySelectorAll('[data-shot-close]').forEach((el) =>
    el.addEventListener('click', closeLightbox)
);
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
});
