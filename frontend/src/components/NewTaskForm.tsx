
import React from 'react';
import { Form, Button } from 'react-bootstrap';

interface NewTaskFormProps {
  newTaskTitle: string;
  setNewTaskTitle: (title: string) => void;
  newTaskDescription: string;
  setNewTaskDescription: (description: string) => void;
  newTaskDueDate: string;
  setNewTaskDueDate: (date: string) => void;
  handleCreateTask: () => void;
}

const NewTaskForm: React.FC<NewTaskFormProps> = ({
  newTaskTitle,
  setNewTaskTitle,
  newTaskDescription,
  setNewTaskDescription,
  newTaskDueDate,
  setNewTaskDueDate,
  handleCreateTask,
}) => {
  return (
    <Form className="mb-4">
      <Form.Group className="mb-2">
        <Form.Label>Short Description</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter short description"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          required
        />
      </Form.Group>
      <Form.Group className="mb-2">
        <Form.Label>Long Description (Optional)</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          placeholder="Enter long description"
          value={newTaskDescription}
          onChange={(e) => setNewTaskDescription(e.target.value)}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Due Date</Form.Label>
        <Form.Control
          type="date"
          value={newTaskDueDate}
          onChange={(e) => setNewTaskDueDate(e.target.value)}
          required
        />
      </Form.Group>
      <Button variant="primary" onClick={handleCreateTask}>
        Add Task
      </Button>
    </Form>
  );
};

export default NewTaskForm;
