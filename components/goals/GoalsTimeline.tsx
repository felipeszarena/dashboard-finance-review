import React from 'react';
import { Goal } from '@/lib/contexts/metas-context';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { format } from 'date-fns';

interface GoalsTimelineProps {
  goals: Goal[];
}

export function GoalsTimeline({ goals }: GoalsTimelineProps) {
  const sortedGoals = React.useMemo(() => {
    return [...goals]
      .filter(goal => new Date(goal.endDate) > new Date())
      .sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime());
  }, [goals]);

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Upcoming Goals</h3>
      <div className="space-y-4">
        {sortedGoals.map(goal => {
          const progress = (goal.currentValue / goal.targetValue) * 100;
          const daysLeft = Math.ceil(
            (new Date(goal.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
          );

          return (
            <div key={goal.id} className="relative pl-8 pb-4 border-l-2 border-gray-200 last:border-0">
              <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-blue-500" />
              
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{goal.title}</h4>
                    <p className="text-sm text-gray-500">{goal.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      ${goal.currentValue.toLocaleString()} / ${goal.targetValue.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">{daysLeft} days left</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{progress.toFixed(1)}%</span>
                  </div>
                  <Progress value={progress} />
                </div>

                <div className="flex justify-between text-sm text-gray-500">
                  <span>Start: {format(new Date(goal.startDate), 'MMM d, yyyy')}</span>
                  <span>End: {format(new Date(goal.endDate), 'MMM d, yyyy')}</span>
                </div>
              </div>
            </div>
          );
        })}

        {sortedGoals.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            No upcoming goals
          </div>
        )}
      </div>
    </Card>
  );
} 