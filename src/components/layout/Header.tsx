import React from 'react';
import { Sun, Moon, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useNetwork } from '../../context/NetworkContext';

export const Header: React.FC = () => {
  const { theme, toggleTheme, sidebarCollapsed, toggleSidebar } = useNetwork();

  return (
    <header className="h-16 bg-white dark:bg-[#111726] border-b border-slate-200/90 dark:border-slate-800/90 px-5 lg:px-8 flex items-center justify-between sticky top-0 z-10 transition-colors duration-200 shadow-2xs">
      <div className="flex items-center gap-3">
        {/* Toggle Nav Bar In / Out */}
        <button
          onClick={toggleSidebar}
          title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-300 dark:hover:border-rose-800 hover:bg-rose-50/50 dark:hover:bg-slate-800/80 transition-all duration-150 cursor-pointer"
        >
          {sidebarCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
        </button>

        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">School of Computing</h2>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">Student Network Analytics</p>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {/* Dark / Light Mode Toggle Button */}
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
          className="flex items-center gap-1.5 p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/80 text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-300 dark:hover:border-rose-700 hover:bg-rose-50/50 dark:hover:bg-rose-950/40 transition-all duration-200 shadow-2xs cursor-pointer"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400 animate-in spin-in-180 duration-200" />
          ) : (
            <Moon className="w-4 h-4 text-slate-600 animate-in spin-in-180 duration-200" />
          )}
        </button>
      </div>
    </header>
  );
};
