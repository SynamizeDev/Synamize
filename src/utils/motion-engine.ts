import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { splitIntoLines } from './split-text';
import { scrambleText } from './scramble';
import { isLiteMode, rafThrottle } from './perf';

gsap.registerPlugin(ScrollTrigger);

ScrollTrigger.config({
  limitCallbacks: true,
  ignoreMobileResize: true,
});

export function initGlobalMotion() {
  if (isLiteMode()) return () => {};

  const ctx = gsap.context(() => {
    initSplitLines();
    initScrambleLabels();
    initStaggerGrids();
    initHorizontalRules();
    initMagneticElements();
  });

  return () => ctx.revert();
}

function initSplitLines() {
  document.querySelectorAll<HTMLElement>('[data-split-lines]').forEach((el) => {
    if (el.dataset.splitDone === 'true') return;
    splitIntoLines(el);
    el.dataset.splitDone = 'true';

    const inners = el.querySelectorAll('.line-inner');
    gsap.set(inners, { yPercent: 105 });

    gsap.to(inners, {
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      yPercent: 0,
      duration: 0.85,
      stagger: 0.06,
      ease: 'power3.out',
    });
  });
}

function initScrambleLabels() {
  document.querySelectorAll<HTMLElement>('[data-scramble]').forEach((el) => {
    if (el.closest('#hero')) return;
    const text = el.dataset.scramble || el.textContent || '';
    el.textContent = '';

    ScrollTrigger.create({
      trigger: el,
      start: 'top 92%',
      once: true,
      onEnter: () => scrambleText(el, text, { duration: 0.65 }),
    });
  });
}

function initMagneticElements() {
  document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
    const strength = Number(el.dataset.magnetic) || 0.25;
    const setX = gsap.quickSetter(el, 'x', 'px');
    const setY = gsap.quickSetter(el, 'y', 'px');

    const onMove = rafThrottle((e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      setX((e.clientX - rect.left - rect.width / 2) * strength);
      setY((e.clientY - rect.top - rect.height / 2) * strength);
    });

    el.addEventListener('mousemove', onMove as EventListener);
    el.addEventListener('mouseleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'power2.out' });
    });
  });
}

function initStaggerGrids() {
  document.querySelectorAll<HTMLElement>('[data-stagger-grid]').forEach((grid) => {
    gsap.from(grid.children, {
      scrollTrigger: { trigger: grid, start: 'top 88%', once: true },
      opacity: 0,
      y: 40,
      duration: 0.7,
      stagger: 0.08,
      ease: 'power3.out',
    });
  });
}

function initHorizontalRules() {
  document.querySelectorAll<HTMLElement>('[data-draw-line]').forEach((line) => {
    gsap.from(line, {
      scaleX: 0,
      transformOrigin: 'left center',
      scrollTrigger: { trigger: line, start: 'top 90%', once: true },
      duration: 0.9,
      ease: 'power3.inOut',
    });
  });
}
