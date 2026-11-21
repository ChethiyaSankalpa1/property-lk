import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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
import PropertyCard from '../components/common/PropertyCard';
import EmptyState from '../components/common/EmptyState';
import SearchBar from '../components/common/SearchBar';

export default function HomePage() {
  const { properties } = useProperties();
  const featuredProperties = properties.filter(p => p.isFeatured && !p.isSold);
  const displayProperties = featuredProperties.length > 0 ? featuredProperties.slice(0, 6) : properties.slice(0, 6);

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
            alt="Luxury Sri Lanka Property"
            className="w-full h-full object-cover object-center scale-105 animate-pulse-slow"
          />
          {/* Multi-layered dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/75 to-navy-950/60" />
          <div className="absolute inset-0 bg-navy-950/40 backdrop-blur-[2px]" />
        </div>

        {/* Floating subtle ambient accents */}
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-navy-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto w-full text-center">
          
          {/* Subtle Tagline Badge */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-navy-900/80 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm font-semibold tracking-wider uppercase mb-6 shadow-glow-emerald backdrop-blur-md"
          >
            <Sparkles className="w-3.5 h-3.5 fill-emerald-400" />
            <span>Sri Lanka's Premier Real Estate Marketplace</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.15] mb-6 drop-shadow-lg"
          >
            Find Your Perfect Property in{' '}
            <span className="text-emerald-400 relative inline-block">
              Sri Lanka
              <span className="absolute bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-transparent rounded-full" />
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-slate-200 font-normal leading-relaxed mb-8 sm:mb-10"
          >
            Discover your next home, land, or investment opportunity with <strong className="text-white font-semibold">PROPERTY LK</strong>.
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
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-7 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-navy-950 font-bold text-sm sm:text-base uppercase tracking-wider shadow-glow-emerald hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
              <span>Buy Property</span>
            </Link>

            <Link
              to="/sell"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-7 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-navy-900/90 hover:bg-navy-850 text-white font-bold text-sm sm:text-base border border-navy-700 hover:border-emerald-500/50 transition-all duration-300 hover:scale-[1.02]"
            >
              <PlusCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
              <span>Sell Your Property</span>
            </Link>

            <a
              href={BRAND.createWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-500/40 text-sm sm:text-base font-semibold transition-all duration-300"
            >
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 fill-emerald-400/20 text-emerald-400" />
              <span>WhatsApp: +94 71 654 5457</span>
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
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-emerald-600 font-bold text-xs uppercase tracking-widest mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Exclusive Portfolio</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-navy-950 tracking-tight">
              Explore Properties
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-1.5 max-w-xl">
              Discover verified houses, lands, and commercial opportunities across Sri Lanka.
            </p>
          </div>

          <Link
            to="/properties"
            className="inline-flex items-center space-x-2 text-sm font-bold text-navy-900 hover:text-emerald-600 group transition-colors"
          >
            <span>View All Properties ({properties.length})</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* If zero properties, show elegant empty state */}
        {properties.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {displayProperties.map((prop) => (
              <PropertyCard key={prop.id} property={prop} />
            ))}
          </div>
        )}
      </section>

      {/* ========================================================= */}
      {/* 2. PROPERTY CATEGORIES                                    */}
      {/* ========================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-navy-950 text-white relative overflow-hidden">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-emerald-400 font-bold text-xs uppercase tracking-widest block mb-2">
              Curated Asset Classes
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
              Property Categories
            </h2>
            <p className="text-slate-300 text-sm sm:text-base">
              Explore Sri Lanka's leading property sectors, from residential lands to hospitality developments.
            </p>
          </div>

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
                        alt={cat.name}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/40 to-transparent" />
                      
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-navy-950/80 text-emerald-300 border border-emerald-500/30 backdrop-blur-md">
                          {cat.badge}
                        </span>
                      </div>

                      <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                        <h3 className="font-serif text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                          {cat.name}
                        </h3>
                        <span className="text-xs text-slate-300 font-medium">
                          {matchingCount > 0 ? `${matchingCount} Listed` : 'Inquire Now'}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
                        {cat.description}
                      </p>

                      <div className="flex items-center justify-between text-xs font-semibold text-emerald-400 group-hover:text-emerald-300 pt-2 border-t border-navy-800">
                        <span>Browse {cat.name}</span>
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
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-emerald-600 font-bold text-xs uppercase tracking-widest block mb-2">
            Prime Island Hubs
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-navy-950 tracking-tight mb-3">
            Popular Locations
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            High-demand investment destinations across Sri Lanka's leading urban centers and coastal regions.
          </p>
        </div>

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
                    alt={loc.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/40 to-transparent" />
                  
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-navy-950/80 text-emerald-300 border border-emerald-500/30 backdrop-blur-md">
                      {loc.badge}
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center space-x-1.5 text-emerald-400 text-xs font-semibold mb-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{loc.district} District</span>
                    </div>
                    <h3 className="font-serif text-xl font-bold text-white mb-1 group-hover:text-emerald-300 transition-colors">
                      {loc.name}
                    </h3>
                    <p className="text-xs text-slate-300 line-clamp-1">
                      {loc.tagline}
                    </p>
                  </div>
                </div>

                <div className="p-3.5 bg-white flex items-center justify-between text-xs text-slate-600">
                  <span className="truncate text-slate-500">{loc.highlights}</span>
                  <span className="text-emerald-600 font-bold shrink-0 ml-2 group-hover:translate-x-0.5 transition-transform flex items-center">
                    Explore &rarr;
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
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-emerald-600 font-bold text-xs uppercase tracking-widest block mb-2">
              The Property LK Advantage
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-navy-950 tracking-tight mb-3">
              Why Choose PROPERTY LK?
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              A modern real estate platform tailored specifically to Sri Lankan buyers, sellers, and investors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-white p-6 rounded-2xl shadow-card-luxury border border-slate-200/80 hover:border-emerald-500/40 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-4">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-navy-950 mb-2">
                Direct WhatsApp Inquiries
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Skip complicated email forms and delays. Connect directly with property representatives over WhatsApp with pre-filled reference codes.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-card-luxury border border-slate-200/80 hover:border-emerald-500/40 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-navy-950 mb-2">
                No Fake Listings
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Zero synthetic properties or placeholder prices. Every single listing published on PROPERTY LK is authentic and manually reviewed.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-card-luxury border border-slate-200/80 hover:border-emerald-500/40 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-4">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-navy-950 mb-2">
                All 25 Districts
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                From Colombo commercial hubs to scenic tea estates in Nuwara Eliya and coastal villas in Galle, explore opportunities across all provinces.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-card-luxury border border-slate-200/80 hover:border-emerald-500/40 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-4">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-navy-950 mb-2">
                High-Impact Showcase
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Premium photography galleries, clear land perches, house square-footages, and transparent negotiable pricing indicators.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. HOW IT WORKS                                           */}
      {/* ========================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-emerald-600 font-bold text-xs uppercase tracking-widest block mb-2">
            Simple 3-Step Process
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-navy-950 tracking-tight mb-3">
            How PROPERTY LK Works
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Whether buying your dream home or listing your land for sale, our workflow is simple, fast, and transparent.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          
          {/* Step 1 */}
          <div className="relative p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/90 shadow-card-luxury">
            <div className="w-10 h-10 rounded-xl bg-navy-950 text-white font-bold flex items-center justify-center mb-5 text-sm">
              01
            </div>
            <h3 className="font-serif text-xl font-bold text-navy-950 mb-2">
              Browse or Submit
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Explore available properties by district and budget, or submit your own property details using our quick listing form.
            </p>
          </div>

          {/* Step 2 */}
          <div className="relative p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/90 shadow-card-luxury">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-navy-950 font-bold flex items-center justify-center mb-5 text-sm">
              02
            </div>
            <h3 className="font-serif text-xl font-bold text-navy-950 mb-2">
              Connect on WhatsApp
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Click to initiate an immediate WhatsApp chat with pre-filled property reference codes and specifics for prompt response.
            </p>
          </div>

          {/* Step 3 */}
          <div className="relative p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/90 shadow-card-luxury">
            <div className="w-10 h-10 rounded-xl bg-navy-950 text-white font-bold flex items-center justify-center mb-5 text-sm">
              03
            </div>
            <h3 className="font-serif text-xl font-bold text-navy-950 mb-2">
              Inspect & Close
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Schedule direct on-site property viewings, deed verifications, and negotiate fair terms with complete peace of mind.
            </p>
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 6. SELL YOUR PROPERTY TEASER                              */}
      {/* ========================================================= */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 text-white relative overflow-hidden">
        <div className="max-w-6xl mx-auto rounded-3xl p-8 sm:p-12 lg:p-16 border border-emerald-500/20 shadow-glass-dark relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          
          <div className="max-w-xl text-center lg:text-left">
            <span className="text-emerald-400 font-bold text-xs uppercase tracking-widest block mb-2">
              Have Property To Sell?
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
              Sell Your Property With PROPERTY LK
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
              Reach genuine buyers looking for houses, lands, and commercial spaces across Sri Lanka. No customer accounts required.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-slate-300">
              <div className="flex items-center space-x-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Zero Account Friction</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Direct WhatsApp Submission</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>All 25 Districts</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full lg:w-auto">
            <Link
              to="/sell"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-navy-950 font-bold text-sm uppercase tracking-wider shadow-glow-emerald transition-all duration-200"
            >
              <PlusCircle className="w-4 h-4 stroke-[2.5]" />
              <span>Submit Property Now</span>
            </Link>

            <a
              href={BRAND.createWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-4 rounded-xl bg-navy-800 hover:bg-navy-700 text-white font-semibold text-sm border border-navy-700 transition-all duration-200"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp Inquiry</span>
            </a>
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 7. CONTACT & INQUIRY SECTION                              */}
      {/* ========================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-card-luxury p-8 sm:p-12 lg:p-14">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            
            <div>
              <span className="text-emerald-600 font-bold text-xs uppercase tracking-widest block mb-2">
                Get In Touch
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-navy-950 tracking-tight mb-4">
                We're Here to Help You Find or Sell Real Estate
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
                Have questions about land titles, property prices in specific districts, or scheduling an inspection? Contact our official line or start a WhatsApp chat anytime.
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
                    <span className="block text-xs uppercase tracking-wider text-emerald-700 font-bold">Official WhatsApp</span>
                    <span className="font-serif text-lg font-bold text-navy-950">+94 71 654 5457</span>
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
                    <span className="block text-xs uppercase tracking-wider text-slate-500 font-bold">Direct Phone Call</span>
                    <span className="font-serif text-lg font-bold text-navy-950">+94 71 654 5457</span>
                  </div>
                </a>
              </div>
            </div>

            {/* Quick Inquiry Card */}
            <div className="bg-navy-950 rounded-2xl p-6 sm:p-8 text-white border border-navy-800 shadow-glass-dark">
              <h3 className="font-serif text-xl font-bold mb-2">
                Direct WhatsApp Property Assistance
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-6">
                Tell us what kind of property you are looking for (e.g., "3 Bedroom House in Kandy under 35 Million") and we will assist your search.
              </p>

              <div className="space-y-4">
                <a
                  href={BRAND.createWhatsAppLink("Hello PROPERTY LK, I am looking to buy a property in Sri Lanka. Please assist me with available options.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center space-x-2 py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-navy-950 font-bold text-sm tracking-wide shadow-glow-emerald transition-all"
                >
                  <MessageCircle className="w-4 h-4 fill-navy-950" />
                  <span>Start WhatsApp Consultation</span>
                </a>

                <Link
                  to="/contact"
                  className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-navy-900 hover:bg-navy-850 text-slate-200 text-xs font-semibold border border-navy-800 transition-colors"
                >
                  <span>Visit Full Contact Page</span>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
