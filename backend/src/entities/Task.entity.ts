import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Task as ITask } from 'todolist-model';
import { TaskList } from './TaskList.entity';

@Entity()
export class Task implements ITask {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string | null;

  @Column()
  dueDate: Date;

  @Column()
  completed: boolean;

  @Column()
  listId: number;

  @ManyToOne(() => TaskList, taskList => taskList.tasks)
  @JoinColumn({ name: 'listId' })
  taskList: TaskList;

  @Column()
  ownerId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
