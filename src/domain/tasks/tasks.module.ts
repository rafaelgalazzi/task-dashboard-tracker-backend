import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { DatabaseModule } from 'src/adapters/database.module';
import { TasksRepository } from './tasks.repository';
import { UsersRepository } from '../users/users.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [TasksController],
  providers: [TasksService, UsersRepository, TasksRepository],
  exports: [TasksRepository],
})
export class TaskModule {}
