import React, { useState } from 'react';
import { 
  Database, 
  Download, 
  Upload, 
  RefreshCw, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  Cloud,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  LayoutGrid
} from 'lucide-react';

const Backup = () => {
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [backups, setBackups] = useState([
    { id: 'BK-001', date: '2026-05-08 10:30 AM', size: '2.4 MB', type: 'FULL SYSTEM', status: 'HEALTHY' },
    { id: 'BK-002', date: '2026-05-07 04:15 PM', size: '1.8 MB', type: 'DATABASE ONLY', status: 'HEALTHY' },
    { id: 'BK-003', date: '2026-05-06 09:00 AM', size: '2.1 MB', type: 'FULL SYSTEM', status: 'HEALTHY' },
  ]);

  const handleCreateBackup = () => {
    setIsBackingUp(true);
    setTimeout(() => {
      const newBackup = {
        id: `BK-00${backups.length + 1}`,
        date: new Date().toLocaleString(),
        size: '1.2 MB',
        type: 'ON-DEMAND',
        status: 'HEALTHY'
      };
      setBackups([newBackup, ...backups]);
      setIsBackingUp(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#f0f7f4] -m-8 p-8 animate-in fade-in duration-500">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* ERP Command Header */}
        <div className="flex flex-col xl:flex-row gap-8">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-[#0a4a34] rounded-lg flex items-center justify-center shadow-lg shadow-green-900/10">
                <Database className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Backup & Resilience</h2>
            </div>
            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Enterprise Data Protection & Automated Recovery Infrastructure</p>
          </div>

          <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <button 
              onClick={handleCreateBackup}
              disabled={isBackingUp}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg ${
                isBackingUp 
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none' 
                  : 'bg-[#0a4a34] text-white hover:bg-emerald-800 shadow-green-900/10'
              }`}
            >
              {isBackingUp ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
              {isBackingUp ? 'Creating Snapshot...' : 'Create Snapshot'}
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatBox label="Storage Usage" value="12.4 GB" sub="of 50 GB" icon={Cloud} />
          <StatBox label="System Health" value="Secure" sub="All Protocols Green" icon={ShieldCheck} />
          <StatBox label="Last Sync" value="14m Ago" sub="Automated Snapshot" icon={Clock} />
        </div>

        {/* Backup History Table */}
        <div className="bg-white border border-slate-100 rounded-[24px] shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
            <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Snapshot History</h3>
            <button className="text-slate-300 hover:text-slate-500 transition-colors">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-50">
                  <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Backup ID</th>
                  <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Created At</th>
                  <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Size</th>
                  <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Type</th>
                  <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                  <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {backups.map((backup) => (
                  <tr key={backup.id} className="hover:bg-slate-50/50 transition-all group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:bg-white transition-all">
                          <FileText className="w-4 h-4 text-slate-400" />
                        </div>
                        <span className="font-black text-slate-900 text-sm tracking-tight">{backup.id}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-[11px] font-bold text-slate-500">{backup.date}</td>
                    <td className="px-8 py-6 text-sm font-black text-slate-900">{backup.size}</td>
                    <td className="px-8 py-6">
                      <span className="px-2.5 py-1 rounded-md bg-slate-50 text-slate-400 text-[9px] font-black uppercase tracking-wider border border-slate-100">
                        {backup.type}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-center gap-1.5 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Healthy
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-3">
                        <button className="p-2 text-slate-300 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all active:scale-90">
                          <Download className="w-4.5 h-4.5" />
                        </button>
                        <button className="p-2 text-slate-300 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-all active:scale-90">
                          <Upload className="w-4.5 h-4.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-emerald-900 text-white p-8 rounded-[32px] shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform duration-700">
            <ShieldCheck className="w-48 h-48" />
          </div>
          <div className="relative z-10 max-w-xl">
            <h4 className="text-xl font-black uppercase tracking-tight mb-2">Automated Security</h4>
            <p className="text-emerald-100/80 text-sm leading-relaxed font-medium">
              Fresh Guru ERP automatically performs a full system snapshot every 24 hours. These backups are encrypted and stored in multiple secure geographical locations to ensure 99.9% data durability.
            </p>
            <div className="mt-6 flex gap-4">
              <button className="bg-white text-emerald-900 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-50 transition-all">
                Configure Schedule
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatBox = ({ label, value, trend, sub, icon: Icon, alert }) => (
  <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-500 group relative overflow-hidden text-left">
    <div className="relative z-10">
      <div className="flex justify-between items-start mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 ${
          alert ? 'bg-red-50 text-red-600' : 'bg-slate-50 dark:bg-slate-800 text-[#0a4a34] dark:text-green-400'
        }`}>
          {Icon && <Icon className="w-6 h-6" />}
        </div>
        {trend && (
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
            trend.startsWith('+') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
          }`}>
            <TrendingUp className={`w-3 h-3 ${trend.startsWith('+') ? '' : 'rotate-180'}`} />
            {trend}
          </div>
        )}
      </div>
      
      <div>
        <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-1">{label}</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter tabular-nums">{value}</h3>
          {sub && <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{sub}</span>}
        </div>
      </div>
    </div>
    
    <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-700 ${
      alert ? 'bg-red-500' : 'bg-[#0a4a34]'
    }`} />
  </div>
);

export default Backup;
