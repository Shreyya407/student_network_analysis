import React, { createContext, useContext, useState, useEffect } from 'react';
import { SNABundle, Student, NetworkFilters } from '../types';

interface NetworkContextType {
  data: SNABundle | null;
  loading: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedStudent: Student | null;
  setSelectedStudent: (student: Student | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filters: NetworkFilters;
  setFilters: React.Dispatch<React.SetStateAction<NetworkFilters>>;
  resetFilters: () => void;
  selectStudentByReg: (regNum: string) => void;
}

const initialFilters: NetworkFilters = {
  department: 'All',
  year: 'All',
  community: 'All'
};

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

export const NetworkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<SNABundle | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filters, setFilters] = useState<NetworkFilters>(initialFilters);

  useEffect(() => {
    fetch('/data/soc_network_bundle.json')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load dataset bundle');
        return res.json();
      })
      .then((bundle: SNABundle) => {
        setData(bundle);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching SNA bundle:', err);
        setLoading(false);
      });
  }, []);

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  const selectStudentByReg = (regNum: string) => {
    if (!data) return;
    const found = data.students.find(
      s => s.registration_number.toLowerCase() === regNum.trim().toLowerCase()
    );
    if (found) {
      setSelectedStudent(found);
    }
  };

  return (
    <NetworkContext.Provider
      value={{
        data,
        loading,
        activeTab,
        setActiveTab,
        selectedStudent,
        setSelectedStudent,
        searchQuery,
        setSearchQuery,
        filters,
        setFilters,
        resetFilters,
        selectStudentByReg
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
