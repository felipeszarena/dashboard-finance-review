import { useEffect, useRef, useCallback } from 'react';
import { useStorage } from '../lib/storage-context';
import { StorageData } from '../lib/storage';

interface UseAutoSaveOptions {
  debounceMs?: number;
  onSave?: (data: StorageData) => void;
  onError?: (error: Error) => void;
}

export function useAutoSave<T extends keyof StorageData>(
  key: T,
  value: StorageData[T],
  options: UseAutoSaveOptions = {}
) {
  const { debounceMs = 500, onSave, onError } = options;
  const { updateData } = useStorage();
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const valueRef = useRef<StorageData[T]>(value);

  // Update the ref when value changes
  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  const saveToStorage = useCallback(() => {
    try {
      const newData = { [key]: valueRef.current } as Partial<StorageData>;
      updateData(newData);
      onSave?.(newData as StorageData);
    } catch (error) {
      onError?.(error instanceof Error ? error : new Error('Failed to save data'));
    }
  }, [key, updateData, onSave, onError]);

  // Debounced save effect
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(saveToStorage, debounceMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, debounceMs, saveToStorage]);

  // Force save function
  const forceSave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    saveToStorage();
  }, [saveToStorage]);

  return { forceSave };
} 