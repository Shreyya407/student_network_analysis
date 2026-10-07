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
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-600">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-semibold text-slate-500">Loading School of Computing Network...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Column */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <Header />

        {/* Main Content Area */}
        <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>

        {/* Global Footer */}
        <footer className="border-t border-slate-200/80 py-4 text-center text-xs text-slate-400">
          Synthetic dataset • Academic demonstration • No real student information
        </footer>
      </div>

      {/* Student Detail Panel */}
      <StudentDetailPanel />
    </div>
  );
};
