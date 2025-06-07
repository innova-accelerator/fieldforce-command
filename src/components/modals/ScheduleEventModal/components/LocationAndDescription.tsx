
import React from 'react';
import { MapPin } from 'lucide-react';
import { Input } from '../../../ui/input';
import { Label } from '../../../ui/label';
import { Textarea } from '../../../ui/textarea';
import { ScheduleEventData } from '../types';

interface LocationAndDescriptionProps {
  formData: ScheduleEventData;
  onUpdate: (updates: Partial<ScheduleEventData>) => void;
}

export const LocationAndDescription: React.FC<LocationAndDescriptionProps> = ({
  formData,
  onUpdate
}) => {
  return (
    <>
      <div>
        <Label htmlFor="location" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
          <MapPin className="h-4 w-4 inline mr-1" />
          Location
        </Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => onUpdate({ location: e.target.value })}
          placeholder="Event location"
        />
      </div>

      <div>
        <Label htmlFor="description" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
          Description
        </Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => onUpdate({ description: e.target.value })}
          placeholder="Additional notes or description for this event..."
          rows={3}
        />
      </div>
    </>
  );
};
