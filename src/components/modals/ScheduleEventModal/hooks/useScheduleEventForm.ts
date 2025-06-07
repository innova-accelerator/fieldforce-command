
import { useState } from 'react';
import { ScheduleEventData } from '../types';
import { mockJobs } from '../../../../data/mockData';

export const useScheduleEventForm = () => {
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

  const updateFormData = (updates: Partial<ScheduleEventData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const resetForm = () => {
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
  };

  return {
    formData,
    activeJobs,
    handleJobSelect,
    toggleTechAssignment,
    updateFormData,
    resetForm
  };
};
