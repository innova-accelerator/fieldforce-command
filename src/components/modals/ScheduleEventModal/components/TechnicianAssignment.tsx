
import React from 'react';
import { User } from 'lucide-react';
import { Label } from '../../../ui/label';
import { useAssociates } from '../../../../hooks/useData';

interface TechnicianAssignmentProps {
  assignedTechs: string[];
  onToggleTech: (techId: string) => void;
}

export const TechnicianAssignment: React.FC<TechnicianAssignmentProps> = ({
  assignedTechs,
  onToggleTech
}) => {
  const { data: associates = [] } = useAssociates();

  return (
    <div>
      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
        <User className="h-4 w-4 inline mr-1" />
        Assign Technicians
      </Label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-32 overflow-y-auto border border-gray-200 dark:border-[#303030] rounded-lg p-3">
        {associates.map((associate) => (
          <label key={associate.id} className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={assignedTechs.includes(associate.id)}
              onChange={() => onToggleTech(associate.id)}
              className="rounded border-gray-300 dark:border-gray-600"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">{associate.name}</span>
          </label>
        ))}
      </div>
    </div>
  );
};
