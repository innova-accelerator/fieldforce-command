import { useQuery } from '@tanstack/react-query';
import { Job } from '../types';

// Mock data for development
const mockJob: Job = {
  id: 'job-123',
  title: 'HVAC System Installation',
  name: 'HVAC System Installation',
  description: 'Complete HVAC system installation for commercial building including ductwork, units, and controls.',
  client: 'ABC Corporation',
  phase: 'In Progress',
  status: 'in-progress',
  priority: 'high',
  startDate: new Date('2024-01-15'),
  endDate: new Date('2024-01-30'),
  assignedPersonId: 'person-1',
  organizationId: 'org-1',
  createdAt: new Date('2024-01-10'),
  location: '123 Business Ave, Suite 100, City, State 12345',
  isFavorite: false,
  assignedTechs: [
    { id: 'tech-1', name: 'John Smith', avatarUrl: '/placeholder.svg' },
    { id: 'tech-2', name: 'Sarah Johnson', avatarUrl: '/placeholder.svg' }
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
    }
  ],
  contactInfo: {
    name: 'Mike Wilson',
    phone: '(555) 123-4567',
    email: 'mike.wilson@abccorp.com'
  },
  customerId: '1',
  customerName: 'ABC Corporation',
  estimatedDuration: 8,
  scheduledDate: new Date('2024-01-15'),
  tags: ['HVAC', 'Installation'],
  assignedToName: 'John Smith'
};

export const useJob = (jobId: string) => {
  return useQuery({
    queryKey: ['job', jobId],
    queryFn: async (): Promise<Job> => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { ...mockJob, id: jobId };
    },
  });
};
