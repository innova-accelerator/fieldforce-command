
export interface CreateProjectModalProps {
  onProjectCreated?: () => void;
  onClose?: () => void;
}

export interface FormData {
  name: string;
  description: string;
  customer_id: string;
  organization_id: string;
  location: string;
  phase: string;
  status: 'New' | 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  start_date: string;
  end_date: string;
  assigned_person_id: string;
  assigned_techs: string[];
  contact_name: string;
  contact_phone: string;
  contact_email: string;
  tags: string[];
  is_favorite: boolean;
}

export const PHASE_OPTIONS = ['Planning', 'Design', 'Development', 'Testing', 'Deployment', 'Maintenance'];
export const STATUS_OPTIONS = ['New', 'Scheduled', 'In Progress', 'Completed', 'Cancelled'] as const;
export const PRIORITY_OPTIONS = ['Low', 'Medium', 'High', 'Urgent'] as const;
