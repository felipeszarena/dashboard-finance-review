import React from 'react';
import { Goal } from '@/lib/contexts/metas-context';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { format } from 'date-fns';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface GoalsGridProps {
  goals: Goal[];
  onEditGoal: (goal: Goal) => void;
  onDeleteGoal: (goalId: string) => void;
}

export function GoalsGrid({ goals, onEditGoal, onDeleteGoal }: GoalsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {goals.map(goal => {
        const progress = (goal.currentValue / goal.targetValue) * 100;
        const daysLeft = Math.ceil(
          (new Date(goal.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
        );

        const chartData = {
          labels: ['Progress', 'Remaining'],
          datasets: [
            {
              data: [progress, 100 - progress],
              backgroundColor: ['#3b82f6', '#e5e7eb'],
              borderWidth: 0,
            },
          ],
        };

        const chartOptions = {
          cutout: '80%',
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              enabled: false,
            },
          },
        };

        return (
          <Card key={goal.id} className="p-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold">{goal.title}</h3>
                <p className="text-sm text-gray-500">{goal.category}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => onEditGoal(goal)}
                  className="text-blue-500 hover:text-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDeleteGoal(goal.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  Delete
                </button>
              </div>
            </div>

            <div className="flex items-center justify-center mb-4">
              <div className="relative w-32 h-32">
                <Doughnut data={chartData} options={chartOptions} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold">{progress.toFixed(1)}%</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Current Value</span>
                <span className="font-medium">${goal.currentValue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Target Value</span>
                <span className="font-medium">${goal.targetValue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Days Left</span>
                <span className="font-medium">{daysLeft}</span>
              </div>
            </div>

            <div className="mt-4 space-y-1">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{progress.toFixed(1)}%</span>
              </div>
              <Progress value={progress} />
            </div>

            <div className="mt-4 text-sm text-gray-500">
              <div>Start: {format(new Date(goal.startDate), 'MMM d, yyyy')}</div>
              <div>End: {format(new Date(goal.endDate), 'MMM d, yyyy')}</div>
            </div>
          </Card>
        );
      })}
    </div>
  );
} 