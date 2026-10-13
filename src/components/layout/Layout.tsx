import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { StudentDetailDrawer } from '../common/StudentDetailDrawer';
import { ReanalyzeModal } from '../common/ReanalyzeModal';
import { useNetwork } from '../../context/NetworkContext';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { selectedStudent, setSelectedStudent } = useNetwork();
  const [reanalyzeModalOpen, setReanalyzeModalOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0f1d] text-slate-900 dark:text-slate-100 flex transition-colors duration-200">
      {/* Collapsible Sidebar */}
      <Sidebar />

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Sticky Header */}
        <Header onOpenReanalyzeModal={() => setReanalyzeModalOpen(true)} />

        {/* Page Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Global Student Detail Drawer */}
      <StudentDetailDrawer
        student={selectedStudent}
        onClose={() => setSelectedStudent(null)}
      />

      {/* Reanalyze & Parameters Modal */}
      <ReanalyzeModal
        isOpen={reanalyzeModalOpen}
        onClose={() => setReanalyzeModalOpen(false)}
      />
    </div>
  );
};
