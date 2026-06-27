import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Mail, User, MessageSquare, CheckCircle } from 'lucide-react';
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [contactInfo, setContactInfo] = useState<{email: string, phone: string, location: string} | null>(() => {
    const cached = localStorage.getItem('siteConfig_contact');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        console.error("Error loading cached contact data:", e);
      }
    }
    return null;
  });

  useEffect(() => {
    const loadContact = async () => {
      try {
        const docRef = doc(db, 'siteConfig', 'contact');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const loadedData = docSnap.data() as {email: string, phone: string, location: string};
          setContactInfo(loadedData);
          localStorage.setItem('siteConfig_contact', JSON.stringify(loadedData));
        }
      } catch (e) {
        console.error("Error loading contact section:", e);
      }
    };
    loadContact();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await addDoc(collection(db, 'inquiries'), {
        ...formData,
        status: 'new',
        createdAt: serverTimestamp()
      });
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error("Error submitting inquiry:", error);
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="py-24 px-6 bg-navy-dark relative">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
            Have a project <br />
            <span className="text-white/40">in mind?</span>
          </h2>
          <p className="text-gray-400 text-lg mb-12 max-w-md">
            I'm currently available for freelance work and collaboration.
            Let's build something exceptional together.
          </p>

          <div className="space-y-8">
            <div className="flex items-center space-x-6">
              <div className="p-4 glass rounded-2xl text-accent">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500 uppercase tracking-widest font-bold">Email me at</p>
                <p className="text-xl font-bold">{contactInfo?.email || 'hello@nurmd.dev'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="glass p-8 md:p-12 rounded-[40px] relative overflow-hidden">
          <div className="grid-overlay absolute inset-0 opacity-10 pointer-events-none" />
          
          <AnimatePresence mode="wait">
            {status === 'success' ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="w-20 h-20 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mb-8">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h3 className="text-3xl font-bold mb-4">Message Sent!</h3>
                <p className="text-gray-400 max-w-xs">
                  Thank you for reaching out. I'll get back to you as soon as possible.
                </p>
                <button 
                  onClick={() => setStatus('idle')}
                  className="mt-8 px-6 py-2 glass rounded-full text-sm font-semibold hover:bg-white/10"
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="space-y-6 relative z-10"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs uppercase font-bold tracking-widest text-gray-500">Your Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input 
                        type="text" 
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:border-accent outline-none transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase font-bold tracking-widest text-gray-500">Your Email</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input 
                        type="email" 
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:border-accent outline-none transition-all"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs uppercase font-bold tracking-widest text-gray-500">Subject</label>
                  <input 
                    type="text" 
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 focus:border-accent outline-none transition-all"
                    placeholder="Let's work together"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase font-bold tracking-widest text-gray-500">Message</label>
                  <div className="relative">
                    <MessageSquare className="absolute left-4 top-6 w-4 h-4 text-gray-500" />
                    <textarea 
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      rows={5}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:border-accent outline-none transition-all resize-none"
                      placeholder="Tell me about your project..."
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full bg-accent text-navy-dark font-bold py-4 rounded-2xl flex items-center justify-center space-x-2 hover:bg-white transition-all disabled:opacity-50"
                >
                  {status === 'sending' ? (
                    <div className="w-5 h-5 border-2 border-navy-dark border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Send Message</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
