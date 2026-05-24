import { useEffect } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initSiteMotion } from '../../animations/motion';

export default function SiteMotion() {
  useEffect(() => {
    const cleanup = initSiteMotion();
    ScrollTrigger.refresh();
    return () => cleanup();
  }, []);

  return null;
}
