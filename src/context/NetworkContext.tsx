import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { TabId, Student, DashboardData, ValidationReport } from '../types';
import { fetchApi } from '../utils/api';

export type ThemeMode = 'system' | 'dark' | 'light';

interface NetworkContextType {
  theme: 'dark' | 'light';
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  cycleTheme: () => void;
  toggleTheme: () => void;
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  toggleSidebar: () => void;
  isMobile: boolean;
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
  const getSystemTheme = (): 'dark' | 'light' => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'dark';
  };

  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('campusconnect_theme_mode');
    if (saved === 'system' || saved === 'dark' || saved === 'light') {
      return saved as ThemeMode;
    }
    const legacy = localStorage.getItem('campusconnect_theme');
    if (legacy === 'dark' || legacy === 'light') {
      return legacy as ThemeMode;
    }
    return 'system';
  });

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const savedMode = localStorage.getItem('campusconnect_theme_mode') || 'system';
    if (savedMode === 'dark') return 'dark';
    if (savedMode === 'light') return 'light';
    return getSystemTheme();
  });

  // Listen to OS system theme changes and adapt in real time
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleSystemChange = (e: MediaQueryListEvent) => {
      if (themeMode === 'system') {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleSystemChange);
    return () => mediaQuery.removeEventListener('change', handleSystemChange);
  }, [themeMode]);

  // Sync theme mode changes
  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    localStorage.setItem('campusconnect_theme_mode', mode);
    if (mode === 'system') {
      setTheme(getSystemTheme());
    } else {
      setTheme(mode);
    }
  };

  const cycleTheme = () => {
    if (themeMode === 'system') {
      setThemeMode('dark');
    } else if (themeMode === 'dark') {
      setThemeMode('light');
    } else {
      setThemeMode('system');
    }
  };

  const toggleTheme = () => {
    if (themeMode === 'system') {
      setThemeMode(theme === 'dark' ? 'light' : 'dark');
    } else {
      setThemeMode(themeMode === 'dark' ? 'light' : 'dark');
    }
  };

  // Sync active theme to HTML document class
  useEffect(() => {
    localStorage.setItem('campusconnect_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const [activeTab, setActiveTabState] = useState<TabId>(() => {
    const hash = window.location.hash.replace('#', '') as TabId;
    const validTabs: TabId[] = [
      'overview', 'network', 'communities', 'influential', 'bridges',
      'isolated', 'connectivity', 'departments', 'centrality', 'data', 'methodology'
    ];
    return validTabs.includes(hash) ? hash : 'overview';
  });

  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 1024;
    }
    return false;
  });

  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 1024;
    }
    return false;
  });

  const [globalSearch, setGlobalSearch] = useState<string>('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [validationReport, setValidationReport] = useState<ValidationReport | null>(null);
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isReanalyzing, setIsReanalyzing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Automatically adapt sidebar to window/screen resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarCollapsed(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
      const [dashData, valData, studData] = await Promise.all([
        fetchApi('/api/dashboard'),
        fetchApi('/api/dataset/validation'),
        fetchApi('/api/students?page=1&page_size=200')
      ]);

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
      const data = await fetchApi(`/api/students/${encodeURIComponent(regNumber)}`);
      setSelectedStudent(data);
      return data;
    } catch (err) {
      const fallback = allStudents.find((s) => s.registration_number === regNumber) || null;
      if (fallback) setSelectedStudent(fallback);
      return fallback;
    }
  };

  return (
    <NetworkContext.Provider
      value={{
        theme,
        themeMode,
        setThemeMode,
        cycleTheme,
        toggleTheme,
        activeTab,
        setActiveTab,
        sidebarCollapsed,
        setSidebarCollapsed,
        toggleSidebar,
        isMobile,
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
