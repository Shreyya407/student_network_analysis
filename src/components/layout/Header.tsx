import React, { useState } from 'react';
import { Search, Sun, Moon, Menu, PanelLeftClose, PanelLeftOpen, Sparkles } from 'lucide-react';
import { useNetwork } from '../../context/NetworkContext';

export const Header: React.FC = () => {
  const { data, searchQuery, setSearchQuery, selectStudentByReg, theme, toggleTheme, sidebarCollapsed, toggleSidebar } = useNetwork();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    setDropdownOpen(val.trim().length > 1);
  };

  const matchingStudents = data?.students.filter(s =>
    s.registration_number.toLowerCase().includes(searchQuery.toLowerCase().trim())
  ).slice(0, 6) || [];

  const handleSelect = (reg: string) => {
    selectStudentByReg(reg);
    setSearchQuery('');
    setDropdownOpen(false);
  };

  return (
    <header className="h-16 bg-white dark:bg-[#111726] border-b border-slate-200/90 dark:border-slate-800/90 px-5 lg:px-8 flex items-center justify-between sticky top-0 z-10 transition-colors duration-200 shadow-2xs">
      <div className="flex items-center gap-3">
        {/* Toggle Nav Bar In / Out */}
        <button
          onClick={toggleSidebar}
          title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-300 dark:hover:border-rose-800 hover:bg-rose-50/50 dark:hover:bg-slate-800/80 transition-all duration-150"
        >
          {sidebarCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
        </button>

        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">School of Computing</h2>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">Student Network Analytics</p>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {/* Registration Number Search Bar */}
        <div className="relative w-60 sm:w-80">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search registration number..."
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => searchQuery.trim().length > 1 && setDropdownOpen(true)}
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-mono transition-all"
            />
          </div>

          {/* Autocomplete Dropdown */}
          {dropdownOpen && matchingStudents.length > 0 && (
            <div className="absolute top-full mt-1.5 left-0 right-0 bg-white dark:bg-[#131B2A] border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl py-1 z-30 max-h-60 overflow-y-auto">
              {matchingStudents.map((s) => (
                <button
                  key={s.registration_number}
                  onClick={() => handleSelect(s.registration_number)}
                  className="w-full text-left px-3.5 py-2 hover:bg-rose-50/60 dark:hover:bg-slate-800/70 flex items-center justify-between text-xs border-b border-slate-100 dark:border-slate-800 last:border-b-0 transition-colors"
                >
                  <div>
                    <span className="font-mono font-bold text-rose-600 dark:text-rose-400">{s.registration_number}</span>
                    <span className="text-slate-500 dark:text-slate-400 ml-2 text-[11px]">{s.department}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono">
                    Score: {s.influence_score.toFixed(2)}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

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
