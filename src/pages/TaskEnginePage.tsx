
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { Plus, CheckSquare, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useNavigate } from 'react-router-dom';
import { tasksApi, TaskResponse } from '../services/api/tasks';
import { peopleApi } from '../services/api/people';
import TaskEngineItem from '../components/TaskEngine/TaskEngineItem';
import { LoadingSkeleton } from '../components/ui/loading-skeleton';
import { ErrorDisplay } from '../components/ui/error-display';

interface TaskWithSubtasks extends TaskResponse {
  subtasks: TaskWithSubtasks[];
}

const TaskEnginePage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const [newTaskLabel, setNewTaskLabel] = useState('');
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [tasks, setTasks] = useState<TaskWithSubtasks[]>([]);

  // Fetch tasks
  const { data: taskData = [], isLoading: tasksLoading, error: tasksError, refetch } = useQuery({
    queryKey: ['tasks', jobId],
    queryFn: () => tasksApi.getAll(jobId!),
    enabled: !!jobId,
  });

  // Fetch people for assignee dropdown
  const { data: people = [] } = useQuery({
    queryKey: ['people'],
    queryFn: () => peopleApi.getAll(),
  });

  // Transform flat tasks into nested structure
  React.useEffect(() => {
    if (taskData) {
      const taskMap = new Map<string, TaskWithSubtasks>();
      const rootTasks: TaskWithSubtasks[] = [];

      // First pass: create all tasks
      taskData.forEach(task => {
        taskMap.set(task.id, {
          ...task,
          subtasks: []
        });
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
      setTasks(rootTasks);
    }
  }, [taskData]);

  const handleAddTask = async () => {
    if (newTaskLabel.trim() && jobId) {
      setIsAddingTask(true);
      try {
        await tasksApi.create({
          jobId,
          label: newTaskLabel.trim(),
        });
        
        setNewTaskLabel('');
        refetch();
      } catch (error) {
        console.error('Failed to add task:', error);
      } finally {
        setIsAddingTask(false);
      }
    }
  };

  const handleToggleTask = async (taskId: string, complete: boolean) => {
    try {
      await tasksApi.update(taskId, { complete });
      refetch();
    } catch (error) {
      console.error('Failed to toggle task:', error);
    }
  };

  const handleUpdateTask = async (taskId: string, updates: Partial<TaskResponse>) => {
    try {
      await tasksApi.update(taskId, updates);
      refetch();
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleAddSubtask = async (parentId: string, label: string) => {
    if (jobId) {
      try {
        await tasksApi.create({
          jobId,
          label: label.trim(),
          parentTaskId: parentId,
        });
        refetch();
      } catch (error) {
        console.error('Failed to add subtask:', error);
      }
    }
  };

  const handleReorder = async (result: DropResult) => {
    if (!result.destination) return;

    // This is a simplified reorder - in a real implementation,
    // you'd need to handle nested reordering and parent changes
    try {
      const taskId = result.draggableId;
      const newOrder = result.destination.index;
      
      await tasksApi.update(taskId, { order: newOrder });
      refetch();
    } catch (error) {
      console.error('Failed to reorder task:', error);
    }
  };

  if (tasksLoading) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <LoadingSkeleton rows={5} />
      </div>
    );
  }

  if (tasksError) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <ErrorDisplay message="Failed to load tasks" onRetry={() => refetch()} />
      </div>
    );
  }

  const completedTasks = taskData?.filter(task => task.complete).length || 0;
  const totalTasks = taskData?.length || 0;

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
