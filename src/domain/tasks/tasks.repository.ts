import { Inject, Injectable } from '@nestjs/common';
import { DatabaseError } from 'src/common/erros/database.error';
import { DrizzleType } from 'src/adapters/database.module';
import { DRIZZLE } from 'src/adapters/database.module';
import { NewTask, NewTaskStep, Task, tasks, TaskStep, taskSteps } from 'src/adapters/schema';
import { and, eq, ilike, isNull, or } from 'drizzle-orm';

interface ListUserTasks {
  userId: number;
  page?: number;
  perPage?: number;
  search?: string;
  orderBy?: keyof Task;
}

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
          projectId: taskData.projectId,
        })
        .returning();
      return newTask[0];
    } catch (error) {
      console.error('Error creating task:', error);
      throw new DatabaseError('Failed to create task');
    }
  }

  async getTaskById(taskId: number): Promise<Task | null> {
    try {
      const findTask = await this.db
        .select()
        .from(tasks)
        .where(and(eq(tasks.id, taskId), isNull(tasks.deletedAt)))
        .limit(1);
      return findTask[0] || null;
    } catch (error) {
      console.error('Error fetching task by ID:', error);
      throw new DatabaseError('Failed to fetch task');
    }
  }

  async createSteps(stepsToCreate: NewTaskStep[]): Promise<TaskStep[]> {
    try {
      const createSteps = await this.db.insert(taskSteps).values(stepsToCreate).returning();
      return createSteps;
    } catch (error) {
      console.error('Error creating task steps:', error);
      throw new DatabaseError('Failed to create task steps');
    }
  }

  async listUserTasks(form: ListUserTasks): Promise<(Task & { steps: TaskStep[] })[]> {
    const { userId, page = 1, perPage = 10, search, orderBy } = form;

    try {
      const listedTasks = await this.db.query.tasks.findMany({
        with: {
          steps: {
            where: and(isNull(taskSteps.deletedAt)),
          },
        },
        where: and(
          eq(tasks.userId, userId),
          isNull(tasks.deletedAt),
          search
            ? or(ilike(tasks.title, `%${search || ''}%`), ilike(tasks.description, `%${search || ''}%`))
            : undefined,
        ),
        limit: form.perPage,
        offset: (page - 1) * perPage,
        orderBy: (t, { asc, desc }) =>
          orderBy
            ? [asc(t[orderBy])] // ✅ safe dynamic asc
            : [desc(t.createdAt)], // default sort
      });

      return listedTasks;
    } catch (error) {
      console.error('Error listing user tasks:', error);
      throw new DatabaseError('Failed to list user tasks');
    }
  }
}
