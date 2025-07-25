export interface Task {
  id: number;
  title: string;
  description?: string;
  dueDate: Date;
  completed: boolean;
  listId: number;
  ownerId: number;
  createdAt: Date;
  updatedAt: Date;
}
