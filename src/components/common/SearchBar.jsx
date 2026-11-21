import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Building2, DollarSign, Filter, RotateCcw } from 'lucide-react';
import { SRI_LANKA_DISTRICTS } from '../../constants/districts';
import { PROPERTY_CATEGORIES } from '../../constants/categories';

export default function SearchBar({ initialValues = {}, onSearch, isCompact = false }) {
  const navigate = useNavigate();

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
    <form 
      onSubmit={handleSearchSubmit}
      className={`w-full rounded-2xl sm:rounded-3xl shadow-2xl transition-all duration-300 ${
        isCompact 
          ? 'bg-white p-4 border border-slate-200' 
          : 'bg-navy-950/85 backdrop-blur-xl border border-navy-700/80 p-3 sm:p-5 text-white'
      }`}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Category Field */}
        <div className="space-y-1">
          <label className={`block text-[11px] font-bold uppercase tracking-wider ${isCompact ? 'text-slate-600' : 'text-slate-300'}`}>
            Property Category
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
                All Categories
              </option>
              {PROPERTY_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.name} className={isCompact ? 'text-slate-900' : 'bg-navy-950 text-white'}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* District Field */}
        <div className="space-y-1">
          <label className={`block text-[11px] font-bold uppercase tracking-wider ${isCompact ? 'text-slate-600' : 'text-slate-300'}`}>
            District in Sri Lanka
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
                All 25 Districts
              </option>
              {SRI_LANKA_DISTRICTS.map((dist) => (
                <option key={dist} value={dist} className={isCompact ? 'text-slate-900' : 'bg-navy-950 text-white'}>
                  {dist}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Min Price Field */}
        <div className="space-y-1">
          <label className={`block text-[11px] font-bold uppercase tracking-wider ${isCompact ? 'text-slate-600' : 'text-slate-300'}`}>
            Min Price (LKR)
          </label>
          <div className="relative">
            <span className={`absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold ${isCompact ? 'text-slate-400' : 'text-emerald-400'}`}>
              Rs.
            </span>
            <input
              type="number"
              placeholder="Min budget"
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
            Max Price (LKR)
          </label>
          <div className="relative">
            <span className={`absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold ${isCompact ? 'text-slate-400' : 'text-emerald-400'}`}>
              Rs.
            </span>
            <input
              type="number"
              placeholder="Max budget"
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
          <button
            type="button"
            onClick={handleReset}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        )}

        <button
          type="submit"
          className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-navy-950 font-bold text-sm uppercase tracking-wider shadow-glow-emerald hover:shadow-lg transition-all duration-200"
        >
          <Search className="w-4 h-4 stroke-[2.5]" />
          <span>Find Properties</span>
        </button>
      </div>
    </form>
  );
}
