import React, { useState, useEffect } from 'react';
import { db } from '../../../lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { 
  Sparkles, 
  Save, 
  Image as ImageIcon, 
  Compass, 
  Layers, 
  Plus, 
  Trash2, 
  ArrowUpRight, 
  ListPlus,
  HelpCircle
} from 'lucide-react';

interface StatItem {
  label: string;
  value: string;
}

export const HeroEditor = () => {
  const [badge, setBadge] = useState('Designing the Future');
  const [title, setTitle] = useState('Web Designer');
  const [titleAccent, setTitleAccent] = useState('& Developer');
  const [description, setDescription] = useState('I design and develop modern web experiences with clean UI, high performance, and futuristic interactions. Crafting the next generation of the web.');
  const [ctaText, setCtaText] = useState('Explore Portfolio');
  const [ctaUrl, setCtaUrl] = useState('#portfolio');
  const [secondaryCtaText, setSecondaryCtaText] = useState("Let's Connect");
  const [secondaryCtaUrl, setSecondaryCtaUrl] = useState('#contact');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80');
  
  // Dynamic lists
  const [highlightPills, setHighlightPills] = useState<string[]>([
    "Futuristic Web Experiences",
    "Interactive Motion",
    "High Performance"
  ]);

  const [stats, setStats] = useState<StatItem[]>([
    { label: 'Projects Completed', value: '50+' },
    { label: 'Client Satisfaction', value: '100%' },
    { label: 'Worldwide Collaborations', value: '20+' }
  ]);

  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Load Hero configuration from Firestore
  useEffect(() => {
    const loadHeroData = async () => {
      try {
        const docRef = doc(db, 'siteConfig', 'hero');
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.badge) setBadge(data.badge);
          if (data.title) setTitle(data.title);
          if (data.titleAccent) setTitleAccent(data.titleAccent);
          if (data.description) setDescription(data.description);
          if (data.ctaText) setCtaText(data.ctaText);
          if (data.ctaUrl) setCtaUrl(data.ctaUrl);
          if (data.secondaryCtaText) setSecondaryCtaText(data.secondaryCtaText);
          if (data.secondaryCtaUrl) setSecondaryCtaUrl(data.secondaryCtaUrl);
          if (data.imageUrl) setImageUrl(data.imageUrl);
          if (Array.isArray(data.highlightPills)) setHighlightPills(data.highlightPills);
          if (Array.isArray(data.stats)) setStats(data.stats);
        } else {
          // Check siteConfig/about for some backwards compatibility
          const aboutRef = doc(db, 'siteConfig', 'about');
          const aboutSnap = await getDoc(aboutRef);
          if (aboutSnap.exists()) {
            const aboutData = aboutSnap.data();
            if (aboutData.title) setTitle(aboutData.title);
          }
        }
      } catch (err) {
        console.error('Error loading hero data:', err);
      }
    };
    loadHeroData();
  }, []);

  const handleAddPill = () => {
    if (highlightPills.length >= 6) {
      alert("A maximum of 6 highlight flags is recommended to preserve visual layout.");
    }
    setHighlightPills([...highlightPills, "New Accent Label"]);
  };

  const handleUpdatePill = (index: number, val: string) => {
    const updated = [...highlightPills];
    updated[index] = val;
    setHighlightPills(updated);
  };

  const handleRemovePill = (index: number) => {
    setHighlightPills(highlightPills.filter((_, i) => i !== index));
  };

  const handleAddStat = () => {
    if (stats.length >= 4) {
      alert("A maximum of 4 columns is recommended for stats to maintain readability.");
    }
    setStats([...stats, { label: 'New Metric', value: '10+' }]);
  };

  const handleUpdateStat = (index: number, key: keyof StatItem, val: string) => {
    const updated = [...stats];
    updated[index] = { ...updated[index], [key]: val };
    setStats(updated);
  };

  const handleRemoveStat = (index: number) => {
    setStats(stats.filter((_, i) => i !== index));
  };

  const handleSaveAll = async () => {
    setLoading(true);
    setStatusMessage(null);
    try {
      const payload = {
        badge,
        title,
        titleAccent,
        description,
        ctaText,
        ctaUrl,
        secondaryCtaText,
        secondaryCtaUrl,
        imageUrl,
        highlightPills,
        stats,
        updatedAt: serverTimestamp()
      };

      await setDoc(doc(db, 'siteConfig', 'hero'), payload, { merge: true });
      setStatusMessage({ type: 'success', text: 'Hero Section content saved and updated live!' });
    } catch (e) {
      console.error('Error saving hero configuration:', e);
      setStatusMessage({ type: 'error', text: 'Failed to update Hero configuration.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 text-white">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-6">
        <div>
          <h4 className="text-xl font-bold flex items-center gap-2 text-cyan-400">
            <Sparkles className="w-5 h-5 animate-pulse" />
            Vibrant Hero Manager
          </h4>
          <p className="text-gray-400 text-xs mt-1">
            Customize the key landing screen, headings, Call-to-Action buttons, custom highlight tags, counting stats, and background elements.
          </p>
        </div>
        <button
          onClick={handleSaveAll}
          disabled={loading}
          className="w-full sm:w-auto px-6 py-3 bg-cyan-400 hover:bg-cyan-300 text-black font-bold rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)] cursor-pointer"
        >
          <Save className="w-4 h-4" />
          {loading ? 'Publishing...' : 'Publish Hero'}
        </button>
      </div>

      {statusMessage && (
        <div className={`p-4 rounded-xl text-xs font-semibold ${statusMessage.type === 'success' ? 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-300' : 'bg-rose-500/10 border border-rose-500/20 text-rose-300'}`}>
          {statusMessage.text}
        </div>
      )}

      {/* Main Form Fields */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Side: General Info, Image, buttons */}
        <div className="space-y-6">
          <div className="bg-slate-900/30 border border-[#1F2937]/50 p-6 rounded-2xl space-y-4">
            <h5 className="text-sm font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
              <Compass className="w-4 h-4" /> Landing Copy
            </h5>
            
            <div className="space-y-2">
              <label className="text-xs text-gray-400 font-medium">Hero Top Small Badge</label>
              <input
                type="text"
                value={badge}
                onChange={e => setBadge(e.target.value)}
                className="w-full bg-[#111] border border-[#222] p-3 rounded-lg text-xs font-semibold text-cyan-300"
                placeholder="Designing the Future"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs text-gray-400 font-medium">Main Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full bg-[#111] border border-[#222] p-3 rounded-lg text-xs"
                  placeholder="Web Designer"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-gray-400 font-medium">Accent Title (Glows)</label>
                <input
                  type="text"
                  value={titleAccent}
                  onChange={e => setTitleAccent(e.target.value)}
                  className="w-full bg-[#111] border border-[#222] p-3 rounded-lg text-xs text-cyan-300 font-bold"
                  placeholder="& Developer"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-gray-400 font-medium">Elevating Description</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full bg-[#111] border border-[#222] p-3 rounded-lg text-xs h-28 resize-none text-slate-300 leading-relaxed"
                placeholder="I design and develop..."
              />
            </div>
          </div>

          {/* Action Call to Buttons */}
          <div className="bg-slate-900/30 border border-[#1F2937]/50 p-6 rounded-2xl space-y-4">
            <h5 className="text-sm font-bold text-cyan-400 uppercase tracking-wider">CTA Buttons</h5>
            
            {/* Primary CTA */}
            <div className="grid grid-cols-2 gap-4 border-b border-white/5 pb-4">
              <div className="space-y-2">
                <label className="text-xs text-gray-400 font-medium">Primary Button Text</label>
                <input
                  type="text"
                  value={ctaText}
                  onChange={e => setCtaText(e.target.value)}
                  className="w-full bg-[#111] border border-[#222] p-3 rounded-lg text-xs text-emerald-300"
                  placeholder="Explore Portfolio"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-gray-400 font-medium">Primary Target Hash/Link</label>
                <input
                  type="text"
                  value={ctaUrl}
                  onChange={e => setCtaUrl(e.target.value)}
                  className="w-full bg-[#111] border border-[#222] p-3 rounded-lg text-xs text-gray-400 font-mono"
                  placeholder="#portfolio"
                />
              </div>
            </div>

            {/* Secondary CTA */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs text-gray-400 font-medium">Secondary Button Text</label>
                <input
                  type="text"
                  value={secondaryCtaText}
                  onChange={e => setSecondaryCtaText(e.target.value)}
                  className="w-full bg-[#111] border border-[#222] p-3 rounded-lg text-xs"
                  placeholder="Let's Connect"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-gray-400 font-medium">Secondary Target Hash/Link</label>
                <input
                  type="text"
                  value={secondaryCtaUrl}
                  onChange={e => setSecondaryCtaUrl(e.target.value)}
                  className="w-full bg-[#111] border border-[#222] p-3 rounded-lg text-xs text-gray-400 font-mono"
                  placeholder="#contact"
                />
              </div>
            </div>
          </div>

          {/* Interactive Image */}
          <div className="bg-slate-900/30 border border-[#1F2937]/50 p-6 rounded-2xl space-y-4">
            <h5 className="text-sm font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
              <ImageIcon className="w-4 h-4" /> Hero Dynamic Image
            </h5>
            <div className="space-y-2">
              <label className="text-xs text-gray-400 font-medium">Visual Presentation / Graphics Image URL (Optional)</label>
              <input
                type="text"
                value={imageUrl}
                onChange={e => setImageUrl(e.target.value)}
                className="w-full bg-[#111] border border-[#222] p-3 rounded-lg text-xs text-gray-300 font-mono"
                placeholder="https://..."
              />
              <p className="text-[10px] text-gray-500">Provide an image URL to enable a magnificent side-by-side split viewport. Recommended sizes: standard portrait/square renders.</p>
              
              {imageUrl ? (
                <div className="relative h-44 w-full rounded-xl overflow-hidden border border-[#222] mt-2 group">
                  <img src={imageUrl} alt="Hero Preview" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                    <span className="text-[9px] font-mono uppercase bg-black/60 px-2 py-1 rounded text-cyan-400">Live Preview</span>
                  </div>
                </div>
              ) : (
                <div className="h-28 w-full rounded-xl bg-black/20 border border-dashed border-[#222] flex flex-col items-center justify-center text-gray-500 text-xs">
                  <ImageIcon className="w-6 h-6 mb-1 opacity-40" />
                  No image URL specified. Hero will run on centered, full-width mode.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Floating Pills and Statistics counters */}
        <div className="space-y-6">
          {/* Highlight Pills */}
          <div className="bg-slate-900/30 border border-[#1F2937]/50 p-6 rounded-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <h5 className="text-sm font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4" /> Highlight Badges
              </h5>
              <button
                onClick={handleAddPill}
                className="text-xs text-cyan-400 hover:text-white flex items-center gap-1 transition-all"
              >
                <Plus className="w-3.5 h-3.5" /> Add Badge
              </button>
            </div>
            
            <p className="text-[10px] text-gray-500 mt-1">These badges swim on the bottom of the landing frame in the dynamic list track.</p>
            
            <div className="space-y-3">
              {highlightPills.map((pill, idx) => (
                <div key={idx} className="flex gap-2 items-center bg-black/40 p-2.5 rounded-xl border border-white/5">
                  <span className="text-xs font-mono text-cyan-500/70 w-6 text-center">#{idx + 1}</span>
                  <input
                    type="text"
                    value={pill}
                    onChange={e => handleUpdatePill(idx, e.target.value)}
                    className="flex-1 bg-[#111] border border-[#222] p-2 rounded text-xs text-white"
                    placeholder="E.g. Creative Layouts"
                  />
                  <button
                    onClick={() => handleRemovePill(idx)}
                    className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {highlightPills.length === 0 && (
                <p className="text-xs text-gray-500 text-center py-4">No highlight badges defined. Tap "Add Badge" to construct one.</p>
              )}
            </div>
          </div>

          {/* Counting Stats Counters */}
          <div className="bg-slate-900/30 border border-[#1F2937]/50 p-6 rounded-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <h5 className="text-sm font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                <ListPlus className="w-4 h-4" /> Counting Stats Counters
              </h5>
              <button
                onClick={handleAddStat}
                className="text-xs text-cyan-400 hover:text-white flex items-center gap-1 transition-all"
              >
                <Plus className="w-3.5 h-3.5" /> Add Counter
              </button>
            </div>
            
            <p className="text-[10px] text-gray-500 mt-1">These fields trigger an automated incrementing count animation when loaded. Recommended formats include ending with &quot;+&quot; or &quot;%&quot;.</p>
            
            <div className="space-y-4">
              {stats.map((stat, idx) => (
                <div key={idx} className="bg-black/40 p-4 rounded-xl border border-white/5 space-y-3 relative">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-mono text-cyan-300 font-bold">Counter Block #{idx + 1}</span>
                    <button
                      onClick={() => handleRemoveStat(idx)}
                      className="text-rose-400 hover:text-rose-300 p-1.5 rounded hover:bg-rose-500/10 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-1 space-y-1">
                      <label className="text-[9px] uppercase tracking-wider text-gray-500 font-mono">Value text</label>
                      <input
                        type="text"
                        value={stat.value}
                        onChange={e => handleUpdateStat(idx, 'value', e.target.value)}
                        className="w-full bg-[#111] border border-[#222] p-2 rounded text-xs text-cyan-300 font-mono font-bold"
                        placeholder="E.g. 50+"
                      />
                    </div>
                    <div className="col-span-2 space-y-1">
                      <label className="text-[9px] uppercase tracking-wider text-gray-500 font-mono">Metric Label</label>
                      <input
                        type="text"
                        value={stat.label}
                        onChange={e => handleUpdateStat(idx, 'label', e.target.value)}
                        className="w-full bg-[#111] border border-[#222] p-2 rounded text-xs text-gray-300"
                        placeholder="E.g. Projects Completed"
                      />
                    </div>
                  </div>
                </div>
              ))}
              {stats.length === 0 && (
                <p className="text-xs text-gray-500 text-center py-4">No statistic counters active. Tap "Add Counter" to build real-time counting numbers.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-white/5">
        <button
          onClick={handleSaveAll}
          disabled={loading}
          className="px-8 py-4 bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold rounded-2xl text-xs uppercase tracking-widest flex items-center gap-2 transition-all shadow-[0_0_25px_rgba(34,211,238,0.4)] cursor-pointer"
        >
          <Save className="w-4 h-4" />
          {loading ? 'Saving Changes...' : 'Publish Hero Section'}
        </button>
      </div>
    </div>
  );
};
