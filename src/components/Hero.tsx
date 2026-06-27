import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, type Variants } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

type Point = {
  x: number;
  y: number;
};

interface WaveConfig {
  offset: number;
  amplitude: number;
  frequency: number;
  color: string;
  opacity: number;
}

// Scroll trigger counter component for hero statistics
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

interface HeroData {
  badge: string;
  title: string;
  titleAccent: string;
  description: string;
  ctaText: string;
  ctaUrl: string;
  secondaryCtaText: string;
  secondaryCtaUrl: string;
  imageUrl?: string;
  highlightPills: string[];
  stats: { label: string; value: string }[];
}

const DEFAULT_HERO_DATA: HeroData = {
  badge: "Designing the Future",
  title: "Web Designer",
  titleAccent: "& Developer",
  description: "I design and develop modern web experiences with clean UI, high performance, and futuristic interactions. Crafting the next generation of the web.",
  ctaText: "Explore Portfolio",
  ctaUrl: "#portfolio",
  secondaryCtaText: "Let's Connect",
  secondaryCtaUrl: "#contact",
  imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80",
  highlightPills: [
    "Futuristic Web Experiences",
    "Interactive Motion",
    "High Performance"
  ],
  stats: [
    { label: "Projects Completed", value: "50+" },
    { label: "Client Satisfaction", value: "100%" },
    { label: "Worldwide Collaborations", value: "20+" }
  ]
};

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, staggerChildren: 0.12 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const statsVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut", staggerChildren: 0.08 },
  },
};

export const Hero = () => {
  const [heroData, setHeroData] = useState<HeroData>(() => {
    const cached = localStorage.getItem('siteConfig_hero');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        console.error("Error loading cached hero config:", e);
      }
    }
    return DEFAULT_HERO_DATA;
  });
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<Point>({ x: 0, y: 0 });
  const targetMouseRef = useRef<Point>({ x: 0, y: 0 });

  // Load Hero configuration from Firestore
  useEffect(() => {
    const loadHero = async () => {
      try {
        const docRef = doc(db, 'siteConfig', 'hero');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          const updatedHeroData = {
            badge: data.badge || DEFAULT_HERO_DATA.badge,
            title: data.title || DEFAULT_HERO_DATA.title,
            titleAccent: data.titleAccent !== undefined ? data.titleAccent : DEFAULT_HERO_DATA.titleAccent,
            description: data.description || DEFAULT_HERO_DATA.description,
            ctaText: data.ctaText || DEFAULT_HERO_DATA.ctaText,
            ctaUrl: data.ctaUrl || DEFAULT_HERO_DATA.ctaUrl,
            secondaryCtaText: data.secondaryCtaText || DEFAULT_HERO_DATA.secondaryCtaText,
            secondaryCtaUrl: data.secondaryCtaUrl || DEFAULT_HERO_DATA.secondaryCtaUrl,
            imageUrl: data.imageUrl !== undefined ? data.imageUrl : DEFAULT_HERO_DATA.imageUrl,
            highlightPills: Array.isArray(data.highlightPills) ? data.highlightPills : DEFAULT_HERO_DATA.highlightPills,
            stats: Array.isArray(data.stats) ? data.stats : DEFAULT_HERO_DATA.stats,
          };
          setHeroData(updatedHeroData);
          localStorage.setItem('siteConfig_hero', JSON.stringify(updatedHeroData));
        } else {
          // Backward compatibility check with siteConfig/about
          const aboutRef = doc(db, 'siteConfig', 'about');
          const aboutSnap = await getDoc(aboutRef);
          if (aboutSnap.exists()) {
            const aboutData = aboutSnap.data();
            if (aboutData.title) {
              setHeroData(prev => {
                const updated = {
                  ...prev,
                  title: aboutData.title,
                  description: aboutData.subtitle || prev.description
                };
                localStorage.setItem('siteConfig_hero', JSON.stringify(updated));
                return updated;
              });
            }
          }
        }
      } catch (e) {
        console.error("Error loading hero config:", e);
      }
    };
    loadHero();
  }, []);

  // Set up glowing waves canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;

    let animationId: number;
    let time = 0;

    const computeThemeColors = () => {
      const rootStyles = getComputedStyle(document.documentElement);

      // Helper to convert any CSS color to a Canvas-compatible format
      const resolveColor = (variables: string[], alpha = 1) => {
        const tempEl = document.createElement("div");
        tempEl.style.position = "absolute";
        tempEl.style.visibility = "hidden";
        tempEl.style.width = "1px";
        tempEl.style.height = "1px";
        document.body.appendChild(tempEl);

        let color = `rgba(34, 211, 238, ${alpha})`; // fallback cyan color

        for (const variable of variables) {
          const value = rootStyles.getPropertyValue(variable).trim();
          if (value) {
            tempEl.style.backgroundColor = `var(${variable})`;
            const computedColor = getComputedStyle(tempEl).backgroundColor;

            if (computedColor && computedColor !== "rgba(0, 0, 0, 0)") {
              if (alpha < 1) {
                const rgbMatch = computedColor.match(
                  /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/
                );
                if (rgbMatch) {
                  color = `rgba(${rgbMatch[1]}, ${rgbMatch[2]}, ${rgbMatch[3]}, ${alpha})`;
                } else {
                  color = computedColor;
                }
              } else {
                color = computedColor;
              }
              break;
            }
          }
        }

        document.body.removeChild(tempEl);
        return color;
      };

      return {
        backgroundTop: resolveColor(["--background"], 1),
        backgroundBottom: resolveColor(["--muted", "--background"], 0.95),
        wavePalette: [
          {
            offset: 0,
            amplitude: 70,
            frequency: 0.003,
            color: resolveColor(["--primary", "--color-accent"], 0.8),
            opacity: 0.45,
          },
          {
            offset: Math.PI / 2,
            amplitude: 90,
            frequency: 0.0026,
            color: resolveColor(["--accent", "--primary"], 0.7),
            opacity: 0.35,
          },
          {
            offset: Math.PI,
            amplitude: 60,
            frequency: 0.0034,
            color: resolveColor(["--secondary"], 0.65),
            opacity: 0.3,
          },
          {
            offset: Math.PI * 1.5,
            amplitude: 80,
            frequency: 0.0022,
            color: resolveColor(["--primary-foreground", "--foreground"], 0.25),
            opacity: 0.25,
          },
          {
            offset: Math.PI * 2,
            amplitude: 55,
            frequency: 0.004,
            color: resolveColor(["--foreground"], 0.2),
            opacity: 0.2,
          },
        ] satisfies WaveConfig[],
      };
    };

    let themeColors = computeThemeColors();

    const handleThemeMutation = () => {
      themeColors = computeThemeColors();
    };

    const observer = new MutationObserver(handleThemeMutation);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme", "style"],
    });

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const mouseInfluence = prefersReducedMotion ? 10 : 70;
    const influenceRadius = prefersReducedMotion ? 160 : 320;
    const smoothing = prefersReducedMotion ? 0.04 : 0.1;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const recenterMouse = () => {
      const centerPoint = { x: canvas.width / 2, y: canvas.height / 2 };
      mouseRef.current = centerPoint;
      targetMouseRef.current = centerPoint;
    };

    const handleResize = () => {
      resizeCanvas();
      recenterMouse();
    };

    const handleMouseMove = (event: MouseEvent) => {
      targetMouseRef.current = { x: event.clientX, y: event.clientY };
    };

    const handleMouseLeave = () => {
      recenterMouse();
    };

    resizeCanvas();
    recenterMouse();

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    const drawWave = (wave: WaveConfig) => {
      ctx.save();
      ctx.beginPath();

      for (let x = 0; x <= canvas.width; x += 4) {
        const dx = x - mouseRef.current.x;
        const dy = canvas.height / 2 - mouseRef.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const influence = Math.max(0, 1 - distance / influenceRadius);
        const mouseEffect =
          influence *
          mouseInfluence *
          Math.sin(time * 0.001 + x * 0.01 + wave.offset);

        const y =
          canvas.height / 2 +
          Math.sin(x * wave.frequency + time * 0.002 + wave.offset) *
            wave.amplitude +
          Math.sin(x * wave.frequency * 0.4 + time * 0.003) *
            (wave.amplitude * 0.45) +
          mouseEffect;

        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.lineWidth = 2.5;
      ctx.strokeStyle = wave.color;
      ctx.globalAlpha = wave.opacity;
      ctx.shadowBlur = 35;
      ctx.shadowColor = wave.color;
      ctx.stroke();

      ctx.restore();
    };

    const animate = () => {
      time += 1;

      mouseRef.current.x +=
        (targetMouseRef.current.x - mouseRef.current.x) * smoothing;
      mouseRef.current.y +=
        (targetMouseRef.current.y - mouseRef.current.y) * smoothing;

      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, themeColors.backgroundTop);
      gradient.addColorStop(1, themeColors.backgroundBottom);

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;

      themeColors.wavePalette.forEach(drawWave);

      animationId = window.requestAnimationFrame(animate);
    };

    animationId = window.requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationId);
      observer.disconnect();
    };
  }, []);

  const renderTitle = () => {
    const titleVal = heroData.title || "";
    const accentVal = heroData.titleAccent || "";
    const combined = `${titleVal} ${accentVal}`.replace(/\s+/g, ' ').trim();
    
    const ampersandIndex = combined.indexOf('&');
    if (ampersandIndex !== -1) {
      const firstPart = combined.substring(0, ampersandIndex + 1).trim();
      const secondPart = combined.substring(ampersandIndex + 1).trim();
      return (
        <>
          <span className="block text-white font-extrabold tracking-tight">
            {firstPart}
          </span>
          <span className="block bg-gradient-to-b from-zinc-100 via-zinc-400 to-zinc-600 bg-clip-text text-transparent font-extrabold tracking-tight mt-1 pb-1">
            {secondPart}
          </span>
        </>
      );
    }

    const words = combined.split(' ');
    if (words.length > 2) {
      const mid = Math.ceil(words.length / 2);
      const firstPart = words.slice(0, mid).join(' ');
      const secondPart = words.slice(mid).join(' ');
      return (
        <>
          <span className="block text-white font-extrabold tracking-tight">
            {firstPart}
          </span>
          <span className="block bg-gradient-to-b from-zinc-100 via-zinc-400 to-zinc-600 bg-clip-text text-transparent font-extrabold tracking-tight mt-1 pb-1">
            {secondPart}
          </span>
        </>
      );
    }

    return (
      <span className="text-white font-extrabold tracking-tight leading-tight">
        {combined}
      </span>
    );
  };

  return (
    <section
      className="relative isolate flex min-h-screen w-full items-center justify-center overflow-hidden bg-background px-6"
      role="region"
      aria-label="Glowing waves hero section"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full pointer-events-none"
        aria-hidden="true"
      />

      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute left-1/2 top-0 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-foreground/[0.035] blur-[140px] dark:bg-foreground/[0.06]" />
        <div className="absolute bottom-0 right-0 h-[360px] w-[360px] rounded-full bg-foreground/[0.025] blur-[120px] dark:bg-foreground/[0.05]" />
        <div className="absolute top-1/2 left-1/4 h-[400px] w-[400px] rounded-full bg-primary/[0.02] blur-[150px] dark:bg-primary/[0.05]" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center py-20 text-center md:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full flex flex-col items-center text-center"
        >
          {/* Main content pane */}
          <div className="max-w-4xl flex flex-col items-center w-full">
            <motion.div
              variants={itemVariants}
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-5 py-1.5 text-[9px] font-semibold uppercase tracking-[0.25em] text-white font-mono backdrop-blur-md"
            >
              <span className="text-[10px] text-zinc-400">✦</span>
              {heroData.badge}
            </motion.div>

            {/* Heading */}
            <motion.h1
              id="hero-main-title"
              variants={itemVariants}
              className="mb-8 text-5xl font-extrabold tracking-tight text-white md:text-7xl lg:text-8xl leading-[1.05] text-center"
            >
              {renderTitle()}
            </motion.h1>

            {/* Description Paragraph */}
            <motion.p
              variants={itemVariants}
              className="mx-auto mb-10 max-w-2xl text-sm md:text-base text-zinc-400 opacity-90 leading-relaxed font-sans text-center px-4"
            >
              {heroData.description}
            </motion.p>

            {/* Action buttons side-by-side */}
            <motion.div
              variants={itemVariants}
              className="mb-10 flex flex-row items-center justify-center gap-4 w-full px-4"
            >
              <a
                href={heroData.ctaUrl}
                className="px-7 py-3 bg-white text-black font-semibold rounded-full flex items-center gap-2 hover:bg-[#eaeaea] transition-all duration-300 text-xs uppercase tracking-wider cursor-pointer border border-white"
              >
                <span>{heroData.ctaText}</span>
                <span className="text-sm font-light">→</span>
              </a>
              <a
                href={heroData.secondaryCtaUrl}
                className="px-7 py-3 bg-[#13141c]/85 border border-[#222] hover:border-white/20 hover:bg-[#1c1d27]/90 text-white font-semibold rounded-full transition-all duration-300 text-xs uppercase tracking-wider backdrop-blur-sm cursor-pointer"
              >
                {heroData.secondaryCtaText}
              </a>
            </motion.div>

            {/* Highlight pills */}
            <motion.ul
              variants={itemVariants}
              className="mb-14 flex flex-wrap items-center justify-center gap-2 px-4"
            >
              {heroData.highlightPills.map((pill) => (
                <li
                  key={pill}
                  className="rounded-full border border-white/5 bg-[#111115]/30 px-4 py-1.5 text-[9px] uppercase tracking-[0.2em] text-[#8e8e93] font-mono backdrop-blur-md hover:border-white/10 transition-colors"
                >
                  {pill}
                </li>
              ))}
            </motion.ul>
          </div>

          {/* Statistics counter footer rectangle container */}
          <div className="w-full max-w-4xl mx-auto mt-4 px-4">
            <motion.div
              variants={statsVariants}
              className={`grid gap-6 rounded-[24px] border border-white/10 bg-[#0d0d11]/80 p-8 md:p-10 backdrop-blur-md font-mono shadow-[0_20px_50px_rgba(0,0,0,0.8)] ${
                heroData.stats.length === 2 
                  ? 'sm:grid-cols-2' 
                  : heroData.stats.length === 1 
                  ? 'grid-cols-1' 
                  : 'sm:grid-cols-3'
              }`}
            >
              {heroData.stats.map((stat) => (
                <motion.div
                  key={stat.label}
                  variants={itemVariants}
                  className="space-y-2 text-center"
                >
                  <div className="text-[10px] uppercase tracking-[0.2em] text-[#8e8e93] font-bold">
                    {stat.label}
                  </div>
                  <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                    <AnimatedCounter value={stat.value} />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
