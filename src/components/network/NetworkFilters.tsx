import React from 'react';
import { RotateCcw, Filter } from 'lucide-react';
import { useNetwork } from '../../context/NetworkContext';

export const NetworkFiltersBar: React.FC = () => {
  const { filters, setFilters, resetFilters } = useNetwork();

  return (
    <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-sm mb-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          <Filter className="w-3.5 h-3.5 text-blue-600" />
          <span>Filter Network</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Department Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500 font-medium">Department:</span>
            <select
              value={filters.department}
              onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value }))}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
            >
              <option value="All">All Departments</option>
              <option value="CSE Core">CSE Core</option>
              <option value="AIML">AIML</option>
              <option value="Data Science">Data Science</option>
              <option value="Cloud Computing">Cloud Computing</option>
              <option value="Cybersecurity">Cybersecurity</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Big Data Analytics">Big Data Analytics</option>
            </select>
          </div>

          {/* Year Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500 font-medium">Academic Year:</span>
            <select
              value={filters.year}
              onChange={(e) => setFilters(prev => ({ ...prev, year: e.target.value }))}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
            >
              <option value="All">All Years</option>
              <option value="4th Year">4th Year (RA23)</option>
              <option value="3rd Year">3rd Year (RA24)</option>
              <option value="2nd Year">2nd Year (RA25)</option>
              <option value="1st Year">1st Year (RA26)</option>
            </select>
          </div>

          {/* Community Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500 font-medium">Community:</span>
            <select
              value={filters.community}
              onChange={(e) => setFilters(prev => ({ ...prev, community: e.target.value }))}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
            >
              <option value="All">All Communities</option>
              <option value="C1">Community 1</option>
              <option value="C2">Community 2</option>
              <option value="C3">Community 3</option>
              <option value="C4">Community 4</option>
              <option value="C5">Community 5</option>
              <option value="C6">Community 6</option>
              <option value="C7">Community 7</option>
              <option value="Isolated">Isolated</option>
            </select>
          </div>

          {/* Reset Button */}
          <button
            onClick={resetFilters}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors ml-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        </div>
      </div>
    </div>
  );
};
