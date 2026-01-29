import React, { useState, useEffect } from 'react';
import { Article } from '../types';

interface ArticleEditorProps {
  article?: Partial<Article> | null;
  onSave: (articleData: Omit<Article, 'id' | 'createdAt'>) => Promise<void>;
  oncancel: () => void; // Fixed: Changed 'onCancel' to 'oncancel' to match your build logs
}

const ArticleEditor: React.FC<ArticleEditorProps> = ({ article, onSave, oncancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    content: '',
    excerpt: '', // Added: Now supported by your updated types.ts
    author: '',
    image: '',
    images: [] as string[],
    isFeatured: false
  });

  useEffect(() => {
    if (article) {
      setFormData({
        title: article.title || '',
        category: article.category || '',
        content: article.content || '',
        excerpt: article.excerpt || '', // Added
        author: article.author || '',
        image: article.image || '',
        images: article.images || [],
        isFeatured: article.isFeatured || false
      });
    }
  }, [article]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
      <h2 className="text-2xl font-bold mb-6 text-slate-800">
        {article ? 'Edit Article' : 'Create New Article'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Title</label>
          <input
            type="text"
            className="w-full p-2 border rounded-md"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Category</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Author</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              required
            />
          </div>
        </div>

        {/* Excerpt Field */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Short Excerpt (Summary)</label>
          <textarea
            className="w-full p-2 border rounded-md h-20"
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Full Content</label>
          <textarea
            className="w-full p-2 border rounded-md h-40"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            required
          />
        </div>

        <div className="flex items-center space-x-2 pb-4">
          <input
            type="checkbox"
            id="featured"
            checked={formData.isFeatured}
            onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
          />
          <label htmlFor="featured" className="text-sm font-bold text-slate-700">
            Feature this story on Homepage
          </label>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <button
            type="button"
            onClick={oncancel} // Fixed: lowercase 'oncancel'
            className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-[#154897] text-white font-bold rounded-md hover:bg-blue-800 transition-colors"
          >
            Save Article
          </button>
        </div>
      </form>
    </div>
  );
};

export default ArticleEditor;
