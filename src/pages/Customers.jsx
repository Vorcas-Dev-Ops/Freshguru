import React, { useState } from 'react';
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
} from 'lucide-react';

const Customers = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [history, setHistory] = useState([
    { id: 1, name: 'Green Valley Mart', action: 'Approved for B2B access by Admin', time: '2 Hours Ago', type: 'approved' },
    { id: 2, name: 'City Bakers & Sweets', action: 'Registration rejected due to missing GST profile', time: '5 Hours Ago', type: 'rejected' },
  ]);

  const [customers, setCustomers] = useState([
    { id: 'FG-40291', name: 'Sai Kirana Store', initials: 'SK', type: 'Retail Grocery', location: 'Mumbai, MH', status: 'active' },
    { id: 'FG-99120', name: 'Organic Mart', initials: 'OM', type: 'Specialty Retail', location: 'Bangalore, KA', status: 'pending' },
    { id: 'FG-11822', name: 'Royal Foods Co.', initials: 'RF', type: 'Restaurant Chain', location: 'Delhi, DL', status: 'approved' },
    { id: 'FG-88211', name: 'Hotel Taj Mahal', initials: 'HT', type: 'Hospitality', location: 'Pune, MH', status: 'blocked' }
  ]);
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

  const handleApprove = (id) => {
    const customer = customers.find(c => c.id === id);
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, status: 'approved' } : c));
    setShowReviewModal(null);
    setHistory(prev => [{
      id: Date.now(),
      name: customer.name,
      action: 'Approved for B2B access by Admin',
      time: 'Just Now',
      type: 'approved'
    }, ...prev]);
  };

  const handleAddCustomer = (e) => {
    e.preventDefault();
    if (!newCustomer.name || !newCustomer.phone) return;

    const newId = `FG-${Math.floor(Math.random() * 90000) + 10000}`;
    const initials = (newCustomer.shopName || newCustomer.name).split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    const addedCustomer = {
      id: newId,
      ...newCustomer,
      initials,
      status: 'pending',
      registeredAt: new Date().toLocaleString()
    };

    setCustomers(prev => [addedCustomer, ...prev]);
    setShowAddModal(false);
    setNewCustomer({ 
      name: '', phone: '', email: '', referralCode: '', 
      shopName: '', businessName: '', type: 'Retail Grocery', location: '' 
    });

    setHistory(prev => [{
      id: Date.now(),
      name: addedCustomer.shopName || addedCustomer.name,
      action: 'New business registration received',
      time: 'Just Now',
      type: 'approved'
    }, ...prev]);
  };

  const handleToggleStatus = (id) => {
    const customer = customers.find(c => c.id === id);
    const newStatus = customer.status === 'blocked' ? 'active' : 'blocked';
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
    
    setHistory(prev => [{
      id: Date.now(),
      name: customer.name,
      action: `Account ${newStatus === 'active' ? 'Activated' : 'Deactivated'} by Admin`,
      time: 'Just Now',
      type: newStatus === 'active' ? 'approved' : 'rejected'
    }, ...prev]);
  };

  const handleReject = (id) => {
    const customer = customers.find(c => c.id === id);
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, status: 'blocked' } : c));
    setShowReviewModal(null);
    setHistory(prev => [{
      id: Date.now(),
      name: customer.name,
      action: 'Registration rejected by Admin',
      time: 'Just Now',
      type: 'rejected'
    }, ...prev]);
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
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <KPICard title="Total Customers" value="1,284" trend="+12%" icon={UsersIcon} color="text-green-600" />
        <KPICard title="New Requests" value="42" subtext="Pending Approval" icon={UserCheck} color="text-amber-500" />
      </section>

      <section className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-1 bg-slate-50 p-1 rounded-lg">
            {['all', 'pending', 'active', 'blocked'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-all ${
                  activeTab === tab 
                    ? 'text-green-700 bg-white shadow-sm' 
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1).replace('all', 'All').replace('pending', 'Pending Approval')}
              </button>
            ))}
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Search customers..." 
                className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="p-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
              <Filter className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-bold rounded-lg hover:bg-green-700 transition-all active:scale-95 shadow-sm"
            >
              <UserPlus className="w-5 h-5" />
              Add Customer
            </button>
          </div>
        </div>

        {showAddModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
            <div className="bg-white rounded-2xl p-0 w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Register New Business</h2>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Complete the B2B onboarding form</p>
                </div>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-600 transition-all"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleAddCustomer} className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">Contact Details</h3>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Full Name</label>
                      <input type="text" className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm" required onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})} value={newCustomer.name} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Phone Number</label>
                      <input type="tel" className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm" required onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})} value={newCustomer.phone} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Email Address</label>
                      <input type="email" className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm" onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})} value={newCustomer.email} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Referral Code (Optional)</label>
                      <input type="text" className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm" onChange={(e) => setNewCustomer({...newCustomer, referralCode: e.target.value})} value={newCustomer.referralCode} />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">Business Details</h3>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Shop / Entity Name</label>
                      <input type="text" className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm" required onChange={(e) => setNewCustomer({...newCustomer, shopName: e.target.value})} value={newCustomer.shopName} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Business Name (Official)</label>
                      <input type="text" className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm" onChange={(e) => setNewCustomer({...newCustomer, businessName: e.target.value})} value={newCustomer.businessName} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Business Category</label>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                          className="w-full flex items-center justify-between px-4 py-2 border border-slate-200 rounded-xl bg-white text-sm"
                        >
                          <span>{newCustomer.type}</span>
                          <ChevronRight className={`w-4 h-4 transition-transform ${showTypeDropdown ? 'rotate-90' : ''}`} />
                        </button>
                        {showTypeDropdown && (
                          <div className="absolute top-full left-0 w-full mt-2 bg-white border border-slate-100 rounded-xl shadow-2xl z-[60] overflow-hidden p-1">
                            {['Retail Grocery', 'Specialty Retail', 'Restaurant Chain', 'Hospitality'].map((type) => (
                              <button
                                key={type}
                                type="button"
                                className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-all rounded-lg"
                                onClick={() => {
                                  setNewCustomer({ ...newCustomer, type });
                                  setShowTypeDropdown(false);
                                }}
                              >
                                {type}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Shop Location (City, State)</label>
                      <input type="text" className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm" required onChange={(e) => setNewCustomer({...newCustomer, location: e.target.value})} value={newCustomer.location} />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-3 border border-slate-200 text-slate-600 font-bold text-sm rounded-xl">Cancel</button>
                  <button type="submit" className="flex-1 py-3 bg-green-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-green-200 transition-all active:scale-95">Complete Registration</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showReviewModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
            <div className="bg-white rounded-2xl p-0 w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Review Application</h2>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">ID: {showReviewModal.id}</p>
                </div>
                <button onClick={() => setShowReviewModal(null)} className="text-slate-400 hover:text-slate-600"><XCircle className="w-5 h-5" /></button>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Full Name</label>
                    <p className="text-sm font-semibold text-slate-800">{showReviewModal.name}</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Phone Number</label>
                    <p className="text-sm font-semibold text-slate-800">{showReviewModal.phone}</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Shop / Entity Name</label>
                    <p className="text-sm font-semibold text-bottle-green">{showReviewModal.shopName}</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Business Name</label>
                    <p className="text-sm font-semibold text-slate-800">{showReviewModal.businessName || '—'}</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Business Category</label>
                    <p className="text-sm font-semibold text-slate-800">{showReviewModal.type}</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Location</label>
                    <p className="text-sm font-semibold text-slate-800">{showReviewModal.location}</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Email Address</label>
                    <p className="text-sm font-semibold text-slate-800">{showReviewModal.email || '—'}</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Referral Code</label>
                    <p className="text-sm font-semibold text-blue-600">{showReviewModal.referralCode || 'NONE'}</p>
                  </div>
                </div>

                <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                  <p className="text-[11px] text-blue-800 leading-tight">
                    <strong>Note:</strong> Approving this user will grant them immediate access to the B2B marketplace and full platform features.
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  <button 
                    onClick={() => handleReject(showReviewModal.id)} 
                    className="flex-1 py-3 bg-white border border-red-200 text-red-600 font-bold rounded-xl hover:bg-red-50 transition-all active:scale-95"
                  >
                    Reject Registration
                  </button>
                  <button 
                    onClick={() => handleApprove(showReviewModal.id)} 
                    className="flex-1 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 shadow-lg shadow-green-200 transition-all active:scale-95"
                  >
                    Approve & Activate
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-[12px] font-bold text-slate-500 uppercase tracking-wider">Customer Name</th>
                <th className="px-6 py-3 text-[12px] font-bold text-slate-500 uppercase tracking-wider">Business Type</th>
                <th className="px-6 py-3 text-[12px] font-bold text-slate-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-[12px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-[12px] font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`h-9 w-9 rounded flex items-center justify-center font-bold text-sm mr-3 ${
                        customer.status === 'pending' ? 'bg-amber-100 text-amber-700' : 
                        customer.status === 'blocked' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {customer.initials}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 text-sm">{customer.name}</div>
                        <div className="text-xs text-slate-500">ID: {customer.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{customer.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{customer.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={customer.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    {customer.status === 'pending' ? (
                      <button 
                        onClick={() => setShowReviewModal(customer)}
                        className="px-4 py-1.5 bg-bottle-green text-white rounded-lg text-[11px] font-bold hover:bg-opacity-90 transition-all shadow-sm shadow-green-100"
                      >
                        REVIEW & APPROVE
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleToggleStatus(customer.id)}
                        className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-md transition-all ${
                          customer.status === 'blocked' 
                            ? 'text-green-600 bg-green-50 hover:bg-green-100' 
                            : 'text-red-600 bg-red-50 hover:bg-red-100'
                        }`}
                      >
                        {customer.status === 'blocked' ? 'Activate Account' : 'Deactivate'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500">Showing {filteredCustomers.length} of 1,284 customers</span>
          <div className="flex space-x-1">
            <button className="p-1 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50" disabled>
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="p-1 px-2.5 text-xs font-bold bg-green-600 text-white rounded">1</button>
            <button className="p-1 px-2.5 text-xs font-medium text-slate-600 hover:bg-slate-50 rounded">2</button>
            <button className="p-1 px-2.5 text-xs font-medium text-slate-600 hover:bg-slate-50 rounded">3</button>
            <button className="p-1 border border-slate-200 rounded hover:bg-slate-50">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* History Log */}
      <section className="pb-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
            <History className="mr-2 text-green-600 w-5 h-5" />
            Recent Approval History
          </h3>
          <div className="space-y-4">
            {history.map((item) => (
              <div key={item.id} className="flex items-start pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center mr-3 mt-1 ${
                  item.type === 'approved' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                }`}>
                  {item.type === 'approved' ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                  <p className="text-xs text-slate-500">{item.action}</p>
                  <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold">{item.time}</p>
                </div>
              </div>
            ))}
            <button className="w-full py-2 text-xs font-bold text-slate-500 hover:text-green-600 uppercase tracking-widest transition-colors">
              View All Logs
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

const KPICard = ({ title, value, trend, subtext, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 flex flex-col shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <span className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">{title}</span>
      <Icon className={color + " w-5 h-5"} />
    </div>
    <div className="flex items-end justify-between">
      <span className="text-3xl font-bold text-slate-900">{value}</span>
      {trend && (
        <span className="flex items-center text-xs font-bold text-green-600 mb-1">
          <TrendingUp className="w-4 h-4 mr-1" />
          {trend}
        </span>
      )}
      {subtext && <span className={`text-xs font-bold mb-1 ${color}`}>{subtext}</span>}
    </div>
  </div>
);

const StatusBadge = ({ status }) => {
  const styles = {
    active: 'bg-green-100 text-green-700',
    approved: 'bg-blue-100 text-blue-700',
    pending: 'bg-amber-100 text-amber-700',
    blocked: 'bg-red-100 text-red-700',
  };
  const labels = {
    active: 'ACTIVE',
    approved: 'APPROVED',
    pending: 'UNDER PROCESS',
    blocked: 'INACTIVE',
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${styles[status]}`}>
      {labels[status]}
    </span>
  );
};

export default Customers;
