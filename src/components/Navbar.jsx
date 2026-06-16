// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Logo from './Logo';

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
          
          <a href="#home" onClick={(e) => handleNavClick(e, '#home')} className="group cursor-pointer shrink-0">
            <Logo size="md" variant="light" className="transition-transform duration-500 group-hover:scale-[1.02]" />
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
