import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { z } from 'zod';

// Schema definitions
const StorageSchema = z.object({
  version: z.string(),
  lastBackup: z.string(),
  data: z.object({
    transactions: z.array(z.any()),
    goals: z.array(z.any()),
    profile: z.object({
      id: z.string(),
      name: z.string(),
      email: z.string(),
      preferences: z.record(z.any()),
    }),
  }),
});

type StorageData = z.infer<typeof StorageSchema>;

interface StorageContextType {
  data: StorageData | null;
  isLoading: boolean;
  error: Error | null;
  saveData: (key: keyof StorageData['data'], value: any) => Promise<void>;
  loadData: (key: keyof StorageData['data']) => Promise<any>;
  createBackup: () => Promise<void>;
  restoreBackup: (backup: StorageData) => Promise<void>;
  clearData: () => Promise<void>;
}

const StorageContext = createContext<StorageContextType | undefined>(undefined);

const STORAGE_KEY = 'finance_dashboard_data';
const BACKUP_KEY = 'finance_dashboard_backup';

export function StorageProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<StorageData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Initialize storage
  useEffect(() => {
    const initializeStorage = async () => {
      try {
        setIsLoading(true);
        const storedData = localStorage.getItem(STORAGE_KEY);
        
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          const validatedData = StorageSchema.parse(parsedData);
          setData(validatedData);
        } else {
          // Initialize with default data
          const defaultData: StorageData = {
            version: '1.0.0',
            lastBackup: new Date().toISOString(),
            data: {
              transactions: [],
              goals: [],
              profile: {
                id: crypto.randomUUID(),
                name: '',
                email: '',
                preferences: {},
              },
            },
          };
          setData(defaultData);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to initialize storage'));
      } finally {
        setIsLoading(false);
      }
    };

    initializeStorage();
  }, []);

  const saveData = useCallback(async (key: keyof StorageData['data'], value: any) => {
    try {
      setIsLoading(true);
      setError(null);

      if (!data) throw new Error('Storage not initialized');

      const updatedData: StorageData = {
        ...data,
        data: {
          ...data.data,
          [key]: value,
        },
      };

      const validatedData = StorageSchema.parse(updatedData);
      setData(validatedData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(validatedData));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to save data'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [data]);

  const loadData = useCallback(async (key: keyof StorageData['data']) => {
    try {
      setIsLoading(true);
      setError(null);

      if (!data) throw new Error('Storage not initialized');
      return data.data[key];
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load data'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [data]);

  const createBackup = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!data) throw new Error('Storage not initialized');

      const backup: StorageData = {
        ...data,
        lastBackup: new Date().toISOString(),
      };

      localStorage.setItem(BACKUP_KEY, JSON.stringify(backup));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create backup'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [data]);

  const restoreBackup = useCallback(async (backup: StorageData) => {
    try {
      setIsLoading(true);
      setError(null);

      const validatedBackup = StorageSchema.parse(backup);
      setData(validatedBackup);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(validatedBackup));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to restore backup'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      localStorage.removeItem(STORAGE_KEY);
      setData(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to clear data'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <StorageContext.Provider
      value={{
        data,
        isLoading,
        error,
        saveData,
        loadData,
        createBackup,
        restoreBackup,
        clearData,
      }}
    >
      {children}
    </StorageContext.Provider>
  );
}

export function useStorage() {
  const context = useContext(StorageContext);
  if (context === undefined) {
    throw new Error('useStorage must be used within a StorageProvider');
  }
  return context;
} 