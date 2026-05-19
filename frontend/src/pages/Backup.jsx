import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Download, 
  RotateCcw, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  HardDrive, 
  Cloud, 
  ShieldCheck, 
  Plus, 
  X,
  FileArchive,
  Search,
  Filter,
  Lock,
  Calendar,
  RefreshCw,
  AlertTriangle,
  Server,
  FileText
} from 'lucide-react';

const Backup = () => {
  const [backups, setBackups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All');
  
  const [backupOptions, setBackupOptions] = useState({
    full: true,
    partners: true,
    products: true,
    inventory: true,
    orders: true,
    order_items: true,
    expenses: true,
    categories: true,
    drivers: true
  });
  const [storageType, setStorageType] = useState('Local Storage');
  const [notification, setNotification] = useState(null);

  // Auto-backup simulated switches
  const [autoDaily, setAutoDaily] = useState(true);
  const [autoWeekly, setAutoWeekly] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  const fetchHistory = async () => {
    try {
      const response = await fetch('http://localhost:5055/api/backup/history', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('admin_token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setBackups(data);
      } else {
        showToast('Failed to fetch backup history', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Backend network error connecting to backup server', 'error');
    }
  };

  const handleCreateBackup = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5055/api/backup/create', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        },
        body: JSON.stringify({ options: backupOptions, storage: storageType })
      });
      if (response.ok) {
        showToast('Database backup archive created successfully', 'success');
        await fetchHistory();
        setShowModal(false);
      } else {
        showToast('Error creating system backup', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to connect to backend server', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBackup = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this backup archive?')) return;
    try {
      const response = await fetch(`http://localhost:5055/api/backup/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('admin_token')}` }
      });
      if (response.ok) {
        showToast('Backup archive deleted from system', 'success');
        fetchHistory();
      } else {
        showToast('Error deleting backup file', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Network error deleting archive', 'error');
    }
  };

  const handleDownload = (filename) => {
    window.open(`http://localhost:5055/api/backup/download/${filename}?token=${localStorage.getItem('admin_token')}`);
    showToast('Download request initiated', 'success');
  };

  const handleRestore = (backup) => {
    setSelectedBackup(backup);
    setShowRestoreConfirm(true);
  };

  const confirmRestore = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5055/api/backup/restore/${selectedBackup.filename}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('admin_token')}` }
      });
      if (response.ok) {
        showToast('System restoration completed. Restarting interface.', 'success');
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        const errorData = await response.json();
        showToast(`Restore failed: ${errorData.message}`, 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Network exception during system restore', 'error');
    } finally {
      setLoading(false);
      setShowRestoreConfirm(false);
    }
  };

  const formatSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Filter and search backups
  const filteredBackups = backups.filter(b => {
    const filenameMatch = b.filename.toLowerCase().includes(searchQuery.toLowerCase());
    const storageMatch = b.storage_location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSearch = filenameMatch || storageMatch;
    const matchesType = filterType === 'All' || b.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-8 pb-20 px-4 md:px-8 relative min-h-screen">
      {/* 🔔 Toast Notification System */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-[99999] animate-in slide-in-from-bottom-5 duration-350">
          <div className={`flex items-center gap-3.5 px-6 py-4 rounded-2xl shadow-2xl border text-sm font-bold ${
            notification.type === 'success' 
              ? 'bg-[#0a4a34] dark:bg-emerald-950 border-emerald-500/20 text-white' 
              : 'bg-red-600 text-white border-red-500'
          }`}>
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-white shrink-0" />
            )}
            <div>
              <p className="tracking-tight leading-snug">{notification.message}</p>
            </div>
            <button onClick={() => setNotification(null)} className="ml-3 hover:opacity-70 transition-opacity">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Header & Main Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pt-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="px-3 py-1 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-800 rounded-lg flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[8px] font-black tracking-widest text-emerald-700 dark:text-emerald-400 uppercase">SYS SECURE</span>
            </div>
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-none">Backup & Recovery</h2>
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Enterprise Data Preservation Suite</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchHistory}
            className="p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/30 text-slate-500 dark:text-slate-400 rounded-2xl transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2 group"
          >
            <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
          </button>
          <button 
            onClick={() => setShowModal(true)}
            className="group flex items-center gap-3 px-8 py-4 bg-[#0a4a34] hover:bg-emerald-800 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-green-950/20 active:scale-95"
          >
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-500" /> Create Backup
          </button>
        </div>
      </div>

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Last Backup" 
          value={backups.length > 0 ? new Date(backups[0].created_at).toLocaleDateString() : 'Never'} 
          sub={backups.length > 0 ? new Date(backups[0].created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'No Data'}
          icon={Clock} 
          color="emerald" 
        />
        <StatCard 
          label="Backup Status" 
          value={backups[0]?.status || 'Idle'} 
          sub="System Integrity: High"
          icon={CheckCircle2} 
          color="blue" 
        />
        <StatCard 
          label="Auto Backup" 
          value={autoDaily ? 'Daily' : 'Off'} 
          sub={autoDaily ? 'Next: 11:30 PM IST' : 'Manual Trigger only'}
          icon={Calendar} 
          color="orange" 
        />
        <StatCard 
          label="Total Storage" 
          value={formatSize(backups.reduce((acc, b) => acc + (parseInt(b.size) || 0), 0))} 
          sub={`${backups.length} Archives`}
          icon={HardDrive} 
          color="purple" 
        />
      </div>

      {/* Main Content Areas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Archival History Log */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] shadow-sm flex flex-col overflow-hidden">
          {/* Table Header Controls */}
          <div className="p-8 border-b border-slate-50 dark:border-slate-850 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/30 dark:bg-slate-900/30">
            <div className="flex items-center gap-3">
              <div className="w-1 h-5 bg-[#0a4a34] rounded-full" />
              <h3 className="text-[12px] font-black text-slate-800 dark:text-white uppercase tracking-widest">Archival History Ledger</h3>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              {/* Search input */}
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search file name..."
                  className="pl-10 pr-4 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-white outline-none focus:border-emerald-500 transition-all min-w-[200px]"
                />
              </div>

              {/* Type Filter */}
              <div className="flex items-center bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-1">
                {['All', 'Full', 'Partial'].map(type => (
                  <button 
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all ${
                      filterType === type 
                        ? 'bg-[#0a4a34] text-white shadow-sm' 
                        : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Table Container */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/40 dark:bg-slate-900/40">
                  <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-850">Archive Details</th>
                  <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-850">Mode</th>
                  <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-850">Size</th>
                  <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-850">Status</th>
                  <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-850 text-right">Console</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-855">
                {filteredBackups.map((backup) => (
                  <tr key={backup.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-900/10 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100/20 rounded-xl flex items-center justify-center text-emerald-600 shrink-0">
                          <FileArchive className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-[12px] font-black text-slate-800 dark:text-white tracking-tight leading-tight group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">{backup.filename}</p>
                          <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wider mt-1">{new Date(backup.created_at).toLocaleString()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-wider ${
                        backup.type === 'Full' 
                          ? 'bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400 border border-purple-100/30' 
                          : 'bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border border-blue-100/30'
                      }`}>
                        {backup.type}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-[12px] font-bold text-slate-600 dark:text-slate-350 tabular-nums">
                      {formatSize(backup.size)}
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">{backup.status}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleDownload(backup.filename)}
                          title="Download Archive"
                          className="p-2 bg-slate-50 hover:bg-emerald-500 hover:text-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-lg transition-all"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => handleRestore(backup)}
                          title="Restore Data Records"
                          className="p-2 bg-slate-50 hover:bg-blue-500 hover:text-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-lg transition-all"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => handleDeleteBackup(backup.id)}
                          title="Purge Archive File"
                          className="p-2 bg-slate-50 hover:bg-red-650 hover:text-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-lg transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                
                {filteredBackups.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div className="w-12 h-12 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-center text-slate-350">
                          <Database className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No backup archives match requirements</p>
                          <p className="text-[9px] text-slate-450 mt-1">Initiate a new database backup to begin logging</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Configuration & Schedulers sidebar */}
        <div className="space-y-8">
          {/* Security Banner Card */}
          <div className="bg-gradient-to-br from-[#063022] to-[#0d5038] rounded-[2rem] p-8 text-white relative overflow-hidden border border-emerald-950/20 shadow-xl shadow-green-950/10">
            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/10 backdrop-blur-md">
                  <ShieldCheck className="w-5 h-5 text-emerald-300" />
                </div>
                <div>
                  <h4 className="text-[9px] font-black uppercase tracking-widest text-emerald-350">Data Security Standards</h4>
                  <p className="text-[8px] font-bold uppercase tracking-wider text-emerald-100/60 mt-0.5">Compliant preservation engine</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-black tracking-tight leading-tight">
                  Archived Assets Encrypted with <span className="text-emerald-300 font-extrabold underline decoration-emerald-500/50">AES-256</span>
                </h3>
                <p className="text-[11px] font-bold text-emerald-100/70 leading-relaxed">
                  Only Super Admins can initiate full snapshots restoration. All ledger interactions are audited internally.
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Server className="w-4 h-4 text-emerald-350" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-200/80">Local Server Nodes</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-400/30 text-[9px] font-black uppercase tracking-wider text-emerald-300">ONLINE</span>
              </div>
            </div>
            {/* Background design elements */}
            <div className="absolute right-0 bottom-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
          </div>

          {/* Schedulers config panel */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-5 bg-orange-500 rounded-full" />
              <h3 className="text-[12px] font-black uppercase tracking-widest text-slate-800 dark:text-white">Archival Scheduler</h3>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-900/50 border border-slate-100/50 dark:border-slate-800/80 rounded-2xl">
                <div>
                  <span className="block text-[11px] font-black text-slate-700 dark:text-slate-200 uppercase tracking-wider">Daily System Backup</span>
                  <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Every evening at 11:30 PM</span>
                </div>
                <button 
                  onClick={() => setAutoDaily(!autoDaily)}
                  className={`w-10 h-6 rounded-full p-1 transition-all duration-300 ${autoDaily ? 'bg-emerald-600' : 'bg-slate-200 dark:bg-slate-800'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full shadow-md transition-all duration-300 ${autoDaily ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-900/50 border border-slate-100/50 dark:border-slate-800/80 rounded-2xl">
                <div>
                  <span className="block text-[11px] font-black text-slate-700 dark:text-slate-200 uppercase tracking-wider">Weekly Deep Archive</span>
                  <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Every Sunday 03:00 AM</span>
                </div>
                <button 
                  onClick={() => setAutoWeekly(!autoWeekly)}
                  className={`w-10 h-6 rounded-full p-1 transition-all duration-300 ${autoWeekly ? 'bg-emerald-600' : 'bg-slate-200 dark:bg-slate-800'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full shadow-md transition-all duration-300 ${autoWeekly ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="pt-4 border-t border-slate-55 dark:border-slate-800">
                <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Primary Storage Slot</span>
                <div className="flex items-center gap-2.5 px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl">
                  <HardDrive className="w-4 h-4 text-slate-400" />
                  <span className="text-[11px] font-black text-slate-700 dark:text-slate-200 uppercase tracking-wider">Server Local Mount</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Backup Setup Configuration Dialog */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800 animate-in zoom-in-95 duration-400">
            {/* Header */}
            <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-slate-50/20 dark:bg-slate-800/10">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 bg-[#0a4a34] rounded-xl flex items-center justify-center text-white">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tighter uppercase">Backup Configuration</h3>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Designate entity sets to include</p>
                </div>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Selection Body */}
            <div className="p-8 space-y-6 max-h-[55vh] overflow-y-auto custom-scrollbar">
              {/* Full Snap Option */}
              <div 
                onClick={() => setBackupOptions({ ...backupOptions, full: !backupOptions.full })}
                className={`p-5 rounded-2xl border-2 flex items-start gap-4 cursor-pointer transition-all ${
                  backupOptions.full 
                    ? 'bg-emerald-50/30 dark:bg-emerald-950/20 border-emerald-500/50' 
                    : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-emerald-500/20'
                }`}
              >
                <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 mt-0.5 ${
                  backupOptions.full ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300'
                }`}>
                  {backupOptions.full && <CheckCircle2 className="w-3.5 h-3.5" />}
                </div>
                <div>
                  <span className="block text-[12px] font-black text-slate-800 dark:text-white uppercase tracking-wide">Full Snapshot (Recommended)</span>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Exports all tables including transactions, driver registries, and partners logs</span>
                </div>
              </div>

              {/* Custom Selector Grid */}
              {!backupOptions.full && (
                <div className="space-y-3">
                  <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest">Select Target Tables</span>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.keys(backupOptions).filter(k => k !== 'full').map(key => (
                      <div 
                        key={key}
                        onClick={() => setBackupOptions({ ...backupOptions, [key]: !backupOptions[key] })}
                        className={`p-3.5 rounded-xl border flex items-center gap-3 cursor-pointer transition-all select-none ${
                          backupOptions[key] 
                            ? 'bg-emerald-50/10 dark:bg-emerald-950/10 border-emerald-500/30 text-slate-900 dark:text-white' 
                            : 'bg-slate-50/30 dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-500'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                          backupOptions[key] ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-350'
                        }`}>
                          {backupOptions[key] && <CheckCircle2 className="w-3 h-3" />}
                        </div>
                        <span className="text-[11px] font-black uppercase tracking-wider capitalize">{key.replace('_', ' ')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Destination selector */}
              <div className="space-y-3 pt-3 border-t border-slate-50 dark:border-slate-850">
                <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest">Storage Destination</span>
                <div className="grid grid-cols-2 gap-3">
                  {['Local Storage', 'Cloud Vault', 'Google Drive', 'S3 Bucket'].map(dest => (
                    <button 
                      key={dest}
                      onClick={() => setStorageType(dest)}
                      className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${
                        storageType === dest 
                          ? 'bg-emerald-50/30 dark:bg-emerald-950/20 border-emerald-500/50 text-emerald-700 dark:text-emerald-400' 
                          : 'bg-slate-50/20 dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-400'
                      }`}
                    >
                      {dest === 'Local Storage' ? <HardDrive className="w-4 h-4" /> : <Cloud className="w-4 h-4" />}
                      <span className="text-[10px] font-black uppercase tracking-wider">{dest}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-8 bg-slate-50 dark:bg-slate-900/30 border-t border-slate-50 dark:border-slate-850 flex justify-end gap-3">
              <button 
                onClick={() => setShowModal(false)}
                className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                Abort
              </button>
              <button 
                onClick={handleCreateBackup}
                disabled={loading}
                className="px-8 py-3.5 bg-[#0a4a34] hover:bg-emerald-800 disabled:opacity-50 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 flex items-center gap-2"
              >
                {loading ? (
                  <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <Database className="w-3.5 h-3.5" />
                )}
                {loading ? 'Archiving...' : 'Start Backup Job'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Restore Warning Dialog */}
      {showRestoreConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl border border-red-150 dark:border-red-900/20 animate-in zoom-in-95 duration-400">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-100 dark:border-red-900/30">
                <RotateCcw className="w-8 h-8 text-red-650 animate-spin-slow" />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">Critical Override Operation</h3>
              <p className="text-[12px] font-bold text-slate-500 dark:text-slate-400 leading-relaxed px-4 mt-2">
                Restoring <span className="text-slate-900 dark:text-white font-black">{selectedBackup?.filename}</span> will wipe out all current system transactions. This action cannot be undone.
              </p>
              
              <div className="mt-8 p-5 bg-red-50/50 dark:bg-red-500/5 rounded-2xl border border-red-100/50 dark:border-red-900/20 flex items-start gap-3.5 text-left">
                <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] font-black text-red-600 uppercase tracking-widest">Wipe Alert Protocol</p>
                  <p className="text-[11px] font-bold text-red-550 leading-snug opacity-75 mt-0.5">Database auto-clears structural constraints. Fresh data fields will align directly to archived parameters.</p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-50 dark:bg-slate-900/30 border-t border-slate-50 dark:border-slate-850 grid grid-cols-2 gap-3">
              <button 
                onClick={() => setShowRestoreConfirm(false)}
                className="py-3.5 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors border border-slate-100 dark:border-slate-800 rounded-xl"
              >
                Abort Restore
              </button>
              <button 
                onClick={confirmRestore}
                disabled={loading}
                className="py-3.5 bg-red-650 hover:bg-red-700 disabled:opacity-50 text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shadow-md shadow-red-900/10 active:scale-95 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <Lock className="w-3.5 h-3.5" />
                )}
                Confirm Override
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ label, value, sub, icon: Icon, color }) => {
  const themes = {
    emerald: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20 shadow-emerald-500/5',
    blue: 'text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20 shadow-blue-500/5',
    orange: 'text-orange-600 dark:text-orange-400 bg-orange-500/10 border-orange-500/20 shadow-orange-500/5',
    purple: 'text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/20 shadow-purple-500/5'
  };

  const accentBorder = {
    emerald: 'border-l-4 border-l-emerald-500',
    blue: 'border-l-4 border-l-blue-500',
    orange: 'border-l-4 border-l-orange-500',
    purple: 'border-l-4 border-l-purple-500'
  };

  return (
    <div className={`bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 ${accentBorder[color]} p-6 rounded-2xl shadow-sm hover:shadow-xl hover:scale-[1.01] transition-all duration-300 group relative overflow-hidden`}>
      <div className="relative z-10 flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{label}</p>
          <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">{value}</h3>
          {sub && <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider mt-1">{sub}</p>}
        </div>
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all group-hover:scale-110 group-hover:rotate-6 ${themes[color]} border`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      {/* Decorative backdrop icon */}
      <Icon className="absolute -right-6 -bottom-6 w-20 h-20 text-slate-950/[0.02] dark:text-white/[0.02] -rotate-12 pointer-events-none transition-transform group-hover:rotate-0 duration-500" />
    </div>
  );
};

export default Backup;
