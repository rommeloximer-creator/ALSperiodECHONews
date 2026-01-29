
import React, { useState } from 'react';
import { Article } from '../types';

interface ArticleModalProps {
  article: Article;
  onClose: () => void;
  onLike: () => void;
}

const ArticleModal: React.FC<ArticleModalProps> = ({ article, onClose, onLike }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);

  const images = article.images.length > 0 ? article.images : [`https://picsum.photos/seed/${article.id}/800/600`];

  const handleLike = () => {
    if (!hasLiked) {
      onLike();
      setHasLiked(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center bg-slate-900/95 backdrop-blur-sm overflow-y-auto py-10 px-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl h-fit relative">
        <button 
          onClick={onClose}
          className="absolute -top-12 right-0 md:-right-12 text-white hover:text-yellow-400 transition-colors p-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Gallery Slider */}
        <div className="h-[300px] sm:h-[500px] w-full bg-slate-100 relative group rounded-t-3xl overflow-hidden">
          <img 
            src={images[currentIdx]} 
            alt="Gallery" 
            className="w-full h-full object-contain bg-slate-200 transition-opacity duration-300" 
          />
          
          {images.length > 1 && (
            <>
              <button 
                onClick={() => setCurrentIdx(prev => (prev > 0 ? prev - 1 : images.length - 1))}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/90 text-white hover:text-slate-900 rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 backdrop-blur-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
              </button>
              <button 
                onClick={() => setCurrentIdx(prev => (prev < images.length - 1 ? prev + 1 : 0))}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/90 text-white hover:text-slate-900 rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 backdrop-blur-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
              </button>
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-900/50 text-white text-[10px] px-3 py-1 rounded-full backdrop-blur-md font-bold uppercase tracking-widest">
                {currentIdx + 1} / {images.length}
              </div>
            </>
          )}
        </div>

        <div className="p-8 md:p-14">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div className="flex items-center space-x-4">
              <span className="inline-block py-1.5 px-4 rounded-full bg-yellow-400 text-slate-900 text-xs font-black tracking-widest uppercase">
                {article.category}
              </span>
              <span className="text-slate-400 text-sm font-medium">
                {new Date(article.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            
            <button 
              onClick={handleLike}
              disabled={hasLiked}
              className={`flex items-center space-x-3 px-6 py-2.5 rounded-full border transition-all ${hasLiked ? 'bg-red-50 text-red-500 border-red-100' : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-red-500 hover:text-red-500'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill={hasLiked ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
              </svg>
              <span className="font-bold">{article.likes} Likes</span>
            </button>
          </div>

          <h2 className="text-3xl md:text-5xl font-serif font-black text-slate-900 leading-[1.15] mb-8">
            {article.title}
          </h2>

          <div className="prose prose-slate prose-lg max-w-none text-slate-700 leading-[1.8] font-serif">
            {article.content.split('\n').map((paragraph, i) => (
              paragraph.trim() && <p key={i} className="mb-6">{paragraph.trim()}</p>
            ))}
          </div>

          <div className="mt-16 pt-10 border-t border-slate-100 flex justify-center">
            <button 
              onClick={onClose}
              className="px-10 py-4 bg-slate-900 text-white rounded-full font-black uppercase tracking-widest text-sm hover:bg-teal-700 transition-all shadow-lg"
            >
              Back to News Feed
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleModal;
