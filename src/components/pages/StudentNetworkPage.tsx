import React, { useMemo } from 'react';
import { useNetwork } from '../../context/NetworkContext';
import { NetworkFiltersBar } from '../network/NetworkFilters';
import { StudentNetworkGraph } from '../network/StudentNetworkGraph';
import { Info, GraduationCap } from 'lucide-react';

export const StudentNetworkPage: React.FC = () => {
  const { data, filters, selectedStudent, setSelectedStudent } = useNetwork();

  const filteredStudents = useMemo(() => {
    if (!data) return [];
    return data.students.filter(s => {
      if (filters.department !== 'All' && s.department !== filters.department) return false;
      if (filters.year !== 'All' && s.year !== filters.year) return false;
      if (filters.community !== 'All' && s.community_id !== filters.community) return false;
      return true;
    });
  }, [data, filters]);

  const filteredEdges = useMemo(() => {
    if (!data) return [];
    const validRegs = new Set(filteredStudents.map(s => s.registration_number));
    return data.edges.filter(
      e => validRegs.has(e.registration_number_1) && validRegs.has(e.registration_number_2)
    );
  }, [data, filteredStudents]);

  // Determine if viewing a specific Department + Year group
  const isGroupView = filters.department !== 'All' && filters.year !== 'All';
  const selectedGroupInfo = useMemo(() => {
    if (!isGroupView || !data || !data.class_stats) return null;
    return data.class_stats.find(
      c => c.department === filters.department && c.year === filters.year
    ) || null;
  }, [isGroupView, data, filters]);

  if (!data) return null;

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Student Network</h1>
          <p className="text-xs text-slate-500 mt-0.5">Explore connections across School of Computing departments and academic cohorts.</p>
        </div>
      </div>

      {/* Filter Bar */}
      <NetworkFiltersBar />

      {/* Dynamic Department-Year Network Summary Card if viewing a specific group */}
      {isGroupView && selectedGroupInfo && (
        <div className="bg-gradient-to-r from-blue-50/90 to-indigo-50/90 border border-blue-200/90 rounded-xl p-4 shadow-sm animate-in fade-in">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-blue-600" />
                <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">Department-Year Network</span>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-100 text-emerald-800 rounded-full">
                  ✓ Valid ({selectedGroupInfo.student_count} Students)
                </span>
              </div>
              <h2 className="text-sm font-bold text-slate-900 mt-0.5">
                {selectedGroupInfo.department} — {selectedGroupInfo.year}
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs">
              <div className="bg-white/90 border border-blue-100 px-3 py-1.5 rounded-lg shadow-2xs">
                <span className="text-slate-400 block text-[10px]">Students</span>
                <strong className="text-slate-900 font-mono text-sm">{selectedGroupInfo.student_count}</strong>
              </div>
              <div className="bg-white/90 border border-blue-100 px-3 py-1.5 rounded-lg shadow-2xs">
                <span className="text-slate-400 block text-[10px]">Average Connections</span>
                <strong className="text-slate-900 font-mono text-sm">{selectedGroupInfo.average_connections}</strong>
              </div>
              <div className="bg-white/90 border border-blue-100 px-3 py-1.5 rounded-lg shadow-2xs">
                <span className="text-slate-400 block text-[10px]">Most Connected Student</span>
                <strong className="text-blue-700 font-mono text-xs">{selectedGroupInfo.most_connected} ({selectedGroupInfo.most_connected_deg})</strong>
              </div>
              <div className="bg-white/90 border border-blue-100 px-3 py-1.5 rounded-lg shadow-2xs">
                <span className="text-slate-400 block text-[10px]">Most Influential Student</span>
                <strong className="text-purple-700 font-mono text-xs">{selectedGroupInfo.top_influence} ({selectedGroupInfo.top_influence_score.toFixed(3)})</strong>
              </div>
              <div className="bg-white/90 border border-blue-100 px-3 py-1.5 rounded-lg shadow-2xs">
                <span className="text-slate-400 block text-[10px]">Network Density</span>
                <strong className="text-emerald-700 font-mono text-sm">{selectedGroupInfo.network_density}</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Canvas Area */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">Displaying:</span>
            <span><strong>{filteredStudents.length}</strong> students</span>
            <span>•</span>
            <span><strong>{filteredEdges.length}</strong> active ties</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
            <Info className="w-3.5 h-3.5" />
            <span>Click any node to view student details in slide-over panel</span>
          </div>
        </div>

        <StudentNetworkGraph
          students={filteredStudents}
          edges={filteredEdges}
          colorBy="department"
          onSelectStudent={setSelectedStudent}
          selectedStudent={selectedStudent}
          height={600}
        />
      </div>
    </div>
  );
};
