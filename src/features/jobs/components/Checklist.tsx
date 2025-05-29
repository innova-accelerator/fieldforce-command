
import React, { useState } from 'react';
import { CheckSquare, Plus, Calendar } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Task, TimelineEntry } from '../../../types/job';

interface ChecklistProps {
  tasks: Task[];
  onAddTask: (task: Omit<Task, 'id'>) => void;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onTimelineUpdate: (entry: Omit<TimelineEntry, 'timestamp'>) => void;
}

const Checklist: React.FC<ChecklistProps> = ({ 
  tasks, 
  onAddTask, 
  onUpdateTask, 
  onTimelineUpdate 
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTaskLabel, setNewTaskLabel] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');

  const toggleTask = (task: Task) => {
    const newCompleted = !task.complete;
    onUpdateTask(task.id, { complete: newCompleted });
    onTimelineUpdate({
      type: 'status',
      content: `Task "${task.label}" marked as ${newCompleted ? 'completed' : 'incomplete'}`,
      author: 'Current User'
    });
  };

  const handleAddTask = () => {
    if (newTaskLabel.trim()) {
      onAddTask({
        label: newTaskLabel.trim(),
        complete: false,
        dueDate: newTaskDueDate || undefined
      });
      onTimelineUpdate({
        type: 'status',
        content: `New task added: "${newTaskLabel.trim()}"`,
        author: 'Current User'
      });
      setNewTaskLabel('');
      setNewTaskDueDate('');
      setShowAddForm(false);
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-300';
    }
  };

  const formatDueDate = (dueDate?: string) => {
    if (!dueDate) return null;
    const date = new Date(dueDate);
    const now = new Date();
    const isOverdue = date < now && !tasks.find(t => t.dueDate === dueDate)?.complete;
    
    return (
      <span className={`text-xs ${isOverdue ? 'text-red-600' : 'text-gray-500'}`}>
        Due: {date.toLocaleDateString()}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CheckSquare className="h-5 w-5 text-green-600" />
          <h2 className="text-lg font-semibold text-gray-900">Task Checklist</h2>
        </div>
        <Button
          size="sm"
          onClick={() => setShowAddForm(true)}
          className="h-8 px-3"
        >
          <Plus className="h-3 w-3 mr-1" />
          Add Task
        </Button>
      </div>
      
      {/* Tasks List */}
      <div className="space-y-3">
        {tasks.map((task) => (
          <div 
            key={task.id} 
            className={`flex items-start gap-3 p-3 border-l-4 ${getPriorityColor(task.priority)} bg-gray-50 rounded-r-lg`}
          >
            <input
              type="checkbox"
              checked={task.complete}
              onChange={() => toggleTask(task)}
              className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${task.complete ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                {task.label}
              </p>
              {task.dueDate && (
                <div className="mt-1">
                  {formatDueDate(task.dueDate)}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {tasks.length === 0 && (
          <p className="text-sm text-gray-500 italic text-center py-4">
            No tasks added yet. Click "Add Task" to get started.
          </p>
        )}
      </div>
      
      {/* Add Task Form */}
      {showAddForm && (
        <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <div className="space-y-3">
            <div>
              <Label htmlFor="taskLabel" className="text-sm font-medium text-gray-700">
                Task Description
              </Label>
              <Input
                id="taskLabel"
                value={newTaskLabel}
                onChange={(e) => setNewTaskLabel(e.target.value)}
                placeholder="Enter task description..."
                className="mt-1"
                autoFocus
              />
            </div>
            
            <div>
              <Label htmlFor="taskDueDate" className="text-sm font-medium text-gray-700">
                Due Date (Optional)
              </Label>
              <Input
                id="taskDueDate"
                type="date"
                value={newTaskDueDate}
                onChange={(e) => setNewTaskDueDate(e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div className="flex gap-2">
              <Button size="sm" onClick={handleAddTask}>
                Add Task
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => {
                  setShowAddForm(false);
                  setNewTaskLabel('');
                  setNewTaskDueDate('');
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Progress Summary */}
      {tasks.length > 0 && (
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              Progress: {tasks.filter(t => t.complete).length} of {tasks.length} completed
            </span>
            <div className="w-24 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(tasks.filter(t => t.complete).length / tasks.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checklist;
