import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, Legend, AreaChart, Area
} from 'recharts';
import { 
  Users, UserPlus, UserCheck, CreditCard, 
  TrendingUp, Award, Clock, Heart
} from 'lucide-react';
import StatCard from './components/StatCard';
import InsightsHeader from './components/InsightsHeader';
import InsightsTable from './components/InsightsTable';

const CustomerInsights = () => {
  const acquisitionData = [
    { name: 'Jan', organic: 45, referral: 12 },
    { name: 'Feb', organic: 52, referral: 18 },
    { name: 'Mar', organic: 48, referral: 25 },
    { name: 'Apr', organic: 61, referral: 32 },
    { name: 'May', organic: 55, referral: 28 },
    { name: 'Jun', organic: 67, referral: 35 },
  ];

  const retentionTrend = [
    { name: 'Jan', rate: 78 },
    { name: 'Feb', rate: 82 },
    { name: 'Mar', rate: 80 },
    { name: 'Apr', rate: 85 },
    { name: 'May', rate: 84 },
    { name: 'Jun', rate: 88 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <InsightsHeader 
        title="Customer Insights" 
        subtitle="Behavioral analytics and loyalty mapping"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Customers" value="2,480" trend="+12.4%" icon={Users} color="emerald" />
        <StatCard label="Frequent Buyers" value="482" trend="+8.2%" icon={UserCheck} color="blue" />
        <StatCard label="Credit Customers" value="124" trend="+5.4%" icon={CreditCard} color="orange" />
        <StatCard label="Customer Retention" value="88.2%" trend="+2.1%" icon={Heart} color="purple" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm">
          <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight mb-8">Customer Acquisition Channels</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={acquisitionData}>
                <defs>
                  <linearGradient id="colorOrg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}} />
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Legend iconType="circle" wrapperStyle={{paddingTop: '20px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase'}} />
                <Area type="monotone" dataKey="organic" name="Organic Growth" stroke="#10b981" fillOpacity={1} fill="url(#colorOrg)" />
                <Area type="monotone" dataKey="referral" name="Referral Program" stroke="#3b82f6" fillOpacity={0} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm">
          <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight mb-8">Retention Index Trend</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={retentionTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}} domain={[60, 100]} />
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Line type="monotone" dataKey="rate" name="Retention %" stroke="#8b5cf6" strokeWidth={3} dot={{r: 4, fill: '#8b5cf6', strokeWidth: 2, stroke: '#fff'}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <InsightsTable 
        title="Top Revenue Contributors"
        headers={['Customer Name', 'Total Orders', 'Revenue Share', 'Outstanding Dues', 'Loyalty Tier']}
        rows={[
          ['Kishan Fresh Mart', '142', '₹4.8L', '₹12,400', 'Platinum'],
          ['Green Grocers Hub', '98', '₹2.1L', '₹0', 'Gold'],
          ['City Supermarket', '85', '₹1.9L', '₹4,500', 'Gold'],
          ['Healthy Choice', '64', '₹1.2L', '₹8,200', 'Silver'],
          ['Prakash Retail', '42', '₹0.9L', '₹1,500', 'Silver'],
        ]}
      />
    </div>
  );
};

export default CustomerInsights;
