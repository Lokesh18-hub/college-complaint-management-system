import React from 'react';
import { ArrowUpRight, TrendingUp } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  description?: string;
  trend?: string;
  color?: 'blue' | 'indigo' | 'emerald' | 'amber' | 'rose' | 'slate';
  onClick?: () => void;
  active?: boolean;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  description,
  trend,
  color = 'blue',
  onClick,
  active = false,
}) => {
  const colorMap = {
    blue: {
      iconBg: 'bg-blue-50 text-blue-600 border-blue-100',
      activeRing: 'ring-2 ring-blue-500 border-blue-500',
    },
    indigo: {
      iconBg: 'bg-indigo-50 text-indigo-600 border-indigo-100',
      activeRing: 'ring-2 ring-indigo-500 border-indigo-500',
    },
    emerald: {
      iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      activeRing: 'ring-2 ring-emerald-500 border-emerald-500',
    },
    amber: {
      iconBg: 'bg-amber-50 text-amber-600 border-amber-100',
      activeRing: 'ring-2 ring-amber-500 border-amber-500',
    },
    rose: {
      iconBg: 'bg-rose-50 text-rose-600 border-rose-100',
      activeRing: 'ring-2 ring-rose-500 border-rose-500',
    },
    slate: {
      iconBg: 'bg-slate-100 text-slate-700 border-slate-200',
      activeRing: 'ring-2 ring-slate-500 border-slate-500',
    },
  };

  const scheme = colorMap[color];

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl border p-5 shadow-card interactive-card flex flex-col justify-between relative overflow-hidden group ${
        active ? scheme.activeRing : 'border-slate-200/90 hover:border-slate-300'
      } ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{title}</p>
          <div className="flex items-baseline gap-2">
            <h4 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
              {value}
            </h4>
            {trend && (
              <span className="inline-flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-200">
                <TrendingUp className="w-2.5 h-2.5 mr-0.5" />
                {trend}
              </span>
            )}
          </div>
        </div>
        <div className={`p-2.5 rounded-xl border flex-shrink-0 transition-transform group-hover:scale-105 duration-200 ${scheme.iconBg}`}>
          {icon}
        </div>
      </div>

      {description && (
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
          <span className="truncate">{description}</span>
          {onClick && (
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-600 transition-colors" />
          )}
        </div>
      )}
    </div>
  );
};
