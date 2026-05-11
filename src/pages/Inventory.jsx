import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  TrendingUp, 
  AlertTriangle, 
  Filter, 
  Download, 
  Edit3, 
  AlertCircle,
  X,
  Camera,
  Search,
  Package,
  ChevronRight,
  LayoutGrid
} from 'lucide-react';
import ConfirmModal from '../components/ConfirmModal';

const Inventory = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null); // stores id of product to delete
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    dbId: '', sku: '', name: '', cat: 'Fruit', purchasePrice: '', price: '', discount: 0, unit: 'kg', qty: '', minQty: 1, enabled: true, img: ''
  });
  const [imgPreview, setImgPreview] = useState(null);

  const API_URL = 'http://localhost:5055/api/inventory';

  useEffect(() => {
    fetchInitialData();
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('admin_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes] = await Promise.all([
        fetch(`${API_URL}/products`),
        fetch(`http://localhost:5055/api/categories`)
      ]);

      if (!prodRes.ok || !catRes.ok) throw new Error('Failed to fetch data');

      const prodData = await prodRes.json();
      const catData = await catRes.json();

      const mappedProducts = prodData.map(p => ({
        dbId: p.id,
        id: p.sku,
        name: p.name,
        cat: p.category,
        purchasePrice: parseFloat(p.purchase_price),
        price: parseFloat(p.retail_price),
        discount: parseFloat(p.discount),
        unit: p.unit,
        qty: p.quantity,
        minQty: p.min_quantity,
        enabled: p.enabled,
        img: p.image_url
      }));

      setProducts(mappedProducts);
      setCategories(catData);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Could not connect to backend.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImgPreview(reader.result);
        setFormData({ ...formData, img: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const openAddModal = () => {
    setModalMode('add');
    setFormData({ dbId: '', sku: '', name: '', cat: categories[0] || 'Fruit', purchasePrice: '', price: '', discount: 0, unit: 'kg', qty: '', minQty: 1, enabled: true, img: '' });
    setImgPreview(null);
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setModalMode('edit');
    setFormData({
      dbId: product.dbId,
      sku: product.id,
      name: product.name,
      cat: product.cat,
      purchasePrice: product.purchasePrice,
      price: product.price,
      discount: product.discount,
      unit: product.unit,
      qty: product.qty,
      minQty: product.minQty,
      enabled: product.enabled,
      img: product.img
    });
    setImgPreview(product.img);
    setShowModal(true);
  };

  const handleDelete = (dbId) => {
    setDeleteConfirm(dbId);
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    try {
      const response = await fetch(`${API_URL}/products/${deleteConfirm}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (response.ok) {
        setProducts(prev => prev.filter(p => p.dbId !== deleteConfirm));
        setDeleteConfirm(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleStatus = async (product) => {
    try {
      const response = await fetch(`${API_URL}/products/${product.dbId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          ...product,
          enabled: !product.enabled,
          sku: product.id,
          category: product.cat,
          purchasePrice: product.purchasePrice,
          retailPrice: product.price,
          minQuantity: product.minQty,
          quantity: product.qty,
          imageUrl: product.img
        })
      });
      if (response.ok) {
        setProducts(prev => prev.map(p => p.dbId === product.dbId ? { ...p, enabled: !p.enabled } : p));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const payload = {
      sku: formData.sku || `${formData.cat.substring(0,3).toUpperCase()}-${Math.floor(Math.random()*10000)}`,
      name: formData.name,
      category: formData.cat,
      purchasePrice: Number(formData.purchasePrice),
      retailPrice: Number(formData.price),
      discount: Number(formData.discount || 0),
      unit: formData.unit,
      quantity: Number(formData.qty),
      minQuantity: Number(formData.minQty || 1),
      enabled: formData.enabled,
      imageUrl: formData.img
    };

    try {
      if (modalMode === 'add') {
        const response = await fetch(`${API_URL}/products`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(payload)
        });
        if (response.ok) {
          const p = await response.json();
          const added = {
            dbId: p.id,
            id: p.sku,
            name: p.name,
            cat: p.category,
            purchasePrice: parseFloat(p.purchase_price),
            price: parseFloat(p.retail_price),
            discount: parseFloat(p.discount),
            unit: p.unit,
            qty: p.quantity,
            minQty: p.min_quantity,
            enabled: p.enabled,
            img: p.image_url
          };
          setProducts([added, ...products]);
        }
      } else {
        const response = await fetch(`${API_URL}/products/${formData.dbId}`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(payload)
        });
        if (response.ok) {
          const p = await response.json();
          const updated = {
            dbId: p.id,
            id: p.sku,
            name: p.name,
            cat: p.category,
            purchasePrice: parseFloat(p.purchase_price),
            price: parseFloat(p.retail_price),
            discount: parseFloat(p.discount),
            unit: p.unit,
            qty: p.quantity,
            minQty: p.min_quantity,
            enabled: p.enabled,
            img: p.image_url
          };
          setProducts(prev => prev.map(item => item.dbId === updated.dbId ? updated : item));
        }
      }
      setShowModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory) return;
    try {
      const response = await fetch(`http://localhost:5055/api/categories`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ name: newCategory })
      });
      if (response.ok) {
        setCategories([...categories, newCategory]);
        setNewCategory('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCategory = async (catName) => {
    try {
      const response = await fetch(`http://localhost:5055/api/categories/${catName}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (response.ok) {
        setCategories(categories.filter(c => c !== catName));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.cat.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* ERP Command Header */}
      <div className="flex flex-col xl:flex-row gap-8">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-[#0a4a34] rounded-lg flex items-center justify-center shadow-lg shadow-green-900/10">
              <Package className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Inventory Ledger</h2>
          </div>
          <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Enterprise Stock Monitoring & Procurement Controls</p>
        </div>

        <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <button 
            onClick={openAddModal}
            className="flex items-center gap-2 bg-[#0a4a34] text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-800 transition-all shadow-lg shadow-green-900/10"
          >
            <Plus className="w-3.5 h-3.5" /> Add New Item
          </button>
          <div className="h-10 w-px bg-slate-100 dark:bg-slate-800" />
          <button 
            onClick={() => setShowCategoryModal(true)}
            className="flex items-center gap-2 text-slate-400 hover:text-slate-600 px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all"
          >
            <Package className="w-4 h-4" /> Categories
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-xs font-bold uppercase">
          <AlertCircle className="w-4 h-4" /> {error}
        </div>
      )}

      {/* Summary Insights Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatBox label="Inventory Value" value={`₹${products.reduce((acc, p) => acc + (p.purchasePrice * p.qty), 0).toLocaleString()}`} trend="+4.2%" icon={TrendingUp} />
        <StatBox label="Active Items" value={products.filter(p => p.enabled).length} sub={`${categories.length} categories`} icon={Package} />
        <StatBox label="Out of Stock" value={products.filter(p => p.qty === 0).length} sub="Needs Attention" icon={AlertTriangle} alert={products.some(p => p.qty === 0)} />
        <StatBox label="Avg Unit Margin" value={`₹${products.length ? (products.reduce((acc, p) => acc + (p.price - p.purchasePrice), 0) / products.length).toFixed(2) : 0}`} sub="Gross" icon={LayoutGrid} />
      </div>

      {/* Main Table Section */}
      <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-8 py-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/30">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search by name or category..." 
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-green-500 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 border border-slate-200 bg-white rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 hover:bg-slate-50 transition-all text-slate-500">
              <Filter className="w-3.5 h-3.5" /> Filter
            </button>
            <button className="px-4 py-2 border border-slate-200 bg-white rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 hover:bg-slate-50 transition-all text-slate-500">
              <Download className="w-3.5 h-3.5" /> Export
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.12em]">Inventory Item</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.12em]">Wholesale</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.12em]">Retail</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.12em]">Profit/Loss</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.12em]">Stock Level</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.12em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-8 py-10 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Syncing Enterprise Inventory...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-8 py-10 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                    No items found in ledger
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.dbId} className={`hover:bg-slate-50/50 transition-all group ${!p.enabled ? 'opacity-60' : ''}`}>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <img src={p.img || 'https://via.placeholder.com/150?text=Item'} className="w-14 h-14 rounded-2xl object-cover bg-slate-100 shadow-sm border border-slate-100" alt={p.name} />
                          {!p.enabled && (
                            <div className="absolute inset-0 bg-slate-900/40 rounded-2xl flex items-center justify-center">
                              <span className="text-[8px] text-white font-black uppercase">Disabled</span>
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-sm tracking-tight">{p.name}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">SKU: {p.id}</span>
                            <span className="h-1 w-1 bg-slate-300 rounded-full"></span>
                            <span className="text-[9px] text-bottle-green font-bold uppercase tracking-widest">{p.cat}</span>
                            <span className="h-1 w-1 bg-slate-300 rounded-full"></span>
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleToggleStatus(p); }}
                              className={`text-[8px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded border transition-all ${
                                p.enabled ? 'bg-green-50 text-green-600 border-green-100' : 'bg-slate-100 text-slate-400 border-slate-200'
                              }`}
                            >
                              {p.enabled ? 'Active' : 'Inactive'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="text-sm font-bold text-slate-400 tracking-tight">₹{p.purchasePrice.toFixed(2)}</div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="text-sm font-bold text-slate-900 tracking-tight">₹{p.price.toFixed(2)}</div>
                      {p.discount > 0 && (
                        <div className="text-[10px] text-green-600 font-bold mt-0.5">-{p.discount}% OFF</div>
                      )}
                    </td>
                    <td className="px-8 py-5">
                      {(() => {
                        const sellingPrice = p.price * (1 - (p.discount / 100));
                        const profit = sellingPrice - p.purchasePrice;
                        const isProfit = profit >= 0;
                        return (
                          <div className={`flex flex-col`}>
                            <span className={`text-sm font-black ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
                              {isProfit ? '+' : ''}₹{profit.toFixed(2)}
                            </span>
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                              {((profit / p.purchasePrice) * 100).toFixed(1)}% margin
                            </span>
                          </div>
                        );
                      })()}
                    </td>
                    <td className="px-8 py-5">
                      <div className="text-sm font-bold text-slate-900 tracking-tight">{p.qty} {p.unit}s</div>
                      <div className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">Min: {p.minQty}</div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openEditModal(p)} className="p-2 text-slate-400 hover:text-blue-600 transition-all active:scale-90"><Edit3 className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(p.dbId)} className="p-2 text-slate-400 hover:text-red-600 transition-all active:scale-90"><X className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Inventory Modal (Add/Edit) */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="text-lg font-bold text-slate-900 uppercase tracking-widest">{modalMode === 'add' ? 'Add New Item' : 'Edit Item'}</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Update inventory information</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-all">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto max-h-[70vh]">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-5">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Item Name</label>
                    <input 
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-green-500 outline-none transition-all" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Category</label>
                      <select 
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none"
                        value={formData.cat}
                        onChange={(e) => setFormData({...formData, cat: e.target.value})}
                      >
                        {categories.map(cat => <option key={cat}>{cat}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Unit Type</label>
                      <select 
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none"
                        value={formData.unit}
                        onChange={(e) => setFormData({...formData, unit: e.target.value})}
                      >
                        {['kg', 'Crate', 'Box', 'Packet', 'Bunch'].map(u => <option key={u}>{u}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Wholesale (₹)</label>
                      <input 
                        type="number"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none" 
                        value={formData.purchasePrice}
                        onChange={(e) => setFormData({...formData, purchasePrice: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Retail (₹)</label>
                      <input 
                        type="number"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none" 
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Disc (%)</label>
                      <input 
                        type="number"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none" 
                        value={formData.discount}
                        onChange={(e) => setFormData({...formData, discount: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Stock Quantity</label>
                    <input 
                      type="number"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none" 
                      value={formData.qty}
                      onChange={(e) => setFormData({...formData, qty: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Min Order Qty</label>
                    <input 
                      type="number"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none" 
                      value={formData.minQty}
                      onChange={(e) => setFormData({...formData, minQty: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Item Image</label>
                    <div 
                      onClick={() => document.getElementById('prod-img').click()}
                      className="relative border-2 border-dashed border-slate-200 bg-slate-50 rounded-2xl h-32 flex flex-col items-center justify-center cursor-pointer hover:border-green-500 transition-all group overflow-hidden"
                    >
                      {imgPreview ? (
                        <img src={imgPreview} className="w-full h-full object-cover" alt="Preview" />
                      ) : (
                        <>
                          <Camera className="w-8 h-8 text-slate-200 group-hover:text-green-500 transition-all" />
                          <p className="text-[8px] text-slate-400 font-bold uppercase mt-2">Click to Upload</p>
                        </>
                      )}
                      <input id="prod-img" type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                <label className="flex items-center gap-3 cursor-pointer">
                  <div 
                    onClick={() => setFormData({...formData, enabled: !formData.enabled})}
                    className={`w-10 h-5 rounded-full p-1 transition-all ${formData.enabled ? 'bg-green-600' : 'bg-slate-300'}`}
                  >
                    <div className={`w-3 h-3 bg-white rounded-full transition-all ${formData.enabled ? 'translate-x-5' : ''}`}></div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Item Enabled</span>
                </label>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2.5 text-xs font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-xl uppercase transition-all">Cancel</button>
                  <button type="submit" className="px-6 py-2.5 text-xs font-bold text-white bg-green-600 hover:bg-green-700 rounded-xl shadow-lg shadow-green-100 uppercase transition-all active:scale-95">
                    {modalMode === 'add' ? 'Save Item' : 'Update Item'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-sm rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Manage Categories</h3>
              <button onClick={() => setShowCategoryModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex gap-2">
                <input 
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none" 
                  placeholder="New Category..." 
                />
                <button 
                  onClick={handleAddCategory}
                  className="p-2 bg-green-600 text-white rounded-xl"
                ><Plus className="w-5 h-5" /></button>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {categories.map((cat, i) => (
                  <div key={i} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg text-xs font-bold text-slate-600">
                    {cat}
                    <button onClick={() => handleDeleteCategory(cat)} className="text-red-400 hover:text-red-600"><X className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal 
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={confirmDelete}
        title="Delete Item"
        message="Are you sure you want to remove this item from the inventory? This action cannot be undone and will affect stock records."
        confirmText="Remove Item"
      />
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

export default Inventory;
