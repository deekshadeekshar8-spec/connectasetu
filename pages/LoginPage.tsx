
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../App';
import { Role } from '../types';
import Logo from '../components/Logo';

const LoginPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<Role>(Role.ADMIN);
  const [error, setError] = useState<{ message: string; type: 'access' | 'general' } | null>(null);
  const { login, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const state = location.state as any;
    if (state?.denied) {
      setError({
        message: `Clearance Error: Your role lacks permission for this sector.`,
        type: 'access'
      });
      logout();
    }
  }, [location, logout]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(name, email, role);
      navigate('/dashboard');
    } catch (err: any) {
      setError({ message: err.message || "Login failed.", type: 'general' });
    }
  };

  const roleOptions = [
    { id: Role.ADMIN, label: 'Global Admin', icon: 'fa-chess-king' },
    { id: Role.TEAMA_ADMIN, label: 'Team A Admin', icon: 'fa-shield-halved' },
    { id: Role.TEAMB_ADMIN, label: 'Team B Admin', icon: 'fa-shield-halved' },
    { id: Role.TEAMA_EMPLOYEE, label: 'Team A Staff', icon: 'fa-user-gear' },
    { id: Role.TEAMB_EMPLOYEE, label: 'Team B Staff', icon: 'fa-user-gear' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-blue-50 p-6">
      <div className="max-w-xl w-full bg-white rounded-3xl shadow-2xl shadow-brand-blue-200 border border-brand-blue-100 p-10 space-y-8 animate-in">
        <div className="flex flex-col items-center">
          <Logo size="md" className="mb-4" />
          <h1 className="text-xl font-bold text-slate-900 tracking-tight uppercase">Operator Terminal</h1>
          <p className="text-slate-500 text-sm font-medium tracking-wide">Secure connectasetu Link Active</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Operator Name</label>
            <input
              type="text"
              required
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-brand-blue-100 focus:border-brand-blue-500 outline-none transition-all font-semibold text-sm"
              placeholder="e.g. Rahul Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Identity Vector (Email)</label>
              <input
                type="email"
                required
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-brand-blue-100 focus:border-brand-blue-500 outline-none transition-all font-semibold text-sm"
                placeholder="operator@connectasetu.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Access Key (Password)</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-brand-blue-100 focus:border-brand-blue-500 outline-none transition-all font-semibold text-sm"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-blue-600 transition-colors"
                  title={showPassword ? "Hide Password" : "Show Password"}
                >
                  <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-xs`}></i>
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 text-center block">Clearance Designation</label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {roleOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setRole(opt.id)}
                  className={`py-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all h-20 ${
                    role === opt.id 
                      ? 'border-brand-blue-600 bg-brand-blue-600 text-white shadow-lg scale-[1.02]' 
                      : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-brand-blue-200'
                  }`}
                >
                  <i className={`fas ${opt.icon} text-sm`}></i>
                  <span className="text-[8px] font-bold uppercase tracking-tight text-center leading-tight px-1">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-3">
              <i className="fas fa-exclamation-triangle text-rose-500 mt-0.5 text-xs"></i>
              <p className="text-[10px] font-bold text-rose-700 leading-normal uppercase tracking-wide">{error.message}</p>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-4 bg-brand-orange-500 text-white rounded-xl font-bold text-xs uppercase tracking-[0.2em] hover:bg-brand-orange-600 transition-all shadow-xl shadow-brand-orange-500/20 active:scale-[0.98]"
          >
            Authenticate Access
          </button>
        </form>

        <p className="text-center text-[10px] font-bold text-slate-300 uppercase tracking-widest">
          No active profile?{' '}
          <Link to="/signup" className="text-brand-blue-600 hover:underline">Request Team Enrollment</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
