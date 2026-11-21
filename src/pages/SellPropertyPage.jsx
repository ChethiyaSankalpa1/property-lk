import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  MapPin, 
  User, 
  Phone, 
  MessageCircle, 
  FileText, 
  CheckCircle2, 
  ShieldCheck, 
  Send, 
  HelpCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { BRAND } from '../constants/brand';
import { SRI_LANKA_DISTRICTS } from '../constants/districts';
import { PROPERTY_CATEGORIES } from '../constants/categories';

export default function SellPropertyPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    whatsappNumber: '',
    propertyType: 'House',
    district: 'Colombo',
    location: '',
    expectedPrice: '',
    description: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Validation
    if (!formData.fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!formData.whatsappNumber.trim()) {
      setErrorMsg('Please provide your WhatsApp contact number.');
      return;
    }
    if (!formData.location.trim()) {
      setErrorMsg('Please provide the location or city where the property is located.');
      return;
    }
    if (!formData.expectedPrice.trim()) {
      setErrorMsg('Please state your expected selling price.');
      return;
    }

    // Generate WhatsApp link
    const whatsappLink = BRAND.createSellPropertyLink(formData);

    // Open WhatsApp
    window.open(whatsappLink, '_blank', 'noopener,noreferrer');

    // Show Thank you state
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 sm:pt-28 pb-20">
      
      {/* Header Banner */}
      <div className="bg-navy-950 text-white py-14 px-4 sm:px-6 lg:px-8 border-b border-navy-800 relative overflow-hidden mb-10">
        <div className="absolute top-0 right-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-navy-900 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Direct Seller Service</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
            Sell Your Property in Sri Lanka
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Connect directly with verified property buyers. Submit your details below to instantly start an official WhatsApp listing consultation with PROPERTY LK.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Transparent Workflow Notice */}
        <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-start space-x-3.5 text-xs text-slate-600">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="text-navy-950 block text-sm mb-0.5">Zero Account Friction & Immediate WhatsApp Routing</strong>
            You do not need to register an account or remember passwords. Submitting this form opens your official WhatsApp chat with pre-formatted property specs directly sent to our verified desk ({BRAND.phone}).
          </div>
        </div>

        {/* Main Submission Form */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-card-luxury">
          
          {submitted ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-10 text-center space-y-5"
            >
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-navy-950">
                Thank you for contacting PROPERTY LK.
              </h2>
              
              <p className="text-base sm:text-lg text-emerald-700 font-semibold max-w-md mx-auto">
                We will contact you through WhatsApp.
              </p>

              <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
                If your WhatsApp didn't open automatically, you can message us directly with your property specifications anytime.
              </p>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={BRAND.createSellPropertyLink(formData)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-navy-950 font-bold text-xs uppercase tracking-wider shadow-glow-emerald"
                >
                  <MessageCircle className="w-4 h-4 fill-navy-950" />
                  <span>Open WhatsApp Again</span>
                </a>

                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider"
                >
                  Submit Another Property
                </button>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {errorMsg && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                  {errorMsg}
                </div>
              )}

              {/* Full Name & WhatsApp Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      name="fullName"
                      required
                      placeholder="e.g. Kasun Perera"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    WhatsApp Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="tel"
                      name="whatsappNumber"
                      required
                      placeholder="e.g. +94 77 123 4567"
                      value={formData.whatsappNumber}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Property Type & District */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Property Type <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <select
                      name="propertyType"
                      value={formData.propertyType}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium focus:outline-none focus:border-emerald-500 focus:bg-white transition-all cursor-pointer"
                    >
                      {PROPERTY_CATEGORIES.map(c => (
                        <option key={c.id} value={c.singular || c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    District <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <select
                      name="district"
                      value={formData.district}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium focus:outline-none focus:border-emerald-500 focus:bg-white transition-all cursor-pointer"
                    >
                      {SRI_LANKA_DISTRICTS.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Location & Expected Selling Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Location / City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    required
                    placeholder="e.g. Rajagiriya, Negombo Road, Kandy Town"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Expected Selling Price (LKR) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="expectedPrice"
                    required
                    placeholder="e.g. 45,000,000 or 4.5 Crore"
                    value={formData.expectedPrice}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Property Description & Specifications
                </label>
                <textarea
                  name="description"
                  rows={4}
                  placeholder="Detail land size in perches, number of bedrooms, house square footage, access road width, water/electricity availability, clear deed details, etc."
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center space-x-2 py-4 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-navy-950 font-bold text-sm uppercase tracking-wider shadow-glow-emerald hover:shadow-xl transition-all duration-300 hover:scale-[1.01]"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Property</span>
                </button>
              </div>

              <div className="text-center text-xs text-slate-400">
                Submissions open WhatsApp directly with official representative: {BRAND.phone}
              </div>

            </form>
          )}

        </div>

      </div>

    </div>
  );
}
