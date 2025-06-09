import { useCallback, useMemo } from 'react';
import { useStorage } from '../contexts/storage-context';
import { Goal } from '../contexts/metas-context';

interface GoalProgress {
  progress: number;
  remaining: number;
  daysLeft: number;
  status: 'on-track' | 'behind' | 'ahead';
}

export function useMetas() {
  const { data: storageData, saveData } = useStorage();
  const goals = storageData?.data.goals as Goal[] | undefined;

  const addGoal = useCallback(async (goal: Omit<Goal, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => {
    if (!goals) throw new Error('Goals not initialized');

    const newGoal: Goal = {
      ...goal,
      id: crypto.randomUUID(),
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await saveData('goals', [...goals, newGoal]);
  }, [goals, saveData]);

  const updateGoal = useCallback(async (id: string, updates: Partial<Goal>) => {
    if (!goals) throw new Error('Goals not initialized');

    const updatedGoals = goals.map(goal => {
      if (goal.id === id) {
        return {
          ...goal,
          ...updates,
          updatedAt: new Date().toISOString(),
        };
      }
      return goal;
    });

    await saveData('goals', updatedGoals);
  }, [goals, saveData]);

  const deleteGoal = useCallback(async (id: string) => {
    if (!goals) throw new Error('Goals not initialized');

    const updatedGoals = goals.filter(g => g.id !== id);
    await saveData('goals', updatedGoals);
  }, [goals, saveData]);

  const getGoalProgress = useCallback((goal: Goal): GoalProgress => {
    const now = new Date();
    const endDate = new Date(goal.endDate);
    const startDate = new Date(goal.startDate);

    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const daysLeft = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    const daysElapsed = Math.ceil((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

    const progress = (goal.currentValue / goal.targetValue) * 100;
    const expectedProgress = (daysElapsed / totalDays) * 100;
    const remaining = goal.targetValue - goal.currentValue;

    let status: GoalProgress['status'] = 'on-track';
    if (progress < expectedProgress - 10) {
      status = 'behind';
    } else if (progress > expectedProgress + 10) {
      status = 'ahead';
    }

    return {
      progress,
      remaining,
      daysLeft,
      status,
    };
  }, []);

  const getGoalsByType = useCallback((type: Goal['type']) => {
    if (!goals) throw new Error('Goals not initialized');
    return goals.filter(g => g.type === type);
  }, [goals]);

  const getGoalsByStatus = useCallback((status: Goal['status']) => {
    if (!goals) throw new Error('Goals not initialized');
    return goals.filter(g => g.status === status);
  }, [goals]);

  const getGoalsByCategory = useCallback((category: string) => {
    if (!goals) throw new Error('Goals not initialized');
    return goals.filter(g => g.category === category);
  }, [goals]);

  const getGoalsProgress = useMemo(() => {
    if (!goals) return new Map<string, GoalProgress>();
    return new Map(goals.map(goal => [goal.id, getGoalProgress(goal)]));
  }, [goals, getGoalProgress]);

  return {
    goals,
    goalsProgress: getGoalsProgress,
    addGoal,
    updateGoal,
    deleteGoal,
    getGoalProgress,
    getGoalsByType,
    getGoalsByStatus,
    getGoalsByCategory,
  };
} 