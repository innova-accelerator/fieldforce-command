
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PersonResponse } from '@/services/api/people';
import { FormData } from '../types';

interface AssignmentFieldsProps {
  formData: FormData;
  onChange: (updates: Partial<FormData>) => void;
  filteredPeople: PersonResponse[];
  selectedClient: PersonResponse | null;
  onTechToggle: (personId: string, checked: boolean) => void;
}

export const AssignmentFields: React.FC<AssignmentFieldsProps> = ({
  formData,
  onChange,
  filteredPeople,
  selectedClient,
  onTechToggle
}) => {
  return (
    <>
      <div>
        <Label htmlFor="assignedPersonSelect" className="text-gray-900 dark:text-gray-100">Assigned Person</Label>
        <Select onValueChange={(value) => onChange({ assigned_person_id: value })}>
          <SelectTrigger id="assignedPersonSelect" className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100">
            <SelectValue placeholder="Select assigned person" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
            {filteredPeople.map(person => (
              <SelectItem key={person.id} value={person.id} className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700">
                {person.firstName} {person.lastName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {filteredPeople.length > 0 && (
        <div className="md:col-span-2">
          <Label className="text-gray-900 dark:text-gray-100">Additional Techs (optional)</Label>
          <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700">
            {filteredPeople.map(person => (
              <div key={person.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`tech-${person.id}`}
                  checked={formData.assigned_techs.includes(person.id)}
                  onCheckedChange={(checked) => onTechToggle(person.id, checked as boolean)}
                />
                <Label htmlFor={`tech-${person.id}`} className="text-sm text-gray-900 dark:text-gray-100">
                  {person.firstName} {person.lastName}
                </Label>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="md:col-span-2">
        <Label className="text-gray-900 dark:text-gray-100">Contact Info</Label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
          <Input
            id="contactName"
            placeholder="Contact name"
            value={formData.contact_name}
            onChange={(e) => onChange({ contact_name: e.target.value })}
            className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
          />
          <Input
            id="contactPhone"
            placeholder="Contact phone"
            value={formData.contact_phone}
            onChange={(e) => onChange({ contact_phone: e.target.value })}
            className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
          />
          <Input
            id="contactEmail"
            placeholder="Contact email"
            value={formData.contact_email}
            onChange={(e) => onChange({ contact_email: e.target.value })}
            className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
          />
        </div>
      </div>
      
      <div className="md:col-span-2">
        <Label htmlFor="projectTags" className="text-gray-900 dark:text-gray-100">Tags (comma-separated)</Label>
        <Input
          id="projectTags"
          value={formData.tags.join(', ')}
          onChange={(e) => {
            const tags = e.target.value.split(',').map(tag => tag.trim()).filter(Boolean);
            onChange({ tags });
          }}
          placeholder="tag1, tag2, tag3"
          className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
        />
      </div>
      
      <div className="md:col-span-2 flex items-center space-x-2">
        <Checkbox
          id="isFavorite"
          checked={formData.is_favorite}
          onCheckedChange={(checked) => onChange({ is_favorite: checked as boolean })}
        />
        <Label htmlFor="isFavorite" className="text-gray-900 dark:text-gray-100">Mark as Favorite</Label>
      </div>
    </>
  );
};
