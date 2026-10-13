import React, { useState, useRef, useEffect } from 'react';
import {
  Sun,
  Moon,
  Search,
  RotateCw,
  Sliders,
  CheckCircle2,
  Sparkles,
  PanelLeftClose,
  PanelLeftOpen,
  ArrowRight,
  Database,
  X
} from 'lucide-react';
import { useNetwork } from '../../context/NetworkContext';
import { TabId, Student } from '../../types';

interface HeaderProps {
  onOpenReanalyzeModal: () => void;
}

const TAB_TITLES: Record<TabId, { title: string; subtitle: string }> = {
  overview: { title: 'Overview Dashboard', subtitle: 'Global college friendship network health & key indicators' },
  network: { title: 'Student Network Explorer', subtitle: 'Interactive force-directed graph with Cytoscape.js' },
  communities: { title: 'Communities (Louvain)', subtitle: 'Emergent social circles detected via graph modularity' },
  influential: { title: 'Influential Students', subtitle: 'Structural prominence measured by PageRank and degree centrality' },
  bridges: { title: 'Bridge Students', subtitle: 'Students who span betweenness paths connecting disparate communities' },
  isolated: { title: 'Completely Isolated Students', subtitle: 'Students with zero recorded friendship edges (degree = 0)' },
  connectivity: { title: 'Four-Level Connectivity Analysis', subtitle: 'Mutually exclusive tiers: Isolated, Low, Moderate, and High' },
  departments: { title: 'Department Analytics', subtitle: 'Within vs cross-department friendships across all 7 departments' },
  centrality: { title: 'Centrality Metric Comparison', subtitle: 'Multi-centrality correlation, distributions, and rankings' },
  data: { title: 'Data Explorer & Validation', subtitle: 'Raw student records, friendship edge lists, validation report, and exports' },
  methodology: { title: 'Methodology & Synthetic Insights', subtitle: 'Analytical pipeline, mathematical definitions, and model transparency' },
};

export const Header: React.FC<HeaderProps> = ({ onOpenReanalyzeModal }) => {
  const {
    theme,
    toggleTheme,
    activeTab,
    sidebarCollapsed,
    toggleSidebar,
    globalSearch,
    setGlobalSearch,
    dashboardData,
    validationReport,
    allStudents,
    fetchStudentDetail,
    refreshData,
    isLoading
  } = useNetwork();

  const [searchFocused, setSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const currentTabInfo = TAB_TITLES[activeTab] || TAB_TITLES.overview;

  // Filter students for global search dropdown
  const searchResults: Student[] = globalSearch.trim().length >= 2
    ? allStudents.filter(
        (s) =>
          s.student_name.toLowerCase().includes(globalSearch.toLowerCase()) ||
          s.registration_number.toLowerCase().includes(globalSearch.toLowerCase()) ||
          s.department.toLowerCase().includes(globalSearch.toLowerCase())
      ).slice(0, 8)
    : [];

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-16 bg-white/95 dark:bg-[#0d1322]/95 backdrop-blur-md border-b border-slate-200/90 dark:border-slate-800/90 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20 transition-colors shadow-2xs">
      
      {/* Left: Sidebar Toggle & Page Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={toggleSidebar}
          title={sidebarCollapsed ? "Expand navigation" : "Collapse navigation"}
          className="p-2 rounded-xl border border-slate-200 dark:border-slate-700/80 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          {sidebarCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
        </button>

        <div className="truncate hidden sm:block">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-indigo-600 dark:text-cyan-400 uppercase tracking-wider">
              CampusConnect
            </span>
            <span className="text-slate-300 dark:text-slate-700">/</span>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white truncate">
              {currentTabInfo.title}
            </h2>
          </div>
        </div>
      </div>

      {/* Center: Global Student Search */}
      <div ref={searchRef} className="relative max-w-xs md:max-w-sm w-full mx-3">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            placeholder="Search student, ID, or department..."
            className="w-full pl-9 pr-8 py-1.5 rounded-xl text-xs bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all"
          />
          {globalSearch && (
            <button
              onClick={() => setGlobalSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Search Results Dropdown */}
        {searchFocused && searchResults.length > 0 && (
          <div className="absolute left-0 right-0 top-full mt-2 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 py-1">
              Matching Students ({searchResults.length})
            </div>
            <div className="space-y-1 max-h-64 overflow-y-auto mt-1">
              {searchResults.map((s) => (
                <div
                  key={s.registration_number}
                  onClick={() => {
                    fetchStudentDetail(s.registration_number);
                    setSearchFocused(false);
                  }}
                  className="p-2 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-950/40 cursor-pointer flex items-center justify-between text-xs transition-colors group"
                >
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                      {s.student_name}
                    </div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <span className="font-mono">{s.registration_number}</span>
                      <span>•</span>
                      <span>{s.department}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {s.degree} friends
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right: Status Badges, Reanalyze, Theme Toggle */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        
        {/* Dataset Status Badge */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold">
            {dashboardData?.kpis.total_students || 630} Nodes
          </span>
          <span className="text-slate-400">•</span>
          <span>{dashboardData?.kpis.total_friendship_edges || 4020} Edges</span>
        </div>

        {/* Modularity Badge */}
        {dashboardData && (
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 text-[11px] text-indigo-700 dark:text-indigo-300">
            <Sparkles className="w-3 h-3 text-indigo-500" />
            <span>Q = <strong>{dashboardData.kpis.modularity_score.toFixed(4)}</strong></span>
          </div>
        )}

        {/* Re-analyze / Parameters Button */}
        <button
          onClick={onOpenReanalyzeModal}
          title="Tweak analysis resolution & seed"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-300 dark:hover:border-indigo-800 transition-colors text-xs font-semibold shadow-2xs cursor-pointer"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Parameters</span>
        </button>

        {/* Refresh Live Data */}
        <button
          onClick={refreshData}
          disabled={isLoading}
          title="Refresh Analysis from Backend"
          className="p-2 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-indigo-500' : ''}`} />
        </button>

        {/* Dark / Light Theme Toggle */}
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
          className="flex items-center p-2 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors cursor-pointer"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400 transition-transform duration-200 rotate-0 hover:rotate-90" />
          ) : (
            <Moon className="w-4 h-4 text-slate-700 transition-transform duration-200 rotate-0 hover:-rotate-45" />
          )}
        </button>
      </div>

    </header>
  );
};
