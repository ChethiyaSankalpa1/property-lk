import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Building2, MessageCircle, PlusCircle, Sparkles, Compass } from 'lucide-react';
import { BRAND } from '../../constants/brand';

export default function EmptyState({ title, subtitle, showActions = true }) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-navy-900/90 via-navy-950 to-navy-900 border border-navy-800/80 p-8 sm:p-14 lg:p-16 text-center shadow-glass-dark my-8">
      {/* Decorative ambient background glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-10 -right-10 w-48 h-48 bg-navy-700/20 rounded-full blur-2xl pointer-events-none" />

      {/* Floating Animated Icon Graphic */}
      <div className="relative mx-auto w-24 h-24 sm:w-28 sm:h-28 mb-6 flex items-center justify-center">
        <motion.div
          animate={{ 
            scale: [1, 1.05, 1],
            rotate: [0, 2, -2, 0]
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-emerald-500/20 to-navy-700/40 border border-emerald-500/30 backdrop-blur-md"
        />
        
        <motion.div
          animate={{ y: [-3, 3, -3] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="relative z-10 w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-tr from-navy-900 to-navy-800 border border-emerald-400/40 flex items-center justify-center shadow-glow-emerald"
        >
          <Building2 className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-400 stroke-[1.5]" />
        </motion.div>

        {/* Small floating sparkles */}
        <motion.div
          animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute -top-2 -right-2 text-emerald-300"
        >
          <Sparkles className="w-5 h-5" />
        </motion.div>
      </div>

      {/* Main Title & Subtitle */}
      <motion.h3 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-wide mb-3"
      >
        {title || "No Properties Listed Yet"}
      </motion.h3>

      <motion.p 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="max-w-xl mx-auto text-sm sm:text-base text-slate-300 leading-relaxed mb-8"
      >
        {subtitle || "New property opportunities will be available here soon. Stay connected with PROPERTY LK."}
      </motion.p>

      {/* Action Buttons */}
      {showActions && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto"
        >
          <a
            href={BRAND.createWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-navy-950 font-bold text-sm tracking-wide shadow-glow-emerald transition-all duration-300 hover:scale-[1.02]"
          >
            <MessageCircle className="w-4 h-4 fill-navy-950" />
            <span>Connect on WhatsApp</span>
          </a>

          <Link
            to="/sell"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-navy-800/80 hover:bg-navy-800 text-slate-200 hover:text-white font-semibold text-sm border border-navy-700/80 transition-all duration-300"
          >
            <PlusCircle className="w-4 h-4 text-emerald-400" />
            <span>List Your Property</span>
          </Link>
        </motion.div>
      )}

      {/* Decorative prompt note */}
      <div className="mt-8 pt-6 border-t border-navy-800/60 max-w-lg mx-auto flex items-center justify-center space-x-2 text-xs text-slate-400">
        <Compass className="w-3.5 h-3.5 text-emerald-400" />
        <span>Looking for a specific location or land in Sri Lanka? Message our team directly.</span>
      </div>
    </div>
  );
}
