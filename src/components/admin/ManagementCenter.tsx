import React from 'react';
import { motion } from 'motion/react';
import { 
  Database, 
  LayoutDashboard, 
  BriefcaseBusiness, 
  Cpu, 
  FolderKanban, 
  FileText, 
  MessageSquare,
  ChevronRight,
  Palette,
  AlignLeft,
  Sparkles
} from 'lucide-react';

const managementCategories = [
  { id: 'theme', title: 'Color Theme', description: 'Customize complete website colors, glows, waves background presets.', icon: Palette, count: 4 },
  { id: 'hero', title: 'Hero Landing', description: 'Manage main landing headlines, counting statistic numbers, action buttons, dynamic image and badges.', icon: Sparkles, count: 11 },
  { id: 'about', title: 'About', description: 'Manage story background narrative, professional profile image, and social milestones.', icon: LayoutDashboard, count: 12 },
  { id: 'footer', title: 'Footer', description: 'Customize footer text, description, links, status, and social profiles.', icon: AlignLeft, count: 13 },
  { id: 'services', title: 'Services', description: 'Add, edit, delete and organize service offerings.', icon: BriefcaseBusiness, count: 6 },
  { id: 'experience', title: 'Experience', description: 'Manage work experience and positions.', icon: Cpu, count: 4 },
  { id: 'tools', title: 'Tools', description: 'Manage development, design, and software tools.', icon: Database, count: 12 },
  { id: 'portfolio', title: 'Portfolio', description: 'Manage projects, images, and demo links.', icon: FolderKanban, count: 16 },
  { id: 'blog', title: 'Blog', description: 'Manage articles, SEO and publishing status.', icon: FileText, count: 4 },
  { id: 'contact', title: 'Contact', description: 'Manage contact info and communication channels.', icon: MessageSquare, count: 1 },
];

export const ManagementCenter = ({ onSelectSection }: { onSelectSection: (id: string) => void }) => {
  return (
    <motion.div
      key="management-center"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="bg-[#0B0B0F]/80 backdrop-blur-md p-8 rounded-3xl border border-[#1F2937]/50">
        <h2 className="text-2xl font-black mb-2">Management Center</h2>
        <p className="text-gray-400 text-sm max-w-xl mb-8">
          Manage and update every section of your website from one place.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {managementCategories.map((cat) => (
            <div key={cat.id} className="bg-black/30 border border-[#1F2937]/50 rounded-2xl p-6 hover:border-cyan-400/30 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-cyan-400/5 flex items-center justify-center mb-4 text-cyan-400">
                <cat.icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors">{cat.title}</h3>
              <p className="text-gray-500 text-xs mb-4">{cat.description}</p>
              <div className="flex justify-between items-center text-[10px] font-mono text-gray-500 uppercase tracking-wider mb-6">
                <span>{cat.count} items</span>
                <span>Last updated 2h ago</span>
              </div>
              <button 
                onClick={() => onSelectSection(cat.id)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white/5 hover:bg-cyan-400 hover:text-black rounded-lg text-xs font-bold uppercase tracking-wider transition-all"
              >
                Manage {cat.title}
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
