import React from 'react';
import { motion } from 'motion/react';
import { Layout } from '../components/Layout';
import { 
  Code, 
  Palette, 
  Monitor, 
  Database, 
  Cpu, 
  Globe, 
  Zap, 
  Video, 
  ArrowUpRight,
  Search,
  MessageSquare,
  Sparkles,
  ArrowRight
} from 'lucide-react';

const services = [
  {
    title: "Full-Stack Web Development",
    description: "Custom modern web applications built with scalable architecture, clean code, and high performance.",
    icon: <Code className="w-6 h-6 text-accent" />,
    delay: 0.1
  },
  {
    title: "UI/UX Design",
    description: "Modern user interfaces and smooth digital experiences crafted with futuristic design principles.",
    icon: <Palette className="w-6 h-6 text-accent" />,
    delay: 0.2
  },
  {
    title: "Frontend Development",
    description: "Interactive responsive frontend systems using React, Next.js, animations, and modern frameworks.",
    icon: <Monitor className="w-6 h-6 text-accent" />,
    delay: 0.3
  },
  {
    title: "Backend Development",
    description: "Secure APIs, authentication systems, database management, and scalable backend infrastructure.",
    icon: <Database className="w-6 h-6 text-accent" />,
    delay: 0.4
  },
  {
    title: "AI Automation & Bots",
    description: "Smart automation systems, AI integrations, Discord bots, and workflow optimization tools.",
    icon: <Cpu className="w-6 h-6 text-accent" />,
    delay: 0.5
  },
  {
    title: "Portfolio Website Design",
    description: "Luxury personal portfolio websites with cinematic visuals and interactive user experience.",
    icon: <Globe className="w-6 h-6 text-accent" />,
    delay: 0.6
  },
  {
    title: "Technical SEO & Optimization",
    description: "Performance optimization, accessibility improvements, and advanced technical SEO strategies.",
    icon: <Zap className="w-6 h-6 text-accent" />,
    delay: 0.7
  },
  {
    title: "Motion Graphics & Editing",
    description: "Professional video editing, motion graphics, cinematic transitions, and VFX production.",
    icon: <Video className="w-6 h-6 text-accent" />,
    delay: 0.8
  }
];

const processes = [
  { id: "01", title: "Planning", description: "Deep analysis of your needs and strategy formulation for technical success." },
  { id: "02", title: "Design", description: "Crafting a visual identity and user experience that aligns with your brand." },
  { id: "03", title: "Development", description: "Translating designs into high-quality, performant, and scalable code." },
  { id: "04", title: "Launch", description: "Rigorous testing and deployment to ensure a flawless user experience." }
];

const techStack = {
  frontend: ["React", "Next.js", "Tailwind CSS", "TypeScript", "Framer Motion", "Shadcn UI"],
  backend: ["Node.js", "Express", "Firebase", "PostgreSQL", "MongoDB", "Prisma"],
  design: ["Figma", "Adobe Photoshop", "Premiere Pro", "After Effects", "Blender"]
};

export const Services = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-40 pb-24 px-6 relative overflow-hidden">
        <div className="grid-overlay absolute inset-0 opacity-10 pointer-events-none" />
        
        {/* Animated Background Lights */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-accent/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] animate-pulse-slow" />

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-accent/5 border border-accent/20 mb-8"
          >
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">Digital Services</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-none"
          >
            Building Modern <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-blue-500 italic font-serif">Digital Experiences</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            I create futuristic websites, scalable web applications, premium UI systems, and intelligent automation solutions tailored for the 2026 digital era.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col md:flex-row items-center justify-center gap-6"
          >
            <button className="px-10 py-5 bg-accent text-navy-dark font-black rounded-full hover:bg-white hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(34,211,238,0.3)]">
              View Portfolio
            </button>
            <button className="px-10 py-5 bg-white/5 border border-white/10 text-white font-black rounded-full hover:bg-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-md">
              Contact Me
            </button>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-32 px-6 bg-navy-dark/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: service.delay }}
                className="group p-10 glass rounded-[40px] hover:border-accent/30 hover:bg-white/[0.07] transition-all duration-500 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl group-hover:bg-accent/10 transition-colors" />
                
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                    {service.icon}
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-4 tracking-tight group-hover:text-accent transition-colors">
                    {service.title}
                  </h3>
                  
                  <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-sm">
                    {service.description}
                  </p>

                  <div className="flex justify-end">
                    <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-accent group-hover:border-accent transition-all duration-500 cursor-pointer">
                      <ArrowUpRight className="w-5 h-5 text-slate-500 group-hover:text-navy-dark transition-colors" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-6xl font-black mb-4">My Workflow</h2>
            <div className="w-24 h-1 bg-accent mx-auto rounded-full" />
          </motion.div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/5 hidden lg:block" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {processes.map((process, index) => (
                <motion.div
                  key={process.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glass p-8 rounded-[32px] relative z-10 hover:border-accent/50 transition-colors group"
                >
                  <p className="text-5xl font-black text-accent/20 mb-6 group-hover:text-accent/40 transition-colors">
                    {process.id}
                  </p>
                  <h4 className="text-xl font-bold mb-4 text-white uppercase tracking-wider">{process.title}</h4>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    {process.description}
                  </p>
                  
                  {/* Glow Connector */}
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-accent blur-sm opacity-0 group-hover:opacity-100 transition-opacity hidden lg:block" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-32 px-6 bg-navy-dark/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter">Powered by Modern Technology</h2>
          </div>

          <div className="space-y-12">
            {Object.entries(techStack).map(([category, tools], catIndex) => (
              <div key={category} className="space-y-6">
                <p className="text-[10px] uppercase tracking-[0.3em] font-black text-accent text-center">
                  {category} Stack
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  {tools.map((tool, index) => (
                    <motion.div
                      key={tool}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: (catIndex * 0.2) + (index * 0.05) }}
                      className="px-6 py-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-accent/40 hover:bg-white/[0.08] transition-all cursor-default"
                    >
                      <span className="text-sm font-bold text-slate-400 hover:text-white transition-colors">{tool}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-accent/5 pointer-events-none" />
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12 relative z-10">
          <div className="max-w-xl text-center md:text-left">
            <h2 className="text-5xl md:text-8xl font-black text-white leading-tight mb-8">
              Let's build something <br />
              <span className="text-slate-600 italic font-serif">futuristic</span> together.
            </h2>
            <p className="text-slate-400 text-lg">
              Available for freelance projects, collaborations, and modern web experiences.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group flex items-center space-x-6 bg-white/[0.03] border border-white/10 hover:border-accent/50 p-6 pl-10 rounded-full transition-all backdrop-blur-xl"
          >
            <span className="text-white font-black uppercase tracking-widest text-lg">Start a Project</span>
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center group-hover:bg-accent transition-colors duration-500">
              <ArrowRight className="w-6 h-6 text-navy-dark" />
            </div>
          </motion.button>
        </div>
        
        {/* Floating Background Particles */}
        <div className="absolute top-1/2 left-1/4 w-2 h-2 rounded-full bg-accent/40 animate-float" />
        <div className="absolute top-1/3 right-1/4 w-3 h-3 rounded-full bg-blue-500/30 animate-float-delayed" />
      </section>
    </Layout>
  );
};

export default Services;
