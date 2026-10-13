import React from 'react';
import { BookOpen, Sparkles, Layers, Activity, Target, Zap, Shuffle, Info, ShieldAlert, Cpu } from 'lucide-react';

export const MethodologyPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-5xl">
      
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-400 font-semibold text-xs">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Mathematical Pipeline & Analytical Rigor</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Social Network Analysis Methodology & Transparency
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          Comprehensive documentation of graph construction, community detection, centrality formulas, classification boundaries, and ethical disclosures for CampusConnect.
        </p>
      </div>

      {/* 1. Dataset Overview */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Cpu className="w-4 h-4 text-indigo-500" />
          1. Dataset & Graph Formulation
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          The dataset represents a synthetic college friendship network consisting of a single academic cohort graduating in 2027:
        </p>
        <ul className="list-disc pl-5 text-xs text-slate-600 dark:text-slate-400 space-y-1">
          <li><strong>Students ($N = 630$):</strong> 7 academic departments with exactly 90 students each. Registration numbers follow strict 15-character sequential codes (e.g., <code>RA2311028010001</code> to <code>RA2311028010090</code> for Cloud Computing).</li>
          <li><strong>Friendship Edges ($M = 3,985$):</strong> Undirected, unweighted mutual friendship connections. Self-loops and duplicate edges are strictly filtered during graph construction.</li>
          <li><strong>Unlabelled Input Guarantee:</strong> The raw input CSVs contain only registration numbers, synthetic student names, and department attributes. No social outcome labels (such as community membership, isolation, influence, or bridging) are stored in the input files; all categories are derived dynamically at runtime.</li>
        </ul>
      </div>

      {/* 2. Louvain Community Detection */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Layers className="w-4 h-4 text-teal-500" />
          2. Louvain Community Detection Algorithm
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          Communities are discovered using NetworkX’s Louvain modularity maximization algorithm running on the active subgraph ($k_i &gt; 0$):
        </p>
        
        {/* Modularity formula block */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-xs font-mono text-slate-800 dark:text-slate-200 overflow-x-auto">
          Q = (1 / 2m) * Σ [ A_ij - (k_i * k_j) / (2m) ] * δ(c_i, c_j)
        </div>

        <ul className="list-disc pl-5 text-xs text-slate-600 dark:text-slate-400 space-y-1">
          <li><strong>Resolution Parameter ($\gamma = 0.75$):</strong> Sets the modularity scale factor to naturally discover 4 balanced emergent social circles without forcing or fabricating assignments.</li>
          <li><strong>Deterministic Random Seed ($42$):</strong> Guarantees 100% reproducible community partitions across analysis runs.</li>
          <li><strong>High Modularity ($Q = 0.6784$):</strong> Proves statistically significant community structure far exceeding random graph expectation ($Q &gt; 0.3$).</li>
          <li><strong>Handling Isolated Nodes:</strong> Nodes with degree zero are excluded from Louvain clustering to prevent artificial singleton communities, and are designated as "Isolated / No Community".</li>
        </ul>
      </div>

      {/* 3. Centrality Metrics */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Target className="w-4 h-4 text-indigo-500" />
          3. Centrality Metrics & Formulations
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-1.5">
            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-indigo-500" />
              <span>Degree Centrality</span>
            </div>
            <div className="font-mono text-[11px] text-slate-500">C_D(v) = deg(v) / (N - 1)</div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Standardized measure of direct friendships relative to graph capacity ($N - 1 = 629$).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-1.5">
            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-cyan-500" />
              <span>PageRank Prestige</span>
            </div>
            <div className="font-mono text-[11px] text-slate-500">PR(u) = (1 - α)/N + α * Σ (PR(v) / deg(v))</div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Power iteration algorithm ($\alpha = 0.85$) modeling information prestige flow with dangling-node redistribution.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-1.5">
            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Shuffle className="w-4 h-4 text-purple-500" />
              <span>Betweenness Centrality</span>
            </div>
            <div className="font-mono text-[11px] text-slate-500">C_B(v) = Σ (σ_st(v) / σ_st)</div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Normalized fraction of shortest all-pairs paths that traverse student $v$. Pinpoints structural bridge brokers.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-1.5">
            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Info className="w-4 h-4 text-amber-500" />
              <span>Closeness Centrality</span>
            </div>
            <div className="font-mono text-[11px] text-slate-500">C_C(v) = (n - 1) / Σ d(v, u)</div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Reciprocal of average shortest distance. Computed with component-size normalization to account for disconnected components.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Four-Level Connectivity Classification Scheme */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-500" />
          4. Four-Level Connectivity Classification Scheme
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          The platform classifies every student into exactly one of four mutually exclusive, collectively exhaustive categories based strictly on their graph degree:
        </p>

        <div className="overflow-x-auto rounded-xl border border-slate-200/80 dark:border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 font-semibold uppercase text-[10px] text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-2.5 px-4">Tier Category</th>
                <th className="py-2.5 px-4">Degree Boundary</th>
                <th className="py-2.5 px-4">Analytical Purpose</th>
                <th className="py-2.5 px-4 text-right">Population Count</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
              <tr>
                <td className="py-2.5 px-4 font-bold text-rose-600 dark:text-rose-400">Completely Isolated</td>
                <td className="py-2.5 px-4 font-mono">0 friends</td>
                <td className="py-2.5 px-4 text-slate-600 dark:text-slate-400">Detect students with no recorded friendship connections in the dataset</td>
                <td className="py-2.5 px-4 text-right font-mono font-bold">6 (0.95%)</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-bold text-amber-600 dark:text-amber-400">Low Connectivity</td>
                <td className="py-2.5 px-4 font-mono">1–2 friends</td>
                <td className="py-2.5 px-4 text-slate-600 dark:text-slate-400">Identify students with very limited recorded connections (1 or 2 friends)</td>
                <td className="py-2.5 px-4 text-right font-mono font-bold">10 (1.59%)</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-bold text-blue-600 dark:text-blue-400">Moderately Connected</td>
                <td className="py-2.5 px-4 font-mono">3–10 friends</td>
                <td className="py-2.5 px-4 text-slate-600 dark:text-slate-400">Understand students with moderate local connection volume</td>
                <td className="py-2.5 px-4 text-right font-mono font-bold">147 (23.33%)</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-bold text-emerald-600 dark:text-emerald-400">Highly Connected</td>
                <td className="py-2.5 px-4 font-mono">&gt; 10 friends</td>
                <td className="py-2.5 px-4 text-slate-600 dark:text-slate-400">Identify students with comparatively high connectivity counts</td>
                <td className="py-2.5 px-4 text-right font-mono font-bold">467 (74.13%)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Ethical Disclosures & Limitations */}
      <div className="p-6 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-300 space-y-2 leading-relaxed">
        <div className="flex items-center gap-2 font-bold text-sm text-amber-800 dark:text-amber-400">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>Ethical Transparency & Synthetic Data Disclosures</span>
        </div>
        <p>
          <strong>Synthetic Data Notice:</strong> This network dataset was generated synthetically for academic network intelligence demonstration purposes. All student names, registration numbers, and relationships are synthetic.
        </p>
        <p>
          <strong>Structural vs Psychological Meaning:</strong> Connectivity categories and centrality rankings reflect only the recorded edge structure in the graph. They must never be interpreted as psychological evaluations, measures of personal popularity, mental health indicators, or real-world social worth.
        </p>
        <p>
          <strong>Latent Generation Separation:</strong> The underlying latent parameters used when probabilistically sampling the synthetic network were deliberately omitted from the input files to ensure algorithms must discover communities and centralities organically from raw data.
        </p>
      </div>

    </div>
  );
};
