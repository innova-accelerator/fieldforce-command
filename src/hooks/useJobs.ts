
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useJobs = () => {
  console.log('🪝 useJobs - Hook called');
  
  return useQuery({
    queryKey: ['jobs'],
    queryFn: async () => {
      console.log('🔍 useJobs - Query function started');
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('❌ useJobs - User not authenticated');
        throw new Error('User not authenticated');
      }
      console.log('✅ useJobs - User authenticated:', user.id);

      const { data: jobs, error } = await supabase
        .from('jobs')
        .select(`
          *,
          customers (name),
          people (first_name, last_name),
          organizations (name)
        `)
        .eq('user_id', user.id);

      if (error) {
        console.error('❌ useJobs - Database error:', error);
        throw error;
      }

      console.log('📊 useJobs - Raw jobs from database:', jobs);
      console.log('📊 useJobs - Number of jobs:', jobs?.length || 0);

      if (jobs && jobs.length > 0) {
        jobs.forEach((job, index) => {
          console.log(`📋 useJobs - Job ${index + 1}:`, {
            id: job.id,
            name: job.name,
            job_number: job.job_number,
            job_number_type: typeof job.job_number
          });
        });
      }

      // Transform jobs to match expected interface
      const transformedJobs = jobs.map(job => {
        const transformed = {
          ...job,
          customerName: job.customers?.name || '',
          assignedPersonName: job.people ? `${job.people.first_name} ${job.people.last_name}` : '',
          organizationName: job.organizations?.name || '',
          tasks: [],
          timeline: []
        };

        console.log('✅ useJobs - Transformed job:', {
          id: transformed.id,
          name: transformed.name,
          job_number: transformed.job_number,
          customerName: transformed.customerName
        });

        return transformed;
      });

      console.log('🎯 useJobs - Final result count:', transformedJobs.length);
      return transformedJobs;
    },
  });
};
