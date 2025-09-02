import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { CreateProjectDto, ListProjectsDto } from './projects.controller';
import { Project } from 'src/adapters/schema';

describe('TasksController', () => {
  let projectsController: ProjectsController;

  const mockUser = {
    sub: '1',
    email: 'test@example.com',
  };

  const mockProject: Project = {
    id: 1,
    title: 'Test Project',
    description: 'Test Description',
    userId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  const mockProjectsService = {
    createProject: jest.fn(),
    listProjects: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectsController],
      providers: [
        {
          provide: ProjectsService,
          useValue: mockProjectsService,
        },
      ],
    }).compile();

    projectsController = module.get<ProjectsController>(ProjectsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createProject', () => {
    it('should create a project successfully', async () => {
      const createProjectDto: CreateProjectDto = {
        title: 'Test Project',
        description: 'Test Description',
      };

      const createdProject = {
        id: 1,
        title: 'Test Project',
        description: 'Project Description',
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      mockProjectsService.createProject.mockResolvedValue(createdProject);

      const result = await projectsController.createProject(createProjectDto, mockUser);

      expect(result).toEqual({
        statusCode: 201,
        message: 'Task created successfully with ID: 1',
      });
      expect(mockProjectsService.createProject).toHaveBeenCalledWith({
        ...createProjectDto,
        userId: 1,
      });
    });
  });

  describe('getProjects', () => {
    it('should list user tasks successfully', async () => {
      const listTasksDto: ListProjectsDto = {
        page: 1,
        perPage: 10,
      };

      mockProjectsService.listProjects.mockResolvedValue([mockProject]);

      const result = await projectsController.getProjects(mockUser, listTasksDto);

      expect(result).toEqual({
        statusCode: 200,
        message: 'Tasks fetched successfully',
        data: [mockProject],
      });
      expect(mockProjectsService.listProjects).toHaveBeenCalledWith({
        userId: 1,
        page: 1,
        perPage: 10,
      });
    });
  });
});
