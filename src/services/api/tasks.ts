
export interface CreateTaskRequest {
  jobId: string;
  label: string;
  parentTaskId?: string;
}

export interface UpdateTaskRequest {
  label?: string;
  dueDate?: string;
  assigneeId?: string;
  assigneeName?: string;
  order?: number;
  parentTaskId?: string;
  complete?: boolean;
}

export interface TaskResponse {
  id: string;
  jobId: string;
  label: string;
  complete: boolean;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
  parentTaskId?: string;
  orderIndex: number;
  assigneeId?: string;
  assigneeName?: string;
}

export const tasksApi = {
  async getAll(jobId: string): Promise<TaskResponse[]> {
    const response = await fetch(`/api/tasks?jobId=${jobId}&order=asc`);
    if (!response.ok) {
      throw new Error('Failed to fetch tasks');
    }
    return response.json();
  },

  async create(data: CreateTaskRequest): Promise<TaskResponse> {
    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create task');
    }
    
    return response.json();
  },

  async update(taskId: string, data: UpdateTaskRequest): Promise<TaskResponse> {
    const response = await fetch(`/api/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update task');
    }
    
    return response.json();
  },

  async delete(taskId: string): Promise<void> {
    const response = await fetch(`/api/tasks/${taskId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete task');
    }
  },
};
