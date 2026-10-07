import React from 'react';
import { useNetwork } from '../../context/NetworkContext';
import { StudentNetworkGraph } from '../network/StudentNetworkGraph';
import { Users, Layers, Award, Sparkles, TrendingUp } from 'lucide-react';
import { COMMUNITY_COLORS } from '../../utils/formatting';

export const CommunitiesPage: React.FC = () => {
  const { data, setSelectedStudent, selectStudentByReg } = useNetwork();

  if (!data) return null;

  const { community_stats, students, edges, metadata } = data;

  // Key Callouts
  const largestComm = [...community_stats].sort((a, b) => b.num_students - a.num_students)[0];
  const mostInfluentialComm = [...community_stats].sort((a, b) => b.avg_influence - a.avg_influence)[0];
  const mostConnectedComm = [...community_stats].sort((a, b) => b.avg_degree - a.avg_degree)[0];

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Communities</h1>
        <p className="text-xs text-slate-500 mt-0.5">Groups of students with stronger internal interaction patterns.</p>
      </div>

      {/* Top Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">
            <Layers className="w-4 h-4 text-blue-600" />
            <span>Largest Community</span>
          </div>
          <div className="text-lg font-bold text-slate-900">{largestComm.community_id}</div>
          <p className="text-xs text-slate-500 mt-0.5">
            {largestComm.num_students} students ({largestComm.percentage}% of cohort)
          </p>
          <span className="text-[11px] text-blue-600 font-medium mt-1 block">
            Dominant: {largestComm.dominant_department}
          </span>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">
            <Award className="w-4 h-4 text-purple-600" />
            <span>Most Influential</span>
          </div>
          <div className="text-lg font-bold text-slate-900">{mostInfluentialComm.community_id}</div>
          <p className="text-xs text-slate-500 mt-0.5">
            Average Influence: <strong className="text-purple-700">{mostInfluentialComm.avg_influence.toFixed(3)}</strong>
          </p>
          <span className="text-[11px] text-purple-600 font-medium mt-1 block">
            Top: {mostInfluentialComm.top_student}
          </span>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span>Most Connected</span>
          </div>
          <div className="text-lg font-bold text-slate-900">{mostConnectedComm.community_id}</div>
          <p className="text-xs text-slate-500 mt-0.5">
            Average Node Degree: <strong className="text-emerald-700">{mostConnectedComm.avg_degree.toFixed(1)}</strong>
          </p>
          <span className="text-[11px] text-emerald-600 font-medium mt-1 block">
            Modularity Q = {metadata.modularity.toFixed(3)}
          </span>
        </div>
      </div>

      {/* Community Cards Grid */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Detected Communities Breakdown</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {community_stats.map((c) => {
            const color = COMMUNITY_COLORS[c.community_id] || '#3B82F6';
            return (
              <div 
                key={c.community_id}
                className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></span>
                      <h3 className="text-sm font-bold text-slate-900">{c.community_id}</h3>
                    </div>
                    <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 rounded-md text-slate-700">
                      {c.num_students} Students
                    </span>
                  </div>

                  <div className="space-y-1 text-xs text-slate-600 mt-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Dominant Dept:</span>
                      <span className="font-medium text-slate-800">{c.dominant_department}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Avg Influence:</span>
                      <span className="font-mono font-medium text-slate-800">{c.avg_influence.toFixed(3)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Avg Degree:</span>
                      <span className="font-mono font-medium text-slate-800">{c.avg_degree.toFixed(1)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Top Student:</span>
                  <button
                    onClick={() => selectStudentByReg(c.top_student)}
                    className="font-mono font-semibold text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {c.top_student}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Visualization: Community Network */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Community Network Map</h2>
            <p className="text-xs text-slate-500">Nodes colored by detected Louvain partition.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5 text-[11px] text-slate-600 bg-slate-50/80 px-2.5 py-1 rounded-lg border border-slate-200/60">
            {community_stats.map(c => (
              <span key={c.community_id} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COMMUNITY_COLORS[c.community_id] || '#3B82F6' }}></span>
                {c.community_id}
              </span>
            ))}
          </div>
        </div>

        <StudentNetworkGraph
          students={students}
          edges={edges}
          colorBy="community"
          onSelectStudent={setSelectedStudent}
          selectedStudent={null}
          height={520}
        />
      </div>
    </div>
  );
};
