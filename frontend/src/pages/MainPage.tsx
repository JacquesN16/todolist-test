import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useTaskLists } from '../hooks/useTaskLists';
import { useTasks } from '../hooks/useTasks';
import TaskListSidebar from '../components/TaskListSidebar';
import MainContent from '../components/MainContent';
import TaskDetailsSidebar from '../components/TaskDetailsSidebar';

const MainPage: React.FC = () => {
  const { logout } = useAuth();
  const {
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
  } = useTaskLists();

  const {
    tasks,
    selectedTask,
    newTaskTitle,
    newTaskDescription,
    newTaskDueDate,
    showDeleteTaskModal: showDeleteTaskModalForTask,
    taskToDelete: taskToDeleteForTask,
    showCompletedTasks,
    setNewTaskTitle,
    setNewTaskDescription,
    setNewTaskDueDate,
    handleCreateTask,
    handleToggleTaskComplete,
    setSelectedTask,
    setShowCompletedTasks,
    handleDeleteTask,
    confirmDeleteTask: confirmDeleteTaskForTask,
    setShowDeleteTaskModal: setShowDeleteTaskModalForTask,
  } = useTasks(selectedTaskListId);


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
            handleLogout={logout}
          />
        </Col>

        {/* Main Content */}
        <Col md={selectedTask ? 6 : 9} className="p-3">
          <MainContent
            tasks={tasks}
            selectedTaskListId={selectedTaskListId}
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
            showDeleteTaskModal={showDeleteTaskModalForTask}
            taskToDelete={taskToDeleteForTask}
            confirmDeleteTask={confirmDeleteTaskForTask}
            setShowDeleteTaskModal={setShowDeleteTaskModalForTask}
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
