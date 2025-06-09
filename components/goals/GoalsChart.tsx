import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Goal, GoalType, GoalChartData } from '@/types/goals';
import { formatCurrency } from '@/lib/formatters';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface GoalsChartProps {
  goals: Goal[];
  type: 'progress' | 'value';
}

export function GoalsChart({ goals, type }: GoalsChartProps) {
  const chartData = React.useMemo(() => {
    const personalGoals = goals.filter(goal => goal.type === GoalType.PERSONAL);
    const businessGoals = goals.filter(goal => goal.type === GoalType.BUSINESS);

    const categories = [...new Set(goals.map(goal => goal.category))];

    const data: ChartData<'bar'> = {
      labels: categories,
      datasets: [
        {
          label: 'Personal Goals',
          data: categories.map(category => {
            const categoryGoals = personalGoals.filter(g => g.category === category);
            if (type === 'progress') {
              return categoryGoals.reduce((acc, goal) => acc + goal.progress, 0) / categoryGoals.length || 0;
            }
            return categoryGoals.reduce((acc, goal) => acc + goal.currentValue, 0);
          }),
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
          borderColor: 'rgb(59, 130, 246)',
          borderWidth: 1,
        },
        {
          label: 'Business Goals',
          data: categories.map(category => {
            const categoryGoals = businessGoals.filter(g => g.category === category);
            if (type === 'progress') {
              return categoryGoals.reduce((acc, goal) => acc + goal.progress, 0) / categoryGoals.length || 0;
            }
            return categoryGoals.reduce((acc, goal) => acc + goal.currentValue, 0);
          }),
          backgroundColor: 'rgba(34, 197, 94, 0.5)',
          borderColor: 'rgb(34, 197, 94)',
          borderWidth: 1,
        },
      ],
    };

    return data;
  }, [goals, type]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: type === 'progress' ? 'Goal Progress by Category' : 'Goal Values by Category',
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const value = context.raw;
            return type === 'progress'
              ? `${context.dataset.label}: ${value.toFixed(1)}%`
              : `${context.dataset.label}: ${formatCurrency(value)}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return type === 'progress'
              ? `${value}%`
              : formatCurrency(value);
          },
        },
      },
    },
  };

  return (
    <div className="w-full h-[400px] p-4 bg-white rounded-lg shadow">
      <Bar data={chartData} options={options} />
    </div>
  );
} 