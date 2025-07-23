import React from 'react';
import { Button, Form, ListGroup, InputGroup } from 'react-bootstrap';
import { type TaskList } from 'todolist-model';
import ConfirmationModal from './ConfirmationModal';

interface TaskListSidebarProps {
  taskLists: TaskList[];
  selectedTaskListId: number | null;
  newTaskListName: string;
  setNewTaskListName: (name: string) => void;
  handleCreateTaskList: () => Promise<void>;
  handleDeleteTaskList: (list: TaskList) => void;
  setSelectedTaskListId: (id: number | null) => void;
  showDeleteTaskListModal: boolean;
  taskListToDelete: TaskList | null;
  confirmDeleteTaskList: () => Promise<void>;
  setShowDeleteTaskListModal: (show: boolean) => void;
  handleLogout: () => void;
}

const TaskListSidebar: React.FC<TaskListSidebarProps> = ({
  taskLists,
  selectedTaskListId,
  newTaskListName,
  setNewTaskListName,
  handleCreateTaskList,
  handleDeleteTaskList,
  setSelectedTaskListId,
  showDeleteTaskListModal,
  taskListToDelete,
  confirmDeleteTaskList,
  setShowDeleteTaskListModal,
  handleLogout,
}) => {
  return (
    <>
      <div className="d-flex flex-column h-100">
        <h5 className="text-white">Task Lists</h5>
        <InputGroup className="mb-3">
          <Form.Control
            placeholder="New list name"
            value={newTaskListName}
            onChange={(e) => setNewTaskListName(e.target.value)}
          />
          <Button variant="outline-secondary" onClick={handleCreateTaskList}>
            ➕
          </Button>
        </InputGroup>
        <ListGroup className="flex-grow-1 overflow-auto mb-3">
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
        <Button variant="danger" className="w-100 mt-auto" onClick={handleLogout}>
          Disconnect
        </Button>
      </div>

      <ConfirmationModal
        show={showDeleteTaskListModal}
        onHide={() => setShowDeleteTaskListModal(false)}
        onConfirm={confirmDeleteTaskList}
        title="Confirm Deletion"
        body={`Are you sure you want to delete the task list "${taskListToDelete?.name}"? All associated tasks will also be deleted.`}
        confirmButtonText="Delete List"
      />
    </>
  );
};

export default TaskListSidebar;
