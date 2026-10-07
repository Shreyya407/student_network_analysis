import React from 'react';
import { useNetwork } from '../../context/NetworkContext';
import { DepartmentBadge } from '../common/StudentBadge';
import { DEPARTMENT_COLORS, formatNumber } from '../../utils/formatting';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Building2, Grid, Activity } from 'lucide-react';

export const DepartmentsPage: React.FC = () => {
  const { data } = useNetwork();

  if (!data) return null;

  const { department_stats, department_matrix } = data;
  const deptNames = department_stats.map(d => d.department);

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Department Network</h1>
        <p className="text-xs text-slate-500 mt-0.5">Compare interaction patterns across School of Computing programs.</p>
      </div>

      {/* Clean Department Summary Table */}
      <div className="bg-white border border-slate-200/90 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Program Breakdown</h3>
            <p className="text-xs text-slate-500">Overview of 7 Computing Departments</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4 text-center">Students</th>
                <th className="py-3 px-4 text-right">Avg Degree</th>
                <th className="py-3 px-4 text-right">Avg Influence</th>
                <th className="py-3 px-4 text-right">Interaction Volume</th>
                <th className="py-3 px-4 text-center">Isolated Nodes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {department_stats.map((d) => (
                <tr key={d.department} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4">
                    <DepartmentBadge department={d.department} />
                  </td>
                  <td className="py-3 px-4 text-center font-semibold text-slate-700">
                    {d.students_count}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-slate-800">
                    {d.average_degree.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-semibold text-blue-700">
                    {d.average_influence.toFixed(3)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-slate-700">
                    {formatNumber(d.interaction_volume)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {d.isolated_count > 0 ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                        {d.isolated_count}
                      </span>
                    ) : (
                      <span className="text-slate-400">0</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Department x Year Balance Matrix Table */}
      <div className="bg-white border border-slate-200/90 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-600" />
              <span>Department Cohort Distribution (Academic Year Matrix)</span>
            </h3>
            <p className="text-xs text-slate-500">Student count distribution across all 4 academic cohorts (All 28 groups &ge; 22 students)</p>
          </div>
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            ✓ All Groups &ge; 22 Students
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4 text-center">1st Year (RA26)</th>
                <th className="py-3 px-4 text-center">2nd Year (RA25)</th>
                <th className="py-3 px-4 text-center">3rd Year (RA24)</th>
                <th className="py-3 px-4 text-center">4th Year (RA23)</th>
                <th className="py-3 px-4 text-center font-bold text-slate-800">Total Students</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {(data.dept_year_matrix || []).map((row) => (
                <tr key={row.department} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4 font-sans font-medium text-slate-900">
                    <DepartmentBadge department={row.department} />
                  </td>
                  <td className="py-3 px-4 text-center text-slate-700">
                    <span className="px-2.5 py-0.5 rounded bg-slate-100 text-slate-800 font-semibold">
                      {row.first_year}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center text-slate-700">
                    <span className="px-2.5 py-0.5 rounded bg-slate-100 text-slate-800 font-semibold">
                      {row.second_year}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center text-slate-700">
                    <span className="px-2.5 py-0.5 rounded bg-slate-100 text-slate-800 font-semibold">
                      {row.third_year}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center text-slate-700">
                    <span className="px-2.5 py-0.5 rounded bg-slate-100 text-slate-800 font-semibold">
                      {row.fourth_year}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center font-bold text-blue-700">
                    <span className="px-2.5 py-0.5 rounded bg-blue-50 text-blue-700 font-bold border border-blue-100">
                      {row.total}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-slate-200 bg-slate-50 font-bold text-slate-900 text-xs">
                <td className="py-3 px-4">Total School of Computing</td>
                <td className="py-3 px-4 text-center font-mono">
                  {(data.dept_year_matrix || []).reduce((acc, r) => acc + r.first_year, 0)}
                </td>
                <td className="py-3 px-4 text-center font-mono">
                  {(data.dept_year_matrix || []).reduce((acc, r) => acc + r.second_year, 0)}
                </td>
                <td className="py-3 px-4 text-center font-mono">
                  {(data.dept_year_matrix || []).reduce((acc, r) => acc + r.third_year, 0)}
                </td>
                <td className="py-3 px-4 text-center font-mono">
                  {(data.dept_year_matrix || []).reduce((acc, r) => acc + r.fourth_year, 0)}
                </td>
                <td className="py-3 px-4 text-center text-blue-700 font-mono text-sm">
                  {(data.dept_year_matrix || []).reduce((acc, r) => acc + r.total, 0)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Grid: 2 Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Chart 1: Interaction Volume */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Interaction Volume by Department</h3>
              <p className="text-xs text-slate-500">Cumulative interaction counts per program</p>
            </div>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={department_stats} margin={{ top: 10, right: 10, left: -10, bottom: 25 }}>
                <XAxis 
                  dataKey="department" 
                  tick={{ fontSize: 10, fill: '#64748B' }} 
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip
                  formatter={(val: any) => [formatNumber(Number(val)), 'Interactions']}
                  contentStyle={{ backgroundColor: '#0F172A', color: '#FFF', borderRadius: '8px', fontSize: '12px', border: 'none' }}
                />
                <Bar dataKey="interaction_volume" radius={[4, 4, 0, 0]}>
                  {department_stats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={DEPARTMENT_COLORS[entry.department] || '#2563EB'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Average Influence */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Average Influence by Department</h3>
              <p className="text-xs text-slate-500">Mean composite score across cohort programs</p>
            </div>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={department_stats} margin={{ top: 10, right: 10, left: -10, bottom: 25 }}>
                <XAxis 
                  dataKey="department" 
                  tick={{ fontSize: 10, fill: '#64748B' }} 
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis domain={[0, 1]} tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip
                  formatter={(val: any) => [Number(val).toFixed(3), 'Avg Influence']}
                  contentStyle={{ backgroundColor: '#0F172A', color: '#FFF', borderRadius: '8px', fontSize: '12px', border: 'none' }}
                />
                <Bar dataKey="average_influence" fill="#7C3AED" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* IMPORTANT: Department Interaction Matrix */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Grid className="w-4 h-4 text-blue-600" />
              <span>Department Interaction Matrix</span>
            </h3>
            <p className="text-xs text-slate-500">Inter-program peer interaction frequency heatmap</p>
          </div>
          <span className="text-xs text-slate-400 font-medium">7 × 7 Matrix (Interaction Weights)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-center text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80">
                <th className="py-2.5 px-3 text-left font-semibold text-slate-600">Department</th>
                {deptNames.map(name => (
                  <th key={name} className="py-2.5 px-2 font-semibold text-slate-600 text-[11px] whitespace-nowrap">
                    {name.split(' ')[0]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {deptNames.map(rowDept => (
                <tr key={rowDept} className="hover:bg-slate-50/40">
                  <td className="py-2.5 px-3 text-left font-sans font-medium text-slate-800 whitespace-nowrap">
                    {rowDept}
                  </td>
                  {deptNames.map(colDept => {
                    const count = department_matrix[rowDept]?.[colDept] || 0;
                    const isDiag = rowDept === colDept;
                    return (
                      <td 
                        key={colDept} 
                        className={`py-2 px-2 text-[11px] ${
                          isDiag 
                            ? 'bg-blue-50 font-bold text-blue-800' 
                            : count > 300 ? 'bg-indigo-50/70 font-semibold text-indigo-700' : 'text-slate-600'
                        }`}
                      >
                        {count}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
