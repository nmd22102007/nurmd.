import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowLeft, UserPlus, ShieldCheck, RefreshCw, CheckCircle, XCircle, Eye, EyeOff } from 'lucide-react';
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification, signOut } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    securityCode: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const navigate = useNavigate();

  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const generateCaptcha = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*';
    let newCaptcha = '';
    for (let i = 0; i < 6; i++) {
      newCaptcha += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptcha(newCaptcha);
    drawCaptcha(newCaptcha);
  };

  const drawCaptcha = (text: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add some noise lines
    for (let i = 0; i < 5; i++) {
      ctx.strokeStyle = `rgba(34, 211, 238, ${Math.random() * 0.3})`;
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.stroke();
    }

    // Text style
    ctx.font = 'bold 24px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Draw characters with slight rotation
    const charsArr = text.split('');
    const spacing = canvas.width / (charsArr.length + 1);
    
    charsArr.forEach((char, i) => {
      ctx.save();
      ctx.translate((i + 1) * spacing, canvas.height / 2);
      ctx.rotate((Math.random() - 0.5) * 0.4);
      ctx.fillStyle = i % 2 === 0 ? '#22d3ee' : '#ffffff';
      ctx.fillText(char, 0, 0);
      ctx.restore();
    });

    // Add some random dots
    for (let i = 0; i < 30; i++) {
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.2})`;
        ctx.beginPath();
        ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, 1, 0, Math.PI * 2);
        ctx.fill();
    }
  };

  React.useEffect(() => {
    generateCaptcha();
  }, []);

  const getPasswordStrength = (pass: string) => {
    return {
      hasUpper: /[A-Z]/.test(pass),
      hasLower: /[a-z]/.test(pass),
      hasNumber: /[0-9]/.test(pass),
      hasSymbol: /[^A-Za-z0-9]/.test(pass),
      isLongEnough: pass.length >= 8
    };
  };

  const passwordStrength = getPasswordStrength(formData.password);
  const isPasswordStrong = Object.values(passwordStrength).every(Boolean);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.securityCode !== captcha) {
      setError('Invalid security code. Please try again.');
      generateCaptcha();
      return;
    }

    if (!isPasswordStrong) {
      setError('Please ensure your password meets all strength requirements.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      
      const displayName = `${formData.firstName} ${formData.lastName}`.trim();
      await updateProfile(result.user, { displayName });

      await setDoc(doc(db, 'users', result.user.uid), {
        email: formData.email,
        displayName,
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: 'user',
        createdAt: serverTimestamp()
      });

      try {
        await sendEmailVerification(result.user);
        navigate(`/verify-email?email=${encodeURIComponent(formData.email)}`);
      } catch (emailErr: any) {
        console.error('Email verification failed:', emailErr);
        // Even if email fails, account is created, but we should let user know
        navigate(`/verify-email?email=${encodeURIComponent(formData.email)}&error=email_failed`);
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      if (err.code === 'auth/operation-not-allowed') {
        setError('Auth provider not enabled. Please enable "Email/Password" in Firebase Console.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered.');
      } else {
        setError(err.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    setLoading(true);
    setError('');
    try {
      // We need to sign in again to resend verification if we signed out
      // But we don't have the password anymore in state if they navigated away
      // For now, let's just tell them to try logging in which will show the verification error and we can add resend there
      setError('Please try logging in to resend the verification email.');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (isEmailSent) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-20 relative overflow-hidden bg-[#0a0a0a]">
        <div className="grid-overlay absolute inset-0 opacity-5" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-xl w-full bg-[#111111] border border-white/5 p-12 rounded-[40px] relative z-10 shadow-2xl text-center"
        >
          <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-emerald-500/20">
            <Mail className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className="text-3xl font-black mb-4 text-white">Check your email</h2>
          <p className="text-slate-400 mb-8 leading-relaxed">
            We've sent a verification link to <span className="text-white font-bold">{formData.email}</span>. 
            Please verify your email to activate your account.
          </p>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm mb-6">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <Link 
              to="/login"
              className="block w-full bg-accent hover:bg-white text-navy-dark font-bold py-5 rounded-full transition-all duration-300"
            >
              Go to Login
            </Link>
            <div className="flex flex-col space-y-2">
              <button 
                onClick={handleResendEmail}
                disabled={loading}
                className="text-accent hover:text-white transition-colors font-bold uppercase text-[10px] tracking-widest disabled:opacity-50"
              >
                {loading ? 'Sending...' : "Didn't receive email? Resend"}
              </button>
              <button 
                onClick={() => setIsEmailSent(false)}
                className="text-slate-500 hover:text-white transition-colors font-bold uppercase text-[10px] tracking-widest"
              >
                Try another email
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-20 relative overflow-hidden bg-[#0a0a0a]">
      <div className="grid-overlay absolute inset-0 opacity-5" />
      
      <div className="text-center mb-10 relative z-10">
        <h1 className="text-5xl font-black mb-3 text-white">Join us</h1>
        <p className="text-slate-500 font-medium tracking-tight">Create your account for contacting us.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full bg-[#111111] border border-white/5 p-8 md:p-12 rounded-[40px] relative z-10 shadow-2xl"
      >
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative group">
              <input 
                type="text" 
                required
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                className="peer w-full bg-white/[0.03] border border-white/5 rounded-xl py-4 px-5 text-white focus:border-accent outline-none transition-all placeholder:text-transparent"
                placeholder="First name"
              />
              <label 
                htmlFor="firstName"
                className={`absolute left-5 transition-all pointer-events-none text-slate-400 group-focus-within:text-accent ${
                  formData.firstName ? '-top-2.5 left-4 text-[10px] font-bold bg-[#111111] px-2' : 'top-4 text-sm'
                } peer-focus:-top-2.5 peer-focus:left-4 peer-focus:text-[10px] peer-focus:font-bold peer-focus:bg-[#111111] peer-focus:px-2`}
              >
                First name
              </label>
            </div>
            <div className="relative group">
              <input 
                type="text" 
                required
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                className="peer w-full bg-white/[0.03] border border-white/5 rounded-xl py-4 px-5 text-white focus:border-accent outline-none transition-all placeholder:text-transparent"
                placeholder="Last name"
              />
              <label 
                htmlFor="lastName"
                className={`absolute left-5 transition-all pointer-events-none text-slate-400 group-focus-within:text-accent ${
                  formData.lastName ? '-top-2.5 left-4 text-[10px] font-bold bg-[#111111] px-2' : 'top-4 text-sm'
                } peer-focus:-top-2.5 peer-focus:left-4 peer-focus:text-[10px] peer-focus:font-bold peer-focus:bg-[#111111] peer-focus:px-2`}
              >
                Last name
              </label>
            </div>
          </div>

          <div className="relative group">
            <input 
              type="email" 
              required
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="peer w-full bg-white/[0.03] border border-white/5 rounded-xl py-4 px-5 text-white focus:border-accent outline-none transition-all placeholder:text-transparent"
              placeholder="Email address"
            />
            <label 
                htmlFor="email"
                className={`absolute left-5 transition-all pointer-events-none text-slate-400 group-focus-within:text-accent ${
                  formData.email ? '-top-2.5 left-4 text-[10px] font-bold bg-[#111111] px-2' : 'top-4 text-sm'
                } peer-focus:-top-2.5 peer-focus:left-4 peer-focus:text-[10px] peer-focus:font-bold peer-focus:bg-[#111111] peer-focus:px-2`}
              >
                Email address
            </label>
          </div>

          <div className="space-y-4">
            <div className="relative group">
              <input 
                type={showPassword ? "text" : "password"}
                required
                id="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className={`peer w-full bg-white/[0.03] border rounded-xl py-4 px-5 pr-12 text-white focus:border-accent outline-none transition-all placeholder:text-transparent ${
                  formData.password ? (isPasswordStrong ? 'border-emerald-500/30' : 'border-amber-500/30') : 'border-white/5'
                }`}
                placeholder="••••••••"
              />
              <label 
                  htmlFor="password"
                  className={`absolute left-5 transition-all pointer-events-none text-slate-400 group-focus-within:text-accent ${
                    formData.password ? '-top-2.5 left-4 text-[10px] font-bold bg-[#111111] px-2' : 'top-4 text-sm'
                  } peer-focus:-top-2.5 peer-focus:left-4 peer-focus:text-[10px] peer-focus:font-bold peer-focus:bg-[#111111] peer-focus:px-2`}
                >
                  Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-accent p-1 transition-colors"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {formData.password && (
              <div className="grid grid-cols-2 gap-2 px-2">
                <div className={`flex items-center space-x-2 text-[10px] font-bold uppercase tracking-wider ${passwordStrength.hasUpper ? 'text-emerald-400' : 'text-red-400'}`}>
                  {passwordStrength.hasUpper ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3 opacity-50" />}
                  <span>Uppercase</span>
                </div>
                <div className={`flex items-center space-x-2 text-[10px] font-bold uppercase tracking-wider ${passwordStrength.hasLower ? 'text-emerald-400' : 'text-red-400'}`}>
                  {passwordStrength.hasLower ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3 opacity-50" />}
                  <span>Lowercase</span>
                </div>
                <div className={`flex items-center space-x-2 text-[10px] font-bold uppercase tracking-wider ${passwordStrength.hasNumber ? 'text-emerald-400' : 'text-red-400'}`}>
                  {passwordStrength.hasNumber ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3 opacity-50" />}
                  <span>Numbers</span>
                </div>
                <div className={`flex items-center space-x-2 text-[10px] font-bold uppercase tracking-wider ${passwordStrength.hasSymbol ? 'text-emerald-400' : 'text-red-400'}`}>
                  {passwordStrength.hasSymbol ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3 opacity-50" />}
                  <span>Symbols</span>
                </div>
                <div className={`flex items-center space-x-2 text-[10px] font-bold uppercase tracking-wider col-span-2 ${passwordStrength.isLongEnough ? 'text-emerald-400' : 'text-red-400'}`}>
                  {passwordStrength.isLongEnough ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3 opacity-50" />}
                  <span>8+ Characters</span>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-400">Security check</label>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800 rounded-xl flex items-center justify-center h-14 overflow-hidden border border-white/5 relative group/captcha">
                <canvas 
                  ref={canvasRef} 
                  width={200} 
                  height={56} 
                  className="w-full h-full object-cover grayscale opacity-80"
                />
                
                <button 
                  type="button"
                  onClick={generateCaptcha}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-black/40 hover:bg-accent hover:text-navy-dark transition-all opacity-0 group-hover/captcha:opacity-100 z-20 backdrop-blur-md"
                  title="Reload Code"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
              <div className="relative group">
                <input 
                  type="text" 
                  required
                  id="securityCode"
                  value={formData.securityCode}
                  onChange={(e) => setFormData({...formData, securityCode: e.target.value})}
                  className={`peer w-full bg-white/[0.03] border border-white/5 rounded-xl py-4 px-5 pr-12 text-white focus:border-accent outline-none transition-all placeholder:text-transparent font-mono ${
                    formData.securityCode.length > 0
                      ? formData.securityCode === captcha
                        ? 'border-emerald-500/50'
                        : formData.securityCode.length >= captcha.length
                          ? 'border-red-500/50'
                          : ''
                      : ''
                  }`}
                  placeholder="Enter code"
                />
                <label 
                  htmlFor="securityCode"
                  className={`absolute left-5 transition-all pointer-events-none text-slate-400 group-focus-within:text-accent ${
                    formData.securityCode ? '-top-2.5 left-4 text-[10px] font-bold bg-[#111111] px-2' : 'top-4 text-sm'
                  } peer-focus:-top-2.5 peer-focus:left-4 peer-focus:text-[10px] peer-focus:font-bold peer-focus:bg-[#111111] peer-focus:px-2`}
                >
                  Enter code
                </label>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  {formData.securityCode.length > 0 && (
                    formData.securityCode === captcha ? (
                      <CheckCircle className="w-5 h-5 text-emerald-500" />
                    ) : formData.securityCode.length >= captcha.length ? (
                      <XCircle className="w-5 h-5 text-red-500" />
                    ) : null
                  )}
                </div>
              </div>
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-accent hover:bg-white text-navy-dark font-bold py-5 rounded-full flex items-center justify-center space-x-3 transition-all duration-300 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
            ) : (
              <>
                <UserPlus className="w-5 h-5" />
                <span>Create account</span>
              </>
            )}
          </button>
        </form>
      </motion.div>

      <div className="mt-12 text-center relative z-10">
        <p className="text-slate-500 font-medium mb-8">
          Already have an account? <Link to="/login" className="text-white font-bold hover:underline">Sign in</Link>
        </p>
        
        <Link to="/" className="flex items-center justify-center space-x-2 text-slate-400 hover:text-white transition-colors font-bold uppercase text-[10px] tracking-widest">
          <ArrowLeft className="w-3 h-3" />
          <span>Back to website</span>
        </Link>
      </div>
    </div>
  );
};
