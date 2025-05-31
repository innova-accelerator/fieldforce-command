
export interface Job {
  id: string;
  title: string; // Display title for the job
  description?: string;
  status: 'new' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  startDate?: Date;
  endDate?: Date;
  assignedPersonId?: string;
  organizationId?: string;
  createdAt: Date;
  
  // Additional properties for job overview functionality
  client: string;
  phase: string;
  location: string;
  isFavorite?: boolean;
  tasks: Task[];
  notes: string[];
  timeline: TimelineEntry[];
  assignedTechs: Associate[];
  contactInfo: {
    name: string;
    phone: string;
    email: string;
  };
  
  // Properties used by existing components
  customerId?: string;
  customerName?: string;
  estimatedDuration?: number;
  scheduledDate?: Date;
  tags?: string[];
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
