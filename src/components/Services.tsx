import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import * as Icons from 'lucide-react';
import { db } from '../lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { Link } from 'react-router-dom';

interface ServiceItem {
  title: string;
  description: string;
  iconName: string;
  link?: string;
}

const DEFAULT_SERVICES: ServiceItem[] = [
  {
    title: "UI/UX Design",
    description: "Creating visually stunning and highly intuitive user interfaces that convert users into loyal customers.",
    iconName: "Palette",
    link: ""
  },
  {
    title: "Web Development",
    description: "Building high-performance, responsive websites using modern frameworks like React and Next.js.",
    iconName: "Code",
    link: ""
  },
  {
    title: "AI Integration",
    description: "Automating workflows and enhancing user experiences with cutting-edge AI tools and LLMs.",
    iconName: "Terminal",
    link: ""
  },
  {
    title: "Performance Optimization",
    description: "Speed is a feature. I optimize every line of code to ensure lightning-fast load times.",
    iconName: "Zap",
    link: ""
  }
];

export const Services = () => {
  const [services, setServices] = useState<ServiceItem[]>(() => {
    const cached = localStorage.getItem('siteConfig_services');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        console.error("Error loading cached services on home page:", e);
      }
    }
    return DEFAULT_SERVICES;
  });

  useEffect(() => {
    const docRef = doc(db, 'siteConfig', 'services');
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (Array.isArray(data.services)) {
          setServices(data.services);
          localStorage.setItem('siteConfig_services', JSON.stringify(data.services));
        }
      }
    }, (err) => {
      console.error("Error subscribing to services configuration:", err);
    });
    return () => unsubscribe();
  }, []);

  return (
    <section id="services" className="py-24 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <h2 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tighter">Services</h2>
          <div className="h-0.5 w-24 bg-accent" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => {
            // Dynamically resolve Lucide Icon
            const IconComponent = (Icons as any)[service.iconName] || Icons.HelpCircle;
            const icon = <IconComponent className="w-8 h-8 text-accent" />;

            const isExternal = service.link ? (service.link.startsWith('http://') || service.link.startsWith('https://')) : false;

            const InnerContent = (
              <div className="flex flex-col h-full justify-between flex-grow w-full">
                <div>
                  <div className="p-4 bg-accent/10 rounded-[20px] w-fit mb-8 group-hover:scale-110 transition-transform">
                    {icon}
                  </div>
                  <h3 className="text-xl font-bold mb-4 tracking-tight">{service.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {service.description}
                  </p>
                </div>
                
                {service.link && (
                  <div className="mt-8 flex items-center text-accent text-[10px] uppercase tracking-[0.2em] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Experience more</span>
                    <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                )}
              </div>
            );

            return (
              <motion.div
                key={service.title + index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`group p-8 glass rounded-[40px] hover:border-accent/50 hover:bg-white/10 transition-all duration-500 flex flex-col justify-between ${service.link ? 'cursor-pointer' : ''}`}
              >
                {service.link ? (
                  isExternal ? (
                    <a href={service.link} target="_blank" rel="noopener noreferrer" className="flex flex-col h-full justify-between flex-grow w-full text-left">
                      {InnerContent}
                    </a>
                  ) : (
                    <Link to={service.link} className="flex flex-col h-full justify-between flex-grow w-full text-left">
                      {InnerContent}
                    </Link>
                  )
                ) : (
                  InnerContent
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
