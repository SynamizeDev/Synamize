// src/utils/reveal.ts

/**
 * Initializes the scroll reveal observer.
 * Finds all elements with class .reveal-on-scroll and observes them.
 * Adds .is-visible class when they enter the viewport.
 */
export function initScrollReveal() {
    // Respect user preference for reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }

    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.15 // Trigger when 15% visible
    };

    const observerCallback: IntersectionObserverCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Play once
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    const targetElements = document.querySelectorAll('.reveal-on-scroll');

    const revealIfInView = (el: Element) => {
        const rect = el.getBoundingClientRect();
        const viewHeight = window.innerHeight || document.documentElement.clientHeight;
        if (rect.top < viewHeight * 0.9 && rect.bottom > viewHeight * 0.1) {
            el.classList.add('is-visible');
            return true;
        }
        return false;
    };

    targetElements.forEach(el => {
        if (!revealIfInView(el)) {
            observer.observe(el);
        }
    });
}
