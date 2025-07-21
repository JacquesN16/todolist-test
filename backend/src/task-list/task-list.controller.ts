import { Controller, Post, Body, Get, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { TaskListService } from './task-list.service';
import { CreateTaskListDto } from '../dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('task-lists')
export class TaskListController {
  constructor(private readonly taskListService: TaskListService) {}

  @Post()
  create(@Body() createTaskListDto: CreateTaskListDto, @Req() req) {
    return this.taskListService.create(createTaskListDto, req.user.userId);
  }

  @Get()
  findAll(@Req() req) {
    return this.taskListService.findAll(req.user.userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.taskListService.remove(+id, req.user.userId);
  }
}