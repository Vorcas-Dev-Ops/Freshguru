import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, LineChart, Line
} from 'recharts';
import { 
  Wallet, CreditCard, Banknote, QrCode, 
  TrendingUp, Clock, AlertCircle, ShieldCheck
} from 'lucide-react';
import StatCard from './components/StatCard';
import InsightsHeader from './components/InsightsHeader';
import InsightsTable from './components/InsightsTable';

const PaymentInsights = () => {
  const paymentMethods = [
    { name: 'QR Payments', value: 45, color: '#10b981' },
    { name: 'Bank Transfer', value: 30, color: '#3b82f6' },
    { name: 'Cash', value: 15, color: '#f59e0b' },
    { name: 'Credit', value: 10, color: '#f43f5e' },
  ];

  const collectionEfficiency = [
    { name: 'Jan', efficiency: 92 },
    { name: 'Feb', efficiency: 88 },
    { name: 'Mar', efficiency: 94 },
    { name: 'Apr', efficiency: 91 },
    { name: 'May', efficiency: 95 },
    { name: 'Jun', efficiency: 97 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <InsightsHeader 
        title="Payment Insights" 
        subtitle="Financial collections and credit monitoring"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Collections" value="₹42.8L" trend="+15.4%" icon={Wallet} color="emerald" />
        <StatCard label="Pending Payments" value="₹4.2L" trend="-8.2%" icon={Clock} color="orange" />
        <StatCard label="Overdue Invoices" value="18" trend="+2" icon={AlertCircle} color="red" />
        <StatCard label="Credit Utilization" value="64%" trend="+4.1%" icon={CreditCard} color="blue" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm">
          <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight mb-8">Collection Efficiency (%)</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={collectionEfficiency}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}} domain={[80, 100]} />
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Line type="monotone" dataKey="efficiency" stroke="#10b981" strokeWidth={3} dot={{r: 4, fill: '#10b981'}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm flex flex-col">
          <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight mb-8">Payment Method Usage</h3>
          <div className="flex-1 h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentMethods}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {paymentMethods.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend layout="vertical" align="right" verticalAlign="middle" iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <InsightsTable 
        title="Due Aging Analysis"
        headers={['Partner', 'Days Overdue', 'Outstanding Amount', 'Last Paid', 'Status']}
        rows={[
          ['Kishan Fresh Mart', '45 Days', '₹12,400', '12 May 2024', 'Critical'],
          ['Green Grocers Hub', '12 Days', '₹8,900', '02 Jun 2024', 'Warning'],
          ['Prakash Retail', '62 Days', '₹15,100', '28 Apr 2024', 'Critical'],
          ['City Supermarket', '5 Days', '₹2,400', '10 Jun 2024', 'Healthy'],
          ['Healthy Choice', '0 Days', '₹0', '14 Jun 2024', 'Healthy'],
        ]}
      />
    </div>
  );
};

export default PaymentInsights;
