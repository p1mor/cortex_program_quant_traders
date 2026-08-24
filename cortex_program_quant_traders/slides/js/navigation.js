/* ═══════════════════════════════════════════════════════════════════════════
   CORTEX-DENDRITA  ·  SLIDE NAVIGATION ENGINE  ·  v1.0
   TechPulse Consulting  ·  Proprietary Framework
   ═══════════════════════════════════════════════════════════════════════════
   Manages:
     • Keyboard navigation (arrows, space, pgup/pgdn, home/end, escape)
     • Touch / swipe navigation (mobile)
     • Progress bar (right edge)
     • Module indicator dots (left edge)
     • Slide counter (footer)
     • URL hash deep-linking (#slide-N)
     • IntersectionObserver for visibility tracking
     • Scroll-snap coordination
     • Animated transitions
   ═══════════════════════════════════════════════════════════════════════════ */

'use strict';

const SlideNav = (() => {

  /* ── Configuration ───────────────────────────────────────────────────── */
  const CFG = {
    SWIPE_THRESHOLD:   50,      /* px minimum vertical swipe                */
    SWIPE_MAX_TIME:    600,     /* ms max swipe duration                    */
    OBSERVER_THRESH:   0.55,    /* IntersectionObserver visibility ratio    */
    DEBOUNCE_MS:       80,      /* scroll event debounce                    */
    HASH_PREFIX:       'slide-',/* URL hash prefix                          */
    ANIM_DURATION:     350,     /* ms for programmatic scroll               */
    NAV_COOLDOWN:      200,     /* ms between consecutive navigations       */
  };

  /* ── State ───────────────────────────────────────────────────────────── */
  let slides       = [];        /* NodeList → Array of .slide elements      */
  let currentIndex = 0;         /* active slide index                       */
  let isNavigating = false;     /* lock during programmatic scroll          */
  let lastNavTime  = 0;         /* cooldown tracker                         */
  let touchStart   = null;      /* { y, t } for swipe detection             */
  let observer      = null;     /* IntersectionObserver instance            */
  let deck          = null;     /* .slide-deck container                    */

  /* ── DOM References (cached on init) ─────────────────────────────────── */
  const dom = {
    progressFill:   null,
    moduleDots:     [],
    slideCounters:  [],
    navHints:       [],
  };


  /* ══════════════════════════════════════════════════════════════════════
     §1  INITIALIZATION
     ══════════════════════════════════════════════════════════════════════ */

  function init() {
    deck = document.querySelector('.slide-deck');
    if (!deck) return;

    slides = Array.from(deck.querySelectorAll('.slide'));
    if (!slides.length) return;

    cacheDOM();
    buildModuleIndicator();
    buildProgressBar();
    updateCounters();

    setupObserver();
    setupKeyboard();
    setupTouch();
    setupHash();
    setupScrollDetection();

    /* Mark initial slide visible */
    markVisible(slides[currentIndex]);

    /* Expose API for external use */
    window.SlideNav = { goTo, next, prev, getCurrent, total: slides.length };
  }

  function cacheDOM() {
    dom.progressFill  = document.querySelector('.progress-fill');
    dom.slideCounters = Array.from(document.querySelectorAll('.slide-counter'));
    dom.navHints      = Array.from(document.querySelectorAll('.nav-hint'));
  }


  /* ══════════════════════════════════════════════════════════════════════
     §2  PROGRESS BAR (right edge)
     ══════════════════════════════════════════════════════════════════════ */

  function buildProgressBar() {
    let bar = document.querySelector('.progress-bar');
    if (!bar) {
      bar = document.createElement('div');
      bar.className = 'progress-bar';
      const fill = document.createElement('div');
      fill.className = 'progress-fill';
      bar.appendChild(fill);
      document.body.appendChild(bar);
    }
    dom.progressFill = bar.querySelector('.progress-fill');
    updateProgress();
  }

  function updateProgress() {
    if (!dom.progressFill) return;
    const pct = slides.length > 1
      ? (currentIndex / (slides.length - 1)) * 100
      : 0;
    dom.progressFill.style.width = pct + '%';
  }


  /* ══════════════════════════════════════════════════════════════════════
     §3  MODULE INDICATOR (left edge)
     ══════════════════════════════════════════════════════════════════════ */

  function buildModuleIndicator() {
    let container = document.querySelector('.module-indicator');
    if (!container) {
      container = document.createElement('div');
      container.className = 'module-indicator';
      document.body.appendChild(container);
    }

    /* Gather unique modules in order */
    const modules = [];
    const seen = new Set();
    slides.forEach((slide, i) => {
      const mod = slide.dataset.module || '0';
      if (!seen.has(mod)) {
        seen.add(mod);
        modules.push({ mod, index: i });
      }
    });

    container.innerHTML = '';
    dom.moduleDots = modules.map(({ mod, index }) => {
      const dot = document.createElement('div');
      dot.className = 'module-dot';
      dot.dataset.mod = mod;
      dot.dataset.targetIndex = index;
      dot.title = getModuleName(mod);
      dot.addEventListener('click', () => goTo(index));
      container.appendChild(dot);
      return dot;
    });

    updateModuleIndicator();
  }

  function getModuleName(mod) {
    const names = {
      '0': 'Cortex Quant Trader',
      '1': 'Modulo I — Fundamentos',
      '2': 'Modulo II — Quant Trading',
      '3': 'Modulo III — Cortex-Dendrita',
      '4': 'Sintesis',
    };
    return names[mod] || `Modulo ${mod}`;
  }

  function updateModuleIndicator() {
    if (!dom.moduleDots.length) return;
    const currentMod = slides[currentIndex]?.dataset?.module || '0';
    dom.moduleDots.forEach(dot => {
      dot.classList.toggle('active', dot.dataset.mod === currentMod);
    });
  }


  /* ══════════════════════════════════════════════════════════════════════
     §4  SLIDE COUNTERS & NAV HINTS
     ══════════════════════════════════════════════════════════════════════ */

  function updateCounters() {
    const lessonTotal = 42;

    /* El deck contiene portadas e índice, por lo que slides.length representa
       pantallas físicas (47), no lecciones curriculares (42). Los pies de las
       lecciones se derivan de Lnn y las portadas conservan su valor escrito. */
    slides.forEach((slide) => {
      const ctr = slide.querySelector('.slide-counter');
      const lessonTag = slide.querySelector('.lesson-tag');
      if (!ctr || !lessonTag) return;

      const match = lessonTag.textContent.match(/\d+/);
      if (!match) return;

      const lessonNumber = Number(match[0]);
      if (lessonNumber < 1 || lessonNumber > lessonTotal) return;

      ctr.textContent = String(lessonNumber).padStart(2, '0')
                      + '/' + String(lessonTotal).padStart(2, '0');
    });
  }


  /* ══════════════════════════════════════════════════════════════════════
     §5  INTERSECTION OBSERVER (visibility tracking)
     ══════════════════════════════════════════════════════════════════════ */

  function setupObserver() {
    if (observer) observer.disconnect();

    observer = new IntersectionObserver((entries) => {
      if (isNavigating) return;

      /* Find the most-visible entry */
      let best = null;
      let bestRatio = 0;
      entries.forEach(entry => {
        if (entry.intersectionRatio > bestRatio) {
          best = entry;
          bestRatio = entry.intersectionRatio;
        }
      });

      if (best && bestRatio >= CFG.OBSERVER_THRESH) {
        const idx = slides.indexOf(best.target);
        if (idx !== -1 && idx !== currentIndex) {
          setActive(idx, false);
        }
      }
    }, {
      root: deck,
      threshold: [0, 0.25, 0.55, 0.75, 1.0],
    });

    slides.forEach(slide => observer.observe(slide));
  }

  function markVisible(slide) {
    if (slide) slide.classList.add('visible');
  }

  function markHidden(slide) {
    if (slide) slide.classList.remove('visible');
  }


  /* ══════════════════════════════════════════════════════════════════════
     §6  NAVIGATION CORE
     ══════════════════════════════════════════════════════════════════════ */

  function setActive(index, scroll = true) {
    if (index < 0 || index >= slides.length) return;
    if (index === currentIndex && !scroll) return;

    const now = Date.now();
    if (now - lastNavTime < CFG.NAV_COOLDOWN) return;
    lastNavTime = now;

    const prev = currentIndex;
    currentIndex = index;

    /* Visibility classes */
    markHidden(slides[prev]);
    markVisible(slides[currentIndex]);

    /* Update UI */
    updateProgress();
    updateModuleIndicator();
    updateCounters();
    updateHash();

    /* Scroll if needed */
    if (scroll) {
      scrollTo(currentIndex);
    }
  }

  function goTo(index) {
    if (index < 0 || index >= slides.length) return;
    setActive(index, true);
  }

  function next() {
    if (currentIndex < slides.length - 1) {
      goTo(currentIndex + 1);
    }
  }

  function prev() {
    if (currentIndex > 0) {
      goTo(currentIndex - 1);
    }
  }

  function getCurrent() {
    return currentIndex;
  }


  /* ══════════════════════════════════════════════════════════════════════
     §7  SCROLL ENGINE
     ══════════════════════════════════════════════════════════════════════ */

  function scrollTo(index) {
    if (!deck || !slides[index]) return;

    isNavigating = true;
    const target = slides[index];

    /* Horizontal scroll to target slide */
    const targetLeft = target.offsetLeft;
    deck.scrollTo({ left: targetLeft, behavior: 'smooth' });

    /* Release lock after animation completes */
    setTimeout(() => {
      isNavigating = false;
    }, CFG.ANIM_DURATION + 100);
  }


  /* ══════════════════════════════════════════════════════════════════════
     §8  KEYBOARD NAVIGATION
     ══════════════════════════════════════════════════════════════════════ */

  function setupKeyboard() {
    document.addEventListener('keydown', handleKey);
  }

  function handleKey(e) {
    /* Ignore if focus is on an input/select/textarea */
    const tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'select' || tag === 'textarea') return;

    let handled = true;

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
      case ' ':
      case 'PageDown':
        next();
        break;

      case 'ArrowLeft':
      case 'ArrowUp':
      case 'PageUp':
        prev();
        break;

      case 'Home':
        goTo(0);
        break;

      case 'End':
        goTo(slides.length - 1);
        break;

      case 'Escape':
        break;

      case '1':
        goToModule('1');
        break;
      case '2':
        goToModule('2');
        break;
      case '3':
        goToModule('3');
        break;
      case '0':
        goTo(0);
        break;
      case 'i':
      case 'I':
        goTo(1);
        break;

      default:
        handled = false;
    }

    if (handled) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  function goToModule(mod) {
    for (let i = 0; i < slides.length; i++) {
      if (slides[i].dataset.module === mod) {
        goTo(i);
        return;
      }
    }
  }


  /* ══════════════════════════════════════════════════════════════════════
     §9  TOUCH / SWIPE NAVIGATION (mobile)
     ══════════════════════════════════════════════════════════════════════ */

  function setupTouch() {
    if (!deck) return;

    deck.addEventListener('touchstart', onTouchStart, { passive: true });
    deck.addEventListener('touchend',   onTouchEnd,   { passive: true });
  }

  function onTouchStart(e) {
    if (e.touches.length !== 1) return;
    const t = e.touches[0];
    touchStart = { x: t.clientX, t: Date.now() };
  }

  function onTouchEnd(e) {
    if (!touchStart) return;
    if (e.changedTouches.length !== 1) { touchStart = null; return; }

    const t = e.changedTouches[0];
    const dx = touchStart.x - t.clientX;
    const dt = Date.now() - touchStart.t;
    touchStart = null;

    /* Validate horizontal swipe */
    if (Math.abs(dx) < CFG.SWIPE_THRESHOLD) return;
    if (dt > CFG.SWIPE_MAX_TIME) return;

    if (dx > 0) {
      next();   /* swipe left → next slide */
    } else {
      prev();   /* swipe right → prev slide */
    }
  }


  /* ══════════════════════════════════════════════════════════════════════
     §10  URL HASH DEEP-LINKING
     ══════════════════════════════════════════════════════════════════════ */

  function setupHash() {
    /* Read initial hash */
    const hash = window.location.hash;
    if (hash && hash.startsWith('#' + CFG.HASH_PREFIX)) {
      const n = parseInt(hash.slice(CFG.HASH_PREFIX.length + 1), 10);
      if (!isNaN(n) && n >= 0 && n < slides.length) {
        /* Defer to allow layout to settle */
        requestAnimationFrame(() => goTo(n));
      }
    }

    /* Listen for hash changes (back/forward) */
    window.addEventListener('hashchange', () => {
      const h = window.location.hash;
      if (h && h.startsWith('#' + CFG.HASH_PREFIX)) {
        const n = parseInt(h.slice(CFG.HASH_PREFIX.length + 1), 10);
        if (!isNaN(n) && n >= 0 && n < slides.length && n !== currentIndex) {
          goTo(n);
        }
      }
    });
  }

  function updateHash() {
    const newHash = '#' + CFG.HASH_PREFIX + currentIndex;
    if (window.location.hash !== newHash) {
      history.replaceState(null, '', newHash);
    }
  }


  /* ══════════════════════════════════════════════════════════════════════
     §11  SCROLL-BASED DETECTION (fallback for scroll-snap)
     ══════════════════════════════════════════════════════════════════════ */

  function setupScrollDetection() {
    if (!deck) return;

    let scrollTimer = null;

    deck.addEventListener('scroll', () => {
      if (isNavigating) return;

      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        detectCurrentSlide();
      }, CFG.DEBOUNCE_MS);
    }, { passive: true });
  }

  function detectCurrentSlide() {
    if (!deck || !slides.length) return;

    const scrollLeft = deck.scrollLeft;
    let bestIdx = 0;
    let bestDist = Infinity;

    slides.forEach((slide, i) => {
      const dist = Math.abs(slide.offsetLeft - scrollLeft);
      if (dist < bestDist) {
        bestDist = dist;
        bestIdx  = i;
      }
    });

    if (bestIdx !== currentIndex) {
      setActive(bestIdx, false);
    }
  }


  /* ══════════════════════════════════════════════════════════════════════
     §12  BOOTSTRAP
     ══════════════════════════════════════════════════════════════════════ */

  function autoInit() {
    /* The modular index delays initialization until its source slides load. */
    if (!document.documentElement.dataset.deckLoading && !slides.length) init();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoInit);
  } else {
    autoInit();
  }

  return { init, goTo, next, prev, getCurrent };

})();
