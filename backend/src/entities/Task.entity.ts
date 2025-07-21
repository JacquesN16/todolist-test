import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Task as ITask } from 'todolist-model';

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

  @Column()
  ownerId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
