import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { EASE_ANIME } from './motionVariants';

/**
 * Scroll-triggered reveal. Animates once when the element scrolls into view.
 * Honours `prefers-reduced-motion` by fading only (no movement).
 */
export default function Reveal({
  children,
  as = 'div',
  delay = 0,
  y = 24,
  x = 0,
  duration = 0.55,
  once = true,
  amount = 0.25,
  className = '',
  ...rest
}) {
  const reduceMotion = useReducedMotion();
  const MotionTag = motion[as] || motion.div;

  const hidden = reduceMotion ? { opacity: 0 } : { opacity: 0, y, x };
  const shown = reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, x: 0 };

  return (
    <MotionTag
      initial={hidden}
      whileInView={shown}
      viewport={{ once, amount }}
      transition={{ duration: reduceMotion ? 0.2 : duration, delay: reduceMotion ? 0 : delay, ease: EASE_ANIME }}
      className={className}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}

/**
 * Container that reveals its children one after another.
 * Pair with <StaggerItem> for each child.
 */
export function StaggerGroup({
  children,
  stagger = 0.08,
  delayChildren = 0,
  once = true,
  amount = 0.2,
  className = '',
  ...rest
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: reduceMotion ? 0 : stagger, delayChildren: reduceMotion ? 0 : delayChildren } },
      }}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, y = 24, className = '', ...rest }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      variants={{
        hidden: reduceMotion ? { opacity: 0 } : { opacity: 0, y },
        show: { opacity: 1, y: 0, transition: { duration: reduceMotion ? 0.2 : 0.5, ease: EASE_ANIME } },
      }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
