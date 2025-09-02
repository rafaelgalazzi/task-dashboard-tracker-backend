import { Injectable } from '@nestjs/common';
import { Project } from 'src/adapters/schema';
import { ProjectsRepository } from './projects.repository';

interface ListUserProjects {
  userId: number;
  page?: number;
  perPage?: number;
  search?: string;
  orderBy?: keyof Project;
}

@Injectable()
export class ProjectsService {
  constructor(private readonly projectsRepository: ProjectsRepository) {}

  async createProject(form: { userId: number; tilte: string; description: string }) {
    return await this.projectsRepository.create({
      title: form.tilte,
      description: form.description,
      userId: form.userId,
    });
  }

  async listProjects(form: ListUserProjects) {
    const { userId, page = 1, perPage = 10, search, orderBy } = form;

    const listedProjects = await this.projectsRepository.listUserProjects({
      userId,
      page,
      perPage,
      search,
      orderBy,
    });

    return listedProjects;
  }
}
