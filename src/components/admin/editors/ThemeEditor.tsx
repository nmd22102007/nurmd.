import React, { useState, useEffect } from 'react';
import { db } from '../../../lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Sparkles, Check, RotateCcw, Palette } from 'lucide-react';

interface ThemeConfig {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
  isCustom?: boolean;
}

const themePresets: ThemeConfig[] = [
  {
    id: 'carbon-sleek',
    name: 'Carbon Sleek (Premium Monochrome)',
    primary: '#ffffff',
    secondary: '#52525b',
    accent: '#ffffff',
    background: '#09090b',
    foreground: '#ffffff'
  },
  {
    id: 'cyber-cyan',
    name: 'Cyber Turquoise (Cyan & Blue)',
    primary: '#22d3ee',
    secondary: '#3b82f6',
    accent: '#22d3ee',
    background: '#020617',
    foreground: '#ffffff'
  },
  {
    id: 'hyper-rose',
    name: 'Hyper Rose (Neon Pink & Violet)',
    primary: '#f43f5e',
    secondary: '#8b5cf6',
    accent: '#f43f5e',
    background: '#09050d',
    foreground: '#ffffff'
  },
  {
    id: 'emerald-aurora',
    name: 'Emerald Aurora (Tech Green & Teal)',
    primary: '#10b981',
    secondary: '#06b6d4',
    accent: '#10b981',
    background: '#020804',
    foreground: '#ffffff'
  },
  {
    id: 'sunset-luxury',
    name: 'Sunset Luxury (Amber & Fire Red)',
    primary: '#f59e0b',
    secondary: '#ef4444',
    accent: '#f59e0b',
    background: '#0c0602',
    foreground: '#ffffff'
  }
];

export const ThemeEditor = () => {
  const [selectedThemeId, setSelectedThemeId] = useState('carbon-sleek');
  const [customConfig, setCustomConfig] = useState<Omit<ThemeConfig, 'id' | 'name'>>({
    primary: '#ffffff',
    secondary: '#52525b',
    accent: '#ffffff',
    background: '#09090b',
    foreground: '#ffffff'
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const docRef = doc(db, 'siteConfig', 'theme');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data() as ThemeConfig;
          if (data.id) {
            setSelectedThemeId(data.id);
          }
          setCustomConfig({
            primary: data.primary || '#ffffff',
            secondary: data.secondary || '#52525b',
            accent: data.accent || '#ffffff',
            background: data.background || '#09090b',
            foreground: data.foreground || '#ffffff'
          });
        }
      } catch (e) {
        console.error("Error loading theme settings:", e);
      }
    };
    loadTheme();
  }, []);

  const handleSelectPreset = (preset: ThemeConfig) => {
    setSelectedThemeId(preset.id);
    setCustomConfig({
      primary: preset.primary,
      secondary: preset.secondary,
      accent: preset.accent,
      background: preset.background,
      foreground: preset.foreground
    });
  };

  const handleCustomColorChange = (key: keyof Omit<ThemeConfig, 'id' | 'name'>, val: string) => {
    setSelectedThemeId('custom');
    setCustomConfig(prev => ({
      ...prev,
      [key]: val
    }));
  };

  const applyColorsToRoot = (theme: Omit<ThemeConfig, 'id' | 'name'>) => {
    const root = document.documentElement;
    root.style.setProperty('--background', theme.background);
    root.style.setProperty('--bg-main', theme.background);
    root.style.setProperty('--primary', theme.primary);
    root.style.setProperty('--color-accent', theme.accent);
    root.style.setProperty('--accent', theme.accent);
    root.style.setProperty('--secondary', theme.secondary);
    root.style.setProperty('--text-main', theme.foreground);
    root.style.setProperty('--foreground', theme.foreground);
    
    // Auto calculate dim backgrounds for glow gradient
    root.style.setProperty('--color-accent-dim', theme.accent + '15');
    root.style.setProperty('--bg-navy', theme.background === '#020617' ? '#0f172a' : theme.background + 'e0');
  };

  const handleSave = async () => {
    setLoading(true);
    setMsg(null);
    try {
      const payload = {
        id: selectedThemeId,
        primary: customConfig.primary,
        secondary: customConfig.secondary,
        accent: customConfig.accent,
        background: customConfig.background,
        foreground: customConfig.foreground,
        updatedAt: serverTimestamp()
      };

      await setDoc(doc(db, 'siteConfig', 'theme'), payload, { merge: true });
      applyColorsToRoot(customConfig);
      
      setMsg({ type: 'success', text: 'Color Theme updated successfully!' });
    } catch (e) {
      console.error("Error saving color theme:", e);
      setMsg({ type: 'error', text: 'Failed to update theme configuration.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 text-white">
      <div>
        <h4 className="text-xl font-bold flex items-center gap-2 text-cyan-400">
          <Palette className="w-5 h-5" />
          Color Theme & Brand Settings
        </h4>
        <p className="text-gray-400 text-xs mt-1">
          Customize your website branding colors, glows, and glowing web background canvas dynamically.
        </p>
      </div>

      {msg && (
        <div className={`p-4 rounded-xl text-xs font-semibold ${msg.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300' : 'bg-rose-500/10 border border-rose-500/20 text-rose-300'}`}>
          {msg.text}
        </div>
      )}

      {/* Preset Pickers */}
      <div className="space-y-4">
        <label className="text-xs uppercase tracking-wider text-gray-400 font-bold block">Pre-configured Themes</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {themePresets.map((preset) => {
            const isSelected = selectedThemeId === preset.id;
            return (
              <button
                type="button"
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={`flex flex-col items-start text-left p-5 rounded-2xl border transition-all relative ${isSelected ? 'border-cyan-400 bg-cyan-400/5' : 'border-[#1F2937]/50 bg-black/30 hover:border-gray-500'}`}
              >
                {isSelected && (
                  <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-cyan-400 flex items-center justify-center text-black">
                    <Check className="w-3 h-3" />
                  </span>
                )}
                <span className="text-xs font-bold block mb-3 text-white truncate max-w-[85%]">{preset.name}</span>
                <div className="flex gap-2">
                  <span className="w-5 h-5 rounded-full block border border-white/10" style={{ backgroundColor: preset.primary }} title={`Primary: ${preset.primary}`} />
                  <span className="w-5 h-5 rounded-full block border border-white/10" style={{ backgroundColor: preset.secondary }} title={`Secondary: ${preset.secondary}`} />
                  <span className="w-5 h-5 rounded-full block border border-white/10" style={{ backgroundColor: preset.accent }} title={`Accent: ${preset.accent}`} />
                  <span className="w-5 h-5 rounded-full block border border-white/10" style={{ backgroundColor: preset.background }} title={`Background: ${preset.background}`} />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Advanced Custom Color Form */}
      <div className="p-6 bg-slate-900/30 rounded-2xl border border-[#1F2937]/50 space-y-6">
        <div className="flex justify-between items-center">
          <span className="text-xs uppercase tracking-wider text-gray-400 font-bold">Custom Palette Override</span>
          {selectedThemeId !== 'carbon-sleek' && (
            <button
              onClick={() => handleSelectPreset(themePresets[0])}
              className="text-xs text-slate-500 hover:text-white flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Reset to Carbon
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="text-xs text-slate-400 mb-2 block font-medium">Primary Accent (Hex)</label>
            <div className="flex gap-2 items-center">
              <input
                type="color"
                value={customConfig.primary}
                onChange={e => handleCustomColorChange('primary', e.target.value)}
                className="w-10 h-10 rounded-lg bg-transparent border-0 cursor-pointer"
              />
              <input
                type="text"
                value={customConfig.primary}
                onChange={e => handleCustomColorChange('primary', e.target.value)}
                className="flex-grow bg-[#1F2937] border border-[#374151] px-3 py-2 rounded-lg text-xs font-mono text-white text-center"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 mb-2 block font-medium">Secondary Wave / Highlights</label>
            <div className="flex gap-2 items-center">
              <input
                type="color"
                value={customConfig.secondary}
                onChange={e => handleCustomColorChange('secondary', e.target.value)}
                className="w-10 h-10 rounded-lg bg-transparent border-0 cursor-pointer"
              />
              <input
                type="text"
                value={customConfig.secondary}
                onChange={e => handleCustomColorChange('secondary', e.target.value)}
                className="flex-grow bg-[#1F2937] border border-[#374151] px-3 py-2 rounded-lg text-xs font-mono text-white text-center"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 mb-2 block font-medium">Accent Badges / Triggers</label>
            <div className="flex gap-2 items-center">
              <input
                type="color"
                value={customConfig.accent}
                onChange={e => handleCustomColorChange('accent', e.target.value)}
                className="w-10 h-10 rounded-lg bg-transparent border-0 cursor-pointer"
              />
              <input
                type="text"
                value={customConfig.accent}
                onChange={e => handleCustomColorChange('accent', e.target.value)}
                className="flex-grow bg-[#1F2937] border border-[#374151] px-3 py-2 rounded-lg text-xs font-mono text-white text-center"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 mb-2 block font-medium">Main Page Background</label>
            <div className="flex gap-2 items-center">
              <input
                type="color"
                value={customConfig.background}
                onChange={e => handleCustomColorChange('background', e.target.value)}
                className="w-10 h-10 rounded-lg bg-transparent border-0 cursor-pointer"
              />
              <input
                type="text"
                value={customConfig.background}
                onChange={e => handleCustomColorChange('background', e.target.value)}
                className="flex-grow bg-[#1F2937] border border-[#374151] px-3 py-2 rounded-lg text-xs font-mono text-white text-center"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 mb-2 block font-medium">Typography Foreground</label>
            <div className="flex gap-2 items-center">
              <input
                type="color"
                value={customConfig.foreground}
                onChange={e => handleCustomColorChange('foreground', e.target.value)}
                className="w-10 h-10 rounded-lg bg-transparent border-0 cursor-pointer"
              />
              <input
                type="text"
                value={customConfig.foreground}
                onChange={e => handleCustomColorChange('foreground', e.target.value)}
                className="flex-grow bg-[#1F2937] border border-[#374151] px-3 py-2 rounded-lg text-xs font-mono text-white text-center"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          onClick={handleSave}
          disabled={loading}
          className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 transition-all"
        >
          {loading ? 'Saving Layout...' : 'Save Color Theme'}
        </button>
      </div>
    </div>
  );
};
