import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Minus, Lock, Bot, User as UserIcon, Loader2 } from 'lucide-react';
import { db, auth } from '../lib/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import ReactMarkdown from 'react-markdown';

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { user } = useAuth();

  const playNotificationSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.type = 'sine';
      oscillator.frequency.value = 800;
      gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
      
      oscillator.start();
      gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.5);
      oscillator.stop(audioCtx.currentTime + 0.5);
    } catch (e) {
      console.error("Audio error", e);
    }
  };

  useEffect(() => {
    if (!user) {
      setMessages([]);
      return;
    }

    const chatRef = doc(db, 'user_ai_chats', user.uid);
    const unsubscribe = onSnapshot(chatRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.messages) {
          setMessages(data.messages);
        }
      }
    });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized, isLoading]);

  const handleOpen = () => {
    setIsOpen(true);
    setIsMinimized(false);
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  };

  const handleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error("Error signing in", error);
      if (error?.code === 'auth/network-request-failed' || error?.message?.includes('network-request-failed')) {
        alert("Google login requires third-party cookies or popups, which may be blocked in this preview iframe. Please open the app in a new tab (click the icon in the top right corner) to sign in.");
      } else {
        alert(`Sign in failed: ${error?.message || 'Unknown error'}`);
      }
    }
  };

  const handleSend = async () => {
    if (!inputText.trim() || !user) return;

    const userText = inputText.trim();
    setInputText('');
    
    const newMessages = [...messages, { role: 'user', content: userText }];
    setMessages(newMessages); // Optimistic UI update
    setIsLoading(true);
    
    // Save to Firestore immediately
    try {
      const chatRef = doc(db, 'user_ai_chats', user.uid);
      await setDoc(chatRef, { messages: newMessages }, { merge: true });
    } catch (err) {
      console.error("Failed to save message to Firestore", err);
    }

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages })
      });

      if (!response.ok) throw new Error('Failed to fetch response');
      const data = await response.json();

      const finalMessages = [...newMessages, { role: 'model', content: data.text }];
      setMessages(finalMessages); // Optimistic UI update
      
      // Save AI reply to Firestore
      try {
        const chatRef = doc(db, 'user_ai_chats', user.uid);
        await setDoc(chatRef, { messages: finalMessages }, { merge: true });
      } catch (err) {
        console.error("Failed to save reply to Firestore", err);
      }
      
      if (document.hidden) {
        playNotificationSound();
        if (Notification.permission === "granted") {
          new Notification("New message from AI Assistant", {
            body: data.text.substring(0, 50) + (data.text.length > 50 ? "..." : "")
          });
        } else if (Notification.permission !== "denied") {
          Notification.requestPermission().then(permission => {
            if (permission === "granted") {
              new Notification("New message from AI Assistant", {
                body: data.text.substring(0, 50) + (data.text.length > 50 ? "..." : "")
              });
            }
          });
        }
      }
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      setMessages([...newMessages, { role: 'model', content: "Sorry, I encountered an error connecting to my AI brain. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {(!isOpen || isMinimized) && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={handleOpen}
            className="w-14 h-14 bg-accent hover:bg-white text-black rounded-full shadow-2xl flex items-center justify-center transition-colors relative"
          >
            <Bot className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && !isMinimized && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-0 right-0 w-[380px] bg-slate-950/90 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[600px] max-h-[85vh]"
          >
            {/* Header */}
            <div className="bg-slate-900/80 p-4 flex justify-between items-center border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent relative overflow-hidden">
                  <div className="absolute inset-0 bg-accent/20 animate-pulse" />
                  <Bot className="w-5 h-5 relative z-10" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">AI Assistant</h4>
                  <p className="text-[11px] text-accent flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Online & Ready
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setIsMinimized(true)} className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors">
                  <Minus className="w-4 h-4" />
                </button>
                <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Main Chat Area */}
            <div className="relative flex-1 flex flex-col overflow-hidden">
              {/* Messages Area */}
              <div className={`flex-1 p-4 space-y-6 bg-black/20 ${!user ? 'blur-sm select-none opacity-50 overflow-hidden pointer-events-none' : 'overflow-y-auto scrollbar-none'}`}>
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center">
                      <Bot className="w-8 h-8 text-accent opacity-50" />
                    </div>
                    <p className="text-sm text-center max-w-[200px]">How can I help you today?</p>
                  </div>
                ) : (
                  messages.map((msg, idx) => (
                    <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-slate-800' : 'bg-accent/20 text-accent'}`}>
                        {msg.role === 'user' ? <UserIcon className="w-4 h-4 text-gray-300" /> : <Bot className="w-4 h-4" />}
                      </div>
                      <div className={`p-4 rounded-2xl max-w-[80%] text-sm ${
                        msg.role === 'user' 
                          ? 'bg-slate-800 text-white rounded-tr-sm' 
                          : 'bg-slate-900/80 border border-slate-800 text-gray-200 rounded-tl-sm glass'
                      }`}>
                        {msg.role === 'user' ? (
                          <p className="whitespace-pre-wrap">{msg.content}</p>
                        ) : (
                          <div className="prose prose-invert prose-sm max-w-none">
                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
                {isLoading && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 text-accent">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 rounded-tl-sm glass flex items-center gap-2">
                      <Loader2 className="w-4 h-4 text-accent animate-spin" />
                      <span className="text-xs text-gray-400">AI is thinking...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className={`p-4 bg-slate-900/90 border-t border-slate-800 flex items-end gap-2 backdrop-blur-md ${!user ? 'blur-sm select-none opacity-50 pointer-events-none' : ''}`}>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Message AI Assistant..."
                  disabled={isLoading || !user}
                  className="flex-1 bg-black/40 border border-slate-700 p-3.5 rounded-xl text-sm text-white placeholder:text-gray-500 outline-none focus:border-accent transition-colors disabled:opacity-50 resize-none h-[48px] min-h-[48px] max-h-32"
                />
                <button
                  onClick={handleSend}
                  disabled={!inputText.trim() || isLoading || !user}
                  className="h-[48px] w-12 flex-shrink-0 bg-accent hover:bg-white text-black rounded-xl flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 ml-1" />}
                </button>
              </div>

              {/* Auth Overlay */}
              {!user && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 bg-black/40 backdrop-blur-[2px] animate-in fade-in duration-500">
                  <div className="w-full bg-slate-900/90 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-2xl flex flex-col items-center text-center space-y-5">
                    <div className="w-16 h-16 rounded-2xl bg-black/50 flex items-center justify-center border border-white/5 shadow-inner">
                      <Lock className="w-7 h-7 text-gray-300" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-bold text-white">Sign in to View & Send Messages</h3>
                      <p className="text-xs text-gray-400 leading-relaxed">
                        Create an account or sign in to view conversations, send messages, and access your chat history.
                      </p>
                    </div>
                    <div className="w-full space-y-3 mt-2">
                      <button
                        onClick={handleSignIn}
                        className="w-full bg-accent hover:bg-white text-black font-semibold py-2.5 px-4 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-sm"
                      >
                        Sign In
                      </button>
                      <button
                        onClick={handleSignIn}
                        className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
                      >
                        Create Account
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
