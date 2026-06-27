import React from 'react';
import { motion } from 'motion/react';
import { Palette, Code, Terminal, Zap, Globe, Smartphone, BarChart, Shield } from 'lucide-react';

const services = [
  {
    title: "UI/UX Design",
    description: "Creating visually stunning and highly intuitive user interfaces that convert users into loyal customers.",
    icon: <Palette className="w-8 h-8 text-accent" />
  },
  {
    title: "Web Development",
    description: "Building high-performance, responsive websites using modern frameworks like React and Next.js.",
    icon: <Code className="w-8 h-8 text-accent" />
  },
  {
    title: "AI Integration",
    description: "Automating workflows and enhancing user experiences with cutting-edge AI tools and LLMs.",
    icon: <Terminal className="w-8 h-8 text-accent" />
  },
  {
    title: "Performance Optimization",
    description: "Speed is a feature. I optimize every line of code to ensure lightning-fast load times.",
    icon: <Zap className="w-8 h-8 text-accent" />
  }
];

export const Services = () => {
  return (
    <section id="services" className="py-24 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <h2 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tighter">Services</h2>
          <div className="h-0.5 w-24 bg-accent" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group p-8 glass rounded-[40px] hover:border-accent/50 hover:bg-white/10 transition-all duration-500 flex flex-col justify-between"
            >
              <div>
                <div className="p-4 bg-accent/10 rounded-[20px] w-fit mb-8 group-hover:scale-110 transition-transform">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold mb-4 tracking-tight">{service.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {service.description}
                </p>
              </div>
              
              <div className="mt-8 flex items-center text-accent text-[10px] uppercase tracking-[0.2em] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Experience more</span>
                <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
