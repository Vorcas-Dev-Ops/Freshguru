import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, AreaChart, Area, Legend, ComposedChart
} from 'recharts';
import { 
  Landmark, Wallet, Banknote, TrendingUp, 
  TrendingDown, PieChart, Calculator, FileText
} from 'lucide-react';
import StatCard from './components/StatCard';
import InsightsHeader from './components/InsightsHeader';
import InsightsTable from './components/InsightsTable';

const FinancialInsights = () => {
  const pnlData = [
    { name: 'Jan', revenue: 450000, expense: 320000, profit: 130000 },
    { name: 'Feb', revenue: 520000, expense: 340000, profit: 180000 },
    { name: 'Mar', revenue: 480000, expense: 350000, profit: 130000 },
    { name: 'Apr', revenue: 610000, expense: 410000, profit: 200000 },
    { name: 'May', revenue: 550000, expense: 380000, profit: 170000 },
    { name: 'Jun', revenue: 670000, expense: 420000, profit: 250000 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <InsightsHeader 
        title="Financial Insights" 
        subtitle="Consolidated ERP financial statements and cash flow"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Net Profit" value="₹2.45L" trend="+18.2%" icon={TrendingUp} color="emerald" />
        <StatCard label="Gross Revenue" value="₹12.8L" trend="+12.4%" icon={Landmark} color="blue" />
        <StatCard label="Total Expenses" value="₹8.4L" trend="+5.2%" icon={Wallet} color="red" />
        <StatCard label="Tax Liability" value="₹1.2L" trend="+2.1%" icon={Calculator} color="orange" />
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm">
        <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight mb-8">Profit & Loss Trend</h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={pnlData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}} tickFormatter={(v) => `₹${v/1000}k`} />
              <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
              <Legend iconType="circle" wrapperStyle={{paddingTop: '20px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase'}} />
              <Bar dataKey="revenue" name="Total Revenue" fill="#10b981" radius={[8, 8, 0, 0]} />
              <Bar dataKey="expense" name="Operating Expenses" fill="#f43f5e" radius={[8, 8, 0, 0]} />
              <Line type="monotone" dataKey="profit" name="Net Profit" stroke="#3b82f6" strokeWidth={4} dot={{r: 6, fill: '#3b82f6', strokeWidth: 3, stroke: '#fff'}} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2">
          <InsightsTable 
            title="Expense Breakdown"
            headers={['Expense Category', 'Budgeted', 'Actual', 'Variance', 'Status']}
            rows={[
              ['Logistics & Fuel', '₹80,000', '₹92,000', '+15%', 'Over'],
              ['Warehouse Rent', '₹1,20,000', '₹1,20,000', '0%', 'On Track'],
              ['Staff Salaries', '₹4,50,000', '₹4,45,000', '-1.1%', 'Healthy'],
              ['Marketing', '₹50,000', '₹42,000', '-16%', 'Under'],
              ['Utilities', '₹15,000', '₹18,000', '+20%', 'Critical'],
            ]}
          />
        </div>
        <div className="bg-[#0a4a34] rounded-[2.5rem] p-8 text-white relative overflow-hidden group shadow-xl flex flex-col justify-between">
          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md">
              <FileText className="w-6 h-6 text-emerald-300" />
            </div>
            <h3 className="text-2xl font-black tracking-tighter mb-2">Financial Health</h3>
            <p className="text-emerald-100/60 text-xs font-bold leading-relaxed">
              Your business liquidity is currently at <span className="text-white font-black">1.8x</span>, which is considered highly stable for seasonal operations.
            </p>
          </div>
          <button className="relative z-10 mt-8 w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-[#0a4a34] font-black text-[10px] uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-emerald-900/40">
            Generate Q2 Audit Report
          </button>
          <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-white/5 rounded-full blur-[100px]" />
        </div>
      </div>
    </div>
  );
};

export default FinancialInsights;
