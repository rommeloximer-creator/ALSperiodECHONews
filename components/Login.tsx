import React, { useState } from 'react';

interface LoginProps {
  onClose: () => void;
  onLogin: (isAdmin: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ onClose, onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  // The default backup password
  const DEFAULT_PASS = 'als123456';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check localStorage (in case you changed it) OR use default
    const savedPassword = localStorage.getItem('admin_password') || DEFAULT_PASS;

    if (username.toLowerCase() === 'rjoximer' && password === savedPassword) {
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
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
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