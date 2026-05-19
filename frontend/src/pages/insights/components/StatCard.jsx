import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({ label, value, trend, sub, icon: Icon, color = 'emerald' }) => {
  const colorMap = {
    emerald: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20',
    blue: 'text-blue-600 bg-blue-50 dark:bg-blue-500/10 border-blue-100 dark:border-blue-500/20',
    orange: 'text-orange-600 bg-orange-50 dark:bg-orange-500/10 border-orange-100 dark:border-orange-500/20',
    red: 'text-red-600 bg-red-50 dark:bg-red-500/10 border-red-100 dark:border-red-500/20',
    purple: 'text-purple-600 bg-purple-50 dark:bg-purple-500/10 border-purple-100 dark:border-purple-500/20',
  };

  const isPositive = trend?.startsWith('+');

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-[2rem] shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
      <div className="flex justify-between items-start mb-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${colorMap[color] || colorMap.emerald}`}>
          {Icon && <Icon className="w-6 h-6" />}
        </div>
        {trend && (
          <div className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider ${
            isPositive ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400'
          }`}>
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {trend}
          </div>
        )}
      </div>
      
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{value}</h3>
          {sub && <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{sub}</span>}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
