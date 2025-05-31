
import { useQuery } from '@tanstack/react-query';
import { 
  mockCustomers, 
  mockJobs, 
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

// Simulate API calls with delays
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
    queryFn: () => simulateApiCall<Job[]>(mockJobs),
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
    queryFn: () => simulateApiCall<Organization[]>(mockOrganizations),
  });
};

export const usePeople = () => {
  return useQuery({
    queryKey: ['people'],
    queryFn: () => simulateApiCall<Person[]>(mockPeople),
  });
};
