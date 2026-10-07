import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: React.ReactNode;
  color?: 'rose' | 'blue' | 'purple' | 'emerald' | 'amber' | 'indigo';
  highlight?: 'default' | 'danger' | 'success' | 'warning';
  badge?: string;
}

const colorVariants = {
  rose: {
    iconBg: 'bg-rose-50 dark:bg-rose-950/50',
    iconBorder: 'border-rose-200/80 dark:border-rose-900/60',
    iconText: 'text-rose-600 dark:text-rose-400',
    glowHover: 'group-hover:border-rose-400 dark:group-hover:border-rose-600 group-hover:shadow-rose-500/10',
    badge: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800'
  },
  blue: {
    iconBg: 'bg-blue-50 dark:bg-blue-950/50',
    iconBorder: 'border-blue-200/80 dark:border-blue-900/60',
    iconText: 'text-blue-600 dark:text-blue-400',
    glowHover: 'group-hover:border-blue-400 dark:group-hover:border-blue-600 group-hover:shadow-blue-500/10',
    badge: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800'
  },
  purple: {
    iconBg: 'bg-purple-50 dark:bg-purple-950/50',
    iconBorder: 'border-purple-200/80 dark:border-purple-900/60',
    iconText: 'text-purple-600 dark:text-purple-400',
    glowHover: 'group-hover:border-purple-400 dark:group-hover:border-purple-600 group-hover:shadow-purple-500/10',
    badge: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800'
  },
  emerald: {
    iconBg: 'bg-emerald-50 dark:bg-emerald-950/50',
    iconBorder: 'border-emerald-200/80 dark:border-emerald-900/60',
    iconText: 'text-emerald-600 dark:text-emerald-400',
    glowHover: 'group-hover:border-emerald-400 dark:group-hover:border-emerald-600 group-hover:shadow-emerald-500/10',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
  },
  amber: {
    iconBg: 'bg-amber-50 dark:bg-amber-950/50',
    iconBorder: 'border-amber-200/80 dark:border-amber-900/60',
    iconText: 'text-amber-600 dark:text-amber-400',
    glowHover: 'group-hover:border-amber-400 dark:group-hover:border-amber-600 group-hover:shadow-amber-500/10',
    badge: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800'
  },
  indigo: {
    iconBg: 'bg-indigo-50 dark:bg-indigo-950/50',
    iconBorder: 'border-indigo-200/80 dark:border-indigo-900/60',
    iconText: 'text-indigo-600 dark:text-indigo-400',
    glowHover: 'group-hover:border-indigo-400 dark:group-hover:border-indigo-600 group-hover:shadow-indigo-500/10',
    badge: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800'
  }
};

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subtext,
  icon,
  color = 'rose',
  highlight = 'default',
  badge
}) => {
  const v = colorVariants[color] || colorVariants.rose;

  const valueTextColor = {
    default: 'text-slate-900 dark:text-white',
    danger: 'text-rose-600 dark:text-rose-400',
    success: 'text-emerald-600 dark:text-emerald-400',
    warning: 'text-amber-600 dark:text-amber-400'
  }[highlight];

  return (
    <div 
      className={`relative overflow-hidden bg-white dark:bg-[#111726] border border-slate-200/90 dark:border-slate-800/90 rounded-2xl p-4.5 shadow-sm hover:shadow-lg transition-all duration-300 ease-out hover:-translate-y-0.5 group ${v.glowHover}`}
    >
      {/* Subtle top accent bar */}
      <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${v.iconText}`} />

      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors block leading-tight">
            {label}
          </span>
          {badge && (
            <span className={`inline-block mt-1 text-[9.5px] font-bold px-1.5 py-0.2 rounded border ${v.badge}`}>
              {badge}
            </span>
          )}
        </div>

        {icon && (
          <div className={`p-2 rounded-xl border ${v.iconBg} ${v.iconBorder} ${v.iconText} shadow-2xs group-hover:scale-110 transition-transform duration-200 shrink-0`}>
            {icon}
          </div>
        )}
      </div>

      <div className="mt-1">
        <div className={`text-2xl sm:text-3xl font-extrabold tracking-tight font-mono ${valueTextColor} group-hover:scale-[1.02] transition-transform duration-200 origin-left`}>
          {value}
        </div>
        {subtext && (
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 group-hover:bg-rose-500 transition-colors" />
            <span>{subtext}</span>
          </p>
        )}
      </div>
    </div>
  );
};
