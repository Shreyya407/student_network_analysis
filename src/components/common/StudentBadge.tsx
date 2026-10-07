import React from 'react';
import { ROLE_STYLES, DEPARTMENT_COLORS } from '../../utils/formatting';

interface RoleBadgeProps {
  role: string;
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({ role }) => {
  const style = ROLE_STYLES[role] || { bg: 'bg-slate-50 dark:bg-slate-800', text: 'text-slate-600 dark:text-slate-300', border: 'border-slate-200 dark:border-slate-700' };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold border ${style.bg} ${style.text} ${style.border}`}>
      {role}
    </span>
  );
};

interface DepartmentBadgeProps {
  department: string;
}

export const DepartmentBadge: React.FC<DepartmentBadgeProps> = ({ department }) => {
  const color = DEPARTMENT_COLORS[department] || '#64748B';

  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-200 font-medium">
      <span className="w-2.5 h-2.5 rounded-full shrink-0 shadow-2xs" style={{ backgroundColor: color }}></span>
      <span className="truncate">{department}</span>
    </span>
  );
};
