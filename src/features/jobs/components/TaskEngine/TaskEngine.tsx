
import React, { useState, useEffect } from 'react';
import { DropResult } from 'react-beautiful-dnd';
import { Plus, CheckSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { useQuery } from '@tanstack/react-query';
import { Task, TaskWithSubtasks } from '../../../../types/task';
import { Job, TimelineEntry } from '../../../../types/job';
import TaskList from './TaskList';

interface TaskEngineProps {
  job: Job;
  onUpdate: (updates: Partial<Job>) => void;
  onTimelineUpdate: (entry: Omit<TimelineEntry, 'timestamp' | 'id' | 'job_id' | 'created_at'>) => void;
}

const TaskEngine: React.FC<TaskEngineProps> = ({ job, onUpdate, onTimelineUpdate }) => {
  const [newTaskLabel, setNewTaskLabel] = useState('');
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [tasks, setTasks] = useState<TaskWithSubtasks[]>([]);

  // Fetch people for assignee dropdown
  const { data: people = [] } = useQuery({
    queryKey: ['people', job.organization_id],
    queryFn: async () => {
      // This would normally be an API call
      // For now, return empty array as people data structure needs to be implemented
      return [];
    },
  });

  // Transform flat tasks into nested structure
  useEffect(() => {
    if (job.tasks) {
      const taskMap = new Map<string, TaskWithSubtasks>();
      const rootTasks: TaskWithSubtasks[] = [];

      // First pass: create all tasks
      job.tasks.forEach(task => {
        taskMap.set(task.id, {
          ...task,
          parent_task_id: task.parent_task_id,
          order_index: task.order_index || 0,
          subtasks: []
        });
      });

      // Second pass: build hierarchy
      job.tasks.forEach(task => {
        const taskWithSubtasks = taskMap.get(task.id)!;
        if (task.parent_task_id) {
          const parent = taskMap.get(task.parent_task_id);
          if (parent) {
            parent.subtasks.push(taskWithSubtasks);
          }
        } else {
          rootTasks.push(taskWithSubtasks);
        }
      });

      // Sort by order_index
      const sortTasks = (tasks: TaskWithSubtasks[]) => {
        tasks.sort((a, b) => a.order_index - b.order_index);
        tasks.forEach(task => sortTasks(task.subtasks));
      };

      sortTasks(rootTasks);
      setTasks(rootTasks);
    }
  }, [job.tasks]);

  const handleAddTask = async () => {
    if (newTaskLabel.trim()) {
      setIsAddingTask(true);
      try {
        const newTask: Task = {
          id: `task-${Date.now()}`,
          job_id: job.id,
          label: newTaskLabel.trim(),
          complete: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          order_index: (job.tasks?.length || 0) + 1,
        };

        const updatedTasks = [...(job.tasks || []), newTask];
        await onUpdate({ tasks: updatedTasks });

        onTimelineUpdate({
          type: 'note',
          content: `Task added: ${newTaskLabel}`,
          author_id: undefined
        });

        setNewTaskLabel('');
      } catch (error) {
        console.error('Failed to add task:', error);
      } finally {
        setIsAddingTask(false);
      }
    }
  };

  const handleToggleTask = async (taskId: string, complete: boolean) => {
    const updatedTasks = (job.tasks || []).map(task =>
      task.id === taskId ? { ...task, complete, updated_at: new Date().toISOString() } : task
    );

    await onUpdate({ tasks: updatedTasks });

    const task = job.tasks?.find(t => t.id === taskId);
    if (task) {
      onTimelineUpdate({
        type: 'note',
        content: `Task ${complete ? 'completed' : 'reopened'}: ${task.label}`,
        author_id: undefined
      });
    }
  };

  const handleUpdateTask = async (taskId: string, updates: Partial<TaskWithSubtasks>) => {
    const updatedTasks = (job.tasks || []).map(task =>
      task.id === taskId 
        ? { ...task, ...updates, updated_at: new Date().toISOString() }
        : task
    );

    await onUpdate({ tasks: updatedTasks });
  };

  const handleAddSubtask = async (parentId: string, label: string) => {
    const parentTask = job.tasks?.find(t => t.id === parentId);
    if (!parentTask) return;

    const newSubtask: Task = {
      id: `task-${Date.now()}`,
      job_id: job.id,
      label: label.trim(),
      complete: false,
      parent_task_id: parentId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      order_index: (job.tasks?.filter(t => t.parent_task_id === parentId).length || 0) + 1,
    };

    const updatedTasks = [...(job.tasks || []), newSubtask];
    await onUpdate({ tasks: updatedTasks });

    onTimelineUpdate({
      type: 'note',
      content: `Subtask added to "${parentTask.label}": ${label}`,
      author_id: undefined
    });
  };

  const handleReorder = async (result: DropResult) => {
    if (!result.destination) return;

    // This is a simplified reorder - in a real implementation,
    // you'd need to handle nested reordering and parent changes
    const updatedTasks = [...(job.tasks || [])];
    const [movedTask] = updatedTasks.splice(result.source.index, 1);
    updatedTasks.splice(result.destination.index, 0, movedTask);

    // Update order indices
    updatedTasks.forEach((task, index) => {
      if (!task.parent_task_id) {
        task.order_index = index;
      }
    });

    await onUpdate({ tasks: updatedTasks });
  };

  const completedTasks = job.tasks?.filter(task => task.complete).length || 0;
  const totalTasks = job.tasks?.length || 0;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <CheckSquare className="h-5 w-5 text-blue-600" />
            Task Engine
            <span className="text-sm font-normal text-gray-500">
              ({completedTasks}/{totalTasks} completed)
            </span>
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {/* Progress Bar */}
        {totalTasks > 0 && (
          <div className="mb-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(completedTasks / totalTasks) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Task List */}
        {tasks.length > 0 ? (
          <TaskList
            tasks={tasks}
            people={people}
            onToggle={handleToggleTask}
            onUpdate={handleUpdateTask}
            onAddSubtask={handleAddSubtask}
            onReorder={handleReorder}
          />
        ) : (
          <div className="text-center py-8 text-gray-500">
            <CheckSquare className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p>No tasks yet. Add one to get started!</p>
          </div>
        )}

        {/* Add Task Input */}
        <div className="mt-4 flex gap-2">
          <Input
            placeholder="Add a task..."
            value={newTaskLabel}
            onChange={(e) => setNewTaskLabel(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
            disabled={isAddingTask}
            className="flex-1"
          />
          <Button
            onClick={handleAddTask}
            disabled={isAddingTask || !newTaskLabel.trim()}
            size="sm"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Task
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskEngine;
