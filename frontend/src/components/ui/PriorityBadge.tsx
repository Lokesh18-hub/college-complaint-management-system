import React from 'react';
import { Flame, AlertOctagon, Clock, ArrowDown } from 'lucide-react';
import { Priority } from '../../types';

interface PriorityBadgeProps {
  priority: Priority | string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, size = 'md', className = '' }) => {
  const getConfig = (pr: string) => {
    switch (pr) {
      case 'LOW':
        return {
          label: 'Low',
          styles: 'bg-slate-100/90 text-slate-600 border-slate-200/80',
          icon: <ArrowDown className="w-3 h-3 text-slate-400" />,
        };
      case 'MEDIUM':
        return {
          label: 'Medium',
          styles: 'bg-blue-50 text-blue-700 border-blue-200/90',
          icon: <Clock className="w-3 h-3 text-blue-500" />,
        };
      case 'HIGH':
        return {
          label: 'High',
          styles: 'bg-amber-50 text-amber-800 border-amber-200/90 font-semibold',
          icon: <Flame className="w-3 h-3 text-amber-600" />,
        };
      case 'CRITICAL':
        return {
          label: 'Critical',
          styles: 'bg-rose-50 text-rose-700 border-rose-200 font-bold',
          icon: (
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
            </span>
          ),
        };
      default:
        return {
          label: pr,
          styles: 'bg-slate-100 text-slate-700 border-slate-200',
          icon: null,
        };
    }
  };

  const config = getConfig(priority);

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-0.5 gap-1.5',
    lg: 'text-sm px-3 py-1 gap-2',
  };

  return (
    <span
      className={`inline-flex items-center rounded-lg border font-medium ${config.styles} ${sizeClasses[size]} ${className}`}
    >
      {config.icon}
      <span>{config.label}</span>
    </span>
  );
};
