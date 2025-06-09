import { z } from 'zod';

export const GoalType = {
  PERSONAL: 'personal',
  BUSINESS: 'business',
} as const;

export const GoalCategory = {
  SAVINGS: 'savings',
  INVESTMENT: 'investment',
  EXPENSE_REDUCTION: 'expense_reduction',
  REVENUE: 'revenue',
  PROFIT_MARGIN: 'profit_margin',
} as const;

export const GoalStatus = {
  ACHIEVED: 'achieved',
  IN_PROGRESS: 'in_progress',
  DELAYED: 'delayed',
} as const;

export const GoalSchema = z.object({
  id: z.string(),
  type: z.enum([GoalType.PERSONAL, GoalType.BUSINESS]),
  category: z.enum([
    GoalCategory.SAVINGS,
    GoalCategory.INVESTMENT,
    GoalCategory.EXPENSE_REDUCTION,
    GoalCategory.REVENUE,
    GoalCategory.PROFIT_MARGIN,
  ]),
  title: z.string(),
  description: z.string().optional(),
  targetValue: z.number(),
  currentValue: z.number(),
  startDate: z.string(), // ISO date
  endDate: z.string(), // ISO date
  createdAt: z.string(), // ISO date
  status: z.enum([GoalStatus.ACHIEVED, GoalStatus.IN_PROGRESS, GoalStatus.DELAYED]),
  progress: z.number(), // 0-100
  milestones: z.array(z.object({
    id: z.string(),
    title: z.string(),
    date: z.string(), // ISO date
    completed: z.boolean(),
  })).optional(),
  monthlyProgress: z.array(z.object({
    month: z.string(), // YYYY-MM
    value: z.number(),
  })).optional(),
});

export type Goal = z.infer<typeof GoalSchema>;

export interface GoalFilters {
  type?: typeof GoalType[keyof typeof GoalType];
  category?: typeof GoalCategory[keyof typeof GoalCategory];
  status?: typeof GoalStatus[keyof typeof GoalStatus];
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface GoalStats {
  totalGoals: number;
  achievedGoals: number;
  inProgressGoals: number;
  delayedGoals: number;
  totalTargetValue: number;
  totalCurrentValue: number;
  averageProgress: number;
}

export interface GoalChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
  }[];
} 