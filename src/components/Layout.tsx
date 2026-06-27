import React from 'react';
import { motion } from 'motion/react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export const Layout: React.FC<{ children: React.ReactNode; hideNavbar?: boolean }> = ({ children, hideNavbar }) => {
  return (
    <div className="min-h-screen relative flex flex-col">
      {!hideNavbar && <Navbar />}
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};
