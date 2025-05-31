
import { Job, Customer, Associate, Activity, DashboardMetrics } from '../types';

export const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@email.com',
    phone: '555-0123',
    address: '123 Main St, City, State',
    company: 'ABC Corp',
    status: 'active',
    lastContact: new Date('2024-01-15'),
    totalJobs: 5,
    notes: 'Preferred customer, always pays on time',
    createdAt: new Date('2024-01-01T00:00:00Z')
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@email.com',
    phone: '555-0124',
    address: '456 Oak Ave, City, State',
    company: 'XYZ Industries',
    status: 'active',
    lastContact: new Date('2024-01-10'),
    totalJobs: 3,
    notes: 'Requires detailed project updates',
    createdAt: new Date('2024-01-01T00:00:00Z')
  },
  {
    id: '3',
    name: 'Mike Davis',
    email: 'mike@email.com',
    phone: '555-0125',
    address: '789 Pine St, City, State',
    company: 'Tech Solutions',
    status: 'inactive',
    lastContact: new Date('2024-01-05'),
    totalJobs: 7,
    notes: 'Previous issues with billing',
    createdAt: new Date('2024-01-01T00:00:00Z')
  }
];

export const mockJobs: Job[] = [
  {
    id: '1',
    name: 'Network Installation',
    description: 'Install new network infrastructure for office building',
    customer_id: '1',
    organization_id: '1',
    assigned_person_id: '1',
    location: '123 Business Park, Tech City',
    phase: 'Planning',
    status: 'New',
    priority: 'High',
    start_date: '2024-02-01T00:00:00Z',
    end_date: '2024-02-15T00:00:00Z',
    scheduled_date: '2024-02-01T09:00:00Z',
    estimated_duration: 40,
    assigned_techs: ['tech-1', 'tech-2'],
    contact_name: 'John Smith',
    contact_phone: '555-0123',
    contact_email: 'john@email.com',
    tags: ['networking', 'installation'],
    is_favorite: false,
    notes: ['Initial consultation completed', 'Equipment ordered'],
    tasks: [],
    timeline: [],
    created_at: '2024-01-20T00:00:00Z',
    updated_at: '2024-01-20T00:00:00Z',
    user_id: 'user-1',
    customerName: 'John Smith'
  },
  {
    id: '2',
    name: 'Security System Upgrade',
    description: 'Upgrade existing security cameras and access control',
    customer_id: '2',
    organization_id: '2',
    assigned_person_id: '2',
    location: '456 Corporate Plaza, Business District',
    phase: 'In Progress',
    status: 'In Progress',
    priority: 'Medium',
    start_date: '2024-01-25T00:00:00Z',
    end_date: '2024-02-10T00:00:00Z',
    scheduled_date: '2024-01-25T08:00:00Z',
    estimated_duration: 32,
    assigned_techs: ['tech-2', 'tech-3'],
    contact_name: 'Sarah Johnson',
    contact_phone: '555-0124',
    contact_email: 'sarah@email.com',
    tags: ['security', 'upgrade'],
    is_favorite: true,
    notes: ['Site survey completed', 'Permits obtained'],
    tasks: [],
    timeline: [],
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-25T00:00:00Z',
    user_id: 'user-1',
    customerName: 'Sarah Johnson'
  }
];

export const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'job_created',
    title: 'New job created',
    description: 'Network Installation job created for John Smith',
    timestamp: new Date('2024-01-20T10:00:00'),
    customerId: '1',
    jobId: '1'
  },
  {
    id: '2',
    type: 'job_completed',
    title: 'Job completed',
    description: 'Security System Upgrade completed successfully',
    timestamp: new Date('2024-01-19T16:30:00'),
    customerId: '2',
    jobId: '2'
  },
  {
    id: '3',
    type: 'note',
    title: 'Note added',
    description: 'Updated project timeline for Network Installation',
    timestamp: new Date('2024-01-18T14:15:00'),
    customerId: '1',
    jobId: '1'
  },
  {
    id: '4',
    type: 'call',
    title: 'Customer call',
    description: 'Follow-up call with Mike Davis regarding project status',
    timestamp: new Date('2024-01-17T11:00:00'),
    customerId: '3'
  },
  {
    id: '5',
    type: 'email',
    title: 'Email sent',
    description: 'Project proposal sent to potential new customer',
    timestamp: new Date('2024-01-16T09:30:00')
  }
];

export const mockMetrics: DashboardMetrics = {
  totalCustomers: 156,
  activeJobs: 23,
  availableAssociates: 12,
  completedJobsThisMonth: 45,
  revenue: 125000,
  revenueGrowth: 8.5
};
