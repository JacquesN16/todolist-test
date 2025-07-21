import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { TaskList as ITaskList } from 'todolist-model';
import { Task } from './Task.entity';

@Entity()
export class TaskList implements ITaskList {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  ownerId: number;

  @OneToMany(() => Task, task => task.taskList, { cascade: true })
  tasks: Task[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
