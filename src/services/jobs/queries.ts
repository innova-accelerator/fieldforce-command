
import { supabase } from '@/integrations/supabase/client';
import { Job } from '@/types/job';
import { JobQueryResult } from './types';
import { transformJobFromDatabase } from './transformers';

const JOB_SELECT_QUERY = `
  *,
  tasks (*),
  timeline_entries (*),
  customers (name),
  people (first_name, last_name)
`;

export const fetchAllJobs = async (): Promise<Job[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data: jobs, error } = await supabase
    .from('jobs')
    .select(JOB_SELECT_QUERY)
    .eq('user_id', user.id);

  if (error) throw error;

  return (jobs || []).map((job: JobQueryResult) => transformJobFromDatabase(job));
};

export const fetchJob = async (jobId: string): Promise<Job> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data: job, error } = await supabase
    .from('jobs')
    .select(JOB_SELECT_QUERY)
    .eq('id', jobId)
    .eq('user_id', user.id)
    .single();

  if (error) throw error;

  return transformJobFromDatabase(job);
};
