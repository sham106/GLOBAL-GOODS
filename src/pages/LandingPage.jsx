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
  Hammer,
  DollarSign,
  TrendingDown,
  Check,
  MapPin,
  Activity,
  ArrowUpRight,
  Globe
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import useScrollAnimation, { fadeInUp } from '../hooks/useScrollAnimation';
import heroSectionImage1 from '../assets/hero-section image1.jpg';
import heavyMachineryImage from '../assets/heavy machinery.jpg';
import industrialEquipmentImage from '../assets/industrial-equipment.jpg';
import hospitalitySuppliesImage from '../assets/hospitality-supplies.jpg';

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

const slides = [
  {
    title: "Heavy Equipment Procurement",
    description: "Heavy machinery and production plant loading operations.",
    img: heavyMachineryImage,
    category: "Heavy Machinery"
  },
  {
    title: "Global Logistics & Freight Solutions",
    description: "Mass scale maritime containers at a cargo port.",
    img: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1000&q=80",
    category: "Shipping & Logistics"
  },
  {
    title: "Inventory & Supply Chain Management",
    description: "Secured enterprise supply-chain and warehousing operations.",
    img: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1000&q=80",
    category: "Warehousing"
  },
  {
    title: "Vendor Qualification & Quality Assurance",
    description: "Rigorous ISO audits by tier-one engineers inspecting equipment.",
    img: industrialEquipmentImage,
    category: "Industrial Equipment"
  },
  {
    title: "End-to-End Procurement Services",
    description: "Seamless global freight vessel cargo delivery.",
    img: "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&w=1000&q=80",
    category: "Global Sourcing"
  },
  {
    title: "Food and Beverage Supply Procurement",
    description: "Reliable cross-border sourcing for packaged food, beverages, and distribution-ready stock.",
    img: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1000&q=80",
    category: "Food & Beverage"
  },
  {
    title: "Hospitality and Events Sourcing",
    description: "Procurement support for hotels, venues, and events with quality-checked supplier networks.",
    img: hospitalitySuppliesImage,
    category: "Hospitality & Events"
  },
  {
    title: "Health and Medical Equipment",
    description: "Trusted sourcing of medical equipment and healthcare-grade supplies for institutional clients.",
    img: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1000&q=80",
    category: "Health & Medical"
  },
  {
    title: "Solar and Renewable Energy Solutions",
    description: "Strategic sourcing of solar, storage, and renewable system components for commercial deployment.",
    img: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1000&q=80",
    category: "Renewable Energy"
  }
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [carouselIndex, setCarouselIndex] = useState(0);
  const timerRef = useRef(null);

  // Quick style switch for the hero savings line: 'editorial' | 'gradient' | 'badge'
  const savingsLineVariant = 'editorial'; // Change this to 'gradient' or 'badge' for different styles
  const savingsLineStyles = {
    editorial: 'mt-4 block border-l-2 border-[#5DC840] pl-3 font-serif text-[13px] sm:text-sm italic leading-relaxed text-[#D6F3C3]',
    gradient: 'mt-4 block text-sm sm:text-base font-extrabold tracking-tight leading-relaxed text-transparent bg-clip-text bg-gradient-to-r from-[#B8F995] to-[#7EE6FF]',
    badge: 'mt-3 inline-flex items-center rounded-md border border-[#5DC840]/40 bg-[#5DC840]/10 px-3 py-1.5 font-mono text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#A7F27D]'
  };

  const resetTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % slides.length);
    }, 4500);
  };

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleSelectSlide = (idx) => {
    setCarouselIndex(idx);
    resetTimer();
  };
  
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
        className="relative min-h-screen flex flex-col items-center justify-center pt-28 pb-16 lg:py-24 px-4 sm:px-6 lg:px-12 overflow-hidden bg-gradient-to-br from-[#0B1528] via-[#121F38] to-[#0A111F]"
      >
        {/* Animated Gradient Orbs background layer */}
        <div className="absolute top-1/6 left-1/10 w-[500px] h-[500px] rounded-full bg-[#5DC840]/5 blur-[140px] z-[1] pointer-events-none animate-pulse duration-[10000ms]" />
        <div className="absolute bottom-1/6 right-1/10 w-[600px] h-[600px] rounded-full bg-[#29B8C8]/5 blur-[160px] z-[1] pointer-events-none animate-pulse duration-[12000ms]" />

        {/* Semi-transparent pattern grid */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-[2]" 
          style={{ backgroundImage: 'radial-gradient(ellipse at center, #ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }} 
        />        {/* Subtle background world map network */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-[2]">
          <img 
            src="https://images.unsplash.com/photo-1589519160732-57fc498494f8?auto=format&fit=crop&w=1920&q=80" 
            alt="Global Sourcing Network" 
            className="w-full h-full object-cover opacity-[0.05] mix-blend-overlay filter brightness-75 contrast-125"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="max-w-7xl mx-auto w-full relative z-10 py-6 sm:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* LEFT COLUMN: Premium Headlines, CTAs, and Enterprise Trust */}
            <div className="lg:col-span-5 text-left flex flex-col space-y-8">
              
              {/* Premium Category Pill */}
              <div className="inline-flex">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-mono font-bold text-slate-300">
                  <span className="h-2 w-2 rounded-full bg-[#5DC840] animate-ping" />
                  <span>🌍 GLOBAL PROCUREMENT NETWORK</span>
                </div>
              </div>

              {/* Bold Headline */}
              <div className="space-y-4">
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.1] tracking-tight"
                >
                  Global Procurement.<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5DC840] to-[#29B8C8]">
                    Simplified.
                  </span>
                </motion.h1>

                {/* Subheading */}
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-white/75 text-sm sm:text-[15px] leading-relaxed max-w-xl font-normal"
                >
                  Source products worldwide through a trusted network of suppliers and logistics partners.
                  <span className={savingsLineStyles[savingsLineVariant]}>
                    Substantial savings on purchase prices and import duties for customers in SADC and COMESA regions.
                  </span>
                </motion.p>
              </div>

              {/* CTAs */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-3.5 pt-2"
              >
                <button 
                  onClick={() => navigate('/inquiry')}
                  className="hero-rfq-elastic text-xs sm:text-sm font-bold text-slate-950 bg-gradient-to-r from-[#5DC840] to-[#29B8C8] hover:shadow-lg hover:shadow-[#29B8C8]/25 hover:brightness-110 active:scale-[0.98] py-4 px-8 rounded-full transition-all inline-flex items-center justify-center gap-2"
                  id="hero-primary-btn"
                >
                  <span>Submit an RFQ</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
                <a 
                  href="#features"
                  onClick={(e) => handleScrollTo(e, '#features')}
                  className="text-xs sm:text-sm font-semibold text-white bg-white/5 border border-white/15 hover:bg-white/10 hover:border-white/30 py-4 px-8 rounded-full text-center transition-all inline-flex items-center justify-center gap-1.5"
                  id="hero-secondary-btn"
                >
                  <span>Our Services</span>
                </a>
              </motion.div>



            </div>

            {/* RIGHT COLUMN: Redesigned Apple-Style Stacked Photo Carousel */}
            <div className="lg:col-span-7 w-full flex flex-col space-y-6 lg:pl-6 pb-2">
              <div className="relative h-[330px] sm:h-[390px] md:h-[420px] w-full flex items-center justify-center select-none pt-2">
                
                {/* Third Image Card (Background Left) */}
                <div 
                  className="absolute w-[80%] h-[82%] rounded-3xl overflow-hidden shadow-2xl transition-all duration-700 ease-in-out transform opacity-30 origin-bottom border border-white/10 filter blur-[1px]"
                  style={{
                    transform: 'translateY(16px) rotate(-6deg) scale(0.9)',
                    zIndex: 10
                  }}
                >
                  <img src={slides[(carouselIndex + 2) % slides.length].img} className="w-full h-full object-cover" alt="Sourcing map stack 3" />
                  <div className="absolute inset-0 bg-[#0B1528]/15" />
                </div>

                {/* Second Image Card (Middle Right) */}
                <div 
                  className="absolute w-[86%] h-[88%] rounded-3xl overflow-hidden shadow-2xl transition-all duration-700 ease-in-out transform opacity-60 origin-bottom border border-white/15 filter blur-[0.5px]"
                  style={{
                    transform: 'translateY(10px) rotate(4deg) scale(0.95)',
                    zIndex: 20
                  }}
                >
                  <img src={slides[(carouselIndex + 1) % slides.length].img} className="w-full h-full object-cover" alt="Sourcing map stack 2" />
                  <div className="absolute inset-0 bg-[#0B1528]/10" />
                </div>

                {/* Top Interactive Main Card */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={carouselIndex}
                    initial={{ opacity: 0, scale: 0.9, y: 15 }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1, 
                      y: [0, -8, 0],
                    }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{
                      y: {
                        repeat: Infinity,
                        duration: 6,
                        ease: "easeInOut"
                      },
                      default: { duration: 0.5 }
                    }}
                    className="absolute w-full h-[95%] rounded-3xl overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.6)] border-2 border-white/20 cursor-pointer"
                    style={{
                      zIndex: 30
                    }}
                  >
                    <img src={slides[carouselIndex].img} className="w-full h-full object-cover" alt={slides[carouselIndex].title} />
                    {/* Dark gradient for visual overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />

                    {/* Text overlays on each image */}
                    <div className="absolute bottom-6 left-6 right-6 text-left">
                      <span className="inline-block px-3 py-1 mb-2.5 rounded-full bg-gradient-to-r from-[#5DC840]/90 to-[#29B8C8]/90 text-slate-950 text-[10px] font-mono font-bold uppercase tracking-wider">
                        {slides[carouselIndex].category}
                      </span>
                      <h3 className="text-white text-lg sm:text-2xl font-heading font-black tracking-tight leading-tight">
                        {slides[carouselIndex].title}
                      </h3>
                      <p className="text-white/70 text-xs sm:text-sm font-sans mt-1.5 leading-relaxed">
                        {slides[carouselIndex].description}
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>

              </div>

              {/* Carousel Category Pill-Tabs representing button indicators requested */}
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 py-1 z-30">
                {[
                  { label: "Heavy Machinery", index: 0 },
                  { label: "Industrial Equipment", index: 3 },
                  { label: "Shipping & Logistics", index: 1 },
                  { label: "Warehousing", index: 2 },
                  { label: "Food & Beverage", index: 5 },
                  { label: "Hospitality & Events", index: 6 },
                  { label: "Health & Medical", index: 7 },
                  { label: "Renewable Energy", index: 8 }
                ].map((btn) => (
                  <button
                    key={btn.label}
                    onClick={() => handleSelectSlide(btn.index)}
                    className={`py-2 px-4 rounded-full text-[10px] sm:text-xs font-mono font-bold tracking-wider text-center border transition-all duration-300 ${
                      carouselIndex === btn.index 
                        ? 'bg-gradient-to-r from-[#29B8C8] to-[#5DC840] text-slate-950 border-transparent shadow-[0_0_12px_rgba(41,184,200,0.3)] scale-[1.03]' 
                        : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10 hover:border-white/20 hover:scale-[1.01]'
                    }`}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>



            </div>

          </div>
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
              description="We procure original, generic and specialized items including the manufacturing of discontinued parts &mdash; no matter how challenging."
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
              className="hero-rfq-elastic text-sm font-bold text-slate-900 bg-gradient-to-r from-[#5DC840] to-[#29B8C8] hover:shadow-xl hover:brightness-105 active:scale-[0.98] py-4 px-10 rounded-full transition-all text-white"
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
