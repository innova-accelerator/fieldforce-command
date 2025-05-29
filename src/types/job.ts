
export interface Associate {
  id: string;
  name: string;
  avatarUrl?: string;
  email?: string;
  phone?: string;
  skills?: string[];
}

export interface Task {
  id: string;
  label: string;
  complete: boolean;
  dueDate?: string;
  assignedTo?: string;
  priority?: 'low' | 'medium' | 'high';
}

export interface TimelineEntry {
  timestamp: string;
  type: 'note' | 'status' | 'assignment' | 'scheduling';
  content: string;
  author: string;
}

export interface ContactInfo {
  name: string;
  phone: string;
  email: string;
}

export interface Job {
  id: string;
  title: string;
  client: string;
  phase: string;
  startDate: string;
  endDate: string;
  assignedTechs: Associate[];
  tasks: Task[];
  notes: string[];
  timeline: TimelineEntry[];
  location: string;
  description: string;
  contactInfo: ContactInfo;
  priority?: 'low' | 'medium' | 'high';
  status?: 'new' | 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  isFavorite?: boolean;
}
