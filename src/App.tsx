import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import ServicesPage from './pages/Services';
import ExperiencePage from './pages/Experience';
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
import { Preloader } from './components/Preloader';

function RouteManager() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);

    let title = 'nurmd.';
    if (pathname === '/') {
      title = 'nurmd. | Web Designer & Developer';
    } else if (pathname === '/about') {
      title = 'nurmd. | About';
    } else if (pathname === '/services') {
      title = 'nurmd. | Services';
    } else if (pathname === '/experience') {
      title = 'nurmd. | Experience';
    } else if (pathname === '/tools') {
      title = 'nurmd. | Tools';
    } else if (pathname === '/portfolio') {
      title = 'nurmd. | Portfolio';
    } else if (pathname === '/contact') {
      title = 'nurmd. | Contact';
    } else if (pathname === '/blog') {
      title = 'nurmd. | Blog';
    } else if (pathname.startsWith('/blog/')) {
      title = 'nurmd. | Blog Post';
    } else if (pathname.startsWith('/project/')) {
      title = 'nurmd. | Project';
    } else if (pathname === '/login') {
      title = 'nurmd. | Login';
    } else if (pathname === '/register') {
      title = 'nurmd. | Register';
    } else if (pathname === '/verify-email') {
      title = 'nurmd. | Verify Email';
    } else if (pathname.startsWith('/admin')) {
      title = 'nurmd. | Admin';
    } else if (pathname === '/profile') {
      title = 'nurmd. | Profile';
    } else if (pathname === '/demo') {
      title = 'nurmd. | Demo';
    }

    document.title = title;
  }, [pathname]);

  return null;
}

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

const applyTheme = (theme: any) => {
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
};

function App() {
  const [isPreloading, setIsPreloading] = useState(() => {
    return sessionStorage.getItem('has_preloaded') !== 'true';
  });

  useEffect(() => {
    // Apply cached theme immediately to prevent flashing
    const cachedThemeStr = localStorage.getItem('siteConfig_theme');
    if (cachedThemeStr) {
      try {
        const theme = JSON.parse(cachedThemeStr);
        applyTheme(theme);
      } catch (e) {
        console.error("Error applying cached theme:", e);
      }
    }

    const docRef = doc(db, 'siteConfig', 'theme');
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        const theme = snapshot.data();
        applyTheme(theme);
        localStorage.setItem('siteConfig_theme', JSON.stringify(theme));
      }
    });

    return () => unsubscribe();
  }, []);

  const handlePreloadComplete = () => {
    setIsPreloading(false);
    sessionStorage.setItem('has_preloaded', 'true');
  };

  if (isPreloading) {
    return <Preloader onComplete={handlePreloadComplete} />;
  }

  return (
    <>
      <RouteManager />
      <Routes>
        <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/experience" element={<ExperiencePage />} />
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
    </>
  );
}

import { Link } from 'react-router-dom';

export default App;
