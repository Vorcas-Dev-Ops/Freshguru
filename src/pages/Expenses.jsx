import React, { useState } from 'react';
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
  const [expenses, setExpenses] = useState([
    { id: 1, date: 'Oct 24, 2023', category: 'FARM PROCUREMENT', description: 'Carrots (Red variety)', qty: '500 Kgs', unitPrice: '₹0.85', amount: '₹425.00' },
    { id: 2, date: 'Oct 23, 2023', category: 'DRIVER SALARY', description: 'Weekly Salary - John Doe', qty: '-', unitPrice: '-', amount: '₹1,200.00' },
    { id: 3, date: 'Oct 22, 2023', category: 'VEHICLE MAINTENANCE', description: 'Truck #042 Oil Change', qty: '-', unitPrice: '-', amount: '₹185.50' },
    { id: 4, date: 'Oct 21, 2023', category: 'FARM PROCUREMENT', description: 'Sweet Corn', qty: '1,200 Kgs', unitPrice: '₹0.60', amount: '₹720.00' },
  ]);

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
    ? (Number(formData.kgs || 0) * Number(formData.pricePerKg || 0)).toFixed(2)
    : Number(formData.amount || 0).toFixed(2);

  const handleAddExpense = () => {
    const finalCategory = isCustomCategory ? formData.customCategory : formData.category;
    if (!finalCategory) return alert('Please specify a category');

    const newExpense = {
      id: Date.now(),
      date: formData.date,
      category: finalCategory.toUpperCase(),
      description: formData.itemName || formData.description || (isSalary ? 'Driver Payout' : 'Expense'),
      qty: isProcurement && formData.kgs ? `${formData.kgs} Kgs` : '-',
      unitPrice: isProcurement && formData.pricePerKg ? `₹${formData.pricePerKg}` : '-',
      amount: `₹${calculatedTotal}`
    };

    setExpenses([newExpense, ...expenses]);
    setShowForm(false);
    setShowSuccessDialog(true);
    // Reset form
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

      {/* Summary Insights Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatBox label="Total Spending" value="₹42,850" trend="+4.2%" icon={Wallet} />
        <StatBox label="Procurement" value="₹28,120" trend="+12.5%" icon={ShoppingBasket} alert />
        <StatBox label="Logistics" value="₹11,430" trend="-2.1%" icon={Truck} />
        <StatBox label="Budget Health" value="75%" sub="Allocated" icon={Scale} />
      </div>

      {/* Chart Card */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between">
        <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">SPENDING BY CATEGORY</p>
        <div className="flex items-center gap-6">
          <div className="relative w-20 h-20">
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <path className="text-slate-100 dark:text-slate-800" strokeDasharray="100, 100" stroke="currentColor" strokeWidth="4" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path className="text-emerald-500" strokeDasharray="65, 100" stroke="currentColor" strokeWidth="4" strokeLinecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-slate-900 dark:text-white">100%</div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[9px] font-black text-slate-500 uppercase tracking-widest">
              <div className="w-2 h-2 rounded-full bg-emerald-500" /> Procurement
            </div>
            <div className="flex items-center gap-2 text-[9px] font-black text-slate-500 uppercase tracking-widest">
              <div className="w-2 h-2 rounded-full bg-slate-400" /> Logistics
            </div>
            <div className="flex items-center gap-2 text-[9px] font-black text-slate-500 uppercase tracking-widest">
              <div className="w-2 h-2 rounded-full bg-red-400" /> Utilities
            </div>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-3xl shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 bg-emerald-50/50 dark:bg-emerald-950/20 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Log New Expense</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Enter the details below to record a new transaction.</p>
              </div>
              <button 
                onClick={() => setShowForm(false)}
                className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <Plus className="w-5 h-5 rotate-45" />
              </button>
            </div>

            <div className="p-8 space-y-6">
              {/* Expense Category */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Expense Category</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600">
                    <Tag className="w-4 h-4" />
                  </div>
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full pl-11 pr-10 py-3.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold outline-none appearance-none focus:ring-2 focus:ring-emerald-500/10 transition-all text-slate-700 dark:text-white"
                  >
                    <option value="Farm Procurement">Farm Procurement</option>
                    <option value="Driver Salary">Driver Salary</option>
                    <option value="Vehicle Maintenance">Vehicle Maintenance</option>
                    <option value="Utilities">Utilities & Rent</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Item Name and Date Row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Item Name</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600">
                      <ShoppingBasket className="w-4 h-4" />
                    </div>
                    <input 
                      type="text" 
                      placeholder="e.g. Fresh Tomatoes"
                      value={formData.itemName}
                      onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                      className="w-full pl-11 pr-4 py-3.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/10 transition-all text-slate-700 dark:text-white"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Date</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <input 
                      type="text" 
                      placeholder="dd/mm/yyyy"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full pl-11 pr-4 py-3.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/10 transition-all text-slate-700 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Weight and Price Row (Procurement Only) */}
              {isProcurement ? (
                <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Weight (KGS)</label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600">
                        <Scale className="w-4 h-4" />
                      </div>
                      <input 
                        type="number" 
                        placeholder="0.00"
                        value={formData.kgs}
                        onChange={(e) => setFormData({ ...formData, kgs: e.target.value })}
                        className="w-full pl-11 pr-4 py-3.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/10 transition-all text-slate-700 dark:text-white"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Price / KG (₹)</label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600">
                        <Wallet className="w-4 h-4" />
                      </div>
                      <input 
                        type="number" 
                        placeholder="0.00"
                        value={formData.pricePerKg}
                        onChange={(e) => setFormData({ ...formData, pricePerKg: e.target.value })}
                        className="w-full pl-11 pr-4 py-3.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/10 transition-all text-slate-700 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Payout Amount (₹)</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600">
                      <Wallet className="w-4 h-4" />
                    </div>
                    <input 
                      type="number" 
                      placeholder="0.00"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      className="w-full pl-11 pr-4 py-3.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/10 transition-all text-slate-700 dark:text-white"
                    />
                  </div>
                </div>
              )}

              {/* Total Summary Card */}
              <div className="p-6 bg-emerald-50/50 dark:bg-emerald-900/10 border-2 border-emerald-100 dark:border-emerald-800 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Calculated Total</p>
                  <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">Sum of item weight and unit price</p>
                </div>
                <div className="text-4xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
                  ₹{calculatedTotal}
                </div>
              </div>

              {/* Additional Notes */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Additional Notes</label>
                <div className="relative">
                  <div className="absolute left-4 top-4 text-slate-400">
                    <Edit2 className="w-4 h-4" />
                  </div>
                  <textarea 
                    rows="3"
                    placeholder="Any specific vendor details, quality remarks, or payment method references..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full pl-11 pr-4 py-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-emerald-500/10 transition-all text-slate-700 dark:text-white resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-4">
              <button 
                onClick={() => setShowForm(false)}
                className="w-full py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl font-black text-[11px] uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddExpense}
                className="w-full flex items-center justify-center gap-3 bg-emerald-700 dark:bg-emerald-600 text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-emerald-800 transition-all shadow-lg shadow-emerald-200 dark:shadow-none"
              >
                <CheckCircle2 className="w-4 h-4" /> Finalize & Log Expense
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Expense History Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight">Expense History</h2>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
              Filter by Category <ChevronDown className="w-3 h-3" />
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-emerald-100 dark:border-emerald-900/30 rounded-xl text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all">
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
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {expenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/30 transition-all">
                  <td className="px-8 py-6 text-xs font-bold text-slate-500 dark:text-slate-400">{expense.date}</td>
                  <td className="px-8 py-6">
                    <span className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest leading-none block w-fit ${
                      expense.category.includes('PROCUREMENT') ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600' :
                      expense.category.includes('SALARY') ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' :
                      expense.category.includes('MAINTENANCE') ? 'bg-red-50 dark:bg-red-900/20 text-red-600' :
                      'bg-slate-50 dark:bg-slate-800 text-slate-600'
                    }`}>
                      {expense.category.split(' ')[0]} {expense.category.split(' ')[1] && <><br />{expense.category.split(' ')[1]}</>}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-sm font-bold text-slate-700 dark:text-slate-300">{expense.description}</td>
                  <td className="px-8 py-6 text-sm font-bold text-slate-500 dark:text-slate-400">{expense.qty}</td>
                  <td className="px-8 py-6 text-sm font-bold text-slate-500 dark:text-slate-400">{expense.unitPrice}</td>
                  <td className="px-8 py-6 text-sm font-black text-slate-900 dark:text-white">{expense.amount}</td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-slate-400 hover:text-emerald-500 transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
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
