
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  mockCustomers, 
  mockAssociates, 
  mockActivities, 
  mockMetrics, 
  mockOrganizations, 
  mockPeople 
} from '../data/mockData';
import { Customer, Associate, Activity, DashboardMetrics } from '../types';
import { Organization } from '../types/organization';
import { Person } from '../types/person';
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
    queryFn: () => simulateApiCall<Customer[]>(mockCustomers),
  });
};

export const useJobs = () => {
  return useQuery({
    queryKey: ['jobs'],
    queryFn: async () => {
      const { data: jobs, error } = await supabase
        .from('jobs')
        .select(`
          *,
          customers (name),
          people (first_name, last_name),
          organizations (name)
        `);

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

export const useAssociates = () => {
  return useQuery({
    queryKey: ['associates'],
    queryFn: () => simulateApiCall<Associate[]>(mockAssociates),
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
      const { data: organizations, error } = await supabase
        .from('organizations')
        .select('*');

      if (error) throw error;
      return organizations;
    },
  });
};

export const usePeople = () => {
  return useQuery({
    queryKey: ['people'],
    queryFn: async () => {
      const { data: people, error } = await supabase
        .from('people')
        .select(`
          *,
          organizations (name)
        `);

      if (error) throw error;
      return people;
    },
  });
};
