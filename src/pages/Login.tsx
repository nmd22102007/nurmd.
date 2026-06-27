import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, X, Mail } from 'lucide-react';
import { signInWithEmailAndPassword, signOut, sendEmailVerification, GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<React.ReactNode>('');
  const navigate = useNavigate();

  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState('');
  const [resetError, setResetError] = useState('');

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) {
      setResetError('Please enter your email address.');
      return;
    }
    setResetLoading(true);
    setResetError('');
    setResetSuccess('');
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setResetSuccess('Password reset link sent! Check your inbox.');
      setResetEmail('');
    } catch (err: any) {
      console.error('Password reset error:', err);
      if (err.code === 'auth/user-not-found') {
        setResetError('No account found with this email.');
      } else if (err.code === 'auth/invalid-email') {
        setResetError('Invalid email address.');
      } else {
        setResetError(err.message || 'Failed to send reset link. Please try again.');
      }
    } finally {
      setResetLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      if (!result.user.emailVerified) {
        // Redirect to verify-email page
        navigate(`/verify-email?email=${encodeURIComponent(email)}`);
        return;
      }
      navigate('/');
    } catch (err: any) {
      console.error('Email login error:', err);
      if (err.code === 'auth/operation-not-allowed') {
        setError(
          <div className="space-y-2">
            <p className="font-bold">Authentication failed: Email/Password login is not enabled.</p>
            <p className="text-xs text-red-300">
              Go to your <strong>Firebase Console &gt; Authentication &gt; Sign-in method</strong>, enable <strong>Email/Password</strong> provider, and click Save. Also ensure your Vercel deployment has correct environment variables configured.
            </p>
          </div>
        );
      } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Invalid email or password.');
      } else {
        setError(err.message || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      navigate('/');
    } catch (err: any) {
      console.error('Google login error:', err);
      if (err.code === 'auth/operation-not-allowed') {
        setError(
          <div className="space-y-2 text-left">
            <p className="font-bold text-red-400">Authentication failed: Google provider is not enabled.</p>
            <p className="text-xs text-gray-300 leading-relaxed">
              Go to your <strong>Firebase Console &gt; Authentication &gt; Sign-in method</strong>, add/enable <strong>Google</strong> provider, and click Save.
            </p>
          </div>
        );
      } else if (err.code === 'auth/unauthorized-domain') {
        const currentDomain = window.location.hostname;
        const projectId = auth.app.options.projectId || 'nurmd-top';
        setError(
          <div className="space-y-3 text-left">
            <p className="font-bold text-red-400">Unauthorized Domain Error (auth/unauthorized-domain)</p>
            <p className="text-xs text-gray-300 leading-relaxed">
              This domain (<strong>{currentDomain}</strong>) is not authorized in your Firebase project for authentication.
            </p>
            <div className="text-xs bg-black/40 p-4 rounded-xl border border-white/5 font-mono space-y-2 mt-2 leading-relaxed text-slate-300">
              <p className="font-bold text-accent uppercase tracking-wider text-[10px] mb-1">To fix this in 30 seconds:</p>
              <ol className="list-decimal pl-4 space-y-1.5 text-[11px]">
                <li>Go to the <a href={`https://console.firebase.google.com/project/${projectId}/authentication/providers`} target="_blank" rel="noopener noreferrer" className="underline text-accent hover:text-white font-bold">Firebase Console</a></li>
                <li>Navigate to <strong>Authentication &gt; Settings &gt; Authorized domains</strong></li>
                <li>Click <strong>Add domain</strong></li>
                <li>Paste your active domain: <code className="bg-white/10 px-1.5 py-0.5 rounded text-white font-semibold break-all">{currentDomain}</code></li>
                <li>Click <strong>Add</strong> and try logging in again!</li>
              </ol>
            </div>
          </div>
        );
      } else {
        setError(err.message || 'Google Sign-In failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden bg-navy-dark">
      <div className="grid-overlay absolute inset-0 opacity-10" />
      
      <Link to="/" className="absolute top-12 left-12 flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-bold uppercase tracking-widest">Back to Home</span>
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full glass p-10 md:p-12 rounded-[40px] relative z-10"
      >
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-2">Welcome Back</h1>
          <p className="text-gray-400">Login to access your dashboard</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleEmailLogin} className="space-y-6">
          <div className="relative group">
            <input 
              type="email" 
              required
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="peer w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:border-accent outline-none transition-all placeholder:text-transparent"
              placeholder="Email address"
            />
            <label 
              htmlFor="email"
              className={`absolute left-6 transition-all pointer-events-none text-gray-500 group-focus-within:text-accent ${
                email ? '-top-2.5 left-5 text-[10px] font-bold bg-[#020617] px-2' : 'top-4 text-sm font-bold uppercase tracking-widest'
              } peer-focus:-top-2.5 peer-focus:left-5 peer-focus:text-[10px] peer-focus:font-bold peer-focus:bg-[#020617] peer-focus:px-2`}
            >
              Email Address
            </label>
          </div>

          <div className="relative group">
            <input 
              type={showPassword ? "text" : "password"}
              required
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="peer w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 pr-12 text-white focus:border-accent outline-none transition-all placeholder:text-transparent"
              placeholder="Password"
            />
            <label 
              htmlFor="password"
              className={`absolute left-6 transition-all pointer-events-none text-gray-500 group-focus-within:text-accent ${
                password ? '-top-2.5 left-5 text-[10px] font-bold bg-[#020617] px-[#8px]' : 'top-4 text-sm font-bold uppercase tracking-widest'
              } peer-focus:-top-2.5 peer-focus:left-5 peer-focus:text-[10px] peer-focus:font-bold peer-focus:bg-[#020617] peer-focus:px-2`}
            >
              Password
            </label>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-accent p-1 transition-colors"
                title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <div className="flex justify-end -mt-3">
            <button 
              type="button" 
              onClick={() => {
                setShowResetModal(true);
                setResetSuccess('');
                setResetError('');
              }}
              className="text-[10px] text-accent hover:text-white font-bold tracking-wider uppercase transition-colors font-mono"
            >
              Forgot Password?
            </button>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-accent text-navy-dark font-bold py-4 rounded-2xl hover:bg-white transition-all disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="relative flex py-5 items-center">
          <div className="flex-grow border-t border-white/10"></div>
          <span className="flex-shrink mx-4 text-xs font-mono text-gray-500 uppercase tracking-widest">or</span>
          <div className="flex-grow border-t border-white/10"></div>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full bg-white/5 border border-white/10 text-white font-bold py-4 rounded-2xl hover:bg-white hover:text-navy-dark transition-all flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {/* Custom SVG Google Icon styled with Tailwind */}
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.61c-.3 1.51-1.14 2.78-2.4 3.63v3.01h3.86c2.26-2.08 3.56-5.14 3.56-8.79z" fill="#4285F4"/>
            <path d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3.01c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.11C3.26 21.3 7.31 24 12 24z" fill="#34A853"/>
            <path d="M5.27 14.28c-.25-.72-.39-1.5-.39-2.28s.14-1.56.39-2.28V6.61H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.39l3.98-3.11z" fill="#FBBC05"/>
            <path d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.61l3.98 3.11c.95-2.85 3.6-4.97 6.73-4.97z" fill="#EA4335"/>
          </svg>
          <span>Sign in with Google</span>
        </button>

        <p className="text-center mt-8 text-sm text-gray-500">
          Don't have an account? <Link to="/register" className="text-accent font-bold hover:underline">Register</Link>
        </p>
      </motion.div>

      {/* Forgot Password Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#020617]/80 backdrop-blur-md animate-fade-in">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-md w-full glass p-8 md:p-10 rounded-[40px] relative border border-white/10"
          >
            <button 
              onClick={() => {
                setShowResetModal(false);
                setResetSuccess('');
                setResetError('');
              }}
              className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-8">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent mx-auto mb-4">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Reset Password</h3>
              <p className="text-sm text-gray-400">
                Enter your email address and we'll send you a link to reset your password.
              </p>
            </div>

            {resetError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-xl text-xs mb-6 font-mono">
                {resetError}
              </div>
            )}

            {resetSuccess && (
              <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-xl text-xs mb-6 font-mono">
                {resetSuccess}
              </div>
            )}

            <form onSubmit={handlePasswordReset} className="space-y-6">
              <div className="relative group">
                <input 
                  type="email" 
                  required
                  id="reset-email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="peer w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:border-accent outline-none transition-all placeholder:text-transparent"
                  placeholder="Email address"
                />
                <label 
                  htmlFor="reset-email"
                  className={`absolute left-6 transition-all pointer-events-none text-gray-500 group-focus-within:text-accent ${
                    resetEmail ? '-top-2.5 left-5 text-[10px] font-bold bg-[#020617] px-2' : 'top-4 text-sm font-bold uppercase tracking-widest'
                  } peer-focus:-top-2.5 peer-focus:left-5 peer-focus:text-[10px] peer-focus:font-bold peer-focus:bg-[#020617] peer-focus:px-2`}
                >
                  Email Address
                </label>
              </div>

              <button 
                type="submit"
                disabled={resetLoading}
                className="w-full bg-accent text-navy-dark font-bold py-4 rounded-2xl hover:bg-white transition-all disabled:opacity-50"
              >
                {resetLoading ? "Sending Link..." : "Send Reset Link"}
              </button>
            </form>

            <button
              onClick={() => {
                setShowResetModal(false);
                setResetSuccess('');
                setResetError('');
              }}
              className="w-full mt-6 text-center text-xs text-gray-400 hover:text-accent hover:underline transition-colors font-mono uppercase tracking-wider font-bold"
            >
              Back to Login
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

