import React, { useState, useEffect } from 'react';
import { 
  Download, 
  CreditCard, 
  Wallet, 
  Banknote, 
  FileText, 
  Filter, 
  Calendar,
  ChevronRight,
  X,
  Printer,
  CheckCircle2,
  TrendingUp,
  Receipt,
  Package,
  Truck,
  Users,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  LayoutGrid,
  Search,
  MoreVertical,
  Layers,
  ShoppingBag,
  ExternalLink,
  ChevronDown,
  ShoppingBasket,
  History,
  AlertCircle,
  Percent,
  FileCheck,
  Calculator,
  GanttChartSquare,
  Landmark,
  ShieldCheck,
  ArrowRightLeft
} from 'lucide-react';

const Reports = () => {
  const [selectedGroup, setSelectedGroup] = useState('sales');
  const [activeReport, setActiveReport] = useState('daily-sales');
  const [dateRange, setDateRange] = useState('This Month');
  const [reportData, setReportData] = useState([]);
  const [reportLoading, setReportLoading] = useState(false);

  useEffect(() => {
    fetchReportData();
  }, [activeReport]);

  const fetchReportData = async () => {
    setReportLoading(true);
    const token = localStorage.getItem('admin_token');
    
    // Map UI report IDs to API endpoints
    const endpointMap = {
      'daily-sales': 'daily-sales',
      'weekly-sales': 'weekly-sales',
      'monthly-revenue': 'monthly-revenue',
      'product-sales': 'product-sales',
      'customer-sales': 'partner-sales',
      'category-sales': 'category-sales',
      'top-selling': 'top-selling',
      'current-stock': 'current-stock',
      'low-stock': 'low-stock',
      'expense-reports': 'expense-summary',
      'delivered-orders': 'delivered-orders',
      'failed-deliveries': 'failed-deliveries',
      'credit-customers': 'credit-partners',
      'customer-statements': 'partner-statements',
      'supplier-purchases': 'supplier-purchases',
      'daily-purchases': 'daily-purchases',
      'purchase-history': 'purchase-history',
      'inventory-valuation': 'inventory-valuation',
      'stock-movement': 'stock-movement',
      'loyalty-report': 'loyalty-report',
      'customer-history': 'customer-history',
      'paid-invoices': 'paid-invoices',
      'pending-payments': 'pending-payments',
      'driver-performance': 'driver-performance',
      'profit-loss': 'profit-loss',
      'revenue-summary': 'revenue-summary',
      'gst-summary': 'gst-summary',
      'hsn-reports': 'hsn-reports',
      'overdue-payments': 'overdue-payments',
      'damaged-stock': 'damaged-stock',
      'tax-collected': 'tax-collected',
      'delivery-delays': 'delivery-delays',
      'cash-flow': 'cash-flow',
      'supplier-payments': 'supplier-purchases',
      'outstanding-payments': 'credit-partners',
      'qr-history': 'qr-history',
      'delivery-adjustments': 'delivery-adjustments',
      'balance-sheet': 'balance-sheet',
      'credit-utilization': 'credit-utilization',
      'tax-invoices': 'delivered-orders'
    };

    const endpoint = endpointMap[activeReport];
    if (!endpoint) {
      setReportData([]);
      setReportLoading(false);
      return;
    }

    try {
      const response = await fetch(`http://localhost:5055/api/reports/${endpoint}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setReportData(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setReportLoading(false);
    }
  };

  const getTableHeaders = () => {
    if (activeReport === 'daily-sales') return ['Date', 'Order Count', 'Total Revenue'];
    if (activeReport === 'weekly-sales') return ['Week', 'Order Count', 'Total Revenue'];
    if (activeReport === 'monthly-revenue') return ['Month', 'Total Revenue'];
    if (activeReport === 'product-sales' || activeReport === 'top-selling') return ['Product Name', 'Units Sold', 'Total Revenue'];
    if (activeReport === 'customer-sales') return ['Partner Name', 'Order Count', 'Total Sales'];
    if (activeReport === 'category-sales') return ['Category', 'Total Revenue'];
    if (activeReport === 'current-stock') return ['Product', 'Stock Level', 'Unit', 'Rate', 'Total Valuation'];
    if (activeReport === 'low-stock') return ['Product', 'Current Qty', 'Min Threshold'];
    if (activeReport === 'expense-reports') return ['Category', 'Total Amount'];
    if (activeReport === 'delivered-orders' || activeReport === 'failed-deliveries') return ['Order ID', 'Partner', 'Time', 'Amount'];
    if (activeReport === 'credit-customers') return ['Partner Name', 'Credit Balance'];
    if (activeReport === 'customer-statements') return ['Partner Name', 'Total Orders Value', 'Order Count'];
    if (activeReport === 'supplier-purchases') return ['Supplier/Admin', 'Total Value', 'Record Count'];
    if (activeReport === 'daily-purchases') return ['Date', 'Total Purchase Value'];
    if (activeReport === 'purchase-history') return ['Date', 'Item/Description', 'Amount', 'User'];
    if (activeReport === 'inventory-valuation') return ['Category', 'Total Valuation'];
    if (activeReport === 'stock-movement') return ['Product', 'Units Sold', 'Remaining Stock'];
    if (activeReport === 'loyalty-report') return ['Partner Name', 'Loyalty Points'];
    if (activeReport === 'customer-history') return ['Partner Name', 'Last Order Date', 'Total Orders'];
    if (activeReport === 'paid-invoices' || activeReport === 'pending-payments') return ['Order ID', 'Partner', 'Amount', 'Status'];
    if (activeReport === 'driver-performance') return ['Driver Name', 'Total Deliveries', 'Rating'];
    if (activeReport === 'profit-loss') return ['Metric', 'Value'];
    if (activeReport === 'revenue-summary') return ['Month', 'Total Revenue'];
    if (activeReport === 'gst-summary') return ['Tax Tier', 'Estimated GST Collected'];
    if (activeReport === 'hsn-reports') return ['HSN Code', 'Total Stock', 'Valuation'];
    if (activeReport === 'overdue-payments') return ['Order ID', 'Partner', 'Amount', 'Status'];
    if (activeReport === 'damaged-stock') return ['Product', 'Qty', 'Reason'];
    if (activeReport === 'tax-collected') return ['Month', 'Tax Collected'];
    if (activeReport === 'delivery-delays' || activeReport === 'delivery-adjustments') return ['Order ID', 'Partner', 'Status', 'Value'];
    if (activeReport === 'cash-flow') return ['Date', 'Net Flow'];
    if (activeReport === 'qr-history') return ['Order ID', 'Partner', 'Method', 'Value'];
    if (activeReport === 'balance-sheet' || activeReport === 'credit-utilization') return ['Metric/Partner', 'Value'];
    return ['Label', 'Value'];
  };

  const getTableRows = () => {
    return reportData.map(item => {
      if (activeReport === 'daily-sales' || activeReport === 'weekly-sales') return [item.label, item.count, `₹${item.value}`];
      if (activeReport === 'monthly-revenue') return [item.label, `₹${item.value}`];
      if (activeReport === 'product-sales' || activeReport === 'top-selling') return [item.label, item.units, `₹${item.value}`];
      if (activeReport === 'customer-sales') return [item.label, item.count, `₹${item.value}`];
      if (activeReport === 'category-sales') return [item.label, `₹${item.value}`];
      if (activeReport === 'current-stock') return [item.label, item.qty, item.unit, `₹${item.rate}`, `₹${item.value}`];
      if (activeReport === 'low-stock') return [item.label, item.qty, item.min];
      if (activeReport === 'expense-reports') return [item.label, `₹${item.value}`];
      if (activeReport === 'delivered-orders' || activeReport === 'failed-deliveries') return [item.label, item.entity, item.time, `₹${item.value}`];
      if (activeReport === 'credit-customers') return [item.label, `₹${item.value}`];
      if (activeReport === 'customer-statements') return [item.label, `₹${item.value}`, item.count];
      if (activeReport === 'supplier-purchases') return [item.label, `₹${item.value}`, item.count];
      if (activeReport === 'daily-purchases' || activeReport === 'revenue-summary') return [item.label, `₹${item.value}`];
      if (activeReport === 'purchase-history') return [item.label, item.entity, `₹${item.value}`, item.user];
      if (activeReport === 'inventory-valuation') return [item.label, `₹${item.value}`];
      if (activeReport === 'stock-movement') return [item.label, item.units_out || 0, item.remaining];
      if (activeReport === 'loyalty-report') return [item.label, item.value];
      if (activeReport === 'customer-history') return [item.label, item.last_order ? new Date(item.last_order).toLocaleDateString() : 'N/A', item.total_orders];
      if (activeReport === 'paid-invoices' || activeReport === 'pending-payments') return [item.label, item.entity, `₹${item.value}`, item.status];
      if (activeReport === 'driver-performance') return [item.label, item.deliveries, item.value];
      if (activeReport === 'profit-loss') return [item.label, `₹${parseFloat(item.value).toLocaleString()}`];
      if (activeReport === 'gst-summary') return [item.label, `₹${item.tax_value}`];
      if (activeReport === 'hsn-reports') return [item.label, item.stock, `₹${item.valuation}`];
      if (activeReport === 'overdue-payments') return [item.label, item.entity, `₹${item.value}`, item.status];
      if (activeReport === 'damaged-stock') return [item.label, item.qty, item.reason];
      if (activeReport === 'tax-collected') return [item.label, `₹${item.tax_value}`];
      if (activeReport === 'delivery-delays' || activeReport === 'delivery-adjustments') return [item.label, item.entity, item.reason, `₹${item.value}`];
      if (activeReport === 'cash-flow') return [item.label, `₹${item.value}`];
      if (activeReport === 'qr-history') return [item.label, item.entity, item.method, `₹${item.value}`];
      if (activeReport === 'balance-sheet' || activeReport === 'credit-utilization') return [item.label, `₹${parseFloat(item.value).toLocaleString()}`];
      return [item.label || 'N/A', item.value || 0];
    });
  };

  const reportGroups = [
    {
      id: 'sales',
      label: 'Sales Reports',
      icon: BarChart3,
      reports: [
        { id: 'daily-sales', label: 'Daily Sales' },
        { id: 'weekly-sales', label: 'Weekly Sales' },
        { id: 'monthly-revenue', label: 'Monthly Revenue' },
        { id: 'product-sales', label: 'Product-wise Sales' },
        { id: 'customer-sales', label: 'Partner-wise Sales' },
        { id: 'category-sales', label: 'Category-wise Sales' },
        { id: 'top-selling', label: 'Top Selling Products' }
      ]
    },
    {
      id: 'purchase',
      label: 'Purchase Reports',
      icon: ShoppingBasket,
      reports: [
        { id: 'supplier-purchases', label: 'Supplier Purchases' },
        { id: 'daily-purchases', label: 'Daily Purchases' },
        { id: 'purchase-history', label: 'Purchase History' },
        { id: 'supplier-payments', label: 'Supplier Payment Reports' }
      ]
    },
    {
      id: 'inventory',
      label: 'Inventory Reports',
      icon: Layers,
      reports: [
        { id: 'current-stock', label: 'Current Stock' },
        { id: 'low-stock', label: 'Low Stock Items' },
        { id: 'damaged-stock', label: 'Damaged Stock' },
        { id: 'stock-movement', label: 'Stock Movement History' },
        { id: 'inventory-valuation', label: 'Inventory Valuation' }
      ]
    },
    {
      id: 'partner',
      label: 'Partner Reports',
      icon: Users,
      reports: [
        { id: 'customer-statements', label: 'Partner Statements' },
        { id: 'credit-customers', label: 'Credit Partners' },
        { id: 'loyalty-report', label: 'Loyalty Points Report' },
        { id: 'customer-history', label: 'Partner Purchase History' },
        { id: 'outstanding-payments', label: 'Outstanding Payments' }
      ]
    },
    {
      id: 'payment',
      label: 'Payment Reports',
      icon: Wallet,
      reports: [
        { id: 'paid-invoices', label: 'Paid Invoices' },
        { id: 'pending-payments', label: 'Pending Payments' },
        { id: 'overdue-payments', label: 'Overdue Payments' },
        { id: 'qr-history', label: 'QR Payment History' },
        { id: 'cash-flow', label: 'Cash Flow Summary' }
      ]
    },
    {
      id: 'delivery',
      label: 'Delivery Reports',
      icon: Truck,
      reports: [
        { id: 'delivered-orders', label: 'Delivered Orders' },
        { id: 'failed-deliveries', label: 'Failed Deliveries' },
        { id: 'driver-performance', label: 'Driver Performance' },
        { id: 'delivery-delays', label: 'Delivery Delays' },
        { id: 'delivery-adjustments', label: 'Delivery Adjustments' }
      ]
    },
    {
      id: 'financial',
      label: 'Financial Reports',
      icon: Landmark,
      reports: [
        { id: 'profit-loss', label: 'Profit & Loss' },
        { id: 'revenue-summary', label: 'Revenue Summary' },
        { id: 'expense-reports', label: 'Expense Reports' },
        { id: 'balance-sheet', label: 'Balance Sheet' },
        { id: 'credit-utilization', label: 'Credit Utilization' }
      ]
    },
    {
      id: 'gst',
      label: 'GST & Tax Reports',
      icon: FileCheck,
      reports: [
        { id: 'gst-summary', label: 'GST Summary' },
        { id: 'tax-collected', label: 'Tax Collected' },
        { id: 'tax-invoices', label: 'Tax Invoices' },
        { id: 'hsn-reports', label: 'HSN/SAC Reports' }
      ]
    }
  ];

  const renderActiveContent = () => {
    const isInventory = selectedGroup === 'inventory';
    const isFinancial = selectedGroup === 'financial';
    const isSales = selectedGroup === 'sales';

    // Mock data for SVG Chart
    const linePoints = "0,80 15,60 30,75 45,40 60,55 75,20 90,35 100,25";
    const areaPoints = `0,100 0,80 15,60 30,75 45,40 60,55 75,20 90,35 100,25 100,100`;

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-100 dark:border-emerald-500/20">
              <BarChart3 className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">
                {reportGroups.flatMap(g => g.reports).find(r => r.id === activeReport)?.label}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Live Intelligence • {dateRange} • {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="group flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-emerald-500 hover:text-emerald-600 transition-all shadow-sm active:scale-95">
              <Printer className="w-4 h-4 group-hover:scale-110 transition-transform" /> Print
            </button>
            <div className="flex gap-1">
              <button className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-l-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-900/10 active:scale-95">
                <Download className="w-4 h-4" /> EXCEL
              </button>
              <button className="flex items-center gap-2 px-6 py-3 bg-[#0a4a34] text-white rounded-r-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all active:scale-95">
                PDF
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Metrics Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard 
            label={isInventory ? "Total Valuation" : isFinancial ? "Gross Revenue" : "Gross Sales"} 
            value={isInventory ? "₹12.4 Cr" : "₹42.85L"} 
            sub="Base Value" 
            trend="+12%" 
            icon={isInventory ? Layers : isFinancial ? Landmark : BarChart3} 
            color="emerald" 
          />
          <StatCard 
            label={isInventory ? "Critical Stock" : isFinancial ? "Net Profit" : "Net Growth"} 
            value={isInventory ? "12 Items" : isFinancial ? "₹8.42L" : "14.2%"} 
            sub="Delta Impact" 
            trend={isInventory ? "-2%" : "+5.2%"} 
            icon={isInventory ? AlertCircle : TrendingUp} 
            color={isInventory ? "orange" : "blue"} 
          />
          <StatCard 
            label={isInventory ? "Stock Velocity" : isFinancial ? "Tax Liability" : "Avg Order Val"} 
            value={isInventory ? "4.2x" : isFinancial ? "₹2.14L" : "₹8,240"} 
            sub="Efficiency" 
            trend="+4%" 
            icon={GanttChartSquare} 
            color="orange" 
          />
          <StatCard 
            label={isInventory ? "Health Score" : isFinancial ? "Liquidity" : "Retention"} 
            value={isInventory ? "Stable" : "Positive"} 
            sub="Stability Index" 
            trend="+1.2%" 
            icon={ShieldCheck} 
            color="purple" 
          />
        </div>

        {/* Advanced Visualization Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[3rem] p-10 shadow-sm overflow-hidden relative group">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Analytical visualization</p>
              <h4 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">
                {isSales ? 'Revenue Charts & Trends' : isInventory ? 'Stock Movement Portfolio' : 'Financial Statement Analysis'}
              </h4>
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/20" />
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Current Period</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700" />
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Last Period</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-3">
               <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-inner">
                {['Units', 'Value', 'Volume'].map(mode => (
                  <button 
                    key={mode} 
                    className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      mode === 'Value' 
                        ? 'bg-[#0a4a34] text-white shadow-lg shadow-green-900/20' 
                        : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
              <p className="text-[8px] font-black text-slate-300 uppercase tracking-[0.2em]">Toggle display metric</p>
            </div>
          </div>
          
          {/* Main Chart Area */}
          <div className="h-[300px] w-full relative">
            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              {/* Background Grid Lines */}
              {[0, 25, 50, 75, 100].map(y => (
                <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="currentColor" className="text-slate-50 dark:text-slate-800" strokeWidth="0.1" />
              ))}
              
              {/* Previous Period Ghost Line */}
              <path 
                d="M 0,90 L 20,85 L 40,92 L 60,78 L 80,82 L 100,75" 
                fill="none" 
                stroke="currentColor" 
                className="text-slate-100 dark:text-slate-800" 
                strokeWidth="1.5" 
                strokeDasharray="4,4"
              />

              {/* Main Area */}
              <polyline points={areaPoints} fill="url(#areaGradient)" className="transition-all duration-1000 ease-in-out" />
              
              {/* Main Line */}
              <polyline 
                points={linePoints} 
                fill="none" 
                stroke="#10b981" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                filter="url(#glow)"
                className="transition-all duration-1000 ease-in-out"
              />
              
              {/* Data Points */}
              {linePoints.split(' ').map((p, i) => {
                const [x, y] = p.split(',');
                return (
                  <circle 
                    key={i} 
                    cx={x} 
                    cy={y} 
                    r="1.2" 
                    fill="white" 
                    stroke="#0a4a34" 
                    strokeWidth="0.8" 
                    className="hover:r-2 transition-all cursor-pointer shadow-xl"
                  />
                );
              })}
            </svg>
            
            {/* Legend Labels */}
            <div className="absolute -bottom-6 w-full flex justify-between text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest px-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                <span key={day} className="hover:text-emerald-500 transition-colors cursor-default">{day}</span>
              ))}
            </div>
          </div>
          
          {/* Subtle Background Glow */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/5 blur-[100px] pointer-events-none rounded-full" />
        </div>

        {/* Split Section: Insights & Trends */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           {/* Top Entities / Insights */}
           <div className="bg-slate-50/50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 rounded-[3rem] p-10">
              <div className="flex items-center justify-between mb-8">
                <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Performance Insights</h4>
                <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center text-emerald-600">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
              
              <div className="space-y-6">
                {[
                  { label: 'Partner Retention', value: 85, color: 'emerald' },
                  { label: 'Order Frequency', value: 64, color: 'blue' },
                  { label: 'Market Penetration', value: 42, color: 'orange' },
                  { label: 'Platform Stability', value: 92, color: 'purple' },
                ].map((item, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</span>
                      <span className="text-xs font-black text-slate-900 dark:text-white tracking-tight">{item.value}%</span>
                    </div>
                    <div className="h-2 w-full bg-white dark:bg-slate-900 rounded-full border border-slate-100 dark:border-slate-800 overflow-hidden shadow-inner p-0.5">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 bg-${item.color === 'emerald' ? 'emerald' : item.color}-500 shadow-lg shadow-${item.color === 'emerald' ? 'emerald' : item.color}-500/20`}
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
           </div>

           {/* Quick Action Summary */}
           <div className="bg-[#0a4a34] rounded-[3rem] p-10 text-white relative overflow-hidden group shadow-2xl shadow-green-900/20 flex flex-col justify-between">
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <TrendingUp className="w-5 h-5 text-emerald-300" />
                  </div>
                  <h4 className="text-xs font-black uppercase tracking-[0.2em] text-emerald-100/60">Executive Summary</h4>
                </div>
                <h3 className="text-3xl font-black tracking-tighter leading-tight mb-4">
                  Overall performance is <span className="text-emerald-400">up 14%</span> this quarter.
                </h3>
                <p className="text-[13px] font-bold text-emerald-100/60 leading-relaxed max-w-[80%]">
                  Consolidated revenue streams show stable growth across B2B channels, with significant optimization in delivery overheads.
                </p>
              </div>
              
              <button className="relative z-10 w-full mt-10 py-4 bg-emerald-500 hover:bg-emerald-400 text-[#0a4a34] font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl transition-all shadow-xl shadow-emerald-900/40 active:scale-[0.98]">
                Download Comprehensive Audit
              </button>
              
              {/* Background Shapes */}
              <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/5 rounded-full blur-3xl opacity-20 transition-transform group-hover:scale-150 duration-1000" />
           </div>
        </div>

        {/* Detailed Data Ledger */}
        <ReportTable 
          title={reportGroups.flatMap(g => g.reports).find(r => r.id === activeReport)?.label || 'Report Ledger'}
          headers={getTableHeaders()}
          rows={getTableRows()}
          loading={reportLoading}
        />
      </div>
    );
  };

  return (
    <div className="flex flex-col xl:flex-row gap-8 min-h-[800px] animate-in fade-in duration-500">
      {/* Left Sub-Sidebar (Group Navigation) */}
      <div className="w-full xl:w-80 flex flex-col gap-6">
        {/* Navigation Categories */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-4 shadow-sm space-y-2 overflow-hidden">
          {reportGroups.map(group => (
            <div key={group.id} className="space-y-1">
              <button 
                onClick={() => setSelectedGroup(group.id === selectedGroup ? '' : group.id)}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                  selectedGroup === group.id 
                    ? 'bg-emerald-50/80 dark:bg-emerald-500/10 text-emerald-900 dark:text-emerald-400' 
                    : 'text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <group.icon className={`w-5 h-5 ${selectedGroup === group.id ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span className="text-[14px] font-bold tracking-tight">{group.label}</span>
                </div>
                <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${selectedGroup === group.id ? 'rotate-180' : 'text-slate-400'}`} />
              </button>
              
              {selectedGroup === group.id && (
                <div className="pl-11 pr-2 py-1 space-y-0.5 animate-in slide-in-from-top-2 duration-300">
                  {group.reports.map(report => (
                    <button
                      key={report.id}
                      onClick={() => setActiveReport(report.id)}
                      className={`w-full text-left px-4 py-2 rounded-lg text-[13px] font-semibold transition-all ${
                        activeReport === report.id 
                          ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10' 
                          : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      {report.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Quick Range Selector */}
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] p-6 border border-slate-100 dark:border-slate-800">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">Date threshold</p>
          <div className="grid grid-cols-2 gap-2">
            {['Today', 'Week', 'Month', 'FY 2026'].map(range => (
              <button 
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-4 py-2.5 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all ${
                  dateRange === range 
                    ? 'bg-white dark:bg-slate-900 text-[#0a4a34] dark:text-emerald-400 shadow-sm border border-slate-100 dark:border-slate-700' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right Content Area */}
      <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[3rem] p-4 md:p-10 shadow-sm min-h-[800px] overflow-hidden flex flex-col gap-10">
        
        {/* Global Hub Header */}
        <div className="flex flex-col xl:flex-row gap-8 pb-10 border-b border-slate-50 dark:border-slate-800">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-[#0a4a34] rounded-lg flex items-center justify-center shadow-lg shadow-green-900/10">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Analytical Hub</h2>
            </div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Enterprise Intelligence Hub & Business Performance Analytics</p>
          </div>
          
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-100 dark:border-slate-700 h-12">
            <LayoutGrid className="w-4 h-4 text-slate-400 ml-2" />
            <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-2" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 mr-4">Grid View</span>
          </div>
        </div>

        {renderActiveContent()}
      </div>
    </div>
  );
};

/* --- Sub-Components --- */

const StatCard = ({ label, value, sub, trend, icon: Icon, color }) => {
  const themes = {
    emerald: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/5',
    blue: 'text-blue-600 dark:text-blue-400 bg-blue-500/5',
    orange: 'text-orange-600 dark:text-orange-400 bg-orange-500/5',
    purple: 'text-purple-600 dark:text-purple-400 bg-purple-500/5'
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-700 group relative overflow-hidden">
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-8">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-700 group-hover:scale-110 group-hover:rotate-12 ${themes[color] || themes.emerald}`}>
            {Icon && <Icon className="w-7 h-7" />}
          </div>
          {trend && (
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider ${
              trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
            }`}>
              <TrendingUp className={`w-3.5 h-3.5 ${trend.startsWith('+') ? '' : 'rotate-180'}`} />
              {trend}
            </div>
          )}
        </div>
        
        <div className="space-y-1">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{label}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter tabular-nums leading-none">{value}</h3>
            {sub && <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{sub}</span>}
          </div>
        </div>
      </div>
      
      {/* Visual Depth Elements */}
      <div className={`absolute -right-8 -bottom-8 w-32 h-32 rounded-full blur-[60px] opacity-0 group-hover:opacity-20 transition-opacity duration-1000 bg-${color === 'emerald' ? 'emerald' : color === 'blue' ? 'blue' : 'orange'}-500`} />
      <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-10 transition-opacity duration-700">
        <Icon className="w-24 h-24 text-slate-900 dark:text-white -mr-12 -mt-12" />
      </div>
    </div>
  );
};

const ReportTable = ({ title, headers, rows, loading }) => (
  <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[3rem] overflow-hidden shadow-sm group">
    <div className="px-10 py-8 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-1.5 h-6 bg-[#0a4a34] rounded-full" />
        <div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">{title}</h3>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Comprehensive Data Ledger</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 focus-within:border-emerald-500/50 transition-all">
          <Search className="w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Global search..." className="bg-transparent border-none text-[11px] font-bold text-slate-900 dark:text-white focus:ring-0 w-48 placeholder:text-slate-400" />
        </div>
        <button className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all">
          <Filter className="w-4 h-4" />
        </button>
      </div>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50/50 dark:bg-slate-800/50">
            {headers.map((h, i) => (
              <th key={i} className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
          {loading ? (
            <tr>
              <td colSpan={headers.length} className="px-10 py-20 text-center">
                <div className="flex flex-col items-center gap-4">
                   <div className="w-8 h-8 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aggregating Intelligence...</p>
                </div>
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={headers.length} className="px-10 py-20 text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No data available for this report</p>
              </td>
            </tr>
          ) : rows.map((row, i) => (
            <tr key={i} className="hover:bg-emerald-50/30 dark:hover:bg-emerald-900/5 transition-colors group/row">
              {row.map((cell, j) => {
                const isStatus = ['Delivered', 'Pending', 'Completed', 'Approved'].includes(cell);
                return (
                  <td key={j} className="px-10 py-6">
                    {isStatus ? (
                      <div className="flex items-center gap-2">
                         <div className={`w-1.5 h-1.5 rounded-full ${
                          cell === 'Delivered' || cell === 'Completed' ? 'bg-emerald-500' :
                          cell === 'Pending' ? 'bg-amber-500' : 'bg-blue-500'
                        }`} />
                        <span className={`text-[10px] font-black uppercase tracking-widest ${
                          cell === 'Delivered' || cell === 'Completed' ? 'text-emerald-600' :
                          cell === 'Pending' ? 'text-amber-600' : 'text-blue-600'
                        }`}>
                          {cell}
                        </span>
                      </div>
                    ) : (
                      <span className={`text-[13px] font-bold tracking-tight ${cell && String(cell).startsWith('₹') ? 'text-[#0a4a34] dark:text-emerald-400 font-black text-[14px]' : 'text-slate-600 dark:text-slate-300'}`}>
                        {cell}
                      </span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div className="px-10 py-6 bg-slate-50/30 dark:bg-slate-800/20 border-t border-slate-50 dark:border-slate-800 flex justify-between items-center">
       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Showing {rows.length} records</span>
       <div className="flex gap-2">
         {[1].map(p => (
           <button key={p} className={`w-8 h-8 rounded-lg text-[10px] font-black transition-all ${p === 1 ? 'bg-[#0a4a34] text-white' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>{p}</button>
         ))}
       </div>
    </div>
  </div>
);

export default Reports;
