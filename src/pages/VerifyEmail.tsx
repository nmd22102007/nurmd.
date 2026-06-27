import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, RefreshCw, ArrowLeft, CheckCircle, LogIn } from 'lucide-react';
import { auth } from '../lib/firebase';
import { sendEmailVerification, signOut } from 'firebase/auth';

export const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const email = searchParams.get('email') || '';
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isResent, setIsResent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [dots, setDots] = useState('');

  // Animation for waiting
  useEffect(() => {
    if (isVerified) return;
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);
    return () => clearInterval(interval);
  }, [isVerified]);

  // Polling to check if email is verified
  useEffect(() => {
    let interval: NodeJS.Timeout;

    const checkVerification = async () => {
      if (!auth.currentUser || isVerified) return;
      
      try {
        await auth.currentUser.reload();
        if (auth.currentUser.emailVerified) {
          setIsVerified(true);
          // Add a small delay for the success feel
          setTimeout(() => navigate('/'), 2000);
        }
      } catch (err) {
        console.error('Error reloading user:', err);
      }
    };

    // Initial check
    checkVerification();

    interval = setInterval(checkVerification, 3000);
    return () => clearInterval(interval);
  }, [navigate]);

  const handleResend = async () => {
    if (!auth.currentUser) {
      setError('Your session has expired. Please log in again to resend the verification email.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await sendEmailVerification(auth.currentUser);
      setIsResent(true);
      setTimeout(() => setIsResent(false), 5000);
    } catch (err: any) {
      setError(err.message || 'Failed to resend verification email.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = async () => {
    await signOut(auth);
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-20 relative overflow-hidden bg-[#0a0a0a]">
      <div className="grid-overlay absolute inset-0 opacity-5" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-xl w-full bg-[#111111] border border-white/5 p-12 rounded-[40px] relative z-10 shadow-2xl text-center"
      >
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8 border transition-all duration-500 ${isVerified ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-accent/10 border-accent/20'}`}>
          {isVerified ? (
            <CheckCircle className="w-10 h-10 text-emerald-400" />
          ) : (
            <Mail className="w-10 h-10 text-accent animate-pulse" />
          )}
          {!isVerified && (
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-accent text-navy-dark rounded-full flex items-center justify-center animate-bounce">
              <span className="text-[10px] font-black">!</span>
            </div>
          )}
        </div>

        <h2 className="text-3xl font-black mb-4 text-white">
          {isVerified ? 'Email Verified!' : 'Verify your account'}
        </h2>
        
        <p className="text-slate-400 mb-2 leading-relaxed">
          {isVerified ? "Your account is now active. Redirecting you home..." : "We've sent a verification link to:"}
        </p>
        
        {!isVerified && (
          <>
            <p className="text-white font-bold text-lg mb-8 bg-white/5 py-2 px-4 rounded-xl inline-block">
              {email || 'your email'}
            </p>

            <div className="flex items-center justify-center space-x-2 text-accent font-bold mb-8">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span className="text-sm uppercase tracking-widest">Waiting for verification{dots}</span>
            </div>

            <p className="text-slate-500 text-sm mb-10">
              Once you click the link in your email, this page will automatically refresh and log you in.
            </p>
          </>
        )}

        {isVerified && (
          <div className="w-full flex justify-center py-10">
            <div className="w-12 h-12 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm mb-6">
            {error}
          </div>
        )}

        {isResent && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-xl text-sm mb-6 flex items-center justify-center space-x-2">
            <CheckCircle className="w-4 h-4" />
            <span>Verification email resent successfully!</span>
          </div>
        )}

        {!isVerified && (
          <div className="space-y-4">
            <button 
              onClick={handleResend}
              disabled={loading}
              className="w-full bg-accent hover:bg-white text-navy-dark font-bold py-5 rounded-full flex items-center justify-center space-x-3 transition-all duration-300 disabled:opacity-50"
            >
              {loading ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <RefreshCw className="w-5 h-5" />
                  <span>Resend Verification Email</span>
                </>
              )}
            </button>

            <button 
              onClick={() => {
                setIsVerified(true);
                setTimeout(() => navigate('/'), 1000);
              }}
              className="w-full border border-teal-500/20 hover:border-teal-400 text-teal-400 bg-teal-950/20 font-bold py-4 rounded-full flex items-center justify-center space-x-2 transition-all duration-300 text-xs uppercase tracking-wider"
            >
              <span>Demo Mode: Skip Verification</span>
            </button>
            
            <div className="flex flex-col space-y-4 pt-4 border-t border-white/5">
              <button 
                onClick={handleBackToLogin}
                className="text-slate-500 hover:text-white transition-colors font-bold uppercase text-[10px] tracking-widest flex items-center justify-center space-x-2 mx-auto"
              >
                <LogIn className="w-3 h-3" />
                <span>Already verified? Log in</span>
              </button>
              
              <button 
                onClick={() => navigate('/register')}
                className="text-slate-500 hover:text-white transition-colors font-bold uppercase text-[10px] tracking-widest flex items-center justify-center space-x-2 mx-auto"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Use a different email</span>
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
