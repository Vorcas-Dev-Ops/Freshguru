import React, { useState } from 'react';
import { 
  Download, 
  CreditCard, 
  Wallet, 
  Banknote, 
  FileText, 
  Filter, 
  Calendar,
  ChevronRight,
  X,
  Printer,
  CheckCircle2,
  TrendingUp,
  Receipt,
  Package,
  Truck,
  Users,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  LayoutGrid,
  Search,
  MoreVertical,
  Layers,
  ShoppingBag,
  ExternalLink,
  ChevronDown
} from 'lucide-react';

const Reports = () => {
  const [activeTab, setActiveTab] = useState('sales');
  const [dateRange, setDateRange] = useState('This Month');

  const tabs = [
    { id: 'sales', label: 'Sales Overview', icon: BarChart3 },
    { id: 'products', label: 'Product Performance', icon: Package },
    { id: 'customers', label: 'Customer Insights', icon: Users },
    { id: 'delivery', label: 'Logistics & Delivery', icon: Truck },
    { id: 'inventory', label: 'Inventory Valuation', icon: Layers },
  ];

  const renderActiveReport = () => {
    switch (activeTab) {
      case 'sales': return <SalesReport />;
      case 'products': return <ProductPerformanceReport />;
      case 'customers': return <CustomerRevenueReport />;
      case 'delivery': return <DeliveryLogisticsReport />;
      case 'inventory': return <InventoryValuationReport />;
      default: return <SalesReport />;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* ERP Command Header */}
      <div className="flex flex-col xl:flex-row gap-8">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-[#0a4a34] rounded-lg flex items-center justify-center shadow-lg shadow-green-900/10">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Analytical Hub</h2>
          </div>
          <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Enterprise Reporting & Business Intelligence</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-white border border-slate-200 p-1.5 rounded-2xl shadow-sm">
            {['Today', 'This Week', 'This Month', 'FY 2026'].map((range) => (
              <button 
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${dateRange === range ? 'bg-[#0a4a34] text-white' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {range}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-6 py-3.5 bg-white border border-slate-200 text-slate-600 font-black text-[11px] uppercase tracking-widest rounded-2xl hover:bg-slate-50 transition-all active:scale-95 shadow-sm">
              <Printer className="w-4 h-4" /> PDF
            </button>
            <button className="flex items-center gap-2 px-6 py-3.5 bg-emerald-600 text-white font-black text-[11px] uppercase tracking-widest rounded-2xl hover:bg-emerald-700 transition-all active:scale-95 shadow-lg shadow-emerald-100">
              <Download className="w-4 h-4" /> Excel
            </button>
          </div>
        </div>
      </div>

      {/* Module Navigation Tabs - High Fidelity Implementation */}
      <div className="relative flex justify-center">
        <div className="w-full max-w-7xl flex items-center overflow-x-auto pb-4 no-scrollbar scroll-smooth">
          <div className="flex items-center gap-1.5 p-1.5 bg-slate-100/50 dark:bg-slate-800/50 backdrop-blur-md rounded-[32px] border border-slate-200/50 dark:border-slate-700/50 shadow-inner mx-auto">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-7 py-3.5 rounded-[24px] transition-all duration-500 shrink-0 relative group ${
                    isActive 
                    ? 'bg-white dark:bg-slate-900 text-[#0a4a34] dark:text-green-400 shadow-xl shadow-green-900/10 border border-[#0a4a34]/5' 
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                  }`}
                >
                  <tab.icon className={`w-5 h-5 transition-transform duration-500 group-hover:scale-110 ${isActive ? 'text-[#0a4a34] dark:text-green-400' : 'text-slate-300'}`} />
                  <span className={`text-[11px] font-black uppercase tracking-[0.15em] transition-all ${isActive ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}>
                    {tab.label}
                  </span>
                  
                  {/* Subtle active indicator dot */}
                  {isActive && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#0a4a34] dark:bg-green-400 rounded-full animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
        
        {/* Fading Edge Masks for Scroll */}
        <div className="absolute left-0 top-0 bottom-4 w-12 bg-gradient-to-r from-slate-50/50 dark:from-slate-950/50 to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-slate-50/50 dark:from-slate-950/50 to-transparent pointer-events-none" />
      </div>

      {/* Dynamic Report Content */}
      <div className="animate-in slide-in-from-bottom-4 duration-500">
        {renderActiveReport()}
      </div>
    </div>
  );
};

/* --- Sub-Reports Components --- */

const SalesReport = () => (
  <div className="space-y-8">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <StatBox label="Total Revenue" value="₹42.85L" trend="+12.4%" color="emerald" />
      <StatBox label="Net Profit" value="₹8.42L" trend="+5.2%" color="blue" />
      <StatBox label="Total Tax (GST)" value="₹2.14L" trend="+8.1%" color="orange" />
      <StatBox label="Avg Order Value" value="₹8,240" trend="-2.1%" color="red" />
    </div>

    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500">
      <div className="px-8 py-6 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between bg-slate-50/20 dark:bg-slate-800/20">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-4 bg-emerald-500 rounded-full" />
          <h3 className="text-[12px] font-black text-slate-900 dark:text-white uppercase tracking-widest">Revenue Progression Portfolio</h3>
        </div>
        <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 hover:text-slate-600 transition-colors bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-700">
          Last 6 Months <ChevronDown className="w-3 h-3" />
        </button>
      </div>
      <div className="p-10">
        <div className="h-64 flex items-end gap-6 justify-between px-4 border-b border-slate-100 dark:border-slate-800 relative">
          {/* Chart Grid Lines */}
          {[0, 25, 50, 75, 100].map((level) => (
            <div key={level} className="absolute left-0 right-0 border-t border-slate-50 dark:border-slate-800/50" style={{ bottom: `${level}%` }} />
          ))}
          
          {/* Simulated Chart Bars */}
          {[65, 45, 85, 70, 95, 80].map((height, i) => (
            <div key={i} className="flex-1 group relative flex flex-col items-center z-10">
              <div 
                className="w-full bg-gradient-to-t from-[#0a4a34] to-emerald-500 dark:from-emerald-900 dark:to-emerald-500 rounded-t-2xl transition-all duration-700 ease-out group-hover:scale-y-105 group-hover:brightness-110 shadow-lg shadow-green-900/5 cursor-pointer" 
                style={{ height: `${height}%` }}
              >
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-emerald-600 text-white px-3 py-1.5 rounded-xl text-[10px] font-black opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap shadow-2xl translate-y-2 group-hover:translate-y-0">
                  ₹{(height * 10000).toLocaleString()}
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 dark:bg-emerald-600 rotate-45" />
                </div>
              </div>
              <span className="absolute -bottom-10 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>

    <ReportTable 
      title="Recent Financial Transactions"
      headers={['Transaction ID', 'Customer', 'Date', 'Amount', 'Tax', 'Profit', 'Status']}
      rows={[
        ['#TX-9082', 'Metro Gourmet', '08 May 2026', '₹14,500', '₹725', '₹2,800', 'Success'],
        ['#TX-9081', 'Fresh Mart', '08 May 2026', '₹8,920', '₹446', '₹1,450', 'Success'],
        ['#TX-9080', 'Green Grocers', '07 May 2026', '₹22,100', '₹1,105', '₹4,120', 'Success'],
      ]}
    />
  </div>
);

const ProductPerformanceReport = () => (
  <div className="space-y-8">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-white border border-slate-100 rounded-[32px] p-8 shadow-sm">
        <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-6">Top Performing Categories</h4>
        <div className="space-y-6">
          {[
            { label: 'Vegetables', val: '45%', color: 'bg-emerald-500' },
            { label: 'Fruits', val: '32%', color: 'bg-blue-500' },
            { label: 'Dairy & Poultry', val: '15%', color: 'bg-orange-500' },
            { label: 'Organic Pulses', val: '8%', color: 'bg-purple-500' },
          ].map((cat, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between text-[11px] font-black uppercase tracking-tight">
                <span className="text-slate-600">{cat.label}</span>
                <span className="text-slate-900">{cat.val}</span>
              </div>
              <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                <div className={`h-full ${cat.color} rounded-full`} style={{ width: cat.val }} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white border border-slate-100 rounded-[32px] p-8 shadow-sm flex flex-col justify-center items-center text-center">
        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mb-6">
          <TrendingUp className="w-10 h-10" />
        </div>
        <h4 className="text-2xl font-black text-slate-900 tracking-tighter">Product Efficiency</h4>
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-2 max-w-[240px]">
          78% of your inventory is rotating within the 48-hour freshness window.
        </p>
      </div>
    </div>

    <ReportTable 
      title="SKU Performance Analysis"
      headers={['Product Name', 'Category', 'Units Sold', 'Revenue Generated', 'Profit Margin', 'Status']}
      rows={[
        ['Alphonso Mangoes', 'Fruit', '840 Crates', '₹8.40L', '22%', 'High Demand'],
        ['Premium Broccoli', 'Vegetable', '1.2 Tons', '₹3.20L', '18%', 'Steady'],
        ['Organic Red Onions', 'Vegetable', '4.5 Tons', '₹1.80L', '12%', 'High Vol'],
        ['Full Cream Milk', 'Dairy', '2,400 Units', '₹1.44L', '8%', 'Staple'],
      ]}
    />
  </div>
);

const CustomerRevenueReport = () => (
  <div className="space-y-8">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatBox label="Active Clients" value="1,240" trend="+42" color="blue" />
      <StatBox label="Repeat Order Rate" value="84%" trend="+2.1%" color="emerald" />
      <StatBox label="Avg Customer LTV" value="₹2.4L" trend="+12%" color="purple" />
    </div>

    <ReportTable 
      title="High-Value Client Portfolio"
      headers={['Customer Name', 'City', 'Total Orders', 'Revenue (LTD)', 'Outstanding', 'Tier']}
      rows={[
        ['Metro Gourmet Hotels', 'Bangalore', '142', '₹28.40L', '₹0', 'Platinum'],
        ['The Fresh Kitchen', 'Mumbai', '98', '₹15.20L', '₹14,200', 'Gold'],
        ['Green Mart Retail', 'Chennai', '76', '₹12.85L', '₹0', 'Gold'],
        ['Organic Soul Cafe', 'Bangalore', '45', '₹4.20L', '₹2,100', 'Silver'],
      ]}
    />
  </div>
);

const DeliveryLogisticsReport = () => (
  <div className="space-y-8">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-[#0a4a34] rounded-[40px] p-10 text-white shadow-xl shadow-green-900/20">
        <h4 className="text-[11px] font-black uppercase tracking-[0.2em] opacity-60 mb-8">Logistics Health</h4>
        <div className="flex items-end gap-10">
          <div>
            <p className="text-[10px] font-black uppercase opacity-60 mb-1">On-Time Rate</p>
            <p className="text-5xl font-black tracking-tighter">96.4%</p>
          </div>
          <div className="flex-1 h-20 flex items-end gap-2">
            {[30, 45, 25, 60, 40, 70, 50].map((h, i) => (
              <div key={i} className="flex-1 bg-white/20 rounded-full" style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white border border-slate-100 rounded-[32px] p-8 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Deliveries</p>
          <p className="text-3xl font-black text-slate-900">8,420</p>
          <div className="mt-4 flex items-center gap-2 text-[10px] font-black text-emerald-600 bg-emerald-50 w-fit px-2 py-1 rounded-lg">
            <ArrowUpRight className="w-3 h-3" /> 14%
          </div>
        </div>
        <div className="bg-white border border-slate-100 rounded-[32px] p-8 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Damaged/Rejected</p>
          <p className="text-3xl font-black text-slate-900">1.2%</p>
          <div className="mt-4 flex items-center gap-2 text-[10px] font-black text-red-600 bg-red-50 w-fit px-2 py-1 rounded-lg">
            <ArrowDownRight className="w-3 h-3" /> 0.2%
          </div>
        </div>
      </div>
    </div>

    <ReportTable 
      title="Driver Performance Matrix"
      headers={['Driver Name', 'Fleet ID', 'Trips Completed', 'Distance Covered', 'Avg Feedback', 'Status']}
      rows={[
        ['Suresh Kumar', 'FL-001', '420', '1,240 KM', '4.8/5', 'Elite'],
        ['Anil Singh', 'FL-005', '385', '980 KM', '4.5/5', 'Standard'],
        ['Rajesh V', 'FL-008', '310', '1,120 KM', '4.9/5', 'Elite'],
        ['Vikas Prabhu', 'FL-012', '240', '840 KM', '4.2/5', 'Standard'],
      ]}
    />
  </div>
);

const InventoryValuationReport = () => (
  <div className="space-y-8">
    <div className="bg-white border border-slate-100 rounded-[40px] p-10 shadow-sm flex flex-col md:flex-row justify-between items-center">
      <div className="space-y-2 text-center md:text-left mb-8 md:mb-0">
        <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Total Stock Valuation</h4>
        <p className="text-6xl font-black text-slate-900 tracking-tighter">₹12.45 Cr</p>
        <p className="text-[11px] font-black text-emerald-600 uppercase tracking-widest">+₹1.2M VS LAST QUARTER</p>
      </div>
      <div className="flex gap-12">
        <div className="text-center">
          <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Categories</p>
          <p className="text-2xl font-black text-slate-900">12</p>
        </div>
        <div className="text-center">
          <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Unique SKUs</p>
          <p className="text-2xl font-black text-slate-900">482</p>
        </div>
        <div className="text-center">
          <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Depreciation</p>
          <p className="text-2xl font-black text-red-600">4.2%</p>
        </div>
      </div>
    </div>

    <ReportTable 
      title="Category-wise Valuation"
      headers={['Category', 'Stock Units', 'Wholesale Value', 'Estimated Retail', 'Expected Profit', 'Trend']}
      rows={[
        ['Vegetables', '12.4 Tons', '₹1.24 Cr', '₹1.85 Cr', '₹61L', 'Steady'],
        ['Fruits', '8.2 Tons', '₹3.40 Cr', '₹4.85 Cr', '₹1.45 Cr', 'Rising'],
        ['Dairy', '4,200 Units', '₹42L', '₹58L', '₹16L', 'Stable'],
        ['Frozen Goods', '1,800 Units', '₹24L', '₹32L', '₹8L', 'Steady'],
      ]}
    />
  </div>
);

/* --- Reusable Report UI Elements --- */

const StatBox = ({ label, value, trend, color }) => {
  const colors = {
    emerald: { 
      bg: 'bg-emerald-50 dark:bg-emerald-500/10', 
      text: 'text-emerald-600 dark:text-emerald-400', 
      border: 'border-emerald-100 dark:border-emerald-500/20',
      icon: Wallet
    },
    blue: { 
      bg: 'bg-blue-50 dark:bg-blue-500/10', 
      text: 'text-blue-600 dark:text-blue-400', 
      border: 'border-blue-100 dark:border-blue-500/20',
      icon: Banknote
    },
    orange: { 
      bg: 'bg-orange-50 dark:bg-orange-500/10', 
      text: 'text-orange-600 dark:text-orange-400', 
      border: 'border-orange-100 dark:border-orange-500/20',
      icon: Receipt
    },
    red: { 
      bg: 'bg-red-50 dark:bg-red-500/10', 
      text: 'text-red-600 dark:text-red-400', 
      border: 'border-red-100 dark:border-red-500/20',
      icon: TrendingUp
    },
    purple: { 
      bg: 'bg-purple-50 dark:bg-purple-500/10', 
      text: 'text-purple-600 dark:text-purple-400', 
      border: 'border-purple-100 dark:border-purple-500/20',
      icon: Users
    },
  };

  const c = colors[color] || colors.emerald;
  const Icon = c.icon;

  return (
    <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm group hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-500 relative overflow-hidden">
      <div className={`absolute top-0 right-0 w-32 h-32 ${c.bg} rounded-full -mr-16 -mt-16 opacity-20 group-hover:scale-110 transition-transform duration-700`} />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className={`w-12 h-12 ${c.bg} ${c.text} rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:rotate-12`}>
            <Icon className="w-6 h-6" />
          </div>
          <div className={`flex items-center gap-1.5 text-[10px] font-black ${c.text} ${c.bg} px-3 py-1.5 rounded-full border ${c.border} shadow-sm`}>
            {trend.startsWith('+') ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
            {trend}
          </div>
        </div>
        
        <p className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.15em] mb-1">{label}</p>
        <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter tabular-nums">{value}</h3>
        
        <div className="mt-4 h-1 w-full bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden">
          <div className={`h-full ${c.bg.replace('-50', '-500')} w-2/3 rounded-full opacity-30 group-hover:opacity-100 transition-all duration-1000`} />
        </div>
      </div>
    </div>
  );
};

const ReportTable = ({ title, headers, rows }) => (
  <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[40px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500">
    <div className="px-10 py-8 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between bg-slate-50/30 dark:bg-slate-800/30 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 bg-[#0a4a34] dark:bg-green-400 rounded-full animate-pulse" />
        <h3 className="text-[12px] font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">{title}</h3>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl shadow-inner">
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <input type="text" placeholder="Filter..." className="bg-transparent border-none text-[10px] font-bold text-slate-600 dark:text-slate-300 focus:ring-0 w-24" />
        </div>
        <button className="p-2.5 text-slate-400 hover:text-[#0a4a34] dark:hover:text-green-400 transition-all bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 hover:shadow-lg"><Download className="w-4 h-4" /></button>
        <button className="p-2.5 text-slate-400 hover:text-[#0a4a34] dark:hover:text-green-400 transition-all bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 hover:shadow-lg"><Filter className="w-4 h-4" /></button>
      </div>
    </div>
    <div className="overflow-x-auto no-scrollbar">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-slate-50/10 dark:bg-slate-800/10">
            {headers.map((h, i) => (
              <th key={i} className="px-10 py-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.15em] border-b border-slate-50 dark:border-slate-800">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
          {rows.map((row, i) => (
            <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-all group">
              {row.map((cell, j) => {
                const isStatus = cell === 'Success' || cell === 'Elite' || cell === 'Platinum' || cell === 'Gold' || cell === 'High Demand';
                const isAmount = cell.startsWith('₹') || cell.includes('L') || cell.includes('Cr');
                
                return (
                  <td key={j} className="px-10 py-7 transition-all group-hover:translate-x-1">
                    {isStatus ? (
                      <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20">
                        {cell}
                      </span>
                    ) : (
                      <span className={`text-[14px] font-bold ${isAmount ? 'text-[#0a4a34] dark:text-green-400 font-black tabular-nums' : 'text-slate-700 dark:text-slate-300'} tracking-tight`}>
                        {cell}
                      </span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default Reports;
