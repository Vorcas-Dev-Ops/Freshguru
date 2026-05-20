import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Download, 
  Filter, 
  FileText, 
  Calendar, 
  ChevronDown,
  LayoutDashboard,
  TrendingUp,
  Package,
  Users,
  Wallet,
  Truck,
  Building2,
  Tag,
  Landmark,
  Sparkles
} from 'lucide-react';

const InsightsHeader = ({ title, subtitle, onExportExcel, onExportPDF }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const reports = [
    { label: 'Real-Time Overview', path: '/insights/overview', icon: LayoutDashboard },
    { label: 'Sales Analytics', path: '/insights/sales', icon: TrendingUp },
    { label: 'Inventory Insights', path: '/insights/inventory', icon: Package },
    { label: 'Customer Insights', path: '/insights/customers', icon: Users },
    { label: 'Payment Insights', path: '/insights/payments', icon: Wallet },
    { label: 'Delivery Insights', path: '/insights/delivery', icon: Truck },
    { label: 'Branch Performance', path: '/insights/branches', icon: Building2 },
    { label: 'Product Performance', path: '/insights/products', icon: Tag },
    { label: 'Financial Insights', path: '/insights/financial', icon: Landmark },
    { label: 'Forecast & Trends', path: '/insights/forecast', icon: Sparkles },
  ];

  const currentReport = reports.find(r => r.path === location.pathname) || reports[0];

  const Icon = currentReport?.icon || LayoutDashboard;

  return (
    <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 mb-8 relative">
      <div className="flex items-center gap-6">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-[#0a4a34] rounded-lg flex items-center justify-center shadow-lg shadow-green-900/10 shrink-0 mt-1">
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">{title}</h2>
            <p className="text-[10px] font-black text-slate-400 tracking-[0.2em] mt-1.5">{subtitle || 'Enterprise Business Intelligence'}</p>
          </div>
        </div>

        {/* Switch Report Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="group flex items-center gap-3 px-5 py-2.5 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-all shadow-sm active:scale-95"
          >
            <currentReport.icon className="w-4 h-4" />
            <span>Switch Analytics</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {isOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
              <div className="absolute left-0 mt-3 w-72 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-2xl shadow-emerald-900/20 z-50 py-3 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="px-5 py-2 mb-2">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Select Report Category</p>
                </div>
                <div className="max-h-[400px] overflow-y-auto no-scrollbar">
                  {reports.map((report) => (
                    <button
                      key={report.path}
                      onClick={() => {
                        navigate(report.path);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-5 py-3 text-left transition-all ${
                        location.pathname === report.path 
                          ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 font-bold' 
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <div className={`p-2 rounded-xl ${location.pathname === report.path ? 'bg-emerald-100 dark:bg-emerald-800/40' : 'bg-slate-50 dark:bg-slate-800'}`}>
                        <report.icon className="w-4 h-4" />
                      </div>
                      <span className="text-[13px] font-semibold">{report.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Date Range Picker Placeholder */}
        <button className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-emerald-500 transition-all shadow-sm">
          <Calendar className="w-4 h-4 text-emerald-600" />
          Last 30 Days
        </button>

        {/* Branch Filter Placeholder */}
        <button className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-emerald-500 transition-all shadow-sm">
          <Filter className="w-4 h-4 text-emerald-600" />
          All Branches
        </button>

        <div className="flex items-center gap-1">
          <button 
            onClick={onExportExcel}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-l-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-900/10"
          >
            <Download className="w-4 h-4" /> Excel
          </button>
          <button 
            onClick={onExportPDF}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 text-white rounded-r-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg"
          >
            <FileText className="w-4 h-4" /> PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default InsightsHeader;
