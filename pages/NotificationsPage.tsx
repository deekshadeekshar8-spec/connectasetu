
import React, { useState, useEffect } from 'react';
import { appFetch as fetch } from '../App';
import { Notification } from '../types';

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const load = async () => {
      const res = await fetch('/api/notifications');
      const data = await res.json();
      setNotifications(data);
    };
    load();
  }, []);

  return (
    <div className="p-8 space-y-8 animate-in max-w-3xl mx-auto">
      <div className="flex justify-between items-end border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Intelligence Feed</h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Operational Alerts & Security Pulses</p>
        </div>
        <button className="text-[10px] font-black text-brand-blue-600 uppercase hover:underline">Mark all as read</button>
      </div>

      <div className="space-y-4">
        {notifications.map(notif => (
          <div key={notif.id} className={`p-6 rounded-3xl border transition-all flex gap-5 ${notif.isRead ? 'bg-white border-slate-100 opacity-70' : 'bg-white border-brand-blue-100 shadow-sm border-l-4 border-l-brand-blue-600'}`}>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
              notif.type === 'ALERT' ? 'bg-rose-50 text-rose-500' : 
              notif.type === 'SUCCESS' ? 'bg-emerald-50 text-emerald-500' : 'bg-brand-blue-50 text-brand-blue-500'
            }`}>
              <i className={`fas ${
                notif.type === 'ALERT' ? 'fa-triangle-exclamation' : 
                notif.type === 'SUCCESS' ? 'fa-check-double' : 'fa-info-circle'
              } text-xl`}></i>
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-black text-slate-800">{notif.title}</h3>
                <span className="text-[10px] font-bold text-slate-300 telemetry">{new Date(notif.timestamp).toLocaleTimeString()}</span>
              </div>
              <p className="text-xs font-medium text-slate-500 leading-relaxed">{notif.message}</p>
              <div className="pt-3 flex gap-4">
                <button className="text-[10px] font-black text-brand-blue-600 uppercase tracking-widest">Acknowledge</button>
                <button className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {notifications.length === 0 && (
        <div className="py-20 text-center space-y-4">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200">
            <i className="fas fa-inbox text-2xl"></i>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Quiet in this sector. No active notifications.</p>
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
