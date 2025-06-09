import { useCallback } from 'react';
import { useStorage } from '../contexts/storage-context';
import { useAuth } from '../contexts/auth-context';

interface ProfilePreferences {
  theme: 'light' | 'dark' | 'system';
  currency: string;
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    reminders: boolean;
  };
}

interface Profile {
  id: string;
  name: string;
  email: string;
  preferences: ProfilePreferences;
}

export function useProfile() {
  const { data: storageData, saveData } = useStorage();
  const { updateProfile: updateAuthProfile } = useAuth();

  const profile = storageData?.data.profile as Profile | undefined;

  const updateProfile = useCallback(async (updates: Partial<Profile>) => {
    if (!profile) throw new Error('Profile not initialized');

    const updatedProfile = {
      ...profile,
      ...updates,
    };

    await saveData('profile', updatedProfile);
    await updateAuthProfile(updatedProfile);
  }, [profile, saveData, updateAuthProfile]);

  const updatePreferences = useCallback(async (updates: Partial<ProfilePreferences>) => {
    if (!profile) throw new Error('Profile not initialized');

    const updatedProfile = {
      ...profile,
      preferences: {
        ...profile.preferences,
        ...updates,
      },
    };

    await saveData('profile', updatedProfile);
  }, [profile, saveData]);

  return {
    profile,
    updateProfile,
    updatePreferences,
  };
} 