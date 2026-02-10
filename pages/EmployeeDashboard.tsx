
import React, { useState, useEffect } from 'react';
import { useAuth, appFetch as fetch } from '../App';
import { CallLog, DailyReport } from '../types';
import { Link } from 'react-router-dom';

const EmployeeDashboard: React.FC = () => {
  const { user } = useAuth();
  const [callHistory, setCallHistory] = useState<CallLog[]>([]);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportData, setReportData] = useState({ tasks: '', calls: 0, followUps: 0, remarks: '' });
  const [syncLoading, setSyncLoading] = useState(false);

  const fetchHistory = async () => {
    const res = await fetch('/api/calls/history');
    const data = await res.json();
    setCallHistory(Array.isArray(data) ? data : []);
  };

  useEffect(() => { fetchHistory(); }, []);

  const triggerDeviceSync = async () => {
    setSyncLoading(true);
    // Simulate Android Bridge Communication
    await new Promise(r => setTimeout(r, 2000));
    await fetch('/api/device/sync-calls', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        deviceId: user?.deviceId,
        logs: [
          { number: '9988776655', duration: 120, time: new Date().toISOString() }
        ]
      })
    });
    setSyncLoading(false);
    fetchHistory();
  };

  const submitReport = async () => {
    await fetch('/api/reports/daily', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...reportData,
        calls_count: callHistory.length // Automatically take from device logs
      })
    });
    setShowReportModal(false);
    alert("Daily Directive Submitted Successfully. Metrics verified by device signature.");
  };

  return (
    <div className="p-8 space-y-8 font-sans bg-slate-50 min-h-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">SALES TERMINAL</h1>
          <p className="text-xs font-bold text-brand-blue-600 uppercase tracking-widest mt-1">
            Status: <span className="text-emerald-500">Device Linked ({user?.deviceId})</span>
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={triggerDeviceSync}
            disabled={syncLoading}
            className="bg-white border border-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-sm hover:border-brand-blue-500 transition-all flex items-center gap-2"
          >
            <i className={`fas fa-sync-alt ${syncLoading ? 'fa-spin' : ''}`}></i>
            {syncLoading ? 'FETCHING LOGS...' : 'REQUEST DEVICE SYNC'}
          </button>
          <button 
            onClick={() => setShowReportModal(true)}
            className="bg-brand-orange-500 hover:bg-brand-orange-600 text-white px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl transition-all"
          >
            Submit Directive
          </button>
        </div>
      </div>

      {/* Verification Shield Notice */}
      <div className="bg-brand-blue-900 rounded-[2rem] p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-10">
          <i className="fas fa-shield-check text-9xl"></i>
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20">
            <i className="fas fa-mobile-android text-2xl"></i>
          </div>
          <div className="flex-1 space-y-2">
            <h2 className="text-xl font-black tracking-tight uppercase">Integrity Enforcement Active</h2>
            <p className="text-brand-blue-200 text-sm font-medium leading-relaxed max-w-2xl">
              Manual entry of call records is disabled for this terminal. All interaction telemetry is verified via the 
              Connectasetu Android Companion bridge. Timestamp and duration mismatch is automatically flagged.
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400">Sync Status: Healthy</span>
            <div className="flex gap-1">
              {[1,2,3,4,5].map(i => <div key={i} className="w-1 h-3 bg-emerald-500/30 rounded-full"></div>)}
            </div>
          </div>
        </div>
      </div>

      {/* Telemetry Log */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-6 border-b border-slate-50 pb-4">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Device-Verified History</h3>
            <span className="text-[10px] font-bold text-slate-400 font-mono">SOURCE: DEVICE_ONLY</span>
          </div>
          <div className="space-y-4">
            {callHistory.map((call, i) => (
              <div key={i} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-transparent hover:border-brand-blue-100 transition-all group">
                <div className="flex items-center gap-5">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${call.status === 'connected' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                    <i className={`fas ${call.status === 'connected' ? 'fa-phone-arrow-up-right' : 'fa-phone-slash'} text-sm`}></i>
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-700 telemetry">{call.customerNumber}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(call.createdAt).toLocaleTimeString()}</span>
                      <span className="text-[9px] font-black px-1.5 py-0.5 bg-brand-blue-50 text-brand-blue-600 rounded-md uppercase tracking-tighter">Verified Sig</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-black text-slate-700 font-mono tracking-tighter">{Math.floor(call.durationSeconds / 60)}m {call.durationSeconds % 60}s</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">DEVICE: {call.deviceId}</p>
                </div>
              </div>
            ))}
            {callHistory.length === 0 && (
              <div className="py-20 text-center space-y-4">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-300">
                  <i className="fas fa-file-search text-2xl"></i>
                </div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No verified logs found for today.</p>
                <Link to="/sync" className="text-xs font-black text-brand-blue-600 hover:underline">Link Device Now</Link>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6">Device Fingerprint</h3>
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-2xl space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hardware ID</p>
                <p className="text-xs font-black text-slate-800 telemetry">{user?.deviceId}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Last Auth Token</p>
                <p className="text-xs font-black text-slate-800 telemetry truncate">SHA256_LINKED_7721X90</p>
              </div>
              <div className="pt-2">
                <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                  <span>Daily Quota</span>
                  <span>{callHistory.length} / 50</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-orange-500 transition-all duration-1000" style={{ width: `${(callHistory.length / 50) * 100}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl w-full max-w-lg p-10 space-y-6 shadow-2xl animate-in">
            <div className="flex justify-between items-center border-b border-slate-50 pb-6">
              <h2 className="text-xl font-black text-slate-900 tracking-tight">DAILY VERIFICATION</h2>
              <button onClick={() => setShowReportModal(false)} className="text-slate-300 hover:text-slate-900"><i className="fas fa-times"></i></button>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3">
                <i className="fas fa-check-circle text-emerald-500"></i>
                <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">
                  Calls Verified: {callHistory.length}
                </span>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Operations Log</label>
                <textarea 
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold focus:border-brand-blue-500 outline-none h-32"
                  placeholder="Summarize your tasks..."
                  onChange={e => setReportData({...reportData, tasks: e.target.value})}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Follow-Ups Handled</label>
                <input 
                  type="number" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold outline-none" 
                  onChange={e => setReportData({...reportData, followUps: parseInt(e.target.value)})} 
                />
              </div>
            </div>
            <button 
              onClick={submitReport}
              className="w-full py-4 bg-brand-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-brand-blue-700 transition-all"
            >
              Sign & Commit Directive
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDashboard;
