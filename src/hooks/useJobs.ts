
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useJobs = () => {
  return useQuery({
    queryKey: ['jobs'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: jobs, error } = await supabase
        .from('jobs')
        .select(`
          *,
          customers (name),
          people (first_name, last_name),
          organizations (name)
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      // Transform jobs to match expected interface
      return jobs.map(job => ({
        ...job,
        customerName: job.customers?.name || '',
        assignedPersonName: job.people ? `${job.people.first_name} ${job.people.last_name}` : '',
        organizationName: job.organizations?.name || '',
        tasks: [],
        timeline: []
      }));
    },
  });
};
