
import React from 'react';
import { ListGroup, Button } from 'react-bootstrap';
import { type Task } from 'todolist-model';

interface ActiveTasksListProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onToggleComplete: (task: Task) => void;
}

const ActiveTasksList: React.FC<ActiveTasksListProps> = ({ tasks, onTaskClick, onToggleComplete }) => {
  return (
    <ListGroup className="mb-3">
      {tasks.map(task => (
        <ListGroup.Item
          key={task.id}
          action
          onClick={() => onTaskClick(task)}
          className="d-flex justify-content-between align-items-center"
        >
          {task.title} (Due: {new Date(task.dueDate).toLocaleDateString()})
          <Button variant="success" size="sm" onClick={(e) => { e.stopPropagation(); onToggleComplete(task); }}>
            Mark Complete ✅
          </Button>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default ActiveTasksList;
