import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  accentColor?: string; // e.g. "indigo", "cyan", "emerald", "amber", "rose"
  tooltip?: string;
  trend?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  accentColor = "indigo",
  tooltip,
  trend,
  onClick
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const colorStyles: Record<string, { bg: string; text: string; border: string; glow: string }> = {
    indigo: {
      bg: "bg-indigo-50 dark:bg-indigo-950/40",
      text: "text-indigo-600 dark:text-indigo-400",
      border: "border-indigo-100 dark:border-indigo-900/40",
      glow: "hover:border-indigo-500/40 hover:shadow-glow-indigo"
    },
    cyan: {
      bg: "bg-cyan-50 dark:bg-cyan-950/40",
      text: "text-cyan-600 dark:text-cyan-400",
      border: "border-cyan-100 dark:border-cyan-900/40",
      glow: "hover:border-cyan-500/40 hover:shadow-glow-cyan"
    },
    emerald: {
      bg: "bg-emerald-50 dark:bg-emerald-950/40",
      text: "text-emerald-600 dark:text-emerald-400",
      border: "border-emerald-100 dark:border-emerald-900/40",
      glow: "hover:border-emerald-500/40 hover:shadow-glow-emerald"
    },
    amber: {
      bg: "bg-amber-50 dark:bg-amber-950/40",
      text: "text-amber-600 dark:text-amber-400",
      border: "border-amber-100 dark:border-amber-900/40",
      glow: "hover:border-amber-500/40"
    },
    rose: {
      bg: "bg-rose-50 dark:bg-rose-950/40",
      text: "text-rose-600 dark:text-rose-400",
      border: "border-rose-100 dark:border-rose-900/40",
      glow: "hover:border-rose-500/40"
    },
    purple: {
      bg: "bg-purple-50 dark:bg-purple-950/40",
      text: "text-purple-600 dark:text-purple-400",
      border: "border-purple-100 dark:border-purple-900/40",
      glow: "hover:border-purple-500/40"
    }
  };

  const style = colorStyles[accentColor] || colorStyles.indigo;

  return (
    <div
      onClick={onClick}
      className={`relative p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:-translate-y-1' : ''
      } ${style.glow} shadow-xs group`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {title}
            </span>
            {tooltip && (
              <div className="relative">
                <button
                  type="button"
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                  onClick={(e) => { e.stopPropagation(); setShowTooltip(!showTooltip); }}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                </button>
                {showTooltip && (
                  <div className="absolute left-0 bottom-full mb-2 w-56 p-2.5 rounded-xl bg-slate-900 text-slate-100 text-xs shadow-xl border border-slate-700 z-50 pointer-events-none animate-in fade-in duration-150 leading-relaxed">
                    {tooltip}
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {value}
          </div>
        </div>

        <div className={`p-3 rounded-xl ${style.bg} ${style.text} ${style.border} border shrink-0 transition-transform duration-200 group-hover:scale-110`}>
          {icon}
        </div>
      </div>

      {(subtitle || trend) && (
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span className="truncate">{subtitle}</span>
          {trend && (
            <span className="font-semibold text-indigo-600 dark:text-indigo-400 shrink-0 ml-2">
              {trend}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
