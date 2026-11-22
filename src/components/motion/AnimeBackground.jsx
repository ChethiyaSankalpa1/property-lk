import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

// Ambient twinkling particles. Kept intentionally few so paint cost stays low.
const PARTICLES = [
  { left: '8%', top: '18%', size: 3, delay: 0, duration: 3.6, color: '#3DE8F0' },
  { left: '22%', top: '62%', size: 2, delay: 0.6, duration: 4.2, color: '#FF8FC0' },
  { left: '38%', top: '30%', size: 3, delay: 1.2, duration: 3.1, color: '#FBBF6B' },
  { left: '55%', top: '74%', size: 2, delay: 0.3, duration: 4.6, color: '#A78BFA' },
  { left: '68%', top: '22%', size: 3, delay: 1.6, duration: 3.4, color: '#7DF9FF' },
  { left: '82%', top: '58%', size: 2, delay: 0.9, duration: 4.1, color: '#FFB7D5' },
  { left: '92%', top: '36%', size: 3, delay: 2.1, duration: 3.8, color: '#6EE7B7' },
  { left: '14%', top: '84%', size: 2, delay: 1.4, duration: 4.4, color: '#C4B5FD' },
];

/**
 * Fixed decorative backdrop for the public site: an aurora wash, drifting
 * colour blobs and a scatter of twinkling particles.
 *
 * Purely presentational - pointer-events are disabled and it is hidden from
 * assistive tech. All motion is skipped when the user prefers reduced motion.
 */
export default function AnimeBackground() {
  const reduceMotion = useReducedMotion();

  const drift = (values) =>
    reduceMotion
      ? undefined
      : { animate: values, transition: { duration: 22, repeat: Infinity, ease: 'easeInOut' } };

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-slate-50">
      {/* Aurora wash */}
      <div className="absolute inset-0 bg-anime-aurora bg-[length:200%_200%] opacity-80 animate-aurora" />

      {/* Drifting colour blobs */}
      <motion.div
        className="absolute -top-32 -left-28 h-[26rem] w-[26rem] rounded-full bg-sakura-400/25 blur-3xl"
        {...drift({ x: [0, 46, 0], y: [0, 34, 0], scale: [1, 1.12, 1] })}
      />
      <motion.div
        className="absolute -top-20 right-[-6rem] h-[22rem] w-[22rem] rounded-full bg-neon-400/25 blur-3xl"
        {...drift({ x: [0, -40, 0], y: [0, 28, 0], scale: [1, 1.08, 1] })}
      />
      <motion.div
        className="absolute bottom-[-8rem] left-1/4 h-[24rem] w-[24rem] rounded-full bg-violet-400/20 blur-3xl"
        {...drift({ x: [0, 36, 0], y: [0, -30, 0], scale: [1, 1.14, 1] })}
      />
      <motion.div
        className="absolute bottom-[-6rem] right-1/4 h-[20rem] w-[20rem] rounded-full bg-sunset-400/20 blur-3xl"
        {...drift({ x: [0, -34, 0], y: [0, -24, 0], scale: [1, 1.1, 1] })}
      />

      {/* Faint structural grid for a stylised, illustrated feel */}
      <div className="absolute inset-0 bg-grid-pattern opacity-70" />

      {/* Twinkling particles */}
      {!reduceMotion &&
        PARTICLES.map((p, i) => (
          <span
            key={i}
            className="anime-particle"
            style={{
              left: p.left,
              top: p.top,
              width: `${p.size}px`,
              height: `${p.size}px`,
              background: p.color,
              boxShadow: `0 0 10px ${p.color}`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
            }}
          />
        ))}

      {/* Soft fade so long pages stay comfortable to read */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white/80 to-transparent" />
    </div>
  );
}
