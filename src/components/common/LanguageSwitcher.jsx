import React, { useId } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Languages } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

const SIZE_STYLES = {
  sm: 'px-2.5 py-1 text-[11px]',
  md: 'px-3.5 py-1.5 text-xs',
};

/**
 * Accessible English / Sinhala switch.
 * - Two real buttons with `aria-pressed` so keyboard + screen-reader users can toggle.
 * - The active pill slides between options with a shared `layoutId` (unique per instance).
 * - Motion is skipped when the visitor prefers reduced motion.
 */
export default function LanguageSwitcher({ size = 'md', className = '', showIcon = true }) {
  const { lang, languages, setLang, t } = useLanguage();
  const reduceMotion = useReducedMotion();
  const pillId = useId();

  const sizeStyle = SIZE_STYLES[size] || SIZE_STYLES.md;

  return (
    <div className={`inline-flex items-center space-x-1.5 ${className}`}>
      {showIcon && (
        <Languages
          className="w-4 h-4 text-emerald-400/80 shrink-0"
          aria-hidden="true"
        />
      )}

      <div
        role="group"
        aria-label={t('common.language.label')}
        className="relative inline-flex items-center rounded-full border border-navy-700/70 bg-navy-900/80 backdrop-blur-md p-0.5 shadow-inner transition-shadow duration-300 hover:shadow-glow-neon"
      >
        {languages.map((option) => {
          const isActive = option.code === lang;

          return (
            <motion.button
              key={option.code}
              type="button"
              lang={option.code}
              onClick={() => setLang(option.code)}
              aria-pressed={isActive}
              whileTap={reduceMotion ? undefined : { scale: 0.94 }}
              className={`relative inline-flex items-center justify-center rounded-full font-bold uppercase transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-950 ${sizeStyle} ${
                isActive ? 'text-navy-950' : 'text-slate-300 hover:text-white'
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId={`lang-pill-${pillId}`}
                  className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 shadow-glow-emerald"
                  transition={
                    reduceMotion
                      ? { duration: 0 }
                      : { type: 'spring', stiffness: 420, damping: 32 }
                  }
                  aria-hidden="true"
                />
              )}

              <span aria-hidden="true" className="relative z-10">
                {option.short}
              </span>
              {/* Full language name for assistive tech (visible label stays compact) */}
              <span className="sr-only">{option.nativeLabel}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
