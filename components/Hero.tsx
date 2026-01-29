import React from 'react';
import { SiteSettings, Article } from '../types';

interface HeroProps {
  settings: SiteSettings;
  featuredArticle: Article | null;
  onReadClick: (id: string) => void; // This matches the ID expected in App.tsx
}

const Hero: React.FC<HeroProps> = ({ settings, featuredArticle, onReadClick }) => {
  // Use static mode if settings say so OR if there is no featured article
  const isStatic = settings.useStaticHero || !featuredArticle;
  
  // Decide which text to show
  const title = isStatic ? `Welcome to ${settings.title}` : featuredArticle.title;
  const excerpt = isStatic ? settings.heroDescription : (featuredArticle.excerpt || "");
  
  // Image logic: fallbacks to ensure an image always shows
  const customImage = settings.heroImage && settings.heroImage.trim() !== '' ? settings.heroImage : null;
  const defaultImage = settings.heroImageUrl || 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=2071';
  
  // Safe image selection
  const image = isStatic 
    ? (customImage || defaultImage) 
    : (featuredArticle.images && featuredArticle.images[0] ? featuredArticle.images[0] : (customImage || defaultImage));

  const badge = isStatic ? 'OFFICIAL PUBLICATION' : 'FEATURED STORY';

  return (
    <header className="relative bg-[#0f172a] text-white overflow-hidden min-h-[600px] flex items-center">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#154897] rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#cc2127] rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
      </div>
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-3/5 text-center lg:text-left space-y-8">
            <div className="inline-flex items-center space-x-2 py-2 px-4 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-[#cc2127] animate-pulse"></span>
              <span className="text-[10px] font-black tracking-[0.2em] text-white uppercase">
                {badge}
              </span>
            </div>

            <h1 className="font-serif text-5xl md:text-6xl xl:text-7xl font-black leading-[1.1] text-white tracking-tight">
              {title}
            </h1>

            <div className="space-y-4">
              <p className="text-2xl md:text-3xl font-serif italic text-[#fbbf24] opacity-90 leading-snug">
                "{settings.tagline}"
              </p>
              <p className="text-lg text-slate-300 max-w-2xl font-medium leading-relaxed">
                {excerpt}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start pt-4">
              {!isStatic && featuredArticle ? (
                <button 
                  onClick={() => onReadClick(featuredArticle.id)}
                  className="px-12 py-5 bg-[#cc2127] text-white font-black rounded-full hover:bg-white hover:text-slate-900 transition-all shadow-2xl hover:-translate-y-1 uppercase tracking-widest text-xs"
                >
                  Read Full Story
                </button>
              ) : (
                <button 
                  onClick={() => document.getElementById('news-feed')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-12 py-5 bg-[#154897] text-white font-black rounded-full hover:bg-white hover:text-slate-900 transition-all shadow-2xl hover:-translate-y-1 uppercase tracking-widest text-xs border-2 border-transparent hover:border-[#154897]"
                >
                  Explore Our Journey
                </button>
              )}
              <button 
                onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
                className="px-12 py-5 bg-white/5 hover:bg-white/10 text-white font-black rounded-full transition-all border border-white/20 uppercase tracking-widest text-xs"
              >
                Contact Us
              </button>
            </div>
          </div>

          <div className="lg:w-2/5 w-full relative">
            <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-2xl border-[12px] border-white/5 aspect-[4/5] md:aspect-[4/3] lg:aspect-square bg-slate-800">
              <img 
                src={image} 
                alt="Branding" 
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
            </div>
            {/* Design elements */}
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-[#cc2127]/20 rounded-full blur-2xl -z-10"></div>
            <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-[#154897]/20 rounded-full blur-3xl -z-10"></div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Hero;
