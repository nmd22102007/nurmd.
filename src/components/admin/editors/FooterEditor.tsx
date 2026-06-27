import React, { useState, useEffect } from 'react';
import { db } from '../../../lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Mail, MapPin, AlignLeft, Globe, HelpCircle, Save } from 'lucide-react';

export const FooterEditor = () => {
  const [connectTitleMain, setConnectTitleMain] = useState('');
  const [connectTitleSpan, setConnectTitleSpan] = useState('');
  const [description, setDescription] = useState('');
  const [playgroundText, setPlaygroundText] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [logoText, setLogoText] = useState('');
  const [statusLabel, setStatusLabel] = useState('');
  const [statusText, setStatusText] = useState('');
  const [copyright, setCopyright] = useState('');
  const [twitterUrl, setTwitterUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const loadFooter = async () => {
      try {
        const docRef = doc(db, 'siteConfig', 'footer');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setConnectTitleMain(data.connectTitleMain || "Let's connect");
          setConnectTitleSpan(data.connectTitleSpan || "there");
          setDescription(data.description || "A web designer and developer building futuristic digital experiences. Let's create something extraordinary together.");
          setPlaygroundText(data.playgroundText || "Try Wave Playground");
          setEmail(data.email || "hello@nurmd.dev");
          setLocation(data.location || "Dhaka, Bangladesh");
          setLogoText(data.logoText || "nurmd");
          setStatusLabel(data.statusLabel || "Recent Status");
          setStatusText(data.statusText || "Designing the future of tech in BD");
          setCopyright(data.copyright || "All rights reserved @toxichome_2026");
          setTwitterUrl(data.twitterUrl || "#");
          setGithubUrl(data.githubUrl || "#");
          setLinkedinUrl(data.linkedinUrl || "#");
        } else {
          // Defaults if no doc exists yet
          setConnectTitleMain("Let's connect");
          setConnectTitleSpan("there");
          setDescription("A web designer and developer building futuristic digital experiences. Let's create something extraordinary together.");
          setPlaygroundText("Try Wave Playground");
          setEmail("hello@nurmd.dev");
          setLocation("Dhaka, Bangladesh");
          setLogoText("nurmd");
          setStatusLabel("Recent Status");
          setStatusText("Designing the future of tech in BD");
          setCopyright("All rights reserved @toxichome_2026");
          setTwitterUrl("#");
          setGithubUrl("#");
          setLinkedinUrl("#");
        }
      } catch (e) {
        console.error("Error loading footer configuration:", e);
      }
    };
    loadFooter();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    setMsg(null);
    try {
      const payload = {
        connectTitleMain,
        connectTitleSpan,
        description,
        playgroundText,
        email,
        location,
        logoText,
        statusLabel,
        statusText,
        copyright,
        twitterUrl,
        githubUrl,
        linkedinUrl,
        updatedAt: serverTimestamp()
      };

      await setDoc(doc(db, 'siteConfig', 'footer'), payload, { merge: true });
      setMsg({ type: 'success', text: 'Footer settings saved successfully!' });
    } catch (e) {
      console.error("Error saving footer section:", e);
      setMsg({ type: 'error', text: 'Failed to update footer configuration.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 text-white">
      <div>
        <h4 className="text-xl font-bold flex items-center gap-2 text-cyan-400">
          <AlignLeft className="w-5 h-5" />
          Footer Content Settings
        </h4>
        <p className="text-gray-400 text-xs mt-1">
          Customize all footer texts, titles, description, logo branding, social links and copyrights.
        </p>
      </div>

      {msg && (
        <div className={`p-4 rounded-xl text-xs font-semibold ${msg.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300' : 'bg-rose-500/10 border border-rose-500/20 text-rose-300'}`}>
          {msg.text}
        </div>
      )}

      <div className="p-6 bg-slate-900/30 rounded-2xl border border-[#1F2937]/50 space-y-6">
        {/* Connection Header Section */}
        <div className="border-b border-white/5 pb-4">
          <h5 className="font-semibold text-sm text-cyan-300 mb-4">Connection Heading</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs text-slate-400 font-medium block">Main Title Phrase</label>
              <input
                type="text"
                value={connectTitleMain}
                onChange={e => setConnectTitleMain(e.target.value)}
                className="w-full bg-[#1F2937] border border-[#374151] p-3 rounded-lg text-xs text-white"
                placeholder="Let's connect"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-slate-400 font-medium block">Sub Highlight Phrase</label>
              <input
                type="text"
                value={connectTitleSpan}
                onChange={e => setConnectTitleSpan(e.target.value)}
                className="w-full bg-[#1F2937] border border-[#374151] p-3 rounded-lg text-xs text-white"
                placeholder="there"
              />
            </div>
          </div>
        </div>

        {/* Brand Information Section */}
        <div className="border-b border-white/5 pb-4">
          <h5 className="font-semibold text-sm text-cyan-300 mb-4">Brand & Status Details</h5>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs text-slate-400 font-medium block">Footer Short Intro</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full bg-[#1F2937] border border-[#374151] p-3 rounded-lg text-xs text-white h-24 resize-none"
                placeholder="Describe your role or mission..."
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs text-slate-400 font-medium block">Playground Call To Action Text</label>
                <input
                  type="text"
                  value={playgroundText}
                  onChange={e => setPlaygroundText(e.target.value)}
                  className="w-full bg-[#1F2937] border border-[#374151] p-3 rounded-lg text-xs text-white"
                  placeholder="Try Wave Playground"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-slate-400 font-medium block">Logo Text (with dot)</label>
                <input
                  type="text"
                  value={logoText}
                  onChange={e => setLogoText(e.target.value)}
                  className="w-full bg-[#1F2937] border border-[#374151] p-3 rounded-lg text-xs text-white"
                  placeholder="nurmd"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs text-slate-400 font-medium block">Status Label</label>
                <input
                  type="text"
                  value={statusLabel}
                  onChange={e => setStatusLabel(e.target.value)}
                  className="w-full bg-[#1F2937] border border-[#374151] p-3 rounded-lg text-xs text-white"
                  placeholder="Recent Status"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-slate-400 font-medium block">Current Status / Quote</label>
                <input
                  type="text"
                  value={statusText}
                  onChange={e => setStatusText(e.target.value)}
                  className="w-full bg-[#1F2937] border border-[#374151] p-3 rounded-lg text-xs text-white"
                  placeholder="Designing the future of tech..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Contact and Copyright Section */}
        <div className="border-b border-white/5 pb-4">
          <h5 className="font-semibold text-sm text-cyan-300 mb-4">Contact Info & copyright</h5>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-xs text-slate-400 font-medium block flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-accent" /> Email Accent
              </label>
              <input
                type="text"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-[#1F2937] border border-[#374151] p-3 rounded-lg text-xs text-white"
                placeholder="hello@nurmd.dev"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-slate-400 font-medium block flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-accent" /> Location Accent
              </label>
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="w-full bg-[#1F2937] border border-[#374151] p-3 rounded-lg text-xs text-white"
                placeholder="Dhaka, Bangladesh"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-slate-400 font-medium block">Copyright Text</label>
              <input
                type="text"
                value={copyright}
                onChange={e => setCopyright(e.target.value)}
                className="w-full bg-[#1F2937] border border-[#374151] p-3 rounded-lg text-xs text-white"
                placeholder="All rights reserved @toxichome_2026"
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div>
          <h5 className="font-semibold text-sm text-cyan-300 mb-4">Social Media Profile Links</h5>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-xs text-slate-400 font-medium block">Twitter / X URL</label>
              <input
                type="text"
                value={twitterUrl}
                onChange={e => setTwitterUrl(e.target.value)}
                className="w-full bg-[#1F2937] border border-[#374151] p-3 rounded-lg text-xs text-white"
                placeholder="#"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-slate-400 font-medium block">GitHub Profile URL</label>
              <input
                type="text"
                value={githubUrl}
                onChange={e => setGithubUrl(e.target.value)}
                className="w-full bg-[#1F2937] border border-[#374151] p-3 rounded-lg text-xs text-white"
                placeholder="#"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-slate-400 font-medium block">LinkedIn Profile URL</label>
              <input
                type="text"
                value={linkedinUrl}
                onChange={e => setLinkedinUrl(e.target.value)}
                className="w-full bg-[#1F2937] border border-[#374151] p-3 rounded-lg text-xs text-white"
                placeholder="#"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          onClick={handleSave}
          disabled={loading}
          className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer"
        >
          <Save className="w-4 h-4" />
          {loading ? 'Saving Layout...' : 'Save Footer Text'}
        </button>
      </div>
    </div>
  );
};
