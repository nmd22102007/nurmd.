import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import ServicesPage from './pages/Services';
import ToolsPage from './pages/Tools';
import PortfolioPage from './pages/Portfolio';
import ContactPage from './pages/Contact';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { VerifyEmail } from './pages/VerifyEmail';
import { Blog } from './pages/Blog';
import { BlogPost } from './pages/BlogPost';
import { ProjectDetail } from './pages/ProjectDetail';
import { Profile } from './pages/Profile';
import { AdminDashboard } from './pages/AdminDashboard';
import Demo from './pages/Demo';
import { useAuth } from './context/AuthContext';
import { db } from './lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

const ProtectedRoute = ({ children, adminOnly = false }: { children: React.ReactNode, adminOnly?: boolean }) => {
  const { user, loading, isAdmin } = useAuth();
  
  if (loading) return (
    <div className="min-h-screen bg-navy-dark flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
    </div>
  );
  
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && !isAdmin) return <Navigate to="/" />;
  
  return <>{children}</>;
};

function App() {
  useEffect(() => {
    const docRef = doc(db, 'siteConfig', 'theme');
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        const theme = snapshot.data();
        const root = document.documentElement;
        if (theme.background) {
          root.style.setProperty('--background', theme.background);
          root.style.setProperty('--bg-main', theme.background);
        }
        if (theme.primary) {
          root.style.setProperty('--primary', theme.primary);
        }
        if (theme.accent) {
          root.style.setProperty('--color-accent', theme.accent);
          root.style.setProperty('--accent', theme.accent);
          root.style.setProperty('--color-accent-dim', theme.accent + '15');
        }
        if (theme.secondary) {
          root.style.setProperty('--secondary', theme.secondary);
        }
        if (theme.foreground) {
          root.style.setProperty('--foreground', theme.foreground);
          root.style.setProperty('--text-main', theme.foreground);
        }
        if (theme.background && theme.background !== '#020617' && theme.background !== '#09090b') {
          root.style.setProperty('--bg-navy', theme.background + 'e0');
        } else if (theme.background === '#09090b') {
          root.style.setProperty('--bg-navy', '#18181b');
        } else {
          root.style.setProperty('--bg-navy', '#18181b');
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/tools" element={<ToolsPage />} />
      <Route path="/portfolio" element={<PortfolioPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:id" element={<BlogPost />} />
      <Route path="/project/:id" element={<ProjectDetail />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/demo" element={<Demo />} />
      
      {/* Admin Dashboard */}
      <Route 
        path="/admin/*" 
        element={
          <ProtectedRoute adminOnly>
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
      
      {/* Profile */}
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

import { Link } from 'react-router-dom';

export default App;
