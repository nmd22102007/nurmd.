import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Github, Twitter, Linkedin, Mail, MapPin } from 'lucide-react';
import { db } from '../lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

interface FooterData {
  connectTitleMain: string;
  connectTitleSpan: string;
  description: string;
  playgroundText: string;
  email: string;
  location: string;
  logoText: string;
  statusLabel: string;
  statusText: string;
  copyright: string;
  twitterUrl: string;
  githubUrl: string;
  linkedinUrl: string;
}

const defaultFooterData: FooterData = {
  connectTitleMain: "Let's connect",
  connectTitleSpan: "there",
  description: "A web designer and developer building futuristic digital experiences. Let's create something extraordinary together.",
  playgroundText: "Try Wave Playground",
  email: "hello@nurmd.dev",
  location: "Dhaka, Bangladesh",
  logoText: "nurmd",
  statusLabel: "Recent Status",
  statusText: "Designing the future of tech in BD",
  copyright: "All rights reserved @toxichome_2026",
  twitterUrl: "#",
  githubUrl: "#",
  linkedinUrl: "#",
};

export const Footer = () => {
  const [data, setData] = useState<FooterData>(defaultFooterData);

  useEffect(() => {
    const docRef = doc(db, 'siteConfig', 'footer');
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        const fbData = snapshot.data();
        setData({
          connectTitleMain: fbData.connectTitleMain || defaultFooterData.connectTitleMain,
          connectTitleSpan: fbData.connectTitleSpan || defaultFooterData.connectTitleSpan,
          description: fbData.description || defaultFooterData.description,
          playgroundText: fbData.playgroundText || defaultFooterData.playgroundText,
          email: fbData.email || defaultFooterData.email,
          location: fbData.location || defaultFooterData.location,
          logoText: fbData.logoText || defaultFooterData.logoText,
          statusLabel: fbData.statusLabel || defaultFooterData.statusLabel,
          statusText: fbData.statusText || defaultFooterData.statusText,
          copyright: fbData.copyright || defaultFooterData.copyright,
          twitterUrl: fbData.twitterUrl || defaultFooterData.twitterUrl,
          githubUrl: fbData.githubUrl || defaultFooterData.githubUrl,
          linkedinUrl: fbData.linkedinUrl || defaultFooterData.linkedinUrl,
        });
      }
    }, (error) => {
      console.error("Error subscribing to footer configuration:", error);
    });
    return () => unsubscribe();
  }, []);

  return (
    <footer className="relative pt-24 pb-12 px-6 overflow-hidden border-t border-white/5">
      <div className="grid-overlay absolute inset-0 opacity-20 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 mb-16">
          <div className="max-w-xl">
            <h2 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              {data.connectTitleMain} <br />
              <span className="text-gray-500">{data.connectTitleSpan}</span>
            </h2>
            <p className="text-gray-400 text-lg">
              {data.description}
            </p>
            <div className="mt-4">
              <a href="/demo" className="inline-flex items-center gap-2 text-accent text-sm font-medium hover:text-white transition-colors">
                <span>{data.playgroundText} &rarr;</span>
              </a>
            </div>
          </div>
          
          <div className="flex flex-col space-y-6">
            {data.email && (
              <div className="flex items-center space-x-3 text-gray-400">
                <Mail className="w-5 h-5 text-accent" />
                <span>{data.email}</span>
              </div>
            )}
            {data.location && (
              <div className="flex items-center space-x-3 text-gray-400">
                <MapPin className="w-5 h-5 text-accent" />
                <span>{data.location}</span>
              </div>
            )}
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-xl font-black tracking-tighter">
            {data.logoText}<span className="text-accent">.</span>
          </div>
          
          <div className="flex items-center gap-8">
            <div className="hidden md:block text-right">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mb-1">{data.statusLabel}</p>
              <p className="text-sm font-serif italic text-slate-300">"{data.statusText}"</p>
            </div>
            
            <div className="hidden md:block w-px h-10 bg-slate-800" />
 
            <div className="flex space-x-4">
              {data.twitterUrl && data.twitterUrl !== '#' && (
                <SocialIcon icon={<Twitter className="w-5 h-5" />} href={data.twitterUrl} />
              )}
              {data.githubUrl && data.githubUrl !== '#' && (
                <SocialIcon icon={<Github className="w-5 h-5" />} href={data.githubUrl} />
              )}
              {data.linkedinUrl && data.linkedinUrl !== '#' && (
                <SocialIcon icon={<Linkedin className="w-5 h-5" />} href={data.linkedinUrl} />
              )}
            </div>
          </div>

          <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">
            {data.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
};

const SocialIcon = ({ icon, href }: { icon: React.ReactNode, href: string }) => (
  <a 
    href={href} 
    target="_blank"
    rel="noopener noreferrer"
    className="w-10 h-10 rounded-full border border-slate-800 flex items-center justify-center hover:border-accent hover:text-accent transition-all duration-300"
  >
    {icon}
  </a>
);
