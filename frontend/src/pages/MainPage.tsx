import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form, ListGroup, InputGroup, Modal } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { type TaskList, type Task} from 'todolist-model';

const API_BASE_URL = 'http://localhost:3000';

const MainPage: React.FC = () => {
  const [taskLists, setTaskLists] = useState<TaskList[]>([]);
  const [selectedTaskListId, setSelectedTaskListId] = useState<number | null>(null);
  const [newTaskListName, setNewTaskListName] = useState<string>('');

  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState<string>('');
  const [newTaskDescription, setNewTaskDescription] = useState<string>('');
  const [newTaskDueDate, setNewTaskDueDate] = useState<string>('');

  const [showDeleteTaskListModal, setShowDeleteTaskListModal] = useState<boolean>(false);
  const [taskListToDelete, setTaskListToDelete] = useState<TaskList | null>(null);
  const [showDeleteTaskModal, setShowDeleteTaskModal] = useState<boolean>(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [showCompletedTasks, setShowCompletedTasks] = useState<boolean>(false);

  const { accessToken } = useAuth();

  const fetchTaskLists = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/task-lists`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch task lists');
      }
      const data: TaskList[] = await response.json();
      setTaskLists(data);
      if (data.length > 0 && !selectedTaskListId) {
        setSelectedTaskListId(data[0].id);
      }
    } catch (error) {
      console.error('Error fetching task lists:', error);
    }
  };

  const fetchTasks = async (listId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/list/${listId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      const data: Task[] = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchTaskLists();
    }
  }, [accessToken]);

  useEffect(() => {
    if (selectedTaskListId) {
      fetchTasks(selectedTaskListId);
    } else {
      setTasks([]);
    }
  }, [selectedTaskListId]);

  const activeTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  const handleCreateTaskList = async () => {
    if (newTaskListName.trim()) {
      try {
        const response = await fetch(`${API_BASE_URL}/task-lists`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ name: newTaskListName.trim() }),
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to create task list');
        }
        setNewTaskListName('');
        fetchTaskLists(); // Refresh task lists
      } catch (error) {
        console.error('Error creating task list:', error);
        if(error){
          alert(`${error?.message}  Please try again.`);
        }

      }
    } else {
      alert('Task list name cannot be empty.');
    }
  };

  const handleDeleteTaskList = (list: TaskList) => {
    setTaskListToDelete(list);
    setShowDeleteTaskListModal(true);
  };

  const confirmDeleteTaskList = async () => {
    if (taskListToDelete) {
      try {
        const response = await fetch(`${API_BASE_URL}/task-lists/${taskListToDelete.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to delete task list');
        }
        setShowDeleteTaskListModal(false);
        setTaskListToDelete(null);
        setSelectedTaskListId(null); // Deselect the deleted list
        fetchTaskLists(); // Refresh task lists
      } catch (error) {
        console.error('Error deleting task list:', error);
        alert('Failed to delete task list. Please try again.');
      }
    }
  };

  const handleCreateTask = async () => {
    if (newTaskTitle.trim() && newTaskDueDate.trim() && selectedTaskListId) {
      try {
        const response = await fetch(`${API_BASE_URL}/tasks`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            title: newTaskTitle.trim(),
            description: newTaskDescription.trim() || undefined,
            dueDate: newTaskDueDate.trim(),
            listId: selectedTaskListId,
          }),
        });
        if (!response.ok) {
          throw new Error('Failed to create task');
        }
        setNewTaskTitle('');
        setNewTaskDescription('');
        setNewTaskDueDate('');
        fetchTasks(selectedTaskListId); // Refresh tasks for the current list
      } catch (error) {
        console.error('Error creating task:', error);
        alert('Failed to create task. Please try again.');
      }
    } else {
      alert('Short description, due date, and a selected task list are required for a new task.');
    }
  };

  const handleToggleTaskComplete = async (task: Task) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${task.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ completed: !task.completed }),
      });
      if (!response.ok) {
        throw new Error('Failed to update task status');
      }
      fetchTasks(selectedTaskListId!); // Refresh tasks
    } catch (error) {
      console.error('Error updating task status:', error);
      alert('Failed to update task status. Please try again.');
    }
  };

  const handleDeleteTask = (task: Task) => {
    setTaskToDelete(task);
    setShowDeleteTaskModal(true);
  };

  const confirmDeleteTask = async () => {
    if (taskToDelete && selectedTaskListId) {
      try {
        const response = await fetch(`${API_BASE_URL}/tasks/${taskToDelete.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to delete task');
        }
        setShowDeleteTaskModal(false);
        setTaskToDelete(null);
        setSelectedTask(null); // Deselect the deleted task
        fetchTasks(selectedTaskListId); // Refresh tasks
      } catch (error) {
        console.error('Error deleting task:', error);
        alert('Failed to delete task. Please try again.');
      }
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
                      <del>{task.title} (Due: {new Date(task.dueDate).toLocaleDateString()})</del>
                      <Button variant="warning" size="sm" onClick={(e) => { e.stopPropagation(); handleToggleTaskComplete(task); }}>
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
            <h6>{selectedTask.title}</h6>
            <p><strong>Long Description:</strong> {selectedTask.description || 'N/A'}</p>
            <p><strong>Due Date:</strong> {new Date(selectedTask.dueDate).toLocaleDateString()}</p>
            <p><strong>Created At:</strong> {new Date(selectedTask.createdAt).toLocaleDateString()}</p>
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
          Are you sure you want to delete the task "{taskToDelete?.title}"?
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