import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Truck, 
  UserPlus, 
  User,
  Search, 
  MapPin, 
  CheckCircle2, 
  MoreVertical,
  Filter,
  Package,
  Clock,
  AlertTriangle,
  Map as MapIcon,
  ShieldCheck,
  Zap,
  ArrowRight,
  TrendingUp,
  ChevronDown,
  Activity,
  Locate,
  X,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  Printer,
  Check,
  Edit,
  CreditCard
} from 'lucide-react';

const Delivery = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [groupByZone, setGroupByZone] = useState(false);
  const [pipelineFilter, setPipelineFilter] = useState('ALL');
  const [notification, setNotification] = useState(null);
  const [showAddDriverModal, setShowAddDriverModal] = useState(false);
  const [activeOrderDetails, setActiveOrderDetails] = useState(null);
  const [activeOrderItems, setActiveOrderItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editedAddress, setEditedAddress] = useState('');
  const [selectedDriverDetails, setSelectedDriverDetails] = useState(null);
  const [newDriver, setNewDriver] = useState({
    name: '',
    contact: '',
    email: '',
    aadhaar: '',
    vehicleRc: '',
    drivingLicence: '',
    vehicleType: 'Two Wheeler',
    password: '',
    imageUrl: ''
  });

  const API_URL = 'http://localhost:5055/api/drivers';
  const ORDERS_API = 'http://localhost:5055/api/orders';

  useEffect(() => {
    fetchDrivers();
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(ORDERS_API);
      if (response.ok) {
        const data = await response.json();
        setOrders(data.map(o => {
          const dateObj = new Date(o.created_at || Date.now());
          return {
            id: o.order_id,
            partner: o.customer_name,
            location: o.delivery_location,
            amount: parseFloat(o.total_amount),
            points: o.loyalty_points,
            status: o.status,
            driver: o.driver_id,
            driverName: o.driver_name,
            slot: o.delivery_slot,
            zone: o.zone,
            date: dateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
            time: dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
            items: o.items_count || Math.floor(Math.random() * 5) + 1,
            customerPhone: o.customer_phone,
            customerEmail: o.customer_email,
            customerShopName: o.customer_shop_name,
            partnerType: o.partner_type,
            partnerPoints: o.partner_points
          };
        }));
      }
    } catch (err) {
      console.error(err);
      showNotification('Failed to fetch orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchDrivers = async () => {
    try {
      const response = await fetch(API_URL);
      if (response.ok) {
        const data = await response.json();
        setDrivers(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleDriverStatus = async (driverId, currentStatus) => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    const token = localStorage.getItem('admin_token');
    try {
      const response = await fetch(`${API_URL}/${driverId}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        showNotification(`Driver status updated to ${newStatus}`);
        fetchDrivers();
      } else {
        const data = await response.json();
        showNotification(data.message || 'Failed to update driver status', 'error');
      }
    } catch (err) {
      console.error(err);
      showNotification('Server error', 'error');
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSelectOrder = (id) => {
    setSelectedOrders(prev => 
      prev.includes(id) ? prev.filter(oid => oid !== id) : [...prev, id]
    );
  };

  const handleUpdateItems = (id, count) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, items: count } : o));
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const readyOrders = filteredOrders.filter(o => o.status === 'Ready for Dispatch' || o.status === 'Assigned').map(o => o.id);
      setSelectedOrders(readyOrders);
    } else {
      setSelectedOrders([]);
    }
  };

  const assignDriverToSelection = async (driverId) => {
    try {
      const response = await fetch(`${ORDERS_API}/bulk-assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderIds: selectedOrders, driverId })
      });
      if (response.ok) {
        showNotification(`Driver assigned to ${selectedOrders.length} orders`);
        setSelectedOrders([]); // Clear selection after assignment
        fetchOrders();
        setOpenDropdownId(null);
      }
    } catch (err) {
      console.error(err);
      showNotification('Assignment failed', 'error');
    }
  };

  const finalizeDispatch = async () => {
    const unassignedCount = selectedOrders.filter(id => !orders.find(o => o.id === id)?.driver).length;
    if (unassignedCount > 0) {
      showNotification(`Assign a driver to all ${unassignedCount} selected orders first`, 'error');
      return;
    }

    try {
      const response = await fetch(`${ORDERS_API}/bulk-dispatch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderIds: selectedOrders })
      });
      if (response.ok) {
        showNotification(`Dispatched ${selectedOrders.length} orders successfully!`);
        fetchOrders();
        setSelectedOrders([]);
      }
    } catch (err) {
      console.error(err);
      showNotification('Dispatch failed', 'error');
    }
  };

  const handleAddDriver = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('admin_token');
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newDriver)
      });
      if (response.ok) {
        showNotification('New driver registered successfully!');
        fetchDrivers();
        setShowAddDriverModal(false);
        setNewDriver({
          name: '',
          contact: '',
          email: '',
          aadhaar: '',
          vehicleRc: '',
          drivingLicence: '',
          vehicleType: 'Two Wheeler',
          password: '',
          imageUrl: ''
        });
      } else {
        const data = await response.json();
        showNotification(data.message || 'Failed to register driver', 'error');
      }
    } catch (err) {
      console.error(err);
      showNotification('Server error', 'error');
    }
  };

  const assignSingleDriver = async (orderId, driverId) => {
    try {
      const response = await fetch(`${ORDERS_API}/bulk-assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderIds: [orderId], driverId })
      });
      if (response.ok) {
        fetchOrders();
        setOpenDropdownId(null);
        showNotification('Driver assigned successfully');
      }
    } catch (err) {
      console.error(err);
    }
  };


  const handleOpenOrderModal = async (orderId) => {
    const foundOrder = orders.find(o => o.id === orderId);
    if (!foundOrder) return;
    
    setActiveOrderDetails(foundOrder);
    setActiveOrderItems([]);
    setLoadingItems(true);
    setIsEditingAddress(false);
    setEditedAddress(foundOrder.location || '');
    
    try {
      const res = await fetch(`http://localhost:5055/api/orders/items/by-order/${orderId}`);
      if (res.ok) {
        const itemsData = await res.json();
        setActiveOrderItems(itemsData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingItems(false);
    }
  };

  const handleUpdateItemQty = async (itemId, newQty) => {
    if (newQty < 0) return;
    
    // Update local state for active order items
    const updatedItems = activeOrderItems.map(item => 
      item.id === itemId ? { ...item, quantity: newQty } : item
    );
    setActiveOrderItems(updatedItems);
    
    // Calculate new total amount locally to update activeOrderDetails
    const newTotal = updatedItems.reduce((sum, item) => sum + (parseFloat(item.quantity) * parseFloat(item.price_at_order)), 0);
    setActiveOrderDetails(prev => ({ ...prev, amount: newTotal }));
    
    try {
      const response = await fetch(`http://localhost:5055/api/orders/items/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQty })
      });
      if (response.ok) {
        // Refresh main order list
        fetchOrders();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      try {
        const response = await fetch(`http://localhost:5055/api/orders/${orderId}/status`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'Rejected' })
        });
        if (response.ok) {
          showNotification('Order cancelled successfully');
          setActiveOrderDetails(null);
          fetchOrders();
        } else {
          showNotification('Failed to cancel order', 'error');
        }
      } catch (err) {
        console.error(err);
        showNotification('Failed to cancel order', 'error');
      }
    }
  };

  const handleSaveAddress = async () => {
    try {
      const response = await fetch(`http://localhost:5055/api/orders/${activeOrderDetails.id}/location`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location: editedAddress })
      });
      if (response.ok) {
        showNotification('Delivery address updated successfully');
        setActiveOrderDetails(prev => ({ ...prev, location: editedAddress }));
        setIsEditingAddress(false);
        fetchOrders();
      } else {
        showNotification('Failed to update address', 'error');
      }
    } catch (err) {
      console.error(err);
      showNotification('Server error updating address', 'error');
    }
  };

  const handlePrintInvoice = () => {
    if (!activeOrderDetails) return;
    const subtotal = activeOrderItems.reduce((sum, item) => sum + (parseFloat(item.quantity) * parseFloat(item.price_at_order)), 0);
    const tax = subtotal * 0.05;
    const deliveryFee = subtotal > 0 ? 50 : 0;
    const grandTotal = subtotal + tax + deliveryFee;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice - ${activeOrderDetails.id}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; padding: 40px; color: #1e293b; max-width: 800px; margin: 0 auto; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 30px; }
            h2 { margin: 0 0 5px 0; color: #0a4a34; font-size: 28px; font-weight: 800; text-transform: uppercase; }
            .badge { display: inline-block; padding: 4px 10px; background: #fef3c7; color: #d97706; border-radius: 9999px; font-size: 10px; font-weight: 800; text-transform: uppercase; }
            .meta { font-size: 13px; color: #64748b; line-height: 1.6; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 40px; }
            .section-title { font-size: 11px; font-weight: 900; text-transform: uppercase; color: #94a3b8; letter-spacing: 0.1em; margin-bottom: 10px; }
            .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { padding: 12px; text-align: left; border-bottom: 2px solid #e2e8f0; font-size: 11px; font-weight: 900; text-transform: uppercase; color: #94a3b8; }
            td { padding: 14px 12px; text-align: left; border-bottom: 1px solid #f1f5f9; font-size: 13px; color: #334155; }
            .price { font-weight: 700; text-align: right; }
            .price-header { text-align: right; }
            .totals-container { display: flex; justify-content: flex-end; margin-top: 30px; }
            .totals-table { width: 300px; }
            .totals-table td { padding: 8px 12px; border: none; }
            .grand-total { font-size: 18px; font-weight: 900; color: #10b981; border-top: 2px solid #e2e8f0; padding-top: 12px !important; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h2>Fresh Guru</h2>
              <div class="meta">
                <strong>Order ID:</strong> ${activeOrderDetails.id}<br/>
                <strong>Date:</strong> ${activeOrderDetails.date} ${activeOrderDetails.time}
              </div>
            </div>
            <div style="text-align: right;">
              <span class="badge">${activeOrderDetails.status}</span>
            </div>
          </div>
          
          <div class="grid">
            <div class="card">
              <div class="section-title">Delivery Location</div>
              <div class="meta" style="font-weight: 700; color: #334155;">
                ${activeOrderDetails.location}
              </div>
            </div>
            <div class="card">
              <div class="section-title">Customer Details</div>
              <div class="meta">
                <strong>Name:</strong> ${activeOrderDetails.partner}<br/>
                <strong>Email:</strong> ${activeOrderDetails.customerEmail || 'customer@freshguru.in'}<br/>
                <strong>Phone:</strong> ${activeOrderDetails.customerPhone || '+91 98765 43210'}
              </div>
            </div>
          </div>

          <div class="section-title">Ordered Items</div>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th style="text-align: center;">Quantity</th>
                <th class="price-header">Unit Price</th>
                <th class="price-header">Total</th>
              </tr>
            </thead>
            <tbody>
              ${activeOrderItems.map(item => `
                <tr>
                  <td style="font-weight: 700;">${item.product_name}</td>
                  <td style="text-align: center; font-weight: 700;">${parseInt(item.quantity)} x ${item.product_unit || item.unit || 'unit'}</td>
                  <td class="price">₹${parseFloat(item.price_at_order).toFixed(2)}</td>
                  <td class="price">₹${(parseFloat(item.quantity) * parseFloat(item.price_at_order)).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="totals-container">
            <table class="totals-table">
              <tr>
                <td style="color: #64748b;">Subtotal:</td>
                <td class="price">₹${subtotal.toFixed(2)}</td>
              </tr>
              <tr>
                <td style="color: #64748b;">Tax (GST 5%):</td>
                <td class="price">₹${tax.toFixed(2)}</td>
              </tr>
              <tr>
                <td style="color: #64748b;">Delivery Fee:</td>
                <td class="price">₹${deliveryFee.toFixed(2)}</td>
              </tr>
              <tr class="grand-total">
                <td style="font-weight: 900; color: #1e293b;">Grand Total:</td>
                <td class="price" style="font-weight: 900; color: #10b981; font-size: 18px;">₹${grandTotal.toFixed(2)}</td>
              </tr>
            </table>
          </div>

          <script>
            window.onload = function() { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
    showNotification('Invoice preview loaded');
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Ready for Dispatch': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'Assigned': return 'bg-orange-50 text-orange-600 border-orange-100';
      case 'Out for Delivery': return 'bg-purple-50 text-purple-600 border-purple-100';
      case 'Delivered': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Failed': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-slate-50 text-slate-500 border-slate-100';
    }
  };

  const filteredOrders = orders.filter(o => 
    o.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
    o.partner.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const zones = [...new Set(filteredOrders.map(o => o.zone))];

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-40 relative">
      {notification && (
        <div className={`fixed top-12 left-1/2 -translate-x-1/2 z-[500] px-8 py-4 rounded-2xl shadow-2xl animate-in slide-in-from-top-8 duration-300 flex items-center gap-3 font-black uppercase text-[10px] tracking-widest border ${
          notification.type === 'error' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-[#0a4a34] text-white border-white/10'
        }`}>
          {notification.type === 'error' ? <AlertTriangle className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
          {notification.message}
        </div>
      )}

      {/* 📊 High-Density Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 mb-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-[#0a4a34] rounded-lg flex items-center justify-center shadow-lg shadow-green-900/10 shrink-0 mt-1">
            <Truck className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">Logistics Console</h2>
              <span className="px-2.5 py-0.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-md text-[9px] font-black uppercase tracking-widest border border-emerald-100/50 leading-none">v1.2.4 Live</span>
            </div>
            <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1.5">Real-Time Dispatch Management & Fleet Logistics Pipeline</p>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-5 py-3 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100/50 dark:border-emerald-900/30 rounded-2xl text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            Active Drivers: {drivers.filter(d => d.status === 'Active').length}/{drivers.length}
          </div>
          <button 
            onClick={() => setShowAddDriverModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-[#0a4a34] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-800 transition-all shadow-lg shadow-green-950/20 active:scale-95 group shrink-0"
          >
            <UserPlus className="w-4 h-4 group-hover:rotate-12 transition-transform" /> Register Driver
          </button>
        </div>
      </div>

      {/* 🏗️ Control Center Dashboard */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[3rem] shadow-sm overflow-hidden">
        <div className="px-10 py-6 border-b border-slate-50 dark:border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4 flex-wrap">
          <div className="relative group min-w-[300px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search order ID, partner, or location..." 
              className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-2xl text-[13px] font-bold text-slate-900 dark:text-white outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 transition-all"
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Segmented Pipeline Filter */}
            <div className="flex items-center bg-slate-50 dark:bg-slate-800/80 p-1.5 rounded-2xl border border-slate-100 dark:border-slate-700">
              <button 
                onClick={() => setPipelineFilter('ALL')}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  pipelineFilter === 'ALL' 
                    ? 'bg-[#0a4a34] text-white shadow-lg shadow-green-950/20' 
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-405 dark:hover:text-slate-200'
                }`}
              >
                All
              </button>
              <button 
                onClick={() => setPipelineFilter('NEW')}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  pipelineFilter === 'NEW' 
                    ? 'bg-[#0a4a34] text-white shadow-lg shadow-green-950/20' 
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-405 dark:hover:text-slate-200'
                }`}
              >
                New Orders
              </button>
              <button 
                onClick={() => setPipelineFilter('ASSIGNED')}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  pipelineFilter === 'ASSIGNED' 
                    ? 'bg-[#0a4a34] text-white shadow-lg shadow-green-950/20' 
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-405 dark:hover:text-slate-200'
                }`}
              >
                Assigned
              </button>
            </div>

            <button 
              onClick={() => setGroupByZone(!groupByZone)}
              className={`flex items-center gap-2 px-6 py-3 border rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                groupByZone ? 'bg-[#0a4a34] text-white border-white/10 shadow-lg shadow-green-900/20' : 'bg-white border-slate-100 dark:border-slate-800 text-slate-500 hover:bg-slate-50'
              }`}
            >
              <Filter className="w-4 h-4" /> {groupByZone ? 'UNGROUP ZONES' : 'GROUP BY ZONES'}
            </button>
          </div>
        </div>

        {/* 🚀 Split Pane: Kanban Pipeline */}
        <div className="p-8 bg-slate-50/50 dark:bg-slate-900/50 min-h-[600px] flex flex-col lg:flex-row gap-8">
          {/* Kanban Pipeline */}
          <div className="flex-1 flex flex-col gap-10">
            {(pipelineFilter === 'ALL' || pipelineFilter === 'NEW') && (
              <KanbanColumn 
                title="NEW ORDERS" 
                orders={filteredOrders.filter(o => !o.driver && (o.status === 'Ready for Dispatch' || o.status === 'Pending' || o.status === 'Assigned' || o.status === 'Out for Delivery'))} 
                selectedOrders={selectedOrders}
                onSelect={handleSelectOrder}
                drivers={drivers}
                openDropdownId={openDropdownId}
                setOpenDropdownId={setOpenDropdownId}
                onAssign={assignSingleDriver}
                onDetail={(id) => handleOpenOrderModal(id)}
                onUpdateItems={handleUpdateItems}
              />
            )}

            {(pipelineFilter === 'ALL' || pipelineFilter === 'ASSIGNED') && (
              <KanbanColumn 
                title="ASSIGNED" 
                orders={filteredOrders.filter(o => o.driver && (o.status === 'Ready for Dispatch' || o.status === 'Pending' || o.status === 'Assigned' || o.status === 'Out for Delivery'))} 
                selectedOrders={selectedOrders}
                onSelect={handleSelectOrder}
                drivers={drivers}
                openDropdownId={openDropdownId}
                setOpenDropdownId={setOpenDropdownId}
                onAssign={assignSingleDriver}
                onDetail={(id) => handleOpenOrderModal(id)}
                onUpdateItems={handleUpdateItems}
              />
            )}
          </div>

          {/* Drivers Sidebar Panel */}
          <div className="w-full lg:w-80 shrink-0 flex flex-col gap-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-6 shadow-sm flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-slate-50 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="text-sm font-black text-slate-700 dark:text-slate-350 uppercase tracking-tight">Delivery Partner</h3>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Driver Status</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-black bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 px-2 py-1 rounded-lg border border-emerald-100/50">
                    Active: {drivers.filter(d => d.status === 'Active').length}/{drivers.length}
                  </span>
                  <button 
                    onClick={() => setShowAddDriverModal(true)} 
                    className="p-1.5 bg-slate-50 hover:bg-slate-150 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-300 rounded-lg border border-slate-100 dark:border-slate-700 transition-all flex items-center justify-center shadow-sm"
                    title="Register Driver"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-4 max-h-[500px] overflow-y-auto pr-1">
                {(() => {
                  const getDriverDisplayStatus = (driver) => {
                    const hasOutForDelivery = orders.some(o => o.driver == driver.id && o.status === 'Out for Delivery');
                    if (hasOutForDelivery) return 'Delivering';
                    return driver.status === 'Active' ? 'Ready' : 'Offline';
                  };

                  const readyDrivers = drivers.filter(d => getDriverDisplayStatus(d) === 'Ready');
                  const deliveringDrivers = drivers.filter(d => getDriverDisplayStatus(d) === 'Delivering');
                  const offlineDrivers = drivers.filter(d => getDriverDisplayStatus(d) === 'Offline');

                  const renderDriverCard = (d, displayStatus) => {
                    let cardBg = "bg-slate-50/40 dark:bg-slate-900/10 border-slate-200/30 dark:border-slate-800/50 opacity-75";
                    let dotColor = "bg-slate-400";
                    let badgeBg = "bg-slate-50 dark:bg-slate-850 text-slate-500 border border-slate-200/50 dark:border-slate-800/50";
                    
                    if (displayStatus === 'Delivering') {
                      cardBg = "bg-purple-50/50 dark:bg-purple-950/15 border-purple-200/50 dark:border-purple-900/40 hover:bg-purple-55/60 dark:hover:bg-purple-950/25 shadow-sm";
                      dotColor = "bg-purple-500 animate-pulse";
                      badgeBg = "bg-purple-50 dark:bg-purple-950/30 text-purple-650 dark:text-purple-400 border border-purple-100/50";
                    } else if (displayStatus === 'Ready') {
                      cardBg = "bg-emerald-50/50 dark:bg-emerald-950/10 border-emerald-250/50 dark:border-emerald-900/30 hover:bg-emerald-55/60 dark:hover:bg-emerald-950/20 shadow-sm";
                      dotColor = "bg-emerald-500";
                      badgeBg = "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-100/50";
                    } else if (displayStatus === 'Offline') {
                      cardBg = "bg-rose-50/10 dark:bg-rose-950/5 border-rose-100/40 dark:border-rose-900/20 hover:bg-rose-50/25 dark:hover:bg-rose-950/10 opacity-70";
                      dotColor = "bg-rose-450";
                      badgeBg = "bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 border border-rose-100/40";
                    }
                    
                    return (
                      <div 
                        key={d.id} 
                        onClick={() => setSelectedDriverDetails(d)}
                        className={`flex items-center gap-3.5 p-3.5 border rounded-2xl cursor-pointer transition-all hover:scale-[1.01] active:scale-98 ${cardBg}`}
                      >
                        {d.image_url ? (
                          <img src={d.image_url} alt={d.name} className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-slate-850 shadow-sm shrink-0" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-955/20 border border-emerald-105/30 flex items-center justify-center font-black text-xs text-emerald-650 dark:text-emerald-400 uppercase shrink-0">
                            {d.name.split(' ').map(n => n[0]).join('')}
                          </div>
                        )}
                        <div>
                          <span className="block text-[12px] font-black text-slate-855 dark:text-white uppercase tracking-wide">
                            {d.name}
                          </span>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}`} />
                            <span className={`text-[8.5px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded ${badgeBg}`}>
                              {displayStatus === 'Delivering' ? 'Out for Delivery' : displayStatus}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  };

                  return (
                    <div className="space-y-5">
                      {/* Ready/Active Section */}
                      {readyDrivers.length > 0 && (
                        <div className="space-y-2">
                          <h5 className="text-[9px] font-black text-emerald-600/80 uppercase tracking-widest pl-1">
                            Active Drivers ({readyDrivers.length})
                          </h5>
                          <div className="flex flex-col gap-2">
                            {readyDrivers.map(d => renderDriverCard(d, 'Ready'))}
                          </div>
                        </div>
                      )}

                      {/* Delivering Section */}
                      {deliveringDrivers.length > 0 && (
                        <div className="space-y-2">
                          <h5 className="text-[9px] font-black text-purple-650/80 uppercase tracking-widest pl-1">
                            Out For Delivery ({deliveringDrivers.length})
                          </h5>
                          <div className="flex flex-col gap-2">
                            {deliveringDrivers.map(d => renderDriverCard(d, 'Delivering'))}
                          </div>
                        </div>
                      )}

                      {/* Offline/Inactive Section */}
                      {offlineDrivers.length > 0 && (
                        <div className="space-y-2">
                          <h5 className="text-[9px] font-black text-rose-500/80 uppercase tracking-widest pl-1">
                            Inactive / Offline ({offlineDrivers.length})
                          </h5>
                          <div className="flex flex-col gap-2">
                            {offlineDrivers.map(d => renderDriverCard(d, 'Offline'))}
                          </div>
                        </div>
                      )}

                      {drivers.length === 0 && (
                        <div className="text-center py-10 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                          No partners registered
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ⚡ Smart Bulk Action Bar */}
      {selectedOrders.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] w-full max-w-4xl px-4 animate-in slide-in-from-bottom-8 duration-500">
          <div className="bg-slate-900/95 dark:bg-slate-950/95 border border-slate-800/80 p-3.5 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] backdrop-blur-xl flex items-center justify-between gap-6 px-8">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="relative shrink-0">
                  <div className="absolute -inset-1 bg-emerald-500 rounded-xl blur opacity-30 animate-pulse"></div>
                  <div className="relative w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center font-black text-lg text-emerald-400">
                    {selectedOrders.length}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-black text-white tracking-tight uppercase leading-none">Orders Selected</h4>
                  <p className="text-[8px] font-bold text-emerald-400/80 uppercase tracking-widest mt-1">Ready for dispatch</p>
                </div>
              </div>
              
              <div className="h-8 w-px bg-slate-800" />
              
              <div className="relative">
                 <button 
                   onClick={() => setOpenDropdownId(openDropdownId === 'bulk-driver' ? null : 'bulk-driver')}
                   className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700/80 border border-slate-700/60 rounded-xl text-[9px] font-black text-slate-200 uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 group"
                 >
                   <User className="w-3.5 h-3.5 text-slate-400" />
                   Assign Driver
                   <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${openDropdownId === 'bulk-driver' ? 'rotate-180' : ''}`} />
                 </button>
                 {openDropdownId === 'bulk-driver' && (
                    <div className="absolute bottom-full left-0 mb-3 w-64 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-2xl py-4 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
                      <p className="px-5 pb-2 text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50 dark:border-slate-800 mb-2">Available Fleet</p>
                      <div className="max-h-48 overflow-y-auto custom-scrollbar">
                        {drivers.map(d => (
                          <button 
                            key={d.id} 
                            onClick={() => assignDriverToSelection(d.id)}
                            className="w-full px-5 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800 text-[11px] font-black text-slate-700 dark:text-slate-200 uppercase tracking-tight transition-colors flex items-center justify-between border-b last:border-0 border-slate-50 dark:border-slate-850"
                          >
                            <div className="flex items-center gap-2">
                              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${d.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-350'}`} />
                              <span className="uppercase tracking-widest">{d.name}</span>
                            </div>
                            <span className={`text-[7px] font-black uppercase tracking-widest px-1 py-0.5 rounded border ${
                              d.status === 'Active' 
                                ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30' 
                                : 'bg-slate-50 dark:bg-slate-900 text-slate-400 border-slate-200 dark:border-slate-800'
                            }`}>
                              {d.status}
                            </span>
                          </button>
                        ))}
                        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 mt-1">
                          <button 
                            onClick={() => {
                              setOpenDropdownId(null);
                              setShowAddDriverModal(true);
                            }}
                            className="w-full py-2.5 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg text-[9px] font-black text-slate-400 uppercase tracking-widest hover:border-emerald-500 hover:text-emerald-500 transition-all flex items-center justify-center gap-1.5"
                          >
                            <Plus className="w-3.5 h-3.5" /> Add New Member
                          </button>
                        </div>
                      </div>
                    </div>
                 )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSelectedOrders([])}
                className="text-[9px] font-black text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all px-4 py-2.5 uppercase tracking-widest"
              >
                Cancel Selection
              </button>
              <button 
                onClick={finalizeDispatch}
                className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl font-black text-[9px] uppercase tracking-widest shadow-lg shadow-emerald-500/20 transition-all active:scale-95 group"
              >
                Finalize Dispatch 
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>
        </div>
      )}
      {/* 👤 Add Driver Modal */}
      {showAddDriverModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100 dark:border-slate-800">
            <div className="px-10 py-8 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-slate-50/30 dark:bg-slate-800/20">
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">Fleet Registration</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">Onboard a new delivery partner</p>
              </div>
              <button onClick={() => setShowAddDriverModal(false)} className="p-3 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleAddDriver} className="max-h-[75vh] overflow-y-auto custom-scrollbar p-10 space-y-8">
              {/* Section 1: Personal Details */}
              <div className="space-y-4">
                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest border-b border-slate-50 dark:border-slate-800 pb-2">1. Personal Information</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2 md:col-span-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Full Name</label>
                    <input 
                      className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-[13px] font-bold outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all"
                      placeholder="Rahul Sharma"
                      value={newDriver.name}
                      onChange={(e) => setNewDriver({...newDriver, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Mobile Number</label>
                    <input 
                      className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-[13px] font-bold outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all"
                      placeholder="+91 98765 43210"
                      value={newDriver.contact}
                      onChange={(e) => setNewDriver({...newDriver, contact: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Email Address</label>
                    <input 
                      type="email"
                      className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-[13px] font-bold outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all"
                      placeholder="rahul@freshguru.in"
                      value={newDriver.email}
                      onChange={(e) => setNewDriver({...newDriver, email: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Profile Photo</label>
                  <input 
                    type="file"
                    accept="image/*"
                    className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-[13px] font-bold outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:uppercase file:tracking-widest file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setNewDriver({...newDriver, imageUrl: reader.result});
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </div>
              </div>

              {/* Section 2: Documents & Fleet Details */}
              <div className="space-y-4">
                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest border-b border-slate-50 dark:border-slate-800 pb-2">2. Documents & Fleet Details</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Vehicle Type</label>
                    <select 
                      className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-[13px] font-bold outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all appearance-none"
                      value={newDriver.vehicleType}
                      onChange={(e) => setNewDriver({...newDriver, vehicleType: e.target.value})}
                      required
                    >
                      <option value="Two Wheeler">Two Wheeler</option>
                      <option value="Three Wheeler">Three Wheeler</option>
                      <option value="Four Wheeler (Mini Truck)">Four Wheeler (Mini Truck)</option>
                      <option value="Truck">Truck</option>
                      <option value="Reefer Van">Reefer Van</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Vehicle RC</label>
                    <label className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-4 cursor-pointer transition-all ${
                      newDriver.vehicleRc ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/10' : 'border-slate-200 hover:border-emerald-500'
                    }`}>
                      <span className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400">
                        {newDriver.vehicleRc ? '✓ Vehicle RC Uploaded' : 'Upload Vehicle RC'}
                      </span>
                      <input 
                        type="file" 
                        accept="image/*,.pdf" 
                        className="hidden" 
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setNewDriver({...newDriver, vehicleRc: reader.result});
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Aadhaar Card</label>
                    <label className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-4 cursor-pointer transition-all ${
                      newDriver.aadhaar ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/10' : 'border-slate-200 hover:border-emerald-500'
                    }`}>
                      <span className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400">
                        {newDriver.aadhaar ? '✓ Aadhaar Uploaded' : 'Upload Aadhaar Card'}
                      </span>
                      <input 
                        type="file" 
                        accept="image/*,.pdf" 
                        className="hidden" 
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setNewDriver({...newDriver, aadhaar: reader.result});
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Driving Licence</label>
                    <label className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-4 cursor-pointer transition-all ${
                      newDriver.drivingLicence ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/10' : 'border-slate-200 hover:border-emerald-500'
                    }`}>
                      <span className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400">
                        {newDriver.drivingLicence ? '✓ Licence Uploaded' : 'Upload Driving Licence'}
                      </span>
                      <input 
                        type="file" 
                        accept="image/*,.pdf" 
                        className="hidden" 
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setNewDriver({...newDriver, drivingLicence: reader.result});
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Section 3: Driver App Credentials */}
              <div className="space-y-4">
                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest border-b border-slate-50 dark:border-slate-800 pb-2">3. Driver App Credentials</p>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Password</label>
                  <input 
                    type="password"
                    className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-[13px] font-bold outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all"
                    placeholder="Set Login Password for Driver"
                    value={newDriver.password}
                    onChange={(e) => setNewDriver({...newDriver, password: e.target.value})}
                    required
                  />
                  <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wider block ml-1 mt-1">
                    Drivers will use either their Mobile Number or Email along with this password to log in.
                  </p>
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full py-5 text-[11px] font-black text-white bg-emerald-600 hover:bg-emerald-700 rounded-2xl shadow-xl shadow-emerald-900/10 uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-3 mt-4"
              >
                <UserPlus className="w-5 h-5" />
                Finalize Registration
              </button>
            </form>
          </div>
        </div>
      )}

      {activeOrderDetails && (() => {
        const subtotal = activeOrderItems.reduce((sum, item) => sum + (parseFloat(item.quantity) * parseFloat(item.price_at_order)), 0);
        const tax = subtotal * 0.05;
        const deliveryFee = subtotal > 0 ? 5.50 : 0;
        const grandTotal = subtotal + tax + deliveryFee;
        const initials = activeOrderDetails.partner ? activeOrderDetails.partner.split(' ').map(n => n[0]).join('') : 'EK';
        const isUnassigned = !activeOrderDetails.driver;

        return (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
            <div className="bg-slate-55 dark:bg-slate-955 w-full max-w-6xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]">
              {/* Header */}
              <div className="px-10 py-6 border-b border-slate-200/60 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white dark:bg-slate-900 shrink-0 gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">
                      Order #{activeOrderDetails.id}
                    </h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                      activeOrderDetails.status === 'Ready for Dispatch' || activeOrderDetails.status === 'Pending'
                        ? 'bg-amber-55 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/30'
                        : activeOrderDetails.status === 'Assigned'
                          ? 'bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900/30'
                          : activeOrderDetails.status === 'Out for Delivery'
                            ? 'bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-900/30'
                            : activeOrderDetails.status === 'Delivered'
                              ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30'
                              : 'bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border-red-100 dark:border-red-900/30'
                    }`}>
                      {activeOrderDetails.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400 mt-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-bold uppercase tracking-wider">{activeOrderDetails.date} at {activeOrderDetails.time}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button 
                    onClick={handlePrintInvoice}
                    className="flex items-center gap-1.5 px-4 py-2.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 rounded-xl text-[10px] font-black text-slate-700 dark:text-slate-350 uppercase tracking-widest transition-all"
                  >
                    <Printer className="w-3.5 h-3.5" /> Print Invoice
                  </button>
                  <button 
                    onClick={() => {
                      if (window.confirm('Are you sure you want to cancel this order?')) {
                        handleCancelOrder(activeOrderDetails.id);
                      }
                    }}
                    className="flex items-center gap-1.5 px-4 py-2.5 border border-red-200 hover:bg-red-500/10 rounded-xl text-[10px] font-black text-red-650 dark:text-red-455 uppercase tracking-widest transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Cancel Order
                  </button>
                  {isUnassigned && (
                    <button 
                      onClick={() => {
                        const panel = document.getElementById('driver-assignment-panel');
                        if (panel) panel.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="flex items-center gap-1.5 px-4 py-2.5 bg-[#0a4a34] hover:bg-emerald-800 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                    >
                      <UserPlus className="w-3.5 h-3.5" /> Assign Agent
                    </button>
                  )}
                  <button 
                    onClick={() => setActiveOrderDetails(null)}
                    className="p-2.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Scrollable Grid Layout */}
              <div className="flex-1 overflow-y-auto p-10 grid grid-cols-1 lg:grid-cols-3 gap-8 custom-scrollbar bg-slate-50 dark:bg-slate-900/50">
                
                {/* Left Columns (Order Items and Timeline) */}
                <div className="lg:col-span-2 space-y-8">
                  
                  {/* Order Items */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-[2rem] p-6 shadow-sm">
                    <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                      Order Items
                    </h4>

                    {loadingItems ? (
                      <div className="py-20 text-center flex flex-col items-center justify-center gap-2">
                        <div className="w-8 h-8 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Querying Consignment Items...</span>
                      </div>
                    ) : activeOrderItems.length === 0 ? (
                      <div className="py-12 text-center text-slate-400 text-[10px] font-black uppercase tracking-widest opacity-60">
                        No items in this order
                      </div>
                    ) : (
                      <div className="overflow-x-auto text-slate-700 dark:text-slate-300">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="border-b border-slate-100 dark:border-slate-800/60 text-left">
                              <th className="pb-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Product</th>
                              <th className="pb-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Quantity</th>
                              <th className="pb-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Unit Price</th>
                              <th className="pb-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Total</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50 dark:divide-slate-850">
                            {activeOrderItems.map(item => {
                              const itemTotal = parseFloat(item.quantity) * parseFloat(item.price_at_order);
                              return (
                                <tr key={item.id} className="group">
                                  <td className="py-4">
                                    <div className="flex items-center gap-3">
                                      {item.image_url ? (
                                        <img 
                                          src={item.image_url} 
                                          alt={item.product_name} 
                                          className="w-10 h-10 rounded-lg object-cover border border-slate-100 dark:border-slate-800 shadow-sm" 
                                        />
                                      ) : (
                                        <div className="w-10 h-10 rounded-lg bg-emerald-55 dark:bg-emerald-955/20 border border-emerald-100/30 flex items-center justify-center text-emerald-600">
                                          <Package className="w-5 h-5" />
                                        </div>
                                      )}
                                      <div>
                                        <span className="block text-[12px] font-black text-slate-800 dark:text-white uppercase tracking-wide">
                                          {item.product_name}
                                        </span>
                                        <span className="block text-[9px] font-bold text-slate-400 uppercase mt-0.5">
                                          {item.description || item.product_unit || item.unit || 'Standard Pack'}
                                        </span>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="py-4 text-center">
                                    <div className="inline-flex items-center gap-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/80 p-1.5 rounded-xl shadow-sm">
                                      <button 
                                        onClick={() => handleUpdateItemQty(item.id, Math.max(1, parseInt(item.quantity) - 1))}
                                        className="w-5 h-5 rounded-lg bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-850 text-slate-600 dark:text-slate-400 hover:text-emerald-500 flex items-center justify-center transition-all border border-slate-200/50 dark:border-slate-800/50"
                                      >
                                        <Minus className="w-3 h-3" />
                                      </button>
                                      <span className="text-[11px] font-black min-w-[20px] text-slate-800 dark:text-white">
                                        {parseInt(item.quantity)}
                                      </span>
                                      <button 
                                        onClick={() => handleUpdateItemQty(item.id, parseInt(item.quantity) + 1)}
                                        className="w-5 h-5 rounded-lg bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-850 text-slate-600 dark:text-slate-400 hover:text-emerald-500 flex items-center justify-center transition-all border border-slate-200/50 dark:border-slate-800/50"
                                      >
                                        <Plus className="w-3 h-3" />
                                      </button>
                                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest ml-0.5">
                                        x {item.product_unit || item.unit || 'kg'}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="py-4 text-right text-[12px] font-bold text-slate-500 dark:text-slate-400">
                                    ₹{parseFloat(item.price_at_order).toFixed(2)}
                                  </td>
                                  <td className="py-4 text-right text-[13px] font-black text-slate-800 dark:text-white">
                                    ₹{itemTotal.toFixed(2)}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  {/* Order Timeline */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-[2rem] p-6 shadow-sm">
                    <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">
                      Order Timeline
                    </h4>

                    <div className="relative border-l-2 border-slate-100 dark:border-slate-800 ml-4 pl-8 space-y-6">
                      {/* Event 1: Placed */}
                      <div className="relative">
                        <span className="absolute -left-[41px] top-0 w-6 h-6 rounded-full bg-emerald-500/10 border-2 border-emerald-500 flex items-center justify-center text-emerald-500 shadow-lg shadow-emerald-500/15">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </span>
                        <div>
                          <span className="block text-[11px] font-black text-slate-800 dark:text-white uppercase tracking-wider">Order Placed</span>
                          <p className="text-[10px] text-slate-400 mt-0.5 font-bold uppercase tracking-wide">
                            Customer placed an order for {activeOrderItems.length} item(s) from the app.
                          </p>
                          <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">
                            {activeOrderDetails.date} • {activeOrderDetails.time}
                          </span>
                        </div>
                      </div>

                      {/* Event 2: Confirmed */}
                      <div className="relative">
                        <span className="absolute -left-[41px] top-0 w-6 h-6 rounded-full bg-emerald-500/10 border-2 border-emerald-500 flex items-center justify-center text-emerald-500 shadow-lg shadow-emerald-500/15">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </span>
                        <div>
                          <span className="block text-[11px] font-black text-slate-800 dark:text-white uppercase tracking-wider">Payment Confirmed</span>
                          <p className="text-[10px] text-slate-400 mt-0.5 font-bold uppercase tracking-wide">
                            Payment of ₹{grandTotal.toFixed(2)} verified successfully.
                          </p>
                          <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">
                            {activeOrderDetails.date} • {activeOrderDetails.time}
                          </span>
                        </div>
                      </div>

                      {/* Event 3: Packing */}
                      <div className="relative">
                        {activeOrderDetails.status === 'Ready for Dispatch' || activeOrderDetails.status === 'Pending' ? (
                          <span className="absolute -left-[41px] top-0 w-6 h-6 rounded-full bg-amber-500/10 border-2 border-amber-500 flex items-center justify-center text-amber-500 shadow-lg shadow-amber-500/15">
                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                          </span>
                        ) : (
                          <span className="absolute -left-[41px] top-0 w-6 h-6 rounded-full bg-emerald-500/10 border-2 border-emerald-500 flex items-center justify-center text-emerald-500 shadow-lg shadow-emerald-500/15">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </span>
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="block text-[11px] font-black text-slate-800 dark:text-white uppercase tracking-wider">Ready for Packing</span>
                            {(activeOrderDetails.status === 'Ready for Dispatch' || activeOrderDetails.status === 'Pending') && (
                              <span className="px-1.5 py-0.5 bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 rounded-md text-[7px] font-black uppercase tracking-widest border border-amber-100/50">
                                IN PROGRESS
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400 mt-0.5 font-bold uppercase tracking-wide">
                            Items are being picked from the warehouse and sanitized.
                          </p>
                        </div>
                      </div>

                      {/* Event 4: Assignment */}
                      <div className="relative">
                        {activeOrderDetails.status === 'Ready for Dispatch' || activeOrderDetails.status === 'Pending' ? (
                          <span className="absolute -left-[41px] top-0 w-6 h-6 rounded-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-350" />
                        ) : activeOrderDetails.status === 'Assigned' ? (
                          <span className="absolute -left-[41px] top-0 w-6 h-6 rounded-full bg-amber-500/10 border-2 border-amber-500 flex items-center justify-center text-amber-500 shadow-lg shadow-amber-500/15">
                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                          </span>
                        ) : (
                          <span className="absolute -left-[41px] top-0 w-6 h-6 rounded-full bg-emerald-500/10 border-2 border-emerald-500 flex items-center justify-center text-emerald-500 shadow-lg shadow-emerald-500/15">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </span>
                        )}
                        <div>
                          <span className="block text-[11px] font-black text-slate-800 dark:text-white uppercase tracking-wider">Awaiting Delivery Assignment</span>
                          <p className="text-[10px] text-slate-400 mt-0.5 font-bold uppercase tracking-wide">
                            Next step: assign a courier to pick up the shipment.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Right Column (Customer, Payment, Driver Cards) */}
                <div className="space-y-8">
                  
                  {/* Customer Details */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-[2rem] p-6 shadow-sm relative">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-3 mb-4">
                      <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
                        Customer Details
                      </h4>
                      <button 
                        onClick={() => setIsEditingAddress(!isEditingAddress)}
                        className="text-[9px] font-black uppercase text-emerald-650 hover:text-emerald-700 tracking-wider flex items-center gap-1"
                      >
                        <Edit className="w-3 h-3" /> Edit
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black text-xs uppercase shadow-sm">
                          {initials}
                        </div>
                        <div>
                          <span className="block text-[13px] font-black text-slate-800 dark:text-white uppercase tracking-wide">
                            {activeOrderDetails.partner}
                          </span>
                          <span className="px-1.5 py-0.5 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-md text-[7px] font-black uppercase tracking-widest border border-emerald-100/50 mt-0.5 inline-block">
                            Premium Member
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2.5 text-[11px] font-bold text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400">✉</span>
                          <span className="text-slate-700 dark:text-slate-300">{activeOrderDetails.customerEmail || 'customer@freshguru.in'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400">📞</span>
                          <span className="text-slate-700 dark:text-slate-300">{activeOrderDetails.customerPhone || '+91 98765 43210'}</span>
                        </div>
                        
                        {isEditingAddress ? (
                          <div className="mt-3 pt-3 border-t border-slate-50 dark:border-slate-800/80 space-y-2">
                            <textarea
                              value={editedAddress}
                              onChange={(e) => setEditedAddress(e.target.value)}
                              rows="3"
                              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-800 dark:text-white"
                            />
                            <div className="flex justify-end gap-2">
                              <button 
                                onClick={() => setIsEditingAddress(false)}
                                className="px-3 py-1.5 border border-slate-200 dark:border-slate-800 rounded-lg text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-650"
                              >
                                Cancel
                              </button>
                              <button 
                                onClick={handleSaveAddress}
                                className="px-3 py-1.5 bg-[#0a4a34] text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-emerald-800 shadow-sm"
                              >
                                Save Location
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start gap-2 pt-2 border-t border-slate-50 dark:border-slate-800/80">
                            <span className="text-emerald-600 shrink-0">📍</span>
                            <span className="text-[11px] leading-relaxed text-slate-700 dark:text-slate-300">
                              {activeOrderDetails.location}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Payment Summary */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-[2rem] p-6 shadow-sm">
                    <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 dark:border-slate-800/60 pb-3 mb-4">
                      Payment Summary
                    </h4>

                    <div className="space-y-2.5 text-[11px] font-bold text-slate-500 dark:text-slate-400">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span className="text-slate-750 dark:text-slate-200 font-bold">₹{subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax (GST 5%)</span>
                        <span className="text-slate-750 dark:text-slate-200 font-bold">₹{tax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Delivery Fee</span>
                        <span className="text-slate-750 dark:text-slate-200 font-bold">₹{deliveryFee.toFixed(2)}</span>
                      </div>
                      
                      <div className="flex justify-between border-t border-slate-50 dark:border-slate-800/80 pt-3 text-[14px]">
                        <span className="font-black text-slate-800 dark:text-white uppercase tracking-tight">Grand Total</span>
                        <span className="font-black text-emerald-500 dark:text-emerald-450 text-lg">₹{grandTotal.toFixed(2)}</span>
                      </div>

                      <div className="flex items-center gap-2 px-3 py-2.5 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30 rounded-xl text-[9px] font-black uppercase tracking-wider mt-3 shadow-sm">
                        <CreditCard className="w-3.5 h-3.5" />
                        Paid via Visa **** 9821
                      </div>
                    </div>
                  </div>

                  {/* Delivery Assignment */}
                  <div id="driver-assignment-panel" className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-[2rem] p-6 shadow-sm">
                    <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 dark:border-slate-800/60 pb-3 mb-4">
                      Delivery Assignment
                    </h4>

                    {isUnassigned ? (
                      <div className="text-center py-4 flex flex-col items-center justify-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-350 shadow-inner">
                          🚫
                        </div>
                        <div>
                          <span className="block text-[11px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">
                            No agent assigned yet
                          </span>
                          <span className="block text-[9px] text-slate-400 uppercase mt-0.5 font-bold tracking-wider">
                            Assign driver to dispatch order
                          </span>
                        </div>

                        <select 
                          onChange={(e) => assignSingleDriver(activeOrderDetails.id, e.target.value)}
                          className="w-full mt-2 px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-[10px] font-black text-slate-700 dark:text-slate-200 uppercase tracking-widest outline-none focus:ring-4 focus:ring-emerald-500/10 cursor-pointer shadow-sm"
                          value=""
                        >
                          <option value="" disabled>Select Available Agent...</option>
                          {drivers.map(d => (
                            <option key={d.id} value={d.id}>
                              {d.name.toUpperCase()} ({d.status})
                            </option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-955 border border-slate-200/50 dark:border-slate-800/80 rounded-2xl">
                          <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950/40 border border-emerald-250 dark:border-emerald-800 flex items-center justify-center font-black text-xs text-emerald-600 dark:text-emerald-400 uppercase">
                            {activeOrderDetails.driverName ? activeOrderDetails.driverName.split(' ').map(n => n[0]).join('') : 'D'}
                          </div>
                          <div>
                            <span className="block text-[12px] font-black text-slate-800 dark:text-white uppercase tracking-wide">
                              {activeOrderDetails.driverName}
                            </span>
                            <span className="block text-[9px] font-bold text-emerald-600 uppercase tracking-widest mt-0.5">
                              Fleet Agent Assigned
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                </div>

              </div>

              {/* Bottom Actions Footer */}
              <div className="px-10 py-5 bg-white dark:bg-slate-900 border-t border-slate-200/60 dark:border-slate-800 flex justify-between items-center shrink-0">
                <button 
                  onClick={() => {
                    if (window.confirm('Are you sure you want to cancel this order?')) {
                      handleCancelOrder(activeOrderDetails.id);
                    }
                  }}
                  className="px-8 py-3 bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-900/30 text-red-650 dark:text-red-400 border border-red-100 dark:border-red-900/20 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-95 shadow-sm"
                >
                  Cancel Order
                </button>
                <button 
                  onClick={() => setActiveOrderDetails(null)}
                  className="px-8 py-3 bg-[#0a4a34] hover:bg-emerald-850 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-green-950/10"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        );
      })()}
      {/* 👤 Driver Details Modal */}
      {selectedDriverDetails && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100 dark:border-slate-800">
            <div className="px-8 py-6 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-slate-50/30 dark:bg-slate-800/20">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tighter uppercase">Driver Profile</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">Credentials & Performance</p>
              </div>
              <button 
                onClick={() => setSelectedDriverDetails(null)} 
                className="p-2.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-8 space-y-6">
              {/* Profile Header */}
              <div className="flex items-center gap-4">
                {selectedDriverDetails.image_url ? (
                  <img 
                    src={selectedDriverDetails.image_url} 
                    alt={selectedDriverDetails.name} 
                    className="w-16 h-16 rounded-full object-cover border-2 border-emerald-500 shadow-lg" 
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-250 dark:border-emerald-800 flex items-center justify-center font-black text-xl text-emerald-600 dark:text-emerald-400 uppercase shadow-md">
                    {selectedDriverDetails.name.split(' ').map(n => n[0]).join('')}
                  </div>
                )}
                <div>
                  <h4 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">
                    {selectedDriverDetails.name}
                  </h4>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    ID: {selectedDriverDetails.driver_id}
                  </span>
                </div>
              </div>

              {/* Status and Rating Badges */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-100 dark:border-slate-850">
                  <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</span>
                  {(() => {
                    const hasOutForDelivery = orders.some(o => o.driver == selectedDriverDetails.id && o.status === 'Out for Delivery');
                    const displayStatus = hasOutForDelivery ? 'Delivering' : (selectedDriverDetails.status === 'Active' ? 'Ready' : 'Offline');
                    return (
                      <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${
                        displayStatus === 'Delivering' 
                          ? 'bg-purple-55 text-purple-650 border border-purple-100' 
                          : displayStatus === 'Ready' 
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                            : 'bg-red-50 text-red-600 border border-red-100'
                      }`}>
                        {displayStatus === 'Delivering' ? 'Out for Delivery' : displayStatus}
                      </span>
                    );
                  })()}
                </div>

                <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-100 dark:border-slate-850">
                  <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Rating</span>
                  <span className="text-xs font-black text-amber-550 dark:text-amber-400 flex items-center gap-1">
                    ⭐ {selectedDriverDetails.rating || '5.0'} / 5.0
                  </span>
                </div>
              </div>

              {/* Information List */}
              <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-400 uppercase tracking-wider">Contact Number</span>
                  <span className="font-black text-slate-800 dark:text-slate-200">{selectedDriverDetails.contact || 'Not Provided'}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-400 uppercase tracking-wider">Vehicle</span>
                  <span className="font-black text-slate-800 dark:text-slate-200">{selectedDriverDetails.vehicle || 'Not Assigned'}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-400 uppercase tracking-wider">Total Delivered Orders</span>
                  <span className="font-black text-slate-800 dark:text-slate-200">{selectedDriverDetails.total_orders || 0}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-400 uppercase tracking-wider">App Username</span>
                  <span className="font-black text-slate-800 dark:text-slate-200 text-emerald-600">{selectedDriverDetails.username || 'N/A'}</span>
                </div>
              </div>
            </div>
            
            <div className="px-8 py-5 bg-slate-50/50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button 
                onClick={() => setSelectedDriverDetails(null)}
                className="px-6 py-2.5 bg-[#0a4a34] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-800 transition-all active:scale-95 shadow-md"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const KanbanColumn = ({ title, orders, selectedOrders, onSelect, drivers, openDropdownId, setOpenDropdownId, onAssign, onDetail, onUpdateItems }) => {
  return (
    <div className="flex flex-col gap-4">
      {/* Column Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">{title}</span>
          <span className="flex items-center justify-center w-6 h-6 rounded-md bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 text-[10px] font-black">
            {orders.length}
          </span>
        </div>
        <button className="text-slate-400 hover:text-slate-600 transition-colors">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      {/* Cards Container */}
      <div className="flex flex-col gap-4">
        {orders.length === 0 ? (
          <div className="py-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center text-slate-400">
            <Package className="w-8 h-8 mb-2 opacity-20" />
            <p className="text-[10px] font-black uppercase tracking-widest opacity-50">Empty Queue</p>
          </div>
        ) : (
          orders.map(order => (
            <KanbanCard 
              key={order.id}
              order={order}
              isSelected={selectedOrders.includes(order.id)}
              onSelect={() => onSelect(order.id)}
              drivers={drivers}
              openDropdownId={openDropdownId}
              setOpenDropdownId={setOpenDropdownId}
              onAssign={onAssign}
              onDetail={() => onDetail(order.id)}
              onUpdateItems={onUpdateItems}
              columnTitle={title}
            />
          ))
        )}
      </div>
    </div>
  );
};

const KanbanCard = ({ order, isSelected, onSelect, drivers, openDropdownId, setOpenDropdownId, onAssign, onDetail, onUpdateItems, columnTitle }) => {
  const driverObj = order.driver ? drivers.find(d => d.id == order.driver) : null;
  const driverName = driverObj?.name || order.driverName || null;

  return (
    <div className={`relative bg-white dark:bg-slate-950 rounded-2xl border transition-all ${
      isSelected 
        ? 'border-emerald-500 shadow-[0_8px_30px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500' 
        : 'border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-md'
    }`}>
      {/* Top Header */}
      <div className="p-5 pb-4 border-b border-slate-100 dark:border-slate-800/50 flex items-start justify-between cursor-pointer" onClick={onDetail}>
        <div className="flex items-center gap-3">
          {!driverName && (
            <input 
              type="checkbox"
              checked={isSelected}
              onChange={(e) => { e.stopPropagation(); onSelect(); }}
              className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500/20 cursor-pointer mt-0.5"
              onClick={(e) => e.stopPropagation()}
            />
          )}
          <div>
            <h4 className="text-[13px] font-black text-[#0a4a34] dark:text-emerald-400 tracking-tight">{order.id}</h4>
            <p className="text-[10px] font-bold text-slate-500 mt-0.5">{order.partner}</p>
          </div>
        </div>
        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] mt-1" />
      </div>

      {/* Body Details */}
      <div className="p-5 pt-4 space-y-4">
        <div className="flex items-center justify-between cursor-pointer" onClick={onDetail}>
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Invoice Amount</span>
          <span className="text-[15px] font-black text-slate-900 dark:text-white">₹{order.amount.toLocaleString()}</span>
        </div>

        {columnTitle === 'NEW ORDERS' && (
          <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/50 pt-3">
            <div className="flex flex-col cursor-pointer" onClick={onDetail}>
               <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Date & Time</span>
               <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" /> 
                  {order.date} • {order.time}
               </span>
            </div>
            <div className="flex flex-col items-end" onClick={(e) => e.stopPropagation()}>
               <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Items Qty</span>
               <input 
                  type="number" 
                  value={order.items || 1} 
                  onChange={(e) => onUpdateItems && onUpdateItems(order.id, parseInt(e.target.value) || 0)}
                  className="w-16 px-2 py-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg text-[10px] font-bold text-slate-700 dark:text-slate-200 text-center outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                />
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 cursor-pointer" onClick={onDetail}>
          <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-2.5 border border-slate-100 dark:border-slate-800">
            <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Zone</span>
            <span className="block text-[11px] font-bold text-slate-700 dark:text-slate-300">{order.zone || order.location}</span>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-2.5 border border-slate-100 dark:border-slate-800">
            <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Slot</span>
            <span className="block text-[11px] font-bold text-slate-700 dark:text-slate-300">{order.slot}</span>
          </div>
        </div>
      </div>

      {/* Footer / Driver Assignment */}
      <div className={`p-4 border-t border-slate-100 dark:border-slate-800/50 rounded-b-2xl relative ${
        driverName 
          ? 'bg-slate-50/50 dark:bg-slate-900/20' 
          : 'bg-emerald-500/5 dark:bg-emerald-950/10 hover:bg-emerald-500/10 dark:hover:bg-emerald-950/20 transition-all'
      }`}>
        {driverName ? (
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/40 border border-emerald-250 dark:border-emerald-805 flex items-center justify-center">
                <Truck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="text-left">
                <span className="block text-[11px] font-black uppercase tracking-widest text-slate-900 dark:text-white">
                  {driverName}
                </span>
                <span className="block text-[9px] font-bold text-emerald-600 mt-0.5">Fleet Active</span>
              </div>
            </div>
          </div>
        ) : (
          <>
            <button 
              onClick={(e) => { e.stopPropagation(); setOpenDropdownId(openDropdownId === order.id ? null : order.id); }}
              className="w-full flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100/50 dark:bg-emerald-900/30 border border-dashed border-emerald-400 dark:border-emerald-750 flex items-center justify-center">
                  <UserPlus className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="text-left">
                  <span className="block text-[11px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                    Assign Driver
                  </span>
                  <span className="block text-[9px] font-bold text-emerald-500/80 dark:text-emerald-400/85 mt-0.5 animate-pulse">Click to select agent</span>
                </div>
              </div>
              <ChevronDown className={`w-4 h-4 text-emerald-500 dark:text-emerald-400 transition-transform ${openDropdownId === order.id ? 'rotate-180' : ''}`} />
            </button>

            {openDropdownId === order.id && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
                <div className="p-3 border-b border-slate-50 dark:border-slate-800">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Assign Fleet Driver</p>
                </div>
                <div className="max-h-48 overflow-y-auto">
                  {drivers.map(driver => (
                    <button 
                      key={driver.id}
                      onClick={(e) => { e.stopPropagation(); onAssign(order.id, driver.id); setOpenDropdownId(null); }}
                      className="w-full px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800/85 flex items-center justify-between transition-colors border-b last:border-0 border-slate-50 dark:border-slate-800/50"
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${driver.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                        <div className="text-left flex flex-col">
                          <span className="text-[11px] font-black text-slate-700 dark:text-slate-200 uppercase tracking-widest">{driver.name}</span>
                          <span className="text-[9px] font-bold text-emerald-600 uppercase mt-0.5">Logistics Partner</span>
                        </div>
                      </div>
                      <span className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border ${
                        driver.status === 'Active' 
                          ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30' 
                          : 'bg-slate-50 dark:bg-slate-900 text-slate-400 border-slate-200 dark:border-slate-800'
                      }`}>
                        {driver.status}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Delivery;
