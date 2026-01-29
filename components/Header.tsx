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
    // STEP 1: Removed sticky/fixed height constraints from the main wrapper
    <div className="bg-white border-b border-slate-200 shadow-sm relative z-40">
      <nav className="container mx-auto px-4">
        
        {/* STEP 2: Force the container to be tall enough using padding */}
        <div className="flex flex-wrap justify-between items-center py-4">
          
          <div 
            className="flex items-center flex-shrink-0 cursor-pointer mr-6" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            {settings.bannerUrl ? (
              // THE NUCLEAR OPTION: Inline styles force the height.
              // We set explicit pixel heights that the browser cannot ignore.
              <img 
                src={settings.bannerUrl} 
                alt={settings.title} 
                style={{ 
                  height: '100px',       // Minimum height (Mobile)
                  minHeight: '100px',    // Force minimum
                  maxHeight: '180px',    // Maximum height (Desktop)
                  width: 'auto',         // Keep aspect ratio
                  objectFit: 'contain'   
                }}
                className="md:h-[180px]" // Tailwind backup for larger screens
              />
            ) : (
              <div className="flex items-center space-x-3">
                 <span className="font-serif font-black text-3xl text-slate-900">
                   {settings.title}
                 </span>
              </div>
            )}
          </div>

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
