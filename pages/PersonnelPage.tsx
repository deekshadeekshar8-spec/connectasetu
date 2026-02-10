
import React, { useState, useEffect } from 'react';
import { appFetch as fetch } from '../App';
import { User, Role } from '../types';

const PersonnelPage: React.FC = () => {
  const [personnel, setPersonnel] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<'ACTIVE' | 'PENDING'>('ACTIVE');

  const loadPersonnel = async () => {
    const res = await fetch('/api/admin/team/employees');
    const data = await res.json();
    setPersonnel(Array.isArray(data) ? data : []);
  };

  useEffect(() => { loadPersonnel(); }, []);

  const filtered = personnel.filter(p => p.status === activeTab);

  return (
    <div className="p-8 space-y-8 animate-in">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Fleet Personnel Management</h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Authorized Operator Registry</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab('ACTIVE')}
            className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'ACTIVE' ? 'bg-white text-brand-blue-600 shadow-sm' : 'text-slate-400'}`}
          >Deployed</button>
          <button 
            onClick={() => setActiveTab('PENDING')}
            className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'PENDING' ? 'bg-white text-brand-blue-600 shadow-sm' : 'text-slate-400'}`}
          >Enrollment Requests</button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-separate border-spacing-0">
          <thead>
            <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              <th className="px-8 py-5">Identity Vector</th>
              <th className="px-8 py-5">Designation</th>
              <th className="px-8 py-5">Hardware ID</th>
              <th className="px-8 py-5">Last Activity</th>
              <th className="px-8 py-5 text-right">Commit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.map(person => (
              <tr key={person.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-400 group-hover:bg-brand-blue-600 group-hover:text-white transition-all">
                      {person.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-800">{person.name}</p>
                      <p className="text-[10px] font-bold text-slate-400">{person.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5">
                   <span className="text-[10px] font-black text-brand-blue-600 uppercase tracking-widest bg-brand-blue-50 px-2 py-1 rounded">
                     {person.role.replace('_', ' ')}
                   </span>
                </td>
                <td className="px-8 py-5">
                   <div className="flex items-center gap-2">
                     <i className={`fas fa-microchip text-[10px] ${person.deviceId ? 'text-emerald-500' : 'text-slate-300'}`}></i>
                     <span className="text-[10px] font-bold text-slate-500 telemetry">{person.deviceId || 'NOT_LINKED'}</span>
                   </div>
                </td>
                <td className="px-8 py-5">
                   <p className="text-[10px] font-bold text-slate-500 telemetry">{person.lastSyncAt ? new Date(person.lastSyncAt).toLocaleString() : 'NEVER'}</p>
                </td>
                <td className="px-8 py-5 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="w-8 h-8 rounded-lg border border-slate-200 text-slate-400 hover:text-brand-blue-600 hover:border-brand-blue-600 transition-all"><i className="fas fa-eye text-[10px]"></i></button>
                    {person.status === 'PENDING' ? (
                      <button className="px-4 py-1 bg-brand-blue-600 text-white rounded-lg text-[9px] font-black uppercase tracking-widest shadow-md shadow-brand-blue-200">Approve</button>
                    ) : (
                      <button className="w-8 h-8 rounded-lg border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-600 transition-all"><i className="fas fa-ban text-[10px]"></i></button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-20 text-center">
             <i className="fas fa-user-slash text-3xl text-slate-100 mb-4"></i>
             <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No matching personnel in this sector</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonnelPage;
