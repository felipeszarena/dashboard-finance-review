import React, { createContext, useContext, useState, useCallback } from 'react';
import { z } from 'zod';

// Schema definitions
const ProfileSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  type: z.enum(['personal', 'business']),
  settings: z.object({
    currency: z.string(),
    language: z.string(),
    notifications: z.boolean(),
  }),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Profile = z.infer<typeof ProfileSchema>;

interface AuthContextType {
  profile: Profile | null;
  isLoading: boolean;
  error: Error | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<Profile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // TODO: Implement actual authentication logic
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Authentication failed');
      }

      const data = await response.json();
      const validatedProfile = ProfileSchema.parse(data);
      setProfile(validatedProfile);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Authentication failed'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // TODO: Implement actual logout logic
      await fetch('/api/auth/logout', { method: 'POST' });
      setProfile(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Logout failed'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (data: Partial<Profile>) => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (!profile) {
        throw new Error('No profile found');
      }

      // TODO: Implement actual profile update logic
      const response = await fetch(`/api/profile/${profile.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Profile update failed');
      }

      const updatedData = await response.json();
      const validatedProfile = ProfileSchema.parse({
        ...profile,
        ...updatedData,
        updatedAt: new Date().toISOString(),
      });
      
      setProfile(validatedProfile);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Profile update failed'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [profile]);

  return (
    <AuthContext.Provider
      value={{
        profile,
        isLoading,
        error,
        login,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 