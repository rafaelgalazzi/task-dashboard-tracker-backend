import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { JwtPayload } from 'src/common/types/auth.types';
import { User } from 'src/common/decoratos/user.decorator';
import { Task } from 'src/adapters/schema';
import { Type } from 'class-transformer';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsInt()
  projectId: number;
}

export class ListTasksDto {
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  page?: number;

  @Type(() => Number)
  @IsOptional()
  @IsInt()
  perPage?: number;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
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
        page: params.page || 1,
        perPage: params.perPage || 10,
        search: params.search,
        orderBy: params.orderBy,
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
