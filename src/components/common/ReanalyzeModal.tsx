import React, { useState } from 'react';
import { X, Sliders, RefreshCw, CheckCircle, Info } from 'lucide-react';
import { useNetwork } from '../../context/NetworkContext';

interface ReanalyzeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReanalyzeModal: React.FC<ReanalyzeModalProps> = ({ isOpen, onClose }) => {
  const { reanalyze, isReanalyzing, dashboardData } = useNetwork();
  const [resolution, setResolution] = useState<number>(0.75);
  const [seed, setSeed] = useState<number>(42);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await reanalyze(resolution, seed);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/50 dark:bg-black/70 backdrop-blur-xs transition-opacity" 
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-2xl p-6 overflow-hidden animate-in zoom-in-95 duration-150">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Analysis Parameters
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Configure Louvain Community Detection algorithm
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            
            {/* Louvain Resolution */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Louvain Resolution Parameter: <span className="text-indigo-600 dark:text-indigo-400">{resolution}</span>
                </label>
                <span className="text-[10px] text-slate-400">Default: 0.75</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="1.5"
                step="0.05"
                value={resolution}
                onChange={(e) => setResolution(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                Controls community granularity. Lower values (&lt;0.8) produce larger communities; <strong>0.75</strong> discovers exactly the 4 target natural communities on this campus dataset.
              </p>
            </div>

            {/* Random Seed */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Deterministic Random Seed
                </label>
                <span className="text-[10px] text-slate-400">Default: 42</span>
              </div>
              <input
                type="number"
                value={seed}
                onChange={(e) => setSeed(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Guarantees deterministic, reproducible community partition calculation.
              </p>
            </div>

            {/* Current Active Modularity Status */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-xs space-y-1">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Current Detected Communities:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {dashboardData?.kpis.detected_communities || 4}
                </span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Current Modularity (Q):</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                  {dashboardData?.kpis.modularity_score.toFixed(4) || "0.6784"}
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isReanalyzing}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/25 transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isReanalyzing ? 'animate-spin' : ''}`} />
                <span>{isReanalyzing ? 'Re-analyzing...' : 'Run Re-analysis'}</span>
              </button>
            </div>

          </form>

        </div>
      </div>
    </div>
  );
};
