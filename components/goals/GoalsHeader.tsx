import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Search } from 'lucide-react';

interface GoalsHeaderProps {
  selectedType: 'personal' | 'business' | 'all';
  onTypeChange: (type: 'personal' | 'business' | 'all') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onCreateGoal: () => void;
}

export function GoalsHeader({
  selectedType,
  onTypeChange,
  searchQuery,
  onSearchChange,
  onCreateGoal,
}: GoalsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="flex-1 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        <Select
          value={selectedType}
          onValueChange={onTypeChange}
          options={[
            { value: 'all', label: 'All Goals' },
            { value: 'personal', label: 'Personal' },
            { value: 'business', label: 'Business' },
          ]}
          className="w-full sm:w-40"
        />
        
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input
            type="text"
            placeholder="Search goals..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Button onClick={onCreateGoal} className="w-full sm:w-auto">
        Create New Goal
      </Button>
    </div>
  );
} 