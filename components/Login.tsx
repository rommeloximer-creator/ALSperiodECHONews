import React, { useState } from 'react';
import { auth, googleProvider } from '../services/firebase';
import { signInWithPopup } from 'firebase/auth';

interface LoginProps {
  onClose: () => void;
  onLogin: (isAdmin: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ onClose, onLogin }) => {
  const [error, setError] = useState('');

  // 🔒 SECURITY: Only this email can access the dashboard
  // Change this to your personal or DepEd email!
  const ADMIN_EMAIL = 'rommel.oximer@deped.gov.ph'; 

  const handleGoogleLogin = async () => {
    try {
      setError('');
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      if (user.email === ADMIN_EMAIL) {
        // Success!
        onLogin(true);
        onClose();
      } else {
        // Wrong email
        setError('Access Denied. You are not authorized to view this panel.');
        await auth.signOut(); // Kick them out immediately
      }
    } catch (err) {
      console.error(err);
      setError('Login failed. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/90 backdrop-blur-sm p-4">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-sm border border-slate-200 text-center">
        
        <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-yellow-400 shadow-xl">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10 text-yellow-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
          </svg>
        </div>

        <h2 className="text-3xl font-black text-slate-900 font-serif mb-2">Admin Access</h2>
        <p className="text-slate-500 text-sm mb-8 font-medium">Identify yourself to continue</p>

        <button 
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white border-2 border-slate-200 text-slate-700 font-bold py-4 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm group"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-6 h-6" alt="Google" />
          <span className="group-hover:text-slate-900">Sign in with Google</span>
        </button>

        {error && (
          <div className="mt-6 bg-red-50 text-red-600 text-[11px] p-3 rounded-xl border border-red-100 font-bold">
            {error}
          </div>
        )}

        <div className="mt-8">
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