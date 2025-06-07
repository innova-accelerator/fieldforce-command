
import React from 'react';
import { Calendar, X } from 'lucide-react';
import { Button } from '../../ui/button';
import { ScheduleEventModalProps } from './types';
import { useScheduleEventForm } from './hooks/useScheduleEventForm';
import { JobSelection } from './components/JobSelection';
import { EventDetails } from './components/EventDetails';
import { TechnicianAssignment } from './components/TechnicianAssignment';
import { LocationAndDescription } from './components/LocationAndDescription';

const ScheduleEventModal: React.FC<ScheduleEventModalProps> = ({ isOpen, onClose, onSchedule }) => {
  const {
    formData,
    activeJobs,
    handleJobSelect,
    toggleTechAssignment,
    updateFormData,
    resetForm
  } = useScheduleEventForm();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.jobId && formData.title && formData.scheduledDate && formData.startTime) {
      onSchedule(formData);
      onClose();
      resetForm();
    }
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
          <JobSelection
            activeJobs={activeJobs}
            selectedJobId={formData.jobId}
            onJobSelect={handleJobSelect}
          />

          <EventDetails
            formData={formData}
            onUpdate={updateFormData}
          />

          <LocationAndDescription
            formData={formData}
            onUpdate={updateFormData}
          />

          <TechnicianAssignment
            assignedTechs={formData.assignedTechs}
            onToggleTech={toggleTechAssignment}
          />

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
