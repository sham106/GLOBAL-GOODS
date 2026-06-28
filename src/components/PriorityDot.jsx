import React from 'react';

/**
 * PriorityDot component displaying a small colored circle and priority text label.
 * @param {object} props
 * @param {'urgent' | 'high' | 'medium' | 'low'} props.priority
 */
export default function PriorityDot({ priority }) {
  const normalized = priority ? priority.toLowerCase() : 'low';

  const configs = {
    urgent: {
      colorClass: 'bg-red-500',
      label: 'Urgent'
    },
    high: {
      colorClass: 'bg-red-500',
      label: 'High'
    },
    medium: {
      colorClass: 'bg-amber-400',
      label: 'Medium'
    },
    low: {
      colorClass: 'bg-[#5DC840]',
      label: 'Low'
    }
  };

  const current = configs[normalized] || configs.low;

  return (
    <div className="inline-flex items-center gap-1.5 text-xs text-slate-600 font-medium">
      <span className={`h-2 w-2 rounded-full shrink-0 ${current.colorClass}`} />
      <span>{current.label}</span>
    </div>
  );
}
