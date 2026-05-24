import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { isLiteMode } from '../../utils/perf';
import './CaseStudiesScroll.css';

gsap.registerPlugin(ScrollTrigger);

const cases = [
  {
    brand: 'Luxe Athletics',
    category: 'DTC / Meta Ads',
    before: '1.2× ROAS',
    after: '5.1× ROAS',
    metric: 312,
    suffix: '%',
    label: 'Revenue Growth',
  },
  {
    brand: 'Nova Skincare',
    category: 'Content Systems',
    before: '8K followers',
    after: '240K followers',
    metric: 190,
    suffix: '%',
    label: 'Engagement Lift',
  },
  {
    brand: 'Vertex AI',
    category: 'Brand Positioning',
    before: '$2M ARR',
    after: '$9M ARR',
    metric: 450,
    suffix: '%',
    label: 'Pipeline Growth',
  },
  {
    brand: 'Apex Motors',
    category: 'Video / Social',
    before: '0.8% CTR',
    after: '4.2% CTR',
    metric: 425,
    suffix: '%',
    label: 'Click-Through Rate',
  },
];

export default function CaseStudiesScroll() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || isLiteMode()) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.from('.cases__header > *', {
        scrollTrigger: { trigger: section, start: 'top 85%', once: true },
        opacity: 0,
        y: 32,
        stagger: 0.08,
        duration: 0.8,
        ease: 'power3.out',
      });

      gsap.from('.case-card', {
        scrollTrigger: { trigger: '.cases__track', start: 'top 88%', once: true },
        opacity: 0,
        y: 40,
        stagger: 0.1,
        duration: 0.7,
        ease: 'power3.out',
      });

      ScrollTrigger.create({
        trigger: section,
        start: 'top 60%',
        once: true,
        onEnter: () => {
          section.querySelectorAll('[data-counter]').forEach((el) => {
            const counter = el as HTMLElement;
            const end = Number(counter.dataset.counter) || 0;
            const obj = { val: 0 };
            gsap.to(obj, {
              val: end,
              duration: 1.5,
              ease: 'power2.out',
              onUpdate: () => {
                counter.textContent = `+${Math.round(obj.val)}%`;
              },
            });
          });
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="work" className="cases section" aria-labelledby="cases-heading">
      <div className="container cases__header">
        <p className="label" data-scramble="Case Studies">
          Case Studies
        </p>
        <h2 id="cases-heading" className="section-title" data-split-lines>
          Results That Speak Louder Than Promises
        </h2>
      </div>
      <div className="cases__track">
        {cases.map((c) => (
          <article key={c.brand} className="case-card glass-card">
            <div className="case-card__mockup" aria-hidden="true">
              <div className="case-card__screen" />
            </div>
            <div className="case-card__body">
              <span className="case-card__category">{c.category}</span>
              <h3 className="case-card__brand">{c.brand}</h3>
              <div className="case-card__metrics">
                <div>
                  <span className="case-card__metric-label">Before</span>
                  <span className="case-card__metric-val case-card__metric-val--muted">{c.before}</span>
                </div>
                <div className="case-card__arrow">→</div>
                <div>
                  <span className="case-card__metric-label">After</span>
                  <span className="case-card__metric-val">{c.after}</span>
                </div>
              </div>
              <div className="case-card__highlight">
                <span className="case-card__counter" data-counter={c.metric}>
                  +0{c.suffix}
                </span>
                <span className="case-card__counter-label">{c.label}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
