import React from 'react';

interface HeaderProps {
  settings: any;
}

const Header: React.FC<HeaderProps> = ({ settings }) => {
  const isBannerMode = settings?.brandingType === 'banner' && settings?.bannerUrl;

  return (
    <header className="w-full bg-white border-b border-slate-100">
      {isBannerMode ? (
        <div className="w-full">
          <img 
            src={settings.bannerUrl} 
            alt="Site Banner" 
            className="w-full h-auto block"
            onError={(e) => console.error("Header Image Failed to Load. URL:", settings.bannerUrl)}
          />
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-2xl font-black tracking-tighter text-slate-900">
            {settings?.title || "ALS PeriodECHO"}
          </h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            {settings?.tagline || "Official Newsletter"}
          </p>
        </div>
      )}
    </header>
  );
};

export default Header;
