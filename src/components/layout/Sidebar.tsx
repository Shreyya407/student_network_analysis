import React from 'react';
import { 
  LayoutDashboard, 
  Network, 
  Award, 
  UserX, 
  Users, 
  Building2, 
  GitCompare, 
  BookOpen, 
  Database,
  GraduationCap,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useNetwork } from '../../context/NetworkContext';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
  { id: 'network', label: 'Student Network', icon: <Network className="w-4 h-4" /> },
  { id: 'influential', label: 'Influential Students', icon: <Award className="w-4 h-4" /> },
  { id: 'isolation', label: 'Network Isolation', icon: <UserX className="w-4 h-4" /> },
  { id: 'communities', label: 'Communities', icon: <Users className="w-4 h-4" /> },
  { id: 'departments', label: 'Departments', icon: <Building2 className="w-4 h-4" /> },
  { id: 'comparison', label: 'Metric Comparison', icon: <GitCompare className="w-4 h-4" /> },
  { id: 'methodology', label: 'Methodology', icon: <BookOpen className="w-4 h-4" /> },
  { id: 'data', label: 'Data', icon: <Database className="w-4 h-4" /> }
];

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, sidebarCollapsed, toggleSidebar } = useNetwork();

  return (
    <aside 
      className={`${
        sidebarCollapsed ? 'w-20' : 'w-64'
      } bg-white dark:bg-[#111726] border-r border-slate-200/90 dark:border-slate-800/90 flex flex-col justify-between shrink-0 h-screen sticky top-0 select-none z-20 transition-all duration-300 ease-in-out shadow-sm`}
    >
      <div>
        {/* Brand Header with Red / White Accent */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-red-500 flex items-center justify-center text-white shadow-md shadow-rose-500/25 shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            {!sidebarCollapsed && (
              <div className="animate-in fade-in duration-200 truncate">
                <h1 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight leading-tight">School of Computing</h1>
                <p className="text-[11px] text-rose-600 dark:text-rose-400 font-semibold tracking-wide">Network Analytics</p>
              </div>
            )}
          </div>

          {/* In/Out Collapse Button */}
          <button
            onClick={toggleSidebar}
            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-rose-50 dark:hover:bg-slate-800 hover:text-rose-600 dark:hover:text-rose-400 text-slate-400 dark:text-slate-500 transition-all duration-150"
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="p-2.5 space-y-1.5 mt-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                title={sidebarCollapsed ? item.label : undefined}
                className={`w-full flex items-center ${
                  sidebarCollapsed ? 'justify-center px-2' : 'px-3.5'
                } py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 font-semibold border border-rose-200/90 dark:border-rose-900/60 shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <span 
                  className={`transition-colors shrink-0 ${
                    isActive 
                      ? 'text-rose-600 dark:text-rose-400' 
                      : 'text-slate-400 dark:text-slate-500 group-hover:text-rose-500'
                  }`}
                >
                  {item.icon}
                </span>
                {!sidebarCollapsed && (
                  <span className="ml-3 truncate animate-in fade-in duration-150">
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Collapsed Toggle / Indicator */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-center">
        {!sidebarCollapsed ? (
          <button
            onClick={toggleSidebar}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium text-slate-500 dark:text-slate-400 hover:bg-rose-50 dark:hover:bg-slate-800 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Collapse Navigation</span>
          </button>
        ) : (
          <button
            onClick={toggleSidebar}
            title="Expand Navigation"
            className="p-2 rounded-lg text-slate-400 dark:text-slate-500 hover:bg-rose-50 dark:hover:bg-slate-800 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </aside>
  );
};
