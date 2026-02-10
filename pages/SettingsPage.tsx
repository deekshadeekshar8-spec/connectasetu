
import React from 'react';
import { useAuth } from '../App';

const SettingsPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="p-8 space-y-8 animate-in max-w-4xl">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">System Configuration</h1>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Operator Profile & Terminal Security</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
           <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
             <i className="fas fa-user-shield text-brand-blue-600"></i> Identity Profile
           </h3>
           <div className="space-y-4">
             <div className="flex justify-between border-b border-slate-50 pb-4">
               <span className="text-[10px] font-black text-slate-400 uppercase">Operator Name</span>
               <span className="text-xs font-bold text-slate-700">{user?.name}</span>
             </div>
             <div className="flex justify-between border-b border-slate-50 pb-4">
               <span className="text-[10px] font-black text-slate-400 uppercase">Clearance</span>
               <span className="text-xs font-bold text-brand-blue-600 uppercase">{user?.role.replace('_', ' ')}</span>
             </div>
             <div className="flex justify-between border-b border-slate-50 pb-4">
               <span className="text-[10px] font-black text-slate-400 uppercase">Email Sector</span>
               <span className="text-xs font-bold text-slate-700">{user?.email}</span>
             </div>
           </div>
           <button className="w-full py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all">Update Identity</button>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
           <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
             <i className="fas fa-mobile-screen text-brand-orange-500"></i> Telemetry Link
           </h3>
           <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
             <div className="flex items-center gap-4">
               <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-inner ${user?.deviceId ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                 <i className={`fas ${user?.deviceId ? 'fa-link' : 'fa-link-slash'} text-xl`}></i>
               </div>
               <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase">Current Binding</p>
                 <p className="text-xs font-black text-slate-800 telemetry">{user?.deviceId || 'UNBOUND'}</p>
               </div>
             </div>
             {user?.deviceId && (
               <div className="pt-2">
                 <div className="flex justify-between text-[9px] font-black text-slate-400 uppercase mb-2">
                   <span>Sync Health</span>
                   <span className="text-emerald-500">OPTIMAL</span>
                 </div>
                 <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                   <div className="h-full bg-emerald-500 w-[94%]"></div>
                 </div>
               </div>
             )}
           </div>
           <button className="w-full py-3 bg-white border border-slate-200 text-slate-700 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">Request De-Binding</button>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
         <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Advanced Telemetry Controls</h3>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 border border-slate-100 rounded-2xl space-y-3">
               <div className="flex justify-between items-center">
                 <i className="fas fa-database text-blue-500 text-lg"></i>
                 <div className="w-10 h-5 bg-emerald-500 rounded-full flex items-center px-1 shadow-inner cursor-pointer">
                   <div className="w-3 h-3 bg-white rounded-full ml-auto"></div>
                 </div>
               </div>
               <p className="text-[11px] font-black text-slate-800">Auto-Sync Logs</p>
               <p className="text-[9px] text-slate-400 font-bold leading-relaxed">Background synchronization every 15 minutes.</p>
            </div>
            <div className="p-5 border border-slate-100 rounded-2xl space-y-3">
               <div className="flex justify-between items-center">
                 <i className="fas fa-microchip text-slate-400 text-lg"></i>
                 <div className="w-10 h-5 bg-slate-200 rounded-full flex items-center px-1 shadow-inner cursor-pointer">
                   <div className="w-3 h-3 bg-white rounded-full"></div>
                 </div>
               </div>
               <p className="text-[11px] font-black text-slate-800">Quantum Verification</p>
               <p className="text-[9px] text-slate-400 font-bold leading-relaxed">Require hardware signature for manual edits.</p>
            </div>
            <div className="p-5 border border-slate-100 rounded-2xl space-y-3">
               <div className="flex justify-between items-center">
                 <i className="fas fa-file-export text-slate-400 text-lg"></i>
                 <i className="fas fa-chevron-right text-slate-200 text-xs"></i>
               </div>
               <p className="text-[11px] font-black text-slate-800">Export Registry</p>
               <p className="text-[9px] text-slate-400 font-bold leading-relaxed">Download your interaction history (PDF/CSV).</p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default SettingsPage;
