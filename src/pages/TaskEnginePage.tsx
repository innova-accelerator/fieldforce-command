
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { Plus, CheckSquare, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../integrations/supabase/client';
import TaskEngineItem from '../components/TaskEngine/TaskEngineItem';
import { LoadingSkeleton } from '../components/ui/loading-skeleton';
import { ErrorDisplay } from '../components/ui/error-display';

interface TaskWithSubtasks {
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
  subtasks: TaskWithSubtasks[];
}

const TaskEnginePage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const [newTaskLabel, setNewTaskLabel] = useState('');
  const [isAddingTask, setIsAddingTask] = useState(false);
  const queryClient = useQueryClient();

  console.log('🎯 TaskEnginePage - Component rendered with jobId:', jobId);

  // Fetch tasks from Supabase
  const { data: taskData = [], isLoading: tasksLoading, error: tasksError } = useQuery({
    queryKey: ['tasks', jobId],
    queryFn: async () => {
      console.log('🔍 TaskEnginePage - Fetching tasks for jobId:', jobId);
      
      if (!jobId) {
        console.error('❌ TaskEnginePage - No jobId provided');
        throw new Error('No job ID provided');
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('❌ TaskEnginePage - User not authenticated');
        throw new Error('User not authenticated');
      }

      const { data: tasks, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('job_id', jobId);

      if (error) {
        console.error('❌ TaskEnginePage - Error fetching tasks:', error);
        throw error;
      }

      console.log('📊 TaskEnginePage - Raw tasks from database:', tasks);
      
      // Transform to match TaskWithSubtasks interface
      const transformedTasks = (tasks || []).map(task => ({
        id: task.id,
        jobId: task.job_id,
        label: task.label,
        complete: task.complete || false,
        dueDate: task.due_date,
        priority: task.priority as 'low' | 'medium' | 'high',
        createdAt: task.created_at,
        updatedAt: task.updated_at,
        parentTaskId: task.parent_task_id,
        orderIndex: task.order_index || 0,
        assigneeId: task.assignee_id,
        assigneeName: task.assignee_name,
        subtasks: []
      }));

      console.log('✅ TaskEnginePage - Transformed tasks:', transformedTasks);
      return transformedTasks;
    },
    enabled: !!jobId,
  });

  // Fetch people for assignee dropdown (simplified for now)
  const { data: people = [] } = useQuery({
    queryKey: ['people'],
    queryFn: async () => {
      console.log('🔍 TaskEnginePage - Fetching people');
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data: people, error } = await supabase
        .from('people')
        .select('id, first_name, last_name')
        .eq('user_id', user.id);

      if (error) {
        console.error('❌ TaskEnginePage - Error fetching people:', error);
        return [];
      }

      console.log('📊 TaskEnginePage - People data:', people);
      return people || [];
    },
  });

  // Create task mutation
  const createTaskMutation = useMutation({
    mutationFn: async (taskData: { label: string; parentTaskId?: string }) => {
      console.log('🔄 TaskEnginePage - Creating task:', taskData);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const newTask = {
        job_id: jobId,
        label: taskData.label,
        complete: false,
        order_index: taskData.parentTaskId ? 1 : (taskData.length || 0) + 1,
        parent_task_id: taskData.parentTaskId,
      };

      const { data, error } = await supabase
        .from('tasks')
        .insert([newTask])
        .select()
        .single();

      if (error) {
        console.error('❌ TaskEnginePage - Error creating task:', error);
        throw error;
      }

      console.log('✅ TaskEnginePage - Task created:', data);
      return data;
    },
    onSuccess: () => {
      console.log('✅ TaskEnginePage - Task creation successful');
      queryClient.invalidateQueries({ queryKey: ['tasks', jobId] });
    },
    onError: (error) => {
      console.error('❌ TaskEnginePage - Task creation failed:', error);
    }
  });

  // Update task mutation
  const updateTaskMutation = useMutation({
    mutationFn: async ({ taskId, updates }: { taskId: string; updates: Partial<TaskWithSubtasks> }) => {
      console.log('🔄 TaskEnginePage - Updating task:', taskId, updates);
      
      const updateData: any = {};
      if (updates.complete !== undefined) updateData.complete = updates.complete;
      if (updates.label !== undefined) updateData.label = updates.label;
      if (updates.dueDate !== undefined) updateData.due_date = updates.dueDate;
      if (updates.priority !== undefined) updateData.priority = updates.priority;
      if (updates.assigneeId !== undefined) updateData.assignee_id = updates.assigneeId;
      if (updates.assigneeName !== undefined) updateData.assignee_name = updates.assigneeName;
      if (updates.orderIndex !== undefined) updateData.order_index = updates.orderIndex;

      const { data, error } = await supabase
        .from('tasks')
        .update(updateData)
        .eq('id', taskId)
        .select()
        .single();

      if (error) {
        console.error('❌ TaskEnginePage - Error updating task:', error);
        throw error;
      }

      console.log('✅ TaskEnginePage - Task updated:', data);
      return data;
    },
    onSuccess: () => {
      console.log('✅ TaskEnginePage - Task update successful');
      queryClient.invalidateQueries({ queryKey: ['tasks', jobId] });
    },
    onError: (error) => {
      console.error('❌ TaskEnginePage - Task update failed:', error);
    }
  });

  // Transform flat tasks into nested structure
  const tasks = React.useMemo(() => {
    if (!taskData) return [];
    
    console.log('🔄 TaskEnginePage - Building task hierarchy from:', taskData);
    
    const taskMap = new Map<string, TaskWithSubtasks>();
    const rootTasks: TaskWithSubtasks[] = [];

    // First pass: create all tasks
    taskData.forEach(task => {
      taskMap.set(task.id, { ...task, subtasks: [] });
    });

    // Second pass: build hierarchy
    taskData.forEach(task => {
      const taskWithSubtasks = taskMap.get(task.id)!;
      if (task.parentTaskId) {
        const parent = taskMap.get(task.parentTaskId);
        if (parent) {
          parent.subtasks.push(taskWithSubtasks);
        }
      } else {
        rootTasks.push(taskWithSubtasks);
      }
    });

    // Sort by order_index
    const sortTasks = (tasks: TaskWithSubtasks[]) => {
      tasks.sort((a, b) => a.orderIndex - b.orderIndex);
      tasks.forEach(task => sortTasks(task.subtasks));
    };

    sortTasks(rootTasks);
    console.log('✅ TaskEnginePage - Built task hierarchy:', rootTasks);
    return rootTasks;
  }, [taskData]);

  const handleAddTask = async () => {
    if (newTaskLabel.trim() && jobId) {
      console.log('🎯 TaskEnginePage - Adding new task:', newTaskLabel);
      setIsAddingTask(true);
      try {
        await createTaskMutation.mutateAsync({
          label: newTaskLabel.trim(),
        });
        setNewTaskLabel('');
      } catch (error) {
        console.error('❌ TaskEnginePage - Failed to add task:', error);
      } finally {
        setIsAddingTask(false);
      }
    }
  };

  const handleToggleTask = async (taskId: string, complete: boolean) => {
    console.log('🎯 TaskEnginePage - Toggling task:', taskId, complete);
    try {
      await updateTaskMutation.mutateAsync({
        taskId,
        updates: { complete }
      });
    } catch (error) {
      console.error('❌ TaskEnginePage - Failed to toggle task:', error);
    }
  };

  const handleUpdateTask = async (taskId: string, updates: Partial<TaskWithSubtasks>) => {
    console.log('🎯 TaskEnginePage - Updating task:', taskId, updates);
    try {
      await updateTaskMutation.mutateAsync({
        taskId,
        updates
      });
    } catch (error) {
      console.error('❌ TaskEnginePage - Failed to update task:', error);
    }
  };

  const handleAddSubtask = async (parentId: string, label: string) => {
    console.log('🎯 TaskEnginePage - Adding subtask to:', parentId, label);
    if (jobId) {
      try {
        await createTaskMutation.mutateAsync({
          label: label.trim(),
          parentTaskId: parentId,
        });
      } catch (error) {
        console.error('❌ TaskEnginePage - Failed to add subtask:', error);
      }
    }
  };

  const handleReorder = async (result: DropResult) => {
    if (!result.destination) return;

    console.log('🎯 TaskEnginePage - Reordering task:', result);
    try {
      const taskId = result.draggableId;
      const newOrder = result.destination.index;
      
      await updateTaskMutation.mutateAsync({
        taskId,
        updates: { orderIndex: newOrder }
      });
    } catch (error) {
      console.error('❌ TaskEnginePage - Failed to reorder task:', error);
    }
  };

  if (tasksLoading) {
    console.log('⏳ TaskEnginePage - Showing loading state');
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <LoadingSkeleton rows={5} />
      </div>
    );
  }

  if (tasksError) {
    console.error('❌ TaskEnginePage - Showing error state:', tasksError);
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <ErrorDisplay 
          message="Failed to load tasks" 
          onRetry={() => queryClient.invalidateQueries({ queryKey: ['tasks', jobId] })} 
        />
      </div>
    );
  }

  const completedTasks = taskData?.filter(task => task.complete).length || 0;
  const totalTasks = taskData?.length || 0;

  console.log('🎨 TaskEnginePage - Rendering with stats:', {
    totalTasks,
    completedTasks,
    tasksCount: tasks.length
  });

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="p-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Task Engine</h1>
          <p className="text-muted-foreground">Manage and organize your project tasks</p>
        </div>
      </div>

      <Card className="w-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckSquare className="h-5 w-5 text-primary" />
              Tasks
              <span className="text-sm font-normal text-muted-foreground">
                ({completedTasks}/{totalTasks} completed)
              </span>
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {/* Progress Bar */}
          {totalTasks > 0 && (
            <div className="mb-6">
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(completedTasks / totalTasks) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Task List */}
          {tasks.length > 0 ? (
            <DragDropContext onDragEnd={handleReorder}>
              <Droppable droppableId="tasks">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-2 mb-6"
                  >
                    {tasks.map((task, index) => (
                      <TaskEngineItem
                        key={task.id}
                        task={task}
                        index={index}
                        people={people}
                        onToggle={handleToggleTask}
                        onUpdate={handleUpdateTask}
                        onAddSubtask={handleAddSubtask}
                      />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          ) : (
            <div className="text-center py-12 text-muted-foreground mb-6">
              <CheckSquare className="h-12 w-12 mx-auto mb-4 text-muted" />
              <p className="text-lg font-medium mb-2">No tasks yet</p>
              <p>Create your first task to get started!</p>
            </div>
          )}

          {/* Add Task Input */}
          <div className="flex gap-2">
            <Input
              placeholder="Add a new task..."
              value={newTaskLabel}
              onChange={(e) => setNewTaskLabel(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
              disabled={isAddingTask}
              className="flex-1"
            />
            <Button
              onClick={handleAddTask}
              disabled={isAddingTask || !newTaskLabel.trim()}
              size="default"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskEnginePage;
