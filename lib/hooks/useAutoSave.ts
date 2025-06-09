import { useEffect, useRef, useCallback } from 'react';
import { useStorage } from '../contexts/storage-context';

interface UseAutoSaveOptions {
  key: string;
  data: any;
  debounceMs?: number;
  onSave?: () => void;
  onError?: (error: Error) => void;
}

export function useAutoSave({
  key,
  data,
  debounceMs = 1000,
  onSave,
  onError,
}: UseAutoSaveOptions) {
  const { saveData } = useStorage();
  const timeoutRef = useRef<NodeJS.Timeout>();
  const dataRef = useRef(data);

  // Update ref when data changes
  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  const save = useCallback(async () => {
    try {
      await saveData(key as any, dataRef.current);
      onSave?.();
    } catch (error) {
      onError?.(error instanceof Error ? error : new Error('Failed to save data'));
    }
  }, [key, saveData, onSave, onError]);

  useEffect(() => {
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(save, debounceMs);

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, debounceMs, save]);

  // Force save
  const forceSave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    return save();
  }, [save]);

  return { forceSave };
} 