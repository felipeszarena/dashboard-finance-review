import React from 'react';
import { useMetas } from '@/lib/hooks/useMetas';
import { GoalType } from '@/lib/contexts/metas-context';
import { GoalsHeader } from '@/components/goals/GoalsHeader';
import { GoalsSummary } from '@/components/goals/GoalsSummary';
import { GoalsGrid } from '@/components/goals/GoalsGrid';
import { GoalsCharts } from '@/components/goals/GoalsCharts';
import { GoalsTimeline } from '@/components/goals/GoalsTimeline';
import { GoalForm } from '@/components/goals/GoalForm';
import { Dialog } from '@/components/ui/dialog';

export default function GoalsDashboard() {
  const [selectedType, setSelectedType] = React.useState<GoalType | 'all'>('all');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingGoal, setEditingGoal] = React.useState<string | null>(null);

  const {
    goals,
    goalsProgress,
    addGoal,
    updateGoal,
    deleteGoal,
    getGoalsByType,
    getGoalsByStatus,
  } = useMetas();

  const filteredGoals = React.useMemo(() => {
    let filtered = goals || [];
    
    if (selectedType !== 'all') {
      filtered = getGoalsByType(selectedType);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(goal => 
        goal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        goal.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered;
  }, [goals, selectedType, searchQuery, getGoalsByType]);

  const handleCreateGoal = () => {
    setEditingGoal(null);
    setIsFormOpen(true);
  };

  const handleEditGoal = (goalId: string) => {
    setEditingGoal(goalId);
    setIsFormOpen(true);
  };

  const handleDeleteGoal = async (goalId: string) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      await deleteGoal(goalId);
    }
  };

  const handleSubmitGoal = async (data: any) => {
    if (editingGoal) {
      await updateGoal(editingGoal, data);
    } else {
      await addGoal(data);
    }
    setIsFormOpen(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <GoalsHeader
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onCreateGoal={handleCreateGoal}
      />

      <div className="grid gap-6 mt-6">
        <GoalsSummary goals={goals || []} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GoalsCharts goals={filteredGoals} goalsProgress={goalsProgress} />
          <GoalsTimeline goals={filteredGoals} />
        </div>

        <GoalsGrid
          goals={filteredGoals}
          goalsProgress={goalsProgress}
          onEdit={handleEditGoal}
          onDelete={handleDeleteGoal}
        />
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <GoalForm
          goal={editingGoal ? goals?.find(g => g.id === editingGoal) : undefined}
          onSubmit={handleSubmitGoal}
          onCancel={() => setIsFormOpen(false)}
        />
      </Dialog>
    </div>
  );
} 