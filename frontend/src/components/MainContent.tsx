import React from 'react';
import { Button, Form, ListGroup, Modal } from 'react-bootstrap';
import { type Task } from 'todolist-model';

interface MainContentProps {
  tasks: Task[];
  selectedTaskListId: number | null;
  selectedTask: Task | null;
  newTaskTitle: string;
  newTaskDescription: string;
  newTaskDueDate: string;
  setNewTaskTitle: (title: string) => void;
  setNewTaskDescription: (description: string) => void;
  setNewTaskDueDate: (date: string) => void;
  handleCreateTask: () => Promise<void>;
  handleToggleTaskComplete: (task: Task) => Promise<void>;
  setSelectedTask: (task: Task | null) => void;
  showCompletedTasks: boolean;
  setShowCompletedTasks: (show: boolean) => void;
  showDeleteTaskModal: boolean;
  taskToDelete: Task | null;
  confirmDeleteTask: () => Promise<void>;
  setShowDeleteTaskModal: (show: boolean) => void;
  taskLists: any[]; // Temporary, will be removed once task list name is passed directly
}

const MainContent: React.FC<MainContentProps> = ({
  tasks,
  selectedTaskListId,
  newTaskTitle,
  newTaskDescription,
  newTaskDueDate,
  setNewTaskTitle,
  setNewTaskDescription,
  setNewTaskDueDate,
  handleCreateTask,
  handleToggleTaskComplete,
  setSelectedTask,
  showCompletedTasks,
  setShowCompletedTasks,
  showDeleteTaskModal,
  taskToDelete,
  confirmDeleteTask,
  setShowDeleteTaskModal,
  taskLists,
}) => {
  const activeTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  return (
    <>
      {selectedTaskListId ? (
        <>
          <h5 className='text-white'>Tasks in {taskLists.find(list => list.id === selectedTaskListId)?.name} list</h5>
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

          <h6>Active Tasks</h6>
          <ListGroup className="mb-3">
            {activeTasks.map(task => (
              <ListGroup.Item
                key={task.id}
                action
                onClick={() => setSelectedTask(task)}
                className="d-flex justify-content-between align-items-center"
              >
                {task.title} (Due: {new Date(task.dueDate).toLocaleDateString()})
                <Button variant="success" size="sm" onClick={(e) => { e.stopPropagation(); handleToggleTaskComplete(task); }}>
                  Mark Complete ✅
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>

          <Button variant="info" onClick={() => setShowCompletedTasks(!showCompletedTasks)} className="mb-3">
            {showCompletedTasks ? 'Hide' : 'Show'} Completed Tasks
          </Button>

          {showCompletedTasks && (
            <ListGroup>
              <h6>Completed Tasks</h6>
              {completedTasks.map(task => (
                <ListGroup.Item
                  key={task.id}
                  action
                  onClick={() => setSelectedTask(task)}
                  className="d-flex justify-content-between align-items-center text-muted"
                >
                  <del>{task.title} (Due: {new Date(task.dueDate).toLocaleDateString()})</del>
                  <Button variant="warning" size="sm" onClick={(e) => { e.stopPropagation(); handleToggleTaskComplete(task); }}>
                    Mark Incomplete ❌
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </>
      ) : (
        <h2 className='text-white'>No task yet. Select a task list or create a new one.</h2>
      )}


      <Modal show={showDeleteTaskModal} onHide={() => setShowDeleteTaskModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the task "{taskToDelete?.title}"?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteTaskModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDeleteTask}>
           🗑️ Delete Task
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default MainContent;
