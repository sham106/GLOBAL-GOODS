// src/components/Footer.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

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
            <div className="flex items-center gap-3.5">
              <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
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
              <div className="flex flex-col text-left">
                <span className="font-heading font-black tracking-tight text-white leading-none text-base uppercase">
                  Global Goods <span className="text-[#29B8C8]">&amp;</span> Services
                </span>
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#5DC840] font-bold leading-none mt-1.5">
                  Pty Ltd
                </span>
              </div>
            </div>
            
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
