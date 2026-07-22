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

// ═══════════ PROJECT CARDS HIGH-FIDELITY TILT & SHINE ═══════════
qsa('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();

        // Calculate relative coordinates inside the card container
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Set CSS variables representing cursor position for spotlight radial gradient
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);

        // Tilt mechanics (maximum of +/- 5 degrees on X/Y axis)
        const px = x / rect.width;
        const py = y / rect.height;
        const tiltX = (py - 0.5) * -10;
        const tiltY = (px - 0.5) * 10;

        card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-4px)`;
        card.style.zIndex = '50';
    });

    card.addEventListener('mouseenter', () => {
        card.style.transition = 'none'; // Snappy mouse tracking feel
        card.classList.add('focused-card');
    });

    card.addEventListener('mouseleave', () => {
        card.classList.remove('focused-card');
        card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease, border-color 0.3s';
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        card.style.zIndex = '';
    });
});

// ═══════════ WORD-BY-WORD ABOUT TEXT REVEAL ═══════════
function wrapWords(el) {
    const html = el.innerHTML;
    // Collapse duplicate whitespaces, tabs, and newlines first
    const cleanHtml = html.replace(/\s+/g, ' ').trim();

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = cleanHtml;

    function processNode(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            const words = node.textContent.split(' ');
            const fragment = document.createDocumentFragment();

            words.forEach((word, idx) => {
                if (word.trim() === '' && idx > 0) return;

                const span = document.createElement('span');
                span.className = 'word';
                span.textContent = word;
                fragment.appendChild(span);

                if (idx < words.length - 1) {
                    fragment.appendChild(document.createTextNode(' '));
                }
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
    wrapWords(para);
    const words = qsa('.word', para);

    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                words.forEach((w, i) => {
                    setTimeout(() => w.classList.add('revealed'), i * 25);
                });
                obs.unobserve(para);
            }
        });
    }, { threshold: 0.05, rootMargin: '0px 0px -5% 0px' });

    obs.observe(para);
});

// Staged Bento Grid Highlights Reveal
const bentoBlocks = qsa('.highlight-bento');
const bentoObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            bentoBlocks.forEach((block, i) => {
                setTimeout(() => block.classList.add('revealed'), i * 150);
            });
            bentoObs.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

const highlightsGrid = qs('.about-highlights-grid');
if (highlightsGrid) {
    bentoObs.observe(highlightsGrid);
}

// ═══════════ ABOUT PROFILE CARD MOUSE AND ENTRY INTERACTIONS ═══════════
const profileCard = qs('.about-profile-card');
if (profileCard) {
    profileCard.addEventListener('mousemove', (e) => {
        const rect = profileCard.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        profileCard.style.setProperty('--mouse-x', `${x}px`);
        profileCard.style.setProperty('--mouse-y', `${y}px`);
    });
}

inView('.about-profile-card', (info) => {
    animate(info.target, { opacity: [0, 1], scale: [0.93, 1], y: [15, 0] },
        { duration: 0.7, type: 'spring', stiffness: 90, damping: 18 });
});

inView('.about-badge', (info) => {
    animate(info.target, { opacity: [0, 1], y: [12, 0] },
        { duration: 0.5, easing: 'ease-out', delay: 0.35 });
});

// ═══════════ EXPERIENCE SECTION INTERACTIONS ═══════════

// 1. Data mapping for timeline tooltip
const expData = {
    crmone: {
        company: "CRMOne",
        role: "Software Developer · Remote",
        period: "Feb 2024 to Present",
        desc: "Building advanced SaaS CRM platforms with high security and robust workflows.",
        bullets: [
            "Built feature-rich CRM modules — workflow automation, lead management, pipeline tracking",
            "Full-stack solutions with NextJS, TypeScript, NodeJS, MongoDB and REST APIs",
            "Interactive dashboards, reporting tools, and data visualization for enterprise clients",
            "Authentication systems and role-based access control (RBAC) for multi-tenant envs"
        ]
    },
    lanet: {
        company: "La Net Team Software Solution",
        role: "Software Developer · Surat, GJ",
        period: "Jan 2021 to Feb 2024",
        desc: "Developed and shipped customer-centric SaaS portals and marketplace solutions.",
        bullets: [
            "Delivered multiple SaaS platforms and marketplace apps end-to-end",
            "Scalable REST API architectures supporting thousands of concurrent users",
            "Led full SDLC — from requirements analysis to testing and deployment",
            "Established component libraries and standards adopted across projects"
        ]
    },
    scet: {
        company: "Sarvajanik College of Engineering",
        role: "Computer Engineering Student · Surat",
        period: "Jul 2017 to Jul 2021",
        desc: "Academic foundation specializing in web technologies, data structures, and database engines.",
        bullets: [
            "Graduated with First Class with Distinction (CGPA: 8.2/10)",
            "Built university portals, booking management tools, and specialized web stacks",
            "Excelled in core coursework including Data Structures, OOPs, and DBMS"
        ]
    }
};

// 2. Scroll Reveal animations for Accordion Items
qsa('.exp-list-item').forEach((item, i) => {
    inView(item, () => {
        animate(item, { opacity: [0, 1], y: [24, 0] },
            { duration: 0.55, easing: 'ease-out', delay: i * 0.1 });
    }, { amount: 0.15 });
});

// 3. Accordion Toggle Logic
qsa('.exp-list-item').forEach(item => {
    const header = item.querySelector('.exp-list-item-header');
    const content = item.querySelector('.exp-list-item-content');
    const caret = item.querySelector('.exp-list-toggle-btn');

    if (item.classList.contains('init-expanded')) {
        item.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 'px';
        if (caret) caret.style.transform = 'rotate(180deg)';
    }

    header.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        qsa('.exp-list-item').forEach(otherItem => {
            if (otherItem !== item && otherItem.classList.contains('active')) {
                otherItem.classList.remove('active');
                otherItem.querySelector('.exp-list-item-content').style.maxHeight = '0px';
                const otherCaret = otherItem.querySelector('.exp-list-toggle-btn');
                if (otherCaret) otherCaret.style.transform = 'rotate(0deg)';
            }
        });

        if (isActive) {
            item.classList.remove('active');
            content.style.maxHeight = '0px';
            if (caret) caret.style.transform = 'rotate(0deg)';
        } else {
            item.classList.add('active');
            content.style.maxHeight = content.scrollHeight + 'px';
            if (caret) caret.style.transform = 'rotate(180deg)';
        }
    });

    // Resize listener to recalculate expanded content height if viewport changes size
    window.addEventListener('resize', () => {
        if (item.classList.contains('active')) {
            content.style.maxHeight = content.scrollHeight + 'px';
        }
    });
});

// 4. View Toggle Switch Logic (List vs Timeline)
const listBtn = qs('[data-view="list"]');
const timelineBtn = qs('[data-view="timeline"]');
const toggleSwitch = qs('.exp-toggle-switch');
const listView = qs('#exp-list-view');
const timelineView = qs('#exp-timeline-view');

if (listBtn && timelineBtn && toggleSwitch && listView && timelineView) {
    listBtn.addEventListener('click', () => {
        if (!listBtn.classList.contains('active')) {
            listBtn.classList.add('active');
            timelineBtn.classList.remove('active');
            toggleSwitch.classList.remove('view-timeline');

            animate(timelineView, { opacity: 0, y: 15 }, { duration: 0.2 }).then(() => {
                timelineView.style.display = 'none';
                listView.style.display = 'block';
                animate(listView, { opacity: [0, 1], y: [15, 0] }, { duration: 0.3 });
            });
        }
    });

    timelineBtn.addEventListener('click', () => {
        if (!timelineBtn.classList.contains('active')) {
            timelineBtn.classList.add('active');
            listBtn.classList.remove('active');
            toggleSwitch.classList.add('view-timeline');

            const tryThis = qs('.try-this-hint');
            if (tryThis) {
                animate(tryThis, { opacity: 0, scale: 0.8 }, { duration: 0.2 }).then(() => {
                    tryThis.style.display = 'none';
                });
            }

            animate(listView, { opacity: 0, y: 15 }, { duration: 0.2 }).then(() => {
                listView.style.display = 'none';
                timelineView.style.display = 'block';
                scrollTimelineToNow(); // Scroll to the "now" marker automatically on reveal
                animate(timelineView, { opacity: [0, 1], y: [15, 0] }, { duration: 0.3 });
            });
        }
    });
}

// Helper to center the timeline on the "now" marker
function scrollTimelineToNow() {
    const sliderContainer = qs('#timeline-drag-container');
    const nowMarker = qs('.timeline-now-marker');
    if (sliderContainer && nowMarker) {
        const markerOffset = nowMarker.offsetLeft;
        const containerWidth = sliderContainer.clientWidth;
        sliderContainer.scrollLeft = markerOffset - (containerWidth / 2);
    }
}

// 5. Sidebar scroll/drag timeline track logic
const timelineDrag = qs('#timeline-drag-container');
if (timelineDrag) {
    let isDown = false;
    let startX;
    let scrollLeft;

    timelineDrag.addEventListener('mousedown', (e) => {
        isDown = true;
        timelineDrag.classList.add('dragging');
        startX = e.pageX - timelineDrag.offsetLeft;
        scrollLeft = timelineDrag.scrollLeft;
    });

    timelineDrag.addEventListener('mouseleave', () => {
        isDown = false;
        timelineDrag.classList.remove('dragging');
    });

    timelineDrag.addEventListener('mouseup', () => {
        isDown = false;
        timelineDrag.classList.remove('dragging');
    });

    timelineDrag.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - timelineDrag.offsetLeft;
        const walk = (x - startX) * 1.5;
        timelineDrag.scrollLeft = scrollLeft - walk;
    });

    // Touch interface
    timelineDrag.addEventListener('touchstart', (e) => {
        isDown = true;
        startX = e.touches[0].pageX - timelineDrag.offsetLeft;
        scrollLeft = timelineDrag.scrollLeft;
    }, { passive: true });

    timelineDrag.addEventListener('touchend', () => {
        isDown = false;
        timelineDrag.classList.remove('dragging');
    }, { passive: true });

    timelineDrag.addEventListener('touchmove', (e) => {
        if (!isDown) return;
        const x = e.touches[0].pageX - timelineDrag.offsetLeft;
        const walk = (x - startX) * 1.5;
        timelineDrag.scrollLeft = scrollLeft - walk;
    }, { passive: true });
}

// 6. Interactive timeline tooltip logic
const timelineCards = qsa('.timeline-item-card');
const timelineTooltip = qs('#timeline-tooltip');

if (timelineTooltip && timelineCards.length) {
    timelineCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const id = card.dataset.id;
            const data = expData[id];
            if (!data) return;

            // Populate details
            qs('#tooltip-company').textContent = data.company;
            qs('#tooltip-period').textContent = data.period;
            qs('#tooltip-role').textContent = data.role;
            qs('#tooltip-desc').textContent = data.desc;

            const bulletsList = qs('#tooltip-bullets');
            bulletsList.innerHTML = '';
            data.bullets.forEach(sentence => {
                const li = document.createElement('li');
                li.textContent = sentence;
                bulletsList.appendChild(li);
            });

            // Add custom active outline styling
            card.classList.add('active-card');

            // Calculate hover coordinate positions on parent canvas
            const cardLeft = card.offsetLeft;
            const cardWidth = card.offsetWidth;
            const cardTop = card.offsetTop;
            const cardHeight = card.offsetHeight;

            // Prevent tooltip content from being clipped by viewport container boundary
            const container = qs('#timeline-drag-container');
            let tooltipLeft = cardLeft + (cardWidth / 2);

            if (container) {
                const containerLeft = container.scrollLeft;
                const containerWidth = container.clientWidth;
                const tooltipHalfWidth = 160; // 320px tooltip width / 2

                const minLeft = containerLeft + tooltipHalfWidth + 12;
                const maxLeft = containerLeft + containerWidth - tooltipHalfWidth - 12;

                if (tooltipLeft < minLeft) {
                    tooltipLeft = minLeft;
                } else if (tooltipLeft > maxLeft) {
                    tooltipLeft = maxLeft;
                }
            }

            // Set coordinates
            timelineTooltip.style.left = `${tooltipLeft}px`;

            // Choose top position so it rests perfectly above or below the card row
            if (cardTop < 100) {
                // First card row: show tooltip below the card to avoid clipping top boundary
                timelineTooltip.style.top = `${cardTop + cardHeight + 10}px`;
                timelineTooltip.style.transform = 'translate(-50%, 0)';
            } else {
                // Lower rows: show tooltip above
                timelineTooltip.style.top = `${cardTop - 10}px`;
                timelineTooltip.style.transform = 'translate(-50%, -100%)';
            }

            timelineTooltip.classList.add('visible');
        });

        card.addEventListener('mouseleave', () => {
            card.classList.remove('active-card');
            timelineTooltip.classList.remove('visible');
        });
    });
}

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
