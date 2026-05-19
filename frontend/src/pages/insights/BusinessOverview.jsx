import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';
import { 
  TrendingUp, Users, ShoppingBag, Package, Wallet, Clock, 
  AlertCircle, ArrowUpRight, ArrowDownRight, Activity
} from 'lucide-react';
import StatCard from './components/StatCard';
import InsightsHeader from './components/InsightsHeader';
import InsightsTable from './components/InsightsTable';

const BusinessOverview = () => {
  // Mock data
  const dailySales = [
    { name: 'Mon', revenue: 45000, orders: 12 },
    { name: 'Tue', revenue: 52000, orders: 15 },
    { name: 'Wed', revenue: 48000, orders: 14 },
    { name: 'Thu', revenue: 61000, orders: 18 },
    { name: 'Fri', revenue: 55000, orders: 16 },
    { name: 'Sat', revenue: 67000, orders: 20 },
    { name: 'Sun', revenue: 72000, orders: 22 },
  ];

  const branchPerformance = [
    { name: 'Main Branch', revenue: 450000 },
    { name: 'North Hub', revenue: 320000 },
    { name: 'East Plaza', revenue: 280000 },
    { name: 'West Wing', revenue: 310000 },
  ];

  const alertData = [
    { label: 'Low Stock Alerts', value: '14 items', icon: AlertCircle, color: 'text-red-500' },
    { label: 'Overdue Invoices', value: '₹1.2L', icon: Clock, color: 'text-orange-500' },
    { label: 'Failed Deliveries', value: '3 today', icon: ShoppingBag, color: 'text-red-400' },
    { label: 'New Partners', value: '+12', icon: Users, color: 'text-emerald-500' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <InsightsHeader 
        title="Business Overview" 
        subtitle="Real-time Command Center & Store Intelligence"
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <StatCard label="Total Revenue" value="₹12.45L" trend="+12.5%" icon={TrendingUp} color="emerald" />
        <StatCard label="Total Orders" value="1,240" trend="+8.2%" icon={ShoppingBag} color="blue" />
        <StatCard label="Active Customers" value="482" trend="+5.4%" icon={Users} color="purple" />
        <StatCard label="Pending Deliveries" value="24" trend="-2.1%" icon={Activity} color="orange" />
        <StatCard label="Outstanding Payments" value="₹4.8L" trend="+1.2%" icon={Wallet} color="red" />
        <StatCard label="Low Stock Items" value="14" trend="-3" icon={Package} color="red" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Sales Graph */}
        <div className="xl:col-span-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Daily Sales Performance</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Revenue vs Order Volume</p>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 p-1 rounded-xl">
              <button className="px-4 py-1.5 bg-white dark:bg-slate-700 text-[#0a4a34] dark:text-emerald-400 rounded-lg text-[10px] font-black uppercase shadow-sm">Revenue</button>
              <button className="px-4 py-1.5 text-slate-400 rounded-lg text-[10px] font-black uppercase">Orders</button>
            </div>
          </div>
          
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailySales}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}}
                  tickFormatter={(value) => `₹${value/1000}k`}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  cursor={{ stroke: '#10b981', strokeWidth: 2 }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorRev)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Alerts & Sidebar Stats */}
        <div className="space-y-8">
          <div className="bg-[#0a4a34] rounded-[2.5rem] p-8 text-white relative overflow-hidden group shadow-xl">
            <h3 className="text-lg font-black tracking-tight mb-6 relative z-10">Intelligence Alerts</h3>
            <div className="space-y-4 relative z-10">
              {alertData.map((alert, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center ${alert.color}`}>
                      <alert.icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-emerald-50/80">{alert.label}</span>
                  </div>
                  <span className="text-sm font-black text-white">{alert.value}</span>
                </div>
              ))}
            </div>
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight mb-6">Branch Distribution</h3>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={branchPerformance} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    axisLine={false} 
                    tickLine={false}
                    tick={{fontSize: 10, fontWeight: 'bold', fill: '#64748b'}}
                    width={80}
                  />
                  <Tooltip cursor={{fill: 'transparent'}} />
                  <Bar dataKey="revenue" fill="#10b981" radius={[0, 10, 10, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <InsightsTable 
        title="Recent Operational Activity"
        headers={['Reference', 'Entity', 'Type', 'Status', 'Value']}
        rows={[
          ['ORD-9281', 'Kishan Fresh Mart', 'Sales', 'Delivered', '₹12,450'],
          ['PUR-4412', 'Vikas Trading Co', 'Purchase', 'Pending', '₹45,000'],
          ['EXP-1102', 'Warehouse Fuel', 'Expense', 'Approved', '₹3,200'],
          ['ORD-9280', 'Green Grocers', 'Sales', 'Delivered', '₹8,920'],
          ['ORD-9279', 'City Supermarket', 'Sales', 'Delivered', '₹15,100'],
        ]}
      />
    </div>
  );
};

export default BusinessOverview;
