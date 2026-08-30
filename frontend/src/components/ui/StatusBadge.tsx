import React from 'react';
import { Status } from '../../types';

interface StatusBadgeProps {
  status: Status | string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md', className = '' }) => {
  const getBadgeConfig = (st: string) => {
    switch (st) {
      case 'SUBMITTED':
        return {
          label: 'Submitted',
          styles: 'bg-slate-100 text-slate-700 border-slate-200',
          dot: 'bg-slate-400',
        };
      case 'UNDER_REVIEW':
        return {
          label: 'Under Review',
          styles: 'bg-sky-50 text-sky-700 border-sky-200',
          dot: 'bg-sky-500',
        };
      case 'ASSIGNED':
        return {
          label: 'Assigned',
          styles: 'bg-indigo-50 text-indigo-700 border-indigo-200',
          dot: 'bg-indigo-500',
        };
      case 'IN_PROGRESS':
        return {
          label: 'In Progress',
          styles: 'bg-blue-50 text-blue-700 border-blue-200',
          dot: 'bg-blue-500 animate-pulse',
        };
      case 'RESOLVED':
        return {
          label: 'Resolved',
          styles: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          dot: 'bg-emerald-500',
        };
      case 'CLOSED':
        return {
          label: 'Closed',
          styles: 'bg-zinc-100 text-zinc-600 border-zinc-200',
          dot: 'bg-zinc-400',
        };
      default:
        return {
          label: st.replace('_', ' '),
          styles: 'bg-slate-100 text-slate-700 border-slate-200',
          dot: 'bg-slate-400',
        };
    }
  };

  const config = getBadgeConfig(status);

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1.5',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${config.styles} ${sizeClasses[size]} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
};
