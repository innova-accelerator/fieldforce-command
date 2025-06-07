
import React, { useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { format } from 'date-fns';
import { 
  Calendar, 
  Plus, 
  User, 
  Clock, 
  ChevronRight, 
  ChevronDown,
  GripVertical,
  AlertCircle 
} from 'lucide-react';
import { Checkbox } from '../ui/checkbox';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Calendar as CalendarComponent } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { cn } from '../../lib/utils';
import { TaskResponse } from '../../services/api/tasks';
import { PersonResponse } from '../../services/api/people';

interface TaskWithSubtasks extends TaskResponse {
  subtasks: TaskWithSubtasks[];
}

interface TaskEngineItemProps {
  task: TaskWithSubtasks;
  index: number;
  people: PersonResponse[];
  onToggle: (taskId: string, complete: boolean) => void;
  onUpdate: (taskId: string, updates: Partial<TaskResponse>) => void;
  onAddSubtask: (parentId: string, label: string) => void;
  depth?: number;
}

const TaskEngineItem: React.FC<TaskEngineItemProps> = ({
  task,
  index,
  people,
  onToggle,
  onUpdate,
  onAddSubtask,
  depth = 0
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editLabel, setEditLabel] = useState(task.label);
  const [showSubtasks, setShowSubtasks] = useState(true);
  const [showAddSubtask, setShowAddSubtask] = useState(false);
  const [newSubtaskLabel, setNewSubtaskLabel] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLabelEdit = async () => {
    if (editLabel.trim() && editLabel !== task.label) {
      setIsLoading(true);
      setError(null);
      try {
        await onUpdate(task.id, { label: editLabel.trim() });
      } catch (err) {
        setError('Failed to update task');
        setEditLabel(task.label);
      } finally {
        setIsLoading(false);
      }
    }
    setIsEditing(false);
  };

  const handleDateChange = async (date: Date | undefined) => {
    setIsLoading(true);
    setError(null);
    try {
      await onUpdate(task.id, { dueDate: date?.toISOString() });
    } catch (err) {
      setError('Failed to update due date');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssigneeChange = async (assigneeId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const assignee = people.find(p => p.id === assigneeId);
      await onUpdate(task.id, { 
        assigneeId: assigneeId || undefined,
        assigneeName: assignee ? `${assignee.firstName} ${assignee.lastName}` : undefined
      });
    } catch (err) {
      setError('Failed to update assignee');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSubtask = async () => {
    if (newSubtaskLabel.trim()) {
      setIsLoading(true);
      setError(null);
      try {
        await onAddSubtask(task.id, newSubtaskLabel.trim());
        setNewSubtaskLabel('');
        setShowAddSubtask(false);
      } catch (err) {
        setError('Failed to add subtask');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const isDueSoon = task.dueDate && new Date(task.dueDate) <= new Date(Date.now() + 24 * 60 * 60 * 1000);
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={cn(
            "bg-white border rounded-lg shadow-sm transition-shadow",
            snapshot.isDragging && "shadow-lg ring-2 ring-blue-200",
            depth > 0 && "ml-6 border-l-4 border-blue-200"
          )}
          style={{
            ...provided.draggableProps.style,
            marginLeft: depth > 0 ? `${depth * 24}px` : '0px'
          }}
        >
          <div className="p-3 md:p-4">
            <div className="flex items-center gap-2 md:gap-3">
              {/* Drag Handle */}
              <div {...provided.dragHandleProps} className="cursor-grab active:cursor-grabbing">
                <GripVertical className="h-4 w-4 text-gray-400" />
              </div>

              {/* Checkbox */}
              <Checkbox
                checked={task.complete}
                onCheckedChange={(checked) => onToggle(task.id, checked as boolean)}
                disabled={isLoading}
              />
              
              {/* Expand/Collapse Button */}
              {task.subtasks.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSubtasks(!showSubtasks)}
                  className="h-6 w-6 p-0"
                >
                  {showSubtasks ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                </Button>
              )}

              {/* Task Label */}
              <div className="flex-1 min-w-0">
                {isEditing ? (
                  <Input
                    value={editLabel}
                    onChange={(e) => setEditLabel(e.target.value)}
                    onBlur={handleLabelEdit}
                    onKeyPress={(e) => e.key === 'Enter' && handleLabelEdit()}
                    className="text-sm border-none p-0 h-auto focus-visible:ring-0"
                    autoFocus
                    disabled={isLoading}
                  />
                ) : (
                  <span
                    className={cn(
                      "text-sm cursor-pointer hover:text-blue-600 transition-colors block truncate",
                      task.complete && "line-through text-gray-500"
                    )}
                    onDoubleClick={() => setIsEditing(true)}
                  >
                    {task.label}
                  </span>
                )}
              </div>

              {/* Task Controls */}
              <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
                {/* Due Date Picker */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "h-7 px-2 text-xs hidden sm:flex",
                        isOverdue && "text-red-600 bg-red-50",
                        isDueSoon && !isOverdue && "text-orange-600 bg-orange-50"
                      )}
                      disabled={isLoading}
                    >
                      <Calendar className="h-3 w-3 mr-1" />
                      {task.dueDate ? format(new Date(task.dueDate), 'MMM d') : 'Due'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={task.dueDate ? new Date(task.dueDate) : undefined}
                      onSelect={handleDateChange}
                      initialFocus
                      className="p-3"
                    />
                  </PopoverContent>
                </Popover>

                {/* Assignee Selector */}
                <Select
                  value={task.assigneeId || ''}
                  onValueChange={handleAssigneeChange}
                  disabled={isLoading}
                >
                  <SelectTrigger className="h-7 w-20 md:w-28 text-xs">
                    <User className="h-3 w-3 mr-1" />
                    <SelectValue placeholder="Assign" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Unassigned</SelectItem>
                    {people.map((person) => (
                      <SelectItem key={person.id} value={person.id}>
                        {person.firstName} {person.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Add Subtask Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAddSubtask(true)}
                  className="h-7 px-2 text-xs"
                  disabled={isLoading}
                >
                  <Plus className="h-3 w-3" />
                  <span className="hidden md:inline ml-1">Sub</span>
                </Button>
              </div>
            </div>

            {/* Mobile Due Date */}
            {task.dueDate && (
              <div className="mt-2 sm:hidden">
                <span className={cn(
                  "text-xs px-2 py-1 rounded inline-flex items-center gap-1",
                  isOverdue && "text-red-600 bg-red-50",
                  isDueSoon && !isOverdue && "text-orange-600 bg-orange-50",
                  !isDueSoon && !isOverdue && "text-gray-600 bg-gray-50"
                )}>
                  <Calendar className="h-3 w-3" />
                  {format(new Date(task.dueDate), 'MMM d')}
                </span>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="mt-2 flex items-center gap-2 text-xs text-red-600 bg-red-50 p-2 rounded">
                <AlertCircle className="h-3 w-3" />
                {error}
              </div>
            )}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                <Clock className="h-3 w-3 animate-spin" />
                Saving...
              </div>
            )}

            {/* Add Subtask Input */}
            {showAddSubtask && (
              <div className="mt-3 flex gap-2">
                <Input
                  placeholder="Add subtask..."
                  value={newSubtaskLabel}
                  onChange={(e) => setNewSubtaskLabel(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddSubtask()}
                  className="text-sm flex-1"
                  autoFocus
                  disabled={isLoading}
                />
                <Button size="sm" onClick={handleAddSubtask} disabled={isLoading || !newSubtaskLabel.trim()}>
                  Add
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setShowAddSubtask(false);
                    setNewSubtaskLabel('');
                  }}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>

          {/* Subtasks */}
          {showSubtasks && task.subtasks.length > 0 && (
            <div className="border-t bg-gray-50/50">
              {task.subtasks.map((subtask, subIndex) => (
                <TaskEngineItem
                  key={subtask.id}
                  task={subtask}
                  index={subIndex}
                  people={people}
                  onToggle={onToggle}
                  onUpdate={onUpdate}
                  onAddSubtask={onAddSubtask}
                  depth={depth + 1}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
};

export default TaskEngineItem;
