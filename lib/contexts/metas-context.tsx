import React, { createContext, useContext, useState, useCallback } from 'react';
import { z } from 'zod';

// Schema definitions
const GoalSchema = z.object({
  id: z.string(),
  type: z.enum(['personal', 'business']),
  category: z.string(),
  title: z.string(),
  description: z.string(),
  targetValue: z.number(),
  currentValue: z.number(),
  startDate: z.string(),
  endDate: z.string(),
  status: z.enum(['active', 'completed', 'cancelled']),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Goal = z.infer<typeof GoalSchema>;

interface MetasContextType {
  goals: Goal[];
  isLoading: boolean;
  error: Error | null;
  addGoal: (goal: Omit<Goal, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateGoal: (id: string, data: Partial<Goal>) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  getGoalProgress: (id: string) => number;
  getGoalsByType: (type: Goal['type']) => Goal[];
  getGoalsByStatus: (status: Goal['status']) => Goal[];
  getGoalsByCategory: (category: string) => Goal[];
}

const MetasContext = createContext<MetasContextType | undefined>(undefined);

export function MetasProvider({ children }: { children: React.ReactNode }) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const addGoal = useCallback(async (goal: Omit<Goal, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => {
    try {
      setIsLoading(true);
      setError(null);

      const newGoal: Goal = {
        ...goal,
        id: crypto.randomUUID(),
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const validatedGoal = GoalSchema.parse(newGoal);
      setGoals(prev => [...prev, validatedGoal]);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to add goal'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateGoal = useCallback(async (id: string, data: Partial<Goal>) => {
    try {
      setIsLoading(true);
      setError(null);

      setGoals(prev => prev.map(goal => {
        if (goal.id === id) {
          const updated = {
            ...goal,
            ...data,
            updatedAt: new Date().toISOString(),
          };
          return GoalSchema.parse(updated);
        }
        return goal;
      }));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update goal'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteGoal = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      setGoals(prev => prev.filter(g => g.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete goal'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getGoalProgress = useCallback((id: string) => {
    const goal = goals.find(g => g.id === id);
    if (!goal) return 0;
    return (goal.currentValue / goal.targetValue) * 100;
  }, [goals]);

  const getGoalsByType = useCallback((type: Goal['type']) => {
    return goals.filter(g => g.type === type);
  }, [goals]);

  const getGoalsByStatus = useCallback((status: Goal['status']) => {
    return goals.filter(g => g.status === status);
  }, [goals]);

  const getGoalsByCategory = useCallback((category: string) => {
    return goals.filter(g => g.category === category);
  }, [goals]);

  return (
    <MetasContext.Provider
      value={{
        goals,
        isLoading,
        error,
        addGoal,
        updateGoal,
        deleteGoal,
        getGoalProgress,
        getGoalsByType,
        getGoalsByStatus,
        getGoalsByCategory,
      }}
    >
      {children}
    </MetasContext.Provider>
  );
}

export function useMetas() {
  const context = useContext(MetasContext);
  if (context === undefined) {
    throw new Error('useMetas must be used within a MetasProvider');
  }
  return context;
} 