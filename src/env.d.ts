import type Lenis from 'lenis';

interface CalendlyWidget {
  initPopupWidget(options: { url: string }): void;
}

declare global {
  interface Window {
    lenis?: Lenis;
    Calendly?: CalendlyWidget;
  }
}

export {};
