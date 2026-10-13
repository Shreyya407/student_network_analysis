import React from 'react';
import { ConnectivityCategory, NetworkPosition } from '../../types';

interface BadgeProps {
  type: 'department' | 'community' | 'connectivity' | 'position';
  value: string;
  size?: 'sm' | 'md';
}

export const StudentBadge: React.FC<BadgeProps> = ({ type, value, size = 'sm' }) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  if (type === 'connectivity') {
    switch (value as ConnectivityCategory) {
      case 'Completely Isolated':
        return (
          <span className={`inline-flex items-center gap-1 font-semibold rounded-lg bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60 ${sizeClasses}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            Completely Isolated
          </span>
        );
      case 'Low Connectivity':
        return (
          <span className={`inline-flex items-center gap-1 font-semibold rounded-lg bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400 border border-amber-200 dark:border-amber-900/60 ${sizeClasses}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Low (1-2)
          </span>
        );
      case 'Moderately Connected':
        return (
          <span className={`inline-flex items-center gap-1 font-semibold rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400 border border-blue-200 dark:border-blue-900/60 ${sizeClasses}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            Moderate (3-10)
          </span>
        );
      case 'Highly Connected':
        return (
          <span className={`inline-flex items-center gap-1 font-semibold rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/60 ${sizeClasses}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            High (&gt;10)
          </span>
        );
      default:
        return <span className={`inline-flex rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 ${sizeClasses}`}>{value}</span>;
    }
  }

  if (type === 'position') {
    switch (value as NetworkPosition) {
      case 'Influential':
        return (
          <span className={`inline-flex items-center gap-1 font-semibold rounded-lg bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 ${sizeClasses}`}>
            ★ Influential
          </span>
        );
      case 'Bridge':
        return (
          <span className={`inline-flex items-center gap-1 font-semibold rounded-lg bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border border-purple-200 dark:border-purple-800 ${sizeClasses}`}>
            ☍ Bridge
          </span>
        );
      case 'Isolated':
        return (
          <span className={`inline-flex items-center gap-1 font-semibold rounded-lg bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400 border border-rose-200 dark:border-rose-800 ${sizeClasses}`}>
            Isolated
          </span>
        );
      default:
        return (
          <span className={`inline-flex items-center font-medium rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 ${sizeClasses}`}>
            Regular
          </span>
        );
    }
  }

  if (type === 'community') {
    const commColors: Record<string, string> = {
      'Community 1': 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400 border-indigo-200 dark:border-indigo-900/50',
      'Community 2': 'bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-400 border-teal-200 dark:border-teal-900/50',
      'Community 3': 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200 dark:border-amber-900/50',
      'Community 4': 'bg-pink-50 text-pink-700 dark:bg-pink-950/40 dark:text-pink-400 border-pink-200 dark:border-pink-900/50',
    };
    const cClass = commColors[value] || 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700';
    return (
      <span className={`inline-flex items-center font-semibold rounded-lg border ${cClass} ${sizeClasses}`}>
        {value}
      </span>
    );
  }

  // Department Badge
  return (
    <span className={`inline-flex items-center font-semibold rounded-lg bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700/80 ${sizeClasses}`}>
      {value}
    </span>
  );
};
