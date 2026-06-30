import React from 'react';
import { motion } from 'motion/react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export const Layout: React.FC<{ children: React.ReactNode; hideNavbar?: boolean; hideFooter?: boolean }> = ({ children, hideNavbar, hideFooter }) => {
  return (
    <div className="min-h-screen relative flex flex-col">
      {!hideNavbar && <Navbar />}
      <main className="flex-grow">
        {children}
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
};
