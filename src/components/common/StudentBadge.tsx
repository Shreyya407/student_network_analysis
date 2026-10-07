import React from 'react';
import { ROLE_STYLES, DEPARTMENT_COLORS } from '../../utils/formatting';

interface RoleBadgeProps {
  role: string;
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({ role }) => {
  const style = ROLE_STYLES[role] || { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200' };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border ${style.bg} ${style.text} ${style.border}`}>
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
    <span className="inline-flex items-center gap-1.5 text-xs text-slate-700 font-medium">
      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }}></span>
      <span>{department}</span>
    </span>
  );
};
