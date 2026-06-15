// src/components/DetailPanel.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Phone, Calendar, PenTool, Truck, FileText, AlertCircle, Sparkles } from 'lucide-react';
import StatusBadge from './StatusBadge';
import PriorityDot from './PriorityDot';

/**
 * Slide-over detail panel for high-fidelity inquiry assessment.
 * 
 * Props:
 * @param {object|null} props.inquiry - Selected inquiry object to display
 * @param {function} props.onClose - Callback to close the slide-over
 * @param {function} props.onStatusChange - Callback to change inquiry workflow status
 */
export default function DetailPanel({ inquiry, onClose, onStatusChange }) {
  if (!inquiry) return null;

  // Adapt to legacy and normalized fields
  const buyerName = inquiry.customerName || inquiry.fullName || 'Anonymous Buyer';
  const buyerEmail = inquiry.customerEmail || inquiry.email || 'N/A';
  const buyerPhone = inquiry.customerPhone || inquiry.phone || 'Not provided';
  const contactPref = inquiry.contactMethod || 'Email';

  const make = inquiry.vehicleMake || 'Unknown';
  const model = inquiry.vehicleModel || 'Unknown';
  const year = inquiry.vehicleYear || 'N/A';
  const engine = inquiry.vehicleEngine || 'N/A';

  const partName = inquiry.partName || 'N/A';
  const partNo = inquiry.partNumber || 'N/A';
  const qty = inquiry.quantity || 1;
  const urgencyLabel = inquiry.urgency || 'not_urgent';
  const notes = inquiry.notes || inquiry.description || 'No notes provided by the requester.';
  
  const aiSummaryText = inquiry.aiSummary || `Inquiry submitted successfully for ${partName}. Standard technical review required.`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900"
          id="detail-panel-backdrop"
        />

        {/* Slide-over panel wrapper */}
        <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="w-screen max-w-md bg-white shadow-2xl flex flex-col h-full border-l border-slate-200"
            id="detail-panel-body"
          >
            {/* Panel Header */}
            <div className="px-6 py-5 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#29B8C8]">
                  Assessment Portal
                </span>
                <h2 className="text-base font-bold text-slate-800 leading-tight">
                  {buyerName}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 hover:text-slate-700 transition-colors"
                aria-label="Close panel"
                id="close-panel-btn"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
              
              {/* Reference ID & Badge summary row */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-150">
                <div>
                  <div className="text-[10px] text-slate-400 font-mono font-semibold uppercase">Inquiry ID</div>
                  <div className="font-mono text-sm font-bold text-slate-800">{inquiry.id}</div>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <StatusBadge status={inquiry.status} />
                  <PriorityDot priority={inquiry.priority || 'medium'} />
                </div>
              </div>

              {/* Section 1: Customer Info */}
              <div className="space-y-3">
                <h3 className="text-xs uppercase font-bold text-slate-800 tracking-wider flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-brand-navy" />
                  Customer Info
                </h3>
                <div className="bg-slate-50/60 p-4 rounded-xl border border-slate-100 space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-normal">Name:</span>
                    <strong className="text-slate-700 font-medium">{buyerName}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-normal">Email:</span>
                    <a href={`mailto:${buyerEmail}`} className="text-brand-navy font-mono hover:underline font-medium flex items-center gap-1">
                      <Mail className="h-3 w-3 inline shrink-0" />
                      {buyerEmail}
                    </a>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-normal">Phone:</span>
                    <span className="text-slate-700 font-medium font-mono flex items-center gap-1">
                      <Phone className="h-3 w-3 inline shrink-0" />
                      {buyerPhone}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/50">
                    <span className="text-slate-400 font-normal">Contact Preference:</span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-200 text-slate-700 uppercase">
                      {contactPref}
                    </span>
                  </div>
                </div>
              </div>

              {/* Section 2: Vehicle Specs */}
              <div className="space-y-3">
                <h3 className="text-xs uppercase font-bold text-slate-800 tracking-wider flex items-center gap-1.5">
                  <Truck className="h-3.5 w-3.5 text-brand-navy" />
                  Vehicle Specifications
                </h3>
                <div className="bg-slate-50/60 p-4 rounded-xl border border-slate-100 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-slate-400 block text-xs">Make:</span>
                    <strong className="text-slate-700 font-semibold">{make}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-xs">Model:</span>
                    <strong className="text-slate-700 font-semibold">{model}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-xs">Model Year:</span>
                    <strong className="text-slate-700 font-semibold font-mono">{year}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-xs">Engine Trim:</span>
                    <strong className="text-slate-700 font-semibold font-mono">{engine}</strong>
                  </div>
                </div>
              </div>

              {/* Section 3: Part Details */}
              <div className="space-y-3">
                <h3 className="text-xs uppercase font-bold text-slate-800 tracking-wider flex items-center gap-1.5">
                  <PenTool className="h-3.5 w-3.5 text-brand-navy" />
                  Requested Component Details
                </h3>
                <div className="bg-slate-50/60 p-4 rounded-xl border border-slate-100 text-sm space-y-3">
                  <div>
                    <span className="text-slate-400 block text-xs">Component/Part Name:</span>
                    <strong className="text-slate-700 font-semibold text-sm">{partName}</strong>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-slate-400 block text-xs">Part Number (OEM):</span>
                      <strong className="text-slate-700 font-mono font-medium text-xs break-all">{partNo}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-xs">QTY Demanded:</span>
                      <strong className="text-slate-700 font-mono font-semibold">{qty} units</strong>
                    </div>
                  </div>
                  <div className="pt-2.5 border-t border-slate-200/50">
                    <span className="text-slate-400 block text-xs mb-1">Original Purchaser Notes:</span>
                    <p className="text-xs text-slate-600 bg-white border border-slate-150 rounded-lg p-2.5 leading-relaxed font-normal">
                      {notes}
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 4: AI Summary */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-[#29B8C8] animate-bounce" />
                  <h3 className="text-xs uppercase font-bold text-[#1a8f9e] tracking-wider">
                    Automated Sourcing Insight
                  </h3>
                </div>
                <div className="border border-[#b2ebf2] bg-[#f0fdfa] p-4 rounded-xl text-xs text-[#126b77] leading-relaxed flex gap-3">
                  <span className="text-xl shrink-0" role="img" aria-label="Robot assistance">🤖</span>
                  <div>
                    <p className="font-normal font-sans">
                      {aiSummaryText}
                    </p>
                    <div className="mt-2 text-[10px] text-[#29B8C8] font-bold uppercase tracking-widest font-mono">
                      Category Classifier: {inquiry.category || 'Standard'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 5: Status Select */}
              <div className="space-y-2.5 pt-2 border-t border-slate-150">
                <label htmlFor="inquiry-status-selector" className="text-xs uppercase font-semibold text-slate-500 tracking-wider block">
                  Sourcing Pipeline Workflow Status
                </label>
                <div className="relative">
                  <select
                    id="inquiry-status-selector"
                    value={inquiry.status}
                    onChange={(e) => onStatusChange(inquiry.id, e.target.value)}
                    className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 bg-white focus:border-brand-navy focus:ring-1 focus:ring-brand-navy outline-none appearance-none"
                  >
                    <option value="new">New Request</option>
                    <option value="in_progress">In Sourcing</option>
                    <option value="quoted">Quoted</option>
                    <option value="closed">Completed / Closed</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

            </div>

            {/* Panel footer buttons */}
            <div className="px-6 py-4 border-t border-slate-200/80 bg-slate-50 flex items-center gap-3">
              <button
                onClick={() => {
                  alert(`Quote dispatch system initialized. Sending parts invoice/offer sheet to ${buyerEmail}.`);
                  onStatusChange(inquiry.id, 'quoted');
                }}
                className="flex-1 py-3 text-xs font-bold text-center text-white bg-gradient-to-r from-[#5DC840] to-[#29B8C8] hover:shadow hover:brightness-105 active:scale-[0.98] rounded-xl transition-all"
                id="send-quote-btn"
              >
                Send Quote
              </button>
              <button
                onClick={onClose}
                className="px-4 py-3 text-xs font-bold text-[#1B2A4A] bg-transparent border border-slate-300 rounded-xl hover:bg-slate-100 transition-colors"
                id="panel-cancel-btn"
              >
                Close
              </button>
            </div>

          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
