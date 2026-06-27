import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Layout } from '../components/Layout';
import { Link } from 'react-router-dom';
import { formatDate } from '../lib/utils';
import { 
  Clock, 
  Search, 
  ChevronRight, 
  Sparkles, 
  Calendar, 
  ArrowRight,
  Send,
  Mail,
  ArrowUpRight
} from 'lucide-react';
import { categories, mockBlogPosts } from '../constants/blog';

export const Blog = () => {
  const [posts, setPosts] = useState<any[]>(mockBlogPosts);

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const q = query(collection(db, 'blog'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const fbPosts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        if (fbPosts.length > 0) {
          // Combine firestore posts with mock posts if needed, or just prioritize firestore
          setPosts([...fbPosts, ...mockBlogPosts]);
        }
      } catch (error) {
        console.error("Error fetching blog posts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const filteredPosts = posts.filter(post => {
    const matchesSearch = (
      post.title.toLowerCase().includes(search.toLowerCase()) || 
      post.description?.toLowerCase().includes(search.toLowerCase())
    );
    const matchesCategory = activeCategory === "All" || post.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPost = posts.find(p => p.isFeatured) || posts[0];
  const regularPosts = filteredPosts.filter(p => p.id !== featuredPost?.id);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-40 pb-24 px-6 relative overflow-hidden text-center">
        <div className="grid-overlay absolute inset-0 opacity-10 pointer-events-none" />
        
        {/* Animated Background Lights */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-accent/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] animate-pulse-slow" />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-accent/5 border border-accent/20 mb-8"
          >
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">Latest Articles</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-9xl font-black tracking-tighter mb-8 leading-none text-white"
          >
            Insights & <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-blue-500 italic font-serif">Stories</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            Tutorials, development insights, UI inspiration, AI tools, and modern technology experiences.
          </motion.p>
          
          <div className="w-40 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent mx-auto" />
        </div>
      </section>

      {/* Categories & Search */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 py-8 border-y border-white/5">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 border ${
                  activeCategory === cat 
                    ? "bg-accent text-navy-dark border-accent" 
                    : "bg-white/5 text-slate-500 border-white/10 hover:border-white/30 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80 group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-hover:text-accent transition-colors" />
            <input 
              type="text" 
              placeholder="Search insights..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 rounded-full py-4 pl-14 pr-6 text-sm text-white focus:border-accent outline-none transition-all placeholder:text-slate-600 backdrop-blur-md"
            />
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && activeCategory === "All" && !search && (
        <section className="pb-24 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative group rounded-[60px] overflow-hidden aspect-[21/9] flex items-end p-12 md:p-20"
            >
              {/* Background with zoom */}
              <div className="absolute inset-0">
                <img 
                  src={featuredPost.image} 
                  alt={featuredPost.title} 
                  className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-dark via-navy-dark/40 to-transparent" />
              </div>

              {/* Content Overlay */}
              <div className="relative z-10 max-w-2xl">
                <div className="flex items-center space-x-4 mb-6">
                  <span className="px-4 py-1 rounded-full bg-accent text-[10px] font-black uppercase tracking-tighter text-navy-dark">Featured</span>
                  <span className="text-[10px] font-black uppercase tracking-tighter text-white/50">{featuredPost.readTime}</span>
                </div>
                
                <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter mb-8 leading-none">
                  {featuredPost.title}
                </h2>
                
                <p className="text-slate-400 text-lg mb-10 leading-relaxed line-clamp-2">
                  {featuredPost.description}
                </p>

                <Link 
                  to={`/blog/${featuredPost.id}`}
                  className="inline-flex items-center space-x-4 px-10 py-5 bg-white/[0.05] border border-white/10 hover:border-accent/40 rounded-full backdrop-blur-xl group/btn transition-all duration-300"
                >
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Read Full Story</span>
                  <ArrowRight className="w-4 h-4 text-accent transition-transform group-hover/btn:translate-x-1" />
                </Link>
              </div>

              {/* Floating Glow */}
              <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-accent/20 rounded-full blur-[100px] group-hover:bg-accent/30 transition-colors" />
            </motion.div>
          </div>
        </section>
      )}

      {/* Posts Grid */}
      <section className="py-24 px-6 bg-navy-dark/30">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="glass rounded-[40px] overflow-hidden flex flex-col animate-pulse border border-white/5">
                  <div className="aspect-[16/10] bg-white/[0.03]" />
                  <div className="p-8 space-y-5 flex-grow">
                    <div className="flex space-x-4 items-center">
                      <div className="h-3 w-16 bg-white/[0.04] rounded" />
                      <div className="h-1.5 w-1.5 bg-white/[0.04] rounded-full" />
                      <div className="h-3 w-12 bg-white/[0.04] rounded" />
                    </div>
                    <div className="h-6 w-5/6 bg-white/[0.05] rounded-lg animate-pulse" />
                    <div className="space-y-2">
                      <div className="h-3 w-full bg-white/[0.03] rounded" />
                      <div className="h-3 w-5/6 bg-white/[0.03] rounded" />
                    </div>
                    <div className="pt-8 border-t border-white/5 flex items-center justify-between mt-auto">
                      <div className="h-3 w-28 bg-white/[0.04] rounded" />
                      <div className="h-10 w-10 bg-white/[0.03] rounded-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
            >
              <AnimatePresence mode="popLayout">
                {(activeCategory === "All" && !search ? regularPosts : filteredPosts).map((post, index) => (
                  <motion.div
                    key={post.id}
                    layout
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.1 }}
                    className="group"
                  >
                    <div className="glass rounded-[40px] overflow-hidden flex flex-col h-full hover:border-accent/30 transition-all duration-500 relative">
                      <div className="aspect-[16/10] overflow-hidden relative">
                        <img 
                          src={post.image || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80'} 
                          alt={post.title} 
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                          loading="lazy"
                          decoding="async"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-navy-dark/20 group-hover:bg-navy-dark/0 transition-colors" />
                        <div className="absolute top-6 left-6">
                           <span className="px-4 py-1.5 rounded-full bg-navy-dark/60 backdrop-blur-xl border border-white/10 text-[10px] font-black uppercase tracking-widest text-accent">
                             {post.category}
                           </span>
                        </div>
                      </div>
                      
                      <div className="p-8 flex-grow flex flex-col">
                        <div className="flex items-center space-x-4 mb-6">
                           <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-tighter text-slate-500">
                             <Calendar className="w-3 h-3" />
                             <span>{formatDate(post.createdAt)}</span>
                           </div>
                           <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                           <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-tighter text-slate-500">
                             <Clock className="w-3 h-3" />
                             <span>{post.readTime || '5 min'}</span>
                           </div>
                        </div>

                        <h3 className="text-2xl font-black text-white mb-4 tracking-tighter group-hover:text-accent transition-colors line-clamp-2">
                          {post.title}
                        </h3>

                        <p className="text-slate-400 text-sm leading-relaxed mb-8 line-clamp-3">
                          {post.description || post.content?.replace(/[#*`]/g, '').substring(0, 150)}
                        </p>
                        
                        <div className="mt-auto pt-8 border-t border-white/5 flex items-center justify-between">
                          <Link 
                            to={`/blog/${post.id}`} 
                            className="text-[10px] font-black uppercase tracking-widest text-white group/link flex items-center space-x-2"
                          >
                            <span>Read Full Story</span>
                            <ArrowRight className="w-3 h-3 text-accent group-hover/link:translate-x-1 transition-transform" />
                          </Link>
                          
                          <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                            <ArrowUpRight className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      </div>

                      {/* Hover Accent Glow */}
                      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-accent/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {!loading && filteredPosts.length === 0 && (
            <div className="text-center py-40 glass rounded-[60px]">
              <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-8">
                <Search className="w-8 h-8 text-slate-700" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">No results found</h3>
              <p className="text-slate-500">Try adjusting your search or category filters.</p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="glass p-12 md:p-24 rounded-[60px] relative overflow-hidden flex flex-col md:flex-row items-center gap-12">
             <div className="absolute top-1/2 left-0 w-96 h-96 bg-accent/10 rounded-full blur-[100px] -translate-y-1/2 -translate-x-1/2" />
             <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px]" />
             
             <div className="relative z-10 flex-1 text-center md:text-left">
               <motion.div
                 initial={{ opacity: 0, scale: 0.9 }}
                 whileInView={{ opacity: 1, scale: 1 }}
                 viewport={{ once: true }}
                 className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8"
               >
                 <Mail className="w-4 h-4 text-accent" />
                 <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Newsletter</span>
               </motion.div>
               <h2 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6 tracking-tighter">
                 Stay Updated<span className="text-accent">.</span>
               </h2>
               <p className="text-slate-400 text-lg max-w-md">
                 Get the latest tutorials, development insights, and futuristic design inspiration straight to your inbox.
               </p>
             </div>

             <div className="relative z-10 w-full md:w-[450px]">
               <div className="relative flex items-center p-2 bg-white/[0.03] border border-white/10 rounded-full backdrop-blur-xl group hover:border-accent/40 transition-all duration-500">
                 <input 
                   type="email" 
                   placeholder="Enter your email address"
                   className="flex-1 bg-transparent py-4 px-8 text-white text-sm outline-none placeholder:text-slate-600"
                 />
                 <button className="px-10 py-4 bg-accent text-navy-dark font-black rounded-full flex items-center space-x-3 hover:bg-white transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(34,211,238,0.3)]">
                   <span className="text-[10px] uppercase tracking-widest">Subscribe</span>
                   <Send className="w-4 h-4" />
                 </button>
               </div>
               <p className="mt-6 text-center md:text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-700">
                 Join 1,000+ others already receiving futuristic insights.
               </p>
             </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-accent/5 pointer-events-none" />
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12 relative z-10">
          <div className="max-w-xl text-center md:text-left">
            <h2 className="text-5xl md:text-8xl font-black text-white leading-tight mb-8">
              Let's connect <br />
              <span className="text-slate-600 italic font-serif">there</span>
            </h2>
            <p className="text-slate-400 text-lg">
              Available for freelance work, creative collaborations, and futuristic digital experiences.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group flex items-center space-x-6 bg-white/[0.03] border border-white/10 hover:border-accent/50 p-6 pl-10 rounded-full transition-all backdrop-blur-xl"
          >
            <span className="text-white font-black uppercase tracking-widest text-lg">Let's Connect</span>
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center group-hover:bg-accent transition-colors duration-500">
              <ArrowRight className="w-6 h-6 text-navy-dark" />
            </div>
          </motion.button>
        </div>
        
        {/* Floating Particles */}
        <div className="absolute top-1/2 left-1/4 w-2 h-2 rounded-full bg-accent/30 animate-float" />
        <div className="absolute top-1/3 right-1/4 w-3 h-3 rounded-full bg-blue-500/20 animate-float-delayed" />
      </section>
    </Layout>
  );
};

