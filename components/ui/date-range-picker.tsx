import React from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { formatDate } from '@/lib/formatters';

interface DateRange {
  start: string;
  end: string;
}

interface DateRangePickerProps {
  value?: DateRange;
  onChange?: (range: DateRange) => void;
}

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  const startDate = value?.start ? new Date(value.start) : null;
  const endDate = value?.end ? new Date(value.end) : null;

  const handleStartDateChange = (date: Date | null) => {
    if (date && onChange) {
      onChange({
        start: date.toISOString(),
        end: endDate?.toISOString() || date.toISOString(),
      });
    }
  };

  const handleEndDateChange = (date: Date | null) => {
    if (date && onChange) {
      onChange({
        start: startDate?.toISOString() || date.toISOString(),
        end: date.toISOString(),
      });
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <DatePicker
        selected={startDate}
        onChange={handleStartDateChange}
        selectsStart
        startDate={startDate}
        endDate={endDate}
        placeholderText="Start date"
        className="w-full px-3 py-2 border rounded-md"
        dateFormat="dd/MM/yyyy"
      />
      <span className="text-gray-500">to</span>
      <DatePicker
        selected={endDate}
        onChange={handleEndDateChange}
        selectsEnd
        startDate={startDate}
        endDate={endDate}
        minDate={startDate}
        placeholderText="End date"
        className="w-full px-3 py-2 border rounded-md"
        dateFormat="dd/MM/yyyy"
      />
    </div>
  );
} 