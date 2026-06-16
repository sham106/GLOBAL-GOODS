// src/components/Footer.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Mail, MapPin, Building2 } from 'lucide-react';
import Logo from './Logo';

const offices = [
  {
    id: 'za',
    country: 'South Africa',
    label: 'Head Office',
    flag: '🇿🇦',
    isHq: true,
    phone: '+27 73 206 9245',
    phoneHref: 'tel:+27732069245',
    email: 'info@globalgs.co.za',
    address: 'Unit 25, Blackheath Business Park, 1 Station Road, Blackheath, Cape Town',
  },
  {
    id: 'mu',
    country: 'Mauritius',
    label: 'Regional Office',
    flag: '🇲🇺',
    isHq: false,
    phone: '+230 5852 7907',
    phoneHref: 'tel:+23058527907',
    email: 'info@globalgs.co.za',
    address: '29, Dartois Street, Port Louis',
  },
  {
    id: 'na',
    country: 'Namibia',
    label: 'Opening Soon',
    flag: '🇳🇦',
    isHq: false,
    comingSoon: true,
    email: 'info@globalgs.co.za',
  },
];

function OfficeCard({ office }) {
  return (
    <div className="group rounded-xl border border-white/10 bg-white/[0.04] p-4 transition-colors hover:border-[#29B8C8]/30 hover:bg-white/[0.06]">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-xl leading-none shrink-0" aria-hidden="true">{office.flag}</span>
          <div className="min-w-0">
            <p className="font-heading font-bold text-sm text-white leading-tight">{office.country}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">{office.label}</p>
          </div>
        </div>
        {office.isHq && (
          <span className="shrink-0 rounded-full bg-[#5DC840]/15 border border-[#5DC840]/30 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#5DC840]">
            HQ
          </span>
        )}
        {office.comingSoon && (
          <span className="shrink-0 rounded-full bg-amber-500/10 border border-amber-500/25 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-400">
            Soon
          </span>
        )}
      </div>

      <ul className="space-y-2.5">
        {office.phone && (
          <li>
            <a
              href={office.phoneHref}
              className="flex items-start gap-2.5 text-sm text-slate-300 hover:text-white transition-colors group/link"
            >
              <Phone className="h-3.5 w-3.5 text-[#29B8C8] shrink-0 mt-0.5" />
              <span>{office.phone}</span>
            </a>
          </li>
        )}
        {office.comingSoon && !office.phone && (
          <li className="flex items-start gap-2.5 text-sm text-slate-500">
            <Phone className="h-3.5 w-3.5 text-slate-500 shrink-0 mt-0.5" />
            <span>Phone line launching soon</span>
          </li>
        )}
        <li>
          <a
            href={`mailto:${office.email}`}
            className="flex items-start gap-2.5 text-sm text-slate-300 hover:text-white transition-colors break-all"
          >
            <Mail className="h-3.5 w-3.5 text-[#29B8C8] shrink-0 mt-0.5" />
            <span>{office.email}</span>
          </a>
        </li>
        {office.address && (
          <li className="flex items-start gap-2.5 text-sm text-slate-400 leading-relaxed">
            <MapPin className="h-3.5 w-3.5 text-[#5DC840] shrink-0 mt-0.5" />
            <span>{office.address}</span>
          </li>
        )}
      </ul>
    </div>
  );
}

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
    <footer className="bg-[#1B2A4A] text-slate-300 pt-16 pb-10 border-t border-[#29B8C8]/10">
      <div className="max-w-7xl mx-auto px-6">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-white/5">

          {/* Column 1: Brand */}
          <div className="lg:col-span-4 space-y-5">
            <Logo size="lg" variant="dark" />
            <p className="text-sm font-semibold text-white/95 leading-relaxed italic max-w-sm">
              &ldquo;Enjoy The Competitive Edge on Everything You Need&rdquo;
            </p>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Specialized sourcing, procurement, logistics and supply chain solutions for businesses across Africa and Europe.
            </p>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#5DC840]/25 bg-[#5DC840]/10 px-3 py-1.5 text-xs font-semibold text-[#5DC840]">
              <Building2 className="h-3.5 w-3.5" />
              20+ Years Sourcing Globally
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="lg:col-span-3 space-y-5">
            <h3 className="text-white text-xs uppercase font-bold tracking-widest border-l-2 border-[#5DC840] pl-3">
              Quick Navigation
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#home" onClick={(e) => handleLinkClick(e, '#home')} className="text-slate-300 hover:text-white transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#features" onClick={(e) => handleLinkClick(e, '#features')} className="text-slate-300 hover:text-white transition-colors">
                  Our Services
                </a>
              </li>
              <li>
                <a href="#how" onClick={(e) => handleLinkClick(e, '#how')} className="text-slate-300 hover:text-white transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <button
                  onClick={() => navigate('/inquiry')}
                  className="text-[#5DC840] hover:text-[#6ee052] font-semibold transition-colors"
                >
                  Submit an RFQ &rarr;
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="text-[#29B8C8] hover:text-[#4dd4e0] font-semibold transition-colors"
                >
                  Dashboard &rarr;
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Offices */}
          <div className="lg:col-span-5 space-y-5">
            <div className="flex items-end justify-between gap-4">
              <h3 className="text-white text-xs uppercase font-bold tracking-widest border-l-2 border-[#29B8C8] pl-3">
                Our Offices
              </h3>
              <span className="hidden sm:inline text-[11px] text-slate-500 font-medium">
                3 locations · Africa
              </span>
            </div>

            <div className="space-y-3">
              <OfficeCard office={offices[0]} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <OfficeCard office={offices[1]} />
                <OfficeCard office={offices[2]} />
              </div>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p className="text-center md:text-left leading-relaxed">
            &copy; 2025 Global Goods &amp; Services Pty Ltd. All rights reserved.
            <span className="hidden sm:inline"> · South Africa · Mauritius · Namibia</span>
          </p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 font-medium">
            <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-300 transition-colors">ISO 9001 Compliance</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
