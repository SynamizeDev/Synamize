import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { isLiteMode } from '../../utils/perf';
import './ServiceCard.css';

interface Props {
  index: number;
  title: string;
  description: string;
}

export default function ServiceCard({ index, title, description }: Props) {
  const card = useRef<HTMLDivElement>(null);
  const border = useRef<SVGRectElement>(null);

  useEffect(() => {
    const el = card.current;
    const line = border.current;
    if (!el || !line || isLiteMode()) return;

    const len = line.getTotalLength();
    gsap.set(line, { strokeDasharray: len, strokeDashoffset: len });

    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          gsap.to(line, { strokeDashoffset: 0, duration: 1.2, ease: 'power2.inOut', delay: index * 0.06 });
          obs.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [index]);

  return (
    <article ref={card} className="service">
      <svg className="service__border" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <rect ref={border} x="0.5" y="0.5" width="99" height="99" />
      </svg>
      <span className="service__index">{String(index + 1).padStart(2, '0')}</span>
      <h3 className="service__title">{title}</h3>
      <p className="service__desc">{description}</p>
    </article>
  );
}
