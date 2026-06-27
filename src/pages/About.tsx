import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Layout } from '../components/Layout';
import { db } from '../lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { 
  Mail, 
  MapPin, 
  Phone, 
  ArrowRight, 
  Calendar, 
  Sparkles, 
  Briefcase 
} from 'lucide-react';

interface StatItem {
  value: string;
  label: string;
}

interface SkillItem {
  name: string;
  percentage: number;
}

interface TimelineItem {
  year: string;
  role: string;
  company: string;
  description: string;
}

interface AboutData {
  title: string;
  subtitle: string;
  imageUrl: string;
  heading: string;
  description1: string;
  description2: string;
  statistics: StatItem[];
  skills: SkillItem[];
  timeline: TimelineItem[];
  addressMain: string;
  addressSub: string;
  emailText: string;
  phone1: string;
  phone2: string;
  ctaHeadline: string;
  ctaButtonText: string;
  ctaButtonUrl: string;
}

const defaultData: AboutData = {
  title: 'About me',
  subtitle: 'A deeper look into my background, creative philosophy, and professional milestones.',
  imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80',
  heading: 'Crafting Digital Realities',
  description1: "I'm a passionate 3D artist focused on turning ideas into immersive digital experiences. From detailed modeling to realistic rendering, I create visuals that blend creativity with precision. My work reflects a strong dedication to storytelling, atmosphere, and high-quality craftsmanship.",
  description2: "I believe great design is built on both imagination and discipline. My workflow combines research, experimentation, and technical accuracy to deliver impactful results. Every project is an opportunity to push creative boundaries and bring concepts to life in compelling 3D form.",
  
  statistics: [
    { value: '5+', label: 'Years of experience' },
    { value: '+150', label: 'Successful projects' },
    { value: '+35', label: 'Happy clients' },
    { value: '98%', label: 'Overall satisfaction' }
  ],

  skills: [
    { name: 'UI/UX Design', percentage: 95 },
    { name: 'Frontend Engineering', percentage: 90 },
    { name: '3D & Motion UI', percentage: 85 },
    { name: 'Full-Stack Development', percentage: 80 }
  ],

  timeline: [
    { year: '2023 - Present', role: 'Lead Web Designer & Developer', company: 'Self-Employed / Freelance', description: 'Architecting high-end creative websites and design systems for global brands and venture startups.' },
    { year: '2021 - 2023', role: 'Senior UX UI Specialist', company: 'Apex Digital Agency', description: 'Spearheaded immersive design interactions and built high-performance responsive web environments.' },
    { year: '2019 - 2021', role: 'Junior Frontend Developer', company: 'Nova Soft BD', description: 'Gained absolute proficiency in modern JS/TS frameworks, responsive layout styling, and client satisfaction.' }
  ],

  addressMain: 'Dhaka, Bangladesh',
  addressSub: 'Ghatail, Tangail',
  emailText: 'contact@toxichome.top',
  phone1: '+880 13283-29322',
  phone2: '+880 17346-92372',

  ctaHeadline: "Let's connect there",
  ctaButtonText: "Let's Connect",
  ctaButtonUrl: "/contact"
};

// Scroll trigger counter component
const AnimatedCounter = ({ value }: { value: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [displayValue, setDisplayValue] = useState('0');

  useEffect(() => {
    if (!isInView) return;

    const numericMatch = value.match(/\d+/);
    if (!numericMatch) {
      setDisplayValue(value);
      return;
    }

    const targetNumber = parseInt(numericMatch[0], 10);
    const suffix = value.replace(numericMatch[0], '');
    const prefix = value.startsWith(numericMatch[0]) ? '' : value.substring(0, value.indexOf(numericMatch[0]));

    let start = 0;
    const duration = 1.2; 
    const fps = 60;
    const totalFrames = duration * fps;
    const increment = targetNumber / totalFrames;
    let frame = 0;

    const timer = setInterval(() => {
      frame++;
      start += increment;
      if (frame >= totalFrames) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(`${prefix}${Math.floor(start)}${suffix}`);
      }
    }, 1000 / fps);

    return () => clearInterval(timer);
  }, [value, isInView]);

  return <span ref={ref}>{displayValue}</span>;
};

export const About = () => {
  const [aboutData, setAboutData] = useState<AboutData>(defaultData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const docRef = doc(db, 'siteConfig', 'about');
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setAboutData({
          title: data.title || defaultData.title,
          subtitle: data.subtitle || defaultData.subtitle,
          imageUrl: data.imageUrl || defaultData.imageUrl,
          heading: data.heading || defaultData.heading,
          description1: data.description1 || defaultData.description1,
          description2: data.description2 || defaultData.description2,
          statistics: Array.isArray(data.statistics) ? data.statistics : defaultData.statistics,
          skills: Array.isArray(data.skills) ? data.skills : defaultData.skills,
          timeline: Array.isArray(data.timeline) ? data.timeline : defaultData.timeline,
          addressMain: data.addressMain || defaultData.addressMain,
          addressSub: data.addressSub || defaultData.addressSub,
          emailText: data.emailText || defaultData.emailText,
          phone1: data.phone1 || defaultData.phone1,
          phone2: data.phone2 || defaultData.phone2,
          ctaHeadline: data.ctaHeadline || defaultData.ctaHeadline,
          ctaButtonText: data.ctaButtonText || defaultData.ctaButtonText,
          ctaButtonUrl: data.ctaButtonUrl || defaultData.ctaButtonUrl,
        });
      }
      setLoading(false);
    }, (error) => {
      console.error("Error subscribing to about collection config:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <Layout>
      <div className="min-h-screen bg-navy-dark text-foreground relative font-sans selection:bg-accent/30 selection:text-accent-foreground pt-28 pb-16 overflow-hidden">
        {/* Abstract Glowing Accent Vector Bulbs */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-accent/5 blur-[200px] pointer-events-none" />
        <div className="absolute bottom-1/3 right-1/4 w-[600px] h-[600px] rounded-full bg-accent/[0.03] blur-[250px] pointer-events-none" />

        {/* 1. Header Centered Title Section */}
        <div className="max-w-4xl mx-auto text-center px-6 mb-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-accent/5 border border-accent/20 rounded-full mb-6"
          >
            <Sparkles className="w-4 h-4 text-accent animate-pulse" />
            <span className="text-[10px] uppercase tracking-widest font-mono text-accent font-bold">Creative Vision</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-8xl font-black tracking-tighter mb-6 bg-gradient-to-b from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent font-sans"
          >
            {aboutData.title}
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-muted-foreground text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed"
          >
            {aboutData.subtitle}
          </motion.p>
        </div>

        {/* 2. Hero Interactive Content Section */}
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center mb-28 relative z-10">
          {/* Left Large Border-Glow Rounded Image Column */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative group"
          >
            <div className="absolute inset-0 bg-accent/5 rounded-[48px] blur-3xl opacity-30 group-hover:opacity-60 transition-opacity duration-700 pointer-events-none" />
            
            <div className="relative aspect-[4/5] rounded-[48px] overflow-hidden border border-border hover:border-accent/40 transition-all duration-700 shadow-[0_30px_100px_rgba(0,0,0,0.6)]">
              <img 
                src={aboutData.imageUrl} 
                alt="Portrait presentation" 
                className="w-full h-full object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 pointer-events-none" />
            </div>
            
            {/* Ambient Label badge */}
            <div className="absolute -bottom-6 -right-4 bg-navy/90 border border-border shadow-[0_15px_30px_rgba(0,0,0,0.5)] py-4 px-6 rounded-3xl flex items-center gap-3 backdrop-blur-md">
              <span className="w-2.5 h-2.5 rounded-full bg-accent animate-ping" />
              <span className="text-[10px] font-mono tracking-widest text-muted-foreground font-bold uppercase">AVAILABLE FOR HIRE</span>
            </div>
          </motion.div>

          {/* Right Text Column */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-8"
          >
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
              {aboutData.heading}
            </h2>

            <div className="h-[2px] w-16 bg-accent rounded-full" />




            {/* Quick Contact Links removed */}
          </motion.div>
        </div>

        {/* 3. Statistics Luxury Cards Section */}
        {aboutData.statistics && aboutData.statistics.length > 0 && (
          <div className="max-w-7xl mx-auto px-6 mb-28 relative z-10">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {aboutData.statistics.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  whileHover={{ y: -5, borderColor: 'var(--accent)' }}
                  className="bg-navy/40 p-8 rounded-3xl border border-border hover:bg-navy/60 transition-all duration-300 backdrop-blur-sm group"
                >
                  <p className="text-4xl md:text-5xl font-black mb-2 text-accent tracking-tight transition-all group-hover:drop-shadow-[0_0_15px_var(--color-accent-dim)]">
                    <AnimatedCounter value={stat.value} />
                  </p>
                  <p className="text-muted-foreground text-xs md:text-sm font-bold uppercase tracking-wider leading-relaxed">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        )}






      </div>
    </Layout>
  );
};

export default About;
