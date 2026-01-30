import React, { useState, useEffect } from 'react';
import { Article } from '../types';
import ArticleEditor from './ArticleEditor';
import { db } from '../services/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, orderBy } from 'firebase/firestore';

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'stories' | 'settings'>('overview');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | undefined>(undefined);
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Fetch stories from the Cloud (Firebase)
  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);
      try {
        const q = query(collection(db, "articles"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        
        const fetchedArticles: Article[] = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Article));
        
        setArticles(fetchedArticles);
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // 2. Save a new story to the Cloud
  const handleSaveArticle = async (articleData: Omit<Article, 'id' | 'likes' | 'views' | 'createdAt'>) => {
    try {
      if (editingArticle) {
        // Update existing story
        const articleRef = doc(db, "articles", editingArticle.id);
        await updateDoc(articleRef, {
          ...articleData,
          images: articleData.images
        });
        
        // Update local list instantly
        setArticles(prev => prev.map(a => a.id === editingArticle.id ? { ...a, ...articleData } : a));
      } else {
        // Create new story
        const newArticle = {
          ...articleData,
          likes: 0,
          views: 0,
          createdAt: new Date().toISOString()
        };
        
        const docRef = await addDoc(collection(db, "articles"), newArticle);
        
        // Add to local list instantly
        setArticles(prev => [{ ...newArticle, id: docRef.id } as Article, ...prev]);
      }
      setIsEditorOpen(false);
      setEditingArticle(undefined);
    } catch (error) {
      console.error("Error saving article:", error);
      alert("Failed to save article. Check console for details.");
    }
  };

  // 3. Delete a story from the Cloud
  const handleDeleteArticle = async (id: string) => {
    if (confirm('Are you sure you want to delete this article? This cannot be undone.')) {
      try {
        await deleteDoc(doc(db, "articles", id));
        setArticles(prev => prev.filter(a => a.id !== id));
      } catch (error) {
        console.error("Error deleting article:", error);
        alert("Failed to delete article.");
      }
    }
  };

  const handleEditArticle = (article: Article) => {
    setEditingArticle(article);
    setIsEditorOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-serif text-slate-900">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-slate-900 text-white p-6 hidden md:block">
        <div className="flex items-center space-x-3 mb-12">
          <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-slate-900 font-black">P</div>
          <span className="font-bold tracking-widest uppercase text-sm">Admin Panel</span>
        </div>

        <nav className="space-y-4">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`w-full text-left px-4 py-3 rounded-xl transition-all ${activeTab === 'overview' ? 'bg-yellow-400 text-slate-900 font-bold' : 'hover:bg-slate-800 text-slate-400'}`}
          >
            Overview
          </button>
          <button 
            onClick={() => setActiveTab('stories')}
            className={`w-full text-left px-4 py-3 rounded-xl transition-all ${activeTab === 'stories' ? 'bg-yellow-400 text-slate-900 font-bold' : 'hover:bg-slate-800 text-slate-400'}`}
          >
            Manage Stories
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full text-left px-4 py-3 rounded-xl transition-all ${activeTab === 'settings' ? 'bg-yellow-400 text-slate-900 font-bold' : 'hover:bg-slate-800 text-slate-400'}`}
          >
            Settings
          </button>
        </nav>

        <button onClick={onLogout} className="absolute bottom-8 left-6 flex items-center space-x-2 text-slate-400 hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
          </svg>
          <span className="text-sm font-bold">Sign Out</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="md:ml-64 p-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-10">
            <h1 className="text-3xl font-black">
              {activeTab === 'overview' && 'Dashboard Overview'}
              {activeTab === 'stories' && 'Manage Stories'}
              {activeTab === 'settings' && 'System Settings'}
            </h1>
            <div className="md:hidden">
              <button onClick={onLogout} className="text-sm font-bold text-red-600">Sign Out</button>
            </div>
          </div>

          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-slate-400 font-bold text-xs uppercase tracking-wider mb-2">Total Stories</h3>
                <p className="text-4xl font-black">{articles.length}</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-slate-400 font-bold text-xs uppercase tracking-wider mb-2">Total Views</h3>
                <p className="text-4xl font-black">
                  {articles.reduce((acc, curr) => acc + (curr.views || 0), 0)}
                </p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-slate-400 font-bold text-xs uppercase tracking-wider mb-2">Total Likes</h3>
                <p className="text-4xl font-black">
                  {articles.reduce((acc, curr) => acc + (curr.likes || 0), 0)}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'stories' && (
            <div>
              <button 
                onClick={() => {
                  setEditingArticle(undefined);
                  setIsEditorOpen(true);
                }}
                className="mb-8 flex items-center space-x-2 bg-slate-900 text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-slate-800 transition-all shadow-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                <span>Write New Story</span>
              </button>

              {isLoading ? (
                <div className="text-center py-10 text-slate-400">Loading stories from cloud...</div>
              ) : (
                <div className="space-y-4">
                  {articles.map(article => (
                    <div key={article.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between group hover:border-slate-200 transition-all">
                      <div>
                        <h3 className="font-bold text-lg mb-1">{article.title}</h3>
                        <div className="flex items-center space-x-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                          <span>{article.category}</span>
                          <span>•</span>
                          <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleEditArticle(article)}
                          className="p-2 hover:bg-slate-50 text-slate-400 hover:text-blue-600 rounded-lg transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                          </svg>
                        </button>
                        <button 
                          onClick={() => handleDeleteArticle(article.id)}
                          className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <h2 className="font-bold text-xl mb-4">Security Settings</h2>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <h4 className="font-bold text-sm">Admin Account</h4>
                  <p className="text-xs text-slate-500 mt-1">Currently signed in securely via Google</p>
                </div>
                <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                  Secure
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {isEditorOpen && (
        {isEditorOpen && (
  <ArticleEditor 
    oncancel={() => setIsEditorOpen(false)}
    onSave={handleSaveArticle}
    article={editingArticle}
  />
)}
    </div>
  );
};

export default AdminDashboard;
