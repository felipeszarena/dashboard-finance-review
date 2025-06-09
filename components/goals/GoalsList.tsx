import React, { useState, useMemo } from 'react';
import { Goal, GoalFilters, GoalType, GoalCategory, GoalStatus } from '@/types/goals';
import { GoalCard } from './GoalCard';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { formatDate } from '@/lib/formatters';

interface GoalsListProps {
  goals: Goal[];
  onEdit?: (goal: Goal) => void;
  onDelete?: (goalId: string) => void;
}

export function GoalsList({ goals, onEdit, onDelete }: GoalsListProps) {
  const [filters, setFilters] = useState<GoalFilters>({});
  const [searchTerm, setSearchTerm] = useState('');

  const filteredGoals = useMemo(() => {
    return goals.filter(goal => {
      // Type filter
      if (filters.type && goal.type !== filters.type) return false;

      // Category filter
      if (filters.category && goal.category !== filters.category) return false;

      // Status filter
      if (filters.status && goal.status !== filters.status) return false;

      // Date range filter
      if (filters.dateRange) {
        const goalDate = new Date(goal.endDate);
        const startDate = new Date(filters.dateRange.start);
        const endDate = new Date(filters.dateRange.end);
        if (goalDate < startDate || goalDate > endDate) return false;
      }

      // Search term
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          goal.title.toLowerCase().includes(searchLower) ||
          goal.description?.toLowerCase().includes(searchLower)
        );
      }

      return true;
    });
  }, [goals, filters, searchTerm]);

  const handleFilterChange = (key: keyof GoalFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({});
    setSearchTerm('');
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
        <Input
          placeholder="Search goals..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <Select
          value={filters.type}
          onValueChange={(value) => handleFilterChange('type', value)}
        >
          <option value="">All Types</option>
          <option value={GoalType.PERSONAL}>Personal</option>
          <option value={GoalType.BUSINESS}>Business</option>
        </Select>

        <Select
          value={filters.category}
          onValueChange={(value) => handleFilterChange('category', value)}
        >
          <option value="">All Categories</option>
          <option value={GoalCategory.SAVINGS}>Savings</option>
          <option value={GoalCategory.INVESTMENT}>Investment</option>
          <option value={GoalCategory.EXPENSE_REDUCTION}>Expense Reduction</option>
          <option value={GoalCategory.REVENUE}>Revenue</option>
          <option value={GoalCategory.PROFIT_MARGIN}>Profit Margin</option>
        </Select>

        <Select
          value={filters.status}
          onValueChange={(value) => handleFilterChange('status', value)}
        >
          <option value="">All Status</option>
          <option value={GoalStatus.ACHIEVED}>Achieved</option>
          <option value={GoalStatus.IN_PROGRESS}>In Progress</option>
          <option value={GoalStatus.DELAYED}>Delayed</option>
        </Select>

        <DateRangePicker
          value={filters.dateRange}
          onChange={(range) => handleFilterChange('dateRange', range)}
        />

        <Button
          variant="outline"
          onClick={clearFilters}
          className="col-span-full md:col-span-2 lg:col-span-1"
        >
          Clear Filters
        </Button>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGoals.map(goal => (
          <GoalCard
            key={goal.id}
            goal={goal}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredGoals.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900">No goals found</h3>
          <p className="mt-2 text-sm text-gray-500">
            Try adjusting your filters or search term
          </p>
        </div>
      )}
    </div>
  );
} 