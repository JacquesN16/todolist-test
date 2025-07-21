import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskList } from '../entities/TaskList.entity';
import { TaskListService } from './task-list.service';
import { TaskListController } from './task-list.controller';
import { AuthModule } from '../auth/auth.module';
import { TaskModule } from '../task/task.module';

@Module({
  imports: [TypeOrmModule.forFeature([TaskList]), AuthModule, TaskModule],
  providers: [TaskListService],
  controllers: [TaskListController],
  exports: [TaskListService],
})
export class TaskListModule {}