import React, { useState, useEffect, useRef } from 'react';
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
  ShieldCheck,
  Database,
  Wallet,
  Megaphone,
  Plus
} from 'lucide-react';
import { useUser } from '../context/UserContext';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, profile } = useUser();
  const isAdmin = profile?.role === 'Super Admin' || profile?.role === 'Main Admin';
  
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'Partners', path: '/partners' },
    { icon: ShoppingBag, label: 'Delivery History', path: '/orders' },
    { icon: Package, label: 'Inventory', path: '/inventory' },
    { icon: Leaf, label: 'Farm Inventory', path: '/farm-inventory' },
    { icon: Truck, label: 'Logistics', path: '/delivery' },
    { icon: Wallet, label: 'Expenses', path: '/expenses' },
    { icon: Megaphone, label: 'Banners', path: '/banners' },
    { icon: BarChart3, label: 'Insights', path: '/insights' },
    { icon: ShieldCheck, label: 'Logs', path: '/logs' },
    { icon: Database, label: 'Backup & Restore', path: '/backup' },
    { icon: SettingsIcon, label: 'Settings', path: '/settings' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-[260px] bg-[#071d15] border-r border-[#0d3425] flex flex-col py-4 z-40 transition-colors duration-300">
      <Link to="/" className="px-6 mb-8 flex flex-col items-start gap-1">
        <div className="flex items-center gap-2">
          <Leaf className="w-6 h-6 text-emerald-400 shrink-0" />
          <span className="text-xl font-black text-white tracking-wider logo-font">FRESH <span className="text-emerald-400 font-extrabold">GURU</span></span>
        </div>
        <p className="text-[9px] text-emerald-400/80 uppercase tracking-[0.25em] font-bold mt-1 ml-8">ADMIN PORTAL</p>
      </Link>
      
      <nav className="flex-1 space-y-1 overflow-y-auto no-scrollbar">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
          return (
            <div key={item.label}>
              <Link
                to={item.path}
                className={`flex items-center px-6 py-2.5 transition-all ${
                  isActive 
                    ? 'text-emerald-400 bg-emerald-500/10 border-l-4 border-emerald-500 font-semibold' 
                    : 'text-slate-300 hover:bg-emerald-950/30 hover:text-emerald-300 font-semibold'
                }`}
              >
                <item.icon className="mr-3 w-4 h-4" />
                <span className="text-[13px] tracking-tight">{item.label}</span>
              </Link>
              {item.children && item.children.length > 0 && isActive && (
                <div className="ml-8 mt-1 space-y-1">
                  {item.children.map((child) => (
                    <Link
                      key={child.label}
                      to={child.path}
                      className={`flex items-center px-6 py-2 text-[12px] font-bold transition-all rounded-l-xl ${
                        location.pathname === child.path
                          ? 'text-bottle-green dark:text-green-400 bg-emerald-50 dark:bg-emerald-900/10'
                          : 'text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {child.icon ? (
                        <child.icon className="mr-3 w-4 h-4" />
                      ) : (
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 mr-4 ml-1 shrink-0" />
                      )}
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="mt-auto px-6 border-t border-[#0d3425] pt-4 space-y-1">
        <button className="w-full flex items-center py-2 text-slate-400 hover:text-white transition-all">
          <HelpCircle className="mr-3 w-4 h-4" />
          <span className="text-[13px] font-medium">Support</span>
        </button>
        <button 
          onClick={handleLogout}
          className="w-full flex items-center py-2 text-red-400 hover:text-red-300 transition-all font-semibold"
        >
          <LogOut className="mr-3 w-4 h-4" />
          <span className="text-[13px] font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

const Header = ({ 
  notifications, 
  showDropdown, 
  setShowDropdown, 
  markAllAsRead, 
  markAsRead, 
  formatTime 
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile } = useUser();
  const dropdownRef = useRef(null);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setShowDropdown]);

  const getPageTitle = () => {
    if (location.pathname.startsWith('/dashboard')) return 'Dashboard';
    if (location.pathname.startsWith('/partners')) return 'Partners';
    if (location.pathname.startsWith('/orders')) return 'Delivery History';
    if (location.pathname.startsWith('/inventory')) return 'Inventory';
    if (location.pathname.startsWith('/farm-inventory')) return 'Farm Inventory';
    if (location.pathname.startsWith('/delivery')) return 'Logistics';
    if (location.pathname.startsWith('/expenses')) return 'Expense Management';
    if (location.pathname.startsWith('/banners')) return 'Marketing Banners';
    if (location.pathname.startsWith('/insights')) return 'Business Intelligence';
    if (location.pathname.startsWith('/reports')) return 'Legacy Reports';
    if (location.pathname.startsWith('/backup')) return 'Backup & Recovery';
    if (location.pathname.startsWith('/settings')) return 'Settings';
    if (location.pathname.startsWith('/logs')) return 'Audit Logs';
    return 'Console';
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="fixed top-0 right-0 left-[260px] h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 z-30 px-8 flex items-center justify-between transition-colors duration-300">
      <div className="flex items-center">
        <span className="text-[13px] font-black tracking-tighter text-emerald-600 dark:text-emerald-400 uppercase opacity-90">Fresh Guru</span>
        <div className="mx-3 w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
        <h2 className="font-black text-sm text-slate-900 dark:text-white uppercase tracking-widest">{getPageTitle()}</h2>
      </div>
      
      <div className="flex items-center space-x-4">
        {/* Quick Actions */}
        <div className="hidden md:flex items-center gap-2 mr-2">
          <button 
            onClick={() => navigate('/inventory')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#ecfdf5] hover:bg-[#d1fae5] text-emerald-600 border border-emerald-100 rounded-full text-[10px] font-black uppercase tracking-widest transition-all"
          >
            <Plus className="w-3 h-3" /> Add Product
          </button>
          <button 
            onClick={() => navigate('/expenses')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-600 border border-orange-100 rounded-full text-[10px] font-black uppercase tracking-widest transition-all"
          >
            <Plus className="w-3 h-3" /> Add Expense
          </button>
        </div>

        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setShowDropdown(!showDropdown)} 
            className="relative p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition-colors active:opacity-80"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-black text-white ring-2 ring-white dark:ring-slate-900 animate-bounce">
                {unreadCount}
              </span>
            )}
          </button>

          {showDropdown && (
            <div className="absolute right-0 top-12 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 z-50 overflow-hidden animate-in fade-in slide-in-from-top-3 duration-200">
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                <span className="text-[12px] font-black tracking-wider text-slate-900 dark:text-white uppercase">Notifications</span>
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllAsRead}
                    className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 dark:text-slate-500">
                    <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p className="text-xs">No notifications yet</p>
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div 
                      key={notif.id}
                      onClick={() => markAsRead(notif.id)}
                      className={`p-4 flex gap-3 cursor-pointer transition-colors ${
                        notif.read ? 'bg-white hover:bg-slate-50/50 dark:bg-slate-900' : 'bg-emerald-500/[0.02] hover:bg-emerald-500/[0.04] dark:bg-emerald-950/10'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                        notif.type === 'request' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' :
                        notif.type === 'placed' ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600' :
                        'bg-green-50 dark:bg-green-900/20 text-green-600'
                      }`}>
                        {notif.type === 'request' ? <Users className="w-4 h-4" /> :
                         notif.type === 'placed' ? <ShoppingBag className="w-4 h-4" /> :
                         <Truck className="w-4 h-4" />}
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <div className="flex justify-between items-baseline mb-0.5">
                          <p className="text-[11px] font-black text-slate-900 dark:text-white truncate uppercase tracking-wider">{notif.title}</p>
                          <span className="text-[9px] font-bold text-slate-400 shrink-0">{formatTime(notif.created_at)}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">{notif.message}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <button 
          onClick={() => navigate('/settings')}
          className="p-2.5 text-slate-400 dark:text-slate-500 hover:text-primary dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-xl transition-all active:scale-95 border border-transparent hover:border-green-100 dark:hover:border-green-900/30"
        >
          <SettingsIcon className="w-5 h-5" />
        </button>
        <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 mx-1" />
        <div className="flex items-center gap-3 ml-2">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight leading-none">{profile?.name || 'Admin'}</p>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">Super Admin</p>
          </div>
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-100 to-green-200 dark:from-emerald-900 dark:to-green-800 flex items-center justify-center border-2 border-white dark:border-slate-800 shadow-sm overflow-hidden">
            <span className="text-emerald-700 dark:text-emerald-300 font-bold text-xs">{profile?.name?.charAt(0) || 'A'}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

const Layout = () => {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeToast, setActiveToast] = useState(null);

  const fetchNotifications = async (isInitial = false) => {
    try {
      const res = await fetch('http://localhost:5055/api/notifications');
      if (res.ok) {
        const data = await res.json();
        if (!isInitial && data.length > 0) {
          setNotifications(prev => {
            if (prev.length > 0 && data[0].id !== prev[0].id) {
              const newNotif = data[0];
              setActiveToast(newNotif);
              try {
                const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-600.wav');
                audio.volume = 0.25;
                audio.play();
              } catch (e) {
                // Ignore audio autoplay restrictions
              }
              setTimeout(() => {
                setActiveToast(t => t?.id === newNotif.id ? null : t);
              }, 5000);
            }
            return data;
          });
        } else {
          setNotifications(data);
        }
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  useEffect(() => {
    fetchNotifications(true);

    const timer = setInterval(() => {
      fetchNotifications(false);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const markAllAsRead = async () => {
    try {
      const res = await fetch('http://localhost:5055/api/notifications/mark-read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const markAsRead = async (id) => {
    try {
      const res = await fetch('http://localhost:5055/api/notifications/mark-read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const formatTime = (isoString) => {
    const diffMs = new Date() - new Date(isoString);
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h`;
    return new Date(isoString).toLocaleDateString();
  };

  return (
    <div className="flex min-h-screen w-full max-w-full bg-slate-50/30 dark:bg-slate-950 transition-colors duration-300 overflow-x-hidden">
      <Sidebar />
      <div className="flex-1 ml-[260px] flex flex-col min-w-0 max-w-full overflow-x-hidden">
        <Header 
          notifications={notifications}
          showDropdown={showDropdown}
          setShowDropdown={setShowDropdown}
          markAllAsRead={markAllAsRead}
          markAsRead={markAsRead}
          formatTime={formatTime}
        />
        <main className="p-6 space-y-6 pt-24">
          <Outlet />
        </main>
      </div>

      {activeToast && (
        <div className="fixed bottom-6 right-6 z-50 w-80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-4 rounded-2xl border-2 border-emerald-500/20 shadow-[0_10px_30px_-10px_rgba(16,185,129,0.35)] animate-in slide-in-from-bottom-5 duration-300 flex gap-3 overflow-hidden text-left">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-green-500" />
          
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
            activeToast.type === 'request' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' :
            activeToast.type === 'placed' ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600' :
            'bg-green-50 dark:bg-green-900/20 text-green-600'
          }`}>
            {activeToast.type === 'request' ? <Users className="w-5 h-5" /> :
             activeToast.type === 'placed' ? <ShoppingBag className="w-5 h-5" /> :
             <Truck className="w-5 h-5" />}
          </div>
          <div className="flex-1 min-w-0 pr-4">
            <p className="text-[12px] font-black text-slate-900 dark:text-white uppercase tracking-wider mb-0.5">{activeToast.title}</p>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-normal">{activeToast.message}</p>
          </div>
          <button 
            onClick={() => setActiveToast(null)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-xs font-black self-start"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

export default Layout;
