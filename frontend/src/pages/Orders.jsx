import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  CheckCircle, 
  AlertCircle,
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
  Download,
  ReceiptText,
  Plus,
  X,
  IndianRupee
} from 'lucide-react';
import ConfirmModal from '../components/ConfirmModal';

const Orders = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [rejectConfirm, setRejectConfirm] = useState(null); // stores id of order to reject
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [isAddSaleOpen, setIsAddSaleOpen] = useState(false);
  const [newSale, setNewSale] = useState({
    customer: '',
    amount: '',
    paymentStatus: 'Paid',
    paymentMethod: 'UPI',
    route: 'Central Delhi'
  });

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleGenerateInvoice = (e, order) => {
    e.stopPropagation();
    if (!order.invoiceGenerated) {
      setOrders(prev => prev.map(o => {
        if (o.id === order.id) {
          showNotification(`Invoice generated successfully for ${order.partner}!`);
          return { ...o, invoiceGenerated: true };
        }
        return o;
      }));
    }
    navigate(`/invoice/${order.id.replace('#', '')}`);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5055/api/orders');
      if (res.ok) {
        const data = await res.json();
        const mapped = data.map(o => {
          const orderDate = new Date(o.created_at);
          const timeAgo = orderDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) + ' ' + orderDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

          const paymentStatus = o.order_id.endsWith('30') || o.order_id.endsWith('8') ? 'Paid' : 'Credit';
          const paymentMethod = paymentStatus === 'Paid' ? (o.order_id.endsWith('30') ? 'UPI' : (o.order_id.endsWith('8') ? 'Card' : 'Cash')) : 'Credit';

          return {
            id: o.order_id,
            time: timeAgo,
            partner: o.customer_name,
            contact: o.customer_name,
            health: 'ALL IN STOCK',
            amount: `₹${parseFloat(o.total_amount).toLocaleString('en-IN')}`,
            rawAmount: parseFloat(o.total_amount),
            status: o.status,
            route: o.zone || 'Central Delhi',
            slot: o.delivery_slot || 'Morning (9AM-12PM)',
            driver: o.driver_name || null,
            paymentStatus,
            paymentMethod,
            points: o.loyalty_points || Math.round(parseFloat(o.total_amount) / 100),
            invoiceGenerated: o.order_id.endsWith('1') || o.order_id.endsWith('5') || false
          };
        });
        setOrders(mapped);
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

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

  const handleAddSale = (e) => {
    e.preventDefault();
    if (!newSale.customer || !newSale.amount) return;

    const mockId = `FG-ORD-${Math.floor(Math.random() * 9000) + 1000}`;
    const newEntry = {
      id: mockId,
      time: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) + ' ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
      partner: newSale.customer,
      contact: newSale.customer,
      health: 'ALL IN STOCK',
      amount: `₹${parseFloat(newSale.amount).toLocaleString('en-IN')}`,
      rawAmount: parseFloat(newSale.amount),
      status: 'Delivered', // automatically show in delivered table
      route: newSale.route,
      slot: 'Morning (9AM-12PM)',
      driver: 'Unassigned',
      paymentStatus: newSale.paymentStatus,
      paymentMethod: newSale.paymentStatus === 'Paid' ? newSale.paymentMethod : 'Credit',
      points: Math.round(parseFloat(newSale.amount) / 100),
      invoiceGenerated: false
    };

    setOrders([newEntry, ...orders]);
    setIsAddSaleOpen(false);
    showNotification('Manual sale added successfully!');
    setNewSale({
      customer: '',
      amount: '',
      paymentStatus: 'Paid',
      paymentMethod: 'UPI',
      route: 'Central Delhi'
    });
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          o.partner.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch && o.status === 'Delivered';
  });

  // Calculate dynamic stats metrics
  const totalOrdersCount = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.rawAmount || 0), 0);
  const settledAmount = orders
    .filter(o => o.status === 'Delivered' && o.paymentStatus === 'Paid')
    .reduce((sum, o) => sum + (o.rawAmount || 0), 0);
  const creditDue = orders
    .filter(o => o.status === 'Delivered' && o.paymentStatus === 'Credit')
    .reduce((sum, o) => sum + (o.rawAmount || 0), 0);

  // Formatter helpers
  const formatLakhs = (val) => {
    if (val >= 100000) {
      return `₹${(val / 100000).toFixed(2)}L`;
    }
    return `₹${val.toLocaleString('en-IN')}`;
  };

  return (
    <>
      {notification && (
        <div className={`fixed top-12 left-1/2 -translate-x-1/2 z-[500] px-8 py-4 rounded-2xl shadow-2xl animate-in slide-in-from-top-8 duration-300 flex items-center gap-3 font-black uppercase text-[10px] tracking-widest border ${
          notification.type === 'error' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-[#0a4a34] text-white border-white/10'
        }`}>
          <ReceiptText className="w-4 h-4 text-emerald-400" />
          {notification.message}
        </div>
      )}

      {/* Manual Sale Modal */}
      {isAddSaleOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-emerald-50/50 to-transparent dark:from-emerald-900/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#006e2f]/10 rounded-xl flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-[#006e2f]" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tighter">Add Manual Sale</h3>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Register Direct Transaction</p>
                </div>
              </div>
              <button 
                onClick={() => setIsAddSaleOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSale} className="p-6 space-y-5">
              <div className="space-y-1.5"> 
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block ml-1">Customer / Partner Name</label> 
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600">
                    <User className="w-4 h-4" />
                  </div>
                  <input 
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border-none rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-[#006e2f]/20 transition-all text-slate-700 dark:text-white placeholder:text-slate-300" 
                    value={newSale.customer} 
                    onChange={(e) => setNewSale({...newSale, customer: e.target.value})} 
                    placeholder="e.g. Star Retailers"
                    required 
                  /> 
                </div>
              </div>

              <div className="space-y-1.5"> 
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block ml-1">Total Amount (₹)</label> 
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600">
                    <IndianRupee className="w-4 h-4" />
                  </div>
                  <input 
                    type="number"
                    step="any"
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border-none rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-[#006e2f]/20 transition-all text-slate-700 dark:text-white placeholder:text-slate-300" 
                    value={newSale.amount} 
                    onChange={(e) => setNewSale({...newSale, amount: e.target.value})} 
                    placeholder="e.g. 1500"
                    required 
                  /> 
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5"> 
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block ml-1">Payment Status</label> 
                  <select 
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border-none rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-[#006e2f]/20 transition-all text-slate-700 dark:text-white cursor-pointer" 
                    value={newSale.paymentStatus} 
                    onChange={(e) => setNewSale({...newSale, paymentStatus: e.target.value})}
                  >
                    <option value="Paid">Paid</option>
                    <option value="Credit">Credit (Due)</option>
                  </select> 
                </div>

                {newSale.paymentStatus === 'Paid' && (
                  <div className="space-y-1.5"> 
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block ml-1">Payment Method</label> 
                    <select 
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border-none rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-[#006e2f]/20 transition-all text-slate-700 dark:text-white cursor-pointer" 
                      value={newSale.paymentMethod} 
                      onChange={(e) => setNewSale({...newSale, paymentMethod: e.target.value})}
                    >
                      <option value="UPI">UPI</option>
                      <option value="Cash">Cash</option>
                      <option value="Card">Card</option>
                    </select> 
                  </div>
                )}
              </div>

              <div className="space-y-1.5"> 
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block ml-1">Route / Zone</label> 
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <input 
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border-none rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-slate-200 transition-all text-slate-700 dark:text-white placeholder:text-slate-300" 
                    value={newSale.route} 
                    onChange={(e) => setNewSale({...newSale, route: e.target.value})} 
                    placeholder="e.g. South Zone"
                    required 
                  /> 
                </div>
              </div>

              <button 
                type="submit"
                className="w-full mt-4 py-4 bg-[#0a4a34] text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:shadow-2xl hover:bg-[#006e2f] hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
              >
                <CheckCircle className="w-5 h-5" />
                Record Sale
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ERP Command Header */}
      <div className="flex flex-col xl:flex-row gap-8 mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-[#0a4a34] rounded-lg flex items-center justify-center shadow-lg shadow-green-900/10">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Delivery History</h2>
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
          <button 
            onClick={() => setIsAddSaleOpen(true)}
            className="flex items-center gap-2 bg-[#006e2f] hover:bg-[#0a4a34] text-white px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-md shadow-emerald-900/20"
          >
            <Plus className="w-4 h-4" /> Add Sale
          </button>
          <button className="flex items-center gap-2 text-slate-400 hover:text-slate-600 px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      {/* Summary Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatBox label="Total Orders" value={totalOrdersCount.toLocaleString('en-IN')} trend="+12.5%" icon={ShoppingBag} />
        <StatBox label="Active Revenue" value={formatLakhs(totalRevenue)} trend="+8.2%" icon={TrendingUp} />
        <StatBox label="Settled Amount" value={formatLakhs(settledAmount)} sub="Paid" icon={CheckCircle} />
        <StatBox label="Credit Due" value={formatLakhs(creditDue)} sub="Outstanding" icon={AlertCircle} alert />
      </div>

      {/* Order Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
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
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.12em]">Reward</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.12em]">Logistics</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.12em]">Amount</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.12em]">Payment</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.12em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-8 py-16 text-center text-slate-400 text-sm font-medium">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-8 h-8 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Retrieving Transaction Ledger...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-8 py-12 text-center text-slate-400 text-sm font-medium">No delivered orders found.</td>
                </tr>
              ) : filteredOrders.map((order) => (
                <tr 
                  key={order.id} 
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all group cursor-pointer"
                  onClick={() => navigate(`/orders/${order.id.replace('#', '')}`)}
                >
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                      <span className="font-black text-slate-900 dark:text-white text-sm tracking-tight">{order.id}</span>
                      <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1 mt-0.5 uppercase tracking-widest">
                        <Clock className="w-3 h-3" /> {order.time}
                      </span>
                      <div className="mt-2 text-xs font-bold text-slate-600 dark:text-slate-400">{order.partner}</div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5 text-[#0a4a34] dark:text-emerald-400 font-black text-sm">
                        <CheckCircle className="w-4 h-4" /> +{order.points} PTS
                      </div>
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">Loyalty Earned</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                        <MapPin className="w-3 h-3 text-slate-300 dark:text-slate-700" /> {order.route}
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                        <Calendar className="w-3 h-3 text-slate-300 dark:text-slate-700" /> {order.slot}
                      </div>
                      {order.driver ? (
                        <div className="flex items-center gap-1.5 text-[10px] text-[#0a4a34] dark:text-emerald-400 font-black uppercase tracking-widest">
                          <User className="w-3 h-3" /> {order.driver}
                        </div>
                      ) : (
                        <div className="text-[9px] text-slate-300 dark:text-slate-700 font-black uppercase tracking-widest">Unassigned</div>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="font-black text-slate-900 dark:text-white text-sm tracking-tight">{order.amount}</div>
                  </td>
                  <td className="px-8 py-5">
                    {order.paymentStatus === 'Credit' ? (
                      <div className="flex flex-col">
                        <span className="text-[11px] font-black text-red-500 uppercase tracking-widest">Pending</span>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Credit Due: {order.amount}</span>
                      </div>
                    ) : (
                      <div className="flex flex-col">
                        <span className="text-[11px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Paid via {order.paymentMethod}</span>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Fully Settled</span>
                      </div>
                    )}
                  </td>
                  <td className="px-8 py-5 text-right" onClick={(e) => e.stopPropagation()}>
                    {order.paymentStatus === 'Credit' ? (
                      <div className="flex items-center justify-end gap-3">
                        <button 
                          onClick={() => alert(`QR Code sent to ${order.partner} for amount ${order.amount}`)}
                          className="px-4 py-2 bg-slate-900 dark:bg-slate-800 text-white text-[10px] font-black rounded-xl hover:bg-slate-800 dark:hover:bg-slate-700 shadow-lg transition-all active:scale-95 uppercase tracking-widest flex items-center gap-2"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          Send QR
                        </button>
                        <button 
                          onClick={() => navigate(`/orders/${order.id.replace('#', '')}`)}
                          className="p-2 text-slate-300 hover:text-slate-600 transition-colors bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center gap-2 px-3"
                        >
                          <span className="text-[9px] font-black uppercase tracking-widest">Details</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end gap-3">
                        {order.invoiceGenerated ? (
                          <button 
                            onClick={(e) => handleGenerateInvoice(e, order)}
                            className="inline-flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-xl border border-blue-100 dark:border-blue-900/50 hover:bg-blue-100 hover:scale-105 transition-all"
                            title="View Generated Invoice"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" /> 
                            <span className="text-[9px] font-black uppercase tracking-widest">Invoice</span>
                            <ReceiptText className="w-3 h-3 ml-1" />
                          </button>
                        ) : (
                          <button 
                            onClick={(e) => handleGenerateInvoice(e, order)}
                            className="inline-flex items-center gap-2 px-3 py-2 bg-slate-50 text-slate-400 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:text-[#0a4a34] hover:bg-emerald-50 hover:border-emerald-200 transition-all active:scale-95"
                            title="Generate Invoice"
                          >
                            <span className="text-[9px] font-black uppercase tracking-widest">Invoice</span>
                            <ReceiptText className="w-3 h-3 ml-1" />
                          </button>
                        )}
                        <button 
                          onClick={() => navigate(`/orders/${order.id.replace('#', '')}`)}
                          className="p-2 text-slate-300 hover:text-slate-600 transition-colors bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center gap-2 px-3"
                        >
                          <span className="text-[9px] font-black uppercase tracking-widest">Details</span>
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
