
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

      let finalCustomerId = null;

      // If a customer_id is provided, check if it exists in customers table
      if (formData.customer_id) {
        const { data: existingCustomer } = await supabase
          .from('customers')
          .select('id')
          .eq('id', formData.customer_id)
          .single();

        if (existingCustomer) {
          finalCustomerId = formData.customer_id;
        } else {
          // If customer doesn't exist but we have contact info, create a customer
          if (formData.contact_name) {
            const { data: newCustomer, error: customerError } = await supabase
              .from('customers')
              .insert({
                user_id: user.id,
                name: formData.contact_name,
                email: formData.contact_email || '',
                phone: formData.contact_phone || '',
                company: formData.contact_name, // Use contact name as company for now
                address: formData.location || '',
                status: 'active'
              })
              .select()
              .single();

            if (customerError) {
              console.error('Error creating customer:', customerError);
              throw new Error('Failed to create customer record');
            }

            finalCustomerId = newCustomer.id;
          }
        }
      }

      // Map form data to database columns
      const jobData = {
        user_id: user.id,
        name: formData.name,
        description: formData.description,
        customer_id: finalCustomerId,
        organization_id: formData.organization_id || null,
        location: formData.location,
        phase: formData.phase,
        status: formData.status,
        priority: formData.priority,
        start_date: formData.start_date ? new Date(formData.start_date).toISOString() : null,
        end_date: formData.end_date ? new Date(formData.end_date).toISOString() : null,
        scheduled_date: formData.start_date ? new Date(formData.start_date).toISOString() : null,
        estimated_duration: null,
        assigned_person_id: formData.assigned_person_id || null,
        assigned_techs: formData.assigned_techs || [],
        contact_name: formData.contact_name,
        contact_phone: formData.contact_phone,
        contact_email: formData.contact_email,
        tags: formData.tags || [],
        is_favorite: formData.is_favorite || false,
        notes: []
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
