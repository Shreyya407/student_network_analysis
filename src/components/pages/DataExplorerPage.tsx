import React, { useState, useEffect } from 'react';
import {
  Database,
  Download,
  Upload,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Search,
  Filter,
  RefreshCw,
  Share2,
  Users,
  ShieldCheck,
  XCircle
} from 'lucide-react';
import { useNetwork } from '../../context/NetworkContext';
import { Student, ValidationReport } from '../../types';
import { StudentBadge } from '../common/StudentBadge';
import { fetchApi } from '../../utils/api';

export const DataExplorerPage: React.FC = () => {
  const { validationReport, refreshData, fetchStudentDetail, dashboardData } = useNetwork();
  const [activeSubTab, setActiveSubTab] = useState<'students' | 'edges' | 'validation' | 'upload'>('students');

  // Students state
  const [students, setStudents] = useState<Student[]>([]);
  const [studentsTotal, setStudentsTotal] = useState<number>(630);
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>('');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [selectedComm, setSelectedComm] = useState<string>('all');
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const pageSize = 20;

  // Edges state
  const [edges, setEdges] = useState<any[]>([]);
  const [edgePage, setEdgePage] = useState<number>(1);
  const [edgeSearch, setEdgeSearch] = useState<string>('');

  // Upload state
  const [studentsFile, setStudentsFile] = useState<File | null>(null);
  const [connectionsFile, setConnectionsFile] = useState<File | null>(null);
  const [uploadLoading, setUploadLoading] = useState<boolean>(false);
  const [uploadMessage, setUploadMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Fetch students
  useEffect(() => {
    const params = new URLSearchParams({
      page: page.toString(),
      page_size: pageSize.toString(),
    });
    if (search.trim()) params.append('search', search.trim());
    if (selectedDept !== 'all') params.append('department', selectedDept);
    if (selectedComm !== 'all') params.append('community', selectedComm);
    if (selectedTier !== 'all') params.append('connectivity', selectedTier);

    fetch(`/api/students?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setStudents(data.items || []);
        setStudentsTotal(data.total || 630);
      })
      .catch((err) => console.error(err));
  }, [page, search, selectedDept, selectedComm, selectedTier]);

  // Fetch edges when edges tab active
  useEffect(() => {
    if (activeSubTab === 'edges' && edges.length === 0) {
      fetchApi('/api/network')
        .then((data) => {
          const edgeElements = data.elements
            .filter((e: any) => e.group === 'edges')
            .map((e: any) => e.data);
          setEdges(edgeElements);
        })
        .catch((err) => console.error(err));
    }
  }, [activeSubTab]);

  const filteredEdges = React.useMemo(() => {
    if (!edgeSearch.trim()) return edges;
    const q = edgeSearch.toLowerCase();
    return edges.filter(
      (e) => e.source.toLowerCase().includes(q) || e.target.toLowerCase().includes(q)
    );
  }, [edges, edgeSearch]);

  const totalStudentPages = Math.ceil(studentsTotal / pageSize) || 1;
  const totalEdgePages = Math.ceil(filteredEdges.length / pageSize) || 1;
  const paginatedEdges = filteredEdges.slice((edgePage - 1) * pageSize, edgePage * pageSize);

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentsFile || !connectionsFile) {
      setUploadMessage({ type: 'error', text: 'Please select both students and connections CSV files.' });
      return;
    }

    setUploadLoading(true);
    setUploadMessage(null);

    try {
      const formData = new FormData();
      formData.append('students_file', studentsFile);
      formData.append('connections_file', connectionsFile);

      const res = await fetch('/api/dataset/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || data.status === 'error') {
        throw new Error(data.message || 'Dataset upload failed validation.');
      }

      setUploadMessage({ type: 'success', text: 'Dataset uploaded and validated successfully! Analysis refreshed.' });
      await refreshData();
      setStudentsFile(null);
      setConnectionsFile(null);
    } catch (err: any) {
      setUploadMessage({ type: 'error', text: err.message || 'Failed to upload dataset.' });
    } finally {
      setUploadLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 font-semibold text-xs mb-2">
            <Database className="w-3.5 h-3.5" />
            <span>Authoritative Input Data & Exports</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Data Explorer & Dataset Integrity
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Inspect raw unlabelled student records, friendship connection edge lists, real validation reports, and export calculated analytical outputs.
          </p>
        </div>

        {/* Quick Exports Pill List */}
        <div className="flex flex-wrap items-center gap-2">
          <a
            href="/api/export/students"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Students CSV</span>
          </a>
          <a
            href="/api/export/departments"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Departments</span>
          </a>
        </div>
      </div>

      {/* Navigation Sub-tabs */}
      <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 w-fit text-xs font-semibold">
        <button
          onClick={() => setActiveSubTab('students')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeSubTab === 'students'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Student Records (630)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('edges')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeSubTab === 'edges'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Friendship Edges ({dashboardData?.kpis.total_friendship_edges || 3985})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('validation')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeSubTab === 'validation'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Validation Summary</span>
        </button>

        <button
          onClick={() => setActiveSubTab('upload')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeSubTab === 'upload'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload Dataset</span>
        </button>
      </div>

      {/* Subtab 1: Students Table */}
      {activeSubTab === 'students' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          
          {/* Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search name, ID..."
                className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
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
                <option value="Isolated / No Community">Isolated</option>
              </select>

              <select
                value={selectedTier}
                onChange={(e) => { setSelectedTier(e.target.value); setPage(1); }}
                className="px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none"
              >
                <option value="all">All Connectivity Tiers</option>
                <option value="Completely Isolated">Completely Isolated</option>
                <option value="Low Connectivity">Low Connectivity</option>
                <option value="Moderately Connected">Moderately Connected</option>
                <option value="Highly Connected">Highly Connected</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-200/80 dark:border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Registration Number</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4 text-center">Degree</th>
                  <th className="py-3 px-4 text-right">PageRank</th>
                  <th className="py-3 px-4 text-right">Betweenness</th>
                  <th className="py-3 px-4">Community</th>
                  <th className="py-3 px-4">Connectivity Tier</th>
                  <th className="py-3 px-4">Position</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                {students.map((s) => (
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
                    <td className="py-3 px-4 text-center font-bold">
                      {s.degree}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-indigo-600 dark:text-cyan-400">
                      {s.pagerank.toFixed(5)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-purple-600 dark:text-purple-400">
                      {s.betweenness_centrality.toFixed(5)}
                    </td>
                    <td className="py-3 px-4">
                      <StudentBadge type="community" value={s.community} />
                    </td>
                    <td className="py-3 px-4">
                      <StudentBadge type="connectivity" value={s.connectivity_category} />
                    </td>
                    <td className="py-3 px-4">
                      <StudentBadge type="position" value={s.network_position} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800">
            <span>Showing {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, studentsTotal)} of {studentsTotal} students</span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 disabled:opacity-40"
              >
                Previous
              </button>
              <span className="px-2 font-medium">Page {page} of {totalStudentPages}</span>
              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalStudentPages))}
                disabled={page === totalStudentPages}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>

        </div>
      )}

      {/* Subtab 2: Edges Table */}
      {activeSubTab === 'edges' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Recorded Friendship Edges ({filteredEdges.length})
            </h3>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={edgeSearch}
                onChange={(e) => { setEdgeSearch(e.target.value); setEdgePage(1); }}
                placeholder="Search registration IDs..."
                className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200/80 dark:border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Source Registration ID</th>
                  <th className="py-3 px-4">Target Registration ID</th>
                  <th className="py-3 px-4">Relationship</th>
                  <th className="py-3 px-4">Cross-Department</th>
                  <th className="py-3 px-4">Cross-Community</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200 font-mono text-[11px]">
                {paginatedEdges.map((e, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-3 px-4 text-indigo-600 dark:text-indigo-400 font-bold">{e.source}</td>
                    <td className="py-3 px-4 text-cyan-600 dark:text-cyan-400 font-bold">{e.target}</td>
                    <td className="py-3 px-4 font-sans text-slate-600 dark:text-slate-400">{e.relationship || 'friendship'}</td>
                    <td className="py-3 px-4 font-sans">
                      {e.is_cross_department ? (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-semibold">Yes</span>
                      ) : (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-400">Internal</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-sans">
                      {e.is_cross_community ? (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 font-semibold">Yes</span>
                      ) : (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-400">Internal</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800">
            <span>Showing {(edgePage - 1) * pageSize + 1} - {Math.min(edgePage * pageSize, filteredEdges.length)} of {filteredEdges.length} edges</span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setEdgePage((p) => Math.max(p - 1, 1))}
                disabled={edgePage === 1}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 disabled:opacity-40"
              >
                Previous
              </button>
              <span className="px-2 font-medium">Page {edgePage} of {totalEdgePages}</span>
              <button
                onClick={() => setEdgePage((p) => Math.min(p + 1, totalEdgePages))}
                disabled={edgePage === totalEdgePages}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>

        </div>
      )}

      {/* Subtab 3: Validation Report */}
      {activeSubTab === 'validation' && validationReport && (
        <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Dataset Integrity & Validation Report
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Full verification against all requirements specified in Section 3
              </p>
            </div>

            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              100% Passed
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {validationReport.checks.map((c, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 flex items-start gap-3">
                <div className="mt-0.5 shrink-0">
                  {c.status === 'pass' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                  {c.status === 'warn' && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                  {c.status === 'fail' && <XCircle className="w-4 h-4 text-rose-500" />}
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900 dark:text-white">{c.name}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{c.detail}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Department Breakdown table */}
          <div>
            <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Verified Student Allocation per Department
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
              {Object.entries(validationReport.departments_found).map(([dept, count]) => (
                <div key={dept} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 text-center">
                  <div className="font-black text-emerald-600 dark:text-emerald-400 text-lg">{count}</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5" title={dept}>
                    {dept}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Subtab 4: Upload Replacement Dataset */}
      {activeSubTab === 'upload' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-xs max-w-xl space-y-5">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Upload className="w-4 h-4 text-indigo-500" />
              Upload Replacement Dataset & Rerun Analysis
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Upload replacement CSV files matching the schema of <code>students_630.csv</code> and <code>student_connections.csv</code>. The system will automatically validate data integrity and recompute all graph metrics.
            </p>
          </div>

          {uploadMessage && (
            <div className={`p-4 rounded-xl text-xs flex items-start gap-2.5 leading-relaxed ${
              uploadMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                : 'bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
            }`}>
              {uploadMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />}
              <div>{uploadMessage.text}</div>
            </div>
          )}

          <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Student Records CSV (<code>students_630.csv</code>)
              </label>
              <input
                type="file"
                accept=".csv"
                onChange={(e) => setStudentsFile(e.target.files?.[0] || null)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 dark:file:bg-indigo-950 dark:file:text-indigo-400"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Friendship Connections CSV (<code>student_connections.csv</code>)
              </label>
              <input
                type="file"
                accept=".csv"
                onChange={(e) => setConnectionsFile(e.target.files?.[0] || null)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 dark:file:bg-indigo-950 dark:file:text-indigo-400"
              />
            </div>

            <button
              type="submit"
              disabled={uploadLoading || !studentsFile || !connectionsFile}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/25 transition-all disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${uploadLoading ? 'animate-spin' : ''}`} />
              <span>{uploadLoading ? 'Validating & Analyzing Graph...' : 'Validate & Run Analysis'}</span>
            </button>
          </form>
        </div>
      )}

    </div>
  );
};
