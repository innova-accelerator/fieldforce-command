
export interface Job {
  id: string;
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
  scheduled_date?: string;
  estimated_duration?: number;
  assigned_techs: string[];
  contact_name: string;
  contact_phone: string;
  contact_email: string;
  tags: string[];
  is_favorite: boolean;
  notes: string[];
  tasks: Task[];
  timeline: TimelineEntry[];
  created_at: string;
  updated_at: string;
  user_id: string;
  
  // Computed fields for backward compatibility
  customerName?: string;
  assignedPersonName?: string;
}

export interface Task {
  id: string;
  job_id: string;
  label: string;
  complete: boolean;
  due_date?: string;
  priority?: 'low' | 'medium' | 'high';
  created_at: string;
  updated_at: string;
}

export interface TimelineEntry {
  id: string;
  job_id: string;
  timestamp: string;
  type: 'note' | 'status' | 'assignment' | 'scheduling';
  content: string;
  author_id?: string;
  created_at: string;
}

export interface Associate {
  id: string;
  name: string;
  avatarUrl?: string;
  email?: string;
}
