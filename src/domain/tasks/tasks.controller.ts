import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { IsString } from 'class-validator';
import { JwtPayload } from 'src/common/types/auth.types';
import { User } from 'src/common/decoratos/user.decorator';
import { Task } from 'src/adapters/schema';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsString()
  description: string;
}

export class ListTasksDto {
  page: number;
  perPage: number;
  search?: string;
  orderBy?: keyof Task;
}

@Controller('/task')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  async createTask(@Body() body: CreateTaskDto, @User() user: JwtPayload) {
    try {
      const task = await this.tasksService.createTask({
        ...body,
        userId: Number(user.sub),
      });
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Task created successfully with ID: ' + task.id,
      };
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }

  @Post('/steps/create')
  @HttpCode(HttpStatus.CREATED)
  async createTaskSteps(
    @Body()
    body: {
      taskId: number;
      steps: { title: string; description: string }[];
    },
  ) {
    try {
      const steps = await this.tasksService.createTaskSteps(body);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Task steps created successfully',
        data: steps,
      };
    } catch (error) {
      console.error('Error creating task steps:', error);
      throw error;
    }
  }

  @Get('/list')
  @HttpCode(HttpStatus.OK)
  async getTasks(@User() user: JwtPayload, @Param() params: ListTasksDto) {
    try {
      const tasks = await this.tasksService.listUserTasks({
        ...params,
        userId: Number(user.sub),
      });
      return {
        statusCode: HttpStatus.OK,
        message: 'Tasks fetched successfully',
        data: tasks,
      };
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  }
}
