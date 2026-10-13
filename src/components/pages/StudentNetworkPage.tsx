import React, { useState } from 'react';
import { Network, Info, Eye, Sparkles } from 'lucide-react';
import { StudentNetworkGraph } from '../network/StudentNetworkGraph';
import { useNetwork } from '../../context/NetworkContext';

export const StudentNetworkPage: React.FC = () => {
  const { selectedStudent } = useNetwork();

  return (
    <div className="space-y-4">
      
      {/* Page Title & Explanation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Network className="w-5 h-5 text-indigo-500" />
            Interactive Student Network Explorer
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real graph visualization of 630 students and friendship connections. Click any node to open their detailed profile.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800">
            <Eye className="w-3.5 h-3.5 text-indigo-400" />
            <span>Hover to inspect • Click to focus</span>
          </span>
        </div>
      </div>

      {/* Signature Interactive Graph */}
      <StudentNetworkGraph />

      {/* Bottom Guideline Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="p-4 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 space-y-1">
          <div className="font-bold text-slate-900 dark:text-white">Community Coloring</div>
          <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
            Nodes are colored according to algorithm-detected Louvain communities (resolution = 0.75).
          </p>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 space-y-1">
          <div className="font-bold text-slate-900 dark:text-white">Sizing by Centrality</div>
          <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
            Switch node sizing between Degree (raw friend count) and PageRank (structural prestige).
          </p>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 space-y-1">
          <div className="font-bold text-slate-900 dark:text-white">Neighbor Highlighting</div>
          <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
            Clicking any node highlights its incident friendship edges and dims all non-adjacent peers.
          </p>
        </div>
      </div>

    </div>
  );
};
