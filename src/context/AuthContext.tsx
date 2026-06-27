import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';

interface AuthContextType {
  user: User | null;
  profile: any | null;
  loading: boolean;
  isAdmin: boolean;
  updateLocalProfile: (data: any) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  isAdmin: false,
  updateLocalProfile: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const updateLocalProfile = (data: any) => {
    setProfile((prev: any) => prev ? { ...prev, ...data } : data);
  };

  useEffect(() => {
    let unsubscribeProfile: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const path = `users/${currentUser.uid}`;

        // Ensure user profile document exists in Firestore safely
        try {
          const userRef = doc(db, 'users', currentUser.uid);
          const docSnap = await getDoc(userRef);

          if (!docSnap.exists()) {
            const names = currentUser.displayName ? currentUser.displayName.split(' ') : [];
            const firstName = names[0] || '';
            const lastName = names.slice(1).join(' ') || '';

            await setDoc(userRef, {
              uid: currentUser.uid,
              email: currentUser.email || '',
              displayName: currentUser.displayName || currentUser.email?.split('@')[0] || 'Anonymous',
              firstName,
              lastName,
              photoURL: currentUser.photoURL || '',
              avatarSeed: currentUser.uid,
              avatarUrl: currentUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.uid}`,
              role: (currentUser.email === 'nurmohammad.22.10.2007@gmail.com') ? 'admin' : 'user',
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
              lastLogin: serverTimestamp()
            });
          } else {
            // Already exists, just update lastLogin and updatedAt with merge schema
            await setDoc(userRef, {
              updatedAt: serverTimestamp(),
              lastLogin: serverTimestamp(),
              email: currentUser.email || '',
              displayName: docSnap.data().displayName || currentUser.displayName || currentUser.email?.split('@')[0] || 'Anonymous'
            }, { merge: true });
          }
        } catch (profileErr) {
          console.error("Error ensuring user profile exists during onAuthStateChanged:", profileErr);
        }

        unsubscribeProfile = onSnapshot(doc(db, 'users', currentUser.uid), (docSnap) => {
          if (docSnap.exists()) {
            setProfile(docSnap.data());
          }
          setLoading(false);
        }, (error) => {
          handleFirestoreError(error, OperationType.GET, path);
          setLoading(false);
        });
      } else {
        setProfile(null);
        if (unsubscribeProfile) {
          unsubscribeProfile();
          unsubscribeProfile = null;
        }
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeProfile) {
        unsubscribeProfile();
      }
    };
  }, []);

  const isAdmin = profile?.role === 'admin' || user?.email === 'nurmohammad.22.10.2007@gmail.com';

  return (
    <AuthContext.Provider value={{ user, profile, loading, isAdmin, updateLocalProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
