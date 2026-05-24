import { useRef, type ReactNode, type MouseEvent } from 'react';
import { isLiteMode, rafThrottle } from '../../utils/perf';

interface Props {
  href: string;
  children: ReactNode;
  variant?: 'fill' | 'line';
}

export default function MagneticButton({ href, children, variant = 'fill' }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);

  const onMove = rafThrottle((e: MouseEvent<HTMLAnchorElement>) => {
    if (isLiteMode() || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) * 0.18;
    const y = (e.clientY - r.top - r.height / 2) * 0.18;
    ref.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  });

  const onLeave = () => {
    if (ref.current) ref.current.style.transform = '';
  };

  return (
    <a
      ref={ref}
      href={href}
      className={`btn btn--${variant === 'fill' ? 'fill' : 'line'}`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
    </a>
  );
}
