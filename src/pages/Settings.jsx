import React, { useState, useRef } from 'react';
import { 
  Bell, 
  Shield, 
  User, 
  CreditCard,
  ChevronRight,
  LogOut,
  Moon,
  Sun,
  Camera,
  Save,
  Clock,
  Plus
} from 'lucide-react';
import { useUser } from '../context/UserContext';

const Settings = () => {
  const { profile, setProfile, darkMode, toggleDarkMode } = useUser();
  const [activeTab, setActiveTab] = useState('General');
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef(null);
  
  // Local state for editing before save
  const [editProfile, setEditProfile] = useState({ ...profile });

  // Notification State (Mock)
  const [notifications, setNotifications] = useState({
    orderAlerts: true,
    customerApprovals: true,
    inventoryLow: true,
    weeklyReports: false
  });

  // Security State (Mock)
  const [security, setSecurity] = useState({
    twoFactor: false,
    sessionTimeout: '30 mins'
  });

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setProfile(editProfile);
      setIsSaving(false);
    }, 1000);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditProfile({ ...editProfile, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const tabs = [
    { id: 'General', icon: User, label: 'General' },
    { id: 'Notifications', icon: Bell, label: 'Alerts' },
    { id: 'Security', icon: Shield, label: 'Security' },
    { id: 'Billing', icon: CreditCard, label: 'Billing' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Settings</h2>
          <p className="text-slate-500 dark:text-slate-400 font-bold text-sm">Update your administrative profile and preferences.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2.5 bg-bottle-green dark:bg-green-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-opacity-90 transition-all shadow-lg shadow-green-100 dark:shadow-none disabled:opacity-50 active:scale-95"
        >
          {isSaving ? <Clock className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {isSaving ? 'Processing...' : 'Save Settings'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-2">
          {tabs.map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${
                activeTab === tab.id 
                  ? 'bg-white dark:bg-slate-900 border border-primary/20 dark:border-green-400/20 text-primary dark:text-green-400 shadow-sm' 
                  : 'bg-white/50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <tab.icon className="w-5 h-5" />
                <span className="font-black uppercase tracking-widest text-[10px]">{tab.label}</span>
              </div>
              {activeTab === tab.id && <ChevronRight className="w-4 h-4" />}
            </button>
          ))}
          
          <div className="pt-8">
            <button className="w-full flex items-center gap-3 p-4 text-red-500 font-black uppercase tracking-widest text-[10px] hover:bg-red-50 dark:hover:bg-red-900/10 rounded-2xl transition-all">
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        <div className="md:col-span-3">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm transition-all duration-300">
            
            {activeTab === 'General' && (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                <div>
                  <h3 className="font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest text-xs mb-6">Profile Information</h3>
                  <div className="flex items-center gap-6 mb-8">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-[2rem] bg-slate-100 dark:bg-slate-800 overflow-hidden border-4 border-white dark:border-slate-800 shadow-xl">
                        {editProfile.avatar ? (
                          <img src={editProfile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300">
                            <User className="w-10 h-10" />
                          </div>
                        )}
                      </div>
                      <button 
                        onClick={() => fileInputRef.current.click()}
                        className="absolute -bottom-1 -right-1 p-2.5 bg-bottle-green text-white rounded-xl shadow-lg border-4 border-white dark:border-slate-900 hover:scale-110 transition-transform active:scale-95"
                      >
                        <Camera className="w-4 h-4" />
                      </button>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/*" 
                        onChange={handlePhotoUpload}
                      />
                    </div>
                    <div>
                      <p className="font-black text-slate-900 dark:text-white text-xl tracking-tight leading-none uppercase">{editProfile.name}</p>
                      <p className="text-[11px] text-primary dark:text-green-400 font-black uppercase tracking-[0.2em] mt-2">{editProfile.role}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField label="Admin Full Name" value={editProfile.name} onChange={(e) => setEditProfile({...editProfile, name: e.target.value})} />
                    <InputField label="Official Email" value={editProfile.email} onChange={(e) => setEditProfile({...editProfile, email: e.target.value})} type="email" />
                    <InputField label="Contact Number" value={editProfile.phone} onChange={(e) => setEditProfile({...editProfile, phone: e.target.value})} />
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 ml-1">Interface Theme</label>
                      <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-3">
                          {darkMode ? <Moon className="w-4 h-4 text-primary dark:text-green-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
                          <span className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-tight">{darkMode ? 'Dark Mode' : 'Light Mode'}</span>
                        </div>
                        <button 
                          onClick={toggleDarkMode}
                          className={`w-14 h-7 rounded-full p-1 transition-all flex items-center ${darkMode ? 'bg-primary justify-end' : 'bg-slate-200 justify-start'}`}
                        >
                          <div className="w-5 h-5 rounded-full bg-white shadow-md"></div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Other tabs remain similarly updated with dark mode support */}
            {activeTab === 'Notifications' && (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                <h3 className="font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest text-xs mb-6">Alert Configuration</h3>
                <div className="space-y-4">
                  <ToggleOption label="Order Alerts" desc="Receive notifications for new incoming orders." checked={notifications.orderAlerts} onChange={() => setNotifications({...notifications, orderAlerts: !notifications.orderAlerts})} />
                  <ToggleOption label="Customer Approvals" desc="Get notified when new B2B customers register." checked={notifications.customerApprovals} onChange={() => setNotifications({...notifications, customerApprovals: !notifications.customerApprovals})} />
                </div>
              </div>
            )}

            {activeTab === 'Security' && (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                <h3 className="font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest text-xs mb-6">System Security</h3>
                <div className="space-y-6">
                  <ToggleOption label="Two-Factor Authentication" desc="Add an extra layer of security to your admin account." checked={security.twoFactor} onChange={() => setSecurity({...security, twoFactor: !security.twoFactor})} />
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Session Timeout</label>
                    <select className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-green-500/20" value={security.sessionTimeout} onChange={(e) => setSecurity({...security, sessionTimeout: e.target.value})}>
                      <option>15 mins</option>
                      <option>30 mins</option>
                      <option>1 hour</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Billing' && (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                <h3 className="font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest text-xs mb-6">Payment Methods</h3>
                <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-xl shadow-sm flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-slate-400" />
                    </div>
                    <div>
                      <p className="font-black text-slate-900 dark:text-white text-sm tracking-tight">Visa Ending In 9821</p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">Expires 12/26</p>
                    </div>
                  </div>
                  <button className="text-[10px] font-black text-primary dark:text-green-400 uppercase hover:underline">Update</button>
                </div>
                <button className="w-full py-4 border border-dashed border-slate-200 dark:border-slate-700 text-slate-400 font-black uppercase tracking-widest text-[10px] rounded-2xl hover:border-primary/20 hover:text-primary transition-all flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4" /> Add New Card
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

const InputField = ({ label, value, onChange, type = "text" }) => (
  <div>
    <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5 ml-1">{label}</label>
    <input 
      type={type}
      className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-black text-slate-900 dark:text-white focus:ring-2 focus:ring-green-500/20 outline-none transition-all" 
      value={value}
      onChange={onChange}
    />
  </div>
);

const ToggleOption = ({ label, desc, checked, onChange }) => (
  <div className="flex items-center justify-between p-5 bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-primary/10 transition-all">
    <div className="pr-4">
      <p className="font-black text-slate-900 dark:text-slate-100 text-xs uppercase tracking-tight">{label}</p>
      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold mt-0.5">{desc}</p>
    </div>
    <button onClick={onChange} className={`w-12 h-6 rounded-full p-1 transition-all flex-shrink-0 flex items-center ${checked ? 'bg-primary justify-end' : 'bg-slate-200 dark:bg-slate-700 justify-start'}`}>
      <div className="w-4 h-4 rounded-full bg-white shadow-md"></div>
    </button>
  </div>
);

export default Settings;
