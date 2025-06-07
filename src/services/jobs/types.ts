
import { Job, Task, TimelineEntry } from '@/types/job';

export interface JobQueryResult {
  id: string;
  job_number?: string; // Add job_number field
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
  scheduled_date?: string;
  estimated_duration?: number;
  assigned_techs: string[];
  contact_name: string;
  contact_phone: string;
  contact_email: string;
  tags: string[];
  is_favorite: boolean;
  notes: string[];
  created_at: string;
  updated_at: string;
  user_id: string;
  tasks?: any[];
  timeline_entries?: any[];
  customers?: { name: string };
  people?: { first_name: string; last_name: string };
}

export interface JobUpdateData {
  tasks?: Task[];
  timeline?: TimelineEntry[];
  customerName?: string;
  assignedPersonName?: string;
  user_id?: string;
  job_number?: string; // Add job_number field
  [key: string]: any;
}
