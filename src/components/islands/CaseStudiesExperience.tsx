import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { revealOnEnter } from '../../animations/reveal';
import { isLiteMode } from '../../utils/perf';
import { EASE, DURATION } from '../../animations/easing';
import './CaseStudiesExperience.css';

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    client: 'Luxe Athletics',
    tag: 'Meta Ads',
    stat: '+312%',
    label: 'Revenue',
    before: '1.2× ROAS',
    after: '5.1× ROAS',
  },
  {
    client: 'Nova Skincare',
    tag: 'Content',
    stat: '+190%',
    label: 'Engagement',
    before: '8K',
    after: '240K',
  },
  {
    client: 'Vertex AI',
    tag: 'Strategy',
    stat: '+450%',
    label: 'Pipeline',
    before: '$2M',
    after: '$9M',
  },
  {
    client: 'Apex Motors',
    tag: 'Social',
    stat: '+425%',
    label: 'CTR',
    before: '0.8%',
    after: '4.2%',
  },
];

export default function CaseStudiesExperience() {
  const section = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = section.current;
    if (!root) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      revealOnEnter('.cases__head > *', {
        trigger: root,
        start: 'top 85%',
      });

      revealOnEnter('.case', {
        trigger: root,
        start: 'top 80%',
        from: { opacity: 0, y: 48 },
        to: { opacity: 1, y: 0, duration: 0.85, stagger: 0.12, ease: 'power3.out' },
      });

      ScrollTrigger.create({
        trigger: root,
        start: 'top 65%',
        once: true,
        onEnter: () => {
          root.querySelectorAll('[data-count]').forEach((el) => {
            const node = el as HTMLElement;
            const target = Number(node.dataset.count) || 0;
            const obj = { v: 0 };
            gsap.to(obj, {
              v: target,
              duration: DURATION.slow,
              ease: EASE.luxury,
              onUpdate: () => {
                node.textContent = `+${Math.round(obj.v)}%`;
              },
            });
          });
        },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={section} id="work" className="cases section" aria-labelledby="cases-title">
      <div className="container cases__head">
        <p className="label">Selected Work</p>
        <h2 id="cases-title" className="display cases__title">
          Performance<br />Uncompromised
        </h2>
      </div>
      <div className="cases__track">
        {projects.map((p) => (
          <article key={p.client} className="case">
            <div className="case__visual" aria-hidden="true">
              <div className="case__img" />
            </div>
            <div className="case__body">
              <span className="label">{p.tag}</span>
              <h3 className="case__client">{p.client}</h3>
              <div className="case__metrics">
                <div>
                  <span className="case__metric-label">Before</span>
                  <span className="case__metric">{p.before}</span>
                </div>
                <div>
                  <span className="case__metric-label">After</span>
                  <span className="case__metric">{p.after}</span>
                </div>
              </div>
              <p className="case__stat" data-count={p.stat.replace(/\D/g, '')}>
                {p.stat}
              </p>
              <p className="case__stat-label">{p.label}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
