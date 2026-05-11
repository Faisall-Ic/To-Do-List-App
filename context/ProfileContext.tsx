import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile } from '../hooks/store';

const PROFILE_KEY = '@mf_profile';

const defaultProfile: UserProfile = {
  name: 'Alex Rivera',
  email: 'alex.rivera@smartnote.ai',
  bio: "Digital Curator & Minimalist Architect. Crafting experiences that breathe in the Digital Atelier. Notes are the seeds of tomorrow's structures.",
  location: 'Copenhagen, DK',
  theme: 'Azure Light',
  isPremium: true,
  memberSince: '2023',
};

interface ProfileContextType {
  profile: UserProfile;
  loading: boolean;
  saveProfile: (updated: UserProfile) => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | null>(null);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(PROFILE_KEY);
        if (stored) setProfile(JSON.parse(stored));
      } catch {
        // use default
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const saveProfile = useCallback(async (updated: UserProfile) => {
    // Update state immediately so UI reflects change right away
    setProfile(updated);
    try {
      await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(updated));
    } catch {
      // silently fail persist
    }
  }, []);

  return (
    <ProfileContext.Provider value={{ profile, loading, saveProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfileContext() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfileContext must be used within ProfileProvider');
  return ctx;
}
