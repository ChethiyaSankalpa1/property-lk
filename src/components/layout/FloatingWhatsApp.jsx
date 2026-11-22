import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';
import { BRAND } from '../../constants/brand';
import { useLanguage } from '../../i18n/LanguageContext';

export default function FloatingWhatsApp() {
  const [showTooltip, setShowTooltip] = useState(false);
  const { t } = useLanguage();

  return (
    <div className="fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom))] right-5 sm:bottom-[calc(1.5rem+env(safe-area-inset-bottom))] sm:right-6 z-40 flex items-center">
      {/* Tooltip on hover/active */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, x: 10, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.95 }}
            className="hidden sm:flex items-center space-x-2 mr-3 bg-navy-950/95 text-white px-3.5 py-2 rounded-xl text-xs font-semibold shadow-2xl border border-emerald-500/30 backdrop-blur-md whitespace-nowrap"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>{t('nav.whatsappTooltip', { phone: BRAND.phone })}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Button */}
      <motion.a
        href={BRAND.createWhatsAppLink()}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="relative group w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center text-navy-950 shadow-glow-emerald cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-neon-400/60"
        aria-label={t('nav.whatsappChatAria')}
      >
        {/* Pulsing rings */}
        <span className="absolute inset-0 rounded-full bg-emerald-400/40 animate-ping -z-10" />
        <span className="absolute inset-0 rounded-full border-2 border-emerald-300 opacity-70 group-hover:scale-110 transition-transform duration-300" />
        <span className="absolute -inset-1 rounded-full bg-anime-rainbow opacity-0 group-hover:opacity-40 blur-md transition-opacity duration-300 -z-10" aria-hidden="true" />

        <MessageCircle className="w-7 h-7 sm:w-8 sm:h-8 fill-navy-950 text-navy-950 stroke-[1.75]" />
      </motion.a>
    </div>
  );
}
