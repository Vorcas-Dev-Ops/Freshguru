import React, { useState } from 'react';
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
  ChevronDown
} from 'lucide-react';

const Delivery = () => {
  const [activeTab, setActiveTab] = useState('Pending Dispatch');
  const [showAddDriver, setShowAddDriver] = useState(false);
  const [driverStep, setDriverStep] = useState(1);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [drivers, setDrivers] = useState([
    { id: 'd1', name: 'Rajesh Kumar', status: 'Active', vehicle: 'Mini Truck', contact: '+91 98765 43210', orders: 124, rating: 4.8 },
    { id: 'd2', name: 'Suresh Raina', status: 'Active', vehicle: 'EV Three-Wheeler', contact: '+91 87654 32109', orders: 89, rating: 4.5 },
    { id: 'd3', name: 'Amit Shah', status: 'Inactive', vehicle: 'Mini Truck', contact: '+91 76543 21098', orders: 45, rating: 4.2 },
    { id: 'd4', name: 'Vikram Singh', status: 'Active', vehicle: 'EV Three-Wheeler', contact: '+91 65432 10987', orders: 210, rating: 4.9 },
  ]);
  const [orders, setOrders] = useState([
    { id: '#FG-ORD-9840', customer: 'Metro Gourmet', location: 'Indiranagar, Bangalore', time: '2h ago', status: 'Ready', driver: '', items: 7 },
    { id: '#FG-ORD-9845', customer: 'Star Retailers', location: 'Koramangala, Bangalore', time: '4h ago', status: 'Ready', driver: '', items: 3 },
  ]);

  const tabs = ['Pending Dispatch', 'Out for Delivery', 'Delivered', 'Returns', 'Drivers'];

  const handleDispatch = (id) => {
    setOrders(prev => prev.map(o => 
      o.id === id ? { ...o, status: 'OUT FOR DELIVERY', time: 'JUST NOW' } : o
    ));
  };

  const handleDeliver = (id) => {
    setOrders(prev => prev.map(o => 
      o.id === id ? { ...o, status: 'DELIVERED', time: 'SUCCESSFUL' } : o
    ));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Delivery Dispatch</h2>
          <p className="text-slate-500 font-bold text-sm">Assign drivers to packed orders and monitor shipments.</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowAddDriver(true)}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-all active:scale-95 shadow-lg shadow-green-100"
          >
            <UserPlus className="w-5 h-5" />
            Add Driver
          </button>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-primary">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Active Drivers</p>
              <p className="text-xl font-black text-slate-900">12/15</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto no-scrollbar bg-white/50 rounded-t-2xl px-6">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-4 text-sm font-black transition-all border-b-2 whitespace-nowrap uppercase tracking-widest ${
              activeTab === tab 
                ? 'text-primary border-primary bg-primary/5' 
                : 'text-slate-400 border-transparent hover:text-slate-600'
            }`}
          >
            {tab} {tab === 'Pending Dispatch' && <span className="ml-1.5 px-2 py-0.5 bg-primary/10 text-primary rounded-full text-[10px]">8</span>}
          </button>
        ))}
      </div>

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
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-xs font-black text-slate-500 uppercase tracking-widest hover:bg-slate-50 transition-all">
            <Filter className="w-4 h-4" /> Filter
          </button>
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
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">ID: {driver.id.toUpperCase()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <button 
                        onClick={() => setDrivers(prev => prev.map(d => d.id === driver.id ? { ...d, status: d.status === 'Active' ? 'Inactive' : 'Active' } : d))}
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
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Order ID</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Customer & Location</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Items</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Driver</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((order) => (
                  <tr key={order.id} className={`hover:bg-slate-50/50 transition-all group ${order.status === 'DELIVERED' ? 'opacity-60' : ''}`}>
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
                      <div className="flex items-center gap-1.5">
                        <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-[10px] font-black text-primary border border-green-100 shadow-sm">
                          +{order.items}
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Items</span>
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
                    <td className="px-6 py-6">
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
                              <div className="max-h-48 overflow-y-auto custom-scrollbar">
                                {drivers.filter(d => d.status === 'Active').map(d => (
                                  <button
                                    key={d.id}
                                    onClick={() => {
                                      setOrders(prev => prev.map(o => o.id === order.id ? { ...o, driver: d.id } : o));
                                      setOpenDropdownId(null);
                                    }}
                                    className="w-full px-3 py-2 flex items-center gap-3 hover:bg-green-50 transition-colors text-left group"
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
                      ) : (
                        <p className="text-[11px] font-black text-slate-700 uppercase tracking-widest">
                          {order.driver ? drivers.find(d => d.id === order.driver)?.name : 'Rajesh Kumar'}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {order.status === 'Ready' ? (
                          <button 
                            disabled={!order.driver}
                            onClick={() => handleDispatch(order.id)}
                            className={`px-5 py-2 text-[10px] font-black rounded-xl uppercase tracking-widest transition-all ${
                              order.driver 
                                ? 'bg-primary text-white shadow-lg shadow-green-100 hover:bg-green-700 active:scale-95' 
                                : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                            }`}
                          >
                            Dispatch
                          </button>
                        ) : order.status === 'OUT FOR DELIVERY' ? (
                          <button 
                            onClick={() => handleDeliver(order.id)}
                            className="px-5 py-2 bg-green-600 text-white text-[10px] font-black rounded-xl uppercase tracking-widest shadow-lg shadow-green-100 hover:bg-green-700 active:scale-95 transition-all"
                          >
                            Deliver
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
            <form className="p-8 space-y-5" onSubmit={(e) => { e.preventDefault(); if(driverStep === 1) setDriverStep(2); else { setShowAddDriver(false); setDriverStep(1); } }}>
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
                    <input required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="e.g. Rahul Sharma" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Vehicle</label>
                      <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none">
                        <option>Mini Truck</option>
                        <option>EV Three-Wheeler</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Contact</label>
                      <input required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none" placeholder="+91..." />
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
                    <input required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="driver_rahul" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Password</label>
                    <input required type="password" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="••••••••" />
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

export default Delivery;
