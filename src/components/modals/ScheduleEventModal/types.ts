
export interface ScheduleEventData {
  jobId: string;
  title: string;
  description: string;
  scheduledDate: string;
  startTime: string;
  endTime: string;
  assignedTechs: string[];
  location: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
}

export interface ScheduleEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (eventData: ScheduleEventData) => void;
}
