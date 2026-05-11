import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  CheckCircle, 
  AlertTriangle, 
  Lock, 
  ChevronRight, 
  MoreVertical,
  Filter,
  Package,
  Truck,
  XCircle,
  Clock,
  MapPin,
  User,
  Calendar,
  QrCode,
  ShoppingBag,
  TrendingUp,
  LayoutGrid,
  Download
} from 'lucide-react';
import ConfirmModal from '../components/ConfirmModal';

const Orders = () => {
  const navigate = useNavigate();
  const [activeTab] = useState('Delivered');
  const [searchTerm, setSearchTerm] = useState('');
  const [rejectConfirm, setRejectConfirm] = useState(null); // stores id of order to reject
  
  const [orders, setOrders] = useState([
    { 
      id: '#FG-ORD-9852', 
      time: '5 mins ago', 
      customer: 'Star Retailers', 
      contact: 'Aman Gupta', 
      health: 'ALL IN STOCK', 
      amount: '₹45,200', 
      status: 'Pending',
      route: 'North Delhi',
      slot: 'Morning (9AM-12PM)',
      driver: null
    },
    { 
      id: '#FG-ORD-9855', 
      time: '22 mins ago', 
      customer: 'Fresh Mart', 
      contact: 'Sanjay Roy', 
      health: 'PARTIAL STOCK', 
      amount: '₹12,800', 
      status: 'Pending',
      route: 'West Delhi',
      slot: 'Afternoon (1PM-4PM)',
      driver: null
    },
    { 
      id: '#FG-ORD-9840', 
      time: '2 hours ago', 
      customer: 'Metro Gourmet', 
      contact: 'Karan Bajaj', 
      health: 'LOCKED', 
      amount: '₹28,450', 
      status: 'Packed',
      route: 'South Delhi',
      slot: 'Morning (9AM-12PM)',
      driver: 'Rahul Sharma'
    },
    { 
      id: '#FG-ORD-9835', 
      time: '5 hours ago', 
      customer: 'Organic Oasis', 
      contact: 'Priya Verma', 
      health: 'ALL IN STOCK', 
      amount: '₹15,200', 
      status: 'Delivered',
      route: 'East Delhi',
      slot: 'Morning (9AM-12PM)',
      driver: 'Rahul Sharma',
      paymentStatus: 'Credit',
      points: 152
    },
    { 
      id: '#FG-ORD-9830', 
      time: 'Yesterday', 
      customer: 'Green Grocers', 
      contact: 'Amit Shah', 
      health: 'ALL IN STOCK', 
      amount: '₹42,000', 
      status: 'Delivered',
      route: 'Central Delhi',
      slot: 'Afternoon (1PM-4PM)',
      driver: 'Vikram Singh',
      paymentStatus: 'Paid',
      points: 420
    },
  ]);

  const handleApprove = (id) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'Approved' } : o));
  };

  const handleReject = (id) => {
    setRejectConfirm(id);
  };

  const confirmReject = () => {
    if (!rejectConfirm) return;
    setOrders(prev => prev.map(o => o.id === rejectConfirm ? { ...o, status: 'Rejected' } : o));
    setRejectConfirm(null);
  };

  const filteredOrders = orders.filter(o => 
    (o.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
     o.customer.toLowerCase().includes(searchTerm.toLowerCase())) &&
    o.status === 'Delivered'
  );

  return (
    <>
      {/* ERP Command Header */}
      <div className="flex flex-col xl:flex-row gap-8">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-[#0a4a34] rounded-lg flex items-center justify-center shadow-lg shadow-green-900/10">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Orders Portfolio</h2>
          </div>
          <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Enterprise Transaction Management & Order Lifecycle Controls</p>
        </div>

        <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
            <Search className="w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search Orders..." 
              className="bg-transparent border-none text-[10px] font-black uppercase tracking-widest text-slate-600 focus:ring-0 w-32"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="h-10 w-px bg-slate-100 dark:bg-slate-800" />
          <button className="flex items-center gap-2 text-slate-400 hover:text-slate-600 px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      {/* Summary Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatBox label="Total Orders" value="1,248" trend="+12.5%" icon={ShoppingBag} />
        <StatBox label="Active Revenue" value="₹4.2L" trend="+8.2%" icon={TrendingUp} />
        <StatBox label="Avg Ticket" value="₹2,450" sub="Per Order" icon={LayoutGrid} />
        <StatBox label="Pending Action" value="23" sub="Awaiting Step" icon={Clock} alert />
      </div>

      {/* Order Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-50/30">
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-slate-500 hover:bg-slate-50 transition-all uppercase tracking-widest">
              <MapPin className="w-3.5 h-3.5" /> Group by Route
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-slate-500 hover:bg-slate-50 transition-all uppercase tracking-widest">
              <Filter className="w-3.5 h-3.5" /> More Filters
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.12em]">Order Info</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.12em]">{activeTab === 'Delivered' ? 'Reward' : 'Stock Health'}</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.12em]">Logistics</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.12em]">{activeTab === 'Delivered' ? 'Settlement' : 'Financials'}</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.12em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-8 py-12 text-center text-slate-400 text-sm font-medium">No orders found in {activeTab} stage.</td>
                </tr>
              ) : filteredOrders.map((order) => (
                <tr 
                  key={order.id} 
                  className="hover:bg-slate-50/50 transition-all group cursor-pointer"
                  onClick={() => navigate(`/orders/${order.id.replace('#', '')}`)}
                >
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                      <span className="font-black text-slate-900 text-sm tracking-tight">{order.id}</span>
                      <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1 mt-0.5 uppercase tracking-widest">
                        <Clock className="w-3 h-3" /> {order.time}
                      </span>
                      <div className="mt-2 text-xs font-bold text-slate-600">{order.customer}</div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    {activeTab === 'Delivered' ? (
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5 text-primary font-black text-sm">
                          <CheckCircle className="w-4 h-4" /> +{order.points} PTS
                        </div>
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">Loyalty Earned</span>
                      </div>
                    ) : (
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        order.health === 'ALL IN STOCK' ? 'bg-green-50 text-green-600 border border-green-100' : 
                        order.health === 'LOCKED' ? 'bg-slate-100 text-slate-400' : 'bg-orange-50 text-orange-600 border border-orange-100'
                      }`}>
                        {order.health === 'ALL IN STOCK' ? <CheckCircle className="w-3 h-3" /> : 
                         order.health === 'LOCKED' ? <Lock className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                        {order.health}
                      </div>
                    )}
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                        <MapPin className="w-3 h-3 text-slate-300" /> {order.route}
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                        <Calendar className="w-3 h-3 text-slate-300" /> {order.slot}
                      </div>
                      {order.driver ? (
                        <div className="flex items-center gap-1.5 text-[10px] text-primary font-black uppercase tracking-widest">
                          <User className="w-3 h-3" /> {order.driver}
                        </div>
                      ) : (
                        <div className="text-[9px] text-slate-300 font-black uppercase tracking-widest">Unassigned</div>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="font-black text-slate-900 text-sm tracking-tight">{order.amount}</div>
                    {activeTab === 'Delivered' ? (
                      <div className={`text-[10px] font-black uppercase tracking-widest mt-1 ${order.paymentStatus === 'Credit' ? 'text-red-500' : 'text-green-600'}`}>
                        {order.paymentStatus === 'Credit' ? 'Pending in Credit' : 'Paid in Full'}
                      </div>
                    ) : (
                      <div className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">B2B INVOICE</div>
                    )}
                  </td>
                  <td className="px-8 py-5 text-right" onClick={(e) => e.stopPropagation()}>
                    {order.status === 'Delivered' && order.paymentStatus === 'Credit' ? (
                      <div className="flex items-center justify-end gap-3">
                        <span className="text-[9px] font-black text-red-500 uppercase tracking-widest bg-red-50 px-2 py-1 rounded border border-red-100">Settlement Pending</span>
                        <button 
                          onClick={() => alert(`QR Code sent to ${order.customer} for amount ${order.amount}`)}
                          className="px-4 py-2 bg-slate-900 text-white text-[10px] font-black rounded-xl hover:bg-slate-800 shadow-lg transition-all active:scale-95 uppercase tracking-widest flex items-center gap-2"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          Send QR
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end gap-3">
                        <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                          PAID VIA {order.id.endsWith('30') ? 'UPI' : 'CASH'}
                        </span>
                        <button 
                          onClick={() => navigate(`/orders/${order.id.replace('#', '')}`)}
                          className="p-2 text-slate-300 hover:text-slate-600 transition-colors bg-slate-50 rounded-lg"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <ConfirmModal 
        isOpen={!!rejectConfirm}
        onClose={() => setRejectConfirm(null)}
        onConfirm={confirmReject}
        title="Reject Order"
        message="Are you sure you want to reject this order? This will cancel the procurement process for this transaction."
        confirmText="Confirm Rejection"
      />
      </>
    );
};

const StatBox = ({ label, value, trend, sub, icon: Icon, alert }) => (
  <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-500 group relative overflow-hidden">
    <div className="relative z-10">
      <div className="flex justify-between items-start mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 ${
          alert ? 'bg-red-50 text-red-600' : 'bg-slate-50 dark:bg-slate-800 text-[#0a4a34] dark:text-green-400'
        }`}>
          {Icon && <Icon className="w-6 h-6" />}
        </div>
        {trend && (
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
            trend.startsWith('+') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
          }`}>
            <TrendingUp className={`w-3 h-3 ${trend.startsWith('+') ? '' : 'rotate-180'}`} />
            {trend}
          </div>
        )}
      </div>
      
      <div>
        <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-1">{label}</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter tabular-nums">{value}</h3>
          {sub && <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{sub}</span>}
        </div>
      </div>
    </div>
    
    <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-700 ${
      alert ? 'bg-red-500' : 'bg-[#0a4a34]'
    }`} />
  </div>
);

export default Orders;
