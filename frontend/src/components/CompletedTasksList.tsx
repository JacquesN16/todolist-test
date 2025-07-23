
import React from 'react';
import { ListGroup, Button } from 'react-bootstrap';
import { type Task } from 'todolist-model';

interface CompletedTasksListProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onToggleComplete: (task: Task) => void;
}

const CompletedTasksList: React.FC<CompletedTasksListProps> = ({ tasks, onTaskClick, onToggleComplete }) => {
  return (
    <ListGroup>
      <h6>Completed Tasks</h6>
      {tasks.map(task => (
        <ListGroup.Item
          key={task.id}
          action
          onClick={() => onTaskClick(task)}
          className="d-flex justify-content-between align-items-center text-muted"
        >
          <del>{task.title} (Due: {new Date(task.dueDate).toLocaleDateString()})</del>
          <Button variant="warning" size="sm" onClick={(e) => { e.stopPropagation(); onToggleComplete(task); }}>
            Mark Incomplete ❌
          </Button>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default CompletedTasksList;
