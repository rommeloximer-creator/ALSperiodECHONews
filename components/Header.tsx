import React from 'react';

// This "Interface" tells the computer that Header is allowed to receive settings
interface HeaderProps {
  settings?: {
    bannerUrl?: string;
    brandingType?: string;
  };
}

const Header: React.FC<HeaderProps> = ({ settings }) => {
  // If we have a banner URL, we show the image. Otherwise, we show the text.
  const showBanner = settings?.brandingType === 'banner' && settings?.bannerUrl;

  return (
    <header className="bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center py-8">
          {showBanner ? (
            <img 
              src={settings.bannerUrl} 
              alt="ALS PeriodECHO Banner" 
              className="w-full h-auto max-h-64 object-contain rounded-lg" 
            />
          ) : (
            <>
              <h1 className="text-6xl font-black text-slate-900 tracking-tighter uppercase mb-2">
                ALS PeriodECHO
              </h1>
              <div className="flex items-center gap-4">
                <div className="h-px w-12 bg-slate-200"></div>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-[0.3em]">
                  Official Newsletter
                </p>
                <div className="h-px w-12 bg-slate-200"></div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
