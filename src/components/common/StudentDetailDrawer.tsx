import React from 'react';
import { X, Network, Award, GitMerge, User, Building, Users, ExternalLink, ArrowRight } from 'lucide-react';
import { Student } from '../../types';
import { StudentBadge } from './StudentBadge';
import { useNetwork } from '../../context/NetworkContext';

interface StudentDetailDrawerProps {
  student: Student | null;
  onClose: () => void;
  onHighlightInGraph?: (regNumber: string) => void;
}

export const StudentDetailDrawer: React.FC<StudentDetailDrawerProps> = ({
  student,
  onClose,
  onHighlightInGraph,
}) => {
  const { setActiveTab, fetchStudentDetail } = useNetwork();

  if (!student) return null;

  const handleNavigateToGraph = () => {
    setActiveTab('network');
    if (onHighlightInGraph) {
      onHighlightInGraph(student.registration_number);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-xs transition-opacity" 
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-[#111827] border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
          
          {/* Header */}
          <div>
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-lg border border-indigo-200/60 dark:border-indigo-800/60">
                  {student.student_name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                    {student.student_name}
                  </h3>
                  <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                    {student.registration_number}
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Badges bar */}
            <div className="p-6 pb-2 flex flex-wrap gap-2">
              <StudentBadge type="connectivity" value={student.connectivity_category} />
              <StudentBadge type="position" value={student.network_position} />
              <StudentBadge type="community" value={student.community} />
              <StudentBadge type="department" value={student.department} />
            </div>

            {/* Metric Cards Grid */}
            <div className="p-6 pt-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Friendship Degree
                  </div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                    {student.degree}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Direct friendship connections
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    PageRank Score
                  </div>
                  <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">
                    {student.pagerank.toFixed(5)}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {student.pagerank_rank ? `Rank #${student.pagerank_rank} overall` : 'Structural weight'}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Betweenness Centrality
                  </div>
                  <div className="text-xl font-bold text-purple-600 dark:text-purple-400 mt-1">
                    {student.betweenness_centrality.toFixed(5)}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {student.betweenness_rank ? `Rank #${student.betweenness_rank}` : 'Shortest paths bridging'}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Closeness Centrality
                  </div>
                  <div className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                    {student.closeness_centrality.toFixed(4)}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Reachability to all peers
                  </div>
                </div>
              </div>

              {/* Department breakdown of friends */}
              {student.neighbor_departments && Object.keys(student.neighbor_departments).length > 0 && (
                <div className="pt-2">
                  <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2.5">
                    Friendships Across Departments
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(student.neighbor_departments).map(([dept, count]) => (
                      <div 
                        key={dept} 
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60"
                      >
                        <span className="truncate max-w-[120px]">{dept}:</span>
                        <span className="font-bold text-indigo-600 dark:text-indigo-400">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Direct neighbors list */}
              {student.neighbors_list && student.neighbors_list.length > 0 && (
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Recorded Friends ({student.neighbors_list.length})
                    </h4>
                  </div>
                  <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1">
                    {student.neighbors_list.map((nbr) => (
                      <div
                        key={nbr.registration_number}
                        onClick={() => fetchStudentDetail(nbr.registration_number)}
                        className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 hover:bg-indigo-50/60 dark:hover:bg-indigo-950/40 hover:border-indigo-200 dark:hover:border-indigo-800/60 flex items-center justify-between cursor-pointer transition-colors group"
                      >
                        <div>
                          <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                            {nbr.student_name}
                          </div>
                          <div className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                            <span>{nbr.department}</span>
                            <span>•</span>
                            <span>{nbr.community}</span>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {student.is_isolated && (
                <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-700 dark:text-rose-300 leading-relaxed">
                  <p className="font-semibold mb-1">Completely Isolated Student Notice</p>
                  This student has zero recorded friendship connections in the campus network graph. They represent an isolated node with degree 0.
                </div>
              )}
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 space-y-2">
            <button
              onClick={handleNavigateToGraph}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/25 transition-all"
            >
              <Network className="w-4 h-4" />
              <span>Explore in Network Graph</span>
            </button>
            <button
              onClick={onClose}
              className="w-full py-2.5 px-4 rounded-xl font-medium text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors"
            >
              Close Drawer
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
