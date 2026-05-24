export function shouldReduceMotion(): boolean {
  if (typeof window === 'undefined') return true;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return true;
  return window.matchMedia('(pointer: coarse)').matches;
}

/** Lighter animation tier for mobile / low-memory devices */
export function isLiteMode(): boolean {
  if (typeof window === 'undefined') return true;
  if (shouldReduceMotion()) return true;
  if (isTouchDevice()) return true;
  if (window.innerWidth < 900) return true;

  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  if (memory !== undefined && memory < 4) return true;

  return false;
}

/** Throttle to one call per animation frame */
export function rafThrottle<T extends (...args: never[]) => void>(fn: T): T {
  let ticking = false;
  return ((...args: Parameters<T>) => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      fn(...args);
    });
  }) as T;
}
