import React from 'react';
import { Button } from 'react-bootstrap';
import { type Task } from 'todolist-model';

interface TaskDetailsSidebarProps {
  selectedTask: Task | null;
  handleDeleteTask: (task: Task) => void;
}

const TaskDetailsSidebar: React.FC<TaskDetailsSidebarProps> = ({
  selectedTask,
  handleDeleteTask,
}) => {
  return (
    <>
      <h5>Task Details</h5>
      <h6>{selectedTask?.completed ? "✅" : "❌"} {selectedTask?.title}</h6>

      <p><strong>Long Description:</strong> {selectedTask?.description || 'N/A'}</p>
      <p><strong>Due Date:</strong> {selectedTask?.dueDate ? new Date(selectedTask.dueDate).toLocaleDateString() : 'N/A'}</p>
      <p><strong>Created At:</strong> {selectedTask?.createdAt ? new Date(selectedTask.createdAt).toLocaleDateString() : 'N/A'}</p>
      <Button variant="danger" onClick={() => selectedTask && handleDeleteTask(selectedTask)}>
        Delete Task
      </Button>
    </>
  );
};

export default TaskDetailsSidebar;
