import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { type TaskList, type Task } from 'todolist-model';

import TaskListSidebar from '../components/TaskListSidebar';
import MainContent from '../components/MainContent';
import TaskDetailsSidebar from '../components/TaskDetailsSidebar';

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
    setSelectedTask(null)
    if (selectedTaskListId) {
      fetchTasks(selectedTaskListId);
    } else {
      setTasks([]);
    }
  }, [selectedTaskListId]);

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
        fetchTaskLists();
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
        setSelectedTaskListId(null);
        fetchTaskLists();
      } catch (error) {
        console.error('Error deleting task list:', error);
        if(error){
          alert(`${error.message}. Please try again.`);
        }

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
        if(error){
          alert(`${error.message}. Please try again.`);
        }

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
      if(error){
        alert(`${error.message}. Please try again.`);
      }
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
        if(error){
          alert(`${error.message}. Please try again.`);
        }
      }
    }
  };

  return (
    <Container fluid className="h-100">
      <Row className="h-100">
        {/* Left Sidebar */}
        <Col md={3} className="bg-light border-end p-3">
          <TaskListSidebar
            taskLists={taskLists}
            selectedTaskListId={selectedTaskListId}
            newTaskListName={newTaskListName}
            setNewTaskListName={setNewTaskListName}
            handleCreateTaskList={handleCreateTaskList}
            handleDeleteTaskList={handleDeleteTaskList}
            setSelectedTaskListId={setSelectedTaskListId}
            showDeleteTaskListModal={showDeleteTaskListModal}
            taskListToDelete={taskListToDelete}
            confirmDeleteTaskList={confirmDeleteTaskList}
            setShowDeleteTaskListModal={setShowDeleteTaskListModal}
          />
        </Col>

        {/* Main Content */}
        <Col md={selectedTask ? 6 : 9} className="p-3">
          <MainContent
            tasks={tasks}
            selectedTaskListId={selectedTaskListId}
            selectedTask={selectedTask}
            newTaskTitle={newTaskTitle}
            newTaskDescription={newTaskDescription}
            newTaskDueDate={newTaskDueDate}
            setNewTaskTitle={setNewTaskTitle}
            setNewTaskDescription={setNewTaskDescription}
            setNewTaskDueDate={setNewTaskDueDate}
            handleCreateTask={handleCreateTask}
            handleToggleTaskComplete={handleToggleTaskComplete}
            setSelectedTask={setSelectedTask}
            showCompletedTasks={showCompletedTasks}
            setShowCompletedTasks={setShowCompletedTasks}
            showDeleteTaskModal={showDeleteTaskModal}
            taskToDelete={taskToDelete}
            confirmDeleteTask={confirmDeleteTask}
            setShowDeleteTaskModal={setShowDeleteTaskModal}
            taskLists={taskLists}
          />
        </Col>

        {/* Right Sidebar */}
        {selectedTask && (
          <Col md={3} className="bg-light border-start p-3">
            <TaskDetailsSidebar
              selectedTask={selectedTask}
              handleDeleteTask={handleDeleteTask}
            />
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default MainPage;
