import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Search, MapPin, Building2, DollarSign, Filter, RotateCcw } from 'lucide-react';
import { SRI_LANKA_DISTRICTS } from '../../constants/districts';
import { PROPERTY_CATEGORIES } from '../../constants/categories';
import { EASE_ANIME } from '../motion/motionVariants';
import { useLanguage } from '../../i18n/LanguageContext';

export default function SearchBar({ initialValues = {}, onSearch, isCompact = false }) {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const { t, districtLabel, categoryLabel } = useLanguage();

  const [category, setCategory] = useState(initialValues.category || '');
  const [district, setDistrict] = useState(initialValues.district || '');
  const [minPrice, setMinPrice] = useState(initialValues.minPrice || '');
  const [maxPrice, setMaxPrice] = useState(initialValues.maxPrice || '');

  const handleSearchSubmit = (e) => {
    e?.preventDefault();

    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (district) params.set('district', district);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);

    if (onSearch) {
      onSearch({ category, district, minPrice, maxPrice });
    } else {
      navigate(`/properties?${params.toString()}`);
    }
  };

  const handleReset = () => {
    setCategory('');
    setDistrict('');
    setMinPrice('');
    setMaxPrice('');
    if (onSearch) {
      onSearch({ category: '', district: '', minPrice: '', maxPrice: '' });
    }
  };

  return (
    <motion.form
      onSubmit={handleSearchSubmit}
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 22, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: reduceMotion ? 0.2 : 0.6, ease: EASE_ANIME, delay: 0.15 }}
      whileHover={reduceMotion ? undefined : { y: -3 }}
      className={`anime-glow-ring group/search relative w-full rounded-2xl sm:rounded-3xl shadow-2xl transition-all duration-300 ${
        isCompact 
          ? 'bg-white p-4 border border-slate-200 hover:shadow-glow-neon' 
          : 'bg-navy-950/85 backdrop-blur-xl border border-navy-700/80 p-3 sm:p-5 text-white hover:border-emerald-400/50'
      }`}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Category Field */}
        <div className="space-y-1">
          <label className={`block text-[11px] font-bold uppercase tracking-wider ${isCompact ? 'text-slate-600' : 'text-slate-300'}`}>
            {t('properties.search.categoryLabel')}
          </label>
          <div className="relative">
            <Building2 className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${isCompact ? 'text-slate-400' : 'text-emerald-400'}`} />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm font-medium appearance-none outline-none transition-all cursor-pointer ${
                isCompact
                  ? 'bg-slate-100 text-navy-900 border border-slate-200 focus:border-emerald-500'
                  : 'bg-navy-900/90 text-white border border-navy-700/80 focus:border-emerald-400'
              }`}
            >
              <option value="" className={isCompact ? 'text-slate-700' : 'bg-navy-950 text-white'}>
                {t('properties.search.allCategories')}
              </option>
              {PROPERTY_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.name} className={isCompact ? 'text-slate-900' : 'bg-navy-950 text-white'}>
                  {categoryLabel(cat.name)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* District Field */}
        <div className="space-y-1">
          <label className={`block text-[11px] font-bold uppercase tracking-wider ${isCompact ? 'text-slate-600' : 'text-slate-300'}`}>
            {t('properties.search.districtLabel')}
          </label>
          <div className="relative">
            <MapPin className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${isCompact ? 'text-slate-400' : 'text-emerald-400'}`} />
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm font-medium appearance-none outline-none transition-all cursor-pointer ${
                isCompact
                  ? 'bg-slate-100 text-navy-900 border border-slate-200 focus:border-emerald-500'
                  : 'bg-navy-900/90 text-white border border-navy-700/80 focus:border-emerald-400'
              }`}
            >
              <option value="" className={isCompact ? 'text-slate-700' : 'bg-navy-950 text-white'}>
                {t('properties.search.allDistricts')}
              </option>
              {SRI_LANKA_DISTRICTS.map((dist) => (
                <option key={dist} value={dist} className={isCompact ? 'text-slate-900' : 'bg-navy-950 text-white'}>
                  {districtLabel(dist)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Min Price Field */}
        <div className="space-y-1">
          <label className={`block text-[11px] font-bold uppercase tracking-wider ${isCompact ? 'text-slate-600' : 'text-slate-300'}`}>
            {t('properties.search.minPriceLabel')}
          </label>
          <div className="relative">
            <span className={`absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold ${isCompact ? 'text-slate-400' : 'text-emerald-400'}`}>
              {t('common.currency.symbol')}
            </span>
            <input
              type="number"
              placeholder={t('properties.search.minPlaceholder')}
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm font-medium outline-none transition-all ${
                isCompact
                  ? 'bg-slate-100 text-navy-900 border border-slate-200 focus:border-emerald-500'
                  : 'bg-navy-900/90 text-white placeholder-slate-400 border border-navy-700/80 focus:border-emerald-400'
              }`}
            />
          </div>
        </div>

        {/* Max Price Field */}
        <div className="space-y-1">
          <label className={`block text-[11px] font-bold uppercase tracking-wider ${isCompact ? 'text-slate-600' : 'text-slate-300'}`}>
            {t('properties.search.maxPriceLabel')}
          </label>
          <div className="relative">
            <span className={`absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold ${isCompact ? 'text-slate-400' : 'text-emerald-400'}`}>
              {t('common.currency.symbol')}
            </span>
            <input
              type="number"
              placeholder={t('properties.search.maxPlaceholder')}
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm font-medium outline-none transition-all ${
                isCompact
                  ? 'bg-slate-100 text-navy-900 border border-slate-200 focus:border-emerald-500'
                  : 'bg-navy-900/90 text-white placeholder-slate-400 border border-navy-700/80 focus:border-emerald-400'
              }`}
            />
          </div>
        </div>

      </div>

      {/* Buttons */}
      <div className="mt-4 flex flex-col sm:flex-row items-center justify-end gap-2.5 pt-3 border-t border-slate-200/20">
        {(category || district || minPrice || maxPrice) && (
          <motion.button
            type="button"
            onClick={handleReset}
            whileHover={reduceMotion ? undefined : { rotate: -180 }}
            transition={{ duration: 0.4, ease: EASE_ANIME }}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t('properties.search.reset')}</span>
          </motion.button>
        )}

        <motion.button
          type="submit"
          whileHover={reduceMotion ? undefined : { scale: 1.03, y: -2 }}
          whileTap={reduceMotion ? undefined : { scale: 0.97 }}
          transition={{ duration: 0.25, ease: EASE_ANIME }}
          className="anime-shimmer relative w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-navy-950 font-bold text-sm uppercase tracking-wider shadow-glow-emerald hover:shadow-lg transition-all duration-200"
        >
          <Search className="w-4 h-4 stroke-[2.5]" />
          <span className="relative z-10">{t('properties.search.submit')}</span>
        </motion.button>
      </div>
    </motion.form>
  );
}
