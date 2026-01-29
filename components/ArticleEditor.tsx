
import React, { useState, useEffect } from 'react';
import { Article, Category } from '../types';
import { Icons } from '../constants';
import { enhanceArticle, suggestCategory, researchTopic } from '../services/geminiService';

interface ArticleEditorProps {
  article: Article | null;
  onSave: (article: Article) => void;
  onCancel: () => void;
}

const ArticleEditor: React.FC<ArticleEditorProps> = ({ article, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Article>>(
    article || {
      id: crypto.randomUUID(),
      title: '',
      category: Category.NEWS,
      excerpt: '',
      content: '',
      images: [],
      likes: 0,
      createdAt: Date.now()
    }
  );
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isSuggestingCategory, setIsSuggestingCategory] = useState(false);
  const [isResearching, setIsResearching] = useState(false);
  const [researchResults, setResearchResults] = useState<{ text: string, sources: any[] } | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    if (files.length + (formData.images?.length || 0) > 4) {
      alert("Max 4 images allowed");
      return;
    }

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const MAX_WIDTH = 1200;
          let width = img.width;
          let height = img.height;
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
          canvas.width = width;
          canvas.height = height;
          ctx?.drawImage(img, 0, 0, width, height);
          
          const base64 = canvas.toDataURL('image/jpeg', 0.8);
          setFormData(prev => ({ ...prev, images: [...(prev.images || []), base64] }));
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index)
    }));
  };

  const handleAIAction = async () => {
    if (!formData.content) return alert("Write some content first!");
    setIsEnhancing(true);
    const result = await enhanceArticle(formData.content);
    if (result) {
      setFormData(prev => ({
        ...prev,
        title: result.title || prev.title,
        excerpt: result.excerpt || prev.excerpt,
        content: result.refinedContent || prev.content
      }));
    }
    setIsEnhancing(false);
  };

  const handleResearch = async () => {
    if (!formData.title && !formData.content) return alert("Enter a title or some content to research.");
    setIsResearching(true);
    const query = formData.title || formData.content?.slice(0, 100) || "";
    const result = await researchTopic(query);
    setResearchResults(result);
    setIsResearching(false);
  };

  const handleAISuggestCategory = async () => {
    if (!formData.content) return;
    setIsSuggestingCategory(true);
    const cat = await suggestCategory(formData.content);
    if (cat) {
      setFormData(prev => ({ ...prev, category: cat as Category }));
    }
    setIsSuggestingCategory(false);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return alert("Title and content are required.");
    onSave(formData as Article);
  };

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
      <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="text-2xl font-black font-serif text-slate-900 uppercase">
            {article ? 'Edit Story' : 'Write New Story'}
          </h3>
          <button onClick={onCancel} className="text-slate-400 hover:text-red-500 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8">
          <div className="grid grid-cols-1 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3">Story Title</label>
                <input 
                  type="text" 
                  value={formData.title} 
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter a compelling title..."
                  className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-teal-100 focus:border-teal-600 outline-none transition-all font-bold"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest">Category</label>
                    <button 
                      type="button" 
                      onClick={handleAISuggestCategory}
                      disabled={isSuggestingCategory}
                      className="text-[10px] font-black uppercase text-teal-600 hover:text-slate-900 flex items-center space-x-1"
                    >
                      <Icons.Sparkles /> 
                      <span>{isSuggestingCategory ? 'Analyzing...' : 'Suggest with AI'}</span>
                    </button>
                  </div>
                  <select 
                    value={formData.category} 
                    onChange={e => setFormData({ ...formData, category: e.target.value as Category })}
                    className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-teal-100 focus:border-teal-600 outline-none appearance-none font-semibold text-slate-700"
                  >
                    {Object.values(Category).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3">Story Gallery (Max 4)</label>
                  <div className="flex space-x-2">
                    {formData.images?.map((img, i) => (
                      <div key={i} className="relative w-16 h-16 rounded-xl overflow-hidden border-2 border-slate-100 group flex-shrink-0">
                        <img src={img} className="w-full h-full object-cover" />
                        <button 
                          type="button"
                          onClick={() => removeImage(i)}
                          className="absolute inset-0 bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Icons.Trash />
                        </button>
                      </div>
                    ))}
                    {(formData.images?.length || 0) < 4 && (
                      <label className="w-16 h-16 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:border-teal-500 hover:bg-teal-50 transition-all text-slate-400 hover:text-teal-600">
                        <Icons.Plus />
                        <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                      </label>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3">Short Excerpt</label>
                <textarea 
                  value={formData.excerpt} 
                  onChange={e => setFormData({ ...formData, excerpt: e.target.value })}
                  rows={2}
                  placeholder="A brief summary for the preview card..."
                  className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-teal-100 focus:border-teal-600 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest">Story Content</label>
              <button 
                type="button" 
                onClick={handleAIAction}
                disabled={isEnhancing}
                className="flex items-center space-x-2 px-5 py-2.5 bg-[#154897] text-white rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg"
              >
                <Icons.Sparkles />
                <span>{isEnhancing ? 'Gemini is refining...' : 'Refine with AI'}</span>
              </button>
            </div>
            <textarea 
              value={formData.content} 
              onChange={e => setFormData({ ...formData, content: e.target.value })}
              rows={15}
              placeholder="Write your amazing story here..."
              className="w-full px-8 py-8 rounded-3xl border border-slate-200 focus:ring-4 focus:ring-teal-100 focus:border-[#154897] outline-none transition-all font-serif text-lg leading-relaxed shadow-inner"
            />
          </div>

          <div className="pt-10 flex flex-col sm:flex-row justify-end gap-4 border-t border-slate-100">
            <button 
              type="button" 
              onClick={onCancel}
              className="px-10 py-4 bg-slate-100 text-slate-600 font-bold rounded-full hover:bg-slate-200 transition-all uppercase tracking-widest text-xs"
            >
              Discard Changes
            </button>
            <button 
              type="submit" 
              className="px-12 py-4 bg-[#cc2127] text-white font-black rounded-full hover:bg-[#154897] transition-all shadow-2xl hover:-translate-y-1 uppercase tracking-widest text-xs"
            >
              {article ? 'Update Story' : 'Publish Story'}
            </button>
          </div>
        </form>
      </div>

      {/* Side Tool: AI Research Assistant */}
      <div className="space-y-6">
        <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-2xl border border-white/5 sticky top-28">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-yellow-400 text-slate-900 rounded-lg">
              <Icons.Sparkles />
            </div>
            <h4 className="font-serif font-black text-xl">AI Research Assistant</h4>
          </div>
          
          <p className="text-slate-400 text-sm mb-8 font-medium">
            Fact-check or gather background info for your story using Google Search.
          </p>

          <button 
            onClick={handleResearch}
            disabled={isResearching}
            className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/20 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all mb-8 flex items-center justify-center space-x-2"
          >
            {isResearching ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Gathering Data...
              </span>
            ) : (
              <>
                <Icons.Search />
                <span>Research Topic</span>
              </>
            )}
          </button>

          {researchResults && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-6 bg-white/5 rounded-2xl text-slate-300 text-sm leading-relaxed max-h-[400px] overflow-y-auto">
                <div className="prose prose-invert prose-sm">
                  {researchResults.text.split('\n').map((line, i) => (
                    <p key={i} className="mb-2">{line}</p>
                  ))}
                </div>
              </div>
              
              {researchResults.sources.length > 0 && (
                <div className="space-y-3">
                  <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Credible Sources</h5>
                  {researchResults.sources.map((chunk, i) => (
                    chunk.web && (
                      <a 
                        key={i} 
                        href={chunk.web.uri} 
                        target="_blank" 
                        className="block p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/5"
                      >
                        <p className="text-[11px] font-bold text-teal-400 truncate mb-1">{chunk.web.title}</p>
                        <p className="text-[9px] text-slate-500 truncate">{chunk.web.uri}</p>
                      </a>
                    )
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArticleEditor;
