import React from 'react';
import { Search, Filter, MoreVertical, ExternalLink } from 'lucide-react';

const InsightsTable = ({ title, headers, rows, loading }) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] overflow-hidden shadow-sm">
      <div className="px-8 py-6 border-b border-slate-50 dark:border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 bg-emerald-600 rounded-full" />
          <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">{title}</h3>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex-1 md:flex-none flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 focus-within:border-emerald-500/50 transition-all">
            <Search className="w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search data..." 
              className="bg-transparent border-none text-[11px] font-bold text-slate-900 dark:text-white focus:ring-0 w-full md:w-40 placeholder:text-slate-400" 
            />
          </div>
          <button className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 dark:bg-slate-800/50">
              {headers.map((h, i) => (
                <th key={i} className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">{h}</th>
              ))}
              <th className="px-8 py-4 border-b border-slate-100 dark:border-slate-800" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
            {loading ? (
              <tr>
                <td colSpan={headers.length + 1} className="px-8 py-20 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aggregating Records...</p>
                  </div>
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={headers.length + 1} className="px-8 py-20 text-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-slate-400">No records found for the selected period</p>
                </td>
              </tr>
            ) : rows.map((row, i) => (
              <tr key={i} className="hover:bg-emerald-50/30 dark:hover:bg-emerald-900/5 transition-colors group">
                {row.map((cell, j) => (
                  <td key={j} className="px-8 py-4">
                    {typeof cell === 'string' && cell.includes('₹') ? (
                      <span className="text-[13px] font-black text-emerald-700 dark:text-emerald-400">{cell}</span>
                    ) : (
                      <span className="text-[13px] font-bold text-slate-600 dark:text-slate-300 tracking-tight">{cell}</span>
                    )}
                  </td>
                ))}
                <td className="px-8 py-4 text-right">
                  <button className="p-2 text-slate-300 hover:text-slate-600 dark:hover:text-slate-100 opacity-0 group-hover:opacity-100 transition-all">
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InsightsTable;
