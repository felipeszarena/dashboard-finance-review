import React from 'react';
import { Goal } from '@/lib/contexts/metas-context';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface GoalsSummaryProps {
  goals: Goal[];
}

export function GoalsSummary({ goals }: GoalsSummaryProps) {
  const stats = React.useMemo(() => {
    const total = goals.length;
    const completed = goals.filter(g => g.status === 'completed').length;
    const active = goals.filter(g => g.status === 'active').length;
    const cancelled = goals.filter(g => g.status === 'cancelled').length;

    const totalValue = goals.reduce((sum, goal) => sum + goal.targetValue, 0);
    const currentValue = goals.reduce((sum, goal) => sum + goal.currentValue, 0);
    const progress = totalValue > 0 ? (currentValue / totalValue) * 100 : 0;

    return {
      total,
      completed,
      active,
      cancelled,
      progress,
      totalValue,
      currentValue,
    };
  }, [goals]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="p-4">
        <h3 className="text-sm font-medium text-gray-500">Total Goals</h3>
        <p className="text-2xl font-bold mt-2">{stats.total}</p>
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Active: {stats.active}</span>
            <span>Completed: {stats.completed}</span>
          </div>
          <Progress value={(stats.completed / stats.total) * 100} />
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="text-sm font-medium text-gray-500">Total Value</h3>
        <p className="text-2xl font-bold mt-2">
          ${stats.totalValue.toLocaleString()}
        </p>
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Current: ${stats.currentValue.toLocaleString()}</span>
            <span>{stats.progress.toFixed(1)}%</span>
          </div>
          <Progress value={stats.progress} />
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="text-sm font-medium text-gray-500">Completion Rate</h3>
        <p className="text-2xl font-bold mt-2">
          {((stats.completed / stats.total) * 100).toFixed(1)}%
        </p>
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Active: {stats.active}</span>
            <span>Cancelled: {stats.cancelled}</span>
          </div>
          <Progress value={(stats.active / stats.total) * 100} />
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="text-sm font-medium text-gray-500">Average Progress</h3>
        <p className="text-2xl font-bold mt-2">
          {stats.progress.toFixed(1)}%
        </p>
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1">
            <span>On Track</span>
            <span>{stats.progress.toFixed(1)}%</span>
          </div>
          <Progress value={stats.progress} />
        </div>
      </Card>
    </div>
  );
} 