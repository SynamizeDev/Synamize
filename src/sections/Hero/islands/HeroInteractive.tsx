// src/sections/Hero/islands/HeroInteractive.tsx
import React, { useState } from 'react';
import './HeroInteractive.css';

interface HeroInteractiveProps {
    label: string;
}

export default function HeroInteractive({ label }: HeroInteractiveProps) {
    const [active, setActive] = useState(false);

    return (
        <div className="HeroInteractive">
            <p className="HeroInteractive__label">{label}</p>
            <button
                type="button"
                onClick={() => setActive(!active)}
                className={`HeroInteractive__button${active ? ' HeroInteractive__button--active' : ''}`}
            >
                {active ? 'Interactive Mode: ON' : 'Interactive Mode: OFF'}
            </button>
        </div>
    );
}
