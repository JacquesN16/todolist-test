import { useState, useEffect } from 'react';
import { type Task } from 'todolist-model';
import { useAuth } from '../context/AuthContext';
import { TASK_API } from '../helper/constant';

export const useTasks = (selectedTaskListId: number | null) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState<string>('');
  const [newTaskDescription, setNewTaskDescription] = useState<string>('');
  const [newTaskDueDate, setNewTaskDueDate] = useState<string>('');
  const [showDeleteTaskModal, setShowDeleteTaskModal] = useState<boolean>(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [showCompletedTasks, setShowCompletedTasks] = useState<boolean>(false);
  const { accessToken } = useAuth();

  const fetchTasks = async (listId: number) => {
    try {
      const response = await fetch(`${TASK_API}/list/${listId}`, {
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
    setSelectedTask(null);
    if (selectedTaskListId) {
      fetchTasks(selectedTaskListId);
    } else {
      setTasks([]);
    }
  }, [selectedTaskListId]);

  const handleCreateTask = async () => {
    if (newTaskTitle.trim() && newTaskDueDate.trim() && selectedTaskListId) {
      try {
        const response = await fetch(`${TASK_API}`, {
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
          alert(`${(error as Error).message}. Please try again.`);
        }

      }
    } else {
      alert('Short description, due date, and a selected task list are required for a new task.');
    }
  };

  const handleToggleTaskComplete = async (task: Task) => {
    try {
      const response = await fetch(`${TASK_API}/${task.id}`, {
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
        alert(`${(error as Error).message}. Please try again.`);
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
        const response = await fetch(`${TASK_API}/${taskToDelete.id}`, {
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
          alert(`${(error as Error).message}. Please try again.`);
        }
      }
    }
  };

  return {
    tasks,
    selectedTask,
    newTaskTitle,
    newTaskDescription,
    newTaskDueDate,
    showDeleteTaskModal,
    taskToDelete,
    showCompletedTasks,
    setNewTaskTitle,
    setNewTaskDescription,
    setNewTaskDueDate,
    handleCreateTask,
    handleToggleTaskComplete,
    setSelectedTask,
    setShowCompletedTasks,
    handleDeleteTask,
    confirmDeleteTask,
    setShowDeleteTaskModal,
  };
};