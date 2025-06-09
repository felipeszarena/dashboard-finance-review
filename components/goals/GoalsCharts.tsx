import React from 'react';
import { Goal } from '@/lib/contexts/metas-context';
import { Card } from '@/components/ui/card';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface GoalsChartsProps {
  goals: Goal[];
  goalsProgress: Map<string, any>;
}

export function GoalsCharts({ goals, goalsProgress }: GoalsChartsProps) {
  const categoryData = React.useMemo(() => {
    const categories = goals.reduce((acc, goal) => {
      acc[goal.category] = (acc[goal.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      labels: Object.keys(categories),
      datasets: [{
        data: Object.values(categories),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
        ],
      }],
    };
  }, [goals]);

  const progressData = React.useMemo(() => {
    const labels = goals.map(goal => goal.title);
    const data = goals.map(goal => {
      const progress = goalsProgress.get(goal.id);
      return progress?.progress || 0;
    });

    return {
      labels,
      datasets: [{
        label: 'Progress',
        data,
        backgroundColor: '#36A2EB',
      }],
    };
  }, [goals, goalsProgress]);

  const monthlyData = React.useMemo(() => {
    const months = Array.from({ length: 12 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      return date.toLocaleString('default', { month: 'short' });
    }).reverse();

    const personalData = Array(12).fill(0);
    const businessData = Array(12).fill(0);

    goals.forEach(goal => {
      const startDate = new Date(goal.startDate);
      const monthIndex = startDate.getMonth();
      if (goal.type === 'personal') {
        personalData[monthIndex] += goal.targetValue;
      } else {
        businessData[monthIndex] += goal.targetValue;
      }
    });

    return {
      labels: months,
      datasets: [
        {
          label: 'Personal',
          data: personalData,
          borderColor: '#FF6384',
          backgroundColor: 'rgba(255, 99, 132, 0.1)',
          fill: true,
        },
        {
          label: 'Business',
          data: businessData,
          borderColor: '#36A2EB',
          backgroundColor: 'rgba(54, 162, 235, 0.1)',
          fill: true,
        },
      ],
    };
  }, [goals]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Goals by Category</h3>
        <div className="h-64">
          <Pie data={categoryData} options={{ maintainAspectRatio: false }} />
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Progress by Goal</h3>
        <div className="h-64">
          <Bar
            data={progressData}
            options={{
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                  max: 100,
                },
              },
            }}
          />
        </div>
      </Card>

      <Card className="p-4 lg:col-span-2">
        <h3 className="text-lg font-semibold mb-4">Monthly Goals Comparison</h3>
        <div className="h-64">
          <Line
            data={monthlyData}
            options={{
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            }}
          />
        </div>
      </Card>
    </div>
  );
} 