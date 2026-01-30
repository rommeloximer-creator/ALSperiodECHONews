import React from 'react';
import { Article } from '../types';

interface HeroProps {
  featuredArticle: Article | null;
  onReadClick: (id: string) => void;
  settings?: any;
}

const Hero: React.FC<HeroProps> = ({ featuredArticle, onReadClick, settings }) => {
  // Use the image from Firebase settings, or a high-quality fallback if empty
  const heroBg = settings?.heroImageUrl || "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80";

  return (
    <section className="relative h-[60vh] min-h-[500px] w-full flex items-center overflow-hidden bg-slate-900">
      <div className="absolute inset-0 z-0">
        <img 
          src={heroBg}
          alt="Hero Background"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 w-full">
        <div className="max-w-3xl">
          <span className="inline-block px-4 py-1 bg-[#cc2127] text-white text-xs font-bold uppercase tracking-widest rounded-full mb-6">
            Latest Update
          </span>
          <h2 className="text-5xl md:text-7xl font-serif font-black text-white mb-6 leading-tight">
            {featuredArticle?.title || settings?.heroDescription || "Empowering the ALS Community"}
          </h2>
          {featuredArticle && (
            <button 
              onClick={() => onReadClick(featuredArticle.id)}
              className="px-8 py-4 bg-white text-slate-900 font-black rounded-full hover:bg-[#cc2127] hover:text-white transition-all transform hover:-translate-y-1 shadow-2xl uppercase tracking-widest text-sm"
            >
              Read Full Story
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
