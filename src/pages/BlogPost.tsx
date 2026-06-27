import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Layout } from '../components/Layout';
import { motion, useScroll, useSpring } from 'motion/react';
import { formatDate } from '../lib/utils';
import { 
  ChevronLeft, 
  Clock, 
  Calendar, 
  User, 
  Share2, 
  Bookmark, 
  MessageSquare,
  ArrowRight
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { mockBlogPosts } from '../constants/blog';

export const BlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      
      // First check mock data
      const mockPost = mockBlogPosts.find(p => p.id === id);
      if (mockPost) {
        setPost(mockPost);
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(db, 'blog', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPost({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (err) {
        console.error("Error fetching post:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  if (!post) {
    return (
      <Layout>
        <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
           <div className="w-24 h-24 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mb-8">
             <ChevronLeft className="w-10 h-10 text-slate-700" />
           </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6">Insight Not Found</h1>
          <p className="text-slate-400 mb-12 max-w-sm">The article you're looking for might have been moved or hasn't been published yet.</p>
          <Link to="/blog" className="px-10 py-4 bg-white text-navy-dark font-black rounded-full hover:bg-accent transition-colors flex items-center space-x-3">
             <ChevronLeft className="w-4 h-4" />
             <span className="text-[10px] uppercase tracking-widest">Back to Insights</span>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-accent z-[100] origin-left"
        style={{ scaleX }}
      />

      <article className="pt-20 pb-32">
        {/* Post Hero */}
        <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
           <div className="absolute inset-0 z-0">
             <img 
               src={post.image || post.thumbnailUrl} 
               alt={post.title} 
               className="w-full h-full object-cover"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-navy-dark via-navy-dark/60 to-transparent" />
             <div className="absolute inset-0 bg-navy-dark/40" />
           </div>

           <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-xl mb-12"
              >
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">{post.category}</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl md:text-8xl font-black text-white leading-none tracking-tighter mb-12 max-w-5xl mx-auto"
              >
                {post.title}
              </motion.h1>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex flex-wrap items-center justify-center gap-8"
              >
                 <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-accent/20 border border-accent/20 flex items-center justify-center">
                      <User className="w-4 h-4 text-accent" />
                    </div>
                    <div className="text-left">
                       <p className="text-[10px] font-black uppercase tracking-widest text-white">Admin</p>
                       <p className="text-[10px] text-slate-500 uppercase tracking-widest">Author</p>
                    </div>
                 </div>

                 <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-slate-400" />
                    </div>
                    <div className="text-left">
                       <p className="text-[10px] font-black uppercase tracking-widest text-white">{formatDate(post.createdAt)}</p>
                       <p className="text-[10px] text-slate-500 uppercase tracking-widest">Published</p>
                    </div>
                 </div>

                 <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                      <Clock className="w-4 h-4 text-slate-400" />
                    </div>
                    <div className="text-left">
                       <p className="text-[10px] font-black uppercase tracking-widest text-white">{post.readTime || '5 min'}</p>
                       <p className="text-[10px] text-slate-500 uppercase tracking-widest">Read Time</p>
                    </div>
                 </div>
              </motion.div>
           </div>

           {/* Breadcrumb back */}
           <div className="absolute top-40 left-12 z-20 hidden lg:block">
             <Link 
               to="/blog" 
               className="group flex flex-col items-center space-y-4"
             >
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-accent transition-colors bg-navy-dark/40 backdrop-blur-xl">
                  <ChevronLeft className="w-5 h-5 text-white" />
                </div>
                <span className="text-[8px] font-black uppercase tracking-[0.4em] text-white/50 vertical-text group-hover:text-accent transition-colors">Go Back</span>
             </Link>
           </div>
        </section>

        {/* Content Section */}
        <section className="relative py-24 px-6">
           <div className="max-w-4xl mx-auto">
              <div className="relative">
                 {/* Floating Actions Sidebar */}
                 <div className="absolute -left-24 top-0 hidden xl:flex flex-col space-y-6">
                    <button className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 hover:text-accent hover:border-accent transition-all">
                      <Bookmark className="w-5 h-5" />
                    </button>
                    <button className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 hover:text-accent hover:border-accent transition-all">
                      <Share2 className="w-5 h-5" />
                    </button>
                    <button className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 hover:text-accent hover:border-accent transition-all">
                      <MessageSquare className="w-5 h-5" />
                    </button>
                 </div>

                 <div className="prose prose-invert prose-cyan max-w-none">
                    <div className="markdown-body blog-content text-slate-300">
                      <ReactMarkdown>{post.content}</ReactMarkdown>
                    </div>
                 </div>

                 {/* Tags */}
                 {post.tags && (
                   <div className="mt-20 pt-12 border-t border-white/5">
                      <div className="flex flex-wrap gap-3">
                         {post.tags.map((tag: string) => (
                           <span key={tag} className="px-5 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-accent hover:border-accent transition-all pointer-events-none">
                             #{tag}
                           </span>
                         ))}
                      </div>
                   </div>
                 )}
              </div>
           </div>
        </section>

        {/* Next Post CTA */}
        <section className="py-24 px-6 border-t border-white/5">
           <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="flex flex-col">
                 <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-4">Read Next</span>
                 <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter">Everything comes <br /> together here.</h2>
              </div>
              
              <Link to="/blog" className="group flex items-center space-x-6 p-2 pr-10 bg-white/[0.03] border border-white/10 rounded-full backdrop-blur-xl">
                 <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center group-hover:bg-accent transition-colors duration-500">
                    <ArrowRight className="w-6 h-6 text-navy-dark" />
                 </div>
                 <span className="text-white font-black uppercase tracking-widest text-sm">View Archive</span>
              </Link>
           </div>
        </section>
      </article>
    </Layout>
  );
};

