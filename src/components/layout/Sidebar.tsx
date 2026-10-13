import React from 'react';
import {
  LayoutDashboard,
  Network,
  Users,
  Trophy,
  GitMerge,
  UserX,
  Activity,
  Building2,
  GitCompare,
  Database,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  GraduationCap
} from 'lucide-react';
import { useNetwork } from '../../context/NetworkContext';
import { TabId } from '../../types';

interface NavItem {
  id: TabId;
  label: string;
  badge?: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { id: 'overview', label: 'Overview Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
  { id: 'network', label: 'Student Network Explorer', icon: <Network className="w-4 h-4" /> },
  { id: 'communities', label: 'Communities (Louvain)', icon: <Users className="w-4 h-4" /> },
  { id: 'influential', label: 'Influential Students', icon: <Trophy className="w-4 h-4" /> },
  { id: 'bridges', label: 'Bridge Students', icon: <GitMerge className="w-4 h-4" /> },
  { id: 'isolated', label: 'Isolated Students', icon: <UserX className="w-4 h-4" /> },
  { id: 'connectivity', label: 'Connectivity Analysis', icon: <Activity className="w-4 h-4" /> },
  { id: 'departments', label: 'Department Analytics', icon: <Building2 className="w-4 h-4" /> },
  { id: 'centrality', label: 'Centrality Comparison', icon: <GitCompare className="w-4 h-4" /> },
  { id: 'data', label: 'Data Explorer', icon: <Database className="w-4 h-4" /> },
  { id: 'methodology', label: 'Methodology & Insights', icon: <BookOpen className="w-4 h-4" /> },
];

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, sidebarCollapsed, toggleSidebar, isMobile } = useNetwork();

  return (
    <>
      {/* Mobile Backdrop when sidebar is open on smaller screens */}
      {!sidebarCollapsed && isMobile && (
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-30 lg:hidden transition-opacity duration-300"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 h-screen z-40 lg:z-30 shrink-0 bg-white dark:bg-[#0d1322] border-r border-slate-200/90 dark:border-slate-800/80 flex flex-col justify-between select-none transition-all duration-300 ease-in-out shadow-xl lg:shadow-xs ${
          sidebarCollapsed
            ? '-translate-x-full lg:translate-x-0 lg:w-20'
            : 'translate-x-0 w-64'
        }`}
      >
        <div className="overflow-y-auto flex-1">
          {/* Brand Header */}
          <div className="p-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/25 shrink-0">
                <GraduationCap className="w-5 h-5" />
              </div>
              {!sidebarCollapsed && (
                <div className="animate-in fade-in duration-200 truncate">
                  <h1 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight leading-tight flex items-center gap-1.5">
                    CampusConnect
                  </h1>
                  <p className="text-[10px] text-indigo-600 dark:text-cyan-400 font-semibold tracking-wide uppercase">
                    Network Intelligence
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={toggleSidebar}
              title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700/80 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 text-slate-400 dark:text-slate-500 transition-colors"
            >
              {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Navigation Menu */}
          <nav className="p-2.5 space-y-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    if (isMobile) {
                      toggleSidebar();
                    }
                  }}
                  title={sidebarCollapsed ? item.label : undefined}
                  className={`w-full flex items-center ${
                    sidebarCollapsed ? 'justify-center px-2' : 'px-3'
                  } py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                    isActive
                      ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60 shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-transparent'
                  }`}
                >
                  <span
                    className={`transition-colors shrink-0 ${
                      isActive
                        ? 'text-indigo-600 dark:text-indigo-400'
                        : 'text-slate-400 dark:text-slate-500 group-hover:text-indigo-500'
                    }`}
                  >
                    {item.icon}
                  </span>

                  {!sidebarCollapsed && (
                    <div className="ml-3 flex-1 flex items-center justify-between truncate animate-in fade-in duration-150">
                      <span className="truncate">{item.label}</span>
                    </div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Footer Details */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800/80">
          {!sidebarCollapsed ? (
            <div className="px-2 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/60 text-[10px] text-slate-500 dark:text-slate-400">
              <div className="font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>Cohort 2027</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">Live Graph</span>
              </div>
              <div className="mt-0.5 truncate text-slate-400">
                630 Students • 7 Departments
              </div>
            </div>
          ) : (
            <button
              onClick={toggleSidebar}
              title="Expand Navigation"
              className="w-full p-2 flex justify-center text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </aside>
    </>
  );
};
