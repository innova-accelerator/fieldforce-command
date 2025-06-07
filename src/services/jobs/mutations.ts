
import { supabase } from '@/integrations/supabase/client';
import { Job, Task, TimelineEntry } from '@/types/job';
import { JobUpdateData } from './types';
import { transformJobFromDatabase, prepareJobForDatabase } from './transformers';
import { generateJobNumber } from './jobNumberGenerator';

const JOB_SELECT_QUERY = `
  *,
  tasks (*),
  timeline_entries (*),
  customers (name),
  people (first_name, last_name)
`;

const handleTasksUpdate = async (jobId: string, tasks: Task[]) => {
  for (const task of tasks) {
    const taskData = {
      ...task,
      priority: (task.priority === 'high' ? 'high' : task.priority === 'medium' ? 'medium' : 'low') as Task['priority']
    };
    
    if (task.id && task.id.startsWith('task-')) {
      // This is a new task, insert it
      const { id, ...insertData } = taskData;
      await supabase
        .from('tasks')
        .insert({ ...insertData, job_id: jobId });
    } else if (task.id) {
      // This is an existing task, update it
      const { id, ...updateData } = taskData;
      await supabase
        .from('tasks')
        .update(updateData)
        .eq('id', id);
    }
  }
};

const handleTimelineUpdate = async (jobId: string, timeline: TimelineEntry[]) => {
  for (const entry of timeline) {
    if (!entry.id) {
      // This is a new timeline entry, insert it
      await supabase
        .from('timeline_entries')
        .insert({ ...entry, job_id: jobId });
    }
  }
};

export const updateJob = async (jobId: string, updates: Partial<Job>): Promise<Job> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const dbUpdates = prepareJobForDatabase(updates);

  const { data: updatedJob, error } = await supabase
    .from('jobs')
    .update(dbUpdates)
    .eq('id', jobId)
    .eq('user_id', user.id)
    .select(JOB_SELECT_QUERY)
    .single();

  if (error) throw error;

  // Handle tasks updates if provided
  if (updates.tasks) {
    await handleTasksUpdate(jobId, updates.tasks);
  }

  // Handle timeline updates if provided
  if (updates.timeline) {
    await handleTimelineUpdate(jobId, updates.timeline);
  }

  return transformJobFromDatabase(updatedJob);
};

export const createJob = async (jobData: Partial<Job>): Promise<Job> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // Generate the job number
  const jobNumber = await generateJobNumber();

  const dbData = prepareJobForDatabase(jobData);

  // Ensure required fields are present and priority is valid
  const insertData = {
    ...dbData,
    job_number: jobNumber, // Add the generated job number
    name: dbData.name || 'Untitled Job',
    priority: (dbData.priority as 'Low' | 'Medium' | 'High' | 'Urgent') || 'Medium',
    user_id: user.id
  };

  const { data: newJob, error } = await supabase
    .from('jobs')
    .insert(insertData)
    .select(JOB_SELECT_QUERY)
    .single();

  if (error) throw error;

  return transformJobFromDatabase(newJob);
};
