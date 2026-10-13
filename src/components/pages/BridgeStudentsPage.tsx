import React, { useState, useEffect } from 'react';
import { GitMerge, Download, Search, Info, ExternalLink, ArrowRight, Network } from 'lucide-react';
import { useNetwork } from '../../context/NetworkContext';
import { Student } from '../../types';
import { StudentBadge } from '../common/StudentBadge';
import { fetchApi } from '../../utils/api';

export const BridgeStudentsPage: React.FC = () => {
  const { fetchStudentDetail, setActiveTab } = useNetwork();
  const [bridges, setBridges] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [page, setPage] = useState<number>(1);
  const pageSize = 20;

  useEffect(() => {
    fetchApi('/api/bridges?limit=100')
      .then((data) => {
        setBridges(data.students || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = React.useMemo(() => {
    return bridges.filter((s) => {
      const matchSearch =
        s.student_name.toLowerCase().includes(search.toLowerCase()) ||
        s.registration_number.toLowerCase().includes(search.toLowerCase());
      const matchDept = selectedDept === 'all' || s.department === selectedDept;
      return matchSearch && matchDept;
    });
  }, [bridges, search, selectedDept]);

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-400 font-semibold text-xs mb-2">
            <GitMerge className="w-3.5 h-3.5" />
            <span>Betweenness Centrality & Boundary Spanning</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Bridge Students Detection
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Bridge students lie on shortest paths connecting otherwise separate network clusters. A student may have a modest number of direct friends while maintaining a high structural bridge score because their friendships connect across different communities and departments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/api/export/bridges"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </a>
        </div>
      </div>

      {/* Conceptual Explanation Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="p-4 rounded-xl bg-purple-50/60 dark:bg-purple-950/20 border border-purple-200/60 dark:border-purple-900/40 space-y-1">
          <div className="font-bold text-purple-900 dark:text-purple-300">Shortest-Path Bottlenecks</div>
          <p className="text-purple-700 dark:text-purple-400/80 leading-relaxed">
            Betweenness measures the fraction of all shortest paths passing through a given student node.
          </p>
        </div>
        <div className="p-4 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-200/60 dark:border-indigo-900/40 space-y-1">
          <div className="font-bold text-indigo-900 dark:text-indigo-300">Cross-Community Links</div>
          <p className="text-indigo-700 dark:text-indigo-400/80 leading-relaxed">
            High-bridge students have friends spanning multiple distinct Louvain communities.
          </p>
        </div>
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-1">
          <div className="font-bold text-slate-900 dark:text-white">Degree vs Bridge Difference</div>
          <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
            Degree is purely local popularity; betweenness is global structural intermediation.
          </p>
        </div>
      </div>

      {/* Table Section */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        
        {/* Search & Filter Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search bridge student..."
              className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
            />
          </div>

          <select
            value={selectedDept}
            onChange={(e) => { setSelectedDept(e.target.value); setPage(1); }}
            className="px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="all">All Departments</option>
            <option value="Cloud Computing">Cloud Computing</option>
            <option value="Cybersecurity">Cybersecurity</option>
            <option value="Data Science">Data Science</option>
            <option value="Big Data Analytics">Big Data Analytics</option>
            <option value="CSE Core">CSE Core</option>
            <option value="AI/ML">AI/ML</option>
            <option value="Computer Networking">Computer Networking</option>
          </select>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200/80 dark:border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4 w-12 text-center">Rank</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Reg Number</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Home Community</th>
                <th className="py-3 px-4 text-center">Friends (Degree)</th>
                <th className="py-3 px-4 text-center">Cross-Community Links</th>
                <th className="py-3 px-4 text-right">Betweenness Centrality</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
              {paginated.map((s, idx) => {
                const rankNum = (page - 1) * pageSize + idx + 1;
                return (
                  <tr
                    key={s.registration_number}
                    onClick={() => fetchStudentDetail(s.registration_number)}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors group"
                  >
                    <td className="py-3 px-4 text-center font-bold">
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-md ${
                        rankNum === 1 ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/80 dark:text-purple-400' :
                        rankNum <= 3 ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400' :
                        'text-slate-400'
                      }`}>
                        #{rankNum}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400">
                      {s.student_name}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                      {s.registration_number}
                    </td>
                    <td className="py-3 px-4">
                      <StudentBadge type="department" value={s.department} />
                    </td>
                    <td className="py-3 px-4">
                      <StudentBadge type="community" value={s.community} />
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-slate-900 dark:text-white">
                      {s.degree}
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-purple-600 dark:text-purple-400">
                      {s.cross_community_connections}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-purple-600 dark:text-purple-400">
                      {s.betweenness_centrality.toFixed(5)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800">
          <span>
            Showing {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, filtered.length)} of {filtered.length} bridge students
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 disabled:opacity-40"
            >
              Previous
            </button>
            <span className="px-2 font-medium">Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
