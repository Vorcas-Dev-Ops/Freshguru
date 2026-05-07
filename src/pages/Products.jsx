import React, { useState } from 'react';
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
  ChevronRight
} from 'lucide-react';

const Products = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categories, setCategories] = useState(['Fruit', 'Vegetable', 'Dairy', 'Bakery', 'Frozen']);
  const [newCategory, setNewCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [products, setProducts] = useState([
    { id: 'VEG-001-BROC', name: 'Broccoli Florets', cat: 'Vegetable', price: 85, discount: 10, unit: 'kg', qty: 450, minQty: 1, enabled: true, img: 'https://images.unsplash.com/photo-1453227588063-bb302b62f50b?auto=format&fit=crop&q=80&w=150&h=150' },
    { id: 'FRU-005-MANG', name: 'Alphonso Mangoes', cat: 'Fruit', price: 1200, discount: 5, unit: 'Crate', qty: 4, minQty: 1, enabled: true, img: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&q=80&w=150&h=150' },
    { id: 'VEG-042-ONIO', name: 'Spanish Red Onions', cat: 'Vegetable', price: 35, discount: 0, unit: 'kg', qty: 12, minQty: 5, enabled: true, img: 'https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&q=80&w=150&h=150' },
  ]);

  const [formData, setFormData] = useState({
    id: '', name: '', cat: 'Fruit', price: '', discount: '', unit: 'kg', qty: '', minQty: 1, enabled: true, img: ''
  });
  const [imgPreview, setImgPreview] = useState(null);

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
    setFormData({ id: '', name: '', cat: 'Fruit', price: '', discount: '', unit: 'kg', qty: '', minQty: 1, enabled: true, img: '' });
    setImgPreview(null);
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setModalMode('edit');
    setFormData(product);
    setImgPreview(product.img);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleToggleStatus = (id) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, enabled: !p.enabled } : p));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (modalMode === 'add') {
      const newId = `${formData.cat.substring(0,3).toUpperCase()}-${Math.floor(Math.random()*1000)}`;
      setProducts([{ ...formData, id: newId, price: Number(formData.price), discount: Number(formData.discount), qty: Number(formData.qty) }, ...products]);
    } else {
      setProducts(products.map(p => p.id === formData.id ? { ...formData, price: Number(formData.price), discount: Number(formData.discount), qty: Number(formData.qty) } : p));
    }
    setShowModal(false);
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.cat.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Stats & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <StatCard label="Inventory Value" value="₹12.4L" trend="+4.2%" color="text-green-600" />
          <StatCard label="Active Items" value={products.filter(p => p.enabled).length} sub={`${categories.length} categories`} color="text-slate-600" />
          <StatCard label="Out of Stock" value={products.filter(p => p.qty === 0).length} sub="Needs Attention" color="text-red-600" alert={products.some(p => p.qty === 0)} />
        </div>
        <div className="bg-white p-4 border border-slate-200 rounded-2xl shadow-sm flex flex-col gap-3">
          <button 
            onClick={openAddModal}
            className="w-full bg-bottle-green text-white py-3 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-opacity-90 transition-all active:scale-95 shadow-lg shadow-green-100"
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
          <button 
            onClick={() => setShowCategoryModal(true)}
            className="w-full border border-slate-200 text-slate-500 py-3 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-50 transition-all active:scale-95"
          >
            <Package className="w-4 h-4" /> Categories
          </button>
        </div>
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
                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Product</th>
                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pricing</th>
                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Stock & Min Qty</th>
                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((p) => (
                <tr key={p.id} className={`hover:bg-slate-50/50 transition-all group ${!p.enabled ? 'opacity-60' : ''}`}>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img src={p.img || 'https://via.placeholder.com/150?text=Product'} className="w-14 h-14 rounded-2xl object-cover bg-slate-100 shadow-sm border border-slate-100" alt={p.name} />
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
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="text-sm font-bold text-slate-900 tracking-tight">₹{p.price.toFixed(2)} <span className="text-slate-400 text-[10px]">/ {p.unit}</span></div>
                    {p.discount > 0 && (
                      <div className="text-[10px] text-green-600 font-bold mt-0.5">-{p.discount}% OFF</div>
                    )}
                  </td>
                  <td className="px-8 py-5">
                    <div className="text-sm font-bold text-slate-900 tracking-tight">{p.qty} {p.unit}s</div>
                    <div className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">Min Order: {p.minQty} {p.unit}</div>
                  </td>
                  <td className="px-8 py-5">
                    <button 
                      onClick={() => handleToggleStatus(p.id)}
                      className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border transition-all ${
                        p.enabled ? 'bg-green-50 text-green-700 border-green-100 hover:bg-green-100' : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {p.enabled ? 'Enabled' : 'Disabled'}
                    </button>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEditModal(p)} className="p-2 text-slate-400 hover:text-blue-600 transition-all active:scale-90"><Edit3 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(p.id)} className="p-2 text-slate-400 hover:text-red-600 transition-all active:scale-90"><X className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Product Modal (Add/Edit) */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="text-lg font-bold text-slate-900 uppercase tracking-widest">{modalMode === 'add' ? 'Add New Product' : 'Edit Product'}</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Update catalog information</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-all">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto max-h-[70vh]">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-5">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Product Name</label>
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
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Price (₹)</label>
                      <input 
                        type="number"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none" 
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Discount (%)</label>
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
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Product Image</label>
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
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Product Enabled</span>
                </label>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2.5 text-xs font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-xl uppercase transition-all">Cancel</button>
                  <button type="submit" className="px-6 py-2.5 text-xs font-bold text-white bg-green-600 hover:bg-green-700 rounded-xl shadow-lg shadow-green-100 uppercase transition-all active:scale-95">
                    {modalMode === 'add' ? 'Save Product' : 'Update Product'}
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
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
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
                  onClick={() => {
                    if (newCategory) {
                      setCategories([...categories, newCategory]);
                      setNewCategory('');
                    }
                  }}
                  className="p-2 bg-green-600 text-white rounded-xl"
                ><Plus className="w-5 h-5" /></button>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {categories.map((cat, i) => (
                  <div key={i} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg text-xs font-bold text-slate-600">
                    {cat}
                    <button onClick={() => setCategories(categories.filter(c => c !== cat))} className="text-red-400 hover:text-red-600"><X className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ label, value, trend, sub, color, alert }) => (
  <div className="bg-white p-6 border border-slate-200 rounded-2xl shadow-sm flex flex-col justify-between">
    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</span>
    <span className="text-2xl font-bold text-slate-900 mt-2">{value}</span>
    {trend ? (
      <div className={`flex items-center text-[10px] font-bold mt-2 ${color}`}>
        <TrendingUp className="w-3.5 h-3.5 mr-1" /> {trend} VS LAST WEEK
      </div>
    ) : (
      <div className={`text-[10px] font-bold mt-2 flex items-center ${alert ? 'text-red-600' : 'text-slate-400'}`}>
        {alert && <AlertCircle className="w-3.5 h-3.5 mr-1" />} {sub.toUpperCase()}
      </div>
    )}
  </div>
);

export default Products;
