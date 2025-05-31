
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormData, PHASE_OPTIONS, STATUS_OPTIONS, PRIORITY_OPTIONS } from '../types';

interface StatusFieldsProps {
  formData: FormData;
  onChange: (updates: Partial<FormData>) => void;
}

export const StatusFields: React.FC<StatusFieldsProps> = ({ formData, onChange }) => {
  return (
    <>
      <div>
        <Label htmlFor="projectPhase" className="text-gray-900 dark:text-gray-100">Phase</Label>
        <Select onValueChange={(value) => onChange({ phase: value })}>
          <SelectTrigger id="projectPhase" className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100">
            <SelectValue placeholder="Select phase" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
            {PHASE_OPTIONS.map(phase => (
              <SelectItem key={phase} value={phase} className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700">{phase}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="projectStatus" className="text-gray-900 dark:text-gray-100">Status</Label>
        <Select onValueChange={(value) => onChange({ status: value as any })} defaultValue="New">
          <SelectTrigger id="projectStatus" className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
            {STATUS_OPTIONS.map(status => (
              <SelectItem key={status} value={status} className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700">{status}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="projectPriority" className="text-gray-900 dark:text-gray-100">Priority</Label>
        <Select onValueChange={(value) => onChange({ priority: value as any })} defaultValue="Medium">
          <SelectTrigger id="projectPriority" className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
            {PRIORITY_OPTIONS.map(priority => (
              <SelectItem key={priority} value={priority} className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700">{priority}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="projectStartDate" className="text-gray-900 dark:text-gray-100">Start Date</Label>
        <Input
          id="projectStartDate"
          type="date"
          value={formData.start_date}
          onChange={(e) => onChange({ start_date: e.target.value })}
          className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
        />
      </div>
      
      <div>
        <Label htmlFor="projectEndDate" className="text-gray-900 dark:text-gray-100">End Date</Label>
        <Input
          id="projectEndDate"
          type="date"
          value={formData.end_date}
          onChange={(e) => onChange({ end_date: e.target.value })}
          className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
        />
      </div>
    </>
  );
};
