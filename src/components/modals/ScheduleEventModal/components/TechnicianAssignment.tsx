
import React from 'react';
import { User } from 'lucide-react';
import { Label } from '../../../ui/label';
import { usePeople } from '../../../../hooks/useData';

interface TechnicianAssignmentProps {
  assignedTechs: string[];
  onToggleTech: (techId: string) => void;
}

export const TechnicianAssignment: React.FC<TechnicianAssignmentProps> = ({
  assignedTechs,
  onToggleTech
}) => {
  const { data: people = [] } = usePeople();

  // Filter people who are technicians
  const availableTechnicians = people.filter(person => person.is_technician);

  return (
    <div>
      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
        <User className="h-4 w-4 inline mr-1" />
        Assign Technicians
      </Label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-32 overflow-y-auto border border-gray-200 dark:border-[#303030] rounded-lg p-3">
        {availableTechnicians.length === 0 ? (
          <div className="col-span-2 text-center py-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No technicians available. Please add people with technician role first.
            </p>
          </div>
        ) : (
          availableTechnicians.map((person) => (
            <label key={person.id} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={assignedTechs.includes(person.id)}
                onChange={() => onToggleTech(person.id)}
                className="rounded border-gray-300 dark:border-gray-600"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {person.first_name} {person.last_name}
                {person.title && (
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                    ({person.title})
                  </span>
                )}
              </span>
            </label>
          ))
        )}
      </div>
    </div>
  );
};
