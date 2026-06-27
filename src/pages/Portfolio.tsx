import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Layout } from '../components/Layout';
import { 
  ExternalLink, 
  Github, 
  Search, 
  ArrowRight, 
  LayoutGrid, 
  Code2, 
  Sparkles, 
  Globe, 
  Cpu, 
  PenTool,
  ArrowUpRight 
} from 'lucide-react';

const categories = ["All", "Web Apps", "UI/UX", "AI", "Dashboard", "Creative"];

const projects = [
  {
    id: 1,
    title: "TECHMDBD",
    category: "Web Apps",
    description: "A futuristic Bangladeshi tech platform for PC building, product comparison, and technology content.",
    tech: ["Next.js", "Tailwind CSS", "Firebase", "MongoDB"],
    image: "https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&q=80&w=1000",
    link: "#",
    github: "#",
    delay: 0.1
  },
  {
    id: 2,
    title: "AI Chat Application",
    category: "AI",
    description: "A modern AI-powered chat platform with futuristic UI and intelligent automation features.",
    tech: ["React", "Node.js", "OpenAI API"],
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000",
    link: "#",
    github: "#",
    delay: 0.2
  },
  {
    id: 3,
    title: "Portfolio Website",
    category: "UI/UX",
    description: "A cinematic personal portfolio with smooth animations and luxury futuristic design.",
    tech: ["Next.js", "Framer Motion", "Tailwind CSS"],
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=1000",
    link: "#",
    github: "#",
    delay: 0.3
  },
  {
    id: 4,
    title: "Minecraft Server Dashboard",
    category: "Dashboard",
    description: "A custom server management dashboard for Minecraft hosting and real-time server control.",
    tech: ["React", "Firebase", "Express.js"],
    image: "https://images.unsplash.com/photo-1587573089734-09cb9444476a?auto=format&fit=crop&q=80&w=1000",
    link: "#",
    github: "#",
    delay: 0.4
  },
  {
    id: 5,
    title: "ESP8266 WiFi Control Panel",
    category: "Dashboard",
    description: "A smart WiFi management interface for ESP8266 devices with modern responsive UI.",
    tech: ["HTML", "CSS", "JavaScript"],
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1000",
    link: "#",
    github: "#",
    delay: 0.5
  },
  {
    id: 6,
    title: "AI Automation System",
    category: "AI",
    description: "An intelligent workflow automation system with chatbot integration and task management.",
    tech: ["Node.js", "Firebase", "AI APIs"],
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1000",
    link: "#",
    github: "#",
    delay: 0.6
  },
  {
    id: 7,
    title: "E-Commerce UI Concept",
    category: "Creative",
    description: "A premium futuristic shopping interface concept with luxury minimal aesthetics.",
    tech: ["Figma", "React", "Tailwind"],
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1000",
    link: "#",
    github: "#",
    delay: 0.7
  },
  {
    id: 8,
    title: "Admin Dashboard",
    category: "Dashboard",
    description: "A modern admin dashboard with analytics, charts, authentication, and responsive layouts.",
    tech: ["Next.js", "Chart.js", "Firebase"],
    image: "https://images.unsplash.com/photo-1551288049-bbbda536639a?auto=format&fit=crop&q=80&w=1000",
    link: "#",
    github: "#",
    delay: 0.8
  }
];

export const Portfolio = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProjects = projects.filter(project => 
    activeCategory === "All" || project.category === activeCategory
  );

  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-40 pb-24 px-6 relative overflow-hidden">
        <div className="grid-overlay absolute inset-0 opacity-10 pointer-events-none" />
        
        {/* Animated Background Lights */}
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-accent/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] animate-pulse-slow" />

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-end justify-between gap-12 relative z-10">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-accent/5 border border-accent/20 mb-8"
            >
              <LayoutGrid className="w-4 h-4 text-accent" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">My Creative Work</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-9xl font-black tracking-tighter mb-8 leading-none text-white"
            >
              Projects<span className="text-accent text-outline">.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-slate-400 text-lg md:text-xl leading-relaxed"
            >
              A curated collection of modern websites, AI systems, futuristic interfaces, and creative digital experiences.
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-2"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 border ${
                  activeCategory === cat 
                    ? "bg-accent text-navy-dark border-accent" 
                    : "bg-white/5 text-slate-500 border-white/10 hover:border-white/30 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </motion.div>
        </div>

        <div className="max-w-7xl mx-auto mt-16 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </section>

      {/* Portfolio Grid */}
      <section className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5 }}
                  className="group relative"
                >
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[40px] glass border border-white/5 group-hover:border-accent/40 transition-all duration-700">
                    {/* Project Image */}
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-navy-dark/80 opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-md flex flex-col justify-between p-10 translate-y-4 group-hover:translate-y-0">
                      <div>
                        <div className="flex flex-wrap gap-2 mb-6">
                          {project.tech.map(t => (
                            <span key={t} className="text-[10px] font-black uppercase tracking-widest text-accent/80 px-3 py-1 rounded-full bg-accent/5 border border-accent/20">
                              {t}
                            </span>
                          ))}
                        </div>
                        <h3 className="text-3xl font-black text-white mb-4 leading-tight">
                          {project.title}
                        </h3>
                        <p className="text-slate-400 text-sm leading-relaxed mb-8">
                          {project.description}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <motion.a
                          href={project.link}
                          whileHover={{ scale: 1.05 }}
                          className="flex-1 px-6 py-4 bg-white text-navy-dark font-black rounded-2xl text-xs uppercase tracking-widest text-center hover:bg-accent transition-colors"
                        >
                          Live Preview
                        </motion.a>
                        <motion.a
                          href={project.github}
                          whileHover={{ scale: 1.05 }}
                          className="w-14 h-14 bg-white/10 border border-white/10 rounded-2xl flex items-center justify-center hover:border-accent group/btn transition-all"
                        >
                          <Github className="w-5 h-5 text-white group-hover/btn:text-accent transition-colors" />
                        </motion.a>
                      </div>
                    </div>

                    {/* Corner Indicator (Arrow) - Visible when not hovered */}
                    <div className="absolute bottom-10 right-10 w-12 h-12 rounded-full glass border border-white/20 flex items-center justify-center group-hover:opacity-0 transition-opacity duration-300">
                      <ArrowUpRight className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Creative Process Section */}
      <section className="py-32 px-6 relative overflow-hidden bg-navy-dark/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-24"
          >
            <h2 className="text-4xl md:text-6xl font-black mb-4">How I Build Projects</h2>
            <div className="w-24 h-1 bg-accent mx-auto rounded-full" />
          </motion.div>

          <div className="relative">
            {/* Horizontal Timeline Line */}
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/5 hidden lg:block" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 relative z-10">
              {[
                { step: "01", title: "Research", icon: <Search className="w-4 h-4 text-accent" /> },
                { step: "02", title: "Planning", icon: <LayoutGrid className="w-4 h-4 text-accent" /> },
                { step: "03", title: "Design", icon: <PenTool className="w-4 h-4 text-accent" /> },
                { step: "04", title: "Development", icon: <Code2 className="w-4 h-4 text-accent" /> },
                { step: "05", title: "Optimization", icon: <Cpu className="w-4 h-4 text-accent" /> },
                { step: "06", title: "Launch", icon: <Globe className="w-4 h-4 text-accent" /> }
              ].map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glass p-8 rounded-3xl group hover:border-accent/40 transition-all duration-500"
                >
                  <div className="w-10 h-10 rounded-full bg-accent/5 border border-accent/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <p className="text-xs font-black text-accent uppercase tracking-widest mb-2 opacity-50">{item.step}</p>
                  <h4 className="text-lg font-bold text-white tracking-tight">{item.title}</h4>
                  
                  {/* Glow Connector Connector */}
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-accent blur-sm opacity-0 group-hover:opacity-100 transition-opacity hidden lg:block" />
                </motion.div>
              ))}
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

export default Portfolio;
