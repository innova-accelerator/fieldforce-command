
export interface CreateJobRequest {
  name: string;
  description: string;
  customer_id: string;
  organization_id: string;
  assigned_person_id?: string;
  location: string;
  phase: string;
  status: 'New' | 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  start_date: string;
  end_date: string;
  assigned_techs: string[];
  contact_name: string;
  contact_phone: string;
  contact_email: string;
  tags: string[];
  is_favorite: boolean;
}

export interface JobResponse {
  id: string;
  name: string;
  description: string;
  customer_id: string;
  organization_id: string;
  assigned_person_id?: string;
  location: string;
  phase: string;
  status: string;
  priority: string;
  start_date: string;
  end_date: string;
  assigned_techs: string[];
  contact_name: string;
  contact_phone: string;
  contact_email: string;
  tags: string[];
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
  user_id: string;
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
