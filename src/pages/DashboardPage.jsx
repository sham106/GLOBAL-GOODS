// src/pages/DashboardPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Download, 
  Trash2, 
  Clock, 
  Bell, 
  ChevronRight, 
  X, 
  Layers, 
  Settings, 
  Users, 
  CheckCircle, 
  Smartphone, 
  Mail, 
  Phone, 
  TrendingUp, 
  DollarSign, 
  AlertTriangle,
  FolderOpen,
  Send,
  Sparkles,
  Info,
  Sliders,
  Database,
  Grid,
  Image
} from 'lucide-react';
import { formatDate } from '../utils/generateRef';
import Logo from '../components/Logo';

const navItemClass = (isActive) =>
  `dashboard-nav-item ${isActive ? 'dashboard-nav-item-active' : 'dashboard-nav-item-inactive'}`;

// Initial pristine seed data matching GGS standards
const DUMMY_INQUIRIES = [
  {
    id: 'GGS-2025-0041',
    createdAt: new Date(Date.now() - 1000 * 6 * 60 * 60).toISOString(), // Today, 6 hours ago
    status: 'new',
    priority: 'high',
    category: 'Electrical & Electronic Equipment',
    vehicleMake: 'Toyota',
    vehicleModel: 'Hilux',
    vehicleYear: 2019,
    vehicleEngine: '2.8L Diesel',
    partName: 'Alternator unit',
    partNumber: '27060-0L010',
    quantity: 2,
    urgency: 'asap',
    notes: 'Need OEM replacements, buying for a fleet of Toyota vans.',
    customerName: 'Raj Patel',
    customerEmail: 'raj.patel@example.com',
    customerPhone: '+230 5712 3456',
    contactMethod: 'WhatsApp',
    company: 'Patel logistics Ltd',
    images: ['https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=600&q=80'],
    aiSummary: 'Fleet purchase, highly quality-conscious. Demands OEM warranty approval prior to invoice settlement.'
  },
  {
    id: 'GGS-2025-0105',
    createdAt: new Date(Date.now() - 1000 * 18 * 60 * 60).toISOString(), // Yesterday, 18 hours ago
    status: 'new',
    priority: 'urgent',
    category: 'Automotive Fleet & Parts',
    vehicleMake: 'BMW',
    vehicleModel: '320i',
    vehicleYear: 2020,
    vehicleEngine: '2.0L Petrol Turbo',
    partName: 'Brake Pads & Rotors Kit',
    partNumber: '34116889570',
    quantity: 1,
    urgency: 'asap',
    notes: 'Severe metal scraping noise from front passenger side. Urgent dispatch requested.',
    customerName: 'Anjali Appasamy',
    customerEmail: 'anjali_a@mailforce.mu',
    customerPhone: '+230 5254 9876',
    contactMethod: 'Phone Call',
    company: '',
    images: ['https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=600&q=80'],
    aiSummary: 'High-urgency braking failure. Customer reports metal grinding. Proposes rapid dispatch matching.'
  },
  {
    id: 'GGS-2025-0112',
    createdAt: new Date(Date.now() - 1000 * 36 * 60 * 60).toISOString(), // 1.5 days ago
    status: 'in_progress',
    priority: 'medium',
    category: 'Automotive Fleet & Parts',
    vehicleMake: 'Ford',
    vehicleModel: 'Ranger',
    vehicleYear: 2018,
    vehicleEngine: '3.2L TDCI Diesel',
    partName: 'Turbocharger Assembly',
    partNumber: 'FB3Q-6K682-AB',
    quantity: 1,
    urgency: 'within_week',
    notes: 'Sudden loss of engine power with black fumes. Gaskets also preferred.',
    customerName: 'Jean-Pierre Robert',
    customerEmail: 'jp.robert@canecables.mu',
    customerPhone: '+230 5831 4411',
    contactMethod: 'Email',
    company: 'Cane Cables Mauritius',
    images: ['https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=600&q=80'],
    aiSummary: 'Turbo leakage on diesel engine. Core diagnostics suggest full replacement. Prefers heavy-duty setup.'
  },
  {
    id: 'GGS-2025-0120',
    createdAt: new Date(Date.now() - 1000 * 48 * 60 * 60).toISOString(), // 2 days ago
    status: 'in_progress',
    priority: 'medium',
    category: 'Heavy Duty Machinery & Equipment',
    vehicleMake: 'Mercedes-Benz',
    vehicleModel: 'C-Class',
    vehicleYear: 2017,
    vehicleEngine: '1.6L BlueTec',
    partName: 'Front Strut Assembly (Pair)',
    partNumber: 'A2053200730',
    quantity: 1,
    urgency: 'within_week',
    notes: 'Fluid leaking on front passenger shock absorber. Prefers Bilstein or genuine Mercedes parts.',
    customerName: 'Muhammad Alli',
    customerEmail: 'alli_transport@gmail.com',
    customerPhone: '+230 5945 1122',
    contactMethod: 'WhatsApp',
    company: 'Alli Express Transport',
    images: ['https://images.unsplash.com/photo-1616422285623-13ff0162193c?auto=format&fit=crop&w=600&q=80'],
    aiSummary: 'Suspension leak on luxury commuter car. Seeking premium Bilstein aftermarket or OEM options.'
  },
  {
    id: 'GGS-2025-0128',
    createdAt: new Date(Date.now() - 1000 * 72 * 60 * 60).toISOString(), // 3 days ago
    status: 'quoted',
    priority: 'low',
    category: 'Automotive Fleet & Parts',
    vehicleMake: 'Hyundai',
    vehicleModel: 'Tucson',
    vehicleYear: 2021,
    vehicleEngine: '2.0L MPi',
    partName: 'Rear Bumper Cover Guard',
    partNumber: '86611-D3500',
    quantity: 1,
    urgency: 'not_urgent',
    notes: 'Cosmetic upgrade after minor wall scratch. Insurance quote requested.',
    customerName: 'Marie-Claire Lagesse',
    customerEmail: 'mclagesse@corporate.mu',
    customerPhone: '+230 5723 8899',
    contactMethod: 'Email',
    company: 'Lagesse Agricultural Corp',
    aiSummary: 'Aesthetic cover panel replacement. Low priority. Formal bumper insurance breakdown dispatched.'
  },
  {
    id: 'GGS-2025-0135',
    createdAt: new Date(Date.now() - 1000 * 96 * 60 * 60).toISOString(), // 4 days ago
    status: 'quoted',
    priority: 'high',
    category: 'MRO Supplies (Maintenance, Repair & Operating)',
    vehicleMake: 'Nissan',
    vehicleModel: 'NV350 Urvan',
    vehicleYear: 2016,
    vehicleEngine: '2.5L YD25',
    partName: 'Engine Radiator Core assembly',
    partNumber: '21410-3XA0A',
    quantity: 3,
    urgency: 'asap',
    notes: 'Urgent cooling restoration for delivery vehicles before summer peak.',
    customerName: 'Keshav Naidu',
    customerEmail: 'knaidu@coldchainsolutions.mu',
    customerPhone: '+230 5289 7755',
    contactMethod: 'Phone Call',
    company: 'Cold Chain Solutions Ltd',
    aiSummary: 'Preventative fleet cooling restoration. Bulk parts matched with original Japanese radiator seals.'
  },
  {
    id: 'GGS-2025-0142',
    createdAt: new Date(Date.now() - 1000 * 120 * 60 * 60).toISOString(), // 5 days ago
    status: 'closed',
    priority: 'medium',
    category: 'Electrical & Electronic Equipment',
    vehicleMake: 'Volkswagen',
    vehicleModel: 'Golf MK7',
    vehicleYear: 2015,
    vehicleEngine: '1.4L TSI',
    partName: 'Ignition Coil Pack Kit',
    partNumber: '04E905110K',
    quantity: 1,
    urgency: 'asap',
    notes: 'Engine error status P0301 misfire on cylinder 1. Need premium brand like Bosch.',
    customerName: 'Wendy Chung',
    customerEmail: 'wendy_c@intnet.mu',
    customerPhone: '+230 5777 6622',
    contactMethod: 'WhatsApp',
    company: '',
    aiSummary: 'Cylinder 1 misfire resolved by matching original German coils. Transaction processed with full warehousing release.'
  }
];

export default function DashboardPage() {
  // Sidebar items state
  const [activeNav, setActiveNav] = useState('Inquiries');
  
  // Sourcing list state
  const [inquiries, setInquiries] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  
  // Selected detail panel state
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [lightboxImage, setLightboxImage] = useState(null);
  
  // UI states
  const [notifications, setNotifications] = useState(3);
  const [quoteSuccessMsg, setQuoteSuccessMsg] = useState(null);
  const [isSendingQuote, setIsSendingQuote] = useState(false);
  const [quoteValue, setQuoteValue] = useState('');
  const [leadTimeDays, setLeadTimeDays] = useState('5 to 8');
  
  // Detect mobile width to responsive-orient slide-over panels
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768;

  // Local storage inquiry state syncing
  useEffect(() => {
    const localKey = 'global_goods_inquiries';
    const saved = localStorage.getItem(localKey);
    if (saved) {
      try {
        setInquiries(JSON.parse(saved));
      } catch (err) {
        setInquiries(DUMMY_INQUIRIES);
      }
    } else {
      localStorage.setItem(localKey, JSON.stringify(DUMMY_INQUIRIES));
      setInquiries(DUMMY_INQUIRIES);
    }
  }, []);

  const saveInquiriesToStorage = (updated) => {
    localStorage.setItem('global_goods_inquiries', JSON.stringify(updated));
    setInquiries(updated);
  };

  // Modify inquiry status in main list
  const updateStatus = (id, newStatus) => {
    const updated = inquiries.map(item => {
      if (item.id === id) {
        const priorityFromStatus = newStatus === 'new' ? 'high' : item.priority;
        return { ...item, status: newStatus, priority: priorityFromStatus };
      }
      return item;
    });
    saveInquiriesToStorage(updated);
    
    // Update active chosen inquiry if open in panel
    if (selectedInquiry && selectedInquiry.id === id) {
      setSelectedInquiry(prev => ({ ...prev, status: newStatus }));
    }
  };

  const deleteInquiry = (id, e) => {
    if (e) e.stopPropagation();
    if (confirm('Are you sure you want to permanently discard this sourcing inquiry from tracking records?')) {
      const updated = inquiries.filter(item => item.id !== id);
      saveInquiriesToStorage(updated);
      if (selectedInquiry && selectedInquiry.id === id) {
        setSelectedInquiry(null);
      }
    }
  };

  const resetToSeeds = () => {
    if (confirm('Overwrite current database back to original sample inquiries? This will clean up all new test entries.')) {
      localStorage.removeItem('global_goods_inquiries');
      localStorage.setItem('global_goods_inquiries', JSON.stringify(DUMMY_INQUIRIES));
      setInquiries(DUMMY_INQUIRIES);
      setSelectedInquiry(null);
    }
  };

  // Triggering visual "Send Quote Response" inside panel
  const handleSendQuoteResponse = () => {
    if (!quoteValue) {
      alert('Please specify quote valuation amount.');
      return;
    }
    setIsSendingQuote(true);
    setTimeout(() => {
      setIsSendingQuote(false);
      setQuoteSuccessMsg(`Quote brochure of $${parseFloat(quoteValue).toLocaleString()} sent to keys! Sourcing ticket automatically bumped to "Quoted" status.`);
      
      // Update in main data
      updateStatus(selectedInquiry.id, 'quoted');
      
      setTimeout(() => {
        setQuoteSuccessMsg(null);
        setQuoteValue('');
      }, 5000);
    }, 1200);
  };

  // Export CSV Helper
  const handleExportCSV = () => {
    const headers = 'Inquiry ID,Customer Name,Email,Phone,Vehicle,Part Required,Quantity,Category,Urgency,Status,Created At\n';
    const rows = filteredInquiries.map((inq) => {
      return `"${inq.id}","${inq.customerName}","${inq.customerEmail || inq.email || ''}","${inq.customerPhone || inq.phone || ''}","${inq.vehicleYear} ${inq.vehicleMake} ${inq.vehicleModel}","${inq.partName}","${inq.quantity}","${inq.category}","${inq.urgency}","${inq.status}","${inq.createdAt}"`;
    }).join('\n');
    
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `GGS_inquiries_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // KPI Calculations
  // Baseline sums matching user's requested totals:
  const baseTotal = 134; 
  const basePending = 5;
  const baseQuoted = 36;
  const baseClosed = 94;

  const totalInquiriesCount = baseTotal + inquiries.length;
  const pendingCount = basePending + inquiries.filter(i => i.status === 'new').length;
  const quotedCount = baseQuoted + inquiries.filter(i => i.status === 'quoted').length;
  const closedCount = baseClosed + inquiries.filter(i => i.status === 'closed').length;

  // Filter state logical sorting
  const filteredInquiries = inquiries.filter(inq => {
    const searchLower = searchQuery.toLowerCase();
    const customerField = (inq.customerName || '').toLowerCase();
    const vehicleField = `${inq.vehicleMake} ${inq.vehicleModel}`.toLowerCase();
    const partField = (inq.partName || '').toLowerCase();
    const idField = (inq.id || '').toLowerCase();

    const matchesSearch = 
      customerField.includes(searchLower) ||
      vehicleField.includes(searchLower) ||
      partField.includes(searchLower) ||
      idField.includes(searchLower);

    if (!matchesSearch) return false;

    if (activeFilter === 'All') return true;
    if (activeFilter === 'New') return inq.status === 'new';
    if (activeFilter === 'In Progress') return inq.status === 'in_progress';
    if (activeFilter === 'Quoted') return inq.status === 'quoted';
    if (activeFilter === 'Closed') return inq.status === 'closed';
    if (activeFilter === 'Urgent') {
      return inq.priority === 'urgent' || inq.priority === 'high' || inq.urgency === 'asap';
    }
    return true;
  });

  // Category tags helper for visual highlights
  const getCategoryColor = (category) => {
    switch ((category || '').toLowerCase()) {
      case 'electrical':
      case 'electrical & electronic equipment':
        return 'bg-purple-55 text-purple-700 bg-purple-50 border border-purple-100';
      case 'brakes':
      case 'automotive fleet & parts':
        return 'bg-rose-55 text-rose-700 bg-rose-50 border border-rose-100';
      case 'engine':
      case 'engine & drivetrain':
      case 'heavy duty machinery & equipment':
        return 'bg-amber-55 text-amber-800 bg-amber-50 border border-amber-100';
      case 'suspension':
      case 'suspension & steering':
      case 'mro supplies (maintenance, repair & operating)':
        return 'bg-indigo-55 text-indigo-700 bg-indigo-50 border border-indigo-100';
      case 'cooling':
      case 'industrial products & equipment':
        return 'bg-cyan-55 text-cyan-700 bg-cyan-50 border border-cyan-100';
      default:
        return 'bg-teal-55 text-teal-700 bg-teal-50 border border-teal-100';
    }
  };

  // Communication channel helper
  const getContactIcon = (method) => {
    const m = (method || '').toLowerCase();
    if (m.includes('whatsapp')) return <span className="font-semibold text-xs text-emerald-600 inline-flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100"><Smartphone className="h-3 w-3 inline" /> WhatsApp</span>;
    if (m.includes('phone') || m.includes('call')) return <span className="font-semibold text-xs text-blue-600 inline-flex items-center gap-1 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100"><Phone className="h-3 w-3 inline" /> Phone</span>;
    return <span className="font-semibold text-xs text-violet-600 inline-flex items-center gap-1 bg-violet-50 px-2 py-0.5 rounded-full border border-violet-105"><Mail className="h-3 w-3 inline" /> Email</span>;
  };

  return (
    <div className="dashboard flex min-h-screen bg-[#f8fafc] text-slate-800 relative font-body">

      {/* SIDEBAR COMPONENT - Fixed for desktop screens (240px) */}
      <aside className="w-64 bg-[#1B2A4A] flex flex-col justify-between text-slate-200 shrink-0 h-screen sticky top-0 left-0 hidden md:flex z-30 shadow-xl">
        <div className="flex flex-col">
          {/* Brand header */}
          <div className="p-6 border-b border-slate-800">
            <Logo size="sm" variant="dark" subtitle="Admin Dashboard" />
          </div>

          {/* Nav links */}
          <nav className="p-4 space-y-6">
            
            {/* MAIN CATEGORY */}
            <div className="space-y-1">
              <span className="dashboard-nav-label">Main</span>
              <button
                onClick={() => setActiveNav('Inquiries')}
                className={`${navItemClass(activeNav === 'Inquiries')} justify-between`}
              >
                <div className="flex items-center gap-3">
                  <Grid className="h-[18px] w-[18px]" />
                  <span>Inquiries</span>
                </div>
                <span className="bg-[#5DC840] text-white text-xs font-bold h-5 min-w-5 px-1.5 rounded-full flex items-center justify-center">
                  {inquiries.filter(i => i.status === 'new').length > 0 ? inquiries.filter(i => i.status === 'new').length : '7'}
                </span>
              </button>

              <button
                onClick={() => setActiveNav('Analytics')}
                className={navItemClass(activeNav === 'Analytics')}
              >
                <TrendingUp className="h-[18px] w-[18px]" />
                <span>Analytics</span>
              </button>

              <button
                onClick={() => setActiveNav('Quotes Sent')}
                className={navItemClass(activeNav === 'Quotes Sent')}
              >
                <Send className="h-[18px] w-[18px]" />
                <span>Quotes Sent</span>
              </button>
            </div>

            {/* MANAGE CATEGORY */}
            <div className="space-y-1 pt-4">
              <span className="dashboard-nav-label">Manage</span>
              <button
                onClick={() => setActiveNav('Customers')}
                className={navItemClass(activeNav === 'Customers')}
              >
                <Users className="h-[18px] w-[18px]" />
                <span>Customers</span>
              </button>

              <button
                onClick={() => setActiveNav('Categories')}
                className={navItemClass(activeNav === 'Categories')}
              >
                <FolderOpen className="h-[18px] w-[18px]" />
                <span>Categories</span>
              </button>

              <button
                onClick={() => setActiveNav('Settings')}
                className={navItemClass(activeNav === 'Settings')}
              >
                <Settings className="h-[18px] w-[18px]" />
                <span>Settings</span>
              </button>
            </div>

          </nav>
        </div>

        {/* User avatar metadata and Logout */}
        <div className="p-4 border-t border-slate-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-[#5DC840] to-[#29B8C8] flex items-center justify-center text-white text-xs font-black select-none uppercase shadow-md">
              GG
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-semibold text-white leading-none whitespace-nowrap">Admin</span>
              <span className="text-xs text-slate-400 mt-1 truncate">Business Owner</span>
            </div>
          </div>
          <Link
            to="/"
            className="w-full text-center block text-xs font-semibold text-slate-400 hover:text-[#5DC840] border border-slate-700 rounded-xl py-2.5 hover:bg-slate-800/40 transition-all"
          >
            Leave Sourcing Console
          </Link>
        </div>
      </aside>

      {/* MOBILE BOTTOM TAB BAR (Hidden on desktop screen, fixed stick under 768px) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-[4.25rem] bg-[#1B2A4A] border-t border-slate-700 z-50 flex items-center justify-around px-2 text-white">
        <button
          onClick={() => setActiveNav('Inquiries')}
          className={`flex flex-col items-center justify-center gap-1 flex-1 h-full py-1 ${
            activeNav === 'Inquiries' ? 'text-[#5DC840] font-semibold' : 'text-slate-400'
          }`}
        >
          <span className="relative">
            <Grid className="h-5 w-5" />
            <span className="absolute -top-1.5 -right-2 bg-[#5DC840] text-white text-[10px] h-4 w-4 rounded-full flex items-center justify-center font-bold">
              1
            </span>
          </span>
          <span className="text-xs">Inquiries</span>
        </button>

        <button
          onClick={() => setActiveNav('Analytics')}
          className={`flex flex-col items-center justify-center gap-1 flex-1 h-full py-1 ${
            activeNav === 'Analytics' ? 'text-[#5DC840] font-semibold' : 'text-slate-400'
          }`}
        >
          <TrendingUp className="h-5 w-5" />
          <span className="text-xs">Analytics</span>
        </button>

        <button
          onClick={() => setActiveNav('Quotes Sent')}
          className={`flex flex-col items-center justify-center gap-1 flex-1 h-full py-1 ${
            activeNav === 'Quotes Sent' ? 'text-[#5DC840] font-semibold' : 'text-slate-400'
          }`}
        >
          <Send className="h-5 w-5" />
          <span className="text-xs">Quotes</span>
        </button>

        <button
          onClick={() => setActiveNav('Settings')}
          className={`flex flex-col items-center justify-center gap-1 flex-1 h-full py-1 ${
            activeNav === 'Settings' ? 'text-[#5DC840] font-semibold' : 'text-slate-400'
          }`}
        >
          <Settings className="h-5 w-5" />
          <span className="text-xs">Settings</span>
        </button>
      </div>

      {/* MAIN MAIN CONTENT LAYER */}
      <main className="flex-1 flex flex-col min-w-0 pb-20 md:pb-6">
        
        {/* HEADER BAR */}
        <header className="bg-white border-b border-slate-200 px-6 py-5 flex items-center justify-between sticky top-0 z-20 shadow-sm">
          <div className="flex flex-col gap-1">
            <h1 className="dashboard-page-title">
              {activeNav === 'Inquiries' ? 'Inquiries' : activeNav}
            </h1>
            <p className="dashboard-page-subtitle">
              {activeNav === 'Inquiries' ? `Today: ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })} • 7 new responses pending match` : `Global Goods & Services Pty Ltd | ${activeNav}`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportCSV}
              className="text-brand-navy bg-slate-50 hover:bg-slate-100 border border-slate-200 py-2.5 px-4 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all shadow-sm"
              title="Export filtered inquiries in spreadsheet format"
            >
              <Download className="h-3.5 w-3.5 text-[#29B8C8]" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
            
            <div className="relative">
              <button 
                onClick={() => setNotifications(0)}
                className="p-2 bg-slate-50 border border-slate-205 rounded-xl hover:bg-slate-100 transition-colors relative"
              >
                <Bell className="h-4.5 w-4.5 text-[#1B2A4A]" />
                {notifications > 0 && (
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-[#5DC840] animate-pulse" />
                )}
              </button>
            </div>
          </div>
        </header>

        {/* CONTAINER AND INNER TAB WRAPPERS */}
        <div className="p-4 sm:p-6 space-y-6">
          
          {/* DYNAMIC VIEW SWITCHING */}
          {activeNav === 'Inquiries' && (
            <div className="space-y-6">              {/* KPI CARDS (4 cards in a row, 2x2 on mobile) */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                
                {/* CARD 1 - Total inquiries */}
                <div className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-[#29B8C8]" />
                  <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span className="dashboard-kpi-label">Total Inquiries</span>
                    <FolderOpen className="h-4 w-4 text-[#29B8C8]" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-[#1B2A4A] tracking-tight">{totalInquiriesCount}</div>
                  <div className="text-xs text-emerald-600 font-semibold mt-2 flex items-center gap-1">
                    <span>↑ 12 this week</span>
                  </div>
                </div>

                {/* CARD 2 - Pending response */}
                <div className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-amber-400" />
                  <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span className="dashboard-kpi-label">Queries Pending</span>
                    <Info className="h-4 w-4 text-amber-550" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-amber-600 tracking-tight">{pendingCount}</div>
                  <div className="text-xs text-amber-600 font-semibold mt-2 flex items-center gap-1">
                    <span className="bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60 font-medium font-semibold">In queue</span>
                  </div>
                </div>

                {/* CARD 3 - Quoted inquiries */}
                <div className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-[#5DC840]" />
                  <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span className="dashboard-kpi-label">Quotes Issued</span>
                    <CheckCircle className="h-4 w-4 text-[#5DC840]" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-[#1B2A4A] tracking-tight">{quotedCount}</div>
                  <div className="text-xs text-emerald-600 font-semibold mt-2 flex items-center gap-1">
                    <span>↑ 5 this week</span>
                  </div>
                </div>

                {/* CARD 4 - Closed inquiries */}
                <div className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-slate-400" />
                  <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span className="dashboard-kpi-label">Inquiries Resolved</span>
                    <TrendingUp className="h-4 w-4 text-slate-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-slate-700 tracking-tight">{closedCount}</div>
                  <div className="text-xs text-slate-500 font-semibold mt-2">
                    <span>68% conversion rate</span>
                  </div>
                </div>

              </div>

              {/* FILTER BAR */}
              <div className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-sm space-y-4">
                <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
                  
                  {/* Search box element */}
                  <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search inquiries by customer name, brand / make, part names..."
                      className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-xl pl-10 pr-4 py-3 text-sm text-slate-800 outline-none focus:border-[#29B8C8] focus:ring-2 focus:ring-[#29B8C8]/15 transition-all font-medium"
                    />
                  </div>

                  {/* Filter pill wrappers */}
                  <div className="flex flex-wrap items-center gap-2">
                    {[
                      { label: 'All', id: 'All' },
                      { label: 'New', id: 'New', emoji: '🆕' },
                      { label: 'In Progress', id: 'In Progress', emoji: '🔄' },
                      { label: 'Quoted', id: 'Quoted', emoji: '💬' },
                      { label: 'Closed', id: 'Closed', emoji: '✅' },
                      { label: 'Urgent', id: 'Urgent', emoji: '🚨' }
                    ].map((pill) => (
                      <button
                        key={pill.id}
                        type="button"
                        onClick={() => setActiveFilter(pill.id)}
                        className={`px-3.5 py-2 rounded-full text-sm font-semibold transition-all border ${
                          activeFilter === pill.id
                            ? 'border-[#29B8C8] bg-[#29B8C8]/10 text-brand-navy shadow-sm'
                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        {pill.emoji && <span className="mr-1 inline-block">{pill.emoji}</span>}
                        {pill.label}
                      </button>
                    ))}
                  </div>

                </div>
              </div>

              {/* INQUIRY TABLE CONTAINER */}
              <div className="bg-white rounded-2xl border border-slate-200/85 shadow-sm overflow-hidden">
                {filteredInquiries.length === 0 ? (
                  <div className="py-16 px-6 text-center space-y-4">
                    <div className="h-12 w-12 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center mx-auto">
                      <Search className="h-6 w-6" />
                    </div>
                    <h3 className="font-heading font-extrabold text-base text-slate-700">No matching inquiries</h3>
                    <p className="text-slate-400 text-xs max-w-sm mx-auto leading-relaxed">
                      We found zero sourcing entries matching your filter parameters. Try clearing your search query or choose "All" filters.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                          <th className="dashboard-table-head sticky left-0 bg-slate-50 md:relative z-10">Customer</th>
                          <th className="dashboard-table-head">Vehicle</th>
                          <th className="dashboard-table-head">Part Details</th>
                          <th className="dashboard-table-head text-center">Attached Photos</th>
                          <th className="dashboard-table-head max-w-[200px]">AI Match Recommendation</th>
                          <th className="dashboard-table-head">Priority</th>
                          <th className="dashboard-table-head">Status</th>
                          <th className="dashboard-table-head">Date</th>
                          <th className="dashboard-table-head text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-150">
                        {filteredInquiries.map((inq) => {
                          const contactLabel = inq.contactMethod || 'Email';
                          return (
                            <tr 
                              key={inq.id}
                              onClick={() => setSelectedInquiry(inq)}
                              className="hover:bg-slate-50/50 cursor-pointer transition-colors group"
                            >
                              {/* Sticky Customer on small screens */}
                              <td className="py-4 px-4 sticky left-0 bg-white group-hover:bg-slate-50 md:relative z-10 border-r border-slate-100 md:border-r-0 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.03)] md:shadow-none min-w-[140px]">
                                <div className="space-y-1.5">
                                  <div className="font-heading font-bold text-sm text-brand-navy truncate">
                                    {inq.customerName}
                                  </div>
                                  <div className="text-xs text-slate-500 font-mono">
                                    {inq.id}
                                  </div>
                                  <div>
                                    {getContactIcon(contactLabel)}
                                  </div>
                                </div>
                              </td>

                              {/* Vehicle column */}
                              <td className="py-4 px-4 min-w-[150px]">
                                <div className="space-y-1.5">
                                  <div className="font-semibold text-sm text-slate-800">
                                    {inq.vehicleMake} {inq.vehicleModel}
                                  </div>
                                  <div className="text-xs text-slate-500">
                                    Year: {inq.vehicleYear}
                                  </div>
                                  {inq.vehicleEngine && (
                                    <div className="text-xs text-brand-teal font-medium uppercase">
                                      Trim: {inq.vehicleEngine}
                                    </div>
                                  )}
                                </div>
                              </td>

                              {/* Part details column */}
                              <td className="py-4 px-4 min-w-[160px]">
                                <div className="space-y-1.5">
                                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wide inline-block ${getCategoryColor(inq.category)}`}>
                                    {inq.category}
                                  </span>
                                  <div className="text-sm text-slate-700 font-medium">
                                    {inq.partName} <span className="font-mono text-sm font-bold text-brand-green">× {inq.quantity}</span>
                                  </div>
                                  {inq.partNumber && (
                                    <div className="text-xs font-mono text-slate-500 uppercase">
                                      PN: {inq.partNumber}
                                    </div>
                                  )}
                                </div>
                              </td>

                              {/* Attached Photos Column */}
                              <td className="py-4 px-4 min-w-[145px] text-center" onClick={(e) => e.stopPropagation()}>
                                {inq.images && inq.images.length > 0 ? (
                                  <div className="flex items-center justify-center -space-x-2.5 overflow-hidden hover:space-x-1 transition-all duration-300 py-1">
                                    {inq.images.slice(0, 3).map((img, idx) => (
                                      <div 
                                        key={idx} 
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setLightboxImage(img);
                                        }}
                                        className="h-9 w-9 rounded-lg border-2 border-white ring-1 ring-slate-200 overflow-hidden cursor-zoom-in shadow-xs hover:scale-115 hover:z-20 transition-all duration-200 relative bg-slate-50 shrink-0"
                                        title="Click to view full image"
                                      >
                                        <img 
                                          src={img} 
                                          alt="customer attachment" 
                                          className="h-full w-full object-cover" 
                                          referrerPolicy="no-referrer"
                                        />
                                      </div>
                                    ))}
                                    {inq.images.length > 3 && (
                                      <span className="flex items-center justify-center h-8 w-8 rounded-lg bg-[#29B8C8]/10 text-[#29B8C8] text-[10px] font-black border border-[#29B8C8]/20 shrink-0 select-none z-10">
                                        +{inq.images.length - 3}
                                      </span>
                                    )}
                                  </div>
                                ) : (
                                  <span className="text-slate-300 text-[10px] font-bold tracking-wider uppercase select-none">
                                    None
                                  </span>
                                )}
                              </td>

                              {/* AI summary */}
                              <td className="py-4 px-4 max-w-[220px] min-w-[200px]">
                                <div className="space-y-1">
                                  <span className="inline-flex items-center gap-1 bg-[#e8f9e3] border border-[#5DC840]/30 text-[#3a9e22] text-xs font-semibold px-2 py-0.5 rounded-full uppercase">
                                    <Sparkles className="h-3 w-3" /> AI Matcher
                                  </span>
                                  <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">
                                    {inq.aiSummary || 'Analyzed engine fitment matched standard factory clearances. Sourcing valid.'}
                                  </p>
                                </div>
                              </td>

                              {/* Priority dots */}
                              <td className="py-4 px-4 whitespace-nowrap min-w-[100px]">
                                <div className="flex items-center gap-1.5">
                                  {inq.priority === 'urgent' || inq.priority === 'high' || inq.urgency === 'asap' ? (
                                    <div className="flex items-center gap-1">
                                      <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse inline-block" />
                                      <span className="text-xs font-semibold text-red-500 uppercase">Urgent</span>
                                    </div>
                                  ) : (inq.priority === 'medium' || inq.urgency === 'within_week' ? (
                                    <div className="flex items-center gap-1">
                                      <span className="h-2 w-2 rounded-full bg-amber-400 inline-block" />
                                      <span className="text-xs font-medium text-amber-600">Medium</span>
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-1">
                                      <span className="h-2 w-2 rounded-full bg-[#5DC840] inline-block" />
                                      <span className="text-xs text-slate-500">Low</span>
                                    </div>
                                  ))}
                                </div>
                              </td>

                              {/* Status Custom badges */}
                              <td className="py-4 px-4 whitespace-nowrap">
                                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border leading-none inline-block ${
                                  inq.status === 'new'
                                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                                    : (inq.status === 'in_progress'
                                      ? 'bg-amber-50 text-amber-750 border-amber-200'
                                      : (inq.status === 'quoted'
                                        ? 'bg-[#e8f9e3] text-[#3a9e22] border-[#5DC840]/30'
                                        : 'bg-slate-100 text-slate-600 border-slate-200'))
                                }`}>
                                  {inq.status === 'new' ? 'New Inquiry' : (inq.status === 'in_progress' ? 'Sourcing' : (inq.status === 'quoted' ? 'Quoted' : 'Closed'))}
                                </span>
                              </td>

                              {/* Date column relative representation */}
                              <td className="py-4 px-4 text-sm font-medium text-slate-600 whitespace-nowrap">
                                {formatDate(inq.createdAt)}
                              </td>

                              {/* Actions clickable View */}
                              <td className="py-4 px-4 text-center whitespace-nowrap">
                                <button 
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedInquiry(inq);
                                  }}
                                  className="text-sm font-semibold text-brand-navy bg-slate-50 hover:bg-slate-100 border border-slate-200 py-2 px-3.5 rounded-lg group-hover:border-[#29B8C8] group-hover:text-[#29B8C8] transition-all"
                                  id={`btn-view-${inq.id}`}
                                >
                                  View
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* ANALYTICS SUB VIEW TAB */}
          {activeNav === 'Analytics' && (
            <div className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Metric circular SVG view */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm text-center flex flex-col justify-between h-80">
                  <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#1B2A4A] text-left">Sourcing Yield Performance</h3>
                  <div className="relative flex items-center justify-center my-6">
                    <svg className="w-36 h-36 transform -rotate-90">
                      <circle cx="72" cy="72" r="58" stroke="#f1f5f9" strokeWidth="12" fill="transparent" />
                      <circle cx="72" cy="72" r="58" stroke="#5DC840" strokeWidth="12" fill="transparent" strokeDasharray="364.4" strokeDashoffset="116.6" strokeLinecap="round" />
                    </svg>
                    <div className="absolute text-center">
                      <div className="text-3xl font-black text-[#1B2A4A]">68%</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Sourcing Win</div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-450 leading-relaxed text-left font-normal mt-2">
                    68% of all sourced quotations resulted in bulk sales clearance this quarter. Sourcing network SLA averages 2.4 hours response.
                  </p>
                </div>

                {/* Popular brand metrics */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between h-80">
                  <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#1B2A4A] mb-4">Manufacturer Distribution</h3>
                  <div className="space-y-4 flex-1">
                    {[
                      { brand: 'Toyota Motor Corp', pct: 42, count: 58, color: 'bg-indigo-500' },
                      { brand: 'BMW Group Group', pct: 18, count: 25, color: 'bg-[#29B8C8]' },
                      { brand: 'Ford Motor Company', pct: 15, count: 21, color: 'bg-amber-400' },
                      { brand: 'Mercedes-Benz AG', pct: 12, count: 17, color: 'bg-[#1B2A4A]' },
                      { brand: 'Other / Imports', pct: 13, count: 21, color: 'bg-slate-350' }
                    ].map((entry) => (
                      <div key={entry.brand} className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs text-slate-705">
                          <span className="font-bold">{entry.brand}</span>
                          <span className="font-mono text-slate-400 font-semibold">{entry.count} inquiries ({entry.pct}%)</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2">
                          <div className={`h-full rounded-full ${entry.color}`} style={{ width: `${entry.pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Category volume analysis */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between h-80">
                  <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#1B2A4A]">Part Demands Categories</h3>
                  <div className="grid grid-cols-2 gap-3 flex-1 mt-4">
                    {[
                      { name: 'Electrical & Electronic Equipment', value: '38%', color: 'border-l-4 border-purple-400 bg-purple-50/20' },
                      { name: 'Automotive Fleet & Parts', value: '25%', color: 'border-l-4 border-rose-450 bg-rose-50/20' },
                      { name: 'Heavy Duty Machinery & Equipment', value: '18%', color: 'border-l-4 border-amber-400 bg-amber-50/20' },
                      { name: 'MRO Supplies (Maintenance, Repair & Operating)', value: '12%', color: 'border-l-4 border-indigo-400 bg-indigo-50/20' },
                      { name: 'Industrial Products & Equipment', value: '7%', color: 'border-l-4 border-cyan-400 bg-cyan-50/20' }
                    ].map((cat) => (
                      <div key={cat.name} className={`p-2.5 rounded-xl border border-slate-105 flex flex-col justify-between ${cat.color}`}>
                        <span className="text-[10px] text-slate-400 font-bold uppercase truncate">{cat.name}</span>
                        <span className="text-lg font-black text-[#1B2A4A] font-mono">{cat.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Reset seed database action block */}
              <div className="bg-[#1B2A4A] p-6 rounded-2xl text-white flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="font-heading font-extrabold text-[#5DC840] text-sm">Need to debug or demonstrate new tickets?</h4>
                  <p className="text-slate-350 text-xs">
                    You can clear local logs to reload the default sample catalog seeded by GGS logistics administrators.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={resetToSeeds}
                  className="bg-white text-[#1B2A4A] hover:bg-[#5DC840] hover:text-white transition-all font-bold text-xs py-2 px-5 rounded-full outline-none shadow-md"
                >
                  Reset baseline catalog
                </button>
              </div>

            </div>
          )}

          {/* QUOTES SENT SUB VIEW TAB */}
          {activeNav === 'Quotes Sent' && (
            <div className="bg-white rounded-2xl border border-slate-200/85 overflow-hidden shadow-sm">
              <div className="p-5 border-b border-slate-150">
                <h3 className="font-heading font-extrabold text-sm text-[#1B2A4A]">Dispatched Sourcing Brochure logs</h3>
                <p className="text-slate-450 text-xs font-normal mt-0.5">Below logs track quote margins, ETA lead times, and dispatch statuses sent out to consumers.</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-150 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      <th className="p-4">Ticket</th>
                      <th className="p-4">Customer Sourced</th>
                      <th className="p-4">Part requested</th>
                      <th className="p-4">Quoted Margins</th>
                      <th className="p-4">Lead Time ETA</th>
                      <th className="p-4">Wholesale price status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150 text-xs">
                    {inquiries.filter(i => i.status === 'quoted' || i.status === 'closed').map(inq => (
                      <tr key={inq.id} className="hover:bg-slate-50/50">
                        <td className="p-4 font-mono font-bold text-slate-800">{inq.id}</td>
                        <td className="p-4">
                          <div className="font-bold text-slate-705">{inq.customerName}</div>
                          <div className="text-[10px] text-slate-400">{inq.customerEmail}</div>
                        </td>
                        <td className="p-4 font-semibold text-slate-700">
                          {inq.partName} <span className="text-slate-400 text-[10px]">({inq.vehicleMake} {inq.vehicleModel})</span>
                        </td>
                        <td className="p-4 font-mono font-bold text-emerald-600">
                          ${((inq.quantity * 210) + 120).toLocaleString()}.00 USD
                        </td>
                        <td className="p-4 font-medium text-slate-500">
                          5 to 8 Transit Days
                        </td>
                        <td className="p-4">
                          <span className="bg-emerald-50 text-[#3a9e22] border border-emerald-150 rounded-full px-2.5 py-0.5 text-[10px] font-bold">
                            Dispatched Quote
                          </span>
                        </td>
                      </tr>
                    ))}
                    {inquiries.filter(i => i.status === 'quoted' || i.status === 'closed').length === 0 && (
                      <tr className="text-center font-normal">
                        <td colSpan="6" className="p-8 text-slate-400 text-xs">
                          No quotes currently tracked in this session. Select an inquiry, assign pricing inside the "View" slide-over panel, and hit "Send Quote Response"!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* CUSTOMERS VIEW TAB */}
          {activeNav === 'Customers' && (
            <div className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden shadow-sm">
              <div className="p-5 border-b border-[#f1f5f9]">
                <h3 className="font-heading font-extrabold text-sm text-[#1B2A4A]">Customer Client Directory</h3>
                <p className="text-slate-400 text-xs">Client contacts gathered from the local storage database records.</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 text-[10px] uppercase text-slate-400 font-bold tracking-wider">
                      <th className="p-4">Customer Name</th>
                      <th className="p-4">Corporate Company</th>
                      <th className="p-4">Email Contact</th>
                      <th className="p-4">Phone Number</th>
                      <th className="p-4 text-center">Inquiry Count</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150 text-xs">
                    {inquiries.map((inq) => (
                      <tr key={inq.id} className="hover:bg-slate-50/50">
                        <td className="p-4 font-black text-slate-750">{inq.customerName}</td>
                        <td className="p-4 font-medium text-slate-500 uppercase">{inq.company || 'Private Buyer'}</td>
                        <td className="p-4 font-mono font-medium text-slate-550">{inq.customerEmail}</td>
                        <td className="p-4 text-slate-600 font-mono">{inq.customerPhone}</td>
                        <td className="p-4 text-center">
                          <span className="bg-teal-50 text-brand-navy border border-teal-200 rounded px-2 py-0.5 text-xs font-mono font-bold">
                            1 request
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* CATEGORIES VIEW TAB */}
          {activeNav === 'Categories' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { name: 'Electrical & Sensors', color: 'border-t-4 border-purple-500', count: 3, margin: '18% gross', desc: 'Alternators, coil pack, sensors, batteries, wire assemblies.' },
                { name: 'Braking Systems', color: 'border-t-4 border-rose-500', count: 2, margin: '22% gross', desc: 'Brake pads, ventilated rotors, wear indicators, brake calipers.' },
                { name: 'Engine & Drivetrain', color: 'border-t-4 border-amber-500', count: 4, margin: '25% gross', desc: 'Turbochargers, intake valves, pistons, crank rods, fuel systems.' },
                { name: 'Suspension & Steering', color: 'border-t-4 border-indigo-500', count: 1, margin: '20% gross', desc: 'Struts, shock absorbers, control arms, sway bar bushes.' },
                { name: 'Cooling Systems', color: 'border-t-4 border-cyan-500', count: 2, margin: '15% gross', desc: 'Radiator cores, thermostats, water pumps, coolant expansion tanks.' },
                { name: 'Body & Panels', color: 'border-t-4 border-slate-500', count: 1, margin: '12% gross', desc: 'Bumper cover, grilles, luxury trims, window regulator mechanics.' }
              ].map((c) => (
                <div key={c.name} className={`bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow relative ${c.color}`}>
                  <h4 className="font-heading font-extrabold text-sm text-[#1B2A4A]">{c.name}</h4>
                  <div className="flex gap-4 items-center my-3 text-xs font-normal">
                    <div>
                      <span className="text-slate-400 block text-[9px] uppercase font-bold">Active Sourced</span>
                      <strong>{c.count} in-queue</strong>
                    </div>
                    <div className="border-l border-slate-150 h-6" />
                    <div>
                      <span className="text-slate-400 block text-[9px] uppercase font-bold">Target Margin</span>
                      <strong className="text-emerald-600">{c.margin}</strong>
                    </div>
                  </div>
                  <p className="text-slate-500 text-xs leading-normal mt-1 pt-1.5 border-t border-slate-50">
                    {c.desc}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* SETTINGS VIEW TAB */}
          {activeNav === 'Settings' && (
            <div className="max-w-xl mx-auto bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
              <h3 className="font-heading font-extrabold text-base text-[#1B2A4A]">Enterprise Sourcing configurations</h3>
              
              <div className="space-y-4 text-xs font-normal">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Global Profit Markup Margin (%)</label>
                  <input 
                    type="number" 
                    defaultValue="18" 
                    className="w-full px-4 py-2.5 border-[1.5px] border-slate-201 rounded-xl outline-none focus:border-[#29B8C8] bg-slate-50/50" 
                    id="markup-percentage-input"
                  />
                  <p className="text-slate-400 text-[10px] mt-1">Directly applies to verified raw wholesale quotes from global custom factories.</p>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Maximum SLA Response Target</label>
                  <select className="w-full px-4 py-2.5 border-[1.5px] border-slate-201 rounded-xl outline-none focus:border-[#29B8C8] bg-slate-50/50" id="sla-select">
                    <option>Within 2 hours</option>
                    <option>Within 4 hours</option>
                    <option>Within 12 hours</option>
                    <option>SLA disabled</option>
                  </select>
                </div>

                <div className="p-4 rounded-xl bg-orange-50 border border-orange-105 space-y-2">
                  <h4 className="font-bold text-orange-800 flex items-center gap-1.5 text-xs"><AlertTriangle className="h-4 w-4" /> Reset catalog variables</h4>
                  <p className="text-orange-700 leading-normal text-[11px]">
                    To clean out simulated actions and set local storage back to baseline factory demos, hit the reset button.
                  </p>
                  <button
                    type="button"
                    onClick={resetToSeeds}
                    className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-4 py-2 rounded-lg transition-colors text-[10px] mt-2 block"
                    id="btn-settings-seed-reset"
                  >
                    Load Pristine Seed Data
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => alert('Sourcing console configuration saved successfully!')}
                  className="bg-gradient-to-r from-[#5DC840] to-[#29B8C8] hover:scale-[1.01] transition-transform text-white font-bold px-6 py-2.5 rounded-full text-xs shadow-md"
                  id="btn-settings-save"
                >
                  Save Settings
                </button>
              </div>
            </div>
          )}

        </div>

      </main>

      {/* DETAIL SLIDE-OVER PANEL / BOTTOM SHEET */}
      <AnimatePresence>
        {selectedInquiry && (
          <>
            {/* Background Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedInquiry(null)}
              className="fixed inset-0 bg-slate-900/40 z-40 backdrop-blur-xs select-none"
            />

            {/* Panel (Slides in from right on desktop / slides from bottom on mobile) */}
            <motion.div
              initial={isMobile ? { y: '105%', x: 0 } : { x: '105%', y: 0 }}
              animate={isMobile ? { y: 0, x: 0 } : { x: 0, y: 0 }}
              exit={isMobile ? { y: '105%', x: 0 } : { x: '105%', y: 0 }}
              transition={{ type: 'spring', damping: 24, stiffness: 210 }}
              className={`fixed z-50 bg-white shadow-2xl flex flex-col justify-between ${
                isMobile 
                  ? 'bottom-0 left-0 right-0 h-[88vh] rounded-t-3xl' 
                  : 'top-0 right-0 bottom-0 w-[480px] h-screen'
              }`}
              id="detail-slideover-viewport"
            >
              
              {/* SLIDE-OVER HEADER */}
              <div className="px-6 py-5 border-b border-slate-200 flex items-start justify-between shrink-0 bg-slate-50/60">
                <div className="flex flex-col gap-2">
                  <span className="dashboard-detail-eyebrow">Sourcing Ticket Details</span>
                  <h3 className="dashboard-detail-panel-title flex flex-wrap items-center gap-2.5">
                    {selectedInquiry.id}
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                      selectedInquiry.status === 'new'
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : (selectedInquiry.status === 'in_progress'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : (selectedInquiry.status === 'quoted'
                            ? 'bg-[#e8f9e3] text-[#3a9e22] border-[#5DC840]/30'
                            : 'bg-slate-100 text-slate-600 border-slate-200'))
                    }`}>
                      {selectedInquiry.status === 'new' ? 'New' : (selectedInquiry.status === 'in_progress' ? 'Sourcing' : (selectedInquiry.status === 'quoted' ? 'Quoted' : 'Closed'))}
                    </span>
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedInquiry(null)}
                  className="p-2 hover:bg-white border border-slate-200 rounded-full transition-colors text-slate-500 hover:text-slate-700 shrink-0"
                  aria-label="Close detail panel"
                  id="btn-close-slideover"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* SLIDE-OVER BODY (Scrollable contents) */}
              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-7 text-sm text-slate-700">
                
                {/* Status custom Dropdown workflow */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                  <label className="dashboard-field-label" htmlFor="slideover-status-dropdown">Update sourcing status</label>
                  <select
                    value={selectedInquiry.status}
                    onChange={(e) => updateStatus(selectedInquiry.id, e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg bg-white text-sm font-semibold text-slate-800 focus:border-[#29B8C8] focus:ring-2 focus:ring-[#29B8C8]/15 outline-none"
                    id="slideover-status-dropdown"
                  >
                    <option value="new">🆕 New / Pending Assessment</option>
                    <option value="in_progress">🔄 In Progress / Active Sourcing</option>
                    <option value="quoted">💬 Quoted / Valuation Sent</option>
                    <option value="closed">✅ Closed / Resolved Sourcing</option>
                  </select>
                </div>

                {/* Consumer Client information */}
                <div className="space-y-4">
                  <h4 className="dashboard-detail-section-title">
                    <Users className="h-4 w-4 text-brand-teal" /> Customer Details
                  </h4>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                    <div>
                      <span className="dashboard-detail-label">Customer name</span>
                      <strong className="dashboard-detail-value">{selectedInquiry.customerName || 'N/A'}</strong>
                    </div>
                    <div>
                      <span className="dashboard-detail-label">Corporate client</span>
                      <strong className="dashboard-detail-value uppercase truncate block">{selectedInquiry.company || 'Private Buyer'}</strong>
                    </div>
                    <div>
                      <span className="dashboard-detail-label">Email address</span>
                      <strong className="dashboard-detail-value font-medium block truncate select-text">{selectedInquiry.customerEmail || 'N/A'}</strong>
                    </div>
                    <div>
                      <span className="dashboard-detail-label">Telephone contact</span>
                      <strong className="dashboard-detail-value font-medium block select-text">{selectedInquiry.customerPhone || 'N/A'}</strong>
                    </div>
                    <div className="col-span-2">
                      <span className="dashboard-detail-label">Preferred contact method</span>
                      <div>{getContactIcon(selectedInquiry.contactMethod || 'Email')}</div>
                    </div>
                  </div>
                </div>

                {/* Sourced Vehicle details */}
                <div className="space-y-4">
                  <h4 className="dashboard-detail-section-title">
                    <span role="img" aria-label="car-icon">🚗</span> Vehicle Information
                  </h4>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                    <div>
                      <span className="dashboard-detail-label">Brand / make</span>
                      <strong className="dashboard-detail-value">{selectedInquiry.vehicleMake || 'N/A'}</strong>
                    </div>
                    <div>
                      <span className="dashboard-detail-label">Model name</span>
                      <strong className="dashboard-detail-value">{selectedInquiry.vehicleModel || 'N/A'}</strong>
                    </div>
                    <div>
                      <span className="dashboard-detail-label">Manufacture year</span>
                      <strong className="dashboard-detail-value">{selectedInquiry.vehicleYear || 'N/A'}</strong>
                    </div>
                    <div>
                      <span className="dashboard-detail-label">Engine trim / specs</span>
                      <strong className="text-sm font-semibold text-brand-teal">{selectedInquiry.vehicleEngine || 'Standard Trim'}</strong>
                    </div>
                  </div>
                </div>

                {/* Parts specifications demand */}
                <div className="space-y-4">
                  <h4 className="dashboard-detail-section-title">
                    <span role="img" aria-label="engine-gears">⚙️</span> Parts Required
                  </h4>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                    <div>
                      <span className="dashboard-detail-label">Category</span>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wide inline-block ${getCategoryColor(selectedInquiry.category)}`}>
                        {selectedInquiry.category || 'Generics'}
                      </span>
                    </div>
                    <div>
                      <span className="dashboard-detail-label">Part name</span>
                      <strong className="dashboard-detail-value">{selectedInquiry.partName || 'N/A'}</strong>
                    </div>
                    <div>
                      <span className="dashboard-detail-label">Required quantity</span>
                      <strong className="dashboard-detail-value">{selectedInquiry.quantity || 1} units</strong>
                    </div>
                    <div>
                      <span className="dashboard-detail-label">Part number (MPN)</span>
                      <strong className="dashboard-detail-value font-mono text-xs uppercase">{selectedInquiry.partNumber || 'Auto-sourced (standard catalog)'}</strong>
                    </div>
                    <div>
                      <span className="dashboard-detail-label">Sourcing urgency</span>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold inline-block border ${
                        selectedInquiry.urgency === 'asap' 
                          ? 'text-rose-600 bg-rose-50 border-rose-200' 
                          : (selectedInquiry.urgency === 'within_week' ? 'text-orange-600 bg-orange-50 border-orange-100' : 'text-slate-500 bg-slate-100 border-slate-200')
                      }`}>
                        {selectedInquiry.urgency === 'asap' ? 'ASAP / Critical' : (selectedInquiry.urgency === 'within_week' ? 'Within Week' : 'Not Urgent')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* AI Matching algorithm recommendation */}
                <div className="space-y-3 border border-[#5DC840]/30 rounded-xl p-4 bg-gradient-to-r from-emerald-50/40 to-[#e0f7fa]/40">
                  <h5 className="font-semibold text-[#3a9e22] text-sm flex items-center gap-2">
                    <Sparkles className="h-4 w-4" strokeWidth="2.5" /> GGS AI Sourcing Analysis
                  </h5>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {selectedInquiry.aiSummary || 'Automated validation matches this model reference exactly onto factory molds. Compatible materials verified.'}
                  </p>
                </div>

                {/* Client original notes */}
                <div className="space-y-3">
                  <span className="dashboard-detail-label mb-0">Client original notes</span>
                  <p className="p-4 bg-slate-50 border border-slate-200 rounded-xl leading-relaxed text-sm text-slate-700">
                    {selectedInquiry.notes || 'No custom notes provided. Routine fitment analysis dispatched.'}
                  </p>
                </div>

                {/* Client attached pictures */}
                {selectedInquiry.images && selectedInquiry.images.length > 0 && (
                  <div className="space-y-3">
                    <span className="dashboard-detail-label mb-0">Client attached photos ({selectedInquiry.images.length})</span>
                    <div className="grid grid-cols-2 gap-3">
                      {selectedInquiry.images.map((_img, index) => (
                        <div 
                          key={index} 
                          onClick={() => setLightboxImage(_img)}
                          className="border border-slate-200 rounded-xl overflow-hidden aspect-video bg-slate-50 flex items-center justify-center relative group cursor-zoom-in"
                        >
                          <img 
                            src={_img} 
                            alt={`Attachment ${index + 1}`} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-semibold transition-opacity duration-200">
                            Click to expand
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {/* SLIDE-OVER SEND QUOTE ACTION SECTION footer */}
              <div className="px-6 py-5 border-t border-slate-200 bg-slate-50 space-y-4 shrink-0">
                {quoteSuccessMsg ? (
                  <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="p-4 bg-emerald-50 text-[#3a9e22] rounded-xl border border-emerald-200 text-center font-semibold text-sm"
                  >
                    {quoteSuccessMsg}
                  </motion.div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="dashboard-detail-label" htmlFor="slideover-quote-amount">Quote valuation (USD)</label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-semibold text-slate-500">$</span>
                          <input
                            type="number"
                            value={quoteValue}
                            onChange={(e) => setQuoteValue(e.target.value)}
                            placeholder="750"
                            className="w-full pl-7 pr-3 py-2.5 border border-slate-200 rounded-lg outline-none focus:border-[#29B8C8] focus:ring-2 focus:ring-[#29B8C8]/15 bg-white text-sm font-semibold text-slate-800"
                            id="slideover-quote-amount"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="dashboard-detail-label" htmlFor="slideover-quote-eta">Lead time ETA</label>
                        <select
                          value={leadTimeDays}
                          onChange={(e) => setLeadTimeDays(e.target.value)}
                          className="w-full px-3 py-2.5 border border-slate-200 rounded-lg outline-none focus:border-[#29B8C8] focus:ring-2 focus:ring-[#29B8C8]/15 bg-white text-sm font-medium text-slate-800"
                          id="slideover-quote-eta"
                        >
                          <option value="5 to 8">5 to 8 transit days</option>
                          <option value="12 to 14">12 to 14 transit days</option>
                          <option value="Overnight Air">Overnight air cargo</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={handleSendQuoteResponse}
                        disabled={isSendingQuote || !quoteValue}
                        className="flex-1 bg-gradient-to-r from-[#5DC840] to-[#29B8C8] hover:scale-[1.01] transition-all text-white text-sm font-semibold py-3 rounded-full flex items-center justify-center gap-2 shadow-md disabled:opacity-40"
                        id="slideover-send-quote-btn"
                      >
                        {isSendingQuote ? (
                          <>
                            <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin inline-block text-xs" />
                            <span>Processing...</span>
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4" />
                            <span>Send Quote Response</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={(e) => deleteInquiry(selectedInquiry.id, e)}
                        className="border border-red-200 hover:border-red-300 bg-red-50 hover:bg-red-100 text-red-600 px-3.5 rounded-full transition-colors"
                        title="Delete this ticket"
                        id="slideover-delete-btn"
                      >
                        <Trash2 className="h-4.5 w-4.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* LIGHTBOX ENLARGED IMAGE PREVIEW MODAL */}
      <AnimatePresence>
        {lightboxImage && (
          <div 
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 select-none cursor-pointer"
            onClick={() => setLightboxImage(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ type: 'spring', damping: 25, stiffness: 260 }}
              className="relative max-w-[90vw] max-h-[85vh] rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center overflow-hidden shadow-2xl cursor-default"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Floating Close Button */}
              <button
                type="button"
                onClick={() => setLightboxImage(null)}
                className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 text-white p-2.5 rounded-full transition-all border border-white/10 hover:border-white/20 z-50 shadow-md"
                title="Close full-size image"
                id="btn-close-lightbox"
              >
                <X className="h-5 w-5" />
              </button>

              <img 
                src={lightboxImage} 
                alt="Enlarged attachment preview" 
                className="max-w-full max-h-[80vh] object-contain rounded-xl select-none"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
