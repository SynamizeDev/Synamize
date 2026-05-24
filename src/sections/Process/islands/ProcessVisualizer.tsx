import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import './ProcessVisualizer.css';

gsap.registerPlugin(ScrollTrigger);

export default function ProcessVisualizer() {
    const containerRef = useRef<HTMLDivElement>(null);
    const barRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (!containerRef.current || !barRef.current) return;

        const ctx = gsap.context(() => {
            gsap.fromTo(barRef.current,
                { height: '0%' },
                {
                    height: '100%',
                    ease: 'none',
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top center',
                        end: 'bottom center',
                        scrub: true,
                    }
                }
            );
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="ProcessVisualizer">
            <div
                ref={barRef}
                className="ProcessVisualizer__bar"
                style={{ height: '0%' }}
            />
        </div>
    );
}
