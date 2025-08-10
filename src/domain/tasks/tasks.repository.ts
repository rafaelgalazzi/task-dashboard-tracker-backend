import { Inject, Injectable } from '@nestjs/common';
import { DatabaseError } from 'src/common/erros/database.error';
import { DrizzleType } from 'src/adapters/database.module';
import { DRIZZLE } from 'src/adapters/database.module';
import { NewTask, Task, tasks } from 'src/adapters/schema';

@Injectable()
export class TasksRepository {
  constructor(
    @Inject(DRIZZLE)
    private readonly db: DrizzleType,
  ) {}

  async create(taskData: NewTask): Promise<Task> {
    try {
      const newTask = await this.db
        .insert(tasks)
        .values({
          title: taskData.title,
          description: taskData.description,
          userId: taskData.userId,
        })
        .returning();
      return newTask[0];
    } catch (error) {
      console.error('Error creating task:', error);
      throw new DatabaseError('Failed to create task');
    }
  }
}
