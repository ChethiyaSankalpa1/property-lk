import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Building, 
  Phone, 
  MessageCircle, 
  MapPin, 
  Mail, 
  ShieldCheck, 
  ArrowUpRight, 
  Heart,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { BRAND } from '../../constants/brand';
import { PROPERTY_CATEGORIES } from '../../constants/categories';

export default function Footer() {
  return (
    <footer className="bg-navy-950 text-slate-300 border-t border-navy-800/80 pt-16 pb-12 relative overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-navy-700/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top banner: Direct WhatsApp CTA */}
        <div className="mb-14 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-navy-900 via-navy-850 to-navy-900 border border-emerald-500/20 shadow-glass-dark flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <MessageCircle className="w-6 h-6 fill-emerald-400/20" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white">
                Looking to buy or sell property in Sri Lanka?
              </h3>
              <p className="text-sm text-slate-400 mt-0.5">
                Connect directly with our team via WhatsApp for instant inquiries and private viewings.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <a
              href={BRAND.createWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-navy-950 font-bold text-sm tracking-wide shadow-glow-emerald transition-all duration-200"
            >
              <MessageCircle className="w-4 h-4 fill-navy-950" />
              <span>Chat on WhatsApp</span>
            </a>
            <a
              href={`tel:${BRAND.phoneRaw}`}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-navy-800 hover:bg-navy-700 text-white font-medium text-sm border border-navy-700 transition-all duration-200"
            >
              <Phone className="w-4 h-4 text-emerald-400" />
              <span>Call Us</span>
            </a>
          </div>
        </div>

        {/* 4-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-14">
          
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center shadow-glow-emerald text-navy-950">
                <Building className="w-5 h-5 text-navy-950 stroke-[2.5]" />
              </div>
              <div className="flex items-center space-x-1">
                <span className="font-serif text-2xl font-bold text-white tracking-wider">
                  PROPERTY
                </span>
                <span className="font-serif text-2xl font-extrabold text-emerald-400">
                  LK
                </span>
              </div>
            </Link>
            
            <p className="text-sm text-slate-400 leading-relaxed">
              Sri Lanka's dedicated real estate marketplace connecting buyers and sellers directly with zero middlemen friction and immediate WhatsApp communication.
            </p>

            <div className="pt-2 flex flex-col space-y-2 text-xs text-slate-400">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Verified Direct Seller Inquiries</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>All 25 Sri Lankan Districts Covered</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Instant WhatsApp Integration</span>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-serif font-bold text-sm tracking-wider uppercase">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center space-x-1.5">
                  <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500/70" />
                  <span>Home Page</span>
                </Link>
              </li>
              <li>
                <Link to="/properties" className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center space-x-1.5">
                  <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500/70" />
                  <span>Browse Properties</span>
                </Link>
              </li>
              <li>
                <Link to="/sell" className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center space-x-1.5">
                  <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500/70" />
                  <span>Sell Your Property</span>
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center space-x-1.5">
                  <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500/70" />
                  <span>Contact & Viewings</span>
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center space-x-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-500" />
                  <span>Admin Dashboard</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Property Categories */}
          <div className="space-y-3">
            <h4 className="text-white font-serif font-bold text-sm tracking-wider uppercase">
              Categories
            </h4>
            <div className="grid grid-cols-2 gap-x-2 gap-y-2 text-sm">
              {PROPERTY_CATEGORIES.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/properties?category=${encodeURIComponent(cat.name)}`}
                  className="text-slate-400 hover:text-emerald-400 transition-colors truncate text-xs sm:text-sm py-0.5"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Column 4: Official Contact & Disclaimer */}
          <div className="space-y-3">
            <h4 className="text-white font-serif font-bold text-sm tracking-wider uppercase">
              Official Contact
            </h4>
            <div className="space-y-2.5 text-sm">
              <a 
                href={BRAND.createWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 text-slate-300 hover:text-emerald-400 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <MessageCircle className="w-4 h-4 fill-emerald-400/20" />
                </div>
                <div>
                  <span className="block text-[11px] text-slate-400 uppercase tracking-wider font-semibold">WhatsApp Official</span>
                  <span className="font-semibold text-white">{BRAND.phone}</span>
                </div>
              </a>

              <a 
                href={`tel:${BRAND.phoneRaw}`}
                className="flex items-center space-x-3 text-slate-300 hover:text-emerald-400 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-navy-800 border border-navy-700 flex items-center justify-center text-slate-300 shrink-0">
                  <Phone className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <span className="block text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Direct Call</span>
                  <span className="font-semibold text-white">{BRAND.phone}</span>
                </div>
              </a>

              <div className="flex items-start space-x-3 text-slate-400 pt-1">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-xs">Sri Lanka • Serving all 25 administrative districts island-wide</span>
              </div>
            </div>
          </div>

        </div>

        {/* LocalStorage Architecture Notice */}
        <div className="pt-6 pb-6 border-t border-navy-800/60 text-xs text-slate-400 leading-relaxed bg-navy-900/40 p-4 rounded-xl border border-navy-800/80">
          <div className="flex items-start space-x-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-300">Architecture Transparency:</strong> PROPERTY LK is engineered as a clean frontend-only application ready for Vercel deployment. Property listings created via the Admin panel are persisted inside the browser's LocalStorage and are device-specific. Customer submissions trigger direct pre-filled WhatsApp communications with no third-party database dependency.
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-navy-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} PROPERTY LK. All rights reserved. Sri Lanka Real Estate Marketplace.</p>
          <div className="flex items-center space-x-6">
            <Link to="/contact" className="hover:text-emerald-400 transition-colors">Privacy & Inquiries</Link>
            <Link to="/sell" className="hover:text-emerald-400 transition-colors">Listings Policy</Link>
            <Link to="/admin" className="hover:text-emerald-400 text-slate-400 transition-colors">Admin Access</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
