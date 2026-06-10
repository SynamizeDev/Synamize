import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { splitIntoLines } from '../utils/split-text';
import { isLiteMode, rafThrottle } from '../utils/perf';
import { revealLines, revealOnEnter } from './reveal';

gsap.registerPlugin(ScrollTrigger);

ScrollTrigger.config({ limitCallbacks: true, ignoreMobileResize: true });

export function initSiteMotion() {
  if (isLiteMode()) return () => {};

  const ctx = gsap.context(() => {
    initMaskHeadlines();
    initSceneReveals();
    initParallax();
    initMagnetic();
    initTeamAnimation();
  });

  ScrollTrigger.refresh();

  return () => ctx.revert();
}

function initMaskHeadlines() {
  document.querySelectorAll<HTMLElement>('[data-mask-text]').forEach((el) => {
    if (el.dataset.maskReady) return;
    splitIntoLines(el);
    el.dataset.maskReady = 'true';
    revealLines(el.querySelectorAll('.line-inner'), el);
  });
}

function initSceneReveals() {
  document.querySelectorAll<HTMLElement>('[data-scene]').forEach((scene) => {
    const items = scene.querySelectorAll('[data-scene-item]');
    if (items.length) {
      revealOnEnter(items, {
        trigger: scene,
        start: 'top 85%',
        from: { opacity: 0, y: 40 },
        to: { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' },
      });
    }

    const grid = scene.querySelector('[data-scene-items]');
    if (grid) {
      revealOnEnter(grid.querySelectorAll('[data-scene-item]'), {
        trigger: grid,
        start: 'top 88%',
        from: { opacity: 0, y: 32 },
        to: { opacity: 1, y: 0, duration: 0.75, stagger: 0.08, ease: 'power3.out' },
      });
    }
  });
}

function initParallax() {
  document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
    const amount = Number(el.dataset.parallax) || 0.12;
    gsap.to(el, {
      y: () => amount * 80,
      ease: 'none',
      scrollTrigger: {
        trigger: el.closest('section') || el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.8,
      },
    });
  });
}

function initMagnetic() {
  document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
    const s = Number(el.dataset.magnetic) || 0.25;
    const setX = gsap.quickSetter(el, 'x', 'px');
    const setY = gsap.quickSetter(el, 'y', 'px');
    const onMove = rafThrottle((e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      setX((e.clientX - r.left - r.width / 2) * s);
      setY((e.clientY - r.top - r.height / 2) * s);
    });
    el.addEventListener('mousemove', onMove as EventListener, { passive: true });
    el.addEventListener('mouseleave', () => gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'power2.out' }));
  });
}

function initTeamAnimation() {
  document.querySelectorAll<HTMLElement>('[data-team-grid]').forEach((grid) => {
    const cards = grid.querySelectorAll('[data-team-card]');
    if (!cards.length) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: grid,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
    });

    cards.forEach((card, i) => {
      const imgWrap = card.querySelector('.team__media');
      const img = card.querySelector('[data-team-image]');
      const content = card.querySelectorAll('[data-team-content]');
      const glow = card.querySelector('.team__card-glow');

      // Clean, minimal initial states
      gsap.set(card, { opacity: 0, y: 40 });
      if (imgWrap) gsap.set(imgWrap, { clipPath: 'inset(100% 0 0 0)' });
      if (img) gsap.set(img, { scale: 1.05 });
      if (content.length) gsap.set(content, { opacity: 0, y: 15 });
      if (glow) gsap.set(glow, { opacity: 0 });

      const delay = i * 0.15;

      // Soft card fade up
      tl.to(card, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
      }, delay);

      // Premium wipe reveal for the image container
      if (imgWrap) {
        tl.to(imgWrap, {
          clipPath: 'inset(0% 0 0 0)',
          duration: 1.2,
          ease: 'power4.inOut',
        }, delay + 0.1);
      }

      // Subtle image settle
      if (img) {
        tl.to(img, {
          scale: 1,
          duration: 1.5,
          ease: 'power2.out',
        }, delay + 0.1);
      }

      // Gentle text float
      if (content.length) {
        tl.to(content, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
        }, delay + 0.6);
      }

      if (glow) {
        tl.to(glow, {
          opacity: 1,
          duration: 1,
          ease: 'power2.out',
        }, delay + 0.8);
      }
    });
  });
}

export function maskWords(el: HTMLElement) {
  const text = el.textContent ?? '';
  el.setAttribute('aria-label', text);
  el.textContent = '';
  const words = text.split(/\s+/).filter(Boolean);
  const frag = document.createDocumentFragment();

  words.forEach((word, i) => {
    const wrap = document.createElement('span');
    wrap.className = 'word';
    wrap.style.display = 'inline-block';
    wrap.style.overflow = 'hidden';
    wrap.style.verticalAlign = 'top';
    wrap.setAttribute('aria-hidden', 'true');

    const inner = document.createElement('span');
    inner.className = 'word-inner';
    inner.style.display = 'inline-block';
    inner.textContent = word;
    wrap.appendChild(inner);
    frag.appendChild(wrap);

    if (i < words.length - 1) {
      const sp = document.createElement('span');
      sp.textContent = '\u00A0';
      sp.setAttribute('aria-hidden', 'true');
      frag.appendChild(sp);
    }
  });

  el.appendChild(frag);
  return el.querySelectorAll('.word-inner');
}

export { gsap, ScrollTrigger };
