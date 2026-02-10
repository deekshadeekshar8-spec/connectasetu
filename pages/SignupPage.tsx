
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../App';
import { Role } from '../types';
import Logo from '../components/Logo';

const SignupPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    password: '',
    role: Role.TEAMA_EMPLOYEE
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<{ message: string; type: 'register' | 'general' } | null>(null);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await signup(formData);
      setIsSubmitted(true);
    } catch (err: any) {
      setError({ message: "Registration protocol failure.", type: 'general' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const roleOptions = [
    { id: Role.ADMIN, label: 'Global Admin', icon: 'fa-chess-king', color: 'text-red-600' },
    { id: Role.TEAMA_ADMIN, label: 'Team A Admin', icon: 'fa-shield-halved', color: 'text-blue-600' },
    { id: Role.TEAMB_ADMIN, label: 'Team B Admin', icon: 'fa-shield-halved', color: 'text-green-600' },
    { id: Role.TEAMA_EMPLOYEE, label: 'Team A Staff', icon: 'fa-user-tie', color: 'text-blue-400' },
    { id: Role.TEAMB_EMPLOYEE, label: 'Team B Staff', icon: 'fa-user-tie', color: 'text-green-400' },
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-blue-50 p-6">
        <div className="max-w-[540px] w-full bg-white rounded-[40px] shadow-2xl p-10 flex flex-col items-center border border-brand-blue-100 text-center animate-in">
          <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center text-emerald-500 mb-8 border border-emerald-100">
            <i className="fas fa-check-double text-3xl"></i>
          </div>
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-4">Enrollment Protocol Submitted</h2>
          <p className="text-sm text-slate-500 font-medium leading-relaxed mb-8">
            Your login credentials have been recorded. Our administrators will verify your identity vector <span className="font-bold text-brand-blue-600">({formData.email})</span> and deployment role before granting access key clearance.
          </p>
          <div className="w-full bg-slate-50 rounded-2xl p-6 border border-slate-100 mb-8 space-y-3">
             <div className="flex justify-between items-center">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Identity Vector</span>
               <span className="text-xs font-black text-slate-700">{formData.email}</span>
             </div>
             <div className="flex justify-between items-center">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Access Key</span>
               <span className="text-xs font-black text-slate-700">••••••••</span>
             </div>
             <div className="flex justify-between items-center">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Deployment Role</span>
               <span className="text-xs font-black text-brand-blue-600 uppercase">{formData.role.replace('_', ' ')}</span>
             </div>
          </div>
          <Link 
            to="/login" 
            className="w-full py-4 bg-brand-blue-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.25em] shadow-xl shadow-brand-blue-200 hover:bg-brand-blue-700 transition-all text-center"
          >
            Return to Terminal
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-blue-50 p-6 py-12">
      <div className="max-w-[540px] w-full bg-white rounded-[40px] shadow-2xl p-10 flex flex-col items-center border border-brand-blue-100">
        
        <Logo className="mb-8" size="md" />
        <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.3em] mb-8">Team Enrollment Hub</h2>

        <form onSubmit={handleSubmit} className="w-full space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 tracking-widest uppercase ml-1">Identity (Full Name)</label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 focus:border-brand-blue-500 outline-none transition-all font-bold text-slate-700 text-sm"
                placeholder="Operator Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 tracking-widest uppercase ml-1">Communication (Phone)</label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 focus:border-brand-blue-500 outline-none transition-all font-bold text-slate-700 text-sm"
                placeholder="Phone Vector"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 tracking-widest uppercase ml-1">Identity Vector (Email)</label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 focus:border-brand-blue-500 outline-none transition-all font-bold text-slate-700 text-sm"
              placeholder="work@connectasetu.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 tracking-widest uppercase ml-1">Access Key (Password)</label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 focus:border-brand-blue-500 outline-none transition-all font-bold text-slate-700 text-sm"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 tracking-widest uppercase ml-1">Deployment Role</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {roleOptions.map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => setFormData({...formData, role: opt.id})}
                  className={`cursor-pointer group relative p-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-1.5 ${
                    formData.role === opt.id 
                      ? 'border-brand-blue-600 bg-white shadow-xl scale-[1.02]' 
                      : 'border-transparent bg-slate-50 hover:bg-white hover:border-slate-100'
                  }`}
                >
                  <i className={`fas ${opt.icon} ${opt.color} text-xs`}></i>
                  <span className={`text-[8px] font-black uppercase text-center leading-tight ${formData.role === opt.id ? 'text-slate-900' : 'text-slate-400'}`}>
                    {opt.label}
                  </span>
                </div>
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
            disabled={isSubmitting}
            className="w-full py-4 bg-brand-blue-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.25em] shadow-xl shadow-brand-blue-200 hover:bg-brand-blue-700 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:bg-slate-300"
          >
            {isSubmitting && <i className="fas fa-spinner fa-spin"></i>}
            {isSubmitting ? 'Encrypting Data...' : 'Submit for Review'}
          </button>
        </form>

        <p className="mt-8 text-[10px] font-black text-slate-300 uppercase tracking-widest">
          Already Enrolled?{' '}
          <Link to="/login" className="text-brand-blue-600 hover:underline">Return to Terminal</Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
