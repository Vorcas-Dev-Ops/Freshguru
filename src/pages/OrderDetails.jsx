import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Printer, 
  XCircle, 
  UserPlus, 
  Calendar, 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  Lock, 
  Info,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  ChevronRight,
  AlertCircle,
  Plus,
  Trash2,
  Check,
  User,
  MoreVertical
} from 'lucide-react';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [orderStatus, setOrderStatus] = useState('Approved'); // Pending, Approved, Packed, Out for Delivery, Delivered, Rejected
  const [showAddModal, setShowAddModal] = useState(false);
  const [driver, setDriver] = useState(null);
  const [slot, setSlot] = useState('Morning (9AM-12PM)');
  
  const [items, setItems] = useState([
    { id: 1, name: 'Organic Broccoli', desc: 'A-Grade Florets', ordered: 45, unit: 'kg', price: 85, stock: 450, img: 'https://images.unsplash.com/photo-1453227588063-bb302b62f50b?auto=format&fit=crop&q=80&w=64&h=64' },
    { id: 2, name: 'Alphonso Mangoes', desc: 'Premium Export Quality', ordered: 10, unit: 'Crate', price: 1200, stock: 4, img: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&q=80&w=64&h=64' },
  ]);

  const drivers = [
    { id: 'D-101', name: 'Rahul Sharma', status: 'Available', phone: '+91 98765 43210' },
    { id: 'D-102', name: 'Suresh Raina', status: 'On Delivery', phone: '+91 98765 43211' },
    { id: 'D-103', name: 'Amit Kumar', status: 'Available', phone: '+91 98765 43212' },
  ];

  const slots = ['Morning (9AM-12PM)', 'Afternoon (1PM-4PM)', 'Evening (5PM-8PM)'];

  const isEditingLocked = orderStatus === 'Packed' || orderStatus === 'Out for Delivery' || orderStatus === 'Delivered';

  const handleAddItem = (newItem) => {
    setItems([...items, newItem]);
    setShowAddModal(false);
  };

  const handleUpdateQty = (itemId, newQty) => {
    if (isEditingLocked) return;
    setItems(items.map(item => {
      if (item.id === itemId) {
        // Rule: Customers cannot reduce quantity, but admin might need to for stock reasons.
        // For B2B Admin, we allow editing as per prompt requirements.
        return { ...item, ordered: Number(newQty) };
      }
      return item;
    }));
  };

  const calculateSubtotal = () => items.reduce((sum, item) => sum + (item.ordered * item.price), 0);
  const subtotal = calculateSubtotal();
  const tax = subtotal * 0.05;
  const deliveryFee = 500;
  const total = subtotal + tax + deliveryFee;

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-500">
      {/* Header */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/orders')}
            className="p-2.5 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-slate-600 transition-all shadow-sm active:scale-95"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Order #{id}</h2>
              <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                orderStatus === 'Pending' ? 'bg-orange-50 text-orange-600 border-orange-100' : 
                orderStatus === 'Approved' ? 'bg-green-50 text-green-700 border-green-100' : 
                'bg-slate-100 text-slate-600 border-slate-200'
              }`}>
                {orderStatus}
              </span>
            </div>
            <p className="text-slate-500 font-bold text-xs flex items-center gap-1.5 uppercase tracking-widest">
              <Calendar className="w-4 h-4 text-primary" /> Placed on Oct 24, 2:45 PM
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <button className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm">
            <Printer className="w-4 h-4" /> Print Invoice
          </button>

          {(orderStatus !== 'Delivered' && orderStatus !== 'Rejected') && (
            <button 
              onClick={() => {
                if (window.confirm('Are you sure you want to cancel this order?')) {
                  setOrderStatus('Rejected');
                }
              }}
              className="px-6 py-2.5 bg-white border border-red-100 text-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-red-50 transition-all shadow-sm"
            >
              <XCircle className="w-4 h-4" /> Cancel Order
            </button>
          )}
          
          {orderStatus === 'Pending' && (
            <div className="flex gap-2">
              <button 
                onClick={() => setOrderStatus('Approved')}
                className="px-6 py-2.5 bg-bottle-green text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-opacity-90 shadow-lg shadow-green-100 transition-all active:scale-95"
              >
                <Check className="w-4 h-4" /> Approve Order
              </button>
              <button 
                onClick={() => setOrderStatus('Rejected')}
                className="px-6 py-2.5 border border-red-200 text-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-red-50 transition-all"
              >
                <XCircle className="w-4 h-4" /> Reject
              </button>
            </div>
          )}

          {orderStatus === 'Approved' && (
            <button 
              onClick={() => setOrderStatus('Packed')}
              className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-slate-800 shadow-lg transition-all active:scale-95"
            >
              <Package className="w-4 h-4" /> Finalize & Pack
            </button>
          )}

          {orderStatus === 'Packed' && (
            <button 
              onClick={() => setOrderStatus('Out for Delivery')}
              className="px-6 py-2.5 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-green-700 shadow-lg transition-all active:scale-95"
            >
              <Truck className="w-4 h-4" /> Dispatch Order
            </button>
          )}
        </div>
      </header>

      {/* Editing Restriction Alert */}
      {isEditingLocked && (
        <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex items-center gap-3">
          <Lock className="w-5 h-5 text-amber-600" />
          <div>
            <p className="text-[11px] font-black text-amber-900 uppercase tracking-widest">Order Locked for Editing</p>
            <p className="text-[10px] text-amber-700 mt-0.5">This order has been packed or dispatched. Quantities cannot be modified.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Order Items */}
          <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Consignment Details</h3>
              {!isEditingLocked && (
                <button 
                  onClick={() => setShowAddModal(true)}
                  className="px-4 py-2 border border-slate-200 bg-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Items
                </button>
              )}
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50">
                  <tr>
                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Product</th>
                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Stock Check</th>
                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Quantity</th>
                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Price</th>
                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((item) => (
                    <tr key={item.id} className="group hover:bg-slate-50/50 transition-all">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <img src={item.img} className="w-14 h-14 rounded-2xl object-cover shadow-sm border border-slate-100" alt={item.name} />
                          <div>
                            <p className="font-bold text-slate-900 text-sm">{item.name}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{item.desc}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-center">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                          item.stock >= item.ordered ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                        }`}>
                          {item.stock >= item.ordered ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                          {item.stock >= item.ordered ? 'In Stock' : `Low: ${item.stock}`}
                        </div>
                      </td>
                      <td className="px-8 py-5 text-center">
                        {isEditingLocked ? (
                          <span className="text-sm font-black text-slate-900">{item.ordered} {item.unit}</span>
                        ) : (
                          <input 
                            type="number" 
                            value={item.ordered} 
                            min="1"
                            onChange={(e) => handleUpdateQty(item.id, e.target.value)}
                            className="w-20 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-center font-bold text-slate-900 focus:ring-2 focus:ring-green-500/20 outline-none"
                          />
                        )}
                      </td>
                      <td className="px-8 py-5 text-right text-slate-500 font-medium text-sm">₹{item.price}</td>
                      <td className="px-8 py-5 text-right font-black text-slate-900 text-sm">₹{(item.ordered * item.price).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Delivery Logistics */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Slot & Route */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
              <h3 className="text-base font-black text-slate-900 uppercase tracking-tight mb-6">Delivery Schedule</h3>
              <div className="space-y-5">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Assigned Slot</label>
                  <select 
                    disabled={isEditingLocked}
                    value={slot}
                    onChange={(e) => setSlot(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-green-500/20 disabled:opacity-60 transition-all"
                  >
                    {slots.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Calculated Route</p>
                      <p className="text-xs font-bold text-slate-700 mt-0.5">West Delhi - Block A/B Grouping</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Driver Assignment */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
              <h3 className="text-base font-black text-slate-900 uppercase tracking-tight mb-6">Driver Logistics</h3>
              {driver ? (
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center border-2 border-white shadow-md">
                        <User className="w-6 h-6 text-slate-400" />
                      </div>
                      <div>
                        <p className="font-black text-slate-900 text-sm">{driver.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">ID: {driver.id}</p>
                      </div>
                    </div>
                    {!isEditingLocked && (
                      <button onClick={() => setDriver(null)} className="text-[10px] font-black text-primary uppercase hover:underline">Reassign</button>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-slate-500">
                    <Phone className="w-4 h-4" />
                    <span className="text-xs font-bold">{driver.phone}</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Assign available driver</p>
                  <div className="space-y-2">
                    {drivers.map(d => (
                      <button 
                        key={d.id}
                        onClick={() => setDriver(d)}
                        className={`w-full p-4 rounded-2xl border flex items-center justify-between transition-all group ${
                          d.status === 'Available' ? 'border-slate-200 hover:border-primary hover:bg-green-50/30' : 'opacity-40 cursor-not-allowed border-slate-100'
                        }`}
                        disabled={d.status !== 'Available'}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${d.status === 'Available' ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                          <span className="text-xs font-bold text-slate-700">{d.name}</span>
                        </div>
                        <span className="text-[9px] font-black text-slate-400 uppercase group-hover:text-primary">{d.status}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Financials & Timeline */}
        <div className="space-y-8">
          {/* Timeline */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
            <h3 className="text-base font-black text-slate-900 uppercase tracking-tight mb-8">Lifecycle</h3>
            <div className="space-y-8 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
              <TimelineItem label="Order Placed" status="completed" time="2:45 PM" />
              <TimelineItem label="Approved" status={orderStatus !== 'Pending' ? 'completed' : 'pending'} time="2:50 PM" />
              <TimelineItem label="Packed" status={['Packed', 'Out for Delivery', 'Delivered'].includes(orderStatus) ? 'completed' : 'pending'} time="3:15 PM" />
              <TimelineItem label="Dispatch" status={['Out for Delivery', 'Delivered'].includes(orderStatus) ? 'completed' : 'pending'} />
              <TimelineItem label="Delivered" status={orderStatus === 'Delivered' ? 'completed' : 'pending'} />
            </div>
          </div>

          {/* Billing */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
            <h3 className="text-base font-black text-slate-900 uppercase tracking-tight mb-6">Financial Overview</h3>
            <div className="space-y-4">
              <div className="flex justify-between text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                <span>Items Subtotal</span>
                <span className="text-slate-900 font-black">₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                <span>GST (5%)</span>
                <span className="text-slate-900 font-black">₹{tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                <span>Logistics Fee</span>
                <span className="text-slate-900 font-black">₹{deliveryFee}</span>
              </div>
              <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
                <span className="text-lg font-black text-slate-900 uppercase tracking-tight">Total</span>
                <span className="text-2xl font-black text-primary">₹{total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TimelineItem = ({ label, status, time }) => (
  <div className="relative pl-10 flex items-center justify-between">
    <div className={`absolute left-0 w-9 h-9 rounded-full border-4 border-white shadow-sm flex items-center justify-center transition-all ${
      status === 'completed' ? 'bg-primary text-white' : 'bg-slate-100 text-slate-300'
    }`}>
      {status === 'completed' ? <Check className="w-4 h-4" /> : <div className="w-1.5 h-1.5 bg-slate-300 rounded-full"></div>}
    </div>
    <span className={`text-xs font-black uppercase tracking-widest ${status === 'completed' ? 'text-slate-900' : 'text-slate-400'}`}>{label}</span>
    {time && <span className="text-[10px] font-bold text-primary">{time}</span>}
  </div>
);

export default OrderDetails;
