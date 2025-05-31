import { useQuery } from '@tanstack/react-query';
import { Job } from '../types/job';

// Mock data for development
const mockJob: Job = {
  id: '1',
  title: 'HVAC System Installation',
  description: 'Complete HVAC system installation for commercial building',
  customerId: '1',
  customerName: 'ABC Corporation',
  location: '123 Business Ave, Suite 100, City, State 12345',
  priority: 'high',
  status: 'in-progress',
  assignedTo: 'tech-1',
  assignedToName: 'John Smith',
  scheduledDate: new Date('2024-01-15'),
  completedDate: undefined,
  createdAt: new Date('2024-01-01'),
  estimatedDuration: 8,
  tags: ['HVAC', 'Commercial', 'Installation']
};

const fetchJob = async (jobId: string): Promise<Job> => {
  // In real implementation, this would be an API call
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
  return { ...mockJob, id: jobId };
};

export const useJob = (jobId: string) => {
  return useQuery({
    queryKey: ['job', jobId],
    queryFn: () => fetchJob(jobId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
