import React from 'react';
import { Button } from 'react-bootstrap';
import { type Task, type TaskList } from 'todolist-model';
import NewTaskForm from './NewTaskForm';
import ActiveTasksList from './ActiveTasksList';
import CompletedTasksList from './CompletedTasksList';
import ConfirmationModal from './ConfirmationModal';

interface MainContentProps {
  tasks: Task[];
  selectedTaskListId: number | null;
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
  taskLists: TaskList[];
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
          <NewTaskForm
            newTaskTitle={newTaskTitle}
            setNewTaskTitle={setNewTaskTitle}
            newTaskDescription={newTaskDescription}
            setNewTaskDescription={setNewTaskDescription}
            newTaskDueDate={newTaskDueDate}
            setNewTaskDueDate={setNewTaskDueDate}
            handleCreateTask={handleCreateTask}
          />

          <h6>Active Tasks</h6>
          <ActiveTasksList
            tasks={activeTasks}
            onTaskClick={setSelectedTask}
            onToggleComplete={handleToggleTaskComplete}
          />

          <Button variant="info" onClick={() => setShowCompletedTasks(!showCompletedTasks)} className="mb-3">
            {showCompletedTasks ? 'Hide' : 'Show'} Completed Tasks
          </Button>

          {showCompletedTasks && (
            <CompletedTasksList
              tasks={completedTasks}
              onTaskClick={setSelectedTask}
              onToggleComplete={handleToggleTaskComplete}
            />
          )}
        </>
      ) : (
        <h2 className='text-white'>No task yet. Select a task list or create a new one.</h2>
      )}

      <ConfirmationModal
        show={showDeleteTaskModal}
        onHide={() => setShowDeleteTaskModal(false)}
        onConfirm={confirmDeleteTask}
        title="Confirm Deletion"
        body={`Are you sure you want to delete the task "${taskToDelete?.title}"?`}
        confirmButtonText="🗑️ Delete Task"
      />
    </>
  );
};

export default MainContent;
