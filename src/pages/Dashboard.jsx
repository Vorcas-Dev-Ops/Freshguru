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
  ArrowUpRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [revenueRange, setRevenueRange] = useState('week');
  const [activePoint, setActivePoint] = useState(null);
  const [isOnline, setIsOnline] = useState(() => {
    const saved = localStorage.getItem('store_online_status');
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem('store_online_status', JSON.stringify(isOnline));
  }, [isOnline]);

  const chartData = {
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
    { title: "Today's Revenue", value: "₹1,45,200", trend: "+12%", trendIcon: TrendingUp, color: "text-primary" },
    { title: "Total Orders", value: "124", subtext: "Today", color: "text-slate-600" },
    { title: "Pending Approvals", value: "18", subtext: "Urgent", color: "text-error" },
    { title: "Active Deliveries", value: "42", subtext: "Live", color: "text-primary" },
    { title: "Low Stock Alerts", value: "5", icon: AlertTriangle, color: "text-error", isAlert: true },
  ];

  const quickActions = [
    { label: 'Add Item', sub: 'Update inventory', icon: PlusSquare, color: 'green', path: '/inventory' },
    { label: 'Approve Customers', sub: '6 new applications', icon: UserCheck, color: 'blue', path: '/customers' },
    { label: 'Approve Orders', sub: '18 pending', icon: ClipboardCheck, color: 'orange', path: '/orders' },
    { label: 'Assign Driver', sub: '42 ready', icon: Truck, color: 'purple', path: '/delivery' },
  ];

  const activity = [
    { id: 'FG-9842', user: 'Aman Gupta', items: 12, status: 'Delivered', time: '2 mins ago', color: 'bg-blue-500' },
    { id: 'FG-9845', user: 'Star Retailers', items: 45, status: 'Packed', time: '15 mins ago', color: 'bg-orange-500' },
    { id: 'FG-9848', user: 'Fresh Mart', items: 8, status: 'Approved', time: '32 mins ago', color: 'bg-green-500' },
    { id: 'FG-9852', user: "Nature's Basket", items: 15, status: 'Out for Delivery', time: '1h ago', color: 'bg-purple-500' },
  ];

  const inventory = [
    { name: 'Organic Roma Tomatoes', cat: 'Vegetables', stock: '450 kg', price: '₹45/kg', status: 'In Stock', icon: Apple },
    { name: 'Alphonso Mangoes', cat: 'Fruits', stock: '12 crates', price: '₹1200/crate', status: 'Low Stock', icon: Apple },
    { name: 'Farm Fresh Eggs (30pk)', cat: 'Dairy', stock: '85 units', price: '₹180/unit', status: 'In Stock', icon: Milk },
  ];

  const getChartPath = () => {
    const data = chartData[revenueRange];
    return `M ${data.map(p => `${p.x} ${p.y}`).join(' L ')}`;
  };

  return (
    <>
      {/* ERP Command Header */}
      <div className="flex flex-col xl:flex-row gap-8 mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-[#0a4a34] rounded-lg flex items-center justify-center shadow-lg shadow-green-900/10">
              <LayoutGrid className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Business Overview</h2>
          </div>
          <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Real-time Command Center & Store Intelligence</p>
        </div>

        <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-2 px-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
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
            className={`flex flex-col items-start p-4 bg-gradient-to-br from-emerald-50/50 via-white/80 to-white dark:from-emerald-900/10 dark:via-slate-900/90 dark:to-slate-900 border border-emerald-100/50 dark:border-emerald-500/10 rounded-[2rem] hover:border-${action.color}-500 dark:hover:border-${action.color}-500/50 hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-500 group relative overflow-hidden text-left active:scale-[0.98] h-[120px] justify-between`}
          >
            <div className={`w-9 h-9 rounded-2xl bg-${action.color}-50 dark:bg-${action.color}-900/20 text-${action.color}-600 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-sm`}>
              <action.icon className="w-4 h-4" />
            </div>
            <div>
              <p className="font-black text-slate-900 dark:text-white text-[12px] tracking-tight mb-0.5 leading-tight">{action.label}</p>
              <p className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{action.sub}</p>
            </div>
            
            {/* Brand Glow */}
            <div className={`absolute -right-4 -bottom-4 w-16 h-16 rounded-full bg-emerald-500 opacity-0 group-hover:opacity-10 blur-2xl transition-all duration-700`} />
          </button>
        ))}
      </section>

      {/* KPIs Row */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatBox label="Today's Sales" value="₹1.45L" trend="+12.5%" icon={ShoppingBag} />
        <StatBox label="Total Orders" value="124" trend="+8.2%" icon={ClipboardCheck} />
        <StatBox label="Gross Profit" value="₹42,500" trend="+18.2%" icon={ArrowUpRight} />
        <StatBox label="Net Profit" value="₹38,200" trend="+15.1%" icon={Wallet} />
        <StatBox label="Stock Alerts" value="5" sub="Low Inventory" icon={AlertTriangle} alert />
      </section>

      {/* Middle Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Revenue Trends */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 flex flex-col h-[400px] shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Revenue Trends</h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Sales Performance Overview</p>
            </div>
            <div className="flex bg-slate-50 p-1 rounded-lg">
              {['week', 'month', 'year'].map((range) => (
                <button
                  key={range}
                  onClick={() => setRevenueRange(range)}
                  className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-md transition-all ${
                    revenueRange === range ? 'bg-bottle-green text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {range}
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

        {/* Live Activity */}
        <div className="bg-white border border-slate-200 rounded-2xl flex flex-col h-[400px] shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-900">Live Activity</h2>
            <button className="p-1.5 text-slate-300 hover:text-slate-500 transition-all">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-5">
            {activity.map((item) => (
              <div key={item.id} className="flex gap-3 items-start group cursor-pointer hover:bg-slate-50 p-1 rounded-lg transition-all">
                <div className={`w-2 h-2 rounded-full mt-1.5 ${item.color} group-hover:scale-125 transition-transform`} />
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-0.5">
                    <p className="font-bold text-slate-900 text-[13px]">Order {item.id}</p>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded bg-slate-50 font-bold uppercase tracking-wider text-slate-600`}>{item.status}</span>
                  </div>
                  <p className="text-[11px] text-slate-500">{item.user} • {item.items} items</p>
                  <p className="text-[9px] text-slate-300 font-bold mt-0.5 uppercase">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="p-3 bg-slate-50 text-bottle-green font-bold text-[10px] uppercase tracking-widest hover:underline border-t border-slate-100">
            View All Activities
          </button>
        </div>
      </div>

      {/* Inventory Table */}
      <section className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/30">
          <h2 className="text-lg font-bold text-slate-900">Recent Inventory Moves</h2>
          <button className="text-slate-500 hover:text-bottle-green flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest">
            View Inventory <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Item</th>
                <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Stock Level</th>
                <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Wholesale</th>
                <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {inventory.map((item, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                      <item.icon className="w-4 h-4 text-primary" />
                    </div>
                    <span className="font-semibold text-slate-900 text-sm">{item.name}</span>
                  </td>
                  <td className="px-6 py-4"><span className="px-2 py-0.5 rounded bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-wider">{item.cat}</span></td>
                  <td className={`px-6 py-4 text-sm font-medium ${item.status === 'Low Stock' ? 'text-error' : 'text-slate-600'}`}>{item.stock}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{item.price}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                      item.status === 'In Stock' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-400 hover:text-slate-600"><MoreVertical className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
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

export default Dashboard;
