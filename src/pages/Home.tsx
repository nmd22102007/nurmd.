import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Layout } from '../components/Layout';
import { Hero } from '../components/Hero';
import { Services } from '../components/Services';
import { db } from '../lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { Camera, Upload, Loader2, Check } from 'lucide-react';
import { compressImageFile } from '../lib/imageUtils';

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

const Home = () => {
  const [aboutData, setAboutData] = useState<any>(() => {
    const cached = localStorage.getItem('siteConfig_about');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        console.error("Error loading cached about data on Home page:", e);
      }
    }
    return null;
  });

  const [heroData, setHeroData] = useState<any>(() => {
    const cached = localStorage.getItem('siteConfig_hero');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {}
    }
    return null;
  });

  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const dataUrl = await compressImageFile(file, 1200, 0.85);

      // Save to Firestore
      await setDoc(doc(db, 'siteConfig', 'about'), { imageUrl: dataUrl }, { merge: true });
      await setDoc(doc(db, 'siteConfig', 'hero'), { imageUrl: dataUrl }, { merge: true });

      // Local state update
      setAboutData((prev: any) => ({ ...(prev || {}), imageUrl: dataUrl }));
      setHeroData((prev: any) => ({ ...(prev || {}), imageUrl: dataUrl }));

      localStorage.setItem('siteConfig_about', JSON.stringify({ ...(aboutData || {}), imageUrl: dataUrl }));
      localStorage.setItem('siteConfig_hero', JSON.stringify({ ...(heroData || {}), imageUrl: dataUrl }));
    } catch (err) {
      console.error("Failed to upload image:", err);
      alert("ইমেজ আপলোড ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।");
    } finally {
      setUploadingImage(false);
    }
  };

  useEffect(() => {
    const docRef = doc(db, 'siteConfig', 'about');
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setAboutData(data);
        localStorage.setItem('siteConfig_about', JSON.stringify(data));
      }
    }, (err) => {
      console.error("Error loading home page about section:", err);
    });

    const heroRef = doc(db, 'siteConfig', 'hero');
    const unsubscribeHero = onSnapshot(heroRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setHeroData(data);
        localStorage.setItem('siteConfig_hero', JSON.stringify(data));
      }
    });

    return () => {
      unsubscribe();
      unsubscribeHero();
    };
  }, []);

  return (
    <Layout>
      <Hero />
      
      {/* About Abstract Section */}
      <section id="about" className="py-24 px-6 relative overflow-hidden bg-black/40">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/5 blur-[120px] pointer-events-none" />
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div 
              className="aspect-square glass rounded-[60px] overflow-hidden rotate-3 hover:rotate-0 transition-all duration-500 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative group cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
              title="ইমেজ আপলোড করতে ক্লিক করুন"
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleImageFileChange} 
              />

              {(heroData?.imageUrl || aboutData?.imageUrl) ? (
                <img 
                  src={heroData?.imageUrl || aboutData?.imageUrl} 
                  alt="MD - Web Designer" 
                  className="w-full h-full object-cover -rotate-3 group-hover:rotate-0 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                  loading="eager"
                  decoding="async"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-black/50 text-slate-400 p-6 text-center">
                  <Camera className="w-12 h-12 mb-3 text-accent animate-bounce" />
                  <span className="text-sm font-bold uppercase tracking-wider text-white">ছবি আপলোড করুন</span>
                  <span className="text-[11px] text-slate-400 mt-1">Select an image from device</span>
                </div>
              )}

              {/* Upload Hover Overlay */}
              <div className={`absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-white transition-opacity duration-300 ${uploadingImage ? 'opacity-100 pointer-events-auto' : 'opacity-0 group-hover:opacity-100'}`}>
                {uploadingImage ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="w-8 h-8 text-accent animate-spin" />
                    <span className="text-xs font-bold tracking-wider">আপলোড হচ্ছে...</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 bg-navy/90 border border-white/20 px-5 py-3 rounded-2xl shadow-2xl hover:scale-105 transition-transform">
                    <Upload className="w-6 h-6 text-accent" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">নতুন ছবি আপলোড করুন</span>
                    <span className="text-[10px] text-slate-300">ডিভাইস থেকে ফাইল সিলেক্ট করুন</span>
                  </div>
                )}
              </div>
            </div>
            {/* Experience Badge */}
            <div className="absolute -bottom-10 -right-10 glass p-8 rounded-3xl -rotate-6 hidden md:block border border-white/5 shadow-2x">
              <p className="text-5xl font-black text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                <AnimatedCounter value={aboutData?.statistics?.[0]?.value || "5+"} />
              </p>
              <p className="text-gray-400 font-bold uppercase tracking-widest text-[9px] mt-1">
                {aboutData?.statistics?.[0]?.label || "Years of Experience"}
              </p>
            </div>
          </div>
          
          <div className="space-y-6">
            <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-400 font-bold">INTRODUCING MYSELF</span>
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tighter leading-tight bg-gradient-to-r from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent">
              {aboutData?.heading || "I turn complex ideas into digital reality"}
            </h2>
            <p className="text-slate-400 text-base md:text-lg leading-relaxed">
              {aboutData?.description1 || "Based in Dhaka, Bangladesh, I've spent the last half-decade perfecting the art of building digital products that aren't just tools, but experiences."}
            </p>
            <p className="text-slate-500 text-sm md:text-base leading-relaxed">
              {aboutData?.description2 || "My approach blends technical precision with creative vision, ensuring that every project I touch represents the future of the web."}
            </p>
            
            <div className="flex flex-wrap gap-8 md:gap-12 py-4 border-t border-white/5">
              {(aboutData?.statistics || [
                { value: '50+', label: 'Projects' },
                { value: '20+', label: 'Clients' },
                { value: '5+', label: 'Years Exp.' }
              ]).slice(0, 3).map((item: any, idx: number) => (
                <div key={idx}>
                  <p className="text-3xl font-black text-white mb-1">
                    <AnimatedCounter value={item.value} />
                  </p>
                  <p className="text-[9px] uppercase tracking-[0.2em] text-slate-500 font-bold">{item.label}</p>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white hover:text-black rounded-full text-xs font-bold uppercase tracking-wider border border-white/10 hover:border-transparent transition-all duration-300"
              >
                Explore Full Story / About Page &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Services />
    </Layout>
  );
};

export default Home;
