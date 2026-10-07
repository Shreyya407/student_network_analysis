import React from 'react';
import { useNetwork } from '../../context/NetworkContext';
import { StatCard } from '../common/StatCard';
import { StudentNetworkGraph } from '../network/StudentNetworkGraph';
import { Users, Network, Building2, UserX, Layers, Trophy, Waypoints, BarChart3 } from 'lucide-react';
import { formatNumber } from '../../utils/formatting';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { DEPARTMENT_COLORS } from '../../utils/formatting';

export const OverviewPage: React.FC = () => {
  const { data, setSelectedStudent } = useNetwork();

  if (!data) return null;

  const { metadata, students, edges, department_stats } = data;

  // Top overall influential student
  const topInfluential = students[0];

  // Top bridge student by betweenness
  const topBridge = [...students].sort((a, b) => b.betweenness_centrality - a.betweenness_centrality)[0];

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Student Network</h1>
        <p className="text-xs text-slate-500 mt-0.5">Understand how students connect across the School of Computing.</p>
      </div>

      {/* 5 Compact Statistic Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <StatCard
          label="Students"
          value={formatNumber(metadata.total_students)}
          subtext="4 Academic Cohorts"
          icon={<Users className="w-4 h-4" />}
        />
        <StatCard
          label="Connections"
          value={formatNumber(metadata.total_connections)}
          subtext="Unique Ties"
          icon={<Network className="w-4 h-4" />}
        />
        <StatCard
          label="Departments"
          value={metadata.total_departments}
          subtext="Computing Programs"
          icon={<Building2 className="w-4 h-4" />}
        />
        <StatCard
          label="Network-Isolated"
          value={metadata.isolated_students_count}
          subtext="Degree = 0"
          highlight="danger"
          icon={<UserX className="w-4 h-4" />}
        />
        <StatCard
          label="Communities"
          value={metadata.communities_count}
          subtext={`Modularity Q = ${metadata.modularity.toFixed(3)}`}
          icon={<Layers className="w-4 h-4" />}
        />
      </div>

      {/* Main Section: Network at a Glance */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Network at a glance</h2>
            <p className="text-xs text-slate-500">Interactive graph of {formatNumber(metadata.total_students)} students. Node size reflects Influence Score.</p>
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] text-slate-600 bg-slate-50/80 px-3 py-1.5 rounded-lg border border-slate-200/60">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#2563EB]"></span> CSE Core</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#7C3AED]"></span> AIML</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#059669]"></span> Data Science</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#0284C7]"></span> Cloud Computing</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#DC2626]"></span> Cybersecurity</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#D97706]"></span> Information Technology</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#4F46E5]"></span> Big Data Analytics</span>
          </div>
        </div>

        <StudentNetworkGraph
          students={students}
          edges={edges}
          colorBy="department"
          onSelectStudent={setSelectedStudent}
          selectedStudent={null}
          height={520}
        />
      </div>

      {/* Two Clean Cards Side by Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Most Influential */}
        <div 
          onClick={() => setSelectedStudent(topInfluential)}
          className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-sm hover:border-blue-300 hover:shadow-md transition-all cursor-pointer flex items-center justify-between"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider">Most Influential</span>
              <h3 className="text-sm font-bold font-mono text-slate-900">{topInfluential.registration_number}</h3>
              <p className="text-xs text-slate-500">{topInfluential.department} • {topInfluential.year}</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400 block text-[11px]">Influence Score</span>
            <span className="text-xl font-bold font-mono text-blue-600">{topInfluential.influence_score.toFixed(2)}</span>
          </div>
        </div>

        {/* Top Bridge */}
        <div 
          onClick={() => setSelectedStudent(topBridge)}
          className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-sm hover:border-purple-300 hover:shadow-md transition-all cursor-pointer flex items-center justify-between"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
              <Waypoints className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-purple-600 uppercase tracking-wider">Top Bridge</span>
              <h3 className="text-sm font-bold font-mono text-slate-900">{topBridge.registration_number}</h3>
              <p className="text-xs text-slate-500">{topBridge.department} • {topBridge.year}</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400 block text-[11px]">Betweenness</span>
            <span className="text-xl font-bold font-mono text-purple-600">{topBridge.betweenness_centrality.toFixed(4)}</span>
          </div>
        </div>
      </div>

      {/* Bottom: Department Activity Chart */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Department Activity</h2>
            <p className="text-xs text-slate-500">Interaction volume across School of Computing departments.</p>
          </div>
          <span className="text-xs text-slate-400 font-medium">Department vs Interaction Volume</span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={department_stats} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
              <XAxis 
                dataKey="department" 
                tick={{ fontSize: 11, fill: '#64748B' }} 
                interval={0}
                angle={-15}
                textAnchor="end"
              />
              <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
              <Tooltip 
                formatter={(value: any) => [formatNumber(Number(value)), 'Interaction Volume']}
                contentStyle={{ backgroundColor: '#0F172A', color: '#FFF', borderRadius: '8px', fontSize: '12px', border: 'none' }}
              />
              <Bar dataKey="interaction_volume" radius={[6, 6, 0, 0]}>
                {department_stats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={DEPARTMENT_COLORS[entry.department] || '#2563EB'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
