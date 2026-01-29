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
    <div className="bg-white border-b border-slate-200 shadow-sm relative z-40">
      
      {/* --- ROW 1: THE BIG BANNER (MASTHEAD) --- */}
      {/* This section is full-width and dedicated ONLY to your logo */}
      <div 
        className="w-full flex justify-center items-center py-4 px-4 bg-slate-50 border-b border-slate-100 cursor-pointer"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        {settings.bannerUrl ? (
          <img 
            src={settings.bannerUrl} 
            alt={settings.title} 
            // FIX: We allow the image to be 100% wide (w-full) up to a max size
            // We set h-auto so it grows naturally based on how wide it is
            className="w-full max-w-5xl h-auto object-contain"
            style={{ minHeight: '80px', maxHeight: '250px' }} 
          />
        ) : (
          <div className="text-center py-6">
             <h1 className="font-serif font-black text-4xl md:text-6xl text-slate-900 tracking-tight">
               {settings.title}
             </h1>
             <p className="text-sm md:text-base font-bold text-slate-500 uppercase tracking-[0.3em] mt-2">
               {settings.subtitle}
             </p>
          </div>
        )}
      </div>

      {/* --- ROW 2: THE NAVIGATION BUTTONS --- */}
      {/* This sticks to the top when scrolling, but stays UNDER the big banner */}
      <div className="sticky top-0 bg-white shadow-sm z-50">
        <nav className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            
            {/* Left side: A small 'Home' button for navigation */}
            <div 
              className="font-black text-slate-900 tracking-tighter text-lg cursor-pointer hover:text-[#154897] flex items-center"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <span className="mr-2">🏠</span> HOME
            </div>

            {/* Right side: Admin Buttons */}
            <div className="flex items-center space-x-3">
              {auth.isAdmin && (
                <button 
                  onClick={onAdminClick}
                  className={`px-4 py-2 rounded-full text-xs font-black transition-all ${isAdminActive ? 'bg-[#154897] text-white' : 'text-[#154897] bg-slate-100'}`}
                >
                  {isAdminActive ? 'VIEW SITE' : 'DASHBOARD'}
                </button>
              )}
              
              {auth.isLoggedIn ? (
                <button 
                  onClick={onLogoutClick}
                  className="px-3 py-2 text-[10px] font-black text-slate-400 hover:text-red-500 uppercase tracking-widest"
                >
                  LOGOUT
                </button>
              ) : (
                <button 
                  onClick={onLoginClick}
                  className="px-5 py-2.5 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-[#154897] transition-all"
                >
                  ADMIN ACCESS
                </button>
              )}
            </div>
          </div>
        </nav>

        {/* --- ROW 3: CATEGORY LINKS --- */}
        {!isAdminActive && (
          <div className="border-t border-slate-100 overflow-x-auto whitespace-nowrap scrollbar-hide bg-white">
            <div className="container mx-auto px-4 flex justify-center space-x-8 py-3">
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
    </div>
  );
};

export default Header;
