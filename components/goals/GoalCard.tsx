import React from 'react';
import { Goal, GoalStatus, GoalType } from '@/types/goals';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/formatters';

interface GoalCardProps {
  goal: Goal;
  onEdit?: (goal: Goal) => void;
  onDelete?: (goalId: string) => void;
}

const statusColors = {
  [GoalStatus.ACHIEVED]: 'bg-green-500',
  [GoalStatus.IN_PROGRESS]: 'bg-yellow-500',
  [GoalStatus.DELAYED]: 'bg-red-500',
};

const typeColors = {
  [GoalType.PERSONAL]: 'border-blue-500',
  [GoalType.BUSINESS]: 'border-green-500',
};

export function GoalCard({ goal, onEdit, onDelete }: GoalCardProps) {
  const progress = Math.min(100, Math.max(0, goal.progress));
  const statusColor = statusColors[goal.status];
  const typeColor = typeColors[goal.type];

  return (
    <Card className={cn(
      "p-4 relative overflow-hidden",
      typeColor,
      "hover:shadow-lg transition-shadow duration-200"
    )}>
      {/* Status indicator */}
      <div className={cn(
        "absolute top-0 right-0 w-3 h-3 rounded-full",
        statusColor
      )} />

      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold">{goal.title}</h3>
          <p className="text-sm text-gray-500">{goal.category}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium">
            {formatCurrency(goal.currentValue)} / {formatCurrency(goal.targetValue)}
          </p>
          <p className="text-xs text-gray-500">
            {new Date(goal.endDate).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Progress Circle */}
      <div className="relative w-24 h-24 mx-auto mb-4">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            className="text-gray-200"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
            r="40"
            cx="50"
            cy="50"
          />
          {/* Progress circle */}
          <circle
            className={cn(
              "transition-all duration-500 ease-in-out",
              goal.type === GoalType.PERSONAL ? "text-blue-500" : "text-green-500"
            )}
            strokeWidth="8"
            strokeDasharray={251.2}
            strokeDashoffset={251.2 - (251.2 * progress) / 100}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r="40"
            cx="50"
            cy="50"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold">{Math.round(progress)}%</span>
        </div>
      </div>

      {/* Progress Bar */}
      <Progress value={progress} className="h-2 mb-4" />

      {/* Actions */}
      <div className="flex justify-end space-x-2">
        {onEdit && (
          <button
            onClick={() => onEdit(goal)}
            className="text-sm text-blue-500 hover:text-blue-700"
          >
            Edit
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(goal.id)}
            className="text-sm text-red-500 hover:text-red-700"
          >
            Delete
          </button>
        )}
      </div>
    </Card>
  );
} 