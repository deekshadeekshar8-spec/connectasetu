
import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { Role } from '../types';
import Logo from './Logo';

const DashboardLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAdmin = user?.role.includes('admin');

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: 'fa-house' },
    { name: 'Contacts', path: '/contacts', icon: 'fa-user-group' },
    { name: 'Calls', path: '/calls', icon: 'fa-phone-volume' },
    ...(isAdmin ? [{ name: 'Personnel', path: '/personnel', icon: 'fa-users-gear' }] : []),
    { name: 'Notifications', path: '/notifications', icon: 'fa-bell' },
    { name: 'Settings', path: '/settings', icon: 'fa-sliders' },
  ];

  return (
    <div className="flex flex-col h-screen bg-white font-sans overflow-hidden">
      <header className="h-16 bg-brand-blue-50 border-b border-brand-blue-100 flex items-center justify-between px-6 z-50">
        <div className="flex items-center gap-6 flex-1">
          <Logo size="sm" />
          <div className="relative w-full max-w-lg flex items-center gap-2">
            <div className="relative flex-1">
              <input 
                type="text" 
                placeholder="Search telemetry..." 
                className="w-full bg-white border border-brand-blue-200 rounded-md py-1.5 pl-3 pr-8 text-slate-700 text-sm focus:outline-none focus:ring-1 focus:ring-brand-blue-500 shadow-sm"
              />
              <i className="fas fa-search absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <button className="flex items-center gap-2 text-[12px] font-bold text-slate-700 hover:text-brand-blue-600 transition-colors">
            <i className="fas fa-sparkles text-brand-orange-500"></i>
            <span>System Status: <span className="text-emerald-500">ONLINE</span></span>
          </button>
          <div className="flex items-center gap-2 pl-4 border-l border-brand-blue-200">
            <div className="w-8 h-8 rounded-full bg-brand-blue-600 flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
              {user?.name.charAt(0)}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-black text-slate-800 leading-none">{user?.name}</span>
              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{user?.role.replace('_', ' ')}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-[64px] bg-white border-r border-brand-blue-100 flex flex-col items-center py-6 gap-6">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => 
                `group relative w-10 h-10 flex items-center justify-center rounded-xl transition-all ${
                  isActive ? 'bg-brand-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50 hover:text-brand-blue-600'
                }`
              }
              title={item.name}
            >
              <i className={`fas ${item.icon} text-sm`}></i>
              <div className="absolute left-14 px-2 py-1 bg-slate-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                {item.name}
              </div>
            </NavLink>
          ))}
          <div className="mt-auto mb-2">
             <button onClick={handleLogout} className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-rose-500 transition-all">
               <i className="fas fa-power-off text-sm"></i>
             </button>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto bg-slate-50/30">
          <div className="max-w-[1400px] mx-auto min-h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
