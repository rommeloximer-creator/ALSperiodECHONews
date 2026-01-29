import React, { useState, useEffect } from 'react';

interface LoginProps {
  onClose: () => void;
  onLogin: (isAdmin: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ onClose, onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  // State for changing password
  const [isChangingMode, setIsChangingMode] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // The default backup password (if none is saved)
  const DEFAULT_PASS = 'als123456';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Get the saved password from browser memory, or use default
    const savedPassword = localStorage.getItem('admin_password') || DEFAULT_PASS;

    // Check credentials
    if (username.toLowerCase() === 'rjoximer' && password === savedPassword) {
      onLogin(true);
      onClose();
    } else {
      setError('Incorrect username or password');
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (newPassword.length < 4) {
      setError('Password is too short');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Save the new password to browser memory
    localStorage.setItem('admin_password', newPassword);
    
    setSuccessMessage('Password updated! You can now log in.');
    setIsChangingMode(false);
    setPassword(''); // Clear the password field so they have to type the new one
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-sm border border-slate-200">
        
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-yellow-400 shadow-xl">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-yellow-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-slate-900 font-serif">
            {isChangingMode ? 'Set New Password' : 'Admin Access'}
          </h2>
          <p className="text-slate-500 text-xs mt-1 font-medium">
            {isChangingMode ? 'Create a secure password' : 'Please verify your identity'}
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-4 bg-green-50 text-green-600 text-[11px] p-3 rounded-xl border border-green-100 text-center font-bold">
            {successMessage}
          </div>
        )}

        {/* --- LOGIN FORM --- */}
        {!isChangingMode && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 pl-1">Username</label>
              <input 
                type="text" 
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none font-bold text-sm"
                placeholder="Enter ID"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 pl-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none text-sm"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-[11px] p-3 rounded-xl border border-red-100 text-center font-bold">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-teal-700 transition-all shadow-lg hover:-translate-y-1 uppercase tracking-widest text-xs"
            >
              Enter Dashboard
            </button>

            <div className="text-center mt-4">
              <button 
                type="button"
                onClick={() => { setIsChangingMode(true); setError(''); }}
                className="text-[10px] text-slate-400 hover:text-teal-600 font-bold uppercase tracking-wider"
              >
                Change Password?
              </button>
            </div>
          </form>
        )}

        {/* --- CHANGE PASSWORD FORM --- */}
        {isChangingMode && (
          <form onSubmit={handleChangePassword} className="space-y-4">
             <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 pl-1">New Password</label>
              <input 
                type="password" 
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none text-sm"
                placeholder="New password"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 pl-1">Confirm Password</label>
              <input 
                type="password" 
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none text-sm"
                placeholder="Confirm new password"
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-[11px] p-3 rounded-xl border border-red-100 text-center font-bold">
                {error}
              </div>
            )}

            <div className="flex gap-2">
              <button 
                type="button"
                onClick={() => setIsChangingMode(false)}
                className="flex-1 bg-slate-100 text-slate-600 font-bold py-4 rounded-xl hover:bg-slate-200 transition-all text-xs uppercase tracking-widest"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="flex-1 bg-teal-600 text-white font-bold py-4 rounded-xl hover:bg-teal-700 transition-all shadow-lg text-xs uppercase tracking-widest"
              >
                Save
              </button>
            </div>
          </form>
        )}

        <div className="mt-6 text-center">
          <button 
            onClick={onClose}
            className="text-xs text-slate-300 hover:text-slate-900 font-bold transition-colors underline decoration-2 underline-offset-4"
          >
            Return to Website
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;