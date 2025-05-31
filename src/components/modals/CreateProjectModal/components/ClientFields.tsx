
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PersonResponse } from '@/services/api/people';
import { FormData } from '../types';

interface ClientFieldsProps {
  formData: FormData;
  onChange: (updates: Partial<FormData>) => void;
  people: PersonResponse[];
  selectedClient: PersonResponse | null;
  loadingPeople: boolean;
  loadingClient: boolean;
  onClientChange: (personId: string) => void;
}

export const ClientFields: React.FC<ClientFieldsProps> = ({
  formData,
  onChange,
  people,
  selectedClient,
  loadingPeople,
  loadingClient,
  onClientChange
}) => {
  return (
    <>
      <div className="md:col-span-2">
        <Label htmlFor="clientSelect" className="text-gray-900 dark:text-gray-100">Client (Person)</Label>
        <Select onValueChange={onClientChange} disabled={loadingPeople}>
          <SelectTrigger id="clientSelect" className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100">
            <SelectValue placeholder={loadingPeople ? "Loading..." : "Select client"} />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
            {people.map(person => (
              <SelectItem key={person.id} value={person.id} className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700">
                {person.firstName} {person.lastName} - {person.email}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {loadingClient && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Loading client data...</p>}
      </div>
      
      <div className="md:col-span-2">
        <Label htmlFor="organizationDisplay" className="text-gray-900 dark:text-gray-100">Organization</Label>
        <Input
          id="organizationDisplay"
          value={selectedClient ? `${selectedClient.organizationId} (Auto-populated)` : ''}
          disabled
          placeholder="Will be auto-populated when client is selected"
          className="bg-gray-100 dark:bg-gray-600 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300"
        />
      </div>
    </>
  );
};
