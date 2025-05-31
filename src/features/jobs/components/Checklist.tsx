import React, { useState } from 'react';
import { CheckSquare, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Checkbox } from '../../../components/ui/checkbox';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Job, Task, TimelineEntry } from '../../../types/job';

interface ChecklistProps {
  tasks: Task[];
  onAddTask: (task: Omit<Task, 'id' | 'job_id' | 'complete' | 'created_at' | 'updated_at'>) => void;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onTimelineUpdate: (entry: Omit<TimelineEntry, 'timestamp' | 'id' | 'job_id' | 'created_at'>) => void;
}

const Checklist: React.FC<ChecklistProps> = ({ tasks, onAddTask, onUpdateTask, onTimelineUpdate }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTaskLabel, setNewTaskLabel] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');

  const handleAddTask = () => {
    if (newTaskLabel.trim()) {
      onAddTask({
        label: newTaskLabel,
        due_date: newTaskDueDate || undefined,
        priority: newTaskPriority,
        complete: false,
        job_id: '', // Will be set by parent
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

      onTimelineUpdate({
        type: 'note',
        content: `Task added: ${newTaskLabel}`,
        author_id: undefined // Should be set to current user's person ID
      });

      setNewTaskLabel('');
      setNewTaskDueDate('');
      setNewTaskPriority('medium');
      setShowAddForm(false);
    }
  };

  const handleToggleTask = (taskId: string, complete: boolean) => {
    onUpdateTask(taskId, { complete });
    
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      onTimelineUpdate({
        type: 'note',
        content: `Task ${complete ? 'completed' : 'reopened'}: ${task.label}`,
        author_id: undefined // Should be set to current user's person ID
      });
    }
  };

  const formatDueDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <CheckSquare className="h-5 w-5 text-blue-600" />
            Task Checklist
          </CardTitle>
          <Button
            size="sm"
            onClick={() => setShowAddForm(true)}
            className="h-8 px-3"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Task
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {tasks.map((task) => (
            <div key={task.id} className="flex items-start gap-3 p-3 border rounded-lg">
              <Checkbox
                checked={task.complete}
                onCheckedChange={(checked) => handleToggleTask(task.id, checked as boolean)}
                className="mt-0.5"
              />
              <div className="flex-1">
                <div className={`font-medium ${task.complete ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                  {task.label}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  {task.due_date && (
                    <span className="text-xs text-gray-500">
                      Due: {formatDueDate(task.due_date)}
                    </span>
                  )}
                  {task.priority && (
                    <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {tasks.length === 0 && !showAddForm && (
            <div className="text-center py-8 text-gray-500">
              <CheckSquare className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p>No tasks yet. Add one to get started!</p>
            </div>
          )}
        </div>

        {/* Add Task Form */}
        {showAddForm && (
          <div className="mt-4 p-4 border rounded-lg bg-gray-50">
            <div className="space-y-3">
              <Input
                placeholder="Task description"
                value={newTaskLabel}
                onChange={(e) => setNewTaskLabel(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
              />
              <div className="flex gap-2">
                <Input
                  type="date"
                  value={newTaskDueDate}
                  onChange={(e) => setNewTaskDueDate(e.target.value)}
                  className="flex-1"
                />
                <Select value={newTaskPriority} onValueChange={(value: 'low' | 'medium' | 'high') => setNewTaskPriority(value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleAddTask}>Add Task</Button>
                <Button size="sm" variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Checklist;
