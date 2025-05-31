import { supabase } from '@/integrations/supabase/client';
import { Job, Task, TimelineEntry } from '@/types/job';

export const fetchJob = async (jobId: string): Promise<Job> => {
  const { data: job, error } = await supabase
    .from('jobs')
    .select(`
      *,
      tasks (*),
      timeline_entries (*),
      customers (name),
      people (first_name, last_name)
    `)
    .eq('id', jobId)
    .single();

  if (error) throw error;

  // Transform the data to match our Job interface
  const transformedJob: Job = {
    ...job,
    tasks: job.tasks?.map((task: any) => ({
      ...task,
      priority: task.priority === 'high' ? 'high' : task.priority === 'medium' ? 'medium' : 'low'
    })) || [],
    timeline: job.timeline_entries || [],
    customerName: job.customers?.name,
    assignedPersonName: job.people ? `${job.people.first_name} ${job.people.last_name}` : undefined,
  };

  return transformedJob;
};

export const updateJob = async (jobId: string, updates: Partial<Job>): Promise<Job> => {
  // Remove computed fields and user_id before updating
  const { tasks, timeline, customerName, assignedPersonName, user_id, ...dbUpdates } = updates;

  const { data: updatedJob, error } = await supabase
    .from('jobs')
    .update(dbUpdates)
    .eq('id', jobId)
    .select(`
      *,
      tasks (*),
      timeline_entries (*),
      customers (name),
      people (first_name, last_name)
    `)
    .single();

  if (error) throw error;

  // Handle tasks updates if provided
  if (tasks) {
    for (const task of tasks) {
      const taskData = {
        ...task,
        priority: task.priority === 'high' ? 'high' : task.priority === 'medium' ? 'medium' : 'low'
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
  }

  // Handle timeline updates if provided
  if (timeline) {
    for (const entry of timeline) {
      if (!entry.id) {
        // This is a new timeline entry, insert it
        await supabase
          .from('timeline_entries')
          .insert({ ...entry, job_id: jobId });
      }
    }
  }

  // Transform the response
  const transformedJob: Job = {
    ...updatedJob,
    tasks: updatedJob.tasks?.map((task: any) => ({
      ...task,
      priority: task.priority === 'high' ? 'high' : task.priority === 'medium' ? 'medium' : 'low'
    })) || [],
    timeline: updatedJob.timeline_entries || [],
    customerName: updatedJob.customers?.name,
    assignedPersonName: updatedJob.people ? `${updatedJob.people.first_name} ${updatedJob.people.last_name}` : undefined,
  };

  return transformedJob;
};

export const createJob = async (jobData: Partial<Job>): Promise<Job> => {
  // Remove computed fields before creating
  const { tasks, timeline, customerName, assignedPersonName, user_id, ...dbData } = jobData;

  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // Ensure required fields are present and priority is valid
  const insertData = {
    ...dbData,
    name: dbData.name || 'Untitled Job',
    priority: (dbData.priority as 'Low' | 'Medium' | 'High' | 'Urgent') || 'Medium',
    user_id: user.id
  };

  const { data: newJob, error } = await supabase
    .from('jobs')
    .insert(insertData)
    .select(`
      *,
      tasks (*),
      timeline_entries (*),
      customers (name),
      people (first_name, last_name)
    `)
    .single();

  if (error) throw error;

  // Transform the response
  const transformedJob: Job = {
    ...newJob,
    tasks: newJob.tasks?.map((task: any) => ({
      ...task,
      priority: task.priority === 'high' ? 'high' : task.priority === 'medium' ? 'medium' : 'low'
    })) || [],
    timeline: newJob.timeline_entries || [],
    customerName: newJob.customers?.name,
    assignedPersonName: newJob.people ? `${newJob.people.first_name} ${newJob.people.last_name}` : undefined,
  };

  return transformedJob;
};
