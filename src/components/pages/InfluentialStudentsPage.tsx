import React, { useState } from 'react';
import { useNetwork } from '../../context/NetworkContext';
import { RoleBadge, DepartmentBadge } from '../common/StudentBadge';
import { formatDecimal } from '../../utils/formatting';
import { ChevronDown, ChevronUp, HelpCircle, Trophy } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export const InfluentialStudentsPage: React.FC = () => {
  const { data, setSelectedStudent } = useNetwork();
  const [showFormula, setShowFormula] = useState(false);

  if (!data) return null;

  const top10 = data.students.slice(0, 10);
  const chartData = [...top10].reverse().map(s => ({
    reg: s.registration_number,
    score: s.influence_score,
    department: s.department
  }));

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Influential Students</h1>
        <p className="text-xs text-slate-500 mt-0.5">Students with high structural importance in the network.</p>
      </div>

      {/* Top 10 Chart & Summary */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>Top 10 Influence Scores</span>
            </h2>
            <p className="text-xs text-slate-500">Relative composite influence index (0.00 to 1.00)</p>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 70, bottom: 5 }}>
              <XAxis type="number" domain={[0, 1]} tick={{ fontSize: 11, fill: '#64748B' }} />
              <YAxis 
                dataKey="reg" 
                type="category" 
                tick={{ fontSize: 11, fill: '#334155', fontFamily: 'JetBrains Mono' }} 
              />
              <Tooltip
                formatter={(val: any) => [Number(val).toFixed(4), 'Influence Score']}
                contentStyle={{ backgroundColor: '#0F172A', color: '#FFF', borderRadius: '8px', fontSize: '12px', border: 'none' }}
              />
              <Bar dataKey="score" fill="#2563EB" radius={[0, 6, 6, 0]} barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top 10 Ranked Table */}
      <div className="bg-white border border-slate-200/90 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Ranked Top 10 Students</h3>
            <p className="text-xs text-slate-500">Click on any registration number to open student profile</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4 w-12 text-center">Rank</th>
                <th className="py-3 px-4">Registration Number</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Cohort</th>
                <th className="py-3 px-4 text-right">Degree</th>
                <th className="py-3 px-4 text-right">Betweenness</th>
                <th className="py-3 px-4 text-right">Closeness</th>
                <th className="py-3 px-4 text-right">PageRank</th>
                <th className="py-3 px-4 text-right">Influence</th>
                <th className="py-3 px-4">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {top10.map((s) => (
                <tr 
                  key={s.registration_number}
                  onClick={() => setSelectedStudent(s)}
                  className="hover:bg-blue-50/40 transition-colors cursor-pointer"
                >
                  <td className="py-3 px-4 text-center">
                    <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full font-bold text-[11px] ${
                      s.influence_rank === 1 ? 'bg-amber-100 text-amber-800' :
                      s.influence_rank === 2 ? 'bg-slate-200 text-slate-800' :
                      s.influence_rank === 3 ? 'bg-amber-50 text-amber-700' : 'text-slate-500'
                    }`}>
                      {s.influence_rank}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold text-blue-600">
                    {s.registration_number}
                  </td>
                  <td className="py-3 px-4">
                    <DepartmentBadge department={s.department} />
                  </td>
                  <td className="py-3 px-4 text-slate-600 font-medium">
                    {s.year}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-slate-800">
                    {s.degree}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-slate-800">
                    {formatDecimal(s.betweenness_centrality)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-slate-800">
                    {formatDecimal(s.closeness_centrality)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-slate-800">
                    {formatDecimal(s.pagerank)}
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

      {/* Expandable Formula Explanation */}
      <div className="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-sm">
        <button
          onClick={() => setShowFormula(!showFormula)}
          className="w-full px-5 py-3.5 text-left flex items-center justify-between text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-blue-600" />
            <span>How is influence calculated?</span>
          </div>
          {showFormula ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        {showFormula && (
          <div className="p-5 border-t border-slate-100 bg-slate-50/50 text-xs text-slate-600 space-y-3 animate-in fade-in">
            <p className="font-medium text-slate-800">
              The <strong>Composite Influence Score</strong> is a single fair score from <strong>0.00 to 1.00</strong> combining 4 different network strengths:
            </p>
            <div className="bg-white p-3 rounded-lg border border-slate-200 font-mono text-blue-900 font-semibold my-2">
              Influence Score = (30% × Degree) + (30% × Betweenness) + (20% × Closeness) + (20% × PageRank)
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
              <div className="p-2.5 bg-blue-50/70 border border-blue-100 rounded-lg">
                <span className="font-bold text-blue-800 block text-xs">30% Degree</span>
                <span className="text-[11px] text-slate-600">Total number of direct peer connections.</span>
              </div>
              <div className="p-2.5 bg-purple-50/70 border border-purple-100 rounded-lg">
                <span className="font-bold text-purple-800 block text-xs">30% Betweenness</span>
                <span className="text-[11px] text-slate-600">How often student bridges different groups.</span>
              </div>
              <div className="p-2.5 bg-emerald-50/70 border border-emerald-100 rounded-lg">
                <span className="font-bold text-emerald-800 block text-xs">20% Closeness</span>
                <span className="text-[11px] text-slate-600">Speed of reaching any peer in few steps.</span>
              </div>
              <div className="p-2.5 bg-indigo-50/70 border border-indigo-100 rounded-lg">
                <span className="font-bold text-indigo-800 block text-xs">20% PageRank</span>
                <span className="text-[11px] text-slate-600">Prestige & authority of connected friends.</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
