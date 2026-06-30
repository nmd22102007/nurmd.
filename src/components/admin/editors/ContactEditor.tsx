import React, { useState, useEffect } from 'react';
import { db } from '../../../lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { 
  Plus, 
  Trash2, 
  Sparkles, 
  Save, 
  HelpCircle,
  Link2,
  Facebook,
  Github,
  Linkedin,
  MessageCircle,
  MessageSquare,
  Hash,
  Twitter,
  Instagram,
  Youtube,
  Globe,
  Mail
} from 'lucide-react';

interface SocialLinkItem {
  name: string;
  iconName: string;
  href: string;
  label: string;
}

const DEFAULT_SOCIAL_LINKS: SocialLinkItem[] = [
  { name: 'WhatsApp', iconName: 'MessageCircle', href: '#', label: 'Direct Chat' },
  { name: 'Facebook', iconName: 'Facebook', href: '#', label: 'Follow' },
  { name: 'GitHub', iconName: 'Github', href: '#', label: 'Code' },
  { name: 'Discord', iconName: 'Hash', href: '#', label: 'Community' },
  { name: 'LinkedIn', iconName: 'Linkedin', href: '#', label: 'Connect' },
  { name: 'Live Chat', iconName: 'MessageSquare', href: '#', label: 'Support' },
];

const AVAILABLE_ICONS = [
  { name: 'Facebook', icon: Facebook },
  { name: 'Github', icon: Github },
  { name: 'Linkedin', icon: Linkedin },
  { name: 'MessageCircle', icon: MessageCircle },
  { name: 'MessageSquare', icon: MessageSquare },
  { name: 'Hash', icon: Hash },
  { name: 'Twitter', icon: Twitter },
  { name: 'Instagram', icon: Instagram },
  { name: 'Youtube', icon: Youtube },
  { name: 'Globe', icon: Globe },
  { name: 'Mail', icon: Mail }
];

export const ContactEditor = () => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [location, setLocation] = useState('');
  const [socialLinks, setSocialLinks] = useState<SocialLinkItem[]>(DEFAULT_SOCIAL_LINKS);
  
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const loadContact = async () => {
      try {
        const docRef = doc(db, 'siteConfig', 'contact');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setEmail(data.email || '');
          setPhone(data.phone || '');
          setWhatsapp(data.whatsapp || '');
          setLocation(data.location || '');
          if (Array.isArray(data.socialLinks)) {
            setSocialLinks(data.socialLinks);
          }
        }
      } catch (e) {
        console.error("Error loading contact section:", e);
      }
    };
    loadContact();
  }, []);

  const handleAddSocialLink = () => {
    setSocialLinks([
      ...socialLinks,
      { name: 'New Link', iconName: 'Globe', href: '#', label: 'Connect' }
    ]);
  };

  const handleUpdateSocialLink = (index: number, fields: Partial<SocialLinkItem>) => {
    const updated = [...socialLinks];
    updated[index] = { ...updated[index], ...fields };
    setSocialLinks(updated);
  };

  const handleRemoveSocialLink = (index: number) => {
    setSocialLinks(socialLinks.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setLoading(true);
    setStatusMessage(null);
    try {
      await setDoc(doc(db, 'siteConfig', 'contact'), {
        email,
        phone,
        whatsapp,
        location,
        socialLinks,
        updatedAt: serverTimestamp()
      }, { merge: true });
      localStorage.setItem('siteConfig_contact', JSON.stringify({ email, phone, whatsapp, location, socialLinks }));
      setStatusMessage({ type: 'success', text: 'Contact configuration successfully saved!' });
    } catch (e: any) {
      console.error("Error saving contact section:", e);
      setStatusMessage({ type: 'error', text: `Failed to save changes: ${e?.message || 'Unknown error'}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Overview Card */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-white/5 border border-white/10">
        <div className="flex gap-4 items-start">
          <div className="p-3 bg-emerald-400/10 rounded-xl text-emerald-400 mt-1">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-white mb-1">Contact & Social Info</h4>
            <p className="text-zinc-400 text-xs leading-relaxed max-w-lg">
              Manage your direct contact info and social media profile links displayed on the contact page.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4 bg-black/40 border border-white/5 p-6 rounded-3xl">
        <h5 className="font-bold text-white mb-4">Direct Contact Information</h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-mono font-bold tracking-widest text-zinc-400 uppercase">Public Email</label>
            <input 
              type="text" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="nurmd.dev@gmail.com" 
              className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-400/50" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-mono font-bold tracking-widest text-zinc-400 uppercase">Direct Phone</label>
            <input 
              type="text" 
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="+880 1700-000000" 
              className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-400/50" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-mono font-bold tracking-widest text-zinc-400 uppercase">WhatsApp Number</label>
            <input 
              type="text" 
              value={whatsapp}
              onChange={e => setWhatsapp(e.target.value)}
              placeholder="+880 1700-000000" 
              className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-400/50" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-mono font-bold tracking-widest text-zinc-400 uppercase">Location</label>
            <input 
              type="text" 
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="Dhaka, Bangladesh" 
              className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-400/50" 
            />
          </div>
        </div>
      </div>

      {/* Social Links List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h5 className="font-bold text-white">Social Connect Links</h5>
          <button
            type="button"
            onClick={handleAddSocialLink}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-400/10 hover:bg-emerald-400/20 text-emerald-400 font-bold rounded-xl text-[10px] uppercase tracking-wider transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Link
          </button>
        </div>
        
        <div className="space-y-4">
          {socialLinks.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-white/10 rounded-3xl">
              <HelpCircle className="w-10 h-10 text-zinc-500 mx-auto mb-3" />
              <p className="text-zinc-400 text-sm">No social links configured.</p>
            </div>
          ) : (
            socialLinks.map((link, index) => {
              return (
                <div 
                  key={index} 
                  className="relative p-6 rounded-3xl bg-black/40 border border-white/5 space-y-4 hover:border-white/10 transition-all"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-grow">
                      <div className="space-y-1">
                         <label className="text-[10px] font-mono font-bold tracking-wider text-zinc-500 uppercase">Platform Name</label>
                         <input
                          type="text"
                          value={link.name}
                          onChange={(e) => handleUpdateSocialLink(index, { name: e.target.value })}
                          placeholder="e.g. WhatsApp"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-emerald-400/50"
                        />
                      </div>
                      <div className="space-y-1">
                         <label className="text-[10px] font-mono font-bold tracking-wider text-zinc-500 uppercase">Action Label</label>
                         <input
                          type="text"
                          value={link.label}
                          onChange={(e) => handleUpdateSocialLink(index, { label: e.target.value })}
                          placeholder="e.g. Direct Chat"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-emerald-400/50"
                        />
                      </div>
                      <div className="space-y-1">
                         <label className="text-[10px] font-mono font-bold tracking-wider text-zinc-500 uppercase flex items-center gap-1"><Link2 className="w-3 h-3"/> URL / Link</label>
                         <input
                          type="text"
                          value={link.href}
                          onChange={(e) => handleUpdateSocialLink(index, { href: e.target.value })}
                          placeholder="https://..."
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-emerald-400/50"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveSocialLink(index)}
                      className="p-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-all self-end"
                      title="Delete link"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Icon Selector */}
                  <div>
                    <label className="block text-[10px] font-mono font-bold tracking-wider text-zinc-500 uppercase mb-2">
                      Icon
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {AVAILABLE_ICONS.map((iconOpt) => {
                        const Icon = iconOpt.icon;
                        const isSelected = link.iconName === iconOpt.name;
                        return (
                          <button
                            key={iconOpt.name}
                            type="button"
                            onClick={() => handleUpdateSocialLink(index, { iconName: iconOpt.name })}
                            className={`flex items-center justify-center p-2 rounded-xl transition-all ${
                              isSelected 
                                ? 'bg-emerald-400 text-black shadow-[0_0_10px_rgba(52,211,153,0.3)]' 
                                : 'text-zinc-400 hover:bg-white/5 border border-white/5'
                            }`}
                            title={iconOpt.name}
                          >
                            <Icon className="w-4 h-4" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
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
          {loading ? 'Saving Contact Configuration...' : 'Save Contact Configuration'}
        </button>
      </div>
    </div>
  );
};
