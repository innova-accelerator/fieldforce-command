
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { FormData } from '../types';

export const useCreateProject = (onProjectCreated?: () => void) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createProject = async (formData: FormData) => {
    setLoading(true);
    setErrors({});

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Map form data to database columns
      const jobData = {
        user_id: user.id,
        name: formData.name,
        description: formData.description,
        customer_id: formData.customer_id || null,
        organization_id: formData.organization_id || null,
        location: formData.location,
        phase: formData.phase,
        status: formData.status,
        priority: formData.priority,
        start_date: formData.start_date ? new Date(formData.start_date).toISOString() : null,
        end_date: formData.end_date ? new Date(formData.end_date).toISOString() : null,
        scheduled_date: formData.start_date ? new Date(formData.start_date).toISOString() : null,
        estimated_duration: null, // This could be calculated from start/end dates if needed
        assigned_person_id: formData.assigned_person_id || null,
        assigned_techs: formData.assigned_techs || [],
        contact_name: formData.contact_name,
        contact_phone: formData.contact_phone,
        contact_email: formData.contact_email,
        tags: formData.tags || [],
        is_favorite: formData.is_favorite || false,
        notes: [] // Initialize as empty array
      };

      const { data: newJob, error } = await supabase
        .from('jobs')
        .insert(jobData)
        .select()
        .single();

      if (error) {
        console.error('Error creating job:', error);
        throw new Error(error.message || 'Failed to create job');
      }
      
      console.log('Job created successfully:', newJob);
      onProjectCreated?.();
      navigate(`/jobs/${newJob.id}/overview`);
      
      return newJob;
    } catch (error) {
      console.error('Error creating job:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setErrors({ general: errorMessage });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { createProject, loading, errors };
};
