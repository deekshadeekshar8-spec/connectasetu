
import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import { CallLog, Role, CallOutcome } from '../types';

const OUTCOME_OPTIONS: CallOutcome[] = [
  'not answered',
  'not interested',
  'invalid',
  'interested',
  'Answered',
  'book plot visit'
];

const CallsPage: React.FC = () => {
  const { user } = useAuth();
  const [selectedCall, setSelectedCall] = useState<CallLog | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [calls, setCalls] = useState<CallLog[]>([]);
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  
  useEffect(() => {
    const rawCalls: CallLog[] = [
      { 
        id: '1', 
        employeeId: 'me', 
        employeeName: user?.name || 'Self', 
        employeeTeam: 'teamA', 
        phoneNumber: '9876543210', 
        contactName: 'Rahul Verma', 
        direction: 'out', 
        startTime: '2024-05-20T14:20:00Z', 
        endTime: '2024-05-20T14:25:00Z', 
        durationSeconds: 342, 
        callType: 'mobile', 
        source: 'device-sync', 
        recordingUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', 
        recordingConsent: true, 
        notes: 'Followed up on project X. Client requested a detailed quote by tomorrow morning.', 
        outcome: 'interested', 
        createdAt: '2024-05-20T14:25:05Z', 
        customerNumber: '9876543210', 
        status: 'connected',
        syncSource: 'SYSTEM_CORE',
        deviceId: 'DEV_SYSTEM_8829',
        hashSignature: 'HASH_8f2b...3e1a',
        isVerified: true
      },
      { 
        id: '2', 
        employeeId: 'emp2', 
        employeeName: 'Alice Smith', 
        employeeTeam: 'teamA', 
        phoneNumber: '9111222333', 
        contactName: 'Tech Solutions Corp', 
        direction: 'in', 
        startTime: '2024-05-20T15:00:00Z', 
        endTime: '2024-05-20T15:10:00Z', 
        durationSeconds: 600, 
        callType: 'mobile', 
        source: 'device-sync', 
        recordingUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', 
        recordingConsent: true, 
        notes: 'Direct lead conversion! Excited about the premium package.', 
        outcome: 'book plot visit', 
        createdAt: '2024-05-20T15:10:05Z', 
        customerNumber: '9111222333', 
        status: 'connected',
        syncSource: 'SYSTEM_CORE',
        deviceId: 'DEV_SYSTEM_4410',
        hashSignature: 'HASH_1a9c...77db',
        isVerified: true
      },
      { 
        id: '3', 
        employeeId: 'emp3', 
        employeeName: 'Bob Jones', 
        employeeTeam: 'teamB', 
        phoneNumber: '9222333444', 
        contactName: 'Marketing Co', 
        direction: 'out', 
        startTime: '2024-05-21T09:00:00Z', 
        endTime: '2024-05-21T09:05:00Z', 
        durationSeconds: 300, 
        callType: 'mobile', 
        source: 'device-sync', 
        recordingUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', 
        recordingConsent: true, 
        notes: 'Initial outreach. Gatekeeper was professional but firm.', 
        outcome: 'not interested', 
        createdAt: '2024-05-21T09:05:05Z', 
        customerNumber: '9222333444', 
        status: 'connected',
        syncSource: 'SYSTEM_CORE',
        deviceId: 'DEV_SYSTEM_3312',
        hashSignature: 'HASH_3b2d...99aa',
        isVerified: true
      }
    ];

    let filtered = rawCalls;
    if (user?.role === Role.ADMIN) {
      filtered = rawCalls;
    } else if (user?.role === Role.TEAMA_ADMIN) {
      filtered = rawCalls.filter(c => c.employeeTeam === 'teamA');
    } else if (user?.role === Role.TEAMB_ADMIN) {
      filtered = rawCalls.filter(c => c.employeeTeam === 'teamB');
    } else {
      filtered = rawCalls.filter(c => c.employeeId === 'me' || c.employeeName === user?.name);
    }
    setCalls(filtered);
  }, [user]);

  const handleUpdateOutcome = (callId: string, newOutcome: CallOutcome) => {
    setCalls(prev => prev.map(c => c.id === callId ? { ...c, outcome: newOutcome } : c));
    if (selectedCall?.id === callId) {
      setSelectedCall(prev => prev ? { ...prev, outcome: newOutcome } : null);
    }
  };

  const toggleExpand = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Don't trigger the modal when clicking expansion icon
    setExpandedRowId(expandedRowId === id ? null : id);
  };

  const filteredCalls = calls.filter(c => 
    (c.phoneNumber || '').includes(searchTerm) || 
    (c.contactName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.employeeName || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">COMMUNICATION TELEMETRY</h1>
          <p className="text-slate-500 text-[11px] font-bold uppercase tracking-widest mt-0.5">Fleet-wide interaction logs</p>
        </div>
        <div className="relative w-full max-w-sm">
          <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
          <input 
            type="text" 
            placeholder="Search identity or number..."
            className="w-full bg-white pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-brand-blue-500 outline-none font-bold text-xs shadow-sm transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-separate border-spacing-0">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                <th className="px-6 py-4 w-10"></th>
                <th className="px-6 py-4">Identity</th>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Commit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCalls.map(call => {
                const isExpanded = expandedRowId === call.id;
                const canAccessPlayback = user?.role === Role.ADMIN || call.employeeId === 'me' || call.employeeName === user?.name;
                
                return (
                  <React.Fragment key={call.id}>
                    {/* Primary Condensed Row */}
                    <tr 
                      className={`group transition-all cursor-pointer ${isExpanded ? 'bg-brand-blue-50/30' : 'hover:bg-slate-50'}`}
                      onClick={() => setSelectedCall(call)}
                    >
                      <td className="px-6 py-4">
                        <button 
                          onClick={(e) => toggleExpand(e, call.id)}
                          className={`w-6 h-6 rounded-md flex items-center justify-center transition-all ${isExpanded ? 'bg-brand-blue-600 text-white shadow-md rotate-90' : 'bg-slate-100 text-slate-400 hover:text-brand-blue-600'}`}
                        >
                          <i className="fas fa-chevron-right text-[10px]"></i>
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 text-[10px] font-black">
                             {call.contactName?.charAt(0) || '?'}
                           </div>
                           <span className="font-black text-slate-700">{call.contactName || 'Unresolved Lead'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-black text-slate-900 telemetry text-[11px]">
                            {new Date(call.startTime || call.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                          </span>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">
                            {new Date(call.startTime || call.createdAt).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border shadow-sm ${
                          call.outcome === 'interested' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                          call.outcome === 'book plot visit' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : 
                          call.outcome === 'not interested' ? 'bg-rose-50 text-rose-700 border-rose-100' : 
                          'bg-slate-100 text-slate-600 border-slate-200'
                        }`}>
                          {call.outcome || 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                         <i className="fas fa-arrow-right-long text-slate-200 group-hover:text-brand-blue-600 transition-all group-hover:translate-x-1"></i>
                      </td>
                    </tr>

                    {/* Expandable Details Pane */}
                    {isExpanded && (
                      <tr className="bg-brand-blue-50/20">
                        <td colSpan={5} className="px-12 py-6 border-b border-brand-blue-100/50">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 animate-in">
                            <div className="space-y-1">
                               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Phone Vector</p>
                               <p className="text-xs font-black text-slate-800 telemetry">{call.phoneNumber || call.customerNumber}</p>
                            </div>
                            <div className="space-y-1">
                               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Handling Operator</p>
                               <div className="flex items-center gap-2">
                                 <p className="text-xs font-black text-brand-blue-600">{call.employeeName}</p>
                                 <span className="text-[8px] font-black bg-white px-1.5 py-0.5 rounded border border-brand-blue-100 text-brand-blue-400">{call.employeeTeam?.toUpperCase()}</span>
                               </div>
                            </div>
                            <div className="space-y-1">
                               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Session Logic</p>
                               <div className="flex items-center gap-3">
                                  <div className="flex flex-col">
                                    <span className="text-xs font-black text-slate-800 telemetry">{Math.floor(call.durationSeconds / 60)}m {call.durationSeconds % 60}s</span>
                                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Verified Duration</span>
                                  </div>
                                  <div className={`w-1.5 h-6 rounded-full ${call.isVerified ? 'bg-emerald-400' : 'bg-slate-200'}`} title="Blockchain Verified Log"></div>
                               </div>
                            </div>
                            <div className="space-y-2">
                               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Evidence Registry</p>
                               {call.recordingUrl && canAccessPlayback ? (
                                 <div className="p-1 bg-white rounded-lg border border-brand-blue-100 shadow-sm flex items-center">
                                   <audio controls className="w-full h-6 scale-[0.8] origin-left">
                                      <source src={call.recordingUrl} type="audio/mpeg" />
                                   </audio>
                                 </div>
                               ) : (
                                 <div className="flex items-center gap-2 text-[10px] font-bold text-slate-300 italic">
                                   <i className="fas fa-lock text-[8px]"></i>
                                   Audio Locked / No Consent
                                 </div>
                                )}
                            </div>
                            
                            {/* Deep Analytics Row */}
                            <div className="md:col-span-4 pt-4 border-t border-slate-100 flex justify-between items-center">
                               <div className="flex gap-4">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[9px] font-black text-slate-300 uppercase">Device:</span>
                                    <span className="text-[10px] font-bold text-slate-500 telemetry">{call.deviceId}</span>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[9px] font-black text-slate-300 uppercase">Source:</span>
                                    <span className="text-[10px] font-bold text-slate-500 telemetry">{call.syncSource}</span>
                                  </div>
                               </div>
                               <button 
                                 onClick={() => setSelectedCall(call)}
                                 className="text-[10px] font-black text-brand-blue-600 uppercase hover:underline"
                               >
                                 Edit Narrative Log <i className="fas fa-pencil ml-1"></i>
                               </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
              {filteredCalls.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center space-y-3">
                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200">
                      <i className="fas fa-search"></i>
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No matching logs found in terminal memory</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Narrative Update Modal */}
      {selectedCall && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-xl shadow-2xl animate-in border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-2xl bg-brand-blue-600 text-white flex items-center justify-center shadow-lg shadow-brand-blue-600/20">
                   <i className="fas fa-brain text-sm"></i>
                 </div>
                 <div>
                   <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Intelligence Log</h3>
                   <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Post-Interaction Analysis</p>
                 </div>
              </div>
              <button onClick={() => setSelectedCall(null)} className="w-8 h-8 rounded-full bg-white border border-slate-100 text-slate-400 hover:text-slate-900 shadow-sm transition-all"><i className="fas fa-times text-xs"></i></button>
            </div>

            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Identity Vector</p>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="font-black text-slate-900">{selectedCall.contactName || 'Unresolved'}</p>
                    <p className="text-xs font-bold text-slate-500 telemetry">{selectedCall.phoneNumber || selectedCall.customerNumber}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Outcome Pipeline</p>
                  <select 
                    value={selectedCall.outcome}
                    onChange={(e) => handleUpdateOutcome(selectedCall.id, e.target.value as CallOutcome)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 text-xs font-black text-slate-900 focus:border-brand-blue-600 outline-none shadow-sm transition-all"
                  >
                    <option value="pending" disabled>Awaiting Classification</option>
                    {OUTCOME_OPTIONS.map(opt => <option key={opt} value={opt}>{opt.toUpperCase()}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Narrative Transcript / Notes</label>
                <textarea 
                  className="w-full px-6 py-5 rounded-3xl bg-slate-50 border border-slate-200 text-xs font-bold min-h-[140px] focus:border-brand-blue-600 outline-none shadow-inner leading-relaxed"
                  placeholder="Record tactical observations and follow-up requirements..."
                  defaultValue={selectedCall.notes}
                  onBlur={(e) => {
                    setCalls(prev => prev.map(c => c.id === selectedCall.id ? { ...c, notes: e.target.value } : c));
                  }}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  onClick={() => setSelectedCall(null)}
                  className="flex-1 py-4 bg-brand-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-brand-blue-600/20 hover:bg-brand-blue-700 transition-all active:scale-95"
                >
                  Save Intelligence
                </button>
                <button 
                  onClick={() => setSelectedCall(null)}
                  className="px-8 py-4 bg-white border border-slate-200 text-slate-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all"
                >
                  Discard
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CallsPage;
