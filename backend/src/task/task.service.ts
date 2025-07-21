import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../entities/Task.entity';
import { CreateTaskDto, UpdateTaskDto } from '../dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto, ownerId: number): Promise<Task> {
    const task = this.taskRepository.create({ ...createTaskDto, ownerId, completed: false });
    return this.taskRepository.save(task);
  }

  async findAllByList(listId: number, ownerId: number): Promise<Task[]> {
    return this.taskRepository.find({ where: { listId, ownerId } });
  }

  async findOne(id: number, ownerId: number): Promise<Task | undefined> {
    return this.taskRepository.findOne({ where: { id, ownerId } });
  }

  async update(id: number, updateTaskDto: UpdateTaskDto, ownerId: number): Promise<Task | undefined> {
    await this.taskRepository.update({ id, ownerId }, updateTaskDto);
    return this.findOne(id, ownerId);
  }

  async remove(id: number, ownerId: number): Promise<void> {
    await this.taskRepository.delete({ id, ownerId });
  }
}