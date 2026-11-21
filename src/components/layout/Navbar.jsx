import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building, 
  Menu, 
  X, 
  Phone, 
  MessageCircle, 
  PlusCircle, 
  ShieldCheck, 
  Compass, 
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { BRAND } from '../../constants/brand';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on page change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Explore Properties', path: '/properties' },
    { name: 'Sell Your Property', path: '/sell' },
    { name: 'Contact Us', path: '/contact' },
  ];

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-navy-950/90 backdrop-blur-md border-b border-navy-800/80 shadow-glass-dark py-3' 
            : 'bg-gradient-to-b from-navy-950/90 via-navy-950/50 to-transparent py-4 sm:py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center space-x-2.5 sm:space-x-3 group select-none"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center shadow-glow-emerald text-navy-950 group-hover:scale-105 transition-transform duration-300">
                <Building className="w-5 h-5 sm:w-6 sm:h-6 text-navy-950 stroke-[2.5]" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center space-x-1">
                  <span className="font-serif text-lg sm:text-2xl font-bold tracking-wider text-white">
                    PROPERTY
                  </span>
                  <span className="font-serif text-lg sm:text-2xl font-extrabold text-emerald-400 drop-shadow-sm">
                    LK
                  </span>
                </div>
                <span className="text-[10px] tracking-widest uppercase text-slate-400 font-medium hidden sm:block -mt-1">
                  Sri Lanka Real Estate
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 bg-navy-900/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-navy-800/60 shadow-inner">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-emerald-500 text-navy-950 font-semibold shadow-sm'
                        : 'text-slate-200 hover:text-white hover:bg-navy-800/60'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </nav>

            {/* Right Action Buttons */}
            <div className="hidden lg:flex items-center space-x-3">
              {/* WhatsApp Quick CTA */}
              <a
                href={BRAND.createWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 hover:bg-emerald-500/20 hover:border-emerald-400 transition-all duration-200"
                title="Direct WhatsApp contact"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400/20" />
                <span>+94 77 660 0730</span>
              </a>

              {/* Sell Property CTA */}
              <Link
                to="/sell"
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-navy-950 bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-300 hover:to-emerald-400 shadow-glow-emerald hover:shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                <PlusCircle className="w-4 h-4 stroke-[2.5]" />
                <span>Sell Property</span>
              </Link>
            </div>

            {/* Mobile Menu & Quick Actions Button */}
            <div className="flex items-center space-x-2 md:hidden">
              <a
                href={BRAND.createWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors"
                aria-label="Contact via WhatsApp"
              >
                <MessageCircle className="w-5 h-5 fill-emerald-400/20" />
              </a>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg bg-navy-900/80 text-slate-200 border border-navy-800 hover:text-white focus:outline-none"
                aria-label="Toggle mobile navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-[60px] sm:top-[68px] z-40 bg-navy-950/98 backdrop-blur-xl border-b border-navy-800 shadow-2xl px-5 pt-4 pb-8 md:hidden"
          >
            <div className="flex flex-col space-y-3">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold px-2">
                Navigation
              </span>
              
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-all ${
                      isActive
                        ? 'bg-emerald-500 text-navy-950 font-bold shadow-md'
                        : 'text-slate-200 hover:bg-navy-900 hover:text-white'
                    }`
                  }
                >
                  <span>{link.name}</span>
                  <ChevronRight className="w-4 h-4 opacity-70" />
                </NavLink>
              ))}

              <div className="pt-3 border-t border-navy-800/80 flex flex-col space-y-2.5">
                <Link
                  to="/sell"
                  className="w-full flex items-center justify-center space-x-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-navy-950 font-bold text-sm uppercase tracking-wider shadow-glow-emerald"
                >
                  <PlusCircle className="w-4 h-4 stroke-[2.5]" />
                  <span>Sell Your Property</span>
                </Link>

                <a
                  href={BRAND.createWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-navy-900 border border-emerald-500/40 text-emerald-400 font-semibold text-sm hover:bg-navy-850"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp: {BRAND.phone}</span>
                </a>

                <Link
                  to="/admin"
                  className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl text-xs text-slate-400 hover:text-slate-200 hover:bg-navy-900/50"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                  <span>Admin Portal (Prototype)</span>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
