
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  mockCustomers, 
  mockActivities, 
  mockMetrics, 
  mockJobs
} from '../data/mockData';
import { Customer, Activity, DashboardMetrics } from '../types';
import { Job } from '../types/job';

// Simulate API calls with delays for mock data
const simulateApiCall = <T>(data: T, delay = 1000): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
};

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

      console.log('Customer organizations fetched from useData hook:', organizations);

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

export const useActivities = () => {
  return useQuery({
    queryKey: ['activities'],
    queryFn: () => simulateApiCall<Activity[]>(mockActivities),
  });
};

export const useDashboardMetrics = () => {
  return useQuery({
    queryKey: ['metrics'],
    queryFn: () => simulateApiCall<DashboardMetrics>(mockMetrics),
  });
};

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
      
      console.log('Organizations fetched from useData hook:', organizations);
      
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
      
      console.log('People fetched from useData hook:', people);
      return people || [];
    },
  });
};

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
