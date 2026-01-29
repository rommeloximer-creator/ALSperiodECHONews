
import React, { useState } from 'react';

interface LoginProps {
  onClose: () => void;
  onLogin: (isAdmin: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ onClose, onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Use the user's hardcoded credentials for compatibility
    if (username === 'rjoximer' && password === 'als123456') {
      onLogin(true);
      onClose();
    } else {
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-sm border border-slate-200">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-yellow-400 shadow-xl">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10 text-yellow-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
            </svg>
          </div>
          <h2 className="text-3xl font-black text-slate-900 font-serif">Admin Access</h2>
          <p className="text-slate-500 text-sm mt-2 font-medium">Please verify your identity</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 pl-1">Username</label>
            <input 
              type="text" 
              value={username}
              onChange={e => { setUsername(e.target.value); setError(false); }}
              className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-teal-100 focus:border-teal-600 outline-none font-bold"
              placeholder="Admin ID"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 pl-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={e => { setPassword(e.target.value); setError(false); }}
              className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-teal-100 focus:border-teal-600 outline-none"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-[11px] p-4 rounded-xl border border-red-100 text-center font-bold">
              Verification failed. Please check credentials.
            </div>
          )}

          <button 
            type="submit" 
            className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl hover:bg-teal-700 transition-all shadow-xl hover:-translate-y-1 uppercase tracking-widest text-xs"
          >
            Enter Dashboard
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-slate-900 font-bold transition-colors underline decoration-2 underline-offset-4"
          >
            Return to Website
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
