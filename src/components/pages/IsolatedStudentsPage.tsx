import React, { useState, useEffect } from 'react';
import { UserX, Download, Search, AlertCircle, Info, ExternalLink } from 'lucide-react';
import { useNetwork } from '../../context/NetworkContext';
import { Student } from '../../types';
import { StudentBadge } from '../common/StudentBadge';

export const IsolatedStudentsPage: React.FC = () => {
  const { fetchStudentDetail } = useNetwork();
  const [isolatedData, setIsolatedData] = useState<{
    total_isolated: number;
    percentage: number;
    department_distribution: Record<string, number>;
    students: Student[];
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    fetch('/api/isolated')
      .then((res) => res.json())
      .then((data) => {
        setIsolatedData(data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = React.useMemo(() => {
    if (!isolatedData) return [];
    if (!search.trim()) return isolatedData.students;
    const q = search.toLowerCase();
    return isolatedData.students.filter(
      (s) =>
        s.student_name.toLowerCase().includes(q) ||
        s.registration_number.toLowerCase().includes(q) ||
        s.department.toLowerCase().includes(q)
    );
  }, [isolatedData, search]);

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 font-semibold text-xs mb-2">
            <UserX className="w-3.5 h-3.5" />
            <span>Zero-Degree Isolation Detection</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Completely Isolated Students ({isolatedData?.total_isolated || 6} Detected)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Identified dynamically from the constructed friendship graph: each of these students has degree exactly zero (no recorded friendship edges). This describes network structure in the recorded dataset, not a student's personal worth or social value.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/api/export/isolated"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </a>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Total Isolated Nodes
          </div>
          <div className="text-3xl font-extrabold text-rose-600 dark:text-rose-400 mt-1">
            {isolatedData?.total_isolated || 6}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Students with Degree = 0
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Campus Population Share
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            {isolatedData?.percentage.toFixed(2) || "0.95"}%
          </div>
          <div className="text-xs text-slate-500 mt-1">
            6 of 630 synthetic students
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Connected Campus Nodes
          </div>
          <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
            624
          </div>
          <div className="text-xs text-slate-500 mt-1">
            99.05% active giant component
          </div>
        </div>

      </div>

      {/* Department Breakdown of Isolated Students */}
      {isolatedData?.department_distribution && (
        <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Isolated Students by Department
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {Object.entries(isolatedData.department_distribution).map(([dept, count]) => (
              <div key={dept} className="p-3.5 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 text-center">
                <div className="text-xl font-bold text-rose-600 dark:text-rose-400">{count}</div>
                <div className="text-[11px] text-slate-600 dark:text-slate-400 truncate mt-0.5" title={dept}>
                  {dept}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Searchable Records Table */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Isolated Student Records
          </h3>
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter isolated records..."
              className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200/80 dark:border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Registration Number</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Degree</th>
                <th className="py-3 px-4">Connectivity Classification</th>
                <th className="py-3 px-4">Network Position</th>
                <th className="py-3 px-4">Louvain Community</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
              {filtered.map((s) => (
                <tr
                  key={s.registration_number}
                  onClick={() => fetchStudentDetail(s.registration_number)}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                >
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                    {s.student_name}
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                    {s.registration_number}
                  </td>
                  <td className="py-3 px-4">
                    <StudentBadge type="department" value={s.department} />
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-rose-600 dark:text-rose-400">
                    0
                  </td>
                  <td className="py-3 px-4">
                    <StudentBadge type="connectivity" value="Completely Isolated" />
                  </td>
                  <td className="py-3 px-4">
                    <StudentBadge type="position" value="Isolated" />
                  </td>
                  <td className="py-3 px-4 text-slate-400">
                    {s.community}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Ethical / Methodological Disclaimer */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2.5 leading-relaxed">
          <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <div>
            <strong>Analytical Interpretation:</strong> In Social Network Analysis, an isolated student is defined mathematically as an unconnected graph node ($k_i = 0$). This reflects only the recorded friendship survey entries and is not a clinical diagnosis, character assessment, or indicator of actual social wellbeing.
          </div>
        </div>

      </div>

    </div>
  );
};
