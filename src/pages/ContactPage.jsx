import React, { useState } from 'react';
import { motion } from 'framer-motion';
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

export default function ContactPage() {
  const [inquiryType, setInquiryType] = useState('Buying Property');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    const fullText = `*PROPERTY LK - GENERAL INQUIRY*\n\n*Name:* ${name || 'Prospective Client'}\n*Inquiry Category:* ${inquiryType}\n*Message:* ${message || 'I would like to inquire about Sri Lankan real estate.'}`;
    window.open(BRAND.createWhatsAppLink(fullText), '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 sm:pt-28 pb-20">
      
      {/* Header Banner */}
      <div className="bg-navy-950 text-white py-14 px-4 sm:px-6 lg:px-8 border-b border-navy-800 relative overflow-hidden mb-10">
        <div className="absolute top-0 right-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-navy-900 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Direct Communication</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
            PROPERTY LK – Sri Lankan Property Marketplace
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Have questions about real estate across Sri Lanka? Connect directly with our team for honest advice, private viewings, and listing support.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Contact Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          
          {/* Card 1: Official WhatsApp */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-card-luxury flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mb-5 shadow-sm">
                <MessageCircle className="w-6 h-6 fill-emerald-600/20" />
              </div>
              <span className="text-xs uppercase tracking-wider text-slate-500 font-bold block mb-1">
                Official WhatsApp
              </span>
              <h3 className="font-serif text-2xl font-bold text-navy-950 mb-2">
                +94 71 654 5457
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-6">
                Fastest response for property inquiries, sharing photos, location pins, and booking viewings.
              </p>
            </div>
            
            <a
              href={BRAND.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center space-x-2 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-navy-950 font-bold text-xs uppercase tracking-wider shadow-glow-emerald transition-all"
            >
              <MessageCircle className="w-4 h-4 fill-navy-950" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>

          {/* Card 2: Direct Call */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-card-luxury flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-navy-50 border border-navy-200 text-navy-900 flex items-center justify-center mb-5 shadow-sm">
                <Phone className="w-6 h-6" />
              </div>
              <span className="text-xs uppercase tracking-wider text-slate-500 font-bold block mb-1">
                Direct Contact Number
              </span>
              <h3 className="font-serif text-2xl font-bold text-navy-950 mb-2">
                +94 71 654 5457
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-6">
                Direct voice call line for urgent property consultations and immediate availability checks.
              </p>
            </div>

            <a
              href={`tel:${BRAND.phoneRaw}`}
              className="w-full inline-flex items-center justify-center space-x-2 py-3 rounded-xl bg-navy-950 hover:bg-navy-900 text-white font-bold text-xs uppercase tracking-wider transition-all"
            >
              <Phone className="w-4 h-4 text-emerald-400" />
              <span>Call Now</span>
            </a>
          </div>

          {/* Card 3: Island-wide Service */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-card-luxury flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mb-5 shadow-sm">
                <MapPin className="w-6 h-6" />
              </div>
              <span className="text-xs uppercase tracking-wider text-slate-500 font-bold block mb-1">
                Coverage
              </span>
              <h3 className="font-serif text-2xl font-bold text-navy-950 mb-2">
                All 25 Districts
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-6">
                Colombo, Kandy, Galle, Gampaha, Kurunegala, Nuwara Eliya and all provincial areas across Sri Lanka.
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 text-slate-600 text-xs font-semibold flex items-center justify-center space-x-1.5 border border-slate-200">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              <span>Available 7 Days a Week</span>
            </div>
          </div>

        </div>

        {/* Interactive Direct Inquiry Box */}
        <div className="bg-navy-950 text-white rounded-3xl p-8 sm:p-12 border border-navy-800 shadow-glass-dark">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-2">
                Quick Message to PROPERTY LK
              </h2>
              <p className="text-xs sm:text-sm text-slate-300">
                Type your inquiry and instantly send it via WhatsApp to our official representative.
              </p>
            </div>

            <form onSubmit={handleSendMessage} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Your Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-navy-900 border border-navy-700 text-white text-sm focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Inquiry Topic
                </label>
                <select
                  value={inquiryType}
                  onChange={(e) => setInquiryType(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-navy-900 border border-navy-700 text-white text-sm focus:outline-none focus:border-emerald-400 cursor-pointer"
                >
                  <option value="Buying Property">Buying a Property</option>
                  <option value="Selling Property">Selling My Property</option>
                  <option value="Land Valuation / Advice">Land Valuation & Advice</option>
                  <option value="Site Viewing Request">Site Viewing Request</option>
                  <option value="General Question">General Question</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Message Details
                </label>
                <textarea
                  rows={3}
                  placeholder="Briefly describe what you are looking for..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-4 rounded-xl bg-navy-900 border border-navy-700 text-white text-sm focus:outline-none focus:border-emerald-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-navy-950 font-bold text-sm uppercase tracking-wider shadow-glow-emerald flex items-center justify-center space-x-2 transition-all"
              >
                <MessageCircle className="w-5 h-5 fill-navy-950" />
                <span>Send to WhatsApp (+94 71 654 5457)</span>
              </button>
            </form>
          </div>
        </div>

      </div>

    </div>
  );
}
