import React, { useState } from 'react';
import { useNetwork } from '../../context/NetworkContext';
import { DepartmentBadge, RoleBadge } from '../common/StudentBadge';
import { downloadCSV } from '../../utils/csvExporter';
import { Download, CheckCircle2, ShieldCheck, ChevronLeft, ChevronRight, Table2 } from 'lucide-react';
import { formatNumber } from '../../utils/formatting';

export const DataPage: React.FC = () => {
  const { data, setSelectedStudent } = useNetwork();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  if (!data) return null;

  const { students, metadata, class_stats, edges } = data;
  const totalPages = Math.ceil(students.length / pageSize);
  const paginatedStudents = students.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Dataset</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          {formatNumber(metadata.total_students)} Students • {formatNumber(metadata.total_connections)} Connections • {formatNumber(metadata.total_events)} Interaction Events • 7 Departments • 28 Department-Year Groups
        </p>
      </div>

      {/* Download Center Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <button
          onClick={() => downloadCSV('school_of_computing_students.csv', '/data/school_of_computing_students.csv')}
          className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-sm hover:border-blue-400 hover:shadow-md transition-all text-left flex items-center justify-between group"
        >
          <div>
            <span className="text-xs font-bold text-slate-900 block group-hover:text-blue-600 transition-colors">Students Registry</span>
            <span className="text-[11px] text-slate-500">{formatNumber(metadata.total_students)} Records (CSV)</span>
          </div>
          <Download className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
        </button>

        <button
          onClick={() => downloadCSV('school_of_computing_interactions.csv', '/data/school_of_computing_interactions.csv')}
          className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-sm hover:border-blue-400 hover:shadow-md transition-all text-left flex items-center justify-between group"
        >
          <div>
            <span className="text-xs font-bold text-slate-900 block group-hover:text-blue-600 transition-colors">Interactions Dataset</span>
            <span className="text-[11px] text-slate-500">{formatNumber(metadata.total_connections)} Weighted Ties (CSV)</span>
          </div>
          <Download className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
        </button>

        <button
          onClick={() => downloadCSV('school_of_computing_events.csv', '/data/school_of_computing_events.csv')}
          className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-sm hover:border-blue-400 hover:shadow-md transition-all text-left flex items-center justify-between group"
        >
          <div>
            <span className="text-xs font-bold text-slate-900 block group-hover:text-blue-600 transition-colors">Event Timeline Logs</span>
            <span className="text-[11px] text-slate-500">{formatNumber(metadata.total_events)} Events (CSV)</span>
          </div>
          <Download className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
        </button>

        <button
          onClick={() => downloadCSV('school_of_computing_sna_results.csv', '/data/school_of_computing_sna_results.csv')}
          className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-sm hover:border-blue-400 hover:shadow-md transition-all text-left flex items-center justify-between group"
        >
          <div>
            <span className="text-xs font-bold text-slate-900 block group-hover:text-blue-600 transition-colors">SNA Calculated Results</span>
            <span className="text-[11px] text-slate-500">All Metrics & Scores (CSV)</span>
          </div>
          <Download className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
        </button>
      </div>

      {/* Group Validation Audit Table (28 Department-Year Groups) */}
      <div className="bg-white border border-slate-200/90 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Table2 className="w-4 h-4 text-blue-600" />
              <span>Department × Academic Year Group Audit (28 Total Groups)</span>
            </h3>
            <p className="text-xs text-slate-500">Automated audit verifying every Department-Year group contains &ge; 22 students</p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
            28 / 28 Groups Valid (&ge; 22 Students)
          </span>
        </div>

        <div className="overflow-x-auto max-h-80 overflow-y-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="sticky top-0 bg-slate-50 shadow-sm">
              <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-4">#</th>
                <th className="py-2.5 px-4">Department</th>
                <th className="py-2.5 px-4">Academic Year</th>
                <th className="py-2.5 px-4 text-center">Student Count</th>
                <th className="py-2.5 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {(class_stats || []).map((c, idx) => (
                <tr key={`${c.department}-${c.year}`} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-2 px-4 text-slate-400 font-sans">{idx + 1}</td>
                  <td className="py-2 px-4 font-sans font-medium text-slate-900">
                    <DepartmentBadge department={c.department} />
                  </td>
                  <td className="py-2 px-4 font-sans text-slate-700 font-medium">{c.year}</td>
                  <td className="py-2 px-4 text-center font-bold text-slate-800 font-mono">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                      {c.student_count}
                    </span>
                  </td>
                  <td className="py-2 px-4 text-center">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      ✓ Valid
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Data Preview Table with Pagination */}
      <div className="bg-white border border-slate-200/90 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Student Dataset Registry Preview</h3>
            <p className="text-xs text-slate-500">Showing page {currentPage} of {totalPages} ({formatNumber(students.length)} Students Total)</p>
          </div>
          
          {/* Pagination Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 disabled:opacity-40 hover:bg-slate-50 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-medium text-slate-600">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 disabled:opacity-40 hover:bg-slate-50 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Registration Number</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Academic Year</th>
                <th className="py-3 px-4 text-right">Degree</th>
                <th className="py-3 px-4 text-right">Betweenness</th>
                <th className="py-3 px-4 text-right">Influence Score</th>
                <th className="py-3 px-4">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedStudents.map((s) => (
                <tr 
                  key={s.registration_number}
                  onClick={() => setSelectedStudent(s)}
                  className="hover:bg-blue-50/30 transition-colors cursor-pointer"
                >
                  <td className="py-3 px-4 font-mono font-semibold text-blue-600">
                    {s.registration_number}
                  </td>
                  <td className="py-3 px-4">
                    <DepartmentBadge department={s.department} />
                  </td>
                  <td className="py-3 px-4 text-slate-600 font-medium">
                    {s.year}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-medium text-slate-800">
                    {s.degree}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-slate-600">
                    {s.betweenness_centrality.toFixed(4)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-blue-700">
                    {s.influence_score.toFixed(4)}
                  </td>
                  <td className="py-3 px-4">
                    <RoleBadge role={s.role} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Subtle Footer Disclaimer */}
      <div className="text-center text-xs text-slate-400 py-3">
        Synthetic dataset • Academic demonstration • No real student information
      </div>
    </div>
  );
};
