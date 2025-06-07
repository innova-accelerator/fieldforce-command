
import React, { useState } from 'react';
import { Calendar, Clock, User, MapPin, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useAssociates } from '../hooks/useData';
import { mockJobs } from '../data/mockData';

interface ScheduleEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (eventData: ScheduleEventData) => void;
}

export interface ScheduleEventData {
  jobId: string;
  title: string;
  description: string;
  scheduledDate: string;
  startTime: string;
  endTime: string;
  assignedTechs: string[];
  location: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
}

const ScheduleEventModal: React.FC<ScheduleEventModalProps> = ({ isOpen, onClose, onSchedule }) => {
  const { data: associates = [] } = useAssociates();
  const [formData, setFormData] = useState<ScheduleEventData>({
    jobId: '',
    title: '',
    description: '',
    scheduledDate: '',
    startTime: '',
    endTime: '',
    assignedTechs: [],
    location: '',
    priority: 'Medium'
  });

  const activeJobs = mockJobs.filter(job => job.status === 'New' || job.status === 'Scheduled' || job.status === 'In Progress');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.jobId && formData.title && formData.scheduledDate && formData.startTime) {
      onSchedule(formData);
      onClose();
      // Reset form
      setFormData({
        jobId: '',
        title: '',
        description: '',
        scheduledDate: '',
        startTime: '',
        endTime: '',
        assignedTechs: [],
        location: '',
        priority: 'Medium'
      });
    }
  };

  const handleJobSelect = (jobId: string) => {
    const selectedJob = activeJobs.find(job => job.id === jobId);
    if (selectedJob) {
      setFormData(prev => ({
        ...prev,
        jobId,
        title: `${selectedJob.name} - Site Visit`,
        location: selectedJob.location,
        assignedTechs: selectedJob.assigned_techs || []
      }));
    }
  };

  const toggleTechAssignment = (techId: string) => {
    setFormData(prev => ({
      ...prev,
      assignedTechs: prev.assignedTechs.includes(techId)
        ? prev.assignedTechs.filter(id => id !== techId)
        : [...prev.assignedTechs, techId]
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-[#212121] rounded-lg shadow-xl dark:shadow-none border border-gray-200 dark:border-[#303030] max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-[#303030]">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Schedule Event</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Job Selection */}
          <div>
            <Label htmlFor="jobSelect" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Select Job
            </Label>
            <Select value={formData.jobId} onValueChange={handleJobSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Choose an active job..." />
              </SelectTrigger>
              <SelectContent>
                {activeJobs.map((job) => (
                  <SelectItem key={job.id} value={job.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{job.name}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{job.customerName} - {job.status}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Event Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="title" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Event Title
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
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
                onChange={(e) => setFormData(prev => ({ ...prev, scheduledDate: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="priority" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Priority
              </Label>
              <Select value={formData.priority} onValueChange={(value: 'Low' | 'Medium' | 'High' | 'Urgent') => setFormData(prev => ({ ...prev, priority: value }))}>
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
                onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
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
                onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <Label htmlFor="location" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              <MapPin className="h-4 w-4 inline mr-1" />
              Location
            </Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              placeholder="Event location"
            />
          </div>

          {/* Assigned Techs */}
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
                    checked={formData.assignedTechs.includes(associate.id)}
                    onChange={() => toggleTechAssignment(associate.id)}
                    className="rounded border-gray-300 dark:border-gray-600"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{associate.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Additional notes or description for this event..."
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-[#303030]">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Event
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleEventModal;
