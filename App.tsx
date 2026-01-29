import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Footer from './components/Footer';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import ArticleModal from './components/ArticleModal';
import { Article } from './types';
import { db } from './services/firebase'; 
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

// Default settings to fix the build error
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

  if (isAdminLoggedIn) {
    return <AdminDashboard onLogout={() => setIsAdminLoggedIn(false)} />;
  }

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* FIXED: Added settings prop */}
      <Header 
        onAdminClick={() => setIsAdminOpen(true)} 
        settings={defaultSettings} 
      />
      
      <main>
        {/* FIXED: Added settings and featuredArticle props */}
        <Hero 
          settings={defaultSettings} 
          featuredArticle={articles[0]} 
        />
        
        {/* LATEST NEWS SECTION */}
        <section id="news" className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
          <div className="border-b-4 border-slate-900 pb-4 mb-12">
            <h2 className="text-4xl md:text-5xl font-black font-serif text-slate-900">
              Community Voice
            </h2>
            <p className="text-slate-500 font-bold tracking-widest uppercase text-sm mt-2">
              Latest Journalism from the Field
            </p>
          </div>

          {articles.length === 0 ? (
            <div className="text-center py-20 bg-slate-50 rounded-3xl border border-slate-100">
              <p className="text-slate-400 font-bold text-lg">No stories published yet.</p>
              <p className="text-slate-300 text-sm mt-2">Login to Admin to create the first post.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              {articles.map((article) => (
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

      {/* FIXED: Added settings prop */}
      <Footer settings={defaultSettings} />

      {/* MODALS */}
      {isAdminOpen && (
        <Login 
          onClose={() => setIsAdminOpen(false)}
          onLogin={(isAdmin) => {
            if (isAdmin) setIsAdminLoggedIn(true);
          }}
        />
      )}

      {selectedArticle && (
        <ArticleModal 
          article={selectedArticle} 
          onClose={() => setSelectedArticle(null)} 
        />
      )}
    </div>
  );
}

export default App;
