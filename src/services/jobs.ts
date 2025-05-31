
import { supabase } from '@/integrations/supabase/client';
import { Job } from '@/types/job';

// Mock data for development - easily replaceable with real API calls
const mockJob: Job = {
  id: 'job-123',
  title: 'HVAC System Installation',
  client: 'ABC Corporation',
  phase: 'In Progress',
  startDate: '2024-01-15',
  endDate: '2024-01-30',
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
  location: '123 Business Ave, Suite 100, City, State 12345',
  description: 'Complete HVAC system installation for commercial building including ductwork, units, and controls.',
  contactInfo: {
    name: 'Mike Wilson',
    phone: '(555) 123-4567',
    email: 'mike.wilson@abccorp.com'
  }
};

export const fetchJob = async (jobId: string): Promise<Job> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // In real implementation, this would be:
  // const { data, error } = await supabase
  //   .from('jobs')
  //   .select('*')
  //   .eq('id', jobId)
  //   .single();
  // 
  // if (error) throw error;
  // return data;
  
  return { ...mockJob, id: jobId };
};

export const updateJob = async (jobId: string, updates: Partial<Job>): Promise<Job> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // In real implementation, this would be:
  // const { data, error } = await supabase
  //   .from('jobs')
  //   .update(updates)
  //   .eq('id', jobId)
  //   .select()
  //   .single();
  // 
  // if (error) throw error;
  // return data;
  
  return { ...mockJob, ...updates, id: jobId };
};
