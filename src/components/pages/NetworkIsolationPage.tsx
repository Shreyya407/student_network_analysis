import React from 'react';
import { useNetwork } from '../../context/NetworkContext';
import { DepartmentBadge } from '../common/StudentBadge';
import { UserX, BarChart2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export const NetworkIsolationPage: React.FC = () => {
  const { data, setSelectedStudent } = useNetwork();

  if (!data) return null;

  const { isolated_students, low_connected_students, students } = data;

  // Build degree distribution histogram
  const degreeCounts: Record<number, number> = {};
  students.forEach(s => {
    degreeCounts[s.degree] = (degreeCounts[s.degree] || 0) + 1;
  });

  const chartData = Object.entries(degreeCounts)
    .map(([deg, count]) => ({ degree: Number(deg), count }))
    .sort((a, b) => a.degree - b.degree)
    .slice(0, 20);

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Network Isolation</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Students with few or no recorded connections in the observed network.</p>
      </div>

      {/* Main KPI Card */}
      <div className="bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-900/50 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-rose-800 dark:text-rose-400 font-semibold text-xs uppercase tracking-wider">
            <UserX className="w-4 h-4 text-rose-600 dark:text-rose-400" />
            <span>STRUCTURALLY ISOLATED NODES</span>
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold font-mono text-rose-900 dark:text-rose-300 mt-1">
            {isolated_students.length}
          </div>
          <p className="text-xs text-rose-700 dark:text-rose-400 mt-1">
            These students have zero recorded connections in the synthetic network (Degree = 0).
          </p>
        </div>
        <div className="p-3.5 bg-white/90 dark:bg-[#111726]/90 rounded-xl border border-rose-200 dark:border-rose-900/60 text-xs text-rose-900 dark:text-rose-300 max-w-sm shadow-2xs">
          <span className="font-semibold block mb-0.5 text-rose-800 dark:text-rose-400">Non-Clinical Definition</span>
          Network isolation is a graph-theoretic property indicating an absence of recorded interactions in this dataset. It does not imply social or psychological isolation.
        </div>
      </div>

      {/* Structurally Isolated Nodes Table (Degree 0) */}
      <div className="bg-white dark:bg-[#111726] border border-slate-200/90 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Structurally Isolated Students (Degree = 0)</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Nodes with no recorded interactions across all 4 cohorts</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-0.5 bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 rounded-full border border-rose-200 dark:border-rose-800 font-mono">
            {isolated_students.length} Isolated Nodes
          </span>
        </div>

        <div className="overflow-x-auto max-h-96 overflow-y-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="sticky top-0 bg-slate-50 dark:bg-[#161f33] shadow-sm">
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Registration Number</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Academic Year</th>
                <th className="py-3 px-4 text-center">Degree</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
              {isolated_students.map((s) => (
                <tr 
                  key={s.registration_number}
                  onClick={() => setSelectedStudent(s)}
                  className="hover:bg-rose-50/30 dark:hover:bg-rose-950/20 transition-colors cursor-pointer"
                >
                  <td className="py-2.5 px-4 font-semibold text-rose-700 dark:text-rose-400">
                    {s.registration_number}
                  </td>
                  <td className="py-2.5 px-4 font-sans">
                    <DepartmentBadge department={s.department} />
                  </td>
                  <td className="py-2.5 px-4 font-sans text-slate-600 dark:text-slate-300 font-medium">
                    {s.year}
                  </td>
                  <td className="py-2.5 px-4 text-center font-bold text-rose-600 dark:text-rose-400">
                    0
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grid: Low Connections Table + Connection Count Histogram */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Low Connections (Degree 1-2) */}
        <div className="bg-white dark:bg-[#111726] border border-slate-200/90 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Low Connections (Degree 1–2)</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Peripheral nodes with single or dual links</p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 rounded-md font-mono border border-amber-200 dark:border-amber-800">
              {low_connected_students.length} Students
            </span>
          </div>

          <div className="overflow-y-auto max-h-72">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="sticky top-0 bg-slate-50 dark:bg-[#161f33] shadow-sm">
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-2.5 px-4">Registration Number</th>
                  <th className="py-2.5 px-4">Department</th>
                  <th className="py-2.5 px-4">Academic Year</th>
                  <th className="py-2.5 px-4 text-right">Degree</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                {low_connected_students.map((s) => (
                  <tr 
                    key={s.registration_number}
                    onClick={() => setSelectedStudent(s)}
                    className="hover:bg-amber-50/30 dark:hover:bg-amber-950/20 transition-colors cursor-pointer"
                  >
                    <td className="py-2 px-4 font-semibold text-rose-600 dark:text-rose-400">
                      {s.registration_number}
                    </td>
                    <td className="py-2 px-4 font-sans">
                      <DepartmentBadge department={s.department} />
                    </td>
                    <td className="py-2 px-4 font-sans text-slate-600 dark:text-slate-300">
                      {s.year}
                    </td>
                    <td className="py-2 px-4 text-right font-semibold text-amber-700 dark:text-amber-400">
                      {s.degree}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Histogram of Connection Counts */}
        <div className="bg-white dark:bg-[#111726] border border-slate-200/90 dark:border-slate-800 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              <span>Students by Connection Count</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Frequency distribution of observed node degrees (Degree 0 = {isolated_students.length})</p>
          </div>

          <div className="h-56 w-full mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="degree" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip
                  formatter={(val: any) => [val, 'Students']}
                  labelFormatter={(deg) => `Degree = ${deg}`}
                  contentStyle={{ backgroundColor: '#0F172A', color: '#FFF', borderRadius: '8px', fontSize: '12px', border: 'none' }}
                />
                <Bar dataKey="count" fill="#E11D48" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
