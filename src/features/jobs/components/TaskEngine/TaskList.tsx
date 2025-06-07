
import React from 'react';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { TaskWithSubtasks } from '../../../../types/task';
import TaskItem from './TaskItem';

interface TaskListProps {
  tasks: TaskWithSubtasks[];
  people: Array<{ id: string; first_name: string; last_name: string }>;
  onToggle: (taskId: string, complete: boolean) => void;
  onUpdate: (taskId: string, updates: Partial<TaskWithSubtasks>) => void;
  onAddSubtask: (parentId: string, label: string) => void;
  onReorder: (result: DropResult) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  people,
  onToggle,
  onUpdate,
  onAddSubtask,
  onReorder
}) => {
  return (
    <DragDropContext onDragEnd={onReorder}>
      <Droppable droppableId="tasks">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="space-y-2"
          >
            {tasks.map((task, index) => (
              <TaskItem
                key={task.id}
                task={task}
                index={index}
                people={people}
                onToggle={onToggle}
                onUpdate={onUpdate}
                onAddSubtask={onAddSubtask}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default TaskList;
