import React, { createContext, useContext, useEffect, useCallback } from 'react';
import { StorageData, storage, STORAGE_KEYS, DEFAULT_STORAGE_DATA } from './storage';

interface StorageContextType {
  data: StorageData;
  updateData: (newData: Partial<StorageData>) => void;
  resetData: () => void;
  restoreFromBackup: () => void;
}

const StorageContext = createContext<StorageContextType | undefined>(undefined);

export function StorageProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = React.useState<StorageData>(() => {
    if (typeof window === 'undefined') return DEFAULT_STORAGE_DATA;
    
    const savedData = storage.get<StorageData>(STORAGE_KEYS.MAIN);
    return savedData || DEFAULT_STORAGE_DATA;
  });

  // Initialize data on mount
  useEffect(() => {
    const savedData = storage.get<StorageData>(STORAGE_KEYS.MAIN);
    if (savedData) {
      setData(savedData);
    } else {
      storage.set(STORAGE_KEYS.MAIN, DEFAULT_STORAGE_DATA);
    }
  }, []);

  // Setup daily backup
  useEffect(() => {
    const createDailyBackup = () => {
      storage.createBackup();
    };

    // Create backup at midnight
    const now = new Date();
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const timeUntilMidnight = tomorrow.getTime() - now.getTime();

    const backupInterval = setInterval(createDailyBackup, 24 * 60 * 60 * 1000);
    const initialBackupTimeout = setTimeout(createDailyBackup, timeUntilMidnight);

    return () => {
      clearInterval(backupInterval);
      clearTimeout(initialBackupTimeout);
    };
  }, []);

  const updateData = useCallback((newData: Partial<StorageData>) => {
    setData(prevData => {
      const updatedData = {
        ...prevData,
        ...newData,
        lastUpdated: new Date().toISOString(),
      };
      storage.set(STORAGE_KEYS.MAIN, updatedData);
      return updatedData;
    });
  }, []);

  const resetData = useCallback(() => {
    setData(DEFAULT_STORAGE_DATA);
    storage.set(STORAGE_KEYS.MAIN, DEFAULT_STORAGE_DATA);
  }, []);

  const restoreFromBackup = useCallback(() => {
    const backupData = storage.restoreFromBackup();
    if (backupData) {
      setData(backupData);
    }
  }, []);

  return (
    <StorageContext.Provider value={{ data, updateData, resetData, restoreFromBackup }}>
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