
export interface CreateJobRequest {
  name: string;
  description: string;
  clientId: string;
  organizationId: string;
  location: string;
  phase: string;
  status: 'New' | 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  startDate: string;
  endDate: string;
  assignedPersonId: string;
  assignedTechs: string[];
  contactInfo: {
    name: string;
    phone: string;
    email: string;
  };
  tags: string[];
  isFavorite: boolean;
}

export interface JobResponse {
  id: string;
  name: string;
  description: string;
  clientId: string;
  organizationId: string;
  location: string;
  phase: string;
  status: string;
  priority: string;
  startDate: string;
  endDate: string;
  assignedPersonId: string;
  assignedTechs: string[];
  contactInfo: {
    name: string;
    phone: string;
    email: string;
  };
  tags: string[];
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

export const jobsApi = {
  async create(data: CreateJobRequest): Promise<JobResponse> {
    const response = await fetch('/api/jobs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create job');
    }
    
    return response.json();
  },
};
