import React from 'react';
import {
  Users,
  Network,
  Share2,
  UserX,
  Gauge,
  Activity,
  Layers,
  Sparkles,
  Award,
  ArrowRight,
  TrendingUp,
  Building
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import { useNetwork } from '../../context/NetworkContext';
import { StatCard } from '../common/StatCard';
import { StudentBadge } from '../common/StudentBadge';

export const OverviewPage: React.FC = () => {
  const { dashboardData, setActiveTab, fetchStudentDetail, isLoading } = useNetwork();

  if (isLoading || !dashboardData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-semibold text-slate-500">Loading CampusConnect overview metrics...</p>
      </div>
    );
  }

  const { kpis, insights, community_sizes, department_comparison, degree_distribution, connectivity_summary, top_influential } = dashboardData;

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Welcome Callout */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-indigo-900/90 via-slate-900 to-[#0a0f1d] border border-indigo-500/20 shadow-xl overflow-hidden text-white">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-indigo-500/10 to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Social Network Analysis Platform</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            CampusConnect — College Network Intelligence
          </h2>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            Discover the connections that shape campus life. Analyzing 630 students, {dashboardData?.kpis.total_friendship_edges || 3985} friendship relationships, and 7 academic departments to uncover emergent communities, structural influence, bridge students, and isolation patterns.
          </p>
          <div className="flex flex-wrap items-center gap-3 mt-5">
            <button
              onClick={() => setActiveTab('network')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <Network className="w-4 h-4" />
              <span>Explore Interactive Graph</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        
        <StatCard
          title="Total Students"
          value={kpis.total_students}
          subtitle="Cohort Graduating 2027"
          icon={<Users className="w-5 h-5" />}
          accentColor="indigo"
          tooltip="Total synthetic student nodes constructed in the graph across 7 departments (90 per department)."
          onClick={() => setActiveTab('data')}
        />

        <StatCard
          title="Friendship Edges"
          value={kpis.total_friendship_edges.toLocaleString()}
          subtitle="Undirected mutual ties"
          icon={<Share2 className="w-5 h-5" />}
          accentColor="cyan"
          tooltip="Total recorded undirected friendship relationships between students in the dataset."
          onClick={() => setActiveTab('network')}
        />

        <StatCard
          title="Louvain Communities"
          value={kpis.detected_communities}
          subtitle={`Modularity Q = ${kpis.modularity_score.toFixed(4)}`}
          icon={<Layers className="w-5 h-5" />}
          accentColor="purple"
          tooltip="Communities algorithmically discovered using NetworkX Louvain optimization on the active graph subgraph."
          onClick={() => setActiveTab('communities')}
        />

        <StatCard
          title="Completely Isolated"
          value={kpis.isolated_students_count}
          subtitle="Degree = 0 (no recorded ties)"
          icon={<UserX className="w-5 h-5" />}
          accentColor="rose"
          tooltip="Students with 0 friendship edges. Completely disconnected from the rest of the campus friendship graph."
          onClick={() => setActiveTab('isolated')}
        />

        <StatCard
          title="Average Degree"
          value={kpis.average_degree}
          subtitle="Friends per student on average"
          icon={<Activity className="w-5 h-5" />}
          accentColor="emerald"
          tooltip="Mean number of direct friendship edges per student in the graph (2 × edges / nodes)."
        />

        <StatCard
          title="Network Density"
          value={kpis.network_density.toFixed(4)}
          subtitle="Actual vs possible edges"
          icon={<Gauge className="w-5 h-5" />}
          accentColor="amber"
          tooltip="Ratio of recorded edges to total possible pairwise student edges (E / [V(V-1)/2])."
        />

        <StatCard
          title="Connected Components"
          value={kpis.connected_components}
          subtitle="1 main core + 6 singletons"
          icon={<Network className="w-5 h-5" />}
          accentColor="indigo"
          tooltip="Number of disconnected subgraphs: exactly 1 giant connected component of 624 active students plus 6 isolated singleton components."
        />

        <StatCard
          title="Highly Connected"
          value={kpis.highly_connected_count}
          subtitle="More than 10 friends"
          icon={<TrendingUp className="w-5 h-5" />}
          accentColor="emerald"
          tooltip="Students falling into the 4th tier of the classification scheme (having strictly > 10 direct friends)."
          onClick={() => setActiveTab('connectivity')}
        />

      </div>

      {/* Main Visualizations Row: Communities and Department Comparisons */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Community Distribution Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-500" />
                Community Size Distribution
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                4 natural social clusters discovered by Louvain (Modularity: {kpis.modularity_score.toFixed(4)})
              </p>
            </div>
            <button
              onClick={() => setActiveTab('communities')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>Explore</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={community_sizes} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="community" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} domain={[0, 180]} />
                <Tooltip
                  formatter={(val: any) => [`${val} Students`, 'Members']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar dataKey="students" radius={[8, 8, 0, 0]}>
                  {community_sizes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            {community_sizes.map((c) => (
              <div key={c.community} className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-center">
                <div className="font-bold text-slate-900 dark:text-white">{c.students}</div>
                <div className="text-[10px] text-slate-500">{c.community}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Department Activity Comparison */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Building className="w-4 h-4 text-cyan-500" />
                Department Activity & Average Degree
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                90 students per department with internal vs cross-department connections
              </p>
            </div>
            <button
              onClick={() => setActiveTab('departments')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={department_comparison} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                <XAxis type="number" tick={{ fontSize: 11 }} domain={[0, 16]} />
                <YAxis dataKey="department" type="category" tick={{ fontSize: 10 }} width={90} />
                <Tooltip
                  formatter={(val: any) => [`${val} friends`, 'Avg Degree']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar dataKey="average_degree" radius={[0, 8, 8, 0]}>
                  {department_comparison.map((entry, index) => (
                    <Cell key={`dept-cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span>Highest avg degree: <strong>Cloud Computing (13.3)</strong></span>
            <span>Lowest: <strong>Cybersecurity (12.2)</strong></span>
          </div>
        </div>

      </div>

      {/* Second Row: Connectivity Categories & Degree Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Connectivity Breakdown */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-500" />
              Four-Level Connectivity Tiers
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Mutually exclusive classification defined in Section 14
            </p>
          </div>

          <div className="h-52 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={connectivity_summary}
                  dataKey="count"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                >
                  {connectivity_summary.map((entry, index) => (
                    <Cell key={`pie-cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any, name: any) => [`${val} Students`, name]}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', borderRadius: '12px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            {connectivity_summary.map((cat) => (
              <div key={cat.category} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="text-slate-700 dark:text-slate-300 font-medium">{cat.category}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-slate-900 dark:text-white">{cat.count}</span>
                  <span className="text-slate-400 ml-1.5">({cat.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Degree Distribution Histogram */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-500" />
                Network Degree Distribution
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Distribution of friendships per student across the campus
              </p>
            </div>
            <span className="text-xs font-mono font-semibold px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              Range: 0 to 25
            </span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={degree_distribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="degreeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="degree" tick={{ fontSize: 11 }} label={{ value: 'Number of Friends (Degree)', position: 'insideBottom', offset: -5, fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(val: any) => [`${val} Students`, 'Count']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', borderRadius: '12px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#degreeGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 flex items-center justify-between">
            <span>Peak degree concentration: <strong>12 to 14 friends</strong></span>
            <span>6 students have degree 0 (Isolated)</span>
          </div>
        </div>

      </div>

      {/* Third Row: Top Influential Students & Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Top Influential Students Leaderboard */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                Top 5 Structurally Influential Students
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Ranked by PageRank structural prominence
              </p>
            </div>
            <button
              onClick={() => setActiveTab('influential')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>View All 50</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2">
            {top_influential.map((student, idx) => (
              <div
                key={student.registration_number}
                onClick={() => fetchStudentDetail(student.registration_number)}
                className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-800/40 hover:bg-indigo-50/60 dark:hover:bg-indigo-950/40 hover:border-indigo-200 dark:hover:border-indigo-800/60 flex items-center justify-between cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                    idx === 0 ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-400' :
                    idx === 1 ? 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300' :
                    idx === 2 ? 'bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-500' :
                    'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                  }`}>
                    #{idx + 1}
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                      {student.student_name}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                      {student.registration_number} • {student.department}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-mono font-bold text-indigo-600 dark:text-cyan-400">
                    PR: {student.pagerank.toFixed(5)}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {student.degree} connections
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Data-Derived Insights Panel */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              Automated Network Insights
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Algorithm-derived structural findings from graph calculations
            </p>
          </div>

          <div className="space-y-2.5">
            {insights.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-1"
              >
                <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  <span>{item.title}</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 pl-3.5 leading-relaxed">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
