import { useEffect, useRef, useState } from 'react';
import { isLiteMode, rafThrottle } from '../../utils/perf';
import './CustomCursor.css';

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLiteMode()) return;
    setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    document.body.classList.add('has-custom-cursor');

    const pos = { x: 0, y: 0 };
    let targetX = 0;
    let targetY = 0;
    let rafId = 0;

    const onMove = rafThrottle((e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    });

    const tick = () => {
      pos.x += (targetX - pos.x) * 0.2;
      pos.y += (targetY - pos.y) * 0.2;
      dot.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`;
      ring.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    const onDown = () => ring.classList.add('cursor-ring--click');
    const onUp = () => ring.classList.remove('cursor-ring--click');

    window.addEventListener('mousemove', onMove as EventListener, { passive: true });
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);

    return () => {
      cancelAnimationFrame(rafId);
      document.body.classList.remove('has-custom-cursor');
      window.removeEventListener('mousemove', onMove as EventListener);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  );
}
