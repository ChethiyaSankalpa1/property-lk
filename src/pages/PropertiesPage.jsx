import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  RotateCcw, 
  Grid, 
  List, 
  MapPin, 
  Building2, 
  SlidersHorizontal,
  ChevronDown,
  X,
  MessageCircle,
  PlusCircle,
  Sparkles
} from 'lucide-react';
import { BRAND } from '../constants/brand';
import { SRI_LANKA_DISTRICTS } from '../constants/districts';
import { PROPERTY_CATEGORIES } from '../constants/categories';
import { useProperties } from '../context/PropertyContext';
import PropertyCard from '../components/common/PropertyCard';
import EmptyState from '../components/common/EmptyState';
import { EASE_ANIME } from '../components/motion/motionVariants';
import { useLanguage } from '../i18n/LanguageContext';

export default function PropertiesPage() {
  const { properties } = useProperties();
  const [searchParams, setSearchParams] = useSearchParams();
  const reduceMotion = useReducedMotion();
  const { t, districtLabel, categoryLabel } = useLanguage();

  // Filters state initialized from query params
  const [keyword, setKeyword] = useState(searchParams.get('q') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [district, setDistrict] = useState(searchParams.get('district') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [minBeds, setMinBeds] = useState(searchParams.get('beds') || '');
  const [minBaths, setMinBaths] = useState(searchParams.get('baths') || '');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync state if URL query params change
  useEffect(() => {
    if (searchParams.get('category')) setCategory(searchParams.get('category'));
    if (searchParams.get('district')) setDistrict(searchParams.get('district'));
  }, [searchParams]);

  // Reset all filters
  const handleResetFilters = () => {
    setKeyword('');
    setCategory('');
    setDistrict('');
    setMinPrice('');
    setMaxPrice('');
    setMinBeds('');
    setMinBaths('');
    setSortBy('newest');
    setSearchParams({});
  };

  // Filter & Sort Logic
  const filteredProperties = useMemo(() => {
    return properties.filter((prop) => {
      // Keyword search in title, description, city, referenceId
      if (keyword.trim()) {
        const query = keyword.toLowerCase();
        const matchesTitle = prop.title?.toLowerCase().includes(query);
        const matchesDesc = prop.description?.toLowerCase().includes(query);
        const matchesCity = prop.city?.toLowerCase().includes(query);
        const matchesRef = prop.referenceId?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesCity && !matchesRef) {
          return false;
        }
      }

      // Category filter
      if (category && prop.category?.toLowerCase() !== category.toLowerCase()) {
        return false;
      }

      // District filter
      if (district && prop.district?.toLowerCase() !== district.toLowerCase()) {
        return false;
      }

      // Price filter
      const price = Number(prop.price) || 0;
      if (minPrice && price < Number(minPrice)) return false;
      if (maxPrice && price > Number(maxPrice)) return false;

      // Bedrooms
      if (minBeds && (Number(prop.bedrooms) || 0) < Number(minBeds)) return false;

      // Bathrooms
      if (minBaths && (Number(prop.bathrooms) || 0) < Number(minBaths)) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') {
        return (Number(a.price) || 0) - (Number(b.price) || 0);
      }
      if (sortBy === 'price-high') {
        return (Number(b.price) || 0) - (Number(a.price) || 0);
      }
      // 'newest' default (by createdAt or id)
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });
  }, [properties, keyword, category, district, minPrice, maxPrice, minBeds, minBaths, sortBy]);

  const activeFilterCount = [
    category,
    district,
    minPrice,
    maxPrice,
    minBeds,
    minBaths,
    keyword
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-slate-50 pt-24 sm:pt-28 pb-20">
      
      {/* Header Banner */}
      <div className="bg-navy-950 text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-navy-800 relative overflow-hidden mb-8">
        <div className="absolute inset-0 bg-anime-aurora opacity-70 animate-aurora pointer-events-none" aria-hidden="true" />
        <div className="absolute top-0 right-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none animate-floaty-slow" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center space-x-1.5 text-emerald-400 font-bold text-xs uppercase tracking-widest mb-2">
                <Sparkles className="w-3.5 h-3.5 animate-twinkle" />
                <span>{t('properties.hero.eyebrow')}</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl font-extrabold tracking-tight">
                {t('properties.hero.titlePrefix')} <span className="anime-text-gradient">{t('properties.hero.titleHighlight')}</span> {t('properties.hero.titleSuffix')}
              </h1>
              <p className="text-slate-300 text-sm mt-1 max-w-xl">
                {t('properties.hero.subtitle')}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/sell"
                className="anime-shimmer relative inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-navy-950 font-bold text-xs uppercase tracking-wider shadow-glow-emerald hover:scale-[1.02] transition-all"
              >
                <PlusCircle className="w-4 h-4 stroke-[2.5]" />
                <span className="relative z-10">{t('properties.listProperty')}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Controls Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-6 flex flex-col lg:flex-row items-center justify-between gap-4">
          
          {/* Keyword Search Input */}
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder={t('properties.filters.searchPlaceholder')}
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-base sm:text-sm font-medium focus:outline-none focus:border-emerald-500 transition-colors"
            />
            {keyword && (
              <button 
                onClick={() => setKeyword('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Filters / Mobile Toggle / View Controls */}
          <div className="flex items-center justify-between w-full lg:w-auto gap-3">
            
            {/* Mobile Filter Button */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-navy-950 text-white text-xs font-bold uppercase tracking-wider"
            >
              <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
              <span>{t('properties.filters.mobileLabel')} {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-500 font-medium hidden sm:inline">{t('properties.filters.sortLabel')}</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-base sm:text-sm font-semibold text-navy-950 focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="newest">{t('properties.filters.sortNewest')}</option>
                <option value="price-low">{t('properties.filters.sortPriceLow')}</option>
                <option value="price-high">{t('properties.filters.sortPriceHigh')}</option>
              </select>
            </div>

            {/* Total Results Count */}
            <span className="text-xs font-bold text-slate-600 px-2 py-1 rounded bg-slate-100">
              {filteredProperties.length} {filteredProperties.length === 1 ? t('properties.results.one') : t('properties.results.other')}
            </span>
          </div>

        </div>

        {/* Main Catalog Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-1 space-y-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-fit sticky top-28">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2 font-serif font-bold text-navy-950">
                <Filter className="w-4 h-4 text-emerald-600" />
                <span>{t('properties.filters.title')}</span>
              </div>
              {activeFilterCount > 0 && (
                <button
                  onClick={handleResetFilters}
                  className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center space-x-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>{t('properties.filters.reset')}</span>
                </button>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                {t('properties.filters.categoryLabel')}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium text-navy-950 focus:outline-none focus:border-emerald-500"
              >
                <option value="">{t('properties.filters.allCategories')}</option>
                {PROPERTY_CATEGORIES.map(c => (
                  <option key={c.id} value={c.name}>{categoryLabel(c.name)}</option>
                ))}
              </select>
            </div>

            {/* District */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                {t('properties.filters.districtLabel')}
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium text-navy-950 focus:outline-none focus:border-emerald-500"
              >
                <option value="">{t('properties.filters.allDistricts')}</option>
                {SRI_LANKA_DISTRICTS.map(d => (
                  <option key={d} value={d}>{districtLabel(d)}</option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                {t('properties.filters.priceLabel')}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder={t('properties.filters.minPlaceholder')}
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-emerald-500"
                />
                <input
                  type="number"
                  placeholder={t('properties.filters.maxPlaceholder')}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Bedrooms & Bathrooms */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  {t('properties.filters.bedroomsLabel')}
                </label>
                <select
                  value={minBeds}
                  onChange={(e) => setMinBeds(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-navy-950 focus:outline-none focus:border-emerald-500"
                >
                  <option value="">{t('properties.filters.anyOption')}</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                  <option value="5">5+</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  {t('properties.filters.bathroomsLabel')}
                </label>
                <select
                  value={minBaths}
                  onChange={(e) => setMinBaths(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-navy-950 focus:outline-none focus:border-emerald-500"
                >
                  <option value="">{t('properties.filters.anyOption')}</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                </select>
              </div>
            </div>

            {/* Need Custom Property Inquiries */}
            <div className="relative overflow-hidden p-4 rounded-xl bg-navy-950 text-white text-xs space-y-2 mt-4">
              <div className="absolute inset-0 bg-anime-aurora opacity-70 animate-aurora pointer-events-none" aria-hidden="true" />
              <span className="relative z-10 font-bold text-emerald-400 block">{t('properties.filters.asideTitle')}</span>
              <p className="relative z-10 text-slate-300 text-[11px] leading-relaxed">
                {t('properties.filters.asideBody')}
              </p>
              <a
                href={BRAND.createWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="relative z-10 inline-flex items-center space-x-1.5 text-emerald-400 font-bold hover:underline pt-1"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>{BRAND.phone}</span>
              </a>
            </div>
          </aside>

          {/* Properties Grid Area */}
          <main className="lg:col-span-3">
            {properties.length === 0 ? (
              // Initial Zero Properties Empty State as strictly instructed
              <EmptyState 
                title={t('properties.empty.title')}
                subtitle={t('properties.empty.subtitle')}
              />
            ) : filteredProperties.length === 0 ? (
              // Empty state when search filters produce 0 matches
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: EASE_ANIME }}
                className="anime-glow-ring relative overflow-hidden bg-white rounded-2xl p-10 text-center border border-slate-200 shadow-sm"
              >
                <div className="mx-auto w-14 h-14 mb-4 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 animate-bobble">
                  <Search className="w-7 h-7" />
                </div>
                <h3 className="font-serif text-xl font-bold text-navy-950 mb-2">
                  {t('properties.noResults.title')}
                </h3>
                <p className="text-sm text-slate-500 mb-6 max-w-md mx-auto">
                  {t('properties.noResults.subtitle')}
                </p>
                <motion.button
                  onClick={handleResetFilters}
                  whileHover={reduceMotion ? undefined : { scale: 1.03 }}
                  whileTap={reduceMotion ? undefined : { scale: 0.97 }}
                  className="anime-shimmer relative inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-navy-950 text-white text-xs font-bold uppercase tracking-wider"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="relative z-10">{t('properties.filters.resetAll')}</span>
                </motion.button>
              </motion.div>
            ) : (
              // Real properties display
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProperties.map((prop, index) => (
                  <PropertyCard key={prop.id} property={prop} index={index} />
                ))}
              </div>
            )}
          </main>

        </div>

      </div>

      {/* Mobile Filters Drawer Modal */}
      <AnimatePresence>
        {mobileFilterOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end lg:hidden"
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full max-w-xs sm:max-w-sm bg-white h-full p-6 pb-[calc(2rem+env(safe-area-inset-bottom))] flex flex-col justify-between overflow-y-auto"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b pb-4">
                  <h3 className="font-serif font-bold text-lg text-navy-950">
                    {t('properties.filters.title')}
                  </h3>
                  <button 
                    onClick={() => setMobileFilterOpen(false)}
                    className="p-2.5 rounded-lg hover:bg-slate-100"
                    aria-label={t('properties.filters.closeAria')}
                  >
                    <X className="w-5 h-5 text-slate-600" />
                  </button>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                    {t('properties.filters.categoryLabel')}
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 text-sm"
                  >
                    <option value="">{t('properties.filters.allCategories')}</option>
                    {PROPERTY_CATEGORIES.map(c => (
                      <option key={c.id} value={c.name}>{categoryLabel(c.name)}</option>
                    ))}
                  </select>
                </div>

                {/* District */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                    {t('properties.filters.districtLabel')}
                  </label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 text-sm"
                  >
                    <option value="">{t('properties.filters.allDistricts')}</option>
                    {SRI_LANKA_DISTRICTS.map(d => (
                      <option key={d} value={d}>{districtLabel(d)}</option>
                    ))}
                  </select>
                </div>

                {/* Price */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                    {t('properties.filters.priceRangeLabel')}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder={t('properties.filters.minShort')}
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="p-2.5 rounded-xl border border-slate-200 text-sm"
                    />
                    <input
                      type="number"
                      placeholder={t('properties.filters.maxShort')}
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="p-2.5 rounded-xl border border-slate-200 text-sm"
                    />
                  </div>
                </div>

                {/* Beds / Baths */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                      {t('properties.filters.bedsShort')}
                    </label>
                    <select
                      value={minBeds}
                      onChange={(e) => setMinBeds(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-sm"
                    >
                      <option value="">{t('properties.filters.anyOption')}</option>
                      <option value="1">1+</option>
                      <option value="2">2+</option>
                      <option value="3">3+</option>
                      <option value="4">4+</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                      {t('properties.filters.bathsShort')}
                    </label>
                    <select
                      value={minBaths}
                      onChange={(e) => setMinBaths(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-sm"
                    >
                      <option value="">{t('properties.filters.anyOption')}</option>
                      <option value="1">1+</option>
                      <option value="2">2+</option>
                      <option value="3">3+</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t flex flex-col gap-2">
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-full py-3 rounded-xl bg-emerald-500 text-navy-950 font-bold text-sm uppercase tracking-wider"
                >
                  {t('properties.filters.showResults', { count: filteredProperties.length })}
                </button>
                <button
                  onClick={handleResetFilters}
                  className="w-full py-2.5 rounded-xl text-slate-500 text-xs font-semibold"
                >
                  {t('properties.filters.resetAll')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
