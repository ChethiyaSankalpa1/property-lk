// Shared motion tokens so every animated surface feels like part of one system.

// Signature "anime" easing - fast out, gentle settle.
export const EASE_ANIME = [0.22, 1, 0.36, 1];

// Scroll-reveal viewport defaults (animate once, a quarter into view).
export const VIEWPORT_ONCE = { once: true, amount: 0.25 };

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE_ANIME } },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.5, ease: EASE_ANIME } },
};

export const popIn = {
  hidden: { opacity: 0, scale: 0.94 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.45, ease: EASE_ANIME } },
};

// Container that releases its children one after another.
export const staggerContainer = (stagger = 0.08, delayChildren = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren } },
});

// Hover/tap presets for interactive elements.
export const hoverLift = { y: -6 };
export const hoverPop = { scale: 1.03 };
export const tapPress = { scale: 0.97 };

// Utility: reduced-motion-safe variants.
export const withReducedMotion = (variants, reduce, fallback = fadeIn) => (reduce ? fallback : variants);
