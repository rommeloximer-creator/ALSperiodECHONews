import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Footer from './components/Footer';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import ArticleModal from './components/ArticleModal';
import { Article, Category } from './types';
import { db } from './services/firebase';
import { collection, getDocs, query, orderBy, doc, getDoc } from 'firebase/firestore';

const defaultSettings = {
  title: "ALS PeriodECHO",
  subtitle: "Official Newsletter",
  tagline: "Empowering Education",
  bannerUrl: "", 
  heroImageUrl: "", 
  brandingType: "Standard"
};

function App() {
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [activeCategory, setActiveCategory] = useState<Category | 'HEADLINE'>('HEADLINE');
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const q = query(collection(db, "articles"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const fetched = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Article));
        setArticles(fetched);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    const fetchSettings = async () => {
      const docRef = doc(db, 'settings', 'site_config');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setSettings(docSnap.data());
      } else {
        setSettings(defaultSettings);
      }
    };

    fetchArticles();
    fetchSettings();
  }, []);

  if (!settings) return <div className="p-20 text-center font-bold animate-pulse">Loading ALS PeriodECHO...</div>;

  if (isAdminLoggedIn) {
    return <AdminDashboard onLogout={() => setIsAdminLoggedIn(false)} />;
  }

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <Header settings={settings} />
      
      <Hero 
        settings={settings} 
        featuredArticle={articles[0] || null} 
        onReadClick={(id) => {
          const article = articles.find(a => a.id === id);
          if (article) setSelectedArticle(article);
        }}
      />
      
      <main className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="border-b-4 border-slate-900 pb-4 mb-12">
          <h2 className="text-4xl font-serif font-black uppercase">
            {activeCategory === 'HEADLINE' ? 'Community Voice' : activeCategory}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {articles.filter(a => activeCategory === 'HEADLINE' || a.category === activeCategory).map((article) => (
            <article key={article.id} className="group cursor-pointer" onClick={() => setSelectedArticle(article)}>
              <div className="relative overflow-hidden rounded-2xl mb-5 aspect-[4/3] border border-slate-100">
                <img 
                  src={article.image || "https://images.unsplash.com/photo-1504711434969-e33886168f5c"} 
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform"
                  alt=""
                />
              </div>
              <h3 className="text-2xl font-bold font-serif mb-3">{article.title}</h3>
              <p className="text-slate-500 line-clamp-3">{article.content}</p>
            </article>
          ))}
        </div>
      </main>

      <Footer settings={settings} />

      {!isAdminLoggedIn && (
        <button onClick={() => setIsAdminOpen(true)} className="fixed bottom-8 right-8 bg-slate-900 text-white p-4 rounded-full shadow-2xl z-50">
          🔐 Admin
        </button>
      )}

      {isAdminOpen && <Login onClose={() => setIsAdminOpen(false)} onLogin={(admin) => admin && setIsAdminLoggedIn(true)} />}
      {selectedArticle && (
        {selectedArticle && (
        <ArticleModal 
          article={selectedArticle} 
          onClose={() => setSelectedArticle(null)} 
          onLike={async () => {
            try {
              const articleRef = doc(db, 'articles', selectedArticle.id);
              await updateDoc(articleRef, {
                likes: (selectedArticle.likes || 0) + 1
              });
              // Update local state for instant visual feedback
              setArticles(articles.map(a => 
                a.id === selectedArticle.id ? { ...a, likes: (a.likes || 0) + 1 } : a
              ));
            } catch (err) {
              console.error("Error liking article:", err);
            }
          }}
        />
      )}
export default App;
