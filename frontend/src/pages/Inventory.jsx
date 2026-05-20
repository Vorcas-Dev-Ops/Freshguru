// Version 1.0.2 - Cleaned state
import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Package, 
  ChevronRight,
  LayoutGrid,
  MoreVertical,
  Edit3,
  Bell,
  History,
  ChevronDown,
  ArrowUpRight,
  ShoppingBasket,
  Grid3X3,
  CheckCircle2,
  Download,
  Clock,
  TrendingUp,
  Layout,
  List,
  Filter,
  X,
  ShieldCheck,
  User,
  Plus as PlusIcon,
  Settings,
  BarChart3,
  Layers,
  Activity,
  Tag,
  Coins,
  Scale
} from 'lucide-react';
import { InwardStockModal, AdjustStockModal } from '../components/InventoryModals';

const Inventory = () => {
  const [viewMode, setViewMode] = useState('grid'); 
  const [activeTab, setActiveTab] = useState('Products');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [historySearch, setHistorySearch] = useState('');
  const [productHistory, setProductHistory] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [notification, setNotification] = useState(null);

  const [formData, setFormData] = useState({
    dbId: '', sku: '', name: '', cat: 'Fruits', purchasePrice: '', price: '', unit: 'kg', qty: '', minQty: 10, minOrderQty: 1.0, enabled: true, img: '', description: ''
  });
  
  const [purchaseData, setPurchaseData] = useState({
    productId: '', quantity: '', unitPrice: '', amount: '', description: ''
  });

  const API_URL = 'http://localhost:5055/api/inventory';

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedProduct) {
      fetchProductHistory(selectedProduct.id);
    }
  }, [selectedProduct]);

  const fetchProductHistory = async (id) => {
    try {
      const response = await fetch(`${API_URL}/products/${id}/history`);
      if (response.ok) {
        const data = await response.json();
        setProductHistory(data);
      }
    } catch (err) { console.error(err); }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/products`);
      if (response.ok) {
        const data = await response.json();
        const mapped = data.map(p => ({
          id: p.id,
          sku: p.sku,
          name: p.name,
          cat: p.category,
          purchasePrice: parseFloat(p.purchase_price),
          salePrice: parseFloat(p.retail_price),
          qty: p.quantity,
          unit: p.unit,
          img: p.image_url,
          minQty: p.min_quantity || 10,
          minOrderQty: parseFloat(p.min_order_qty || 1),
          enabled: p.enabled !== false,
          targetQty: 100,
          updated_at: p.updated_at,
          availability: Math.floor(Math.random() * 60) + 40,
          velocity: Math.floor(Math.random() * 400) + 100,
          velocityTrend: Math.random() > 0.3 ? '+' : '-'
        }));
        setProducts(mapped);
        if (mapped.length > 0 && !selectedProduct) {
          setSelectedProduct(mapped[0]);
        }
      }
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`http://localhost:5055/api/categories`);
      if (response.ok) {
        const data = await response.json();
        // Normalize categories to handle both strings and objects
        const normalized = data.map(c => typeof c === 'string' ? { id: c, name: c } : c);
        setCategories(normalized);
      }
    } catch (err) { console.error('Category Fetch Error:', err); }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const openAddModal = () => {
    setModalMode('add');
    setFormData({ dbId: '', sku: '', name: '', cat: categories[0] || 'Fruits', purchasePrice: '', price: '', unit: 'kg', qty: '', minQty: 10, minOrderQty: 1.0, enabled: true, img: '', description: '' });
    setShowAddModal(true);
  };

  const openEditModal = (p) => {
    setModalMode('edit');
    setFormData({ dbId: p.id, sku: p.sku, name: p.name, cat: p.cat, purchasePrice: p.purchasePrice, price: p.salePrice, unit: p.unit, qty: p.qty, minQty: p.minQty, minOrderQty: p.minOrderQty, enabled: p.enabled !== false, img: p.img, description: '' });
    setShowAddModal(true);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, img: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('admin_token');
    
    // Ensure category is a string name for SKU and payload
    const catName = typeof formData.cat === 'object' ? formData.cat?.name : formData.cat;
    const finalCat = catName || 'Fruits';

    const payload = {
      sku: formData.sku || `${finalCat.substring(0,3).toUpperCase()}-${Math.floor(Math.random()*10000)}`,
      name: formData.name, 
      category: finalCat, 
      purchasePrice: Number(formData.purchasePrice) || 0, 
      retailPrice: Number(formData.price) || 0, 
      unit: formData.unit || 'kg', 
      quantity: Number(formData.qty) || 0, 
      minQuantity: Number(formData.minQty || 10), 
      minOrderQty: Number(formData.minOrderQty || 1), 
      imageUrl: formData.img || '', 
      description: formData.description || '',
      hsn: '',
      discount: 0,
      taxType: 'GST 5%',
      enabled: formData.enabled !== false
    };

    try {
      const url = modalMode === 'add' ? `${API_URL}/products` : `${API_URL}/products/${formData.dbId}`;
      const method = modalMode === 'add' ? 'POST' : 'PUT';
      const response = await fetch(url, { 
        method, 
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${token}` 
        }, 
        body: JSON.stringify(payload) 
      });

      if (response.ok) {
        showNotification(modalMode === 'add' ? 'Product added successfully' : 'Product updated successfully');
        fetchProducts();
        setShowAddModal(false);
      } else {
        const errorData = await response.json();
        showNotification(errorData.message || 'Failed to save product', 'error');
      }
    } catch (err) { 
      showNotification('Network error. Check server connection.', 'error');
    }
  };

  const handlePurchaseSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('admin_token');
    try {
      const response = await fetch(`${API_URL}/purchases`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(purchaseData) });
      if (response.ok) {
        showNotification('Purchase recorded');
        fetchProducts();
        setShowPurchaseModal(false);
      }
    } catch (err) { console.error(err); }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    const token = localStorage.getItem('admin_token');
    try {
      const response = await fetch(`http://localhost:5055/api/categories`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ name: newCategory })
      });
      if (response.ok) {
        showNotification('Category added successfully');
        setNewCategory('');
        setShowCategoryModal(false);
        fetchCategories();
      } else {
        const errorData = await response.json();
        showNotification(errorData.message || 'Failed to add category', 'error');
      }
    } catch (err) { 
      console.error(err);
      showNotification('Network error. Please try again.', 'error');
    }
  };

  const filteredProducts = products
    .filter(p => {
      const pName = p.name ? p.name.toLowerCase() : '';
      const sTerm = searchTerm ? searchTerm.toLowerCase() : '';
      const matchesSearch = pName.includes(sTerm);
      const matchesCategory = selectedCategory === 'All' || p.cat === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      // Disabled products (enabled === false) should come last
      if (a.enabled === false && b.enabled !== false) return 1;
      if (a.enabled !== false && b.enabled === false) return -1;
      return 0;
    });

  return (
    <div className="min-h-screen bg-[#fcfdfe] dark:bg-slate-950 p-6 font-inter animate-in fade-in duration-700">
      {/* 📊 High-Density Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 gap-8">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-[#114232] rounded-lg flex items-center justify-center shadow-lg shadow-emerald-900/10">
              <Package className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Inventory Console</h2>
            <span className="px-2.5 py-0.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-md text-[9px] font-black uppercase tracking-widest border border-emerald-100/50">v1.2.4 Live</span>
          </div>
          <p className="text-slate-400 text-sm font-bold tracking-widest">Enterprise Stock Operations & Global Repository Control</p>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full sm:w-auto">
          <button 
            onClick={() => setShowCategoryModal(true)} 
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm active:scale-95 whitespace-nowrap"
          >
            <Settings className="w-4 h-4" /> 
            Manage Categories
          </button>
          <button 
            onClick={openAddModal} 
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-[#114232] text-white rounded-2xl text-xs font-bold hover:bg-black transition-all shadow-2xl shadow-emerald-900/40 active:scale-95 whitespace-nowrap"
          >
            <PlusIcon className="w-4 h-4" /> 
            New Inventory Item
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="relative">
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="appearance-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-6 py-2.5 pr-10 rounded-xl text-[11px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 outline-none hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm cursor-pointer"
            >
               <option value="All">All Categories</option>
               {categories.map(cat => (
                 <option key={cat.id || cat.name || cat} value={cat.name || cat}>
                   {cat.name || cat}
                 </option>
               ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>
        </div>

        <div className="flex bg-[#f3f6f5] dark:bg-slate-900 p-0.5 rounded-lg border border-slate-100 dark:border-slate-800">
          <button 
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-all text-[9px] font-black uppercase tracking-widest ${viewMode === 'grid' ? 'bg-white dark:bg-slate-800 shadow-sm text-emerald-600' : 'text-slate-400'}`}
          >
            <LayoutGrid className="w-3 h-3" /> Grid
          </button>
          <button 
            onClick={() => setViewMode('intelligence')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-all text-[9px] font-black uppercase tracking-widest ${viewMode === 'intelligence' ? 'bg-white dark:bg-slate-800 shadow-sm text-emerald-600' : 'text-slate-400'}`}
          >
            <Layout className="w-3 h-3" /> Intelligence
          </button>
        </div>
      </div>

      <main className={viewMode === 'grid' ? "pr-1" : "h-[calc(100vh-300px)] overflow-y-auto custom-scrollbar pr-1"}>
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <div key={product.id} className={`bg-[#f4f8f5] dark:bg-[#0f241d]/85 border border-emerald-100/60 dark:border-emerald-950/40 rounded-3xl p-4 shadow-sm hover:shadow-xl hover:border-emerald-200/80 transition-all group flex flex-col relative overflow-hidden h-[335px] ${!product.enabled ? 'opacity-75 bg-slate-50/50' : ''}`}>
                
                {/* Status Toggle Switch on Grid Card top right */}
                <div className="absolute top-3.5 right-3.5 z-10 flex items-center gap-1.5">
                  <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                    product.enabled ? 'bg-emerald-50 text-emerald-600 border border-emerald-100/50' : 'bg-rose-50 text-rose-600 border border-rose-100/50'
                  }`}>
                    {product.enabled ? 'Active' : 'Disabled'}
                  </span>
                  
                  {/* Custom Toggle Switch */}
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={product.enabled} 
                      onChange={async (e) => {
                        const token = localStorage.getItem('admin_token');
                        const updatedProduct = {
                          sku: product.sku,
                          name: product.name,
                          category: product.cat,
                          purchasePrice: product.purchasePrice,
                          retailPrice: product.salePrice,
                          unit: product.unit,
                          quantity: product.qty,
                          minQuantity: product.minQty,
                          minOrderQty: product.minOrderQty,
                          imageUrl: product.img,
                          enabled: e.target.checked
                        };
                        try {
                          const response = await fetch(`${API_URL}/products/${product.id}`, {
                            method: 'PUT',
                            headers: {
                              'Content-Type': 'application/json',
                              'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify(updatedProduct)
                          });
                          if (response.ok) {
                            showNotification(e.target.checked ? 'Product enabled successfully' : 'Product disabled successfully');
                            fetchProducts();
                          }
                        } catch (err) {
                          console.error(err);
                        }
                      }}
                    />
                    <div className="w-6 h-3.5 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-2.5 after:content-[''] after:absolute after:top-[1px] after:left-[1px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#114232]"></div>
                  </label>
                </div>

                <div className="relative h-32 mb-2 bg-transparent flex items-center justify-center p-1">
                  {product.img ? (
                    <img src={product.img} alt={product.name} className="w-full h-full object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <Package className="w-14 h-14 text-slate-100" />
                  )}
                  <span className={`absolute top-0 left-0 px-1.5 py-0.5 rounded-sm text-[7.5px] font-black uppercase tracking-widest ${
                    product.qty > product.minQty ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'
                  }`}>
                    {product.qty > product.minQty ? 'In Stock' : 'Low Stock'}
                  </span>
                </div>

                <div className="flex-1 text-left">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight mb-0.5 truncate leading-tight">{product.name}</h3>
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 leading-none">SKU: {product.sku}</p>

                  <div className="grid grid-cols-2 gap-2 mb-1.5 pt-2 border-t border-emerald-100/40 dark:border-emerald-950/40 relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-[1px] bg-emerald-100/40 dark:bg-emerald-950/40" />
                    <div>
                      <p className="text-sm font-black text-slate-900 dark:text-white tracking-tighter leading-none mb-0.5">{product.qty} <span className="text-[8px] text-slate-400 uppercase font-bold">{product.unit}</span></p>
                      <p className="text-[7px] font-extrabold text-slate-400/80 uppercase tracking-widest">Stock Qty</p>
                    </div>
                    <div className="pl-2">
                      <div className="flex items-center gap-1 mb-0.5">
                         <span className={`text-sm font-black tracking-tighter leading-none ${(product.salePrice - product.purchasePrice) >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                           {(product.salePrice - product.purchasePrice) >= 0 ? '+' : ''}₹{product.salePrice - product.purchasePrice}
                         </span>
                      </div>
                      <p className="text-[7px] font-extrabold text-slate-400/80 uppercase tracking-widest">Profit / Loss</p>
                    </div>
                  </div>

                  <div className="space-y-1 mb-1.5">
                    <div className="h-1 w-full bg-slate-50 rounded-full overflow-hidden">
                       <div className={`h-full rounded-full transition-all duration-1000 ${product.availability > 70 ? 'bg-emerald-500' : product.availability > 30 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${product.availability}%` }} />
                    </div>
                  </div>
                </div>

                {/* 🏷️ Prices Section */}
                <div className="flex items-center justify-between px-1 mb-1.5">
                  <div>
                    <p className="text-[7px] font-extrabold text-slate-400/80 uppercase tracking-widest mb-0.5">Purchase</p>
                    <p className="text-[11px] font-black text-slate-700 tracking-tight leading-none">₹{product.purchasePrice || 0}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[7px] font-extrabold text-slate-400/80 uppercase tracking-widest mb-0.5">Selling</p>
                    <p className="text-[11px] font-black text-emerald-600 tracking-tight leading-none">₹{product.salePrice || 0}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-emerald-100/40 dark:border-emerald-950/40 mt-auto w-full">
                  <button onClick={() => openEditModal(product)} className="w-full py-2 px-2.5 bg-[#114232] hover:bg-[#0a2f23] rounded-xl text-[9px] font-black text-white uppercase tracking-widest transition-all shadow-lg shadow-emerald-900/20 text-center">Edit Product</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex gap-4 h-full">
            <aside className="w-64 bg-white dark:bg-slate-900 border border-slate-100 rounded-[1.5rem] flex flex-col shadow-sm overflow-hidden">
              <div className="p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-300" />
                  <input type="text" placeholder="Filter..." className="w-full pl-8 pr-4 py-2 bg-[#f3f6f5] border-none rounded-lg text-[10px] font-bold outline-none" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                {filteredProducts.map(p => (
                  <div key={p.id} onClick={() => setSelectedProduct(p)} className={`px-4 py-2.5 flex items-center justify-between cursor-pointer transition-all border-r-2 ${selectedProduct?.id === p.id ? 'bg-emerald-50 border-emerald-500' : 'hover:bg-slate-50 border-transparent'} ${!p.enabled ? 'opacity-60 bg-slate-50/20' : ''}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center p-1 border border-slate-100 relative">
                        {p.img ? ( <img src={p.img} className="w-full h-full object-contain" alt={p.name} /> ) : ( <Package className="w-5 h-5 text-slate-200" /> )}
                        {!p.enabled && (
                          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white" title="Disabled" />
                        )}
                      </div>
                      <span className={`text-[11px] font-bold ${selectedProduct?.id === p.id ? 'text-emerald-900' : 'text-slate-600'} ${!p.enabled ? 'line-through text-slate-400' : ''}`}>{p.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </aside>

            {selectedProduct && (
              <div className="flex-1 space-y-4 overflow-y-auto custom-scrollbar pr-1">
                <section className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-50 p-6 shadow-sm flex items-center justify-between relative overflow-hidden">
                  <div className="flex gap-10 items-center flex-1">
                    <div className="w-40 h-40 bg-slate-50 rounded-2xl flex items-center justify-center p-4 border border-slate-100 shadow-inner">
                      {selectedProduct.img ? ( <img src={selectedProduct.img} className="w-full h-full object-contain drop-shadow-2xl" alt={selectedProduct.name} /> ) : ( <Package className="w-16 h-16 text-slate-200" /> )}
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">{selectedProduct.name}</h2>
                        <Edit3 onClick={() => openEditModal(selectedProduct)} className="w-5 h-5 text-slate-300 cursor-pointer hover:text-emerald-600 transition-all" />
                      </div>
                      <div className="flex gap-2">
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-emerald-100">SKU: {selectedProduct.sku}</span>
                        <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                          selectedProduct.enabled ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'
                        }`}>
                          {selectedProduct.enabled ? 'Active' : 'Disabled'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pl-10 border-l border-slate-50 space-y-6">
                    <div className="text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Stock Quantity</p>
                      <p className="text-3xl font-black text-emerald-900 leading-none">{selectedProduct.qty} <span className="text-[12px] text-slate-400 font-bold uppercase">{selectedProduct.unit}</span></p>
                    </div>
                  </div>
                </section>

                <div className="grid grid-cols-4 gap-4">
                   {[
                     { label: 'Category', value: selectedProduct.cat, icon: LayoutGrid },
                     { label: 'Min Order', value: `${selectedProduct.minOrderQty} ${selectedProduct.unit}`, icon: ShoppingBasket },
                     { label: 'Unit Type', value: selectedProduct.unit, icon: Package },
                     { label: 'Safety Stock', value: `${selectedProduct.minQty} ${selectedProduct.unit}`, icon: ShieldCheck }
                   ].map((item, i) => (
                     <div key={i} className="bg-white border border-slate-50 rounded-2xl p-4 flex items-center gap-4 shadow-sm">
                       <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 shadow-inner"> <item.icon className="w-5 h-5" /> </div>
                       <div> <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{item.label}</p> <p className="text-[12px] font-black text-slate-900">{item.value}</p> </div>
                     </div>
                   ))}
                </div>

                <section className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-50 shadow-sm overflow-hidden">
                  <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Recent Activity Log</h3>
                    <button className="flex items-center gap-2 px-6 py-2 bg-[#10b981] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#059669] shadow-lg transition-all"> <Download className="w-4 h-4" /> Export </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-slate-50/50">
                          <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Type</th>
                          <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                          <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Qty</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {productHistory.slice(0, 10).map((item, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50 transition-all">
                            <td className="px-8 py-4"> <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${item.type === 'Purchase' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}> {item.type} </span> </td>
                            <td className="px-8 py-4 text-[11px] font-medium text-slate-400">{new Date(item.date).toLocaleDateString()}</td>
                            <td className="px-8 py-4 text-right"> <span className={`text-[11px] font-black ${item.qty > 0 ? 'text-emerald-600' : 'text-red-500'}`}> {item.qty > 0 ? '+' : ''}{item.qty} </span> </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              </div>
            )}
          </div>
        )}
      </main>

       {showAddModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-xl max-h-[90vh] flex flex-col rounded-[2rem] shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800">
            {/* Sticky Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-emerald-50/50 to-white dark:from-emerald-950/20 dark:to-slate-900 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/30 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-[#114232] rounded-xl flex items-center justify-center shadow-lg shadow-emerald-900/20">
                  <Package className="w-4 h-4 text-white" />
                </div>
                <div> 
                  <h3 className="text-base font-black text-slate-900 dark:text-white tracking-tighter uppercase">{modalMode === 'add' ? 'Add Item' : 'Edit Item'}</h3> 
                </div>
              </div>
              <button 
                onClick={() => setShowAddModal(false)} 
                className="w-8 h-8 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-red-500 transition-all active:scale-90"
              > 
                <Plus className="w-4 h-4 rotate-45" /> 
              </button>
            </div>

            {/* Scrollable Form Content */}
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
              <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-4">
                <div className="grid grid-cols-2 gap-3.5">
                  <div className="space-y-1.5 col-span-2"> 
                    <label className="text-[8.5px] font-black text-slate-400 uppercase tracking-[0.2em] block ml-1">Product Image</label> 
                    <div className="flex gap-4 items-center">
                      <div className="w-14 h-14 bg-slate-50 dark:bg-slate-900 rounded-2xl flex items-center justify-center border border-slate-100 dark:border-slate-800 overflow-hidden shrink-0 shadow-sm">
                        {formData.img ? (
                          <img src={formData.img} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <Package className="w-5 h-5 text-slate-350" />
                        )}
                      </div>
                      <div className="flex-1 space-y-1.5">
                        <div className="flex items-center gap-2">
                          <input 
                            type="file" 
                            id="imageUpload" 
                            className="hidden" 
                            accept="image/*"
                            onChange={handleImageUpload}
                          />
                          <label 
                            htmlFor="imageUpload" 
                            className="inline-flex items-center px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[8.5px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm"
                          >
                            Choose from Pictures
                          </label>
                        </div>
                        <div className="relative group">
                          <input 
                            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl text-[10px] font-bold outline-none placeholder:text-slate-350 focus:ring-4 focus:ring-emerald-500/10 transition-all text-slate-700 dark:text-white" 
                            value={formData.img} 
                            onChange={(e) => setFormData({...formData, img: e.target.value})} 
                            placeholder="Or paste an image URL here..." 
                          /> 
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5"> 
                    <label className="text-[8.5px] font-black text-slate-400 uppercase tracking-[0.2em] block ml-1">Product Name</label> 
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-650">
                        <Tag className="w-4 h-4" />
                      </div>
                      <input 
                        className="w-full pl-11 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl text-[11px] font-bold outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all text-slate-700 dark:text-white" 
                        value={formData.name} 
                        onChange={(e) => setFormData({...formData, name: e.target.value})} 
                        required 
                      /> 
                    </div>
                  </div>

                  <div className="space-y-1.5"> 
                    <label className="text-[8.5px] font-black text-slate-400 uppercase tracking-[0.2em] block ml-1">SKU</label> 
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-650">
                        <Layers className="w-4 h-4" />
                      </div>
                      <input 
                        className="w-full pl-11 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl text-[11px] font-bold outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all text-slate-700 dark:text-white" 
                        value={formData.sku} 
                        onChange={(e) => setFormData({...formData, sku: e.target.value})} 
                      /> 
                    </div>
                  </div>

                  <div className="space-y-1.5"> 
                    <label className="text-[8.5px] font-black text-slate-400 uppercase tracking-[0.2em] block ml-1">Purchase Price (₹)</label> 
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-650">
                        <Coins className="w-4 h-4" />
                      </div>
                      <input 
                        type="number" 
                        className="w-full pl-11 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl text-[11px] font-bold outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all text-slate-700 dark:text-white" 
                        value={formData.purchasePrice} 
                        onChange={(e) => setFormData({...formData, purchasePrice: e.target.value})} 
                        required 
                      /> 
                    </div>
                  </div>

                  <div className="space-y-1.5"> 
                    <label className="text-[8.5px] font-black text-slate-400 uppercase tracking-[0.2em] block ml-1">Selling Price (₹)</label> 
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-650">
                        <TrendingUp className="w-4 h-4" />
                      </div>
                      <input 
                        type="number" 
                        className="w-full pl-11 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl text-[11px] font-bold outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all text-slate-700 dark:text-white" 
                        value={formData.price} 
                        onChange={(e) => setFormData({...formData, price: e.target.value})} 
                        required 
                      /> 
                    </div>
                  </div>

                  <div className="space-y-1.5"> 
                    <label className="text-[8.5px] font-black text-slate-400 uppercase tracking-[0.2em] block ml-1">Initial Quantity</label> 
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-650">
                        <Scale className="w-4 h-4" />
                      </div>
                      <input 
                        type="number" 
                        className="w-full pl-11 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl text-[11px] font-bold outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all text-slate-700 dark:text-white" 
                        value={formData.qty} 
                        onChange={(e) => setFormData({...formData, qty: e.target.value})} 
                        required 
                      /> 
                    </div>
                  </div>

                  <div className="space-y-1.5"> 
                    <label className="text-[8.5px] font-black text-slate-400 uppercase tracking-[0.2em] block ml-1">Category</label> 
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-650">
                        <LayoutGrid className="w-4 h-4" />
                      </div>
                      <select 
                        className="w-full pl-11 pr-10 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl text-[11px] font-bold outline-none appearance-none focus:ring-4 focus:ring-emerald-500/10 transition-all text-slate-700 dark:text-white cursor-pointer" 
                        value={typeof formData.cat === 'object' ? formData.cat?.name : formData.cat} 
                        onChange={(e) => setFormData({...formData, cat: e.target.value})}
                      >
                        {categories.map(cat => (
                          <option key={cat.id || cat.name || cat} value={cat.name || cat}>
                            {cat.name || cat}
                          </option>
                        ))}
                      </select> 
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-center pointer-events-none">
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5"> 
                    <label className="text-[8.5px] font-black text-slate-400 uppercase tracking-[0.2em] block ml-1">Unit Type</label> 
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-650">
                        <Activity className="w-4 h-4" />
                      </div>
                      <select 
                        className="w-full pl-11 pr-10 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl text-[11px] font-bold outline-none appearance-none focus:ring-4 focus:ring-emerald-500/10 transition-all text-slate-700 dark:text-white cursor-pointer" 
                        value={formData.unit} 
                        onChange={(e) => setFormData({...formData, unit: e.target.value})}
                      >
                        {['kg', 'Crate', 'Box', 'Packet', 'Unit'].map(u => <option key={u} value={u}>{u}</option>)}
                      </select> 
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-center pointer-events-none">
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5"> 
                    <label className="text-[8.5px] font-black text-slate-400 uppercase tracking-[0.2em] block ml-1">Min Order Qty</label> 
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-650">
                        <ShoppingBasket className="w-4 h-4" />
                      </div>
                      <input 
                        type="number" 
                        step="any" 
                        className="w-full pl-11 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl text-[11px] font-bold outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all text-slate-700 dark:text-white" 
                        value={formData.minOrderQty} 
                        onChange={(e) => setFormData({...formData, minOrderQty: e.target.value})} 
                        required 
                      /> 
                    </div>
                  </div>

                  <div className="space-y-1.5 col-span-2"> 
                    <label className="text-[8.5px] font-black text-slate-400 uppercase tracking-[0.2em] block ml-1">Safety Stock Threshold</label> 
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-650">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <input 
                        type="number" 
                        step="any" 
                        className="w-full pl-11 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl text-[11px] font-bold outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all text-slate-700 dark:text-white" 
                        value={formData.minQty} 
                        onChange={(e) => setFormData({...formData, minQty: e.target.value})} 
                        required 
                      /> 
                    </div>
                  </div>

                  {/* Product Active Status Switch */}
                  <div className="space-y-1 col-span-2 flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl">
                    <div>
                      <label className="text-[8.5px] font-black text-slate-900 dark:text-white uppercase tracking-[0.2em] block ml-1 leading-none mb-1">Product Active Status</label>
                      <p className="text-[8px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider block ml-1">Disabled products cannot be viewed or ordered by B2B customers</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer group">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={formData.enabled} 
                        onChange={(e) => setFormData({...formData, enabled: e.target.checked})} 
                      />
                      <div className="w-9 h-5 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-4 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#114232]"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Sticky Footer */}
              <div className="px-6 py-4 bg-slate-50/80 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex gap-3 shrink-0">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)} 
                  className="flex-1 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-black text-[9px] uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-all active:scale-95"
                >
                  Discard
                </button>
                <button 
                  type="submit" 
                  className="flex-[1.5] flex items-center justify-center gap-2 bg-[#114232] text-white py-2.5 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-black transition-all shadow-lg active:scale-95 group"
                >
                  Confirm Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedProduct && (
        <AdjustStockModal isOpen={isAdjustModalOpen} onClose={() => setIsAdjustModalOpen(false)} product={selectedProduct} onComplete={fetchProducts} />
      )}

      {showPurchaseModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-sm rounded-[2rem] shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-50 flex justify-between items-center bg-emerald-50/30"> <h3 className="text-[12px] font-black text-slate-900 tracking-tighter uppercase">Purchase Entry</h3> <button onClick={() => setShowPurchaseModal(false)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-all"> <X className="w-4 h-4" /> </button> </div>
            <form onSubmit={handlePurchaseSubmit} className="p-6 space-y-4">
              <div className="space-y-1.5"> <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest block ml-1">Product</label> <select className="w-full px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-lg text-[11px] font-bold outline-none" value={purchaseData.productId} onChange={(e) => setPurchaseData({...purchaseData, productId: e.target.value})} required> <option value="">Choose product...</option> {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)} </select> </div>
              <button type="submit" className="w-full py-4 bg-slate-900 text-white rounded-xl font-black uppercase tracking-widest text-[9px] shadow-lg hover:bg-black transition-all">Record Purchase</button>
            </form>
          </div>
        </div>
      )}


      {showCategoryModal && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-in zoom-in duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800">
            <div className="px-8 py-6 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-slate-50/30">
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">Category Registry</h3>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Manage global product classifications</p>
              </div>
              <button onClick={() => setShowCategoryModal(false)} className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"> <X className="w-5 h-5" /> </button>
            </div>
            
            <div className="p-8 space-y-8">
              {/* Add Category Form */}
              <form onSubmit={handleAddCategory} className="flex gap-3">
                <div className="flex-1">
                  <input 
                    className="w-full px-5 py-4 bg-[#f3f6f5] dark:bg-slate-800 border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all" 
                    value={newCategory} 
                    onChange={(e) => setNewCategory(e.target.value)} 
                    placeholder="New category name..."
                    required 
                  />
                </div>
                <button type="submit" className="px-8 bg-[#114232] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black shadow-lg transition-all active:scale-95">
                  Register
                </button>
              </form>

              {/* Category List */}
              <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block ml-1 mb-2">Existing Classifications</label>
                <div className="grid grid-cols-2 gap-3">
                  {categories.map((cat, i) => (
                    <div key={cat.id || i} className="group flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-transparent hover:border-emerald-100 dark:hover:border-emerald-900/30 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white dark:bg-slate-700 rounded-lg flex items-center justify-center shadow-sm">
                          <Layers className="w-4 h-4 text-emerald-600" />
                        </div>
                        <span className="text-xs font-black text-slate-700 dark:text-slate-200 uppercase tracking-tight">{cat.name}</span>
                      </div>
                      <button 
                        onClick={async () => {
                          const token = localStorage.getItem('admin_token');
                          await fetch(`http://localhost:5055/api/categories/${cat.id}`, { 
                            method: 'DELETE', 
                            headers: { 'Authorization': `Bearer ${token}` } 
                          });
                          fetchCategories();
                        }}
                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-8 py-6 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-50 dark:border-slate-800 flex justify-end">
              <button onClick={() => setShowCategoryModal(false)} className="px-8 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all">Close Console</button>
            </div>
          </div>
        </div>
      )}

      {notification && (
        <div className="fixed bottom-8 right-8 z-[2000] animate-in slide-in-from-bottom-5 duration-500">
          <div className={`px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border ${notification.type === 'error' ? 'bg-red-50 border-red-100 text-red-600' : 'bg-emerald-50 border-emerald-100 text-emerald-600'}`}>
            {notification.type === 'error' ? <X className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
            <span className="text-[11px] font-black uppercase tracking-widest">{notification.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
