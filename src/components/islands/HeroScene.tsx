import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import MagneticButton from './MagneticButton';
import { isLiteMode } from '../../utils/perf';
import { EASE, DURATION } from '../../animations/easing';
import './HeroScene.css';

gsap.registerPlugin(ScrollTrigger);

export default function HeroScene() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = root.current;
    if (!section) return;

    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lite = isLiteMode();

    if (!reduced) {
      const intro = () => {
        gsap
          .timeline({ defaults: { ease: EASE.reveal } })
          .from('.hero__intro', { opacity: 0, y: 16, duration: 0.6 })
          .from(
            '.hero__title-line',
            {
              opacity: 0,
              y: 28,
              duration: lite ? 0.7 : DURATION.slow,
              stagger: 0.12,
            },
            0.08
          )
          .from('.hero__sub', { opacity: 0, y: 20, duration: 0.7 }, 0.22)
          .from('.hero__actions > *', { opacity: 0, y: 16, duration: 0.6 }, 0.38);
      };

      const ctx = gsap.context(() => {
        intro();

        if (!lite) {
          gsap.to(section.querySelector('.hero__atmos'), {
            scale: 1.02,
            ease: 'none',
            scrollTrigger: { trigger: section, start: 'top top', end: 'bottom top', scrub: 2 },
          });
        }
      }, section);

      return () => ctx.revert();
    }
  }, []);

  return (
    <section ref={root} id="hero" className="hero scene" aria-labelledby="hero-title">
      <div className="hero__atmos" aria-hidden="true">
        <div className="hero__vignette" />
      </div>

      <div className="hero__content container">
        <p className="hero__intro">Hi, We&apos;re Synamize</p>

        <h1 id="hero-title" className="hero__title">
          <span className="hero__title-line">We Help Brands Scale,</span>
          <span className="hero__title-line">Grow &amp; Dominate Digitally</span>
        </h1>

        <p className="hero__sub">
          Through cinematic content, performance marketing, and tailored social media systems built
          perfectly for your niche.
        </p>

        <div className="hero__actions">
          <MagneticButton href="#contact" variant="fill">
            Book Strategy Call
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
