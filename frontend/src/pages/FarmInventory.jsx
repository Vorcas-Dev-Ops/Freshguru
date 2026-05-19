import React, { useState, useEffect } from 'react';
import { 
  Tractor,
  PackagePlus,
  History,
  TrendingUp,
  MapPin,
  Calendar,
  IndianRupee,
  ChevronDown,
  CheckCircle2,
  Scale,
  Leaf,
  Layers,
  ArrowUpRight,
  AlertCircle,
  Truck,
  Image as ImageIcon,
  Upload,
  X,
  Plus,
  Send
} from 'lucide-react';

const FarmInventory = () => {
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [ledger, setLedger] = useState([]);
  const [syncing, setSyncing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pushDirectly, setPushDirectly] = useState(false);
  
  // Default ledger mock data
  useEffect(() => {
    setLedger([
      { id: 'FP-1042', date: new Date().toISOString(), name: 'Fresh Red Tomatoes', category: 'Vegetables', source: 'Ramesh Farms, Block A', qty: 500, pushQty: 500, unit: 'kg', purchase: 18, sale: 28, status: 'Pushed' },
      { id: 'FP-1041', date: new Date(Date.now() - 86400000).toISOString(), name: 'Green Apples', category: 'Fruits', source: 'Valley Orchards', qty: 200, pushQty: 200, unit: 'Box', purchase: 450, sale: 600, status: 'Pending' },
      { id: 'FP-1040', date: new Date(Date.now() - 172800000).toISOString(), name: 'Organic Potatoes', category: 'Vegetables', source: 'Kisan Co-op', qty: 1000, pushQty: 800, unit: 'kg', purchase: 12, sale: 22, status: 'Pending' },
    ]);
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Vegetables',
    source: '',
    date: new Date().toISOString().split('T')[0],
    qty: '',
    unit: 'kg',
    purchaseRate: '',
    targetPrice: '',
    image: null
  });

  const categories = ['Fruits', 'Vegetables', 'Dairy', 'Organic', 'Grains', 'Herbs', 'Farm Supplies'];
  const units = ['kg', 'Crate', 'Box', 'Packet', 'Unit', 'Ton'];

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAddToLedger = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.qty || !formData.purchaseRate || !formData.targetPrice) return;

    setLoading(true);
    let status = 'Pending';
    const entryId = `FP-${Math.floor(Math.random() * 9000) + 1000}`;

    if (pushDirectly) {
      const token = localStorage.getItem('admin_token');
      const payload = {
        sku: `FARM-${formData.category.substring(0,3).toUpperCase()}-${Math.floor(Math.random()*10000)}`,
        name: formData.name, 
        category: formData.category, 
        purchasePrice: Number(formData.purchaseRate) || 0, 
        retailPrice: Number(formData.targetPrice) || 0, 
        unit: formData.unit || 'kg', 
        quantity: Number(formData.qty) || 0, 
        minQuantity: 10, 
        minOrderQty: 1, 
        imageUrl: '', 
        description: `Procured from: ${formData.source} on ${formData.date}`,
        hsn: '',
        discount: 0,
        taxType: 'GST 5%',
        enabled: true
      };

      try {
        const response = await fetch('http://localhost:5055/api/inventory/products', { 
          method: 'POST', 
          headers: { 
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${token}` 
          }, 
          body: JSON.stringify(payload) 
        });

        if (response.ok) {
          status = 'Pushed';
        } else {
           showNotification('Failed to push to main inventory. Added as Pending.', 'error');
        }
      } catch (err) {
         showNotification('Network error during push. Added as Pending.', 'error');
      }
    }

    // Add to local ledger
    const newEntry = {
      id: entryId,
      date: new Date(formData.date).toISOString(),
      name: formData.name,
      category: formData.category,
      source: formData.source || 'Direct Farm',
      qty: parseFloat(formData.qty),
      pushQty: parseFloat(formData.qty),
      unit: formData.unit,
      purchase: parseFloat(formData.purchaseRate),
      sale: parseFloat(formData.targetPrice),
      status: status
    };
    
    setLedger(prev => [newEntry, ...prev]);
    showNotification(status === 'Pushed' ? 'Stock Added and Pushed successfully!' : 'Produce added to Farm Ledger!');

    setLoading(false);
    setIsModalOpen(false);
    
    // Reset form
    setFormData({
      name: '',
      category: 'Vegetables',
      source: '',
      date: new Date().toISOString().split('T')[0],
      qty: '',
      unit: 'kg',
      purchaseRate: '',
      targetPrice: '',
      image: null
    });
    setPushDirectly(false);
  };

  const updatePushQty = (id, newQty) => {
    setLedger(prev => prev.map(item => {
      if (item.id === id) {
        let val = parseFloat(newQty) || 0;
        if (val > item.qty) val = item.qty;
        return { ...item, pushQty: val };
      }
      return item;
    }));
  };

  const handlePushSingle = async (id) => {
    const item = ledger.find(i => i.id === id);
    if (!item) return;

    setSyncing(true);
    const token = localStorage.getItem('admin_token');
    
    const payload = {
      sku: `FARM-${item.category.substring(0,3).toUpperCase()}-${Math.floor(Math.random()*10000)}`,
      name: item.name, 
      category: item.category, 
      purchasePrice: Number(item.purchase) || 0, 
      retailPrice: Number(item.sale) || 0, 
      unit: item.unit || 'kg', 
      quantity: Number(item.pushQty) || 0, 
      minQuantity: 10, 
      minOrderQty: 1, 
      imageUrl: '', 
      description: `Procured from: ${item.source} on ${new Date(item.date).toLocaleDateString()}`,
      hsn: '',
      discount: 0,
      taxType: 'GST 5%',
      enabled: true
    };

    try {
      const response = await fetch('http://localhost:5055/api/inventory/products', { 
        method: 'POST', 
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${token}` 
        }, 
        body: JSON.stringify(payload) 
      });

      if (response.ok) {
        showNotification('Successfully pushed to Main Inventory!');
        setLedger(prev => prev.map(l => l.id === id ? { ...l, status: 'Pushed' } : l));
      } else {
        showNotification('Failed to push item to inventory', 'error');
      }
    } catch (err) {
      showNotification('Network error.', 'error');
    }
    setSyncing(false);
  };

  return (
    <div className="min-h-screen bg-[#fcfdfe] dark:bg-slate-950 p-6 lg:p-8 font-inter">
      {/* 🧭 Header Section */}
      <header className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6 mb-10">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-[#0a4a34] rounded-lg flex items-center justify-center shadow-lg shadow-green-900/10">
              <Tractor className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Farm Procurement</h2>
          </div>
          <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Inward Farm Stock & Inventory Sync</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3.5 bg-[#006e2f] hover:bg-[#0a4a34] text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-900/20 hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4" />
          New Inward Stock
        </button>
      </header>

      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-6 right-6 z-[1000] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl animate-in slide-in-from-right-8 duration-300 ${
          notification.type === 'error' ? 'bg-red-900 text-white' : 'bg-emerald-900 text-white'
        }`}>
          {notification.type === 'error' ? <AlertCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
          <span className="text-xs font-black uppercase tracking-widest">{notification.message}</span>
        </div>
      )}

      {/* 📝 New Procurement Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-emerald-50/50 to-transparent dark:from-emerald-900/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#006e2f]/10 rounded-xl flex items-center justify-center">
                  <PackagePlus className="w-5 h-5 text-[#006e2f]" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tighter">New Inward Stock</h3>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Register Farm Produce</p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddToLedger} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <div className="space-y-1.5"> 
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block ml-1">Product Name</label> 
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600">
                    <Leaf className="w-4 h-4" />
                  </div>
                  <input 
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border-none rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-[#006e2f]/20 transition-all text-slate-700 dark:text-white placeholder:text-slate-300" 
                    value={formData.name} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})} 
                    placeholder="e.g. Fresh Red Tomatoes"
                    required 
                  /> 
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5"> 
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block ml-1">Category</label> 
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600">
                      <Layers className="w-4 h-4" />
                    </div>
                    <select 
                      className="w-full pl-11 pr-10 py-3 bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs font-bold text-emerald-700 dark:text-emerald-400 outline-none appearance-none focus:ring-2 focus:ring-[#006e2f]/20 transition-all cursor-pointer" 
                      value={formData.category} 
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                    >
                      {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select> 
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100 flex items-center justify-center pointer-events-none">
                      <ChevronDown className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5"> 
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block ml-1">Inward Date</label> 
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <input 
                      type="date"
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border-none rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-[#006e2f]/20 transition-all text-slate-700 dark:text-white" 
                      value={formData.date} 
                      onChange={(e) => setFormData({...formData, date: e.target.value})} 
                      required 
                    /> 
                  </div>
                </div>
              </div>

              <div className="space-y-1.5"> 
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block ml-1">Source / Farmer Details</label> 
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <input 
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border-none rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-[#006e2f]/20 transition-all text-slate-700 dark:text-white placeholder:text-slate-300" 
                    value={formData.source} 
                    onChange={(e) => setFormData({...formData, source: e.target.value})} 
                    placeholder="e.g. Ramesh Farms, Block A"
                    required 
                  /> 
                </div>
              </div>

              <div className="grid grid-cols-5 gap-3">
                <div className="space-y-1.5 col-span-3"> 
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block ml-1">Quantity Recv.</label> 
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600">
                      <Scale className="w-4 h-4" />
                    </div>
                    <input 
                      type="number"
                      step="any"
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border-none rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-[#006e2f]/20 transition-all text-slate-700 dark:text-white placeholder:text-slate-300" 
                      value={formData.qty} 
                      onChange={(e) => setFormData({...formData, qty: e.target.value})} 
                      placeholder="Amount"
                      required 
                    /> 
                  </div>
                </div>

                <div className="space-y-1.5 col-span-2"> 
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block ml-1">Unit</label> 
                  <select 
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border-none rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-[#006e2f]/20 transition-all text-slate-700 dark:text-white cursor-pointer" 
                    value={formData.unit} 
                    onChange={(e) => setFormData({...formData, unit: e.target.value})}
                  >
                    {units.map(u => <option key={u} value={u}>{u}</option>)}
                  </select> 
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="space-y-1.5"> 
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block ml-1">Purchase Rate (₹)</label> 
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500">
                      <IndianRupee className="w-4 h-4" />
                    </div>
                    <input 
                      type="number"
                      step="any"
                      className="w-full pl-11 pr-4 py-3 bg-amber-50/50 dark:bg-amber-900/10 border-none rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-amber-500/20 transition-all text-slate-700 dark:text-white placeholder:text-amber-200" 
                      value={formData.purchaseRate} 
                      onChange={(e) => setFormData({...formData, purchaseRate: e.target.value})} 
                      placeholder="Bought at"
                      required 
                    /> 
                  </div>
                </div>

                <div className="space-y-1.5"> 
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block ml-1">Target Sale (₹)</label> 
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#006e2f]">
                      <IndianRupee className="w-4 h-4" />
                    </div>
                    <input 
                      type="number"
                      step="any"
                      className="w-full pl-11 pr-4 py-3 bg-emerald-50/50 dark:bg-emerald-900/10 border-none rounded-xl text-sm font-black text-emerald-700 dark:text-emerald-400 outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder:text-emerald-200" 
                      value={formData.targetPrice} 
                      onChange={(e) => setFormData({...formData, targetPrice: e.target.value})} 
                      placeholder="Sell at"
                      required 
                    /> 
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block ml-1 mb-2">Product Photo (Optional)</label> 
                <div className="relative group border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-4 flex flex-col items-center justify-center bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                  <input 
                    type="file" 
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) => {
                      if(e.target.files && e.target.files[0]) {
                        setFormData({...formData, image: e.target.files[0]});
                      }
                    }}
                  />
                  {formData.image ? (
                    <div className="flex items-center gap-2 text-emerald-600">
                      <ImageIcon className="w-5 h-5" />
                      <span className="text-xs font-bold truncate max-w-[150px]">{formData.image.name}</span>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-5 h-5 text-slate-400 mb-1 group-hover:-translate-y-1 transition-transform" />
                      <span className="text-[10px] font-bold text-slate-500">Tap to upload photo</span>
                    </>
                  )}
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-3 p-3 bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800 rounded-xl cursor-pointer hover:bg-emerald-50 transition-colors">
                  <div className="relative flex items-center justify-center">
                    <input 
                      type="checkbox" 
                      className="peer sr-only"
                      checked={pushDirectly}
                      onChange={(e) => setPushDirectly(e.target.checked)}
                    />
                    <div className="w-5 h-5 border-2 border-emerald-200 rounded peer-checked:bg-emerald-600 peer-checked:border-emerald-600 transition-colors"></div>
                    <CheckCircle2 className="w-3.5 h-3.5 text-white absolute opacity-0 peer-checked:opacity-100 transition-opacity" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">Push to Main Inventory Directly</p>
                    <p className="text-[9px] font-bold text-slate-400">Skip pending sync and live update now</p>
                  </div>
                </label>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full mt-4 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <ArrowUpRight className="w-5 h-5" />
                    {pushDirectly ? 'Add & Push Now' : 'Add To Farm Ledger'}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 📋 Procurement Ledger (Full Width) */}
      <div className="space-y-6">
        
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white dark:bg-slate-800 rounded-lg flex items-center justify-center shadow-sm">
                <History className="w-4 h-4 text-slate-500" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">Procurement Ledger</h3>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">History of Farm Inwards and Sync Status</p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                  <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Entry ID / Date</th>
                  <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Product & Source</th>
                  <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Quantities</th>
                  <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Rates (Buy/Sell)</th>
                  <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Status / Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                {ledger.map((item) => {
                  const isPushed = item.status === 'Pushed';
                  return (
                    <tr 
                      key={item.id} 
                      className={`transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30 ${isPushed ? 'opacity-75 bg-slate-50/30' : ''}`}
                    >
                      <td className="px-6 py-4">
                        <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">{item.id}</p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{new Date(item.date).toLocaleDateString()}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-slate-100 dark:bg-slate-800">
                            <Leaf className="w-4 h-4 text-slate-500" />
                          </div>
                          <div>
                            <p className="text-xs font-black text-slate-900 dark:text-white tracking-tight">{item.name}</p>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{item.source}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="text-xs font-black text-slate-400 mb-1">Bought: <span className="text-slate-700 dark:text-slate-300">{item.qty} {item.unit}</span></p>
                            {!isPushed ? (
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Push:</span>
                                <input 
                                  type="number"
                                  value={item.pushQty}
                                  onChange={(e) => updatePushQty(item.id, e.target.value)}
                                  className="w-20 px-2 py-1 bg-white dark:bg-slate-950 border border-emerald-200 dark:border-emerald-800 rounded text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                                />
                              </div>
                            ) : (
                              <p className="text-xs font-black text-emerald-600">Pushed: {item.pushQty} {item.unit}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <p className="text-xs font-black text-amber-600 mb-0.5">₹{item.purchase} <span className="text-[8px] text-slate-400 font-bold uppercase">Buy</span></p>
                        <p className="text-xs font-black text-emerald-600">₹{item.sale} <span className="text-[8px] text-slate-400 font-bold uppercase">Sell</span></p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center items-center gap-2">
                          {isPushed ? (
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-100 rounded-full text-emerald-600">
                              <CheckCircle2 className="w-3 h-3" />
                              <span className="text-[8px] font-black uppercase tracking-widest">Pushed</span>
                            </div>
                          ) : (
                            <>
                              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-full text-slate-500">
                                <History className="w-3 h-3" />
                                <span className="text-[8px] font-black uppercase tracking-widest">Pending</span>
                              </div>
                              <button 
                                onClick={() => handlePushSingle(item.id)}
                                disabled={syncing}
                                className="p-1.5 bg-[#006e2f] hover:bg-[#0a4a34] text-white rounded-lg shadow-sm transition-all disabled:opacity-50"
                                title="Push to Main Inventory Now"
                              >
                                <Send className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default FarmInventory;
