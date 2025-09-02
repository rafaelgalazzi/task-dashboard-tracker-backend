import { Inject, Injectable } from '@nestjs/common';
import { DatabaseError } from 'src/common/erros/database.error';
import { DrizzleType } from 'src/adapters/database.module';
import { DRIZZLE } from 'src/adapters/database.module';
import { NewProject, Project, projects } from 'src/adapters/schema';
import { and, eq, ilike, isNull, or } from 'drizzle-orm';

interface ListUserProjects {
  userId: number;
  page?: number;
  perPage?: number;
  search?: string;
  orderBy?: keyof Project;
}

@Injectable()
export class ProjectsRepository {
  constructor(
    @Inject(DRIZZLE)
    private readonly db: DrizzleType,
  ) {}

  async create(projectData: NewProject): Promise<Project> {
    try {
      const newProject = await this.db
        .insert(projects)
        .values({
          title: projectData.title,
          description: projectData.description,
          userId: projectData.userId,
        })
        .returning();
      return newProject[0];
    } catch (error) {
      console.error('Error creating task:', error);
      throw new DatabaseError('Failed to create task');
    }
  }

  async getProjectById(projectId: number): Promise<Project | null> {
    try {
      const findTask = await this.db
        .select()
        .from(projects)
        .where(and(eq(projects.id, projectId), isNull(projects.deletedAt)))
        .limit(1);
      return findTask[0] || null;
    } catch (error) {
      console.error('Error fetching task by ID:', error);
      throw new DatabaseError('Failed to fetch task');
    }
  }

  async listUserProjects(form: ListUserProjects): Promise<Project[]> {
    const { userId, page = 1, perPage = 10, search, orderBy } = form;

    try {
      const listedProjects = await this.db.query.tasks.findMany({
        with: {
          steps: {
            where: and(isNull(projects.deletedAt)),
          },
        },
        where: and(
          eq(projects.userId, userId),
          isNull(projects.deletedAt),
          search
            ? or(ilike(projects.title, `%${search || ''}%`), ilike(projects.description, `%${search || ''}%`))
            : undefined,
        ),
        limit: form.perPage,
        offset: (page - 1) * perPage,
        orderBy: (t, { asc, desc }) =>
          orderBy
            ? [asc(t[orderBy])] // ✅ safe dynamic asc
            : [desc(t.createdAt)], // default sort
      });

      return listedProjects;
    } catch (error) {
      console.error('Error listing user projects:', error);
      throw new DatabaseError('Failed to list user projects');
    }
  }
}
