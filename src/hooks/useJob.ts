
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchJob, updateJob } from '../services/jobs';
import { Job } from '../types/job';

const mockJob: Job = {
  id: 'job-123',
  name: 'HVAC System Installation',
  description: 'Complete HVAC system installation for commercial building including ductwork, units, and controls.',
  customerName: 'ABC Corporation',
  phase: 'In Progress',
  status: 'In Progress',
  priority: 'High',
  startDate: new Date('2024-01-15').toISOString(),
  endDate: new Date('2024-01-30').toISOString(),
  assignedPersonId: 'person-1',
  organizationId: 'org-1',
  scheduledDate: new Date('2024-01-15').toISOString(),
  estimatedDuration: 8,
  location: '123 Business Ave, Suite 100, City, State 12345',
  isFavorite: false,
  assignedTechs: [
    'tech-1',
    'tech-2'
  ],
  tasks: [
    { id: 'task-1', label: 'Site survey completed', complete: true, dueDate: '2024-01-10' },
    { id: 'task-2', label: 'Equipment procurement', complete: true, dueDate: '2024-01-12' },
    { id: 'task-3', label: 'Installation phase 1', complete: false, dueDate: '2024-01-16' },
    { id: 'task-4', label: 'System testing', complete: false, dueDate: '2024-01-25' }
  ],
  notes: [
    'Initial assessment completed - all requirements confirmed',
    'Client requested additional ventilation in conference room',
    'Equipment delivery scheduled for January 14th'
  ],
  timeline: [
    { 
      timestamp: '2024-01-15T10:30:00Z', 
      type: 'status', 
      content: 'Job status changed to In Progress',
      author: 'John Smith'
    },
    { 
      timestamp: '2024-01-14T15:45:00Z', 
      type: 'note', 
      content: 'Equipment delivery confirmed for tomorrow morning',
      author: 'Sarah Johnson'
    },
    { 
      timestamp: '2024-01-14T09:20:00Z', 
      type: 'assignment', 
      content: 'Sarah Johnson assigned to installation team',
      author: 'Project Manager'
    },
    { 
      timestamp: '2024-01-12T14:15:00Z', 
      type: 'note', 
      content: 'Site survey completed. Ready for equipment procurement.',
      author: 'John Smith'
    },
    { 
      timestamp: '2024-01-10T11:30:00Z', 
      type: 'status', 
      content: 'Job created and assigned to team',
      author: 'Admin'
    }
  ],
  contactInfo: {
    name: 'Mike Wilson',
    phone: '(555) 123-4567',
    email: 'mike.wilson@abccorp.com'
  },
  clientId: '1',
  tags: ['HVAC', 'Installation'],
  assignedToName: 'John Smith',
  createdAt: new Date('2024-01-10').toISOString(),
  updatedAt: new Date('2024-01-15').toISOString()
};

export const useJob = (jobId: string) => {
  return useQuery({
    queryKey: ['job', jobId],
    queryFn: () => fetchJob(jobId),
  });
};

export const useUpdateJob = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ jobId, updates }: { jobId: string; updates: Partial<Job> }) =>
      updateJob(jobId, updates),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['job', variables.jobId] });
    },
  });
};
