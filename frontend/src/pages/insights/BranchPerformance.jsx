import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, AreaChart, Area, Legend, ComposedChart
} from 'recharts';
import { 
  Building2, ShoppingBag, TrendingUp, Users, 
  MapPin, PieChart, Activity, Globe
} from 'lucide-react';
import StatCard from './components/StatCard';
import InsightsHeader from './components/InsightsHeader';
import InsightsTable from './components/InsightsTable';

const BranchPerformance = () => {
  const branchComparison = [
    { name: 'Main Branch', revenue: 850000, orders: 420 },
    { name: 'North Hub', revenue: 620000, orders: 310 },
    { name: 'East Plaza', revenue: 480000, orders: 240 },
    { name: 'West Wing', revenue: 510000, orders: 255 },
    { name: 'South Center', revenue: 420000, orders: 210 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <InsightsHeader 
        title="Branch Performance" 
        subtitle="Comparative analysis across all business locations"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Branches" value="5" trend="+1" icon={Building2} color="emerald" />
        <StatCard label="Avg. Branch Revenue" value="₹5.76L" trend="+4.2%" icon={TrendingUp} color="blue" />
        <StatCard label="Top Branch" value="Main Branch" sub="₹8.5L" icon={MapPin} color="purple" />
        <StatCard label="Total Staff" value="84" trend="+12" icon={Users} color="orange" />
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm">
        <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight mb-8">Branch Revenue vs Order Volume</h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={branchComparison}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}} tickFormatter={(v) => `₹${v/1000}k`} />
              <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
              <Legend iconType="circle" wrapperStyle={{paddingTop: '20px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase'}} />
              <Bar dataKey="revenue" name="Total Revenue" fill="#10b981" radius={[10, 10, 0, 0]} />
              <Bar dataKey="orders" name="Order Count" fill="#3b82f6" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <InsightsTable 
        title="Branch Efficiency Metrics"
        headers={['Branch Name', 'Manager', 'Monthly Revenue', 'Profit Margin', 'Delivery Success']}
        rows={[
          ['Main Branch', 'Ravi Kant', '₹8,50,000', '24%', '98.5%'],
          ['North Hub', 'Sanjay Dutt', '₹6,20,000', '21%', '94.2%'],
          ['East Plaza', 'Anil Kapoor', '₹4,80,000', '18%', '96.8%'],
          ['West Wing', 'Sunil Shetty', '₹5,10,000', '22%', '95.5%'],
          ['South Center', 'Akshay Kumar', '₹4,20,000', '19%', '92.4%'],
        ]}
      />
    </div>
  );
};

export default BranchPerformance;
