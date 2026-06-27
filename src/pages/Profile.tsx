import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Layout } from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';
import { 
  updatePassword, 
  updateProfile, 
  updateEmail, 
  reauthenticateWithCredential, 
  EmailAuthProvider 
} from 'firebase/auth';
import { 
  User, 
  Lock, 
  Camera, 
  CheckCircle, 
  AlertCircle, 
  Mail, 
  Shield, 
  Smartphone, 
  Fingerprint,
  Monitor,
  ArrowRight,
  ExternalLink,
  Github,
  Twitter,
  Instagram,
  ChevronRight,
  UserCircle,
  X,
  LockKeyhole,
  Eye,
  EyeOff,
  RefreshCw
} from 'lucide-react';
import { AnimatePresence } from 'motion/react';

import { useTheme } from '../context/ThemeContext';

export const Profile = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, profile, updateLocalProfile } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [avatarSeed, setAvatarSeed] = useState('');
  const [loading, setLoading] = useState(false);
  const [showNameModal, setShowNameModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [modalFirstName, setModalFirstName] = useState('');
  const [modalLastName, setModalLastName] = useState('');
  const [modalNewEmail, setModalNewEmail] = useState('');
  const [modalNewPassword, setModalNewPassword] = useState('');
  const [modalConfirmNewPassword, setModalConfirmNewPassword] = useState('');
  const [modalCurrentPassword, setModalCurrentPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  const [savingState, setSavingState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const autoSaveTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const [hasInitialized, setHasInitialized] = useState(false);

  const isDarkMode = theme === 'dark';

  useEffect(() => {
    if (profile && !hasInitialized) {
      setFirstName(profile.firstName || profile.displayName?.split(' ')[0] || '');
      setLastName(profile.lastName || profile.displayName?.split(' ').slice(1).join(' ') || '');
      setAvatarSeed(profile.avatarSeed || user?.uid || 'default');
      setModalFirstName(profile.firstName || profile.displayName?.split(' ')[0] || '');
      setModalLastName(profile.lastName || profile.displayName?.split(' ').slice(1).join(' ') || '');
      setHasInitialized(true);
    }
  }, [profile, hasInitialized, user?.uid]);

  // Cancel timeout on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, []);

  // Debounced auto-save handler for Name & Avatar Seed
  const triggerAutoSave = (fName: string, lName: string, seed: string) => {
    setSavingState('saving');
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }
    autoSaveTimeoutRef.current = setTimeout(async () => {
      if (!auth.currentUser) return;
      try {
        const fullName = `${fName} ${lName}`.trim();
        const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;

        await updateProfile(auth.currentUser, { 
          displayName: fullName,
          photoURL: avatarUrl
        });

        const userRef = doc(db, 'users', auth.currentUser.uid);
        await setDoc(userRef, {
          firstName: fName,
          lastName: lName,
          displayName: fullName,
          avatarSeed: seed,
          avatarUrl,
          email: auth.currentUser.email || '',
          updatedAt: serverTimestamp()
        }, { merge: true });

        setSavingState('saved');
        setTimeout(() => {
          setSavingState((current) => current === 'saved' ? 'idle' : current);
        }, 2000);
      } catch (err: any) {
        console.error('Auto-save error:', err);
        setSavingState('error');
      }
    }, 1000); // 1-second debounce (highly robust and safe for rate limits)
  };

  const handleNameChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      if (auth.currentUser) {
        const fullName = `${modalFirstName} ${modalLastName}`.trim();
        await updateProfile(auth.currentUser, { displayName: fullName });

        const userRef = doc(db, 'users', auth.currentUser.uid);
        try {
          await setDoc(userRef, {
            firstName: modalFirstName,
            lastName: modalLastName,
            displayName: fullName,
            email: auth.currentUser.email || '',
            updatedAt: serverTimestamp()
          }, { merge: true });
        } catch (error) {
          handleFirestoreError(error, OperationType.UPDATE, `users/${auth.currentUser.uid}`);
          throw error;
        }

        setFirstName(modalFirstName);
        setLastName(modalLastName);
        setMessage({ text: 'Name updated successfully!', type: 'success' });
        setShowNameModal(false);
      }
    } catch (err: any) {
      console.error('Name update error:', err);
      setMessage({ text: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateIdentity = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      if (auth.currentUser) {
        const fullName = `${firstName} ${lastName}`.trim();
        const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`;
        
        await updateProfile(auth.currentUser, { 
          displayName: fullName,
          photoURL: avatarUrl
        });

        const userRef = doc(db, 'users', auth.currentUser.uid);
        try {
          await setDoc(userRef, { 
            firstName, 
            lastName, 
            displayName: fullName,
            avatarSeed,
            avatarUrl,
            email: auth.currentUser.email || '',
            updatedAt: serverTimestamp() 
          }, { merge: true });
        } catch (error) {
          handleFirestoreError(error, OperationType.UPDATE, `users/${auth.currentUser.uid}`);
          throw error;
        }
        
        setMessage({ text: 'Identity updated successfully!', type: 'success' });
      }
    } catch (err: any) {
      setMessage({ text: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshAvatar = async () => {
    const randomSeed = Math.random().toString(36).substring(7);
    setLoading(true);
    setSavingState('saving');
    setAvatarSeed(randomSeed);
    updateLocalProfile({
      avatarSeed: randomSeed,
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${randomSeed}`
    });
    
    // Immediately update Firestore for instant global feedback
    if (auth.currentUser) {
      try {
        const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${randomSeed}`;
        const userRef = doc(db, 'users', auth.currentUser.uid);
        await setDoc(userRef, { 
          avatarSeed: randomSeed,
          avatarUrl,
          email: auth.currentUser.email || '',
          updatedAt: serverTimestamp() 
        }, { merge: true });
        
        // Also update the Firebase Auth profile for consistency
        await updateProfile(auth.currentUser, { 
          photoURL: avatarUrl
        });
        setSavingState('saved');
        setTimeout(() => {
          setSavingState((current) => current === 'saved' ? 'idle' : current);
        }, 2000);
      } catch (error) {
        console.error('Error auto-updating avatar:', error);
        setSavingState('error');
        handleFirestoreError(error, OperationType.UPDATE, `users/${auth.currentUser?.uid}`);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
      setSavingState('idle');
    }
  };

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalNewEmail) {
      setMessage({ text: 'Please enter a new email address.', type: 'error' });
      return;
    }
    if (!modalCurrentPassword) {
      setMessage({ text: 'Please enter your current password to update email.', type: 'error' });
      return;
    }

    setLoading(true);
    setMessage(null);
    try {
      if (auth.currentUser && auth.currentUser.email) {
        // Re-authenticate first
        const credential = EmailAuthProvider.credential(auth.currentUser.email, modalCurrentPassword);
        await reauthenticateWithCredential(auth.currentUser, credential);
        
        // Update email
        await updateEmail(auth.currentUser, modalNewEmail);
        
        // Update Firestore
        const userRef = doc(db, 'users', auth.currentUser.uid);
        try {
          await setDoc(userRef, { 
            email: modalNewEmail,
            updatedAt: serverTimestamp() 
          }, { merge: true });
        } catch (error) {
          handleFirestoreError(error, OperationType.UPDATE, `users/${auth.currentUser.uid}`);
          throw error;
        }

        setMessage({ text: 'Email updated successfully!', type: 'success' });
        setModalNewEmail('');
        setModalCurrentPassword('');
        setShowEmailModal(false);
      }
    } catch (err: any) {
      console.error('Email update error:', err);
      if (err.code === 'auth/wrong-password') {
        setMessage({ text: 'Incorrect current password.', type: 'error' });
      } else if (err.code === 'auth/email-already-in-use') {
        setMessage({ text: 'This email is already in use.', type: 'error' });
      } else {
        setMessage({ text: err.message, type: 'error' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (modalNewPassword !== modalConfirmNewPassword) {
      setMessage({ text: "New passwords don't match", type: 'error' });
      return;
    }
    if (!modalCurrentPassword) {
      setMessage({ text: 'Please enter your current password.', type: 'error' });
      return;
    }

    setLoading(true);
    setMessage(null);
    try {
      if (auth.currentUser && auth.currentUser.email) {
        // Re-authenticate first
        const credential = EmailAuthProvider.credential(auth.currentUser.email, modalCurrentPassword);
        await reauthenticateWithCredential(auth.currentUser, credential);
        
        // Update password
        await updatePassword(auth.currentUser, modalNewPassword);
        
        setMessage({ text: 'Password updated successfully!', type: 'success' });
        setModalCurrentPassword('');
        setModalNewPassword('');
        setModalConfirmNewPassword('');
        setShowPasswordModal(false);
      }
    } catch (err: any) {
      console.error('Password update error:', err);
      if (err.code === 'auth/wrong-password') {
        setMessage({ text: 'Incorrect current password.', type: 'error' });
      } else {
        setMessage({ text: err.message, type: 'error' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="pt-40 pb-24 px-6 relative">
        <div className="grid-overlay absolute inset-0 opacity-5 pointer-events-none" />
        
        <div className="max-w-4xl mx-auto relative z-10">
          {/* Header */}
          <div className="mb-12 flex flex-col md:flex-row items-center md:items-end justify-between gap-8">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-3xl overflow-hidden border-2 border-white/5 bg-white/[0.03] flex-shrink-0">
                <motion.img 
                  key={avatarSeed}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`}
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-black text-white mb-2 leading-tight">Profile Settings</h1>
                <p className="text-slate-400">Welcome back, <span className="text-accent font-bold">{profile?.firstName || user?.displayName?.split(' ')[0] || 'User'}</span>. Manage your identity here.</p>
              </div>
            </div>
            <div className="hidden md:block text-right">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 mb-2">Member Since</p>
              <p className="text-sm text-white font-bold">{profile?.createdAt?.toDate ? profile.createdAt.toDate().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'May 2026'}</p>
            </div>
          </div>

          {message && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-6 rounded-3xl mb-12 flex items-center space-x-4 border ${
                message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
              }`}
            >
              {message.type === 'success' ? <CheckCircle className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
              <span className="font-bold">{message.text}</span>
            </motion.div>
          )}

          <div className="space-y-12">
            {/* Section 1: Public Identity */}
            <section className="bg-white/[0.02] border border-white/5 rounded-[32px] overflow-hidden shadow-2xl">
              <div className="p-8 border-b border-white/5 flex items-start space-x-6">
                <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center">
                  <UserCircle className="w-6 h-6 text-slate-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Public identity</h3>
                  <p className="text-sm text-slate-400">How you appear across the platform.</p>
                </div>
              </div>

              <div className="p-8 md:p-12">
                <form onSubmit={handleUpdateIdentity} className="space-y-10">
                  <div className="flex flex-col md:flex-row gap-12 items-start">
                    <div className="relative group mx-auto md:mx-0">
                      <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl overflow-hidden border-2 border-white/5 group-hover:border-accent transition-colors">
                        <motion.img 
                          key={avatarSeed}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`}
                          alt="Avatar" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute -bottom-2 -right-2 flex space-x-2">
                        <button 
                          type="button"
                          onClick={handleRefreshAvatar}
                          className="p-2 bg-accent text-navy-dark rounded-xl shadow-xl hover:scale-110 active:scale-95 transition-all"
                          title="Generate new avatar"
                        >
                          <motion.div
                            animate={loading ? { rotate: 360 } : { rotate: 0 }}
                            transition={{ repeat: loading ? Infinity : 0, duration: 1, ease: "linear" }}
                          >
                            <RefreshCw className="w-4 h-4" />
                          </motion.div>
                        </button>
                      </div>
                    </div>

                    <div className="flex-grow w-full space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-6 bg-white/[0.03] border border-white/5 rounded-2xl focus-within:border-accent transition-colors">
                          <p className="text-[10px] font-black uppercase tracking-widest text-[#a1a1aa] mb-2">First Name</p>
                          <input 
                            type="text" 
                            value={firstName}
                            onChange={(e) => {
                              const val = e.target.value;
                              setFirstName(val);
                              updateLocalProfile({
                                firstName: val,
                                displayName: `${val} ${lastName}`.trim()
                              });
                              triggerAutoSave(val, lastName, avatarSeed);
                            }}
                            className="w-full bg-transparent border-none p-0 text-white font-bold text-sm focus:ring-0 outline-none placeholder:text-slate-700"
                            placeholder="First Name"
                          />
                        </div>

                        <div className="p-6 bg-white/[0.03] border border-white/5 rounded-2xl focus-within:border-accent transition-colors">
                          <p className="text-[10px] font-black uppercase tracking-widest text-[#a1a1aa] mb-2">Last Name</p>
                          <input 
                            type="text" 
                            value={lastName}
                            onChange={(e) => {
                              const val = e.target.value;
                              setLastName(val);
                              updateLocalProfile({
                                lastName: val,
                                displayName: `${firstName} ${val}`.trim()
                              });
                              triggerAutoSave(firstName, val, avatarSeed);
                            }}
                            className="w-full bg-transparent border-none p-0 text-white font-bold text-sm focus:ring-0 outline-none placeholder:text-slate-700"
                            placeholder="Last Name"
                          />
                        </div>

                        <div className="p-6 bg-white/[0.03] border border-white/5 rounded-2xl focus-within:border-accent transition-colors">
                          <p className="text-[10px] font-black uppercase tracking-widest text-[#a1a1aa] mb-2">Avatar Seed</p>
                          <input 
                            type="text" 
                            value={avatarSeed}
                            onChange={(e) => {
                              const val = e.target.value;
                              setAvatarSeed(val);
                              updateLocalProfile({
                                avatarSeed: val,
                                avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${val}`
                              });
                              triggerAutoSave(firstName, lastName, val);
                            }}
                            className="w-full bg-transparent border-none p-0 text-white font-mono text-sm focus:ring-0 outline-none placeholder:text-slate-700"
                            placeholder="Seed"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-end space-x-3 text-xs">
                        {savingState === 'saving' && (
                          <div className="flex items-center space-x-2 text-slate-400 bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                            <RefreshCw className="w-3.5 h-3.5 animate-spin text-accent" />
                            <span className="font-bold text-[10px] uppercase tracking-wider">Saving changes...</span>
                          </div>
                        )}
                        {savingState === 'saved' && (
                          <div className="flex items-center space-x-2 text-emerald-400 bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/20">
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span className="font-bold text-[10px] uppercase tracking-wider">All changes saved automatically</span>
                          </div>
                        )}
                        {savingState === 'error' && (
                          <div className="flex items-center space-x-2 text-red-400 bg-red-500/10 px-4 py-2 rounded-xl border border-red-500/20">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span className="font-bold text-[10px] uppercase tracking-wider">Failed to auto-save</span>
                          </div>
                        )}
                        {savingState === 'idle' && (
                          <div className="flex items-center space-x-2 text-slate-500 bg-white/[0.01] px-4 py-2 rounded-xl border border-white/[0.02]">
                            <CheckCircle className="w-3.5 h-3.5 opacity-40 text-emerald-500" />
                            <span className="font-medium text-[10px] uppercase tracking-wider">Changes saved automatically</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-8 border-t border-white/5">
                    <div className="flex items-center space-x-4">
                      <div className="space-y-1">
                        <p className="font-bold text-white">Appearance</p>
                        <p className="text-xs text-slate-500">Switch between light and dark themes.</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Dark Mode</span>
                      <button 
                        type="button"
                        onClick={toggleTheme}
                        className={`w-14 h-7 rounded-full relative transition-colors duration-300 ${isDarkMode ? 'bg-white' : 'bg-slate-800'}`}
                      >
                        <div className={`absolute top-1 w-5 h-5 rounded-full transition-transform duration-300 ${isDarkMode ? 'translate-x-8 bg-navy-dark' : 'translate-x-1 bg-slate-500'}`} />
                      </button>
                    </div>
                  </div>


                </form>
              </div>
            </section>

            {/* Section 2: Email Account */}
            <section className="bg-white/[0.02] border border-white/5 rounded-[32px] overflow-hidden shadow-2xl">
              <div className="p-8 border-b border-white/5 flex items-start space-x-6">
                <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center">
                  <Mail className="w-6 h-6 text-slate-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Email account</h3>
                  <p className="text-sm text-slate-400">Update your primary login email address.</p>
                </div>
              </div>

              <div className="p-8 md:p-12">
                <div className="space-y-8 max-w-2xl mx-auto">
                  <div className="p-8 bg-white/[0.03] border border-white/5 rounded-3xl flex items-center justify-between group hover:border-white/10 transition-colors">
                    <div className="flex items-center space-x-6">
                      <div className="w-14 h-14 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center">
                        <Mail className="w-7 h-7 text-slate-400 group-hover:text-accent transition-colors" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white mb-1">Primary Email</h4>
                        <p className="text-xs text-slate-500">{user?.email}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        setModalNewEmail(user?.email || '');
                        setShowEmailModal(true);
                      }}
                      className="px-6 py-3 bg-white text-navy-dark font-black rounded-xl hover:bg-accent transition-all text-xs"
                    >
                      Change Email
                    </button>
                  </div>

                  <div className="p-6 bg-accent/5 border border-accent/20 rounded-2xl">
                    <p className="text-[10px] text-accent font-black uppercase tracking-widest mb-2 flex items-center space-x-2">
                      <Shield className="w-3 h-3" />
                      <span>Account Security</span>
                    </p>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Changing your primary email requires re-authentication. Ensure you have access to the new email address to verify your account.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3: Security Credentials */}
            <section className="bg-white/[0.02] border border-white/5 rounded-[32px] overflow-hidden shadow-2xl" id="security">
              <div className="p-8 border-b border-white/5 flex items-start space-x-6">
                <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center">
                  <Fingerprint className="w-6 h-6 text-slate-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Security credentials</h3>
                  <p className="text-sm text-slate-400">Change your password to keep your account secure.</p>
                </div>
              </div>

              <div className="p-8 md:p-12">
                <div className="space-y-8 max-w-2xl mx-auto">
                  <div className="p-8 bg-white/[0.03] border border-white/5 rounded-3xl flex items-center justify-between group hover:border-white/10 transition-colors">
                    <div className="flex items-center space-x-6">
                      <div className="w-14 h-14 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center">
                        <Lock className="w-7 h-7 text-slate-400 group-hover:text-accent transition-colors" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white mb-1">Account Password</h4>
                        <p className="text-xs text-slate-500">Last updated recently</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setShowPasswordModal(true)}
                      className="px-6 py-3 bg-white text-navy-dark font-black rounded-xl hover:bg-accent transition-all text-xs"
                    >
                      Update Password
                    </button>
                  </div>

                  <div className="p-6 bg-accent/5 border border-accent/20 rounded-2xl">
                    <p className="text-[10px] text-accent font-black uppercase tracking-widest mb-2 flex items-center space-x-2">
                      <Shield className="w-3 h-3" />
                      <span>Security Tip</span>
                    </p>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Use a strong password that you don't use elsewhere. We recommend at least 12 characters including symbols and numbers.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 4: Advanced Security */}
            <section className="bg-white/[0.02] border border-white/5 rounded-[32px] overflow-hidden shadow-2xl">
              <div className="p-8 border-b border-white/5 flex items-start space-x-6">
                <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-slate-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Advanced security</h3>
                  <p className="text-sm text-slate-400">Protect your creative work with two-factor authentication.</p>
                </div>
              </div>

              <div className="p-8 md:p-12 space-y-12">
                <div className="p-8 bg-white/[0.03] border border-white/5 rounded-3xl flex items-center justify-between group hover:border-white/10 transition-colors">
                  <div className="flex items-center space-x-6">
                    <div className="w-14 h-14 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center">
                      <Smartphone className="w-7 h-7 text-slate-400" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-3 mb-1">
                        <h4 className="font-bold text-white">Authenticator app</h4>
                        <span className="text-[8px] font-black uppercase tracking-widest py-0.5 px-2 bg-slate-800 text-slate-400 rounded-full border border-white/5">Not active</span>
                      </div>
                      <p className="text-xs text-slate-500">Protect your workspace with mobile verification codes.</p>
                    </div>
                  </div>
                  <button className="px-6 py-3 bg-white text-navy-dark font-black rounded-xl hover:bg-accent transition-all text-xs">
                    Enable now
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center space-x-2 text-slate-500">
                    <Monitor className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Session details</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-white/[0.03] border border-white/5 rounded-2xl">
                      <div className="flex items-center space-x-2 mb-2">
                        <Mail className="w-3 h-3 text-slate-500" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-[#666]">Primary email</span>
                      </div>
                      <p className="text-white font-bold text-sm truncate">{user?.email}</p>
                    </div>
                    <div className="p-6 bg-white/[0.03] border border-white/5 rounded-2xl truncate">
                      <div className="flex items-center space-x-2 mb-2">
                        <Fingerprint className="w-3 h-3 text-slate-500" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-[#666]">Unique account ID</span>
                      </div>
                      <p className="text-white text-[10px] font-mono opacity-50">{user?.uid}</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Footer Contact Banner */}
        <div className="mt-32 border-t border-white/5 pt-32 px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-12">
            <div>
              <h2 className="text-6xl md:text-8xl font-black text-white leading-tight">
                Let's connect <br />
                <span className="text-slate-700 italic font-serif">there</span>
              </h2>
            </div>
            <button className="group flex items-center space-x-4 bg-white/[0.03] border border-white/5 hover:border-white/20 p-4 pl-8 rounded-full transition-all">
              <span className="text-white font-bold uppercase tracking-widest text-sm">Let's Connect</span>
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center group-hover:bg-accent transition-colors">
                <ArrowRight className="w-5 h-5 text-navy-dark" />
              </div>
            </button>
          </div>

          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 mt-32 border-t border-white/5 pt-20">
            <div className="col-span-2 md:col-span-1">
              <h3 className="text-2xl font-black text-white mb-6">nurmd.</h3>
              <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
                A 3D artist transforming ideas into stunning visual realities.
              </p>
              <div className="flex space-x-4 mt-8">
                <a href="#" className="text-slate-500 hover:text-white transition-colors"><Instagram className="w-5 h-5" /></a>
                <a href="#" className="text-slate-500 hover:text-white transition-colors font-bold text-xl leading-none">𝕏</a>
                <a href="#" className="text-slate-500 hover:text-white transition-colors"><Github className="w-5 h-5" /></a>
              </div>
            </div>
            
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-accent mb-6">Address</h4>
              <p className="text-sm text-slate-400 mb-2">Dhaka, Bangladesh</p>
              <p className="text-sm text-slate-400">Ghatail, Tangail</p>
            </div>

            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-accent mb-6">Email address</h4>
              <p className="text-sm text-slate-400">contact@toxic home.top</p>
            </div>

            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-accent mb-6">Phone number</h4>
              <p className="text-sm text-slate-400 mb-2">+880 13283-29322</p>
              <p className="text-sm text-slate-400">+880 17346-92372</p>
            </div>
          </div>

          <div className="text-center mt-20">
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-700">All rights reserved @toxichome_2026</p>
          </div>
        </div>
      </div>

      {/* Name Change Modal */}
      <AnimatePresence>
        {showNameModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowNameModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-[#0d0d0d] border border-white/10 rounded-[40px] overflow-hidden shadow-2xl"
            >
              <div className="p-8 md:p-12">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                      <UserCircle className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Change your name</h3>
                      <p className="text-xs text-slate-500">Update your public identity securely</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowNameModal(false)}
                    className="w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>

                <form onSubmit={handleNameChange} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-black text-slate-500 ml-2">First name</label>
                      <input 
                        required
                        type="text" 
                        value={modalFirstName}
                        onChange={(e) => setModalFirstName(e.target.value)}
                        className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 px-6 text-white focus:border-accent outline-none transition-all placeholder:text-slate-700"
                        placeholder="John"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-black text-slate-500 ml-2">Last name</label>
                      <input 
                        required
                        type="text" 
                        value={modalLastName}
                        onChange={(e) => setModalLastName(e.target.value)}
                        className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 px-6 text-white focus:border-accent outline-none transition-all placeholder:text-slate-700"
                        placeholder="Doe"
                      />
                    </div>
                  </div>



                  <div className="pt-4 flex flex-col space-y-4">
                    <button 
                      type="submit"
                      disabled={loading}
                      className="w-full py-5 bg-white text-navy-dark font-black rounded-2xl hover:bg-accent transition-all duration-300 flex items-center justify-center space-x-3 group"
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-navy-dark border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <CheckCircle className="w-5 h-5" />
                          <span className="text-[10px] uppercase tracking-[0.2em]">Confirm identity change</span>
                        </>
                      )}
                    </button>
                    <button 
                      type="button"
                      onClick={() => setShowNameModal(false)}
                      className="text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-white transition-colors"
                    >
                      Cancel and go back
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Email Change Modal */}
      <AnimatePresence>
        {showEmailModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowEmailModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-[#0d0d0d] border border-white/10 rounded-[40px] overflow-hidden shadow-2xl"
            >
              <div className="p-8 md:p-12">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                      <Mail className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Update Email</h3>
                      <p className="text-xs text-slate-500">Change your primary login address</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowEmailModal(false)}
                    className="w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>

                <form onSubmit={handleUpdateEmail} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-black text-slate-500 ml-2">New Email Address</label>
                    <div className="relative">
                      <input 
                        required
                        type="email" 
                        value={modalNewEmail}
                        onChange={(e) => setModalNewEmail(e.target.value)}
                        className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 px-12 text-white focus:border-accent outline-none transition-all placeholder:text-slate-700"
                        placeholder="new@example.com"
                      />
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-black text-slate-500 ml-2">Current password</label>
                    <div className="relative">
                      <input 
                        required
                        type={showCurrentPassword ? "text" : "password"} 
                        value={modalCurrentPassword}
                        onChange={(e) => setModalCurrentPassword(e.target.value)}
                        className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 px-12 pr-12 text-white focus:border-accent outline-none transition-all placeholder:text-slate-700 font-mono"
                        placeholder="••••••••"
                      />
                      <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors"
                      >
                        {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-[9px] text-slate-500 px-2 leading-relaxed">
                      Enter your current password to authorize this sensitive change.
                    </p>
                  </div>

                  <div className="pt-4 flex flex-col space-y-4">
                    <button 
                      type="submit"
                      disabled={loading}
                      className="w-full py-5 bg-white text-navy-dark font-black rounded-2xl hover:bg-accent transition-all duration-300 flex items-center justify-center space-x-3 group"
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-navy-dark border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <CheckCircle className="w-5 h-5" />
                          <span className="text-[10px] uppercase tracking-[0.2em]">Update Primary Email</span>
                        </>
                      )}
                    </button>
                    <button 
                      type="button"
                      onClick={() => setShowEmailModal(false)}
                      className="text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-white transition-colors"
                    >
                      Cancel and go back
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Password Change Modal */}
      <AnimatePresence>
        {showPasswordModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPasswordModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-[#0d0d0d] border border-white/10 rounded-[40px] overflow-hidden shadow-2xl"
            >
              <div className="p-8 md:p-12">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                      <Lock className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Change Password</h3>
                      <p className="text-xs text-slate-500">Update your security credentials</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowPasswordModal(false)}
                    className="w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>

                <form onSubmit={handleUpdatePassword} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-black text-slate-500 ml-2">Current password</label>
                    <div className="relative">
                      <input 
                        required
                        type={showCurrentPassword ? "text" : "password"} 
                        value={modalCurrentPassword}
                        onChange={(e) => setModalCurrentPassword(e.target.value)}
                        className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 px-12 pr-12 text-white focus:border-accent outline-none transition-all placeholder:text-slate-700 font-mono"
                        placeholder="••••••••"
                      />
                      <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors"
                      >
                        {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-black text-slate-500 ml-2">New Password</label>
                      <div className="relative">
                        <input 
                          required
                          type={showNewPassword ? "text" : "password"} 
                          value={modalNewPassword}
                          onChange={(e) => setModalNewPassword(e.target.value)}
                          className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 px-6 pr-12 text-white focus:border-accent outline-none transition-all placeholder:text-slate-700 font-mono"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors"
                        >
                          {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-black text-slate-500 ml-2">Confirm New</label>
                      <div className="relative">
                        <input 
                          required
                          type={showConfirmPassword ? "text" : "password"} 
                          value={modalConfirmNewPassword}
                          onChange={(e) => setModalConfirmNewPassword(e.target.value)}
                          className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 px-6 pr-12 text-white focus:border-accent outline-none transition-all placeholder:text-slate-700 font-mono"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex flex-col space-y-4">
                    <button 
                      type="submit"
                      disabled={loading}
                      className="w-full py-5 bg-white text-navy-dark font-black rounded-2xl hover:bg-accent transition-all duration-300 flex items-center justify-center space-x-3 group"
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-navy-dark border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <CheckCircle className="w-5 h-5" />
                          <span className="text-[10px] uppercase tracking-[0.2em]">Update Security Key</span>
                        </>
                      )}
                    </button>
                    <button 
                      type="button"
                      onClick={() => setShowPasswordModal(false)}
                      className="text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-white transition-colors"
                    >
                      Cancel and go back
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Layout>
  );
};

