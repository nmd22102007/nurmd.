import React from 'react';
import { AboutEditor } from './AboutEditor';
import { ContactEditor } from './ContactEditor';
import { ThemeEditor } from './ThemeEditor';
import { FooterEditor } from './FooterEditor';
import { HeroEditor } from './HeroEditor';
import { ServicesEditor } from './ServicesEditor';

export const SectionEditor = ({ sectionId }: { sectionId: string }) => {
  switch (sectionId) {
    case 'hero':
      return <HeroEditor />;
    case 'about':
      return <AboutEditor />;
    case 'contact':
      return <ContactEditor />;
    case 'theme':
      return <ThemeEditor />;
    case 'footer':
      return <FooterEditor />;
    case 'services':
      return <ServicesEditor />;
    default:
      return <div>Editor for {sectionId} coming soon.</div>;
  }
};
