
export interface Task {
  id: string;
  job_id: string;
  label: string;
  complete: boolean;
  due_date?: string;
  priority?: 'low' | 'medium' | 'high';
  created_at: string;
  updated_at: string;
  parent_task_id?: string;
  order_index: number;
  assignee_id?: string;
  assignee_name?: string;
}

export interface TaskWithSubtasks extends Task {
  subtasks: TaskWithSubtasks[];
}
