import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  ShoppingBag,
  Package, 
  Truck, 
  BarChart3, 
  HelpCircle, 
  LogOut, 
  Leaf,
  Bell,
  Settings as SettingsIcon,
  ShieldCheck
} from 'lucide-react';
import { useUser } from '../context/UserContext';

const Sidebar = () => {
  const location = useLocation();
  
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'Customers', path: '/customers' },
    { icon: ShoppingBag, label: 'Orders', path: '/orders' },
    { icon: Package, label: 'Products', path: '/products' },
    { icon: Truck, label: 'Logistics', path: '/delivery' },
    { icon: BarChart3, label: 'Insights', path: '/reports' },
    { icon: SettingsIcon, label: 'Settings', path: '/settings' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-[260px] bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 flex flex-col py-4 z-40 transition-colors duration-300">
      <Link to="/" className="px-6 mb-8 flex items-center gap-2.5">
        <div className="w-10 h-10 bg-emerald-50/80 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center">
          <Leaf className="text-bottle-green dark:text-green-400 w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tighter leading-none logo-font text-bottle-green dark:text-green-400">Fresh Guru</h1>
          <p className="text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] font-bold opacity-60 mt-0.5">ADMIN PORTAL</p>
        </div>
      </Link>
      
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
          return (
            <Link
              key={item.label}
              to={item.path}
              className={`flex items-center px-6 py-3 transition-all ${
                isActive 
                  ? 'text-bottle-green dark:text-green-400 bg-bottle-green/5 dark:bg-green-400/5 border-l-4 border-bottle-green dark:border-green-400 font-semibold' 
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 font-semibold'
              }`}
            >
              <item.icon className="mr-3 w-5 h-5" />
              <span className="text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto px-6 border-t border-slate-100 dark:border-slate-800 pt-4 space-y-1">
        <button className="w-full flex items-center py-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all">
          <HelpCircle className="mr-3 w-4 h-4" />
          <span className="text-[13px] font-medium">Support</span>
        </button>
        <button className="w-full flex items-center py-2 text-error hover:opacity-80 transition-all">
          <LogOut className="mr-3 w-4 h-4" />
          <span className="text-[13px] font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile } = useUser();
  
  const getPageTitle = () => {
    if (location.pathname.startsWith('/dashboard')) return 'Dashboard';
    if (location.pathname.startsWith('/customers')) return 'Customers';
    if (location.pathname.startsWith('/orders')) return 'Orders';
    if (location.pathname.startsWith('/products')) return 'Inventory';
    if (location.pathname.startsWith('/delivery')) return 'Logistics';
    if (location.pathname.startsWith('/reports')) return 'Insights';
    if (location.pathname.startsWith('/settings')) return 'Settings';
    return 'Console';
  };

  return (
    <header className="fixed top-0 right-0 left-[260px] h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 z-30 px-8 flex items-center justify-between transition-colors duration-300">
      <div className="flex items-center">
        <span className="text-[13px] font-black tracking-tighter text-emerald-600 dark:text-emerald-400 uppercase opacity-90">Fresh Guru</span>
        <div className="mx-3 w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
        <h2 className="font-black text-sm text-slate-900 dark:text-white uppercase tracking-widest">{getPageTitle()}</h2>
      </div>
      
      <div className="flex items-center space-x-3">
        <button className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition-colors active:opacity-80">
          <Bell className="w-5 h-5" />
        </button>
        <button 
          onClick={() => navigate('/settings')}
          className="p-2.5 text-slate-400 dark:text-slate-500 hover:text-primary dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-xl transition-all active:scale-95 border border-transparent hover:border-green-100 dark:hover:border-green-900/30"
        >
          <SettingsIcon className="w-5 h-5" />
        </button>
        <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 mx-1" />
        <div className="flex items-center gap-3 ml-2">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight leading-none">{profile.name}</p>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">Super Admin</p>
          </div>
          <img 
            alt="Admin" 
            className="h-9 w-9 rounded-xl border-2 border-white dark:border-slate-800 shadow-sm object-cover" 
            src={profile.avatar} 
          />
        </div>
      </div>
    </header>
  );
};

const Layout = () => {
  return (
    <div className="flex min-h-screen bg-slate-50/30 dark:bg-slate-950 transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 ml-[260px] flex flex-col min-w-0">
        <Header />
        <main className="p-6 space-y-6 pt-24">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
