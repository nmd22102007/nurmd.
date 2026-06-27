import React, { useState, useEffect } from 'react';
import { db } from '../../../lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { 
  Plus, 
  Trash2, 
  Sparkles, 
  Briefcase, 
  Trophy, 
  PlusCircle, 
  Save, 
  Image as ImageIcon, 
  FileText, 
  MapPin, 
  Mail, 
  Phone, 
  Link2 
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

export const AboutEditor = () => {
  const [title, setTitle] = useState('About me');
  const [subtitle, setSubtitle] = useState('A deeper look into my background, creative philosophy, and professional milestones.');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80');
  const [heading, setHeading] = useState('Crafting Digital Realities');
  const [description1, setDescription1] = useState("I'm a passionate digital creator focused on turning ideas into immersive digital experiences. I design and build modern web products that blend technical precision with artistic identity.");
  const [description2, setDescription2] = useState("I believe great design is built on both imagination and discipline. My workflow combines research, modern engineering, and technical aesthetics to deliver elegant, production-ready interfaces.");
  
  // Custom Lists
  const [statistics, setStatistics] = useState<StatItem[]>([
    { value: '5+', label: 'Years of experience' },
    { value: '+150', label: 'Successful projects' },
    { value: '+35', label: 'Happy clients' },
    { value: '98%', label: 'Overall satisfaction' }
  ]);

  const [skills, setSkills] = useState<SkillItem[]>([
    { name: 'UI/UX Design', percentage: 95 },
    { name: 'Frontend Engineering', percentage: 90 },
    { name: '3D & Motion UI', percentage: 85 },
    { name: 'Full-Stack Development', percentage: 80 }
  ]);

  const [timeline, setTimeline] = useState<TimelineItem[]>([
    { year: '2023 - Present', role: 'Lead Web Designer & Developer', company: 'Self-Employed / Freelance', description: 'Architecting high-end creative websites and design systems for global brands and venture startups.' },
    { year: '2021 - 2023', role: 'Senior UX UI Specialist', company: 'Apex Digital Agency', description: 'Spearheaded immersive design interactions and built high-performance responsive web environments.' },
    { year: '2019 - 2021', role: 'Junior Frontend Developer', company: 'Nova Soft BD', description: 'Gained absolute proficiency in modern JS/TS frameworks, responsive layout styling, and client satisfaction.' }
  ]);

  // Contact Info
  const [addressMain, setAddressMain] = useState('Dhaka, Bangladesh');
  const [addressSub, setAddressSub] = useState('Ghatail, Tangail');
  const [emailText, setEmailText] = useState('contact@toxichome.top');
  const [phone1, setPhone1] = useState('+880 13283-29322');
  const [phone2, setPhone2] = useState('+880 17346-92372');

  // CTA Section
  const [ctaHeadline, setCtaHeadline] = useState("Let's connect there");
  const [ctaButtonText, setCtaButtonText] = useState("Let's Connect");
  const [ctaButtonUrl, setCtaButtonUrl] = useState("/contact");

  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const loadAboutData = async () => {
      try {
        const docRef = doc(db, 'siteConfig', 'about');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.title) setTitle(data.title);
          if (data.subtitle) setSubtitle(data.subtitle);
          if (data.imageUrl) setImageUrl(data.imageUrl);
          if (data.heading) setHeading(data.heading);
          if (data.description1) setDescription1(data.description1);
          if (data.description2) setDescription2(data.description2);
          if (Array.isArray(data.statistics)) setStatistics(data.statistics);
          if (Array.isArray(data.skills)) setSkills(data.skills);
          if (Array.isArray(data.timeline)) setTimeline(data.timeline);
          if (data.addressMain) setAddressMain(data.addressMain);
          if (data.addressSub) setAddressSub(data.addressSub);
          if (data.emailText) setEmailText(data.emailText);
          if (data.phone1) setPhone1(data.phone1);
          if (data.phone2) setPhone2(data.phone2);
          if (data.ctaHeadline) setCtaHeadline(data.ctaHeadline);
          if (data.ctaButtonText) setCtaButtonText(data.ctaButtonText);
          if (data.ctaButtonUrl) setCtaButtonUrl(data.ctaButtonUrl);
        }
      } catch (err) {
        console.error('Error loading about data:', err);
      }
    };
    loadAboutData();
  }, []);

  const handleAddField = <T extends any>(list: T[], setList: React.Dispatch<React.SetStateAction<T[]>>, defaultValue: T) => {
    setList([...list, defaultValue]);
  };

  const handleRemoveField = <T extends any>(list: T[], setList: React.Dispatch<React.SetStateAction<T[]>>, index: number) => {
    setList(list.filter((_, i) => i !== index));
  };

  const handleUpdateField = <T extends object>(list: T[], setList: React.Dispatch<React.SetStateAction<T[]>>, index: number, key: keyof T, value: any) => {
    const updated = [...list];
    updated[index] = { ...updated[index], [key]: value };
    setList(updated);
  };

  const handleSaveAll = async () => {
    setLoading(true);
    setStatusMessage(null);
    try {
      const payload = {
        title,
        subtitle,
        imageUrl,
        heading,
        description1,
        description2,
        statistics,
        skills,
        timeline,
        addressMain,
        addressSub,
        emailText,
        phone1,
        phone2,
        ctaHeadline,
        ctaButtonText,
        ctaButtonUrl,
        updatedAt: serverTimestamp()
      };

      await setDoc(doc(db, 'siteConfig', 'about'), payload, { merge: true });
      setStatusMessage({ type: 'success', text: 'About Portfolio content saved successfully!' });
    } catch (e) {
      console.error('Error saving about settings:', e);
      setStatusMessage({ type: 'error', text: 'Failed to update About Portfolio settings.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 text-white">
      {/* Intro Header */}
      <div className="flex justify-between items-start">
        <div>
          <h4 className="text-xl font-bold flex items-center gap-2 text-emerald-400">
            <Sparkles className="w-5 h-5 animate-pulse" />
            Premium About Portfolio Designer
          </h4>
          <p className="text-gray-400 text-xs mt-1">
            Build your high-end professional presence. Add beautiful copy, statistics cards, and chronological milestones. All changes render live.
          </p>
        </div>
        <button
          onClick={handleSaveAll}
          disabled={loading}
          className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] cursor-pointer"
        >
          <Save className="w-4 h-4" />
          {loading ? 'Publishing...' : 'Publish About'}
        </button>
      </div>

      {statusMessage && (
        <div className={`p-4 rounded-xl text-xs font-semibold ${statusMessage.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300' : 'bg-rose-500/10 border border-rose-500/20 text-rose-300'}`}>
          {statusMessage.text}
        </div>
      )}

      {/* Editor Main Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Top Level Copy, Hero Image, and Contact info */}
        <div className="space-y-6">
          <div className="bg-slate-900/30 border border-[#1F2937]/50 p-6 rounded-2xl space-y-4">
            <h5 className="text-sm font-bold text-emerald-400 uppercase tracking-wider border-b border-white/5 pb-2">Page Header Copy</h5>
            <div className="space-y-2">
              <label className="text-xs text-gray-400 font-medium">Large Centered Title</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full bg-[#111] border border-[#222] p-3 rounded-lg text-xs"
                placeholder="About me"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-gray-400 font-medium">Title Subtitle</label>
              <textarea
                value={subtitle}
                onChange={e => setSubtitle(e.target.value)}
                className="w-full bg-[#111] border border-[#222] p-3 rounded-lg text-xs h-20 resize-none"
                placeholder="A deeper look..."
              />
            </div>
          </div>

          <div className="bg-slate-900/30 border border-[#1F2937]/50 p-6 rounded-2xl space-y-4">
            <h5 className="text-sm font-bold text-emerald-400 uppercase tracking-wider border-b border-white/5 pb-2">Hero Narrative</h5>
            <div className="space-y-2">
              <label className="text-xs text-gray-400 font-medium flex items-center gap-1">
                <ImageIcon className="w-3.5 h-3.5 text-gray-500" /> Narrative Image (URL)
              </label>
              <input
                type="text"
                value={imageUrl}
                onChange={e => setImageUrl(e.target.value)}
                className="w-full bg-[#111] border border-[#222] p-3 rounded-lg text-xs text-gray-300"
                placeholder="https://..."
              />
              <div className="h-28 w-full rounded-lg overflow-hidden border border-[#222] mt-2">
                <img src={imageUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80'} alt="Preview" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs text-gray-400 font-medium">Primary Story Heading</label>
              <input
                type="text"
                value={heading}
                onChange={e => setHeading(e.target.value)}
                className="w-full bg-[#111] border border-[#222] p-3 rounded-lg text-xs"
                placeholder="Crafting Digital Realities"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-gray-400 font-medium">Paragraph Copy 1</label>
              <textarea
                value={description1}
                onChange={e => setDescription1(e.target.value)}
                className="w-full bg-[#111] border border-[#222] p-3 rounded-lg text-xs h-24 resize-none"
                placeholder="Enter introduction..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-gray-400 font-medium">Paragraph Copy 2</label>
              <textarea
                value={description2}
                onChange={e => setDescription2(e.target.value)}
                className="w-full bg-[#111] border border-[#222] p-3 rounded-lg text-xs h-24 resize-none"
                placeholder="Enter philosophy..."
              />
            </div>
          </div>

          <div className="bg-slate-900/30 border border-[#1F2937]/50 p-6 rounded-2xl space-y-4">
            <h5 className="text-sm font-bold text-emerald-400 uppercase tracking-wider border-b border-white/5 pb-2">Narrative Metadata & Contact</h5>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs text-gray-400 font-medium flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" /> Address Main
                </label>
                <input
                  type="text"
                  value={addressMain}
                  onChange={e => setAddressMain(e.target.value)}
                  className="w-full bg-[#111] border border-[#222] p-3 rounded-lg text-xs"
                  placeholder="Dhaka, Bangladesh"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-gray-400 font-medium">Address Sub/Secondary</label>
                <input
                  type="text"
                  value={addressSub}
                  onChange={e => setAddressSub(e.target.value)}
                  className="w-full bg-[#111] border border-[#222] p-3 rounded-lg text-xs"
                  placeholder="Ghatail, Tangail"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs text-gray-400 font-medium flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-emerald-400" /> Professional Email
              </label>
              <input
                type="email"
                value={emailText}
                onChange={e => setEmailText(e.target.value)}
                className="w-full bg-[#111] border border-[#222] p-3 rounded-lg text-xs"
                placeholder="contact@toxichome.top"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs text-gray-400 font-medium flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" /> Phone Primary
                </label>
                <input
                  type="text"
                  value={phone1}
                  onChange={e => setPhone1(e.target.value)}
                  className="w-full bg-[#111] border border-[#222] p-3 rounded-lg text-xs"
                  placeholder="+880 13283-29322"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-gray-400 font-medium">Phone Alternate</label>
                <input
                  type="text"
                  value={phone2}
                  onChange={e => setPhone2(e.target.value)}
                  className="w-full bg-[#111] border border-[#222] p-3 rounded-lg text-xs"
                  placeholder="+880 17346-92372"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Statistics, Skills, Timeline, and CTA */}
        <div className="space-y-6">
          {/* Statistics Grid */}
          <div className="bg-slate-900/30 border border-[#1F2937]/50 p-6 rounded-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <h5 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                <Trophy className="w-4 h-4" /> Portfolio Statistics
              </h5>
              <button
                onClick={() => handleAddField(statistics, setStatistics, { value: '+0', label: 'New Metric' })}
                className="text-xs text-emerald-400 hover:text-white flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Stat
              </button>
            </div>
            <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
              {statistics.map((stat, i) => (
                <div key={i} className="flex gap-2 items-center bg-black/40 p-3 rounded-xl border border-white/5">
                  <input
                    type="text"
                    value={stat.value}
                    onChange={e => handleUpdateField(statistics, setStatistics, i, 'value', e.target.value)}
                    className="w-1/3 bg-[#111] border border-[#222] p-2 rounded text-xs text-emerald-300 font-mono font-bold"
                    placeholder="Val (e.g. 5+)"
                  />
                  <input
                    type="text"
                    value={stat.label}
                    onChange={e => handleUpdateField(statistics, setStatistics, i, 'label', e.target.value)}
                    className="flex-1 bg-[#111] border border-[#222] p-2 rounded text-xs text-gray-300"
                    placeholder="Label description"
                  />
                  <button
                    onClick={() => handleRemoveField(statistics, setStatistics, i)}
                    className="p-1 px-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {statistics.length === 0 && (
                <p className="text-xs text-gray-500 text-center py-4">No statistics added. Click "Add Stat" to create one.</p>
              )}
            </div>
          </div>

          {/* Interactive Skills */}
          <div className="bg-slate-900/30 border border-[#1F2937]/50 p-6 rounded-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <h5 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                <Briefcase className="w-4 h-4" /> Skills & Progress
              </h5>
              <button
                onClick={() => handleAddField(skills, setSkills, { name: 'Skills Asset', percentage: 80 })}
                className="text-xs text-emerald-400 hover:text-white flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Skill
              </button>
            </div>
            <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
              {skills.map((skill, i) => (
                <div key={i} className="flex gap-2 items-center bg-black/40 p-3 rounded-xl border border-white/5">
                  <input
                    type="text"
                    value={skill.name}
                    onChange={e => handleUpdateField(skills, setSkills, i, 'name', e.target.value)}
                    className="flex-1 bg-[#111] border border-[#222] p-2 rounded text-xs text-white"
                    placeholder="Skill Tag Name"
                  />
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={skill.percentage}
                    onChange={e => handleUpdateField(skills, setSkills, i, 'percentage', parseInt(e.target.value) || 0)}
                    className="w-20 bg-[#111] border border-[#222] p-2 rounded text-xs text-center font-mono font-bold text-emerald-300"
                    placeholder="90"
                  />
                  <button
                    onClick={() => handleRemoveField(skills, setSkills, i)}
                    className="p-1 px-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {skills.length === 0 && (
                <p className="text-xs text-gray-500 text-center py-4">No skills added. Click "Add Skill" to define custom talents.</p>
              )}
            </div>
          </div>

          {/* Timeline Milestones */}
          <div className="bg-slate-900/30 border border-[#1F2937]/50 p-6 rounded-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <h5 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                <FileText className="w-4 h-4" /> Timeline Milestones
              </h5>
              <button
                onClick={() => handleAddField(timeline, setTimeline, { year: '2024', role: 'Role', company: 'Company LLC', description: 'Describe role' })}
                className="text-xs text-emerald-400 hover:text-white flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Milestone
              </button>
            </div>
            <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
              {timeline.map((item, i) => (
                <div key={i} className="bg-black/40 p-4 rounded-xl border border-white/5 space-y-2 relative group">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-mono text-emerald-300 font-bold">Milestone #{i+1}</span>
                    <button
                      onClick={() => handleRemoveField(timeline, setTimeline, i)}
                      className="text-rose-400 hover:text-rose-300 p-1 rounded hover:bg-rose-500/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={item.year}
                      onChange={e => handleUpdateField(timeline, setTimeline, i, 'year', e.target.value)}
                      className="bg-[#111] border border-[#222] p-2 rounded text-xs text-gray-300"
                      placeholder="Year / Duration (e.g. 2022-Pres)"
                    />
                    <input
                      type="text"
                      value={item.company}
                      onChange={e => handleUpdateField(timeline, setTimeline, i, 'company', e.target.value)}
                      className="bg-[#111] border border-[#222] p-2 rounded text-xs text-gray-300"
                      placeholder="Company"
                    />
                  </div>
                  <input
                    type="text"
                    value={item.role}
                    onChange={e => handleUpdateField(timeline, setTimeline, i, 'role', e.target.value)}
                    className="w-full bg-[#111] border border-[#222] p-2 rounded text-xs text-white"
                    placeholder="Role Title"
                  />
                  <textarea
                    value={item.description}
                    onChange={e => handleUpdateField(timeline, setTimeline, i, 'description', e.target.value)}
                    className="w-full bg-[#111] border border-[#222] p-2 rounded text-xs text-gray-300 h-16 resize-none"
                    placeholder="Milestone outline or contributions..."
                  />
                </div>
              ))}
              {timeline.length === 0 && (
                <p className="text-xs text-gray-500 text-center py-4">No milestone items added. Click "Add Milestone" to populate.</p>
              )}
            </div>
          </div>

          {/* Quick Connect / CTA Settings */}
          <div className="bg-slate-900/30 border border-[#1F2937]/50 p-6 rounded-2xl space-y-4">
            <h5 className="text-sm font-bold text-emerald-400 uppercase tracking-wider border-b border-white/5 pb-2">CTA & Action Controls</h5>
            <div className="space-y-2">
              <label className="text-xs text-gray-400 font-medium">CTA Headline Accent</label>
              <input
                type="text"
                value={ctaHeadline}
                onChange={e => setCtaHeadline(e.target.value)}
                className="w-full bg-[#111] border border-[#222] p-3 rounded-lg text-xs"
                placeholder="Let's connect there"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs text-gray-400 font-medium flex items-center gap-1">
                  <Link2 className="w-3.5 h-3.5 text-emerald-400" /> Action Button Text
                </label>
                <input
                  type="text"
                  value={ctaButtonText}
                  onChange={e => setCtaButtonText(e.target.value)}
                  className="w-full bg-[#111] border border-[#222] p-3 rounded-lg text-xs"
                  placeholder="Let's Connect"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-gray-400 font-medium">Action Target URL</label>
                <input
                  type="text"
                  value={ctaButtonUrl}
                  onChange={e => setCtaButtonUrl(e.target.value)}
                  className="w-full bg-[#111] border border-[#222] p-3 rounded-lg text-xs text-zinc-300"
                  placeholder="/contact"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          onClick={handleSaveAll}
          disabled={loading}
          className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold rounded-2xl text-xs uppercase tracking-widest flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] cursor-pointer"
        >
          <Save className="w-4 h-4" />
          {loading ? 'Publishing settings...' : 'Publish About'}
        </button>
      </div>
    </div>
  );
};
