import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Layout } from '../components/Layout';
import { motion } from 'motion/react';
import { ChevronLeft, ExternalLink, Github, Layers, Globe, Code } from 'lucide-react';
import { localFallbackProjects } from '../constants/projects';

export const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;

      // First check local fallback data
      const localProj = localFallbackProjects.find(p => p.id === id);
      if (localProj) {
        setProject(localProj);
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(db, 'projects', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProject({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (err) {
        console.error("Error fetching project:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
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

  if (!project) {
    return (
      <Layout>
        <div className="min-h-screen flex flex-col items-center justify-center px-6">
          <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
          <Link to="/#portfolio" className="text-accent font-bold hover:underline">Back to Portfolio</Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="pt-40 pb-24 px-6 relative">
        <div className="grid-overlay absolute inset-0 opacity-10 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <Link to="/#portfolio" className="inline-flex items-center text-[10px] uppercase tracking-widest font-bold text-slate-500 hover:text-white mb-12 transition-colors group">
            <ChevronLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Projects
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-24">
            <div>
              <span className="inline-block px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-bold border border-accent/30 text-accent rounded-full bg-accent/5 mb-6">
                {project.category}
              </span>
              <h1 className="text-6xl md:text-8xl font-black mb-8 leading-[0.9] tracking-tighter">
                {project.title}
              </h1>
              <p className="text-xl text-slate-400 mb-12 leading-relaxed">
                {project.description}
              </p>

              <div className="grid grid-cols-2 gap-8 mb-12">
                <InfoItem label="Client" value="Confidential" />
                <InfoItem label="Role" value={project.category} />
                <InfoItem label="Duration" value="3 Months" />
                <InfoItem label="Tech Stack" value="React, Firebase, Tailwind" />
              </div>

              <div className="flex gap-4">
                {project.projectUrl && (
                  <a href={project.projectUrl} target="_blank" rel="noreferrer" className="px-8 py-4 bg-white text-navy-dark font-bold rounded-2xl flex items-center space-x-3 hover:bg-accent transition-all">
                    <span>Live Preview</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noreferrer" className="px-8 py-4 bg-slate-900 border border-slate-800 text-white font-bold rounded-2xl hover:border-accent transition-all">
                    <span>GitHub</span>
                    <Github className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>

            <div className="glass rounded-[40px] overflow-hidden border border-white/5 relative group">
              <img 
                src={project.imageUrl} 
                alt={project.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </div>

          {/* Abstract Sections */}
          <div className="space-y-32">
            <ProjectSection 
              title="Problem" 
              icon={<Globe className="text-blue-500" />}
              content="Every project starts with a challenge. In this case, the goal was to create a seamless user experience that balances high performance with high aesthetic value. The challenge was ensuring responsiveness across all devices while maintaining complex animations."
            />
            <ProjectSection 
              title="Solution" 
              icon={<Code className="text-accent" />}
              content="Using a modern tech stack centered around React and Framer Motion, I implemented a custom animation system that performs efficiently on mobile. The integration with Firebase allowed for real-time data management and secure authentication for users."
            />
            <ProjectSection 
              title="Impact" 
              icon={<Layers className="text-purple-500" />}
              content="The final result is a futuristic digital experience that has increased user engagement and received positive feedback for its intuitive navigation and premium aesthetics."
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

const InfoItem = ({ label, value }: { label: string, value: string }) => (
  <div>
    <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">{label}</p>
    <p className="text-lg font-bold">{value}</p>
  </div>
);

const ProjectSection = ({ title, content, icon }: { title: string, content: string, icon: React.ReactNode }) => (
  <div className="grid grid-cols-1 md:grid-cols-[100px_1fr] gap-12 group">
    <div className="pt-2">
      <div className="w-16 h-16 glass rounded-2xl flex items-center justify-center group-hover:neon-glow transition-all">
        {icon}
      </div>
    </div>
    <div>
      <h2 className="text-4xl font-black mb-8 tracking-tighter italic font-serif">/{title}</h2>
      <p className="text-xl text-slate-400 leading-relaxed max-w-4xl">
        {content}
      </p>
    </div>
  </div>
);
