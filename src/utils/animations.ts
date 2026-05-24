import { gsap } from './gsap';

export function animateCounter(
  el: HTMLElement,
  end: number,
  options: { duration?: number; suffix?: string; prefix?: string } = {}
) {
  const { duration = 2, suffix = '', prefix = '' } = options;
  const obj = { val: 0 };

  return gsap.to(obj, {
    val: end,
    duration,
    ease: 'power2.out',
    onUpdate: () => {
      el.textContent = `${prefix}${Math.round(obj.val)}${suffix}`;
    },
  });
}

export function fadeBlurIn(
  targets: gsap.TweenTarget,
  options: { delay?: number; stagger?: number; y?: number } = {}
) {
  const { delay = 0, stagger = 0.08, y = 40 } = options;
  gsap.set(targets, { opacity: 0, filter: 'blur(12px)', y });
  return gsap.to(targets, {
    opacity: 1,
    filter: 'blur(0px)',
    y: 0,
    duration: 1.1,
    ease: 'power3.out',
    stagger,
    delay,
  });
}

export function revealOnScroll(
  targets: gsap.TweenTarget,
  trigger: string | Element,
  options: { start?: string; stagger?: number } = {}
) {
  const { start = 'top 85%', stagger = 0.1 } = options;
  return gsap.from(targets, {
    scrollTrigger: {
      trigger: typeof trigger === 'string' ? trigger : trigger,
      start,
      toggleActions: 'play none none reverse',
    },
    opacity: 0,
    y: 48,
    duration: 1,
    ease: 'power3.out',
    stagger,
  });
}
