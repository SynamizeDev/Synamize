const CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

export function scrambleText(
  el: HTMLElement,
  finalText: string,
  options: { duration?: number; onComplete?: () => void } = {}
) {
  const { duration = 0.7, onComplete } = options;
  const length = finalText.length;
  let frame = 0;
  const totalFrames = Math.min(Math.round(duration * 30), 24);
  let rafId = 0;

  const tick = () => {
    frame++;
    const progress = frame / totalFrames;
    const revealed = Math.floor(progress * length);

    el.textContent = finalText
      .split('')
      .map((char, i) => {
        if (char === ' ') return ' ';
        if (i < revealed) return finalText[i];
        return CHARSET[Math.floor(Math.random() * CHARSET.length)];
      })
      .join('');

    if (frame < totalFrames) {
      rafId = requestAnimationFrame(tick);
    } else {
      el.textContent = finalText;
      onComplete?.();
    }
  };

  rafId = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(rafId);
}
