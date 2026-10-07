export const DEPARTMENT_COLORS: Record<string, string> = {
  'CSE Core': '#2563EB',
  'AIML': '#7C3AED',
  'Data Science': '#059669',
  'Cloud Computing': '#0284C7',
  'Cybersecurity': '#DC2626',
  'Information Technology': '#D97706',
  'Big Data Analytics': '#4F46E5',
};

export const COMMUNITY_COLORS: Record<string, string> = {
  'Community 1': '#3B82F6',
  'Community 2': '#10B981',
  'Community 3': '#8B5CF6',
  'Community 4': '#F59E0B',
  'Community 5': '#EC4899',
  'Community 6': '#06B6D4',
  'Isolated': '#94A3B8'
};

export const ROLE_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  'Influential': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  'Bridge Student': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  'Bridge': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  'Highly Connected': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  'Central': { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200' },
  'Network-Isolated': { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
  'Low-Connected': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  'Peer Member': { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200' }
};

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

export function formatDecimal(num: number, decimals: number = 4): string {
  if (num === undefined || num === null || isNaN(num)) return '0.0000';
  return num.toFixed(decimals);
}
