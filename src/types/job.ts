
export interface Job {
  id: string;
  name: string;
  title?: string; // Keep for backward compatibility, will be removed later
  customerName: string;
  client?: string; // Keep for backward compatibility, will be removed later
  description: string;
  clientId: string;
  organizationId: string;
  location: string;
  phase: string;
  status: 'New' | 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  startDate: string;
  endDate: string;
  scheduledDate?: string;
  estimatedDuration?: number;
  assignedPersonId?: string;
  assignedToName?: string; // Keep for backward compatibility
  assignedTechs: string[];
  contactInfo: {
    name: string;
    phone: string;
    email: string;
  };
  tags: string[];
  isFavorite: boolean;
  tasks: Task[];
  notes: string[];
  timeline: TimelineEntry[];
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  label: string;
  complete: boolean;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
}

export interface TimelineEntry {
  timestamp: string;
  type: 'note' | 'status' | 'assignment' | 'scheduling';
  content: string;
  author: string;
}

export interface Associate {
  id: string;
  name: string;
  avatarUrl?: string;
  email?: string;
}
