import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/User.entity';
import { Task } from './entities/Task.entity';
import { TaskList } from './entities/TaskList.entity';
import { TaskListModule } from './task-list/task-list.module';
import { TaskModule } from './task/task.module';

@Module({
  imports: [
    AuthModule,
    TaskListModule,
    TaskModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [User, Task, TaskList],
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
