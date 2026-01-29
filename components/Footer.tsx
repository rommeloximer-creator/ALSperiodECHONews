
import React from 'react';
import { SiteSettings } from '../types';

interface FooterProps {
  settings: SiteSettings;
}

const Footer: React.FC<FooterProps> = ({ settings }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center md:text-left">
          <div className="space-y-6">
            <h4 className="text-white font-black uppercase text-xs tracking-[0.3em]">Connect With Us</h4>
            <div className="flex justify-center md:justify-start space-x-5">
              {[
                { url: settings.facebookUrl, icon: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z' },
                { url: settings.twitterUrl, icon: 'M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z' },
                { url: settings.instagramUrl, icon: 'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z M17.5 6.5h.01' }
              ].map((social, i) => social.url && (
                <a 
                  key={i} 
                  href={social.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center hover:bg-teal-600 hover:text-white hover:border-teal-500 transition-all hover:-translate-y-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={social.icon} />
                    {i === 2 && <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />}
                  </svg>
                </a>
              ))}
            </div>
            <p className="text-sm font-medium leading-relaxed max-w-xs">
              Empowering the Alternative Learning System through digital storytelling.
            </p>
          </div>

          <div className="space-y-6">
            <h4 className="text-white font-black uppercase text-xs tracking-[0.3em]">Contact Us</h4>
            <div className="space-y-4 text-sm font-medium">
              <p className="flex items-center justify-center md:justify-start">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-3 text-teal-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
                SDO Pangasinan II Office, Binalonan
              </p>
              <p className="flex items-center justify-center md:justify-start">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-3 text-teal-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                </svg>
                contact@periodecho.als.ph
              </p>
            </div>
          </div>

          <div className="space-y-10 flex flex-col items-center md:items-start">
            <div className="flex flex-col">
              <span className="text-white font-black text-2xl font-serif leading-none tracking-tight">PeriodECHO</span>
              <span className="text-[10px] text-teal-500 font-bold uppercase tracking-[0.4em] mt-1">SDO Pangasinan II</span>
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500 leading-relaxed">
              &copy; {new Date().getFullYear()} ALS PeriodECHO.<br />All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
