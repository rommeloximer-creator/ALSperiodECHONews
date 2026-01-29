import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Footer from './components/Footer';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import ArticleModal from './components/ArticleModal';
import { Article, Category } from './types';
import { db } from './services/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

const defaultSettings = {
  title: "ALS PeriodECHO",
  subtitle: "Official Newsletter",
  tagline: "Empowering Education",
  bannerUrl: null,
  logoUrl: null,
  heroImageUrl: null,
  heroDescription: "Welcome to our official newsletter site.",
  useStaticHero: true,
  facebookUrl: "#",
  twitterUrl: "#",
  instagramUrl: "#"
};

function App() {
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [activeCategory, setActiveCategory] = useState<Category | 'HEADLINE'>('HEADLINE');

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
    fetchArticles();
  }, []);

  const filteredArticles = articles.filter(article => {
    if (activeCategory === 'HEADLINE') return true;
    const articleCat = String(article.category || "").toUpperCase().trim();
    const activeCat = String(activeCategory).toUpperCase().trim();
    return articleCat === activeCat;
  });

  if (isAdminLoggedIn) {
    return <AdminDashboard onLogout={() => setIsAdminLoggedIn(false)} />;
  }

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <Header 
        settings={defaultSettings}
        auth={{ isAdmin: true, isLoggedIn: isAdminLoggedIn }}
        onAdminClick={() => setIsAdminOpen(true)}
        onLoginClick={() => setIsAdminOpen(true)}
        onLogoutClick={() => setIsAdminLoggedIn(false)}
        isAdminActive={false}
        onCategorySelect={(cat) => setActiveCategory(cat)} 
      />
      
      <main>
        {activeCategory === 'HEADLINE' && (
          <Hero 
            settings={defaultSettings} 
            featuredArticle={articles[0] || null} 
            onReadClick={(id) => {
              const article = articles.find(a => a.id === id);
              if (article) setSelectedArticle(article);
            }} 
          />
        )}
        
        <section id="news-feed" className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
          <div className="border-b-4 border-slate-900 pb-4 mb-12">
            <h2 className="text-4xl font-serif font-black uppercase">
              {activeCategory === 'HEADLINE' ? 'Community Voice' : activeCategory}
            </h2>
          </div>

          {filteredArticles.length === 0 ? (
            <div className="text-center py-20 bg-slate-50 rounded-3xl">
              <p className="text-slate-400 font-bold">No stories found in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              {filteredArticles.map((article) => (
                <article 
                  key={article.id} 
                  className="group cursor-pointer flex flex-col h-full"
                  onClick={() => setSelectedArticle(article)}
                >
                  <div className="relative overflow-hidden rounded-2xl mb-5 aspect-[4/3] border border-slate-100">
                    <img 
                      src={article.image || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=1000"} 
                      alt={article.title}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <h3 className="text-2xl font-bold font-serif mb-3 line-clamp-2">{article.title}</h3>
                  <p className="text-slate-500 text-sm line-clamp-3 mb-4">{article.content}</p>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer settings={defaultSettings} />

      {isAdminOpen && (
        <Login 
          onClose={() => setIsAdminOpen(false)}
          onLogin={(isAdmin) => {
            if (isAdmin) setIsAdminLoggedIn(true);
            setIsAdminOpen(false);
          }}
        />
      )}

      {selectedArticle && (
        <ArticleModal 
          article={selectedArticle} 
          onClose={() => setSelectedArticle(null)} 
          onLike={(id) => console.log('Liked:', id)}
        />
      )}
    </div>
  );
}

export default App;
