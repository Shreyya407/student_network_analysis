import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useNetwork } from '../../context/NetworkContext';

export const Header: React.FC = () => {
  const { data, searchQuery, setSearchQuery, selectStudentByReg, setSelectedStudent } = useNetwork();
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
    <header className="h-16 bg-white border-b border-slate-200/90 px-8 flex items-center justify-between sticky top-0 z-10">
      <div>
        <h2 className="text-sm font-semibold text-slate-900">School of Computing</h2>
        <p className="text-xs text-slate-500">Student Network Analytics</p>
      </div>

      <div className="flex items-center gap-4">
        {/* Search Bar */}
        <div className="relative w-80">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search registration number..."
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => searchQuery.trim().length > 1 && setDropdownOpen(true)}
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono transition-all"
            />
          </div>

          {/* Autocomplete Dropdown */}
          {dropdownOpen && matchingStudents.length > 0 && (
            <div className="absolute top-full mt-1.5 left-0 right-0 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-30 max-h-60 overflow-y-auto">
              {matchingStudents.map((s) => (
                <button
                  key={s.registration_number}
                  onClick={() => handleSelect(s.registration_number)}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center justify-between text-xs border-b border-slate-100 last:border-b-0 transition-colors"
                >
                  <div>
                    <span className="font-mono font-semibold text-blue-600">{s.registration_number}</span>
                    <span className="text-slate-500 ml-2 text-[11px]">{s.department}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                    Score: {s.influence_score.toFixed(2)}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200/80 rounded-full">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs font-medium text-emerald-700">Dataset loaded</span>
        </div>
      </div>
    </header>
  );
};
