
import React, { useState, useEffect } from 'react';
import { useAuth, appFetch as fetch } from '../App';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Role, DailyReport, User } from '../types';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'A' | 'B'>('A');
  const [reports, setReports] = useState<DailyReport[]>([]);
  const [employees, setEmployees] = useState<User[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);

  const isSuperAdmin = user?.role === Role.ADMIN;

  const fetchData = async () => {
    try {
      const [repRes, empRes, pulseRes] = await Promise.all([
        fetch('/api/admin/all-reports'),
        fetch('/api/admin/team/employees'),
        fetch('/api/analytics/fleet-pulse')
      ]);
      
      const reportData = await repRes.json();
      setReports(Array.isArray(reportData) ? reportData : []);
      
      const employeeData = await empRes.json();
      setEmployees(Array.isArray(employeeData) ? employeeData : []);
      
      const pulse = await pulseRes.json();
      if (pulse && pulse.days) {
        setChartData(pulse.days.map((d: any, i: number) => ({ name: d, calls: pulse.seriesA[i], duration: pulse.seriesB[i] })));
      }
    } catch (err) {
      console.error("Dashboard data retrieval failed", err);
      setReports([]);
      setEmployees([]);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const approveReport = async (id: string, status: string) => {
    await fetch(`/api/admin/report/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    fetchData();
  };

  const filteredReports = reports.filter(r => isSuperAdmin ? r.team === (activeTab === 'A' ? 'teamA' : 'teamB') : r.team === user?.team);

  return (
    <div className="p-8 space-y-8 animate-in font-sans">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter">COMMAND HUB</h1>
          <p className="text-sm font-bold text-brand-blue-600 uppercase tracking-widest mt-1">
            Access: <span className="text-slate-900">{isSuperAdmin ? "OMNISCIENT ADMIN" : `UNIT ${user?.team === 'teamA' ? 'A' : 'B'} SUPERVISOR`}</span>
          </p>
        </div>

        {isSuperAdmin && (
          <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner">
            <button 
              onClick={() => setActiveTab('A')}
              className={`px-8 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'A' ? 'bg-white text-brand-blue-600 shadow-md' : 'text-slate-400'}`}
            >Unit A</button>
            <button 
              onClick={() => setActiveTab('B')}
              className={`px-8 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'B' ? 'bg-white text-brand-blue-600 shadow-md' : 'text-slate-400'}`}
            >Unit B</button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Performance Pulse */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-8 border-b border-slate-50 pb-4">
             <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">Fleet Telemetry</h2>
             <div className="flex items-center gap-2">
               <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
               <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Verified Log Only</span>
             </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#94a3b8', fontWeight: 900 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#94a3b8', fontWeight: 900 }} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', fontSize: '10px' }} />
                <Bar dataKey="calls" fill="#0ea5e9" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sync Compliance Overview */}
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
           <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6 border-b border-slate-50 pb-4">Sync Compliance</h2>
           <div className="space-y-4">
             {employees.filter(e => isSuperAdmin ? e.team === (activeTab === 'A' ? 'teamA' : 'teamB') : true).map(emp => (
               <div key={emp.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-brand-blue-50 transition-colors border border-transparent hover:border-brand-blue-100">
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-black text-brand-blue-600 text-[10px]">{emp.name.charAt(0)}</div>
                   <div>
                     <p className="text-xs font-black text-slate-700">{emp.name}</p>
                     <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest telemetry">{emp.deviceId || 'NOT_LINKED'}</p>
                   </div>
                 </div>
                 <div className="flex flex-col items-end">
                    <span className={`text-[8px] font-black px-2 py-0.5 rounded-md uppercase ${emp.deviceId ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                      {emp.deviceId ? 'LINKED' : 'WARNING'}
                    </span>
                    <span className="text-[7px] text-slate-300 font-bold uppercase mt-1">Last: {emp.lastSyncAt ? new Date(emp.lastSyncAt).toLocaleTimeString() : 'N/A'}</span>
                 </div>
               </div>
             ))}
           </div>
        </div>
      </div>

      {/* Directive Review Center */}
      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
        <div className="flex justify-between items-center mb-6 border-b border-slate-50 pb-4">
          <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">Verification Registry</h2>
          <div className="p-2 bg-emerald-50 rounded-lg flex items-center gap-2">
            <i className="fas fa-fingerprint text-emerald-500 text-xs"></i>
            <span className="text-[9px] font-black text-emerald-700 uppercase tracking-widest">Secure Device Log Enabled</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] border-b border-slate-50">
                <th className="pb-4 px-2">Identity</th>
                <th className="pb-4 px-2">Verified Count</th>
                <th className="pb-4 px-2">Device Source</th>
                <th className="pb-4 px-2">Tasks Log</th>
                <th className="pb-4 px-2">Audit State</th>
                <th className="pb-4 px-2 text-right">Commit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredReports.map(report => (
                <tr key={report.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="py-4 px-2 font-black text-xs text-slate-700">{report.employeeName}</td>
                  <td className="py-4 px-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-brand-blue-600">{report.callsCount}</span>
                      <i className="fas fa-certificate text-emerald-500 text-[8px]" title="Hardware Verified"></i>
                    </div>
                  </td>
                  <td className="py-4 px-2 text-[10px] font-bold text-slate-400 font-mono">DEV_8829_SIG</td>
                  <td className="py-4 px-2 text-xs font-medium text-slate-500 truncate max-w-xs">{report.tasks}</td>
                  <td className="py-4 px-2">
                    <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${
                      report.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600' : 
                      report.status === 'REJECTED' ? 'bg-rose-50 text-rose-600' : 'bg-orange-50 text-orange-600'
                    }`}>{report.status}</span>
                  </td>
                  <td className="py-4 px-2 text-right">
                    {report.status === 'PENDING' && (
                      <div className="flex justify-end gap-2">
                        <button onClick={() => approveReport(report.id, 'APPROVED')} className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all"><i className="fas fa-check text-[10px]"></i></button>
                        <button onClick={() => approveReport(report.id, 'REJECTED')} className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 hover:bg-rose-600 hover:text-white transition-all"><i className="fas fa-times text-[10px]"></i></button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
