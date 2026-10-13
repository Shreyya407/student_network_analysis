import React, { useState, useEffect } from 'react';
import { Building2, Download, TrendingUp, Users, ArrowRight, Share2, Layers } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell
} from 'recharts';
import { useNetwork } from '../../context/NetworkContext';
import { DepartmentData } from '../../types';
import { fetchApi } from '../../utils/api';

export const DepartmentsPage: React.FC = () => {
  const [departments, setDepartments] = useState<DepartmentData[]>([]);
  const [matrix, setMatrix] = useState<Record<string, Record<string, number>>>({});
  const [selectedDeptName, setSelectedDeptName] = useState<string>('Cloud Computing');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchApi('/api/departments')
      .then((data) => {
        setDepartments(data.departments || []);
        setMatrix(data.matrix || {});
        if (data.departments && data.departments.length > 0) {
          setSelectedDeptName(data.departments[0].department);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const activeDept = departments.find((d) => d.department === selectedDeptName) || departments[0];

  const deptList = Object.keys(matrix);

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-cyan-50 dark:bg-cyan-950/50 text-cyan-700 dark:text-cyan-400 font-semibold text-xs mb-2">
            <Building2 className="w-3.5 h-3.5" />
            <span>7 Departments • Exactly 90 Students Each</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Academic Department Analytics
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Comparative analysis of student connectivity within and across all 7 computing departments. Edges are treated as undirected friendships to avoid double-counting.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/api/export/departments"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </a>
        </div>
      </div>

      {/* 7 Department Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {departments.map((d) => {
          const isSelected = d.department === selectedDeptName;
          return (
            <div
              key={d.department}
              onClick={() => setSelectedDeptName(d.department)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                isSelected
                  ? 'bg-white dark:bg-[#162032] border-indigo-500 shadow-md ring-2 ring-indigo-500/20'
                  : 'bg-white dark:bg-[#111827] border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-800'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: d.color }} />
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  Avg Deg: {d.average_degree}
                </span>
              </div>

              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white truncate">
                {d.department}
              </h3>
              <div className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                90 <span className="text-xs font-normal text-slate-400">students</span>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-1 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex justify-between">
                  <span>Internal Edges:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{d.internal_edges}</span>
                </div>
                <div className="flex justify-between">
                  <span>External Edges:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{d.external_edges}</span>
                </div>
                <div className="flex justify-between">
                  <span>Isolated:</span>
                  <span className="font-bold text-rose-600 dark:text-rose-400">
                    {d.connectivity_breakdown['Completely Isolated'] || 0}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Internal vs External Friendship Comparison Chart */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Internal vs Cross-Department Friendship Volumes
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Compares friendships strictly inside the department against external connections spanning outside departments
          </p>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={departments} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <XAxis dataKey="department" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', borderRadius: '12px', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="internal_edges" name="Within Department Edges" fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="external_edges" name="Cross-Department Edges" fill="#06b6d4" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Cross-Department Connection Heatmap Matrix */}
      {deptList.length > 0 && (
        <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Cross-Department Friendship Heatmap Matrix
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Exact number of recorded friendship edges between each pair of departments (symmetric undirected connections)
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200/80 dark:border-slate-800">
            <table className="w-full text-center text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 font-semibold text-[10px] uppercase text-slate-600 dark:text-slate-300">
                <tr>
                  <th className="py-3 px-3 text-left">Department</th>
                  {deptList.map((d) => (
                    <th key={d} className="py-3 px-2 truncate max-w-[85px]" title={d}>
                      {d.split(' ')[0]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200 text-xs">
                {deptList.map((d1) => (
                  <tr key={d1} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 text-left font-bold truncate max-w-[130px]" title={d1}>
                      {d1}
                    </td>
                    {deptList.map((d2) => {
                      const count = matrix[d1]?.[d2] || 0;
                      const isDiagonal = d1 === d2;
                      return (
                        <td
                          key={d2}
                          className={`py-2.5 px-2 font-mono font-bold ${
                            isDiagonal
                              ? 'bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400'
                              : count > 140
                              ? 'bg-cyan-50/40 dark:bg-cyan-950/20 text-cyan-600 dark:text-cyan-400'
                              : 'text-slate-600 dark:text-slate-400'
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

          <div className="text-[11px] text-slate-500 dark:text-slate-400 pt-1">
            Note: Diagonal values (highlighted in indigo) represent internal friendships within the same department.
          </div>
        </div>
      )}

      {/* Selected Department Drilldown Card */}
      {activeDept && (
        <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: activeDept.color }} />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {activeDept.department} Metrics Summary
              </h3>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              Registration prefix: <strong className="font-mono text-indigo-600 dark:text-indigo-400">RA23110...</strong>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40">
              <span className="text-slate-400 font-semibold uppercase text-[10px]">Average Degree</span>
              <div className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">{activeDept.average_degree}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40">
              <span className="text-slate-400 font-semibold uppercase text-[10px]">Avg PageRank</span>
              <div className="text-xl font-mono font-bold text-indigo-600 dark:text-cyan-400 mt-0.5">{activeDept.average_pagerank.toFixed(5)}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40">
              <span className="text-slate-400 font-semibold uppercase text-[10px]">Avg Betweenness</span>
              <div className="text-xl font-mono font-bold text-purple-600 dark:text-purple-400 mt-0.5">{activeDept.average_betweenness_centrality.toFixed(5)}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40">
              <span className="text-slate-400 font-semibold uppercase text-[10px]">Cross-Faculty Share</span>
              <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                {activeDept.total_edges > 0 ? ((activeDept.external_edges / activeDept.total_edges) * 100).toFixed(1) : 0}%
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
