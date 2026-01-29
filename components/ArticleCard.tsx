
import React from 'react';
import { Article } from '../types';

interface ArticleCardProps {
  article: Article;
  onClick: () => void;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, onClick }) => {
  const coverImage = article.images[0] || `https://picsum.photos/seed/${article.id}/600/400`;

  return (
    <article 
      onClick={onClick}
      className="bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden border border-slate-100 flex flex-col group cursor-pointer hover:-translate-y-2"
    >
      <div className="h-60 overflow-hidden relative">
        <img 
          src={coverImage} 
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
        />
        <div className="absolute top-4 left-4">
          <span className="bg-[#cc2127] text-white text-[9px] font-black px-4 py-2 rounded shadow-xl uppercase tracking-[0.2em]">
            {article.category}
          </span>
        </div>
      </div>
      
      <div className="p-8 flex-1 flex flex-col">
        <h4 className="font-serif text-2xl font-black mb-4 text-slate-900 group-hover:text-[#154897] transition-colors line-clamp-2 leading-tight">
          {article.title}
        </h4>
        <p className="text-slate-500 text-sm mb-6 line-clamp-3 flex-1 leading-relaxed font-medium">
          {article.excerpt}
        </p>
        <div className="pt-6 border-t border-slate-50 mt-auto flex justify-between items-center">
          <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
            {new Date(article.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
          <div className="flex items-center space-x-4">
            <span className="flex items-center text-xs font-bold text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 mr-1 text-red-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
              </svg>
              {article.likes}
            </span>
            <span className="text-[#154897] text-[10px] font-black uppercase tracking-widest flex items-center group-hover:translate-x-1 transition-transform">
              Read More
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3 h-3 ml-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ArticleCard;
