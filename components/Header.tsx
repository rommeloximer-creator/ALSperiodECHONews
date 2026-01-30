import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

const Header: React.FC = () => {
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchBranding = async () => {
      try {
        const docRef = doc(db, 'settings', 'site_config');
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          // Only show the banner if brandingType is set to 'banner'
          if (data.brandingType === 'banner' || data.brandingType === 'Standard') {
            setBannerUrl(data.bannerUrl);
          }
        }
      } catch (error) {
        console.error("Error fetching branding:", error);
      }
    };

    fetchBranding();
  }, []);

  return (
    <header className="bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center py-8">
          {bannerUrl ? (
            /* If there is a banner, show it */
            <img src={bannerUrl} alt="ALS PeriodECHO Banner" className="w-full h-auto max-h-64 object-contain rounded-lg" />
          ) : (
            /* Otherwise, show your original text branding */
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
