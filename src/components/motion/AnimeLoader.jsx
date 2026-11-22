import React from 'react';

/**
 * Anime-styled loading indicator: stacked counter-rotating rings around a
 * pulsing core. Fully CSS driven, so it costs no JS frames.
 */
export function AnimeLoader({ label = 'Loading listings…', className = '' }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-4 py-16 ${className}`} role="status" aria-live="polite">
      <div className="relative h-16 w-16">
        <span className="absolute inset-0 rounded-full border-2 border-slate-200" />
        <span className="absolute inset-0 rounded-full border-2 border-transparent border-t-sakura-500 border-r-neon-400 animate-spin" />
        <span className="absolute inset-[6px] rounded-full border-2 border-transparent border-b-violet-400 border-l-emerald-400 animate-spin [animation-direction:reverse] [animation-duration:1.6s]" />
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="h-3 w-3 rounded-full bg-emerald-400 shadow-glow-emerald animate-glow-pulse" />
        </span>
      </div>
      <span className="anime-text-gradient text-xs font-bold uppercase tracking-[0.2em]">{label}</span>
    </div>
  );
}

/**
 * Placeholder card shown while listings load. Uses the shared skeleton
 * shimmer so it matches the rest of the motion system.
 */
export function PropertyCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-card-luxury" aria-hidden="true">
      <div className="skeleton-shimmer aspect-[16/10] w-full" />
      <div className="space-y-3 p-5">
        <div className="skeleton-shimmer h-3 w-1/3 rounded-full" />
        <div className="skeleton-shimmer h-5 w-4/5 rounded-full" />
        <div className="skeleton-shimmer h-5 w-3/5 rounded-full" />
        <div className="flex gap-2 pt-2">
          <div className="skeleton-shimmer h-9 flex-1 rounded-xl" />
          <div className="skeleton-shimmer h-9 w-16 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export default AnimeLoader;
