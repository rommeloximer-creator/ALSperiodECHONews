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

  // FETCH STORIES FROM FIREBASE
  useEffect(() => {
    const fetchArticles = async () => {
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
      }
    };
    fetchArticles();
  }, []); 

  // SCROLL EFFECT: Moves screen to news when a category is clicked
  useEffect(() => {
    if (activeCategory !== 'HEADLINE') {
      const element = document.getElementById('news-feed');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [activeCategory]);

  // --- ADDED FROM IMAGE: ROBUST FILTER LOGIC ---
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
        
        <section id="news-feed" className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
          <div className="border-b-4 border-slate-900 pb-4 mb-12">
            <h2 className="text-4xl md:text-5xl font-black font-serif text-slate-900 uppercase">
              {activeCategory === 'HEADLINE' ? 'Community Voice' : activeCategory}
            </h2>
            <p className="text-slate-500 font-bold tracking-widest uppercase text-sm mt-2">
              {activeCategory === 'HEADLINE' 
                ? 'Latest Journalism from the Field' 
                : `Browsing all stories in ${activeCategory}`}
            </p>
          </div>

          {filteredArticles.length === 0 ? (
            <div className="text-center py-20 bg-slate-50 rounded-3xl border border-slate-100">
              <p className="text-slate-400 font-bold text-lg">No stories found in this category.</p>
              <button 
                onClick={() => setActiveCategory('HEADLINE')}
                className="text-blue-600 font-bold mt-4 hover:underline"
              >
                Back to All News
              </button>
            </div>
          ) : (
            // --- ADDED FROM IMAGE: MAPPING FILTERED ARTICLES ---
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              {filteredArticles.map((article) => (
                <article 
                  key={article.id} 
                  className="group cursor-pointer flex flex-col h-full"
                  onClick={() => setSelectedArticle(article)}
                >
                  <div className="relative overflow-hidden rounded-2xl mb-5 aspect-[4/3] shadow-sm border border-slate-100">
                    <img 
                      src={article.image || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=1000"} 
                      alt={article.title}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                      {article.category}
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold font-serif leading-tight mb-3 group-hover:text-blue-900 transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  
                  <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 mb-4 flex-grow">
                    {article.content}
                  </p>

                  <div className="flex items-center text-xs font-bold text-slate-400 uppercase tracking-wider mt-auto pt-4 border-t border-slate-100">
                    <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                    <span className="mx-2">•</span>
                    <span>Read Story →</span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer settings={defaultSettings} />

      {/* MODALS */}
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
  onLike={(id) => console.log('Liked article:', id)} 
/>
      )}
    </div>
  );
}

export default App;
