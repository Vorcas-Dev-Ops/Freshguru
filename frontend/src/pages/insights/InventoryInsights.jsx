import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { 
  Package, AlertTriangle, TrendingDown, Layers, 
  ClipboardList, PackageCheck, PackageX, History
} from 'lucide-react';
import StatCard from './components/StatCard';
import InsightsHeader from './components/InsightsHeader';
import InsightsTable from './components/InsightsTable';

const InventoryInsights = () => {
  const stockLevels = [
    { name: 'Tomato', current: 450, min: 200 },
    { name: 'Potato', current: 120, min: 300 },
    { name: 'Onion', current: 800, min: 400 },
    { name: 'Apple', current: 250, min: 100 },
    { name: 'Milk', current: 50, min: 150 },
  ];

  const stockDistribution = [
    { name: 'Fresh Produce', value: 45, color: '#10b981' },
    { name: 'Dairy', value: 20, color: '#3b82f6' },
    { name: 'Dry Goods', value: 25, color: '#f59e0b' },
    { name: 'Others', value: 10, color: '#6366f1' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <InsightsHeader 
        title="Inventory Insights" 
        subtitle="Real-time stock analytics and forecasting"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard label="Total Stock Value" value="₹24.8L" trend="+5.2%" icon={Layers} color="emerald" />
        <StatCard label="Out of Stock" value="8 items" trend="+2" icon={PackageX} color="red" />
        <StatCard label="Low Stock Items" value="12 items" trend="-4" icon={AlertTriangle} color="orange" />
        <StatCard label="Damaged Stock" value="₹12,450" trend="-15%" icon={TrendingDown} color="red" />
        <StatCard label="Stock Turnover" value="4.2x" trend="+0.5" icon={History} color="blue" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm">
          <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight mb-8">Stock Level Monitoring</h3>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stockLevels}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}} />
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Legend iconType="circle" wrapperStyle={{paddingTop: '20px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase'}} />
                <Bar dataKey="current" name="Current Stock" fill="#10b981" radius={[8, 8, 0, 0]} />
                <Bar dataKey="min" name="Minimum Threshold" fill="#f43f5e" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm flex flex-col">
          <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight mb-8">Inventory Distribution</h3>
          <div className="flex-1 h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stockDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stockDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend layout="vertical" align="right" verticalAlign="middle" iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 p-4 bg-orange-50 dark:bg-orange-900/10 rounded-2xl border border-orange-100 dark:border-orange-500/20">
            <div className="flex items-center gap-2 text-orange-700 dark:text-orange-400 mb-1">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Inventory Alert</span>
            </div>
            <p className="text-xs font-bold text-orange-600 dark:text-orange-300">Tomato stock is expected to fall below critical threshold within 48 hours.</p>
          </div>
        </div>
      </div>

      <InsightsTable 
        title="Inventory Movement Analytics"
        headers={['Product', 'Warehouse', 'Units In', 'Units Out', 'Turnover Rate']}
        rows={[
          ['Premium Tomatoes', 'Main Warehouse', '4,500 kg', '3,800 kg', 'High (5.2x)'],
          ['Organic Onions', 'Main Warehouse', '8,000 kg', '6,200 kg', 'Medium (3.8x)'],
          ['Farm Milk', 'Cold Storage', '2,400 L', '2,350 L', 'Critical (12.4x)'],
          ['Green Apples', 'North Hub', '1,200 kg', '450 kg', 'Low (1.2x)'],
          ['Basmati Rice', 'North Hub', '5,000 kg', '1,200 kg', 'Slow (0.8x)'],
        ]}
      />
    </div>
  );
};

export default InventoryInsights;
