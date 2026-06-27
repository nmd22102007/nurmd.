import React from 'react';
import { motion } from 'motion/react';
import { Layout } from '../components/Layout';
import { 
  Code, 
  Layers, 
  Wind, 
  Cpu, 
  Database, 
  Server, 
  Flame, 
  Box, 
  Terminal, 
  Figma, 
  Github, 
  Image, 
  Video, 
  Zap, 
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  Smartphone,
  HardDrive
} from 'lucide-react';

const tools = [
  {
    name: "React",
    description: "My primary frontend library for building interactive and high-performance user interfaces.",
    icon: <Code className="w-6 h-6 text-accent" />,
    delay: 0.1
  },
  {
    name: "Next.js",
    description: "The modern full-stack React framework I use for scalable and optimized web applications.",
    icon: <Zap className="w-6 h-6 text-accent" />,
    delay: 0.15
  },
  {
    name: "Tailwind CSS",
    description: "My preferred utility-first CSS framework for creating responsive modern UI systems.",
    icon: <Wind className="w-6 h-6 text-accent" />,
    delay: 0.2
  },
  {
    name: "TypeScript",
    description: "I use TypeScript to build scalable applications with cleaner structure and safer development.",
    icon: <Terminal className="w-6 h-6 text-accent" />,
    delay: 0.25
  },
  {
    name: "Node.js",
    description: "The backend runtime environment I use for APIs, servers, and scalable applications.",
    icon: <Server className="w-6 h-6 text-accent" />,
    delay: 0.3
  },
  {
    name: "Express.js",
    description: "A lightweight backend framework I use for building fast REST APIs and server-side systems.",
    icon: <Cpu className="w-6 h-6 text-accent" />,
    delay: 0.35
  },
  {
    name: "Firebase",
    description: "My go-to backend platform for authentication, databases, hosting, and realtime services.",
    icon: <Flame className="w-6 h-6 text-accent" />,
    delay: 0.4
  },
  {
    name: "MongoDB",
    description: "A flexible NoSQL database solution I use for modern scalable applications.",
    icon: <Database className="w-6 h-6 text-accent" />,
    delay: 0.45
  },
  {
    name: "MySQL",
    description: "I use MySQL for structured relational database systems and secure data management.",
    icon: <HardDrive className="w-6 h-6 text-accent" />,
    delay: 0.5
  },
  {
    name: "Framer Motion",
    description: "My preferred animation library for smooth interactions and cinematic frontend motion.",
    icon: <Layers className="w-6 h-6 text-accent" />,
    delay: 0.55
  },
  {
    name: "Figma",
    description: "The UI/UX design platform I use for wireframes, interface design, and prototyping.",
    icon: <Figma className="w-6 h-6 text-accent" />,
    delay: 0.6
  },
  {
    name: "VS Code",
    description: "My main development environment for coding, debugging, and project management.",
    icon: <Box className="w-6 h-6 text-accent" />,
    delay: 0.65
  },
  {
    name: "GitHub",
    description: "I use GitHub for version control, collaboration, deployment workflows, and project hosting.",
    icon: <Github className="w-6 h-6 text-accent" />,
    delay: 0.7
  },
  {
    name: "Photoshop",
    description: "My creative software for editing graphics, thumbnails, and visual design assets.",
    icon: <Image className="w-6 h-6 text-accent" />,
    delay: 0.75
  },
  {
    name: "Premiere Pro",
    description: "The professional editing software I use for video production and cinematic editing.",
    icon: <Video className="w-6 h-6 text-accent" />,
    delay: 0.8
  },
  {
    name: "After Effects",
    description: "My motion graphics and VFX software for animations, transitions, and advanced effects.",
    icon: <Sparkles className="w-6 h-6 text-accent" />,
    delay: 0.85
  }
];

export const Tools = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-40 pb-24 px-6 relative overflow-hidden">
        <div className="grid-overlay absolute inset-0 opacity-10 pointer-events-none" />
        
        {/* Animated Background Lights */}
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-accent/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] animate-pulse-slow" />

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-accent/5 border border-accent/20 mb-8"
          >
            <Cpu className="w-4 h-4 text-accent" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">My Development Stack</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-9xl font-black tracking-tighter mb-8 leading-none text-white"
          >
            Toolkit<span className="text-accent">.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            The modern technologies, frameworks, and software I use to build futuristic digital experiences.
          </motion.p>
          
          <div className="w-40 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent mx-auto" />
        </div>
      </section>

      {/* Tools List section */}
      <section className="py-24 px-6 relative">
        <div className="max-w-5xl mx-auto space-y-6">
          {tools.map((tool) => (
            <motion.div
              key={tool.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: tool.delay }}
              className="group glass p-8 rounded-[32px] hover:border-accent/40 hover:bg-white/[0.05] transition-all duration-500 relative overflow-hidden flex items-center justify-between"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl group-hover:bg-accent/10 transition-colors" />
              
              <div className="flex items-center space-x-8 relative z-10">
                <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:border-accent/30 transition-all duration-500">
                  {tool.icon}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2 tracking-tight group-hover:text-accent transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed max-w-md">
                    {tool.description}
                  </p>
                </div>
              </div>

              <div className="relative z-10">
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-accent group-hover:border-accent transition-all duration-500 cursor-pointer">
                  <ArrowUpRight className="w-5 h-5 text-slate-500 group-hover:text-navy-dark transition-colors" />
                </div>
              </div>
              
              {/* Subtle hover glow accent */}
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-accent/0 to-transparent group-hover:via-accent/50 transition-all duration-700" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Development Philosophy Section */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="glass p-12 md:p-20 rounded-[60px] text-center relative overflow-hidden">
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-accent/10 rounded-full blur-[80px]" />
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px]" />
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative z-10"
            >
              <h2 className="text-4xl md:text-6xl font-black text-white mb-8">Why These Tools?</h2>
              <p className="text-slate-400 text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed font-medium">
                "I focus on modern technologies that deliver speed, scalability, premium user experience, and futuristic digital interaction."
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
                {[
                  { label: "Performance", value: "100%" },
                  { label: "Scalability", value: "Ready" },
                  { label: "Design", value: "Premium" },
                  { label: "Motion", value: "Cinematic" }
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="p-6 bg-white/5 border border-white/10 rounded-2xl"
                  >
                    <p className="text-accent font-black text-2xl mb-1">{stat.value}</p>
                    <p className="text-[10px] uppercase tracking-widest font-black text-slate-500">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-accent/5 pointer-events-none" />
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12 relative z-10">
          <div className="max-w-xl text-center md:text-left">
            <h2 className="text-5xl md:text-8xl font-black text-white leading-tight mb-8">
              Let's build the <br />
              <span className="text-slate-600 italic font-serif">future</span> together.
            </h2>
            <p className="text-slate-400 text-lg">
              Available for freelance projects, modern web applications, and creative collaborations.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group flex items-center space-x-6 bg-white/[0.03] border border-white/10 hover:border-accent/50 p-6 pl-10 rounded-full transition-all backdrop-blur-xl"
          >
            <span className="text-white font-black uppercase tracking-widest text-lg">Contact Me</span>
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

export default Tools;
