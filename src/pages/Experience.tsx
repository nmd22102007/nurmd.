import React from 'react';
import { motion } from 'motion/react';
import { Layout } from '../components/Layout';

const ExperienceItem = ({ period, role, description, isLast }: any) => (
  <div className={`py-10 flex flex-col md:flex-row md:items-center justify-between gap-6 group ${!isLast ? 'border-b border-white/5' : ''}`}>
    <div className="flex-1 pr-0 md:pr-12">
      <h3 className="text-xl md:text-2xl font-medium text-white mb-3">{role}</h3>
      <p className="text-gray-400 text-sm md:text-base leading-relaxed">{description}</p>
    </div>
    <div className="text-gray-300 font-light text-2xl md:text-3xl shrink-0 mt-2 md:mt-0">
      {period}
    </div>
  </div>
);

const Experience = () => {
  return (
    <Layout>
      <section className="pt-40 pb-24 px-6 min-h-[80vh] flex flex-col justify-center bg-[#151515]">
        <div className="max-w-4xl mx-auto w-full">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-medium text-white mb-4">My Experience</h1>
            <p className="text-gray-400 text-lg">A yearly snapshot of my creative and professional growth.</p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col"
          >
            <ExperienceItem 
              period="2024 - Present" 
              role="Freelance Technical SEO Specialist" 
              description="Executing technical SEO audits and server-side optimizations to boost search rankings and increase organic digital visibility."
            />
            <ExperienceItem 
              period="2023 - Present" 
              role="Freelance Web Developer & AI Automation Engineer" 
              description="Building responsive web applications and creating custom Python bots to integrate local AI models for automated workflows."
            />
            <ExperienceItem 
              period="2022 - Present" 
              role="Freelance 3D Artist & Video Editor" 
              description="Creating immersive 3D models in Blender and delivering polished, dynamic video edits and VFX using After Effects."
            />
            <ExperienceItem 
              period="2021 - Present" 
              role="Freelance Graphic Designer" 
              description="Designing high-resolution visual assets, digital illustrations, and cohesive branding materials tailored for both web and print."
              isLast={true}
            />
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Experience;
