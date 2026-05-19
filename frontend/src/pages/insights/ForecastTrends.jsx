import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, AreaChart, Area, Legend, ScatterChart, Scatter, ZAxis
} from 'recharts';
import { 
  Zap, TrendingUp, AlertTriangle, Sparkles, 
  Target, BarChart3, Clock, ArrowUpRight
} from 'lucide-react';
import StatCard from './components/StatCard';
import InsightsHeader from './components/InsightsHeader';
import InsightsTable from './components/InsightsTable';

const ForecastTrends = () => {
  const revenueForecast = [
    { name: 'Jan', actual: 450, forecast: 450 },
    { name: 'Feb', actual: 520, forecast: 520 },
    { name: 'Mar', actual: 480, forecast: 480 },
    { name: 'Apr', actual: 610, forecast: 610 },
    { name: 'May', actual: 550, forecast: 550 },
    { name: 'Jun', actual: 670, forecast: 670 },
    { name: 'Jul', actual: null, forecast: 710 },
    { name: 'Aug', actual: null, forecast: 750 },
    { name: 'Sep', actual: null, forecast: 780 },
  ];

  const demandHeatmap = [
    { name: 'Tomato', score: 85 },
    { name: 'Potato', score: 64 },
    { name: 'Onion', score: 92 },
    { name: 'Apple', score: 45 },
    { name: 'Milk', score: 78 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <InsightsHeader 
        title="Forecast & Trends" 
        subtitle="AI-driven predictive analytics and market demand modeling"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Predicted Revenue" value="₹22.4L" sub="Next Quarter" icon={Sparkles} color="purple" />
        <StatCard label="Demand Index" value="+14%" trend="High" icon={TrendingUp} color="emerald" />
        <StatCard label="Stock Risk" value="Low" sub="Optimized" icon={ShieldCheck} color="blue" />
        <StatCard label="Projected Growth" value="18.5%" trend="+2.1%" icon={Zap} color="orange" />
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Revenue Forecasting (Next 3 Months)</h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Confidence Interval: 94.2%</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Actual</span>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Projected</span>
            </div>
          </div>
        </div>
        
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueForecast}>
              <defs>
                <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}} tickFormatter={(v) => `₹${v}k`} />
              <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
              <Area type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorActual)" />
              <Area type="monotone" dataKey="forecast" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorForecast)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm">
          <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight mb-8">Product Demand Heatmap</h3>
          <div className="space-y-6">
            {demandHeatmap.map((item, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">{item.name}</span>
                  <span className="text-xs font-black text-slate-900 dark:text-white">{item.score}% Demand</span>
                </div>
                <div className="h-3 w-full bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-100 dark:border-slate-700 p-0.5">
                  <div 
                    className="h-full bg-emerald-500 rounded-full transition-all duration-1000 shadow-lg shadow-emerald-500/20" 
                    style={{ width: `${item.score}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#0a4a34] rounded-[2.5rem] p-8 text-white relative overflow-hidden flex flex-col justify-between">
           <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-orange-400" />
                </div>
                <h4 className="text-xs font-black uppercase tracking-widest text-emerald-100/60">Risk Assessment</h4>
              </div>
              <h3 className="text-2xl font-black tracking-tighter mb-4">Stockout Risk Detected</h3>
              <p className="text-sm font-bold text-emerald-100/60 leading-relaxed mb-6">
                Based on current velocity and seasonal patterns, <span className="text-white font-black uppercase">Tomato</span> and <span className="text-white font-black uppercase">Onion</span> stocks are at 85% risk of stockout next week.
              </p>
              <div className="flex flex-col gap-2">
                 <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-400">
                    <ArrowUpRight className="w-3 h-3" /> Expected Price Surge: +12%
                 </div>
                 <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-orange-400">
                    <Clock className="w-3 h-3" /> Recommended Reorder: Today
                 </div>
              </div>
           </div>
           <button className="relative z-10 mt-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-[#0a4a34] font-black text-[10px] uppercase tracking-widest rounded-2xl transition-all shadow-xl">
             Automate Procurement Plan
           </button>
           <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/5 rounded-full blur-[100px]" />
        </div>
      </div>
    </div>
  );
};

const ShieldCheck = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

export default ForecastTrends;
