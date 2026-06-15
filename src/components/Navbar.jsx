// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);

    if (location.pathname !== '/') {
      navigate('/');
      // Give it a tiny delay to allow navigation to complete before scrolling
      setTimeout(() => {
        const el = document.querySelector(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const el = document.querySelector(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const navLinks = [
    { label: 'Home', target: '#home' },
    { label: 'Services', target: '#features' },
    { label: 'How It Works', target: '#how' },
    { label: 'Contact', target: '#cta' }
  ];

  return (
    <div className="fixed top-4 inset-x-0 z-50 px-4 max-w-7xl mx-auto">
      <nav
        id="navbar"
        className={`w-full transition-all duration-300 rounded-full border ${
          isScrolled
            ? 'bg-white/75 backdrop-blur-xl border-slate-200/60 shadow-lg py-2.5 px-6'
            : 'bg-white/45 backdrop-blur-lg border-white/70 shadow-md py-3.5 px-6'
        }`}
      >
        <div className="flex items-center justify-between">
          
          {/* Left: Original restored brand logo + premium corporate wordmark */}
          <a href="#home" onClick={(e) => handleNavClick(e, '#home')} className="flex items-center gap-3.5 group cursor-pointer">
            <div className="shrink-0 transition-all duration-500 group-hover:scale-110 group-hover:rotate-12">
              <svg width="38" height="38" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Green Globe Background */}
                <circle cx="48" cy="52" r="34" fill="#5DC840" />
                {/* White Grid Lines & Node Intersections */}
                <path d="M48,18 C48,34 48,65 48,86" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M48,18 C33,35 22,55 14,72" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M48,18 C63,35 74,55 82,72" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M16,42 Q48,60 80,42" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                {/* Nodes */}
                <circle cx="48" cy="32" r="3.5" fill="white" />
                <circle cx="28" cy="40" r="3.5" fill="white" />
                <circle cx="68" cy="40" r="3.5" fill="white" />
                {/* Teal Orbit Swoosh */}
                <path d="M3,74 C25,82 50,111 93,22 C97,11 93,13 86,27 C66,61 35,77 3,74 Z" fill="#29B8C8" />
                {/* Separate Teal Orbit Node */}
                <circle cx="81" cy="11" r="7.5" fill="#29B8C8" />
              </svg>
            </div>
            <div className="flex flex-col text-left">
              <span className="font-heading font-black tracking-tight text-[#1B2A4A] leading-none text-sm sm:text-[15px] uppercase">
                Global Goods <span className="text-[#29B8C8]">&amp;</span> Services
              </span>
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#5DC840] font-bold leading-none mt-1.5">
                Pty Ltd
              </span>
            </div>
          </a>

          {/* Center: Desktop navigations */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.target}
                onClick={(e) => handleNavClick(e, link.target)}
                className="text-xs uppercase tracking-wider font-bold text-slate-650 hover:text-brand-navy transition-colors relative after:absolute after:-bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-0.5 after:bg-[#29B8C8] hover:after:w-full hover:after:transition-all hover:after:duration-300"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right: Get a Quote action */}
          <div className="hidden md:flex items-center">
            <button
              onClick={() => navigate('/inquiry')}
              className="text-xs font-black text-white bg-gradient-to-r from-[#5DC840] to-[#29B8C8] hover:shadow-lg hover:brightness-105 active:scale-95 px-6 py-2.5 rounded-full transition-all"
            >
              Submit an RFQ &rarr;
            </button>
          </div>

          {/* Mobile Hamburger toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-brand-navy p-1 transition-all rounded-full hover:bg-slate-100"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

        </div>
      </nav>

      {/* Improved Mobile Menu container */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: 'spring', damping: 22, stiffness: 200 }}
            className="md:hidden absolute left-4 right-4 top-18 bg-white/90 backdrop-blur-2xl border border-slate-200/50 shadow-2xl rounded-3xl overflow-hidden p-6 flex flex-col z-[60]"
          >
            <div className="space-y-4 flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Navigation</span>
              <div className="space-y-2">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.target}
                    onClick={(e) => handleNavClick(e, link.target)}
                    className="text-sm font-bold text-slate-800 hover:text-[#29B8C8] hover:bg-slate-50 rounded-xl px-3 py-2.5 transition-all flex items-center justify-between group"
                  >
                    <span>{link.label}</span>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[#29B8C8] font-bold">&rarr;</span>
                  </a>
                ))}
              </div>
              <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate('/inquiry');
                  }}
                  className="w-full text-center text-xs font-black text-white bg-gradient-to-r from-[#5DC840] to-[#29B8C8] py-3.5 rounded-full shadow-md hover:shadow-lg active:scale-98 transition-all"
                >
                  Submit an RFQ &rarr;
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
