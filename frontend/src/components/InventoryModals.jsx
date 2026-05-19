import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle, Package, ArrowUpRight, TrendingDown } from 'lucide-react';

export const InwardStockModal = ({ isOpen, onClose, products, onComplete }) => {
  const [formData, setFormData] = useState({
    productId: '',
    quantity: '',
    unitPrice: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch('http://localhost:5055/api/inventory/purchases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.quantity) * parseFloat(formData.unitPrice)
        })
      });

      if (res.ok) {
        onComplete();
        onClose();
      } else {
        const error = await res.json();
        alert(error.message || 'Failed to log purchase');
      }
    } catch (err) {
      console.error(err);
      alert('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Inward Stock Entry</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Record new inventory arrival</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-xl transition-all shadow-sm">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Product</label>
            <select 
              required
              className="w-full px-5 py-3.5 bg-[#f3f6f5] dark:bg-slate-800 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
              value={formData.productId}
              onChange={(e) => setFormData({...formData, productId: e.target.value})}
            >
              <option value="">Choose a product...</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Quantity</label>
              <input 
                type="number" 
                required
                className="w-full px-5 py-3.5 bg-[#f3f6f5] dark:bg-slate-800 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
                placeholder="0.00"
                value={formData.quantity}
                onChange={(e) => setFormData({...formData, quantity: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Unit Price (₹)</label>
              <input 
                type="number" 
                required
                className="w-full px-5 py-3.5 bg-[#f3f6f5] dark:bg-slate-800 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
                placeholder="0.00"
                value={formData.unitPrice}
                onChange={(e) => setFormData({...formData, unitPrice: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Notes / Description</label>
            <textarea 
              className="w-full px-5 py-3.5 bg-[#f3f6f5] dark:bg-slate-800 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none h-24 resize-none"
              placeholder="Supplier name, quality notes, etc."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-[1.5rem] font-black uppercase tracking-widest text-[12px] shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <ArrowUpRight className="w-5 h-5" />}
            Confirm Inward Stock
          </button>
        </form>
      </div>
    </div>
  );
};

export const AdjustStockModal = ({ isOpen, onClose, product, onComplete }) => {
  const [formData, setFormData] = useState({
    type: 'add',
    quantity: '',
    reason: ''
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch('http://localhost:5055/api/inventory/adjustments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          productId: product.id,
          ...formData
        })
      });

      if (res.ok) {
        onComplete();
        onClose();
      } else {
        const error = await res.json();
        alert(error.message || 'Failed to adjust stock');
      }
    } catch (err) {
      console.error(err);
      alert('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-amber-50/50">
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Adjust Stock</h3>
            <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mt-1">{product.name} • {product.sku}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-xl transition-all shadow-sm">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="flex bg-[#f3f6f5] dark:bg-slate-800 p-1.5 rounded-2xl">
            {['add', 'subtract', 'set'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setFormData({...formData, type: t})}
                className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
                  formData.type === t 
                  ? 'bg-white dark:bg-slate-700 text-slate-900 shadow-sm' 
                  : 'text-slate-400'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Adjustment Quantity</label>
            <div className="relative">
              <input 
                type="number" 
                required
                className="w-full px-5 py-3.5 bg-[#f3f6f5] dark:bg-slate-800 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-amber-500/20 transition-all outline-none"
                placeholder="0.00"
                value={formData.quantity}
                onChange={(e) => setFormData({...formData, quantity: e.target.value})}
              />
              <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 uppercase">{product.unit}</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Reason for Adjustment</label>
            <select 
              required
              className="w-full px-5 py-3.5 bg-[#f3f6f5] dark:bg-slate-800 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-amber-500/20 transition-all outline-none"
              value={formData.reason}
              onChange={(e) => setFormData({...formData, reason: e.target.value})}
            >
              <option value="">Select a reason...</option>
              <option value="Correction">Manual Correction</option>
              <option value="Damage">Damaged / Expired</option>
              <option value="Return">Customer Return</option>
              <option value="Inventory Check">Physical Audit</option>
            </select>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 text-white rounded-[1.5rem] font-black uppercase tracking-widest text-[12px] shadow-lg transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <TrendingDown className={`w-5 h-5 ${formData.type === 'add' ? 'rotate-180' : ''}`} />}
            Apply Adjustment
          </button>
        </form>
      </div>
    </div>
  );
};
