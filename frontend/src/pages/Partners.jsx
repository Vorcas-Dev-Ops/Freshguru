import React, { useState, useEffect } from 'react';
import { 
  Users as UsersIcon, 
  UserCheck, 
  Wallet, 
  Search, 
  Filter, 
  UserPlus,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  CheckCircle,
  XCircle,
  TrendingUp,
  AlertCircle,
  ShoppingCart,
  Calendar,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';

const Partners = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [partners, setPartners] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(null);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [fullScreenPhoto, setFullScreenPhoto] = useState(null);
  const [newPartner, setNewPartner] = useState({ 
    name: '', 
    phone: '', 
    email: '', 
    referralCode: '', 
    shopName: '', 
    businessName: '',
    type: 'Retail Grocery', 
    location: '',
    imageUrl: ''
  });

  const API_URL = 'http://localhost:5055/api/partners';

  const getStatusDisplay = (status) => {
    switch (status) {
      case 'pending':
        return { label: 'Under Process', color: 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/50', dot: 'bg-amber-500' };
      case 'approved':
        return { label: 'Approved', color: 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/50', dot: 'bg-emerald-500' };
      case 'blocked':
        return { label: 'Rejected', color: 'bg-red-50 text-red-700 border-red-100 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/50', dot: 'bg-red-500' };
      case 'active':
        return { label: 'Active', color: 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/50', dot: 'bg-emerald-500' };
      case 'inactive':
        return { label: 'Inactive', color: 'bg-slate-50 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700', dot: 'bg-slate-400' };
      default:
        return { label: status, color: 'bg-slate-50 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700', dot: 'bg-slate-400' };
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('admin_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const fetchPartners = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Failed to fetch partners');
      const data = await response.json();
      
      const mappedData = data.map(p => ({
        dbId: p.id,
        id: p.partner_id,
        name: p.name,
        initials: (p.shop_name || p.name).split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
        type: p.type,
        location: p.location,
        status: p.status || 'pending',
        creditBalance: parseFloat(p.credit_balance) || 0,
        loyaltyPoints: p.loyalty_points || 0,
        shopName: p.shop_name,
        businessName: p.business_name,
        referralCode: p.referral_code,
        imageUrl: p.image_url,
        email: p.email,
        phone: p.phone
      }));
      
      setPartners(mappedData);
      setError(null);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Could not connect to backend. Please ensure the server is running.');
    } finally {
      setLoading(false);
    }
  };

  const fetchPartnerDetails = async (partner) => {
    try {
      const response = await fetch(`${API_URL}/${partner.dbId}/details`);
      if (response.ok) {
        const data = await response.json();
        setShowDetailsModal(data);
      }
    } catch (err) {
      console.error('Fetch details error:', err);
    }
  };


  const handleApprove = async (id) => {
    const partner = partners.find(c => c.id === id);
    try {
      const response = await fetch(`${API_URL}/${partner.dbId}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: 'approved' })
      });
      
      if (response.ok) {
        setPartners(prev => prev.map(c => c.id === id ? { ...c, status: 'approved' } : c));
        setShowReviewModal(null);
      }
    } catch (err) {
      console.error('Approval error:', err);
    }
  };

  const handleAddPartner = async (e) => {
    e.preventDefault();
    if (!newPartner.name || !newPartner.phone) return;

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(newPartner)
      });

      if (response.ok) {
        const p = await response.json();
        const addedPartner = {
          dbId: p.id,
          id: p.partner_id,
          name: p.name,
          initials: (p.shop_name || p.name).split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
          type: p.type,
          location: p.location,
          status: p.status || 'pending',
          creditBalance: parseFloat(p.credit_balance) || 0,
          loyaltyPoints: p.loyalty_points || 0,
          shopName: p.shop_name,
          businessName: p.business_name,
          referralCode: p.referral_code,
          imageUrl: p.image_url,
          email: p.email,
          phone: p.phone
        };

        setPartners(prev => [addedPartner, ...prev]);
        setShowAddModal(false);
        setNewPartner({ 
          name: '', phone: '', email: '', referralCode: '', 
          shopName: '', businessName: '', type: 'Retail Grocery', location: '', imageUrl: '' 
        });
      }
    } catch (err) {
      console.error('Add partner error:', err);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    const partner = partners.find(c => c.id === id);
    try {
      const response = await fetch(`${API_URL}/${partner.dbId}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        setPartners(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
      }
    } catch (err) {
      console.error('Status change error:', err);
    }
  };

  const handleReject = async (id) => {
    const partner = partners.find(c => c.id === id);
    try {
      const response = await fetch(`${API_URL}/${partner.dbId}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: 'blocked' })
      });

      if (response.ok) {
        setPartners(prev => prev.map(c => c.id === id ? { ...c, status: 'blocked' } : c));
        setShowReviewModal(null);
      }
    } catch (err) {
      console.error('Rejection error:', err);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPartner({ ...newPartner, imageUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredPartners = partners.filter(c => {
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'pending' && c.status === 'pending') ||
                      (activeTab === 'active' && (c.status === 'active' || c.status === 'approved')) ||
                      (activeTab === 'blocked' && c.status === 'blocked');
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (c.shopName && c.shopName.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  return (
    <>
      {/* ERP Command Header */}
      <div className="flex flex-col xl:flex-row gap-8 mb-8">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-[#0a4a34] rounded-lg flex items-center justify-center shadow-lg shadow-green-900/10">
              <UsersIcon className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Partner Registry</h2>
          </div>
          <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Enterprise Partner Management & Business Approval Infrastructure</p>
        </div>

        <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
            <Search className="w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search Partners..." 
              className="bg-transparent border-none text-[10px] font-black uppercase tracking-widest text-slate-600 focus:ring-0 w-32"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#006e2f] text-white rounded-xl shadow-[0_10px_20px_rgba(0,110,47,0.15)] hover:shadow-[0_15px_25px_rgba(0,110,47,0.2)] hover:-translate-y-0.5 transition-all active:scale-95"
          >
            <UserPlus className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Enroll Partner</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-xs font-semibold">{error}</p>
          <button onClick={fetchPartners} className="ml-auto text-[10px] font-black uppercase underline">Retry</button>
        </div>
      )}

      <div className="space-y-6">
        {/* Main List */}
        <div className="space-y-6">
          {/* Status Tabs */}
          <div className="flex items-center gap-2 p-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm w-fit">
            {['all', 'pending', 'active', 'blocked'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-xl text-[10px] font-black capitalize tracking-[0.2em] transition-all ${
                  activeTab === tab 
                    ? 'bg-[#006e2f] text-white shadow-lg' 
                    : 'text-black hover:text-slate-600 hover:bg-slate-50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Table Container */}
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                    <th className="px-8 py-5 text-[10px] font-black text-black capitalize tracking-widest">Partner identity</th>
                    <th className="px-8 py-5 text-[10px] font-black text-black capitalize tracking-widest">Business type</th>
                    <th className="px-8 py-5 text-[10px] font-black text-black capitalize tracking-widest">Geography</th>
                    <th className="px-8 py-5 text-[10px] font-black text-black capitalize tracking-widest">Status</th>
                    <th className="px-8 py-5 text-[10px] font-black text-black capitalize tracking-widest">Capitalization</th>
                    <th className="px-8 py-5 text-[10px] font-black text-black capitalize tracking-widest">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="px-8 py-20 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-8 h-8 border-4 border-[#006e2f]/20 border-t-[#006e2f] rounded-full animate-spin" />
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Syncing Partner Data...</p>
                        </div>
                      </td>
                    </tr>
                  ) : filteredPartners.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-8 py-20 text-center">
                        <p className="text-[10px] font-black text-black capitalize tracking-widest">No matching partners found in registry</p>
                      </td>
                    </tr>
                  ) : (
                    filteredPartners.map((partner) => (
                      <tr key={partner.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                        <td className="px-8 py-6">
                          <div 
                            className="flex items-center gap-4 cursor-pointer hover:opacity-70 transition-all"
                            onClick={() => fetchPartnerDetails(partner)}
                          >
                            <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center border-2 border-white dark:border-slate-800 shadow-sm overflow-hidden">
                              {partner.imageUrl ? (
                                <img src={partner.imageUrl} alt={partner.name} className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-emerald-700 dark:text-emerald-400 font-black text-xs">{partner.initials}</span>
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-black text-slate-900 dark:text-white tracking-tight">{partner.shopName || partner.name}</p>
                              <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mt-0.5">{partner.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{partner.type}</span>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-slate-200 dark:bg-slate-700" />
                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{partner.location}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border ${
                            getStatusDisplay(partner.status).color
                          }`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${getStatusDisplay(partner.status).dot}`} />
                            <span className="text-[9px] font-black uppercase tracking-widest">{getStatusDisplay(partner.status).label}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div>
                            <p className="text-xs font-black text-slate-900 dark:text-white tracking-tight">₹{partner.creditBalance.toLocaleString()}</p>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{partner.loyaltyPoints} Points</p>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2">
                            {partner.status === 'pending' ? (
                              <button 
                                onClick={() => setShowReviewModal(partner)}
                                className="px-6 py-2.5 bg-[#006e2f] text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-md shadow-green-900/10 active:scale-95"
                              >
                                Review
                              </button>
                            ) : (
                              <div className="relative inline-block text-left">
                                <button
                                  type="button"
                                  onClick={() => setOpenDropdownId(openDropdownId === partner.id ? null : partner.id)}
                                  className={`flex items-center justify-between gap-3 px-5 py-2 border-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all w-28 active:scale-95 ${
                                    partner.status === 'blocked'
                                      ? 'border-red-100 text-red-600 dark:border-red-900/30 dark:text-red-400 hover:bg-red-50/50 dark:hover:bg-red-950/20'
                                      : 'border-emerald-100 text-emerald-600 dark:border-emerald-900/30 dark:text-emerald-400 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20'
                                  }`}
                                >
                                  <span>{partner.status === 'blocked' ? 'Inactive' : 'Active'}</span>
                                  <svg 
                                    className={`w-2.5 h-2.5 transition-transform duration-200 text-slate-400 ${openDropdownId === partner.id ? 'rotate-180 text-[#006e2f]' : ''}`} 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                  >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                                  </svg>
                                </button>

                                {openDropdownId === partner.id && (
                                  <>
                                    {/* Backdrop overlay to close when clicking outside */}
                                    <div 
                                      className="fixed inset-0 z-10" 
                                      onClick={() => setOpenDropdownId(null)}
                                    />
                                    <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-xl z-20 overflow-hidden py-1 animate-in fade-in slide-in-from-top-2 duration-150">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          handleStatusChange(partner.id, 'active');
                                          setOpenDropdownId(null);
                                        }}
                                        className={`w-full px-4 py-2.5 text-left text-[9px] font-black uppercase tracking-widest flex items-center gap-2 transition-colors ${
                                          partner.status !== 'blocked'
                                            ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400'
                                            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                                        }`}
                                      >
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                        Active
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          handleStatusChange(partner.id, 'blocked');
                                          setOpenDropdownId(null);
                                        }}
                                        className={`w-full px-4 py-2.5 text-left text-[9px] font-black uppercase tracking-widest flex items-center gap-2 transition-colors ${
                                          partner.status === 'blocked'
                                            ? 'bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400'
                                            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                                        }`}
                                      >
                                        <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                        Inactive
                                      </button>
                                    </div>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-slate-50 dark:border-slate-800">
              <div className="flex items-center justify-between mb-6">
                <div className="px-3 py-1 bg-amber-50 text-amber-700 rounded-lg text-[9px] font-black uppercase tracking-widest border border-amber-100">Pending Review</div>
                <button onClick={() => setShowReviewModal(null)} className="text-slate-300 hover:text-slate-600">
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              <div className="flex items-center gap-6 mb-6">
                {showReviewModal.imageUrl ? (
                  <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center border-2 border-white dark:border-slate-800 shadow-sm overflow-hidden flex-shrink-0">
                    <img src={showReviewModal.imageUrl} alt={showReviewModal.name} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center border-2 border-white dark:border-slate-800 shadow-sm flex-shrink-0">
                    <span className="text-emerald-700 dark:text-emerald-400 font-black text-2xl">{showReviewModal.initials}</span>
                  </div>
                )}
                <div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">{showReviewModal.shopName || showReviewModal.name}</h3>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Application for B2B Partnership</p>
                </div>
              </div>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Contact Phone</p>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{showReviewModal.phone}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Business Type</p>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{showReviewModal.type}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Email</p>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{showReviewModal.email || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Referral Code</p>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{showReviewModal.referralCode || 'None'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Legal Name</p>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{showReviewModal.businessName || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Geography / Location</p>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{showReviewModal.location}</p>
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => handleReject(showReviewModal.id)}
                  className="flex-1 py-4 border-2 border-slate-100 dark:border-slate-800 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all"
                >
                  Reject Partner
                </button>
                <button 
                  onClick={() => handleApprove(showReviewModal.id)}
                  className="flex-1 py-4 bg-[#006e2f] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-green-900/20 hover:opacity-90 transition-all"
                >
                  Approve Access
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tighter">Partner Enrollment</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Manual Enterprise Registry Input</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm text-slate-300 hover:text-slate-600 border border-slate-100 dark:border-slate-800">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddPartner} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Partner / Contact Name</label>
                  <input 
                    type="text" 
                    required
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-[#006e2f]/20 transition-all"
                    placeholder="Full name of primary contact"
                    value={newPartner.name}
                    onChange={(e) => setNewPartner({...newPartner, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Contact Phone</label>
                  <input 
                    type="tel" 
                    required
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-[#006e2f]/20 transition-all"
                    placeholder="+91 00000 00000"
                    value={newPartner.phone}
                    onChange={(e) => setNewPartner({...newPartner, phone: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Email Address</label>
                  <input 
                    type="email" 
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-[#006e2f]/20 transition-all"
                    placeholder="business@email.com"
                    value={newPartner.email}
                    onChange={(e) => setNewPartner({...newPartner, email: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Shop / Business Name</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-[#006e2f]/20 transition-all"
                    placeholder="Name of the retail establishment"
                    value={newPartner.shopName}
                    onChange={(e) => setNewPartner({...newPartner, shopName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Business Legal Name</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-[#006e2f]/20 transition-all"
                    placeholder="Legal entity name"
                    value={newPartner.businessName}
                    onChange={(e) => setNewPartner({...newPartner, businessName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Business Type</label>
                  <select 
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 focus:ring-2 focus:ring-[#006e2f]/20 transition-all appearance-none"
                    value={newPartner.type}
                    onChange={(e) => setNewPartner({...newPartner, type: e.target.value})}
                  >
                    <option>Retail Grocery</option>
                    <option>Specialty Retail</option>
                    <option>Restaurant Chain</option>
                    <option>Hospitality</option>
                    <option>Wholesale</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Location / City</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-[#006e2f]/20 transition-all"
                    placeholder="City, State"
                    value={newPartner.location}
                    onChange={(e) => setNewPartner({...newPartner, location: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Referral Code</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-[#006e2f]/20 transition-all"
                    placeholder="Optional code"
                    value={newPartner.referralCode}
                    onChange={(e) => setNewPartner({...newPartner, referralCode: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Shop Photo</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-[10px] font-bold text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-[#006e2f]/20 transition-all file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-black file:uppercase file:tracking-widest file:bg-[#006e2f]/10 file:text-[#006e2f] hover:file:bg-[#006e2f]/20"
                  />
                </div>
              </div>
              <button 
                type="submit"
                className="w-full py-5 bg-[#006e2f] text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-green-900/20 hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
              >
                <UserPlus className="w-5 h-5" />
                Register Partner to Registry
              </button>
            </form>
          </div>
        </div>
      )}
      {/* Details Modal */}
      {showDetailsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-emerald-100 dark:border-emerald-900/30 flex items-center justify-between bg-gradient-to-r from-[#006e2f]/5 to-emerald-50/50 dark:from-[#006e2f]/20 dark:to-emerald-900/10">
              <div className="flex items-center gap-4">
                <div 
                  className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center border-4 border-white dark:border-slate-800 shadow-lg overflow-hidden ${showDetailsModal.partner.image_url ? 'cursor-pointer hover:opacity-80 transition-opacity bg-emerald-50 dark:bg-emerald-900/20' : 'bg-emerald-500 text-white'}`}
                  onClick={() => showDetailsModal.partner.image_url && setFullScreenPhoto(showDetailsModal.partner.image_url)}
                >
                  {showDetailsModal.partner.image_url ? (
                    <img src={showDetailsModal.partner.image_url} alt={showDetailsModal.partner.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-black text-xl">
                      {(showDetailsModal.partner.shop_name || showDetailsModal.partner.name).split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">{showDetailsModal.partner.shop_name || showDetailsModal.partner.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{showDetailsModal.partner.partner_id}</span>
                    <div className="w-1 h-1 rounded-full bg-slate-200" />
                    <span className="text-[10px] text-emerald-600 font-black uppercase tracking-widest">{showDetailsModal.partner.type}</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setShowDetailsModal(null)} className="p-3 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl text-slate-400 hover:text-slate-700 transition-all shadow-sm">
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Stats Sidebar */}
              <div className="space-y-6">
                <div className="p-6 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-[2rem] border border-emerald-100/50 dark:border-emerald-800/30">
                  <p className="text-[10px] font-black text-emerald-600/70 dark:text-emerald-400/70 uppercase tracking-widest mb-4">Partner Metrics</p>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                        <ShoppingCart className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Total Orders</span>
                      </div>
                      <span className="text-sm font-black text-slate-900 dark:text-white">{showDetailsModal.metrics.total_orders}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-500">
                        <Wallet className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Total Value</span>
                      </div>
                      <span className="text-sm font-black text-emerald-600">₹{showDetailsModal.metrics.total_spent.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-amber-500">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Loyalty Pts</span>
                      </div>
                      <span className="text-sm font-black text-amber-600">{showDetailsModal.partner.loyalty_points}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl hover:border-emerald-200 transition-colors shadow-sm">
                    <Phone className="w-4 h-4 text-[#006e2f]" />
                    <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">{showDetailsModal.partner.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl hover:border-emerald-200 transition-colors shadow-sm">
                    <Mail className="w-4 h-4 text-[#006e2f]" />
                    <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">{showDetailsModal.partner.email || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl hover:border-emerald-200 transition-colors shadow-sm">
                    <MapPin className="w-4 h-4 text-[#006e2f]" />
                    <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">{showDetailsModal.partner.location}</span>
                  </div>
                  {showDetailsModal.partner.business_name && (
                    <div className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl">
                      <div className="w-4 h-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        <span className="text-[8px] font-black text-slate-400">BN</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Legal Name</span>
                        <span className="text-[11px] font-bold text-slate-600">{showDetailsModal.partner.business_name}</span>
                      </div>
                    </div>
                  )}
                  {showDetailsModal.partner.referral_code && (
                    <div className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl">
                      <div className="w-4 h-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        <span className="text-[8px] font-black text-slate-400">REF</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Referral</span>
                        <span className="text-[11px] font-bold text-slate-600">{showDetailsModal.partner.referral_code}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Order History */}
              <div className="md:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">Purchase History</h4>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{showDetailsModal.orders.length} Records</span>
                </div>

                <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                  {showDetailsModal.orders.length === 0 ? (
                    <div className="py-20 text-center bg-blue-50/30 dark:bg-blue-900/10 rounded-[2rem] border-2 border-dashed border-blue-100 dark:border-blue-900/30">
                      <p className="text-[10px] font-black text-blue-400 dark:text-blue-500 uppercase tracking-widest">No order history available</p>
                    </div>
                  ) : (
                    showDetailsModal.orders.map((order) => (
                      <div key={order.id} className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl hover:border-emerald-200 dark:hover:border-emerald-900/50 transition-all flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center">
                            <Calendar className="w-4 h-4 text-slate-400" />
                          </div>
                          <div>
                            <p className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-tight">{order.order_id}</p>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{new Date(order.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-black text-slate-900 dark:text-white tracking-tighter">₹{parseFloat(order.total_amount).toLocaleString()}</p>
                          <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                            order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full Screen Photo Lightbox */}
      {fullScreenPhoto && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/90 backdrop-blur-md animate-in fade-in duration-300"
          onClick={() => setFullScreenPhoto(null)}
        >
          <div className="relative max-w-5xl w-full max-h-screen p-4 flex flex-col items-center justify-center">
            <button 
              onClick={() => setFullScreenPhoto(null)}
              className="absolute top-4 right-4 md:top-8 md:right-8 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-all"
            >
              <XCircle className="w-8 h-8" />
            </button>
            <img 
              src={fullScreenPhoto} 
              alt="Partner Shop" 
              className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Partners;
