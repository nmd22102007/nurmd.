import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '../components/Layout';
import * as Icons from 'lucide-react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  CheckCircle, 
  MessageSquare, 
  Github, 
  Facebook, 
  Linkedin,
  MessageCircle,
  Hash,
  ArrowRight,
  Sparkles,
  Globe
} from 'lucide-react';
import { db } from '../lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

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

export const Contact = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [contactData, setContactData] = useState<{
    email: string;
    phone: string;
    whatsapp: string;
    location: string;
    socialLinks: SocialLinkItem[];
  }>(() => {
    const cached = localStorage.getItem('siteConfig_contact');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        return {
          email: parsed.email || 'nurmd.dev@gmail.com',
          phone: parsed.phone || '+880 1700-000000',
          whatsapp: parsed.whatsapp || '+880 1700-000000',
          location: parsed.location || 'Dhaka, Bangladesh',
          socialLinks: Array.isArray(parsed.socialLinks) ? parsed.socialLinks : DEFAULT_SOCIAL_LINKS
        };
      } catch (e) {
        console.error("Error loading cached contact data:", e);
      }
    }
    return {
      email: 'nurmd.dev@gmail.com',
      phone: '+880 1700-000000',
      whatsapp: '+880 1700-000000',
      location: 'Dhaka, Bangladesh',
      socialLinks: DEFAULT_SOCIAL_LINKS
    };
  });

  useEffect(() => {
    const docRef = doc(db, 'siteConfig', 'contact');
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        const updatedData = {
          email: data.email || 'nurmd.dev@gmail.com',
          phone: data.phone || '+880 1700-000000',
          whatsapp: data.whatsapp || '+880 1700-000000',
          location: data.location || 'Dhaka, Bangladesh',
          socialLinks: Array.isArray(data.socialLinks) ? data.socialLinks : DEFAULT_SOCIAL_LINKS
        };
        setContactData(updatedData);
        localStorage.setItem('siteConfig_contact', JSON.stringify(updatedData));
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSuccess(true);
    setFormState({ name: '', email: '', subject: '', message: '' });
    
    setTimeout(() => setIsSuccess(false), 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({
      ...formState,
      [e.target.id]: e.target.value
    });
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-40 pb-24 px-6 relative overflow-hidden">
        <div className="grid-overlay absolute inset-0 opacity-10 pointer-events-none" />
        
        {/* Animated Background Lights */}
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-accent/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] animate-pulse-slow" />

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-accent/5 border border-accent/20 mb-8"
          >
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">Get In Touch</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-9xl font-black tracking-tighter mb-8 leading-none text-white"
          >
            Contact Me<span className="text-accent">.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            I’m available for freelance projects, collaborations, futuristic web experiences, and creative digital solutions.
          </motion.p>
          
          <div className="w-40 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent mx-auto" />
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left Side: Inquiry Details */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-5"
            >
              <div className="group glass p-10 md:p-12 rounded-[40px] hover:border-accent/40 transition-all duration-500 relative overflow-hidden h-full">
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl group-hover:bg-accent/10 transition-colors" />
                
                <div className="relative z-10">
                  <h2 className="text-3xl font-black text-white mb-6">Inquiry Details</h2>
                  <p className="text-slate-400 mb-12 leading-relaxed">
                    Select your preferred channel to reach out. I aim to respond within 24 hours.
                  </p>

                  <div className="space-y-8">
                    <div className="flex items-center space-x-6 group/item">
                      <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center group-hover/item:border-accent group-hover/item:text-accent transition-all duration-500">
                        <Mail className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Public Email</p>
                        <a href={`mailto:${contactData.email}`} className="text-lg font-bold text-white hover:text-accent transition-colors">{contactData.email}</a>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6 group/item">
                      <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center group-hover/item:border-accent group-hover/item:text-accent transition-all duration-500">
                        <Phone className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Direct Phone</p>
                        <a href={`tel:${contactData.phone.replace(/[^0-9+]/g, '')}`} className="text-lg font-bold text-white hover:text-accent transition-colors">{contactData.phone}</a>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6 group/item">
                      <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center group-hover/item:border-accent group-hover/item:text-accent transition-all duration-500">
                        <MessageCircle className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">WhatsApp</p>
                        <a href={`https://wa.me/${contactData.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-lg font-bold text-white hover:text-accent transition-colors">{contactData.whatsapp}</a>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6 group/item">
                      <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center group-hover/item:border-accent group-hover/item:text-accent transition-all duration-500">
                        <MapPin className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Location</p>
                        <p className="text-lg font-bold text-white">{contactData.location}</p>
                      </div>
                    </div>
                  </div>

                  {/* Availability Badge */}
                  <div className="mt-16 p-8 bg-accent/5 border border-accent/20 rounded-3xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-2 h-full bg-accent/20" />
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="relative">
                        <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                        <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-50" />
                      </div>
                      <h4 className="text-sm font-black uppercase tracking-[0.2em] text-white">Currently Available</h4>
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      Open for freelance projects, collaborations, startup ideas, and modern web development work.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Side: Contact Form */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-7"
            >
              <div className="glass p-10 md:p-12 rounded-[40px] relative overflow-hidden">
                <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Full Name</label>
                      <input 
                        required
                        type="text" 
                        id="name"
                        value={formState.name}
                        onChange={handleChange}
                        placeholder="John Doe" 
                        className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 px-6 text-white focus:border-accent outline-none transition-all placeholder:text-slate-700"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Email Address</label>
                      <input 
                        required
                        type="email" 
                        id="email"
                        value={formState.email}
                        onChange={handleChange}
                        placeholder="john@example.com" 
                        className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 px-6 text-white focus:border-accent outline-none transition-all placeholder:text-slate-700"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Subject</label>
                    <input 
                      required
                      type="text" 
                      id="subject"
                      value={formState.subject}
                      onChange={handleChange}
                      placeholder="Project Inquiry" 
                      className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 px-6 text-white focus:border-accent outline-none transition-all placeholder:text-slate-700"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Message</label>
                    <textarea 
                      required
                      id="message"
                      rows={6}
                      value={formState.message}
                      onChange={handleChange}
                      placeholder="Tell me about your vision..." 
                      className="w-full bg-white/[0.03] border border-white/5 rounded-3xl py-4 px-6 text-white focus:border-accent outline-none transition-all placeholder:text-slate-700 resize-none"
                    />
                  </div>

                  <button 
                    disabled={isSubmitting}
                    className="w-full py-5 bg-white text-navy-dark font-black rounded-full hover:bg-accent transition-all duration-500 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-navy-dark border-t-transparent rounded-full animate-spin" />
                    ) : isSuccess ? (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        <span className="text-[10px] uppercase tracking-[0.2em]">Message Sent</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                        <span className="text-[10px] uppercase tracking-[0.2em]">Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Social Connect Section */}
      <section className="py-24 px-6 bg-navy-dark/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter">Social Connect</h2>
            <div className="w-20 h-1 bg-accent mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {contactData.socialLinks.map((link, index) => {
              const IconComponent = (Icons as any)[link.iconName] || Globe;
              return (
                <motion.a
                  key={link.name + index}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="group glass p-8 rounded-[32px] text-center hover:border-accent/40 hover:-translate-y-2 transition-all duration-500 overflow-hidden relative"
                >
                  <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-accent/5 rounded-full blur-xl group-hover:bg-accent/10 transition-colors" />
                  
                  <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:text-accent group-hover:scale-110 transition-all">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <h4 className="text-md font-bold text-white mb-1">{link.name}</h4>
                  <p className="text-[8px] font-black uppercase tracking-widest text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    {link.label}
                  </p>
                </motion.a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Map Section Placeholder / Futuristic Display */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="relative glass rounded-[60px] h-[500px] overflow-hidden group">
            <div className="absolute inset-0 bg-slate-900/50" />
            
            {/* Styled Map Placeholder */}
            <div className="absolute inset-0 opacity-40">
              <div className="grid-overlay absolute inset-0 mix-blend-overlay" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-accent/10 rounded-full animate-pulse" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-blue-500/10 rounded-full animate-pulse-slow" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-accent/20 rounded-full" />
            </div>

            {/* Animated Pin */}
            <div className="absolute top-[45%] left-[55%] -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="relative">
                <div className="w-4 h-4 bg-accent rounded-full shadow-[0_0_20px_rgba(34,211,238,1)]" />
                <div className="absolute inset-0 bg-accent rounded-full animate-ping" />
              </div>
            </div>

            {/* Map Info Card */}
            <div className="absolute bottom-12 left-12 z-20">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="glass p-8 rounded-[32px] border-accent/30 backdrop-blur-2xl"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center text-accent">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white">Based in {contactData.location.split(',').pop()?.trim() || 'Bangladesh'}</h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{contactData.location}</p>
                  </div>
                </div>
                <p className="text-slate-400 text-sm max-w-[250px] leading-relaxed">
                  Working remotely with teams and clients worldwide.
                </p>
              </motion.div>
            </div>
            
            {/* Visual Atmosphere overlay */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-navy-dark/80 via-transparent to-navy-dark/40" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-accent/5 pointer-events-none" />
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12 relative z-10">
          <div className="max-w-xl text-center md:text-left">
            <h2 className="text-5xl md:text-8xl font-black text-white leading-tight mb-8">
              Let's connect <br />
              <span className="text-slate-600 italic font-serif">there</span>
            </h2>
            <p className="text-slate-400 text-lg">
              Let's build something futuristic together.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group flex items-center space-x-6 bg-white/[0.03] border border-white/10 hover:border-accent/50 p-6 pl-10 rounded-full transition-all backdrop-blur-xl"
          >
            <span className="text-white font-black uppercase tracking-widest text-lg">Start a Project</span>
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center group-hover:bg-accent transition-colors duration-500">
              <ArrowRight className="w-6 h-6 text-navy-dark" />
            </div>
          </motion.button>
        </div>
        
        {/* Floating Background Particles */}
        <div className="absolute top-1/2 left-1/4 w-2 h-2 rounded-full bg-accent/40 animate-float" />
        <div className="absolute top-1/3 right-1/4 w-3 h-3 rounded-full bg-blue-500/30 animate-float-delayed" />
      </section>
    </Layout>
  );
};

export default Contact;
