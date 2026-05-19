import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, AreaChart, Area, Legend
} from 'recharts';
import { 
  TrendingUp, ShoppingBag, PieChart, Calendar, 
  ArrowUpRight, ArrowDownRight, Layers, Target
} from 'lucide-react';
import StatCard from './components/StatCard';
import InsightsHeader from './components/InsightsHeader';
import InsightsTable from './components/InsightsTable';

const SalesAnalytics = () => {
  const salesTrend = [
    { name: 'Week 1', revenue: 245000, target: 200000 },
    { name: 'Week 2', revenue: 312000, target: 200000 },
    { name: 'Week 3', revenue: 289000, target: 200000 },
    { name: 'Week 4', revenue: 421000, target: 200000 },
  ];

  const categorySales = [
    { name: 'Vegetables', value: 45 },
    { name: 'Fruits', value: 25 },
    { name: 'Dairy', value: 15 },
    { name: 'Grains', value: 15 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <InsightsHeader 
        title="Sales Analytics" 
        subtitle="Deep dive into revenue streams and growth"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Daily Sales" value="₹64,280" trend="+14.2%" icon={Calendar} color="emerald" />
        <StatCard label="Weekly Revenue" value="₹4.12L" trend="+8.5%" icon={TrendingUp} color="blue" />
        <StatCard label="Monthly Revenue" value="₹18.4L" trend="+12.1%" icon={ShoppingBag} color="purple" />
        <StatCard label="Average Order Value" value="₹8,240" trend="+4.2%" icon={Target} color="orange" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm">
          <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight mb-8">Weekly Revenue vs Target</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}} tickFormatter={(v) => `₹${v/1000}k`} />
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Legend iconType="circle" wrapperStyle={{paddingTop: '20px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase'}} />
                <Bar dataKey="revenue" name="Actual Revenue" fill="#10b981" radius={[10, 10, 0, 0]} />
                <Line type="monotone" dataKey="target" name="Target" stroke="#64748b" strokeWidth={2} strokeDasharray="5 5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm">
          <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight mb-8">Revenue by Category</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categorySales} layout="vertical">
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#64748b'}} width={100} />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="value" name="Contribution %" fill="#3b82f6" radius={[0, 10, 10, 0]} barSize={25} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <InsightsTable 
        title="Top Performing Products"
        headers={['Product', 'Category', 'Units Sold', 'Revenue', 'Profit Margin']}
        rows={[
          ['Premium Tomatoes', 'Vegetables', '1,240 kg', '₹62,000', '24%'],
          ['Organic Onions', 'Vegetables', '2,100 kg', '₹84,000', '18%'],
          ['Green Apples', 'Fruits', '450 kg', '₹54,000', '32%'],
          ['Farm Milk', 'Dairy', '800 L', '₹48,000', '15%'],
          ['Basmati Rice', 'Grains', '600 kg', '₹72,000', '21%'],
        ]}
      />
    </div>
  );
};

export default SalesAnalytics;
