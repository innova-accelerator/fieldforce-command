
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useOrganizations = () => {
  return useQuery({
    queryKey: ['organizations'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: organizations, error } = await supabase
        .from('organizations')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Failed to fetch organizations:', error);
        throw error;
      }
      
      console.log('Organizations fetched from useOrganizations hook:', organizations);
      
      // Transform the data to match our Organization interface
      return (organizations || []).map(org => ({
        id: org.id,
        name: org.name,
        relation: org.relation,
        category: org.category,
        email: org.email,
        phone: org.phone,
        website: org.website,
        linkedin: org.linkedin,
        facebook: org.facebook,
        twitter: org.twitter,
        additionalInfo: org.additional_info,
        address: org.address,
        city: org.city,
        state: org.state,
        zipcode: org.zipcode,
        classification: org.classification as 'associate' | 'customer' | undefined,
        createdAt: new Date(org.created_at)
      }));
    },
  });
};
