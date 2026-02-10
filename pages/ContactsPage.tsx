
import React, { useState, useEffect } from 'react';
import { useAuth, appFetch as fetch } from '../App';
import { Contact, Role } from '../types';

const ContactsPage: React.FC = () => {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  const fetchContacts = async (search = '') => {
    try {
      const res = await fetch(`/api/contacts?search=${search}`);
      if (!res.ok) throw new Error("API call failed");
      
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const data = await res.json();
        // Robust check to ensure contacts is always an array
        setContacts(Array.isArray(data) ? data : []);
      } else {
        const text = await res.text();
        console.warn("Expected JSON but received:", text.substring(0, 50));
        setContacts([]);
      }
    } catch (err) {
      console.error("Contacts retrieval failed", err);
      setContacts([]);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchContacts(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await fetch('/api/contacts/sync', { method: 'POST' });
      await fetchContacts();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="p-8 space-y-8 animate-in font-sans bg-white min-h-full border-l border-brand-blue-50 shadow-inner">
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Contacts Directory</h1>
          <p className="text-sm text-slate-500 font-medium">Manage and monitor all authorized communication vectors.</p>
        </div>
        <div className="flex items-center gap-3">
           <button 
             onClick={handleSync}
             disabled={isSyncing}
             className="bg-brand-blue-600 text-white px-5 py-2 rounded-lg font-bold text-[11px] uppercase tracking-widest hover:bg-brand-blue-700 transition-all shadow-lg shadow-brand-blue-600/20 flex items-center gap-2 disabled:bg-slate-300"
           >
             <i className={`fas ${isSyncing ? 'fa-spinner fa-spin' : 'fa-file-import'}`}></i> 
             {isSyncing ? 'Processing...' : 'Sync Data'}
           </button>
           <button className="bg-white border border-brand-blue-200 px-5 py-2 rounded-lg text-[11px] font-bold uppercase tracking-widest text-slate-700 hover:bg-brand-blue-50 transition-all shadow-sm">
             Create Record
           </button>
        </div>
      </div>

      <div className="bg-white border border-brand-blue-100 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 bg-brand-blue-50/20 border-b border-brand-blue-100 flex items-center justify-between">
          <div className="relative w-full max-w-sm">
            <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
            <input 
              type="text" 
              placeholder="Filter by name, vector, or identity..." 
              className="w-full bg-white border border-brand-blue-200 rounded-lg py-2 pl-9 pr-4 text-xs focus:outline-none focus:ring-1 focus:ring-brand-blue-500 font-medium placeholder:text-slate-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-brand-blue-50/50 text-brand-blue-900 text-[10px] uppercase font-bold tracking-widest">
              <tr>
                <th className="px-6 py-4 border-b border-brand-blue-100">Identity</th>
                <th className="px-6 py-4 border-b border-brand-blue-100">Phone Vector</th>
                <th className="px-6 py-4 border-b border-brand-blue-100">Team Clearance</th>
                <th className="px-6 py-4 border-b border-brand-blue-100">Security State</th>
                <th className="px-6 py-4 border-b border-brand-blue-100 text-right">Registered</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {contacts.map(contact => (
                <tr key={contact.id} className="hover:bg-brand-blue-50/30 group transition-colors cursor-pointer">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-brand-blue-100 text-brand-blue-600 flex items-center justify-center text-xs font-bold border border-brand-blue-200 shadow-sm">
                        {contact.name.charAt(0)}
                      </div>
                      <span className="font-bold text-slate-800 group-hover:text-brand-blue-600 transition-colors">{contact.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-xs font-semibold telemetry">{contact.phone}</td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {contact.team === 'none' ? 'Global Fleet' : contact.team.replace('team', 'Team ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-bold border ${
                      contact.securityState === 'VERIFIED' 
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                      : 'bg-orange-50 text-orange-600 border-orange-100'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${contact.securityState === 'VERIFIED' ? 'bg-emerald-500 animate-pulse' : 'bg-orange-400'}`}></div>
                      {contact.securityState}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-[11px] font-bold text-slate-300 telemetry">
                    {contact.registeredDate ? new Date(contact.registeredDate).toLocaleDateString() : 'N/A'}
                  </td>
                </tr>
              ))}
              {contacts.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
                    No matching identities found in directory
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ContactsPage;
