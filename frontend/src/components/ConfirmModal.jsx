import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Delete', type = 'danger' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100 dark:border-slate-800">
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
              type === 'danger' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
            }`}>
              <AlertTriangle className="w-8 h-8" />
            </div>
            <button onClick={onClose} className="p-2 text-slate-300 hover:text-slate-600 transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter mb-2">
            {title}
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-bold leading-relaxed uppercase tracking-widest opacity-60">
            {message}
          </p>

          <div className="flex gap-4 mt-8">
            <button 
              onClick={onClose}
              className="flex-1 py-4 bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all"
            >
              Cancel
            </button>
            <button 
              onClick={onConfirm}
              className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white shadow-lg transition-all active:scale-95 ${
                type === 'danger' 
                  ? 'bg-red-600 shadow-red-100 hover:bg-red-700' 
                  : 'bg-emerald-600 shadow-emerald-100 hover:bg-emerald-700'
              }`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
