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
  History,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

const Customers = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);

  const [customers, setCustomers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(null);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ 
    name: '', 
    phone: '', 
    email: '', 
    referralCode: '', 
    shopName: '', 
    businessName: '',
    type: 'Retail Grocery', 
    location: '' 
  });

  const API_URL = 'http://localhost:5055/api/partners';

  useEffect(() => {
    fetchPartners();
    fetchActivityLogs();
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
        status: p.status,
        creditBalance: parseFloat(p.credit_balance),
        loyaltyPoints: p.loyalty_points,
        shopName: p.shop_name,
        email: p.email,
        phone: p.phone
      }));
      
      setCustomers(mappedData);
      setError(null);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Could not connect to backend. Please ensure the server is running.');
    } finally {
      setLoading(false);
    }
  };

  const fetchActivityLogs = async () => {
    try {
      const response = await fetch(`${API_URL}/activity-logs`);
      if (response.ok) {
        const data = await response.json();
        const mappedHistory = data.map(log => ({
          id: log.id,
          name: log.entity_name,
          action: `${log.action} by ${log.admin_name}`,
          time: new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: log.action.includes('Approved') || log.action.includes('Enrollment') ? 'approved' : 'rejected'
        }));
        setHistory(mappedHistory);
      }
    } catch (err) {
      console.error('Activity logs fetch error:', err);
    }
  };

  const handleApprove = async (id) => {
    const customer = customers.find(c => c.id === id);
    try {
      const response = await fetch(`${API_URL}/${customer.dbId}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: 'approved' })
      });
      
      if (response.ok) {
        setCustomers(prev => prev.map(c => c.id === id ? { ...c, status: 'approved' } : c));
        setShowReviewModal(null);
        fetchActivityLogs(); // Refresh history
      }
    } catch (err) {
      console.error('Approval error:', err);
    }
  };

  const handleAddCustomer = async (e) => {
    e.preventDefault();
    if (!newCustomer.name || !newCustomer.phone) return;

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(newCustomer)
      });

      if (response.ok) {
        const p = await response.json();
        const addedCustomer = {
          dbId: p.id,
          id: p.partner_id,
          name: p.name,
          initials: (p.shop_name || p.name).split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
          type: p.type,
          location: p.location,
          status: p.status,
          creditBalance: parseFloat(p.credit_balance),
          loyaltyPoints: p.loyalty_points,
          shopName: p.shop_name,
          email: p.email,
          phone: p.phone
        };

        setCustomers(prev => [addedCustomer, ...prev]);
        setShowAddModal(false);
        setNewCustomer({ 
          name: '', phone: '', email: '', referralCode: '', 
          shopName: '', businessName: '', type: 'Retail Grocery', location: '' 
        });
        fetchActivityLogs(); // Refresh history
      }
    } catch (err) {
      console.error('Add customer error:', err);
    }
  };

  const handleToggleStatus = async (id) => {
    const customer = customers.find(c => c.id === id);
    const newStatus = customer.status === 'blocked' ? 'active' : 'blocked';
    
    try {
      const response = await fetch(`${API_URL}/${customer.dbId}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        setCustomers(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
        fetchActivityLogs(); // Refresh history
      }
    } catch (err) {
      console.error('Status toggle error:', err);
    }
  };

  const handleReject = async (id) => {
    const customer = customers.find(c => c.id === id);
    try {
      const response = await fetch(`${API_URL}/${customer.dbId}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: 'blocked' })
      });

      if (response.ok) {
        setCustomers(prev => prev.map(c => c.id === id ? { ...c, status: 'blocked' } : c));
        setShowReviewModal(null);
        fetchActivityLogs(); // Refresh history
      }
    } catch (err) {
      console.error('Rejection error:', err);
    }
  };

  const filteredCustomers = customers.filter(c => {
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

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Main List */}
        <div className="xl:col-span-3 space-y-6">
          {/* Status Tabs */}
          <div className="flex items-center gap-2 p-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm w-fit">
            {['all', 'pending', 'active', 'blocked'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                  activeTab === tab 
                    ? 'bg-[#006e2f] text-white shadow-lg' 
                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
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
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Partner Identity</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Business Type</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Geography</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Capitalization</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Action</th>
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
                  ) : filteredCustomers.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-8 py-20 text-center">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No matching partners found in registry</p>
                      </td>
                    </tr>
                  ) : (
                    filteredCustomers.map((customer) => (
                      <tr key={customer.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center border-2 border-white dark:border-slate-800 shadow-sm">
                              <span className="text-emerald-700 dark:text-emerald-400 font-black text-xs">{customer.initials}</span>
                            </div>
                            <div>
                              <p className="text-sm font-black text-slate-900 dark:text-white tracking-tight">{customer.shopName || customer.name}</p>
                              <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mt-0.5">{customer.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{customer.type}</span>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-slate-200 dark:bg-slate-700" />
                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{customer.location}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border ${
                            customer.status === 'active' || customer.status === 'approved'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                              : customer.status === 'pending'
                                ? 'bg-amber-50 text-amber-700 border-amber-100'
                                : 'bg-red-50 text-red-700 border-red-100'
                          }`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${
                              customer.status === 'active' || customer.status === 'approved' ? 'bg-emerald-500' : customer.status === 'pending' ? 'bg-amber-500' : 'bg-red-500'
                            }`} />
                            <span className="text-[9px] font-black uppercase tracking-widest">{customer.status}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div>
                            <p className="text-xs font-black text-slate-900 dark:text-white tracking-tight">₹{customer.creditBalance.toLocaleString()}</p>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{customer.loyaltyPoints} Points</p>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2">
                            {customer.status === 'pending' ? (
                              <button 
                                onClick={() => setShowReviewModal(customer)}
                                className="px-4 py-2 bg-[#006e2f] text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:opacity-90 transition-all"
                              >
                                Review
                              </button>
                            ) : (
                              <button 
                                onClick={() => handleToggleStatus(customer.id)}
                                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-all"
                              >
                                <MoreVertical className="w-4 h-4" />
                              </button>
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

        {/* Side Panel - History */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <History className="w-4 h-4 text-[#006e2f]" />
              <h3 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">Audit Logs</h3>
            </div>
            
            <div className="space-y-6">
              {history.map((item) => (
                <div key={item.id} className="relative pl-6 before:content-[''] before:absolute before:left-0 before:top-2 before:bottom-[-1.5rem] before:w-0.5 before:bg-slate-50 last:before:hidden">
                  <div className={`absolute left-[-3px] top-1.5 w-2 h-2 rounded-full border-2 border-white ${
                    item.type === 'approved' ? 'bg-emerald-500' : 'bg-red-500'
                  }`} />
                  <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-tight">{item.name}</p>
                  <p className="text-[9px] text-slate-500 font-medium leading-relaxed mt-1">{item.action}</p>
                  <p className="text-[8px] text-slate-300 font-bold uppercase tracking-widest mt-2">{item.time}</p>
                </div>
              ))}
              {history.length === 0 && (
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center py-4">No recent activity</p>
              )}
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#006e2f] to-[#0a4a34] rounded-[2rem] p-6 text-white shadow-xl shadow-green-900/20">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-5 h-5 opacity-50" />
              <div className="px-2 py-1 bg-white/10 rounded-lg text-[8px] font-black uppercase tracking-widest">Realtime Metrics</div>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">Total Active Partners</p>
            <h4 className="text-4xl font-black tracking-tighter mt-1">{customers.filter(c => c.status === 'active' || c.status === 'approved').length}</h4>
            <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between">
              <div>
                <p className="text-[8px] font-bold uppercase tracking-widest opacity-60">Approval Rate</p>
                <p className="text-sm font-black">94.2%</p>
              </div>
              <div className="text-right">
                <p className="text-[8px] font-bold uppercase tracking-widest opacity-60">Avg Credit</p>
                <p className="text-sm font-black">₹18.4k</p>
              </div>
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
              <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">{showReviewModal.shopName || showReviewModal.name}</h3>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Application for B2B Partnership</p>
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
                <div className="col-span-2">
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
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tighter">Partner Enrollment</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Manual Enterprise Registry Input</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm text-slate-300 hover:text-slate-600 border border-slate-100 dark:border-slate-800">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddCustomer} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Partner / Contact Name</label>
                  <input 
                    type="text" 
                    required
                    className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-[#006e2f]/20 transition-all"
                    placeholder="Full name of primary contact"
                    value={newCustomer.name}
                    onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Contact Phone</label>
                  <input 
                    type="tel" 
                    required
                    className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-[#006e2f]/20 transition-all"
                    placeholder="+91 00000 00000"
                    value={newCustomer.phone}
                    onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
                  <input 
                    type="email" 
                    className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-[#006e2f]/20 transition-all"
                    placeholder="business@email.com"
                    value={newCustomer.email}
                    onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Shop / Business Name</label>
                  <input 
                    type="text" 
                    className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-[#006e2f]/20 transition-all"
                    placeholder="Name of the retail establishment"
                    value={newCustomer.shopName}
                    onChange={(e) => setNewCustomer({...newCustomer, shopName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Business Type</label>
                  <select 
                    className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 focus:ring-2 focus:ring-[#006e2f]/20 transition-all appearance-none"
                    value={newCustomer.type}
                    onChange={(e) => setNewCustomer({...newCustomer, type: e.target.value})}
                  >
                    <option>Retail Grocery</option>
                    <option>Specialty Retail</option>
                    <option>Restaurant Chain</option>
                    <option>Hospitality</option>
                    <option>Wholesale</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Location / City</label>
                  <input 
                    type="text" 
                    className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-[#006e2f]/20 transition-all"
                    placeholder="City, State"
                    value={newCustomer.location}
                    onChange={(e) => setNewCustomer({...newCustomer, location: e.target.value})}
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
    </>
  );
};

export default Customers;
