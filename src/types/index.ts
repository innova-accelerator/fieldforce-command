
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  company?: string;
  createdAt: Date;
  lastContact?: Date;
  totalJobs: number;
  status: 'active' | 'inactive';
  notes?: string;
}

export interface Associate {
  id: string;
  name: string;
  email: string;
  phone: string;
  skills: string[];
  certifications: string[];
  availability: 'available' | 'busy' | 'offline';
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  rating: number;
  completedJobs: number;
  joinedAt: Date;
  hourlyRate: number;
}

export interface Activity {
  id: string;
  type: 'note' | 'call' | 'email' | 'job_completed' | 'job_created';
  title: string;
  description: string;
  timestamp: Date;
  customerId?: string;
  jobId?: string;
  associateId?: string;
}

export interface DashboardMetrics {
  totalCustomers: number;
  activeJobs: number;
  availableAssociates: number;
  completedJobsThisMonth: number;
  revenue: number;
  revenueGrowth: number;
}
