import React, { useState, useEffect } from 'react';
import { Trophy, Search, Download, Filter, HelpCircle, ArrowUpDown, ExternalLink } from 'lucide-react';
import { useNetwork } from '../../context/NetworkContext';
import { Student } from '../../types';
import { StudentBadge } from '../common/StudentBadge';

export const InfluentialStudentsPage: React.FC = () => {
  const { fetchStudentDetail } = useNetwork();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [rankingMetric, setRankingMetric] = useState<'pagerank' | 'degree_centrality' | 'betweenness_centrality' | 'closeness_centrality'>('pagerank');
  const [search, setSearch] = useState<string>('');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [selectedComm, setSelectedComm] = useState<string>('all');
  const [page, setPage] = useState<number>(1);
  const pageSize = 20;

  useEffect(() => {
    fetch('/api/students?page=1&page_size=200')
      .then((res) => res.json())
      .then((data) => {
        setStudents(data.items || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // Filter and sort students
  const filteredAndSorted = React.useMemo(() => {
    let list = [...students];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (s) =>
          s.student_name.toLowerCase().includes(q) ||
          s.registration_number.toLowerCase().includes(q)
      );
    }

    if (selectedDept !== 'all') {
      list = list.filter((s) => s.department === selectedDept);
    }

    if (selectedComm !== 'all') {
      list = list.filter((s) => s.community === selectedComm);
    }

    list.sort((a, b) => {
      const valA = (a as any)[rankingMetric] || 0;
      const valB = (b as any)[rankingMetric] || 0;
      return valB - valA;
    });

    return list;
  }, [students, search, selectedDept, selectedComm, rankingMetric]);

  const totalPages = Math.ceil(filteredAndSorted.length / pageSize) || 1;
  const paginatedStudents = filteredAndSorted.slice((page - 1) * pageSize, page * pageSize);

  const getMetricLabel = (m: string) => {
    switch (m) {
      case 'pagerank': return 'PageRank';
      case 'degree_centrality': return 'Degree Centrality';
      case 'betweenness_centrality': return 'Betweenness Centrality';
      case 'closeness_centrality': return 'Closeness Centrality';
      default: return m;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 font-semibold text-xs mb-2">
            <Trophy className="w-3.5 h-3.5" />
            <span>Structural Centrality Rankings</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Influential Students Roster
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Identifies students with high structural prominence in the recorded friendship network. Ranking does not judge real-world leadership or personal popularity; it calculates centrality positions mathematically.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/api/export/influential"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </a>
        </div>
      </div>

      {/* Filter and Ranking Selector Controls */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        
        {/* Metric Selector Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80">
          <button
            onClick={() => { setRankingMetric('pagerank'); setPage(1); }}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              rankingMetric === 'pagerank'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Rank by PageRank
          </button>
          <button
            onClick={() => { setRankingMetric('degree_centrality'); setPage(1); }}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              rankingMetric === 'degree_centrality'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Degree Centrality
          </button>
          <button
            onClick={() => { setRankingMetric('betweenness_centrality'); setPage(1); }}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              rankingMetric === 'betweenness_centrality'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Betweenness
          </button>
          <button
            onClick={() => { setRankingMetric('closeness_centrality'); setPage(1); }}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              rankingMetric === 'closeness_centrality'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Closeness
          </button>
        </div>

        {/* Right Search & Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Filter names/IDs..."
              className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <select
            value={selectedDept}
            onChange={(e) => { setSelectedDept(e.target.value); setPage(1); }}
            className="px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none"
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

          <select
            value={selectedComm}
            onChange={(e) => { setSelectedComm(e.target.value); setPage(1); }}
            className="px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="all">All Communities</option>
            <option value="Community 1">Community 1</option>
            <option value="Community 2">Community 2</option>
            <option value="Community 3">Community 3</option>
            <option value="Community 4">Community 4</option>
          </select>
        </div>

      </div>

      {/* Rankings Table */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        
        <div className="overflow-x-auto rounded-xl border border-slate-200/80 dark:border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4 w-12 text-center">Rank</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Reg Number</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Community</th>
                <th className="py-3 px-4 text-center">Friends (Degree)</th>
                <th className="py-3 px-4 text-right">Degree Centrality</th>
                <th className="py-3 px-4 text-right">PageRank</th>
                <th className="py-3 px-4 text-right">Betweenness</th>
                <th className="py-3 px-4 text-right">Closeness</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
              {paginatedStudents.map((s, idx) => {
                const rankNum = (page - 1) * pageSize + idx + 1;
                return (
                  <tr
                    key={s.registration_number}
                    onClick={() => fetchStudentDetail(s.registration_number)}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors group"
                  >
                    <td className="py-3 px-4 text-center font-bold">
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-md ${
                        rankNum === 1 ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-400' :
                        rankNum <= 3 ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400' :
                        'text-slate-400'
                      }`}>
                        #{rankNum}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
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
                    <td className={`py-3 px-4 text-right font-mono ${rankingMetric === 'degree_centrality' ? 'font-bold text-indigo-600 dark:text-cyan-400' : 'text-slate-500'}`}>
                      {s.degree_centrality.toFixed(5)}
                    </td>
                    <td className={`py-3 px-4 text-right font-mono ${rankingMetric === 'pagerank' ? 'font-bold text-indigo-600 dark:text-cyan-400' : 'text-slate-500'}`}>
                      {s.pagerank.toFixed(5)}
                    </td>
                    <td className={`py-3 px-4 text-right font-mono ${rankingMetric === 'betweenness_centrality' ? 'font-bold text-purple-600 dark:text-purple-400' : 'text-slate-500'}`}>
                      {s.betweenness_centrality.toFixed(5)}
                    </td>
                    <td className={`py-3 px-4 text-right font-mono ${rankingMetric === 'closeness_centrality' ? 'font-bold text-indigo-600 dark:text-cyan-400' : 'text-slate-500'}`}>
                      {s.closeness_centrality.toFixed(4)}
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
            Showing {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, filteredAndSorted.length)} of {filteredAndSorted.length} students
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
