import React, { useState } from 'react';
import ArticleEditor from './ArticleEditor';
import { Article } from '../types';

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);

  const handleSaveArticle = async (data: any) => {
    console.log("Saving article data:", data);
    // Add your firebase save logic here
    setIsEditorOpen(false);
    setEditingArticle(null);
  };

  const handleEdit = (article: Article) => {
    setEditingArticle(article);
    setIsEditorOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter">
            ALS PeriodECHO <span className="text-[#cc2127]">ADMIN</span>
          </h1>
          <button 
            onClick={onLogout}
            className="px-6 py-2 bg-white text-slate-700 font-bold rounded-full border border-slate-200 hover:bg-red-50 hover:text-red-600 transition-all shadow-sm"
          >
            LOGOUT
          </button>
        </div>

        {isEditorOpen ? (
          <div className="max-w-4xl mx-auto">
            {/* FIXED BELOW: 
                1. changed initialData to article
                2. changed onClose to oncancel (lowercase)
               
            */}
            <ArticleEditor 
              article={editingArticle} 
              onSave={handleSaveArticle}
              oncancel={() => {
                setIsEditorOpen(false);
                setEditingArticle(null);
              }}
            />
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-16 text-center">
            <div className="w-20 h-20 bg-blue-50 text-[#154897] rounded-2xl flex items-center justify-center text-4xl mx-auto mb-6">
              ✍️
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Newsroom Manager</h2>
            <p className="text-slate-500 mb-10 max-w-sm mx-auto">
              Welcome back! Use this portal to publish new stories or updates for the ALS community.
            </p>
            <button 
              onClick={() => setIsEditorOpen(true)}
              className="px-10 py-5 bg-[#154897] text-white font-black rounded-full hover:bg-[#cc2127] transition-all shadow-lg hover:-translate-y-1 uppercase tracking-widest text-sm"
            >
              + Create New Article
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
