
import { supabase } from '@/integrations/supabase/client';

export const generateJobNumber = async (): Promise<string> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // Get the count of existing jobs for this user to determine the next sequence number
  const { count, error } = await supabase
    .from('jobs')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  if (error) {
    console.error('Error getting job count:', error);
    throw error;
  }

  // Start at 649 for the first job (index 0), then increment
  const sequenceNumber = 649 + (count || 0);

  // Get current date in MMDD format
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const dateString = month + day;

  // Format: 25[sequence]-MMDD
  const jobNumber = `25${sequenceNumber}-${dateString}`;

  return jobNumber;
};
