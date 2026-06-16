// src/components/Footer.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';

export default function Footer() {
  const navigate = useNavigate();

  const handleLinkClick = (e, targetId) => {
    e.preventDefault();
    const el = document.querySelector(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => {
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  return (
    <footer className="bg-[#1B2A4A] text-slate-300 pt-16 pb-12 border-t border-[#29B8C8]/10">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* 3-column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pb-12 border-b border-white/5">
          
          {/* Column 1: Brand & Tagline */}
          <div className="space-y-4">
            <Logo size="lg" variant="dark" />
            
            <p className="text-sm font-semibold text-white/95 leading-relaxed italic">
              "Enjoy The Competitive Edge on Everything You Need"
            </p>
            <p className="text-xs text-slate-400 font-normal leading-relaxed">
              Specialized sourcing, procurement, logistics and supply chain solutions for businesses across Africa and Europe.
            </p>
            <div className="text-[10px] text-brand-green font-mono font-medium tracking-wider uppercase">
              20+ Years Sourcing Globally
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h3 className="text-white text-xs uppercase font-bold tracking-widest border-l-2 border-[#5DC840] pl-3">
              Quick Navigation
            </h3>
            <ul className="space-y-2.5 text-sm font-normal">
              <li>
                <a href="#home" onClick={(e) => handleLinkClick(e, '#home')} className="hover:text-white transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#features" onClick={(e) => handleLinkClick(e, '#features')} className="hover:text-white transition-colors">
                  Our Services
                </a>
              </li>
              <li>
                <a href="#how" onClick={(e) => handleLinkClick(e, '#how')} className="hover:text-white transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/inquiry')} 
                  className="hover:text-white transition-colors text-left font-semibold text-[#5DC840]"
                >
                  Submit an RFQ &rarr;
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/dashboard')} 
                  className="hover:text-white transition-colors text-left font-semibold text-[#29B8C8]"
                >
                  Dashboard &rarr;
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Details (3 Offices) */}
          <div className="space-y-4">
            <h3 className="text-white text-xs uppercase font-bold tracking-widest border-l-2 border-[#29B8C8] pl-3">
              OUR OFFICES
            </h3>
            <div className="space-y-4 text-sm font-normal">
              
              {/* South Africa */}
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-white text-xs">
                  <span>🇿🇦</span> <span>South Africa (HQ)</span>
                </div>
                <div className="text-white/60 space-y-0.5 pl-5 text-[11px] leading-relaxed">
                  <p>📞 +27 73 206 9245</p>
                  <p>✉️ info@globalgs.co.za</p>
                  <p>📍 Unit 25, Blackheath Business Park, 1 Station Road, Blackheath, Cape Town, South Africa</p>
                </div>
              </div>
              
              <div className="border-t border-white/10 my-2" />

              {/* Mauritius */}
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-white text-xs">
                  <span>🇲🇺</span> <span>Mauritius</span>
                </div>
                <div className="text-white/60 space-y-0.5 pl-5 text-[11px] leading-relaxed">
                  <p>📞 +230 5852 7907</p>
                  <p>✉️ info@globalgs.co.za</p>
                  <p>📍 29, Dartois Street, Port Louis, Mauritius</p>
                </div>
              </div>

              <div className="border-t border-white/10 my-2" />

              {/* Namibia */}
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-white text-xs">
                  <span>🇳🇦</span> <span>Namibia</span>
                </div>
                <div className="text-white/60 space-y-0.5 pl-5 text-[11px] leading-relaxed">
                  <p>📞 Coming soon</p>
                  <p>✉️ info@globalgs.co.za</p>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>
            &copy; 2025 Global Goods &amp; Services Pty Ltd. All rights reserved. | South Africa &middot; Mauritius &middot; Namibia
          </div>
          <div className="flex gap-6 font-medium">
            <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-300 transition-colors">ISO 9001 Compliance</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
