// ============================================================
// NEIL JHAVERI — PORTFOLIO SCRIPT
// Motion library (esm.sh CDN) for all animations
// ============================================================

import { animate, inView, stagger } from 'https://esm.sh/motion';

const qs = (s, ctx = document) => ctx.querySelector(s);
const qsa = (s, ctx = document) => [...ctx.querySelectorAll(s)];

// ═══════════ NAV — SCROLL BEHAVIOUR & DYNAMIC ISLAND ═══════════
const nav = qs('#nav');
const navIsland = qs('.nav-island');
const navDots = qs('#nav-dots');
const mobileNav = qs('#mobile-nav');

if (nav) {
    nav.classList.add('state-expanded');
}

window.addEventListener('scroll', () => {
    if (!nav) return;
    if (window.scrollY > 60) {
        if (nav.classList.contains('state-expanded')) {
            nav.classList.remove('state-expanded');
            nav.classList.add('state-collapsed');
        }
    } else {
        if (nav.classList.contains('state-collapsed')) {
            nav.classList.remove('state-collapsed');
            nav.classList.remove('state-active');
            nav.classList.add('state-expanded');
        }
    }
}, { passive: true });

if (navDots) {
    navDots.addEventListener('click', (e) => {
        e.stopPropagation();
        if (window.innerWidth <= 680) {
            if (mobileNav) mobileNav.classList.toggle('open');
        } else {
            if (nav.classList.contains('state-collapsed')) {
                nav.classList.toggle('state-active');
            }
        }
    });
}

if (navIsland) {
    navIsland.addEventListener('mouseenter', () => {
        if (nav.classList.contains('state-collapsed')) {
            nav.classList.add('state-active');
        }
    });

    navIsland.addEventListener('mouseleave', () => {
        if (nav.classList.contains('state-collapsed')) {
            nav.classList.remove('state-active');
        }
    });
}

// Active section highlight
const navLinks = qsa('.nav-links a[data-section]');
const sections = qsa('section[id]');

const sectionObs = new IntersectionObserver(
    (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navLinks.forEach(a => a.classList.toggle('active', a.dataset.section === id));
            }
        });
    },
    { rootMargin: '-40% 0px -40% 0px', threshold: 0 }
);
sections.forEach(s => sectionObs.observe(s));

// Smooth scroll
qsa('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const target = qs(a.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
        closeMobileNav();
    });
});

// ═══════════ MOBILE NAV ═══════════
function closeMobileNav() {
    if (mobileNav) mobileNav.classList.remove('open');
}

// ═══════════ HERO ENTRANCE ═══════════
const heroEls = [
    qs('.hero-greeting'),
    qs('.hero-title'),
    qs('.hero-sub'),
    qs('.hero-footer'),
].filter(Boolean);

animate(
    heroEls,
    { opacity: [0, 1], y: [40, 0] },
    {
        duration: 0.7,
        type: 'spring',
        stiffness: 80,
        damping: 18,
        delay: stagger(0.14, { startDelay: 0.15 }),
    }
);

const heroImg = qs('.hero-image-wrap');
if (heroImg) {
    animate(
        heroImg,
        { opacity: [0, 1], x: [60, 0], scale: [0.96, 1] },
        {
            duration: 1.0,
            type: 'spring',
            stiffness: 65,
            damping: 17,
            delay: 0.45
        }
    );
}

// ═══════════ SECTION DIVIDERS REVEAL ═══════════
qsa('.section-divider').forEach(el => {
    inView(el, () => {
        animate(el, { opacity: [0, 1], scale: [0.8, 1] },
            { duration: 0.5, easing: 'ease-out' });
    });
});

// ═══════════ SECTION TAGS & HEADINGS ═══════════
qsa('.section-tag').forEach(el => {
    inView(el, () => {
        animate(el, { opacity: [0, 1], x: [-16, 0] },
            { duration: 0.5, easing: 'ease-out' });
    });
});

qsa('.section-heading').forEach(el => {
    inView(el, () => {
        animate(el, { opacity: [0, 1], y: [24, 0] },
            { duration: 0.65, easing: 'ease-out' });
    });
});

qsa('.section-subtext').forEach(el => {
    inView(el, () => {
        animate(el, { opacity: [0, 1], y: [16, 0] },
            { duration: 0.55, easing: 'ease-out' });
    });
});

// ═══════════ WHAT I DO ═══════════
inView('.whatido-text', (info) => {
    animate(info.target, { opacity: [0, 1], y: [32, 0] },
        { duration: 0.7, easing: 'ease-out' });
});

qsa('.stat-block').forEach((el, i) => {
    inView(el, () => {
        animate(el, { opacity: [0, 1], y: [28, 0] },
            { duration: 0.6, easing: 'ease-out', delay: i * 0.15 });
    }, { amount: 0.3 });
});

// ═══════════ SKILLS PILLS ═══════════
qsa('.skill-category').forEach(group => {
    inView(group, () => {
        animate(
            qsa('.pill', group),
            { opacity: [0, 1], y: [12, 0], scale: [0.95, 1] },
            {
                duration: 0.4,
                type: 'spring',
                stiffness: 100,
                damping: 20,
                delay: stagger(0.06),
            }
        );
    }, { amount: 0.2 });
});

// Pill hover
qsa('.pill').forEach(pill => {
    pill.addEventListener('mouseenter', () => {
        animate(pill, { scale: 1.06 }, { duration: 0.15, type: 'spring', stiffness: 300, damping: 18 });
    });
    pill.addEventListener('mouseleave', () => {
        animate(pill, { scale: 1 }, { duration: 0.18, type: 'spring', stiffness: 300, damping: 22 });
    });
});

// ═══════════ PROJECT CARDS ═══════════
qsa('.project-card').forEach((card, i) => {
    inView(card, () => {
        animate(card, { opacity: [0, 1], y: [40, 0], scale: [0.97, 1] },
            {
                duration: 0.6,
                type: 'spring',
                stiffness: 80,
                damping: 18,
                delay: i * 0.08,
            });
    }, { amount: 0.15 });
});

// Card hover
qsa('.project-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        animate(card, { y: -6, scale: 1.01 },
            { duration: 0.25, type: 'spring', stiffness: 200, damping: 20 });
    });
    card.addEventListener('mouseleave', () => {
        animate(card, { y: 0, scale: 1 },
            { duration: 0.3, type: 'spring', stiffness: 200, damping: 25 });
    });
});

// ═══════════ ABOUT ═══════════
inView('.about-polaroid', (info) => {
    animate(info.target, { opacity: [0, 1], rotate: ['-8deg', '-3deg'], scale: [0.9, 1] },
        { duration: 0.7, type: 'spring', stiffness: 70, damping: 16 });
});

inView('.about-content', (info) => {
    const children = [
        qs('.section-tag', info.target),
        qs('.about-heading', info.target),
        ...qsa('.about-text', info.target),
        qs('.about-signature', info.target),
    ].filter(Boolean);

    animate(children, { opacity: [0, 1], y: [20, 0] },
        { duration: 0.6, easing: 'ease-out', delay: stagger(0.1) });
});

// ═══════════ EXPERIENCE CARDS ═══════════
qsa('.exp-card').forEach((card, i) => {
    inView(card, () => {
        animate(card, { opacity: [0, 1], y: [30, 0] },
            { duration: 0.6, easing: 'ease-out', delay: i * 0.12 });
    }, { amount: 0.2 });
});

// ═══════════ EDUCATION ═══════════
inView('.edu-layout', (info) => {
    const mainCard = qs('.edu-main-card', info.target);
    const miniCards = qsa('.edu-mini-card', info.target);
    if (mainCard) {
        animate(mainCard, { opacity: [0, 1], y: [32, 0], scale: [0.97, 1] },
            { duration: 0.7, type: 'spring', stiffness: 80, damping: 18 });
    }
    if (miniCards.length > 0) {
        animate(miniCards, { opacity: [0, 1], y: [24, 0] },
            { duration: 0.6, type: 'spring', stiffness: 80, damping: 18, delay: stagger(0.1, { startDelay: 0.15 }) });
    }
});

// ═══════════ CONTACT ═══════════
inView('.contact-box', (info) => {
    const children = [
        qs('.section-tag', info.target),
        qs('.contact-heading', info.target),
        qs('.contact-sub', info.target),
        qs('.contact-actions', info.target),
        qs('.contact-links', info.target),
    ].filter(Boolean);

    animate(children, { opacity: [0, 1], y: [24, 0] },
        { duration: 0.6, easing: 'ease-out', delay: stagger(0.1) });
});

// ═══════════ BUTTON HOVERS ═══════════
qsa('.btn').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
        animate(btn, { scale: 1.04 }, { duration: 0.15, type: 'spring', stiffness: 350, damping: 20 });
    });
    btn.addEventListener('mouseleave', () => {
        animate(btn, { scale: 1 }, { duration: 0.18, type: 'spring', stiffness: 350, damping: 28 });
    });
});

// ═══════════ NAV ISLAND HOVER ═══════════
const island = qs('.nav-island');
if (island) {
    island.addEventListener('mouseenter', () => {
        animate(island, { scale: 1.02 }, { duration: 0.2, type: 'spring', stiffness: 300, damping: 22 });
    });
    island.addEventListener('mouseleave', () => {
        animate(island, { scale: 1 }, { duration: 0.25, type: 'spring', stiffness: 300, damping: 26 });
    });
}

// ═══════════ TYPEWRITER INTERACTION ═══════════
function initTypewriter(targetEl, wordsArray) {
    if (!targetEl) return;

    let wordIndex = 0;
    let isDeleting = false;
    let text = wordsArray[0];

    function type() {
        const currentWord = wordsArray[wordIndex];

        if (isDeleting) {
            text = currentWord.substring(0, text.length - 1);
        } else {
            text = currentWord.substring(0, text.length + 1);
        }

        targetEl.textContent = text;

        let typeSpeed = isDeleting ? 50 : 120 + Math.random() * 50;

        if (!isDeleting && text === currentWord) {
            typeSpeed = 2200; // Pause at end of word
            isDeleting = true;
        } else if (isDeleting && text === '') {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % wordsArray.length;
            typeSpeed = 600; // Pause before typing new word
        }

        setTimeout(type, typeSpeed);
    }

    // Begin typing sequence
    setTimeout(type, 1800);
}

// Start typing sequences for both sections
const heroTitleTarget = qs('.hero-title-script');
if (heroTitleTarget) {
    initTypewriter(heroTitleTarget, ["developer", "engineer", "creator", "architect"]);
}

const whatIDoTarget = qs('.accent-word');
if (whatIDoTarget) {
    initTypewriter(whatIDoTarget, ["understand", "love", "use", "value"]);
}
