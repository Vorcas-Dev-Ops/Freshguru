import React, { useState, useEffect } from 'react';
import { 
  PlusSquare, 
  UserCheck, 
  ClipboardCheck, 
  Truck, 
  TrendingUp, 
  AlertTriangle,
  RefreshCw,
  ShoppingBag,
  Milk,
  Apple,
  MoreVertical,
  ChevronRight,
  Wifi,
  WifiOff,
  Power,
  LayoutGrid,
  Wallet,
  ArrowUpRight,
  AlertCircle,
  PieChart,
  Users,
  Activity,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [revenueRange, setRevenueRange] = useState('week');
  const [viewMode, setViewMode] = useState('Sales Overview');
  const [activePoint, setActivePoint] = useState(null);
  const [isOnline, setIsOnline] = useState(() => {
    const saved = localStorage.getItem('store_online_status');
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem('store_online_status', JSON.stringify(isOnline));
  }, [isOnline]);

  const [simulating, setSimulating] = useState({ request: false, placed: false, delivered: false });
  const [showSimulatorModal, setShowSimulatorModal] = useState(false);


  const runSimulation = async (type) => {
    setSimulating(prev => ({ ...prev, [type]: true }));
    try {
      const response = await fetch('http://localhost:5055/api/notifications/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventType: type })
      });
      if (response.ok) {
        await new Promise(r => setTimeout(r, 600));
      }
    } catch (error) {
      console.error('Error simulating event:', error);
    } finally {
      setSimulating(prev => ({ ...prev, [type]: false }));
    }
  };

  const chartData = {
    day: [
      { label: '8am', revenue: '₹12,000', x: 0, y: 85 },
      { label: '10am', revenue: '₹25,000', x: 20, y: 70 },
      { label: '12pm', revenue: '₹48,000', x: 40, y: 40 },
      { label: '2pm', revenue: '₹32,000', x: 60, y: 55 },
      { label: '4pm', revenue: '₹55,000', x: 80, y: 25 },
      { label: '6pm', revenue: '₹42,000', x: 100, y: 35 },
    ],
    week: [
      { label: 'Mon', revenue: '₹42,000', x: 0, y: 75 },
      { label: 'Tue', revenue: '₹55,000', x: 15, y: 60 },
      { label: 'Wed', revenue: '₹48,000', x: 25, y: 65 },
      { label: 'Thu', revenue: '₹82,000', x: 45, y: 40 },
      { label: 'Fri', revenue: '₹62,000', x: 65, y: 55 },
      { label: 'Sat', revenue: '₹1,25,000', x: 85, y: 20 },
      { label: 'Sun', revenue: '₹95,000', x: 100, y: 35 },
    ],
    month: [
      { label: 'W1', revenue: '₹4.2L', x: 0, y: 80 },
      { label: 'W2', revenue: '₹5.8L', x: 33, y: 50 },
      { label: 'W3', revenue: '₹7.2L', x: 66, y: 20 },
      { label: 'W4', revenue: '₹6.1L', x: 100, y: 40 },
    ],
    year: [
      { label: 'Q1', revenue: '₹22L', x: 0, y: 90 },
      { label: 'Q2', revenue: '₹35L', x: 33, y: 70 },
      { label: 'Q3', revenue: '₹58L', x: 66, y: 40 },
      { label: 'Q4', revenue: '₹42L', x: 100, y: 60 },
    ]
  };

  const kpis = [
    { title: "Today's Revenue", value: "₹1,45,200", trend: "+12%", icon: TrendingUp, color: "text-primary", path: '/insights' },
    { title: "Total Orders", value: "124", subtext: "Today", icon: ShoppingBag, color: "text-slate-600", path: '/orders' },
    { title: "Pending Approvals", value: "18", subtext: "Urgent", icon: ClipboardCheck, color: "text-error", path: '/partners' },
    { title: "Active Deliveries", value: "42", subtext: "Live", icon: Truck, color: "text-primary", path: '/delivery' },
    { title: "Low Stock Alerts", value: "5", icon: AlertTriangle, color: "text-error", isAlert: true, path: '/inventory' },
  ];

  const quickActions = [
    { label: 'Add Item', sub: 'Update inventory', icon: PlusSquare, color: 'green', path: '/inventory' },
    { label: 'Approve Partners', sub: '6 new applications', icon: UserCheck, color: 'blue', path: '/partners' },
    { label: 'Approve Orders', sub: '18 pending', icon: ClipboardCheck, color: 'orange', path: '/orders' },
    { label: 'Assign Driver', sub: '42 ready', icon: Truck, color: 'purple', path: '/delivery' },
  ];

  const activity = [
    { id: 'FG-9842', user: 'Aman Gupta', items: 12, status: 'Delivered', time: '2 mins ago', color: 'bg-blue-500' },
    { id: 'FG-9845', user: 'Star Retailers', items: 45, status: 'Packed', time: '15 mins ago', color: 'bg-orange-500' },
    { id: 'FG-9848', user: 'Fresh Mart', items: 8, status: 'Approved', time: '32 mins ago', color: 'bg-green-500' },
    { id: 'FG-9852', user: "Nature's Basket", items: 15, status: 'Out for Delivery', time: '1h ago', color: 'bg-purple-500' },
  ];

  const completedOrders = [
    { id: 'FG-9842', partner: 'Aman Gupta', items: 12, value: '₹14,500', payment: 'Paid', time: '2 mins ago', method: 'UPI' },
    { id: 'FG-9838', partner: 'Star Retailers', items: 45, value: '₹82,400', payment: 'Paid', time: '1h ago', method: 'Bank Transfer' },
    { id: 'FG-9835', partner: 'Fresh Mart', items: 8, value: '₹4,200', payment: 'Paid', time: '3h ago', method: 'Cash' },
  ];

  const getChartPath = () => {
    const data = chartData[revenueRange];
    return `M ${data.map(p => `${p.x} ${p.y}`).join(' L ')}`;
  };

  const [topProducts, setTopProducts] = useState([]);
  const [loadingTop, setLoadingTop] = useState(true);

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        const res = await fetch('http://localhost:5055/api/inventory/top-selling');
        const data = await res.json();
        setTopProducts(data);
      } catch (err) {
        console.error('Failed to fetch top products:', err);
      } finally {
        setLoadingTop(false);
      }
    };
    fetchTopProducts();
  }, []);

  const chartColors = ['#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6'];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* ERP Command Header */}
      <div className="flex flex-col xl:flex-row gap-8 mb-2">
        <div className="flex-1 flex items-start gap-3">
          <div className="w-8 h-8 bg-[#0a4a34] rounded-lg flex items-center justify-center shadow-lg shadow-green-900/10 shrink-0 mt-1">
            <LayoutGrid className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">Business Overview</h2>
            <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1.5">Real-time Command Center & Store Intelligence</p>
          </div>
        </div>

        <div className="flex items-center bg-white dark:bg-slate-900 p-2 px-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex flex-col items-end">
            <p className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Store Status</p>
            <button 
              onClick={() => setIsOnline(!isOnline)}
              className={`relative w-40 h-10 rounded-full transition-all duration-500 shadow-inner group overflow-hidden ${
                isOnline ? 'bg-emerald-500 shadow-emerald-900/20' : 'bg-slate-900 shadow-slate-900/40'
              }`}
            >
              {/* Online Label */}
              <span className={`absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase tracking-widest text-white transition-all duration-500 ${
                isOnline ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
              }`}>Online</span>
              
              {/* Offline Label */}
              <span className={`absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase tracking-widest text-slate-400 transition-all duration-500 ${
                isOnline ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'
              }`}>Offline</span>

              <div className={`absolute top-1 w-8 h-8 bg-white rounded-full shadow-lg transition-all duration-500 transform ${
                isOnline ? 'left-[120px]' : 'left-1'
              } flex items-center justify-center`}>
                <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-500 ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-900'}`} />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Action Command Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {quickActions.map((action) => (
          <button 
            key={action.label}
            onClick={() => navigate(action.path)}
            className={`flex flex-row items-center gap-4 p-4 bg-${action.color === 'green' ? 'emerald' : action.color}-50/50 dark:bg-${action.color === 'green' ? 'emerald' : action.color}-900/10 border border-${action.color === 'green' ? 'emerald' : action.color}-100 dark:border-${action.color === 'green' ? 'emerald' : action.color}-500/20 rounded-[1.5rem] hover:shadow-xl hover:shadow-${action.color === 'green' ? 'emerald' : action.color}-900/5 transition-all duration-500 group relative overflow-hidden text-left active:scale-[0.98] h-[80px] w-full`}
          >
            <div className={`w-12 h-12 rounded-xl bg-${action.color === 'green' ? 'emerald' : action.color}-500 text-white flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-lg shadow-${action.color === 'green' ? 'emerald' : action.color}-500/30 flex-shrink-0`}>
              <action.icon className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <p className={`font-black text-${action.color === 'green' ? 'emerald' : action.color}-900 dark:text-white text-[14px] tracking-tight leading-tight`}>{action.label}</p>
              <p className={`text-[11px] font-bold text-${action.color === 'green' ? 'emerald' : action.color}-500 dark:text-slate-500 mt-0.5`}>{action.sub}</p>
            </div>
            
            {/* Brand Glow */}
            <div className={`absolute -right-4 -bottom-4 w-16 h-16 rounded-full bg-emerald-500 opacity-0 group-hover:opacity-10 blur-2xl transition-all duration-700`} />
          </button>
        ))}
      </section>

      {/* KPIs Row */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        {kpis.map((kpi, idx) => (
          <StatBox 
            key={idx}
            label={kpi.title}
            value={kpi.value}
            trend={kpi.trend}
            sub={kpi.subtext}
            icon={kpi.icon || kpi.trendIcon}
            alert={kpi.isAlert}
            onClick={() => kpi.path && navigate(kpi.path)}
          />
        ))}
      </section>

      {/* Live Event Simulation Deck Modal */}
      {showSimulatorModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800">
            <div className="px-8 py-6 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-slate-50/30 dark:bg-slate-900/50">
              <div>
                <p className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.2em] mb-1">Testing Environment</p>
                <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-wider leading-none">Live Activity & Order Event Simulator</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">Simulate real-time partner requests, order placements, and deliveries instantly to watch notifications fire dynamically.</p>
              </div>
              <button 
                onClick={() => setShowSimulatorModal(false)} 
                className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  disabled={simulating.request}
                  onClick={() => runSimulation('request')}
                  className="flex items-center gap-4 p-4 bg-blue-50/50 hover:bg-blue-50 dark:bg-blue-900/10 dark:hover:bg-blue-900/20 border border-blue-100 dark:border-blue-500/20 hover:border-blue-400 rounded-2xl transition-all duration-300 relative overflow-hidden text-left group active:scale-[0.98] disabled:opacity-50"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-500 text-white flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-lg shadow-blue-500/20 shrink-0">
                    {simulating.request ? (
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                      <Users className="w-5 h-5" />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[12px] font-black text-blue-950 dark:text-white uppercase tracking-wide">Customer App Request</span>
                    <span className="text-[10px] text-blue-500 dark:text-blue-400 font-bold uppercase tracking-tight mt-0.5">Partner Onboarding</span>
                  </div>
                </button>

                <button
                  disabled={simulating.placed}
                  onClick={() => runSimulation('placed')}
                  className="flex items-center gap-4 p-4 bg-orange-50/50 hover:bg-orange-50 dark:bg-orange-900/10 dark:hover:bg-orange-900/20 border border-orange-100 dark:border-orange-500/20 hover:border-orange-400 rounded-2xl transition-all duration-300 relative overflow-hidden text-left group active:scale-[0.98] disabled:opacity-50"
                >
                  <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-lg shadow-orange-500/20 shrink-0">
                    {simulating.placed ? (
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                      <ShoppingBag className="w-5 h-5" />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[12px] font-black text-orange-950 dark:text-white uppercase tracking-wide">Order Placed via App</span>
                    <span className="text-[10px] text-orange-500 dark:text-orange-400 font-bold uppercase tracking-tight mt-0.5">New Customer Order</span>
                  </div>
                </button>

                <button
                  disabled={simulating.delivered}
                  onClick={() => runSimulation('delivered')}
                  className="flex items-center gap-4 p-4 bg-emerald-50/50 hover:bg-emerald-50 dark:bg-emerald-900/10 dark:hover:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-500/20 hover:border-emerald-400 rounded-2xl transition-all duration-300 relative overflow-hidden text-left group active:scale-[0.98] disabled:opacity-50"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-lg shadow-emerald-500/20 shrink-0">
                    {simulating.delivered ? (
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                      <Truck className="w-5 h-5" />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[12px] font-black text-emerald-950 dark:text-white uppercase tracking-wide">Delivery Success</span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-tight mt-0.5">Order Status Shift</span>
                  </div>
                </button>
              </div>
            </div>

            <div className="px-8 py-6 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1.5 rounded-full border border-emerald-100 dark:border-emerald-900/30 shrink-0">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">Simulator Online</span>
              </div>
              <button 
                onClick={() => setShowSimulatorModal(false)} 
                className="px-8 py-3 bg-slate-900 dark:bg-slate-800 text-white hover:bg-black dark:hover:bg-slate-700 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-md"
              >
                Close Control Console
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Middle Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Revenue Trends */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 flex flex-col h-[450px] shadow-sm relative overflow-hidden group">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/50 p-2 pr-6 rounded-2xl border border-slate-100 dark:border-slate-700 hover:border-emerald-500/30 transition-all cursor-pointer">
              <div className="w-10 h-10 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-800">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="flex flex-col">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-0.5">View Mode</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">{viewMode}</span>
                  <ChevronRight className="w-3 h-3 text-slate-300 rotate-90" />
                </div>
              </div>
            </div>

            <div className="flex bg-white dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
              {[
                { label: 'Today', value: 'day' },
                { label: 'This Week', value: 'week' },
                { label: 'This Month', value: 'month' },
                { label: 'FY 2026', value: 'year' }
              ].map((range) => (
                <button
                  key={range.value}
                  onClick={() => setRevenueRange(range.value)}
                  className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-500 ${
                    revenueRange === range.value 
                      ? 'bg-[#0a4a34] text-white shadow-lg shadow-green-900/20' 
                      : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex-1 relative overflow-hidden mt-4">
            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
              <defs>
                <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#1a4d2e" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="#1a4d2e" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path 
                d={getChartPath() + " L 100 100 L 0 100 Z"} 
                fill="url(#chartGradient)"
                className="transition-all duration-500 ease-in-out"
              />

              {/* Vertical Indicator Line */}
              {activePoint && (
                <line
                  x1={activePoint.x}
                  y1="0"
                  x2={activePoint.x}
                  y2="100"
                  stroke="#1a4d2e"
                  strokeWidth="0.5"
                  strokeDasharray="2,2"
                  className="animate-in fade-in duration-300"
                />
              )}

              <path 
                d={getChartPath()} 
                fill="none" 
                stroke="#1a4d2e" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="transition-all duration-500 ease-in-out"
              />

              {/* Interaction areas for tooltip (invisible) */}
              {chartData[revenueRange].map((point, i) => (
                <rect 
                  key={i} 
                  x={point.x - 5}
                  y="0"
                  width="10"
                  height="100"
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setActivePoint(point)}
                  onMouseLeave={() => setActivePoint(null)}
                />
              ))}
            </svg>

            {/* Tooltip */}
            {activePoint && (
              <div 
                className="absolute bg-bottle-green text-white px-3 py-1.5 rounded-lg text-[10px] font-bold shadow-xl animate-in fade-in zoom-in duration-200 pointer-events-none z-10"
                style={{ 
                  left: `${activePoint.x}%`, 
                  top: `${activePoint.y}%`,
                  transform: 'translate(-50%, -130%)'
                }}
              >
                <div className="flex flex-col items-center">
                  <span>{activePoint.label}</span>
                  <span className="text-[12px]">{activePoint.revenue}</span>
                </div>
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-bottle-green rotate-45" />
              </div>
            )}

            <div className="absolute bottom-0 w-full flex justify-between text-[10px] font-bold text-slate-300 uppercase tracking-widest px-2 pt-4 border-t border-slate-50">
              {chartData[revenueRange].map(p => <span key={p.label}>{p.label}</span>)}
            </div>
          </div>
        </div>

        {/* Top Products Analytics Hub */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] flex flex-col h-[450px] shadow-sm overflow-hidden group">
          <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-slate-50/20">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Market Dynamics</p>
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tighter">Sales Distribution</h2>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Live Inventory Sync</span>
            </div>
          </div>

          <div className="flex-1 p-6 flex flex-col items-center relative">
            {loadingTop ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-3">
                <RefreshCw className="w-8 h-8 text-emerald-500 animate-spin" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Analyzing Market Data...</p>
              </div>
            ) : topProducts.length > 0 ? (
              <>
                {/* Top Seller Spotlight */}
                <div className="w-full mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-500/20 rounded-2xl flex items-center justify-between group/spotlight hover:scale-[1.02] transition-all duration-500">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center shadow-sm border border-emerald-100 dark:border-emerald-800">
                      <TrendingUp className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[8px] font-black bg-emerald-500 text-white px-1.5 py-0.5 rounded tracking-widest uppercase">#1 Top Seller</span>
                      </div>
                      <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{topProducts[0].name}</h3>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-emerald-600 tracking-tighter">{topProducts[0].sales_count}</p>
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Units Sold</p>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full gap-8 px-2">
                  {/* Donut Chart */}
                  <div className="relative w-32 h-32 flex-shrink-0">
                    <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                      {(() => {
                        let currentOffset = 0;
                        const totalSales = topProducts.reduce((sum, p) => sum + parseInt(p.sales_count || 0), 0) || 1;
                        
                        return topProducts.map((product, i) => {
                          const percent = (parseInt(product.sales_count || 0) / totalSales) * 100;
                          const dashArray = `${percent} ${100 - percent}`;
                          const dashOffset = -currentOffset;
                          currentOffset += percent;
                          
                          return (
                            <circle
                              key={i}
                              cx="50"
                              cy="50"
                              r="40"
                              fill="transparent"
                              stroke={chartColors[i % chartColors.length]}
                              strokeWidth="12"
                              strokeDasharray={dashArray}
                              strokeDashoffset={dashOffset}
                              className="transition-all duration-1000 ease-in-out hover:stroke-width-[14] cursor-pointer"
                              pathLength="100"
                            />
                          );
                        });
                      })()}
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-xl font-black text-slate-900 dark:text-white tracking-tighter">
                        {Math.round((parseInt(topProducts[0].sales_count) / topProducts.reduce((sum, p) => sum + parseInt(p.sales_count || 0), 0)) * 100)}%
                      </span>
                      <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Dominance</span>
                    </div>
                  </div>

                  {/* Refined Legend */}
                  <div className="flex-1 space-y-3 max-h-[180px] overflow-y-auto custom-scrollbar pr-2">
                    {topProducts.map((product, i) => (
                      <div key={i} className="flex flex-col gap-1 group/item">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: chartColors[i % chartColors.length] }} />
                            <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase truncate max-w-[100px] tracking-tight transition-colors group-hover/item:text-emerald-500">{product.name}</span>
                          </div>
                          <span className="text-[10px] font-black text-slate-900 dark:text-white tracking-tighter">{product.sales_count}</span>
                        </div>
                        <div className="w-full h-1 bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full transition-all duration-1000 ease-out rounded-full"
                            style={{ 
                              width: `${(parseInt(product.sales_count) / topProducts.reduce((sum, p) => sum + parseInt(p.sales_count || 0), 0)) * 100}%`,
                              backgroundColor: chartColors[i % chartColors.length]
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
                <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <ShoppingBag className="w-8 h-8 text-slate-300" />
                </div>
                <div>
                  <p className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-widest mb-1">No Transaction Logs</p>
                  <p className="text-[9px] font-bold text-slate-400 max-w-[150px]">Market insights will appear once inventory begins moving.</p>
                </div>
                <button 
                  onClick={() => navigate('/inventory')}
                  className="px-6 py-2 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest rounded-full hover:bg-emerald-600 transition-colors"
                >
                  Load Inventory
                </button>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Recently Completed Orders Table */}
      <section className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/30">
          <h2 className="text-lg font-bold text-slate-900">Recently Completed Orders</h2>
          <button 
            onClick={() => navigate('/orders')}
            className="text-slate-500 hover:text-bottle-green flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest"
          >
            View All Orders <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Partner</th>
                <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Items</th>
                <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Value</th>
                <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Payment</th>
                <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {completedOrders.map((order, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-black text-slate-900 text-sm tracking-tight">{order.id}</span>
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{order.time}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-slate-600">{order.partner}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-slate-900">{order.items} Items</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-emerald-700">{order.value}</span>
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">{order.method}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 rounded bg-green-100 text-green-700 text-[9px] font-black uppercase tracking-widest">
                      {order.payment}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-slate-300 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-all">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

const StatBox = ({ label, value, trend, sub, icon: Icon, alert, onClick }) => (
  <div 
    onClick={onClick}
    className={`bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-500 group relative overflow-hidden ${
      onClick ? 'cursor-pointer hover:border-emerald-500/20 active:scale-[0.98]' : ''
    }`}
  >
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
          <h3 className={`text-3xl font-black tracking-tighter tabular-nums ${
            alert ? 'text-red-600 animate-pulse' : 'text-slate-900 dark:text-white'
          }`}>{value}</h3>
          {sub && <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{sub}</span>}
        </div>
      </div>
    </div>
    
    <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-700 ${
      alert ? 'bg-red-500' : 'bg-[#0a4a34]'
    }`} />
  </div>
);

export default Dashboard;
