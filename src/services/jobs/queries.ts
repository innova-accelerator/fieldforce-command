
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
  console.log('🔍 fetchAllJobs - Starting query');
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.error('❌ fetchAllJobs - User not authenticated');
    throw new Error('User not authenticated');
  }
  console.log('✅ fetchAllJobs - User authenticated:', user.id);

  const { data: jobs, error } = await supabase
    .from('jobs')
    .select(JOB_SELECT_QUERY)
    .eq('user_id', user.id);

  if (error) {
    console.error('❌ fetchAllJobs - Database error:', error);
    throw error;
  }

  console.log('📊 fetchAllJobs - Raw jobs from database:', jobs);
  console.log('📊 fetchAllJobs - Number of jobs returned:', jobs?.length || 0);

  if (jobs && jobs.length > 0) {
    jobs.forEach((job, index) => {
      console.log(`📋 fetchAllJobs - Job ${index + 1}:`, {
        id: job.id,
        name: job.name,
        job_number: job.job_number,
        job_number_type: typeof job.job_number,
        created_at: job.created_at
      });
    });
  }

  const transformedJobs = (jobs || []).map((job: JobQueryResult) => {
    console.log('🔄 fetchAllJobs - Transforming job:', job.id);
    const transformed = transformJobFromDatabase(job);
    console.log('✅ fetchAllJobs - Transformed job:', {
      id: transformed.id,
      name: transformed.name,
      job_number: transformed.job_number,
      job_number_type: typeof transformed.job_number
    });
    return transformed;
  });

  console.log('🎯 fetchAllJobs - Final result count:', transformedJobs.length);
  return transformedJobs;
};

export const fetchJob = async (jobId: string): Promise<Job> => {
  console.log('🔍 fetchJob - Starting query for jobId:', jobId);
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.error('❌ fetchJob - User not authenticated');
    throw new Error('User not authenticated');
  }
  console.log('✅ fetchJob - User authenticated:', user.id);

  const { data: job, error } = await supabase
    .from('jobs')
    .select(JOB_SELECT_QUERY)
    .eq('id', jobId)
    .eq('user_id', user.id)
    .single();

  if (error) {
    console.error('❌ fetchJob - Database error:', error);
    throw error;
  }

  console.log('📊 fetchJob - Raw job from database:', job);
  console.log('📊 fetchJob - Job details:', {
    id: job.id,
    name: job.name,
    job_number: job.job_number,
    job_number_type: typeof job.job_number,
    created_at: job.created_at
  });

  console.log('🔄 fetchJob - Starting transformation');
  const transformedJob = transformJobFromDatabase(job);
  console.log('✅ fetchJob - Transformed job:', {
    id: transformedJob.id,
    name: transformedJob.name,
    job_number: transformedJob.job_number,
    job_number_type: typeof transformedJob.job_number
  });
  
  return transformedJob;
};
