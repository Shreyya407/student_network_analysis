import React from 'react';
import { X, Network, Trophy, Shield, Layers, Award } from 'lucide-react';
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
    <div className="fixed inset-y-0 right-0 w-96 bg-white dark:bg-[#131B2A] border-l border-slate-200/90 dark:border-slate-800/90 shadow-2xl z-40 flex flex-col justify-between animate-in slide-in-from-right duration-200">
      {/* Panel Header */}
      <div>
        <div className="p-5 border-b border-slate-100 dark:border-slate-800/80 flex items-start justify-between bg-slate-50/50 dark:bg-slate-900/40">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Student Profile</span>
              <RoleBadge role={selectedStudent.role} />
            </div>
            <h3 className="text-lg font-bold font-mono text-slate-900 dark:text-white mt-1">
              {selectedStudent.registration_number}
            </h3>
            <div className="mt-1">
              <DepartmentBadge department={selectedStudent.department} />
            </div>
          </div>
          <button
            onClick={() => setSelectedStudent(null)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Academic Details */}
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 dark:bg-slate-900/80 p-3.5 rounded-xl border border-slate-200/70 dark:border-slate-800">
            <div>
              <span className="text-slate-400 dark:text-slate-500 block text-[11px]">Academic Cohort</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedStudent.year}</span>
            </div>
            <div>
              <span className="text-slate-400 dark:text-slate-500 block text-[11px]">Network Status</span>
              <span className={`font-semibold ${selectedStudent.is_isolated ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                {selectedStudent.network_status}
              </span>
            </div>
            <div>
              <span className="text-slate-400 dark:text-slate-500 block text-[11px]">Louvain Community</span>
              <span className="font-semibold text-blue-600 dark:text-blue-400">{selectedStudent.community_id}</span>
            </div>
            <div>
              <span className="text-slate-400 dark:text-slate-500 block text-[11px]">SoC Ranking</span>
              <span className="font-semibold text-purple-700 dark:text-purple-400">
                {selectedStudent.is_isolated ? 'Unranked' : `#${selectedStudent.influence_rank}`}
              </span>
            </div>
          </div>

          {/* Primary Metrics Highlights */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-900/60">
              <span className="text-[11px] font-semibold text-rose-700 dark:text-rose-400 uppercase tracking-wider block">Direct Connections</span>
              <span className="text-2xl font-bold font-mono text-rose-900 dark:text-rose-200 mt-0.5 block">{selectedStudent.degree}</span>
              <span className="text-[10px] text-rose-600 dark:text-rose-400">Active Peer Ties</span>
            </div>
            <div className="p-3.5 rounded-xl bg-purple-50/60 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/60">
              <span className="text-[11px] font-semibold text-purple-700 dark:text-purple-400 uppercase tracking-wider block">Influence Score</span>
              <span className="text-2xl font-bold font-mono text-purple-900 dark:text-purple-200 mt-0.5 block">{selectedStudent.influence_score.toFixed(3)}</span>
              <span className="text-[10px] text-purple-600 dark:text-purple-400">Normalized Composite</span>
            </div>
          </div>

          {/* Detailed Centrality Breakdown */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Network Centrality Metrics</h4>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between py-1.5 px-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-600 dark:text-slate-400">Degree Centrality</span>
                <span className="font-mono font-semibold text-slate-900 dark:text-slate-200">{formatDecimal(selectedStudent.degree_centrality)}</span>
              </div>
              <div className="flex justify-between py-1.5 px-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-600 dark:text-slate-400">Betweenness Centrality</span>
                <span className="font-mono font-semibold text-slate-900 dark:text-slate-200">{formatDecimal(selectedStudent.betweenness_centrality)}</span>
              </div>
              <div className="flex justify-between py-1.5 px-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-600 dark:text-slate-400">Closeness Centrality</span>
                <span className="font-mono font-semibold text-slate-900 dark:text-slate-200">{formatDecimal(selectedStudent.closeness_centrality)}</span>
              </div>
              <div className="flex justify-between py-1.5 px-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-600 dark:text-slate-400">PageRank Score</span>
                <span className="font-mono font-semibold text-slate-900 dark:text-slate-200">{formatDecimal(selectedStudent.pagerank)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Action Button */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40">
        <button
          onClick={handleViewNetwork}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white rounded-xl text-xs font-semibold transition-all shadow-md shadow-rose-500/20"
        >
          <Network className="w-4 h-4" />
          <span>View in Network Graph</span>
        </button>
      </div>
    </div>
  );
};
