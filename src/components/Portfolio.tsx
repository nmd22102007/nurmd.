import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { ExternalLink, Github, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

import { localFallbackProjects } from '../constants/projects';

const categories = ["All", "Web Design", "Full Stack", "UI/UX", "AI Tools"];

export const Portfolio = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const projectsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        if (projectsData.length > 0) {
          setProjects(projectsData);
        } else {
          setProjects(localFallbackProjects);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
        setProjects(localFallbackProjects);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const filteredProjects = filter === "All" 
    ? projects 
    : projects.filter(p => p.category === filter);

  return (
    <section id="portfolio" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
          <div>
            <h2 className="text-4xl md:text-6xl font-bold mb-4">Portfolio</h2>
            <div className="h-1 w-20 bg-accent" />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-5 py-2.5 rounded-2xl text-[10px] uppercase tracking-[0.2em] font-bold transition-all duration-300 ${
                  filter === cat 
                    ? "bg-accent text-navy-dark shadow-[0_0_15px_rgba(34,211,238,0.3)]" 
                    : "bg-white/5 border border-white/10 text-slate-500 hover:text-white hover:bg-white/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
        >
          <AnimatePresence mode="popLayout">
            {loading ? (
              Array.from({ length: 3 }).map((_, idx) => (
                <ProjectCardSkeleton key={`skeleton-${idx}`} />
              ))
            ) : (
              filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))
            )}
          </AnimatePresence>
        </motion.div>

        {!loading && filteredProjects.length === 0 && (
          <div className="text-center py-24 glass rounded-3xl">
            <p className="text-gray-400">No projects found in this category.</p>
          </div>
        )}
      </div>
    </section>
  );
};

const ProjectCardSkeleton = () => (
  <div className="glass rounded-[40px] overflow-hidden animate-pulse border border-white/5">
    <div className="aspect-[16/10] bg-white/[0.03]" />
    <div className="p-8 space-y-4">
      <div className="flex justify-between items-center">
        <div className="h-3 w-20 bg-white/[0.04] rounded" />
        <div className="h-4 w-4 bg-white/[0.04] rounded-full" />
      </div>
      <div className="h-6 w-3/4 bg-white/[0.05] rounded-lg animate-pulse" />
      <div className="space-y-2">
        <div className="h-3 w-full bg-white/[0.03] rounded" />
        <div className="h-3 w-5/6 bg-white/[0.03] rounded" />
      </div>
      <div className="h-3 w-24 bg-white/[0.04] rounded pt-2" />
    </div>
  </div>
);

const ProjectCard = ({ project }: { project: any }) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    transition={{ duration: 0.4 }}
    className="group relative glass rounded-[40px] overflow-hidden hover:border-accent/30 transition-all duration-500"
  >
    <div className="aspect-[16/10] overflow-hidden bg-slate-900">
      <img 
        src={project.imageUrl} 
        alt={project.title} 
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100"
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
      />
    </div>
    
    <div className="p-8">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] font-bold text-accent uppercase tracking-[0.2em]">{project.category}</span>
        <div className="flex space-x-3">
          {project.githubUrl && <a href={project.githubUrl} className="text-slate-500 hover:text-white transition-colors"><Github className="w-4 h-4" /></a>}
          {project.projectUrl && <a href={project.projectUrl} className="text-slate-500 hover:text-white transition-colors"><ExternalLink className="w-4 h-4" /></a>}
        </div>
      </div>
      
      <h3 className="text-2xl font-black mb-4 tracking-tighter">{project.title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed mb-8 line-clamp-2">
        {project.description}
      </p>
      
      <Link to={`/project/${project.id}`} className="text-[10px] uppercase tracking-widest font-black flex items-center hover:text-accent transition-colors group/link">
        Read Case Study <span className="ml-2 group-hover/link:translate-x-1 transition-transform">→</span>
      </Link>
    </div>
  </motion.div>
);
