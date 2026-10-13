import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { TabId, Student, DashboardData, ValidationReport } from '../types';

interface NetworkContextType {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  globalSearch: string;
  setGlobalSearch: (q: string) => void;
  selectedStudent: Student | null;
  setSelectedStudent: (student: Student | null) => void;
  fetchStudentDetail: (regNumber: string) => Promise<Student | null>;
  dashboardData: DashboardData | null;
  validationReport: ValidationReport | null;
  allStudents: Student[];
  isLoading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  reanalyze: (resolution?: number, seed?: number) => Promise<void>;
  isReanalyzing: boolean;
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

export const NetworkProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('campusconnect_theme');
    return (saved === 'light' || saved === 'dark') ? saved : 'dark';
  });

  const [activeTab, setActiveTabState] = useState<TabId>(() => {
    const hash = window.location.hash.replace('#', '') as TabId;
    const validTabs: TabId[] = [
      'overview', 'network', 'communities', 'influential', 'bridges',
      'isolated', 'connectivity', 'departments', 'centrality', 'data', 'methodology'
    ];
    return validTabs.includes(hash) ? hash : 'overview';
  });

  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [globalSearch, setGlobalSearch] = useState<string>('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [validationReport, setValidationReport] = useState<ValidationReport | null>(null);
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isReanalyzing, setIsReanalyzing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Apply theme to HTML tag
  useEffect(() => {
    localStorage.setItem('campusconnect_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setActiveTab = (tab: TabId) => {
    setActiveTabState(tab);
    window.location.hash = tab;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => !prev);
  };

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [dashRes, valRes, studRes] = await Promise.all([
        fetch('/api/dashboard'),
        fetch('/api/dataset/validation'),
        fetch('/api/students?page=1&page_size=200')
      ]);

      if (!dashRes.ok) throw new Error(`Dashboard API error: ${dashRes.statusText}`);
      if (!valRes.ok) throw new Error(`Validation API error: ${valRes.statusText}`);
      if (!studRes.ok) throw new Error(`Students API error: ${studRes.statusText}`);

      const dashData = await dashRes.json();
      const valData = await valRes.json();
      const studData = await studRes.json();

      setDashboardData(dashData);
      setValidationReport(valData);
      setAllStudents(studData.items || []);
    } catch (err: any) {
      console.error('Failed to load CampusConnect data:', err);
      setError(err.message || 'Error communicating with backend API');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const refreshData = async () => {
    await loadData();
  };

  const reanalyze = async (resolution: number = 0.75, seed: number = 42) => {
    setIsReanalyzing(true);
    try {
      const formData = new FormData();
      formData.append('resolution', resolution.toString());
      formData.append('seed', seed.toString());

      const res = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Failed to reanalyze network');
      await loadData();
    } catch (err: any) {
      console.error('Re-analysis error:', err);
      alert(`Re-analysis failed: ${err.message}`);
    } finally {
      setIsReanalyzing(false);
    }
  };

  const fetchStudentDetail = async (regNumber: string): Promise<Student | null> => {
    try {
      const res = await fetch(`/api/students/${encodeURIComponent(regNumber)}`);
      if (!res.ok) return null;
      const data = await res.json();
      setSelectedStudent(data);
      return data;
    } catch (err) {
      console.error('Error fetching student detail:', err);
      return null;
    }
  };

  return (
    <NetworkContext.Provider
      value={{
        theme,
        toggleTheme,
        activeTab,
        setActiveTab,
        sidebarCollapsed,
        toggleSidebar,
        globalSearch,
        setGlobalSearch,
        selectedStudent,
        setSelectedStudent,
        fetchStudentDetail,
        dashboardData,
        validationReport,
        allStudents,
        isLoading,
        error,
        refreshData,
        reanalyze,
        isReanalyzing,
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
};

export const useNetwork = () => {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error('useNetwork must be used within a NetworkProvider');
  }
  return context;
};
