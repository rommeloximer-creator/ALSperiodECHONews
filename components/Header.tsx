
import React from 'react';
import { SiteSettings, AuthState, Category } from '../types';

interface HeaderProps {
  settings: SiteSettings;
  auth: AuthState;
  onAdminClick: () => void;
  onLoginClick: () => void;
  onLogoutClick: () => void;
  isAdminActive: boolean;
}

const Header: React.FC<HeaderProps> = ({ settings, auth, onAdminClick, onLoginClick, onLogoutClick, isAdminActive }) => {
  return (
    <div className="sticky top-0 z-40">
      <nav className="bg-white border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center min-h-[90px] py-3">
            <div 
              className="flex items-center cursor-pointer transition-transform hover:scale-[1.01]" 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              {settings.bannerUrl ? (
                <img 
                  src={settings.bannerUrl} 
                  alt={settings.title} 
                  // UPDATED: Changed h-16/h-24 to h-28/h-56 for a much bigger banner size
                  className="h-28 md:h-56 w-auto object-contain" 
                />
              ) : (
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center text-white font-bold border-2 border-yellow-400 shadow-md">
                    <span className="text-sm">ALS</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-serif font-black text-2xl tracking-tight text-slate-900 leading-none">
                      {settings.title}
                    </span>
                    <span className="text-xs uppercase tracking-[0.2em] font-bold text-slate-500 mt-1">
                      {settings.subtitle}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-3 md:space-x-4">
              {auth.isAdmin && (
                <button 
                  onClick={onAdminClick}
                  className={`px-5 py-2.5 rounded-full text-sm font-black transition-all shadow-sm ${isAdminActive ? 'bg-[#154897] text-white shadow-lg' : 'text-[#154897] bg-slate-50 hover:bg-slate-100 border border-slate-200'}`}
                >
                  {isAdminActive ? 'VIEW SITE' : 'DASHBOARD'}
                </button>
              )}
              
              {auth.isLoggedIn ? (
                <button 
                  onClick={onLogoutClick}
                  className="px-4 py-2 text-xs font-black text-slate-400 hover:text-red-500 uppercase tracking-widest transition-colors"
                >
                  LOGOUT
                </button>
              ) : (
                <button 
                  onClick={onLoginClick}
                  className="px-6 py-3 bg-slate-900 text-white rounded-full text-xs font-black uppercase tracking-widest hover:bg-[#154897] transition-all shadow-md active:scale-95"
                >
                  ADMIN ACCESS
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>
      
      {/* Suggestion: Category Quick Links */}
      {!isAdminActive && (
        <div className="bg-slate-50 border-b border-slate-200 overflow-x-auto whitespace-nowrap scrollbar-hide">
          <div className="container mx-auto px-4 flex space-x-8 py-3">
            {Object.values(Category).map((cat) => (
              <button 
                key={cat}
                onClick={() => {
                  const el = document.getElementById('news-feed');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-[#154897] transition-colors"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
