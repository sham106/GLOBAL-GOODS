// src/pages/LandingPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { 
  Zap, 
  ShieldCheck, 
  Cpu, 
  Package, 
  MessageSquare, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  Sparkles,
  ChevronRight,
  HelpCircle,
  Search,
  Truck,
  Wrench,
  BarChart3,
  Handshake,
  Hammer
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import useScrollAnimation, { fadeInUp } from '../hooks/useScrollAnimation';

// Animated Counter component that animates counts when in view
function AnimatedStat({ value, suffix, label }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const end = value;
    if (start === end) {
      setCount(end);
      return;
    }
    const duration = 1800; // Total duration in ms
    const increment = Math.ceil(end / 40); // 40 steps
    const stepTime = Math.max(Math.floor(duration / (end / increment)), 25);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        clearInterval(timer);
        setCount(end);
      } else {
        setCount(start);
      }
    }, stepTime);
    
    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <div ref={ref} className="text-center p-6 space-y-2 border-r border-slate-100 last:border-0 md:p-8">
      <h3 className="text-4xl md:text-5xl font-extrabold text-[#1B2A4A] tracking-tight font-heading flex justify-center items-baseline gap-0.5">
        <span>{count >= 1000 ? count.toLocaleString('en-US') : count}</span>
        <span className="text-[#29B8C8]">{suffix}</span>
      </h3>
      <p className="text-[11px] uppercase tracking-wider text-slate-400 font-bold font-sans">
        {label}
      </p>
    </div>
  );
}

// Inline FeatureCard local component
function FeatureCard({ icon: Icon, title, description, iconBgClass, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay }}
      className="bg-white border border-slate-200/60 p-6 sm:p-7 rounded-2xl hover:shadow-lg hover:shadow-slate-100 hover:border-[#29B8C8]/20 transition-all duration-300 flex flex-col items-start text-left group"
    >
      <div className={`p-3 rounded-xl mb-5 shrink-0 flex items-center justify-center transition-transform group-hover:scale-110 duration-300 ${iconBgClass}`}>
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="font-heading font-extrabold text-slate-800 text-base mb-2.5">
        {title}
      </h3>
      <p className="text-xs text-slate-500 leading-relaxed font-normal">
        {description}
      </p>
    </motion.div>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();
  
  // Create refs/controls/variants for scroll animated sections
  const statsAnimation = useScrollAnimation();
  const howAnimation = useScrollAnimation();
  const ctaAnimation = useScrollAnimation();

  // Smooth scroll handler helper
  const handleScrollTo = (e, id) => {
    e.preventDefault();
    const el = document.querySelector(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex-1 flex flex-col font-body bg-slate-50 min-h-screen overflow-x-hidden">
      
      {/* Reusable Header Navbar */}
      <Navbar />

      {/* SECTION 1 — HERO */}
      <section 
        id="home" 
        className="relative min-h-[90vh] flex flex-col items-center justify-center pt-32 sm:pt-40 pb-20 px-6 lg:px-12 overflow-hidden bg-gradient-to-br from-[#1B2A4A] via-[#1e3a6e] to-[#0d5060]"
      >
        {/* Animated Gradient Orbs background layer */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#5DC840]/10 blur-[130px] z-[1] pointer-events-none animate-pulse duration-[8000ms]" />
        <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] rounded-full bg-[#29B8C8]/10 blur-[150px] z-[1] pointer-events-none animate-pulse duration-[10000ms]" />

        {/* Semi-transparent background image of high-performance components */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-[2]">
          <img 
            src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1920&q=80" 
            alt="Mechanical background" 
            className="w-full h-full object-cover opacity-15 mix-blend-overlay filter brightness-110 contrast-110"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="max-w-4xl mx-auto w-full text-center relative z-10 py-8 sm:py-12 space-y-8">
          
          {/* Messaging and CTAs */}
          <div className="space-y-6">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-heading font-extrabold text-5xl md:text-6xl text-white leading-[1.08] tracking-tight"
            >
              Your Single Source <br />
              <span className="text-[#5DC840]">Procurement</span> <br />
              Solution.
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-white/70 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto font-normal"
            >
              From sourcing to delivery, Global Goods &amp; Services provides complete end-to-end procurement for businesses across Africa and Europe. 20+ years of experience. 20,000+ vendors worldwide.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 pt-4 justify-center"
            >
              <button 
                onClick={() => navigate('/inquiry')}
                className="text-sm font-bold text-white bg-gradient-to-r from-[#5DC840] to-[#29B8C8] hover:shadow-lg hover:shadow-[#29B8C8]/10 hover:brightness-105 active:scale-[0.98] py-4 px-8 rounded-full transition-all"
                id="hero-primary-btn"
              >
                Submit an RFQ &rarr;
              </button>
              <a 
                href="#features"
                onClick={(e) => handleScrollTo(e, '#features')}
                className="text-sm font-semibold text-white bg-white/5 border border-white/25 hover:bg-white/10 py-4 px-8 rounded-full text-center transition-all flex items-center justify-center gap-1.5 animate-pulse"
                id="hero-secondary-btn"
              >
                Our Services &darr;
              </a>
            </motion.div>
          </div>

          {/* Sourcing Category cards */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto pt-10 text-slate-100"
          >
            {/* Card 1 — Quoted */}
            <div className="bg-[#1e2f52]/40 backdrop-blur-md border border-white/15 rounded-2xl p-6 text-left shadow-xl transition-all duration-350 hover:translate-y-[-6px] hover:border-white/25 hover:bg-[#1e2f52]/60 flex flex-col justify-between min-h-[195px]">
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <span className="text-[9px] sm:text-[10px] font-mono tracking-wider font-extrabold text-[#29B8C8] uppercase bg-[#29B8C8]/15 border border-[#29B8C8]/30 px-2.5 py-1 rounded-full flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#29B8C8] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#29B8C8]"></span>
                    </span>
                    Quoted
                  </span>
                  <span className="text-white/40 text-[9px] font-mono font-semibold">RFQ-9041 &middot; Cape Town</span>
                </div>
                <h4 className="text-base font-extrabold text-white mb-2 tracking-tight">Automotive Fleet &amp; Parts</h4>
                <p className="text-[11px] text-white/70 leading-relaxed">
                  48 certified OEMs matched for bulk cargo container transit to Durban Port terminal.
                </p>
              </div>

              {/* Step indicator */}
              <div className="border-t border-white/5 pt-3.5 mt-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[9px] font-mono font-bold tracking-wider text-slate-400 uppercase">Valuation Ready</span>
                  <span className="text-[9px] font-mono font-bold text-[#5DC840]">100% Sourced</span>
                </div>
                <div className="flex gap-1">
                  <div className="h-1 flex-1 rounded-full bg-[#5DC840]" />
                  <div className="h-1 flex-1 rounded-full bg-[#5DC840]" />
                  <div className="h-1 flex-1 rounded-full bg-[#5DC840]" />
                  <div className="h-1 flex-1 rounded-full bg-white/10" />
                </div>
              </div>
            </div>

            {/* Card 2 — Sourcing Active */}
            <div className="bg-[#1e2f52]/40 backdrop-blur-md border border-white/15 rounded-2xl p-6 text-left shadow-xl transition-all duration-350 hover:translate-y-[-6px] hover:border-white/25 hover:bg-[#1e2f52]/60 flex flex-col justify-between min-h-[195px]">
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <span className="text-[9px] sm:text-[10px] font-mono tracking-wider font-extrabold text-[#5DC840] uppercase bg-[#5DC840]/15 border border-[#5DC840]/30 px-2.5 py-1 rounded-full flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5DC840] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#5DC840]"></span>
                    </span>
                    Sourcing Active
                  </span>
                  <span className="text-white/40 text-[9px] font-mono font-semibold">RFQ-9102 &middot; Port Louis</span>
                </div>
                <h4 className="text-base font-extrabold text-white mb-2 tracking-tight">Heavy Duty Machinery</h4>
                <p className="text-[11px] text-white/70 leading-relaxed">
                  Connecting with tier-one European manufacturers to locate multi-stage hydraulic assemblies.
                </p>
              </div>

              {/* Step indicator */}
              <div className="border-t border-white/5 pt-3.5 mt-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[9px] font-mono font-bold tracking-wider text-slate-400 uppercase">Vendor Validation</span>
                  <span className="text-[9px] font-mono font-bold text-[#5DC840]">65% Match</span>
                </div>
                <div className="flex gap-1">
                  <div className="h-1 flex-1 rounded-full bg-[#5DC840]" />
                  <div className="h-1 flex-1 rounded-full bg-[#5DC840]" />
                  <div className="h-1 flex-1 rounded-full bg-white/10" />
                  <div className="h-1 flex-1 rounded-full bg-white/10" />
                </div>
              </div>
            </div>

            {/* Card 3 — New Inquiry */}
            <div className="bg-[#1e2f52]/40 backdrop-blur-md border border-white/15 rounded-2xl p-6 text-left shadow-xl transition-all duration-350 hover:translate-y-[-6px] hover:border-white/25 hover:bg-[#1e2f52]/60 flex flex-col justify-between min-h-[195px]">
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <span className="text-[9px] sm:text-[10px] font-mono tracking-wider font-extrabold text-white/90 uppercase bg-white/10 border border-white/20 px-2.5 py-1 rounded-full flex items-center gap-1.5">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
                    </span>
                    In Queue
                  </span>
                  <span className="text-white/40 text-[9px] font-mono font-semibold">RFQ-9112 &middot; Nairobi HQ</span>
                </div>
                <h4 className="text-base font-extrabold text-white mb-2 tracking-tight">MRO Industrial Supplies</h4>
                <p className="text-[11px] text-white/70 leading-relaxed">
                  Scanning international inventory databases for high-pressure industrial flow valves.
                </p>
              </div>

              {/* Step indicator */}
              <div className="border-t border-white/5 pt-3.5 mt-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[9px] font-mono font-bold tracking-wider text-slate-400 uppercase">Specs Analysis</span>
                  <span className="text-[9px] font-mono font-bold text-slate-300">Awaiting Search</span>
                </div>
                <div className="flex gap-1">
                  <div className="h-1 flex-1 rounded-full bg-[#5DC840]" />
                  <div className="h-1 flex-1 rounded-full bg-white/10" />
                  <div className="h-1 flex-1 rounded-full bg-white/10" />
                  <div className="h-1 flex-1 rounded-full bg-white/10" />
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* SECTION 2 — STATS BAR */}
      <section 
        id="stats"
        ref={statsAnimation.ref}
        className="bg-white border-b border-slate-100 relative z-20 py-6"
      >
        <motion.div 
          variants={statsAnimation.variants}
          initial="hidden"
          animate={statsAnimation.controls}
          className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <AnimatedStat value={20} suffix="+" label="Years Experience" />
          <AnimatedStat value={20000} suffix="+" label="Principal Vendors &amp; OEMs" />
          <AnimatedStat value={3} suffix="" label="Offices Across Africa" />
          <AnimatedStat value={98} suffix="%" label="Client Satisfaction" />
        </motion.div>
      </section>

      {/* SECTION 3 — FEATURES */}
      <section 
        id="features" 
        className="py-20 px-6 bg-slate-50/80 border-b border-slate-100"
      >
        <div className="max-w-7xl mx-auto space-y-12">
          
          {/* Centered Heading */}
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-[11px] uppercase font-extrabold tracking-widest text-[#29B8C8]">
              OUR CAPABILITIES
            </span>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-brand-navy leading-tight">
              A complete procurement solution, end to end.
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed font-normal">
              We handle everything from vendor selection to invoice matching &mdash; so you can focus on your business.
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard 
              icon={Search}
              title="Smart Sourcing &amp; Procurement"
              description="Access our database of 20,000+ international vendors, OEMs and regional stockists to find the right product at the right price."
              iconBgClass="bg-[#e8f9e3] text-[#3a9e22]"
              delay={0}
            />
            <FeatureCard 
              icon={Truck}
              title="Freight &amp; Logistics"
              description="End-to-end delivery via ocean, air, land and multi-modal operations. We work with tier-one logistics partners worldwide."
              iconBgClass="bg-[#e0f7fa] text-[#1a8f9e]"
              delay={0.1}
            />
            <FeatureCard 
              icon={Hammer}
              title="Design &amp; Build Projects"
              description="Strategic partnerships with leading international engineering firms for aviation, oil &amp; gas, ports, rail, roads and infrastructure projects."
              iconBgClass="bg-slate-100 text-[#1B2A4A]"
              delay={0.2}
            />
            <FeatureCard 
              icon={Wrench}
              title="Specialized &amp; Hard-to-Get Items"
              description="We procure generic and specialized items including the manufacturing of discontinued parts &mdash; no matter how challenging."
              iconBgClass="bg-[#e8f9e3] text-[#3a9e22]"
              delay={0.3}
            />
            <FeatureCard 
              icon={BarChart3}
              title="RFQ Management &amp; Expediting"
              description="Fast, efficient and cost-effective turnaround on Requests for Quotation. We manage the full RFQ lifecycle globally."
              iconBgClass="bg-[#e0f7fa] text-[#1a8f9e]"
              delay={0.4}
            />
            <FeatureCard 
              icon={Handshake}
              title="Bespoke Client Solutions"
              description="We develop tailored procurement strategies to ensure your projects are completed on time and within budget, every time."
              iconBgClass="bg-slate-100 text-[#1B2A4A]"
              delay={0.5}
            />
          </div>

        </div>
      </section>

      {/* SECTION 4 — HOW IT WORKS */}
      <section 
        id="how" 
        ref={howAnimation.ref}
        className="py-20 px-6 bg-white border-b border-slate-100"
      >
        <div className="max-w-7xl mx-auto space-y-16">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-[11px] uppercase font-extrabold tracking-widest text-[#5DC840]">
              Operational Protocol
            </span>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-brand-navy leading-tight">
              How we fulfill your request
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed font-normal">
              How we guarantee exact match engineering and frictionless global procurement solutions.
            </p>
          </div>

          <motion.div 
            variants={howAnimation.variants}
            initial="hidden"
            animate={howAnimation.controls}
            className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6 relative"
          >
            {/* Connecting lines on desktop */}
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-[#5DC840] via-[#29B8C8] to-slate-200 -z-10" />

            {/* Step 1 */}
            <div className="flex flex-col items-center text-center space-y-4 group">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-[#5DC840] to-[#29B8C8] text-white flex items-center justify-center font-heading font-extrabold text-2xl shadow-lg group-hover:scale-105 transition-transform duration-300">
                1
              </div>
              <h3 className="font-heading font-extrabold text-slate-800 text-lg">
                Submit Your RFQ
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-normal max-w-xs">
                Fill in our inquiry form with your product or part details. The more detail you provide, the faster we can respond.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center space-y-4 group">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-[#29B8C8] to-[#1B2A4A] text-white flex items-center justify-center font-heading font-extrabold text-2xl shadow-lg group-hover:scale-105 transition-transform duration-300">
                2
              </div>
              <h3 className="font-heading font-extrabold text-slate-800 text-lg">
                We Source Globally
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-normal max-w-xs">
                Our team searches our network of 20,000+ vendors to find the best options, pricing and availability.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center space-y-4 group">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-[#1B2A4A] to-slate-800 text-white flex items-center justify-center font-heading font-extrabold text-2xl shadow-lg group-hover:scale-105 transition-transform duration-300">
                3
              </div>
              <h3 className="font-heading font-extrabold text-slate-800 text-lg">
                You Receive a Quote
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-normal max-w-xs">
                We deliver a competitive commercial and technical proposal within 24–48 hours &mdash; ready for your approval.
              </p>
            </div>

          </motion.div>

        </div>
      </section>

      {/* SECTION 5 — CTA BANNER */}
      <section 
        id="cta" 
        ref={ctaAnimation.ref}
        className="py-16 sm:py-24 px-6 relative overflow-hidden bg-gradient-to-r from-[#1B2A4A] to-[#1a8f9e]"
      >
        {/* Subtle radial green glow */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-30 blur-[120px] mix-blend-screen"
          style={{ backgroundImage: 'radial-gradient(circle at center, #5DC840 0%, transparent 60%)' }}
        />

        <motion.div 
          variants={ctaAnimation.variants}
          initial="hidden"
          animate={ctaAnimation.controls}
          className="max-w-4xl mx-auto text-center space-y-7 relative z-10"
        >
          <span className="text-[11px] font-mono font-extrabold text-[#5DC840] uppercase tracking-widest">
            Sourcing Desk Open
          </span>
          <h2 className="font-heading font-extrabold text-[#ffffff] text-4xl sm:text-5xl tracking-normal leading-tight">
            Ready to simplify your procurement?
          </h2>
          <p className="text-white/70 text-base leading-relaxed max-w-xl mx-auto font-normal">
            Join businesses across Africa and Europe who trust Global Goods &amp; Services for their sourcing and procurement needs.
          </p>
          <div className="pt-3">
            <button 
              onClick={() => navigate('/inquiry')}
              className="text-sm font-bold text-slate-900 bg-gradient-to-r from-[#5DC840] to-[#29B8C8] hover:shadow-xl hover:brightness-105 active:scale-[0.98] py-4 px-10 rounded-full transition-all text-white"
              id="cta-submit-btn"
            >
              Submit an RFQ Now &rarr;
            </button>
          </div>
        </motion.div>
      </section>

      {/* REUSABLE FOOTER */}
      <Footer />

    </div>
  );
}
