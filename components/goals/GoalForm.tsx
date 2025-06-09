import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Goal, GoalSchema, GoalType, GoalCategory } from '@/types/goals';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { formatDate } from '@/lib/formatters';

interface GoalFormProps {
  goal?: Goal;
  onSubmit: (data: Goal) => void;
  onCancel: () => void;
}

export function GoalForm({ goal, onSubmit, onCancel }: GoalFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<Goal>({
    resolver: zodResolver(GoalSchema),
    defaultValues: goal || {
      type: GoalType.PERSONAL,
      category: GoalCategory.SAVINGS,
      currentValue: 0,
      progress: 0,
      status: 'in_progress',
      createdAt: new Date().toISOString(),
    },
  });

  const type = watch('type');

  const handleFormSubmit = (data: Goal) => {
    onSubmit({
      ...data,
      id: goal?.id || crypto.randomUUID(),
      createdAt: goal?.createdAt || new Date().toISOString(),
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Type</label>
          <Select
            {...register('type')}
            className="mt-1"
          >
            <option value={GoalType.PERSONAL}>Personal</option>
            <option value={GoalType.BUSINESS}>Business</option>
          </Select>
          {errors.type && (
            <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
          )}
        </div>

        {/* Category Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <Select
            {...register('category')}
            className="mt-1"
          >
            <option value={GoalCategory.SAVINGS}>Savings</option>
            <option value={GoalCategory.INVESTMENT}>Investment</option>
            <option value={GoalCategory.EXPENSE_REDUCTION}>Expense Reduction</option>
            {type === GoalType.BUSINESS && (
              <>
                <option value={GoalCategory.REVENUE}>Revenue</option>
                <option value={GoalCategory.PROFIT_MARGIN}>Profit Margin</option>
              </>
            )}
          </Select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
          )}
        </div>

        {/* Title */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <Input
            {...register('title')}
            className="mt-1"
            placeholder="Enter goal title"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <Textarea
            {...register('description')}
            className="mt-1"
            placeholder="Enter goal description"
            rows={3}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        {/* Target Value */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Target Value</label>
          <Input
            type="number"
            {...register('targetValue', { valueAsNumber: true })}
            className="mt-1"
            placeholder="Enter target value"
          />
          {errors.targetValue && (
            <p className="mt-1 text-sm text-red-600">{errors.targetValue.message}</p>
          )}
        </div>

        {/* Current Value */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Current Value</label>
          <Input
            type="number"
            {...register('currentValue', { valueAsNumber: true })}
            className="mt-1"
            placeholder="Enter current value"
          />
          {errors.currentValue && (
            <p className="mt-1 text-sm text-red-600">{errors.currentValue.message}</p>
          )}
        </div>

        {/* Start Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Start Date</label>
          <Input
            type="date"
            {...register('startDate')}
            className="mt-1"
          />
          {errors.startDate && (
            <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>
          )}
        </div>

        {/* End Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700">End Date</label>
          <Input
            type="date"
            {...register('endDate')}
            className="mt-1"
          />
          {errors.endDate && (
            <p className="mt-1 text-sm text-red-600">{errors.endDate.message}</p>
          )}
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button type="submit">
          {goal ? 'Update Goal' : 'Create Goal'}
        </Button>
      </div>
    </form>
  );
} 