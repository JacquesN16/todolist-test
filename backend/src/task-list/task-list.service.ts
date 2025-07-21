import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskList } from '../entities/TaskList.entity';
import { CreateTaskListDto } from '../dto';

@Injectable()
export class TaskListService {
  constructor(
    @InjectRepository(TaskList)
    private taskListRepository: Repository<TaskList>,
  ) {}

  async create(createTaskListDto: CreateTaskListDto, ownerId: number): Promise<TaskList> {
    const existingTaskList = await this.taskListRepository.findOne({ where: { name: createTaskListDto.name, ownerId } });
    if (existingTaskList) {
      throw new BadRequestException('Task list with this name already exists.');
    }
    const taskList = this.taskListRepository.create({ ...createTaskListDto, ownerId });
    return this.taskListRepository.save(taskList);
  }

  async findAll(ownerId: number): Promise<TaskList[]> {
    return this.taskListRepository.find({ where: { ownerId } });
  }

  async remove(id: number, ownerId: number): Promise<void> {
    await this.taskListRepository.delete({ id, ownerId });
  }
}