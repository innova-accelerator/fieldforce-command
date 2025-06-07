
import React from 'react';
import { Input } from '../../../ui/input';
import { Label } from '../../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../ui/select';
import { ScheduleEventData } from '../types';

interface EventDetailsProps {
  formData: ScheduleEventData;
  onUpdate: (updates: Partial<ScheduleEventData>) => void;
}

export const EventDetails: React.FC<EventDetailsProps> = ({ formData, onUpdate }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="md:col-span-2">
        <Label htmlFor="title" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
          Event Title
        </Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
          placeholder="e.g., Site inspection, Installation, etc."
          required
        />
      </div>

      <div>
        <Label htmlFor="scheduledDate" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
          Date
        </Label>
        <Input
          id="scheduledDate"
          type="date"
          value={formData.scheduledDate}
          onChange={(e) => onUpdate({ scheduledDate: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="priority" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
          Priority
        </Label>
        <Select 
          value={formData.priority} 
          onValueChange={(value: 'Low' | 'Medium' | 'High' | 'Urgent') => onUpdate({ priority: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Low">Low</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="High">High</SelectItem>
            <SelectItem value="Urgent">Urgent</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="startTime" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
          Start Time
        </Label>
        <Input
          id="startTime"
          type="time"
          value={formData.startTime}
          onChange={(e) => onUpdate({ startTime: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="endTime" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
          End Time
        </Label>
        <Input
          id="endTime"
          type="time"
          value={formData.endTime}
          onChange={(e) => onUpdate({ endTime: e.target.value })}
        />
      </div>
    </div>
  );
};
