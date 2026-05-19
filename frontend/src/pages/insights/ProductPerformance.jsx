import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Cell, PieChart, Pie, Legend
} from 'recharts';
import { 
  ShoppingBag, Star, TrendingUp, TrendingDown, 
  Package, Tag, Award, BarChart3
} from 'lucide-react';
import StatCard from './components/StatCard';
import InsightsHeader from './components/InsightsHeader';
import InsightsTable from './components/InsightsTable';

const ProductPerformance = () => {
  const topProducts = [
    { name: 'Tomatoes', sales: 4500, profit: 1200 },
    { name: 'Potatoes', sales: 3800, profit: 800 },
    { name: 'Onions', sales: 3200, profit: 600 },
    { name: 'Apples', sales: 2800, profit: 1400 },
    { name: 'Milk', sales: 2400, profit: 400 },
  ];

  const categoryPerformance = [
    { name: 'Vegetables', value: 45, color: '#10b981' },
    { name: 'Fruits', value: 25, color: '#3b82f6' },
    { name: 'Dairy', value: 20, color: '#f59e0b' },
    { name: 'Others', value: 10, color: '#6366f1' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <InsightsHeader 
        title="Product Performance" 
        subtitle="SKU-level profitability and sales analytics"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Top Selling SKU" value="Premium Tomatoes" sub="1,240 kg" icon={Award} color="emerald" />
        <StatCard label="Highest Margin" value="Green Apples" sub="32%" icon={TrendingUp} color="blue" />
        <StatCard label="Slowest Mover" value="Basmati Rice" sub="0.8x turn" icon={TrendingDown} color="red" />
        <StatCard label="Total SKU Count" value="842" trend="+14" icon={Tag} color="purple" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm">
          <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight mb-8">Top Products: Sales vs Profit</h3>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProducts}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}} />
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Legend iconType="circle" wrapperStyle={{paddingTop: '20px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase'}} />
                <Bar dataKey="sales" name="Sales Volume" fill="#10b981" radius={[8, 8, 0, 0]} />
                <Bar dataKey="profit" name="Gross Profit" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm">
          <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight mb-8">Category Revenue Share</h3>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryPerformance}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryPerformance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <InsightsTable 
        title="SKU Profitability Matrix"
        headers={['Product Name', 'Cost Price', 'Selling Price', 'Profit/Unit', 'Sales Velocity']}
        rows={[
          ['Premium Tomatoes', '₹35/kg', '₹50/kg', '₹15', 'Very High'],
          ['Organic Onions', '₹18/kg', '₹25/kg', '₹7', 'High'],
          ['Green Apples', '₹85/kg', '₹120/kg', '₹35', 'Medium'],
          ['Farm Milk', '₹42/L', '₹60/L', '₹18', 'Critical'],
          ['Basmati Rice', '₹95/kg', '₹120/kg', '₹25', 'Low'],
        ]}
      />
    </div>
  );
};

export default ProductPerformance;
