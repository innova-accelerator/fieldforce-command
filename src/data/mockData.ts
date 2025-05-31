import { Customer, Associate, Activity, DashboardMetrics } from '../types';
import { Organization } from '../types/organization';
import { Person } from '../types/person';
import { Job } from '../types/job';

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
    id: 'job-1',
    name: 'Office HVAC Installation',
    title: 'Office HVAC Installation', 
    customerName: 'TechCorp Inc',
    client: 'TechCorp Inc',
    description: 'Install new HVAC system in main office building with full ductwork and controls',
    status: 'In Progress',
    priority: 'High',
    startDate: '2024-01-15T00:00:00.000Z',
    endDate: '2024-01-30T00:00:00.000Z',
    scheduledDate: '2024-01-15T00:00:00.000Z',
    estimatedDuration: 8,
    assignedPersonId: 'person-1',
    assignedToName: 'John Smith',
    organizationId: 'org-1',
    clientId: '1',
    createdAt: '2024-01-10T00:00:00.000Z',
    updatedAt: '2024-01-10T00:00:00.000Z',
    phase: 'Installation',
    location: '123 Main St, Anytown, ST 12345',
    isFavorite: false,
    assignedTechs: [],
    tasks: [],
    notes: [],
    timeline: [],
    contactInfo: {
      name: 'John Doe',
      phone: '(555) 123-4567',
      email: 'john@techcorp.com'
    },
    tags: ['HVAC', 'Installation']
  },
  {
    id: 'job-2', 
    name: 'Warehouse Electrical Upgrade',
    title: 'Warehouse Electrical Upgrade',
    customerName: 'BuildCorp LLC',
    client: 'BuildCorp LLC',
    description: 'Upgrade electrical systems in warehouse facility including new panels and wiring',
    status: 'New',
    priority: 'Medium',
    startDate: '2024-01-25T00:00:00.000Z',
    endDate: '2024-02-10T00:00:00.000Z',
    scheduledDate: '2024-01-25T00:00:00.000Z',
    estimatedDuration: 12,
    assignedPersonId: 'person-2',
    assignedToName: 'Sarah Johnson',
    organizationId: 'org-2',
    clientId: '2',
    createdAt: '2024-01-20T00:00:00.000Z',
    updatedAt: '2024-01-20T00:00:00.000Z',
    phase: 'Planning',
    location: '456 Industrial Blvd, Warehouse City, ST 67890',
    isFavorite: true,
    assignedTechs: [],
    tasks: [],
    notes: [],
    timeline: [],
    contactInfo: {
      name: 'Jane Smith',
      phone: '(555) 987-6543',
      email: 'jane@buildcorp.com'
    },
    tags: ['Electrical', 'Upgrade']
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

export const mockOrganizations: Organization[] = [
  {
    id: 'org-1',
    name: 'ABC Corporation',
    relation: 'Client',
    category: 'Technology',
    email: 'contact@abccorp.com',
    phone: '(555) 123-4567',
    website: 'https://abccorp.com',
    address: '123 Business Ave',
    city: 'New York',
    state: 'NY',
    zipcode: '10001',
    createdAt: new Date('2024-01-15')
  },
  {
    id: 'org-2',
    name: 'Wilson Industries',
    relation: 'Partner',
    category: 'Manufacturing',
    email: 'info@wilsonindustries.com',
    phone: '(555) 987-6543',
    address: '456 Industrial Blvd',
    city: 'Brooklyn',
    state: 'NY',
    zipcode: '11201',
    createdAt: new Date('2024-02-10')
  }
];

export const mockPeople: Person[] = [
  {
    id: 'person-1',
    organizationId: 'org-1',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@abccorp.com',
    title: 'Project Manager',
    cellNumber: '(555) 111-2222',
    createdAt: new Date('2024-01-20')
  },
  {
    id: 'person-2',
    organizationId: 'org-1',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@abccorp.com',
    title: 'Operations Director',
    cellNumber: '(555) 333-4444',
    createdAt: new Date('2024-01-25')
  },
  {
    id: 'person-3',
    organizationId: 'org-2',
    firstName: 'Mike',
    lastName: 'Wilson',
    email: 'mike.wilson@wilsonindustries.com',
    title: 'CEO',
    cellNumber: '(555) 555-6666',
    createdAt: new Date('2024-02-15')
  }
];

// CRUD Functions
export const createOrganization = (orgData: Omit<Organization, 'id' | 'createdAt'>): Organization => {
  const newOrg: Organization = {
    ...orgData,
    id: `org-${Date.now()}`,
    createdAt: new Date()
  };
  mockOrganizations.push(newOrg);
  return newOrg;
};

export const createPerson = (personData: Omit<Person, 'id' | 'createdAt'>): Person => {
  const newPerson: Person = {
    ...personData,
    id: `person-${Date.now()}`,
    createdAt: new Date()
  };
  mockPeople.push(newPerson);
  return newPerson;
};

export const createJob = (jobData: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>): Job => {
  const newJob: Job = {
    ...jobData,
    id: `job-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  mockJobs.push(newJob);
  return newJob;
};

export const assignPersonToJob = (jobId: string, personId: string): void => {
  const job = mockJobs.find(j => j.id === jobId);
  const person = mockPeople.find(p => p.id === personId);
  if (job && person) {
    job.assignedPersonId = personId;
    job.organizationId = person.organizationId;
  }
};

export const getOrganizationById = (id: string): Organization | undefined => {
  return mockOrganizations.find(org => org.id === id);
};

export const getPersonById = (id: string): Person | undefined => {
  return mockPeople.find(person => person.id === id);
};
