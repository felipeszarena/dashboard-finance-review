import { z } from 'zod';
import { useAutoSave } from '../hooks/useAutoSave';

// Storage keys
export const STORAGE_KEYS = {
  MAIN: 'finance-dashboard-data',
  BACKUP: 'finance-dashboard-backup',
} as const;

// Data structure schema
export const StorageSchema = z.object({
  version: z.number(),
  lastUpdated: z.string(),
  transactions: z.array(z.any()),
  goals: z.array(z.any()),
  profile: z.object({}).passthrough(),
  settings: z.object({}).passthrough(),
});

export type StorageData = z.infer<typeof StorageSchema>;

// Default data structure
export const DEFAULT_STORAGE_DATA: StorageData = {
  version: 1,
  lastUpdated: new Date().toISOString(),
  transactions: [],
  goals: [],
  profile: {},
  settings: {},
};

// Error handling
export class StorageError extends Error {
  constructor(message: string, public cause?: unknown) {
    super(message);
    this.name = 'StorageError';
  }
}

// Storage utilities
export const storage = {
  get: <T>(key: string): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error reading from localStorage: ${key}`, error);
      return null;
    }
  },

  set: (key: string, value: unknown): void => {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
    } catch (error) {
      throw new StorageError(`Error writing to localStorage: ${key}`, error);
    }
  },

  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      throw new StorageError(`Error removing from localStorage: ${key}`, error);
    }
  },

  clear: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      throw new StorageError('Error clearing localStorage', error);
    }
  },

  // Backup utilities
  createBackup: (): void => {
    try {
      const data = storage.get(STORAGE_KEYS.MAIN);
      if (data) {
        const backup = {
          ...data,
          backupDate: new Date().toISOString(),
        };
        storage.set(STORAGE_KEYS.BACKUP, backup);
      }
    } catch (error) {
      throw new StorageError('Error creating backup', error);
    }
  },

  restoreFromBackup: (): StorageData | null => {
    try {
      const backup = storage.get(STORAGE_KEYS.BACKUP);
      if (backup) {
        storage.set(STORAGE_KEYS.MAIN, backup);
        return backup as StorageData;
      }
      return null;
    } catch (error) {
      throw new StorageError('Error restoring from backup', error);
    }
  },
};

const { forceSave } = useAutoSave('transactions', transactions);
// Call forceSave() when needed 