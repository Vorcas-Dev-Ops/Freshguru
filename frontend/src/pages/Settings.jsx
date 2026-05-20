import React, { useState } from 'react';
import { 
  Building2, 
  Users2, 
  Percent, 
  BellRing, 
  Save, 
  ChevronRight, 
  CheckCircle2, 
  Plus, 
  ShieldCheck, 
  Mail, 
  MessageSquare, 
  Smartphone,
  Globe,
  MapPin,
  FileText,
  Clock,
  Trash2,
  Lock,
  Eye,
  Edit3
} from 'lucide-react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('business');
  const [isSaving, setIsSaving] = useState(false);

  const tabs = [
    { id: 'business', label: 'Business Settings', icon: Building2 },
    { id: 'roles', label: 'User Roles & Access', icon: Users2 },
    { id: 'taxes', label: 'GST & Tax Configuration', icon: Percent },
    { id: 'notifications', label: 'Alerts & Notifications', icon: BellRing },
  ];

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1500);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'business': return <BusinessSettings />;
      case 'roles': return <UserRolesSettings />;
      case 'taxes': return <TaxSettings />;
      case 'notifications': return <NotificationSettings />;
      default: return <BusinessSettings />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-500 pb-20">
      {/* Header Strategy */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-[#0a4a34] rounded-2xl flex items-center justify-center shadow-lg shadow-green-900/10">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">System Configuration</h2>
          </div>
          <p className="text-slate-400 text-[11px] font-black tracking-[0.2em] ml-1">Enterprise ERP Management Console</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-3 px-10 py-4 bg-[#0a4a34] text-white rounded-[24px] text-[11px] font-black uppercase tracking-[0.15em] hover:shadow-2xl hover:shadow-green-900/30 transition-all active:scale-95 disabled:opacity-50"
        >
          {isSaving ? <Clock className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {isSaving ? 'Synchronizing...' : 'Save All Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 space-y-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center justify-between px-6 py-5 rounded-[28px] transition-all group ${
                activeTab === tab.id 
                ? 'bg-white border-2 border-[#0a4a34] text-[#0a4a34] shadow-xl shadow-green-900/5' 
                : 'bg-transparent border-2 border-transparent text-slate-400 hover:bg-white hover:text-slate-600'
              }`}
            >
              <div className="flex items-center gap-4">
                <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-[#0a4a34]' : 'text-slate-300 group-hover:text-slate-500'}`} />
                <span className="text-[12px] font-black uppercase tracking-widest">{tab.label}</span>
              </div>
              {activeTab === tab.id && <ChevronRight className="w-4 h-4" />}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-9">
          <div className="bg-white border border-slate-100 rounded-[44px] p-12 shadow-sm min-h-[600px]">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

/* --- Sub-Components --- */

const BusinessSettings = () => (
  <div className="space-y-12 animate-in slide-in-from-right-4 duration-500">
    <SectionHeader title="Operational Profile" desc="Core identity and location metadata for Fresh Guru ERP" />
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      <div className="space-y-6">
        <SettingField label="Legal Business Name" value="Fresh Guru Wholesale PVT LTD" />
        <SettingField label="Official GSTIN" value="29AAAAA0000A1Z5" />
        <div className="grid grid-cols-2 gap-6">
          <SettingField label="Contact Primary" value="+91 98765 43210" />
          <SettingField label="Support Email" value="ops@freshguru.in" />
        </div>
      </div>
      <div className="space-y-6">
        <div className="p-6 bg-slate-50 rounded-[32px] border border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center border border-slate-100 overflow-hidden">
              <Building2 className="w-8 h-8 text-[#0a4a34]" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase">Enterprise Logo</p>
              <p className="text-[11px] font-black text-slate-900 mt-1">High Res Vector (2MB Max)</p>
            </div>
          </div>
          <button className="text-[10px] font-black text-[#0a4a34] uppercase hover:underline">Replace</button>
        </div>
        <SettingField label="Corporate Website" icon={Globe} value="www.freshguru.in" />
      </div>
    </div>

    <div className="space-y-6">
      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Central Warehouse Address</label>
      <div className="relative">
        <MapPin className="absolute left-6 top-6 w-5 h-5 text-[#0a4a34]" />
        <textarea 
          className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-[32px] text-[13px] font-bold text-slate-900 outline-none focus:ring-4 focus:ring-green-500/5 transition-all min-h-[120px]"
          defaultValue="Plot 42, Logistics Park, Near Hebbal Flyover, Bangalore, Karnataka - 560001"
        />
      </div>
    </div>
  </div>
);

const UserRolesSettings = () => (
  <div className="space-y-12 animate-in slide-in-from-right-4 duration-500">
    <div className="flex items-center justify-between">
      <SectionHeader title="Access Governance" desc="Manage personnel hierarchy and functional permissions" />
      <button className="flex items-center gap-2 px-6 py-3 bg-[#0a4a34] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:shadow-lg transition-all active:scale-95">
        <Plus className="w-4 h-4" /> Create New Role
      </button>
    </div>

    <div className="overflow-x-auto border border-slate-50 rounded-[32px]">
      <table className="w-full text-left">
        <thead className="bg-slate-50/50">
          <tr>
            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Defined Role</th>
            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Access Matrix</th>
            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ops</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {[
            { name: 'Super Admin', access: ['Full System', 'Financials', 'User Mgmt'], status: 'Primary' },
            { name: 'Inventory Manager', access: ['Stock Entry', 'Waste Log', 'Reports'], status: 'Active' },
            { name: 'Fleet Supervisor', access: ['Driver Dispatch', 'Route Audit'], status: 'Active' },
            { name: 'Order Picker', access: ['Scan Items', 'Print Labels'], status: 'Active' },
          ].map((role, i) => (
            <tr key={i} className="hover:bg-slate-50/30 transition-all group">
              <td className="px-8 py-6 font-black text-slate-900 text-[13px] tracking-tight uppercase">{role.name}</td>
              <td className="px-8 py-6">
                <div className="flex flex-wrap gap-2">
                  {role.access.map((tag, j) => (
                    <span key={j} className="px-3 py-1 bg-slate-50 text-slate-400 text-[9px] font-black uppercase rounded-lg border border-slate-100">{tag}</span>
                  ))}
                </div>
              </td>
              <td className="px-8 py-6 text-center">
                <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase rounded-lg border border-emerald-100">
                  {role.status}
                </span>
              </td>
              <td className="px-8 py-6 text-right">
                <div className="flex justify-end gap-2">
                  <button className="p-2 text-slate-300 hover:text-[#0a4a34] transition-colors"><Edit3 className="w-4 h-4" /></button>
                  <button className="p-2 text-slate-300 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const TaxSettings = () => (
  <div className="space-y-12 animate-in slide-in-from-right-4 duration-500">
    <SectionHeader title="GST & Taxation Control" desc="Configure tax slabs and compliance for statutory invoicing" />

    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      <div className="p-8 bg-slate-50 rounded-[40px] border border-slate-100 space-y-8">
        <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Active Tax Slabs</h4>
        <div className="space-y-4">
          {[
            { slab: 'GST 0%', desc: 'Exempted Essentials', count: '142 SKUs' },
            { slab: 'GST 5%', desc: 'Basic Grocery', count: '482 SKUs' },
            { slab: 'GST 12%', desc: 'Processed Food', count: '124 SKUs' },
            { slab: 'GST 18%', desc: 'Industrial Items', count: '45 SKUs' },
          ].map((item, i) => (
            <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-[#0a4a34]">
                  <Percent className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[12px] font-black text-slate-900 uppercase">{item.slab}</p>
                  <p className="text-[9px] text-slate-400 font-bold uppercase">{item.desc}</p>
                </div>
              </div>
              <p className="text-[11px] font-black text-[#0a4a34]">{item.count}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-8">
        <div className="p-8 border-2 border-dashed border-slate-200 rounded-[40px] flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-400">
            <Plus className="w-8 h-8" />
          </div>
          <div>
            <h5 className="text-[13px] font-black text-slate-900 uppercase">Create Tax Category</h5>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Add new HSN/SAC codes and rates</p>
          </div>
          <button className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">Initiate Wizard</button>
        </div>

        <div className="bg-[#fffbeb] p-8 rounded-[40px] border border-[#fef3c7] space-y-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-amber-600" />
            <h5 className="text-[13px] font-black text-amber-900 uppercase">Compliance Auto-Audit</h5>
          </div>
          <p className="text-[11px] text-amber-700 font-bold leading-relaxed">The system automatically calculates SGST/CGST based on warehouse location and client billing state.</p>
        </div>
      </div>
    </div>
  </div>
);

const NotificationSettings = () => (
  <div className="space-y-12 animate-in slide-in-from-right-4 duration-500">
    <SectionHeader title="Communication Channels" desc="Configure high-priority alerts across enterprise touchpoints" />

    <div className="space-y-10">
      <ChannelSection 
        title="Email Gateways" 
        icon={Mail} 
        channels={[
          { label: 'Weekly Revenue Audit', desc: 'Detailed financial summaries sent to owners every Monday.' },
          { label: 'Abnormal Waste Reports', desc: 'Alerts when stock damage exceeds the 5% threshold.' }
        ]} 
      />
      <ChannelSection 
        title="Direct Mobile (SMS/WhatsApp)" 
        icon={MessageSquare} 
        channels={[
          { label: 'Critical Low Stock', desc: 'Instant WhatsApp alert when key inventory reaches safety levels.' },
          { label: 'B2B Client Registration', desc: 'SMS notification for new vendor approval requests.' }
        ]} 
      />
      <ChannelSection 
        title="Admin App Notifications" 
        icon={Smartphone} 
        channels={[
          { label: 'Real-time Order Alerts', desc: 'Instant push notification for every new incoming order.' },
          { label: 'Driver Status Updates', desc: 'Track when a delivery fleet starts or completes a trip.' }
        ]} 
      />
    </div>
  </div>
);

/* --- Atomic UI Components --- */

const SectionHeader = ({ title, desc }) => (
  <div className="space-y-2">
    <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none">{title}</h3>
    <p className="text-slate-400 text-[11px] font-black uppercase tracking-widest">{desc}</p>
  </div>
);

const SettingField = ({ label, value, icon: Icon, type = "text" }) => (
  <div className="space-y-2">
    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <div className="relative">
      {Icon && <Icon className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />}
      <input 
        type={type}
        className={`w-full ${Icon ? 'pl-12' : 'px-6'} py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[13px] font-bold text-slate-900 outline-none focus:ring-4 focus:ring-green-500/5 focus:bg-white transition-all`}
        defaultValue={value}
      />
    </div>
  </div>
);

const ChannelSection = ({ title, icon: Icon, channels }) => (
  <div className="space-y-6">
    <div className="flex items-center gap-3">
      <Icon className="w-5 h-5 text-[#0a4a34]" />
      <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.15em]">{title}</h4>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {channels.map((channel, i) => (
        <div key={i} className="p-6 bg-white border border-slate-100 rounded-[32px] flex items-center justify-between hover:shadow-xl transition-all shadow-sm">
          <div className="pr-6">
            <p className="text-[12px] font-black text-slate-900 uppercase">{channel.label}</p>
            <p className="text-[9px] text-slate-400 font-bold uppercase mt-1 leading-relaxed">{channel.desc}</p>
          </div>
          <button className="w-12 h-6 rounded-full p-1 transition-all flex items-center bg-[#0a4a34] justify-end">
            <div className="w-4 h-4 rounded-full bg-white shadow-md"></div>
          </button>
        </div>
      ))}
    </div>
  </div>
);

export default Settings;
