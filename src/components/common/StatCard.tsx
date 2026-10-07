import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: React.ReactNode;
  highlight?: 'default' | 'danger' | 'success' | 'warning';
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subtext,
  icon,
  highlight = 'default'
}) => {
  const valueColor = {
    default: 'text-slate-900 dark:text-white',
    danger: 'text-rose-600 dark:text-rose-400',
    success: 'text-emerald-600 dark:text-emerald-400',
    warning: 'text-amber-600 dark:text-amber-400'
  }[highlight];

  return (
    <div className="bg-white dark:bg-[#131B2A] border border-slate-200/90 dark:border-slate-800/90 rounded-2xl p-4.5 shadow-sm hover:border-rose-300 dark:hover:border-rose-900/60 hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
      <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
          {label}
        </span>
        {icon && <span className="text-slate-400 dark:text-slate-500 group-hover:text-rose-500 transition-colors">{icon}</span>}
      </div>
      <div>
        <div className={`text-2xl lg:text-3xl font-extrabold tracking-tight font-mono ${valueColor}`}>
          {value}
        </div>
        {subtext && (
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium">{subtext}</p>
        )}
      </div>
    </div>
  );
};
