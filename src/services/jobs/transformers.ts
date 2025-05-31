
import { Job, Task, TimelineEntry } from '@/types/job';
import { JobQueryResult } from './types';

const isValidStatus = (status: string): status is Job['status'] => {
  return ['New', 'Scheduled', 'In Progress', 'Completed', 'Cancelled'].includes(status);
};

const isValidPriority = (priority: string): priority is Job['priority'] => {
  return ['Low', 'Medium', 'High', 'Urgent'].includes(priority);
};

const isValidTaskPriority = (priority: string): priority is Task['priority'] => {
  return ['low', 'medium', 'high'].includes(priority);
};

const isValidTimelineType = (type: string): type is TimelineEntry['type'] => {
  return ['note', 'status', 'assignment', 'scheduling'].includes(type);
};

export const transformJobFromDatabase = (job: JobQueryResult): Job => {
  return {
    ...job,
    status: isValidStatus(job.status) ? job.status : 'New',
    priority: isValidPriority(job.priority) ? job.priority : 'Medium',
    tasks: job.tasks?.map((task: any) => ({
      ...task,
      priority: isValidTaskPriority(task.priority) ? task.priority : 'low'
    })) || [],
    timeline: job.timeline_entries?.map((entry: any) => ({
      ...entry,
      type: isValidTimelineType(entry.type) ? entry.type : 'note'
    })) || [],
    customerName: job.customers?.name,
    assignedPersonName: job.people ? `${job.people.first_name} ${job.people.last_name}` : undefined,
  };
};

export const prepareJobForDatabase = (updates: Partial<Job>) => {
  const { tasks, timeline, customerName, assignedPersonName, user_id, ...dbUpdates } = updates;
  return dbUpdates;
};
