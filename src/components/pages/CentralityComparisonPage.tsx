import React, { useState, useEffect } from 'react';
import { GitCompare, Info, Award, ExternalLink, ArrowRight, Zap, Target, Shuffle } from 'lucide-react';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  ZAxis,
  Cell
} from 'recharts';
import { useNetwork } from '../../context/NetworkContext';
import { Student } from '../../types';
import { StudentBadge } from '../common/StudentBadge';

export const CentralityComparisonPage: React.FC = () => {
  const { fetchStudentDetail } = useNetwork();
  const [centralityData, setCentralityData] = useState<{
    top_by_degree: Student[];
    top_by_pagerank: Student[];
    top_by_betweenness: Student[];
    top_by_closeness: Student[];
    scatter_data: any[];
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [scatterMode, setScatterMode] = useState<'degree_vs_pagerank' | 'degree_vs_betweenness'>('degree_vs_pagerank');

  useEffect(() => {
    fetch('/api/centrality')
      .then((res) => res.json())
      .then((data) => {
        setCentralityData(data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-400 font-semibold text-xs mb-2">
            <GitCompare className="w-3.5 h-3.5" />
            <span>Multi-Metric Network Centrality Comparative Analysis</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Centrality Comparison & Correlation
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Different graph centrality algorithms capture distinct dimensions of social importance: Degree measures local volume, PageRank captures recursive peer prestige, and Betweenness identifies structural bridging bottlenecks.
          </p>
        </div>
      </div>

      {/* 4 Conceptual Metric Definition Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
        
        <div className="p-4 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 space-y-1.5">
          <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
            <Target className="w-4 h-4 text-indigo-500" />
            <span>Degree Centrality</span>
          </div>
          <div className="text-[11px] font-mono text-slate-400">Formula: k_i / (N - 1)</div>
          <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
            Measures normalized direct friendship counts relative to the total possible campus network size.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 space-y-1.5">
          <div className="flex items-center gap-2 font-bold text-indigo-600 dark:text-indigo-400">
            <Zap className="w-4 h-4 text-indigo-500" />
            <span>PageRank</span>
          </div>
          <div className="text-[11px] font-mono text-slate-400">Power Iteration (α = 0.85)</div>
          <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
            Nodes inherit prestige from connections who are themselves highly connected across the campus.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 space-y-1.5">
          <div className="flex items-center gap-2 font-bold text-purple-600 dark:text-purple-400">
            <Shuffle className="w-4 h-4 text-purple-500" />
            <span>Betweenness Centrality</span>
          </div>
          <div className="text-[11px] font-mono text-slate-400">Shortest-path ratio</div>
          <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
            Quantifies how often a student acts as an indispensable stepping stone between other students.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 space-y-1.5">
          <div className="flex items-center gap-2 font-bold text-cyan-600 dark:text-cyan-400">
            <Info className="w-4 h-4 text-cyan-500" />
            <span>Closeness Centrality</span>
          </div>
          <div className="text-[11px] font-mono text-slate-400">Inverse average distance</div>
          <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
            Calculates how few steps a student is from all other active peers in the giant connected component.
          </p>
        </div>

      </div>

      {/* Interactive Centrality Scatter Plot */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Centrality Correlation Scatter Plot (630 Students)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Visualizes how node metrics correlate or diverge across the student population
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-xs">
            <button
              onClick={() => setScatterMode('degree_vs_pagerank')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                scatterMode === 'degree_vs_pagerank'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              Degree vs PageRank
            </button>
            <button
              onClick={() => setScatterMode('degree_vs_betweenness')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                scatterMode === 'degree_vs_betweenness'
                  ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              Degree vs Betweenness
            </button>
          </div>
        </div>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
              <XAxis
                type="number"
                dataKey="degree"
                name="Degree (Friends)"
                label={{ value: 'Number of Friends (Degree)', position: 'insideBottom', offset: -10, fontSize: 11 }}
                tick={{ fontSize: 11 }}
              />
              <YAxis
                type="number"
                dataKey={scatterMode === 'degree_vs_pagerank' ? 'pagerank' : 'betweenness'}
                name={scatterMode === 'degree_vs_pagerank' ? 'PageRank' : 'Betweenness'}
                label={{
                  value: scatterMode === 'degree_vs_pagerank' ? 'PageRank Score' : 'Betweenness Centrality',
                  angle: -90,
                  position: 'insideLeft',
                  fontSize: 11
                }}
                tick={{ fontSize: 11 }}
              />
              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="p-3 rounded-xl bg-slate-900 text-white text-xs shadow-xl border border-slate-700 space-y-1">
                        <div className="font-bold text-indigo-300">{data.student_name}</div>
                        <div className="text-[10px] text-slate-400">{data.registration_number} • {data.department}</div>
                        <div className="mt-1 pt-1 border-t border-slate-800 space-y-0.5">
                          <div>Friends: <strong>{data.degree}</strong></div>
                          <div>PageRank: <strong className="font-mono text-cyan-300">{data.pagerank.toFixed(5)}</strong></div>
                          <div>Betweenness: <strong className="font-mono text-purple-300">{data.betweenness.toFixed(5)}</strong></div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter data={centralityData?.scatter_data || []} fill="#6366f1" fillOpacity={0.65} />
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        <div className="text-[11px] text-slate-500 dark:text-slate-400 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40">
          {scatterMode === 'degree_vs_pagerank' ? (
            <span><strong>Observation:</strong> Degree and PageRank show strong positive correlation ($r &gt; 0.95$), because PageRank distributes prestige primarily along high-degree edges in this synthetic network.</span>
          ) : (
            <span><strong>Observation:</strong> Degree vs Betweenness reveals high dispersion: some students with lower degrees have elevated betweenness scores because their connections bridge separate departments or communities.</span>
          )}
        </div>
      </div>

      {/* Top Ranked Comparison Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Top by Degree */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <h4 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-indigo-500" />
              <span>Top by Degree</span>
            </h4>
            <span className="text-[10px] text-slate-400">Direct Ties</span>
          </div>

          <div className="space-y-1.5">
            {centralityData?.top_by_degree.slice(0, 6).map((s, idx) => (
              <div
                key={s.registration_number}
                onClick={() => fetchStudentDetail(s.registration_number)}
                className="p-2.5 rounded-xl bg-slate-50/60 dark:bg-slate-800/40 hover:bg-indigo-50/60 dark:hover:bg-indigo-950/40 flex items-center justify-between text-xs cursor-pointer transition-colors"
              >
                <div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200">{s.student_name}</div>
                  <div className="text-[10px] text-slate-400">{s.department}</div>
                </div>
                <div className="font-bold text-indigo-600 dark:text-indigo-400">{s.degree} friends</div>
              </div>
            ))}
          </div>
        </div>

        {/* Top by PageRank */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <h4 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-indigo-500" />
              <span>Top by PageRank</span>
            </h4>
            <span className="text-[10px] text-slate-400">Peer Prestige</span>
          </div>

          <div className="space-y-1.5">
            {centralityData?.top_by_pagerank.slice(0, 6).map((s, idx) => (
              <div
                key={s.registration_number}
                onClick={() => fetchStudentDetail(s.registration_number)}
                className="p-2.5 rounded-xl bg-slate-50/60 dark:bg-slate-800/40 hover:bg-indigo-50/60 dark:hover:bg-indigo-950/40 flex items-center justify-between text-xs cursor-pointer transition-colors"
              >
                <div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200">{s.student_name}</div>
                  <div className="text-[10px] text-slate-400">{s.department}</div>
                </div>
                <div className="font-mono font-bold text-indigo-600 dark:text-cyan-400">{s.pagerank.toFixed(5)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Top by Betweenness */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <h4 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <Shuffle className="w-3.5 h-3.5 text-purple-500" />
              <span>Top by Betweenness</span>
            </h4>
            <span className="text-[10px] text-slate-400">Bridge Intermediary</span>
          </div>

          <div className="space-y-1.5">
            {centralityData?.top_by_betweenness.slice(0, 6).map((s, idx) => (
              <div
                key={s.registration_number}
                onClick={() => fetchStudentDetail(s.registration_number)}
                className="p-2.5 rounded-xl bg-slate-50/60 dark:bg-slate-800/40 hover:bg-indigo-50/60 dark:hover:bg-indigo-950/40 flex items-center justify-between text-xs cursor-pointer transition-colors"
              >
                <div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200">{s.student_name}</div>
                  <div className="text-[10px] text-slate-400">{s.department}</div>
                </div>
                <div className="font-mono font-bold text-purple-600 dark:text-purple-400">{s.betweenness_centrality.toFixed(5)}</div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
