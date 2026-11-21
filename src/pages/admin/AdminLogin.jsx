import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, KeyRound, Building2, AlertTriangle, ArrowLeft, ArrowRight, ShieldAlert } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

export default function AdminLogin() {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const { login, defaultPinHint, securityDisclaimer } = useAdminAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const res = login(pin.trim());
    if (res.success) {
      navigate('/admin');
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-navy-700/20 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        
        {/* Back Link */}
        <Link 
          to="/" 
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-400 hover:text-emerald-400 mb-6 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to PROPERTY LK</span>
        </Link>

        {/* Brand Icon */}
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center text-navy-950 shadow-glow-emerald">
            <Building2 className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center space-x-1">
              <span className="font-serif text-2xl font-bold tracking-wider text-white">
                PROPERTY
              </span>
              <span className="font-serif text-2xl font-extrabold text-emerald-400">
                LK
              </span>
            </div>
            <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold">
              Management Portal
            </span>
          </div>
        </div>

        <h2 className="text-xl font-bold text-white mt-4 font-serif">
          Admin Sign In
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Access the property listings management console.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-navy-900/90 border border-navy-800 shadow-glass-dark py-8 px-6 sm:px-10 rounded-3xl backdrop-blur-xl">
          
          {/* Security Disclaimer Banner */}
          <div className="mb-6 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs leading-relaxed flex items-start space-x-2.5">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
            <div>
              <strong className="block text-amber-200">Frontend Prototype Notice:</strong>
              This admin area is a frontend prototype persisting to your browser's LocalStorage. It cannot be used as a shared multi-device database without connecting a backend service.
            </div>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Admin Password / PIN
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  placeholder="Enter admin password or PIN"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-navy-950 border border-navy-700 text-white text-sm focus:outline-none focus:border-emerald-400"
                  autoFocus
                />
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                <span>Default password: <strong className="text-emerald-400 font-mono">admin123</strong></span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-navy-950 font-bold text-xs uppercase tracking-wider shadow-glow-emerald flex items-center justify-center space-x-2 transition-all"
            >
              <span>Unlock Admin Console</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

        </div>
      </div>

    </div>
  );
}
