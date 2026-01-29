function App() {
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [articles, setArticles] = useState<Article[]>([]); 
  const [activeCategory, setActiveCategory] = useState<Category | 'HEADLINE'>('HEADLINE');

  // ... useEffect logic for Firebase remains the same ...

  // FIX: Case-insensitive filtering to prevent data mismatch
  const filteredArticles = articles.filter(article => {
    if (activeCategory === 'HEADLINE') return true;
    return article.category?.toUpperCase() === activeCategory.toUpperCase();
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
        {/* Only show Hero on the main Headline view */}
        {activeCategory === 'HEADLINE' && (
          <Hero settings={defaultSettings} featuredArticle={articles[0]} />
        )}
        
        {/* SINGLE News Section - Removed duplicates */}
        <section id="news-feed" className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
          <div className="border-b-4 border-slate-900 pb-4 mb-12">
            <h2 className="text-4xl md:text-5xl font-black font-serif text-slate-900 uppercase">
              {activeCategory === 'HEADLINE' ? 'Community Voice' : activeCategory}
            </h2>
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
        <ArticleModal article={selectedArticle} onClose={() => setSelectedArticle(null)} />
      )}
    </div>
  );
}
