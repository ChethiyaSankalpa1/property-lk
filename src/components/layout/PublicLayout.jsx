import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import FloatingWhatsApp from './FloatingWhatsApp';
import ScrollToTop from './ScrollToTop';
import AnimeBackground from '../motion/AnimeBackground';
import AnimatedOutlet from '../motion/AnimatedOutlet';

export default function PublicLayout() {
  return (
    <div className="relative min-h-screen flex flex-col text-slate-900 selection:bg-emerald-500 selection:text-navy-950 overflow-x-hidden">
      <AnimeBackground />
      <ScrollToTop />
      <Navbar />
      <main className="relative z-10 flex-1">
        <AnimatedOutlet />
      </main>
      <div className="relative z-10">
        <Footer />
      </div>
      <FloatingWhatsApp />
    </div>
  );
}
