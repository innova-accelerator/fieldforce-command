
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useCustomers = () => {
  return useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Fetch organizations with classification = 'customer'
      const { data: organizations, error } = await supabase
        .from('organizations')
        .select('*')
        .eq('user_id', user.id)
        .eq('classification', 'customer');

      if (error) {
        console.error('Failed to fetch customer organizations:', error);
        throw error;
      }

      console.log('Customer organizations fetched from useCustomers hook:', organizations);

      // Transform the data to match our Customer interface
      return (organizations || []).map(org => ({
        id: org.id,
        name: org.name,
        email: org.email || '',
        phone: org.phone || '',
        address: [org.address, org.city, org.state, org.zipcode].filter(Boolean).join(', '),
        company: org.name,
        createdAt: new Date(org.created_at),
        lastContact: undefined,
        totalJobs: 0,
        status: 'active' as 'active' | 'inactive',
        notes: org.additional_info
      }));
    },
  });
};
