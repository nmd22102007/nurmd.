import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Minus } from 'lucide-react';
import { db } from '../lib/firebase';
import { doc, onSnapshot, setDoc, collection, serverTimestamp, updateDoc, arrayUnion } from 'firebase/firestore';

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [chatId, setChatId] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastMessageCountRef = useRef(0);

  useEffect(() => {
    const savedChatId = localStorage.getItem('guest_chat_id');
    if (savedChatId) {
      setChatId(savedChatId);
    }
  }, []);

  const playNotificationSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.type = 'sine';
      oscillator.frequency.value = 600;
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      
      oscillator.start();
      gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.3);
      oscillator.stop(audioCtx.currentTime + 0.3);
    } catch (e) {
      console.error("Audio error", e);
    }
  };

  useEffect(() => {
    if (!chatId) return;

    const unsubscribe = onSnapshot(doc(db, 'inquiries', chatId), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const allMessages = [];
        
        if (data.message) {
          allMessages.push({
            id: 'original',
            text: data.message,
            sender: 'user',
            createdAt: data.createdAt?.toDate?.() || new Date()
          });
        }

        if (data.replies && Array.isArray(data.replies)) {
          data.replies.forEach((reply: any, idx: number) => {
            allMessages.push({
              id: `reply-${idx}`,
              text: reply.text,
              sender: reply.sender,
              createdAt: reply.createdAt ? new Date(reply.createdAt) : new Date()
            });
          });
        }

        setMessages(allMessages);
        
        // Check for new messages from admin
        if (allMessages.length > lastMessageCountRef.current) {
          const latestMessage = allMessages[allMessages.length - 1];
          if (latestMessage.sender === 'admin') {
            if (!isOpen || isMinimized) {
              setUnreadCount(prev => prev + 1);
              playNotificationSound();
            } else {
              playNotificationSound();
            }
          }
        }
        
        lastMessageCountRef.current = allMessages.length;
      }
    });

    return () => unsubscribe();
  }, [chatId, isOpen, isMinimized]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized]);

  const handleOpen = () => {
    setIsOpen(true);
    setIsMinimized(false);
    setUnreadCount(0);
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const textToSend = inputText;
    setInputText('');

    if (!chatId) {
      const newChatRef = doc(collection(db, 'inquiries'));
      const newId = newChatRef.id;
      
      await setDoc(newChatRef, {
        name: 'Guest User',
        email: 'guest@chat.local',
        subject: 'Live Chat',
        message: textToSend,
        status: 'new',
        createdAt: serverTimestamp(),
        replies: []
      });
      
      localStorage.setItem('guest_chat_id', newId);
      setChatId(newId);
    } else {
      try {
        const chatRef = doc(db, 'inquiries', chatId);
        const newReply = {
          text: textToSend,
          sender: 'user',
          createdAt: new Date().toISOString()
        };
        await updateDoc(chatRef, {
          replies: arrayUnion(newReply),
          status: 'new'
        });
      } catch (err) {
        console.error("Failed to send message", err);
      }
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
            <MessageSquare className="w-6 h-6" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-slate-900">
                {unreadCount}
              </span>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && !isMinimized && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-0 right-0 w-[350px] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[500px] max-h-[80vh]"
          >
            {/* Header */}
            <div className="bg-slate-800/80 p-4 flex justify-between items-center border-b border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">Live Support</h4>
                  <p className="text-[10px] text-accent flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Online
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setIsMinimized(true)} className="text-gray-400 hover:text-white p-1 transition-colors">
                  <Minus className="w-4 h-4" />
                </button>
                <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white p-1 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/40">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-3">
                  <MessageSquare className="w-10 h-10 opacity-20" />
                  <p className="text-xs text-center">Send a message to start a conversation with the team.</p>
                </div>
              ) : (
                messages.map((msg, idx) => (
                  <div key={idx} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`${msg.sender === 'user' ? 'bg-accent text-black rounded-tr-sm' : 'bg-slate-800 text-gray-200 rounded-tl-sm'} p-3 rounded-2xl max-w-[85%] text-sm whitespace-pre-wrap`}>
                      {msg.text}
                    </div>
                    <span className="text-[9px] text-gray-500 mt-1 font-mono px-1">
                      {msg.createdAt instanceof Date 
                        ? msg.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                        : typeof msg.createdAt === 'string' 
                          ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                          : 'Just now'}
                    </span>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 bg-slate-800/80 border-t border-slate-700 flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Type your message..."
                className="flex-1 bg-black/40 border border-slate-700 p-3 rounded-xl text-sm text-gray-300 outline-none focus:border-accent transition-colors"
              />
              <button
                onClick={handleSend}
                disabled={!inputText.trim()}
                className="w-12 flex-shrink-0 bg-accent hover:bg-white text-black rounded-xl flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <Send className="w-4 h-4 ml-1" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
