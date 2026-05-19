import React, { useState, useEffect } from 'react';
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
  Phone,
  MapPin,
  AlertCircle,
  Plus,
  Minus,
  Check,
  User,
  TrendingUp,
  ShieldCheck,
  X,
  ShoppingBag,
  CreditCard,
  Circle,
  UserCheck,
  UserPlus,
  Mail,
  ChevronDown,
  Lock,
  AlertTriangle,
  FileText,
  Maximize,
  Camera
} from 'lucide-react';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [products, setProducts] = useState([]);
  const [showProofModal, setShowProofModal] = useState(false);

  const API_BASE = 'http://localhost:5055/api';

  useEffect(() => {
    fetchOrderAndItems();
    fetchDrivers();
  }, [id]);

  const fetchOrderAndItems = async () => {
    try {
      setLoading(true);
      // Fetch orders to find the one matching this ID
      const orderRes = await fetch(`${API_BASE}/orders`);
      if (orderRes.ok) {
        const allOrders = await orderRes.json();
        const foundOrder = allOrders.find(o => o.order_id === id);
        if (foundOrder) {
          setOrder({
            ...foundOrder,
            id: foundOrder.order_id,
            partner: foundOrder.customer_name,
            location: foundOrder.delivery_location,
            amount: parseFloat(foundOrder.total_amount),
            points: foundOrder.loyalty_points,
            status: foundOrder.status,
            driver: foundOrder.driver_id,
            driverName: foundOrder.driver_name,
            slot: foundOrder.delivery_slot,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
          });

          // Fetch products for stock verification
          try {
            const productsRes = await fetch(`${API_BASE}/inventory/products`);
            if (productsRes.ok) {
              const productsData = await productsRes.json();
              setProducts(productsData);
            }
          } catch (pErr) {
            console.error('Failed to fetch products for verification:', pErr);
          }

          // Fetch items for this order
          const itemsRes = await fetch(`${API_BASE}/orders/items/by-order/${foundOrder.order_id}`);
          if (itemsRes.ok) {
            const itemsData = await itemsRes.json();
            setItems(itemsData.map(i => ({ ...i, damagedQuantity: 0 })));
          }
        }
      }
    } catch (err) {
      console.error(err);
      showNotification('Failed to fetch order details', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchDrivers = async () => {
    try {
      const response = await fetch(`${API_BASE}/drivers`);
      if (response.ok) {
        const data = await response.json();
        setDrivers(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updateOrderStatus = async (newStatus) => {
    try {
      const response = await fetch(`${API_BASE}/orders/${order.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        showNotification(`Order status updated to ${newStatus}`);
        fetchOrderAndItems();
      } else {
        showNotification('Failed to update status', 'error');
      }
    } catch (err) {
      console.error(err);
      showNotification('Failed to update status', 'error');
    }
  };

  const updateDeliverySlot = async (newSlot) => {
    try {
      const response = await fetch(`${API_BASE}/orders/${order.id}/delivery-slot`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slot: newSlot })
      });
      if (response.ok) {
        showNotification(`Delivery slot updated to ${newSlot}`);
        fetchOrderAndItems();
      } else {
        showNotification('Failed to update delivery slot', 'error');
      }
    } catch (err) {
      console.error(err);
      showNotification('Failed to update delivery slot', 'error');
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const updateQuantity = async (itemId, delta) => {
    const item = items.find(i => i.id === itemId);
    const newQty = Math.max(0, parseFloat(item.quantity) + delta);
    
    try {
      const response = await fetch(`${API_BASE}/orders/items/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQty })
      });
      if (response.ok) {
        setItems(prev => prev.map(i => i.id === itemId ? { ...i, quantity: newQty } : i));
        showNotification('Quantity updated');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleReportDamage = (itemId) => {
    const qty = window.prompt("Enter damaged quantity:");
    if (qty !== null && !isNaN(qty) && qty !== "") {
      setItems(prev => prev.map(item => {
        if (item.id === itemId) {
          const parsed = parseFloat(qty);
          if (parsed > parseFloat(item.quantity)) {
             alert("Damaged quantity cannot exceed total quantity.");
             return item;
          }
          if (parsed < 0) return item;
          return { ...item, damagedQuantity: parsed };
        }
        return item;
      }));
    }
  };

  const assignDriver = async (driverId) => {
    try {
      const response = await fetch(`${API_BASE}/orders/bulk-assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderIds: [order.id], driverId })
      });
      if (response.ok) {
        showNotification('Driver assigned successfully');
        fetchOrderAndItems();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-black text-slate-900">Order not found</h2>
        <button onClick={() => navigate('/orders')} className="mt-4 text-emerald-600 font-bold uppercase tracking-widest underline">Back to Delivery History</button>
      </div>
    );
  }

  const subtotal = items.reduce((acc, i) => acc + ((i.quantity - (i.damagedQuantity || 0)) * i.price_at_order), 0);
  const gst = subtotal * 0.05;
  const logisticTax = 6.50;
  const handlingFee = 5.50;
  const grandTotal = subtotal + gst + logisticTax + handlingFee;

  return (
    <div className="max-w-[1400px] mx-auto pb-20 animate-in fade-in duration-700">
      {notification && (
        <div className={`fixed top-12 left-1/2 -translate-x-1/2 z-[1000] px-8 py-4 rounded-2xl shadow-2xl animate-in slide-in-from-top-8 duration-300 flex items-center gap-3 font-black uppercase text-[10px] tracking-widest border ${
          notification.type === 'error' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-[#0a4a34] text-white border-white/10'
        }`}>
          {notification.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
          {notification.message}
        </div>
      )}

      {/* Header Bar */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate('/orders')}
            className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-400 hover:text-[#0a4a34] transition-all border border-slate-100 dark:border-slate-700 shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-4">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Order #{order.id.split('-').pop()}</h2>
            <span className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border shadow-sm ${
              order.status === 'Pending' ? 'bg-amber-50 text-amber-600 border-amber-100' :
              order.status === 'Approved' ? 'bg-blue-50 text-blue-600 border-blue-100' : 
              order.status === 'Packed' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 
              order.status === 'Ready for Dispatch' || order.status === 'Assigned' || order.status === 'Out for Delivery' ? 'bg-orange-50 text-orange-600 border-orange-100' :
              order.status === 'Rejected' ? 'bg-red-50 text-red-600 border-red-100' :
              'bg-emerald-50 text-emerald-600 border-emerald-100'
            }`}>
              {order.status}
            </span>
          </div>
        </div>
        <button 
          onClick={() => navigate(`/invoice/${order.id.replace('#', '')}`)}
          className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-all shadow-sm"
        >
          <Printer className="w-4 h-4" /> Print Invoice
        </button>
      </div>

      {/* Top Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Card 1: Proof Photo */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-6 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Delivery Proof Photo</h3>
            <button onClick={() => setShowProofModal(true)} disabled={order.status !== 'Delivered'} className="hover:scale-110 transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
              <Maximize className="w-4 h-4 text-emerald-500" />
            </button>
          </div>
          <div 
             className={`flex-1 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 relative group min-h-[160px] ${order.status === 'Delivered' ? 'cursor-pointer' : ''}`}
             onClick={() => order.status === 'Delivered' && setShowProofModal(true)}
          >
            {order.status === 'Delivered' ? (
               <img src={order.proof_url || "https://images.unsplash.com/photo-1617347454431-f49d7ff5c3b1?w=800&q=80"} alt="Proof" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            ) : (
               <div className="flex flex-col items-center justify-center h-full text-slate-300 dark:text-slate-600">
                  <Camera className="w-8 h-8 mb-2 opacity-50" />
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">Pending Delivery</span>
               </div>
            )}
          </div>
        </div>

        {/* Card 2: Audit Notes */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Delivery Audit Notes</h3>
            <p className="text-[15px] font-bold text-slate-600 dark:text-slate-400 leading-relaxed italic">
              "Delivered at reception as requested. Client verified items on site. Pallets arranged for easy storage."
            </p>
          </div>
          <div className="flex items-center gap-2 mt-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <Clock className="w-3.5 h-3.5" /> {order.date}
          </div>
        </div>

        {/* Card 3: Damages Reported */}
        {(() => {
           const damagedItemsCount = items.filter(i => (i.damagedQuantity || 0) > 0).length;
           return (
             <div className={`border rounded-[2rem] p-6 shadow-sm flex flex-col justify-center items-center text-center ${damagedItemsCount > 0 ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/30' : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700'}`}>
                {damagedItemsCount > 0 ? (
                  <>
                    <AlertTriangle className="w-10 h-10 text-red-600 mb-3" />
                    <h3 className="text-[13px] font-black text-red-600 uppercase tracking-widest leading-tight">Damages<br/>Reported</h3>
                    <p className="text-3xl font-black text-red-600 my-2">{damagedItemsCount} Items</p>
                    <p className="text-[9px] font-black text-red-500/70 uppercase tracking-widest">Reported by:<br/>Warehouse Manager</p>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-10 h-10 text-slate-300 dark:text-slate-600 mb-3" />
                    <h3 className="text-[13px] font-black text-slate-400 uppercase tracking-widest leading-tight">No Damages<br/>Reported</h3>
                  </>
                )}
             </div>
           );
        })()}
      </div>

      {/* Middle Table Row */}
      <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden mb-6">
        <div className="px-8 py-6 border-b border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
          <h3 className="text-[14px] font-black text-slate-900 dark:text-white uppercase tracking-widest">Consignment Details</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-100/50 dark:bg-slate-800/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="px-8 py-4">Product</th>
                <th className="px-6 py-4">Quantity</th>
                <th className="px-6 py-4">Unit Price</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-8 py-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {items.map(item => {
                const effectiveQty = item.quantity - (item.damagedQuantity || 0);
                const lineTotal = effectiveQty * item.price_at_order;
                return (
                  <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all">
                    <td className="px-8 py-5 flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-[#0a4a34] dark:text-emerald-500 shadow-inner">
                         <Package className="w-5 h-5" />
                       </div>
                       <span className="text-[15px] font-black text-slate-900 dark:text-white tracking-tight">{item.product_name}</span>
                    </td>
                    <td className="px-6 py-5 text-[14px] font-bold text-slate-600 dark:text-slate-400">
                      {item.quantity} {item.unit}
                    </td>
                    <td className="px-6 py-5 text-[14px] font-bold text-slate-600 dark:text-slate-400">
                      ₹{item.price_at_order}
                    </td>
                    <td className="px-6 py-5 text-[15px] font-black text-slate-900 dark:text-white">
                      ₹{lineTotal.toLocaleString('en-IN', {minimumFractionDigits: 2})}
                    </td>
                    <td className="px-8 py-5 text-center">
                       {(item.damagedQuantity || 0) > 0 ? (
                         <button onClick={() => handleReportDamage(item.id)} className="px-3 py-1.5 bg-red-100 text-red-600 text-[10px] font-black uppercase tracking-widest rounded-md border border-red-200 hover:bg-red-200 transition-all active:scale-95 shadow-sm">
                           {item.damagedQuantity} Damaged
                         </button>
                       ) : (
                         <button onClick={() => handleReportDamage(item.id)} className="px-3 py-1.5 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded-md border border-emerald-200 hover:bg-emerald-200 transition-all active:scale-95 shadow-sm">
                           Delivered OK
                         </button>
                       )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Logistics */}
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 p-8 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Logistics</h3>
            <div className="space-y-5">
               <div className="flex items-start gap-4">
                 <Calendar className="w-5 h-5 text-[#0a4a34] dark:text-emerald-500 shrink-0 mt-0.5" />
                 <div>
                   <p className="text-[14px] font-black text-slate-900 dark:text-white tracking-tight">{order.slot || 'Morning Slot'}</p>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">08:00 AM - 12:00 PM</p>
                 </div>
               </div>
               <div className="flex items-start gap-4">
                 <MapPin className="w-5 h-5 text-[#0a4a34] dark:text-emerald-500 shrink-0 mt-0.5" />
                 <div>
                   <p className="text-[14px] font-black text-slate-900 dark:text-white tracking-tight">Calculated Route</p>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Zone 4 → West Terminal</p>
                 </div>
               </div>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-slate-50 dark:border-slate-800">
             <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Driver Profile</h3>
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-[#0a4a34] shadow-inner">
                   <User className="w-6 h-6" />
                </div>
                <div>
                   <p className="text-[14px] font-black text-slate-900 dark:text-white tracking-tight mb-0.5">{drivers.find(d => d.id === order.driver)?.name || order.driverName || 'Unassigned'}</p>
                   <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">ID: EMP-9923 | +91 98765 43210</p>
                </div>
             </div>
          </div>
        </div>

        {/* Lifecycle Timeline */}
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 p-8 shadow-sm">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Order Lifecycle</h3>
          <div className="space-y-6 relative pl-3 mt-4">
            <div className="absolute left-[17px] top-2 bottom-2 w-0.5 bg-slate-100 dark:bg-slate-800" />
            {[
              { label: 'Order Placed', time: 'Oct 21, 10:20 AM', done: true },
              { label: 'Approved', time: 'Oct 21, 11:45 AM', done: order.status !== 'Pending' },
              { label: 'Packed', time: 'Oct 23, 04:30 PM', done: ['Packed', 'Ready for Dispatch', 'Out for Delivery', 'Delivered'].includes(order.status) },
              { label: 'Dispatch', time: 'Oct 24, 08:15 AM', done: ['Out for Delivery', 'Delivered'].includes(order.status) }
            ].map((step, i) => (
               <div key={i} className="flex justify-between items-center relative z-10">
                 <div className="flex items-center gap-4">
                    <div className={`w-3.5 h-3.5 rounded-full border-2 ${step.done ? 'bg-emerald-500 border-emerald-500' : 'bg-white dark:bg-slate-900 border-slate-300'}`} />
                    <span className={`text-[13px] font-black ${step.done ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>{step.label}</span>
                 </div>
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{step.time}</span>
               </div>
            ))}
          </div>
        </div>

        {/* Financial Summary */}
        <div className="bg-[#f8faf8] dark:bg-emerald-950/10 rounded-[2rem] border border-emerald-100/50 dark:border-emerald-900/30 p-8 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Financial Summary</h3>
            <div className="space-y-4">
               <SummaryRow label="Subtotal" value={subtotal} />
               <SummaryRow label="GST (5%)" value={gst} />
               <SummaryRow label="Logistics Fee" value={logisticTax + handlingFee} />
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-emerald-100 dark:border-emerald-900/50 text-center">
             <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Final Total</h4>
             <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter tabular-nums">
               ₹{grandTotal.toLocaleString('en-IN', {minimumFractionDigits: 2})}
             </p>
          </div>
        </div>
      </div>

      {/* Proof Photo Lightbox Modal */}
      {showProofModal && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 sm:p-8 animate-in fade-in duration-200">
          <div className="relative max-w-5xl w-full flex flex-col items-center">
            <button 
              onClick={() => setShowProofModal(false)}
              className="absolute -top-12 right-0 p-2 text-white/50 hover:text-white transition-colors bg-white/10 hover:bg-white/20 rounded-full"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="w-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 flex items-center justify-center max-h-[80vh]">
              <img 
                src={order.proof_url || "https://images.unsplash.com/photo-1617347454431-f49d7ff5c3b1?w=800&q=80"} 
                alt="Delivery Proof Full" 
                className="w-full h-auto max-h-[80vh] object-contain"
              />
            </div>
            <p className="text-white/70 font-bold uppercase tracking-widest text-[10px] mt-6">
              Verified Delivery Photo • {order.id} • {order.date}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

const SummaryRow = ({ label, value }) => (
  <div className="flex justify-between items-center text-[14px] font-bold">
    <span className="text-slate-500 dark:text-slate-400 uppercase tracking-widest font-black text-[11px]">{label}</span>
    <span className="text-slate-900 dark:text-white tabular-nums tracking-tighter">₹{value.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
  </div>
);

export default OrderDetails;
