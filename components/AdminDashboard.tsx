import React, { useState, useEffect } from 'react';
import ArticleEditor from './ArticleEditor';
import { Article } from '../types';
import { db } from '../services/firebase';
import { collection, addDoc, serverTimestamp, doc, getDoc, updateDoc } from 'firebase/firestore';

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  
  // State for Site Branding
  const [siteSettings, setSiteSettings] = useState({
    bannerUrl: '',
    heroUrl: '',
    brandingType: 'Standard'
  });

  // Load current settings when dashboard opens
  useEffect(() => {
    const fetchCurrentSettings = async () => {
      const docRef = doc(db, 'settings', 'site_config');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setSiteSettings({
          bannerUrl: data.bannerUrl || '',
          heroUrl: data.heroUrl || '',
          brandingType: data.brandingType || 'Standard'
        });
      }
    };
    fetchCurrentSettings();
  }, []);

  // Save branding changes to Firebase
  const handleSaveSettings = async () => {
    try {
      const docRef = doc(db, 'settings', 'site_config');
      await updateDoc(docRef, siteSettings);
      alert("Success! Site branding has been updated.");
    } catch (error) {
      console.error("Error updating settings:", error);
      alert("Failed to update settings. check your Firebase permissions.");
    }
  };

  const handleSaveArticle = async (data: any) => {
    try {
      await addDoc(collection(db, "articles"), {
        ...data,
        createdAt: serverTimestamp(),
        views: 0,
        likes: 0
      });
      alert("Success! Your article is now live.");
      setIsEditorOpen(false);
      setEditingArticle(null);
      window.location.reload(); 
    } catch (error) {
      console.error("Firebase Save Error:", error);
      alert("Error: Could not save article.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
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

        {/* --- SITE BRANDING MANAGER --- */}
        {!isEditorOpen && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 mb-8">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <span>🎨</span> Site Branding & Appearance
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Branding Style</label>
                <select 
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700"
                  value={siteSettings.brandingType}
                  onChange={(e) => setSiteSettings({...siteSettings, brandingType: e.target.value})}
                >
                  <option value="Standard">Standard (Text Title)</option>
                  <option value="banner">Custom Banner Image</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Banner Image URL</label>
                <input 
                  type="text" 
                  placeholder="Paste ImgBB link here..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
                  value={siteSettings.bannerUrl}
                  onChange={(e) => setSiteSettings({...siteSettings, bannerUrl: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Welcome (Hero) Image URL</label>
                <input 
                  type="text" 
                  placeholder="Paste ImgBB link here..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
                  value={siteSettings.heroUrl}
                  onChange={(e) => setSiteSettings({...siteSettings, heroUrl: e.target.value})}
                />
              </div>
            </div>
            <button 
              onClick={handleSaveSettings}
              className="mt-6 px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-blue-600 transition-all shadow-md"
            >
              Apply Branding Changes
            </button>
          </div>
        )}

        {/* --- ARTICLE MANAGER --- */}
        {isEditorOpen ? (
          <div className="max-w-4xl mx-auto">
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
              Ready to update the ALS community? Create a new headline or edit existing stories here.
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
