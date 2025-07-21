import React from 'react';
import { Button, Form, ListGroup, InputGroup, Modal } from 'react-bootstrap';
import { type TaskList } from 'todolist-model';

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
    </>
  );
};

export default TaskListSidebar;
