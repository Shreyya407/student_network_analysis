import React from 'react';
import { useNetwork } from '../../context/NetworkContext';
import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer, ZAxis } from 'recharts';
import { GitCompare, Info } from 'lucide-react';
import { DEPARTMENT_COLORS } from '../../utils/formatting';

export const MetricComparisonPage: React.FC = () => {
  const { data, setSelectedStudent } = useNetwork();

  if (!data) return null;

  const { students } = data;

  const scatterData = students.map(s => ({
    reg: s.registration_number,
    department: s.department,
    degree: s.degree,
    degree_centrality: s.degree_centrality,
    betweenness_centrality: s.betweenness_centrality,
    pagerank: s.pagerank,
    influence_score: s.influence_score,
    studentObj: s
  }));

  const handlePointClick = (entry: any) => {
    if (entry && entry.studentObj) {
      setSelectedStudent(entry.studentObj);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Metric Comparison</h1>
        <p className="text-xs text-slate-500 mt-0.5">See how different measures describe student importance.</p>
      </div>

      {/* Small Clean Explanation Card */}
      <div className="bg-blue-50/60 border border-blue-200/70 rounded-xl p-4 flex items-center gap-3">
        <Info className="w-5 h-5 text-blue-600 shrink-0" />
        <p className="text-xs text-blue-900 leading-relaxed font-medium">
          Degree measures direct connections, while Betweenness identifies students who connect different parts of the network. High direct connectivity does not automatically imply structural bridging capability.
        </p>
      </div>

      {/* Grid: 2 Scatter Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Chart 1: Connections vs Brokerage (Degree Centrality vs Betweenness) */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Connections vs. Brokerage</h3>
              <p className="text-xs text-slate-500">Degree Centrality (X) vs. Betweenness Centrality (Y)</p>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: -10 }}>
                <XAxis 
                  dataKey="degree_centrality" 
                  name="Degree Centrality" 
                  tick={{ fontSize: 11, fill: '#64748B' }} 
                  label={{ value: 'Degree Centrality', position: 'insideBottom', offset: -10, fontSize: 11, fill: '#94A3B8' }}
                />
                <YAxis 
                  dataKey="betweenness_centrality" 
                  name="Betweenness Centrality" 
                  tick={{ fontSize: 11, fill: '#64748B' }} 
                  label={{ value: 'Betweenness', angle: -90, position: 'insideLeft', offset: 15, fontSize: 11, fill: '#94A3B8' }}
                />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  content={({ payload }) => {
                    if (!payload || !payload.length) return null;
                    const d = payload[0].payload;
                    return (
                      <div className="bg-slate-900 text-white p-2.5 rounded-lg text-xs shadow-xl border border-slate-700">
                        <div className="font-mono font-bold text-blue-400">{d.reg}</div>
                        <div className="text-[11px] text-slate-300 mt-0.5">{d.department}</div>
                        <div className="mt-1 pt-1 border-t border-slate-800 text-[11px] space-y-0.5">
                          <div>Degree: <strong>{d.degree}</strong> ({d.degree_centrality.toFixed(4)})</div>
                          <div>Betweenness: <strong>{d.betweenness_centrality.toFixed(4)}</strong></div>
                        </div>
                      </div>
                    );
                  }}
                />
                <Scatter 
                  name="Students" 
                  data={scatterData} 
                  fill="#2563EB" 
                  opacity={0.65} 
                  onClick={handlePointClick}
                  className="cursor-pointer"
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Connections vs Influence (Degree vs PageRank) */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Connections vs. Influence</h3>
              <p className="text-xs text-slate-500">Degree (X) vs. PageRank Score (Y)</p>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: -10 }}>
                <XAxis 
                  dataKey="degree" 
                  name="Degree" 
                  tick={{ fontSize: 11, fill: '#64748B' }} 
                  label={{ value: 'Raw Degree (Connections)', position: 'insideBottom', offset: -10, fontSize: 11, fill: '#94A3B8' }}
                />
                <YAxis 
                  dataKey="pagerank" 
                  name="PageRank" 
                  tick={{ fontSize: 11, fill: '#64748B' }} 
                  label={{ value: 'PageRank', angle: -90, position: 'insideLeft', offset: 15, fontSize: 11, fill: '#94A3B8' }}
                />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  content={({ payload }) => {
                    if (!payload || !payload.length) return null;
                    const d = payload[0].payload;
                    return (
                      <div className="bg-slate-900 text-white p-2.5 rounded-lg text-xs shadow-xl border border-slate-700">
                        <div className="font-mono font-bold text-purple-400">{d.reg}</div>
                        <div className="text-[11px] text-slate-300 mt-0.5">{d.department}</div>
                        <div className="mt-1 pt-1 border-t border-slate-800 text-[11px] space-y-0.5">
                          <div>Degree: <strong>{d.degree}</strong></div>
                          <div>PageRank: <strong>{d.pagerank.toFixed(4)}</strong></div>
                        </div>
                      </div>
                    );
                  }}
                />
                <Scatter 
                  name="Students" 
                  data={scatterData} 
                  fill="#7C3AED" 
                  opacity={0.65} 
                  onClick={handlePointClick}
                  className="cursor-pointer"
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
