import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { StudentDetailPanel } from '../common/StudentDetailPanel';
import { useNetwork } from '../../context/NetworkContext';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { loading } = useNetwork();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0B0F17] text-slate-600 dark:text-slate-300">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-3 border-rose-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Loading School of Computing Network...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#0B0F17] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Left Collapsible Sidebar (In/Out) */}
      <Sidebar />

      {/* Main Column */}
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        {/* Top Header with Dark/Light & Sidebar Toggles */}
        <Header />

        {/* Main Content Area */}
        <main className="flex-1 p-5 lg:p-7 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Student Detail Slide-Over Panel */}
      <StudentDetailPanel />
    </div>
  );
};
