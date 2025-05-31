
export interface Job {
  id: string;
  name: string;
  description?: string;
  status: 'new' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  startDate?: string;
  endDate?: string;
  assignedPersonId?: string;
  organizationId?: string;
  createdAt: Date;
}
