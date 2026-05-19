import React, { useState, useEffect } from 'react';
import ConfirmModal from '../components/ConfirmModal';
import { 
  Wallet, 
  Plus, 
  Search, 
  Filter, 
  TrendingUp, 
  TrendingDown, 
  Truck, 
  UserCircle, 
  ShoppingBasket,
  Calendar,
  MoreVertical,
  CheckCircle2,
  Download,
  Edit2,
  Trash2,
  ChevronDown,
  HelpCircle,
  ShieldCheck,
  Scale,
  Tag
} from 'lucide-react';

const Expenses = () => {
  const [showForm, setShowForm] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [groupBy, setGroupBy] = useState('NONE');
  const [showCategoryFilterDropdown, setShowCategoryFilterDropdown] = useState(false);
  const [showGroupByDropdown, setShowGroupByDropdown] = useState(false);

  const API_URL = 'http://localhost:5055/api/expenses';

  useEffect(() => {
    fetchExpenses();
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('admin_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      if (response.ok) {
        const data = await response.json();
        const mapped = data.map(e => ({
          id: e.id,
          date: new Date(e.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          category: e.category.toUpperCase(),
          description: e.description,
          qty: e.quantity || '-',
          unitPrice: e.unit_price ? `₹${e.unit_price}` : '-',
          amount: `₹${parseFloat(e.amount).toFixed(2)}`,
          addedBy: e.added_by,
          editedBy: e.edited_by
        }));
        setExpenses(mapped);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const [formData, setFormData] = useState({
    category: 'Farm Procurement',
    customCategory: '',
    itemName: '',
    kgs: '',
    pricePerKg: '',
    amount: '',
    description: '',
    date: new Date().toLocaleDateString('en-GB')
  });

  const [isCustomCategory, setIsCustomCategory] = useState(false);

  const isProcurement = formData.category === 'Farm Procurement';
  const isSalary = formData.category === 'Driver Salary';

  const calculatedTotal = isProcurement 
    ? ((parseFloat(formData.kgs) || 0) * (parseFloat(formData.pricePerKg) || 0)).toFixed(2)
    : (parseFloat(formData.amount) || 0).toFixed(2);

  const handleAddExpense = async () => {
    const finalCategory = isCustomCategory ? formData.customCategory : formData.category;
    if (!finalCategory) return alert('Please specify a category');

    // Convert date from DD/MM/YYYY to YYYY-MM-DD for backend
    let formattedDate;
    if (formData.date.includes('/')) {
      const dateParts = formData.date.split('/');
      if (dateParts.length === 3) {
        formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
      } else {
        formattedDate = new Date().toISOString().split('T')[0];
      }
    } else {
      // Fallback to today if format is invalid
      formattedDate = new Date().toISOString().split('T')[0];
    }

    const payload = {
      date: formattedDate,
      category: finalCategory.toUpperCase(),
      description: formData.itemName || formData.description || (isSalary ? 'Driver Payout' : 'Expense'),
      quantity: isProcurement && formData.kgs ? `${formData.kgs} Kgs` : null,
      unitPrice: isProcurement && formData.pricePerKg ? parseFloat(formData.pricePerKg) : null,
      amount: parseFloat(calculatedTotal)
    };

    try {
      const response = await fetch(editingId ? `${API_URL}/${editingId}` : API_URL, {
        method: editingId ? 'PUT' : 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const e = await response.json();
        const updatedExp = {
          id: e.id,
          date: new Date(e.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          category: e.category.toUpperCase(),
          description: e.description,
          qty: e.quantity || '-',
          unitPrice: e.unit_price ? `₹${e.unit_price}` : '-',
          amount: `₹${parseFloat(e.amount).toFixed(2)}`,
          addedBy: e.added_by,
          editedBy: e.edited_by
        };

        if (editingId) {
          setExpenses(prev => prev.map(exp => exp.id === editingId ? updatedExp : exp));
        } else {
          setExpenses([updatedExp, ...expenses]);
        }
        
        setShowForm(false);
        setEditingId(null);
        setShowSuccessDialog(true);
        resetForm();
      } else {
        const data = await response.json();
        alert(data.message || 'Operation failed');
      }
    } catch (err) {
      console.error(err);
      alert('Connection error');
    }
  };

  const resetForm = () => {
    setFormData({
      category: 'Farm Procurement',
      customCategory: '',
      itemName: '',
      kgs: '',
      pricePerKg: '',
      amount: '',
      description: '',
      date: new Date().toLocaleDateString('en-GB')
    });
    setIsCustomCategory(false);
    setEditingId(null);
  };

  const handleEdit = (expense) => {
    // Reverse the formatting for the form
    const [day, monthStr, year] = expense.date.split(' ');
    const months = { 'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04', 'May': '05', 'Jun': '06', 'Jul': '07', 'Aug': '08', 'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12' };
    const month = months[monthStr];
    const rawDate = `${day}/${month}/${year}`;

    const isProc = expense.category.toUpperCase() === 'FARM PROCUREMENT';
    
    const categoryMap = {
      'FARM PROCUREMENT': 'Farm Procurement',
      'DRIVER SALARY': 'Driver Salary',
      'VEHICLE MAINTENANCE': 'Vehicle Maintenance',
      'UTILITIES': 'Utilities'
    };
    const mappedCat = categoryMap[expense.category.toUpperCase()] || expense.category;

    setFormData({
      category: mappedCat,
      customCategory: '',
      itemName: isProc ? expense.description : '',
      kgs: isProc ? expense.qty.replace(' Kgs', '') : '',
      pricePerKg: isProc ? expense.unitPrice.replace('₹', '') : '',
      amount: !isProc ? expense.amount.replace('₹', '') : '',
      description: !isProc ? expense.description : '',
      date: rawDate
    });
    setEditingId(expense.id);
    setShowForm(true);
  };

  const handleDeleteExpense = async () => {
    if (!expenseToDelete) return;
    try {
      const response = await fetch(`${API_URL}/${expenseToDelete.id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (response.ok) {
        setExpenses(prev => prev.filter(e => e.id !== expenseToDelete.id));
        setShowDeleteModal(false);
        setExpenseToDelete(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Filter and Grouping computations
  const filteredExpenses = expenses.filter(e => {
    if (selectedCategory === 'ALL') return true;
    return e.category.toUpperCase() === selectedCategory.toUpperCase();
  });

  const getGroupTotal = (items) => {
    const sum = items.reduce((total, item) => {
      const val = parseFloat(item.amount.replace(/[₹,]/g, '')) || 0;
      return total + val;
    }, 0);
    return `₹${sum.toFixed(2)}`;
  };

  const groupedExpenses = (() => {
    if (groupBy === 'NONE') return null;
    return filteredExpenses.reduce((acc, e) => {
      const key = groupBy === 'CATEGORY' ? e.category : e.date;
      if (!acc[key]) acc[key] = [];
      acc[key].push(e);
      return acc;
    }, {});
  })();

  const handleExportCSV = () => {
    if (filteredExpenses.length === 0) return alert('No expenses to export');
    const headers = ['Date', 'Category', 'Description/Item', 'Quantity', 'Unit Price', 'Total Amount', 'Logged By', 'Edited By'];
    const rows = filteredExpenses.map(e => [
      e.date,
      e.category,
      e.description,
      e.qty,
      e.unitPrice,
      e.amount,
      e.addedBy || 'System',
      e.editedBy || ''
    ]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(r => r.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `expenses_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderExpenseRow = (expense) => {
    const cat = expense.category || '';
    return (
      <tr key={expense.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/30 transition-all">
        <td className="px-8 py-6 text-xs font-bold text-slate-500 dark:text-slate-400">{expense.date}</td>
        <td className="px-8 py-6">
          <span className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest leading-none block w-fit ${
            cat.includes('PROCUREMENT') ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-650' :
            cat.includes('SALARY') ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' :
            cat.includes('MAINTENANCE') ? 'bg-red-50 dark:bg-red-900/20 text-red-600' :
            'bg-slate-50 dark:bg-slate-855 text-slate-600'
          }`}>
            {cat.split(' ')[0]} {cat.split(' ')[1] && <><br />{cat.split(' ')[1]}</>}
          </span>
        </td>
        <td className="px-8 py-6 text-sm font-bold text-slate-700 dark:text-slate-300">{expense.description}</td>
        <td className="px-8 py-6 text-sm font-bold text-slate-500 dark:text-slate-400">{expense.qty}</td>
        <td className="px-8 py-6 text-sm font-bold text-slate-500 dark:text-slate-400">{expense.unitPrice}</td>
        <td className="px-8 py-6 text-sm font-black text-slate-900 dark:text-white">{expense.amount}</td>
        <td className="px-8 py-6">
          <div className="space-y-1">
            <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-1.5">
              <UserCircle className="w-3 h-3 text-emerald-600" />
              {expense.addedBy || 'System'}
            </p>
            {expense.editedBy && (
              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Edit2 className="w-2.5 h-2.5" />
                Edited: {expense.editedBy}
              </p>
            )}
          </div>
        </td>
        <td className="px-8 py-6 text-right">
          <div className="flex items-center justify-end gap-2">
            <button 
              onClick={() => handleEdit(expense)}
              className="p-2 text-slate-400 hover:text-emerald-500 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button 
              onClick={() => { setExpenseToDelete(expense); setShowDeleteModal(true); }}
              className="p-2 text-slate-400 hover:text-red-500 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700 max-w-[1600px] mx-auto pb-12 relative">
      {/* Success Notification - Top Positioned */}
      {showSuccessDialog && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] w-full max-w-md px-4 animate-in slide-in-from-top-full duration-500">
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 shadow-2xl border-2 border-emerald-500/20 flex items-center gap-6">
            <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center shrink-0">
              <ShieldCheck className="w-7 h-7 text-emerald-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">Expense Logged!</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5"> Ledger updated successfully.</p>
            </div>
            <button 
              onClick={() => setShowSuccessDialog(false)}
              className="px-6 py-3 bg-slate-900 dark:bg-emerald-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-[1.05] transition-all active:scale-95 whitespace-nowrap shadow-lg"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* Header with Toggle */}
      {/* ERP Command Header */}
      <div className="flex flex-col xl:flex-row gap-8">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-[#0a4a34] rounded-lg flex items-center justify-center shadow-lg shadow-green-900/10">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Expense Ledger</h2>
          </div>
          <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Operational Expenditure & Financial Transaction Logging</p>
        </div>

        <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <button 
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-[#0a4a34] text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-800 transition-all shadow-lg shadow-green-900/10"
          >
            <Plus className="w-3.5 h-3.5" /> Log New Expense
          </button>
        </div>
      </div>



      {/* Detailed Spending Breakdown Card */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden relative group">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-5">
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-0.5">Expenditure intelligence</p>
            <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tighter">Spending by Category</h3>
          </div>
          <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 p-1.5 px-4 rounded-xl border border-slate-100 dark:border-slate-700">
            <div className="flex flex-col items-end">
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-0.5">Total Burn</span>
              <span className="text-base font-black text-[#0a4a34] dark:text-emerald-400 tracking-tighter">₹42,850</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* SVG Pie/Donut Chart Container */}
          <div className="lg:col-span-5 flex justify-center relative">
            <div className="relative w-44 h-44 sm:w-48 sm:h-48">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background Track */}
                <circle 
                  cx="50" 
                  cy="50" 
                  r="38" 
                  fill="transparent" 
                  stroke="rgba(241, 245, 249, 0.05)" 
                  strokeWidth="8" 
                />
                {(() => {
                  let accumulatedPercent = 0;
                  const spendCategories = [
                    { label: 'Procurement', value: 19282, percent: 45, color: '#10b981' },
                    { label: 'Logistics', value: 10712, percent: 25, color: '#3b82f6' },
                    { label: 'Salaries', value: 6427, percent: 15, color: '#f97316' },
                    { label: 'Maintenance', value: 4285, percent: 10, color: '#a855f7' },
                    { label: 'Others', value: 2142, percent: 5, color: '#94a3b8' }
                  ];
                  return spendCategories.map((cat, idx) => {
                    const radius = 38;
                    const circumference = 2 * Math.PI * radius; // ~238.76
                    const gap = 1.2; // premium segment gap
                    const strokeLength = Math.max(0, (cat.percent / 100) * circumference - gap);
                    const strokeOffset = -(accumulatedPercent / 100) * circumference;
                    accumulatedPercent += cat.percent;

                    return (
                      <circle
                        key={idx}
                        cx="50"
                        cy="50"
                        r={radius}
                        fill="transparent"
                        stroke={cat.color}
                        strokeWidth="8"
                        strokeDasharray={`${strokeLength} ${circumference}`}
                        strokeDashoffset={strokeOffset}
                        className="transition-all duration-500 hover:stroke-[9.5] cursor-pointer"
                        style={{ transformOrigin: '50px 50px' }}
                      />
                    );
                  });
                })()}
              </svg>
              {/* Inner Center Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                <span className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-0.5">Total Burn</span>
                <span className="text-xl font-black text-[#0a4a34] dark:text-emerald-400 tracking-tighter">₹42,850</span>
                <span className="text-[7px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">100% Audited</span>
              </div>
            </div>
          </div>

          {/* Categories Grid List */}
          <div className="lg:col-span-7 space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { label: 'Procurement', value: '₹19,282', percent: '45%', color: '#10b981' },
                { label: 'Logistics', value: '₹10,712', percent: '25%', color: '#3b82f6' },
                { label: 'Salaries', value: '₹6,427', percent: '15%', color: '#f97316' },
                { label: 'Maintenance', value: '₹4,285', percent: '10%', color: '#a855f7' },
                { label: 'Others', value: '₹2,142', percent: '5%', color: '#94a3b8' }
              ].map((cat, i) => (
                <div 
                  key={i} 
                  className="p-3 bg-slate-50/50 dark:bg-slate-800/20 rounded-2xl border border-slate-100/50 dark:border-slate-850 flex items-center justify-between hover:scale-[1.02] hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all duration-350 group/cat cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: cat.color + '15' }}>
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cat.color }} />
                    </div>
                    <div>
                      <h4 className="text-[8.5px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{cat.label}</h4>
                      <p className="text-sm font-black text-slate-900 dark:text-white tracking-tight">{cat.value}</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-white dark:bg-slate-800 rounded-lg text-[8px] font-black text-slate-600 dark:text-slate-300 shadow-sm border border-slate-100 dark:border-slate-700">
                    {cat.percent}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Subtle Decorative Glow */}
        <div className="absolute -right-24 -bottom-24 w-64 h-64 bg-emerald-500/5 blur-[100px] pointer-events-none rounded-full" />
      </div>

      {showForm && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xl animate-in fade-in duration-500">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] animate-in zoom-in-95 duration-400 overflow-hidden border border-white/20">
            {/* Premium Modal Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-emerald-50/50 to-white dark:from-emerald-950/20 dark:to-slate-900 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-[#0a4a34] rounded-xl flex items-center justify-center shadow-lg shadow-green-900/20">
                  <Wallet className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2 className="text-base font-black text-slate-900 dark:text-white tracking-tighter">
                    {editingId ? 'Edit record' : 'Log expense'}
                  </h2>
                </div>
              </div>
              <button 
                onClick={() => { setShowForm(false); resetForm(); }}
                className="w-8 h-8 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-red-500 transition-all active:scale-90"
              >
                <Plus className="w-4 h-4 rotate-45" />
              </button>
            </div>

            <div className="p-6 py-4 space-y-3.5">
              {/* Expense Category Selector */}
              <div className="space-y-1.5">
                <label className="text-[8.5px] font-black text-slate-400 uppercase tracking-[0.2em] block ml-1">Classification</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 transition-transform group-focus-within:scale-110">
                    <Tag className="w-4 h-4" />
                  </div>
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full pl-11 pr-10 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl text-[11px] font-bold outline-none appearance-none focus:ring-4 focus:ring-emerald-500/10 transition-all text-slate-700 dark:text-white cursor-pointer"
                  >
                    <option value="Farm Procurement">Farm procurement</option>
                    <option value="Driver Salary">Driver salary</option>
                    <option value="Vehicle Maintenance">Vehicle maintenance</option>
                    <option value="Utilities">Utilities & rent</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-center pointer-events-none">
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </div>
              </div>

              {/* Grid Input Group */}
              <div className="grid grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="text-[8.5px] font-black text-slate-400 uppercase tracking-[0.2em] block ml-1">Item name</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600">
                      <ShoppingBasket className="w-4 h-4" />
                    </div>
                    <input 
                      type="text" 
                      placeholder="e.g. Fresh tomatoes"
                      value={formData.itemName}
                      onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                      className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl text-[11px] font-bold outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all text-slate-700 dark:text-white"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[8.5px] font-black text-slate-400 uppercase tracking-[0.2em] block ml-1">Date</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <input 
                      type="text" 
                      placeholder="dd/mm/yyyy"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl text-[11px] font-bold outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all text-slate-700 dark:text-white"
                    />
                  </div>
                </div>

                {isProcurement ? (
                  <>
                    <div className="space-y-1.5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <label className="text-[8.5px] font-black text-slate-400 uppercase tracking-[0.2em] block ml-1">Qty (Kgs)</label>
                      <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600">
                          <Scale className="w-4 h-4" />
                        </div>
                        <input 
                          type="number" 
                          placeholder="0.00"
                          value={formData.kgs}
                          onChange={(e) => setFormData({ ...formData, kgs: e.target.value })}
                          className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl text-[11px] font-bold outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all text-slate-700 dark:text-white"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <label className="text-[8.5px] font-black text-slate-400 uppercase tracking-[0.2em] block ml-1">Rate (₹)</label>
                      <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600">
                          <Wallet className="w-4 h-4" />
                        </div>
                        <input 
                          type="number" 
                          placeholder="0.00"
                          value={formData.pricePerKg}
                          onChange={(e) => setFormData({ ...formData, pricePerKg: e.target.value })}
                          className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl text-[11px] font-bold outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all text-slate-700 dark:text-white"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="col-span-2 space-y-1.5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <label className="text-[8.5px] font-black text-slate-400 uppercase tracking-[0.2em] block ml-1">Total amount (₹)</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600">
                        <Wallet className="w-4 h-4" />
                      </div>
                      <input 
                        type="number" 
                        placeholder="0.00"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl text-[11px] font-bold outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all text-slate-700 dark:text-white"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Compact Summary Visualization */}
              <div className="relative p-4 bg-emerald-600 rounded-xl shadow-lg shadow-green-900/20 overflow-hidden group">
                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <p className="text-[8.5px] font-black text-emerald-100 uppercase tracking-[0.3em]">Total amount</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-white tracking-tighter drop-shadow-sm">
                      ₹{calculatedTotal}
                    </span>
                  </div>
                </div>
                <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-white/10 rounded-full blur-3xl" />
              </div>

              {/* Notes Field */}
              <div className="space-y-1.5">
                <label className="text-[8.5px] font-black text-slate-400 uppercase tracking-[0.2em] block ml-1">Remarks</label>
                <div className="relative group">
                  <div className="absolute left-4 top-3 text-emerald-600">
                    <Edit2 className="w-4 h-4" />
                  </div>
                  <textarea 
                    rows="1.5"
                    placeholder="Payment references..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl text-[11px] font-medium outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all resize-none text-slate-700 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Modal Navigation */}
            <div className="px-6 py-4 bg-slate-50/80 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex gap-3">
              <button 
                onClick={() => { setShowForm(false); resetForm(); }}
                className="flex-1 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-black text-[9px] uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-all active:scale-95"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddExpense}
                className="flex-[1.5] flex items-center justify-center gap-2 bg-[#0a4a34] text-white py-2.5 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-emerald-800 transition-all shadow-lg shadow-green-900/10 active:scale-95 group"
              >
                <CheckCircle2 className="w-4 h-4" /> 
                {editingId ? 'Update Record' : 'Finalize Log'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Expense History Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight">Expense History</h2>
          <div className="flex items-center gap-3 relative z-[120]">
            {/* Category Filter Selector */}
            <div className="relative">
              <button 
                onClick={() => { setShowCategoryFilterDropdown(!showCategoryFilterDropdown); setShowGroupByDropdown(false); }}
                className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800 transition-all bg-white dark:bg-slate-900 shadow-sm"
              >
                Filter: {selectedCategory === 'ALL' ? 'All' : selectedCategory.split(' ')[0]} <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>
              {showCategoryFilterDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl shadow-2xl z-[120] py-1.5 overflow-hidden animate-in zoom-in-95 duration-200">
                  {[
                    { value: 'ALL', label: 'All Categories' },
                    { value: 'FARM PROCUREMENT', label: 'Farm Procurement' },
                    { value: 'DRIVER SALARY', label: 'Driver Salary' },
                    { value: 'VEHICLE MAINTENANCE', label: 'Vehicle Maintenance' },
                    { value: 'UTILITIES', label: 'Utilities' }
                  ].map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => { setSelectedCategory(opt.value); setShowCategoryFilterDropdown(false); }}
                      className={`w-full px-4 py-2 text-left text-[10px] font-black uppercase tracking-wider transition-colors ${
                        selectedCategory === opt.value 
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400' 
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Group By Selector */}
            <div className="relative">
              <button 
                onClick={() => { setShowGroupByDropdown(!showGroupByDropdown); setShowCategoryFilterDropdown(false); }}
                className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800 transition-all bg-white dark:bg-slate-900 shadow-sm"
              >
                Group: {groupBy === 'NONE' ? 'None' : groupBy} <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>
              {showGroupByDropdown && (
                <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl shadow-2xl z-[120] py-1.5 overflow-hidden animate-in zoom-in-95 duration-200">
                  {[
                    { value: 'NONE', label: 'No Grouping' },
                    { value: 'CATEGORY', label: 'Category' },
                    { value: 'DATE', label: 'Date' }
                  ].map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => { setGroupBy(opt.value); setShowGroupByDropdown(false); }}
                      className={`w-full px-4 py-2 text-left text-[10px] font-black uppercase tracking-wider transition-colors ${
                        groupBy === opt.value 
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400' 
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button 
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2 border border-emerald-100 dark:border-emerald-900/30 rounded-xl text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all bg-white dark:bg-slate-900 shadow-sm"
            >
              <Download className="w-3.5 h-3.5" /> Export CSV
            </button>
          </div>
        </div>

        <div className="overflow-x-auto text-left">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr className="border-b border-slate-100 dark:border-slate-800">
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">DATE</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">CATEGORY</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">DESCRIPTION/ITEM</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">QUANTITY</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">UNIT PRICE</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">TOTAL AMOUNT</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">LOGGED BY</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {groupBy === 'NONE' ? (
                filteredExpenses.map((expense) => renderExpenseRow(expense))
              ) : (
                Object.keys(groupedExpenses).map((groupKey) => (
                  <React.Fragment key={groupKey}>
                    <tr className="bg-slate-50/50 dark:bg-slate-800/20 border-y border-slate-100 dark:border-slate-800">
                      <td colSpan={8} className="px-8 py-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-widest text-[#0a4a34] dark:text-emerald-400">
                            {groupBy === 'CATEGORY' ? 'Category' : 'Date'}: {groupKey}
                          </span>
                          <span className="text-[10px] font-black uppercase tracking-widest text-[#0a4a34] dark:text-emerald-400">
                            Subtotal ({groupedExpenses[groupKey].length} {groupedExpenses[groupKey].length === 1 ? 'item' : 'items'}): {getGroupTotal(groupedExpenses[groupKey])}
                          </span>
                        </div>
                      </td>
                    </tr>
                    {groupedExpenses[groupKey].map((expense) => renderExpenseRow(expense))}
                  </React.Fragment>
                ))
              )}
              {filteredExpenses.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-8 py-12 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                    No matching expense logs found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Themed Confirm Modal */}
      <ConfirmModal 
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteExpense}
        title="Delete Expense Entry"
        message={`Are you sure you want to remove the expense entry for "${expenseToDelete?.description}"? This action will permanently update the financial records.`}
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

export default Expenses;
