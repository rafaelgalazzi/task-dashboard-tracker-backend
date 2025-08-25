import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { CreateTaskDto, ListTasksDto } from './tasks.controller';
import { Task, TaskStep, StepStatus } from 'src/adapters/schema';

describe('TasksController', () => {
  let tasksController: TasksController;

  const mockUser = {
    sub: '1',
    email: 'test@example.com',
  };

  const mockTask: Task & { steps: TaskStep[] } = {
    id: 1,
    title: 'Test Task',
    description: 'Test Description',
    userId: 1,
    projectId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    steps: [
      {
        id: 1,
        title: 'Test Step',
        description: 'Test Step Description',
        taskId: 1,
        status: StepStatus.PENDING,
        startDateTime: null,
        endDateTime: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
    ],
  };

  const mockTasksService = {
    createTask: jest.fn(),
    createTaskSteps: jest.fn(),
    listUserTasks: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: mockTasksService,
        },
      ],
    }).compile();

    tasksController = module.get<TasksController>(TasksController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createTask', () => {
    it('should create a task successfully', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
        projectId: 1,
      };

      const createdTask = {
        id: 1,
        title: 'Test Task',
        description: 'Test Description',
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      mockTasksService.createTask.mockResolvedValue(createdTask);

      const result = await tasksController.createTask(createTaskDto, mockUser);

      expect(result).toEqual({
        statusCode: 201,
        message: 'Task created successfully with ID: 1',
      });
      expect(mockTasksService.createTask).toHaveBeenCalledWith({
        ...createTaskDto,
        userId: 1,
      });
    });
  });

  describe('createTaskSteps', () => {
    it('should create task steps successfully', async () => {
      const stepsData = {
        taskId: 1,
        steps: [
          {
            title: 'Step 1',
            description: 'Description 1',
          },
        ],
      };

      const createdSteps = [
        {
          id: 1,
          title: 'Step 1',
          description: 'Description 1',
          taskId: 1,
          status: StepStatus.PENDING,
          startDateTime: null,
          endDateTime: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
      ];

      mockTasksService.createTaskSteps.mockResolvedValue(createdSteps);

      const result = await tasksController.createTaskSteps(stepsData);

      expect(result).toEqual({
        statusCode: 201,
        message: 'Task steps created successfully',
        data: createdSteps,
      });
      expect(mockTasksService.createTaskSteps).toHaveBeenCalledWith(stepsData);
    });
  });

  describe('getTasks', () => {
    it('should list user tasks successfully', async () => {
      const listTasksDto: ListTasksDto = {
        page: 1,
        perPage: 10,
      };

      mockTasksService.listUserTasks.mockResolvedValue([mockTask]);

      const result = await tasksController.getTasks(mockUser, listTasksDto);

      expect(result).toEqual({
        statusCode: 200,
        message: 'Tasks fetched successfully',
        data: [mockTask],
      });
      expect(mockTasksService.listUserTasks).toHaveBeenCalledWith({
        userId: 1,
        page: 1,
        perPage: 10,
      });
    });
  });
});
