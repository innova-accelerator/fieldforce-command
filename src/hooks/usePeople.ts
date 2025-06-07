
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const usePeople = () => {
  return useQuery({
    queryKey: ['people'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: people, error } = await supabase
        .from('people')
        .select(`
          *,
          organizations (name)
        `)
        .eq('user_id', user.id);

      if (error) {
        console.error('Failed to fetch people:', error);
        throw error;
      }
      
      console.log('People fetched from usePeople hook:', people);
      return people || [];
    },
  });
};
