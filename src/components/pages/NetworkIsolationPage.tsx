import React from 'react';
import { useNetwork } from '../../context/NetworkContext';
import { DepartmentBadge } from '../common/StudentBadge';
import { UserX, BarChart2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export const NetworkIsolationPage: React.FC = () => {
  const { data, setSelectedStudent } = useNetwork();

  if (!data) return null;

  const { isolated_students, low_connected_students, students, metadata } = data;

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
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Network Isolation</h1>
        <p className="text-xs text-slate-500 mt-0.5">Students with few or no recorded connections in the observed network.</p>
      </div>

      {/* Main KPI Card */}
      <div className="bg-rose-50/70 border border-rose-200/80 rounded-xl p-5 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 text-rose-800 font-semibold text-xs uppercase tracking-wider">
            <UserX className="w-4 h-4 text-rose-600" />
            <span>STRUCTURALLY ISOLATED NODES</span>
          </div>
          <div className="text-3xl font-extrabold font-mono text-rose-900 mt-1">
            {isolated_students.length}
          </div>
          <p className="text-xs text-rose-700 mt-1">
            These students have zero recorded connections in the synthetic network.
          </p>
        </div>
        <div className="p-3 bg-white/80 rounded-lg border border-rose-200 text-xs text-rose-800 max-w-sm">
          <span className="font-semibold block mb-0.5">Non-Clinical Definition</span>
          Network isolation is a graph-theoretic property indicating an absence of recorded interactions in this dataset. It does not imply social or psychological isolation.
        </div>
      </div>

      {/* Structurally Isolated Nodes Table (Degree 0) */}
      <div className="bg-white border border-slate-200/90 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Structurally Isolated Students (Degree = 0)</h3>
            <p className="text-xs text-slate-500">Nodes with no recorded interactions across all 4 cohorts</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-0.5 bg-rose-100 text-rose-700 rounded-full border border-rose-200 font-mono">
            {isolated_students.length} Isolated Nodes
          </span>
        </div>

        <div className="overflow-x-auto max-h-96 overflow-y-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="sticky top-0 bg-slate-50">
              <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Registration Number</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Academic Year</th>
                <th className="py-3 px-4 text-center">Degree</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {isolated_students.map((s) => (
                <tr 
                  key={s.registration_number}
                  onClick={() => setSelectedStudent(s)}
                  className="hover:bg-rose-50/30 transition-colors cursor-pointer"
                >
                  <td className="py-2.5 px-4 font-semibold text-rose-700">
                    {s.registration_number}
                  </td>
                  <td className="py-2.5 px-4 font-sans">
                    <DepartmentBadge department={s.department} />
                  </td>
                  <td className="py-2.5 px-4 font-sans text-slate-600 font-medium">
                    {s.year}
                  </td>
                  <td className="py-2.5 px-4 text-center font-bold text-rose-600">
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
        <div className="bg-white border border-slate-200/90 rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Low Connections (Degree 1–2)</h3>
              <p className="text-xs text-slate-500">Peripheral nodes with single or dual links</p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 bg-amber-100 text-amber-700 rounded-md font-mono">
              {low_connected_students.length} Students
            </span>
          </div>

          <div className="overflow-y-auto max-h-72">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="sticky top-0 bg-slate-50">
                <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-2.5 px-4 bg-slate-50">Registration Number</th>
                  <th className="py-2.5 px-4 bg-slate-50">Department</th>
                  <th className="py-2.5 px-4 bg-slate-50">Academic Year</th>
                  <th className="py-2.5 px-4 bg-slate-50 text-right">Degree</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {low_connected_students.map((s) => (
                  <tr 
                    key={s.registration_number}
                    onClick={() => setSelectedStudent(s)}
                    className="hover:bg-amber-50/30 transition-colors cursor-pointer"
                  >
                    <td className="py-2 px-4 font-semibold text-blue-600">
                      {s.registration_number}
                    </td>
                    <td className="py-2 px-4 font-sans">
                      <DepartmentBadge department={s.department} />
                    </td>
                    <td className="py-2 px-4 font-sans text-slate-600">
                      {s.year}
                    </td>
                    <td className="py-2 px-4 text-right font-semibold text-amber-700">
                      {s.degree}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Histogram of Connection Counts */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-blue-600" />
              <span>Students by Connection Count</span>
            </h3>
            <p className="text-xs text-slate-500">Frequency distribution of observed node degrees (Degree 0 = {isolated_students.length})</p>
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
                <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
