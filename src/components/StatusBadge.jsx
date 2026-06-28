import React from 'react';

/**
 * StatusBadge component showing a beautifully styled pill badge corresponding to each sourcing phase.
 * @param {object} props
 * @param {'new' | 'in_progress' | 'quoted' | 'closed'} props.status
 */
export default function StatusBadge({ status }) {
  const configs = {
    new: {
      className: 'bg-[#e0f7fa] text-[#1a8f9e] border-[#b2ebf2]',
      label: 'New'
    },
    in_progress: {
      className: 'bg-amber-50 text-amber-700 border-amber-200/50',
      label: 'In Progress'
    },
    quoted: {
      className: 'bg-[#e8f9e3] text-[#3a9e22] border-[#c8f2ba]',
      label: 'Quoted'
    },
    closed: {
      className: 'bg-gray-100 text-gray-400 border-gray-200',
      label: 'Closed'
    }
  };

  const current = configs[status] || configs.new;

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border ${current.className}`}>
      {current.label}
    </span>
  );
}
