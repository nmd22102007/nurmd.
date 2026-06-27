import React, { useState, useEffect } from 'react';
import { db } from '../../../lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export const ContactEditor = () => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadContact = async () => {
      try {
        const docRef = doc(db, 'siteConfig', 'contact');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setEmail(data.email || '');
          setPhone(data.phone || '');
          setLocation(data.location || '');
        }
      } catch (e) {
        console.error("Error loading contact section:", e);
      }
    };
    loadContact();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      await setDoc(doc(db, 'siteConfig', 'contact'), {
        email,
        phone,
        location,
        updatedAt: serverTimestamp()
      }, { merge: true });
      alert("Saved!");
    } catch (e) {
      console.error("Error saving contact section:", e);
      alert("Error saving.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-bold text-white">Edit Contact Information</h4>
      <div className="space-y-2">
        <label className="text-xs text-gray-400">Public Email</label>
        <input 
          type="text" 
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="nurmd.dev@gmail.com" 
          className="w-full bg-[#1F2937] border border-[#374151] p-3 rounded-lg text-white" 
        />
      </div>
      <div className="space-y-2">
        <label className="text-xs text-gray-400">Direct Phone</label>
        <input 
          type="text" 
          value={phone}
          onChange={e => setPhone(e.target.value)}
          placeholder="+880 1700-000000" 
          className="w-full bg-[#1F2937] border border-[#374151] p-3 rounded-lg text-white" 
        />
      </div>
      <div className="space-y-2">
        <label className="text-xs text-gray-400">Location</label>
        <input 
          type="text" 
          value={location}
          onChange={e => setLocation(e.target.value)}
          placeholder="Dhaka, Bangladesh" 
          className="w-full bg-[#1F2937] border border-[#374151] p-3 rounded-lg text-white" 
        />
      </div>
      <button 
        onClick={handleSave} 
        disabled={loading}
        className="bg-cyan-500 text-black px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-cyan-400 transition-colors"
      >
        {loading ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  );
};
