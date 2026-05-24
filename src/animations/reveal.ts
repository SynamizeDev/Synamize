import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function isInViewport(el: Element, ratio = 0.12): boolean {
  const rect = el.getBoundingClientRect();
  const vh = window.innerHeight || document.documentElement.clientHeight;
  return rect.top <= vh * (1 - ratio) && rect.bottom >= vh * ratio;
}

/** Animate in when scrolled to — never leave elements stuck hidden */
export function revealOnEnter(
  targets: gsap.TweenTarget,
  options: {
    trigger?: Element | string;
    start?: string;
    from?: gsap.TweenVars;
    to?: gsap.TweenVars;
  } = {}
) {
  const {
    trigger,
    start = 'top 88%',
    from = { opacity: 0, y: 32 },
    to = { opacity: 1, y: 0, duration: 0.85, ease: 'power3.out' },
  } = options;

  const list = gsap.utils.toArray(targets) as Element[];
  if (!list.length) return;

  const run = () => gsap.fromTo(list, { ...from }, { ...to, overwrite: 'auto' });

  const triggerEl =
    (typeof trigger === 'string' ? document.querySelector(trigger) : trigger) ?? list[0];

  if (!triggerEl) {
    run();
    return;
  }

  if (isInViewport(triggerEl)) {
    run();
    return;
  }

  ScrollTrigger.create({
    trigger: triggerEl,
    start,
    once: true,
    onEnter: run,
  });
}

export function revealLines(inners: NodeListOf<Element> | Element[], trigger: Element) {
  const targets = gsap.utils.toArray(inners);
  if (!targets.length) return;

  const run = () =>
    gsap.to(targets, {
      yPercent: 0,
      duration: 1,
      ease: 'power4.out',
      stagger: 0.08,
      overwrite: 'auto',
    });

  if (isInViewport(trigger)) {
    gsap.set(targets, { yPercent: 0, opacity: 1 });
    run();
    return;
  }

  gsap.set(targets, { yPercent: 110 });
  ScrollTrigger.create({
    trigger,
    start: 'top 88%',
    once: true,
    onEnter: run,
    onEnterBack: run,
  });

  // Safety: never leave masked lines clipped
  window.setTimeout(() => {
    gsap.set(targets, { yPercent: 0, clearProps: 'transform' });
  }, 4000);
}
