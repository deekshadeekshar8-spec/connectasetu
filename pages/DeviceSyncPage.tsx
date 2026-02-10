
import React, { useState } from 'react';
import { useAuth } from '../App';
import Logo from '../components/Logo';
import { useNavigate } from 'react-router-dom';

const DeviceSyncPage: React.FC = () => {
  const { user, bindDevice } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGrantPermission = async () => {
    setLoading(true);
    // Simulate Android Permission Dialog delay
    await new Promise(r => setTimeout(r, 1500));
    setStep(2);
    setLoading(false);
  };

  const handleFinalBind = async () => {
    setLoading(true);
    const mockDeviceId = 'DEV_' + Math.floor(Math.random() * 9000 + 1000);
    await new Promise(r => setTimeout(r, 2000));
    bindDevice(mockDeviceId);
    setStep(3);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
        <div className="bg-brand-blue-600 p-10 flex flex-col items-center text-white relative">
          <Logo size="sm" showText={false} className="mb-6" />
          <h1 className="text-xl font-black tracking-tight uppercase">Companion Bridge</h1>
          <div className="absolute -bottom-6 flex gap-2">
            {[1, 2, 3].map(i => (
              <div key={i} className={`w-12 h-1.5 rounded-full transition-all ${step >= i ? 'bg-brand-orange-500' : 'bg-white/20'}`}></div>
            ))}
          </div>
        </div>

        <div className="p-10 pt-16 space-y-8">
          {step === 1 && (
            <div className="text-center space-y-6 animate-in">
              <div className="w-20 h-20 bg-brand-blue-50 rounded-3xl flex items-center justify-center mx-auto text-brand-blue-600">
                <i className="fas fa-lock-open text-3xl"></i>
              </div>
              <div className="space-y-2">
                <h2 className="text-lg font-black text-slate-900 uppercase">Permission Required</h2>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                  To prevent unauthorized manual entry, Connectasetu requires access to your system call logs for verification.
                </p>
              </div>
              <button 
                onClick={handleGrantPermission}
                disabled={loading}
                className="w-full py-4 bg-brand-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-3"
              >
                {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-check-shield"></i>}
                Grant System Access
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="text-center space-y-6 animate-in">
              <div className="w-20 h-20 bg-brand-orange-50 rounded-3xl flex items-center justify-center mx-auto text-brand-orange-500">
                <i className="fas fa-fingerprint text-3xl"></i>
              </div>
              <div className="space-y-2">
                <h2 className="text-lg font-black text-slate-900 uppercase">Hardware Binding</h2>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                  Your profile will be locked to this specific hardware identifier to prevent multi-device spoofing.
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Detected Signature</p>
                <p className="text-xs font-bold text-slate-800 telemetry">MOBILE_ARM64_V8A_SYNC</p>
              </div>
              <button 
                onClick={handleFinalBind}
                disabled={loading}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-3"
              >
                {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-link"></i>}
                Bind Current Device
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="text-center space-y-6 animate-in">
              <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto text-emerald-500">
                <i className="fas fa-check-circle text-3xl"></i>
              </div>
              <div className="space-y-2">
                <h2 className="text-lg font-black text-slate-900 uppercase">Bridge Established</h2>
                <p className="text-sm text-slate-500 font-medium">Device binding complete. You can now start syncing call telemetry.</p>
              </div>
              <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Binding ID</p>
                <p className="text-xs font-bold text-emerald-900 font-mono">{user?.deviceId || 'SHA256_VERIFIED'}</p>
              </div>
              <button 
                onClick={() => navigate('/dashboard')}
                className="w-full py-4 bg-brand-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl"
              >
                Enter Terminal
              </button>
            </div>
          )}
        </div>
        
        <div className="p-6 bg-slate-50 border-t border-slate-100">
           <p className="text-[9px] text-center text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
             Security Policy: All data is encrypted with AES-256 before transit. Device spoofing will result in immediate profile suspension.
           </p>
        </div>
      </div>
    </div>
  );
};

export default DeviceSyncPage;
