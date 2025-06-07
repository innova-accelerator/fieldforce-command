
import { Job, Task, TimelineEntry } from '@/types/job';
import { JobQueryResult, JobUpdateData } from './types';

export const transformJobFromDatabase = (job: JobQueryResult): Job => {
  console.log('🔄 transformJobFromDatabase - Starting transformation for job:', job.id);
  console.log('📊 transformJobFromDatabase - Input job_number:', {
    value: job.job_number,
    type: typeof job.job_number,
    isNull: job.job_number === null,
    isUndefined: job.job_number === undefined,
    isEmpty: job.job_number === ''
  });

  const transformed = {
    id: job.id,
    job_number: job.job_number,
    name: job.name,
    description: job.description,
    customer_id: job.customer_id,
    organization_id: job.organization_id,
    assigned_person_id: job.assigned_person_id,
    location: job.location,
    phase: job.phase,
    status: job.status as Job['status'],
    priority: job.priority as Job['priority'],
    start_date: job.start_date,
    end_date: job.end_date,
    scheduled_date: job.scheduled_date,
    estimated_duration: job.estimated_duration,
    assigned_techs: job.assigned_techs || [],
    contact_name: job.contact_name,
    contact_phone: job.contact_phone,
    contact_email: job.contact_email,
    tags: job.tags || [],
    is_favorite: job.is_favorite,
    notes: job.notes || [],
    tasks: (job.tasks || []).map((task: any) => ({
      id: task.id,
      job_id: task.job_id,
      label: task.label,
      complete: task.complete,
      due_date: task.due_date,
      priority: task.priority,
      created_at: task.created_at,
      updated_at: task.updated_at,
      parent_task_id: task.parent_task_id,
      order_index: task.order_index,
      assignee_id: task.assignee_id,
      assignee_name: task.assignee_name,
    })),
    timeline: (job.timeline_entries || []).map((entry: any) => ({
      id: entry.id,
      job_id: entry.job_id,
      timestamp: entry.timestamp,
      type: entry.type,
      content: entry.content,
      author_id: entry.author_id,
      created_at: entry.created_at,
    })),
    created_at: job.created_at,
    updated_at: job.updated_at,
    user_id: job.user_id,
    customerName: job.customers?.name || '',
    assignedPersonName: job.people ? `${job.people.first_name} ${job.people.last_name}` : '',
  };

  console.log('✅ transformJobFromDatabase - Output job_number:', {
    value: transformed.job_number,
    type: typeof transformed.job_number,
    isNull: transformed.job_number === null,
    isUndefined: transformed.job_number === undefined,
    isEmpty: transformed.job_number === ''
  });

  console.log('🎯 transformJobFromDatabase - Complete transformed job:', {
    id: transformed.id,
    name: transformed.name,
    job_number: transformed.job_number,
    customerName: transformed.customerName,
    assignedPersonName: transformed.assignedPersonName
  });

  return transformed;
};

export const prepareJobForDatabase = (job: Partial<Job>): JobUpdateData => {
  console.log('🔄 prepareJobForDatabase - Starting preparation');
  console.log('📊 prepareJobForDatabase - Input job_number:', {
    value: job.job_number,
    type: typeof job.job_number
  });

  const { tasks, timeline, customerName, assignedPersonName, job_number, ...dbJob } = job;
  
  const prepared = {
    ...dbJob,
    job_number,
  };

  console.log('✅ prepareJobForDatabase - Output job_number:', {
    value: prepared.job_number,
    type: typeof prepared.job_number
  });

  return prepared;
};
