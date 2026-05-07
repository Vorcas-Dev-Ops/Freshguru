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
  Calendar
} from 'lucide-react';

const Orders = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Pending');
  const [searchTerm, setSearchTerm] = useState('');
  
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
  ]);

  const tabs = ['Pending', 'Approved', 'Packed', 'Out for Delivery', 'Delivered', 'Rejected'];

  const handleApprove = (id) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'Approved' } : o));
  };

  const handleReject = (id) => {
    if (window.confirm('Are you sure you want to reject this order?')) {
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'Rejected' } : o));
    }
  };

  const filteredOrders = orders.filter(o => 
    (o.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
     o.customer.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (activeTab === 'Pending' ? o.status === 'Pending' : o.status === activeTab)
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Order Management</h2>
          <p className="text-slate-500 text-sm">Orchestrate logistics, stock verification, and driver assignments.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white px-4 py-2 border border-slate-200 rounded-xl flex items-center gap-2 shadow-sm">
            <Truck className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">8 Drivers Active</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto no-scrollbar bg-white/50 rounded-t-2xl px-4 backdrop-blur-sm sticky top-0 z-10">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-4 text-[11px] font-black transition-all border-b-2 whitespace-nowrap uppercase tracking-widest ${
              activeTab === tab 
                ? 'text-primary border-primary bg-primary/5' 
                : 'text-slate-400 border-transparent hover:text-slate-600 hover:bg-slate-50'
            }`}
          >
            {tab} 
            {tab === 'Pending' && <span className="ml-2 px-2 py-0.5 bg-orange-500 text-white rounded-full text-[9px]">{orders.filter(o => o.status === 'Pending').length}</span>}
          </button>
        ))}
      </div>

      {/* Order Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-50/30">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-green-500/20 transition-all" 
              placeholder="Search by ID or Customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
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
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Order Info</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Stock Health</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Logistics</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Financials</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
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
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      order.health === 'ALL IN STOCK' ? 'bg-green-50 text-green-600 border border-green-100' : 
                      order.health === 'LOCKED' ? 'bg-slate-100 text-slate-400' : 'bg-orange-50 text-orange-600 border border-orange-100'
                    }`}>
                      {order.health === 'ALL IN STOCK' ? <CheckCircle className="w-3 h-3" /> : 
                       order.health === 'LOCKED' ? <Lock className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                      {order.health}
                    </div>
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
                    <div className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">B2B INVOICE</div>
                  </td>
                  <td className="px-8 py-5 text-right" onClick={(e) => e.stopPropagation()}>
                    {order.status === 'Pending' ? (
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleApprove(order.id)}
                          className="px-4 py-2 bg-bottle-green text-white text-[10px] font-black rounded-xl hover:bg-opacity-90 shadow-lg shadow-green-100 transition-all active:scale-95 uppercase tracking-widest"
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => handleReject(order.id)}
                          className="px-4 py-2 border border-red-200 text-red-500 text-[10px] font-black rounded-xl hover:bg-red-50 transition-all active:scale-95 uppercase tracking-widest"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <button className="p-2 text-slate-300 hover:text-slate-600 transition-colors bg-slate-50 rounded-lg">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Orders;
