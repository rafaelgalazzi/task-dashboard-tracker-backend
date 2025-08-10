import { Injectable } from '@nestjs/common';
import { TasksRepository } from './tasks.repository';

@Injectable()
export class TasksService {
  constructor(private readonly tasksRepository: TasksRepository) {}

  getHello(): string {
    return 'Hello World!';
  }

  async createTask(form: { title: string; description: string }) {
    return await this.tasksRepository.create(form);
  }
}
