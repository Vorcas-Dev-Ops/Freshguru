import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Truck, 
  UserPlus, 
  Search, 
  MapPin, 
  CheckCircle2, 
  MoreVertical,
  Filter,
  Package,
  X,
  Camera,
  Navigation,
  ChevronDown,
  TrendingUp,
  Clock,
  Users
} from 'lucide-react';
const Delivery = () => {
  const [activeTab, setActiveTab] = useState('Pending Dispatch');
  const [showAddDriver, setShowAddDriver] = useState(false);
  const [driverStep, setDriverStep] = useState(1);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [driverForm, setDriverForm] = useState({
    name: '', vehicle: 'Mini Truck', contact: '', username: '', password: '', imageUrl: ''
  });
  const [orders, setOrders] = useState([
    { id: '#FG-ORD-9840', customer: 'Metro Gourmet', location: 'Indiranagar, Bangalore', time: '2h ago', status: 'Ready', driver: '', items: 7, totalAmount: 4250, paymentStatus: 'Pending', points: 42 },
    { id: '#FG-ORD-9845', customer: 'Star Retailers', location: 'Koramangala, Bangalore', time: '4h ago', status: 'Ready', driver: '', items: 3, totalAmount: 1200, paymentStatus: 'Pending', points: 12 },
  ]);

  const API_URL = 'http://localhost:5055/api/drivers';

  useEffect(() => {
    fetchDrivers();
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('admin_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      if (response.ok) {
        const data = await response.json();
        const mapped = data.map(d => ({
          id: d.id,
          driver_id: d.driver_id,
          name: d.name,
          status: d.status,
          vehicle: d.vehicle,
          contact: d.contact,
          orders: d.total_orders,
          rating: parseFloat(d.rating)
        }));
        setDrivers(mapped);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const [isAssignMode, setIsAssignMode] = useState(false);
  const [selectedDriverId, setSelectedDriverId] = useState('');
  const [selectedOrderIds, setSelectedOrderIds] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [currentOrderToDeliver, setCurrentOrderToDeliver] = useState(null);

  const handleBulkAssign = () => {
    if (!selectedDriverId || selectedOrderIds.length === 0) return;
    
    setOrders(prev => prev.map(o => 
      selectedOrderIds.includes(o.id) 
        ? { ...o, driver: selectedDriverId, status: 'OUT FOR DELIVERY', time: 'JUST NOW' } 
        : o
    ));
    
    setIsAssignMode(false);
    setSelectedOrderIds([]);
    setSelectedDriverId('');
  };

  const toggleOrderSelection = (id) => {
    setSelectedOrderIds(prev => 
      prev.includes(id) ? prev.filter(oid => oid !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const readyOrders = orders.filter(o => o.status === 'Ready').map(o => o.id);
      setSelectedOrderIds(readyOrders);
    } else {
      setSelectedOrderIds([]);
    }
  };

  const tabs = ['Pending Dispatch', 'Out for Delivery', 'Delivered', 'Returns', 'Drivers'];

  const handleDispatch = (id) => {
    setOrders(prev => prev.map(o => 
      o.id === id ? { ...o, status: 'OUT FOR DELIVERY', time: 'JUST NOW' } : o
    ));
  };

  const handleDeliverClick = (order) => {
    setCurrentOrderToDeliver(order);
    setShowPaymentModal(true);
  };

  const finalizeDelivery = (paymentMode) => {
    setOrders(prev => prev.map(o => 
      o.id === currentOrderToDeliver.id 
        ? { ...o, status: 'DELIVERED', time: 'SUCCESSFUL', paymentStatus: paymentMode === 'credit' ? 'Credit' : 'Paid' } 
        : o
    ));
    setShowPaymentModal(false);
    setCurrentOrderToDeliver(null);
  };

  return (
    <div className="space-y-8">
      {/* Payment Confirmation Modal */}
      {showPaymentModal && currentOrderToDeliver && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl border border-slate-100 dark:border-slate-800 animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-emerald-600" />
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight text-center mb-2">Finalize Delivery</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center mb-8 leading-relaxed">Choose payment status for <span className="text-emerald-600">{currentOrderToDeliver.id}</span></p>
            
            <div className="space-y-3">
              <button 
                onClick={() => finalizeDelivery('paid')}
                className="w-full py-4 bg-emerald-900 dark:bg-emerald-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:scale-[1.02] transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                Cash/Online Received
              </button>
              <button 
                onClick={() => finalizeDelivery('credit')}
                className="w-full py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95"
              >
                Not Received (Add to Credit)
              </button>
              <button 
                onClick={() => setShowPaymentModal(false)}
                className="w-full py-4 text-[10px] font-black text-slate-400 uppercase hover:text-red-500 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ERP Command Header */}
      <div className="flex flex-col xl:flex-row gap-8">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-[#0a4a34] rounded-lg flex items-center justify-center shadow-lg shadow-green-900/10">
              <Truck className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Delivery Dispatch</h2>
          </div>
          <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Enterprise Logistics Management & Dispatch Infrastructure</p>
        </div>

        <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-tight">Fleet Status</p>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <p className="text-[10px] font-black text-[#0a4a34] dark:text-green-400 uppercase tracking-widest">12/15 ACTIVE</p>
            </div>
          </div>
          <div className="h-10 w-px bg-slate-100 dark:bg-slate-800" />
          <button 
            onClick={() => setShowAddDriver(true)}
            className="flex items-center gap-2 bg-[#0a4a34] text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-800 transition-all shadow-lg shadow-green-900/10"
          >
            <Users className="w-3.5 h-3.5" /> Add Driver
          </button>
        </div>
      </div>

      {/* Summary Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatBox label="Total Dispatches" value="842" trend="+12.5%" icon={Truck} />
        <StatBox label="Active Routes" value="12" sub="Across 5 Zones" icon={MapPin} />
        <StatBox label="On-Time Rate" value="98.2%" trend="+0.5%" icon={TrendingUp} />
        <StatBox label="Avg Delivery" value="42m" sub="Last 24 Hours" icon={Clock} />
      </div>

      {/* Tabs - High Fidelity Implementation */}
      <div className="relative">
        <div className="flex items-center gap-3 overflow-x-auto pb-2 px-2 no-scrollbar scroll-smooth">
          <div className="flex items-center gap-1 p-1.5 bg-slate-100/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-inner">
            {tabs.map(tab => {
              const isActive = activeTab === tab;
              const hasCount = tab === 'Pending Dispatch';
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex items-center gap-2.5 px-6 py-3 rounded-xl transition-all duration-500 shrink-0 relative group ${
                    isActive 
                      ? 'bg-white dark:bg-slate-900 text-primary dark:text-green-400 shadow-lg shadow-green-900/5 border border-primary/10' 
                      : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                  }`}
                >
                  <span className={`text-[10px] font-black uppercase tracking-[0.12em] transition-all ${isActive ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}>
                    {tab}
                  </span>
                  {hasCount && (
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black transition-all ${isActive ? 'bg-primary text-white' : 'bg-slate-200 text-slate-500'}`}>
                      8
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Assignment Banner */}
      {isAssignMode && (
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-slate-900 dark:to-slate-800 border-2 border-emerald-200 dark:border-emerald-900/30 p-6 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 animate-in slide-in-from-top-4 duration-500 shadow-2xl shadow-emerald-100/20 dark:shadow-none mb-4">
          <div className="flex flex-col md:flex-row items-center gap-8 w-full md:w-auto">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-emerald-600 border border-emerald-100 dark:border-emerald-900/20">
                <UserPlus className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-[0.2em] leading-none mb-2">Primary Dispatcher</p>
                <select 
                  value={selectedDriverId} 
                  onChange={(e) => setSelectedDriverId(e.target.value)}
                  className="w-full md:w-64 px-4 py-2.5 bg-white dark:bg-slate-950 border-2 border-emerald-100 dark:border-emerald-900/30 rounded-xl text-xs font-bold outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all cursor-pointer appearance-none"
                >
                  <option value="">Choose available driver...</option>
                  {drivers.filter(d => d.status === 'Active').map(d => (
                    <option key={d.id} value={d.id}>{d.name} • {d.vehicle}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="hidden md:block h-12 w-px bg-emerald-200/50 dark:bg-emerald-900/30" />
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg transition-all duration-500 ${selectedOrderIds.length > 0 ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200 scale-110' : 'bg-white dark:bg-slate-800 text-slate-300 border border-slate-100 dark:border-slate-700'}`}>
                {selectedOrderIds.length}
              </div>
              <div>
                <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">Orders Selected</p>
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">Check the list below</p>
              </div>
            </div>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <button 
              onClick={() => { setIsAssignMode(false); setSelectedOrderIds([]); setSelectedDriverId(''); }}
              className="flex-1 md:flex-none px-6 py-3 text-[10px] font-black text-red-500 hover:text-red-600 uppercase tracking-widest hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button 
              disabled={!selectedDriverId || selectedOrderIds.length === 0}
              onClick={handleBulkAssign}
              className={`flex-1 md:flex-none px-10 py-4 text-[11px] font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl ${
                !selectedDriverId || selectedOrderIds.length === 0 
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed grayscale' 
                  : 'bg-emerald-600 text-white shadow-emerald-200 dark:shadow-none hover:bg-emerald-700 hover:-translate-y-0.5 active:scale-95'
              }`}
            >
              Confirm & Dispatch
            </button>
          </div>
        </div>
      )}

      {/* Dispatch Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-500/20 transition-all font-medium" 
              placeholder="Search by ID or Location..."
            />
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => {
                setIsAssignMode(!isAssignMode);
                if (!isAssignMode) setActiveTab('Pending Dispatch');
              }}
              className={`flex items-center gap-2 px-4 py-2 font-black rounded-xl transition-all active:scale-95 border text-[10px] uppercase tracking-widest ${
                isAssignMode 
                  ? 'bg-primary text-white border-primary shadow-lg shadow-green-100' 
                  : 'bg-green-50 text-primary border-green-200 hover:bg-green-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800'
              }`}
            >
              <CheckCircle2 className={`w-3.5 h-3.5 ${isAssignMode ? 'text-white' : 'text-primary dark:text-emerald-400'}`} />
              {isAssignMode ? 'Exit Assignment' : 'Assign Orders'}
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-widest hover:bg-slate-50 transition-all">
              <Filter className="w-3.5 h-3.5" /> Filter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {activeTab === 'Drivers' ? (
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Driver Name</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Vehicle & Contact</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Orders</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {drivers.map((driver) => (
                  <tr key={driver.id} className="hover:bg-slate-50/50 transition-all group">
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-black text-slate-400">
                          {driver.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-black text-slate-900 text-sm">{driver.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">ID: {driver.driver_id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <button 
                        onClick={async () => {
                          const newStatus = driver.status === 'Active' ? 'Inactive' : 'Active';
                          try {
                            const res = await fetch(`${API_URL}/${driver.id}/status`, {
                              method: 'PUT',
                              headers: getAuthHeaders(),
                              body: JSON.stringify({ status: newStatus })
                            });
                            if (res.ok) {
                              setDrivers(prev => prev.map(d => d.id === driver.id ? { ...d, status: newStatus } : d));
                            }
                          } catch (err) {
                            console.error(err);
                          }
                        }}
                        className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${
                        driver.status === 'Active' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-slate-100 text-slate-400 border-slate-200'
                      }`}>
                        {driver.status}
                      </button>
                    </td>
                    <td className="px-6 py-6">
                      <p className="font-bold text-slate-900 text-sm">{driver.vehicle}</p>
                      <p className="text-[10px] text-slate-400 font-bold">{driver.contact}</p>
                    </td>
                    <td className="px-6 py-6">
                      <p className="font-black text-slate-900 text-base tracking-tighter">{driver.orders}</p>
                      <p className="text-[9px] text-slate-400 font-black uppercase">Lifetime</p>
                    </td>
                    <td className="px-6 py-6 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <span className="text-sm font-black text-slate-900">{driver.rating}</span>
                        <span className="text-amber-400 text-lg">★</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  {isAssignMode && activeTab === 'Pending Dispatch' && (
                    <th className="px-6 py-4 w-10">
                      <input 
                        type="checkbox" 
                        onChange={handleSelectAll}
                        checked={selectedOrderIds.length === orders.filter(o => o.status === 'Ready').length && selectedOrderIds.length > 0}
                        className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary/20"
                      />
                    </th>
                  )}
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Order Details</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Customer & Location</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Payment & Points</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((order) => (
                  <tr key={order.id} className={`hover:bg-slate-50/50 transition-all group ${order.status === 'DELIVERED' ? 'opacity-80' : ''} ${selectedOrderIds.includes(order.id) ? 'bg-green-50/50' : ''}`}>
                    {isAssignMode && activeTab === 'Pending Dispatch' && (
                      <td className="px-6 py-6">
                        <input 
                          type="checkbox" 
                          disabled={order.status !== 'Ready'}
                          checked={selectedOrderIds.includes(order.id)}
                          onChange={() => toggleOrderSelection(order.id)}
                          className={`w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary/20 ${order.status !== 'Ready' ? 'opacity-20 cursor-not-allowed' : 'cursor-pointer'}`}
                        />
                      </td>
                    )}
                    <td className="px-6 py-6">
                      <p className="font-black text-primary text-base tracking-tighter">{order.id}</p>
                      <p className={`text-[9px] font-black uppercase flex items-center gap-1 ${order.status === 'OUT FOR DELIVERY' ? 'text-green-600' : 'text-slate-400'}`}>
                        {order.status === 'OUT FOR DELIVERY' && <Navigation className="w-3 h-3 fill-current" />}
                        {order.status.replace(/_/g, ' ')} • {order.time}
                      </p>
                    </td>
                    <td className="px-6 py-6">
                      <p className="font-bold text-slate-900 text-sm">{order.customer}</p>
                      <p className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {order.location}
                      </p>
                    </td>
                    <td className="px-6 py-6">
                      <div className="space-y-1">
                        <p className="text-sm font-black text-slate-900 tracking-tight">₹{order.totalAmount}</p>
                        <div className="flex items-center gap-2">
                          <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
                            order.paymentStatus === 'Paid' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                            order.paymentStatus === 'Credit' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                            'bg-slate-50 text-slate-400'
                          }`}>
                            {order.paymentStatus}
                          </span>
                          <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-0.5">
                            <Plus className="w-2 h-2" />{order.points} PTS
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                        order.status === 'Ready' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                        order.status === 'OUT FOR DELIVERY' ? 'bg-green-100 text-green-700 border-green-200' :
                        'bg-slate-100 text-slate-500 border-slate-200'
                      }`}>
                        {order.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {order.status === 'Ready' ? (
                          <div className="relative">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenDropdownId(openDropdownId === order.id ? null : order.id);
                              }}
                              className="w-44 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-between hover:bg-white hover:shadow-sm transition-all"
                            >
                              <span>{order.driver ? drivers.find(d => d.id === order.driver)?.name : 'Select Driver'}</span>
                              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${openDropdownId === order.id ? 'rotate-180' : ''}`} />
                            </button>
                            
                            {openDropdownId === order.id && (
                              <div className="absolute top-full left-0 mt-1.5 w-60 bg-white border border-slate-100 rounded-xl shadow-2xl z-50 py-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                                <div className="px-3 py-1.5 border-b border-slate-50 mb-1">
                                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Available Drivers</p>
                                </div>
                                <div className="max-h-48 overflow-y-auto custom-scrollbar text-left">
                                  {drivers.filter(d => d.status === 'Active').map(d => (
                                    <button
                                      key={d.id}
                                      onClick={() => {
                                        setOrders(prev => prev.map(o => o.id === order.id ? { ...o, driver: d.id } : o));
                                        setOpenDropdownId(null);
                                      }}
                                      className="w-full px-3 py-2 flex items-center gap-3 hover:bg-green-50 transition-colors group"
                                    >
                                      <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400 group-hover:bg-primary group-hover:text-white transition-all">
                                        {d.name.charAt(0)}
                                      </div>
                                      <div>
                                        <p className="text-[11px] font-black text-slate-700 uppercase tracking-widest">{d.name}</p>
                                        <p className="text-[9px] text-slate-400 font-bold">{d.vehicle}</p>
                                      </div>
                                      {order.driver === d.id && <CheckCircle2 className="w-3.5 h-3.5 text-primary ml-auto" />}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ) : order.status === 'OUT FOR DELIVERY' ? (
                          <button 
                            onClick={() => handleDeliverClick(order)}
                            className="px-5 py-2 bg-green-600 text-white text-[10px] font-black rounded-xl uppercase tracking-widest shadow-lg shadow-green-100 hover:bg-green-700 active:scale-95 transition-all"
                          >
                            Mark Delivered
                          </button>
                        ) : order.paymentStatus === 'Credit' ? (
                          <button 
                            onClick={() => alert(`QR Code sent to ${order.customer} via WhatsApp/Email`)}
                            className="px-5 py-2 bg-slate-900 text-white text-[10px] font-black rounded-xl uppercase tracking-widest hover:bg-black active:scale-95 transition-all flex items-center gap-2"
                          >
                            Send QR
                          </button>
                        ) : (
                          <button className="px-5 py-2 bg-slate-50 border border-slate-200 text-slate-400 text-[10px] font-black rounded-xl uppercase tracking-widest hover:bg-slate-100 transition-all">
                            Details
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>


      {/* Add Driver Modal */}
      {showAddDriver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="text-xl font-black text-slate-900">Register Driver</h3>
                <div className="flex gap-1.5 mt-1">
                  <div className={`h-1 w-8 rounded-full transition-all ${driverStep >= 1 ? 'bg-primary' : 'bg-slate-200'}`}></div>
                  <div className={`h-1 w-8 rounded-full transition-all ${driverStep >= 2 ? 'bg-primary' : 'bg-slate-200'}`}></div>
                </div>
              </div>
              <button onClick={() => { setShowAddDriver(false); setDriverStep(1); }} className="p-1 text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form className="p-8 space-y-5" onSubmit={async (e) => { 
              e.preventDefault(); 
              if(driverStep === 1) {
                setDriverStep(2);
              } else {
                try {
                  const res = await fetch(API_URL, {
                    method: 'POST',
                    headers: getAuthHeaders(),
                    body: JSON.stringify(driverForm)
                  });
                  if (res.ok) {
                    const newDrv = await res.json();
                    setDrivers([{
                      id: newDrv.id,
                      driver_id: newDrv.driver_id,
                      name: newDrv.name,
                      status: newDrv.status,
                      vehicle: newDrv.vehicle,
                      contact: newDrv.contact,
                      orders: newDrv.total_orders,
                      rating: parseFloat(newDrv.rating)
                    }, ...drivers]);
                    setShowAddDriver(false);
                    setDriverStep(1);
                    setDriverForm({ name: '', vehicle: 'Mini Truck', contact: '', username: '', password: '', imageUrl: '' });
                  } else {
                    const data = await res.json();
                    alert(data.message || 'Registration failed');
                  }
                } catch (err) {
                  console.error(err);
                }
              } 
            }}>
              {driverStep === 1 ? (
                <>
                  <div className="flex flex-col items-center mb-2">
                    <div className="w-24 h-24 rounded-full border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center gap-1 group cursor-pointer hover:border-primary transition-all">
                      <Camera className="w-8 h-8 text-slate-300 group-hover:text-primary transition-all" />
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Photo</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Full Name</label>
                    <input 
                      required 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
                      placeholder="e.g. Rahul Sharma" 
                      value={driverForm.name}
                      onChange={(e) => setDriverForm({ ...driverForm, name: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Vehicle</label>
                      <select 
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none"
                        value={driverForm.vehicle}
                        onChange={(e) => setDriverForm({ ...driverForm, vehicle: e.target.value })}
                      >
                        <option>Mini Truck</option>
                        <option>EV Three-Wheeler</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Contact</label>
                      <input 
                        required 
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none" 
                        placeholder="+91..." 
                        value={driverForm.contact}
                        onChange={(e) => setDriverForm({ ...driverForm, contact: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="pt-6 flex gap-4">
                    <button type="button" onClick={() => setShowAddDriver(false)} className="flex-1 py-3 text-[11px] font-black text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-xl uppercase tracking-widest transition-all">Cancel</button>
                    <button type="submit" className="flex-1 py-3 text-[11px] font-black text-white bg-primary hover:bg-green-700 rounded-xl shadow-lg shadow-green-100 uppercase tracking-widest transition-all active:scale-95">Continue to Step 2</button>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-green-50 p-4 rounded-2xl border border-green-100 mb-2">
                    <p className="text-[10px] font-black text-green-700 uppercase tracking-widest flex items-center gap-2">
                      <CheckCircle2 className="w-3 h-3" /> Step 2: Login Credentials
                    </p>
                    <p className="text-[11px] text-green-600 font-bold mt-1">Setup driver login for the mobile application.</p>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Username</label>
                    <input 
                      required 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
                      placeholder="driver_rahul" 
                      value={driverForm.username}
                      onChange={(e) => setDriverForm({ ...driverForm, username: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Password</label>
                    <input 
                      required 
                      type="password" 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
                      placeholder="••••••••" 
                      value={driverForm.password}
                      onChange={(e) => setDriverForm({ ...driverForm, password: e.target.value })}
                    />
                  </div>
                  <div className="pt-6 flex gap-4">
                    <button type="button" onClick={() => setDriverStep(1)} className="flex-1 py-3 text-[11px] font-black text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-xl uppercase tracking-widest transition-all">Back</button>
                    <button type="submit" className="flex-1 py-3 text-[11px] font-black text-white bg-primary hover:bg-green-700 rounded-xl shadow-lg shadow-green-100 uppercase tracking-widest transition-all active:scale-95">Finalize Registration</button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
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

export default Delivery;
