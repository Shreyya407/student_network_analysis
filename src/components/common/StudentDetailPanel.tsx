import React from 'react';
import { X, Network, Trophy, Shield, Layers } from 'lucide-react';
import { useNetwork } from '../../context/NetworkContext';
import { RoleBadge, DepartmentBadge } from './StudentBadge';
import { formatDecimal } from '../../utils/formatting';

export const StudentDetailPanel: React.FC = () => {
  const { selectedStudent, setSelectedStudent, setActiveTab } = useNetwork();

  if (!selectedStudent) return null;

  const handleViewNetwork = () => {
    setActiveTab('network');
  };

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white border-l border-slate-200/90 shadow-2xl z-40 flex flex-col justify-between animate-in slide-in-from-right duration-200">
      {/* Panel Header */}
      <div>
        <div className="p-5 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Student Profile</span>
              <RoleBadge role={selectedStudent.role} />
            </div>
            <h3 className="text-lg font-bold font-mono text-slate-900 mt-1">
              {selectedStudent.registration_number}
            </h3>
            <div className="mt-1">
              <DepartmentBadge department={selectedStudent.department} />
            </div>
          </div>
          <button
            onClick={() => setSelectedStudent(null)}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Academic Details */}
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200/70">
            <div>
              <span className="text-slate-400 block text-[11px]">Academic Cohort</span>
              <span className="font-semibold text-slate-800">{selectedStudent.year}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Network Status</span>
              <span className={`font-semibold ${selectedStudent.is_isolated ? 'text-rose-600' : 'text-emerald-600'}`}>
                {selectedStudent.network_status}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Louvain Community</span>
              <span className="font-semibold text-blue-600">{selectedStudent.community_id}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">SoC Ranking</span>
              <span className="font-semibold text-purple-700">
                {selectedStudent.is_isolated ? 'Unranked' : `#${selectedStudent.influence_rank}`}
              </span>
            </div>
          </div>

          {/* Primary Metrics Highlights */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-100">
              <span className="text-[11px] font-semibold text-blue-700 uppercase tracking-wider block">Direct Connections</span>
              <span className="text-2xl font-bold font-mono text-blue-900 mt-0.5 block">{selectedStudent.degree}</span>
              <span className="text-[10px] text-blue-600">Active Peer Ties</span>
            </div>
            <div className="p-3.5 rounded-xl bg-purple-50/60 border border-purple-100">
              <span className="text-[11px] font-semibold text-purple-700 uppercase tracking-wider block">Influence Score</span>
              <span className="text-2xl font-bold font-mono text-purple-900 mt-0.5 block">{selectedStudent.influence_score.toFixed(3)}</span>
              <span className="text-[10px] text-purple-600">Normalized Composite</span>
            </div>
          </div>

          {/* Detailed Centrality Breakdown */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Network Centrality Metrics</h4>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between py-1.5 px-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-600">Degree Centrality</span>
                <span className="font-mono font-semibold text-slate-900">{formatDecimal(selectedStudent.degree_centrality)}</span>
              </div>
              <div className="flex justify-between py-1.5 px-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-600">Betweenness Centrality</span>
                <span className="font-mono font-semibold text-slate-900">{formatDecimal(selectedStudent.betweenness_centrality)}</span>
              </div>
              <div className="flex justify-between py-1.5 px-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-600">Closeness Centrality</span>
                <span className="font-mono font-semibold text-slate-900">{formatDecimal(selectedStudent.closeness_centrality)}</span>
              </div>
              <div className="flex justify-between py-1.5 px-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-600">PageRank Score</span>
                <span className="font-mono font-semibold text-slate-900">{formatDecimal(selectedStudent.pagerank)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Action Button */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <button
          onClick={handleViewNetwork}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-sm shadow-blue-500/20"
        >
          <Network className="w-4 h-4" />
          <span>View in Network Graph</span>
        </button>
      </div>
    </div>
  );
};
