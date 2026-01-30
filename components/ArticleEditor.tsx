import React, { useState } from 'react';
import { Article, Category } from '../types';

interface ArticleEditorProps {
  article: Article | null;
  onSave: (data: Partial<Article>) => void;
  oncancel: () => void;
}

const ArticleEditor: React.FC<ArticleEditorProps> = ({ article, onSave, oncancel }) => {
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState<Partial<Article>>(
    article || {
      title: '',
      content: '',
      category: Category.NEWS, // Fixed: Using Enum instead of raw string
      image: '',
      author: 'ALS PeriodECHO Staff',
    }
  );

  // Using ImgBB to bypass Firebase Storage "Upgrade" requirements
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;
    if (!IMGBB_API_KEY) {
      alert("Missing ImgBB API Key in Vercel settings!");
      return;
    }

    const uploadData = new FormData();
    uploadData.append('image', file);
    
    setUploading(true);
    try {
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: 'POST',
        body: uploadData
      });
      const data = await response.json();
      
      if (data.success) {
        setFormData(prev => ({ ...prev, image: data.data.url }));
        alert("Image uploaded to ImgBB successfully!");
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload image. Check your ImgBB API key.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      alert("Please fill in the title and content.");
      return;
    }
    onSave(formData);
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8 border border-slate-100">
      <h2 className="text-2xl font-black text-slate-900 mb-6 uppercase tracking-tight">
        {article ? 'Edit Article' : 'Compose New Story'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">Title</label>
          <input
            type="text"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#154897] outline-none"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Enter a catchy headline..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">Category</label>
            <select
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#154897] outline-none"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}
            >
              {Object.values(Category).map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">
              Feature Image {uploading && <span className="text-blue-600 animate-pulse">(Uploading...)</span>}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-blue-50 file:text-[#154897] hover:file:bg-blue-100 transition-all"
            />
          </div>
        </div>

        {formData.image && (
          <div className="relative w-full h-48 bg-slate-100 rounded-2xl overflow-hidden border border-slate-200">
            <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
            <div className="absolute top-2 left-2 bg-white/90 px-3 py-1 rounded-full text-[10px] font-bold text-slate-800 uppercase shadow-sm">
              Image Preview
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">Article Content</label>
          <textarea
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#154897] outline-none h-64 resize-none"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            placeholder="Write your story here..."
          />
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={uploading}
            className={`flex-1 py-4 rounded-full font-black text-sm uppercase tracking-widest transition-all shadow-lg ${
              uploading ? 'bg-slate-300 cursor-not-allowed' : 'bg-[#154897] text-white hover:bg-[#cc2127] hover:-translate-y-1'
            }`}
          >
            {uploading ? 'Processing Image...' : 'Publish to Newsroom'}
          </button>
          <button
            type="button"
            onClick={oncancel}
            className="px-8 py-4 bg-white text-slate-500 font-bold rounded-full border border-slate-200 hover:bg-slate-50 transition-all uppercase tracking-widest text-sm"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ArticleEditor;
