import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  CheckCircle,
  Download,
  FolderOpen,
  Grid,
  Mail,
  Phone,
  RefreshCw,
  Search,
  Smartphone,
  Sparkles,
  Trash2,
  TrendingUp,
  Users,
  X,
} from 'lucide-react';
import { formatDate } from '../utils/generateRef';
import {
  deleteInquiry as deleteInquiryApi,
  fetchInquiries,
  updateInquiryStatus as updateInquiryStatusApi,
} from '../utils/api';
import Logo from '../components/Logo';
import { useAdminAuth } from '../auth/AdminAuthContext';

const FILTERS = [
  { label: 'All', value: 'All' },
  { label: 'New', value: 'new' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Quoted', value: 'quoted' },
  { label: 'Closed', value: 'closed' },
];

const STATUS_LABELS = {
  new: 'New Inquiry',
  in_progress: 'In Progress',
  quoted: 'Quoted',
  closed: 'Closed',
};

const STATUS_STYLES = {
  new: 'bg-rose-50 text-rose-700 border-rose-200',
  in_progress: 'bg-amber-50 text-amber-700 border-amber-200',
  quoted: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  closed: 'bg-slate-100 text-slate-600 border-slate-200',
};

const PRIORITY_STYLES = {
  urgent: 'bg-red-50 text-red-600 border-red-200',
  high: 'bg-red-50 text-red-600 border-red-200',
  medium: 'bg-amber-50 text-amber-700 border-amber-200',
  low: 'bg-slate-100 text-slate-500 border-slate-200',
};

const PRIORITY_LABELS = {
  urgent: 'Urgent',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

function getContactBadge(method) {
  const value = (method || '').toLowerCase();

  if (value.includes('whatsapp')) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
        <Smartphone className="h-3 w-3" /> WhatsApp
      </span>
    );
  }

  if (value.includes('phone') || value.includes('call')) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700">
        <Phone className="h-3 w-3" /> Phone
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-violet-200 bg-violet-50 px-2 py-0.5 text-xs font-semibold text-violet-700">
      <Mail className="h-3 w-3" /> Email
    </span>
  );
}

function getCategoryBadge(category = '') {
  const lower = category.toLowerCase();

  if (lower.includes('automotive')) return 'bg-rose-50 text-rose-700 border-rose-200';
  if (lower.includes('electrical')) return 'bg-purple-50 text-purple-700 border-purple-200';
  if (lower.includes('heavy')) return 'bg-amber-50 text-amber-700 border-amber-200';
  if (lower.includes('mro')) return 'bg-indigo-50 text-indigo-700 border-indigo-200';
  if (lower.includes('industrial')) return 'bg-cyan-50 text-cyan-700 border-cyan-200';
  return 'bg-teal-50 text-teal-700 border-teal-200';
}

export default function DashboardPage() {
  const { session, user, signOut, loading: authLoading, isAdmin } = useAdminAuth();
  const [inquiries, setInquiries] = useState([]);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [actionError, setActionError] = useState('');
  const [savingId, setSavingId] = useState('');
  const [lightboxImage, setLightboxImage] = useState(null);
  const [notifications, setNotifications] = useState(0);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768;

  const loadInquiries = async ({ refresh = false } = {}) => {
    if (refresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      const items = await fetchInquiries(500, session?.access_token || '');
      setInquiries(items);
      setLoadError('');
      setActionError('');
    } catch (error) {
      setLoadError(error?.message || 'Unable to load inquiries from the database.');
      setInquiries([]);
      setSelectedInquiry(null);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (!authLoading && isAdmin) {
      loadInquiries();
    }
  }, [authLoading, isAdmin, session?.access_token]);

  const filteredInquiries = useMemo(() => {
    const searchLower = searchQuery.trim().toLowerCase();

    return inquiries.filter((inq) => {
      const customerField = (inq.customerName || '').toLowerCase();
      const vehicleField = `${inq.vehicleMake || ''} ${inq.vehicleModel || ''}`.toLowerCase();
      const partField = (inq.partName || '').toLowerCase();
      const idField = (inq.id || '').toLowerCase();
      const categoryField = (inq.category || '').toLowerCase();

      const matchesSearch =
        !searchLower ||
        customerField.includes(searchLower) ||
        vehicleField.includes(searchLower) ||
        partField.includes(searchLower) ||
        idField.includes(searchLower) ||
        categoryField.includes(searchLower);

      if (!matchesSearch) return false;
      if (activeFilter === 'All') return true;
      return inq.status === activeFilter;
    });
  }, [activeFilter, inquiries, searchQuery]);

  const stats = useMemo(() => {
    const base = {
      total: inquiries.length,
      newCount: 0,
      inProgress: 0,
      quoted: 0,
      closed: 0,
    };

    for (const inquiry of inquiries) {
      if (inquiry.status === 'new') base.newCount += 1;
      if (inquiry.status === 'in_progress') base.inProgress += 1;
      if (inquiry.status === 'quoted') base.quoted += 1;
      if (inquiry.status === 'closed') base.closed += 1;
    }

    return base;
  }, [inquiries]);

  const totalAttachments = useMemo(
    () => inquiries.reduce((count, inquiry) => count + (Array.isArray(inquiry.images) ? inquiry.images.length : 0), 0),
    [inquiries]
  );

  const handleRefresh = async () => {
    await loadInquiries({ refresh: true });
  };

  const handleStatusChange = async (id, nextStatus) => {
    setSavingId(id);
    setActionError('');

    try {
      const updatedItem = await updateInquiryStatusApi(id, nextStatus, session?.access_token || '');
      setInquiries((previous) => previous.map((item) => (item.id === id ? updatedItem : item)));
      setSelectedInquiry((previous) => (previous?.id === id ? updatedItem : previous));
    } catch (error) {
      setActionError(error?.message || 'Failed to update inquiry status.');
    } finally {
      setSavingId('');
    }
  };

  const handleMarkQuotedAndNotify = async () => {
    if (!selectedInquiry) return;
    await handleStatusChange(selectedInquiry.id, 'quoted');
  };

  const handleDeleteInquiry = async (id) => {
    if (!window.confirm('Delete this inquiry from the database? This cannot be undone.')) {
      return;
    }

    setActionError('');

    try {
      await deleteInquiryApi(id, session?.access_token || '');
      setInquiries((previous) => previous.filter((item) => item.id !== id));
      setSelectedInquiry((previous) => (previous?.id === id ? null : previous));
    } catch (error) {
      setActionError(error?.message || 'Failed to delete inquiry.');
    }
  };

  const handleExportCSV = () => {
    const headers = [
      'Inquiry ID',
      'Customer Name',
      'Email',
      'Phone',
      'Vehicle',
      'Part Required',
      'Quantity',
      'Category',
      'Priority',
      'Status',
      'Created At',
    ];

    const rows = filteredInquiries.map((inq) => [
      inq.id || '',
      inq.customerName || '',
      inq.customerEmail || '',
      inq.customerPhone || '',
      `${inq.vehicleMake || ''} ${inq.vehicleModel || ''} ${inq.vehicleYear || ''}`.trim(),
      inq.partName || '',
      inq.quantity || '',
      inq.category || '',
      inq.priority || '',
      inq.status || '',
      inq.createdAt || '',
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `GGS_inquiries_export_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex">
      <aside className="hidden md:flex w-64 shrink-0 flex-col justify-between bg-[#1B2A4A] text-slate-200 sticky top-0 h-screen shadow-xl">
        <div>
          <div className="p-6 border-b border-slate-800">
            <Logo size="sm" variant="dark" subtitle="Admin Dashboard" />
          </div>

          <div className="p-4 space-y-4">
            <div className="rounded-2xl border border-slate-700 bg-slate-900/40 p-4">
              <div className="flex items-center gap-3 mb-3">
                <Grid className="h-5 w-5 text-[#5DC840]" />
                <span className="font-semibold">Inquiry Workspace</span>
              </div>
              <div className="text-xs text-slate-400 leading-relaxed">
                Live database records, status changes, and exports are managed here.
              </div>
              <div className="mt-4 flex items-center justify-between text-xs">
                <span className="text-slate-400">Loaded records</span>
                <span className="font-bold text-white">{stats.total}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-[#5DC840] to-[#29B8C8] flex items-center justify-center text-white text-xs font-black uppercase shadow-md">
              GG
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-white truncate">{user?.email || 'Admin'}</div>
              <div className="text-xs text-slate-400 truncate">Authenticated admin</div>
            </div>
          </div>
          <Link
            to="/"
            className="block w-full rounded-xl border border-slate-700 py-2.5 text-center text-xs font-semibold text-slate-400 hover:bg-slate-800/50 hover:text-[#5DC840] transition-colors"
          >
            Leave Sourcing Console
          </Link>
        </div>
      </aside>

      <main className="flex-1 min-w-0 pb-20 md:pb-6">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white px-4 py-4 sm:px-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-[#1B2A4A]">Inquiry Dashboard</h1>
              <p className="text-sm text-slate-500">
                {isLoading
                  ? 'Loading records from Supabase...'
                  : `Showing ${filteredInquiries.length} of ${stats.total} inquiries from the database.`}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleExportCSV}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-[#1B2A4A] shadow-sm transition-colors hover:bg-slate-100"
              >
                <Download className="h-4 w-4 text-[#29B8C8]" />
                Export CSV
              </button>
              <button
                type="button"
                onClick={handleRefresh}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition-colors hover:bg-slate-50"
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button
                type="button"
                onClick={async () => {
                  await signOut();
                }}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition-colors hover:bg-slate-50"
              >
                Sign Out
              </button>
              <button
                type="button"
                onClick={() => setNotifications(0)}
                className="relative rounded-xl border border-slate-200 bg-white p-2.5 shadow-sm transition-colors hover:bg-slate-50"
              >
                <Bell className="h-4 w-4 text-[#1B2A4A]" />
                {notifications > 0 && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#5DC840]" />}
              </button>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6 space-y-6">
          {loadError && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {loadError}
            </div>
          )}

          {actionError && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              {actionError}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-2 flex items-center justify-between text-slate-500">
                <span className="text-xs font-semibold uppercase tracking-wider">Total</span>
                <FolderOpen className="h-4 w-4 text-[#29B8C8]" />
              </div>
              <div className="text-2xl font-black text-[#1B2A4A]">{stats.total}</div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-2 flex items-center justify-between text-slate-500">
                <span className="text-xs font-semibold uppercase tracking-wider">New</span>
                <Users className="h-4 w-4 text-rose-500" />
              </div>
              <div className="text-2xl font-black text-rose-600">{stats.newCount}</div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-2 flex items-center justify-between text-slate-500">
                <span className="text-xs font-semibold uppercase tracking-wider">In Progress</span>
                <TrendingUp className="h-4 w-4 text-amber-500" />
              </div>
              <div className="text-2xl font-black text-amber-600">{stats.inProgress}</div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-2 flex items-center justify-between text-slate-500">
                <span className="text-xs font-semibold uppercase tracking-wider">Quoted</span>
                <CheckCircle className="h-4 w-4 text-emerald-500" />
              </div>
              <div className="text-2xl font-black text-emerald-600">{stats.quoted}</div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-2 flex items-center justify-between text-slate-500">
                <span className="text-xs font-semibold uppercase tracking-wider">Photos</span>
                <Sparkles className="h-4 w-4 text-[#5DC840]" />
              </div>
              <div className="text-2xl font-black text-[#1B2A4A]">{totalAttachments}</div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by customer, vehicle, part, category, or ID"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm font-medium text-slate-800 outline-none transition-all focus:border-[#29B8C8] focus:bg-white focus:ring-2 focus:ring-[#29B8C8]/15"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {FILTERS.map((filter) => (
                  <button
                    key={filter.value}
                    type="button"
                    onClick={() => setActiveFilter(filter.value)}
                    className={`rounded-full border px-3.5 py-2 text-sm font-semibold transition-all ${
                      activeFilter === filter.value
                        ? 'border-[#29B8C8] bg-[#29B8C8]/10 text-[#1B2A4A]'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {isLoading ? (
              <div className="p-10 text-center text-slate-500">Loading inquiries from Supabase...</div>
            ) : filteredInquiries.length === 0 ? (
              <div className="p-10 text-center">
                <Search className="mx-auto mb-3 h-10 w-10 text-slate-300" />
                <h3 className="text-lg font-bold text-slate-700">No matching inquiries</h3>
                <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                  Try clearing the search query or change the status filter.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse text-left">
                  <thead className="bg-slate-50">
                    <tr className="border-b border-slate-200 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      <th className="sticky left-0 z-10 bg-slate-50 px-4 py-3">Customer</th>
                      <th className="px-4 py-3">Vehicle</th>
                      <th className="px-4 py-3">Part</th>
                      <th className="px-4 py-3 text-center">Photos</th>
                      <th className="px-4 py-3">Priority</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredInquiries.map((inq) => (
                      <tr
                        key={inq.id}
                        onClick={() => setSelectedInquiry(inq)}
                        className="cursor-pointer transition-colors hover:bg-slate-50/70"
                      >
                        <td className="sticky left-0 z-10 min-w-[190px] bg-white px-4 py-4 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.03)] hover:bg-slate-50">
                          <div className="space-y-1">
                            <div className="font-semibold text-[#1B2A4A]">{inq.customerName || 'N/A'}</div>
                            <div className="font-mono text-xs text-slate-400">{inq.id}</div>
                            {getContactBadge(inq.contactMethod)}
                          </div>
                        </td>
                        <td className="px-4 py-4 min-w-[160px]">
                          <div className="space-y-1">
                            <div className="font-semibold text-slate-800">
                              {inq.vehicleMake || 'N/A'} {inq.vehicleModel || ''}
                            </div>
                            <div className="text-xs text-slate-500">Year: {inq.vehicleYear || 'N/A'}</div>
                            {inq.vehicleEngine && <div className="text-xs font-medium uppercase text-[#29B8C8]">{inq.vehicleEngine}</div>}
                          </div>
                        </td>
                        <td className="px-4 py-4 min-w-[210px]">
                          <div className="space-y-1.5">
                            <span className={`inline-block rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-wide ${getCategoryBadge(inq.category)}`}>
                              {inq.category || 'General'}
                            </span>
                            <div className="text-sm font-medium text-slate-700">
                              {inq.partName || 'N/A'} <span className="font-mono font-bold text-[#3a9e22]">x {inq.quantity || 1}</span>
                            </div>
                            {inq.partNumber && <div className="font-mono text-xs uppercase text-slate-500">PN: {inq.partNumber}</div>}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center">
                          {Array.isArray(inq.images) && inq.images.length > 0 ? (
                            <span className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-700">
                              {inq.images.length}
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">None</span>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${PRIORITY_STYLES[inq.priority] || PRIORITY_STYLES.low}`}>
                            {PRIORITY_LABELS[inq.priority] || 'Low'}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[inq.status] || STATUS_STYLES.new}`}>
                            {STATUS_LABELS[inq.status] || 'New Inquiry'}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-slate-600">
                          {formatDate(inq.createdAt)}
                        </td>
                        <td className="px-4 py-4 text-center">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedInquiry(inq);
                            }}
                            className="rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm font-semibold text-[#1B2A4A] transition-colors hover:bg-slate-100"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      <AnimatePresence>
        {selectedInquiry && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedInquiry(null)}
              className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm"
            />

            <motion.div
              initial={isMobile ? { y: '105%' } : { x: '105%' }}
              animate={isMobile ? { y: 0 } : { x: 0 }}
              exit={isMobile ? { y: '105%' } : { x: '105%' }}
              transition={{ type: 'spring', damping: 24, stiffness: 210 }}
              className={`fixed z-50 flex h-[88vh] flex-col bg-white shadow-2xl ${
                isMobile ? 'bottom-0 left-0 right-0 rounded-t-3xl' : 'right-0 top-0 h-screen w-[480px]'
              }`}
            >
              <div className="flex items-start justify-between border-b border-slate-200 bg-slate-50/70 px-6 py-5">
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-slate-400">Inquiry Details</div>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-black text-[#1B2A4A]">{selectedInquiry.id}</h3>
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[selectedInquiry.status] || STATUS_STYLES.new}`}>
                      {STATUS_LABELS[selectedInquiry.status] || 'New Inquiry'}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedInquiry(null)}
                  className="rounded-full border border-slate-200 p-2 text-slate-500 transition-colors hover:bg-white hover:text-slate-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6 text-sm text-slate-700">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400" htmlFor="dashboard-status-select">
                    Update status
                  </label>
                  <select
                    id="dashboard-status-select"
                    value={selectedInquiry.status || 'new'}
                    onChange={(e) => handleStatusChange(selectedInquiry.id, e.target.value)}
                    disabled={savingId === selectedInquiry.id}
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 outline-none focus:border-[#29B8C8] focus:ring-2 focus:ring-[#29B8C8]/15 disabled:opacity-60"
                  >
                    <option value="new">New</option>
                    <option value="in_progress">In Progress</option>
                    <option value="quoted">Quoted</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                <div className="space-y-4">
                  <h4 className="flex items-center gap-2 text-sm font-bold text-[#1B2A4A]">
                    <Users className="h-4 w-4 text-[#29B8C8]" /> Customer Details
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Customer</div>
                      <div className="font-semibold text-slate-800">{selectedInquiry.customerName || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Company</div>
                      <div className="font-semibold text-slate-800">{selectedInquiry.company || 'Private Buyer'}</div>
                    </div>
                    <div className="col-span-2">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Email</div>
                      <div className="break-all font-mono text-sm text-slate-700">{selectedInquiry.customerEmail || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Phone</div>
                      <div className="font-mono text-sm text-slate-700">{selectedInquiry.customerPhone || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Contact</div>
                      <div className="mt-1">{getContactBadge(selectedInquiry.contactMethod)}</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-[#1B2A4A]">Vehicle Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Make</div>
                      <div className="font-semibold text-slate-800">{selectedInquiry.vehicleMake || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Model</div>
                      <div className="font-semibold text-slate-800">{selectedInquiry.vehicleModel || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Year</div>
                      <div className="font-semibold text-slate-800">{selectedInquiry.vehicleYear || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Engine</div>
                      <div className="font-semibold text-slate-800">{selectedInquiry.vehicleEngine || 'Standard Trim'}</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-[#1B2A4A]">Parts Required</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Category</div>
                      <span className={`mt-1 inline-block rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-wide ${getCategoryBadge(selectedInquiry.category)}`}>
                        {selectedInquiry.category || 'General'}
                      </span>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Part name</div>
                      <div className="font-semibold text-slate-800">{selectedInquiry.partName || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Quantity</div>
                      <div className="font-semibold text-slate-800">{selectedInquiry.quantity || 1}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Part number</div>
                      <div className="font-mono text-xs uppercase text-slate-700">{selectedInquiry.partNumber || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Priority</div>
                      <span className={`mt-1 inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${PRIORITY_STYLES[selectedInquiry.priority] || PRIORITY_STYLES.low}`}>
                        {PRIORITY_LABELS[selectedInquiry.priority] || 'Low'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Notes</div>
                  <p className="rounded-xl border border-slate-200 bg-slate-50 p-4 leading-relaxed text-slate-700">
                    {selectedInquiry.notes || 'No notes provided.'}
                  </p>
                </div>

                {Array.isArray(selectedInquiry.images) && selectedInquiry.images.length > 0 && (
                  <div className="space-y-3">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Attached photos ({selectedInquiry.images.length})
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {selectedInquiry.images.map((image, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setLightboxImage(image)}
                          className="group relative aspect-video overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
                        >
                          <img
                            src={image}
                            alt={`Attachment ${index + 1}`}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            referrerPolicy="no-referrer"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-slate-200 bg-slate-50 px-6 py-5">
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={handleMarkQuotedAndNotify}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#5DC840] to-[#29B8C8] px-4 py-3 text-sm font-semibold text-white transition-all hover:brightness-105"
                  >
                    <Mail className="h-4 w-4" /> Mark Quoted & Notify Admin
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteInquiry(selectedInquiry.id)}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100"
                  >
                    <Trash2 className="h-4 w-4" /> Delete Inquiry
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {lightboxImage && (
          <div
            className="fixed inset-0 z-[100] flex cursor-pointer items-center justify-center bg-black/80 p-4 backdrop-blur-md"
            onClick={() => setLightboxImage(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ type: 'spring', damping: 25, stiffness: 260 }}
              className="relative flex max-h-[85vh] max-w-[90vw] items-center justify-center overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setLightboxImage(null)}
                className="absolute right-4 top-4 z-50 rounded-full border border-white/10 bg-black/60 p-2.5 text-white transition-all hover:border-white/20 hover:bg-black/80"
              >
                <X className="h-5 w-5" />
              </button>
              <img
                src={lightboxImage}
                alt="Enlarged attachment preview"
                className="max-h-[80vh] max-w-full select-none rounded-xl object-contain"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
