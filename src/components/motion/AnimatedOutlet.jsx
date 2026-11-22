import React from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useLocation, useOutlet } from 'react-router-dom';
import { EASE_ANIME } from './motionVariants';

/**
 * Route transition wrapper for the public layout.
 *
 * `useOutlet()` is used instead of <Outlet /> on purpose: it returns the matched
 * route element as a value, so the exiting page keeps rendering its own content
 * (instead of swapping to the incoming route mid-exit animation).
 */
export default function AnimatedOutlet() {
  const location = useLocation();
  const outlet = useOutlet();
  const reduceMotion = useReducedMotion();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -14 }}
        transition={{ duration: reduceMotion ? 0.18 : 0.38, ease: EASE_ANIME }}
      >
        {outlet}
      </motion.div>
    </AnimatePresence>
  );
}
