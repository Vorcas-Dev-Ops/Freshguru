import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Printer, 
  ArrowLeft,
  Download,
  Share2,
  Mail,
  MessageSquare,
  QrCode,
  TrendingUp,
  DollarSign,
  Leaf
} from 'lucide-react';
import { useUser } from '../context/UserContext';

const API_BASE = 'http://localhost:5055/api';

const Invoice = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoiceData = async () => {
      try {
        const orderIdFormatted = `FG-ORD-${id}`;
        // Fetch specific order details
        const res = await fetch(`${API_BASE}/orders`);
        if (res.ok) {
          const data = await res.json();
          const foundOrder = data.find(o => o.order_id === orderIdFormatted || o.id === orderIdFormatted);
          
          if (foundOrder) {
            setOrder(foundOrder);
            
            // Fetch items
            const itemsRes = await fetch(`${API_BASE}/orders/items/by-order/${foundOrder.order_id}`);
            if (itemsRes.ok) {
              const itemsData = await itemsRes.json();
              setItems(itemsData);
            }
            
            // Fetch drivers
            if (foundOrder.driver_id || foundOrder.driver) {
               const driversRes = await fetch(`${API_BASE}/fleet`);
               if (driversRes.ok) {
                 const dData = await driversRes.json();
                 const foundDriver = dData.find(d => d.id === (foundOrder.driver_id || foundOrder.driver));
                 if (foundDriver) setDriver(foundDriver);
               }
            }
          }
        }
      } catch (err) {
        console.error('Failed to fetch invoice data', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchInvoiceData();
  }, [id]);

  if (loading) return <div className="flex items-center justify-center h-screen bg-slate-50"><p className="font-black text-slate-400 uppercase tracking-widest animate-pulse">Loading Invoice...</p></div>;
  if (!order) return <div className="flex flex-col items-center justify-center h-screen bg-slate-50"><p className="font-black text-slate-900 text-2xl mb-4">Invoice Not Found</p><button onClick={() => navigate(-1)} className="text-emerald-600 font-bold uppercase tracking-widest underline">Go Back</button></div>;

  const calculateSubtotal = () => {
    return items.reduce((acc, item) => acc + ((parseFloat(item.quantity) - (parseFloat(item.damagedQuantity) || 0)) * parseFloat(item.price_at_order)), 0);
  };

  const subtotal = calculateSubtotal();
  const gst = subtotal * 0.05; // 5% GST
  const deliveryCharge = 12.00; // Standard charge
  const grandTotal = subtotal + gst + deliveryCharge;
  
  // Dummy data for visual
  const loyaltyEarned = Math.floor(grandTotal / 100);
  const totalLoyalty = 1250 + loyaltyEarned;
  
  const paymentStatus = order.order_id.endsWith('30') || order.order_id.endsWith('8') ? 'Paid' : 'Credit';

  const grossProfit = subtotal * 0.28; // Simulated 28% margin
  const netProfit = grossProfit - deliveryCharge;

  return (
    <div className="min-h-screen bg-slate-50 md:py-8 py-0 flex flex-col items-center">
      
      {/* Floating Action Bar (Hidden when printing) */}
      <div className="w-full max-w-[210mm] mb-6 print:hidden space-y-4">
        
        {/* Top Analytics Card */}
        <div className="bg-[#0a4a34] text-white px-6 py-4 rounded-[2rem] shadow-sm flex flex-wrap gap-8 items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
             </div>
             <div>
                <p className="text-[10px] font-bold text-emerald-400/80 uppercase tracking-widest">Order Gross Profit</p>
                <p className="text-xl font-black tabular-nums">₹{grossProfit.toLocaleString('en-IN', {minimumFractionDigits: 2})}</p>
             </div>
          </div>
          <div className="h-10 w-px bg-white/10 hidden md:block" />
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-emerald-400" />
             </div>
             <div>
                <p className="text-[10px] font-bold text-emerald-400/80 uppercase tracking-widest">Order Net Profit</p>
                <p className="text-xl font-black tabular-nums">₹{netProfit.toLocaleString('en-IN', {minimumFractionDigits: 2})}</p>
             </div>
          </div>
          <div className="flex-1" />
          {paymentStatus === 'Credit' && (
            <button 
               onClick={() => alert(`QR Code Payment link sent via WhatsApp to ${order.partner}`)}
               className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-[#0a4a34] rounded-xl text-[11px] font-black uppercase tracking-widest transition-colors shadow-lg active:scale-95"
            >
              <QrCode className="w-4 h-4" /> Send QR (WhatsApp)
            </button>
          )}
        </div>

        <div className="bg-white px-6 py-4 rounded-[2rem] shadow-sm border border-slate-200 flex flex-wrap gap-4 items-center justify-between">
          <button onClick={() => navigate('/orders')} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to History
          </button>
          <div className="flex gap-3">
            <button onClick={() => window.print()} className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[11px] font-black uppercase tracking-widest transition-colors shadow-lg shadow-emerald-600/20 active:scale-95">
              <Printer className="w-4 h-4" /> Print Invoice
            </button>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[11px] font-black uppercase tracking-widest transition-colors shadow-lg shadow-slate-900/20 active:scale-95">
              <Download className="w-4 h-4" /> PDF
            </button>
            <button className="flex items-center justify-center w-10 h-10 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors active:scale-95">
              <MessageSquare className="w-4 h-4" />
            </button>
            <button className="flex items-center justify-center w-10 h-10 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors active:scale-95">
              <Mail className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* A4 Paper Container */}
      <div className="w-full max-w-[210mm] min-h-[297mm] bg-white md:shadow-2xl md:rounded-[2rem] rounded-none overflow-hidden text-slate-900 print:shadow-none print:rounded-none relative">
        
        {/* Top Accent Line */}
        <div className="h-2 w-full bg-emerald-600 absolute top-0 left-0" />
        
        <div className="p-10 md:p-14">
          
          {/* HEADER SECTION */}
          <div className="flex justify-between items-start mb-12">
            <div>
              <div className="flex items-center gap-2 mb-2 select-none">
                <Leaf className="w-6 h-6 text-emerald-600 shrink-0" />
                <span className="text-xl font-black text-slate-900 tracking-wider logo-font">FRESH <span className="text-emerald-600 font-extrabold">GURU</span></span>
              </div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Cloud-Based Multi-Branch Inventory System</p>
              <div className="space-y-1 text-[11px] text-slate-600 font-medium">
                <p>123 Wholesale Market, Sector 14</p>
                <p>Delhi NCR, India 110001</p>
                <p>GSTIN: <span className="font-bold">07AABCD1234E1Z5</span></p>
                <p>Email: <span className="font-bold">billing@freshguru.in</span></p>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-3xl font-black text-slate-200 uppercase tracking-tighter mb-4">Tax Invoice</h2>
              <div className="inline-block border-2 border-emerald-600 text-emerald-700 px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest transform rotate-3 opacity-90 shadow-sm">
                Original for Recipient
              </div>
            </div>
          </div>

          <div className="h-px bg-slate-200 w-full mb-10" />

          {/* METADATA GRID */}
          <div className="grid grid-cols-3 gap-8 mb-10 text-sm">
            {/* Invoice Info */}
            <div>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Invoice Information</h3>
              <div className="space-y-2">
                <p className="text-[12px]"><span className="text-slate-500 font-medium">Invoice No:</span> <span className="font-bold">INV-2026-{order.id.split('-').pop()}</span></p>
                <p className="text-[12px]"><span className="text-slate-500 font-medium">Order ID:</span> <span className="font-bold">{order.order_id || order.id}</span></p>
                <p className="text-[12px]"><span className="text-slate-500 font-medium">Invoice Date:</span> <span className="font-bold">{new Date().toLocaleDateString('en-IN', {day:'numeric', month:'short', year:'numeric'})}</span></p>
                <p className="text-[12px]"><span className="text-slate-500 font-medium">Payment Terms:</span> <span className="font-bold">Net 15 Days</span></p>
              </div>
            </div>

            {/* Customer Info */}
            <div>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Billed To</h3>
              <div className="space-y-2">
                <p className="font-black text-[14px] uppercase tracking-tight">{order.partner}</p>
                <p className="text-[12px] text-slate-600 font-medium leading-relaxed max-w-[200px]">{order.location}</p>
                <p className="text-[12px]"><span className="text-slate-500 font-medium">GSTIN:</span> <span className="font-bold">07BCCDE5678F2Z9</span></p>
                <p className="text-[12px]"><span className="text-slate-500 font-medium">Type:</span> <span className="font-bold">B2B Wholesale</span></p>
              </div>
            </div>

            {/* Delivery Info */}
            <div>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Delivery Details</h3>
              <div className="space-y-2">
                <p className="text-[12px]"><span className="text-slate-500 font-medium">Status:</span> <span className={`font-black uppercase tracking-wider ${order.status === 'Delivered' ? 'text-emerald-600' : 'text-orange-500'}`}>{order.status}</span></p>
                <p className="text-[12px]"><span className="text-slate-500 font-medium">Date:</span> <span className="font-bold">{order.date}</span></p>
                <p className="text-[12px]"><span className="text-slate-500 font-medium">Slot:</span> <span className="font-bold">{order.slot || 'Morning (9AM-12PM)'}</span></p>
                <p className="text-[12px]"><span className="text-slate-500 font-medium">Fleet Agent:</span> <span className="font-bold">{driver?.name || order.driverName || 'N/A'}</span></p>
              </div>
            </div>
          </div>

          {/* PRODUCT TABLE */}
          <div className="mb-10">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-emerald-50/50 border-y border-slate-200">
                  <th className="py-3 px-4 text-[10px] font-black text-slate-500 uppercase tracking-widest w-[10%] text-center">No.</th>
                  <th className="py-3 px-4 text-[10px] font-black text-slate-500 uppercase tracking-widest w-[35%]">Product Description</th>
                  <th className="py-3 px-4 text-[10px] font-black text-slate-500 uppercase tracking-widest w-[15%] text-right">Quantity</th>
                  <th className="py-3 px-4 text-[10px] font-black text-slate-500 uppercase tracking-widest w-[15%] text-right">Rate</th>
                  <th className="py-3 px-4 text-[10px] font-black text-slate-500 uppercase tracking-widest w-[10%] text-center">GST</th>
                  <th className="py-3 px-4 text-[10px] font-black text-slate-500 uppercase tracking-widest w-[15%] text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => {
                  const effectiveQty = parseFloat(item.quantity) - (parseFloat(item.damagedQuantity) || 0);
                  const lineTotal = effectiveQty * parseFloat(item.price_at_order);
                  return (
                    <tr key={index} className="border-b border-slate-100 last:border-slate-200">
                      <td className="py-4 px-4 text-[12px] font-bold text-slate-400 text-center">{index + 1}</td>
                      <td className="py-4 px-4">
                        <p className="text-[13px] font-black text-slate-900 tracking-tight">{item.product_name}</p>
                        {item.damagedQuantity > 0 && (
                          <p className="text-[10px] font-bold text-red-500 mt-0.5">-{item.damagedQuantity} {item.unit} damaged/deducted</p>
                        )}
                      </td>
                      <td className="py-4 px-4 text-[13px] font-bold text-slate-700 text-right">{effectiveQty} <span className="text-[10px] text-slate-400 uppercase">{item.unit}</span></td>
                      <td className="py-4 px-4 text-[13px] font-bold text-slate-700 text-right">₹{parseFloat(item.price_at_order).toFixed(2)}</td>
                      <td className="py-4 px-4 text-[11px] font-bold text-slate-500 text-center">5%</td>
                      <td className="py-4 px-4 text-[14px] font-black text-slate-900 text-right tabular-nums">₹{lineTotal.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* LOWER SECTION: SUMMARY & PAYMENTS */}
          <div className="grid grid-cols-2 gap-12 mb-12">
            
            {/* Left Side: Payments & QR */}
            <div className="space-y-8">
              {/* Payment Details */}
              <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Payment Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Method</p>
                    <p className="text-[12px] font-black text-slate-900">{paymentStatus === 'Credit' ? 'B2B Credit Billing' : 'Prepaid (UPI)'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Amount Paid</p>
                    <p className="text-[12px] font-black text-slate-900">{paymentStatus === 'Credit' ? '₹0.00' : `₹${grandTotal.toLocaleString('en-IN', {minimumFractionDigits: 2})}`}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Pending Balance</p>
                    <p className={`text-[12px] font-black ${paymentStatus === 'Credit' ? 'text-orange-600' : 'text-emerald-600'}`}>{paymentStatus === 'Credit' ? `₹${grandTotal.toLocaleString('en-IN', {minimumFractionDigits: 2})}` : '₹0.00'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Credit Limit</p>
                    <p className="text-[12px] font-black text-emerald-600">₹50,000.00</p>
                  </div>
                </div>
              </div>

              {/* QR Code Section */}
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 bg-white border-2 border-slate-200 p-2 rounded-xl shrink-0">
                  {/* Using a placeholder SVG for QR Code aesthetic */}
                  <svg viewBox="0 0 100 100" className="w-full h-full text-slate-800" fill="currentColor">
                    <path d="M0 0h30v30H0zM10 10h10v10H10zM70 0h30v30H70zM80 10h10v10H80zM0 70h30v30H0zM10 80h10v10H10zM40 0h20v10H40zM40 20h20v10H40zM40 40h10v20H40zM60 40h20v10H60zM40 70h10v30H40zM60 60h10v20H60zM80 60h20v10H80zM80 80h10v20H80zM60 90h10v10H60z" />
                    <rect x="0" y="40" width="10" height="10" />
                    <rect x="20" y="40" width="10" height="10" />
                    <rect x="10" y="50" width="10" height="10" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Scan to Pay via UPI</h3>
                  <p className="text-[14px] font-black text-slate-900 tracking-tight mb-0.5">UPI ID: payments@freshguru</p>
                  <p className="text-[10px] font-medium text-slate-500">Supports GPay, PhonePe, Paytm</p>
                </div>
              </div>

              {/* Loyalty */}
              <div className="flex items-center gap-4 text-[11px] font-bold text-slate-600 bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
                <div className="bg-emerald-100 text-emerald-600 p-2 rounded-lg"><Printer className="w-4 h-4" /></div>
                <div>
                  <p><span className="text-emerald-700">+{loyaltyEarned} Points</span> earned on this order.</p>
                  <p className="text-[9px] uppercase tracking-widest text-slate-400 mt-0.5">Total Balance: {totalLoyalty}</p>
                </div>
              </div>

            </div>

            {/* Right Side: Financial Summary */}
            <div className="border border-slate-200 rounded-xl bg-white overflow-hidden flex flex-col justify-between">
              <div className="p-6 space-y-4">
                <div className="flex justify-between text-[12px] font-bold">
                  <span className="text-slate-500 uppercase tracking-wider">Subtotal</span>
                  <span className="text-slate-900 tabular-nums">₹{subtotal.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
                </div>
                <div className="flex justify-between text-[12px] font-bold">
                  <span className="text-slate-500 uppercase tracking-wider">Total Discount</span>
                  <span className="text-slate-900 tabular-nums">₹0.00</span>
                </div>
                <div className="flex justify-between text-[12px] font-bold">
                  <span className="text-slate-500 uppercase tracking-wider">GST (5%)</span>
                  <span className="text-slate-900 tabular-nums">₹{gst.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
                </div>
                <div className="flex justify-between text-[12px] font-bold">
                  <span className="text-slate-500 uppercase tracking-wider">Delivery Charges</span>
                  <span className="text-slate-900 tabular-nums">₹{deliveryCharge.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
                </div>
              </div>
              <div className="bg-slate-50 border-t border-slate-200 p-6 flex justify-between items-end">
                <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1">Grand Total</span>
                <span className="text-3xl font-black text-emerald-700 tracking-tighter tabular-nums">₹{grandTotal.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
              </div>
            </div>

          </div>

          {/* FOOTER */}
          <div className="border-t border-slate-200 pt-8 mt-auto">
            <div className="flex justify-between items-end">
              <div className="max-w-[60%]">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Terms & Conditions</h3>
                <ul className="text-[9px] text-slate-500 font-medium space-y-1 list-disc pl-4">
                  <li>Goods once sold cannot be returned after delivery.</li>
                  <li>Payment is due within 15 days of invoice generation.</li>
                  <li>Interest of 1.5% per month applies to overdue balances.</li>
                  <li>All disputes subject to Delhi jurisdiction.</li>
                </ul>
              </div>
              
              <div className="flex gap-12 text-center">
                <div>
                  <div className="w-32 h-12 border-b border-dashed border-slate-300 mb-2"></div>
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Customer Signature</p>
                </div>
                <div>
                  <div className="w-32 h-12 border-b border-dashed border-slate-300 mb-2 flex items-end justify-center pb-1">
                     <span className="logo-font text-xl text-emerald-800 opacity-80 -rotate-6">Fresh Guru</span>
                  </div>
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Authorized Signatory</p>
                </div>
              </div>
            </div>
            <div className="mt-8 text-center text-[8px] font-bold text-slate-400 uppercase tracking-widest">
              Computer Generated Invoice. No seal required.
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Invoice;
