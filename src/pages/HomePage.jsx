import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { 
  Building, 
  Search, 
  MapPin, 
  ShieldCheck, 
  MessageCircle, 
  Phone, 
  PlusCircle, 
  Sparkles, 
  ArrowRight, 
  CheckCircle, 
  Users, 
  TrendingUp, 
  Clock, 
  Award,
  ChevronRight,
  Compass
} from 'lucide-react';
import { BRAND } from '../constants/brand';
import { PROPERTY_CATEGORIES } from '../constants/categories';
import { POPULAR_LOCATIONS } from '../constants/locations';
import { useProperties } from '../context/PropertyContext';
import { useLanguage } from '../i18n/LanguageContext';
import PropertyCard from '../components/common/PropertyCard';
import EmptyState from '../components/common/EmptyState';
import SearchBar from '../components/common/SearchBar';
import Reveal, { StaggerGroup, StaggerItem } from '../components/motion/Reveal';

const HERO_PARTICLES = [
  { left: '12%', top: '24%', size: 3, delay: 0, duration: 4.2, color: '#FF8FC0' },
  { left: '26%', top: '68%', size: 2, delay: 0.7, duration: 5.1, color: '#3DE8F0' },
  { left: '44%', top: '16%', size: 2, delay: 1.2, duration: 4.6, color: '#A78BFA' },
  { left: '63%', top: '74%', size: 3, delay: 0.4, duration: 5.6, color: '#FF6BAA' },
  { left: '78%', top: '30%', size: 2, delay: 1.6, duration: 4.9, color: '#3DE8F0' },
  { left: '88%', top: '60%', size: 3, delay: 0.9, duration: 5.3, color: '#FBBF6B' },
];

export default function HomePage() {
  const { properties } = useProperties();
  const { t, districtLabel, categoryLabel, categoryValue } = useLanguage();
  const reduceMotion = useReducedMotion();
  const featuredProperties = properties.filter(p => p.isFeatured && !p.isSold);
  const displayProperties = featuredProperties.length > 0 ? featuredProperties : properties;

  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* ========================================================= */}
      {/* HERO SECTION                                              */}
      {/* ========================================================= */}
      <section className="relative min-h-[92vh] sm:min-h-screen flex items-center justify-center pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-navy-950">
        
        {/* Luxury Background Image with cinematic zoom */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=85"
            alt={t('home.hero.imageAlt')}
            className="w-full h-full object-cover object-center scale-105 animate-pulse-slow"
          />
          {/* Multi-layered dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/75 to-navy-950/60" />
          <div className="absolute inset-0 bg-navy-950/40 backdrop-blur-[2px]" />
          {/* Anime aurora wash */}
          <div className="absolute inset-0 bg-anime-aurora opacity-80 animate-aurora mix-blend-screen" aria-hidden="true" />
        </div>

        {/* Floating subtle ambient accents */}
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none animate-floaty-slow" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-navy-600/20 rounded-full blur-3xl pointer-events-none animate-floaty" />
        <div className="absolute top-1/3 right-1/4 w-52 h-52 bg-sakura-500/10 rounded-full blur-3xl pointer-events-none animate-floaty-slow" />

        {/* Anime twinkle particles */}
        {!reduceMotion && (
          <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
            {HERO_PARTICLES.map((p, i) => (
              <span
                key={i}
                className="absolute rounded-full animate-twinkle"
                style={{
                  left: p.left,
                  top: p.top,
                  width: p.size,
                  height: p.size,
                  backgroundColor: p.color,
                  boxShadow: `0 0 8px ${p.color}`,
                  animationDelay: `${p.delay}s`,
                  animationDuration: `${p.duration}s`
                }}
              />
            ))}
          </div>
        )}

        <div className="relative z-10 max-w-5xl mx-auto w-full text-center">
          
          {/* Subtle Tagline Badge */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-navy-900/80 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm font-semibold tracking-wider uppercase mb-6 shadow-glow-emerald backdrop-blur-md"
          >
            <Sparkles className="w-3.5 h-3.5 fill-emerald-400" />
            <span>{t('home.hero.badge')}</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.15] mb-6 drop-shadow-lg"
          >
            {t('home.hero.headlineLead')}{' '}
            <span className="anime-text-gradient relative inline-block">
              {t('home.hero.headlineAccent')}
              <span className="absolute bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-neon-400 to-sakura-400 rounded-full animate-gradient-x bg-[length:200%_100%]" />
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-slate-200 font-normal leading-relaxed mb-8 sm:mb-10"
          >
            {t('home.hero.descriptionLead')} <strong className="text-white font-semibold">PROPERTY LK</strong>{t('home.hero.descriptionTail')}
          </motion.p>

          {/* Hero Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 mb-10 sm:mb-12"
          >
            <Link
              to="/properties"
              className="anime-shimmer relative w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-7 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-navy-950 font-bold text-sm sm:text-base uppercase tracking-wider shadow-glow-emerald hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
              <span className="relative z-10">{t('home.hero.buyProperty')}</span>
            </Link>

            <Link
              to="/sell"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-7 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-navy-900/90 hover:bg-navy-850 text-white font-bold text-sm sm:text-base border border-navy-700 hover:border-emerald-500/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-glow-neon"
            >
              <PlusCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
              <span>{t('home.hero.sellProperty')}</span>
            </Link>

            <a
              href={BRAND.createWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-500/40 hover:border-emerald-400 text-sm sm:text-base font-semibold transition-all duration-300 hover:scale-[1.02]"
            >
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 fill-emerald-400/20 text-emerald-400" />
              <span>{t('home.hero.whatsappCta', { phone: BRAND.phone })}</span>
            </a>
          </motion.div>

          {/* Search Bar Interface */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="w-full text-left"
          >
            <SearchBar />
          </motion.div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 1. EXPLORE PROPERTIES                                     */}
      {/* ========================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <Reveal className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-emerald-600 font-bold text-xs uppercase tracking-widest mb-2">
              <Sparkles className="w-3.5 h-3.5 animate-twinkle" />
              <span>{t('home.explore.eyebrow')}</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-navy-950 tracking-tight">
              {t('home.explore.titleLead')} <span className="anime-text-gradient">{t('home.explore.titleAccent')}</span>
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-1.5 max-w-xl">
              {t('home.explore.description')}
            </p>
          </div>

          <Link
            to="/properties"
            className="inline-flex items-center space-x-2 text-sm font-bold text-navy-900 hover:text-emerald-600 group transition-colors"
          >
            <span>{t('home.explore.viewAll', { count: properties.length })}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Reveal>

        {/* If zero properties, show elegant empty state */}
        {properties.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {displayProperties.map((prop, index) => (
              <PropertyCard key={prop.id} property={prop} index={index} />
            ))}
          </div>
        )}
      </section>

      {/* ========================================================= */}
      {/* 2. PROPERTY CATEGORIES                                    */}
      {/* ========================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-navy-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-anime-aurora opacity-70 animate-aurora pointer-events-none" aria-hidden="true" />
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none animate-floaty-slow" />

        <div className="max-w-7xl mx-auto relative z-10">
          <Reveal className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-emerald-400 font-bold text-xs uppercase tracking-widest block mb-2">
              {t('home.categories.eyebrow')}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
              {t('home.categories.titleLead')} <span className="anime-text-gradient">{t('home.categories.titleAccent')}</span>
            </h2>
            <p className="text-slate-300 text-sm sm:text-base">
              {t('home.categories.description')}
            </p>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {PROPERTY_CATEGORIES.map((cat, index) => {
              const matchingCount = properties.filter(p => p.category?.toLowerCase() === cat.name.toLowerCase()).length;

              return (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="group relative rounded-2xl overflow-hidden bg-navy-900 border border-navy-800 hover:border-emerald-500/50 shadow-glass-dark transition-all duration-300 flex flex-col justify-between"
                >
                  <Link to={`/properties?category=${encodeURIComponent(cat.name)}`} className="block">
                    {/* Decorative Visual */}
                    <div className="relative aspect-[16/11] overflow-hidden bg-navy-950">
                      <img
                        src={cat.image}
                        alt={categoryLabel(cat.name)}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/40 to-transparent" />
                      
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-navy-950/80 text-emerald-300 border border-emerald-500/30 backdrop-blur-md">
                          {categoryValue(cat.name, 'badge')}
                        </span>
                      </div>

                      <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                        <h3 className="font-serif text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                          {categoryLabel(cat.name)}
                        </h3>
                        <span className="text-xs text-slate-300 font-medium">
                          {matchingCount > 0 ? t('home.categories.listed', { count: matchingCount }) : t('home.categories.inquire')}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <p className="text-xs text-slate-400 leading-relaxed mb-3">
                        {categoryValue(cat.name, 'description')}
                      </p>

                      <div className="flex items-center justify-between text-xs font-semibold text-emerald-400 group-hover:text-emerald-300 pt-2 border-t border-navy-800">
                        <span>{t('home.categories.browse', { category: categoryLabel(cat.name) })}</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. POPULAR LOCATIONS IN SRI LANKA                         */}
      {/* ========================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <Reveal className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-emerald-600 font-bold text-xs uppercase tracking-widest block mb-2">
            {t('home.locations.eyebrow')}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-navy-950 tracking-tight mb-3">
            {t('home.locations.titleLead')} <span className="anime-text-gradient">{t('home.locations.titleAccent')}</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            {t('home.locations.description')}
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {POPULAR_LOCATIONS.map((loc, idx) => (
            <motion.div
              key={loc.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="group relative rounded-2xl overflow-hidden shadow-card-luxury hover:shadow-card-luxury-hover border border-slate-200 transition-all duration-300"
            >
              <Link to={`/properties?district=${encodeURIComponent(loc.district)}`} className="block">
                <div className="relative aspect-[16/10] overflow-hidden bg-navy-950">
                  <img
                    src={loc.image}
                    alt={t(`home.locations.${loc.name}.name`)}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/40 to-transparent" />
                  
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-navy-950/80 text-emerald-300 border border-emerald-500/30 backdrop-blur-md">
                      {t(`home.locations.${loc.name}.badge`)}
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center space-x-1.5 text-emerald-400 text-xs font-semibold mb-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{t('home.locations.districtSuffix', { district: districtLabel(loc.district) })}</span>
                    </div>
                    <h3 className="font-serif text-xl font-bold text-white mb-1 group-hover:text-emerald-300 transition-colors">
                      {t(`home.locations.${loc.name}.name`)}
                    </h3>
                    <p className="text-xs text-slate-300">
                      {t(`home.locations.${loc.name}.tagline`)}
                    </p>
                  </div>
                </div>

                <div className="p-3.5 bg-white flex items-center justify-between text-xs text-slate-600">
                  <span className="text-slate-500">{t(`home.locations.${loc.name}.highlights`)}</span>
                  <span className="text-emerald-600 font-bold shrink-0 ml-2 group-hover:translate-x-0.5 transition-transform flex items-center">
                    {t('home.locations.explore')} &rarr;
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. WHY CHOOSE PROPERTY LK?                                */}
      {/* ========================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-100/80 border-y border-slate-200">
        <div className="max-w-7xl mx-auto">
          <Reveal className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-emerald-600 font-bold text-xs uppercase tracking-widest block mb-2">
              {t('home.why.eyebrow')}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-navy-950 tracking-tight mb-3">
              {t('home.why.titleLead')} <span className="anime-text-gradient">PROPERTY LK</span>{t('home.why.titleTail')}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              {t('home.why.description')}
            </p>
          </Reveal>

          <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <StaggerItem className="anime-shimmer anime-glow-ring relative bg-white p-6 rounded-2xl shadow-card-luxury border border-slate-200/80 hover:border-emerald-500/40 hover:-translate-y-1.5 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-4">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-navy-950 mb-2">
                {t('home.why.whatsapp.title')}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {t('home.why.whatsapp.description')}
              </p>
            </StaggerItem>

            <StaggerItem className="anime-shimmer anime-glow-ring relative bg-white p-6 rounded-2xl shadow-card-luxury border border-slate-200/80 hover:border-emerald-500/40 hover:-translate-y-1.5 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-navy-950 mb-2">
                {t('home.why.fake.title')}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {t('home.why.fake.description')}
              </p>
            </StaggerItem>

            <StaggerItem className="anime-shimmer anime-glow-ring relative bg-white p-6 rounded-2xl shadow-card-luxury border border-slate-200/80 hover:border-emerald-500/40 hover:-translate-y-1.5 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-4">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-navy-950 mb-2">
                {t('home.why.districts.title')}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {t('home.why.districts.description')}
              </p>
            </StaggerItem>

            <StaggerItem className="anime-shimmer anime-glow-ring relative bg-white p-6 rounded-2xl shadow-card-luxury border border-slate-200/80 hover:border-emerald-500/40 hover:-translate-y-1.5 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-4">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-navy-950 mb-2">
                {t('home.why.showcase.title')}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {t('home.why.showcase.description')}
              </p>
            </StaggerItem>

          </StaggerGroup>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. HOW IT WORKS                                           */}
      {/* ========================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <Reveal className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-emerald-600 font-bold text-xs uppercase tracking-widest block mb-2">
            {t('home.steps.eyebrow')}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-navy-950 tracking-tight mb-3">
            {t('home.steps.titleLead')} <span className="anime-text-gradient">PROPERTY LK</span>{t('home.steps.titleTail')}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            {t('home.steps.description')}
          </p>
        </Reveal>

        <StaggerGroup className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          
          {/* Step 1 */}
          <StaggerItem className="anime-shimmer relative p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/90 shadow-card-luxury hover:-translate-y-1.5 hover:border-emerald-400/60 transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-navy-950 text-white font-bold flex items-center justify-center mb-5 text-sm">
              01
            </div>
            <h3 className="font-serif text-xl font-bold text-navy-950 mb-2">
              {t('home.steps.one.title')}
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              {t('home.steps.one.description')}
            </p>
          </StaggerItem>

          {/* Step 2 */}
          <StaggerItem className="anime-shimmer relative p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/90 shadow-card-luxury hover:-translate-y-1.5 hover:border-emerald-400/60 transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-navy-950 font-bold flex items-center justify-center mb-5 text-sm">
              02
            </div>
            <h3 className="font-serif text-xl font-bold text-navy-950 mb-2">
              {t('home.steps.two.title')}
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              {t('home.steps.two.description')}
            </p>
          </StaggerItem>

          {/* Step 3 */}
          <StaggerItem className="anime-shimmer relative p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/90 shadow-card-luxury hover:-translate-y-1.5 hover:border-emerald-400/60 transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-navy-950 text-white font-bold flex items-center justify-center mb-5 text-sm">
              03
            </div>
            <h3 className="font-serif text-xl font-bold text-navy-950 mb-2">
              {t('home.steps.three.title')}
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              {t('home.steps.three.description')}
            </p>
          </StaggerItem>

        </StaggerGroup>
      </section>

      {/* ========================================================= */}
      {/* 6. SELL YOUR PROPERTY TEASER                              */}
      {/* ========================================================= */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-anime-aurora opacity-70 animate-aurora pointer-events-none" aria-hidden="true" />
        <Reveal className="max-w-6xl mx-auto rounded-3xl p-8 sm:p-12 lg:p-16 border border-emerald-500/20 shadow-glass-dark relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          
          <div className="max-w-xl text-center lg:text-left">
            <span className="text-emerald-400 font-bold text-xs uppercase tracking-widest block mb-2">
              {t('home.sell.eyebrow')}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
              {t('home.sell.title')}
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
              {t('home.sell.description')}
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-slate-300">
              <div className="flex items-center space-x-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>{t('home.sell.feature1')}</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>{t('home.sell.feature2')}</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>{t('home.sell.feature3')}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full lg:w-auto">
            <Link
              to="/sell"
              className="anime-shimmer relative w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-navy-950 font-bold text-sm uppercase tracking-wider shadow-glow-emerald hover:scale-[1.02] transition-all duration-200"
            >
              <PlusCircle className="w-4 h-4 stroke-[2.5]" />
              <span className="relative z-10">{t('home.sell.submit')}</span>
            </Link>

            <a
              href={BRAND.createWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-4 rounded-xl bg-navy-800 hover:bg-navy-700 text-white font-semibold text-sm border border-navy-700 hover:border-emerald-500/50 transition-all duration-200 hover:scale-[1.02]"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>{t('home.sell.whatsapp')}</span>
            </a>
          </div>

        </Reveal>
      </section>

      {/* ========================================================= */}
      {/* 7. CONTACT & INQUIRY SECTION                              */}
      {/* ========================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <Reveal className="anime-glow-ring relative bg-white rounded-3xl border border-slate-200/90 shadow-card-luxury p-8 sm:p-12 lg:p-14">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            
            <div>
              <span className="text-emerald-600 font-bold text-xs uppercase tracking-widest block mb-2">
                {t('home.contact.eyebrow')}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-navy-950 tracking-tight mb-4">
                {t('home.contact.titleLead')} <span className="anime-text-gradient">{t('home.contact.titleAccent')}</span>
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
                {t('home.contact.description')}
              </p>

              <div className="space-y-4">
                <a
                  href={BRAND.createWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-4 p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 hover:bg-emerald-100/70 transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-500 text-navy-950 flex items-center justify-center shadow-md">
                    <MessageCircle className="w-6 h-6 fill-navy-950" />
                  </div>
                  <div>
                    <span className="block text-xs uppercase tracking-wider text-emerald-700 font-bold">{t('home.contact.officialWhatsapp')}</span>
                    <span className="font-serif text-lg font-bold text-navy-950">{BRAND.phone}</span>
                  </div>
                </a>

                <a
                  href={`tel:${BRAND.phoneRaw}`}
                  className="flex items-center space-x-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-navy-950 text-emerald-400 flex items-center justify-center shadow-md">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="block text-xs uppercase tracking-wider text-slate-500 font-bold">{t('home.contact.directPhone')}</span>
                    <span className="font-serif text-lg font-bold text-navy-950">{BRAND.phone}</span>
                  </div>
                </a>
              </div>
            </div>

            {/* Quick Inquiry Card */}
            <div className="anime-glow-ring relative bg-navy-950 rounded-2xl p-6 sm:p-8 text-white border border-navy-800 shadow-glass-dark">
              <div className="absolute inset-0 rounded-2xl bg-anime-aurora opacity-60 animate-aurora pointer-events-none" aria-hidden="true" />
              <h3 className="relative z-10 font-serif text-xl font-bold mb-2">
                {t('home.contact.cardTitle')}
              </h3>
              <p className="relative z-10 text-xs text-slate-300 leading-relaxed mb-6">
                {t('home.contact.cardDescription')}
              </p>

              <div className="relative z-10 space-y-4">
                <a
                  href={BRAND.createWhatsAppLink(t('home.contact.whatsappMessage'))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="anime-shimmer relative w-full flex items-center justify-center space-x-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-navy-950 font-bold text-sm tracking-wide shadow-glow-emerald hover:scale-[1.02] transition-all"
                >
                  <MessageCircle className="w-4 h-4 fill-navy-950" />
                  <span className="relative z-10">{t('home.contact.cardCta')}</span>
                </a>

                <Link
                  to="/contact"
                  className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-navy-900 hover:bg-navy-850 text-slate-200 text-xs font-semibold border border-navy-800 transition-colors"
                >
                  <span>{t('home.contact.visitContact')}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                </Link>
              </div>
            </div>

          </div>
        </Reveal>
      </section>

    </div>
  );
}
