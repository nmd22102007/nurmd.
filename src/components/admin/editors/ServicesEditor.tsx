import React, { useState, useEffect } from 'react';
import { db } from '../../../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { 
  Plus, 
  Trash2, 
  Sparkles, 
  Save, 
  HelpCircle,
  Palette,
  Code,
  Terminal,
  Zap,
  Globe,
  Smartphone,
  BarChart,
  Shield,
  Layout,
  Settings,
  Link2
} from 'lucide-react';

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

const AVAILABLE_ICONS = [
  { name: 'Palette', icon: Palette },
  { name: 'Code', icon: Code },
  { name: 'Terminal', icon: Terminal },
  { name: 'Zap', icon: Zap },
  { name: 'Globe', icon: Globe },
  { name: 'Smartphone', icon: Smartphone },
  { name: 'BarChart', icon: BarChart },
  { name: 'Shield', icon: Shield },
  { name: 'Layout', icon: Layout },
  { name: 'Settings', icon: Settings }
];

export const ServicesEditor = () => {
  const [services, setServices] = useState<ServiceItem[]>(DEFAULT_SERVICES);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const loadServices = async () => {
      try {
        const docRef = doc(db, 'siteConfig', 'services');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (Array.isArray(data.services)) {
            setServices(data.services);
          }
        }
      } catch (err) {
        console.error('Error loading services data:', err);
      }
    };
    loadServices();
  }, []);

  const handleAddService = () => {
    setServices([
      ...services,
      {
        title: "New Service Offered",
        description: "A description of what you offer and how you deliver maximum value to your clients.",
        iconName: "Globe",
        link: ""
      }
    ]);
  };

  const handleUpdateService = (index: number, fields: Partial<ServiceItem>) => {
    const updated = [...services];
    updated[index] = { ...updated[index], ...fields };
    setServices(updated);
  };

  const handleRemoveService = (index: number) => {
    setServices(services.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setLoading(true);
    setStatusMessage(null);
    try {
      const docRef = doc(db, 'siteConfig', 'services');
      await setDoc(docRef, { services }, { merge: true });
      localStorage.setItem('siteConfig_services', JSON.stringify(services));
      setStatusMessage({ type: 'success', text: 'Services configuration successfully saved and synchronized!' });
    } catch (err: any) {
      console.error('Error saving services data:', err);
      setStatusMessage({ type: 'error', text: `Failed to save changes: ${err?.message || 'Unknown error'}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Overview Card */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-white/5 border border-white/10">
        <div className="flex gap-4 items-start">
          <div className="p-3 bg-cyan-400/10 rounded-xl text-cyan-400 mt-1">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-white mb-1">Dynamic Services Offerings</h4>
            <p className="text-zinc-400 text-xs leading-relaxed max-w-lg">
              Manage the exact services listed on your landing page. Add links to direct clients to custom inquiry forms, sub-pages, or external project references.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleAddService}
          className="flex items-center gap-2 px-5 py-2.5 bg-cyan-400 hover:bg-cyan-300 text-black font-bold rounded-xl text-xs uppercase tracking-wider transition-all self-start md:self-center"
        >
          <Plus className="w-4 h-4" />
          Add Service
        </button>
      </div>

      {/* Services List */}
      <div className="space-y-6">
        {services.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-white/10 rounded-3xl">
            <HelpCircle className="w-10 h-10 text-zinc-500 mx-auto mb-3" />
            <p className="text-zinc-400 text-sm">No services configured. Click "Add Service" to start.</p>
          </div>
        ) : (
          services.map((service, index) => {
            return (
              <div 
                key={index} 
                className="relative p-6 md:p-8 rounded-3xl bg-black/40 border border-white/5 space-y-6 hover:border-white/10 transition-all group"
              >
                {/* Header with Title and Delete Button */}
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-grow">
                    <span className="text-[10px] font-mono font-bold tracking-widest text-zinc-500 uppercase">
                      Service Offering #{index + 1}
                    </span>
                    <input
                      type="text"
                      value={service.title}
                      onChange={(e) => handleUpdateService(index, { title: e.target.value })}
                      placeholder="Service Title (e.g., UI/UX Design)"
                      className="mt-1 block w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-zinc-500 font-bold focus:outline-none focus:border-cyan-400/50"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveService(index)}
                    className="p-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-xl transition-all self-end"
                    title="Delete service offering"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[10px] font-mono font-bold tracking-wider text-zinc-400 uppercase mb-2">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    value={service.description}
                    onChange={(e) => handleUpdateService(index, { description: e.target.value })}
                    placeholder="Describe your workflow and deliverables..."
                    className="block w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-cyan-400/50 resize-none"
                  />
                </div>

                {/* Link and Icon selection in grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Link / URL */}
                  <div>
                    <label className="flex items-center gap-1.5 text-[10px] font-mono font-bold tracking-wider text-zinc-400 uppercase mb-2">
                      <Link2 className="w-3.5 h-3.5 text-zinc-500" />
                      Dynamic Link URL
                    </label>
                    <input
                      type="text"
                      value={service.link || ''}
                      onChange={(e) => handleUpdateService(index, { link: e.target.value })}
                      placeholder="e.g. /contact or https://github.com"
                      className="block w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-cyan-400/50"
                    />
                    <p className="mt-1.5 text-[10px] text-zinc-500 leading-relaxed">
                      Optional URL or local page hash link (e.g. <code>#portfolio</code>). Users will navigate here upon interaction.
                    </p>
                  </div>

                  {/* Icon Selector */}
                  <div>
                    <label className="block text-[10px] font-mono font-bold tracking-wider text-zinc-400 uppercase mb-2">
                      Brand / Category Icon
                    </label>
                    <div className="grid grid-cols-5 gap-2 bg-white/5 p-3 rounded-2xl border border-white/10">
                      {AVAILABLE_ICONS.map((iconOpt) => {
                        const Icon = iconOpt.icon;
                        const isSelected = service.iconName === iconOpt.name;
                        return (
                          <button
                            key={iconOpt.name}
                            type="button"
                            onClick={() => handleUpdateService(index, { iconName: iconOpt.name })}
                            className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
                              isSelected 
                                ? 'bg-cyan-400 text-black font-bold scale-105 shadow-[0_0_10px_rgba(34,211,238,0.3)]' 
                                : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                            }`}
                            title={iconOpt.name}
                          >
                            <Icon className="w-4 h-4 mb-1" />
                            <span className="text-[7px] font-mono tracking-tighter truncate max-w-full">{iconOpt.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Save Button */}
      <div className="flex flex-col gap-4 border-t border-white/10 pt-6">
        {statusMessage && (
          <div className={`p-4 rounded-xl text-xs font-medium ${
            statusMessage.type === 'success' 
              ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' 
              : 'bg-red-500/10 border border-red-500/20 text-red-400'
          }`}>
            {statusMessage.text}
          </div>
        )}
        <button
          type="button"
          disabled={loading}
          onClick={handleSave}
          className="flex items-center justify-center gap-2 w-full py-4 bg-white hover:bg-[#eaeaea] disabled:bg-zinc-700 text-black font-black uppercase tracking-wider rounded-xl text-xs transition-all cursor-pointer"
        >
          <Save className="w-4 h-4" />
          {loading ? 'Saving Services Configuration...' : 'Save Services Configuration'}
        </button>
      </div>
    </div>
  );
};
