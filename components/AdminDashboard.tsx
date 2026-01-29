
import React, { useState, useRef } from 'react';
import { Article, SiteSettings, Category } from '../types';
import { Icons } from '../constants';
import ArticleEditor from './ArticleEditor';

interface AdminDashboardProps {
  articles: Article[];
  settings: SiteSettings;
  onSaveArticle: (article: Article) => void;
  onDeleteArticle: (id: string) => void;
  onSaveSettings: (settings: SiteSettings) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ articles, settings, onSaveArticle, onDeleteArticle, onSaveSettings }) => {
  const [activeTab, setActiveTab] = useState<'articles' | 'settings'>('articles');
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  
  // Local states for image previews before saving
  const [heroImagePreview, setHeroImagePreview] = useState<string | null>(settings.heroImage || null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(settings.bannerUrl || null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const handleEdit = (article: Article) => {
    setEditingArticle(article);
    setIsCreating(true);
  };

  const handleCreate = () => {
    setEditingArticle(null);
    setIsCreating(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'hero' | 'banner') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        // Optimized max width for high-density displays
        const MAX_WIDTH = target === 'hero' ? 1920 : 2000;
        let width = img.width;
        let height = img.height;
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
        canvas.width = width;
        canvas.height = height;
        ctx?.drawImage(img, 0, 0, width, height);
        
        const base64 = canvas.toDataURL('image/jpeg', 0.9);
        if (target === 'hero') setHeroImagePreview(base64);
        else setBannerPreview(base64);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const saveSettings = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newSettings: SiteSettings = {
      ...settings,
      title: formData.get('title') as string,
      subtitle: formData.get('subtitle') as string,
      tagline: formData.get('tagline') as string,
      heroDescription: formData.get('heroDescription') as string,
      heroImage: heroImagePreview || (formData.get('heroImage') as string) || undefined,
      bannerUrl: bannerPreview || null,
      useStaticHero: formData.get('useStaticHero') === 'on',
      facebookUrl: formData.get('facebookUrl') as string,
      twitterUrl: formData.get('twitterUrl') as string,
      instagramUrl: formData.get('instagramUrl') as string,
    };
    onSaveSettings(newSettings);
    alert('Settings saved successfully!');
  };

  if (isCreating) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ArticleEditor 
          article={editingArticle} 
          onSave={(art) => { onSaveArticle(art); setIsCreating(false); }}
          onCancel={() => setIsCreating(false)}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-10 border-b border-slate-200 pb-6">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight font-serif uppercase">Admin Control Panel</h2>
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab('articles')}
            className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'articles' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
          >
            Manage Stories
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'settings' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
          >
            Site Branding
          </button>
        </div>
      </div>

      {activeTab === 'articles' ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-slate-900">Manage Posts</h3>
            <button 
              onClick={handleCreate}
              className="flex items-center space-x-2 bg-teal-600 hover:bg-slate-900 text-white px-6 py-3 rounded-full font-black text-sm transition-all shadow-lg"
            >
              <Icons.Plus />
              <span>New Story</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 font-bold text-slate-600 uppercase tracking-widest text-xs">Story</th>
                  <th className="px-6 py-4 font-bold text-slate-600 uppercase tracking-widest text-xs">Category</th>
                  <th className="px-6 py-4 font-bold text-slate-600 uppercase tracking-widest text-xs">Date</th>
                  <th className="px-6 py-4 font-bold text-slate-600 uppercase tracking-widest text-xs text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {articles.map(art => (
                  <tr key={art.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0">
                          <img src={art.images[0] || 'https://picsum.photos/100'} className="w-full h-full object-cover" />
                        </div>
                        <span className="font-bold text-slate-900 line-clamp-1">{art.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2.5 py-1 rounded">
                        {art.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(art.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end space-x-2">
                        <button 
                          onClick={() => handleEdit(art)}
                          className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                        >
                          <Icons.Edit />
                        </button>
                        <button 
                          onClick={() => onDeleteArticle(art.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Icons.Trash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <form onSubmit={saveSettings} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-3 uppercase tracking-wider text-sm">Header Branding</h4>
              
              <div className="space-y-4">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Branding Banner (Replaces Title/Subtitle)</label>
                {bannerPreview ? (
                  <div className="relative rounded-xl overflow-hidden border-2 border-slate-100 bg-slate-50 p-2 group shadow-sm">
                    <img src={bannerPreview} className="h-20 w-auto object-contain mx-auto" alt="Banner Preview" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                      <button 
                        type="button"
                        onClick={() => bannerInputRef.current?.click()}
                        className="bg-white text-slate-900 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-teal-500 hover:text-white transition-all shadow-lg"
                      >
                        Replace
                      </button>
                      <button 
                        type="button"
                        onClick={() => setBannerPreview(null)}
                        className="bg-red-500 text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-all shadow-lg"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div 
                    onClick={() => bannerInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-200 rounded-xl py-12 flex flex-col items-center justify-center cursor-pointer hover:border-teal-500 hover:bg-teal-50 transition-all group"
                  >
                    <div className="p-4 bg-slate-100 rounded-full group-hover:bg-teal-100 transition-colors mb-3">
                      <Icons.Plus />
                    </div>
                    <span className="text-xs font-bold text-slate-500 group-hover:text-teal-700">Upload Header Banner</span>
                    <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-tighter">Recommended: 1200x200px or similar ratio</p>
                  </div>
                )}
                <input 
                  type="file" 
                  ref={bannerInputRef} 
                  onChange={(e) => handleImageUpload(e, 'banner')} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Fallback Title</label>
                  <input name="title" defaultValue={settings.title} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-600 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Fallback Subtitle</label>
                  <input name="subtitle" defaultValue={settings.subtitle} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-600 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Tagline (Motto)</label>
                <input name="tagline" defaultValue={settings.tagline} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-600 outline-none" />
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-3 uppercase tracking-wider text-sm">Social Media</h4>
              <div className="grid grid-cols-1 gap-4">
                <input name="facebookUrl" placeholder="Facebook URL" defaultValue={settings.facebookUrl} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-600 outline-none" />
                <input name="twitterUrl" placeholder="Twitter URL" defaultValue={settings.twitterUrl} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-600 outline-none" />
                <input name="instagramUrl" placeholder="Instagram URL" defaultValue={settings.instagramUrl} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-600 outline-none" />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-3 uppercase tracking-wider text-sm">Hero Section</h4>
              <div className="flex items-center space-x-3 mb-4 p-3 bg-teal-50 rounded-xl">
                <input type="checkbox" name="useStaticHero" defaultChecked={settings.useStaticHero} className="w-5 h-5 accent-teal-600" />
                <label className="text-sm font-bold text-teal-800">Use Static Welcome Message</label>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Welcome Description</label>
                <textarea name="heroDescription" rows={4} defaultValue={settings.heroDescription} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-600 outline-none" />
              </div>
              
              <div className="space-y-4 pt-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Custom Hero Image</label>
                
                {heroImagePreview ? (
                  <div className="relative rounded-2xl overflow-hidden aspect-video border-4 border-slate-100 shadow-inner group">
                    <img src={heroImagePreview} className="w-full h-full object-cover" alt="Hero Preview" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-4">
                      <button 
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-white text-slate-900 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest hover:bg-teal-500 hover:text-white transition-all shadow-lg"
                      >
                        Change Image
                      </button>
                      <button 
                        type="button"
                        onClick={() => setHeroImagePreview(null)}
                        className="bg-red-500 text-white px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest hover:bg-red-600 transition-all shadow-lg"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-200 rounded-2xl aspect-video flex flex-col items-center justify-center cursor-pointer hover:border-teal-500 hover:bg-teal-50 transition-all group"
                  >
                    <div className="p-4 bg-slate-100 rounded-full group-hover:bg-teal-100 transition-colors mb-4">
                      <Icons.Plus />
                    </div>
                    <span className="text-sm font-bold text-slate-500 group-hover:text-teal-600">Upload Hero Image</span>
                  </div>
                )}
                
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={(e) => handleImageUpload(e, 'hero')} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button type="submit" className="px-10 py-4 bg-teal-600 hover:bg-slate-900 text-white font-black rounded-full transition-all shadow-xl hover:-translate-y-1">
                Save All Changes
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default AdminDashboard;
