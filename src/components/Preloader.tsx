import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

interface PreloaderProps {
  onComplete: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Initializing connections...');
  const [fadeStart, setFadeStart] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    // Minimal duration for loader
    const startTime = Date.now();
    
    const preloadResources = async () => {
      try {
        // Step 1: Initialize Database & Parallel Fetch of Site Configs
        if (isMounted) setStatus('Syncing cloud database...');
        setProgress(15);
        
        const docsToFetch = ['theme', 'hero', 'about', 'contact', 'footer', 'services'];
        const fetchPromises = docsToFetch.map(async (docName) => {
          try {
            const docRef = doc(db, 'siteConfig', docName);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists() && isMounted) {
              localStorage.setItem(`siteConfig_${docName}`, JSON.stringify(docSnap.data()));
            }
          } catch (e) {
            console.warn(`Error caching doc ${docName} in preloader:`, e);
          }
        });

        // Step 2: Parallel Load Google Fonts
        const fontsPromise = (async () => {
          try {
            if (document.fonts) {
              await document.fonts.ready;
            }
          } catch (e) {
            console.warn('Error loading fonts:', e);
          }
        })();

        // Resolve data & fonts
        await Promise.all([...fetchPromises, fontsPromise]);
        
        if (isMounted) {
          setProgress(50);
          setStatus('Preloading graphic assets...');
        }

        // Step 3: Preload critical image files (like about page portrait & logo)
        const cachedAbout = localStorage.getItem('siteConfig_about');
        let aboutImageUrl = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80";
        if (cachedAbout) {
          try {
            const parsed = JSON.parse(cachedAbout);
            if (parsed.imageUrl) aboutImageUrl = parsed.imageUrl;
          } catch (_) {}
        }

        const imagesToPreload = [
          '/logo.png',
          aboutImageUrl
        ];

        const imagePromises = imagesToPreload.map((src) => {
          return new Promise<void>((resolve) => {
            const img = new Image();
            img.src = src;
            img.onload = () => resolve();
            img.onerror = () => resolve(); // continue even if an image fails to load
          });
        });

        await Promise.all(imagePromises);

        if (isMounted) {
          setProgress(85);
          setStatus('Optimizing interaction layers...');
        }

        // Guarantee a smooth visual progress bar increase
        const delay = Math.max(0, 1200 - (Date.now() - startTime));
        await new Promise(resolve => setTimeout(resolve, delay));

        if (isMounted) {
          setProgress(100);
          setStatus('Ready');
          
          // Trigger fade out
          setTimeout(() => {
            setFadeStart(true);
            setTimeout(() => {
              onComplete();
            }, 600); // Wait for transition fade out to complete
          }, 400);
        }

      } catch (error) {
        console.error("Error during preloading resources:", error);
        // Fail-safe to ensure the app still mounts
        if (isMounted) {
          setProgress(100);
          setStatus('Ready');
          setTimeout(() => {
            onComplete();
          }, 300);
        }
      }
    };

    preloadResources();

    // Secondary progress simulation to make the progress bar feel alive and responsive
    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(progressTimer);
          return prev;
        }
        // Stepwise increment based on current stage
        const increment = prev < 50 ? 2 : prev < 85 ? 1 : 0.5;
        return Math.min(95, prev + increment);
      });
    }, 80);

    return () => {
      isMounted = false;
      clearInterval(progressTimer);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!fadeStart && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#09090b]"
          style={{
            backgroundColor: 'var(--bg-main, #09090b)',
          }}
        >
          {/* Subtle background ambient glow */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-white/[0.02] blur-[100px]" />
          </div>

          <div className="relative z-10 flex flex-col items-center max-w-sm w-full px-8 text-center">
            {/* Branding Logo */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="mb-8"
            >
              <h1 className="text-2xl font-black tracking-widest text-white uppercase font-mono">
                nurmd<span className="text-zinc-500">.</span>
              </h1>
            </motion.div>

            {/* Glowing progress line wrapper */}
            <div className="relative w-full h-[1px] bg-white/10 rounded-full overflow-hidden mb-4">
              <motion.div 
                className="absolute top-0 left-0 h-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>

            {/* Numeric load indicator */}
            <div className="flex justify-between w-full text-[10px] font-mono uppercase tracking-[0.15em] text-zinc-500">
              <span className="font-bold text-zinc-400">{status}</span>
              <span className="text-white font-semibold">{Math.round(progress)}%</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
