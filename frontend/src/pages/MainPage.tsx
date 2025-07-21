import React, { useState } from 'react';
import { Container, Row, Col, Button, Form, ListGroup, InputGroup, Modal } from 'react-bootstrap';

interface TaskList {
  id: string;
  name: string;
}

interface Task {
  id: string;
  shortDescription: string;
  longDescription?: string;
  dueDate: string;
  createdAt: string;
  completed: boolean;
}

const MainPage: React.FC = () => {
  const [taskLists, setTaskLists] = useState<TaskList[]>([
    { id: '1', name: 'My Daily Tasks' },
    { id: '2', name: 'Work Projects' },
  ]);
  const [selectedTaskListId, setSelectedTaskListId] = useState<string | null>(taskLists[0]?.id || null);
  const [newTaskListName, setNewTaskListName] = useState<string>('');

  const [tasks, setTasks] = useState<Task[]>([
    { id: 't1', shortDescription: 'Buy groceries', dueDate: '2025-07-22', createdAt: '2025-07-21', completed: false },
    { id: 't2', shortDescription: 'Finish report', longDescription: 'Complete the Q3 financial report', dueDate: '2025-07-25', createdAt: '2025-07-20', completed: false },
    { id: 't3', shortDescription: 'Call John', dueDate: '2025-07-21', createdAt: '2025-07-19', completed: true },
  ]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [newTaskShortDescription, setNewTaskShortDescription] = useState<string>('');
  const [newTaskLongDescription, setNewTaskLongDescription] = useState<string>('');
  const [newTaskDueDate, setNewTaskDueDate] = useState<string>('');

  const [showDeleteTaskListModal, setShowDeleteTaskListModal] = useState<boolean>(false);
  const [taskListToDelete, setTaskListToDelete] = useState<TaskList | null>(null);
  const [showDeleteTaskModal, setShowDeleteTaskModal] = useState<boolean>(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [showCompletedTasks, setShowCompletedTasks] = useState<boolean>(false);

  const activeTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  const handleCreateTaskList = () => {
    if (newTaskListName.trim() && !taskLists.some(list => list.name === newTaskListName.trim())) {
      const newId = String(taskLists.length + 1);
      setTaskLists([...taskLists, { id: newId, name: newTaskListName.trim() }]);
      setNewTaskListName('');
    } else {
      alert('Task list name cannot be empty or already exists.');
    }
  };

  const handleDeleteTaskList = (list: TaskList) => {
    setTaskListToDelete(list);
    setShowDeleteTaskListModal(true);
  };

  const confirmDeleteTaskList = () => {
    if (taskListToDelete) {
      setTaskLists(taskLists.filter(list => list.id !== taskListToDelete.id));
      setTasks(tasks);
      setSelectedTaskListId(null);
      setShowDeleteTaskListModal(false);
      setTaskListToDelete(null);
    }
  };

  const handleCreateTask = () => {
    if (newTaskShortDescription.trim() && newTaskDueDate.trim()) {
      const newId = `t${tasks.length + 1}`;
      const now = new Date().toISOString().split('T')[0];
      setTasks([
        ...tasks,
        {
          id: newId,
          shortDescription: newTaskShortDescription.trim(),
          longDescription: newTaskLongDescription.trim() || undefined,
          dueDate: newTaskDueDate.trim(),
          createdAt: now,
          completed: false,
        },
      ]);
      setNewTaskShortDescription('');
      setNewTaskLongDescription('');
      setNewTaskDueDate('');
    } else {
      alert('Short description and due date are required for a new task.');
    }
  };

  const handleToggleTaskComplete = (id: string) => {
    setTasks(tasks.map(task => (task.id === id ? { ...task, completed: !task.completed } : task)));
  };

  const handleDeleteTask = (task: Task) => {
    setTaskToDelete(task);
    setShowDeleteTaskModal(true);
  };

  const confirmDeleteTask = () => {
    if (taskToDelete) {
      setTasks(tasks.filter(task => task.id !== taskToDelete.id));
      setSelectedTask(null);
      setShowDeleteTaskModal(false);
      setTaskToDelete(null);
    }
  };

  return (
    <Container fluid className="h-100">
      <Row className="h-100">
        {/* Left Sidebar */}
        <Col md={3} className="bg-light border-end p-3">
          <h5>Task Lists</h5>
          <InputGroup className="mb-3">
            <Form.Control
              placeholder="New list name"
              value={newTaskListName}
              onChange={(e) => setNewTaskListName(e.target.value)}
            />
            <Button variant="outline-secondary" onClick={handleCreateTaskList}>
              Add List
            </Button>
          </InputGroup>
          <ListGroup>
            {taskLists.map((list) => (
              <ListGroup.Item
                key={list.id}
                action
                active={list.id === selectedTaskListId}
                onClick={() => setSelectedTaskListId(list.id)}
                className="d-flex justify-content-between align-items-center"
              >
                {list.name}
                <Button variant="danger" size="sm" onClick={(e) => { e.stopPropagation(); handleDeleteTaskList(list); }}>
                  Delete
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>

        {/* Main Content */}
        <Col md={selectedTask ? 6 : 9} className="p-3">
          {selectedTaskListId ? (
            <>
              <h5>Tasks in {taskLists.find(list => list.id === selectedTaskListId)?.name}</h5>
              <Form className="mb-4">
                <Form.Group className="mb-2">
                  <Form.Label>Short Description</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter short description"
                    value={newTaskShortDescription}
                    onChange={(e) => setNewTaskShortDescription(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Long Description (Optional)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter long description"
                    value={newTaskLongDescription}
                    onChange={(e) => setNewTaskLongDescription(e.target.value)}
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
                    {task.shortDescription} (Due: {task.dueDate})
                    <Button variant="success" size="sm" onClick={(e) => { e.stopPropagation(); handleToggleTaskComplete(task.id); }}>
                      Mark Complete
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
                      <del>{task.shortDescription} (Due: {task.dueDate})</del>
                      <Button variant="warning" size="sm" onClick={(e) => { e.stopPropagation(); handleToggleTaskComplete(task.id); }}>
                        Mark Incomplete
                      </Button>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </>
          ) : (
            <p>Select a task list or create a new one.</p>
          )}
        </Col>

        {/* Right Sidebar */}
        {selectedTask && (
          <Col md={3} className="bg-light border-start p-3">
            <h5>Task Details</h5>
            <h6>{selectedTask.shortDescription}</h6>
            <p><strong>Long Description:</strong> {selectedTask.longDescription || 'N/A'}</p>
            <p><strong>Due Date:</strong> {selectedTask.dueDate}</p>
            <p><strong>Created At:</strong> {selectedTask.createdAt}</p>
            <Button variant="danger" onClick={() => handleDeleteTask(selectedTask)}>
              Delete Task
            </Button>
          </Col>
        )}
      </Row>

      {/* Delete Task List Confirmation Modal */}
      <Modal show={showDeleteTaskListModal} onHide={() => setShowDeleteTaskListModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the task list "{taskListToDelete?.name}"? All associated tasks will also be deleted.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteTaskListModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDeleteTaskList}>
            Delete List
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Task Confirmation Modal */}
      <Modal show={showDeleteTaskModal} onHide={() => setShowDeleteTaskModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the task "{taskToDelete?.shortDescription}"?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteTaskModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDeleteTask}>
            Delete Task
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default MainPage;
