import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, Legend, AreaChart, Area
} from 'recharts';
import { 
  Truck, Clock, MapPin, CheckCircle2, 
  AlertCircle, Activity, TrendingUp, User
} from 'lucide-react';
import StatCard from './components/StatCard';
import InsightsHeader from './components/InsightsHeader';
import InsightsTable from './components/InsightsTable';

const DeliveryInsights = () => {
  const deliveryPerformance = [
    { name: 'Mon', successful: 42, failed: 2 },
    { name: 'Tue', successful: 38, failed: 4 },
    { name: 'Wed', successful: 45, failed: 1 },
    { name: 'Thu', successful: 52, failed: 3 },
    { name: 'Fri', successful: 48, failed: 2 },
    { name: 'Sat', successful: 60, failed: 5 },
    { name: 'Sun', successful: 65, failed: 2 },
  ];

  const avgTimeTrend = [
    { name: 'Week 1', time: 42 },
    { name: 'Week 2', time: 38 },
    { name: 'Week 3', time: 35 },
    { name: 'Week 4', time: 32 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <InsightsHeader 
        title="Delivery Insights" 
        subtitle="Logistics performance and driver efficiency"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard label="Total Deliveries" value="1,420" trend="+12.4%" icon={Truck} color="emerald" />
        <StatCard label="Active Drivers" value="12" trend="+2" icon={User} color="blue" />
        <StatCard label="Success Rate" value="96.4%" trend="+1.2%" icon={CheckCircle2} color="emerald" />
        <StatCard label="Avg. Delivery Time" value="32 min" trend="-5 min" icon={Clock} color="purple" />
        <StatCard label="Failed Deliveries" value="14" trend="-2" icon={AlertCircle} color="red" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm">
          <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight mb-8">Daily Delivery Status</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deliveryPerformance}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}} />
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Legend iconType="circle" wrapperStyle={{paddingTop: '20px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase'}} />
                <Bar dataKey="successful" name="Successful" fill="#10b981" radius={[8, 8, 0, 0]} />
                <Bar dataKey="failed" name="Failed" fill="#f43f5e" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm">
          <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight mb-8">Average Delivery Time Trend (Min)</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={avgTimeTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}} />
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Line type="monotone" dataKey="time" stroke="#8b5cf6" strokeWidth={3} dot={{r: 4, fill: '#8b5cf6'}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <InsightsTable 
        title="Driver Performance Ledger"
        headers={['Driver Name', 'Total Trips', 'Success Rate', 'Avg Time', 'Rating']}
        rows={[
          ['Rahul Sharma', '145', '98.5%', '28 min', '4.9/5'],
          ['Amit Singh', '132', '94.2%', '34 min', '4.7/5'],
          ['Vicky Kumar', '128', '96.8%', '31 min', '4.8/5'],
          ['Suresh Pal', '110', '92.4%', '42 min', '4.5/5'],
          ['Deepak Raj', '95', '97.2%', '29 min', '4.8/5'],
        ]}
      />
    </div>
  );
};

export default DeliveryInsights;
