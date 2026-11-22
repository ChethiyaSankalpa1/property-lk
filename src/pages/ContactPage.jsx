import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { 
  Building2, 
  Phone, 
  MessageCircle, 
  Mail, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Send, 
  Sparkles,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';
import { BRAND } from '../constants/brand';
import { StaggerGroup, StaggerItem } from '../components/motion/Reveal';
import { useLanguage } from '../i18n/LanguageContext';

export default function ContactPage() {
  const { t } = useLanguage();
  const [inquiryType, setInquiryType] = useState('Buying Property');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const reduceMotion = useReducedMotion();

  const handleSendMessage = (e) => {
    e.preventDefault();
    const fullText = `*PROPERTY LK - GENERAL INQUIRY*\n\n*Name:* ${name || 'Prospective Client'}\n*Inquiry Category:* ${inquiryType}\n*Message:* ${message || 'I would like to inquire about Sri Lankan real estate.'}`;
    window.open(BRAND.createWhatsAppLink(fullText), '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 sm:pt-28 pb-20">
      
      {/* Header Banner */}
      <div className="bg-navy-950 text-white py-14 px-4 sm:px-6 lg:px-8 border-b border-navy-800 relative overflow-hidden mb-10">
        <div className="absolute inset-0 bg-anime-aurora opacity-70 animate-aurora pointer-events-none" aria-hidden="true" />
        <div className="absolute top-0 right-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none animate-floaty-slow" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-navy-900 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 animate-twinkle" />
            <span>{t('contact.header.badge')}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
            {t('contact.header.titlePrefix')}{' '}
            <span className="anime-text-gradient">{t('contact.header.titleHighlight')}</span>{' '}
            {t('contact.header.titleSuffix')}
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            {t('contact.header.subtitle')}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Contact Cards Row */}
        <StaggerGroup className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          
          {/* Card 1: Official WhatsApp */}
          <StaggerItem className="anime-shimmer anime-glow-ring relative bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-card-luxury hover:shadow-card-luxury-hover hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mb-5 shadow-sm">
                <MessageCircle className="w-6 h-6 fill-emerald-600/20" />
              </div>
              <span className="text-xs uppercase tracking-wider text-slate-500 font-bold block mb-1">
                {t('contact.cards.whatsapp.eyebrow')}
              </span>
              <h3 className="font-serif text-2xl font-bold text-navy-950 mb-2">
                {BRAND.phone}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-6">
                {t('contact.cards.whatsapp.body')}
              </p>
            </div>
            
            <a
              href={BRAND.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="anime-shimmer relative w-full inline-flex items-center justify-center space-x-2 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-navy-950 font-bold text-xs uppercase tracking-wider shadow-glow-emerald transition-all"
            >
              <MessageCircle className="w-4 h-4 fill-navy-950" />
              <span className="relative z-10">{t('contact.cards.whatsapp.cta')}</span>
            </a>
          </StaggerItem>

          {/* Card 2: Direct Call */}
          <StaggerItem className="anime-shimmer anime-glow-ring relative bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-card-luxury hover:shadow-card-luxury-hover hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-navy-50 border border-navy-200 text-navy-900 flex items-center justify-center mb-5 shadow-sm">
                <Phone className="w-6 h-6" />
              </div>
              <span className="text-xs uppercase tracking-wider text-slate-500 font-bold block mb-1">
                {t('contact.cards.call.eyebrow')}
              </span>
              <h3 className="font-serif text-2xl font-bold text-navy-950 mb-2">
                {BRAND.phone}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-6">
                {t('contact.cards.call.body')}
              </p>
            </div>

            <a
              href={`tel:${BRAND.phoneRaw}`}
              className="anime-shimmer relative w-full inline-flex items-center justify-center space-x-2 py-3 rounded-xl bg-navy-950 hover:bg-navy-900 text-white font-bold text-xs uppercase tracking-wider transition-all"
            >
              <Phone className="w-4 h-4 text-emerald-400" />
              <span className="relative z-10">{t('contact.cards.call.cta')}</span>
            </a>
          </StaggerItem>

          {/* Card 3: Island-wide Service */}
          <StaggerItem className="anime-shimmer anime-glow-ring relative bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-card-luxury hover:shadow-card-luxury-hover hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mb-5 shadow-sm">
                <MapPin className="w-6 h-6" />
              </div>
              <span className="text-xs uppercase tracking-wider text-slate-500 font-bold block mb-1">
                {t('contact.cards.coverage.eyebrow')}
              </span>
              <h3 className="font-serif text-2xl font-bold text-navy-950 mb-2">
                {t('contact.cards.coverage.title')}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-6">
                {t('contact.cards.coverage.body')}
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 text-slate-600 text-xs font-semibold flex items-center justify-center space-x-1.5 border border-slate-200">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t('contact.cards.coverage.hours')}</span>
            </div>
          </StaggerItem>

        </StaggerGroup>

        {/* Interactive Direct Inquiry Box */}
        <motion.div
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: reduceMotion ? 0.2 : 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden bg-navy-950 text-white rounded-3xl p-8 sm:p-12 border border-navy-800 shadow-glass-dark"
        >
          <div className="absolute inset-0 bg-anime-aurora opacity-60 animate-aurora pointer-events-none" aria-hidden="true" />
          <div className="max-w-2xl mx-auto relative z-10">
            <div className="text-center mb-8">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-2">
                {t('contact.form.title')}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300">
                {t('contact.form.subtitle')}
              </p>
            </div>

            <form onSubmit={handleSendMessage} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  {t('contact.form.nameLabel')}
                </label>
                <input
                  type="text"
                  placeholder={t('contact.form.namePlaceholder')}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-navy-900 border border-navy-700 text-white text-sm focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  {t('contact.form.topicLabel')}
                </label>
                <select
                  value={inquiryType}
                  onChange={(e) => setInquiryType(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-navy-900 border border-navy-700 text-white text-sm focus:outline-none focus:border-emerald-400 cursor-pointer"
                >
                  <option value="Buying Property">{t('contact.form.options.buying')}</option>
                  <option value="Selling Property">{t('contact.form.options.selling')}</option>
                  <option value="Land Valuation / Advice">{t('contact.form.options.valuation')}</option>
                  <option value="Site Viewing Request">{t('contact.form.options.viewing')}</option>
                  <option value="General Question">{t('contact.form.options.general')}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  {t('contact.form.messageLabel')}
                </label>
                <textarea
                  rows={3}
                  placeholder={t('contact.form.messagePlaceholder')}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-4 rounded-xl bg-navy-900 border border-navy-700 text-white text-sm focus:outline-none focus:border-emerald-400"
                />
              </div>

              <motion.button
                type="submit"
                whileHover={reduceMotion ? undefined : { scale: 1.02, y: -2 }}
                whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="anime-shimmer relative w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-navy-950 font-bold text-sm uppercase tracking-wider shadow-glow-emerald flex items-center justify-center space-x-2 transition-all"
              >
                <MessageCircle className="w-5 h-5 fill-navy-950" />
                <span className="relative z-10">{t('contact.form.submit', { phone: BRAND.phone })}</span>
              </motion.button>
            </form>
          </div>
        </motion.div>

      </div>

    </div>
  );
}
