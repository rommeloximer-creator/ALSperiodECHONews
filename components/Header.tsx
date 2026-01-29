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
    <div className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      <nav className="container mx-auto px-4">
        {/* Container with generous padding, letting content dictate height */}
        <div className="flex flex-wrap justify-between items-center py-6">
          
          {/* LOGO SECTION */}
          <div 
            className="flex items-center flex-shrink-0 cursor-pointer transition-transform hover:scale-[1.01] mr-6" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            {settings.bannerUrl ? (
              // THIS IS THE FIX FOR THE SPECIFIC IMAGE
              // We use arbitrary large values to force the size up.
              <img 
                src={settings.bannerUrl} 
                alt={settings.title} 
                className="h-[120px] md:h-[200px] w-auto object-contain object-left" 
              />
            ) : (
              // Fallback if image fails to load
              <div className="flex items-center space-x-3">
                 <span className="font-serif font-black text-3xl text-slate-900">
                   {settings.title}
                 </span>
              </div>
            )}
          </div>

          {/* BUTTONS SECTION */}
          <div className="flex items-center space-x-3 md:space-x-4 mt-4 md:mt-0">
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
      </nav>
      
      {/* Category Quick Links */}
      {!isAdminActive && (
        <div className="bg-slate-50 border-t border-slate-200 overflow-x-auto whitespace-nowrap scrollbar-hide">
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
