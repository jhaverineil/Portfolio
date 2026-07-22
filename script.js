// ============================================================
// NEIL JHAVERI — PORTFOLIO SCRIPT
// Motion library (esm.sh CDN) for all animations
// ============================================================

import { animate, inView, stagger } from 'https://esm.sh/motion';

const qs = (s, ctx = document) => ctx.querySelector(s);
const qsa = (s, ctx = document) => [...ctx.querySelectorAll(s)];

// ═══════════ CUSTOM CURSOR ═══════════
const cursorDot = qs('#cursor-dot');
const cursorRing = qs('#cursor-ring');
let ringX = 0, ringY = 0;
let dotX = 0, dotY = 0;

if (cursorDot && cursorRing && window.matchMedia('(hover: hover)').matches) {
    document.addEventListener('mousemove', (e) => {
        dotX = e.clientX;
        dotY = e.clientY;
        if (cursorDot) {
            cursorDot.style.left = dotX + 'px';
            cursorDot.style.top = dotY + 'px';
        }
    });

    function animateRing() {
        ringX += (dotX - ringX) * 0.12;
        ringY += (dotY - ringY) * 0.12;
        if (cursorRing) {
            cursorRing.style.left = ringX + 'px';
            cursorRing.style.top = ringY + 'px';
        }
        requestAnimationFrame(animateRing);
    }
    animateRing();

    // Scale ring on interactive elements
    qsa('a, button, [data-magnetic], .btn, .pill, .nav-links a').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorRing.style.width = '56px';
            cursorRing.style.height = '56px';
            cursorRing.style.borderColor = 'rgba(37,99,235,0.7)';
        });
        el.addEventListener('mouseleave', () => {
            cursorRing.style.width = '36px';
            cursorRing.style.height = '36px';
            cursorRing.style.borderColor = 'rgba(37,99,235,0.45)';
        });
    });
}

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
        if (nav.classList.contains('state-collapsed')) nav.classList.add('state-active');
    });
    navIsland.addEventListener('mouseleave', () => {
        if (nav.classList.contains('state-collapsed')) nav.classList.remove('state-active');
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

function closeMobileNav() {
    if (mobileNav) mobileNav.classList.remove('open');
}

// ═══════════ HERO ENTRANCE — TWO COLUMN ═══════════
// Left side staggered sequence
const heroLeftEls = [
    qs('.hero-greeting-new'),
    qs('.hero-title-new'),
    qs('.hero-sub-new'),
    qs('.hero-cta-row'),
    qs('.hero-services-strip'),
].filter(Boolean);

if (heroLeftEls.length) {
    animate(
        heroLeftEls,
        { opacity: [0, 1], y: [30, 0] },
        {
            duration: 0.65,
            type: 'spring',
            stiffness: 75,
            damping: 18,
            delay: stagger(0.13, { startDelay: 0.1 }),
        }
    );
}

// Right blob + avatar entrance
const heroRight = qs('.hero-right');
if (heroRight) {
    animate(heroRight, { opacity: [0, 1], x: [60, 0] },
        { duration: 0.9, type: 'spring', stiffness: 65, damping: 17, delay: 0.25 });
}

// Floating cards entrance with stagger
const heroFloatCards = qsa('.hero-float-card');
if (heroFloatCards.length) {
    animate(heroFloatCards, { opacity: [0, 1], scale: [0.85, 1], y: [16, 0] },
        { duration: 0.5, type: 'spring', stiffness: 100, damping: 18, delay: stagger(0.15, { startDelay: 0.7 }) });
}

// Typewriter for the new bottom word
const heroTypewriteEl = qs('#hero-typewrite-word');
if (heroTypewriteEl) {
    initTypewriter(heroTypewriteEl, ['PRODUCTS', 'PLATFORMS', 'SYSTEMS', 'SOLUTIONS']);
}

// ═══════════ MAGNETIC BUTTON ═══════════
const magneticBtns = qsa('[data-magnetic]');
magneticBtns.forEach(btn => {
    let isHovered = false;

    btn.addEventListener('mouseenter', () => { isHovered = true; });
    btn.addEventListener('mouseleave', () => {
        isHovered = false;
        animate(btn, { x: 0, y: 0 }, { duration: 0.5, type: 'spring', stiffness: 100, damping: 18 });
    });

    btn.addEventListener('mousemove', (e) => {
        if (!isHovered) return;
        const rect = btn.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) * 0.35;
        const dy = (e.clientY - cy) * 0.35;
        btn.style.transform = `translate(${dx}px, ${dy}px)`;
    });
});

// ═══════════ SCROLL-DRIVEN HORIZONTAL MARQUEE ═══════════
const marqueeSection = qs('#marquee-section');
const marqueeRow1 = qs('#marquee-row-1');
const marqueeRow2 = qs('#marquee-row-2');

if (marqueeSection && marqueeRow1 && marqueeRow2) {
    // Start at offset -200px for right row, +200 for left row
    let row1X = -200;
    let row2X = 200;

    // Set initial position
    marqueeRow1.style.transform = `translateX(${row1X}px)`;
    marqueeRow2.style.transform = `translateX(${row2X}px)`;

    window.addEventListener('scroll', () => {
        const rect = marqueeSection.getBoundingClientRect();
        const sectionTop = marqueeSection.offsetTop;
        const offset = (window.scrollY - sectionTop + window.innerHeight) * 0.25;

        row1X = offset - 200;
        row2X = -(offset - 200);

        marqueeRow1.style.transform = `translateX(${row1X}px)`;
        marqueeRow2.style.transform = `translateX(${row2X}px)`;
    }, { passive: true });
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

// ═══════════ ANIMATED STAT COUNTERS ═══════════
qsa('.stat-number[data-count]').forEach((el) => {
    const target = parseInt(el.dataset.count, 10);
    inView(el, () => {
        let start = 0;
        const duration = 1200;
        const step = (timestamp) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            el.textContent = Math.floor(eased * target) + '+';
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, { amount: 0.5 });
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

// ═══════════ STICKY-STACKING CARDS (scale on scroll past) ═══════════
const stackingCards = qsa('.stacking-card');
const totalCards = stackingCards.length;

function updateStackingCards() {
    stackingCards.forEach((card, i) => {
        const wrap = card.closest('.stacking-card-wrap');
        if (!wrap) return;

        const rect = wrap.getBoundingClientRect();
        const windowH = window.innerHeight;

        // How far past the top of the viewport is the card?
        const pastThreshold = Math.max(0, -rect.top + 96 + i * 14);
        const maxPast = 200; // px distance to reach max scale-down
        const progress = Math.min(pastThreshold / maxPast, 1);

        // Cards scale down slightly as newer cards stack on top
        const scaleDown = progress * totalCards * 0.015;
        const scale = Math.max(1 - scaleDown, 0.9);

        // Fade slightly
        const opacity = Math.max(1 - progress * 0.25, 0.75);

        card.style.transform = `scale(${scale})`;
        card.style.opacity = opacity;
    });
}

window.addEventListener('scroll', updateStackingCards, { passive: true });
updateStackingCards();

// Card hover
qsa('.project-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        animate(card, { y: -6 },
            { duration: 0.25, type: 'spring', stiffness: 200, damping: 20 });
    });
    card.addEventListener('mouseleave', () => {
        animate(card, { y: 0 },
            { duration: 0.3, type: 'spring', stiffness: 200, damping: 25 });
    });
});

// ═══════════ CHARACTER-BY-CHARACTER ABOUT TEXT REVEAL ═══════════
function wrapChars(el) {
    const text = el.innerHTML;
    // Preserve HTML tags, only wrap text nodes
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = text;

    function processNode(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            const chars = node.textContent.split('');
            const fragment = document.createDocumentFragment();
            chars.forEach(ch => {
                const span = document.createElement('span');
                span.className = 'char';
                span.textContent = ch === ' ' ? '\u00A0' : ch;
                if (ch === ' ') span.style.opacity = '1';
                fragment.appendChild(span);
            });
            node.parentNode.replaceChild(fragment, node);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            [...node.childNodes].forEach(processNode);
        }
    }

    [...tempDiv.childNodes].forEach(processNode);
    el.innerHTML = '';
    while (tempDiv.firstChild) {
        el.appendChild(tempDiv.firstChild);
    }
}

qsa('.about-animated-text').forEach(para => {
    wrapChars(para);
    const chars = qsa('.char', para);

    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                chars.forEach((ch, i) => {
                    setTimeout(() => ch.classList.add('revealed'), i * 18);
                });
                obs.unobserve(para);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -10% 0px' });

    obs.observe(para);
});

// ═══════════ ABOUT ═══════════
inView('.about-polaroid', (info) => {
    animate(info.target, { opacity: [0, 1], rotate: ['-8deg', '-3deg'], scale: [0.9, 1] },
        { duration: 0.7, type: 'spring', stiffness: 70, damping: 16 });
});

inView('.about-badge', (info) => {
    animate(info.target, { opacity: [0, 1], x: [-20, 0] },
        { duration: 0.5, easing: 'ease-out', delay: 0.3 });
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
            typeSpeed = 2200;
            isDeleting = true;
        } else if (isDeleting && text === '') {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % wordsArray.length;
            typeSpeed = 600;
        }

        setTimeout(type, typeSpeed);
    }

    setTimeout(type, 1800);
}

const heroTitleTarget = qs('.hero-title-script');
if (heroTitleTarget) {
    initTypewriter(heroTitleTarget, ["developer", "engineer", "creator", "architect"]);
}

const whatIDoTarget = qs('.accent-word');
if (whatIDoTarget) {
    initTypewriter(whatIDoTarget, ["understand", "love", "use", "value"]);
}

// ═══════════ TECH CARD ROW ENTRANCE ═══════════
inView('#marquee-section', () => {
    const cards = qsa('.tech-card');
    animate(cards, { opacity: [0, 1], y: [20, 0] },
        { duration: 0.4, easing: 'ease-out', delay: stagger(0.04) });
}, { amount: 0.1 });
