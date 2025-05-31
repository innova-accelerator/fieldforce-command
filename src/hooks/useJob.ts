
import { useState } from 'react';
import { Job, Task, TimelineEntry } from '../types/job';

// Mock job data with proper snake_case fields
const mockJob: Job = {
  id: 'job-1',
  name: 'Network Infrastructure Setup',
  description: 'Complete network infrastructure installation for new office building',
  customer_id: 'customer-1',
  organization_id: 'org-1',
  assigned_person_id: 'person-1',
  location: '123 Tech Park, Silicon Valley, CA',
  phase: 'Planning',
  status: 'New',
  priority: 'High',
  start_date: '2024-02-01T09:00:00Z',
  end_date: '2024-02-15T17:00:00Z',
  scheduled_date: '2024-02-01T09:00:00Z',
  estimated_duration: 80,
  assigned_techs: ['tech-1', 'tech-2'],
  contact_name: 'John Smith',
  contact_phone: '555-0123',
  contact_email: 'john.smith@example.com',
  tags: ['networking', 'installation', 'enterprise'],
  is_favorite: false,
  notes: ['Client prefers morning installations', 'Security clearance required'],
  tasks: [
    { id: 'task-1', job_id: 'job-1', label: 'Site survey and assessment', complete: true, due_date: '2024-01-25T17:00:00Z', priority: 'high', created_at: '2024-01-20T09:00:00Z', updated_at: '2024-01-22T14:30:00Z' },
    { id: 'task-2', job_id: 'job-1', label: 'Order networking equipment', complete: true, due_date: '2024-01-28T17:00:00Z', priority: 'high', created_at: '2024-01-20T09:00:00Z', updated_at: '2024-01-26T10:15:00Z' },
    { id: 'task-3', job_id: 'job-1', label: 'Schedule installation team', complete: false, due_date: '2024-01-30T17:00:00Z', priority: 'medium', created_at: '2024-01-20T09:00:00Z', updated_at: '2024-01-20T09:00:00Z' },
    { id: 'task-4', job_id: 'job-1', label: 'Prepare installation documentation', complete: false, priority: 'low', created_at: '2024-01-20T09:00:00Z', updated_at: '2024-01-20T09:00:00Z' }
  ],
  timeline: [
    {
      id: 'timeline-1',
      job_id: 'job-1',
      timestamp: '2024-01-26T10:15:00Z',
      type: 'status',
      content: 'Equipment ordered and confirmed delivery for Jan 30th',
      author_id: 'person-1',
      created_at: '2024-01-26T10:15:00Z'
    },
    {
      id: 'timeline-2',
      job_id: 'job-1',
      timestamp: '2024-01-22T14:30:00Z',
      type: 'note',
      content: 'Site survey completed. Network topology diagram attached.',
      author_id: 'person-2',
      created_at: '2024-01-22T14:30:00Z'
    },
    {
      id: 'timeline-3',
      job_id: 'job-1',
      timestamp: '2024-01-21T11:00:00Z',
      type: 'assignment',
      content: 'Alex Thompson assigned as lead technician',
      author_id: 'person-1',
      created_at: '2024-01-21T11:00:00Z'
    },
    {
      id: 'timeline-4',
      job_id: 'job-1',
      timestamp: '2024-01-20T09:00:00Z',
      type: 'scheduling',
      content: 'Job scheduled for February 1st - 15th, 2024',
      author_id: 'person-1',
      created_at: '2024-01-20T09:00:00Z'
    },
    {
      id: 'timeline-5',
      job_id: 'job-1',
      timestamp: '2024-01-20T09:00:00Z',
      type: 'note',
      content: 'Job created and initial planning phase started',
      author_id: 'person-1',
      created_at: '2024-01-20T09:00:00Z'
    }
  ],
  created_at: '2024-01-20T09:00:00Z',
  updated_at: '2024-01-26T10:15:00Z',
  user_id: 'user-1',
  customerName: 'TechCorp Solutions',
  assignedPersonName: 'Sarah Johnson'
};

export const useJob = (jobId: string) => {
  const [job, setJob] = useState<Job>(mockJob);
  const [isLoading, setIsLoading] = useState(false);

  const updateJob = (updates: Partial<Job>) => {
    setJob(prev => ({
      ...prev,
      ...updates,
      updated_at: new Date().toISOString()
    }));
  };

  const addTask = (newTask: Omit<Task, 'id' | 'job_id' | 'created_at' | 'updated_at'>) => {
    const task: Task = {
      ...newTask,
      id: `task-${Date.now()}`,
      job_id: job.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    setJob(prev => ({
      ...prev,
      tasks: [...prev.tasks, task]
    }));
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setJob(prev => ({
      ...prev,
      tasks: prev.tasks.map(task => 
        task.id === taskId 
          ? { ...task, ...updates, updated_at: new Date().toISOString() }
          : task
      )
    }));
  };

  const addTimelineEntry = (entry: Omit<TimelineEntry, 'id' | 'job_id' | 'timestamp' | 'created_at'>) => {
    const timelineEntry: TimelineEntry = {
      ...entry,
      id: `timeline-${Date.now()}`,
      job_id: job.id,
      timestamp: new Date().toISOString(),
      created_at: new Date().toISOString()
    };
    
    setJob(prev => ({
      ...prev,
      timeline: [timelineEntry, ...prev.timeline]
    }));
  };

  return {
    job,
    isLoading,
    updateJob,
    addTask,
    updateTask,
    addTimelineEntry
  };
};
