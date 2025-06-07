
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useAssociates = () => {
  return useQuery({
    queryKey: ['associates'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Fetch organizations with classification = 'associate' and join with associates table
      const { data: organizations, error } = await supabase
        .from('organizations')
        .select(`
          *,
          associates (
            id,
            availability,
            hourly_rate,
            rating,
            completed_jobs,
            skills,
            certifications,
            location_lat,
            location_lng,
            joined_at
          )
        `)
        .eq('user_id', user.id)
        .eq('classification', 'associate');

      if (error) throw error;

      // Transform to match associate interface
      return (organizations || []).map(org => {
        const associate = Array.isArray(org.associates) ? org.associates[0] : org.associates || {};
        return {
          id: associate.id || org.id,
          name: org.name,
          email: org.email,
          phone: org.phone,
          location_address: [org.address, org.city, org.state, org.zipcode].filter(Boolean).join(', '),
          availability: associate.availability || 'available',
          hourly_rate: associate.hourly_rate || 0,
          rating: associate.rating || 0,
          completed_jobs: associate.completed_jobs || 0,
          skills: associate.skills || [],
          certifications: associate.certifications || [],
          organizations: { name: org.name },
          organization_id: org.id,
          user_id: org.user_id,
          created_at: org.created_at,
          updated_at: org.updated_at
        };
      });
    },
  });
};
