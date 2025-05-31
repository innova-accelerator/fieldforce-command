
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormData } from '../types';

interface BasicInfoFieldsProps {
  formData: FormData;
  onChange: (updates: Partial<FormData>) => void;
}

export const BasicInfoFields: React.FC<BasicInfoFieldsProps> = ({ formData, onChange }) => {
  return (
    <>
      <div className="md:col-span-2">
        <Label htmlFor="projectName" className="text-gray-900 dark:text-gray-100">Project Name</Label>
        <Input
          id="projectName"
          value={formData.name}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder="Enter project name"
          className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
        />
      </div>
      
      <div className="md:col-span-2">
        <Label htmlFor="projectDescription" className="text-gray-900 dark:text-gray-100">Description</Label>
        <Textarea
          id="projectDescription"
          value={formData.description}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder="Project description..."
          rows={3}
          className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
        />
      </div>
      
      <div>
        <Label htmlFor="projectLocation" className="text-gray-900 dark:text-gray-100">Location</Label>
        <Input
          id="projectLocation"
          value={formData.location}
          onChange={(e) => onChange({ location: e.target.value })}
          placeholder="Project location"
          className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
        />
      </div>
    </>
  );
};
