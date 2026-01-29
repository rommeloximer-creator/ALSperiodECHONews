
import React, { useState, useEffect, useMemo } from 'react';
import { Article, Category, SiteSettings, AuthState } from './types';
import { STORAGE_KEYS, Icons } from './constants';
import Header from './components/Header';
import Hero from './components/Hero';
import ArticleCard from './components/ArticleCard';
import ArticleModal from './components/ArticleModal';
import AdminDashboard from './components/AdminDashboard';
import Login from './components/Login';
import Footer from './components/Footer';

const App: React.FC = () => {
  // State
  const [articles, setArticles] = useState<Article[]>([]);
  const [settings, setSettings] = useState<SiteSettings>({
    title: 'PeriodECHO',
    subtitle: 'SDO Pangasinan II',
    tagline: 'Our Voice, Our Story, Our Journey',
    bannerUrl: null,
    logoUrl: null,
    heroImageUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=2071',
    heroDescription: 'The official digital platform for news, stories, and updates from the Alternative Learning System community of SDO Pangasinan II.',
    useStaticHero: true,
    facebookUrl: '',
    twitterUrl: '',
    instagramUrl: ''
  });
  const [auth, setAuth] = useState<AuthState>({ isLoggedIn: false, isAdmin: false });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  // Initialize data from LocalStorage
  useEffect(() => {
    const savedArticles = localStorage.getItem(STORAGE_KEYS.ARTICLES);
    const savedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    const savedAuth = localStorage.getItem(STORAGE_KEYS.AUTH);

    if (savedArticles) setArticles(JSON.parse(savedArticles));
    if (savedSettings) setSettings(JSON.parse(savedSettings));
    if (savedAuth) setAuth(JSON.parse(savedAuth));
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(articles));
  }, [articles]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(auth));
  }, [auth]);

  // Derived state
  const filteredArticles = useMemo(() => {
    return articles
      .filter(a => 
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => b.createdAt - a.createdAt);
  }, [articles, searchQuery]);

  const featuredArticle = useMemo(() => {
    if (settings.useStaticHero) return null;
    return filteredArticles[0] || null;
  }, [filteredArticles, settings.useStaticHero]);

  const displayArticles = useMemo(() => {
    if (!settings.useStaticHero && featuredArticle) {
      return filteredArticles.slice(1);
    }
    return filteredArticles;
  }, [filteredArticles, featuredArticle, settings.useStaticHero]);

  // Handlers
  const handleLike = (id: string) => {
    setArticles(prev => prev.map(a => a.id === id ? { ...a, likes: a.likes + 1 } : a));
  };

  const handleSaveArticle = (article: Article) => {
    setArticles(prev => {
      const index = prev.findIndex(a => a.id === article.id);
      if (index > -1) {
        const next = [...prev];
        next[index] = article;
        return next;
      }
      return [article, ...prev];
    });
  };

  const handleDeleteArticle = (id: string) => {
    if (confirm('Are you sure you want to delete this story?')) {
      setArticles(prev => prev.filter(a => a.id !== id));
    }
  };

  const handleLogout = () => {
    setAuth({ isLoggedIn: false, isAdmin: false });
    setShowAdmin(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header 
        settings={settings} 
        auth={auth} 
        onAdminClick={() => setShowAdmin(!showAdmin)}
        onLoginClick={() => setShowLogin(true)}
        onLogoutClick={handleLogout}
        isAdminActive={showAdmin}
      />

      {/* News Ticker */}
      {!showAdmin && articles.length > 0 && (
        <div className="bg-[#cc2127] text-white py-2 overflow-hidden relative">
          <div className="flex animate-marquee whitespace-nowrap">
            <span className="flex items-center space-x-8 px-4">
              <span className="font-black text-[10px] uppercase tracking-widest bg-white text-[#cc2127] px-2 py-0.5 rounded mr-4">LATEST</span>
              {articles.slice(0, 5).map(a => (
                <button key={a.id} onClick={() => setSelectedArticleId(a.id)} className="text-xs font-bold hover:underline">
                  {a.title}
                </button>
              ))}
            </span>
            <span className="flex items-center space-x-8 px-4">
              <span className="font-black text-[10px] uppercase tracking-widest bg-white text-[#cc2127] px-2 py-0.5 rounded mr-4">LATEST</span>
              {articles.slice(0, 5).map(a => (
                <button key={a.id} onClick={() => setSelectedArticleId(a.id)} className="text-xs font-bold hover:underline">
                  {a.title}
                </button>
              ))}
            </span>
          </div>
          <style>{`
            @keyframes marquee {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .animate-marquee {
              display: inline-flex;
              animation: marquee 30s linear infinite;
            }
          `}</style>
        </div>
      )}

      <main className="flex-grow">
        {showAdmin && auth.isAdmin ? (
          <AdminDashboard 
            articles={articles} 
            settings={settings}
            onSaveArticle={handleSaveArticle}
            onDeleteArticle={handleDeleteArticle}
            onSaveSettings={setSettings}
          />
        ) : (
          <>
            <Hero 
              settings={settings} 
              featuredArticle={featuredArticle} 
              onReadClick={(id) => setSelectedArticleId(id)}
            />
            
            <section id="news-feed" className="container mx-auto px-4 py-20">
              <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8 border-b-2 border-slate-900 pb-8">
                <div className="flex flex-col">
                  <h3 className="text-4xl font-serif font-black text-slate-900 tracking-tight">Community Voice</h3>
                  <p className="text-[#154897] font-bold text-xs uppercase tracking-widest mt-2">Latest Journalism from the Field</p>
                </div>
                <div className="relative w-full max-w-sm">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">
                    <Icons.Search />
                  </span>
                  <input 
                    type="text" 
                    placeholder="Search the archives..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-14 pr-6 py-4 rounded-full bg-slate-50 border-2 border-slate-100 focus:border-[#154897] focus:bg-white focus:outline-none transition-all shadow-inner font-bold"
                  />
                </div>
              </div>

              {displayArticles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                  {displayArticles.map(article => (
                    <ArticleCard 
                      key={article.id} 
                      article={article} 
                      onClick={() => setSelectedArticleId(article.id)} 
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-32 bg-slate-50 rounded-3xl border-4 border-dashed border-slate-200">
                  <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Icons.Search />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900">No Stories Found</h4>
                  <p className="text-slate-500 mt-2">Try searching for a different keyword or category.</p>
                </div>
              )}
            </section>
          </>
        )}
      </main>

      <Footer settings={settings} />

      {selectedArticleId && (
        <ArticleModal 
          article={articles.find(a => a.id === selectedArticleId)!}
          onClose={() => setSelectedArticleId(null)}
          onLike={() => handleLike(selectedArticleId)}
        />
      )}

      {showLogin && (
        <Login 
          onClose={() => setShowLogin(false)} 
          onLogin={(isAdmin) => setAuth({ isLoggedIn: true, isAdmin })} 
        />
      )}
    </div>
  );
};

export default App;
