import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Link } from 'react-router-dom';
import { formatDate } from '../lib/utils';
import { Clock, ChevronRight } from 'lucide-react';

import { categories, mockBlogPosts } from '../constants/blog';

const BlogCardSkeleton = () => (
  <div className="glass rounded-[32px] overflow-hidden flex flex-col animate-pulse border border-white/5">
    <div className="aspect-[16/10] bg-white/[0.03]" />
    <div className="p-8 space-y-4">
      <div className="flex space-x-4">
        <div className="h-3 w-16 bg-white/[0.04] rounded" />
        <div className="h-3 w-12 bg-white/[0.04] rounded" />
      </div>
      <div className="h-6 w-5/6 bg-white/[0.05] rounded-lg animate-pulse" />
      <div className="h-6 w-2/3 bg-white/[0.05] rounded-lg animate-pulse" />
      <div className="pt-4">
        <div className="h-4 w-24 bg-white/[0.04] rounded" />
      </div>
    </div>
  </div>
);

export const BlogSection = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const q = query(collection(db, 'blog'), orderBy('createdAt', 'desc'), limit(3));
        const querySnapshot = await getDocs(q);
        const fetched = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        if (fetched.length > 0) {
          setPosts(fetched);
        } else {
          setPosts(mockBlogPosts.slice(0, 3));
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        setPosts(mockBlogPosts.slice(0, 3));
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-16">
          <div>
            <h2 className="text-4xl md:text-6xl font-bold mb-4">Blog</h2>
            <div className="h-1 w-20 bg-accent" />
          </div>
          <Link to="/blog" className="text-gray-400 hover:text-accent font-bold transition-colors">
            View All Posts
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            Array.from({ length: 3 }).map((_, idx) => (
              <BlogCardSkeleton key={`blog-skeleton-${idx}`} />
            ))
          ) : (
            posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group glass rounded-[32px] overflow-hidden flex flex-col"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img 
                    src={post.thumbnailUrl || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80'} 
                    alt={post.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-8 flex-grow flex flex-col">
                  <div className="flex items-center space-x-4 text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">
                    <span>{formatDate(post.createdAt)}</span>
                    <span>•</span>
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      <span>{post.readTime || '5 min'} read</span>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-6 group-hover:text-accent transition-colors leading-tight">
                    {post.title}
                  </h3>
                  
                  <div className="mt-auto">
                    <Link to={`/blog/${post.id}`} className="inline-flex items-center text-sm font-bold group-hover:translate-x-2 transition-transform">
                      <span>Read Article</span>
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};
