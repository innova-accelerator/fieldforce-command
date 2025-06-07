
import React, { useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { format } from 'date-fns';
import { Calendar, Plus, User, Clock, ChevronRight, ChevronDown } from 'lucide-react';
import { Checkbox } from '../../../../components/ui/checkbox';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Calendar as CalendarComponent } from '../../../../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../../../../components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select';
import { TaskWithSubtasks } from '../../../../types/task';
import { cn } from '../../../../lib/utils';

interface TaskItemProps {
  task: TaskWithSubtasks;
  index: number;
  people: Array<{ id: string; first_name: string; last_name: string }>;
  onToggle: (taskId: string, complete: boolean) => void;
  onUpdate: (taskId: string, updates: Partial<TaskWithSubtasks>) => void;
  onAddSubtask: (parentId: string, label: string) => void;
  depth?: number;
}

const TaskItem: React.FC<TaskItemProps> = ({
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
      await onUpdate(task.id, { due_date: date?.toISOString() });
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
        assignee_id: assigneeId,
        assignee_name: assignee ? `${assignee.first_name} ${assignee.last_name}` : undefined
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

  const isDueSoon = task.due_date && new Date(task.due_date) <= new Date(Date.now() + 24 * 60 * 60 * 1000);
  const isOverdue = task.due_date && new Date(task.due_date) < new Date();

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={cn(
            "bg-white border rounded-lg shadow-sm",
            snapshot.isDragging && "shadow-md",
            depth > 0 && "ml-6 border-l-2 border-blue-200"
          )}
          style={{
            ...provided.draggableProps.style,
            marginLeft: depth > 0 ? `${depth * 24}px` : '0px'
          }}
        >
          <div className="p-3">
            <div className="flex items-center gap-3">
              <Checkbox
                checked={task.complete}
                onCheckedChange={(checked) => onToggle(task.id, checked as boolean)}
                disabled={isLoading}
              />
              
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

              <div className="flex-1">
                {isEditing ? (
                  <Input
                    value={editLabel}
                    onChange={(e) => setEditLabel(e.target.value)}
                    onBlur={handleLabelEdit}
                    onKeyPress={(e) => e.key === 'Enter' && handleLabelEdit()}
                    className="text-sm"
                    autoFocus
                    disabled={isLoading}
                  />
                ) : (
                  <span
                    className={cn(
                      "text-sm cursor-pointer",
                      task.complete && "line-through text-gray-500"
                    )}
                    onDoubleClick={() => setIsEditing(true)}
                  >
                    {task.label}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {/* Due Date Picker */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "h-7 px-2 text-xs",
                        isOverdue && "text-red-600",
                        isDueSoon && !isOverdue && "text-orange-600"
                      )}
                      disabled={isLoading}
                    >
                      <Calendar className="h-3 w-3 mr-1" />
                      {task.due_date ? format(new Date(task.due_date), 'MMM d') : 'Due'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={task.due_date ? new Date(task.due_date) : undefined}
                      onSelect={handleDateChange}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>

                {/* Assignee Selector */}
                <Select
                  value={task.assignee_id || ''}
                  onValueChange={handleAssigneeChange}
                  disabled={isLoading}
                >
                  <SelectTrigger className="h-7 w-24 text-xs">
                    <User className="h-3 w-3 mr-1" />
                    <SelectValue placeholder="Assign" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Unassigned</SelectItem>
                    {people.map((person) => (
                      <SelectItem key={person.id} value={person.id}>
                        {person.first_name} {person.last_name}
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
                </Button>
              </div>
            </div>

            {error && (
              <div className="mt-2 text-xs text-red-600">{error}</div>
            )}

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
                  className="text-sm"
                  autoFocus
                  disabled={isLoading}
                />
                <Button size="sm" onClick={handleAddSubtask} disabled={isLoading}>
                  Add
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowAddSubtask(false)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>

          {/* Subtasks */}
          {showSubtasks && task.subtasks.length > 0 && (
            <div className="border-t">
              {task.subtasks.map((subtask, subIndex) => (
                <TaskItem
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

export default TaskItem;
