import { useCallback, useEffect, useState } from 'react';
import { useStorage as useStorageContext } from '../contexts/storage-context';

interface UseStorageOptions<T> {
  key: string;
  initialValue: T;
  onError?: (error: Error) => void;
}

export function useStorage<T>({ key, initialValue, onError }: UseStorageOptions<T>) {
  const { data: storageData, saveData, loadData } = useStorageContext();
  const [value, setValue] = useState<T>(initialValue);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Load initial value
  useEffect(() => {
    const loadInitialValue = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const storedData = await loadData(key as any);
        if (storedData !== undefined) {
          setValue(storedData as T);
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to load data');
        setError(error);
        onError?.(error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialValue();
  }, [key, loadData, onError]);

  // Save value when it changes
  const setStoredValue = useCallback(async (newValue: T | ((prev: T) => T)) => {
    try {
      setIsLoading(true);
      setError(null);

      const valueToStore = newValue instanceof Function ? newValue(value) : newValue;
      setValue(valueToStore);
      await saveData(key as any, valueToStore);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to save data');
      setError(error);
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  }, [key, value, saveData, onError]);

  // Clear stored value
  const clearValue = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      setValue(initialValue);
      await saveData(key as any, initialValue);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to clear data');
      setError(error);
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  }, [key, initialValue, saveData, onError]);

  return {
    value,
    setValue: setStoredValue,
    clearValue,
    isLoading,
    error,
  };
} 