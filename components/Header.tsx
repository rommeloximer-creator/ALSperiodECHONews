import React from 'react';
import { SiteSettings, AuthState, Category } from '../types';

interface HeaderProps {
  settings: SiteSettings;
  auth: AuthState;
  onAdminClick: () => void;
  onLoginClick: () => void;
  onLogoutClick: () => void;
  onCategorySelect: (category: Category) => void;
  isAdminActive: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  settings, 
  auth, 
  onAdminClick, 
  onLoginClick, 
  onLogoutClick, 
  onCategorySelect,
  isAdminActive 
}) => {
  return (
    <div className="bg-white border-b border-slate-200 shadow-sm relative z-40">
      
      {/* --- ROW 1: THE BIG BANNER (MASTHEAD) --- */}
      <div 
        className="w-full flex justify-center items-center py-2 px-4 bg-slate-50 border-b border-slate-100 cursor-pointer"
        onClick={() => {
          onCategorySelect('HEADLINE' as Category);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      >
        {settings.bannerUrl ? (
          <img 
            src={settings.bannerUrl} 
            alt={settings.title} 
            className="w-full max-w-7xl h-auto object-contain"
            style={{ minHeight: '120px', maxHeight: '450px' }} 
          />
        ) : (
          <div className="text-center py-8">
             <h1 className="font-serif font-black text-4xl md:text-7xl text-slate-900 tracking-tight">
               {settings.title}
             </h1>
             <p className="text-sm md:text-lg font-bold text-slate-500 uppercase tracking-[0.4em] mt-3">
               {settings.subtitle}
             </p>
          </div>
        )}
      </div>

      {/* --- ROW 2: THE NAVIGATION BAR (Sticky) --- */}
      <div className="sticky top-0 bg-white shadow-sm z-50">
        <nav className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            
            {/* Left side: Home Trigger */}
            <div 
              className="font-black text-slate-900 tracking-tighter text-lg cursor-pointer hover:text-[#154897] flex items-center"
              onClick={() => {
                onCategorySelect('HEADLINE' as Category);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <span className="mr-2">🏠</span> HOME
            </div>

            {/* Right side: Admin Buttons */}
            <div className="flex items-center space-x-3">
              {auth.isAdmin && (
                <button 
                  onClick={onAdminClick}
                  className={`px-4 py-2 rounded-full text-xs font-black transition-all ${
                    isAdminActive ? 'bg-[#154897] text-white' : 'text-[#154897] bg-slate-100 hover:bg-slate-200'
                  }`}
                >
                  {isAdminActive ? 'VIEW SITE' : 'DASHBOARD'}
                </button>
              )}
              
              {auth.isLoggedIn ? (
                <button 
                  onClick={onLogoutClick}
                  className="px-3 py-2 text-[10px] font-black text-slate-400 hover:text-red-600 uppercase tracking-widest transition-colors"
                >
                  LOGOUT
                </button>
              ) : (
                <button 
                  onClick={onLoginClick}
                  className="px-5 py-2.5 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-[#154897] transition-all shadow-md"
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
            <div className="container mx-auto px-4 flex justify-center space-x-8 py-4">
              {Object.values(Category).map((cat) => (
                <button 
                  key={cat}
                  // ADDED: MANDATORY TRIGGER FROM YOUR UPLOADED IMAGE
                  onClick={() => {
                    onCategorySelect(cat); // THIS LINE MUST BE PRESENT
                    const el = document.getElementById('news-feed');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-500 hover:text-[#154897] focus:text-[#154897] transition-colors relative group"
                >
                  {cat}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#154897] transition-all group-hover:w-full"></span>
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
