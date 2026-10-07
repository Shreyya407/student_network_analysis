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
  GraduationCap
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
  const { activeTab, setActiveTab, data } = useNetwork();

  return (
    <aside className="w-64 bg-white border-r border-slate-200/90 flex flex-col justify-between shrink-0 h-screen sticky top-0 select-none z-20">
      <div>
        {/* University Brand Header */}
        <div className="p-5 border-b border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-900 tracking-tight leading-tight">School of Computing</h1>
            <p className="text-xs text-blue-600 font-medium">Network Analytics</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-semibold border border-blue-100'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent'
                }`}
              >
                <span className={isActive ? 'text-blue-600' : 'text-slate-400'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Clean Footer Space */}
      <div className="p-3"></div>
    </aside>
  );
};
