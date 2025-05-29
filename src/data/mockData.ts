
import { Customer, Job, Associate, Activity, DashboardMetrics } from '../types';

export const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '(555) 123-4567',
    address: '123 Main St, New York, NY 10001',
    company: 'ABC Corp',
    createdAt: new Date('2024-01-15'),
    lastContact: new Date('2024-03-10'),
    totalJobs: 5,
    status: 'active',
    notes: 'Preferred customer, always pays on time.'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    phone: '(555) 987-6543',
    address: '456 Oak Ave, Brooklyn, NY 11201',
    createdAt: new Date('2024-02-20'),
    lastContact: new Date('2024-03-15'),
    totalJobs: 3,
    status: 'active'
  },
  {
    id: '3',
    name: 'Mike Wilson',
    email: 'mike.w@email.com',
    phone: '(555) 456-7890',
    address: '789 Pine St, Queens, NY 11375',
    company: 'Wilson Industries',
    createdAt: new Date('2024-01-05'),
    lastContact: new Date('2024-02-28'),
    totalJobs: 8,
    status: 'active'
  }
];

export const mockJobs: Job[] = [
  {
    id: '1',
    title: 'HVAC Maintenance',
    description: 'Annual HVAC system maintenance and inspection',
    customerId: '1',
    customerName: 'John Smith',
    location: '123 Main St, New York, NY 10001',
    priority: 'medium',
    status: 'scheduled',
    assignedTo: '1',
    assignedToName: 'Tom Rodriguez',
    scheduledDate: new Date('2024-03-25'),
    createdAt: new Date('2024-03-20'),
    estimatedDuration: 3,
    tags: ['HVAC', 'Maintenance']
  },
  {
    id: '2',
    title: 'Plumbing Repair',
    description: 'Fix leaking pipes in kitchen',
    customerId: '2',
    customerName: 'Sarah Johnson',
    location: '456 Oak Ave, Brooklyn, NY 11201',
    priority: 'high',
    status: 'new',
    createdAt: new Date('2024-03-22'),
    estimatedDuration: 2,
    tags: ['Plumbing', 'Repair']
  },
  {
    id: '3',
    title: 'Electrical Installation',
    description: 'Install new electrical outlets in office',
    customerId: '3',
    customerName: 'Mike Wilson',
    location: '789 Pine St, Queens, NY 11375',
    priority: 'low',
    status: 'in-progress',
    assignedTo: '2',
    assignedToName: 'Lisa Chen',
    scheduledDate: new Date('2024-03-23'),
    createdAt: new Date('2024-03-18'),
    estimatedDuration: 4,
    tags: ['Electrical', 'Installation']
  }
];

export const mockAssociates: Associate[] = [
  {
    id: '1',
    name: 'Tom Rodriguez',
    email: 'tom.r@fieldforce.com',
    phone: '(555) 111-2222',
    skills: ['HVAC', 'Maintenance', 'Repair'],
    certifications: ['EPA 608', 'HVAC Excellence'],
    availability: 'available',
    location: {
      lat: 40.7128,
      lng: -74.0060,
      address: 'Manhattan, NY'
    },
    rating: 4.8,
    completedJobs: 156,
    joinedAt: new Date('2023-06-15'),
    hourlyRate: 75
  },
  {
    id: '2',
    name: 'Lisa Chen',
    email: 'lisa.c@fieldforce.com',
    phone: '(555) 333-4444',
    skills: ['Electrical', 'Installation', 'Troubleshooting'],
    certifications: ['Licensed Electrician', 'OSHA 30'],
    availability: 'busy',
    location: {
      lat: 40.6892,
      lng: -73.9442,
      address: 'Brooklyn, NY'
    },
    rating: 4.9,
    completedJobs: 203,
    joinedAt: new Date('2023-04-20'),
    hourlyRate: 80
  },
  {
    id: '3',
    name: 'David Park',
    email: 'david.p@fieldforce.com',
    phone: '(555) 555-6666',
    skills: ['Plumbing', 'Repair', 'Installation'],
    certifications: ['Master Plumber', 'Backflow Prevention'],
    availability: 'available',
    location: {
      lat: 40.7282,
      lng: -73.7949,
      address: 'Queens, NY'
    },
    rating: 4.7,
    completedJobs: 89,
    joinedAt: new Date('2023-08-10'),
    hourlyRate: 70
  }
];

export const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'job_completed',
    title: 'Job Completed',
    description: 'HVAC installation completed for ABC Corp',
    timestamp: new Date('2024-03-20T14:30:00'),
    customerId: '1',
    jobId: '1',
    associateId: '1'
  },
  {
    id: '2',
    type: 'note',
    title: 'Customer Note',
    description: 'Customer mentioned additional work needed next month',
    timestamp: new Date('2024-03-19T10:15:00'),
    customerId: '2'
  },
  {
    id: '3',
    type: 'call',
    title: 'Phone Call',
    description: 'Discussed pricing for electrical work',
    timestamp: new Date('2024-03-18T16:45:00'),
    customerId: '3'
  }
];

export const mockMetrics: DashboardMetrics = {
  totalCustomers: 127,
  activeJobs: 23,
  availableAssociates: 8,
  completedJobsThisMonth: 156,
  revenue: 45670,
  revenueGrowth: 12.5
};
