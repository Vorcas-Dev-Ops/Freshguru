import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Printer, 
  XCircle, 
  Calendar, 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  Lock, 
  Phone,
  MapPin,
  AlertCircle,
  Plus,
  Check,
  User,
  TrendingUp,
  QrCode,
  ShieldCheck
} from 'lucide-react';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [orderStatus] = useState('Delivered'); 
  const [paymentType] = useState('Credit'); // 'Paid' or 'Credit'
  const [driver] = useState({ id: 'EMP-9923', name: 'Amit Kumar', phone: '+91 98765 43210' });
  const [slot] = useState('Morning Slot (08:00 AM - 12:00 PM)');
  
  const [items] = useState([
    { id: 1, name: 'Organic Broccoli', desc: 'A-Grade Florets', ordered: 45, unit: 'kg', price: 85, costPrice: 60, damaged: 2, img: 'https://images.unsplash.com/photo-1453227588063-bb302b62f50b?auto=format&fit=crop&q=80&w=64&h=64' },
    { id: 2, name: 'Alphonso Mangoes', desc: 'Premium Export Quality', ordered: 10, unit: 'Crate', price: 1200, costPrice: 950, damaged: 0, img: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&q=80&w=64&h=64' },
  ]);
  
  const deliveryInfo = {
    proofImg: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800&q=80',
    deliveredAt: 'Oct 24, 2023 • 09:42 AM',
    driverNotes: 'Delivered at reception as requested. Client verified items on site. Pallets arranged for easy storage.',
    reporter: 'Warehouse Manager'
  };

  const calculateSubtotal = () => items.reduce((sum, item) => sum + (item.ordered * item.price), 0);
  const calculateTotalCost = () => items.reduce((sum, item) => sum + (item.ordered * item.costPrice), 0);
  
  const subtotal = calculateSubtotal();
  const totalCost = calculateTotalCost();
  const tax = subtotal * 0.05;
  const deliveryFee = 500;
  const totalRevenue = subtotal + tax + deliveryFee;
  const grossProfit = totalRevenue - totalCost;
  const profitMargin = (grossProfit / totalRevenue) * 100;

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-500 max-w-7xl mx-auto">
      {/* Printable Invoice Component (Hidden by default) */}
      <div className="hidden print:block p-8 bg-white text-slate-900 font-sans" id="printable-invoice">
        <div className="flex justify-between items-start border-b-2 border-slate-900 pb-8 mb-8">
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-emerald-600 mb-1">FRESH GURU</h1>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Premium B2B Fresh Produce Supply</p>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-black uppercase tracking-tight">TAX INVOICE</h2>
            <p className="text-sm font-bold text-slate-500 mt-1">Order #{id.includes('-') ? id : `FG-ORD-${id}`}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">{deliveryInfo.deliveredAt}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-12 mb-12">
          <div>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Bill To:</h3>
            <p className="text-lg font-black text-slate-900">Organic Oasis Retailers</p>
            <p className="text-sm text-slate-500 font-medium leading-relaxed mt-1">
              Sector 12, Main Market<br/>
              North Delhi, 110085<br/>
              GSTIN: 07AABCU1234F1Z5
            </p>
          </div>
          <div className="text-right">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Payment Info:</h3>
            <p className="text-sm font-black text-slate-900 uppercase">Method: {paymentType}</p>
            <p className={`text-sm font-black mt-1 ${paymentType === 'Credit' ? 'text-red-500' : 'text-emerald-600'}`}>
              Status: {paymentType === 'Credit' ? 'UNSETTLED' : 'PAID IN FULL'}
            </p>
          </div>
        </div>

        <table className="w-full mb-12">
          <thead>
            <tr className="border-b-2 border-slate-900">
              <th className="py-3 text-left text-[10px] font-black uppercase tracking-widest">Description</th>
              <th className="py-3 text-center text-[10px] font-black uppercase tracking-widest">Qty</th>
              <th className="py-3 text-right text-[10px] font-black uppercase tracking-widest">Unit Price</th>
              <th className="py-3 text-right text-[10px] font-black uppercase tracking-widest">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item) => (
              <tr key={item.id}>
                <td className="py-4">
                  <p className="font-black text-sm">{item.name}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">{item.desc}</p>
                </td>
                <td className="py-4 text-center font-bold text-sm">{item.ordered} {item.unit}</td>
                <td className="py-4 text-right font-bold text-sm">₹{item.price}</td>
                <td className="py-4 text-right font-black text-sm">₹{(item.ordered * item.price).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end">
          <div className="w-64 space-y-3">
            <div className="flex justify-between text-xs font-bold text-slate-500">
              <span>Subtotal</span>
              <span className="text-slate-900">₹{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs font-bold text-slate-500">
              <span>GST (5%)</span>
              <span className="text-slate-900">₹{tax.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs font-bold text-slate-500">
              <span>Logistics</span>
              <span className="text-slate-900">₹{deliveryFee}</span>
            </div>
            <div className="pt-4 border-t-2 border-slate-900 flex justify-between">
              <span className="text-sm font-black uppercase tracking-widest">Total Amount</span>
              <span className="text-xl font-black text-slate-900">₹{totalRevenue.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="mt-24 pt-8 border-t border-slate-100 text-center">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Authorized Signature • Fresh Guru</p>
        </div>
      </div>

      {/* Main UI (Hidden during print) */}
      <div className="print:hidden space-y-6">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/orders')}
              className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-slate-600 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              Order #{id.includes('-') ? id : `FG-ORD-${id}`}
              <span className="bg-emerald-500 text-white px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest">
                {orderStatus}
              </span>
            </h2>
          </div>
          <div className="flex items-center gap-3">
            {paymentType === 'Credit' ? (
              <div className="flex items-center gap-3">
                <div className="bg-red-50 px-4 py-2 rounded-lg border border-red-100 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">Settlement Pending</span>
                </div>
                <button 
                  onClick={() => alert('Payment QR link sent to customer!')}
                  className="px-6 py-2 bg-slate-900 text-white rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-slate-800 transition-all shadow-lg active:scale-95"
                >
                  <QrCode className="w-4 h-4" /> Send QR
                </button>
              </div>
            ) : (
              <div className="bg-emerald-50 px-4 py-2 rounded-lg border border-emerald-100 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Paid via {paymentType}</span>
              </div>
            )}
            <button 
              onClick={() => window.print()}
              className="px-6 py-2 bg-white border border-slate-200 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-slate-50 transition-all"
            >
              <Printer className="w-4 h-4" /> Print Invoice
            </button>
          </div>
        </header>
        
        {/* Profitability Insight Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatBox 
            label="Total Revenue" 
            value={`₹${totalRevenue.toLocaleString()}`} 
            icon={TrendingUp} 
          />
          <StatBox 
            label={grossProfit >= 0 ? "Gross Profit" : "Net Loss"} 
            value={`₹${Math.abs(grossProfit).toLocaleString()}`} 
            trend={grossProfit >= 0 ? `+${profitMargin.toFixed(1)}%` : `-${Math.abs(profitMargin).toFixed(1)}%`}
            icon={ShieldCheck} 
            alert={grossProfit < 0}
          />
          <StatBox 
            label="Cost of Goods" 
            value={`₹${totalCost.toLocaleString()}`} 
            sub="Inventory Basis"
            icon={Package} 
          />
        </div>

        {/* Top Audit Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Delivery Proof Photo */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm col-span-1 md:col-span-1.5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Delivery Proof Photo</h3>
              <MapPin className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="aspect-video rounded-lg overflow-hidden border border-slate-100 relative group">
              <img src={deliveryInfo.proofImg} className="w-full h-full object-cover transition-transform group-hover:scale-105" alt="Proof" />
              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>

          {/* Delivery Audit Notes */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm col-span-1 md:col-span-1.5 flex flex-col justify-between">
            <div>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Delivery Audit Notes</h3>
              <p className="text-sm font-bold text-slate-600 leading-relaxed italic">
                "{deliveryInfo.driverNotes}"
              </p>
            </div>
            <div className="flex items-center gap-2 text-slate-400 mt-4">
              <Clock className="w-4 h-4" />
              <span className="text-[10px] font-bold">{deliveryInfo.deliveredAt}</span>
            </div>
          </div>

          {/* Damages Reported */}
          <div className="bg-red-50 p-6 rounded-xl border border-red-100 shadow-sm flex flex-col items-center justify-center text-center">
            <AlertCircle className="w-10 h-10 text-red-500 mb-3" />
            <h4 className="text-[10px] font-black text-red-900 uppercase tracking-widest mb-1">Damages Reported</h4>
            <p className="text-3xl font-black text-red-600 leading-none mb-2">{items.reduce((sum, i) => sum + i.damaged, 0)} Items</p>
            <p className="text-[10px] text-red-400 font-bold uppercase">Reported by: <br/> {deliveryInfo.reporter}</p>
          </div>
        </div>

        {/* Consignment Details */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Consignment Details</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Product</th>
                  <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Quantity</th>
                  <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Unit Price</th>
                  <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Total Revenue</th>
                  <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Profit / Loss</th>
                  <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((item) => {
                  const deliveredQty = item.ordered - item.damaged;
                  const revenue = deliveredQty * item.price;
                  const cost = item.ordered * item.costPrice;
                  const profitLoss = revenue - cost;
                  const isProfit = profitLoss >= 0;

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/30 transition-all">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 overflow-hidden shrink-0">
                            <img src={item.img} className="w-full h-full object-cover" alt={item.name} />
                          </div>
                          <div>
                            <span className="font-black text-slate-900 text-sm block">{item.name}</span>
                            <span className="text-[9px] text-slate-400 font-bold uppercase">Cost: ₹{item.costPrice}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center text-sm font-bold text-slate-700">{item.ordered}{item.unit}</td>
                      <td className="px-6 py-4 text-center text-sm font-bold text-slate-700">₹{item.price}</td>
                      <td className="px-6 py-4 text-center text-sm font-black text-slate-900">₹{revenue.toLocaleString()}</td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex flex-col items-center">
                          <span className={`text-sm font-black ${isProfit ? 'text-emerald-600' : 'text-red-500'}`}>
                            {isProfit ? '+' : ''}₹{profitLoss.toLocaleString()}
                          </span>
                          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">
                            {cost > 0 ? ((profitLoss / cost) * 100).toFixed(1) : '0'}% margin
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-3 py-1 rounded text-[9px] font-black uppercase tracking-widest ${
                          item.damaged > 0 ? 'bg-red-50 text-red-500 border border-red-100' : 'bg-emerald-500 text-white'
                        }`}>
                          {item.damaged > 0 ? `${item.damaged} Damaged` : 'Delivered OK'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Summary Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Logistics */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Logistics</h3>
            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-black text-slate-900">{slot.split(' (')[0]}</p>
                  <p className="text-[10px] font-bold text-slate-400 mt-0.5">{slot.split(' (')[1]?.replace(')', '')}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Truck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-black text-slate-900">Calculated Route</p>
                  <p className="text-[10px] font-bold text-slate-400 mt-0.5">Zone 4 → West Terminal</p>
                </div>
              </div>
              <div className="pt-6 border-t border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Driver Profile</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                    <User className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-900">{driver.name}</p>
                    <p className="text-[9px] font-bold text-slate-400 mt-0.5">ID: {driver.id} | {driver.phone}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Lifecycle */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Order Lifecycle</h3>
            <div className="space-y-6 relative before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-50">
              <LifecycleItem label="Order Placed" date="Oct 21, 10:20 AM" completed />
              <LifecycleItem label="Approved" date="Oct 21, 11:45 AM" completed />
              <LifecycleItem label="Packed" date="Oct 23, 04:30 PM" completed />
              <LifecycleItem label="Dispatch" date="Oct 24, 06:15 AM" completed />
            </div>
          </div>

          {/* Financial Summary */}
          <div className="bg-emerald-50/30 p-6 rounded-xl border border-emerald-100 shadow-sm flex flex-col justify-between">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 text-center">Financial Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between text-xs font-bold text-slate-500">
                <span>Subtotal</span>
                <span className="text-slate-900 font-black">₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs font-bold text-slate-500">
                <span>GST (5%)</span>
                <span className="text-slate-900 font-black">₹{tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs font-bold text-slate-500">
                <span>Logistics Fee</span>
                <span className="text-slate-900 font-black">₹{deliveryFee}</span>
              </div>
              <div className="pt-6 border-t border-emerald-100 flex flex-col items-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Final Total</span>
                <span className="text-3xl font-black text-slate-900 tracking-tight">₹{totalRevenue.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
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

const LifecycleItem = ({ label, date, completed }) => (
  <div className="flex items-center justify-between pl-6 relative">
    <div className={`absolute left-0 w-4 h-4 rounded-full border-2 border-white shadow-sm flex items-center justify-center ${completed ? 'bg-emerald-500' : 'bg-slate-200'}`}>
      {completed && <Check className="w-2 h-2 text-white" />}
    </div>
    <span className="text-xs font-black text-slate-800">{label}</span>
    <span className="text-[10px] font-bold text-slate-400">{date}</span>
  </div>
);

export default OrderDetails;
