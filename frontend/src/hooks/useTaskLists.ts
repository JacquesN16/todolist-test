
import { useState, useEffect } from 'react';
import { type TaskList } from 'todolist-model';
import { useAuth } from '../context/AuthContext';

const API_BASE_URL = 'http://localhost:3000';

export const useTaskLists = () => {
  const [taskLists, setTaskLists] = useState<TaskList[]>([]);
  const [selectedTaskListId, setSelectedTaskListId] = useState<number | null>(null);
  const [newTaskListName, setNewTaskListName] = useState<string>('');
  const [showDeleteTaskListModal, setShowDeleteTaskListModal] = useState<boolean>(false);
  const [taskListToDelete, setTaskListToDelete] = useState<TaskList | null>(null);
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

  useEffect(() => {
    if (accessToken) {
      fetchTaskLists();
    }
  }, [accessToken]);

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
          alert(`${(error as Error).message}  Please try again.`);
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
          alert(`${(error as Error).message}. Please try again.`);
        }

      }
    }
  };

  return {
    taskLists,
    selectedTaskListId,
    newTaskListName,
    showDeleteTaskListModal,
    taskListToDelete,
    setNewTaskListName,
    handleCreateTaskList,
    handleDeleteTaskList,
    setSelectedTaskListId,
    confirmDeleteTaskList,
    setShowDeleteTaskListModal,
  };
};
