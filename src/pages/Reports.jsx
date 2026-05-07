import React, { useState } from 'react';
import { 
  Download, 
  CreditCard, 
  Wallet, 
  Banknote, 
  FileText, 
  Filter, 
  Calendar,
  ChevronRight,
  X,
  Printer,
  CheckCircle2,
  TrendingUp,
  Receipt
} from 'lucide-react';

const Reports = () => {
  const [showInvoice, setShowInvoice] = useState(null);
  const [reports, setReports] = useState([
    { id: '#FG-ORD-9830', date: '05 May, 2026', customer: 'Metro Gourmet', location: 'Indiranagar, BLR', amount: '₹14,500', method: 'Cash', icon: Banknote, iconColor: 'text-green-600' },
    { id: '#FG-ORD-9828', date: '05 May, 2026', customer: 'Fresh Mart', location: 'Whitefield, BLR', amount: '₹8,920', method: 'Debit Card', icon: CreditCard, iconColor: 'text-blue-600' },
    { id: '#FG-ORD-9825', date: '04 May, 2026', customer: 'Green Grocers', location: 'Jayanagar, BLR', amount: '₹22,100', method: 'UPI', icon: Wallet, iconColor: 'text-purple-600' },
  ]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Financial Reports</h2>
          <p className="text-slate-500 font-bold text-sm">Review completed orders, payment methods, and generate invoices.</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-all active:scale-95 shadow-lg shadow-green-100">
            <Download className="w-5 h-5" />
            Export Excel
          </button>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Revenue (MTD)</p>
              <p className="text-xl font-black text-slate-900">₹42,85,400</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center p-6 bg-slate-50 border border-slate-200 rounded-2xl shadow-sm">
        <div className="flex flex-col min-w-[200px]">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Date Range</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="date" className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
          </div>
        </div>
        <div className="flex flex-col min-w-[200px]">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Payment Method</label>
          <select className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all">
            <option>All Methods</option>
            <option>Cash</option>
            <option>UPI</option>
            <option>Card</option>
          </select>
        </div>
        <button className="mt-auto px-8 py-2.5 bg-slate-900 text-white text-[11px] font-black rounded-xl hover:opacity-90 transition-all uppercase tracking-widest active:scale-95 shadow-lg shadow-slate-200">
          Apply Filters
        </button>
      </div>

      {/* Reports Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Date</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Order ID</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Customer</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Amount</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Payment</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-slate-50/50 transition-all group">
                  <td className="px-6 py-5">
                    <p className="text-[11px] font-bold text-slate-500">{report.date}</p>
                  </td>
                  <td className="px-6 py-5">
                    <p className="font-black text-primary text-sm hover:underline cursor-pointer">{report.id}</p>
                  </td>
                  <td className="px-6 py-5">
                    <p className="font-bold text-slate-900 text-sm">{report.customer}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">{report.location}</p>
                  </td>
                  <td className="px-6 py-5">
                    <p className="font-black text-primary text-sm">{report.amount}</p>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <report.icon className={`w-4 h-4 ${report.iconColor}`} />
                      <span className="text-[11px] font-bold text-slate-600">{report.method}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button 
                      onClick={() => setShowInvoice(report)}
                      className="text-primary hover:bg-primary/5 px-3 py-1.5 rounded-lg transition-all font-black text-[10px] uppercase tracking-widest flex items-center justify-end gap-2 ml-auto"
                    >
                      <Receipt className="w-4 h-4" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Modal */}
      {showInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
            <div className="px-8 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Tax Invoice <span className="text-primary ml-2">{showInvoice.id}</span></h3>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"><Printer className="w-5 h-5" /></button>
                <button onClick={() => setShowInvoice(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"><X className="w-6 h-6" /></button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-12 bg-white">
              <div className="border-[6px] border-double border-slate-100 p-10">
                <div className="flex justify-between items-start mb-12">
                  <div>
                    <h4 className="text-3xl font-black text-green-600 tracking-tighter uppercase mb-2">Fresh Guru</h4>
                    <p className="text-[11px] font-bold text-slate-400 leading-relaxed">Logistics Center, Bangalore, 560001<br />GSTIN: 29AAAAA0000A1Z5</p>
                  </div>
                  <div className="text-right">
                    <h5 className="font-black text-slate-300 uppercase tracking-widest text-[10px] mb-2">Bill To</h5>
                    <p className="font-black text-slate-900 text-lg leading-none">{showInvoice.customer}</p>
                    <p className="text-[11px] font-bold text-slate-400 mt-1">{showInvoice.location}</p>
                  </div>
                </div>

                <table className="w-full text-left border-collapse mb-10">
                  <thead>
                    <tr className="border-b-2 border-slate-900">
                      <th className="py-4 text-[11px] font-black uppercase tracking-widest text-slate-900">Description</th>
                      <th className="py-4 text-[11px] font-black uppercase tracking-widest text-slate-900 text-right">Qty</th>
                      <th className="py-4 text-[11px] font-black uppercase tracking-widest text-slate-900 text-right">Rate</th>
                      <th className="py-4 text-[11px] font-black uppercase tracking-widest text-slate-900 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="py-5 font-bold text-slate-900">Premium Fuji Apples (10kg Box)</td>
                      <td className="py-5 text-right font-bold text-slate-600">5</td>
                      <td className="py-5 text-right font-bold text-slate-600">₹1,800</td>
                      <td className="py-5 text-right font-black text-slate-900">₹9,000</td>
                    </tr>
                    <tr>
                      <td className="py-5 font-bold text-slate-900">Organic Alphonso Mangoes (Doz)</td>
                      <td className="py-5 text-right font-bold text-slate-600">10</td>
                      <td className="py-5 text-right font-bold text-slate-600">₹550</td>
                      <td className="py-5 text-right font-black text-slate-900">₹5,500</td>
                    </tr>
                  </tbody>
                </table>

                <div className="flex justify-end">
                  <div className="w-72 space-y-3">
                    <div className="flex justify-between text-[11px] font-black text-slate-400 uppercase tracking-widest">
                      <span>Subtotal</span>
                      <span className="text-slate-900">₹14,500</span>
                    </div>
                    <div className="flex justify-between text-[11px] font-black text-slate-400 uppercase tracking-widest">
                      <span>Tax (GST 5%)</span>
                      <span className="text-slate-900">₹725</span>
                    </div>
                    <div className="flex justify-between text-2xl font-black text-slate-900 border-t-2 border-slate-900 pt-5 mt-2">
                      <span>Grand Total</span>
                      <span className="text-primary">₹15,225</span>
                    </div>
                  </div>
                </div>

                <div className="mt-24 text-center border-t border-dashed border-slate-200 pt-6">
                  <p className="text-[11px] font-bold text-slate-400 italic">Thank you for your business with Fresh Guru!</p>
                  <div className="flex items-center justify-center gap-2 text-green-600 mt-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <p className="text-[10px] font-black uppercase tracking-widest">Digitally Verified Document</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
