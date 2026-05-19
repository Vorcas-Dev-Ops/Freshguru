import React, { useState, useEffect } from 'react';
import { 
  Megaphone, 
  Plus, 
  Image as ImageIcon, 
  Trash2, 
  Eye, 
  ToggleLeft, 
  ToggleRight,
  Clock,
  Tag,
  Percent,
  X,
  Camera,
  ChevronRight,
  Save,
  Monitor,
  Smartphone,
  Calendar,
  AlertTriangle,
  ArrowUpRight,
  MousePointer2,
  ShoppingBag,
  Filter,
  MoreVertical,
  CheckCircle2,
  Search,
  TrendingUp,
  LayoutGrid,
  List
} from 'lucide-react';

const Banners = () => {
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
  const [showAddModal, setShowAddModal] = useState(false);
  const [products] = useState([
    { id: 'VEG-001-BROC', name: 'Broccoli Florets', cat: 'Vegetable', price: 85 },
    { id: 'FRU-005-MANG', name: 'Alphonso Mangoes', cat: 'Fruit', price: 1200 },
    { id: 'VEG-042-ONIO', name: 'Spanish Red Onions', cat: 'Vegetable', price: 35 },
  ]);
  const [categories] = useState(['Fruit', 'Vegetable', 'Dairy', 'Bakery', 'Frozen']);

  const [banners, setBanners] = useState([
    { 
      id: 1, 
      title: 'Monsoon Mega Sale', 
      type: 'Product Offer',
      target: 'Alphonso Mangoes',
      discountType: 'Percentage',
      discountValue: '25',
      priority: 'High',
      startDate: '2026-05-01',
      endDate: '2026-05-30',
      startTime: '09:00',
      endTime: '21:00',
      status: 'Active',
      image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&q=80&w=400&h=150',
      clicks: 1240,
      orders: 45,
      revenue: 54000
    },
    { 
      id: 2, 
      title: 'Weekend Veggie Blast', 
      type: 'Category Offer',
      target: 'Vegetables',
      discountType: 'Flat',
      discountValue: '50',
      priority: 'Medium',
      startDate: '2026-05-08',
      endDate: '2026-05-10',
      startTime: '00:00',
      endTime: '23:59',
      status: 'Active',
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=400&h=150',
      clicks: 890,
      orders: 28,
      revenue: 12500
    }
  ]);

  const [formData, setFormData] = useState({
    title: '',
    type: 'Product Offer',
    target: '',
    discountType: 'Percentage',
    discountValue: '',
    priority: 'Medium',
    startDate: '',
    endDate: '',
    startTime: '00:00',
    endTime: '23:59',
    status: 'Active',
    image: null
  });

  const [imgPreview, setImgPreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImgPreview(reader.result);
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    const newBanner = {
      ...formData,
      id: banners.length + 1,
      clicks: 0,
      orders: 0,
      revenue: 0,
      image: imgPreview || 'https://via.placeholder.com/400x150?text=Promotion+Banner'
    };
    setBanners([newBanner, ...banners]);
    setShowAddModal(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '', type: 'Product Offer', target: '', discountType: 'Percentage', discountValue: '',
      priority: 'Medium', startDate: '', endDate: '', startTime: '00:00', endTime: '23:59',
      status: 'Active', image: null
    });
    setImgPreview(null);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      {/* ERP Command Header */}
      <div className="flex flex-col xl:flex-row gap-8">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-[#0a4a34] rounded-lg flex items-center justify-center shadow-lg shadow-green-900/10">
              <Megaphone className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Marketing Command</h2>
          </div>
          <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Enterprise Promotion Management & Mobile App Visual Real-Estate</p>
        </div>

        <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button 
              onClick={() => setViewMode('table')}
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${viewMode === 'table' ? 'bg-white dark:bg-slate-900 shadow-sm text-[#0a4a34] dark:text-green-400' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <List className="w-3.5 h-3.5" /> Table
            </button>
            <button 
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${viewMode === 'grid' ? 'bg-white dark:bg-slate-900 shadow-sm text-[#0a4a34] dark:text-green-400' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <LayoutGrid className="w-3.5 h-3.5" /> Grid
            </button>
          </div>
          <div className="h-10 w-px bg-slate-100 dark:bg-slate-800" />
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-[#0a4a34] text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-800 transition-all shadow-lg shadow-green-900/10"
          >
            <Plus className="w-3.5 h-3.5" /> Create Banner
          </button>
        </div>
      </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <StatCard label="Campaign Reach" value="12,402" trend="+14.5%" icon={MousePointer2} />
          <StatCard label="Conversion" value="482" trend="+8.2%" icon={ShoppingBag} />
          <StatCard label="Attributed Sales" value="₹2.45L" trend="+22.1%" icon={Tag} />
        </div>

      {/* Campaign Repository */}
      <div className="bg-white border border-slate-100 rounded-[40px] shadow-sm overflow-hidden">
        <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/20">
          <div className="flex items-center gap-4">
            <div className="w-1.5 h-6 bg-[#0a4a34] rounded-full" />
            <h3 className="text-[12px] font-black text-slate-900 uppercase tracking-widest">Active Marketing Repository</h3>
            <span className="px-3 py-1 bg-[#0a4a34]/5 text-[#0a4a34] rounded-full text-[10px] font-black uppercase tracking-tight ml-2">{banners.length} CAMPAIGNS</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
              <input type="text" placeholder="Search campaigns..." className="pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-[11px] font-bold outline-none w-64 placeholder:text-slate-300 focus:ring-2 focus:ring-[#0a4a34]/10 transition-all" />
            </div>
            <button className="p-2.5 text-slate-400 hover:text-[#0a4a34] hover:bg-emerald-50 rounded-xl transition-all"><Filter className="w-5 h-5" /></button>
          </div>
        </div>

        {viewMode === 'table' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/30">
                  <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Campaign Creative</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Audience</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Offer Structure</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Lifecycle</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Priority</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Execution</th>
                  <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ops</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {banners.map((banner) => (
                  <tr key={banner.id} className="hover:bg-slate-50/50 transition-all group">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-5">
                        <div className="w-24 h-14 rounded-2xl bg-slate-100 border border-slate-100 overflow-hidden shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                          <img src={banner.image} className="w-full h-full object-cover" alt="" />
                        </div>
                        <div>
                          <p className="font-black text-slate-900 text-[13px] tracking-tighter uppercase">{banner.title}</p>
                          <p className="text-[9px] text-[#0a4a34] font-black uppercase tracking-widest mt-1 opacity-60">{banner.type}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-tight border border-blue-100/50 w-fit">
                        <Smartphone className="w-3 h-3" /> {banner.target}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-[15px] font-black text-emerald-600 tracking-tight">
                          {banner.discountType === 'Percentage' ? `${banner.discountValue}% OFF` : `₹${banner.discountValue} FLAT`}
                        </span>
                        <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest mt-0.5">Applied at checkout</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-600">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" /> {banner.startDate}
                        </div>
                        <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400 tracking-widest">
                          <Clock className="w-3.5 h-3.5" /> {banner.startTime} - {banner.endTime}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-[0.1em] ${
                        banner.priority === 'High' ? 'bg-red-50 text-red-500 border border-red-100' : 
                        banner.priority === 'Medium' ? 'bg-orange-50 text-orange-500 border border-orange-100' : 'bg-slate-50 text-slate-500 border border-slate-100'
                      }`}>
                        {banner.priority}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <div className="flex flex-col items-center gap-1.5">
                        <div className={`w-10 h-5 rounded-full p-1 transition-all ${banner.status === 'Active' ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.3)]' : 'bg-slate-200'}`}>
                          <div className={`w-3 h-3 bg-white rounded-full transition-all ${banner.status === 'Active' ? 'translate-x-5' : ''}`} />
                        </div>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{banner.status}</span>
                      </div>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-3 text-slate-400 hover:text-[#0a4a34] hover:bg-emerald-50 rounded-2xl transition-all"><Edit3 className="w-5 h-5" /></button>
                        <button className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"><Trash2 className="w-5 h-5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-10 grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-10">
            {banners.map((banner) => (
              <div key={banner.id} className="bg-white border border-slate-100 rounded-[44px] overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group">
                <div className="relative h-56 overflow-hidden">
                  <img src={banner.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt="" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent flex flex-col justify-end p-8">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-lg text-[9px] font-black text-white uppercase tracking-[0.2em] border border-white/20">
                        {banner.priority} LEVEL
                      </span>
                    </div>
                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter leading-tight">{banner.title}</h3>
                  </div>
                </div>
                <div className="p-8 space-y-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1.5">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Promotion Logic</p>
                      <p className="text-[13px] font-black text-slate-800 uppercase tracking-tight">{banner.target}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">In-Store Offer</p>
                      <p className="text-2xl font-black text-[#0a4a34]">
                        {banner.discountType === 'Percentage' ? `${banner.discountValue}% OFF` : `₹${banner.discountValue} FLAT`}
                      </p>
                    </div>
                  </div>
                  <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-[#0a4a34] shadow-sm">
                        <TrendingUp className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase leading-none">Attributed ROI</p>
                        <p className="text-[13px] font-black text-slate-900 tracking-tight mt-1">₹{banner.revenue.toLocaleString()}</p>
                      </div>
                    </div>
                    <button className="flex items-center gap-2 px-6 py-3 bg-slate-50 text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all active:scale-95 border border-slate-100">
                      View Intelligence
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
            {/* Advanced Banner Creation Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-5xl rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[92vh]">
            <div className="px-10 py-8 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#0a4a34] rounded-2xl flex items-center justify-center shadow-lg shadow-green-900/10">
                  <Megaphone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-none">Create Promotion</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.05em] mt-2">Configure high-impact promotional banners for your storefront</p>
                </div>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-2 text-slate-300 hover:text-slate-500 transition-colors">
                <X className="w-8 h-8" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto px-10 pb-10 space-y-10 custom-scrollbar">
              <div className="grid grid-cols-12 gap-10">
                {/* Left Column: Creative & Details */}
                <div className="col-span-12 lg:col-span-6 space-y-8">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-1 h-4 bg-emerald-500 rounded-full" />
                      <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Creative & Details</h4>
                    </div>
                    
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Banner Title</label>
                      <input 
                        className="w-full px-6 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-300" 
                        placeholder="e.g. Fresh Mango Festival"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Promotional Poster (High Res)</label>
                      <div 
                        onClick={() => document.getElementById('banner-img-input').click()}
                        className="relative border-2 border-dashed border-slate-100 bg-white rounded-[32px] h-64 flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/10 transition-all group overflow-hidden"
                      >
                        {imgPreview ? (
                          <img src={imgPreview} className="w-full h-full object-cover" alt="Preview" />
                        ) : (
                          <>
                            <div className="w-16 h-16 rounded-full bg-emerald-50/50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                              <ImageIcon className="w-8 h-8 text-emerald-600" />
                            </div>
                            <p className="text-[13px] text-slate-900 font-black uppercase tracking-widest">Drop Poster Here</p>
                            <p className="text-[9px] text-slate-400 font-bold uppercase mt-2">Recommended: 1200x450px (PNG/JPG)</p>
                          </>
                        )}
                        <input id="banner-img-input" type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Configuration */}
                <div className="col-span-12 lg:col-span-6 space-y-10">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-1 h-4 bg-orange-500 rounded-full" />
                      <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Offer Configuration</h4>
                    </div>
                    
                    <div className="p-8 bg-[#fffbeb] border border-[#fef3c7] rounded-[32px] space-y-6">
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="block text-[10px] font-black text-[#92400e] uppercase tracking-widest mb-3 ml-1">Discount Type</label>
                          <select 
                            className="w-full px-5 py-4 bg-white border border-[#fde68a] rounded-2xl text-sm font-bold outline-none"
                            value={formData.discountType}
                            onChange={(e) => setFormData({...formData, discountType: e.target.value})}
                          >
                            <option>Percentage</option>
                            <option>Flat Amount</option>
                            <option>Buy X Get Y</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-[#92400e] uppercase tracking-widest mb-3 ml-1">Value</label>
                          <input 
                            type="text"
                            className="w-full px-5 py-4 bg-white border border-[#fde68a] rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none transition-all" 
                            placeholder={formData.discountType === 'Percentage' ? '%' : '₹'}
                            value={formData.discountValue}
                            onChange={(e) => setFormData({...formData, discountValue: e.target.value})}
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-5 bg-white rounded-2xl border border-[#fef3c7]">
                        <div className="flex items-center gap-3">
                          <AlertTriangle className="w-5 h-5 text-orange-500" />
                          <div className="max-w-[180px]">
                            <p className="text-[9px] font-black text-slate-900 uppercase">Pricing Logic</p>
                            <p className="text-[8px] text-slate-500 font-bold uppercase leading-relaxed mt-0.5">Discount applies to all units in the linked category automatically.</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] font-black text-slate-300 uppercase">Preview</p>
                          <p className="text-2xl font-black text-emerald-500">0.00</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-1 h-4 bg-purple-500 rounded-full" />
                      <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Campaign Scheduler</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Start Date & Time</label>
                        <div className="flex gap-2">
                          <input type="text" placeholder="dd/mm/yyyy" className="flex-[2] px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl text-[11px] font-bold outline-none" />
                          <input type="text" placeholder="00:00" className="flex-1 px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl text-[11px] font-bold outline-none text-center" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">End Date & Time</label>
                        <div className="flex gap-2">
                          <input type="text" placeholder="dd/mm/yyyy" className="flex-[2] px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl text-[11px] font-bold outline-none" />
                          <input type="text" placeholder="23:59" className="flex-1 px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl text-[11px] font-bold outline-none text-center" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Row: Targeting */}
                <div className="col-span-12 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-4 bg-blue-500 rounded-full" />
                    <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Campaign Targeting</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Campaign Type</label>
                      <select className="w-full px-5 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl text-[11px] font-black outline-none appearance-none">
                        <option>Product Offer</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Select Target</label>
                      <select className="w-full px-5 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl text-[11px] font-black outline-none appearance-none">
                        <option>-- Choose Target --</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Display Priority</label>
                      <select className="w-full px-5 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl text-[11px] font-black outline-none appearance-none">
                        <option>Medium</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Campaign Status</label>
                      <select className="w-full px-5 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl text-[11px] font-black outline-none appearance-none">
                        <option>Active</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Footer Actions */}
              <div className="pt-10 flex items-center justify-between">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="text-[11px] font-black text-slate-400 uppercase tracking-[0.1em] hover:text-slate-600 transition-colors px-2"
                >
                  Discard Changes
                </button>
                <button 
                  type="submit"
                  className="px-8 py-5 bg-[#0a4a34] text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.1em] flex items-center gap-3 hover:bg-[#073626] transition-all shadow-xl shadow-green-900/10 active:scale-95"
                >
                  <CheckCircle2 className="w-4 h-4" /> Launch Marketing Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ label, value, trend, sub, icon: Icon, alert }) => (
  <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-500 group relative overflow-hidden text-left">
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

const Edit3 = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
);

const RefreshCw = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>
);

export default Banners;
