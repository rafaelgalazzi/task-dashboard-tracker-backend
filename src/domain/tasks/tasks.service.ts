import { Injectable, NotFoundException } from '@nestjs/common';
import { TasksRepository } from './tasks.repository';
import { Task, TaskStep } from 'src/adapters/schema';

interface ListUserTasks {
  userId: number;
  page?: number;
  perPage?: number;
  search?: string;
  orderBy?: keyof Task;
}

@Injectable()
export class TasksService {
  constructor(private readonly tasksRepository: TasksRepository) {}

  async createTask(form: { title: string; description: string; userId: number }) {
    return await this.tasksRepository.create(form);
  }

  async createTaskSteps({ taskId, steps }: { taskId: number; steps: { title: string; description: string }[] }) {
    const tasks = await this.tasksRepository.getTaskById(taskId);

    if (!tasks) throw new NotFoundException('Task not found');

    const stepsToCreate = steps.map((step) => ({
      title: step.title,
      description: step.description,
      taskId: taskId,
    }));

    return await this.tasksRepository.createSteps(stepsToCreate);
  }

  async listUserTasks(form: ListUserTasks): Promise<(Task & { steps: TaskStep[] })[]> {
    const { userId, page = 1, perPage = 10, search, orderBy } = form;

    const listedTasks = await this.tasksRepository.listUserTasks({
      userId,
      page,
      perPage,
      search,
      orderBy,
    });

    return listedTasks;
  }
}
