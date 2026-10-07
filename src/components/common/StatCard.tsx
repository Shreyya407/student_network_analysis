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
    default: 'text-slate-900',
    danger: 'text-rose-600',
    success: 'text-emerald-600',
    warning: 'text-amber-600'
  }[highlight];

  return (
    <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between">
      <div className="flex items-center justify-between text-slate-500 mb-1.5">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</span>
        {icon && <span className="text-slate-400">{icon}</span>}
      </div>
      <div>
        <div className={`text-2xl font-extrabold tracking-tight ${valueColor}`}>
          {value}
        </div>
        {subtext && (
          <p className="text-[11px] text-slate-500 mt-0.5 font-medium">{subtext}</p>
        )}
      </div>
    </div>
  );
};
